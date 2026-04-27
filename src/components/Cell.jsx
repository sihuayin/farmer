import { useState } from 'react'
import { ZONE_MAP } from '../data/zoneTypes'

export default function Cell({ cell, onClick, onHover, isEditor, isSelected }) {
  const [showTooltip, setShowTooltip] = useState(false)

  const zone = cell.zoneType ? ZONE_MAP[cell.zoneType] : null
  const isEmpty = !zone

  const bgColor = isEmpty ? '#E5E7EB' : zone.color
  const displayText = cell.variety
    ? cell.variety.length > 2
      ? cell.variety.slice(0, 2)
      : cell.variety
    : ''

  const tooltipContent = zone
    ? [cell.variety, cell.name].filter(Boolean).join(' · ')
    : ''

  return (
    <div className="relative">
      <button
        className={`
          w-full aspect-square rounded-lg
          flex flex-col items-center justify-center
          transition-all duration-100
          select-none
          ${isSelected ? 'ring-2 ring-offset-1 ring-blue-500 scale-105 z-10' : ''}
          ${isEditor ? 'cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95' : 'cursor-default'}
          ${isEmpty && isEditor ? 'hover:bg-gray-300' : ''}
          overflow-hidden
          shadow-sm
        `}
        style={{
          backgroundColor: bgColor,
          position: 'relative',
        }}
        onClick={onClick}
        onMouseEnter={() => {
          setShowTooltip(true)
          onHover && onHover(cell)
        }}
        onMouseLeave={() => {
          setShowTooltip(false)
          onHover && onHover(null)
        }}
        title=""
      >
        {zone && (
          <>
            <span className="text-sm leading-none mb-0.5" role="img" aria-hidden>
              {zone.emoji}
            </span>
            {displayText && (
              <span
                className="text-xs font-bold leading-none"
                style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
              >
                {displayText}
              </span>
            )}
          </>
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && tooltipContent && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          style={{ minWidth: '80px' }}
        >
          <div className="bg-gray-800 text-white text-xs rounded-lg px-2 py-1.5 shadow-lg whitespace-nowrap text-center">
            <div className="font-medium">{cell.variety}</div>
            {cell.name && <div className="text-gray-300 text-xs mt-0.5">{cell.name}</div>}
            {cell.status && cell.status !== 'empty' && (
              <div className="text-gray-400 text-xs mt-0.5">
                {cell.status === 'planted' ? '已种植' : '已收获'}
              </div>
            )}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '5px solid #1F2937',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
