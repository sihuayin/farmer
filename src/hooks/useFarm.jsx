import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

// ============================================================
// 常量配置
// ============================================================

export const TICK_INTERVAL = 1000 // 计时器 tick 间隔 (ms)

export const CROP_CONFIG = {
  carrot: {
    name: 'Heritage Carrots',
    emoji: '🥕',
    baseGrowthTime: 14 * 60 * 1000, // 14分钟（演示用）
    waterBonus: 15,
    fertilizeBonus: 10,
    harvestYield: 10,
    yieldItem: 'carrot',
    color: '#FF9800',
  },
  tomato: {
    name: 'Cherry Tomatoes',
    emoji: '🍅',
    baseGrowthTime: 20 * 60 * 1000,
    waterBonus: 15,
    fertilizeBonus: 10,
    harvestYield: 12,
    yieldItem: 'tomato',
    color: '#F44336',
  },
  cabbage: {
    name: 'Savoy Cabbage',
    emoji: '🥬',
    baseGrowthTime: 10 * 60 * 1000,
    waterBonus: 15,
    fertilizeBonus: 10,
    harvestYield: 8,
    yieldItem: 'cabbage',
    color: '#4CAF50',
  },
}

export const LIVESTOCK_CONFIG = {
  sheep: {
    name: 'Merino Sheep',
    emoji: '🐑',
    hungerDrainRate: 0.5,
    feedRestore: 30,
    productionAccumTime: 30 * 60 * 1000,
    productionYield: 1.5,
    productionItem: 'wool',
    color: '#E8E0D0',
  },
  chicken: {
    name: 'Leghorn Hens',
    emoji: '🐔',
    hungerDrainRate: 1.0,
    feedRestore: 25,
    productionAccumTime: 10 * 60 * 1000,
    productionYield: 1,
    productionItem: 'egg',
    color: '#D4A843',
  },
}

export const POINTS_REWARDS = {
  harvestCrop: 10,
  harvestLivestock: 5,
  completeTask: 20,
}

export const PEN_UNLOCK_COST = 500

// ============================================================
// 初始数据工厂
// ============================================================

function createInitialPlot(overrides = {}) {
  return {
    id: '',
    name: '',
    cropType: null,
    growthPercent: 0,
    status: 'empty',
    plantedAt: null,
    lastWatered: null,
    lastFertilized: null,
    ...overrides,
  }
}

function createInitialPen(overrides = {}) {
  return {
    id: '',
    name: '',
    livestockType: null,
    count: 0,
    healthPercent: 100,
    hungerPercent: 0,
    accumulatedProduction: 0,
    lastProductionAt: null,
    lastFedAt: null,
    status: 'empty',
    ...overrides,
  }
}

const INITIAL_PLOTS = [
  createInitialPlot({ id: 'p1', name: 'Plot A-1', cropType: 'carrot', growthPercent: 65, status: 'growing', plantedAt: Date.now() - 9 * 60 * 1000, lastWatered: Date.now() - 5 * 60 * 1000 }),
  createInitialPlot({ id: 'p2', name: 'Plot B-4', cropType: 'tomato', growthPercent: 92, status: 'growing', plantedAt: Date.now() - 18 * 60 * 1000, lastWatered: Date.now() - 2 * 60 * 1000 }),
  createInitialPlot({ id: 'p3', name: 'Plot C-2', cropType: 'cabbage', growthPercent: 30, status: 'growing', plantedAt: Date.now() - 3 * 60 * 1000 }),
  createInitialPlot({ id: 'p4', name: 'Plot D-1', status: 'empty' }),
  createInitialPlot({ id: 'p5', name: 'Plot D-2', status: 'empty' }),
  createInitialPlot({ id: 'p6', name: 'Plot E-1', status: 'empty' }),
  createInitialPlot({ id: 'p7', name: 'Plot E-2', status: 'empty' }),
  createInitialPlot({ id: 'p8', name: 'Plot F-1', status: 'empty' }),
]

const INITIAL_PENS = [
  createInitialPen({ id: 'pen1', name: 'Highland Meadow', livestockType: 'sheep', count: 12, healthPercent: 94, hungerPercent: 20, accumulatedProduction: 18.5, lastProductionAt: Date.now() - 5 * 60 * 1000, status: 'active' }),
  createInitialPen({ id: 'pen2', name: 'Sunrise Coop', livestockType: 'chicken', count: 24, healthPercent: 88, hungerPercent: 72, accumulatedProduction: 42, lastProductionAt: Date.now() - 3 * 60 * 1000, status: 'hungry' }),
  createInitialPen({ id: 'pen3', name: 'Pen C', status: 'locked' }),
  createInitialPen({ id: 'pen4', name: 'Pen D', status: 'locked' }),
]

const INITIAL_TASKS = [
  { id: 't1', label: 'Water Sector B', icon: 'water_drop', status: 'pending', urgency: 'overdue', createdAt: Date.now() - 2 * 60 * 60 * 1000 },
  { id: 't2', label: 'Feed Chickens', icon: 'grain', status: 'pending', urgency: 'scheduled', targetTime: Date.now() + 17 * 60 * 60 * 1000 },
  { id: 't3', label: 'Restock Fertilizer', icon: 'science', status: 'completed', createdAt: Date.now() - 24 * 60 * 60 * 1000 },
  { id: 't4', label: 'Harvest Tomatoes', icon: 'eco', status: 'pending', urgency: 'normal', targetTime: Date.now() + 48 * 60 * 60 * 1000 },
]

const INITIAL_INVENTORY = [
  { id: 'seed-carrot', name: 'Carrot Seeds', category: 'seed', count: 20, emoji: '🥕', costPoints: 50 },
  { id: 'seed-tomato', name: 'Tomato Seeds', category: 'seed', count: 15, emoji: '🍅', costPoints: 60 },
  { id: 'seed-cabbage', name: 'Cabbage Seeds', category: 'seed', count: 10, emoji: '🥬', costPoints: 40 },
  { id: 'carrot', name: 'Harvested Carrots', category: 'produce', count: 0, emoji: '🥕', sellPoints: 10 },
  { id: 'tomato', name: 'Harvested Tomatoes', category: 'produce', count: 0, emoji: '🍅', sellPoints: 12 },
  { id: 'cabbage', name: 'Harvested Cabbage', category: 'produce', count: 0, emoji: '🥬', sellPoints: 8 },
  { id: 'wool', name: 'Wool', category: 'produce', count: 0, emoji: '🧶', sellPoints: 30 },
  { id: 'egg', name: 'Egg', category: 'produce', count: 0, emoji: '🥚', sellPoints: 5 },
  { id: 'trowel', name: 'Iron Trowel', category: 'tool', count: 1, emoji: '🔧', sellPoints: 0 },
  { id: 'fertilizer', name: 'Mineral Fertilizer', category: 'resource', count: 5, emoji: '🧪', sellPoints: 15 },
  { id: 'feed', name: 'Animal Feed', category: 'resource', count: 10, emoji: '🌾', sellPoints: 5 },
]

const DEFAULT_STATE = {
  name: 'Farmstead Alpha',
  points: 4250,
  plots: INITIAL_PLOTS,
  pens: INITIAL_PENS,
  inventory: INITIAL_INVENTORY,
  tasks: INITIAL_TASKS,
  unlockedPenCount: 2,
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

// ============================================================
// 计算函数
// ============================================================

function calcGrowthPercent(plot, now = Date.now()) {
  if (!plot.cropType || !plot.plantedAt) return 0
  const cfg = CROP_CONFIG[plot.cropType]
  const elapsed = now - plot.plantedAt
  const raw = (elapsed / cfg.baseGrowthTime) * 100
  let bonus = 0
  if (plot.lastWatered && now - plot.lastWatered < 60 * 60 * 1000) {
    bonus += cfg.waterBonus * 0.5
  }
  if (plot.lastFertilized && now - plot.lastFertilized < 60 * 60 * 1000) {
    bonus += cfg.fertilizeBonus * 0.3
  }
  return Math.min(100, Math.floor(raw + bonus))
}

function calcHungerPercent(pen, now = Date.now()) {
  if (!pen.livestockType || !pen.lastFedAt) return pen.hungerPercent || 0
  const cfg = LIVESTOCK_CONFIG[pen.livestockType]
  const elapsed = now - pen.lastFedAt
  const drain = (elapsed / (30 * 60 * 1000)) * cfg.hungerDrainRate * 100
  return Math.min(100, pen.hungerPercent + drain)
}

function calcAccumulatedProduction(pen, now = Date.now()) {
  if (!pen.livestockType || !pen.lastProductionAt) return pen.accumulatedProduction || 0
  const cfg = LIVESTOCK_CONFIG[pen.livestockType]
  const elapsed = now - pen.lastProductionAt
  const units = Math.floor(elapsed / cfg.productionAccumTime)
  return pen.accumulatedProduction + units * cfg.productionYield
}

function saveToStorage(state) {
  try {
    localStorage.setItem('harvesthub_farm', JSON.stringify(state))
  } catch (e) {
    console.warn('Failed to save farm state:', e)
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('harvesthub_farm')
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Failed to load farm state:', e)
  }
  return null
}

// ============================================================
// Context
// ============================================================

export const FarmContext = createContext(null)

// ============================================================
// Provider
// ============================================================

export function FarmProvider({ children }) {
  const saved = loadFromStorage()
  const [state, setState] = useState(saved ?? DEFAULT_STATE)
  const saveTimer = useRef(null)

  const scheduleSave = useCallback((newState) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveToStorage({ ...newState, updatedAt: Date.now() })
    }, 500)
  }, [])

  // Game tick
  useEffect(() => {
    const tick = () => {
      setState((prev) => {
        const now = Date.now()

        const plots = prev.plots.map((plot) => {
          if (!plot.cropType || plot.status === 'ready') return plot
          const newGrowth = calcGrowthPercent(plot, now)
          return {
            ...plot,
            growthPercent: newGrowth,
            status: newGrowth >= 100 ? 'ready' : 'growing',
          }
        })

        const pens = prev.pens.map((pen) => {
          if (!pen.livestockType || pen.status === 'empty' || pen.status === 'locked') return pen
          const newHunger = calcHungerPercent(pen, now)
          const newAccum = calcAccumulatedProduction(pen, now)
          return {
            ...pen,
            hungerPercent: newHunger,
            accumulatedProduction: newAccum,
            status: newHunger >= 80 ? 'hungry' : 'active',
          }
        })

        const next = { ...prev, plots, pens }
        scheduleSave(next)
        return next
      })
    }

    const interval = setInterval(tick, TICK_INTERVAL)
    tick()
    return () => clearInterval(interval)
  }, [scheduleSave])

  // ============================================================
  // Actions
  // ============================================================

  const waterPlot = useCallback((plotId) => {
    setState((prev) => {
      const plots = prev.plots.map((p) =>
        p.id === plotId ? { ...p, lastWatered: Date.now() } : p
      )
      const next = { ...prev, plots }
      scheduleSave(next)
      return next
    })
  }, [scheduleSave])

  const fertilizePlot = useCallback((plotId) => {
    setState((prev) => {
      const fertItem = prev.inventory.find((i) => i.id === 'fertilizer')
      if (!fertItem || fertItem.count <= 0) return prev
      const inv = prev.inventory.map((item) =>
        item.id === 'fertilizer' ? { ...item, count: item.count - 1 } : item
      )
      const plots = prev.plots.map((p) =>
        p.id === plotId ? { ...p, lastFertilized: Date.now() } : p
      )
      const next = { ...prev, inventory: inv, plots }
      scheduleSave(next)
      return next
    })
  }, [scheduleSave])

  const harvestPlot = useCallback((plotId) => {
    setState((prev) => {
      const plot = prev.plots.find((p) => p.id === plotId)
      if (!plot || plot.status !== 'ready') return prev
      const cfg = CROP_CONFIG[plot.cropType]
      const inv = prev.inventory.map((item) =>
        item.id === cfg.yieldItem ? { ...item, count: item.count + cfg.harvestYield } : item
      )
      const plots = prev.plots.map((p) =>
        p.id === plotId ? createInitialPlot({ id: plotId, name: p.name }) : p
      )
      const next = {
        ...prev,
        inventory: inv,
        plots,
        points: prev.points + POINTS_REWARDS.harvestCrop,
      }
      scheduleSave(next)
      return next
    })
  }, [scheduleSave])

  const plantPlot = useCallback((plotId, cropType) => {
    setState((prev) => {
      const seedId = `seed-${cropType}`
      const seed = prev.inventory.find((i) => i.id === seedId)
      if (!seed || seed.count <= 0) return prev
      const inv = prev.inventory.map((item) =>
        item.id === seedId ? { ...item, count: item.count - 1 } : item
      )
      const plots = prev.plots.map((p) =>
        p.id === plotId
          ? {
              ...p,
              cropType,
              growthPercent: 0,
              status: 'growing',
              plantedAt: Date.now(),
              lastWatered: null,
              lastFertilized: null,
            }
          : p
      )
      const next = { ...prev, inventory: inv, plots }
      scheduleSave(next)
      return next
    })
  }, [scheduleSave])

  const feedLivestock = useCallback((penId) => {
    setState((prev) => {
      const feedItem = prev.inventory.find((i) => i.id === 'feed')
      if (!feedItem || feedItem.count <= 0) return prev
      const pen = prev.pens.find((p) => p.id === penId)
      if (!pen || !pen.livestockType) return prev
      const cfg = LIVESTOCK_CONFIG[pen.livestockType]
      const inv = prev.inventory.map((item) =>
        item.id === 'feed' ? { ...item, count: item.count - 1 } : item
      )
      const pens = prev.pens.map((p) =>
        p.id === penId
          ? { ...p, hungerPercent: Math.max(0, p.hungerPercent - cfg.feedRestore), lastFedAt: Date.now(), status: 'active' }
          : p
      )
      const next = { ...prev, inventory: inv, pens }
      scheduleSave(next)
      return next
    })
  }, [scheduleSave])

  const collectProduction = useCallback((penId) => {
    setState((prev) => {
      const pen = prev.pens.find((p) => p.id === penId)
      if (!pen || pen.accumulatedProduction <= 0) return prev
      const cfg = LIVESTOCK_CONFIG[pen.livestockType]
      const inv = prev.inventory.map((item) =>
        item.id === cfg.productionItem
          ? { ...item, count: item.count + Math.floor(pen.accumulatedProduction) }
          : item
      )
      const pens = prev.pens.map((p) =>
        p.id === penId ? { ...p, accumulatedProduction: 0, lastProductionAt: Date.now() } : p
      )
      const next = {
        ...prev,
        inventory: inv,
        pens,
        points: prev.points + POINTS_REWARDS.harvestLivestock * Math.floor(pen.accumulatedProduction),
      }
      scheduleSave(next)
      return next
    })
  }, [scheduleSave])

  const sellInventoryItem = useCallback((itemId) => {
    setState((prev) => {
      const item = prev.inventory.find((i) => i.id === itemId)
      if (!item || item.count <= 0 || !item.sellPoints) return prev
      const sellAmount = item.count
      const inv = prev.inventory.map((i) =>
        i.id === itemId ? { ...i, count: 0 } : i
      )
      const next = { ...prev, inventory: inv, points: prev.points + sellAmount * item.sellPoints }
      scheduleSave(next)
      return next
    })
  }, [scheduleSave])

  const toggleTask = useCallback((taskId) => {
    setState((prev) => {
      const task = prev.tasks.find((t) => t.id === taskId)
      const isCompleting = task && task.status === 'pending'
      const tasks = prev.tasks.map((t) =>
        t.id === taskId ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
      )
      const next = {
        ...prev,
        tasks,
        points: isCompleting ? prev.points + POINTS_REWARDS.completeTask : prev.points,
      }
      scheduleSave(next)
      return next
    })
  }, [scheduleSave])

  const unlockPen = useCallback((penId) => {
    setState((prev) => {
      if (prev.points < PEN_UNLOCK_COST) return prev
      const pens = prev.pens.map((p) =>
        p.id === penId ? { ...p, status: 'empty' } : p
      )
      const next = {
        ...prev,
        pens,
        points: prev.points - PEN_UNLOCK_COST,
        unlockedPenCount: prev.unlockedPenCount + 1,
      }
      scheduleSave(next)
      return next
    })
  }, [scheduleSave])

  const buySeed = useCallback((seedId, costPoints) => {
    setState((prev) => {
      if (prev.points < costPoints) return prev
      const inv = prev.inventory.map((item) =>
        item.id === seedId ? { ...item, count: item.count + 1 } : item
      )
      const next = { ...prev, inventory: inv, points: prev.points - costPoints }
      scheduleSave(next)
      return next
    })
  }, [scheduleSave])

  const value = { state, actions: { waterPlot, fertilizePlot, harvestPlot, plantPlot, feedLivestock, collectProduction, sellInventoryItem, toggleTask, unlockPen, buySeed } }

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>
}

export function useFarm() {
  return useContext(FarmContext)
}
