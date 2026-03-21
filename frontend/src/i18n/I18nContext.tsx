import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  type PropsWithChildren,
} from 'react'
import { LANGUAGE_STORAGE_KEY, type Language, translations } from './translations'

interface I18nContextValue {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
  t: (key: string, vars?: Record<string, string | number>) => string
  locale: string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) {
    return template
  }

  return Object.entries(vars).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(value))
  }, template)
}

function getInitialLang(): Language {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return stored === 'ar' ? 'ar' : 'en'
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [lang, setLangState] = useState<Language>(() => getInitialLang())

  const setLang = useCallback((next: Language) => {
    setLangState(next)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'ar' : 'en')
  }, [lang, setLang])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const message = translations[lang][key] ?? translations.en[key] ?? key
      return interpolate(message, vars)
    },
    [lang],
  )

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t,
      locale: lang === 'ar' ? 'ar-EG' : 'en-US',
    }),
    [lang, setLang, toggleLang, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider')
  }
  return context
}
