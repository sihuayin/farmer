import { useEffect, useRef } from 'react'
import { ZONE_MAP } from '../data/zoneTypes'

const CELL = 48
const GAP  = 3   // stone path gap between cells
const STRIDE = CELL + GAP

// tileset.png is 224×144, pixel-sampled positions:
// Green grass tiles: rows starting at y=16 (row 0 is black border)
// Brown/tan soil tiles: start at y=80
const TS = {
  grass: [48, 24, 16, 16],  // center of green grass area
  soil:  [48, 88, 16, 16],  // center of brown soil area
}

// Zone cell visual config
const ZONE_VISUAL = {
  vegetable:   { base: 'soil',  tint: null,         fence: false },
  fruit:       { base: 'grass', tint: '#1B5E2088',  fence: false },
  grain:       { base: 'soil',  tint: '#FFC10766',  fence: false },
  flower:      { base: 'grass', tint: '#F06292AA',  fence: false },
  poultry:     { base: 'grass', tint: '#FFF176AA',  fence: true  },
  livestock:   { base: 'grass', tint: '#A5D6A7AA',  fence: true  },
  aquaculture: { base: 'water', tint: null,         fence: false },
}

function drawCell(ctx, imgs, cell, x, y) {
  const W = CELL, H = CELL
  const ts = imgs.tileset

  if (!cell?.zoneType) {
    // Empty cell — draw grass tile
    if (ts) ctx.drawImage(ts, ...TS.grass, x, y, W, H)
    else { ctx.fillStyle = '#8BC34A'; ctx.fillRect(x, y, W, H) }
    ctx.strokeStyle = 'rgba(0,80,0,0.12)'
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, W, H)
    return
  }

  const cfg = ZONE_VISUAL[cell.zoneType]
  const zone = ZONE_MAP[cell.zoneType]
  if (!cfg || !zone) return

  // ── Base layer ──
  if (cfg.base === 'water') {
    const g = ctx.createLinearGradient(x, y, x, y + H)
    g.addColorStop(0, '#1E88E5')
    g.addColorStop(0.6, '#1565C0')
    g.addColorStop(1, '#0D47A1')
    ctx.fillStyle = g
    ctx.fillRect(x, y, W, H)
    // Wave lines
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'
    ctx.lineWidth = 1.5
    for (let wy = y + 7; wy < y + H - 4; wy += 11) {
      ctx.beginPath()
      ctx.moveTo(x + 4, wy)
      for (let wx = x + 4; wx < x + W - 4; wx += 8) {
        ctx.quadraticCurveTo(wx + 4, wy - 3, wx + 8, wy)
      }
      ctx.stroke()
    }
  } else if (cfg.base === 'soil') {
    if (ts) ctx.drawImage(ts, ...TS.soil, x, y, W, H)
    else { ctx.fillStyle = '#5D4037'; ctx.fillRect(x, y, W, H) }
    // Soil furrow lines
    ctx.strokeStyle = 'rgba(0,0,0,0.18)'
    ctx.lineWidth = 1
    for (let fy = y + 7; fy < y + H - 2; fy += 9) {
      ctx.beginPath(); ctx.moveTo(x + 2, fy); ctx.lineTo(x + W - 2, fy); ctx.stroke()
    }
  } else {
    // grass
    if (ts) ctx.drawImage(ts, ...TS.grass, x, y, W, H)
    else { ctx.fillStyle = '#8BC34A'; ctx.fillRect(x, y, W, H) }
  }

  // Tint overlay
  if (cfg.tint) { ctx.fillStyle = cfg.tint; ctx.fillRect(x, y, W, H) }

  // ── Fence border for animal zones ──
  if (cfg.fence) {
    // Outer rail
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.strokeRect(x + 2, y + 2, W - 4, H - 4)
    // Top & bottom pickets
    ctx.fillStyle = '#8D6E63'
    for (let px = x + 7; px < x + W - 4; px += 9) {
      ctx.fillRect(px, y + 2, 4, 9)
      ctx.fillRect(px, y + H - 11, 4, 9)
    }
    // Left & right pickets
    for (let py = y + 7; py < y + H - 4; py += 9) {
      ctx.fillRect(x + 2, py, 9, 4)
      ctx.fillRect(x + W - 11, py, 9, 4)
    }
  }

  // ── Emoji ──
  const eSize = Math.floor(W * 0.40)
  ctx.font = `${eSize}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.fillText(zone.emoji, x + W / 2 + 1, y + H * 0.41 + 1)
  ctx.fillText(zone.emoji, x + W / 2, y + H * 0.41)

  // ── Variety label ──
  const label = (cell.variety || zone.name).slice(0, 3)
  const lh = Math.floor(H * 0.27)
  ctx.fillStyle = 'rgba(0,0,0,0.58)'
  ctx.fillRect(x, y + H - lh, W, lh)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold ${Math.floor(H * 0.18)}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, x + W / 2, y + H - lh / 2)
}

export default function FarmCanvas({ farm }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !farm) return

    canvas.width  = 10 * STRIDE - GAP
    canvas.height = 10 * STRIDE - GAP

    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    // Stone path background fills the gaps
    ctx.fillStyle = '#6D7F88'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let pending = 1
    const imgs = {}

    const render = () => {
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          drawCell(ctx, imgs, farm.cells[r * 10 + c], c * STRIDE, r * STRIDE)
        }
      }
    }

    const base = import.meta.env.BASE_URL
    const ts = new Image()
    ts.onload  = () => { imgs.tileset = ts; if (--pending === 0) render() }
    ts.onerror = ()  => { if (--pending === 0) render() }
    ts.src = `${base}farming/tileset/tileset.png`
  }, [farm])

  return (
    <canvas
      ref={ref}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    />
  )
}
