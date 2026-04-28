import { createContext, useContext, useState, useCallback } from 'react'
import { en } from './en'
import { zh } from './zh'

const MESSAGES = { en, zh }

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const savedLang = typeof navigator !== 'undefined'
    ? localStorage.getItem('harvesthub_lang') || 'zh'
    : 'zh'
  const [lang, setLang] = useState(savedLang)

  const t = useCallback((key, params = {}) => {
    const keys = key.split('.')
    let value = MESSAGES[lang]
    for (const k of keys) {
      value = value?.[k]
    }
    if (typeof value !== 'string') return key
    return value.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`)
  }, [lang])

  const switchLang = useCallback((newLang) => {
    if (!MESSAGES[newLang]) return
    setLang(newLang)
    localStorage.setItem('harvesthub_lang', newLang)
  }, [])

  return (
    <I18nContext.Provider value={{ lang, t, switchLang, availableLangs: Object.keys(MESSAGES) }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
