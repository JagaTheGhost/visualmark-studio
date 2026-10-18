import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useStudioSplit } from '../../../utils/useResizableSplit'
import '../../../styles/studios/studioShell.css'

/**
 * Universal Studio Shell Component
 * Industry-standard 2-pane workspace container for all VisualMark Studio tools.
 * 
 * Provides:
 * - Unified Header with Icon, Title, Badge, Mode Switcher pills, and Universal Actions.
 * - Persistent Action Bar: [Copy Markdown], [Insert at Cursor (Ctrl+Enter)], [Reset], [Back].
 * - Resizable 2-Pane Split: Left Inspector (properties) & Right Canvas (WYSIWYG stage).
 * - Canvas Stage with Theme toggles (Dark, Midnight, Light, Grid).
 * - Expandable Live Code Drawer with instant syntax preview, statistics, and 1-click copy.
 */
export default function StudioShell({
  studioId = 'studio',
  title,
  subtitle,
  badge = 'Studio',
  icon,
  accentColor = '#38bdf8',
  modes = [],
  activeMode,
  onModeChange,
  markdownCode = '',
  codeLanguage = 'markdown',
  onInsert,
  insertLabel = 'Insert into Document',
  onReset,
  onBackToReadme,
  extraHeaderActions = null,
  canvasHeaderExtras = null,
  defaultSplitWidth = 500,
  minSplitWidth = 360,
  maxSplitWidth = 840,
  inspectorContent,
  canvasContent,
  showCodeDrawer = true
}) {
  const { formWidth, isDragging, handleMouseDown, handleDoubleClick } = useStudioSplit(
    defaultSplitWidth,
    minSplitWidth,
    maxSplitWidth
  )

  const [copied, setCopied] = useState(false)
  const [stageBg, setStageBg] = useState('dark') // 'dark' | 'midnight' | 'light' | 'grid'
  const [codeDrawerOpen, setCodeDrawerOpen] = useState(false)

  // Copy Markdown helper
  const handleCopyCode = useCallback(async () => {
    if (!markdownCode) return
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(markdownCode)
      } else {
        const ta = document.createElement('textarea')
        ta.value = markdownCode
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn('Copy failed:', err)
    }
  }, [markdownCode])

  // Global Keyboard Shortcuts (Ctrl+Enter to Insert)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (typeof onInsert === 'function') {
          e.preventDefault()
          onInsert()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onInsert])

  // Code statistics
  const codeStats = useMemo(() => {
    const text = markdownCode || ''
    const chars = text.length
    const lines = text ? text.split('\n').length : 0
    return { chars, lines }
  }, [markdownCode])

  const safeStudioId = (typeof studioId === 'string' && studioId.trim() ? studioId.trim() : 'studio').replace(/\./g, '-')

  return (
    <div className={`studio-shell studio-shell-${safeStudioId}`}>
      {/* 1. UNIFIED STUDIO HEADER */}
      <header className="studio-shell-header">
        <div className="studio-shell-header-left">
          <div
            className="studio-shell-icon"
            style={{
              borderColor: `${accentColor}40`,
              backgroundColor: `${accentColor}15`,
              color: accentColor
            }}
          >
            {typeof icon === 'string' ? (
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{icon}</span>
            ) : (
              icon
            )}
          </div>
          <div className="studio-shell-titles">
            <div className="studio-shell-title-row">
              <h1 className="studio-shell-title">{title}</h1>
              <span
                className="studio-shell-badge"
                style={{
                  borderColor: `${accentColor}44`,
                  color: accentColor,
                  backgroundColor: `${accentColor}12`
                }}
              >
                {badge}
              </span>
            </div>
            {subtitle && <p className="studio-shell-subtitle">{subtitle}</p>}
          </div>
        </div>

        {/* Mode Switcher (if studio has multiple sub-tools) */}
        {modes && modes.length > 0 && (
          <nav className="studio-shell-modes" aria-label="Studio Modes">
            {modes.map((mode) => {
              const isActive = activeMode === mode.id
              return (
                <button
                  key={mode.id}
                  type="button"
                  className={`studio-shell-mode-pill ${isActive ? 'active' : ''}`}
                  onClick={() => onModeChange && onModeChange(mode.id)}
                  style={
                    isActive
                      ? {
                          borderColor: accentColor,
                          backgroundColor: `${accentColor}20`,
                          color: '#ffffff'
                        }
                      : {}
                  }
                >
                  {mode.icon && (
                    typeof mode.icon === 'string' ? (
                      <span className="material-symbols-outlined mode-pill-icon">{mode.icon}</span>
                    ) : (
                      <span className="mode-pill-icon">{mode.icon}</span>
                    )
                  )}
                  <span className="mode-pill-label">{mode.label}</span>
                  {mode.badge && <span className="mode-pill-badge">{mode.badge}</span>}
                </button>
              )
            })}
          </nav>
        )}

        {/* Universal Actions Toolbar */}
        <div className="studio-shell-actions">
          {extraHeaderActions}

          {onReset && (
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-secondary"
              onClick={onReset}
              title="Reset parameters to defaults"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
              </svg>
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            className="studio-shell-btn studio-shell-btn-secondary"
            onClick={handleCopyCode}
            title="Copy Markdown code snippet"
          >
            {copied ? (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" style={{ color: '#10b981' }}>
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022z"/>
                </svg>
                <span style={{ color: '#10b981' }}>Copied!</span>
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>

          {onInsert && (
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-primary"
              onClick={onInsert}
              title={`${insertLabel} (Ctrl+Enter)`}
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 2px 10px ${accentColor}40`
              }}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              <span>{insertLabel}</span>
              <kbd className="studio-kbd">↵</kbd>
            </button>
          )}

          {onBackToReadme && (
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-icon"
              onClick={onBackToReadme}
              title="Return to Markdown Editor"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* 2. MAIN 2-PANE RESIZABLE WORKSPACE */}
      <div className={`studio-shell-body ${isDragging ? 'is-dragging' : ''}`}>
        {/* LEFT PANE: Property Inspector */}
        <aside
          className="studio-shell-inspector custom-scrollbar"
          style={{ width: `${formWidth}px`, flexShrink: 0 }}
        >
          {inspectorContent}
        </aside>

        {/* DRAGGABLE RESIZER HANDLE */}
        <div
          className="studio-shell-resizer"
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title="Drag to resize inspector • Double-click to reset width"
        >
          <div className="resizer-handle-grip" />
        </div>

        {/* RIGHT PANE: Canvas Stage & Code Output */}
        <main className="studio-shell-canvas-pane">
          {/* Canvas Top Bar */}
          <div className="studio-canvas-header">
            <div className="canvas-header-left">
              <span className="canvas-header-title">LIVE PREVIEW</span>
              {canvasHeaderExtras}
            </div>

            <div className="canvas-header-right">
              {/* Stage Background Mode Switcher */}
              <div className="canvas-bg-switcher" role="group" aria-label="Stage Background">
                <button
                  type="button"
                  className={`bg-switch-btn ${stageBg === 'dark' ? 'active' : ''}`}
                  onClick={() => setStageBg('dark')}
                  title="Dark theme background (#0d1117)"
                >
                  <span className="bg-dot bg-dot-dark" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  className={`bg-switch-btn ${stageBg === 'midnight' ? 'active' : ''}`}
                  onClick={() => setStageBg('midnight')}
                  title="Midnight obsidian background (#090d16)"
                >
                  <span className="bg-dot bg-dot-midnight" />
                  <span>Midnight</span>
                </button>
                <button
                  type="button"
                  className={`bg-switch-btn ${stageBg === 'light' ? 'active' : ''}`}
                  onClick={() => setStageBg('light')}
                  title="Light mode background (#ffffff)"
                >
                  <span className="bg-dot bg-dot-light" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  className={`bg-switch-btn ${stageBg === 'grid' ? 'active' : ''}`}
                  onClick={() => setStageBg('grid')}
                  title="Transparent checkerboard background"
                >
                  <span className="bg-dot bg-dot-grid" />
                  <span>Grid</span>
                </button>
              </div>

              {/* Code Drawer Toggle */}
              {showCodeDrawer && (
                <button
                  type="button"
                  className={`canvas-toggle-btn ${codeDrawerOpen ? 'active' : ''}`}
                  onClick={() => setCodeDrawerOpen((v) => !v)}
                  title={codeDrawerOpen ? 'Hide Markdown Code Drawer' : 'Show Markdown Code Drawer'}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
                  </svg>
                  <span>Code</span>
                </button>
              )}
            </div>
          </div>

          {/* Canvas Viewport Stage */}
          <div className={`studio-canvas-stage stage-bg-${stageBg}`}>
            <div className="studio-canvas-content-wrapper">
              {canvasContent}
            </div>
          </div>

          {/* Expandable Live Markdown Code Drawer */}
          {showCodeDrawer && codeDrawerOpen && (
            <section className="studio-code-drawer" aria-label="Generated Code Output">
              <div className="code-drawer-header">
                <div className="code-drawer-left">
                  <span className="code-lang-tag">{codeLanguage.toUpperCase()}</span>
                  <span className="code-meta-stats">
                    {codeStats.lines} {codeStats.lines === 1 ? 'line' : 'lines'} • {codeStats.chars} chars
                  </span>
                </div>
                <div className="code-drawer-right">
                  <button
                    type="button"
                    className="code-copy-btn"
                    onClick={handleCopyCode}
                    title="Copy snippet to clipboard"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    className="code-drawer-close"
                    onClick={() => setCodeDrawerOpen(false)}
                    title="Close code drawer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="code-drawer-body custom-scrollbar">
                <pre className="code-pre">
                  <code>{markdownCode || '<!-- No code generated yet -->'}</code>
                </pre>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
