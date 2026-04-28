import { CROP_CONFIG, LIVESTOCK_CONFIG } from '../../hooks/useFarm'

function ProgressBar({ value, color, label }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-stone-600">{label}</span>
        <span className="text-xs font-bold text-stone-700">{value}%</span>
      </div>
      <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function PlotSheet({ plot, onWater, onFertilize, onHarvest, onPlant, onClose, t }) {
  const cfg = plot.cropType ? CROP_CONFIG[plot.cropType] : null
  const status = plot.status || 'empty'

  const statusColors = {
    ready: { badge: 'bg-emerald-500 text-white', bar: 'bg-emerald-500' },
    growing: { badge: 'bg-amber-500 text-white', bar: 'bg-amber-400' },
    empty: { badge: 'bg-stone-300 text-stone-600', bar: 'bg-stone-200' },
  }
  const sc = statusColors[status] || statusColors.empty

  return (
    <div className="px-5 py-5">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-stone-200 bg-white">
          {cfg ? cfg.emoji : <span className="material-symbols-outlined text-stone-400">grass</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-stone-900 text-base">{plot.name}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.badge}`}>
              {t(`panorama.status.${status}`)}
            </span>
          </div>
          <p className="text-xs text-stone-500">{cfg ? cfg.name : t('crops.status.empty')}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-stone-400">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {cfg && (
        <div className="mb-4">
          <ProgressBar value={plot.growthPercent} color={sc.bar} label={t('crops.growthMeter')} />
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {status === 'growing' && (
          <>
            <button onClick={onWater} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
              {t('crops.actions.water')}
            </button>
            <button onClick={onFertilize} className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
              {t('crops.actions.fertilize')}
            </button>
          </>
        )}
        {status === 'ready' && (
          <button onClick={onHarvest} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            {t('crops.actions.harvest')}
          </button>
        )}
        {status === 'empty' && (
          <button onClick={onPlant} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            {t('crops.actions.plant')}
          </button>
        )}
        <button
          onClick={onClose}
          className="bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          {t('panorama.actions.viewDetails')}
        </button>
      </div>
    </div>
  )
}

function PenSheet({ pen, onFeed, onCollect, onClose, t }) {
  const cfg = pen.livestockType ? LIVESTOCK_CONFIG[pen.livestockType] : null
  const status = pen.status || 'empty'
  const hunger = Math.min(100, pen.hungerPercent || 0)
  const health = pen.healthPercent || 100

  const healthColor = health < 50 ? 'bg-red-500' : health < 75 ? 'bg-amber-500' : 'bg-emerald-500'
  const hungerColor = hunger > 70 ? 'bg-red-500' : hunger > 40 ? 'bg-amber-500' : 'bg-blue-500'

  const statusColors = {
    active: { badge: 'bg-blue-500 text-white' },
    hungry: { badge: 'bg-red-500 text-white' },
    empty: { badge: 'bg-stone-300 text-stone-600' },
    locked: { badge: 'bg-stone-400 text-white' },
  }
  const sc = statusColors[status] || statusColors.empty

  return (
    <div className="px-5 py-5">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-stone-200 bg-white">
          {cfg ? cfg.emoji : <span className="material-symbols-outlined text-stone-400">pets</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-stone-900 text-base">{pen.name}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.badge}`}>
              {t(`panorama.status.${status}`)}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            {cfg ? `${cfg.name} × ${pen.count}` : pen.status === 'locked' ? t('livestock.locked') : t('livestock.empty')}
          </p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-stone-400">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-xl p-3 border border-stone-200">
          <p className="text-[10px] font-bold text-stone-500 uppercase mb-1">{t('livestock.healthLevel')}</p>
          <ProgressBar value={health} color={healthColor} label={`${health}%`} />
        </div>
        <div className="bg-white rounded-xl p-3 border border-stone-200">
          <p className="text-[10px] font-bold text-stone-500 uppercase mb-1">{t('livestock.hunger')}</p>
          <ProgressBar value={100 - hunger} color={hungerColor} label={`${100 - hunger}%`} />
        </div>
      </div>

      {pen.accumulatedProduction > 0 && (
        <div className="bg-amber-50 rounded-xl p-3 mb-4 border border-amber-200 flex items-center gap-3">
          <span className="text-2xl">{cfg?.emoji}</span>
          <div>
            <p className="text-xs font-bold text-amber-700">{t('livestock.production')}</p>
            <p className="text-sm font-bold text-amber-900">
              {pen.accumulatedProduction.toFixed(1)} {cfg?.productionItem === 'wool' ? t('livestock.woolKg') : t('livestock.eggsItems')}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {status !== 'locked' && status !== 'empty' && (
          <button onClick={onFeed} className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>grain</span>
            {t('livestock.feed')}
          </button>
        )}
        {pen.accumulatedProduction > 0 && (
          <button onClick={onCollect} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>inbox</span>
            {t('livestock.collect')}
          </button>
        )}
        <button
          onClick={onClose}
          className="bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          {t('panorama.actions.viewDetails')}
        </button>
      </div>
    </div>
  )
}

export default function ItemDetailSheet({ item, itemType, onWater, onFertilize, onHarvest, onPlant, onFeed, onCollect, onClose, onViewDetails, t }) {
  if (!item) return null

  return (
    <div className="bg-white rounded-t-[2rem] shadow-2xl border-t border-stone-200">
      {itemType === 'plot' ? (
        <PlotSheet
          plot={item}
          onWater={onWater}
          onFertilize={onFertilize}
          onHarvest={onHarvest}
          onPlant={onPlant}
          onClose={onClose}
          t={t}
        />
      ) : (
        <PenSheet
          pen={item}
          onFeed={onFeed}
          onCollect={onCollect}
          onClose={onClose}
          t={t}
        />
      )}
    </div>
  )
}
