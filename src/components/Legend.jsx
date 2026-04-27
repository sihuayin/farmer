import { ZONE_TYPES } from '../data/zoneTypes'

export default function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {ZONE_TYPES.map((zone) => (
        <div key={zone.id} className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-md shadow-sm flex-shrink-0"
            style={{ backgroundColor: zone.color }}
          />
          <span className="text-sm">{zone.emoji}</span>
          <span className="text-sm text-gray-700 font-medium">{zone.name}</span>
        </div>
      ))}
    </div>
  )
}
