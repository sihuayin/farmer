import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'farmer_farm'

function createDefaultFarm() {
  return {
    name: '我的农场',
    cells: Array.from({ length: 100 }, (_, i) => ({
      id: i,
      zoneType: undefined,
      variety: undefined,
      name: undefined,
      status: 'empty',
    })),
    updatedAt: Date.now(),
  }
}

function loadFarm() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Ensure we have exactly 100 cells
      if (parsed && Array.isArray(parsed.cells) && parsed.cells.length === 100) {
        return parsed
      }
    }
  } catch (e) {
    // ignore
  }
  return createDefaultFarm()
}

export function useFarm() {
  const [farm, setFarm] = useState(() => loadFarm())
  const debounceTimer = useRef(null)

  const saveFarm = useCallback((updatedFarm) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFarm))
      } catch (e) {
        // ignore
      }
    }, 500)
  }, [])

  const updateCell = useCallback(
    (cellId, updates) => {
      setFarm((prev) => {
        const cells = prev.cells.map((cell) =>
          cell.id === cellId ? { ...cell, ...updates } : cell
        )
        const next = { ...prev, cells, updatedAt: Date.now() }
        saveFarm(next)
        return next
      })
    },
    [saveFarm]
  )

  const clearFarm = useCallback(() => {
    setFarm((prev) => {
      const next = {
        ...prev,
        cells: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          zoneType: undefined,
          variety: undefined,
          name: undefined,
          status: 'empty',
        })),
        updatedAt: Date.now(),
      }
      saveFarm(next)
      return next
    })
  }, [saveFarm])

  const updateFarmName = useCallback(
    (name) => {
      setFarm((prev) => {
        const next = { ...prev, name, updatedAt: Date.now() }
        saveFarm(next)
        return next
      })
    },
    [saveFarm]
  )

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [])

  return { farm, updateCell, clearFarm, updateFarmName }
}
