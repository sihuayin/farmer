import { useState, useEffect } from 'react'
import { ZONE_MAP } from '../data/zoneTypes'

export default function CellEditModal({ cell, onSave, onDelete, onClose }) {
  const zone = cell.zoneType ? ZONE_MAP[cell.zoneType] : null
  const [name, setName] = useState(cell.name || '')
  const [variety, setVariety] = useState(cell.variety || '')
  const [status, setStatus] = useState(cell.status || 'empty')

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function handleSave() {
    onSave({ name: name.trim() || undefined, variety, status })
  }

  function handleDelete() {
    onDelete()
  }

  if (!zone) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{ backgroundColor: zone.color }}
        >
          <span className="text-3xl">{zone.emoji}</span>
          <div>
            <div className="text-white font-bold text-base">{zone.name}</div>
            <div className="text-white/80 text-xs">格子 #{cell.id + 1}</div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-white/80 hover:text-white text-xl font-light leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              格子名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="自定义名称（可选）"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
            />
          </div>

          {/* Variety */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              品种
            </label>
            <select
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all bg-white"
            >
              {zone.varieties.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              状态
            </label>
            <div className="flex gap-2">
              {[
                { value: 'empty', label: '空地' },
                { value: 'planted', label: '已种植' },
                { value: 'harvested', label: '已收获' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-all ${
                    status === opt.value
                      ? 'text-white border-transparent shadow-sm'
                      : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'
                  }`}
                  style={
                    status === opt.value
                      ? { backgroundColor: zone.color, borderColor: zone.color }
                      : {}
                  }
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={status === opt.value}
                    onChange={() => setStatus(opt.value)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={handleDelete}
            className="flex-none bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            删除
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 text-white text-sm font-semibold py-2 rounded-lg transition-colors shadow-sm"
            style={{ backgroundColor: zone.color }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
