import { useState } from 'react'
import { exportFarmPng } from '../utils/exportPng'

export default function ExportButton({ exportRef, farmName }) {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    if (exporting || !exportRef.current) return
    setExporting(true)
    try {
      await exportFarmPng(exportRef.current, farmName)
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className={`
        fixed bottom-6 right-6 z-40
        flex items-center gap-2
        bg-green-600 hover:bg-green-700
        text-white font-semibold text-sm
        px-5 py-3 rounded-xl
        shadow-lg hover:shadow-xl
        transition-all duration-200
        ${exporting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0'}
      `}
    >
      {exporting ? (
        <>
          <span className="animate-spin text-base">⟳</span>
          导出中…
        </>
      ) : (
        <>
          <span className="text-base">📷</span>
          导出 PNG
        </>
      )}
    </button>
  )
}
