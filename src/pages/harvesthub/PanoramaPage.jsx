import { useState, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FarmContext } from '../../hooks/useFarm'
import { useI18n } from '../../i18n'
import ItemDetailSheet from '../../components/panorama/ItemDetailSheet'
import { CROP_CONFIG, LIVESTOCK_CONFIG } from '../../hooks/useFarm'

const FARM_MAP_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdiEvh64Oar03NXCH_X4dzIn6zCtKaUMKGmK5JVicP3Q_Yb_ORyEHNCfyvt9kGej--Jripc1-F9co8IzZG9hnHbAn5qI_PSVNBoGihasO4PqbfFhL5UY4cad7scxT52suXumFrXSMCZ3-zmNs3CEeD0onuXZrdMYfu67ZtTVVi6tVGxqoCUjhObwTDzf6WhAXlLmyloBf4eQBF7v7LUESFFCgxz_PfpcyB5kucZn3LoQtKB0qIy9C6QAzEGFNBuf2VIpeKD9iJYSU'

function innerGlow() {
  return { boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4)' }
}

function pressableShadow(color = '#76320f') {
  return { boxShadow: `0 4px 0 0 ${color}` }
}

// ─── Left Panel ──────────────────────────────────────────────

function LegendPanel({ sections }) {
  const { t } = useI18n()
  return (
    <div className="bg-[#f8f3ea] rounded-[2rem] p-6 border border-[#c2c9b9]/30 shadow-sm" style={innerGlow()}>
      <h2 className="text-[24px] font-bold text-[#1d1c16] mb-6" style={{ lineHeight: '1.3', fontFamily: 'Plus Jakarta Sans' }}>
        {t('panorama.farmLegend')}
      </h2>
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#c2c9b9]/20">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: section.color + '30' }}
            >
              <span className="material-symbols-outlined text-base" style={{ color: section.color }}>
                {section.icon}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1d1c16]" style={{ fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.02em' }}>
                {section.name?.zh || section.name?.en || section.id}
              </p>
              <p className="text-[10px] text-[#42493d] uppercase" style={{ letterSpacing: '-0.01em' }}>
                {section.type === 'crop' ? t('panorama.veggiesGrains')
                  : section.type === 'livestock' ? t('panorama.sheepPoultry')
                  : section.type === 'utility' ? t('panorama.diningPicnic')
                  : t('panorama.futureSpace')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DailyGoalCard({ tasks, onScheduleHarvest }) {
  const { t } = useI18n()
  const completed = tasks.filter((task) => task.status === 'completed').length
  const total = tasks.length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div
      className="bg-[#ffdbcd] rounded-[2rem] p-6 border border-[#ff9e72]/30 shadow-sm relative overflow-hidden"
      style={innerGlow()}
    >
      <div className="relative z-10">
        <p className="text-[12px] font-semibold text-[#76320f] uppercase mb-2" style={{ fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.02em' }}>
          {t('panorama.dailyGoal')}
        </p>
        <p className="text-[24px] font-bold text-[#360f00] mb-4" style={{ lineHeight: '1.3', fontFamily: 'Plus Jakarta Sans' }}>
          {percent}% {t('panorama.tended')}
        </p>
        <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#954924] rounded-full"
            style={{ width: `${percent}%`, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}
          />
        </div>
        <button
          onClick={onScheduleHarvest}
          className="mt-6 w-full py-3 bg-[#954924] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-transform active:translate-y-0.5"
          style={{ fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.02em', boxShadow: '0 4px 0 0 #76320f', ...innerGlow() }}
        >
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          {t('panorama.scheduleHarvest')}
        </button>
      </div>
      <div className="absolute -bottom-4 -right-4 opacity-10">
        <span className="material-symbols-outlined text-[120px]">agriculture</span>
      </div>
    </div>
  )
}

// ─── Right Panel ─────────────────────────────────────────────

function CropZoneCard({ plot, onClick, t }) {
  if (!plot) return null
  const cfg = plot.cropType ? CROP_CONFIG[plot.cropType] : null
  const status = plot.status || 'empty'
  const statusBadge = status === 'ready'
    ? { label: t('panorama.harvestReady'), bg: 'bg-[#4CAF50]/10', text: 'text-[#4CAF50]', border: 'border-[#4CAF50]/20', cls: 'Harvest Ready' }
    : status === 'growing'
    ? { label: t('panorama.status.growing'), bg: 'bg-[#FF9800]/10', text: 'text-[#FF9800]', border: 'border-[#FF9800]/20', cls: 'Growing' }
    : { label: t('panorama.status.empty'), bg: 'bg-[#9E9E9E]/10', text: 'text-[#9E9E9E]', border: 'border-[#9E9E9E]/20', cls: 'Empty' }
  const badge = statusBadge

  return (
      <div
        className="bg-white rounded-[2rem] border border-[#c2c9b9] p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-[#4CAF50]/10 rounded-2xl">
            <span className="material-symbols-outlined text-[#4CAF50] text-[24px]">potted_plant</span>
          </div>
          <span className={`${badge.bg} ${badge.text} text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${badge.border}`}
            style={{ fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.05em' }}
          >
            {badge.label}
          </span>
        </div>
        <h4 className="text-xs font-semibold text-[#1d1c16] mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          {plot.name}
        </h4>
        <p className="text-xs text-[#42493d] mb-4">
          {cfg ? `${t('panorama.currentCrop')}: ${cfg.name}` : t('panorama.status.empty')}
        </p>
        {cfg && (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-[10px] text-[#42493d] uppercase mb-1" style={{ letterSpacing: '-0.01em' }}>{t('panorama.growth')}</p>
              <div className="h-2 bg-[#f8f3ea] rounded-full overflow-hidden">
                <div className="h-full bg-[#4CAF50]" style={{ width: `${plot.growthPercent}%` }} />
              </div>
            </div>
            <span className="text-[24px] font-bold text-[#4CAF50]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              {plot.growthPercent}%
            </span>
          </div>
        )}
      </div>
    )
}

function LivestockZoneCard({ pen, onClick, t }) {
  if (!pen) return null
  const cfg = pen.livestockType ? LIVESTOCK_CONFIG[pen.livestockType] : null
  const status = pen.status || 'empty'
  const statusBadge = status === 'active'
    ? { label: t('panorama.status.active'), bg: 'bg-[#4CAF50]/10', text: 'text-[#4CAF50]', border: 'border-[#4CAF50]/20' }
    : status === 'hungry'
    ? { label: t('panorama.status.hungry'), bg: 'bg-[#F44336]/10', text: 'text-[#F44336]', border: 'border-[#F44336]/20' }
    : { label: t('panorama.status.empty'), bg: 'bg-[#9E9E9E]/10', text: 'text-[#9E9E9E]', border: 'border-[#9E9E9E]/20' }
  const badge = statusBadge
  const eggs = Math.floor(pen.accumulatedProduction || 0)
  const feedLevel = Math.max(0, 100 - Math.round(pen.hungerPercent || 0))

  return (
    <div
      className="bg-white rounded-[2rem] border border-[#c2c9b9] p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-[#ff9e72]/20 rounded-2xl">
          <span className="material-symbols-outlined text-[#954924] text-[24px]">pets</span>
        </div>
        <span className={`${badge.bg} ${badge.text} text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${badge.border}`}
          style={{ fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.05em' }}
        >
          {badge.label}
        </span>
      </div>
      <h4 className="text-xs font-semibold text-[#1d1c16] mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>
        {pen.name}
      </h4>
      <p className="text-xs text-[#42493d] mb-4">
        {cfg ? `${pen.count} × ${cfg.name}` : t('panorama.status.empty')}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#f8f3ea] p-2 rounded-xl text-center">
          <p className="text-[10px] uppercase text-[#42493d] mb-1" style={{ letterSpacing: '-0.01em' }}>{t('panorama.eggsToday')}</p>
          <p className="text-[24px] font-bold text-[#1d1c16]" style={{ fontFamily: 'Plus Jakarta Sans' }}>{eggs}</p>
        </div>
        <div className="bg-[#f8f3ea] p-2 rounded-xl text-center">
          <p className="text-[10px] uppercase text-[#42493d] mb-1" style={{ letterSpacing: '-0.01em' }}>{t('panorama.feedLevel')}</p>
          <p className="text-[24px] font-bold text-[#1d1c16]" style={{ fontFamily: 'Plus Jakarta Sans' }}>{feedLevel}%</p>
        </div>
      </div>
    </div>
  )
}

function EventZoneCard({ tasks, onClick, t }) {
  const nextTask = tasks.find((task) => task.status === 'pending')
  return (
    <div
      className="bg-white rounded-[2rem] border border-[#c2c9b9] p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-[#00617a]/10 rounded-2xl">
          <span className="material-symbols-outlined text-[#00617a] text-[24px]">deck</span>
        </div>
        <span className="bg-[#00617a]/10 text-[#00617a] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#00617a]/20"
          style={{ fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.05em' }}
        >
          {t('panorama.scheduled')}
        </span>
      </div>
      <h4 className="text-xs font-semibold text-[#1d1c16] mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>
        {t('panorama.patioDining')}
      </h4>
      <p className="text-xs text-[#42493d] mb-4">
        {nextTask ? `${t('panorama.nextEvent')}: ${nextTask.label}` : t('panorama.noEvent')}
      </p>
      {nextTask && (
        <div className="flex items-center gap-2 text-[#42493d]">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          <span className="text-xs">
            {nextTask.urgency === 'overdue' ? t('panorama.overdue') : t('panorama.today')}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────

export default function PanoramaPage() {
  const { state, actions } = useContext(FarmContext)
  const { t } = useI18n()
  const navigate = useNavigate()

  const { plots, pens, sections, tasks } = state

  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [showSheet, setShowSheet] = useState(false)

  // Compute "best" item for each zone card
  const bestCrop = plots
    .filter((p) => p.status === 'ready')
    .sort((a, b) => b.growthPercent - a.growthPercent)[0]
    || plots
        .filter((p) => p.cropType && p.status !== 'empty')
        .sort((a, b) => b.growthPercent - a.growthPercent)[0]
    || plots.find((p) => p.status === 'empty')

  const bestPen = pens
    .filter((p) => p.livestockType && p.status !== 'locked' && p.status !== 'empty')
    .sort((a, b) => (b.accumulatedProduction || 0) - (a.accumulatedProduction || 0))[0]
    || pens.find((p) => p.status !== 'locked')

  const handleCardClick = useCallback((item, itemType) => {
    setSelectedItem(item)
    setSelectedType(itemType)
    setShowSheet(true)
  }, [])

  const handleCloseSheet = useCallback(() => {
    setShowSheet(false)
    setSelectedItem(null)
    setSelectedType(null)
  }, [])

  const handleWater = useCallback(() => {
    if (selectedType === 'plot') {
      actions.waterPlot(selectedItem.id)
      setSelectedItem((prev) => prev ? { ...prev, lastWatered: Date.now() } : null)
    }
  }, [selectedItem, selectedType, actions])

  const handleFertilize = useCallback(() => {
    if (selectedType === 'plot') {
      actions.fertilizePlot(selectedItem.id)
    }
  }, [selectedItem, selectedType, actions])

  const handleHarvest = useCallback(() => {
    if (selectedType === 'plot') {
      actions.harvestPlot(selectedItem.id)
      handleCloseSheet()
    }
  }, [selectedItem, selectedType, actions])

  const handlePlant = useCallback(() => {
    navigate('/crops')
  }, [navigate])

  const handleFeed = useCallback(() => {
    if (selectedType === 'pen') {
      actions.feedLivestock(selectedItem.id)
    }
  }, [selectedItem, selectedType, actions])

  const handleCollect = useCallback(() => {
    if (selectedType === 'pen') {
      actions.collectProduction(selectedItem.id)
      handleCloseSheet()
    }
  }, [selectedItem, selectedType, actions])

  const handleScheduleHarvest = useCallback(() => {
    navigate('/crops')
  }, [navigate])

  return (
    <div className="pt-16 px-4 md:ml-64 pb-12">
      {/* Map */}
      <section
        className="bg-[#f8f3ea] rounded-[2.5rem] p-4 border border-[#c2c9b9]/40 shadow-xl relative overflow-hidden"
        style={{ aspectRatio: '1 / 1' }}
      >
        <img
          alt={t('panorama.mapAlt')}
          className="w-full h-full object-cover rounded-[2rem] border-4 border-white shadow-inner"
          src={FARM_MAP_URL}
          style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)' }}
        />

        {/* Legend overlay — top left */}
        <div className="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-[#c2c9b9]/30">
          <p className="text-[10px] font-bold text-[#42493d] uppercase tracking-wider mb-2"
            style={{ fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.05em' }}>
            {t('panorama.farmLegend')}
          </p>
          <div className="space-y-1.5">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: section.color }} />
                <span className="text-xs font-medium text-[#1d1c16] truncate"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  {section.name?.zh || section.name?.en || section.id}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Panels below map on mobile, side-by-side on lg+ */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <aside className="space-y-6 order-2 lg:order-1">
          <LegendPanel sections={sections} />
          <DailyGoalCard tasks={tasks} onScheduleHarvest={handleScheduleHarvest} />
        </aside>

        {/* Right Panel */}
        <aside className="lg:col-span-2 space-y-4 order-1 lg:order-2">
          <h3 className="text-[24px] font-bold text-[#1d1c16] px-2"
            style={{ lineHeight: '1.3', fontFamily: 'Plus Jakarta Sans' }}>
            {t('panorama.zoneDetails')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CropZoneCard
              plot={bestCrop}
              onClick={() => bestCrop && handleCardClick(bestCrop, 'plot')}
              t={t}
            />
            <LivestockZoneCard
              pen={bestPen}
              onClick={() => bestPen && handleCardClick(bestPen, 'pen')}
              t={t}
            />
            <EventZoneCard
              tasks={tasks}
              onClick={() => navigate('/')}
              t={t}
            />
          </div>
        </aside>
      </div>

      {/* Item Detail Sheet */}
      {showSheet && selectedItem && (
        <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
          <ItemDetailSheet
            item={selectedItem}
            itemType={selectedType}
            onWater={handleWater}
            onFertilize={handleFertilize}
            onHarvest={handleHarvest}
            onPlant={handlePlant}
            onFeed={handleFeed}
            onCollect={handleCollect}
            onClose={handleCloseSheet}
            onViewDetails={() => {
              if (selectedType === 'plot') navigate('/crops')
              else if (selectedType === 'pen') navigate('/livestock')
            }}
            t={t}
          />
        </div>
      )}
    </div>
  )
}
