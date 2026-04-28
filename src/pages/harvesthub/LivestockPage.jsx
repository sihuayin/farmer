import { useContext } from 'react'
import { FarmContext, LIVESTOCK_CONFIG, PEN_UNLOCK_COST } from '../../hooks/useFarm'
import { useI18n } from '../../i18n'
import FAB from '../../components/layout/FAB'

const STATUS_CHIP = {
  hungry: { key: 'livestock.hungry', color: 'bg-secondary/90 text-on-secondary' },
  active: { key: 'livestock.stableHealth', color: 'bg-primary/90 text-on-primary' },
  empty: { key: 'common.empty', color: 'bg-stone-200 text-stone-600' },
  locked: { key: 'common.locked', color: 'bg-stone-300 text-stone-500' },
}

function PenCard({ pen, onFeed, onCollect, onUnlock }) {
  const { t } = useI18n()
  const cfg = pen.livestockType ? LIVESTOCK_CONFIG[pen.livestockType] : null
  const statusChip = STATUS_CHIP[pen.status] || STATUS_CHIP.active

  if (pen.status === 'locked') {
    return (
      <div className="bg-stone-100/50 rounded-[2rem] border-2 border-dashed border-stone-300 p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[400px] opacity-60">
        <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center">
          <span className="material-symbols-outlined text-stone-400 text-3xl">lock</span>
        </div>
        <div>
          <p className="font-bold text-stone-700 text-sm">{pen.name}</p>
          <p className="text-stone-500 text-xs">{t('livestock.unlockCost', { cost: PEN_UNLOCK_COST })}</p>
        </div>
        <button
          onClick={() => onUnlock(pen.id)}
          className="mt-2 px-6 py-2 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-all active:scale-95 text-sm"
        >
          {t('livestock.unlock')} ({PEN_UNLOCK_COST} {t('common.points')})
        </button>
      </div>
    )
  }

  if (pen.status === 'empty') {
    return (
      <div className="bg-stone-100/50 rounded-[2rem] border-2 border-dashed border-stone-300 p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center">
          <span className="material-symbols-outlined text-stone-400 text-3xl">add_box</span>
        </div>
        <div>
          <p className="font-bold text-stone-700 text-sm">{pen.name}</p>
          <p className="text-stone-500 text-xs">{t('livestock.noLivestock')}</p>
        </div>
      </div>
    )
  }

  const hungerColor = pen.hungerPercent >= 80 ? 'bg-error' : pen.hungerPercent >= 50 ? 'bg-secondary-container' : 'bg-tertiary-container'
  const isSheep = pen.livestockType === 'sheep'

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 overflow-hidden plot-card-shadow">
      <div className="relative h-48 bg-stone-100 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
          <span className="text-7xl opacity-60">{cfg?.emoji}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-6">
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm ${statusChip.color}`}>
            {t(statusChip.key)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">{pen.name}</h3>
            <div className="flex items-center gap-2 text-stone-500">
              <span className="material-symbols-outlined text-sm">{cfg?.emoji}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{pen.count} {t(isSheep ? 'livestock.sheep' : 'livestock.hens')}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-[10px] mb-2 text-stone-600">
              <span className="font-bold">{t('livestock.healthLevel')}</span>
              <span className="font-extrabold text-primary">{pen.healthPercent}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${pen.healthPercent}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-2 text-stone-600">
              <span className="font-bold">{t('livestock.hunger')}</span>
              <span className={`font-extrabold ${pen.hungerPercent >= 80 ? 'text-error' : 'text-secondary'}`}>{Math.round(pen.hungerPercent)}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className={`h-full ${hungerColor} rounded-full`} style={{ width: `${pen.hungerPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-surface-container p-4 rounded-2xl flex items-center justify-between mb-6 border border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-stone-400">{isSheep ? 'inventory' : 'shopping_basket'}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase opacity-60">{t('livestock.production')}</p>
              <p className="text-base font-bold">
                {pen.accumulatedProduction.toFixed(1)} {isSheep ? t('livestock.woolKg') : t('livestock.eggsItems')}
              </p>
            </div>
          </div>
          {pen.accumulatedProduction > 0 && (
            <span className="bg-primary-container/20 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-md">{t('livestock.ready')}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onFeed(pen.id)}
            className="bg-secondary text-on-secondary hover:bg-secondary/90 py-2.5 rounded-xl tactile-btn font-bold flex items-center justify-center gap-2 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-lg">{isSheep ? 'grain' : 'restaurant'}</span>
            {t('livestock.feed')}
          </button>
          <button
            onClick={() => onCollect(pen.id)}
            disabled={pen.accumulatedProduction <= 0}
            className={`py-2.5 rounded-xl tactile-btn font-bold flex items-center justify-center gap-2 transition-all text-sm ${pen.accumulatedProduction > 0 ? 'bg-primary text-on-primary hover:bg-primary/90' : 'bg-surface-container-high text-stone-400 cursor-not-allowed'}`}
          >
            <span className="material-symbols-outlined text-lg">{isSheep ? 'content_cut' : 'front_hand'}</span>
            {t('livestock.collect')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LivestockPage() {
  const { state, actions } = useContext(FarmContext)
  const { t } = useI18n()
  const { pens } = state

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 mb-1">{t('livestock.title')}</h2>
          <p className="text-stone-500 text-sm">{t('livestock.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-stone-600 border border-outline-variant rounded-xl tactile-btn font-semibold text-sm">
            <span className="material-symbols-outlined text-sm">filter_alt</span> {t('livestock.allPens')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl tactile-btn font-semibold text-sm">
            <span className="material-symbols-outlined text-sm">add</span> {t('livestock.buyLivestock')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {pens.map((pen) => (
          <PenCard
            key={pen.id}
            pen={pen}
            onFeed={actions.feedLivestock}
            onCollect={actions.collectProduction}
            onUnlock={actions.unlockPen}
          />
        ))}
      </div>

      <FAB />
    </div>
  )
}
