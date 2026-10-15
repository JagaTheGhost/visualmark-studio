import React from 'react'

/**
 * WelcomeLauncher
 * Next-Generation Project Starter & Workspace Selector.
 * Replaces the legacy "No Document Currently Open" box with a modern,
 * glassmorphic launcher matching the VisualMark Studio IDE design system.
 */
export default function WelcomeLauncher({
  onCloneRepo = () => {},
  onOpenFolder = () => {},
  onCreateNewDoc = () => {},
  onOpenNativeFile = () => {},
  onOpenConfig = () => {},
  recentWorkspaces = [],
  onOpenRecentWorkspace = () => {},
  onClearRecentWorkspaces = () => {},
  appVersion = '1.1.1'
}) {
  return (
    <div className="welcome-launcher-container custom-scrollbar">
      <div className="welcome-launcher-card welcome-launcher-embedded">
        {/* Brand Header with App Logo */}
        <div className="welcome-brand-header">
          <div className="welcome-logo-wrap">
            <img
              src="/logo.png"
              alt="VisualMark Studio"
              className="welcome-app-logo"
              onError={(e) => {
                // Fallback to favicon SVG if png has path issues
                e.target.onerror = null
                e.target.src = '/favicon.svg'
              }}
            />
            <div className="welcome-logo-glow" />
          </div>

          <div className="welcome-title-row">
            <h1 className="welcome-app-name">VisualMark Studio</h1>
            <span className="welcome-version-badge">v{appVersion}</span>
          </div>

          <p className="welcome-tagline">
            Professional Markdown Editor, Architecture Visualizer &amp; Documentation Engineering Studio
          </p>
        </div>

        {/* Primary Action Buttons: Tactile Elevated Cards (Git Clone & Open Folder) */}
        <div className="welcome-primary-cards">
          {/* 1. Git Clone Card */}
          <button
            type="button"
            className="welcome-card welcome-card-clone"
            onClick={onCloneRepo}
            title="Clone a remote repository from GitHub, GitLab, or any Git remote URL"
          >
            <div className="welcome-card-icon-wrap icon-cyan">
              <span className="material-symbols-outlined">cloud_download</span>
            </div>
            <div className="welcome-card-content">
              <div className="welcome-card-title-row">
                <span className="welcome-card-title">Clone Repository</span>
                <span className="welcome-card-badge">Git Remote</span>
              </div>
              <p className="welcome-card-desc">
                Clone from GitHub, GitLab, or Git URL directly to your machine and start editing.
              </p>
            </div>
            <span className="material-symbols-outlined welcome-card-arrow">arrow_forward</span>
          </button>

          {/* 2. Open Local Folder Card */}
          <button
            type="button"
            className="welcome-card welcome-card-open"
            onClick={onOpenFolder}
            title="Open an existing directory or repository on your computer"
          >
            <div className="welcome-card-icon-wrap icon-amber">
              <span className="material-symbols-outlined">folder_open</span>
            </div>
            <div className="welcome-card-content">
              <div className="welcome-card-title-row">
                <span className="welcome-card-title">Open Folder...</span>
                <span className="welcome-card-badge">Local Workspace</span>
              </div>
              <p className="welcome-card-desc">
                Open an existing local project folder or documentation repository from disk.
              </p>
            </div>
            <span className="material-symbols-outlined welcome-card-arrow">arrow_forward</span>
          </button>
        </div>

        {/* Secondary Quick Action Buttons */}
        <div className="welcome-secondary-actions">
          <button
            type="button"
            className="welcome-sub-btn"
            onClick={onCreateNewDoc}
            title="Create a new untitled markdown file (Ctrl+N)"
          >
            <span className="material-symbols-outlined">add</span>
            <span>New File</span>
          </button>

          <button
            type="button"
            className="welcome-sub-btn"
            onClick={onOpenNativeFile}
            title="Open a single markdown or text file (Ctrl+O)"
          >
            <span className="material-symbols-outlined">description</span>
            <span>Open File...</span>
          </button>

          <button
            type="button"
            className="welcome-sub-btn"
            onClick={onOpenConfig}
            title="Open Documentation Configuration Generator"
          >
            <span className="material-symbols-outlined">tune</span>
            <span>Doc Generator</span>
          </button>
        </div>

        {/* Recent Workspaces Section (if user has opened workspaces previously) */}
        {recentWorkspaces && recentWorkspaces.length > 0 && (
          <div className="welcome-recent-section">
            <div className="welcome-recent-header">
              <span className="welcome-recent-title">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>history</span>
                Recent Workspaces
              </span>
              <button
                type="button"
                className="welcome-recent-clear-btn"
                onClick={onClearRecentWorkspaces}
                title="Clear recent workspaces list"
              >
                Clear History
              </button>
            </div>

            <div className="welcome-recent-list">
              {recentWorkspaces.slice(0, 5).map((ws) => (
                <div
                  key={ws.path}
                  className="welcome-recent-item"
                  onClick={() => onOpenRecentWorkspace(ws.path)}
                  title={`Open workspace: ${ws.path}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onOpenRecentWorkspace(ws.path)
                    }
                  }}
                >
                  <span className="material-symbols-outlined welcome-recent-icon">folder</span>
                  <div className="welcome-recent-details truncate">
                    <span className="welcome-recent-name">{ws.name}</span>
                    <span className="welcome-recent-path truncate">{ws.path}</span>
                  </div>
                  <span className="material-symbols-outlined welcome-recent-arrow">chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Quick Guide */}
        <div className="welcome-shortcuts-bar">
          <div className="welcome-shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>K</kbd>
            <span>Command Palette</span>
          </div>
          <div className="welcome-shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>O</kbd>
            <span>Open File</span>
          </div>
          <div className="welcome-shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>N</kbd>
            <span>New Document</span>
          </div>
          <div className="welcome-shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>`</kbd>
            <span>Output & Logs</span>
          </div>
        </div>
      </div>
    </div>
  )
}
