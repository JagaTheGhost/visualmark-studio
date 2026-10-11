import React, { useState, useEffect } from 'react'
import { APP_CURRENT_VERSION, RELEASE_HISTORY } from '../data/releaseNotes'
import appLogo from '../assets/logo.png'

export default function WhatsNewModal({
  isOpen,
  onClose,
  updateDownloaded = null, // { version, releaseNotes } if update is ready to install
  onRestartToUpdate = () => {}
}) {
  const [selectedVersion, setSelectedVersion] = useState(APP_CURRENT_VERSION)
  const [suppressAutoShow, setSuppressAutoShow] = useState(() => {
    return localStorage.getItem('visualmark_suppress_whats_new') === 'true'
  })

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const activeRelease = RELEASE_HISTORY.find((r) => r.version === selectedVersion) || RELEASE_HISTORY[0]

  const handleToggleSuppress = (checked) => {
    setSuppressAutoShow(checked)
    try {
      localStorage.setItem('visualmark_suppress_whats_new', checked ? 'true' : 'false')
    } catch {}
  }

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'major': return 'badge-major'
      case 'minor': return 'badge-minor'
      case 'patch': return 'badge-patch'
      default: return 'badge-neutral'
    }
  }

  return (
    <div className="ide-confirm-backdrop whats-new-backdrop" onClick={onClose}>
      <div className="ide-confirm-dialog whats-new-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="whats-new-header">
          <div className="whats-new-header-left">
            <div className="whats-new-logo-badge">
              <img src={appLogo} alt="VisualMark Studio" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
            </div>
            <div>
              <div className="whats-new-title-row">
                <h3 className="whats-new-title">What's New in VisualMark Studio</h3>
                <span className={`whats-new-type-badge ${getTypeBadgeClass(activeRelease.type)}`}>
                  {activeRelease.type.toUpperCase()} RELEASE
                </span>
              </div>
              <p className="whats-new-subtitle">
                Version {activeRelease.version} &bull; {activeRelease.date}
              </p>
            </div>
          </div>
          <button type="button" className="whats-new-close-btn" onClick={onClose} title="Close (Esc)">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Update Downloaded Ready Callout Banner */}
        {updateDownloaded && (
          <div className="whats-new-update-banner">
            <div className="update-banner-info">
              <span className="material-symbols-outlined update-pulse-icon">system_update</span>
              <div>
                <strong>Update Ready: v{updateDownloaded.version}</strong>
                <p>New version downloaded silently in the background. Restart to apply update.</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-restart-update"
              onClick={onRestartToUpdate}
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              <span>Restart & Apply</span>
            </button>
          </div>
        )}

        {/* Multi-version tabs if more than 1 version exists */}
        {RELEASE_HISTORY.length > 1 && (
          <div className="whats-new-version-tabs">
            {RELEASE_HISTORY.map((rel) => (
              <button
                key={rel.version}
                type="button"
                className={`version-tab-btn ${selectedVersion === rel.version ? 'active' : ''}`}
                onClick={() => setSelectedVersion(rel.version)}
              >
                <span>v{rel.version}</span>
                {rel.isCurrent && <span className="tab-current-pill">Current</span>}
              </button>
            ))}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="whats-new-body custom-scrollbar">
          {/* Main Highlights Card */}
          <div className="whats-new-hero-card">
            <h4 className="hero-card-title">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <span>{activeRelease.title}</span>
            </h4>
            <ul className="hero-highlights-list">
              {activeRelease.highlights.map((h, i) => (
                <li key={i}>
                  <span className="bullet-check material-symbols-outlined">check_circle</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorized Sections */}
          <div className="whats-new-sections">
            {activeRelease.sections.map((sec, idx) => (
              <div key={idx} className="whats-new-section-group">
                <div className="section-group-header">
                  <span className="material-symbols-outlined" style={{ color: sec.color }}>
                    {sec.icon}
                  </span>
                  <span className="section-group-label">{sec.category}</span>
                  <span className="section-group-badge" style={{ borderColor: `${sec.color}44`, color: sec.color }}>
                    {sec.badge}
                  </span>
                </div>
                <div className="section-cards-grid">
                  {sec.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="section-feature-card">
                      <div className="feature-card-title">{item.title}</div>
                      <div className="feature-card-desc">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="whats-new-footer">
          <label className="whats-new-checkbox-label">
            <input
              type="checkbox"
              checked={suppressAutoShow}
              onChange={(e) => handleToggleSuppress(e.target.checked)}
            />
            <span>Don't show automatically on minor updates</span>
          </label>
          <button type="button" className="btn-whats-new-close" onClick={onClose}>
            Got it, Let's Write!
          </button>
        </div>
      </div>
    </div>
  )
}