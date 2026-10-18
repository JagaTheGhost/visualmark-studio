import React, { useState, useCallback } from 'react'

/**
 * UnsupportedFileViewer
 * Tactile, embedded fail-safe screen matching the VisualMark Studio WelcomeLauncher design system.
 * Replaces the dated boxy dialog with seamless workspace integration, tactile depth cards,
 * metadata specifications tray, and keyboard shortcuts.
 */
export default function UnsupportedFileViewer({ fileInfo, onCloseTab, onOpenStudioTab }) {
  const {
    fileName = 'Unknown File',
    filePath = '',
    extension = '',
    size = 0,
    reason = 'binary_content'
  } = fileInfo || {}

  const [copied, setCopied] = useState(false)

  const ext = (extension || '').toLowerCase()
  const isImageOrMedia = ['gif', 'png', 'jpg', 'jpeg', 'webp', 'svg', 'ico', 'bmp', 'avif'].includes(ext)
  const isVideo = ['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext)
  const isAudio = ['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext)
  const isArchive = ['zip', 'tar', 'gz', '7z', 'rar'].includes(ext)

  const getFormatIcon = () => {
    if (ext === 'gif') return 'gif'
    if (isImageOrMedia) return 'image'
    if (isVideo) return 'videocam'
    if (isAudio) return 'audio_file'
    if (isArchive) return 'folder_zip'
    return 'draft'
  }

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleRevealInExplorer = () => {
    if (window.electronAPI?.showItemInFolder && filePath) {
      window.electronAPI.showItemInFolder(filePath)
    }
  }

  const handleOpenSystem = async () => {
    if (window.electronAPI?.openPathInOs && filePath) {
      await window.electronAPI.openPathInOs(filePath)
    }
  }

  const handleCopyPath = useCallback(async () => {
    if (!filePath) return
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(filePath)
      } else {
        const ta = document.createElement('textarea')
        ta.value = filePath
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback ignore
    }
  }, [filePath])

  const getReasonMessage = () => {
    if (reason === 'file_too_large') {
      return 'This file exceeds the 5MB editor memory safety threshold and was blocked to preserve IDE stability.'
    }
    return 'The file contains binary data or an unsupported format that cannot be displayed as plain text.'
  }

  return (
    <div className="welcome-launcher-container custom-scrollbar">
      <div className="welcome-launcher-card welcome-launcher-embedded">
        {/* Brand Header with Tactile Emblem */}
        <div className="welcome-brand-header">
          <div className="welcome-logo-wrap">
            <div className="unsupported-tactile-emblem">
              <span className="material-symbols-outlined" style={{ fontSize: '30px', color: '#fbbf24' }}>
                {getFormatIcon()}
              </span>
            </div>
            <div className="welcome-logo-glow unsupported-glow-amber" />
          </div>

          <div className="welcome-title-row">
            <h1 className="welcome-app-name">Cannot Open File in Editor</h1>
            <span className="welcome-version-badge">.{extension ? extension.toUpperCase() : 'BINARY'}</span>
          </div>

          <p className="welcome-tagline">
            {isImageOrMedia
              ? 'This media file cannot be rendered inside the plain text code editor.'
              : 'This file contains binary or compiled data that cannot be displayed as plain text.'}
          </p>
        </div>

        {/* Primary Action Buttons: Tactile Elevated Cards (Open in Default App & Reveal in Explorer) */}
        <div className="welcome-primary-cards">
          {/* 1. Open in Default App */}
          <button
            type="button"
            className="welcome-card welcome-card-clone"
            onClick={handleOpenSystem}
            title="Launch this file using default OS application"
          >
            <div className="welcome-card-icon-wrap icon-cyan">
              <span className="material-symbols-outlined">open_in_new</span>
            </div>
            <div className="welcome-card-content">
              <div className="welcome-card-title-row">
                <span className="welcome-card-title">Open in Default App</span>
                <span className="welcome-card-badge">OS SYSTEM</span>
              </div>
              <p className="welcome-card-desc">
                Launch this file directly using your operating system's configured viewer or media player.
              </p>
            </div>
            <span className="material-symbols-outlined welcome-card-arrow">arrow_forward</span>
          </button>

          {/* 2. Reveal in Explorer */}
          <button
            type="button"
            className="welcome-card welcome-card-open"
            onClick={handleRevealInExplorer}
            title="Locate and reveal this file in Windows File Explorer"
          >
            <div className="welcome-card-icon-wrap icon-amber">
              <span className="material-symbols-outlined">folder_open</span>
            </div>
            <div className="welcome-card-content">
              <div className="welcome-card-title-row">
                <span className="welcome-card-title">Reveal in Explorer</span>
                <span className="welcome-card-badge">LOCAL STORAGE</span>
              </div>
              <p className="welcome-card-desc">
                Open containing directory and highlight this file in Windows File Explorer.
              </p>
            </div>
            <span className="material-symbols-outlined welcome-card-arrow">arrow_forward</span>
          </button>
        </div>

        {/* Secondary Quick Action Buttons */}
        <div className="welcome-secondary-actions">
          {onCloseTab && (
            <button
              type="button"
              className="welcome-sub-btn"
              onClick={onCloseTab}
              title="Close this tab"
            >
              <span className="material-symbols-outlined">close</span>
              <span>Close Tab</span>
            </button>
          )}

          {filePath && (
            <button
              type="button"
              className="welcome-sub-btn"
              onClick={handleCopyPath}
              title="Copy absolute file path to clipboard"
            >
              <span className="material-symbols-outlined">{copied ? 'check' : 'content_copy'}</span>
              <span>{copied ? 'Path Copied!' : 'Copy Path'}</span>
            </button>
          )}

          {isImageOrMedia && onOpenStudioTab && (
            <button
              type="button"
              className="welcome-sub-btn"
              onClick={() => onOpenStudioTab('images.studio')}
              title="Open Image & Media Studio"
            >
              <span className="material-symbols-outlined">photo_library</span>
              <span>Image Studio</span>
            </button>
          )}
        </div>

        {/* Recessed Metadata & File Specifications Tray */}
        <div className="welcome-recent-section">
          <div className="welcome-recent-header">
            <div className="welcome-recent-title">
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>info</span>
              <span>FILE SPECIFICATIONS &amp; DIAGNOSTICS</span>
            </div>
            {filePath && (
              <button
                type="button"
                className="welcome-recent-clear-btn"
                onClick={handleCopyPath}
                title="Copy absolute file path"
              >
                {copied ? 'Copied' : 'Copy Path'}
              </button>
            )}
          </div>

          <div className="welcome-recent-list">
            {/* File Name Item */}
            <div className="welcome-recent-item" style={{ cursor: 'default' }}>
              <span className="material-symbols-outlined welcome-recent-icon" style={{ color: '#38bdf8' }}>
                description
              </span>
              <div className="welcome-recent-details">
                <span className="welcome-recent-name">{fileName}</span>
                <span className="welcome-recent-path">
                  {size > 0 ? formatFileSize(size) : 'Binary stream'} • {extension ? extension.toUpperCase() : 'RAW'} Format
                </span>
              </div>
              <span className="welcome-card-badge" style={{ color: '#38bdf8' }}>
                {extension ? `.${extension.toUpperCase()}` : 'FILE'}
              </span>
            </div>

            {/* Path Item */}
            {filePath && (
              <div
                className="welcome-recent-item"
                onClick={handleCopyPath}
                title="Click to copy full path to clipboard"
              >
                <span className="material-symbols-outlined welcome-recent-icon" style={{ color: '#fbbf24' }}>
                  folder
                </span>
                <div className="welcome-recent-details">
                  <span
                    className="welcome-recent-name"
                    style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px' }}
                  >
                    {filePath}
                  </span>
                  <span className="welcome-recent-path">Local Absolute Storage Path (Click to copy)</span>
                </div>
                <span
                  className="material-symbols-outlined welcome-recent-arrow"
                  style={{ opacity: 1, transform: 'none', color: copied ? '#10b981' : '#64748b' }}
                >
                  {copied ? 'check' : 'content_copy'}
                </span>
              </div>
            )}

            {/* Diagnostic Reason Item */}
            <div className="welcome-recent-item" style={{ cursor: 'default' }}>
              <span className="material-symbols-outlined welcome-recent-icon" style={{ color: '#94a3b8' }}>
                rule
              </span>
              <div className="welcome-recent-details">
                <span className="welcome-recent-name">Diagnostic Details</span>
                <span className="welcome-recent-path">{getReasonMessage()}</span>
              </div>
              <span className="welcome-card-badge" style={{ color: '#f59e0b' }}>
                NON-TEXT
              </span>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Bar */}
        <div className="welcome-shortcuts-bar">
          <div className="welcome-shortcut-item">
            <kbd>Ctrl</kbd>
            <span>+</span>
            <kbd>W</kbd>
            <span>Close Tab</span>
          </div>
          <div className="welcome-shortcut-item">
            <kbd>Ctrl</kbd>
            <span>+</span>
            <kbd>O</kbd>
            <span>Open File</span>
          </div>
          <div className="welcome-shortcut-item">
            <kbd>Ctrl</kbd>
            <span>+</span>
            <kbd>K</kbd>
            <span>Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  )
}
