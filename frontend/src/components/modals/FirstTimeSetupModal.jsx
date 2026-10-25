import React, { useState, useEffect } from 'react'
import appLogo from '../../assets/logo.png'

/**
 * FirstTimeSetupModal
 * First-Run Onboarding Popup for VisualMark Studio.
 * Appears once on the user's first launch to quickly configure:
 * 1. Color Theme (with live preview)
 * 2. Editor Engine (contrasting Monaco Pro vs Classic with detailed use-cases)
 * 3. Default Layout View (Split, Editor, Preview)
 */
export default function FirstTimeSetupModal({
  isOpen,
  onClose = () => {},
  themeMode = 'dark-modern',
  setThemeMode = () => {},
  editorEngine = 'monaco',
  setEditorEngine = () => {},
  viewMode = 'split',
  setViewMode = () => {},
  showWelcomeOnStartup = true,
  onToggleShowWelcomeOnStartup = () => {},
  showToast = () => {}
}) {
  const curatedThemes = [
    { id: 'dark-modern', name: 'Dark Modern', type: 'dark', swatch: ['#1e1e1e', '#007acc', '#cccccc'] },
    { id: 'github-dark', name: 'GitHub Dark', type: 'dark', swatch: ['#0d1117', '#2f81f7', '#e6edf3'] },
    { id: 'tokyo-night', name: 'Tokyo Night', type: 'dark', swatch: ['#1a1b26', '#7aa2f7', '#c0caf5'] },
    { id: 'dracula', name: 'Dracula', type: 'dark', swatch: ['#282a36', '#bd93f9', '#f8f8f2'] },
    { id: 'light-modern', name: 'Light Modern', type: 'light', swatch: ['#f3f3f3', '#007acc', '#1e1e1e'] },
    { id: 'solarized-light', name: 'Solarized Light', type: 'light', swatch: ['#fdf6e3', '#268bd2', '#657b83'] }
  ]

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        handleFinish()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (!isOpen) return null

  const handleFinish = () => {
    try {
      localStorage.setItem('visualmark_onboarding_completed', 'true')
    } catch {}
    onClose()
    showToast?.('Workspace preferences saved! Welcome to VisualMark Studio.', 'success')
  }

  return (
    <div className="onboarding-modal-overlay" onClick={handleFinish}>
      <div className="onboarding-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="onboarding-modal-header">
          <div className="onboarding-brand-group">
            <div className="onboarding-logo-wrap">
              <img src={appLogo} alt="VisualMark Studio" className="onboarding-logo" />
            </div>
            <div>
              <h2 className="onboarding-title">Welcome to VisualMark Studio</h2>
              <p className="onboarding-subtitle">
                Configure your environment in 15 seconds. You can always change this in Settings.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="onboarding-btn-close"
            onClick={handleFinish}
            title="Skip &amp; Start"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="onboarding-modal-body custom-scrollbar">
          {/* Step 1: Color Theme */}
          <div className="onboarding-step-section">
            <div className="onboarding-step-header">
              <span className="onboarding-step-number">1</span>
              <div>
                <span className="onboarding-step-title">Choose Color Theme</span>
                <span className="onboarding-step-desc">Calibrated for high contrast in Dark and Light environments.</span>
              </div>
            </div>

            <div className="onboarding-theme-grid">
              {curatedThemes.map((thm) => {
                const isActive = themeMode === thm.id
                return (
                  <button
                    key={thm.id}
                    type="button"
                    className={`onboarding-theme-card ${isActive ? 'active' : ''}`}
                    onClick={() => setThemeMode(thm.id)}
                  >
                    <div className="onboarding-theme-swatch" style={{ background: thm.swatch[0] }}>
                      <span className="onboarding-theme-swatch-dot" style={{ background: thm.swatch[1] }} />
                    </div>
                    <div className="onboarding-theme-meta">
                      <span className="onboarding-theme-name">{thm.name}</span>
                      <span className="onboarding-theme-type">{thm.type}</span>
                    </div>
                    {isActive && (
                      <span className="material-symbols-outlined onboarding-check">check_circle</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Editor Engine (Detailed comparison of use-cases and power) */}
          <div className="onboarding-step-section">
            <div className="onboarding-step-header">
              <span className="onboarding-step-number">2</span>
              <div>
                <span className="onboarding-step-title">Choose Editor Engine</span>
                <span className="onboarding-step-desc">Select the editing core that matches your workflow.</span>
              </div>
            </div>

            <div className="onboarding-engine-grid">
              {/* Monaco Pro */}
              <button
                type="button"
                className={`onboarding-engine-card ${editorEngine === 'monaco' ? 'active' : ''}`}
                onClick={() => setEditorEngine('monaco')}
              >
                <div className="onboarding-engine-top">
                  <div className="onboarding-engine-title-group">
                    <span className="material-symbols-outlined onboarding-engine-icon icon-monaco">terminal</span>
                    <span className="onboarding-engine-name">Monaco Pro Editor</span>
                  </div>
                  <span className="onboarding-engine-badge badge-powerful">Most Powerful</span>
                </div>
                <p className="onboarding-engine-desc">
                  The industry-standard engine powering VS Code. Full-featured AST syntax highlighting,
                  intelligent Markdown IntelliSense, multi-cursor editing, bracket pair colorization,
                  and live code folding.
                </p>
                <div className="onboarding-engine-footer">
                  <span className="onboarding-engine-usecase">Best for: Professional documentation &amp; deep editing</span>
                  {editorEngine === 'monaco' && (
                    <span className="material-symbols-outlined onboarding-check">check_circle</span>
                  )}
                </div>
              </button>

              {/* Classic Lightweight */}
              <button
                type="button"
                className={`onboarding-engine-card ${editorEngine === 'classic' ? 'active' : ''}`}
                onClick={() => setEditorEngine('classic')}
              >
                <div className="onboarding-engine-top">
                  <div className="onboarding-engine-title-group">
                    <span className="material-symbols-outlined onboarding-engine-icon icon-classic">text_fields</span>
                    <span className="onboarding-engine-name">Classic Lightweight</span>
                  </div>
                  <span className="onboarding-engine-badge badge-lightweight">Minimalist</span>
                </div>
                <p className="onboarding-engine-desc">
                  Ultra-lightweight native textarea editor with zero background worker threads and
                  minimal memory footprint. Instant response time with straightforward typing.
                </p>
                <div className="onboarding-engine-footer">
                  <span className="onboarding-engine-usecase">Best for: Quick drafts &amp; low-resource machines</span>
                  {editorEngine === 'classic' && (
                    <span className="material-symbols-outlined onboarding-check">check_circle</span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Step 3: Default Layout View */}
          <div className="onboarding-step-section">
            <div className="onboarding-step-header">
              <span className="onboarding-step-number">3</span>
              <div>
                <span className="onboarding-step-title">Default Layout Mode</span>
                <span className="onboarding-step-desc">How you would like your workspace partitioned by default.</span>
              </div>
            </div>

            <div className="onboarding-view-grid">
              <button
                type="button"
                className={`onboarding-view-card ${viewMode === 'split' ? 'active' : ''}`}
                onClick={() => setViewMode('split')}
              >
                <span className="material-symbols-outlined onboarding-view-icon">view_column</span>
                <div className="onboarding-view-content">
                  <div className="onboarding-view-title-row">
                    <span className="onboarding-view-title">Split View</span>
                    <span className="onboarding-view-rec">Recommended</span>
                  </div>
                  <p className="onboarding-view-desc">Side-by-side Monaco editor and live synchronous preview.</p>
                </div>
                {viewMode === 'split' && (
                  <span className="material-symbols-outlined onboarding-check">check_circle</span>
                )}
              </button>

              <button
                type="button"
                className={`onboarding-view-card ${viewMode === 'editor' ? 'active' : ''}`}
                onClick={() => setViewMode('editor')}
              >
                <span className="material-symbols-outlined onboarding-view-icon">edit_note</span>
                <div className="onboarding-view-content">
                  <span className="onboarding-view-title">Editor Only</span>
                  <p className="onboarding-view-desc">Maximized distraction-free code canvas.</p>
                </div>
                {viewMode === 'editor' && (
                  <span className="material-symbols-outlined onboarding-check">check_circle</span>
                )}
              </button>

              <button
                type="button"
                className={`onboarding-view-card ${viewMode === 'preview' ? 'active' : ''}`}
                onClick={() => setViewMode('preview')}
              >
                <span className="material-symbols-outlined onboarding-view-icon">visibility</span>
                <div className="onboarding-view-content">
                  <span className="onboarding-view-title">Preview Only</span>
                  <p className="onboarding-view-desc">Clean rendered documentation display.</p>
                </div>
                {viewMode === 'preview' && (
                  <span className="material-symbols-outlined onboarding-check">check_circle</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="onboarding-modal-footer">
          <label className="onboarding-startup-label">
            <input
              type="checkbox"
              checked={Boolean(showWelcomeOnStartup)}
              onChange={(e) => onToggleShowWelcomeOnStartup(e.target.checked)}
            />
            <span>Show Welcome dashboard on startup</span>
          </label>

          <button
            type="button"
            className="onboarding-btn-submit"
            onClick={handleFinish}
          >
            <span>Done &amp; Open Workspace</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  )
}
