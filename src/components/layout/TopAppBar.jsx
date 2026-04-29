import { useContext } from 'react'
import { FarmContext } from '../../hooks/useFarm'
import { useI18n } from '../../i18n'

const LANG_LABELS = { en: 'EN', zh: '中文' }

export default function TopAppBar() {
  const { state } = useContext(FarmContext)
  const { lang, t, switchLang } = useI18n()
  const points = state.points ?? 0

  const nextLang = lang === 'en' ? 'zh' : 'en'

  return (
    <header className="bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200 dark:border-stone-800 shadow-sm shadow-emerald-900/5 flex justify-between items-center px-6 h-16 md:ml-64 md:w-[calc(100vw-16rem)]">
      <div className="flex items-center gap-6">
        <span className="text-xl font-bold text-emerald-900 dark:text-emerald-100 tracking-tight">{t('appName')}</span>
        <div className="relative group hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">search</span>
          <input
            className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 w-64 transition-all dark:bg-stone-800 dark:text-stone-100"
            placeholder={t('topbar.searchPlaceholder')}
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-emerald-800 dark:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors active:scale-95">
          <span className="material-symbols-outlined">{t('topbar.sunny') === 'Sunny' ? 'sunny' : 'wb_sunny'}</span>
        </button>
        <button className="p-2 text-emerald-800 dark:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors active:scale-95">
          <span className="material-symbols-outlined">calendar_month</span>
        </button>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
          <span className="material-symbols-outlined text-emerald-700 dark:text-emerald-300 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          <span className="font-bold text-emerald-900 dark:text-emerald-100 text-sm">{points.toLocaleString()}</span>
        </div>
        {/* Language Switcher */}
        <button
          onClick={() => switchLang(nextLang)}
          className="ml-2 px-3 py-1.5 bg-surface-container-high dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold rounded-lg border border-outline-variant hover:bg-surface-container-highest transition-colors"
          title="Switch Language"
        >
          {LANG_LABELS[nextLang]}
        </button>
        <div className="ml-2 h-8 w-8 rounded-full overflow-hidden border-2 border-primary-container">
          <div className="w-full h-full bg-emerald-200 flex items-center justify-center text-primary text-xs font-bold">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
        </div>
      </div>
    </header>
  )
}
