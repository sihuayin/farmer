import { useState } from 'react'
import { ZONE_TYPES } from '../data/zoneTypes'

const PLANTING_TYPES = ['vegetable', 'fruit', 'grain', 'flower']
const FARMING_TYPES = ['poultry', 'livestock', 'aquaculture']

export default function ZoneTypePicker({ selectedZone, selectedVariety, onSelectZone, onSelectVariety, onClearFarm }) {
  const [plantingOpen, setPlantingOpen] = useState(true)
  const [farmingOpen, setFarmingOpen] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)

  const plantingZones = ZONE_TYPES.filter((z) => PLANTING_TYPES.includes(z.id))
  const farmingZones = ZONE_TYPES.filter((z) => FARMING_TYPES.includes(z.id))

  function handleZoneClick(zone) {
    if (selectedZone?.id === zone.id) {
      onSelectZone(null)
      onSelectVariety(null)
    } else {
      onSelectZone(zone)
      onSelectVariety(zone.varieties[0])
    }
  }

  function handleClearConfirm() {
    onClearFarm()
    setShowConfirm(false)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">区域类型</h2>

          {/* 种植类 section */}
          <div className="mb-2">
            <button
              className="w-full flex items-center justify-between text-left py-2 px-3 rounded-lg hover:bg-green-50 transition-colors"
              onClick={() => setPlantingOpen((v) => !v)}
            >
              <span className="text-sm font-semibold text-gray-700">🌱 种植类</span>
              <span className="text-gray-400 text-xs">{plantingOpen ? '▲' : '▼'}</span>
            </button>

            {plantingOpen && (
              <div className="mt-1 space-y-1 pl-1">
                {plantingZones.map((zone) => (
                  <ZoneItem
                    key={zone.id}
                    zone={zone}
                    isSelected={selectedZone?.id === zone.id}
                    selectedVariety={selectedVariety}
                    onClick={() => handleZoneClick(zone)}
                    onSelectVariety={onSelectVariety}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 养殖类 section */}
          <div className="mb-2">
            <button
              className="w-full flex items-center justify-between text-left py-2 px-3 rounded-lg hover:bg-green-50 transition-colors"
              onClick={() => setFarmingOpen((v) => !v)}
            >
              <span className="text-sm font-semibold text-gray-700">🐾 养殖类</span>
              <span className="text-gray-400 text-xs">{farmingOpen ? '▲' : '▼'}</span>
            </button>

            {farmingOpen && (
              <div className="mt-1 space-y-1 pl-1">
                {farmingZones.map((zone) => (
                  <ZoneItem
                    key={zone.id}
                    zone={zone}
                    isSelected={selectedZone?.id === zone.id}
                    selectedVariety={selectedVariety}
                    onClick={() => handleZoneClick(zone)}
                    onSelectVariety={onSelectVariety}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clear Farm button */}
      <div className="p-4 border-t border-gray-100">
        {showConfirm ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <p className="text-xs text-red-700 mb-2 font-medium">确认清空所有格子？</p>
            <div className="flex gap-2">
              <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
                onClick={handleClearConfirm}
              >
                确认清空
              </button>
              <button
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-1.5 rounded-lg transition-colors"
                onClick={() => setShowConfirm(false)}
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold text-sm py-2 rounded-lg transition-colors"
            onClick={() => setShowConfirm(true)}
          >
            🗑️ 清空农场
          </button>
        )}
      </div>
    </div>
  )
}

function ZoneItem({ zone, isSelected, selectedVariety, onClick, onSelectVariety }) {
  return (
    <div>
      <button
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
          isSelected
            ? 'text-white shadow-md'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
        style={isSelected ? { backgroundColor: zone.color } : {}}
        onClick={onClick}
      >
        <span className="text-lg">{zone.emoji}</span>
        <span className="text-sm font-medium">{zone.name}</span>
      </button>

      {isSelected && (
        <div className="mt-1 mb-1 ml-2 flex flex-wrap gap-1">
          {zone.varieties.map((v) => (
            <button
              key={v}
              onClick={() => onSelectVariety(v)}
              className={`text-xs px-2 py-1 rounded-lg border font-medium transition-all ${
                selectedVariety === v
                  ? 'text-white border-transparent shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
              style={
                selectedVariety === v
                  ? { backgroundColor: zone.color, borderColor: zone.color }
                  : {}
              }
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
