import React, { useState, useMemo } from 'react'

export default function OutlinePanel({
  outline = [],
  activeFile = 'README.md',
  onScrollToHeading = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [collapsedIds, setCollapsedIds] = useState(() => new Set())

  // Compute hierarchical tree relationships and sub-heading descendant counts
  const outlineWithHierarchy = useMemo(() => {
    return outline.map((item, idx) => {
      let descendantCount = 0
      const descendantIds = []

      for (let j = idx + 1; j < outline.length; j++) {
        if (outline[j].level > item.level) {
          descendantCount++
          descendantIds.push(outline[j].lineNumber)
        } else {
          break
        }
      }

      return {
        ...item,
        id: item.lineNumber,
        hasChildren: descendantCount > 0,
        descendantCount,
        descendantIds
      }
    })
  }, [outline])

  // Determine hidden line numbers from collapsed parent nodes
  const hiddenLineNumbers = useMemo(() => {
    const hidden = new Set()
    // When searching, bypass collapse so all matching headings are visible
    if (searchQuery.trim()) return hidden

    outlineWithHierarchy.forEach((item) => {
      if (collapsedIds.has(item.id)) {
        item.descendantIds.forEach((lineNum) => hidden.add(lineNum))
      }
    })
    return hidden
  }, [collapsedIds, outlineWithHierarchy, searchQuery])

  // Filter outline based on search query and hierarchical collapse visibility
  const visibleOutline = useMemo(() => {
    return outlineWithHierarchy.filter((item) => {
      if (hiddenLineNumbers.has(item.lineNumber)) {
        return false
      }

      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase().trim()
      return (
        item.text.toLowerCase().includes(q) ||
        `h${item.level}`.includes(q) ||
        `l${item.lineNumber}`.includes(q)
      )
    })
  }, [outlineWithHierarchy, hiddenLineNumbers, searchQuery])

  const allParentIds = useMemo(() => {
    return outlineWithHierarchy.filter((item) => item.hasChildren).map((item) => item.id)
  }, [outlineWithHierarchy])

  const hasAnyParents = allParentIds.length > 0
  const isAnyCollapsed = collapsedIds.size > 0

  const toggleCollapse = (id, e) => {
    e.stopPropagation()
    setCollapsedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleToggleCollapseAll = () => {
    if (isAnyCollapsed) {
      setCollapsedIds(new Set())
    } else {
      setCollapsedIds(new Set(allParentIds))
    }
  }

  const handleHeadingClick = (item) => {
    onScrollToHeading({
      text: item.text,
      line: item.lineNumber,
      level: item.level,
      slug: item.slug,
      timestamp: Date.now(),
      toString() {
        return this.text
      }
    })
  }

  return (
    <div className="outline-panel">
      {/* Header with Title, Counts, and Single Smart Collapse/Expand Toggle */}
      <div className="outline-header">
        <div className="outline-header-info">
          <span className="section-label">HEADINGS IN {activeFile}</span>
          <span className="outline-count">
            {searchQuery
              ? `${visibleOutline.length} of ${outline.length}`
              : `${outline.length} found`}
          </span>
        </div>

        {hasAnyParents && (
          <div className="outline-header-actions">
            <button
              type="button"
              className="outline-action-btn"
              onClick={handleToggleCollapseAll}
              title={isAnyCollapsed ? 'Expand All Sections' : 'Collapse All Sections'}
            >
              <span className="material-symbols-outlined">
                {isAnyCollapsed ? 'unfold_more' : 'unfold_less'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Search Input */}
      {outline.length > 3 && (
        <div className="outline-search-box">
          <span className="material-symbols-outlined outline-search-icon">search</span>
          <input
            type="text"
            className="outline-search-input"
            placeholder="Filter headings by name or H1-H6..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="outline-search-clear"
              onClick={() => setSearchQuery('')}
              title="Clear filter"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {outline.length === 0 ? (
        <div className="outline-empty">
          <span className="material-symbols-outlined">format_list_bulleted</span>
          <p>No headings detected yet. Add # Headings to your markdown to see an interactive table of contents.</p>
        </div>
      ) : visibleOutline.length === 0 ? (
        <div className="outline-empty">
          <span className="material-symbols-outlined">search_off</span>
          <p>No headings match "{searchQuery}"</p>
        </div>
      ) : (
        /* Hierarchical Outline Tree */
        <div className="outline-tree">
          {visibleOutline.map((item) => {
            const isCollapsed = collapsedIds.has(item.id)
            return (
              <div
                key={item.lineNumber}
                className={`outline-row level-${item.level} ${isCollapsed ? 'is-collapsed' : ''}`}
                style={{ paddingLeft: `${Math.max(4, (item.level - 1) * 14 + 4)}px` }}
              >
                {/* Expand / Collapse Chevron Button */}
                {item.hasChildren ? (
                  <button
                    type="button"
                    className="outline-chevron-btn"
                    onClick={(e) => toggleCollapse(item.id, e)}
                    title={isCollapsed ? `Expand ${item.descendantCount} subheadings` : 'Collapse section'}
                  >
                    <span className="material-symbols-outlined outline-chevron-icon">
                      {isCollapsed ? 'chevron_right' : 'expand_more'}
                    </span>
                  </button>
                ) : (
                  <span className="outline-chevron-placeholder" />
                )}

                {/* Main Heading Jump Button */}
                <button
                  type="button"
                  className="outline-item-btn"
                  onClick={() => handleHeadingClick(item)}
                  title={`Jump to "${item.text}" (H${item.level} • Line ${item.lineNumber})`}
                >
                  <span className="outline-hash" title={`Heading Level ${item.level}`}>
                    {'#'.repeat(item.level)}
                  </span>
                  <span className="outline-text truncate">{item.text}</span>

                  {/* Collapsed Children Count Pill */}
                  {isCollapsed && item.hasChildren && (
                    <span
                      className="outline-children-pill"
                      title={`${item.descendantCount} hidden subheadings`}
                    >
                      +{item.descendantCount}
                    </span>
                  )}

                  <span className="outline-line">L{item.lineNumber}</span>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
