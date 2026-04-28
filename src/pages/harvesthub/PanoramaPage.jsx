import { useState, useContext, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FarmContext } from '../../hooks/useFarm'
import { useI18n } from '../../i18n'
import PhaserPanoramaGame from '../../components/phaser/PhaserPanoramaGame'
import ItemDetailSheet from '../../components/panorama/ItemDetailSheet'
import SectionEditor from '../../components/panorama/SectionEditor'
import FAB from '../../components/layout/FAB'

export default function PanoramaPage() {
  const { state, actions } = useContext(FarmContext)
  const { t } = useI18n()
  const navigate = useNavigate()

  const { plots, pens, sections } = state

  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [showSheet, setShowSheet] = useState(false)
  const [showSectionEditor, setShowSectionEditor] = useState(false)
  const panoramaRef = useRef(null)

  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })

  const handleCellClick = useCallback((payload) => {
    setSelectedItem(payload.item)
    setSelectedType(payload.itemType)
    setShowSheet(true)
  }, [])

  const handleCloseSheet = useCallback(() => {
    setShowSheet(false)
    setSelectedItem(null)
    setSelectedType(null)
  }, [])

  const handleWater = useCallback(() => {
    if (selectedItem?.itemType === 'plot') {
      actions.waterPlot(selectedItem.id)
      // Update local state
      setSelectedItem((prev) => prev ? { ...prev, lastWatered: Date.now() } : null)
    }
  }, [selectedItem, actions])

  const handleFertilize = useCallback(() => {
    if (selectedItem?.itemType === 'plot') {
      actions.fertilizePlot(selectedItem.id)
    }
  }, [selectedItem, actions])

  const handleHarvest = useCallback(() => {
    if (selectedItem?.itemType === 'plot') {
      actions.harvestPlot(selectedItem.id)
      handleCloseSheet()
    }
  }, [selectedItem, actions])

  const handlePlant = useCallback(() => {
    if (selectedItem?.itemType === 'plot') {
      // Navigate to crops page for planting
      navigate('/crops')
    }
  }, [selectedItem, navigate])

  const handleFeed = useCallback(() => {
    if (selectedItem?.itemType === 'pen') {
      actions.feedLivestock(selectedItem.id)
    }
  }, [selectedItem, actions])

  const handleCollect = useCallback(() => {
    if (selectedItem?.itemType === 'pen') {
      actions.collectProduction(selectedItem.id)
      handleCloseSheet()
    }
  }, [selectedItem, actions])

  const handleViewDetails = useCallback(() => {
    if (selectedType === 'plot') navigate('/crops')
    else if (selectedType === 'pen') navigate('/livestock')
  }, [selectedType, navigate])

  const handleSaveSections = useCallback((newSections) => {
    actions.updateSections(newSections)
  }, [actions])

  // Section legend items
  const sectionLegend = sections || []

  return (
    <div className="pt-24 pb-32 px-4 md:px-margin max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t('panorama.title')}</h1>
          <p className="text-sm text-stone-500">{dateStr} · {state.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface rounded-full px-4 py-2 flex items-center gap-2 shadow-sm border border-outline-variant/30">
            <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
            <span className="text-sm font-medium text-stone-700">{t('panorama.weather')}</span>
          </div>
          <button
            onClick={() => setShowSectionEditor(true)}
            className="bg-surface-container-high hover:bg-surface-container-low px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm border border-outline-variant/30 transition-colors"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            {t('panorama.editSections')}
          </button>
        </div>
      </div>

      {/* Isometric Map Container */}
      <div className="bg-stone-100 rounded-[2rem] border-2 border-stone-200 shadow-xl overflow-hidden relative mb-6" style={{ height: 520 }}>
        {/* Section Legend - top left */}
        <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-stone-200">
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">{t('panorama.farmLegend')}</p>
          <div className="space-y-1.5">
            {sectionLegend.map((section) => (
              <div key={section.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: section.color }} />
                <span className="text-xs font-medium text-stone-700 truncate">
                  {section.name?.zh || section.name?.en || section.id}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Camera / Zoom controls - top right */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
          <button
            onClick={() => panoramaRef.current?.zoomIn?.()}
            className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-stone-200 flex items-center justify-center hover:bg-white transition-colors"
            title={t('panorama.zoomIn')}
          >
            <span className="material-symbols-outlined text-stone-700">add</span>
          </button>
          <button
            onClick={() => panoramaRef.current?.zoomOut?.()}
            className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-stone-200 flex items-center justify-center hover:bg-white transition-colors"
            title={t('panorama.zoomOut')}
          >
            <span className="material-symbols-outlined text-stone-700">remove</span>
          </button>
          <button
            onClick={() => panoramaRef.current?.resetZoom?.()}
            className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-stone-200 flex items-center justify-center hover:bg-white transition-colors"
            title={t('panorama.resetView')}
          >
            <span className="material-symbols-outlined text-stone-700">fit_screen</span>
          </button>
        </div>

        {/* Phaser Isometric Map */}
        <div className="w-full h-full">
          <PhaserPanoramaGame
            plots={plots}
            pens={pens}
            sections={sections}
            onCellClick={handleCellClick}
            containerRef={panoramaRef}
          />
        </div>

        {/* Bottom weather overlay */}
        <div className="absolute bottom-4 right-4 z-20 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-full border border-outline-variant/30 flex items-center gap-3 text-sm font-medium text-stone-700">
          <span className="material-symbols-outlined text-yellow-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
          <span className="text-[12px] font-bold">{t('overview.weather')}</span>
        </div>
      </div>

      {/* Item Detail Sheet */}
      {showSheet && selectedItem && (
        <div className="fixed bottom-0 left-0 right-0 z-40 animate-slideUp">
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
            onViewDetails={handleViewDetails}
            t={t}
          />
        </div>
      )}

      {/* Section Editor Modal */}
      {showSectionEditor && (
        <SectionEditor
          sections={sections}
          onSave={handleSaveSections}
          onClose={() => setShowSectionEditor(false)}
          t={t}
        />
      )}

      <FAB />
    </div>
  )
}
