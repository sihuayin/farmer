import { useRef } from 'react'
import Navbar from '../components/Navbar'
import PreviewCell from '../components/PreviewCell'
import Legend from '../components/Legend'
import ExportButton from '../components/ExportButton'

// Tree border decoration
const TREE_BORDER_EMOJIS = ['🌲', '🌳', '🌲', '🌳', '🌲', '🌲', '🌳', '🌲', '🌳', '🌳', '🌲', '🌳', '🌲', '🌳']
const SIDE_TREE_EMOJIS = ['🌲', '🌳', '🌲', '🌳', '🌲', '🌳', '🌲', '🌳', '🌲', '🌳']

export default function PreviewPage({ farm, updateFarmName }) {
  const exportRef = useRef(null)
  const occupiedCount = farm.cells.filter(c => c.zoneType).length

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F0FDF4' }}>
      <Navbar farm={farm} farmName={farm.name} onFarmNameChange={updateFarmName} isEditor={false} />

      <div className="flex-1 flex flex-col items-center py-8 px-4">
        {/* Farm Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-green-800 tracking-wide"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
            {farm.name}
          </h1>
          {occupiedCount > 0 && (
            <p className="text-green-600 mt-1 text-sm">{occupiedCount} / 100 个地块已规划</p>
          )}
        </div>

        {/* Farm export area */}
        <div
          ref={exportRef}
          className="rounded-3xl shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #A8D5A2 0%, #7BBF6A 40%, #A8D5A2 100%)',
            padding: '20px',
          }}
        >
          {/* Farm name inside export area */}
          <div className="text-center mb-3">
            <span className="text-xl font-bold text-green-900 bg-white/60 px-4 py-1 rounded-full">
              🌾 {farm.name}
            </span>
          </div>

          {/* Top tree border */}
          <div className="flex justify-between mb-2 px-2">
            {TREE_BORDER_EMOJIS.map((tree, i) => (
              <span key={i} style={{ fontSize: 22, lineHeight: 1 }}>{tree}</span>
            ))}
          </div>

          {/* Middle row: left trees + farm grid + right trees */}
          <div className="flex items-stretch gap-2">
            {/* Left trees */}
            <div className="flex flex-col justify-around" style={{ gap: 2 }}>
              {SIDE_TREE_EMOJIS.map((tree, i) => (
                <span key={i} style={{ fontSize: 22, lineHeight: 1 }}>{tree}</span>
              ))}
            </div>

            {/* Farm grid with stone path background */}
            <div
              className="rounded-xl overflow-hidden flex-1"
              style={{
                background: '#9E9E9E',
                padding: 3,
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(10, 1fr)',
                  gap: 3,
                }}
              >
                {farm.cells.map(cell => (
                  <PreviewCell key={cell.id} cell={cell} size={64} />
                ))}
              </div>
            </div>

            {/* Right trees */}
            <div className="flex flex-col justify-around" style={{ gap: 2 }}>
              {SIDE_TREE_EMOJIS.map((tree, i) => (
                <span key={i} style={{ fontSize: 22, lineHeight: 1 }}>{tree}</span>
              ))}
            </div>
          </div>

          {/* Bottom tree border */}
          <div className="flex justify-between mt-2 px-2">
            {TREE_BORDER_EMOJIS.map((tree, i) => (
              <span key={i} style={{ fontSize: 22, lineHeight: 1 }}>{TREE_BORDER_EMOJIS[TREE_BORDER_EMOJIS.length - 1 - i]}</span>
            ))}
          </div>

          {/* Legend inside export area */}
          <div className="mt-4">
            <Legend cells={farm.cells} />
          </div>
        </div>
      </div>

      <ExportButton exportRef={exportRef} farmName={farm.name} />
    </div>
  )
}
