import React, { useState, useContext } from 'react'
import { FarmContext, CROP_CONFIG } from '../../hooks/useFarm'
import { useI18n } from '../../i18n'
import FAB from '../../components/layout/FAB'

const STATUS_CHIP = {
  empty: { key: 'crops.status.empty' },
  growing: { key: 'crops.status.growing' },
  ready: { key: 'crops.status.ready' },
}

function PlantModal({ plot, onClose, onPlant }) {
  const { state } = useContext(FarmContext)
  const { t } = useI18n()
  const availableSeeds = Object.entries(CROP_CONFIG).filter(([key]) => {
    const seedId = `seed-${key}`
    const inv = state.inventory.find((i) => i.id === seedId)
    return inv && inv.count > 0
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface rounded-[2rem] p-6 w-full max-w-md shadow-2xl animate-zoom-in">
        <h3 className="text-xl font-bold mb-4">{t('crops.plantModal.title', { name: plot.name })}</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availableSeeds.length === 0 ? (
            <p className="text-stone-500 text-sm text-center py-4">{t('crops.plantModal.noSeeds')}</p>
          ) : availableSeeds.map(([key, cfg]) => {
            const seedId = `seed-${key}`
            const seed = state.inventory.find((i) => i.id === seedId)
            return (
              <button
                key={key}
                onClick={() => onPlant(plot.id, key)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-stone-200 hover:border-primary/50 transition-all"
              >
                <span className="text-3xl">{cfg.emoji}</span>
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm">{cfg.name}</p>
                  <p className="text-xs text-stone-500">{t('crops.plantModal.growth', { n: Math.round(cfg.baseGrowthTime / 60000) })}</p>
                </div>
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">x{seed?.count ?? 0}</span>
              </button>
            )
          })}
        </div>
        <button onClick={onClose} className="mt-4 w-full py-3 bg-surface-container text-stone-600 font-bold rounded-xl hover:bg-stone-200 transition-colors">{t('crops.plantModal.cancel')}</button>
      </div>
    </div>
  )
}

function PlotCard({ plot, onWater, onFertilize, onHarvest, onPlant }) {
  const [showModal, setShowModal] = useState(false)
  const { t } = useI18n()
  const cfg = plot.cropType ? CROP_CONFIG[plot.cropType] : null
  const statusChip = STATUS_CHIP[plot.status] || STATUS_CHIP.growing

  if (plot.status === 'empty') {
    return (
      <div
        className="bg-stone-100/50 rounded-3xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-center gap-4 p-8 min-h-[400px] hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
          <span className="material-symbols-outlined text-stone-400 group-hover:text-emerald-600 text-3xl">add_box</span>
        </div>
        <div>
          <p className="font-bold text-stone-700 text-sm">{plot.name}</p>
          <p className="text-stone-500 text-xs">{t('crops.clickToPlant')}</p>
        </div>
        {showModal && (
          <PlantModal
            plot={plot}
            onClose={() => setShowModal(false)}
            onPlant={(plotId, cropType) => { onPlant(plotId, cropType); setShowModal(false) }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-3xl plot-card-shadow border border-outline-variant/20 overflow-hidden flex flex-col">
      <div className="relative h-48 bg-stone-100 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
          <span className="text-7xl opacity-60">{cfg?.emoji}</span>
        </div>
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg ${plot.status === 'ready' ? 'bg-primary text-on-primary' : plot.status === 'growing' ? 'bg-tertiary-fixed text-tertiary' : 'bg-stone-200 text-stone-600'}`}>
            {t(statusChip.key)}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent" />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-stone-900">{cfg?.name ?? plot.name}</h3>
            <p className="text-[10px] text-stone-500">{t('crops.plantedAgo', { n: plot.plantedAt ? Math.round((Date.now() - plot.plantedAt) / 60000) : 0 })}</p>
          </div>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${plot.status === 'ready' ? 'bg-primary-fixed' : 'bg-surface-container'}`}>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex justify-between text-[10px] font-bold mb-2 text-stone-600">
            <span>{t('crops.growthMeter')}</span>
            <span className={plot.status === 'ready' ? 'text-primary font-extrabold' : 'text-primary'}>{plot.growthPercent}%</span>
          </div>
          <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden p-[2px]">
            <div
              className={`h-full rounded-full shadow-inner transition-all ${plot.status === 'ready' ? 'bg-primary' : 'bg-tertiary-container'}`}
              style={{ width: `${plot.growthPercent}%` }}
            />
          </div>
          {plot.status !== 'ready' && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {t('crops.harvestIn', { n: Math.round((100 - plot.growthPercent) / 10) })}
            </p>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3">
          {plot.status === 'ready' ? (
            <button
              onClick={() => onHarvest(plot.id)}
              className="col-span-2 bg-primary text-on-primary py-3 rounded-xl tactile-btn font-bold flex items-center justify-center gap-2 hover:brightness-110"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              {t('crops.actions.harvest')} (+{cfg?.harvestYield} {cfg?.emoji} +10 pts)
            </button>
          ) : (
            <>
              <button onClick={() => onWater(plot.id)} className="bg-tertiary-container text-on-tertiary-container py-3 rounded-xl tactile-btn flex items-center justify-center gap-2 hover:brightness-110">
                <span className="material-symbols-outlined text-lg">water_drop</span>
                {t('crops.actions.water')}
              </button>
              <button onClick={() => onFertilize(plot.id)} className="bg-surface-container-high text-stone-600 py-3 rounded-xl tactile-btn flex items-center justify-center gap-2 hover:bg-stone-200 border border-outline-variant/30">
                <span className="material-symbols-outlined text-lg">science</span>
                {t('crops.actions.fertilize')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CropsPage() {
  const { state, actions } = useContext(FarmContext)
  const { t } = useI18n()
  const { plots, inventory } = state

  const fertItem = inventory.find((i) => i.id === 'fertilizer')
  const fertCount = fertItem?.count ?? 0
  const activePlotCount = plots.filter((p) => p.cropType).length

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-1">{t('crops.title')}</h1>
          <p className="text-stone-500 text-sm">{t('crops.subtitle', { n: activePlotCount })}</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container-high px-4 py-2 rounded-xl flex items-center gap-2 border border-outline-variant/30">
            <span className="material-symbols-outlined text-emerald-700">water_drop</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">{t('crops.waterLevel')}: {Math.round(plots.filter((p) => p.lastWatered).length / plots.length * 100)}%</span>
          </div>
          <div className="bg-surface-container-high px-4 py-2 rounded-xl flex items-center gap-2 border border-outline-variant/30">
            <span className="material-symbols-outlined text-secondary">science</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">{t('crops.fertilizer')}: {fertCount} {t('crops.units')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plots.map((plot) => (
          <PlotCard
            key={plot.id}
            plot={plot}
            onWater={actions.waterPlot}
            onFertilize={actions.fertilizePlot}
            onHarvest={actions.harvestPlot}
            onPlant={actions.plantPlot}
          />
        ))}
      </div>

      <FAB />
    </div>
  )
}
