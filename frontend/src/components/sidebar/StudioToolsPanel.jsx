import React, { useState, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { STUDIO_TOOLS_LIST } from './sidebarConstants'

export default function StudioToolsPanel({
  openStudioTabs = [],
  activeFile = null,
  onSelectFile = () => {},
  onOpenStudioTab = () => {},
  onCloseStudioTab = () => {}
}) {
  const [studioCategory, setStudioCategory] = useState('All')
  const [studioSearch, setStudioSearch] = useState('')
  const [hoveredTool, setHoveredTool] = useState(null)
  const [hoverPos, setHoverPos] = useState({ top: 0, left: 0 })
  const hoverTimeoutRef = useRef(null)

  const studioCategories = useMemo(() => [
    { id: 'All', label: 'All', count: STUDIO_TOOLS_LIST.length },
    { id: 'Open', label: 'In Tabs', count: STUDIO_TOOLS_LIST.filter((t) => openStudioTabs.includes(t.id)).length },
    { id: 'Visual', label: 'Visual Design', count: STUDIO_TOOLS_LIST.filter((t) => ['badges.studio', 'tables.studio', 'images.studio', 'icons.studio'].includes(t.id)).length },
    { id: 'Architecture', label: 'Architecture', count: STUDIO_TOOLS_LIST.filter((t) => ['diagrams.studio', 'tree.studio', 'snippets.studio'].includes(t.id)).length },
    { id: 'API & Specs', label: 'API & Quality', count: STUDIO_TOOLS_LIST.filter((t) => ['api.studio', 'audit.studio', 'contributors.studio', 'changelog.studio'].includes(t.id)).length }
  ], [openStudioTabs])

  const filteredStudioTools = useMemo(() => {
    return STUDIO_TOOLS_LIST.filter((tool) => {
      const q = studioSearch.trim().toLowerCase()
      if (q) {
        const matchTitle = tool.title.toLowerCase().includes(q)
        const matchDesc = tool.description.toLowerCase().includes(q)
        const matchId = tool.id.toLowerCase().includes(q)
        const matchCat = (tool.category || '').toLowerCase().includes(q)
        const matchFeat = tool.features.some((f) => f.toLowerCase().includes(q))
        if (!matchTitle && !matchDesc && !matchId && !matchCat && !matchFeat) return false
      }

      if (studioCategory === 'Open') return openStudioTabs.includes(tool.id)
      if (studioCategory === 'Visual') return ['badges.studio', 'tables.studio', 'images.studio', 'icons.studio'].includes(tool.id)
      if (studioCategory === 'Architecture') return ['diagrams.studio', 'tree.studio', 'snippets.studio'].includes(tool.id)
      if (studioCategory === 'API & Specs') return ['api.studio', 'audit.studio', 'contributors.studio', 'changelog.studio'].includes(tool.id)

      return true
    })
  }, [studioSearch, studioCategory, openStudioTabs])

  const handleMouseEnter = (tool, e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      const popoverHeight = 220
      let top = rect.top - 6
      if (top + popoverHeight > window.innerHeight - 15) {
        top = Math.max(10, window.innerHeight - popoverHeight - 15)
      }
      setHoverPos({ top, left: rect.right + 8 })
      setHoveredTool(tool)
    }, 130)
  }

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeoutRef.current)
    setHoveredTool(null)
  }

  return (
    <div className="tools-panel" onMouseLeave={handleMouseLeave}>
      {/* Header info & Stats banner */}
      <div className="tools-intro">
        <div className="tools-intro-top">
          <span className="section-label">STUDIO WORKSPACE SUITE</span>
          <span className="tools-count-badge">
            {openStudioTabs.length > 0 ? (
              <>
                <span className="pulse-dot-green" />
                {openStudioTabs.length} in tabs
              </>
            ) : (
              `${STUDIO_TOOLS_LIST.length} studios`
            )}
          </span>
        </div>

        {/* Search Bar */}
        <div className="templates-search-box" style={{ marginTop: '8px' }}>
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Filter studios (e.g. diagrams, badges, tree, API)..."
            value={studioSearch}
            onChange={(e) => setStudioSearch(e.target.value)}
            className="templates-search-input"
          />
          {studioSearch && (
            <button
              type="button"
              className="templates-search-clear"
              onClick={() => setStudioSearch('')}
              title="Clear filter"
            >
              <span className="material-symbols-outlined icon-xs">close</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="templates-category-pills custom-scrollbar" data-horizontal-scroll="true" style={{ marginTop: '7px' }}>
          {studioCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`template-cat-pill ${studioCategory === cat.id ? 'active' : ''}`}
              onClick={() => setStudioCategory(cat.id)}
            >
              {cat.label} <span className="cat-pill-count">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Minimal Studio Tools List */}
      <div className="tools-grid-list">
        {filteredStudioTools.length === 0 ? (
          <div className="templates-empty-state">
            <span className="material-symbols-outlined empty-icon">search_off</span>
            <p className="empty-title">No Studio Tools Found</p>
            <p className="empty-desc">No visual studios match your current filter query.</p>
            <button
              type="button"
              className="template-reset-btn"
              onClick={() => {
                setStudioSearch('')
                setStudioCategory('All')
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredStudioTools.map((tool) => {
            const isOpen = openStudioTabs.includes(tool.id)
            const isActive = activeFile === tool.id

            return (
              <div
                key={tool.id}
                className={`studio-item-row ${isOpen ? 'is-open' : ''} ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  if (isOpen) {
                    onSelectFile(tool.id)
                  } else {
                    onOpenStudioTab(tool.id)
                  }
                }}
                onMouseEnter={(e) => handleMouseEnter(tool, e)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Colored Icon Box */}
                <div
                  className="studio-item-icon-box"
                  style={{
                    backgroundColor: `${tool.color}15`,
                    borderColor: `${tool.color}35`,
                    color: tool.color
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    {tool.icon}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="studio-item-text">
                  <span className="studio-item-name">{tool.title}</span>
                  <div className="studio-item-sub">
                    <span className="studio-item-category">{tool.category}</span>
                    <span className="studio-item-dot">•</span>
                    <span className="studio-item-id">{tool.id}</span>
                  </div>
                </div>

                {/* Trailing Quick Status / Action */}
                <div className="studio-item-trailing" onClick={(e) => e.stopPropagation()}>
                  {isActive ? (
                    <span className="studio-row-active-pill" title="Currently Active in Workspace">
                      <span className="pulse-dot-green" /> Active
                    </span>
                  ) : isOpen ? (
                    <>
                      <span className="studio-row-open-pill">In Tabs</span>
                      <button
                        type="button"
                        className="studio-row-btn close-btn"
                        onClick={() => onCloseStudioTab(tool.id)}
                        title={`Close ${tool.title} tab`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="studio-row-btn"
                      onClick={() => onOpenStudioTab(tool.id)}
                      title={`Open ${tool.title} tab`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>open_in_new</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Floating Rich Hover Popover (like VS Code hover widget) */}
      {hoveredTool &&
        createPortal(
          <div
            className="studio-hover-popover"
            style={{
              top: `${hoverPos.top}px`,
              left: `${hoverPos.left}px`,
              borderColor: `${hoveredTool.color}45`,
              boxShadow: `0 16px 40px rgba(0, 0, 0, 0.75), 0 0 16px ${hoveredTool.color}20`
            }}
          >
            {/* Popover Arrow */}
            <div className="studio-hover-arrow" style={{ borderColor: `${hoveredTool.color}45` }} />

            {/* Header */}
            <div className="studio-hover-header">
              <div
                className="studio-hover-icon"
                style={{
                  backgroundColor: `${hoveredTool.color}18`,
                  borderColor: `${hoveredTool.color}45`,
                  color: hoveredTool.color
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {hoveredTool.icon}
                </span>
              </div>
              <div className="studio-hover-titles">
                <div className="studio-hover-title-row">
                  <span className="studio-hover-title">{hoveredTool.title}</span>
                  <span
                    className="studio-hover-badge"
                    style={{
                      color: hoveredTool.color,
                      borderColor: `${hoveredTool.color}35`,
                      backgroundColor: `${hoveredTool.color}12`
                    }}
                  >
                    {hoveredTool.category}
                  </span>
                </div>
                <span className="studio-hover-id">{hoveredTool.id}</span>
              </div>
            </div>

            {/* Description */}
            <p className="studio-hover-desc">{hoveredTool.description}</p>

            {/* Capabilities */}
            {hoveredTool.features && hoveredTool.features.length > 0 && (
              <div className="studio-hover-features">
                <div className="studio-hover-features-title">KEY CAPABILITIES</div>
                <div className="studio-hover-pill-list">
                  {hoveredTool.features.map((feat, i) => (
                    <span key={i} className="studio-hover-pill">
                      <span className="material-symbols-outlined" style={{ fontSize: '12px', color: hoveredTool.color }}>
                        check_circle
                      </span>
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="studio-hover-footer">
              <span>
                {openStudioTabs.includes(hoveredTool.id) ? (
                  activeFile === hoveredTool.id ? (
                    <span style={{ color: '#818cf8', fontWeight: 600 }}>● Currently active in workspace</span>
                  ) : (
                    <span style={{ color: '#10b981', fontWeight: 500 }}>✓ In tabs • Click item to switch</span>
                  )
                ) : (
                  <span>Click to launch studio workspace</span>
                )}
              </span>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

