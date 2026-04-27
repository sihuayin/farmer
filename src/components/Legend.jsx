import { ZONE_TYPES } from '../data/zoneTypes'

export default function Legend({ cells }) {
  const usedTypes = new Set(cells?.filter(c => c.zoneType).map(c => c.zoneType))

  const activeTypes = ZONE_TYPES.filter(z => usedTypes.has(z.id))
  if (activeTypes.length === 0) return null

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-2">
      {activeTypes.map(zone => (
        <div
          key={zone.id}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-md"
          style={{ background: zone.color, boxShadow: `0 2px 6px ${zone.color}88` }}
        >
          <span style={{ fontSize: 14 }}>{zone.emoji}</span>
          <span>{zone.name}</span>
        </div>
      ))}
    </div>
  )
}
