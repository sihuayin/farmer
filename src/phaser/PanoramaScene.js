import { Scene } from 'phaser'
import { GRID_SIZE, TILE_WIDTH, TILE_HEIGHT, gridToScreen, CROP_CONFIG, LIVESTOCK_CONFIG } from '../hooks/useFarm'

export default class PanoramaScene extends Scene {
  constructor() {
    super('PanoramaScene')
    this.plots = []
    this.pens = []
    this.sections = []
    this.graphics = null
    this.originX = 0
    this.originY = 80
    this.zoomLevel = 1
    this.selectedCell = null
    this._emojiCache = {}
    this._ready = false
  }

  create() {
    this.graphics = this.add.graphics()
    this._emojiCache = {}
    this._ready = true
    this._setupInput()
    this._doRender()
  }

  createCameraScroll(centerX, centerY) {
    // Center the full 12×12 iso grid's bounding box in the canvas.
    // grid spans worldX from -TILE_WIDTH*GRID/2 to +TILE_WIDTH*GRID/2, centered at 0
    // grid spans worldY from originY to originY + GRID_SIZE*TILE_HEIGHT, i.e. 80 to 272
    const scrollX = Math.round(centerX)
    const scrollY = Math.round(centerY - (this.originY + GRID_SIZE * TILE_HEIGHT / 2))
    if (this.cameras?.main) {
      this.cameras.main.scrollX = scrollX
      this.cameras.main.scrollY = scrollY
    } else {
      this.time.delayedCall(0, () => {
        if (this.cameras?.main) {
          this.cameras.main.scrollX = scrollX
          this.cameras.main.scrollY = scrollY
        }
      })
    }
  }

  initWithData(plots, pens, sections) {
    this.plots = plots || []
    this.pens = pens || []
    this.sections = sections || []
    this._doRender()
  }

  updatePlots(plots) {
    this.plots = plots
    this._doRender()
  }

  updatePens(pens) {
    this.pens = pens
    this._doRender()
  }

  updateSections(sections) {
    this.sections = sections
    this._doRender()
  }

  zoomIn() {
    this.zoomLevel = Math.min(2.5, this.zoomLevel + 0.25)
    if (this.cameras?.main) this.cameras.main.setZoom(this.zoomLevel)
  }

  zoomOut() {
    this.zoomLevel = Math.max(0.5, this.zoomLevel - 0.25)
    if (this.cameras?.main) this.cameras.main.setZoom(this.zoomLevel)
  }

  resetZoom() {
    this.zoomLevel = 1
    if (this.cameras?.main) this.cameras.main.setZoom(1)
  }

  _setupInput() {
    this.input.on('pointerdown', (pointer) => {
      const cam = this.cameras.main
      // Correct world coordinate: subtract camera scroll and divide by zoom.
      // This inverts the camera transform: screen → world.
      const worldX = (pointer.x - cam.scrollX) / cam.zoomX
      const worldY = (pointer.y - cam.scrollY) / cam.zoomY
      this._handleClick(worldX, worldY)
    })
    this.input.on('wheel', (pointer, gameObjects, dx, dy) => {
      if (dy < 0) this.zoomIn()
      else if (dy > 0) this.zoomOut()
    })
  }

  _handleClick(wx, wy) {
    const cam = this.cameras.main
    // wx, wy are world coordinates (canvas pixel minus camera scroll offset)
    const worldX = wx
    const worldY = wy

    const allItems = [
      ...this.plots.map((p) => ({ ...p, itemType: 'plot' })),
      ...this.pens.map((p) => ({ ...p, itemType: 'pen' })),
    ]

    let closest = null
    let minDist = Infinity

    for (const item of allItems) {
      const sx = this.originX + (item.gridX - item.gridY) * TILE_WIDTH / 2
      const sy = this.originY + (item.gridX + item.gridY) * TILE_HEIGHT / 2
      const dist = Math.hypot(worldX - sx, worldY - sy)
      if (dist < TILE_WIDTH * 0.8 && dist < minDist) {
        minDist = dist
        closest = item
      }
    }

    this.selectedCell = closest
    this._doRender()

    if (closest) {
      this.events.emit('panorama:cell:click', {
        itemId: closest.id,
        itemType: closest.itemType,
        item: closest,
      })
    }
  }

  _doRender() {
    if (!this.graphics) return
    const g = this.graphics
    g.clear()

    // Draw grid
    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const sx = this.originX + (gx - gy) * TILE_WIDTH / 2
        const sy = this.originY + (gx + gy) * TILE_HEIGHT / 2
        g.lineStyle(1, 0xc4b8ad, 0.6)
        g.beginPath()
        g.moveTo(sx, sy - TILE_HEIGHT / 2)
        g.lineTo(sx + TILE_WIDTH / 2, sy)
        g.lineTo(sx, sy + TILE_HEIGHT / 2)
        g.lineTo(sx - TILE_WIDTH / 2, sy)
        g.closePath()
        g.strokePath()
      }
    }

    // Draw sections
    if (this.sections?.length > 0) {
      this.sections.forEach((section) => {
        const [rx, ry, rw, rh] = section.rect
        const sectionColor = parseInt(section.color.replace('#', ''), 16)
        const r = (sectionColor >> 16) & 0xff
        const grn = (sectionColor >> 8) & 0xff
        const b = sectionColor & 0xff
        g.fillStyle(r, grn, b, 0.12)
        g.lineStyle(2, r, grn, b, 0.5)
        const corners = [
          gridToScreen(rx, ry, this.originX, this.originY),
          gridToScreen(rx + rw, ry, this.originX, this.originY),
          gridToScreen(rx + rw, ry + rh, this.originX, this.originY),
          gridToScreen(rx, ry + rh, this.originX, this.originY),
        ]
        g.beginPath()
        g.moveTo(corners[0].x, corners[0].y)
        for (let i = 1; i < corners.length; i++) g.lineTo(corners[i].x, corners[i].y)
        g.closePath()
        g.fillPath()
        g.strokePath()
      })
    }

    // Draw plots
    ;(this.plots || []).forEach((plot) => this._renderPlot(g, plot))
    ;(this.pens || []).forEach((pen) => this._renderPen(g, pen))
  }

  _renderPlot(g, plot) {
    const { gridX: x, gridY: y } = plot
    const sx = this.originX + (x - y) * TILE_WIDTH / 2
    const sy = this.originY + (x + y) * TILE_HEIGHT / 2
    const isSelected = this.selectedCell?.id === plot.id && this.selectedCell?.itemType === 'plot'
    const status = plot.status || 'empty'
    const cfg = plot.cropType ? CROP_CONFIG[plot.cropType] : null

    const tileColors = {
      ready: { fill: 0x4CAF50, border: 0x2E7D32 },
      growing: { fill: 0x8BC34A, border: 0x558B2F },
      empty: { fill: 0xBCAAA4, border: 0x8D6E63 },
    }
    const colors = tileColors[status] || tileColors.empty

    g.fillStyle(colors.fill, isSelected ? 1 : 0.85)
    g.lineStyle(isSelected ? 3 : 2, colors.border, isSelected ? 1 : 0.9)
    g.beginPath()
    g.moveTo(sx, sy - TILE_HEIGHT / 2)
    g.lineTo(sx + TILE_WIDTH / 2, sy)
    g.lineTo(sx, sy + TILE_HEIGHT / 2)
    g.lineTo(sx - TILE_WIDTH / 2, sy)
    g.closePath()
    g.fillPath()
    g.strokePath()

    if (isSelected) {
      g.lineStyle(3, 0xFFEB3B, 0.8)
      g.strokePath()
    }

    if (cfg && plot.growthPercent > 0) {
      const barW = TILE_WIDTH * 0.6, barH = 4
      const barX = sx - barW / 2, barY = sy + TILE_HEIGHT / 2 - barH - 2
      g.fillStyle(0x000000, 0.3)
      g.fillRect(barX, barY, barW, barH)
      g.fillStyle(0x4CAF50, 0.9)
      g.fillRect(barX, barY, barW * (plot.growthPercent / 100), barH)
    }

    if (status === 'ready') {
      g.fillStyle(0xFFEB3B, 1)
      g.fillCircle(sx + TILE_WIDTH / 2 - 6, sy - TILE_HEIGHT / 2 + 6, 5)
    }

    if (cfg) {
      this._emojiCache[`p_${plot.id}`] = { emoji: cfg.emoji, x: sx, y: sy - 6 }
    } else {
      delete this._emojiCache[`p_${plot.id}`]
    }
  }

  _renderPen(g, pen) {
    const { gridX: x, gridY: y } = pen
    const sx = this.originX + (x - y) * TILE_WIDTH / 2
    const sy = this.originY + (x + y) * TILE_HEIGHT / 2
    const isSelected = this.selectedCell?.id === pen.id && this.selectedCell?.itemType === 'pen'
    const status = pen.status || 'empty'
    const cfg = pen.livestockType ? LIVESTOCK_CONFIG[pen.livestockType] : null

    const penColors = {
      active: { fill: 0xFFA726, border: 0xEF6C00 },
      hungry: { fill: 0xFF7043, border: 0xD84315 },
      empty: { fill: 0xA1887F, border: 0x6D4C41 },
      locked: { fill: 0x78909C, border: 0x455A64 },
    }
    const colors = penColors[status] || penColors.empty

    g.fillStyle(colors.fill, isSelected ? 1 : 0.85)
    g.lineStyle(isSelected ? 3 : 2, colors.border, isSelected ? 1 : 0.9)
    g.beginPath()
    g.moveTo(sx, sy - TILE_HEIGHT / 2)
    g.lineTo(sx + TILE_WIDTH / 2, sy)
    g.lineTo(sx, sy + TILE_HEIGHT / 2)
    g.lineTo(sx - TILE_WIDTH / 2, sy)
    g.closePath()
    g.fillPath()
    g.strokePath()

    if (isSelected) {
      g.lineStyle(3, 0xFFEB3B, 0.8)
      g.strokePath()
    }

    if (cfg) {
      const hunger = Math.min(100, pen.hungerPercent || 0)
      const barW = TILE_WIDTH * 0.6, barH = 4
      const barX = sx - barW / 2, barY = sy + TILE_HEIGHT / 2 - barH - 2
      g.fillStyle(0x000000, 0.3)
      g.fillRect(barX, barY, barW, barH)
      const healthPct = Math.max(0, 100 - hunger)
      const healthColor = healthPct < 30 ? 0xF44336 : healthPct < 60 ? 0xFF9800 : 0x4CAF50
      g.fillStyle(healthColor, 0.9)
      g.fillRect(barX, barY, barW * (healthPct / 100), barH)

      this._emojiCache[`n_${pen.id}`] = { emoji: cfg.emoji, x: sx, y: sy - 6 }
    } else {
      delete this._emojiCache[`n_${pen.id}`]
    }

    if (status === 'locked') {
      g.lineStyle(2, 0xffffff, 0.7)
      g.beginPath()
      g.moveTo(sx - 6, sy - 6); g.lineTo(sx + 6, sy + 6); g.strokePath()
      g.beginPath()
      g.moveTo(sx + 6, sy - 6); g.lineTo(sx - 6, sy + 6); g.strokePath()
    }
  }

  update() {
    if (!this._ready) return

    const activeIds = new Set([
      ...this.plots.map((p) => `p_${p.id}`),
      ...this.pens.map((p) => `n_${p.id}`),
    ])

    // Update / create emoji texts
    Object.entries(this._emojiCache).forEach(([key, { emoji, x, y }]) => {
      if (!this[key]) {
        try {
          this[key] = this.add.text(x, y, emoji, {
            fontSize: '18px',
            fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji"',
          }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(100)
        } catch (e) { /* skip if not ready */ }
      }
      if (this[key]) {
        this[key].setPosition(x, y).setVisible(activeIds.has(key))
      }
    })
  }
}