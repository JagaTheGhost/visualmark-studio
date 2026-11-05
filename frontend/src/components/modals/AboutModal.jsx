import React, { useState, useEffect } from 'react'
import appLogo from '../../assets/logo.png'
import { APP_CURRENT_VERSION } from '../../data/releaseNotes'
import {
  SPONSOR_URL,
  REPO_URL,
  openSponsorUrl,
  openRepoUrl,
  openExternalUrl
} from '../../utils/sponsorGratitude'
import '../../styles/aboutModal.css'

export default function AboutModal({
  isOpen,
  onClose,
  appVersion = APP_CURRENT_VERSION,
  onOpenWhatsNew = null
}) {
  const [activeTab, setActiveTab] = useState('about') // 'about' | 'credits'
  const [copiedInfo, setCopiedInfo] = useState(false)

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // 1-Click Copy Diagnostic Info (VS Code / JetBrains standard)
  const handleCopyDiagnostics = () => {
    const platform = typeof navigator !== 'undefined' ? navigator.platform : 'win32'
    const info = [
      `VisualMark Studio v${appVersion || APP_CURRENT_VERSION}`,
      `Platform: ${platform}`,
      `License: MIT Open Source`,
      `Author: JagaTheGhost`,
      `Repository: https://github.com/JagaTheGhost/visualmark-studio`
    ].join('\n')

    navigator.clipboard.writeText(info)
    setCopiedInfo(true)
    setTimeout(() => setCopiedInfo(false), 2000)
  }

  // Handle navigating to Release Notes
  const handleOpenReleaseNotes = () => {
    onClose?.()
    if (onOpenWhatsNew) {
      onOpenWhatsNew()
    } else {
      openExternalUrl(`${REPO_URL}/releases/latest`)
    }
  }

  return (
    <div className="about-modal-backdrop" onClick={onClose}>
      <div className="about-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="about-modal-content">
          <img src={appLogo} alt="VisualMark Studio" className="about-modal-logo" />
          <h3 className="about-modal-title">VisualMark Studio</h3>

          {/* Version, Release Notes link, and Software Health status */}
          <div className="about-version-row">
            <span className="about-version-tag">v{appVersion || APP_CURRENT_VERSION}</span>
            <button
              type="button"
              className="about-release-notes-link"
              onClick={handleOpenReleaseNotes}
              title="Open Release Notes & Changelog"
            >
              <span>Release Notes</span>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>north_east</span>
            </button>
            <span className="about-status-pill">
              <span className="about-status-dot" />
              <span>Up to date</span>
            </span>
          </div>

          <p className="about-modal-desc">
            The Code + Visual Desktop IDE for Technical Documentation, Markdown Architecture, and Publishing Suites.
          </p>

          {/* Tab Selector */}
          <div className="about-tabs-bar">
            <button
              type="button"
              className={`about-tab-btn ${activeTab === 'about' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>info</span>
              <span>About</span>
            </button>
            <button
              type="button"
              className={`about-tab-btn ${activeTab === 'credits' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('credits')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>group</span>
              <span>Credits & Backers</span>
            </button>
          </div>

          {/* TAB 1: About Details */}
          {activeTab === 'about' && (
            <>
              <div className="about-modal-meta-box">
                <div className="about-modal-meta-row">
                  <span className="about-modal-meta-label">License</span>
                  <span className="about-modal-meta-value">MIT Open Source</span>
                </div>
                <div className="about-modal-meta-row">
                  <span className="about-modal-meta-label">Author</span>
                  <a
                    href="https://github.com/JagaTheGhost"
                    target="_blank"
                    rel="noreferrer"
                    className="about-modal-meta-link"
                  >
                    JagaTheGhost
                  </a>
                </div>
                <div className="about-modal-meta-row">
                  <span className="about-modal-meta-label">Repository</span>
                  <a
                    href={REPO_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="about-modal-meta-link"
                  >
                    github.com/JagaTheGhost/visualmark-studio
                  </a>
                </div>
                <div className="about-modal-meta-row">
                  <span className="about-modal-meta-label">Architecture</span>
                  <span className="about-modal-meta-value" style={{ color: '#38bdf8' }}>100% Local-First / Zero Cloud</span>
                </div>
              </div>

              {/* 1-Click Copy Diagnostics Info */}
              <div className="about-copy-row">
                <button
                  type="button"
                  className={`about-copy-btn ${copiedInfo ? 'is-copied' : ''}`}
                  onClick={handleCopyDiagnostics}
                  title="Copy version & diagnostic info to clipboard for bug reports"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                    {copiedInfo ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedInfo ? 'Copied Details' : 'Copy System Info'}</span>
                </button>
              </div>
            </>
          )}

          {/* TAB 2: Credits & Backers */}
          {activeTab === 'credits' && (
            <div className="about-credits-panel">
              <div className="about-credits-section-title">Open Source Foundations</div>
              <div className="about-credits-grid">
                <div className="about-credit-card">
                  <span className="about-credit-name">Monaco Editor</span>
                  <span className="about-credit-role">Code Editing Core</span>
                </div>
                <div className="about-credit-card">
                  <span className="about-credit-name">Mermaid.js</span>
                  <span className="about-credit-role">Architecture Diagrams</span>
                </div>
                <div className="about-credit-card">
                  <span className="about-credit-name">Electron</span>
                  <span className="about-credit-role">Desktop App Container</span>
                </div>
                <div className="about-credit-card">
                  <span className="about-credit-name">FastAPI</span>
                  <span className="about-credit-role">Python Sidecar Daemon</span>
                </div>
              </div>

              <div className="about-credits-section-title" style={{ marginTop: '4px' }}>Community Backers</div>
              <div className="about-backers-card">
                <p className="about-backers-desc">
                  VisualMark Studio is free forever and independently maintained. Backers directly support active development, code signing, and new diagram visual builders.
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                  <button
                    type="button"
                    className="about-btn about-btn-sponsor"
                    onClick={openSponsorUrl}
                    style={{ padding: '3px 9px', fontSize: '11px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>favorite</span>
                    <span>Become a Backer</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="about-modal-footer">
          <div className="about-modal-footer-left">
            <button
              type="button"
              className="about-btn about-btn-ghost"
              onClick={openRepoUrl}
              title="Star the repository on GitHub"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#f59e0b' }}>star</span>
              <span>GitHub</span>
            </button>
            <button
              type="button"
              className="about-btn about-btn-sponsor"
              onClick={openSponsorUrl}
              title="Support development on GitHub Sponsors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>favorite</span>
              <span>Sponsor</span>
            </button>
          </div>

          <button
            type="button"
            className="about-btn about-btn-primary"
            onClick={onClose}
            autoFocus
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
