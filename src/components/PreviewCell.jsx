import { ZONE_MAP } from '../data/zoneTypes'

const ZONE_STYLES = {
  vegetable: {
    bg: 'linear-gradient(180deg, #5D4037 0%, #4E342E 100%)',
    texture: 'repeating-linear-gradient(0deg, transparent 0px, transparent 8px, rgba(0,0,0,0.18) 8px, rgba(0,0,0,0.18) 10px)',
    emojis: ['🥬','🥕','🍅','🥦'],
    labelBg: 'rgba(0,0,0,0.45)',
    labelColor: '#E8F5E9',
    border: 'none',
  },
  fruit: {
    bg: 'linear-gradient(135deg, #2E7D32 0%, #388E3C 60%, #43A047 100%)',
    texture: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08) 0%, transparent 60%)',
    emojis: ['🍎','🍊','🍇','🍓'],
    labelBg: 'rgba(27,94,32,0.7)',
    labelColor: '#F9FBE7',
    border: 'none',
  },
  grain: {
    bg: 'linear-gradient(180deg, #F9A825 0%, #F57F17 100%)',
    texture: 'repeating-linear-gradient(90deg, transparent 0px, transparent 5px, rgba(255,255,255,0.12) 5px, rgba(255,255,255,0.12) 6px)',
    emojis: ['🌾','🌽','🌾','🌾'],
    labelBg: 'rgba(78,52,46,0.6)',
    labelColor: '#FFF8E1',
    border: 'none',
  },
  flower: {
    bg: 'linear-gradient(135deg, #A5D6A7 0%, #66BB6A 100%)',
    texture: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.15) 0%, transparent 50%)',
    emojis: ['🌸','🌺','🌻','🌹'],
    labelBg: 'rgba(136,14,79,0.55)',
    labelColor: '#FCE4EC',
    border: 'none',
  },
  poultry: {
    bg: 'linear-gradient(180deg, #FFF8DC 0%, #F5DEB3 100%)',
    texture: null,
    emojis: ['🐔','🦆','🐣','🕊️'],
    labelBg: 'rgba(93,64,55,0.6)',
    labelColor: '#FFF8E1',
    border: '3px solid #8D6E63',
    innerBorder: '2px solid #BCAAA4',
  },
  livestock: {
    bg: 'linear-gradient(180deg, #C8E6C9 0%, #A5D6A7 100%)',
    texture: null,
    emojis: ['🐄','🐑','🐖','🐎'],
    labelBg: 'rgba(27,94,32,0.55)',
    labelColor: '#F1F8E9',
    border: '3px solid #6D4C41',
    innerBorder: '2px solid #A1887F',
  },
  aquaculture: {
    bg: 'linear-gradient(180deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
    texture: 'repeating-linear-gradient(180deg, transparent 0px, transparent 5px, rgba(255,255,255,0.07) 5px, rgba(255,255,255,0.07) 7px)',
    emojis: ['🐟','🦐','🦀','🐠'],
    labelBg: 'rgba(13,71,161,0.7)',
    labelColor: '#E3F2FD',
    border: 'none',
  },
}

// Pick 2 emojis from the zone's emoji list based on variety to make it deterministic
function getEmojisForCell(zoneStyle, variety, zoneType) {
  const emojis = zoneStyle.emojis
  // Use 2 emojis for smaller display
  return [emojis[0], emojis[1 % emojis.length]]
}

export default function PreviewCell({ cell, size = 64 }) {
  if (!cell.zoneType) {
    return (
      <div
        className="rounded-md"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)',
          border: '1px solid #A7F3D0',
        }}
      />
    )
  }

  const zone = ZONE_MAP[cell.zoneType]
  const style = ZONE_STYLES[cell.zoneType]
  if (!zone || !style) return null

  const emojis = getEmojisForCell(style, cell.variety, cell.zoneType)
  const label = cell.variety ? (cell.variety.length > 3 ? cell.variety.slice(0, 3) : cell.variety) : zone.name

  const hasFence = cell.zoneType === 'poultry' || cell.zoneType === 'livestock'

  return (
    <div
      className="rounded-md relative overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: style.bg,
        border: style.border || 'none',
        boxSizing: 'border-box',
      }}
      title={`${zone.emoji} ${zone.name}${cell.variety ? ' · ' + cell.variety : ''}${cell.name ? ' · ' + cell.name : ''}`}
    >
      {/* Texture overlay */}
      {style.texture && (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: style.texture, pointerEvents: 'none' }}
        />
      )}

      {/* Inner fence border for animal zones */}
      {hasFence && style.innerBorder && (
        <div
          className="absolute rounded"
          style={{
            inset: '4px',
            border: style.innerBorder,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Emoji content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5" style={{ paddingBottom: 14 }}>
        <div className="flex gap-1">
          {emojis.map((emoji, i) => (
            <span
              key={i}
              style={{
                fontSize: size < 52 ? 14 : 18,
                lineHeight: 1,
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))',
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>

      {/* Variety label at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 text-center font-medium"
        style={{
          background: style.labelBg,
          color: style.labelColor,
          fontSize: 10,
          lineHeight: '14px',
          padding: '0 2px',
          letterSpacing: '0.02em',
        }}
      >
        {label}
      </div>
    </div>
  )
}
