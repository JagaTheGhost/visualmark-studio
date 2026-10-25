import { useState, useCallback, useEffect } from 'react'
import { normalizeThemeId, isDarkTheme } from '../themes/themeRegistry'

export function useEditorPreferences() {
  const [viewMode, setViewMode] = useState('split') // 'split' | 'editor' | 'preview'
  const [orientation, setOrientation] = useState('vertical') // 'vertical' (side-by-side) | 'horizontal' (stacked)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [fontSize, setFontSize] = useState(13)
  const [tabSize, setTabSize] = useState(2)
  const [wordWrap, setWordWrap] = useState(true)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [isZenMode, setIsZenMode] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 })
  const [scrollToHeadingTarget, setScrollToHeadingTarget] = useState('')

  // Sync scroll state with LocalStorage persistence
  const [syncScroll, setSyncScroll] = useState(() => {
    try {
      const saved = localStorage.getItem('readme_sync_scroll')
      return saved !== null ? saved === 'true' : true
    } catch {
      return true
    }
  })

  const handleSetSyncScroll = useCallback((val) => {
    setSyncScroll(val)
    try {
      localStorage.setItem('readme_sync_scroll', val ? 'true' : 'false')
    } catch (err) {
      console.warn('Failed saving readme_sync_scroll:', err)
    }
  }, [])

  // Theme mode with LocalStorage persistence & dual-mode preference support
  const [themeMode, setThemeModeState] = useState(() => {
    try {
      const stored = localStorage.getItem('readme_ide_theme')
      return stored ? normalizeThemeId(stored) : 'dark-modern'
    } catch {
      return 'dark-modern'
    }
  })

  const [preferredDarkTheme, setPreferredDarkTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('readme_preferred_dark_theme')
      return stored ? normalizeThemeId(stored) : 'dark-modern'
    } catch {
      return 'dark-modern'
    }
  })

  const [preferredLightTheme, setPreferredLightTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('readme_preferred_light_theme')
      return stored ? normalizeThemeId(stored) : 'light-modern'
    } catch {
      return 'light-modern'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('readme_ide_theme', themeMode)
    } catch (err) {
      console.warn('Failed saving readme_ide_theme:', err)
    }
  }, [themeMode])

  const setThemeMode = useCallback((id) => {
    const norm = typeof id === 'function' ? normalizeThemeId(id(themeMode)) : normalizeThemeId(id)
    setThemeModeState(norm)
    if (isDarkTheme(norm)) {
      setPreferredDarkTheme(norm)
      try { localStorage.setItem('readme_preferred_dark_theme', norm) } catch {}
    } else {
      setPreferredLightTheme(norm)
      try { localStorage.setItem('readme_preferred_light_theme', norm) } catch {}
    }
  }, [themeMode])

  const toggleThemeMode = useCallback(() => {
    setThemeModeState((curr) => {
      const isDark = isDarkTheme(curr)
      if (isDark) {
        return preferredLightTheme || 'light-modern'
      } else {
        return preferredDarkTheme || 'dark-modern'
      }
    })
  }, [preferredLightTheme, preferredDarkTheme])

  const isDarkMode = isDarkTheme(themeMode)

  // Editor Engine ('monaco' | 'classic') with LocalStorage persistence
  const [editorEngine, setEditorEngine] = useState(() => {
    try {
      return localStorage.getItem('readme_editor_engine') || 'monaco'
    } catch {
      return 'monaco'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('readme_editor_engine', editorEngine)
    } catch (err) {
      console.warn('Failed saving readme_editor_engine:', err)
    }
  }, [editorEngine])

  // Show Welcome On Startup preference
  const [showWelcomeOnStartup, setShowWelcomeOnStartup] = useState(() => {
    try {
      const stored = localStorage.getItem('readme_show_welcome_on_startup')
      return stored !== null ? stored === 'true' : true
    } catch {
      return true
    }
  })

  const handleToggleShowWelcomeOnStartup = useCallback((val) => {
    const nextVal = typeof val === 'boolean' ? val : !showWelcomeOnStartup
    setShowWelcomeOnStartup(nextVal)
    try {
      localStorage.setItem('readme_show_welcome_on_startup', String(nextVal))
    } catch (err) {
      console.warn('Failed saving readme_show_welcome_on_startup:', err)
    }
  }, [showWelcomeOnStartup])

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 10, 200))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 10, 50))
  }, [])

  const handleResetZoom = useCallback(() => {
    setZoomLevel(100)
  }, [])

  return {
    viewMode,
    setViewMode,
    orientation,
    setOrientation,
    zoomLevel,
    setZoomLevel,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    fontSize,
    setFontSize,
    tabSize,
    setTabSize,
    wordWrap,
    setWordWrap,
    showLineNumbers,
    setShowLineNumbers,
    syncScroll,
    setSyncScroll,
    handleSetSyncScroll,
    isZenMode,
    setIsZenMode,
    themeMode,
    setThemeMode,
    toggleThemeMode,
    isDarkMode,
    preferredDarkTheme,
    preferredLightTheme,
    cursorPosition,
    setCursorPosition,
    scrollToHeadingTarget,
    setScrollToHeadingTarget,
    editorEngine,
    setEditorEngine,
    showWelcomeOnStartup,
    setShowWelcomeOnStartup,
    handleToggleShowWelcomeOnStartup
  }
}
