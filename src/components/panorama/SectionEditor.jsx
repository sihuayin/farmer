import { useState } from 'react'

const SECTION_TYPES = [
  { value: 'crop', label: { en: 'Crop', zh: '作物' }, icon: 'eco', color: '#4CAF50' },
  { value: 'livestock', label: { en: 'Livestock', zh: '畜牧' }, icon: 'pets', color: '#FF9800' },
  { value: 'utility', label: { en: 'Utility', zh: '功能' }, icon: 'handyman', color: '#2196F3' },
  { value: 'empty', label: { en: 'Empty', zh: '空置' }, icon: 'grid_on', color: '#9E9E9E' },
]

const PRESET_COLORS = [
  '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B',
  '#FF9800', '#FF5722', '#F44336', '#E91E63',
  '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
  '#03A9F4', '#00BCD4', '#009688', '#4DB6AC',
  '#9E9E9E', '#607D8B', '#795548', '#607D8B',
]

function SectionCard({ section, onUpdate, onDelete, onClose, t }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: section.name,
    rect: [...section.rect],
    color: section.color,
    type: section.type,
  })

  const handleSave = () => {
    onUpdate({ ...section, name: form.name, rect: form.rect, color: form.color, type: form.type })
    setEditing(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div
        className="px-4 py-3 flex items-center gap-3 cursor-pointer"
        style={{ borderLeft: `4px solid ${section.color}` }}
        onClick={() => setEditing(!editing)}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: section.color + '30' }}
        >
          <span className="material-symbols-outlined text-sm" style={{ color: section.color }}>
            {SECTION_TYPES.find((s) => s.value === section.type)?.icon || 'grid_on'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-stone-800 text-sm truncate">{section.name?.zh || section.name?.en || section.id}</p>
          <p className="text-[10px] text-stone-500">
            [{form.rect.join(', ')}] · {section.type}
          </p>
        </div>
        <span className="material-symbols-outlined text-stone-400 text-lg transition-transform" style={{ transform: editing ? 'rotate(180deg)' : 'none' }}>
          expand_more
        </span>
      </div>

      {editing && (
        <div className="px-4 pb-4 pt-2 border-t border-stone-100 space-y-3">
          {/* Name inputs */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Name (EN)</label>
              <input
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-sm text-stone-800"
                value={form.name.en || ''}
                onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">名称 (ZH)</label>
              <input
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-sm text-stone-800"
                value={form.name.zh || ''}
                onChange={(e) => setForm({ ...form, name: { ...form.name, zh: e.target.value } })}
              />
            </div>
          </div>

          {/* Type selector */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Type</label>
            <div className="flex gap-2 flex-wrap">
              {SECTION_TYPES.map((st) => (
                <button
                  key={st.value}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${form.type === st.value ? 'ring-2 ring-offset-1' : 'bg-stone-50'}`}
                  style={form.type === st.value ? { backgroundColor: st.color + '20', color: st.color, ringColor: st.color } : { backgroundColor: '#f5f5f5', color: '#666' }}
                  onClick={() => setForm({ ...form, type: st.value, color: st.color })}
                >
                  <span className="material-symbols-outlined text-sm mr-1">{st.icon}</span>
                  {st.label.zh}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Color</label>
            <div className="flex gap-1.5 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  className={`w-6 h-6 rounded-full transition-transform ${form.color === c ? 'ring-2 ring-offset-1 ring-stone-400 scale-110' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setForm({ ...form, color: c })}
                />
              ))}
            </div>
          </div>

          {/* Rect coordinates (pixels) */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Rect [x, y, w, h] (px)</label>
            <div className="flex gap-2">
              {['x', 'y', 'w', 'h'].map((k, i) => (
                <div key={k} className="flex-1">
                  <label className="text-[10px] text-stone-400 block mb-0.5">{k}</label>
                  <input
                    type="number"
                    min="0"
                    max="768"
                    step="64"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-sm text-stone-800 text-center"
                    value={form.rect[i]}
                    onChange={(e) => {
                      const newRect = [...form.rect]
                      newRect[i] = parseInt(e.target.value) || 0
                      setForm({ ...form, rect: newRect })
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              className="flex-1 bg-primary text-on-primary font-bold text-sm px-4 py-2 rounded-xl hover:bg-primary-container transition-colors"
            >
              {t('common.save')}
            </button>
            <button
              onClick={() => onDelete(section.id)}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm px-4 py-2 rounded-xl transition-colors"
            >
              {t('common.delete')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SectionEditor({ sections, onSave, onClose, t }) {
  const [localSections, setLocalSections] = useState(sections)

  const handleUpdate = (updatedSection) => {
    setLocalSections(localSections.map((s) => (s.id === updatedSection.id ? updatedSection : s)))
  }

  const handleDelete = (id) => {
    setLocalSections(localSections.filter((s) => s.id !== id))
  }

  const handleSaveAll = () => {
    onSave(localSections)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-stone-50 rounded-t-[2rem] shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-stone-50 z-10 px-5 pt-5 pb-4 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">{t('panorama.editor.title')}</h2>
              <p className="text-xs text-stone-500">{t('panorama.editor.subtitle')}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-stone-400">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-3">
          {localSections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              t={t}
            />
          ))}
        </div>

        <div className="sticky bottom-0 bg-stone-50 border-t border-stone-200 px-5 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white border border-stone-300 text-stone-600 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSaveAll}
            className="flex-1 bg-primary text-on-primary font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-primary-container transition-colors shadow-md"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
