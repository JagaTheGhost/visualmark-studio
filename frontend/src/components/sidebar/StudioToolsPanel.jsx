import React, { useState, useMemo } from 'react'
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

  return (
    <div className="tools-panel">
      {/* Header info & Stats banner */}
      <div className="tools-intro">
        <div className="tools-intro-top">
          <span className="section-label">STUDIO WORKSPACE SUITE</span>
          <span className="tools-count-badge">
            {openStudioTabs.length > 0 ? (
              <>
                <span className="pulse-dot-green" />
                {openStudioTabs.length} active in tabs
              </>
            ) : (
              `${STUDIO_TOOLS_LIST.length} studios ready`
            )}
          </span>
        </div>
        <p className="tools-sub">
          Interactive designers to visually assemble and configure badges, architecture flowcharts, tables, directory trees, and APIs.
        </p>

        {/* Search Bar */}
        <div className="templates-search-box" style={{ marginTop: '10px' }}>
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

        {/* Category Filter Pills (with mouse wheel horizontal scroll) */}
        <div className="templates-category-pills custom-scrollbar" data-horizontal-scroll="true" style={{ marginTop: '8px' }}>
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

      {/* Studio Tools Grid */}
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
                className={`studio-tool-card ${isOpen ? 'is-open' : ''} ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  if (isOpen) {
                    onSelectFile(tool.id)
                  } else {
                    onOpenStudioTab(tool.id)
                  }
                }}
                title={isOpen ? `Switch to ${tool.title}` : `Open ${tool.title} tab`}
              >
                <div className="tool-card-top">
                  <div
                    className="tool-card-icon-wrap"
                    style={{
                      backgroundColor: `${tool.color}15`,
                      borderColor: `${tool.color}45`,
                      boxShadow: `0 0 14px ${tool.color}25`
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: tool.color }}>
                      {tool.icon}
                    </span>
                  </div>
                  <div className="tool-card-info">
                    <div className="tool-card-title-row">
                      <span className="tool-card-title">{tool.title}</span>
                      {isActive ? (
                        <span className="status-badge-active">
                          <span className="pulse-dot" /> Active
                        </span>
                      ) : isOpen ? (
                        <span className="status-badge-open">
                          <span className="pulse-dot-green" /> In Tabs
                        </span>
                      ) : (
                        <span className="status-badge-category">{tool.category}</span>
                      )}
                    </div>
                    <span className="tool-card-id">{tool.id}</span>
                  </div>
                </div>

                <p className="tool-card-desc">{tool.description}</p>

                <div className="tool-card-features">
                  {tool.features.map((feat, i) => (
                    <span key={i} className="tool-feat-pill">
                      <span className="material-symbols-outlined icon-xs" style={{ color: tool.color }}>
                        auto_awesome
                      </span>
                      {feat}
                    </span>
                  ))}
                </div>

                <div className="tool-card-actions" onClick={(e) => e.stopPropagation()}>
                  {isOpen ? (
                    <>
                      <button
                        type="button"
                        className={`tool-action-btn primary ${isActive ? 'current' : ''}`}
                        onClick={() => onSelectFile(tool.id)}
                        title={isActive ? `Currently viewing ${tool.title}` : `Switch to ${tool.title} tab`}
                      >
                        <span className="material-symbols-outlined icon-xs">
                          {isActive ? 'visibility' : 'tab'}
                        </span>
                        {isActive ? 'Currently Active' : 'Switch to Tab'}
                      </button>
                      <button
                        type="button"
                        className="tool-action-btn remove-btn"
                        onClick={() => onCloseStudioTab(tool.id)}
                        title="Close tab from top bar"
                      >
                        <span className="material-symbols-outlined icon-xs">close</span>
                        Close Tab
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="tool-action-btn primary launch-btn"
                      onClick={() => onOpenStudioTab(tool.id)}
                      title="Open dedicated studio workspace tab in top bar"
                    >
                      <span className="material-symbols-outlined icon-xs">open_in_new</span>
                      Launch Studio Tab
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
