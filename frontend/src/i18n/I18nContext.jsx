import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'
import es from './locales/es.json'
import ja from './locales/ja.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import ru from './locales/ru.json'
import hi from './locales/hi.json'
import ptBR from './locales/pt-BR.json'
import it from './locales/it.json'
import ta from './locales/ta.json'

export const BUILTIN_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇺🇸', dir: 'ltr', tier: 'official' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', dir: 'ltr', tier: 'official' },
  { code: 'ja', label: 'Japanese', native: '日本語', flag: '🇯🇵', dir: 'ltr', tier: 'standard' },
  { code: 'zh-CN', label: 'Chinese (Simplified)', native: '简体中文', flag: '🇨🇳', dir: 'ltr', tier: 'standard' },
  { code: 'de', label: 'German', native: 'Deutsch', flag: '🇩🇪', dir: 'ltr', tier: 'standard' },
  { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸', dir: 'ltr', tier: 'standard' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷', dir: 'ltr', tier: 'standard' },
  { code: 'ru', label: 'Russian', native: 'Русский', flag: '🇷🇺', dir: 'ltr', tier: 'standard' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', dir: 'ltr', tier: 'standard' },
  { code: 'pt-BR', label: 'Portuguese (BR)', native: 'Português', flag: '🇧🇷', dir: 'ltr', tier: 'standard' },
  { code: 'it', label: 'Italian', native: 'Italiano', flag: '🇮🇹', dir: 'ltr', tier: 'standard' },
]

export const SUPPORTED_LANGUAGES = BUILTIN_LANGUAGES

const BUILTIN_DICTIONARIES = {
  en,
  'zh-CN': zhCN,
  es,
  ja,
  de,
  fr,
  ru,
  hi,
  'pt-BR': ptBR,
  it,
  ta,
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  // Load custom languages from localStorage
  const [customPacks, setCustomPacks] = useState(() => {
    try {
      const stored = localStorage.getItem('visualmark_custom_languages')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  // Combined dictionaries
  const allDictionaries = useMemo(() => {
    const combined = { ...BUILTIN_DICTIONARIES }
    Object.entries(customPacks).forEach(([code, pack]) => {
      if (pack && pack.translations) {
        combined[code] = pack.translations
      }
    })
    return combined
  }, [customPacks])

  // Combined supported languages list
  const supportedLanguages = useMemo(() => {
    const customList = Object.entries(customPacks).map(([code, pack]) => ({
      code,
      label: pack.label || code,
      native: pack.native || pack.label || code,
      flag: pack.flag || '🌐',
      dir: pack.dir || 'ltr',
      isCustom: true,
      author: pack.author || 'Custom',
      version: pack.version || '1.0.0',
    }))
    return [...BUILTIN_LANGUAGES, ...customList]
  }, [customPacks])

  const [locale, setLocaleState] = useState(() => {
    try {
      const saved = localStorage.getItem('visualmark_language')
      if (saved && (BUILTIN_DICTIONARIES[saved] || customPacks[saved])) return saved
      // Auto-detect browser/system language
      const navLang = navigator.language || ''
      if (navLang.startsWith('zh')) return 'zh-CN'
      if (navLang.startsWith('es')) return 'es'
      if (navLang.startsWith('ja')) return 'ja'
      if (navLang.startsWith('de')) return 'de'
      if (navLang.startsWith('fr')) return 'fr'
      if (navLang.startsWith('ru')) return 'ru'
      if (navLang.startsWith('hi')) return 'hi'
      if (navLang.startsWith('pt')) return 'pt-BR'
      if (navLang.startsWith('it')) return 'it'
      if (navLang.startsWith('ta')) return 'ta'
    } catch {
      // Ignore
    }
    return 'en'
  })

  const setLocale = useCallback((newLocale) => {
    if (allDictionaries[newLocale]) {
      setLocaleState(newLocale)
      try {
        localStorage.setItem('visualmark_language', newLocale)
      } catch {
        // Ignore
      }
    }
  }, [allDictionaries])

  // Import custom language pack
  const importCustomLanguage = useCallback((pack) => {
    if (!pack || !pack.code || !pack.translations) {
      throw new Error('Invalid language pack format. Missing "code" or "translations".')
    }

    const code = pack.code.trim()
    // Deep sanitize translation strings to prevent XSS / malicious injection
    const sanitizeDict = (obj) => {
      if (!obj || typeof obj !== 'object') return {}
      const clean = {}
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string') {
          clean[k] = v.replace(/<[^>]*>/g, '').trim()
        } else if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          clean[k] = sanitizeDict(v)
        }
      }
      return clean
    }

    const sanitizedTranslations = sanitizeDict(pack.translations)

    const newPack = {
      code,
      label: (pack.label || code).replace(/<[^>]*>/g, ''),
      native: (pack.native || pack.label || code).replace(/<[^>]*>/g, ''),
      flag: pack.flag || '🌐',
      dir: pack.dir === 'rtl' ? 'rtl' : 'ltr',
      author: (pack.author || 'Community').replace(/<[^>]*>/g, ''),
      version: pack.version || '1.0.0',
      tier: 'community',
      translations: sanitizedTranslations,
    }

    setCustomPacks((prev) => {
      const updated = { ...prev, [code]: newPack }
      try {
        localStorage.setItem('visualmark_custom_languages', JSON.stringify(updated))
      } catch (err) {
        console.error('Failed to persist custom language:', err)
      }
      return updated
    })

    // Automatically switch to the imported language
    setLocaleState(code)
    try {
      localStorage.setItem('visualmark_language', code)
    } catch {
      // Ignore
    }

    return newPack
  }, [])

  // Export language pack as downloadable JSON file
  const exportLanguagePack = useCallback((codeToExport) => {
    const targetCode = codeToExport || locale
    const dict = allDictionaries[targetCode] || BUILTIN_DICTIONARIES.en
    const langMeta = supportedLanguages.find((l) => l.code === targetCode) || {
      code: targetCode,
      label: targetCode,
      native: targetCode,
      flag: '🌐',
      dir: 'ltr',
    }

    const exportData = {
      code: targetCode,
      label: langMeta.label,
      native: langMeta.native,
      flag: langMeta.flag,
      dir: langMeta.dir || 'ltr',
      author: langMeta.author || 'VisualMark User',
      version: langMeta.version || '1.0.0',
      exportedAt: new Date().toISOString(),
      translations: dict,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `visualmark-i18n-${targetCode}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [locale, allDictionaries, supportedLanguages])

  // Delete custom language
  const deleteCustomLanguage = useCallback((codeToDelete) => {
    setCustomPacks((prev) => {
      const updated = { ...prev }
      delete updated[codeToDelete]
      try {
        localStorage.setItem('visualmark_custom_languages', JSON.stringify(updated))
      } catch {
        // Ignore
      }
      return updated
    })

    if (locale === codeToDelete) {
      setLocaleState('en')
      try {
        localStorage.setItem('visualmark_language', 'en')
      } catch {
        // Ignore
      }
    }
  }, [locale])

  const isCustomLanguage = useCallback((code) => {
    return !!customPacks[code]
  }, [customPacks])

  // Compute translation coverage and completeness stats against en.json
  const getLanguageStats = useCallback((targetCode) => {
    const code = targetCode || locale
    const dict = allDictionaries[code] || BUILTIN_DICTIONARIES.en
    const baseDict = BUILTIN_DICTIONARIES.en

    let totalKeys = 0
    let translatedKeys = 0

    const countKeys = (base, target) => {
      if (!base || typeof base !== 'object') return
      for (const k of Object.keys(base)) {
        const baseVal = base[k]
        const targetVal = target ? target[k] : undefined

        if (typeof baseVal === 'object' && baseVal !== null) {
          countKeys(baseVal, typeof targetVal === 'object' ? targetVal : {})
        } else {
          totalKeys++
          if (typeof targetVal === 'string' && targetVal.trim().length > 0) {
            translatedKeys++
          }
        }
      }
    }

    countKeys(baseDict, dict)
    const percent = totalKeys > 0 ? Math.min(100, Math.round((translatedKeys / totalKeys) * 100)) : 100
    const langMeta = supportedLanguages.find((l) => l.code === code)
    const tier = langMeta?.tier || (customPacks[code] ? 'community' : 'standard')

    return {
      code,
      totalKeys,
      translatedKeys,
      percent,
      tier,
      isCustom: Boolean(customPacks[code]),
    }
  }, [locale, allDictionaries, supportedLanguages, customPacks])

  const currentDict = allDictionaries[locale] || BUILTIN_DICTIONARIES.en
  const fallbackDict = BUILTIN_DICTIONARIES.en

  const t = useCallback((key, fallback = '', vars = {}) => {
    if (!key) return fallback

    const resolveKey = (dict, path) => {
      if (!dict) return undefined
      const parts = path.split('.')
      let curr = dict
      for (const part of parts) {
        if (curr && typeof curr === 'object' && part in curr) {
          curr = curr[part]
        } else {
          return undefined
        }
      }
      return typeof curr === 'string' ? curr : undefined
    }

    let result = resolveKey(currentDict, key)
    if (result === undefined) {
      result = resolveKey(fallbackDict, key)
    }
    if (result === undefined) {
      result = fallback || key.split('.').pop()
    }

    if (vars && typeof vars === 'object' && Object.keys(vars).length > 0) {
      return result.replace(/\{(\w+)\}/g, (_, varName) => {
        return vars[varName] !== undefined ? vars[varName] : `{${varName}}`
      })
    }

    return result
  }, [currentDict, fallbackDict])

  const currentLanguage = useMemo(() => {
    return supportedLanguages.find((l) => l.code === locale) || supportedLanguages[0]
  }, [locale, supportedLanguages])

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    currentLanguage,
    supportedLanguages,
    customPacks,
    importCustomLanguage,
    exportLanguagePack,
    deleteCustomLanguage,
    isCustomLanguage,
    getLanguageStats,
  }), [
    locale,
    setLocale,
    t,
    currentLanguage,
    supportedLanguages,
    customPacks,
    importCustomLanguage,
    exportLanguagePack,
    deleteCustomLanguage,
    isCustomLanguage,
    getLanguageStats,
  ])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    return {
      locale: 'en',
      setLocale: () => {},
      t: (key, fallback) => fallback || key,
      currentLanguage: BUILTIN_LANGUAGES[0],
      supportedLanguages: BUILTIN_LANGUAGES,
      customPacks: {},
      importCustomLanguage: () => {},
      exportLanguagePack: () => {},
      deleteCustomLanguage: () => {},
      isCustomLanguage: () => false,
      getLanguageStats: () => ({ percent: 100, tier: 'official', totalKeys: 1, translatedKeys: 1 }),
    }
  }
  return context
}

export default I18nContext
