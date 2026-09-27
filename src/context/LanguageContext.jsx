import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import en from '@/data/i18n/en'
import ar from '@/data/i18n/ar'
import { getNestedValue } from '@/utils/getNestedValue'

const STORAGE_KEY = 'rdc-language'
const dictionaries = { en, ar }

const LanguageContext = createContext(null)

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'ar'
  return localStorage.getItem(STORAGE_KEY) || 'ar'
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage)
  const direction = language === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
    localStorage.setItem(STORAGE_KEY, language)
  }, [language, direction])

  const setLanguage = useCallback((lang) => {
    if (dictionaries[lang]) setLanguageState(lang)
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'))
  }, [])

  const t = useCallback(
    (key) => getNestedValue(dictionaries[language], key) ?? key,
    [language],
  )

  // Picks the active locale off a bilingual content field, e.g. tr(service.name)
  // where name = { ar: '...', en: '...' } — used for mock/API content, not UI copy.
  const tr = useCallback(
    (field) => field?.[language] ?? field?.ar ?? field?.en ?? '',
    [language],
  )

  const value = useMemo(
    () => ({ language, direction, isRtl: direction === 'rtl', setLanguage, toggleLanguage, t, tr }),
    [language, direction, setLanguage, toggleLanguage, t, tr],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
