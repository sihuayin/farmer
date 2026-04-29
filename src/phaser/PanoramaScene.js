import { Scene } from 'phaser'
import { MAP_SIZE, SECTION_SIZE, CROP_CONFIG, LIVESTOCK_CONFIG } from '../hooks/useFarm'

export default class PanoramaScene extends Scene {
  constructor() {
    super('PanoramaScene')
    this.plots = []
    this.pens = []
    this.sections = []
    this.graphics = null
    this.zoomLevel = 1
    this.selectedItem = null
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
    let isDragging = false
    let dragStart = { x: 0, y: 0 }
    let camStart = { x: 0, y: 0 }

    // Use a DOM listener on the canvas directly so dispatched/synthetic events work.
    // Phaser's input.on() captures from document, which synthetic events don't reach.
    const canvas = this.sys.game?.canvas
    if (canvas) {
      canvas.addEventListener('pointerdown', (e) => {
        const cam = this.cameras.main
        const worldX = e.offsetX + cam.scrollX
        const worldY = e.offsetY + cam.scrollY

        const allItems = [
          ...this.plots.map((p) => ({ ...p, itemType: 'plot' })),
          ...this.pens.map((p) => ({ ...p, itemType: 'pen' })),
        ]

        let closest = null
        for (const item of allItems) {
          const inside = worldX >= item.x && worldX < item.x + item.w &&
                         worldY >= item.y && worldY < item.y + item.h
          if (inside) { closest = item; break }
        }

        if (closest) {
          this.selectedItem = closest
          this._doRender()
          this.events.emit('panorama:cell:click', { itemId: closest.id, itemType: closest.itemType, item: closest })
        }
      }, false)

      canvas.addEventListener('pointermove', (e) => {
        if (e.buttons === 1) {
          const cam = this.cameras.main
          if (!isDragging) {
            isDragging = true
            dragStart = { x: e.offsetX, y: e.offsetY }
            camStart = { x: cam.scrollX, y: cam.scrollY }
          }
          cam.scrollX = camStart.x + (dragStart.x - e.offsetX)
          cam.scrollY = camStart.y + (dragStart.y - e.offsetY)
        }
      }, false)

      canvas.addEventListener('pointerup', () => { isDragging = false }, false)
    }

    this.input.on('wheel', (pointer, gameObjects, dx, dy) => {
      if (dy < 0) this.zoomIn()
      else if (dy > 0) this.zoomOut()
    })
  }

  // Programmatic click helper (used by tests / drag-start detection)
  _worldFromCanvas(canvasX, canvasY) {
    const cam = this.cameras.main
    return { x: canvasX + cam.scrollX, y: canvasY + cam.scrollY }
  }

  // Find item at world coordinates
  _itemAtWorld(wx, wy) {
    const allItems = [
      ...this.plots.map((p) => ({ ...p, itemType: 'plot' })),
      ...this.pens.map((p) => ({ ...p, itemType: 'pen' })),
    ]
    for (const item of allItems) {
      if (wx >= item.x && wx < item.x + item.w && wy >= item.y && wy < item.y + item.h) {
        return item
      }
    }
    return null
  }

  _doRender() {
    if (!this.graphics) return
    const g = this.graphics
    g.clear()

    // Section solid fills with subtle border
    ;(this.sections || []).forEach((section) => {
      const [x, y, w, h] = section.rect
      const hex = parseInt(section.color.replace('#', ''), 16)
      const r = (hex >> 16) & 0xff
      const grn = (hex >> 8) & 0xff
      const b = hex & 0xff

      g.fillStyle(r, grn, b, 1)
      g.fillRect(x, y, w, h)

      g.lineStyle(2, r, grn, b, 0.3)
      g.strokeRect(x, y, w, h)
    })

    // Clear emoji cache entries for items no longer active
    Object.keys(this._emojiCache).forEach((k) => {
      if (!this.plots.find((p) => p.cropType && `p_${p.id}` === k) &&
          !this.pens.find((p) => p.livestockType && `n_${p.id}` === k)) {
        delete this._emojiCache[k]
      }
    })

    // Queue emoji positions for active items
    ;(this.plots || []).forEach((plot) => {
      if (plot.cropType) {
        const cfg = CROP_CONFIG[plot.cropType]
        if (cfg) {
          this._emojiCache[`p_${plot.id}`] = {
            emoji: cfg.emoji,
            x: plot.x + plot.w / 2,
            y: plot.y + plot.h / 2,
          }
        }
      }
    })

    ;(this.pens || []).forEach((pen) => {
      if (pen.livestockType) {
        const cfg = LIVESTOCK_CONFIG[pen.livestockType]
        if (cfg) {
          this._emojiCache[`n_${pen.id}`] = {
            emoji: cfg.emoji,
            x: pen.x + pen.w / 2,
            y: pen.y + pen.h / 2,
          }
        }
      }
    })
  }

  update() {
    if (!this._ready) return

    Object.entries(this._emojiCache).forEach(([key, { emoji, x, y }]) => {
      if (!this[key]) {
        try {
          this[key] = this.add.text(x, y, emoji, {
            fontSize: '26px',
            fontFamily: '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji"',
          }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(100)
        } catch (e) { /* skip if scene not ready */ }
      }
      if (this[key]) {
        this[key].setPosition(x, y)
      }
    })
  }
}
