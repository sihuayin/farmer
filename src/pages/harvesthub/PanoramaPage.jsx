import { useContext } from 'react'
import { FarmContext } from '../../hooks/useFarm'
import { useI18n } from '../../i18n'
import FAB from '../../components/layout/FAB'

const LEGEND_ITEMS = [
  { icon: 'potted_plant', labelKey: 'panorama.cropPlots', subKey: 'panorama.veggiesGrains', color: 'bg-primary-container', iconColor: 'text-on-primary' },
  { icon: 'pets', labelKey: 'panorama.livestockPens', subKey: 'panorama.sheepPoultry', color: 'bg-secondary', iconColor: 'text-on-secondary' },
  { icon: 'deck', labelKey: 'panorama.eventPatio', subKey: 'panorama.diningPicnic', color: 'bg-tertiary-container', iconColor: 'text-on-tertiary-container' },
]

function ZonePin({ top, left, icon, label, value, color, sub, onClick }) {
  return (
    <div
      className="absolute group/pin cursor-pointer"
      style={{ top, left }}
      onClick={onClick}
    >
      <div
        className={`w-10 h-10 ${color} text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform group-hover/pin:scale-110`}
      >
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-surface p-3 rounded-2xl shadow-xl border border-outline-variant text-center">
          <p className={`font-bold text-sm ${color.replace('bg-', 'text-')}`}>{label}</p>
          <p className="text-xs text-stone-500">{sub}</p>
          {value !== undefined && (
            <div className="mt-2 h-1 w-full bg-surface-container rounded-full overflow-hidden">
              <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ZoneDetailCard({ title, icon, iconBg, iconColor, status, statusColor, sub, metric, value, t }) {
  return (
    <div className="bg-surface rounded-[2rem] border border-outline-variant p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${iconBg}`}>
          <span className={`material-symbols-outlined text-[24px] ${iconColor}`}>{icon}</span>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${statusColor}`}>{status}</span>
      </div>
      <h4 className="font-bold text-sm text-stone-900 mb-1">{title}</h4>
      <p className="text-xs text-stone-500 mb-4">{sub}</p>

      {metric && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] text-stone-500 uppercase mb-1">{t('panorama.hydration')}</p>
            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-tertiary-container" style={{ width: `${value}%` }} />
            </div>
          </div>
          <span className="text-xl font-extrabold text-primary">{value}%</span>
        </div>
      )}
    </div>
  )
}

export default function PanoramaPage() {
  const { state } = useContext(FarmContext)
  const { t } = useI18n()
  const { plots } = state

  const readyPlots = plots.filter((p) => p.status === 'ready').length

  return (
    <div className="pt-24 pb-32 px-4 md:px-margin max-w-7xl mx-auto grid grid-cols-12 gap-gutter">
      {/* Left Panel */}
      <aside className="col-span-12 lg:col-span-3 space-y-6">
        <div className="bg-surface-container-high rounded-[2rem] p-6 border border-outline-variant/30 shadow-sm inner-highlight">
          <h2 className="text-xl font-bold text-stone-900 mb-6">{t('panorama.farmLegend')}</h2>
          <div className="space-y-4">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.labelKey} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/20">
                <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-[20px] ${item.iconColor}`}>{item.icon}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">{t(item.labelKey)}</p>
                  <p className="text-[10px] text-stone-500">{t(item.subKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary-fixed rounded-[2rem] p-6 border border-secondary-container/30 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[10px] font-bold uppercase text-secondary mb-2">{t('panorama.dailyGoal')}</h3>
            <p className="text-2xl font-extrabold text-secondary">85% {t('panorama.tended')}</p>
            <div className="w-full h-3 bg-surface/50 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-secondary w-[85%] rounded-full shadow-inner" />
            </div>
            <button className="mt-6 w-full py-3 bg-secondary text-on-secondary font-bold rounded-xl tactile-btn-lg inner-highlight flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              {t('panorama.scheduleHarvest')}
            </button>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-10">
            <span className="material-symbols-outlined text-[120px]">agriculture</span>
          </div>
        </div>
      </aside>

      {/* Center Map */}
      <section className="col-span-12 lg:col-span-6">
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-4 border border-outline-variant/40 shadow-xl relative overflow-hidden group aspect-square">
          <div className="absolute inset-0 farm-map-pattern opacity-20" />

          <div className="relative w-full h-full z-10 p-8 flex items-center justify-center">
            <div className="w-full max-w-lg grid grid-cols-2 grid-rows-2 gap-6">
              <div className="bg-primary/10 rounded-3xl border-2 border-primary/30 p-4 relative overflow-hidden">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-1 opacity-40">
                  {plots.map((p) => p.cropType && <div key={p.id} className="bg-primary rounded-full scale-75" />)}
                </div>
                <span className="absolute bottom-2 left-2 text-[8px] font-bold text-primary/60 uppercase tracking-widest">{t('panorama.cropPlots')} ({readyPlots} {t('panorama.harvestReady').toLowerCase()})</span>
              </div>
              <div className="bg-surface-container/30 rounded-3xl border-2 border-dashed border-outline-variant/20 flex items-center justify-center">
                <span className="text-[8px] text-stone-400/60 font-bold uppercase tracking-widest text-center">{t('panorama.futureSpace')}</span>
              </div>
              <div className="bg-tertiary-container/10 rounded-3xl border-2 border-tertiary-container/30 p-4 flex flex-col items-center justify-center relative">
                <span className="material-symbols-outlined text-tertiary-container/40 text-4xl">local_cafe</span>
                <span className="absolute bottom-2 left-2 text-[8px] font-bold text-tertiary/60 uppercase">{t('panorama.eventPatio')}</span>
              </div>
              <div className="bg-secondary/10 rounded-3xl border-2 border-secondary/30 p-4 relative flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary/40 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
                <span className="absolute bottom-2 right-2 text-[8px] font-bold text-secondary/60 uppercase">{t('panorama.livestockPens')}</span>
              </div>
            </div>
          </div>

          <ZonePin top="28%" left="40%" icon="potted_plant" label={t('panorama.northField')} sub="Growth: 85%" color="bg-primary-container" value={85} />
          <ZonePin bottom="30%" right="25%" icon="pets" label={t('panorama.animalCoop')} sub="24 Hens · 12 Sheep" color="bg-secondary" />
          <ZonePin bottom="20%" left="20%" icon="deck" label={t('panorama.eventPatio')} sub={t('panorama.readyForPicnic')} color="bg-tertiary-container" />

          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="bg-surface/90 backdrop-blur-md px-4 py-2 rounded-full border border-outline-variant/30 flex items-center gap-3 text-sm font-medium text-stone-700">
              <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
              <span className="text-[10px] font-bold">{t('overview.weather')}</span>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 bg-surface/90 backdrop-blur-md rounded-full border border-outline-variant/30 flex items-center justify-center text-stone-700 hover:bg-surface transition-colors shadow-sm">
                <span className="material-symbols-outlined">zoom_in</span>
              </button>
              <button className="w-12 h-12 bg-surface/90 backdrop-blur-md rounded-full border border-outline-variant/30 flex items-center justify-center text-stone-700 hover:bg-surface transition-colors shadow-sm">
                <span className="material-symbols-outlined">zoom_out</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel */}
      <aside className="col-span-12 lg:col-span-3 space-y-4">
        <h3 className="text-xl font-bold text-stone-900 px-2">{t('panorama.zoneDetails')}</h3>

        <ZoneDetailCard
          title={t('panorama.northField')}
          icon="potted_plant"
          iconBg="bg-primary-container/10"
          iconColor="text-primary-container"
          status={t('panorama.harvestReady')}
          statusColor="bg-primary/10 text-primary border-primary/20"
          sub={t('panorama.currentCrop')}
          metric
          value={92}
          t={t}
        />

        <ZoneDetailCard
          title={t('panorama.animalCoop')}
          icon="pets"
          iconBg="bg-secondary-container/20"
          iconColor="text-secondary"
          status={t('livestock.thriving')}
          statusColor="bg-secondary/10 text-secondary border-secondary/20"
          sub="24 Hens · 12 Sheep"
          t={t}
        />

        <ZoneDetailCard
          title={t('panorama.patioDining')}
          icon="deck"
          iconBg="bg-tertiary-container/10"
          iconColor="text-tertiary"
          status={t('panorama.scheduled')}
          statusColor="bg-tertiary/10 text-tertiary border-tertiary/20"
          sub={t('panorama.readyForPicnic')}
          t={t}
        />
      </aside>

      <FAB />
    </div>
  )
}
