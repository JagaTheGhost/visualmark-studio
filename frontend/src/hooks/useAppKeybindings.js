import { useEffect } from 'react'
import { matchesKeybinding } from '../utils/keybindingManager'

const isStudioTabId = (id) => {
  return (
    typeof id === 'string' &&
    (id.endsWith('.studio') || id === 'settings' || id === 'shortcuts' || id === 'whats-new' || id === 'release-notes')
  )
}

/**
 * Global IDE Keyboard Shortcut Listener for VisualMark Studio.
 */
export function useAppKeybindings({
  keybindings,
  commandPaletteOpen,
  setCommandPaletteOpen,
  isCloneModalOpen,
  setIsCloneModalOpen,
  findReplaceOpen,
  setFindReplaceOpen,
  isBottomPanelOpen,
  setIsBottomPanelOpen,
  handleToggleBottomPanel,
  isZenMode,
  setIsZenMode,
  activeFile,
  handleOpenStudioTab,
  handleOpenSettingsTab,
  handleOpenShortcutsTab,
  handleGenerate,
  handleOpenNativeFile,
  handleOpenNativeFolder,
  handleSaveNativeFile,
  handleDownloadPdf,
  handleCreateUntitledFile,
  handleCloseFile,
  handleCloseStudioTab,
  setActiveActivityTab,
  setSidebarCollapsed,
  setViewMode,
  setOrientation,
  setFindReplaceMode
}) {
  useEffect(() => {
    const getKey = (id) => keybindings.find((k) => k.id === id)?.key

    const handleKeyDown = (e) => {
      // Preferences: Settings
      if (matchesKeybinding(e, getKey('pref.settings') || 'Ctrl + ,')) {
        e.preventDefault()
        handleOpenSettingsTab()
      }
      // Preferences: Shortcuts
      else if (matchesKeybinding(e, getKey('pref.shortcuts') || 'Ctrl + /')) {
        e.preventDefault()
        handleOpenShortcutsTab()
      }
      // Command Palette
      else if (
        matchesKeybinding(e, getKey('view.commandPalette') || 'Ctrl + Shift + P') ||
        e.key === 'F1' ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K'))
      ) {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
      // Toggle Primary Sidebar
      else if (matchesKeybinding(e, getKey('view.toggleSidebar') || 'Ctrl + B')) {
        e.preventDefault()
        setSidebarCollapsed((prev) => !prev)
      }
      // Create Documentation
      else if (matchesKeybinding(e, getKey('doc.create') || getKey('ai.generate') || 'Ctrl + Enter')) {
        e.preventDefault()
        handleGenerate()
      }
      // File: New Document
      else if (matchesKeybinding(e, getKey('file.new') || 'Ctrl + N')) {
        e.preventDefault()
        handleCreateUntitledFile()
      }
      // File: Close Active Tab (Ctrl + W)
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'w' || e.key === 'W') && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        if (activeFile) {
          handleCloseFile(activeFile)
        }
      }
      // File: Open File
      else if (matchesKeybinding(e, getKey('file.open') || 'Ctrl + O')) {
        e.preventDefault()
        handleOpenNativeFile()
      }
      // File: Open Folder
      else if (matchesKeybinding(e, getKey('file.openFolder') || 'Ctrl + Shift + O')) {
        e.preventDefault()
        handleOpenNativeFolder()
      }
      // File: Quick Save
      else if (matchesKeybinding(e, getKey('file.save') || 'Ctrl + S')) {
        e.preventDefault()
        handleSaveNativeFile(false)
      }
      // File: Save As
      else if (matchesKeybinding(e, getKey('file.saveAs') || 'Ctrl + Shift + S')) {
        e.preventDefault()
        handleSaveNativeFile(true)
      }
      // File: Export PDF
      else if (matchesKeybinding(e, getKey('file.exportPdf') || 'Ctrl + P')) {
        e.preventDefault()
        handleDownloadPdf()
      }
      // Navigation: Explorer
      else if (matchesKeybinding(e, getKey('nav.explorer') || 'Ctrl + Shift + E')) {
        e.preventDefault()
        setActiveActivityTab('explorer')
        setSidebarCollapsed(false)
      }
      // AI: Generator sidebar
      else if (matchesKeybinding(e, getKey('nav.generator') || 'Ctrl + Shift + G')) {
        e.preventDefault()
        setActiveActivityTab('generator')
        setSidebarCollapsed(false)
      }
      // View: Cycle View Mode
      else if (matchesKeybinding(e, getKey('view.cycleMode') || 'Ctrl + Shift + V')) {
        e.preventDefault()
        setViewMode((prev) => (prev === 'split' ? 'preview' : prev === 'preview' ? 'editor' : 'split'))
      }
      // View: Toggle Split Orientation
      else if (
        matchesKeybinding(e, getKey('view.toggleOrientation') || 'Ctrl + \\') ||
        (e.altKey && e.shiftKey && (e.key === '0' || e.code === 'Digit0'))
      ) {
        e.preventDefault()
        setOrientation((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'))
      }
      // View: Zen Mode
      else if (matchesKeybinding(e, getKey('view.toggleZen') || 'F11')) {
        e.preventDefault()
        setIsZenMode((prev) => !prev)
      }
      // Edit: Find
      else if (matchesKeybinding(e, getKey('edit.find') || 'Ctrl + F')) {
        e.preventDefault()
        setViewMode?.((prev) => (prev === 'preview' ? 'split' : prev))
        setFindReplaceMode('find')
        setFindReplaceOpen(true)
      }
      // Edit: Replace
      else if (matchesKeybinding(e, getKey('edit.replace') || 'Ctrl + H')) {
        e.preventDefault()
        setViewMode?.((prev) => (prev === 'preview' ? 'split' : prev))
        setFindReplaceMode('replace')
        setFindReplaceOpen(true)
      }
      // Studio: Badges
      else if (matchesKeybinding(e, getKey('studio.badges') || 'Ctrl + Shift + B')) {
        e.preventDefault()
        handleOpenStudioTab('badges.studio')
      }
      // Studio: Diagrams
      else if (matchesKeybinding(e, getKey('studio.diagrams') || 'Ctrl + Shift + M')) {
        e.preventDefault()
        handleOpenStudioTab('diagrams.studio')
      }
      // Studio: Tables
      else if (matchesKeybinding(e, getKey('studio.tables') || 'Ctrl + Shift + T')) {
        e.preventDefault()
        handleOpenStudioTab('tables.studio')
      }
      // Studio: Snippets
      else if (matchesKeybinding(e, getKey('studio.snippets') || 'Ctrl + Shift + K')) {
        e.preventDefault()
        handleOpenStudioTab('snippets.studio')
      }
      // Studio: Images
      else if (matchesKeybinding(e, getKey('studio.images') || 'Ctrl + Shift + I')) {
        e.preventDefault()
        handleOpenStudioTab('images.studio')
      }
      // View: Toggle System Output & Diagnostics (Ctrl + `)
      else if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.code === 'Backquote' || e.key === '~')) {
        e.preventDefault()
        handleToggleBottomPanel('output')
      }
      // View: Toggle Problems Diagnostics (Ctrl + J)
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault()
        handleToggleBottomPanel('problems')
      }
      // Escape -> Close dialogs / Return from studio tab
      else if (e.key === 'Escape') {
        if (isCloneModalOpen) setIsCloneModalOpen(false)
        else if (findReplaceOpen) setFindReplaceOpen(false)
        else if (commandPaletteOpen) setCommandPaletteOpen(false)
        else if (isBottomPanelOpen) setIsBottomPanelOpen(false)
        else if (isZenMode) setIsZenMode(false)
        else if (isStudioTabId(activeFile)) {
          handleCloseStudioTab(activeFile)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    keybindings,
    commandPaletteOpen,
    isCloneModalOpen,
    findReplaceOpen,
    isBottomPanelOpen,
    handleToggleBottomPanel,
    isZenMode,
    activeFile,
    handleOpenStudioTab,
    handleOpenSettingsTab,
    handleOpenShortcutsTab,
    handleGenerate,
    handleOpenNativeFile,
    handleOpenNativeFolder,
    handleSaveNativeFile,
    handleDownloadPdf,
    handleCreateUntitledFile,
    handleCloseFile,
    handleCloseStudioTab,
    setActiveActivityTab,
    setSidebarCollapsed,
    setViewMode,
    setOrientation,
    setFindReplaceMode,
    setCommandPaletteOpen,
    setIsCloneModalOpen,
    setFindReplaceOpen,
    setIsBottomPanelOpen,
    setIsZenMode
  ])
}
