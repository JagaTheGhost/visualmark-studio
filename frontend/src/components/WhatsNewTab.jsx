import React, { useState, useMemo, useEffect } from 'react'
import { APP_CURRENT_VERSION, RELEASE_HISTORY } from '../data/releaseNotes'
import appLogo from '../assets/logo.png'

/**
 * Wraps search query matches in an authentic <mark> element with glowing highlight styling.
 */
function highlightSearchMatch(text, query) {
  if (!query || !text || typeof text !== 'string') return text
  const cleanQuery = query.trim()
  if (!cleanQuery) return text
  const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  if (parts.length === 1) return text

  return parts.map((part, index) =>
    part.toLowerCase() === cleanQuery.toLowerCase() ? (
      <mark key={index} className="whats-new-search-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

/**
 * Automatically detects keyboard shortcuts in descriptions (e.g. F1, Ctrl+Shift+P, Alt+Z, Ctrl+`)
 * and transforms them into authentic styled <kbd> keycaps, while also supporting search highlighting.
 */
function formatDescriptionWithKeycaps(text, searchQuery = '') {
  if (!text) return ''
  const pattern = /(\((?:Ctrl|Cmd|Alt|Shift|F\d+)[^)]*\)|`[^`]+`|\b(?:Ctrl|Cmd|Alt|Shift)\+[A-Za-z0-9`~+-]+|\bF\d+\b)/g
  const parts = text.split(pattern)

  return parts.map((part, index) => {
    if (!part) return null

    // Inline backtick code: `code`
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="whats-new-inline-code">
          {highlightSearchMatch(part.slice(1, -1), searchQuery)}
        </code>
      )
    }

    // Shortcut inside parentheses e.g. (Ctrl+Alt+Up) or raw shortcut e.g. Ctrl+Shift+P or F1
    const isParenShortcut = part.startsWith('(') && part.endsWith(')') && /(Ctrl|Alt|Shift|F\d)/i.test(part)
    const isRawShortcut = /^(?:Ctrl|Cmd|Alt|Shift)\+[A-Za-z0-9`~+-]+$/i.test(part) || /^F\d+$/i.test(part)

    if (isParenShortcut || isRawShortcut) {
      const clean = isParenShortcut ? part.slice(1, -1).trim() : part.trim()
      const combos = clean.split(/\s*\/\s*/)
      return (
        <span key={index} className="whats-new-kbd-group">
          {isParenShortcut && <span className="kbd-paren">(</span>}
          {combos.map((combo, cIdx) => (
            <React.Fragment key={cIdx}>
              {cIdx > 0 && <span className="kbd-separator"> / </span>}
              <kbd className="whats-new-kbd">{combo}</kbd>
            </React.Fragment>
          ))}
          {isParenShortcut && <span className="kbd-paren">)</span>}
        </span>
      )
    }

    return highlightSearchMatch(part, searchQuery)
  })
}

/**
 * Builds a clean release series tree:
 * Groups releases by Series (e.g. v1.0.x Series)
 * Each series contains its chronologically ordered point releases.
 */
function buildReleaseTree(releases) {
  const groups = {}

  releases.forEach((rel) => {
    const parts = (rel.version || '1.0.0').split('.')
    const majorNum = parts[0] || '1'
    const minorNum = parts[1] || '0'
    const seriesKey = `v${majorNum}.${minorNum}.x`
    const seriesLabel = `v${majorNum}.${minorNum}.x Series`

    if (!groups[seriesKey]) {
      groups[seriesKey] = {
        key: seriesKey,
        label: seriesLabel,
        major: Number(majorNum),
        minor: Number(minorNum),
        releases: []
      }
    }
    groups[seriesKey].releases.push(rel)
  })

  return Object.values(groups).sort((a, b) => {
    if (b.major !== a.major) return b.major - a.major
    return b.minor - a.minor
  })
}

export default function WhatsNewTab({
  updateDownloaded = null, // { version, releaseNotes } if update is ready to install
  updateProgress = null, // { percent, transferred, total, bytesPerSecond }
  updateError = null,
  onRestartToUpdate = () => {},
  onClose = () => {},
  onOpenSettings = () => {},
  onOpenShortcuts = () => {},
  onCheckForUpdates = () => {}
}) {
  const [selectedVersion, setSelectedVersion] = useState(APP_CURRENT_VERSION)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [treeFilter, setTreeFilter] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // Docked open by default
  const [lightboxMedia, setLightboxMedia] = useState(null)
  const [checkingUpdates, setCheckingUpdates] = useState(false)
  const [suppressAutoShow, setSuppressAutoShow] = useState(() => {
    try {
      return localStorage.getItem('visualmark_suppress_whats_new') === 'true'
    } catch {
      return false
    }
  })

  // Keyboard shortcut listener to close Lightbox modal via Escape
  useEffect(() => {
    if (!lightboxMedia) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxMedia(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxMedia])

  const releaseTree = useMemo(() => buildReleaseTree(RELEASE_HISTORY), [])

  const [expandedNodes, setExpandedNodes] = useState(() => {
    const exp = {}
    releaseTree.forEach((series) => {
      exp[series.key] = true
    })
    return exp
  })

  const areAllExpanded = useMemo(() => {
    if (releaseTree.length === 0) return true
    return releaseTree.every((series) => expandedNodes[series.key] === true)
  }, [releaseTree, expandedNodes])

  const toggleNode = (key, e) => {
    if (e) e.stopPropagation()
    setExpandedNodes((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const expandAll = () => {
    const exp = {}
    releaseTree.forEach((series) => {
      exp[series.key] = true
    })
    setExpandedNodes(exp)
  }

  const collapseAll = () => {
    const exp = {}
    releaseTree.forEach((series) => {
      exp[series.key] = false
    })
    setExpandedNodes(exp)
  }

  const handleToggleAll = () => {
    if (areAllExpanded) {
      collapseAll()
    } else {
      expandAll()
    }
  }

  const handleTriggerCheckUpdates = async () => {
    if (checkingUpdates) return
    setCheckingUpdates(true)
    try {
      await onCheckForUpdates()
    } finally {
      setTimeout(() => setCheckingUpdates(false), 1200)
    }
  }

  const filteredTree = useMemo(() => {
    const filterLower = treeFilter.trim().toLowerCase()
    if (!filterLower) {
      return releaseTree.map((s) => ({
        ...s,
        matchingReleases: s.releases
      }))
    }

    return releaseTree
      .map((s) => {
        const matches = s.releases.filter((rel) => {
          return (
            rel.version.toLowerCase().includes(filterLower) ||
            rel.type.toLowerCase().includes(filterLower) ||
            rel.title.toLowerCase().includes(filterLower) ||
            (rel.highlights && rel.highlights.some((h) => h.toLowerCase().includes(filterLower)))
          )
        })
        return {
          ...s,
          matchingReleases: matches
        }
      })
      .filter((s) => s.matchingReleases.length > 0)
  }, [releaseTree, treeFilter])

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

  const categories = useMemo(() => {
    const list = [{ id: 'all', label: 'All Categories' }]
    activeRelease.sections.forEach((sec) => {
      list.push({ id: sec.category, label: sec.category })
    })
    return list
  }, [activeRelease])

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

  const filteredHighlights = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return activeRelease.highlights || []
    return (activeRelease.highlights || []).filter((h) => h.toLowerCase().includes(query))
  }, [activeRelease, searchQuery])

  return (
    <div className="whats-new-tab-workspace custom-scrollbar select-none">
      {/* 1. Header Toolbar (Clean, minimal, uncluttered) */}
      <header className="whats-new-tab-header">
        <div className="whats-new-header-main-row">
          <div className="whats-new-brand-group">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Show Version Tree' : 'Hide Version Tree'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {sidebarCollapsed ? 'dock_to_left' : 'left_panel_close'}
              </span>
              <span>{sidebarCollapsed ? 'Show Tree' : 'Hide Tree'}</span>
            </button>

            <div className="whats-new-logo-badge">
              <img
                src={appLogo}
                alt="VisualMark Studio"
                className="whats-new-logo-img"
              />
            </div>
            <div className="whats-new-header-text">
              <div className="whats-new-title-badge-wrap">
                <h2 className="whats-new-tab-title">Release Notes</h2>
                <span className={`whats-new-type-badge ${getTypeBadgeClass(activeRelease.type)}`}>
                  v{activeRelease.version}
                </span>
              </div>
              <p className="whats-new-tab-meta">
                <span>{activeRelease.date}</span>
                <span>&bull;</span>
                <span>VisualMark Studio Changelog</span>
              </p>
            </div>
          </div>

          <div className="whats-new-header-actions">
            <button
              type="button"
              className={`whats-new-action-btn check-update-btn ${checkingUpdates ? 'checking' : ''}`}
              onClick={handleTriggerCheckUpdates}
              disabled={checkingUpdates}
              title="Check GitHub for application updates"
            >
              <span className={`material-symbols-outlined btn-icon ${checkingUpdates ? 'spinning' : ''}`}>
                {checkingUpdates ? 'sync' : 'system_update'}
              </span>
              <span>{checkingUpdates ? 'Checking for Updates...' : 'Check for Updates'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Two-Column Layout */}
      <div className="whats-new-two-column-layout">
        {/* Left Column: Version Tree Sidebar (Docked) */}
        <aside className={`whats-new-tree-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          {/* Header styled identically to .ide-explorer-header in Explorer */}
          <div className="tree-sidebar-header">
            <div className="tree-sidebar-title">
              <span>RELEASE HISTORY</span>
              <span className="tree-header-count">{RELEASE_HISTORY.length}</span>
            </div>

            <div className="tree-sidebar-actions">
              <button
                type="button"
                className="ide-header-btn"
                onClick={handleToggleAll}
                title={areAllExpanded ? 'Collapse All Series' : 'Expand All Series'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  {areAllExpanded ? 'unfold_less' : 'unfold_more'}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Tree Search Filter */}
          <div className="tree-search-wrapper">
            <span className="material-symbols-outlined tree-search-icon">search</span>
            <input
              type="text"
              className="tree-search-input"
              placeholder="Filter versions..."
              value={treeFilter}
              onChange={(e) => setTreeFilter(e.target.value)}
            />
            {treeFilter && (
              <button
                type="button"
                className="tree-search-clear-btn"
                onClick={() => setTreeFilter('')}
                title="Clear filter"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
              </button>
            )}
          </div>

          {/* Hierarchical Tree Nodes (Grouped by Release Series) */}
          <div className="tree-scroll-container custom-scrollbar">
            {filteredTree.length === 0 ? (
              <div className="tree-empty-filter-state">
                <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#6e7681' }}>
                  filter_list_off
                </span>
                <p>No matching releases</p>
                {treeFilter && (
                  <button
                    type="button"
                    className="tree-empty-clear-btn"
                    onClick={() => setTreeFilter('')}
                  >
                    Reset filter
                  </button>
                )}
              </div>
            ) : (
              filteredTree.map((series) => {
                const isExpanded = treeFilter.trim() ? true : (expandedNodes[series.key] === true)

                return (
                  <div key={series.key} className="tree-series-group">
                    {/* Series Header Row */}
                    <div
                      className="tree-series-header"
                      onClick={(e) => toggleNode(series.key, e)}
                    >
                      <div className="tree-series-title-group">
                        <span className={`material-symbols-outlined tree-series-chevron ${isExpanded ? 'open' : ''}`}>
                          chevron_right
                        </span>
                        <span className="material-symbols-outlined tree-series-icon">
                          {isExpanded ? 'folder_open' : 'folder'}
                        </span>
                        <span className="tree-series-label">{series.label}</span>
                      </div>
                      <span className="tree-series-count">{series.matchingReleases.length}</span>
                    </div>

                    {/* Connected Tree Release Leaves */}
                    {isExpanded && (
                      <div className="tree-series-releases-list">
                        {series.matchingReleases.map((rel) => {
                          const isSelected = selectedVersion === rel.version

                          return (
                            <button
                              key={rel.version}
                              type="button"
                              className={`tree-leaf-item ${isSelected ? 'active' : ''}`}
                              onClick={() => setSelectedVersion(rel.version)}
                            >
                              <div className="tree-leaf-left">
                                <span className="material-symbols-outlined tree-leaf-icon">
                                  {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                                </span>
                                <span className="tree-leaf-version">v{rel.version}</span>
                                {rel.isCurrent && (
                                  <span className="tree-leaf-pill current">Latest</span>
                                )}
                                {rel.type === 'major' && (
                                  <span className="tree-leaf-pill major">Major</span>
                                )}
                                {rel.type === 'minor' && (
                                  <span className="tree-leaf-pill minor">Minor</span>
                                )}
                              </div>
                              <span className="tree-leaf-date">
                                {rel.date.replace('October ', 'Oct ')}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </aside>

        {/* Right Column: Centered Document Preview Canvas (Matching Image 4) */}
        <main className="whats-new-main-panel custom-scrollbar">
          <div className="notes-preview-canvas">
            {/* Live Update Downloading Banner */}
            {updateProgress && !updateDownloaded && (
              <div className="whats-new-tab-update-banner">
                <div className="update-banner-left" style={{ flex: 1 }}>
                  <span className="material-symbols-outlined update-banner-pulse-icon" style={{ color: 'var(--text-secondary)' }}>cloud_download</span>
                  <div style={{ flex: 1, marginRight: '16px' }}>
                    <p className="update-banner-title">
                      Downloading Update: {updateProgress.percent || 0}%
                      {updateProgress.bytesPerSecond ? ` • ${(updateProgress.bytesPerSecond / 1048576).toFixed(1)} MB/s` : ''}
                    </p>
                    <div style={{ background: 'rgba(255,255,255,0.08)', height: '4px', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                      <div style={{ background: '#007acc', height: '100%', width: `${updateProgress.percent || 0}%`, transition: 'width 0.3s ease' }} />
                    </div>
                    <p className="update-banner-subtitle" style={{ marginTop: '4px' }}>
                      {Math.round((updateProgress.transferred || 0) / 1048576)} MB of {Math.round((updateProgress.total || 0) / 1048576)} MB downloaded.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                  <span>Restart &amp; Apply</span>
                </button>
              </div>
            )}

            {/* Filter Bar (Search & Category tags) */}
            <div className="notes-filter-bar">
              <div className="notes-search-wrapper">
                <span className="material-symbols-outlined notes-search-icon">search</span>
                <input
                  type="text"
                  className="notes-search-input"
                  placeholder="Filter release notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="notes-search-clear"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="notes-category-tags">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`notes-tag-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Document Body (Centered layout exactly like Image 4) */}
            <article className="notes-document">
              {/* Release Header */}
              <header className="notes-doc-header">
                <h1 className="notes-doc-h1">
                  {highlightSearchMatch(activeRelease.title, searchQuery)}
                </h1>
                <div className="notes-doc-meta-row">
                  <span className={`notes-version-tag ${getTypeBadgeClass(activeRelease.type)}`}>
                    v{activeRelease.version}
                  </span>
                  <span className="notes-type-text">{activeRelease.type.toUpperCase()} RELEASE</span>
                  <span className="notes-dot">•</span>
                  <span className="notes-date-text">{activeRelease.date}</span>
                </div>
              </header>

              {/* Highlights Callout Quote (Styled exactly like Image 4's blue accent callout) */}
              {filteredHighlights.length > 0 && (
                <blockquote className="notes-doc-callout">
                  <div className="notes-callout-header">
                    <span className="material-symbols-outlined notes-callout-icon">auto_awesome</span>
                    <strong>Highlights &amp; Overview:</strong>
                  </div>
                  <ul className="notes-callout-list">
                    {filteredHighlights.map((h, i) => (
                      <li key={i}>{formatDescriptionWithKeycaps(h, searchQuery)}</li>
                    ))}
                  </ul>
                </blockquote>
              )}

              {/* Document Sections (Styled like Image 4's numbered / titled sections) */}
              {filteredSections.length > 0 ? (
                <div className="notes-sections-flow">
                  {filteredSections.map((sec, idx) => {
                    const isFixes = sec.category.toLowerCase().includes('fix') || sec.category.toLowerCase().includes('stability') || sec.badge?.toLowerCase() === 'fix'

                    return (
                      <section key={idx} className="notes-doc-section">
                        <div className="notes-section-heading-row">
                          <h2 className="notes-section-h2">
                            <span className="notes-section-num">{idx + 1}.</span>
                            <span>{sec.category}</span>
                          </h2>
                          <span
                            className="notes-section-pill"
                            style={{
                              borderColor: `${sec.color}44`,
                              color: sec.color,
                              backgroundColor: `${sec.color}15`
                            }}
                          >
                            {sec.badge}
                          </span>
                        </div>

                        {isFixes ? (
                          <ul className="notes-fixes-checklist">
                            {sec.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="notes-fix-row">
                                <span className="material-symbols-outlined fix-bullet">check_circle</span>
                                <div className="fix-desc-wrap">
                                  <strong className="fix-item-title">{highlightSearchMatch(item.title, searchQuery)}: </strong>
                                  <span className="fix-item-desc">{formatDescriptionWithKeycaps(item.desc, searchQuery)}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="notes-items-list">
                            {sec.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="notes-item-entry">
                                <h3 className="notes-item-h3">
                                  {highlightSearchMatch(item.title, searchQuery)}
                                </h3>
                                <p className="notes-item-paragraph">
                                  {formatDescriptionWithKeycaps(item.desc, searchQuery)}
                                </p>

                                {/* Optional Media (Image / GIF / Video) */}
                                {item.media && (
                                  <div
                                    className="notes-media-box"
                                    onClick={() => setLightboxMedia(item.media)}
                                    title="Click to enlarge"
                                  >
                                    {item.media.type === 'video' ? (
                                      <video
                                        src={item.media.url}
                                        poster={item.media.poster}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="notes-media-player"
                                      />
                                    ) : (
                                      <img
                                        src={item.media.url}
                                        alt={item.media.alt || item.title}
                                        loading="lazy"
                                        className="notes-media-img"
                                      />
                                    )}
                                    <div className="notes-media-zoom-hint">
                                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>zoom_in</span>
                                      <span>Click to enlarge</span>
                                    </div>
                                    {item.media.caption && (
                                      <div className="notes-media-caption-text">{item.media.caption}</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    )
                  })}
                </div>
              ) : (
                <div className="whats-new-empty-search">
                  <span className="material-symbols-outlined text-muted" style={{ fontSize: '36px' }}>search_off</span>
                  <p>No changes found matching <strong>"{searchQuery}"</strong></p>
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

              {/* Document Footer */}
              <footer className="notes-doc-footer">
                <label className="whats-new-checkbox-label">
                  <input
                    type="checkbox"
                    checked={suppressAutoShow}
                    onChange={(e) => handleToggleSuppress(e.target.checked)}
                  />
                  <span>Don't open Release Notes automatically on minor application updates</span>
                </label>
              </footer>
            </article>
          </div>
        </main>
      </div>

      {/* 3. Click-to-Enlarge Lightbox Modal */}
      {lightboxMedia && (
        <div className="whats-new-lightbox-backdrop" onClick={() => setLightboxMedia(null)}>
          <div className="whats-new-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="whats-new-lightbox-header">
              <div className="whats-new-lightbox-title-wrap">
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#6366f1' }}>
                  {lightboxMedia.type === 'video' ? 'videocam' : 'image'}
                </span>
                <span className="whats-new-lightbox-title">
                  {lightboxMedia.alt || lightboxMedia.caption || 'Feature Media Preview'}
                </span>
              </div>
              <button
                type="button"
                className="whats-new-lightbox-close"
                onClick={() => setLightboxMedia(null)}
                title="Close Preview (Esc)"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
              </button>
            </div>

            <div className="whats-new-lightbox-body">
              {lightboxMedia.type === 'video' ? (
                <video
                  src={lightboxMedia.url}
                  controls
                  autoPlay
                  loop
                  className="whats-new-lightbox-player"
                />
              ) : (
                <img
                  src={lightboxMedia.url}
                  alt={lightboxMedia.alt || 'Release preview'}
                  className="whats-new-lightbox-image"
                />
              )}
            </div>

            {lightboxMedia.caption && (
              <div className="whats-new-lightbox-caption">
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#818cf8' }}>info</span>
                <span>{lightboxMedia.caption}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
