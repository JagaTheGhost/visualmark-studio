import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { APP_CURRENT_VERSION } from '../data/releaseNotes'
import appLogo from '../assets/logo.png'
import { useToast } from '../context/ToastContext'
import { useI18n } from '../i18n/I18nContext'
import { THEMES, getThemeById } from '../themes/themeRegistry'

export default function TopMenuBar({
  activeFile,
  repoUrl,
  workspaceName,
  sidebarCollapsed,
  onToggleSidebar,
  onOpenCommandPalette,
  onGenerate,
  onCopy,
  onDownload,
  onOpenFile,
  onOpenFolder,
  onSaveFile,
  localFilePath,
  workspaceDirectory,
  isDocPack,
  loading,
  themeMode,
  setThemeMode,
  toggleThemeMode,
  isDarkMode,
  onOpenSettings,
  onOpenShortcuts,
  onNewFile,
  onToggleZen,
  isZenMode,
  viewMode,
  setViewMode,
  onFind,
  onReplace,
  onToggleBottomPanel,
  editorEngine = 'monaco',
  setEditorEngine = () => {},
  onOpenWhatsNew = () => {},
  onCheckForUpdates = () => {},
  recentWorkspaces = [],
  onOpenRecentWorkspace = () => {},
  onClearRecentWorkspaces = () => {},
  onCloseTab = () => {},
  onCloneRepo = () => {},
  onCloseWorkspace = () => {},
  onOpenWelcome = () => {},
  onOpenQuickSetup = () => {},
  appVersion = APP_CURRENT_VERSION
}) {
  const [activeMenu, setActiveMenu] = useState(null)
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [isElectron, setIsElectron] = useState(true)
  const [isMaximized, setIsMaximized] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [isDevMode, setIsDevMode] = useState(() => Boolean(import.meta.env.DEV))
  const topBarRef = useRef(null)
  const themeMenuRef = useRef(null)
  const { t } = useI18n()

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setThemeMenuOpen(false)
      }
    }
    if (themeMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [themeMenuOpen])

  let toastCtx = null
  try {
    toastCtx = useToast()
  } catch {}
  const unreadCount = toastCtx?.unreadCount || 0
  const toggleHistory = toastCtx?.toggleHistory || (() => {})
  const isHistoryOpen = toastCtx?.isHistoryOpen || false

  // Detect Electron environment and listen to window state
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI?.isElectron) {
      setIsElectron(true)
      window.electronAPI.isWindowMaximized().then((max) => setIsMaximized(max)).catch(() => {})
      if (window.electronAPI.getIsDev) {
        window.electronAPI.getIsDev().then((res) => {
          if (typeof res === 'boolean') setIsDevMode(res)
        }).catch(() => {})
      }
      const cleanup = window.electronAPI.onMaximizedChange((max) => {
        setIsMaximized(max)
      })
      return cleanup
    }
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (topBarRef.current && !topBarRef.current.contains(e.target)) {
        setActiveMenu(null)
        setActiveSubmenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close About dialog on Escape key
  useEffect(() => {
    if (!aboutOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setAboutOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [aboutOpen])

  // Extract repo short name from workspace or URL if available
  const repoName = workspaceName || (repoUrl
    ? repoUrl.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').replace(/\/$/, '')
    : 'auto-readme-generator')

  const handleMenuClick = (menuKey) => {
    setActiveMenu((prev) => (prev === menuKey ? null : menuKey))
    setActiveSubmenu(null)
  }

  const handleMenuMouseEnter = (menuKey) => {
    if (activeMenu && activeMenu !== menuKey) {
      setActiveMenu(menuKey)
      setActiveSubmenu(null)
    }
  }

  const handleItemClick = (action) => {
    setActiveMenu(null)
    setActiveSubmenu(null)
    if (action) action()
  }

  return (
    <header className={`ide-top-bar select-none ${isElectron ? 'is-electron-bar' : ''}`} ref={topBarRef}>
      {/* 1. Left: IDE Logo + Menu Items (File, Edit, Selection, View, Go, Run, Terminal, Help) */}
      <div className="top-bar-left">
        {/* App Logo Icon */}
        <div className="ide-app-icon" title="VisualMark Studio">
          <img
            src={appLogo}
            alt="VisualMark Studio"
            style={{ width: '19px', height: '19px', borderRadius: '4px', objectFit: 'contain' }}
          />
        </div>

        {/* Desktop Menu Bar */}
        <nav className="desktop-menubar">
          {/* File Menu */}
          <div className="menubar-item-wrapper">
            <button
              type="button"
              className={`menubar-btn ${activeMenu === 'file' ? 'active' : ''}`}
              onClick={() => handleMenuClick('file')}
              onMouseEnter={() => handleMenuMouseEnter('file')}
            >
              {t('menu.file', 'File')}
            </button>
            {activeMenu === 'file' && (
              <div className="menubar-dropdown">
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onNewFile)}>
                  <span>New Markdown File</span>
                  <kbd>Ctrl+N</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onOpenFile)}>
                  <span>Open File...</span>
                  <kbd>Ctrl+O</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onOpenFolder)}>
                  <span>Open Folder...</span>
                  <kbd>Ctrl+Shift+O</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onCloneRepo)}>
                  <span>Clone Repository...</span>
                </button>

                {/* Open Recent Submenu */}
                <div
                  className="dropdown-item has-submenu"
                  onMouseEnter={() => setActiveSubmenu('recent')}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <span className="dropdown-item-label">
                    <span className="material-symbols-outlined dropdown-icon">history</span>
                    <span>Open Recent</span>
                  </span>
                  <span className="submenu-arrow">ΓÇ║</span>
                  {activeSubmenu === 'recent' && (
                    <div className="menubar-submenu" onClick={(e) => e.stopPropagation()}>
                      {recentWorkspaces && recentWorkspaces.length > 0 ? (
                        <>
                          {recentWorkspaces.map((ws) => (
                            <button
                              key={ws.path}
                              type="button"
                              className="dropdown-item recent-workspace-item"
                              onClick={() => handleItemClick(() => onOpenRecentWorkspace && onOpenRecentWorkspace(ws.path))}
                              title={ws.path}
                            >
                              <span className="recent-item-title truncate">{ws.name}</span>
                              <span className="recent-item-path truncate">{ws.path}</span>
                            </button>
                          ))}
                          <div className="dropdown-divider" />
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => handleItemClick(onClearRecentWorkspaces)}
                          >
                            <span className="dropdown-item-label">
                              <span className="material-symbols-outlined dropdown-icon">delete_sweep</span>
                              <span>Clear Recently Opened</span>
                            </span>
                          </button>
                        </>
                      ) : (
                        <div className="submenu-empty-notice">No Recent Workspaces</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => onSaveFile && onSaveFile(false))}>
                  <span>Save</span>
                  <kbd>Ctrl+S</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => onSaveFile && onSaveFile(true))}>
                  <span>Save As...</span>
                  <kbd>Ctrl+Shift+S</kbd>
                </button>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onDownload)} disabled={!activeFile}>
                  <span>Save Copy As Markdown...</span>
                </button>
                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(() => onCloseTab && activeFile && onCloseTab(activeFile))}
                  disabled={!activeFile}
                >
                  <span>Close Tab</span>
                  <kbd>Ctrl+W</kbd>
                </button>
                {workspaceDirectory && (
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => handleItemClick(onCloseWorkspace)}
                  >
                    <span>Close Workspace</span>
                    <kbd>Ctrl+K F</kbd>
                  </button>
                )}
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(() => window.electronAPI?.closeWindow?.() || window.close())}
                >
                  <span>Close Window</span>
                  <kbd>Alt+F4</kbd>
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="menubar-item-wrapper">
            <button
              type="button"
              className={`menubar-btn ${activeMenu === 'edit' ? 'active' : ''}`}
              onClick={() => handleMenuClick('edit')}
              onMouseEnter={() => handleMenuMouseEnter('edit')}
            >
              {t('menu.edit', 'Edit')}
            </button>
            {activeMenu === 'edit' && (
              <div className="menubar-dropdown">
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => document.execCommand('undo'))}>
                  <span>Undo</span>
                  <kbd>Ctrl+Z</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => document.execCommand('redo'))}>
                  <span>Redo</span>
                  <kbd>Ctrl+Y</kbd>
                </button>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => document.execCommand('cut'))}>
                  <span>Cut</span>
                  <kbd>Ctrl+X</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onCopy)}>
                  <span>Copy Markdown</span>
                  <kbd>Ctrl+C</kbd>
                </button>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onFind)}>
                  <span>Find</span>
                  <kbd>Ctrl+F</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onReplace)}>
                  <span>Replace</span>
                  <kbd>Ctrl+H</kbd>
                </button>
              </div>
            )}
          </div>

          {/* Selection Menu */}
          <div className="menubar-item-wrapper">
            <button
              type="button"
              className={`menubar-btn ${activeMenu === 'selection' ? 'active' : ''}`}
              onClick={() => handleMenuClick('selection')}
              onMouseEnter={() => handleMenuMouseEnter('selection')}
            >
              {t('menu.selection', 'Selection')}
            </button>
            {activeMenu === 'selection' && (
              <div className="menubar-dropdown">
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => document.execCommand('selectAll'))}>
                  <span>Select All</span>
                  <kbd>Ctrl+A</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onCopy)}>
                  <span>Copy Entire Buffer</span>
                  <kbd>Ctrl+Shift+C</kbd>
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="menubar-item-wrapper">
            <button
              type="button"
              className={`menubar-btn ${activeMenu === 'view' ? 'active' : ''}`}
              onClick={() => handleMenuClick('view')}
              onMouseEnter={() => handleMenuMouseEnter('view')}
            >
              {t('menu.view', 'View')}
            </button>
            {activeMenu === 'view' && (
              <div className="menubar-dropdown">
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onOpenCommandPalette)}>
                  <span>Command Palette...</span>
                  <kbd>Ctrl+K</kbd>
                </button>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => setViewMode && setViewMode('split'))}>
                  <span>{viewMode === 'split' ? 'Γ£ô ' : '  '}Split View (Side-by-Side)</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => setViewMode && setViewMode('editor'))}>
                  <span>{viewMode === 'editor' ? 'Γ£ô ' : '  '}Editor Only</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => setViewMode && setViewMode('preview'))}>
                  <span>{viewMode === 'preview' ? 'Γ£ô ' : '  '}Preview Only</span>
                </button>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onToggleSidebar)}>
                  <span>Toggle Primary Sidebar</span>
                  <kbd>Ctrl+B</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => onToggleBottomPanel && onToggleBottomPanel('output'))}>
                  <span>Toggle Output & Diagnostics</span>
                  <kbd>Ctrl+`</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => onToggleBottomPanel && onToggleBottomPanel('problems'))}>
                  <span>Toggle Problems Panel</span>
                  <kbd>Ctrl+J</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => onToggleBottomPanel && onToggleBottomPanel('output'))}>
                  <span>Toggle Output Panel</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onToggleZen)}>
                  <span>{isZenMode ? 'Γ£ô ' : '  '}Toggle Zen Mode</span>
                  <kbd>F11</kbd>
                </button>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => setEditorEngine && setEditorEngine('monaco'))}>
                  <span>{editorEngine === 'monaco' ? 'Γ£ô ' : '  '}Editor: Monaco (VS Code)</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => setEditorEngine && setEditorEngine('classic'))}>
                  <span>{editorEngine === 'classic' ? 'Γ£ô ' : '  '}Editor: Classic (Lightweight)</span>
                </button>
                <div className="dropdown-divider" />
                <div
                  className="dropdown-item has-submenu"
                  onMouseEnter={() => setActiveSubmenu('theme')}
                >
                  <span className="dropdown-item-label">
                    <span className="material-symbols-outlined dropdown-icon">palette</span>
                    <span>Color Theme</span>
                  </span>
                  <span className="submenu-arrow">ΓÇ║</span>
                  {activeSubmenu === 'theme' && (
                    <div className="menubar-submenu" style={{ minWidth: '230px' }}>
                      <div style={{ padding: '6px 12px 2px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>DARK THEMES</div>
                      {THEMES.filter(t => t.type === 'dark').map(theme => (
                        <button
                          key={theme.id}
                          type="button"
                          className="dropdown-item"
                          onClick={() => handleItemClick(() => setThemeMode(theme.id))}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ display: 'inline-flex', gap: '2px' }}>
                              {theme.colors.swatch.map((c, i) => (
                                <span key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c, display: 'inline-block' }} />
                              ))}
                            </span>
                            <span>{themeMode === theme.id ? 'Γ£ô ' : '  '}{theme.name}</span>
                          </span>
                        </button>
                      ))}
                      <div className="dropdown-divider" />
                      <div style={{ padding: '6px 12px 2px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>LIGHT THEMES</div>
                      {THEMES.filter(t => t.type === 'light').map(theme => (
                        <button
                          key={theme.id}
                          type="button"
                          className="dropdown-item"
                          onClick={() => handleItemClick(() => setThemeMode(theme.id))}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ display: 'inline-flex', gap: '2px' }}>
                              {theme.colors.swatch.map((c, i) => (
                                <span key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c, display: 'inline-block' }} />
                              ))}
                            </span>
                            <span>{themeMode === theme.id ? 'Γ£ô ' : '  '}{theme.name}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Go Menu */}
          <div className="menubar-item-wrapper">
            <button
              type="button"
              className={`menubar-btn ${activeMenu === 'go' ? 'active' : ''}`}
              onClick={() => handleMenuClick('go')}
              onMouseEnter={() => handleMenuMouseEnter('go')}
            >
              {t('menu.go', 'Go')}
            </button>
            {activeMenu === 'go' && (
              <div className="menubar-dropdown">
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onOpenCommandPalette)}>
                  <span>Go to File...</span>
                  <kbd>Ctrl+P</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onOpenCommandPalette)}>
                  <span>Go to Heading / Outline</span>
                  <kbd>Ctrl+Shift+O</kbd>
                </button>
              </div>
            )}
          </div>

          {/* Run Menu */}
          <div className="menubar-item-wrapper">
            <button
              type="button"
              className={`menubar-btn ${activeMenu === 'run' ? 'active' : ''}`}
              onClick={() => handleMenuClick('run')}
              onMouseEnter={() => handleMenuMouseEnter('run')}
            >
              {t('menu.run', 'Run')}
            </button>
            {activeMenu === 'run' && (
              <div className="menubar-dropdown">
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onGenerate)} disabled={loading}>
                  <span>Create Documentation</span>
                  <kbd>Ctrl+Γå╡</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onGenerate)} disabled={loading}>
                  <span>Build Skeleton Documentation</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onGenerate)} disabled={loading}>
                  <span>Re-create Suite</span>
                </button>
              </div>
            )}
          </div>

          {/* Diagnostics & Output Menu */}
          <div className="menubar-item-wrapper">
            <button
              type="button"
              className={`menubar-btn ${activeMenu === 'diagnostics' ? 'active' : ''}`}
              onClick={() => handleMenuClick('diagnostics')}
              onMouseEnter={() => handleMenuMouseEnter('diagnostics')}
            >
              {t('menu.diagnostics', 'Diagnostics')}
            </button>
            {activeMenu === 'diagnostics' && (
              <div className="menubar-dropdown">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(() => onToggleBottomPanel && onToggleBottomPanel('problems'))}
                >
                  <span>View Problems Diagnostics</span>
                  <kbd>Ctrl+J</kbd>
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(() => onToggleBottomPanel && onToggleBottomPanel('output'))}
                >
                  <span>View System Output & Logs</span>
                  <kbd>Ctrl+`</kbd>
                </button>
                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(() => {
                    const target = workspaceDirectory?.path || localFilePath
                    if (target) window.electronAPI?.showItemInFolder?.(target)
                  })}
                  disabled={!workspaceDirectory?.path && !localFilePath}
                >
                  <span>Reveal in File Explorer</span>
                  <kbd>Ctrl+Shift+E</kbd>
                </button>
                {isDevMode && (
                  <>
                    <div className="dropdown-divider" />
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => handleItemClick(() => window.electronAPI?.toggleDevTools?.())}
                    >
                      <span>Toggle Developer Tools</span>
                      <kbd>Ctrl+Shift+I</kbd>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(() => window.electronAPI?.reloadWindow?.() || window.location.reload())}
                >
                  <span>Reload IDE Window</span>
                  <kbd>Ctrl+R</kbd>
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="menubar-item-wrapper">
            <button
              type="button"
              className={`menubar-btn ${activeMenu === 'help' ? 'active' : ''}`}
              onClick={() => handleMenuClick('help')}
              onMouseEnter={() => handleMenuMouseEnter('help')}
            >
              {t('menu.help', 'Help')}
            </button>
            {activeMenu === 'help' && (
              <div className="menubar-dropdown">
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onOpenWelcome)}>
                  <span>Welcome / Getting Started</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onOpenQuickSetup)}>
                  <span>Quick Setup Wizard...</span>
                </button>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onOpenShortcuts)}>
                  <span>Keyboard Shortcuts</span>
                  <kbd>Ctrl+/</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onOpenSettings)}>
                  <span>Preferences & Settings</span>
                  <kbd>Ctrl+,</kbd>
                </button>
                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(onOpenWhatsNew)}
                >
                  <span>Patch Notes</span>
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(onCheckForUpdates)}
                >
                  <span>Check for Updates...</span>
                </button>
                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(() => {
                    const url = 'https://github.com/JagaTheGhost/visualmark-studio'
                    if (window.electronAPI?.openExternalUrl) {
                      window.electronAPI.openExternalUrl(url)
                    } else {
                      window.open(url, '_blank', 'noopener,noreferrer')
                    }
                  })}
                >
                  <span>VisualMark Studio Documentation</span>
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(() => setAboutOpen(true))}
                >
                  <span>About VisualMark Studio</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* 2. Center: Centered Title (Antigravity IDE Style) */}
      <div
        className="top-bar-center-title"
        onClick={onOpenCommandPalette}
        title="Search files, templates, or commands (Ctrl+K)"
      >
        <span className="title-repo truncate">{repoName}</span>
        <span className="title-sep">-</span>
        <span className="title-app">VisualMark Studio</span>
        {activeFile ? (
          <>
            <span className="title-sep">-</span>
            <span className="title-file truncate">{activeFile}</span>
          </>
        ) : null}
      </div>

      {/* 3. Right: Quick Actions, Layout Controls, Divider, Settings, Window Controls */}
      <div className="top-bar-right">

        {/* Layout Icons Group (Antigravity / VS Code style) */}
        <div className="layout-controls-group">
          {/* Toggle Primary Sidebar */}
          <button
            type="button"
            className="top-action-icon-btn"
            onClick={onToggleSidebar}
            title={sidebarCollapsed ? "Show Primary Sidebar (Ctrl+B)" : "Hide Primary Sidebar (Ctrl+B)"}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 3h12v10H2V3zm1 1v8h3V4H3zm4 0v8h6V4H7z"/>
            </svg>
          </button>

          {/* Toggle Split / Preview Layout */}
          <button
            type="button"
            className="top-action-icon-btn"
            onClick={() => setViewMode && setViewMode(prev => prev === 'split' ? 'preview' : prev === 'preview' ? 'editor' : 'split')}
            title="Toggle Split View / Editor Layout"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 3h12v10H2V3zm1 1v8h4.5V4H3zm5.5 0v8H13V4H8.5z"/>
            </svg>
          </button>

          {/* Toggle Zen Mode */}
          <button
            type="button"
            className="top-action-icon-btn"
            onClick={onToggleZen}
            title="Toggle Zen Mode (F11)"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1v5h2V3h3V1H1zm9 0v2h3v3h2V1h-5zm3 9v3h-3v2h5v-5h-2zM3 10H1v5h5v-2H3v-3z"/>
            </svg>
          </button>

          {/* Search Icon */}
          <button
            type="button"
            className="top-action-icon-btn"
            onClick={onOpenCommandPalette}
            title="Search files & commands (Ctrl+K)"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </button>
        </div>

        <div className="top-divider" />

        {/* Settings Gear */}
        <button
          type="button"
          className="top-action-icon-btn"
          onClick={onOpenSettings}
          title="Settings (Ctrl+,)"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.1 1.2a1 1 0 0 0-2.2 0l-.3 1a6.002 6.002 0 0 0-1.4.8l-1-.4a1 1 0 0 0-1.6 1.6l.4 1a6.002 6.002 0 0 0-.8 1.4l-1 .3a1 1 0 0 0 0 2.2l1 .3a6.002 6.002 0 0 0 .8 1.4l-.4 1a1 1 0 0 0 1.6 1.6l1-.4a6.002 6.002 0 0 0 1.4.8l.3 1a1 1 0 0 0 2.2 0l.3-1a6.002 6.002 0 0 0 1.4-.8l1 .4a1 1 0 0 0 1.6-1.6l-.4-1a6.002 6.002 0 0 0 .8-1.4l1-.3a1 1 0 0 0 0-2.2l-1-.3a6.002 6.002 0 0 0-.8-1.4l.4-1a1 1 0 0 0-1.6-1.6l-1 .4a6.002 6.002 0 0 0-1.4-.8l-.3-1zM8 10.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
          </svg>
        </button>

        {/* Notification Center Bell */}
        <button
          type="button"
          className={`top-action-icon-btn notification-bell-btn ${unreadCount > 0 && !isHistoryOpen ? 'has-unread' : ''} ${isHistoryOpen ? 'is-active' : ''}`}
          onClick={toggleHistory}
          title={unreadCount > 0 && !isHistoryOpen ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'} (Click to open Notification Center)` : "Notification Center (Click to view history)"}
          style={{ position: 'relative' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px', color: (unreadCount > 0 && !isHistoryOpen) ? '#38bdf8' : isHistoryOpen ? '#ffffff' : 'inherit' }}>
            {unreadCount > 0 && !isHistoryOpen ? 'notifications_active' : 'notifications'}
          </span>
          {unreadCount > 0 && !isHistoryOpen && (
            <span className="top-notif-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Fast Light / Dark Mode Toggle */}
        <button
          type="button"
          className="top-action-icon-btn"
          onClick={() => {
            if (toggleThemeMode) {
              toggleThemeMode()
            } else {
              setThemeMode(prev => (prev && prev.startsWith('light') ? 'dark-modern' : 'light-modern'))
            }
          }}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Color Theme Picker Dropdown Trigger */}
        <div className="theme-picker-wrapper" ref={themeMenuRef}>
          <button
            type="button"
            className={`top-action-icon-btn ${themeMenuOpen ? 'is-active' : ''}`}
            onClick={() => setThemeMenuOpen(prev => !prev)}
            title="Select Color Theme"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
              palette
            </span>
          </button>

          {themeMenuOpen && (
            <div className="theme-picker-flyout">
              <div className="theme-picker-header">
                <span>Color Themes</span>
                <span className="theme-picker-badge">{isDarkMode ? 'Dark' : 'Light'}</span>
              </div>

              <div className="theme-picker-section-label">Dark Themes</div>
              {THEMES.filter(t => t.type === 'dark').map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  className={`theme-picker-item ${themeMode === theme.id ? 'active' : ''}`}
                  onClick={() => {
                    setThemeMode(theme.id)
                    setThemeMenuOpen(false)
                  }}
                >
                  <div className="theme-swatch-dots">
                    {theme.colors.swatch.map((c, i) => (
                      <span key={i} className="theme-dot" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="theme-item-name">{theme.name}</span>
                  {theme.badge && <span className="theme-item-badge">{theme.badge}</span>}
                  {themeMode === theme.id && (
                    <span className="material-symbols-outlined theme-check-icon">check</span>
                  )}
                </button>
              ))}

              <div className="theme-picker-divider" />

              <div className="theme-picker-section-label">Light Themes</div>
              {THEMES.filter(t => t.type === 'light').map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  className={`theme-picker-item ${themeMode === theme.id ? 'active' : ''}`}
                  onClick={() => {
                    setThemeMode(theme.id)
                    setThemeMenuOpen(false)
                  }}
                >
                  <div className="theme-swatch-dots">
                    {theme.colors.swatch.map((c, i) => (
                      <span key={i} className="theme-dot" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="theme-item-name">{theme.name}</span>
                  {theme.badge && <span className="theme-item-badge">{theme.badge}</span>}
                  {themeMode === theme.id && (
                    <span className="material-symbols-outlined theme-check-icon">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Frameless Desktop Window Controls (Minimize, Maximize, Close) - Pinned Edge */}
      <div className="window-controls-group">
        <button
          type="button"
          className="window-control-btn btn-min"
          onClick={() => window.electronAPI?.minimizeWindow?.()}
          title="Minimize Window"
        >
          <svg width="11" height="1" viewBox="0 0 11 1"><rect width="11" height="1" fill="currentColor"/></svg>
        </button>
        <button
          type="button"
          className="window-control-btn btn-max"
          onClick={() => window.electronAPI?.maximizeWindow?.()}
          title={isMaximized ? "Restore Window" : "Maximize Window"}
        >
          {isMaximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M2 0v2H0v8h8V8h2V0H2zm5 9H1V3h6v6zm2-2h-1V2H3V1h6v6z" fill="currentColor"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M0 0v10h10V0H0zm9 9H1V1h8v8z" fill="currentColor"/>
            </svg>
          )}
        </button>
        <button
          type="button"
          className="window-control-btn btn-close"
          onClick={() => window.electronAPI?.closeWindow?.() || window.close()}
          title="Close Window"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4-4-4z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* 5. Native About Dialog Modal (Portaled to document.body to prevent top-bar overflow) */}
      {aboutOpen && typeof document !== 'undefined' && createPortal(
        <div className="ide-confirm-backdrop" onClick={() => setAboutOpen(false)}>
          <div className="ide-confirm-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', width: '90%' }}>
            <div className="ide-confirm-header" style={{ alignItems: 'center' }}>
              <div className="ide-app-icon" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img
                  src={appLogo}
                  alt="VisualMark Studio"
                  style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'contain' }}
                />
              </div>
              <div className="ide-confirm-content">
                <h4 className="ide-confirm-title" style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#ffffff' }}>
                  VisualMark Studio
                </h4>
                <p className="ide-confirm-message" style={{ margin: '3px 0 0 0', fontSize: '12px', color: 'var(--text-muted, #94a3b8)' }}>
                  Version {appVersion || APP_CURRENT_VERSION} (Code + Visual Markdown IDE)
                </p>
              </div>
            </div>

            <div style={{ padding: '14px 18px', fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary, #cbd5e1)', borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.08))', borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.08))' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '8px', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>Runtime:</span>
                <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>Electron v44 (Native Desktop)</span>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>Engine:</span>
                <span style={{ color: '#4ade80', fontFamily: 'monospace' }}>FastAPI Local Sidecar</span>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>Architecture:</span>
                <span style={{ color: '#f59e0b', fontFamily: 'monospace' }}>100% Local-First / Zero Cloud</span>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>Platform:</span>
                <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{typeof navigator !== 'undefined' ? navigator.platform : 'win32'}</span>
              </div>
            </div>

            <div className="ide-confirm-actions" style={{ justifyContent: 'flex-end', padding: '12px 18px', margin: 0 }}>
              <button
                type="button"
                className="btn-studio-secondary"
                onClick={() => setAboutOpen(false)}
                autoFocus
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  )
}
