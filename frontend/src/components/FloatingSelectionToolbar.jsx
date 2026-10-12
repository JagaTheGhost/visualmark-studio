import React, { useState, useRef, useEffect } from 'react'

export default function FloatingSelectionToolbar({
  position = { top: 0, left: 0, flipped: false },
  selectedText = '',
  onFormat = () => {},
  config = {},
  onClose = () => {}
}) {
  const [activeDropdown, setActiveDropdown] = useState(null) // 'headings' | 'codeblock' | 'callout' | 'table' | 'link'
  const [linkUrl, setLinkUrl] = useState('')
  const toolbarRef = useRef(null)

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeDropdown) {
          e.stopPropagation()
          setActiveDropdown(null)
        } else {
          onClose()
        }
      }
    }
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeDropdown, onClose])

  const toggleDropdown = (name, e) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveDropdown(prev => prev === name ? null : name)
  }

  const handleAction = (type, extra = '', e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    onFormat(type, extra)
    setActiveDropdown(null)
  }

  return (
    <div
      ref={toolbarRef}
      className={`floating-selection-toolbar ${position.flipped ? 'flipped' : ''}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
      onMouseDown={(e) => {
        // Prevent stealing focus from Monaco editor
        e.preventDefault()
      }}
    >
      <div className="floating-toolbar-inner">
        {/* ================= 1. Headings Dropdown ================= */}
        {config.showHeadings && (
          <div className="floating-btn-group relative">
            <button
              type="button"
              className={`floating-toolbar-btn dropdown-trigger ${activeDropdown === 'headings' ? 'active' : ''}`}
              title="Heading Style"
              onMouseDown={(e) => toggleDropdown('headings', e)}
            >
              <span className="font-semibold text-xs tracking-wider">T</span>
              <span className="floating-btn-text">Headings</span>
              <span className="dropdown-caret">▾</span>
            </button>

            {activeDropdown === 'headings' && (
              <div className="floating-dropdown-menu">
                <button
                  type="button"
                  className="floating-dropdown-item"
                  onMouseDown={(e) => handleAction('heading', 1, e)}
                >
                  <span className="heading-preview h1">H1</span>
                  <span>Heading 1</span>
                  <span className="dropdown-syntax">#</span>
                </button>
                <button
                  type="button"
                  className="floating-dropdown-item"
                  onMouseDown={(e) => handleAction('heading', 2, e)}
                >
                  <span className="heading-preview h2">H2</span>
                  <span>Heading 2</span>
                  <span className="dropdown-syntax">##</span>
                </button>
                <button
                  type="button"
                  className="floating-dropdown-item"
                  onMouseDown={(e) => handleAction('heading', 3, e)}
                >
                  <span className="heading-preview h3">H3</span>
                  <span>Heading 3</span>
                  <span className="dropdown-syntax">###</span>
                </button>
                <button
                  type="button"
                  className="floating-dropdown-item"
                  onMouseDown={(e) => handleAction('heading', 4, e)}
                >
                  <span className="heading-preview h4">H4</span>
                  <span>Heading 4</span>
                  <span className="dropdown-syntax">####</span>
                </button>
              </div>
            )}
          </div>
        )}

        {config.showHeadings && (config.showBold || config.showItalic || config.showStrikethrough || config.showInlineCode || config.showQuote) && (
          <div className="floating-divider" />
        )}

        {/* ================= 2. Basic Inline Formats ================= */}
        {config.showBold && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Bold (**text**)"
            onMouseDown={(e) => handleAction('bold', '', e)}
          >
            <strong>B</strong>
          </button>
        )}

        {config.showItalic && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Italic (*text*)"
            onMouseDown={(e) => handleAction('italic', '', e)}
          >
            <em>I</em>
          </button>
        )}

        {config.showStrikethrough && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Strikethrough (~~text~~)"
            onMouseDown={(e) => handleAction('strikethrough', '', e)}
          >
            <span style={{ textDecoration: 'line-through' }}>S</span>
          </button>
        )}

        {config.showInlineCode && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Inline Code (`code`)"
            onMouseDown={(e) => handleAction('code', '', e)}
          >
            <span className="font-mono text-xs">&lt;&gt;</span>
          </button>
        )}

        {config.showQuote && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Blockquote (> quote)"
            onMouseDown={(e) => handleAction('quote', '', e)}
          >
            <span className="material-symbols-outlined text-sm">format_quote</span>
          </button>
        )}

        {/* ================= 3. Code Block & Link & Image ================= */}
        {(config.showCodeblock || config.showLink || config.showImage) && (
          <div className="floating-divider" />
        )}

        {config.showCodeblock && (
          <div className="floating-btn-group relative">
            <button
              type="button"
              className={`floating-toolbar-btn dropdown-trigger ${activeDropdown === 'codeblock' ? 'active' : ''}`}
              title="Fenced Code Block"
              onMouseDown={(e) => toggleDropdown('codeblock', e)}
            >
              <span className="material-symbols-outlined text-sm">data_object</span>
              <span className="dropdown-caret">▾</span>
            </button>

            {activeDropdown === 'codeblock' && (
              <div className="floating-dropdown-menu">
                {['bash', 'javascript', 'typescript', 'python', 'json', 'html', 'css', 'markdown'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className="floating-dropdown-item"
                    onMouseDown={(e) => handleAction('codeblock', lang, e)}
                  >
                    <span>{lang}</span>
                    <span className="dropdown-syntax">```{lang}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {config.showLink && (
          <div className="floating-btn-group relative">
            <button
              type="button"
              className={`floating-toolbar-btn icon-btn ${activeDropdown === 'link' ? 'active' : ''}`}
              title="Insert Link ([text](url))"
              onMouseDown={(e) => toggleDropdown('link', e)}
            >
              <span className="material-symbols-outlined text-sm">link</span>
            </button>

            {activeDropdown === 'link' && (
              <div className="floating-popover-card" onMouseDown={(e) => e.stopPropagation()}>
                <div className="floating-popover-title">Insert Hyperlink</div>
                <div className="floating-popover-input-row">
                  <input
                    type="text"
                    className="floating-popover-input"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAction('link', linkUrl || 'https://', e)
                        setLinkUrl('')
                      }
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="floating-popover-submit"
                    onMouseDown={(e) => {
                      handleAction('link', linkUrl || 'https://', e)
                      setLinkUrl('')
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {config.showImage && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Image (![alt](url))"
            onMouseDown={(e) => handleAction('image', 'https://', e)}
          >
            <span className="material-symbols-outlined text-sm">image</span>
          </button>
        )}

        {/* ================= 4. Lists & Divider ================= */}
        {(config.showBulletList || config.showNumberedList || config.showTaskList || config.showDivider) && (
          <div className="floating-divider" />
        )}

        {config.showBulletList && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Bullet List (- item)"
            onMouseDown={(e) => handleAction('bulletList', '', e)}
          >
            <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
          </button>
        )}

        {config.showNumberedList && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Numbered List (1. item)"
            onMouseDown={(e) => handleAction('numberedList', '', e)}
          >
            <span className="material-symbols-outlined text-sm">format_list_numbered</span>
          </button>
        )}

        {config.showTaskList && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Task Checklist (- [ ] item)"
            onMouseDown={(e) => handleAction('taskList', '', e)}
          >
            <span className="material-symbols-outlined text-sm">check_box</span>
          </button>
        )}

        {config.showDivider && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Horizontal Rule (---)"
            onMouseDown={(e) => handleAction('divider', '', e)}
          >
            <span className="material-symbols-outlined text-sm">horizontal_rule</span>
          </button>
        )}

        {/* ================= 5. Visual Studios & Callouts ================= */}
        {(config.showTable || config.showCallout || config.showDiagram || config.showDetails || config.showBadge) && (
          <div className="floating-divider" />
        )}

        {config.showTable && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Markdown Table Grid"
            onMouseDown={(e) => handleAction('table', '', e)}
          >
            <span className="material-symbols-outlined text-sm">table_chart</span>
          </button>
        )}

        {config.showCallout && (
          <div className="floating-btn-group relative">
            <button
              type="button"
              className={`floating-toolbar-btn dropdown-trigger ${activeDropdown === 'callout' ? 'active' : ''}`}
              title="GitHub Alert Callouts"
              onMouseDown={(e) => toggleDropdown('callout', e)}
            >
              <span className="material-symbols-outlined text-sm" style={{ color: '#eab308' }}>campaign</span>
              <span className="dropdown-caret">▾</span>
            </button>

            {activeDropdown === 'callout' && (
              <div className="floating-dropdown-menu">
                <button
                  type="button"
                  className="floating-dropdown-item"
                  onMouseDown={(e) => handleAction('callout', 'NOTE', e)}
                >
                  <span className="callout-pill note">NOTE</span>
                  <span>Information callout</span>
                </button>
                <button
                  type="button"
                  className="floating-dropdown-item"
                  onMouseDown={(e) => handleAction('callout', 'TIP', e)}
                >
                  <span className="callout-pill tip">TIP</span>
                  <span>Helpful suggestion</span>
                </button>
                <button
                  type="button"
                  className="floating-dropdown-item"
                  onMouseDown={(e) => handleAction('callout', 'IMPORTANT', e)}
                >
                  <span className="callout-pill important">IMPORTANT</span>
                  <span>Crucial requirement</span>
                </button>
                <button
                  type="button"
                  className="floating-dropdown-item"
                  onMouseDown={(e) => handleAction('callout', 'WARNING', e)}
                >
                  <span className="callout-pill warning">WARNING</span>
                  <span>Attention / Caution</span>
                </button>
                <button
                  type="button"
                  className="floating-dropdown-item"
                  onMouseDown={(e) => handleAction('callout', 'CAUTION', e)}
                >
                  <span className="callout-pill caution">CAUTION</span>
                  <span>High risk action</span>
                </button>
              </div>
            )}
          </div>
        )}

        {config.showDiagram && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Mermaid Architecture Diagram"
            onMouseDown={(e) => handleAction('mermaid', '', e)}
          >
            <span className="material-symbols-outlined text-sm" style={{ color: '#38bdf8' }}>schema</span>
          </button>
        )}

        {config.showDetails && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Collapsible Accordion (<details>)"
            onMouseDown={(e) => handleAction('details', 'Expandable Details', e)}
          >
            <span className="material-symbols-outlined text-sm">unfold_more</span>
          </button>
        )}

        {config.showBadge && (
          <button
            type="button"
            className="floating-toolbar-btn icon-btn"
            title="Shields.io Badge"
            onMouseDown={(e) => handleAction('badge', '', e)}
          >
            <span className="material-symbols-outlined text-sm" style={{ color: '#a855f7' }}>shield</span>
          </button>
        )}
      </div>
    </div>
  )
}
