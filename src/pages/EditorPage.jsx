import { useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import FarmGrid from '../components/FarmGrid'
import ZoneTypePicker from '../components/ZoneTypePicker'
import CellEditModal from '../components/CellEditModal'
import Legend from '../components/Legend'
import { ZONE_MAP } from '../data/zoneTypes'

export default function EditorPage({ farm, updateCell, clearFarm, updateFarmName }) {
  const [selectedZone, setSelectedZone] = useState(null)
  const [selectedVariety, setSelectedVariety] = useState(null)
  const [editingCell, setEditingCell] = useState(null)
  const [lastPaintedId, setLastPaintedId] = useState(null)

  const handleCellClick = useCallback(
    (cell) => {
      const isEmpty = !cell.zoneType

      if (isEmpty) {
        // Paint mode: place selected zone+variety
        if (selectedZone && selectedVariety) {
          updateCell(cell.id, {
            zoneType: selectedZone.id,
            variety: selectedVariety,
            status: 'planted',
            name: undefined,
          })
          setLastPaintedId(cell.id)
        }
      } else {
        // Occupied: open edit modal
        setEditingCell(cell)
      }
    },
    [selectedZone, selectedVariety, updateCell]
  )

  function handleModalSave(updates) {
    if (!editingCell) return
    updateCell(editingCell.id, updates)
    setEditingCell(null)
  }

  function handleModalDelete() {
    if (!editingCell) return
    updateCell(editingCell.id, {
      zoneType: undefined,
      variety: undefined,
      name: undefined,
      status: 'empty',
    })
    setEditingCell(null)
  }

  // Count stats
  const totalPlanted = farm.cells.filter((c) => c.zoneType).length
  const totalHarvested = farm.cells.filter((c) => c.status === 'harvested').length

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0FDF4' }}>
      <Navbar
        farmName={farm.name}
        onFarmNameChange={updateFarmName}
        isEditor={true}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <aside
          className="w-60 flex-shrink-0 bg-white border-r border-gray-100 shadow-sm overflow-hidden flex flex-col"
          style={{ minHeight: 'calc(100vh - 56px)' }}
        >
          <ZoneTypePicker
            selectedZone={selectedZone}
            selectedVariety={selectedVariety}
            onSelectZone={setSelectedZone}
            onSelectVariety={setSelectedVariety}
            onClearFarm={clearFarm}
          />
        </aside>

        {/* Right Canvas */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-green-100 flex items-center gap-2">
              <span className="text-green-600 font-bold text-lg">{totalPlanted}</span>
              <span className="text-gray-500 text-sm">/ 100 格已使用</span>
            </div>
            {totalHarvested > 0 && (
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-yellow-100 flex items-center gap-2">
                <span className="text-yellow-600 font-bold text-lg">{totalHarvested}</span>
                <span className="text-gray-500 text-sm">格已收获</span>
              </div>
            )}

            {/* Active paint indicator */}
            {selectedZone && selectedVariety && (
              <div
                className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-xl text-white text-sm font-medium shadow-sm"
                style={{ backgroundColor: selectedZone.color }}
              >
                <span>{selectedZone.emoji}</span>
                <span>{selectedVariety}</span>
                <span className="opacity-80">— 点击空格绘制</span>
              </div>
            )}
          </div>

          {/* Grid card */}
          <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
            <FarmGrid
              cells={farm.cells}
              onCellClick={handleCellClick}
              isEditor={true}
              selectedCellId={lastPaintedId}
            />
          </div>

          {/* Legend */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-50 px-4 py-3">
            <Legend />
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {editingCell && (
        <CellEditModal
          cell={editingCell}
          onSave={handleModalSave}
          onDelete={handleModalDelete}
          onClose={() => setEditingCell(null)}
        />
      )}
    </div>
  )
}
