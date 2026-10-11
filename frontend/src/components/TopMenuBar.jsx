import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { APP_CURRENT_VERSION } from '../data/releaseNotes'

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
  onDownloadSuite,
  onDownloadHtml,
  onDownloadPdf,
  onOpenFile,
  onOpenFolder,
  onSaveFile,
  localFilePath,
  workspaceDirectory,
  isDocPack,
  loading,
  hasGenerated,
  themeMode,
  setThemeMode,
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
  appVersion = APP_CURRENT_VERSION
}) {
  const [activeMenu, setActiveMenu] = useState(null)
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [isElectron, setIsElectron] = useState(true)
  const [isMaximized, setIsMaximized] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const topBarRef = useRef(null)

  // Detect Electron environment and listen to window state
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI?.isElectron) {
      setIsElectron(true)
      window.electronAPI.isWindowMaximized().then((max) => setIsMaximized(max))
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
            src="/logo.png"
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
              File
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
                  <span className="submenu-arrow">›</span>
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
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onDownloadHtml)}>
                  <span>Export as HTML...</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onDownloadPdf)}>
                  <span>Export as PDF...</span>
                </button>
                {isDocPack && onDownloadSuite && (
                  <button type="button" className="dropdown-item" onClick={() => handleItemClick(onDownloadSuite)}>
                    <span>Export Suite (.zip)...</span>
                  </button>
                )}
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
              Edit
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
              Selection
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
              View
            </button>
            {activeMenu === 'view' && (
              <div className="menubar-dropdown">
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onOpenCommandPalette)}>
                  <span>Command Palette...</span>
                  <kbd>Ctrl+K</kbd>
                </button>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => setViewMode && setViewMode('split'))}>
                  <span>{viewMode === 'split' ? '✓ ' : '  '}Split View (Side-by-Side)</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => setViewMode && setViewMode('editor'))}>
                  <span>{viewMode === 'editor' ? '✓ ' : '  '}Editor Only</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => setViewMode && setViewMode('preview'))}>
                  <span>{viewMode === 'preview' ? '✓ ' : '  '}Preview Only</span>
                </button>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onToggleSidebar)}>
                  <span>Toggle Primary Sidebar</span>
                  <kbd>Ctrl+B</kbd>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => onToggleBottomPanel && onToggleBottomPanel('terminal'))}>
                  <span>Toggle Integrated Terminal</span>
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
                  <span>{isZenMode ? '✓ ' : '  '}Toggle Zen Mode</span>
                  <kbd>F11</kbd>
                </button>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => setEditorEngine && setEditorEngine('monaco'))}>
                  <span>{editorEngine === 'monaco' ? '✓ ' : '  '}Editor: Monaco (VS Code)</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => setEditorEngine && setEditorEngine('classic'))}>
                  <span>{editorEngine === 'classic' ? '✓ ' : '  '}Editor: Classic (Lightweight)</span>
                </button>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => setThemeMode('dark'))}>
                  <span>{themeMode === 'dark' ? '✓ ' : '  '}Theme: Dark</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => setThemeMode('slate'))}>
                  <span>{themeMode === 'slate' ? '✓ ' : '  '}Theme: Slate</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(() => setThemeMode('light'))}>
                  <span>{themeMode === 'light' ? '✓ ' : '  '}Theme: Light</span>
                </button>
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
              Go
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
              Run
            </button>
            {activeMenu === 'run' && (
              <div className="menubar-dropdown">
                <button type="button" className="dropdown-item" onClick={() => handleItemClick(onGenerate)} disabled={loading}>
                  <span>Create Documentation</span>
                  <kbd>Ctrl+↵</kbd>
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

          {/* Terminal Menu */}
          <div className="menubar-item-wrapper">
            <button
              type="button"
              className={`menubar-btn ${activeMenu === 'terminal' ? 'active' : ''}`}
              onClick={() => handleMenuClick('terminal')}
              onMouseEnter={() => handleMenuMouseEnter('terminal')}
            >
              Terminal
            </button>
            {activeMenu === 'terminal' && (
              <div className="menubar-dropdown">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(() => onToggleBottomPanel && onToggleBottomPanel('terminal'))}
                >
                  <span>New Integrated Terminal</span>
                  <kbd>Ctrl+`</kbd>
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(() => onToggleBottomPanel && onToggleBottomPanel('problems'))}
                >
                  <span>View Problems Diagnostics</span>
                  <kbd>Ctrl+J</kbd>
                </button>
                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(() => {
                    const dir = workspaceDirectory?.path || (localFilePath ? localFilePath.substring(0, Math.max(localFilePath.lastIndexOf('/'), localFilePath.lastIndexOf('\\'))) : null)
                    window.electronAPI?.openTerminal?.({ folderPath: dir, shellType: 'powershell' })
                  })}
                >
                  <span>External Terminal (PowerShell)</span>
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(() => {
                    const dir = workspaceDirectory?.path || (localFilePath ? localFilePath.substring(0, Math.max(localFilePath.lastIndexOf('/'), localFilePath.lastIndexOf('\\'))) : null)
                    window.electronAPI?.openTerminal?.({ folderPath: dir, shellType: 'cmd' })
                  })}
                >
                  <span>External Command Prompt (cmd)</span>
                </button>
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
                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleItemClick(() => window.electronAPI?.toggleDevTools?.())}
                >
                  <span>Toggle Developer Tools</span>
                  <kbd>Ctrl+Shift+I</kbd>
                </button>
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
              Help
            </button>
            {activeMenu === 'help' && (
              <div className="menubar-dropdown">
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
                      window.open(url, '_blank')
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

        {/* Theme Mode Toggle */}
        <button
          type="button"
          className="top-action-icon-btn"
          onClick={() => setThemeMode(prev => prev === 'dark' ? 'slate' : prev === 'slate' ? 'light' : 'dark')}
          title={`Theme: ${themeMode} (click to toggle)`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
            {themeMode === 'light' ? 'light_mode' : themeMode === 'slate' ? 'palette' : 'dark_mode'}
          </span>
        </button>
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
                  src="/logo.png"
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
