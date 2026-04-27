import { useRef } from 'react'
import Navbar from '../components/Navbar'
import Legend from '../components/Legend'
import ExportButton from '../components/ExportButton'
import FarmCanvas from '../components/FarmCanvas'

const BASE = import.meta.env.BASE_URL
const A = {
  trees:  `${BASE}farming/outdoor%20stuff/trees%20and%20plants.png`,
  house:  `${BASE}farming/outdoor%20stuff/house%20stuff%20%2B%20chest/house.png`,
  items:  `${BASE}farming/items%20icons/items.png`,
}

function TreeStrip({ height = 54, style }) {
  return (
    <div style={{
      height,
      backgroundImage: `url('${A.trees}')`,
      backgroundRepeat: 'repeat-x',
      backgroundSize: `auto ${height}px`,
      backgroundPosition: '0 bottom',
      imageRendering: 'pixelated',
      ...style,
    }} />
  )
}

function TreeSide({ width = 50 }) {
  return (
    <div style={{
      width,
      flexShrink: 0,
      backgroundImage: `url('${A.trees}')`,
      backgroundRepeat: 'repeat-y',
      backgroundSize: `${width}px auto`,
      imageRendering: 'pixelated',
    }} />
  )
}

export default function PreviewPage({ farm, updateFarmName }) {
  const exportRef = useRef(null)
  const occupied = farm.cells.filter(c => c.zoneType).length

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#E8F5E9' }}>
      <Navbar farmName={farm.name} onFarmNameChange={updateFarmName} isEditor={false} />

      <div className="flex-1 flex flex-col items-center py-8 px-4">
        <h1 style={{ fontFamily: 'monospace', fontSize: 34, fontWeight: 'bold', color: '#1B5E20', letterSpacing: 2, marginBottom: 4 }}>
          {farm.name}
        </h1>
        {occupied > 0 && (
          <p style={{ fontSize: 13, color: '#388E3C', marginBottom: 20 }}>{occupied} / 100 个地块已规划</p>
        )}

        {/* ── Export capture area ── */}
        <div
          ref={exportRef}
          style={{
            background: 'linear-gradient(150deg, #558B2F 0%, #689F38 50%, #7CB342 100%)',
            borderRadius: 24,
            padding: 14,
            boxShadow: '0 16px 56px rgba(0,0,0,0.38), 0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {/* Farm name badge */}
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <span style={{
              fontFamily: 'monospace', fontWeight: 'bold', fontSize: 16,
              color: '#1B5E20', background: 'rgba(255,255,255,0.85)',
              padding: '5px 22px', borderRadius: 20, letterSpacing: 1,
            }}>
              🌾 {farm.name}
            </span>
          </div>

          {/* Top trees */}
          <TreeStrip height={52} style={{ marginBottom: 5 }} />

          {/* Middle: trees | stone path | canvas | trees */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 5 }}>
            <TreeSide width={48} />

            {/* Stone path + canvas */}
            <div style={{
              borderRadius: 10,
              overflow: 'hidden',
              boxShadow: 'inset 0 3px 12px rgba(0,0,0,0.5)',
              flex: 1,
              lineHeight: 0,
            }}>
              <FarmCanvas farm={farm} />
            </div>

            <TreeSide width={48} />
          </div>

          {/* Bottom: house + trees */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginTop: 5 }}>
            <img
              src={A.house}
              alt=""
              style={{ height: 86, imageRendering: 'pixelated', filter: 'drop-shadow(2px 3px 6px rgba(0,0,0,0.45))', flexShrink: 0 }}
            />
            <TreeStrip height={52} style={{ flex: 1 }} />
          </div>

          {/* Tool icons row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4, paddingRight: 4, opacity: 0.82 }}>
            <img src={A.items} alt="" style={{ height: 26, imageRendering: 'pixelated' }} />
          </div>

          {/* Legend */}
          <div style={{ marginTop: 10, padding: '0 2px' }}>
            <Legend cells={farm.cells} />
          </div>
        </div>
      </div>

      <ExportButton exportRef={exportRef} farmName={farm.name} />
    </div>
  )
}
