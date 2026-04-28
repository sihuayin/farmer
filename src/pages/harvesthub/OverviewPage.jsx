import { useContext } from 'react'
import { FarmContext } from '../../hooks/useFarm'
import { useI18n } from '../../i18n'
import FAB from '../../components/layout/FAB'

function ProgressBar({ value, color = 'bg-primary', label, sublabel }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[12px] font-bold text-stone-600">{label}</span>
        <span className="text-[12px] font-extrabold text-stone-700">{sublabel ?? `${value}%`}</span>
      </div>
      <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full shadow-inner`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function TaskItem({ task, onToggle, t }) {
  const isCompleted = task.status === 'completed'
  const urgencyColors = {
    overdue: 'bg-error text-on-error',
    scheduled: 'bg-surface-container-high text-stone-600',
    normal: 'bg-surface-container text-stone-600',
  }

  return (
    <li
      className={`bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-stone-100 transition-all ${isCompleted ? 'opacity-50' : 'hover:-translate-y-0.5'} cursor-pointer`}
      onClick={() => onToggle(task.id)}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-100' : 'bg-surface-container'} ${!isCompleted && task.urgency === 'overdue' ? 'bg-error/10' : ''}`}>
        <span className={`material-symbols-outlined ${isCompleted ? 'text-emerald-600' : task.urgency === 'overdue' ? 'text-error' : 'text-stone-400'}`} style={{ fontSize: '18px' }}>
          {isCompleted ? 'check_circle' : task.icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold leading-tight text-sm truncate ${isCompleted ? 'line-through text-stone-400' : 'text-stone-800'}`}>{task.label}</p>
        {task.urgency === 'overdue' && !isCompleted && (
          <p className="text-[10px] text-error">{t('overview.overdue')}</p>
        )}
        {isCompleted && (
          <p className="text-[10px] text-emerald-600 font-medium">{t('overview.completed')}</p>
        )}
      </div>
      {task.urgency !== 'completed' && !isCompleted && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${urgencyColors[task.urgency] || ''}`}>
          {t(`overview.${task.urgency}`)}
        </span>
      )}
    </li>
  )
}

export default function OverviewPage() {
  const { state, actions } = useContext(FarmContext)
  const { t } = useI18n()
  const { plots, pens, tasks } = state

  const totalPlots = plots.filter((p) => p.cropType).length
  const readyPlots = plots.filter((p) => p.status === 'ready').length
  const harvestReadiness = totalPlots > 0 ? Math.round((readyPlots / totalPlots) * 100) : 0

  const activePens = pens.filter((p) => p.status !== 'active' || p.status !== 'empty' || p.status !== 'locked')
  const avgHappiness = activePens.length > 0 ? Math.round(activePens.reduce((sum, p) => sum + (p.healthPercent || 0), 0) / activePens.length) : 0

  const dueCount = tasks.filter((t) => t.status === 'pending' && t.urgency === 'overdue').length

  return (
    <div className="p-8 h-full grid grid-cols-12 gap-6">
      {/* Left column */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <section className="bg-white rounded-[2rem] p-6 shadow-lg border border-stone-200 inner-highlight relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 -z-10" />
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-stone-900">{t('overview.quickStats')}</h3>
            <span className="material-symbols-outlined text-stone-300">monitoring</span>
          </div>
          <div className="space-y-5">
            <ProgressBar value={harvestReadiness} label={t('overview.harvestReadiness')} sublabel={`${harvestReadiness}%`} />
            <ProgressBar value={avgHappiness} color="bg-secondary-container" label={t('overview.animalHappiness')} sublabel={`${avgHappiness}%`} />
            <ProgressBar value={62} color="bg-tertiary-container" label={t('overview.irrigationSupply')} sublabel="62%" />
          </div>
        </section>

        <section className="bg-stone-100 rounded-[2rem] p-6 border border-stone-200 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-stone-900">{t('overview.pendingTasks')}</h3>
            {dueCount > 0 && (
              <span className="bg-primary text-on-primary text-[10px] px-2 py-1 rounded-lg font-bold">{dueCount} {t('overview.due')}</span>
            )}
          </div>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={actions.toggleTask} t={t} />
            ))}
          </ul>
        </section>
      </div>

      {/* Right column: Map */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-stone-900">{t('overview.theHomestead')}</h2>
            <p className="text-stone-500 text-sm">{t('overview.sector')} · {t('overview.weather')}</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-surface-container-high px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-stone-200 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm">zoom_in</span>
            </button>
            <button className="bg-surface-container-high px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-stone-200 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm">layers</span>
            </button>
          </div>
        </div>

        <div className="flex-1 bg-surface-container-low rounded-[2rem] border-2 border-stone-200 shadow-xl overflow-hidden relative min-h-[400px]">
          <div className="absolute inset-0 farm-map-pattern opacity-30" />
          <div className="absolute inset-0 p-8 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-6 w-full max-w-4xl isometric-card">
              <div className="bg-white/90 backdrop-blur px-4 py-6 rounded-3xl shadow-lg border-b-4 border-emerald-600 flex flex-col items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-emerald-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>yard</span>
                <div className="text-center">
                  <p className="font-bold text-emerald-900 text-sm">{t('crops.status.ready')}</p>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">{t('crops.status.ready')}</span>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur px-4 py-6 rounded-3xl shadow-lg border-b-4 border-secondary-container flex flex-col items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
                <div className="text-center">
                  <p className="font-bold text-stone-800 text-sm">{t('overview.weather')}</p>
                  <span className="bg-stone-100 text-stone-500 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Clear</span>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur px-4 py-6 rounded-3xl shadow-lg border-b-4 border-tertiary-container flex flex-col items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-tertiary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>water</span>
                <div className="text-center">
                  <p className="font-bold text-stone-800 text-sm">{t('panorama.irrigationSupply')}</p>
                  <span className="bg-tertiary-fixed text-tertiary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">{t('panorama.tended')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 flex gap-3">
            <div className="bg-white/80 backdrop-blur p-1 rounded-2xl flex items-center gap-1 shadow-md">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-on-primary shadow-lg">
                <span className="material-symbols-outlined text-sm">navigation</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-stone-100 text-stone-600">
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-stone-100 text-stone-600">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-full border border-outline-variant/30 flex items-center gap-3 text-sm font-medium text-stone-700">
            <span className="material-symbols-outlined text-yellow-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
            <span className="text-[12px] font-bold">{t('overview.weather')}</span>
          </div>
        </div>
      </div>

      <style>{`
        .isometric-card {
          transform: perspective(1000px) rotateX(10deg) rotateY(-5deg);
          transition: transform 0.3s ease;
        }
        .isometric-card:hover {
          transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
        }
      `}</style>

      <FAB />
    </div>
  )
}
