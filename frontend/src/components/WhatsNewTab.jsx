import React, { useState, useMemo, useEffect, useRef } from 'react'
import { APP_CURRENT_VERSION, RELEASE_HISTORY } from '../data/releaseNotes'
import appLogo from '../assets/logo.png'

/**
 * Parses inline markdown bold (**bold**) and backticks (`code`) into styled React elements.
 */
function formatMarkdownInline(text) {
  if (!text || typeof text !== 'string') return ''
  const tokenRegex = /(\b\*\*[^*]+\*\*\b|\*\*[^*]+\*\*|`[^`]+`)/g
  const parts = text.split(tokenRegex)

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="notes-bold-emphasis">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="whats-new-inline-code">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

/**
 * Automatically detects keyboard shortcuts in descriptions (e.g. F1, Ctrl+Shift+P, Alt+Z, Ctrl+`)
 * and transforms them into authentic styled <kbd> keycaps.
 */
function formatDescriptionWithKeycaps(text) {
  if (!text) return ''
  const pattern = /(\((?:Ctrl|Cmd|Alt|Shift|F\d+)[^)]*\)|`[^`]+`|\b(?:Ctrl|Cmd|Alt|Shift)\+[A-Za-z0-9`~+-]+|\bF\d+\b)/g
  const parts = text.split(pattern)

  return parts.map((part, index) => {
    if (!part) return null

    // Inline backtick code: `code`
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="whats-new-inline-code">
          {part.slice(1, -1)}
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

    return part
  })
}

/**
 * Transforms an array of highlight bullet points into a single cohesive narrative paragraph with bold keywords.
 */
function formatHighlightsAsParagraph(highlights) {
  if (!highlights || highlights.length === 0) return null
  return highlights.map((h, idx) => {
    const colonIdx = h.indexOf(':')
    if (colonIdx > 0 && colonIdx < 50) {
      const prefix = h.slice(0, colonIdx)
      const rest = h.slice(colonIdx + 1)
      return (
        <span key={idx}>
          <strong className="notes-bold-emphasis">{prefix}</strong>:{formatDescriptionWithKeycaps(rest)}{' '}
        </span>
      )
    }
    return <span key={idx}>{formatDescriptionWithKeycaps(h)}{' '}</span>
  })
}

/**
 * Groups releases by Series (e.g. v1.2.x Series, v1.1.x Series)
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
  updateDownloaded = null,
  updateProgress = null,
  updateError = null,
  onRestartToUpdate = () => {},
  onClose = () => {},
  onOpenSettings = () => {},
  onOpenShortcuts = () => {},
  onCheckForUpdates = () => {}
}) {
  const [activeVersion, setActiveVersion] = useState(APP_CURRENT_VERSION)
  const [treeFilter, setTreeFilter] = useState('')
  const [isTreeSearchOpen, setIsTreeSearchOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [lightboxMedia, setLightboxMedia] = useState(null)
  const [checkingUpdates, setCheckingUpdates] = useState(false)
  const [expandedCards, setExpandedCards] = useState({})
  const treeSearchInputRef = useRef(null)
  const mainPanelRef = useRef(null)
  const isSmoothScrollingRef = useRef(false)

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

  // Track currently visible release while user scrolls through the continuous feed
  useEffect(() => {
    const container = mainPanelRef.current
    if (!container) return

    const handleScroll = () => {
      if (isSmoothScrollingRef.current) return
      const containerRect = container.getBoundingClientRect()
      let currentVisible = null
      let minDistance = Infinity

      for (const rel of RELEASE_HISTORY) {
        const el = document.getElementById(`release-${rel.version}`)
        if (el) {
          const rect = el.getBoundingClientRect()
          const dist = Math.abs(rect.top - containerRect.top - 60)
          if (rect.top <= containerRect.top + 220 && dist < minDistance) {
            minDistance = dist
            currentVisible = rel.version
          }
        }
      }

      if (currentVisible && currentVisible !== activeVersion) {
        setActiveVersion(currentVisible)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [activeVersion])

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

  const handleToggleAll = () => {
    if (areAllExpanded) {
      const exp = {}
      releaseTree.forEach((series) => { exp[series.key] = false })
      setExpandedNodes(exp)
    } else {
      const exp = {}
      releaseTree.forEach((series) => { exp[series.key] = true })
      setExpandedNodes(exp)
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

  const handleSelectVersion = (version) => {
    setActiveVersion(version)
    const el = document.getElementById(`release-${version}`)
    if (el) {
      isSmoothScrollingRef.current = true
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => {
        isSmoothScrollingRef.current = false
      }, 700)
    }
  }

  const toggleCard = (cardId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
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

  return (
    <div className="whats-new-tab-workspace">
      {/* 1. Header Toolbar (Sticky Brand Bar) */}
      <header className="whats-new-tab-header">
        <div className="whats-new-header-main-row">
          <div className="whats-new-brand-group">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expand Release Tree Sidebar' : 'Collapse Release Tree Sidebar'}
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
                <span className="whats-new-type-badge badge-patch">
                  v{APP_CURRENT_VERSION}
                </span>
              </div>
              <p className="whats-new-tab-meta">
                <span>VisualMark Studio Changelog &amp; Release History</span>
              </p>
            </div>
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
              {/* Search Toggle Icon */}
              <button
                type="button"
                className={`ide-header-btn ${isTreeSearchOpen || treeFilter ? 'active' : ''}`}
                onClick={() => {
                  if (isTreeSearchOpen && !treeFilter) {
                    setIsTreeSearchOpen(false)
                  } else {
                    setIsTreeSearchOpen(true)
                    setTimeout(() => treeSearchInputRef.current?.focus(), 50)
                  }
                }}
                title="Search release versions"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  search
                </span>
              </button>

              {/* Expand / Collapse All */}
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

          {/* Collapsible Search Input Bar */}
          {(isTreeSearchOpen || treeFilter) && (
            <div className="tree-search-wrapper slide-down">
              <span className="material-symbols-outlined tree-search-icon">search</span>
              <input
                ref={treeSearchInputRef}
                type="text"
                className="tree-search-input"
                placeholder="Filter versions..."
                value={treeFilter}
                onChange={(e) => setTreeFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setTreeFilter('')
                    setIsTreeSearchOpen(false)
                  }
                }}
                onBlur={() => {
                  if (!treeFilter.trim()) {
                    setIsTreeSearchOpen(false)
                  }
                }}
              />
              <button
                type="button"
                className="tree-search-clear-btn"
                onClick={() => {
                  setTreeFilter('')
                  setIsTreeSearchOpen(false)
                }}
                title="Close search"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
              </button>
            </div>
          )}

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
                    onClick={() => {
                      setTreeFilter('')
                      setIsTreeSearchOpen(false)
                    }}
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
                          const isSelected = activeVersion === rel.version

                          return (
                            <button
                              key={rel.version}
                              type="button"
                              className={`tree-leaf-item ${isSelected ? 'active' : ''}`}
                              onClick={() => handleSelectVersion(rel.version)}
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

          {/* Docked Sidebar Footer: Update Check & Auto-Open Preference */}
          <div className="tree-sidebar-footer">
            <button
              type="button"
              className={`sidebar-update-btn ${checkingUpdates ? 'checking' : ''}`}
              onClick={handleTriggerCheckUpdates}
              disabled={checkingUpdates}
              title="Check GitHub for application updates"
            >
              <span className={`material-symbols-outlined sidebar-btn-icon ${checkingUpdates ? 'spinning' : ''}`}>
                {checkingUpdates ? 'sync' : 'system_update'}
              </span>
              <span>{checkingUpdates ? 'Checking Updates...' : 'Check for Updates'}</span>
            </button>

            <label className="sidebar-checkbox-label" title="Do not open Release Notes automatically on minor application updates">
              <input
                type="checkbox"
                checked={suppressAutoShow}
                onChange={(e) => handleToggleSuppress(e.target.checked)}
              />
              <span>Don't open on minor updates</span>
            </label>
          </div>
        </aside>

        {/* Right Column: Continuous Scroll Document Canvas */}
        <main ref={mainPanelRef} className="whats-new-main-panel custom-scrollbar">
          <div className="notes-preview-canvas">
            {/* Live Update Downloading Banner */}
            {updateProgress && !updateDownloaded && (
              <div className="whats-new-tab-update-banner">
                <div className="update-banner-left" style={{ flex: 1 }}>
                  <span className="material-symbols-outlined update-banner-pulse-icon" style={{ color: 'var(--text-secondary)' }}>cloud_download</span>
                  <div style={{ flex: 1, marginRight: '16px' }}>
                    <p className="update-banner-title">
                      Downloading Update: {updateProgress.percent || 0}%
                      {updateProgress.bytesPerSecond ? ` ΓÇó ${(updateProgress.bytesPerSecond / 1048576).toFixed(1)} MB/s` : ''}
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

            {/* Continuous Stream of All Release Notes */}
            <div className="notes-releases-stream">
              {RELEASE_HISTORY.map((rel) => {
                return (
                  <article
                    key={rel.version}
                    id={`release-${rel.version}`}
                    className="notes-release-block"
                  >
                    {/* Release Header */}
                    <header className="notes-doc-header">
                      <div className="notes-doc-meta-row">
                        <span className={`notes-version-tag ${getTypeBadgeClass(rel.type)}`}>
                          v{rel.version}
                        </span>
                        <span className="notes-type-text">{rel.type.toUpperCase()} RELEASE</span>
                        <span className="notes-dot">ΓÇó</span>
                        <span className="notes-date-text">{rel.date}</span>
                        {rel.isCurrent && (
                          <span className="notes-latest-indicator-pill">Active Version</span>
                        )}
                      </div>
                      <h2 className="notes-release-title">{rel.title}</h2>
                    </header>

                    {/* Overview: Plain text written directly on the background (Professional MD Editor feel) */}
                    {(rel.overview || rel.highlights?.length > 0) && (
                      <p className="notes-doc-overview">
                        {rel.overview ? (
                          formatMarkdownInline(rel.overview)
                        ) : (
                          formatHighlightsAsParagraph(rel.highlights)
                        )}
                      </p>
                    )}

                    {/* Collapsible Section Cards (Matching WelcomeLauncher Card Style) */}
                    {rel.sections && rel.sections.length > 0 && (
                      <div className="notes-cards-grid">
                        {rel.sections.map((sec, secIdx) => {
                          const cardId = `${rel.version}-${secIdx}`
                          const isExpanded = expandedCards[cardId] === true

                          return (
                            <div
                              key={secIdx}
                              className={`welcome-style-card ${isExpanded ? 'expanded' : ''}`}
                              onClick={() => toggleCard(cardId)}
                            >
                              {/* Card Header Row */}
                              <div className="welcome-card-header-row">
                                <div className="welcome-card-left-group">
                                  <div
                                    className="welcome-card-icon-wrap"
                                    style={{
                                      backgroundColor: `${sec.color || '#6366f1'}15`,
                                      color: sec.color || '#6366f1',
                                      border: `1px solid ${sec.color || '#6366f1'}33`
                                    }}
                                  >
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                      {sec.icon || 'folder'}
                                    </span>
                                  </div>
                                  <div className="welcome-card-text-group">
                                    <span className="welcome-card-title">{sec.category}</span>
                                    <span className="welcome-card-desc">
                                      {sec.items?.length || 0} {sec.items?.length === 1 ? 'topic' : 'topics'} ΓÇó Click to {isExpanded ? 'collapse' : 'view details'}
                                    </span>
                                  </div>
                                </div>

                                <div className="welcome-card-right-group">
                                  {sec.badge && (
                                    <span className="welcome-card-badge">{sec.badge}</span>
                                  )}
                                  <span className={`material-symbols-outlined welcome-card-chevron ${isExpanded ? 'rotated' : ''}`}>
                                    expand_more
                                  </span>
                                </div>
                              </div>

                              {/* Collapsible Content Revealed on Demand */}
                              {isExpanded && (
                                <div
                                  className="welcome-card-expanded-body"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="welcome-card-inner-divider" />
                                  <div className="welcome-card-items-flow">
                                    {sec.items?.map((item, itemIdx) => (
                                      <div key={itemIdx} className="welcome-card-item-entry">
                                        <h4 className="welcome-card-item-title">{item.title}</h4>
                                        <p className="welcome-card-item-desc">
                                          {formatDescriptionWithKeycaps(item.desc)}
                                        </p>

                                        {/* Optional Media (Image / Video) */}
                                        {item.media && (
                                          <div
                                            className="notes-media-box"
                                            onClick={() => setLightboxMedia(item.media)}
                                            title="Click to enlarge"
                                          >
                                            <img
                                              src={item.media.url}
                                              alt={item.media.alt || item.title}
                                              className="notes-media-img"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <div className="notes-release-stream-separator" />
                  </article>
                )
              })}
            </div>
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
