import { useRef } from 'react'
import Navbar from '../components/Navbar'
import FarmGrid from '../components/FarmGrid'
import Legend from '../components/Legend'
import ExportButton from '../components/ExportButton'

export default function PreviewPage({ farm, updateFarmName }) {
  const exportRef = useRef(null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0FDF4' }}>
      <Navbar
        farmName={farm.name}
        onFarmNameChange={updateFarmName}
        isEditor={false}
      />

      <main className="max-w-screen-lg mx-auto px-4 py-8">
        {/* Farm title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 tracking-wide">
          {farm.name}
        </h1>

        {/* Exportable area */}
        <div ref={exportRef} className="p-6 rounded-2xl bg-white shadow-md">
          {/* Grid */}
          <div className="mb-6">
            <FarmGrid
              cells={farm.cells}
              isEditor={false}
            />
          </div>

          {/* Legend */}
          <div className="border-t border-gray-100 pt-4">
            <Legend />
          </div>
        </div>
      </main>

      <ExportButton exportRef={exportRef} farmName={farm.name} />
    </div>
  )
}
