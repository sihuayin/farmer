import { useContext, useState } from 'react'
import { FarmContext } from '../../hooks/useFarm'
import { useI18n } from '../../i18n'
import FAB from '../../components/layout/FAB'

const CATEGORIES = [
  { key: 'all', labelKey: 'inventory.allItems', icon: 'filter_list' },
  { key: 'seed', labelKey: 'inventory.seeds', icon: 'psychology' },
  { key: 'produce', labelKey: 'inventory.produce', icon: 'local_florist' },
  { key: 'tool', labelKey: 'inventory.tools', icon: 'construction' },
  { key: 'resource', labelKey: 'inventory.resources', icon: 'science' },
]

function InventoryCard({ item, onSell, onBuy, t }) {
  const isSeed = item.category === 'seed'
  const isProduce = item.category === 'produce'
  const hasItems = item.count > 0

  const slotBg = isSeed ? '#dcfce7' : isProduce ? '#ffedd5' : '#f1f5f9'
  const badgeBg = isSeed ? 'bg-primary-container text-on-primary-container' : isProduce ? 'bg-secondary-container text-on-secondary-container' : 'bg-stone-800 text-stone-50'

  return (
    <div className="bg-surface-container-low rounded-3xl p-5 border border-stone-200/50 shadow-sm flex flex-col">
      <div
        className="aspect-square rounded-[2rem] mb-4 relative overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: slotBg }}
      >
        <span className="text-6xl opacity-80">{item.emoji}</span>
        {item.count > 0 && (
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full font-bold shadow-sm text-xs ${badgeBg}`}>
            x{item.count}
          </span>
        )}
      </div>

      <div className="flex-grow">
        <h3 className="font-bold text-sm text-stone-900 leading-tight">{item.name}</h3>
        <p className="text-[10px] text-stone-500 capitalize mb-4">
          {item.category === 'seed' ? t('inventory.tier', { n: 1 }) : item.category === 'produce' ? t('inventory.fresh') : item.category}
        </p>

        {isProduce && hasItems && (
          <div className="bg-emerald-50 text-emerald-800 p-2 rounded-lg text-[10px] flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            {t('inventory.marketPrice')}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-auto">
        {isSeed ? (
          <button
            onClick={() => onBuy(item.id, item.costPoints)}
            className="flex-grow bg-secondary text-on-secondary py-2 rounded-xl tactile-btn font-bold flex items-center justify-center gap-1 text-[10px]"
          >
            {t('inventory.buy')} ({item.costPoints} {t('common.points')})
          </button>
        ) : isProduce && hasItems ? (
          <button
            onClick={() => onSell(item.id)}
            className="flex-grow bg-secondary text-on-secondary py-2 rounded-xl tactile-btn font-bold text-[10px]"
          >
            {t('inventory.sellAll')} ({item.count}×{item.sellPoints}={item.count * item.sellPoints})
          </button>
        ) : !isProduce && hasItems ? (
          <button className="flex-grow bg-primary text-on-primary py-2 rounded-xl tactile-btn font-bold text-[10px]">
            {t('inventory.equip')}
          </button>
        ) : (
          <span className="flex-grow text-center text-stone-400 text-[10px] py-2">{t('inventory.noStock')}</span>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sublabel, color, bgClass }) {
  return (
    <div className="bg-surface-container-high rounded-3xl p-5 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgClass}`}>
        <span className={`material-symbols-outlined text-2xl ${color}`} style={{ fontSize: '28px' }}>{icon}</span>
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-end mb-1">
          <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">{label}</span>
          <span className={`text-[10px] font-bold ${color}`}>{sublabel}</span>
        </div>
        <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
          <div className={`h-full ${bgClass.includes('bg-primary') ? 'bg-primary' : bgClass.includes('bg-secondary') ? 'bg-secondary' : 'bg-tertiary'} rounded-full shadow-inner`} style={{ width: value }} />
        </div>
      </div>
    </div>
  )
}

export default function InventoryPage() {
  const { state, actions } = useContext(FarmContext)
  const { t } = useI18n()
  const { inventory } = state
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all' ? inventory : inventory.filter((i) => i.category === activeCategory)
  const totalItems = inventory.reduce((sum, i) => sum + i.count, 0)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-1">{t('inventory.title')}</h1>
          <p className="text-stone-500 max-w-xl text-sm">{t('inventory.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all text-sm ${
                activeCategory === cat.key
                  ? 'bg-primary text-on-primary shadow-lg tactile-btn'
                  : 'bg-surface-container-high text-stone-600 hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
              {t(cat.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon="warehouse" label={t('inventory.storageCapacity')} value="62%" sublabel={`${totalItems} / 1200`} color="text-tertiary" bgClass="bg-tertiary/10" />
        <StatCard icon="water_drop" label={t('inventory.irrigationSupply')} value="85%" sublabel="85%" color="text-primary" bgClass="bg-primary/10" />
        <StatCard icon="bolt" label={t('inventory.farmEnergy')} value="42%" sublabel="42%" color="text-secondary" bgClass="bg-secondary/10" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <InventoryCard
            key={item.id}
            item={item}
            onSell={actions.sellInventoryItem}
            onBuy={actions.buySeed}
            t={t}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-stone-400">
            <span className="material-symbols-outlined text-4xl mb-2 block">inventory_2</span>
            <p className="text-sm">{t('inventory.noStock')}</p>
          </div>
        )}
      </div>

      <FAB />
    </div>
  )
}
