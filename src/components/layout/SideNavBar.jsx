import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../../i18n'

export default function SideNavBar() {
  const location = useLocation()
  const { t } = useI18n()

  const navItems = [
    { path: '/', labelKey: 'nav.overview', icon: 'dashboard' },
    { path: '/crops', labelKey: 'nav.crops', icon: 'potted_plant' },
    { path: '/livestock', labelKey: 'nav.livestock', icon: 'pets' },
    { path: '/inventory', labelKey: 'nav.inventory', icon: 'inventory_2' },
    { path: '/panorama', labelKey: 'nav.panorama', icon: 'visibility' },
  ]

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 border-r border-stone-200 dark:border-stone-800 fixed left-0 top-0 z-40 bg-stone-100 dark:bg-stone-950 shadow-[4px_0_24px_rgba(75,126,55,0.05)] p-4 gap-2">
      <div className="mb-8 px-2">
        <h1 className="text-lg font-extrabold text-emerald-900 dark:text-emerald-50 antialiased">{t('farmName')}</h1>
        <p className="text-stone-600 dark:text-stone-400 text-[10px] font-bold uppercase tracking-widest">{t('farmSince')}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={[
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-transform duration-200 active:scale-95',
                isActive
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800',
              ].join(' ')}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : '' }}
              >
                {item.icon}
              </span>
              <span className="text-sm">{t(item.labelKey)}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-stone-200 dark:border-stone-800 pt-4 space-y-1">
        <div className="w-full bg-secondary text-on-secondary py-3 px-4 rounded-xl font-bold tactile-btn flex items-center justify-center gap-2 text-sm">
          <span className="material-symbols-outlined">add_circle</span>
          {t('nav.planNewPlot')}
        </div>
        <button className="flex items-center gap-3 px-3 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg transition-all w-full">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm">{t('nav.settings')}</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg transition-all w-full">
          <span className="material-symbols-outlined">help_center</span>
          <span className="text-sm">{t('nav.support')}</span>
        </button>
      </div>
    </aside>
  )
}
