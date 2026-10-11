import { useState, useCallback, useEffect } from 'react'

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

  // Theme mode with LocalStorage persistence
  const [themeMode, setThemeMode] = useState(() => {
    try {
      return localStorage.getItem('readme_ide_theme') || 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('readme_ide_theme', themeMode)
    } catch (err) {
      console.warn('Failed saving readme_ide_theme:', err)
    }
  }, [themeMode])

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
    cursorPosition,
    setCursorPosition,
    scrollToHeadingTarget,
    setScrollToHeadingTarget,
    editorEngine,
    setEditorEngine
  }
}
