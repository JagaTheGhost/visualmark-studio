import { useEffect } from 'react'
import { matchesKeybinding } from '../utils/keybindingManager'

const isStudioTabId = (id) => {
  return (
    typeof id === 'string' &&
    (id.endsWith('.studio') || id === 'settings' || id === 'shortcuts' || id === 'whats-new' || id === 'release-notes' || id === 'welcome')
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
  handleCreateUntitledFile,
  handleCloseFile,
  handleCloseWorkspace,
  handleCloseStudioTab,
  handleCopy,
  toggleThemeMode,
  setActiveActivityTab,
  setSidebarCollapsed,
  setViewMode,
  setOrientation,
  setFindReplaceMode
}) {
  // Listen for Monaco or internal save file requests
  useEffect(() => {
    const handleSaveEvent = (e) => {
      handleSaveNativeFile?.(e.detail === true)
    }
    window.addEventListener('app-save-file', handleSaveEvent)
    return () => window.removeEventListener('app-save-file', handleSaveEvent)
  }, [handleSaveNativeFile])

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
      // Preferences: Toggle Light/Dark Theme
      else if (matchesKeybinding(e, getKey('pref.toggleTheme') || 'Ctrl + Alt + T')) {
        e.preventDefault()
        toggleThemeMode?.()
      }
      // Command Palette (also matches F1 and Ctrl+K globally)
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
      // File: Close Workspace (Ctrl + Shift + W)
      else if (matchesKeybinding(e, getKey('file.closeWorkspace') || 'Ctrl + Shift + W')) {
        e.preventDefault()
        handleCloseWorkspace?.()
      }
      // File: Close Active Tab (Ctrl + W)
      else if (matchesKeybinding(e, getKey('file.closeTab') || 'Ctrl + W') || ((e.ctrlKey || e.metaKey) && (e.key === 'w' || e.key === 'W') && !e.shiftKey && !e.altKey)) {
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
      // Clipboard: Copy Markdown
      else if (matchesKeybinding(e, getKey('edit.copyMarkdown') || 'Ctrl + Shift + C')) {
        e.preventDefault()
        handleCopy?.()
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
      // View: Split Editor & Preview
      else if (getKey('view.split') && matchesKeybinding(e, getKey('view.split'))) {
        e.preventDefault()
        setViewMode('split')
      }
      // View: Editor Only
      else if (getKey('view.editor') && matchesKeybinding(e, getKey('view.editor'))) {
        e.preventDefault()
        setViewMode('editor')
      }
      // View: Preview Only
      else if (getKey('view.preview') && matchesKeybinding(e, getKey('view.preview'))) {
        e.preventDefault()
        setViewMode('preview')
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
      // Studio: Directory Tree
      else if (matchesKeybinding(e, getKey('studio.tree') || 'Ctrl + Shift + D')) {
        e.preventDefault()
        handleOpenStudioTab('tree.studio')
      }
      // Studio: API & Endpoints
      else if (matchesKeybinding(e, getKey('studio.api') || 'Ctrl + Shift + A')) {
        e.preventDefault()
        handleOpenStudioTab('api.studio')
      }
      // Studio: README Auditor & Linter
      else if (matchesKeybinding(e, getKey('studio.audit') || 'Ctrl + Shift + U')) {
        e.preventDefault()
        handleOpenStudioTab('audit.studio')
      }
      // Studio: Contributors & Team
      else if (matchesKeybinding(e, getKey('studio.contributors') || 'Ctrl + Shift + R')) {
        e.preventDefault()
        handleOpenStudioTab('contributors.studio')
      }
      // Studio: Changelog & Release Notes
      else if (matchesKeybinding(e, getKey('studio.changelog') || 'Ctrl + Shift + L')) {
        e.preventDefault()
        handleOpenStudioTab('changelog.studio')
      }
      // Studio: Icons & Emoji Studio (Ctrl + Shift + Y)
      else if (matchesKeybinding(e, getKey('studio.icons') || 'Ctrl + Shift + Y')) {
        e.preventDefault()
        handleOpenStudioTab('icons.studio')
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
      handleCreateUntitledFile,
    handleCloseFile,
    handleCloseWorkspace,
    handleCloseStudioTab,
    handleCopy,
    toggleThemeMode,
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
