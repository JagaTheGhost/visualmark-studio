import React, { useState, useMemo } from 'react'
import { APP_CURRENT_VERSION, RELEASE_HISTORY } from '../data/releaseNotes'

export default function WhatsNewTab({
  updateDownloaded = null, // { version, releaseNotes } if update is ready to install
  onRestartToUpdate = () => {},
  onClose = () => {},
  onOpenSettings = () => {},
  onOpenShortcuts = () => {},
  onCheckForUpdates = () => {}
}) {
  const [selectedVersion, setSelectedVersion] = useState(APP_CURRENT_VERSION)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [suppressAutoShow, setSuppressAutoShow] = useState(() => {
    try {
      return localStorage.getItem('visualmark_suppress_whats_new') === 'true'
    } catch {
      return false
    }
  })

  const activeRelease = useMemo(() => {
    return RELEASE_HISTORY.find((r) => r.version === selectedVersion) || RELEASE_HISTORY[0]
  }, [selectedVersion])

  const handleToggleSuppress = (checked) => {
    setSuppressAutoShow(checked)
    try {
      localStorage.setItem('visualmark_suppress_whats_new', checked ? 'true' : 'false')
    } catch (e) {
      console.warn('Could not save suppress preference to localStorage', e)
    }
  }

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'major': return 'badge-major'
      case 'minor': return 'badge-minor'
      case 'patch': return 'badge-patch'
      default: return 'badge-neutral'
    }
  }

  // Extract categories present in active release
  const categories = useMemo(() => {
    const list = [{ id: 'all', label: 'All Categories' }]
    activeRelease.sections.forEach((sec) => {
      list.push({ id: sec.category, label: sec.category })
    })
    return list
  }, [activeRelease])

  // Filter sections and items based on search query and category
  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return activeRelease.sections
      .filter((sec) => selectedCategory === 'all' || sec.category === selectedCategory)
      .map((sec) => {
        if (!query) return sec

        const matchingItems = sec.items.filter((item) => {
          return (
            item.title.toLowerCase().includes(query) ||
            item.desc.toLowerCase().includes(query) ||
            sec.category.toLowerCase().includes(query)
          )
        })

        return {
          ...sec,
          items: matchingItems
        }
      })
      .filter((sec) => sec.items.length > 0)
  }, [activeRelease, selectedCategory, searchQuery])

  // Filter hero highlights on search
  const filteredHighlights = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return activeRelease.highlights
    return activeRelease.highlights.filter((h) => h.toLowerCase().includes(query))
  }, [activeRelease, searchQuery])

  const totalFilteredFeatures = useMemo(() => {
    return filteredSections.reduce((acc, sec) => acc + sec.items.length, 0)
  }, [filteredSections])

  return (
    <div className="whats-new-tab-workspace custom-scrollbar select-none">
      {/* 1. Sticky Header Toolbar */}
      <div className="whats-new-tab-header">
        <div className="whats-new-header-main-row">
          <div className="whats-new-brand-group">
            <div className="whats-new-logo-badge">
              <img
                src="/logo.png"
                alt="VisualMark Studio"
                className="whats-new-logo-img"
              />
            </div>
            <div className="whats-new-header-text">
              <div className="whats-new-title-badge-wrap">
                <h2 className="whats-new-tab-title">Patch Notes</h2>
                <span className={`whats-new-type-badge ${getTypeBadgeClass(activeRelease.type)}`}>
                  {activeRelease.type.toUpperCase()} RELEASE
                </span>
              </div>
              <p className="whats-new-tab-meta">
                <span>Version {activeRelease.version}</span>
                <span>&bull;</span>
                <span>{activeRelease.date}</span>
                <span>&bull;</span>
                <span>VS Code Monaco Engine + Markdown IDE</span>
              </p>
            </div>
          </div>

          <div className="whats-new-header-actions">
            <button
              type="button"
              className="whats-new-action-btn primary"
              onClick={onCheckForUpdates}
              title="Check GitHub for application updates"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>system_update</span>
              <span>Check for Updates</span>
            </button>
            <button
              type="button"
              className="whats-new-action-btn"
              onClick={onOpenShortcuts}
              title="Configure and view keyboard shortcuts"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>keyboard</span>
              <span>Keyboard Shortcuts</span>
            </button>
            <button
              type="button"
              className="whats-new-action-btn"
              onClick={onOpenSettings}
              title="Open IDE Settings"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>settings</span>
              <span>Settings</span>
            </button>
            <button
              type="button"
              className="whats-new-action-btn close-btn"
              onClick={onClose}
              title="Close Release Notes Tab"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
              <span>Close Tab</span>
            </button>
          </div>
        </div>

        {/* Update Downloaded Ready Callout Banner */}
        {updateDownloaded && (
          <div className="whats-new-tab-update-banner">
            <div className="update-banner-left">
              <span className="material-symbols-outlined update-banner-pulse-icon">system_update</span>
              <div>
                <p className="update-banner-title">Update Ready to Install: v{updateDownloaded.version}</p>
                <p className="update-banner-subtitle">
                  VisualMark Studio downloaded the update silently in the background. Restart to apply patches immediately.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-tab-restart-update"
              onClick={onRestartToUpdate}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>restart_alt</span>
              <span>Restart & Apply</span>
            </button>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="whats-new-filter-toolbar">
          <div className="whats-new-search-box">
            <span className="material-symbols-outlined whats-new-search-icon">search</span>
            <input
              type="text"
              className="whats-new-search-input"
              placeholder="Search release highlights, features, or engines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="whats-new-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="whats-new-category-pills">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`whats-new-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.label}</span>
                {cat.id === 'all' && (
                  <span className="whats-new-pill-count">
                    {activeRelease.sections.reduce((acc, s) => acc + s.items.length, 0)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Scrollable Content Body */}
      <div className="whats-new-tab-content custom-scrollbar">
        {/* Multi-version tabs if more than 1 version exists in dataset */}
        {RELEASE_HISTORY.length > 1 && (
          <div className="whats-new-version-selector-bar">
            {RELEASE_HISTORY.map((rel) => (
              <button
                key={rel.version}
                type="button"
                className={`whats-new-version-tab-btn ${selectedVersion === rel.version ? 'active' : ''}`}
                onClick={() => setSelectedVersion(rel.version)}
              >
                <span>v{rel.version}</span>
                {rel.isCurrent && <span className="tab-current-pill">Current</span>}
              </button>
            ))}
          </div>
        )}

        {/* Hero Card: Core Release Highlights */}
        {filteredHighlights.length > 0 && (
          <div className="whats-new-tab-hero-card">
            <div className="hero-card-header">
              <span className="material-symbols-outlined hero-sparkle-icon">auto_awesome</span>
              <h3 className="hero-headline">{activeRelease.title}</h3>
            </div>
            <ul className="hero-highlights-list">
              {filteredHighlights.map((h, i) => (
                <li key={i}>
                  <span className="bullet-check material-symbols-outlined">check_circle</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="hero-action-row">
              <button
                type="button"
                className="hero-pill-action"
                onClick={onClose}
                title="Return to markdown document editing"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>edit_note</span>
                <span>Open Document Workspace</span>
              </button>
              <button
                type="button"
                className="hero-pill-action"
                onClick={onOpenSettings}
                title="Customize editor theme, fonts, and behavior"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>tune</span>
                <span>Configure Settings</span>
              </button>
              <button
                type="button"
                className="hero-pill-action"
                onClick={onOpenShortcuts}
                title="View full keyboard shortcut cheat sheet"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>bolt</span>
                <span>Hotkeys & Keybindings</span>
              </button>
            </div>
          </div>
        )}

        {/* Feature Sections & Grid */}
        {filteredSections.length > 0 ? (
          <div className="whats-new-section-container">
            {filteredSections.map((sec, idx) => (
              <div key={idx} className="whats-new-section-group">
                <div className="section-group-header">
                  <span
                    className="material-symbols-outlined section-group-icon"
                    style={{ color: sec.color }}
                  >
                    {sec.icon}
                  </span>
                  <span className="section-group-title">{sec.category}</span>
                  <span
                    className="section-group-badge"
                    style={{
                      borderColor: `${sec.color}55`,
                      color: sec.color,
                      backgroundColor: `${sec.color}15`
                    }}
                  >
                    {sec.badge}
                  </span>
                </div>

                <div className="whats-new-cards-grid">
                  {sec.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="whats-new-feature-card">
                      <div className="feature-card-header">
                        <h4 className="feature-card-title">{item.title}</h4>
                      </div>
                      <p className="feature-card-desc">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="whats-new-empty-search">
            <span className="material-symbols-outlined text-muted" style={{ fontSize: '32px' }}>search_off</span>
            <p>No release notes found matching <strong>"{searchQuery}"</strong></p>
            <button
              type="button"
              className="whats-new-action-btn"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* 3. Footer Bar with Preferences & Actions */}
        <div className="whats-new-tab-footer">
          <label className="whats-new-checkbox-label">
            <input
              type="checkbox"
              checked={suppressAutoShow}
              onChange={(e) => handleToggleSuppress(e.target.checked)}
            />
            <span>Don't open Release Notes automatically on minor application updates</span>
          </label>

          <div className="whats-new-footer-actions">
            <button
              type="button"
              className="btn-whats-new-done"
              onClick={onClose}
              title="Return to markdown document editor"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>check</span>
              <span>Got it, Let's Write!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
