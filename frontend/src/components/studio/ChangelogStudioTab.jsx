import React, { useState, useMemo } from 'react'
import { useStudioSplit } from '../../utils/useResizableSplit'

const CHANGELOG_CATEGORIES = [
  { id: 'added', label: 'Added', icon: 'add_circle', color: '#10b981', desc: 'New capabilities or user features' },
  { id: 'changed', label: 'Changed', icon: 'sync', color: '#38bdf8', desc: 'Changes in existing functionality' },
  { id: 'fixed', label: 'Fixed', icon: 'bug_report', color: '#f59e0b', desc: 'Bug fixes and resolution of issues' },
  { id: 'deprecated', label: 'Deprecated', icon: 'warning', color: '#f97316', desc: 'Features to be removed in future releases' },
  { id: 'removed', label: 'Removed', icon: 'delete', color: '#ef4444', desc: 'Features removed in this version' },
  { id: 'security', label: 'Security', icon: 'security', color: '#a855f7', desc: 'Vulnerability patches and hardening' }
]

export default function ChangelogStudioTab({
  gitInfo = null,
  onInsertChangelog = () => {},
  onBackToReadme = () => {}
}) {
  const [version, setVersion] = useState('1.1.1')
  const [releaseDate, setReleaseDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [isUnreleased, setIsUnreleased] = useState(false)
  const [copied, setCopied] = useState(false)
  const { formWidth, isDragging, handleMouseDown, handleDoubleClick } = useStudioSplit(490)

  // Items bucketed by category
  const [entries, setEntries] = useState({
    added: [
      'Interactive Directory Tree Studio with custom depth and presets',
      'API & Endpoint Studio with live cURL, fetch, and requests code generation',
      'README Quality & Health Linter with A-F grading scorecard'
    ],
    changed: [
      'Redesigned studio tool insertion to insert at exact cursor line',
      'Standardized tab strip controls and persistent tab restore'
    ],
    fixed: [
      'Fixed tab closure fallback unintentionally resetting active file to README.md',
      'Resolved scroll offset jumps when navigating multi-file workspaces'
    ],
    deprecated: [],
    removed: [],
    security: []
  })

  const [activeCategory, setActiveCategory] = useState('added')
  const [newEntryText, setNewEntryText] = useState('')

  const handleAddEntry = (e) => {
    e.preventDefault()
    if (!newEntryText.trim()) return
    setEntries((prev) => ({
      ...prev,
      [activeCategory]: [...(prev[activeCategory] || []), newEntryText.trim()]
    }))
    setNewEntryText('')
  }

  const handleRemoveEntry = (category, index) => {
    setEntries((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }))
  }

  // Generate standard Keep a Changelog Markdown
  const generatedMarkdown = useMemo(() => {
    const headerTitle = isUnreleased
      ? `## [Unreleased]`
      : `## [${version}] - ${releaseDate}`

    let md = `${headerTitle}\n\n`

    CHANGELOG_CATEGORIES.forEach((cat) => {
      const items = entries[cat.id] || []
      if (items.length > 0) {
        md += `### ${cat.label}\n\n`
        items.forEach((item) => {
          md += `- ${item}\n`
        })
        md += `\n`
      }
    })

    return md
  }, [version, releaseDate, isUnreleased, entries])

  const totalItemsCount = useMemo(() => {
    return Object.values(entries).reduce((acc, list) => acc + list.length, 0)
  }, [entries])

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMarkdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInsert = () => {
    onInsertChangelog(generatedMarkdown)
  }

  const handleSemverBump = (type) => {
    const parts = version.split('.').map((p) => parseInt(p, 10) || 0)
    let [maj, min, pat] = [parts[0] || 1, parts[1] || 0, parts[2] || 0]
    if (type === 'major') {
      maj++
      min = 0
      pat = 0
    } else if (type === 'minor') {
      min++
      pat = 0
    } else {
      pat++
    }
    setVersion(`${maj}.${min}.${pat}`)
    setIsUnreleased(false)
  }

  return (
    <div className="studio-tab-view select-none">
      {/* Studio Top Navigation Bar */}
      <div className="studio-top-bar">
        <div className="studio-bar-left">
          <div
            className="studio-badge-halo"
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              borderColor: 'rgba(99, 102, 241, 0.35)',
              boxShadow: '0 0 10px rgba(99, 102, 241, 0.2)'
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#818cf8' }}>
              history_edu
            </span>
          </div>
          <div>
            <div className="studio-title-row">
              <h2 className="studio-title">Changelog & Release Notes Studio</h2>
              <span className="studio-tag" style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#38bdf8' }}>
                Keep a Changelog & SemVer
              </span>
            </div>
            <p className="studio-subtitle">
              Assemble clean, standardized release logs compliant with SemVer and Keep-a-Changelog specifications.
            </p>
          </div>
        </div>

        <div className="studio-bar-actions">
          {onBackToReadme && (
            <button
              type="button"
              className="btn-studio-secondary"
              onClick={onBackToReadme}
              title="Return to active markdown editor"
            >
              <span className="material-symbols-outlined icon-xs">arrow_back</span>
              <span>Back to Editor</span>
            </button>
          )}

          <button
            type="button"
            className="btn-studio-secondary"
            onClick={handleCopy}
            title="Copy changelog markdown to clipboard"
          >
            <span className="material-symbols-outlined icon-xs">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
          </button>

          <button
            type="button"
            className="btn-studio-primary"
            onClick={handleInsert}
            title="Insert changelog block into active document at cursor line"
          >
            <span className="material-symbols-outlined icon-xs">add_circle</span>
            <span>Insert into Document</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body: 2-Column Responsive Layout */}
      <div className="studio-content-grid">
        {/* Left Column: Form Controls */}
        <div
          className="studio-form-column custom-scrollbar"
          style={{ width: `${formWidth}px`, minWidth: `${formWidth}px`, maxWidth: `${formWidth}px`, flex: 'none' }}
        >
          {/* Release Version & Date */}
          <div className="studio-section">
            <div className="studio-section-header">
              <label className="studio-section-label">Release Version & Date</label>
              <div className="semver-bump-row">
                <button
                  type="button"
                  className="semver-bump-btn"
                  onClick={() => handleSemverBump('patch')}
                  title="Increment patch version (+0.0.1)"
                >
                  +Patch
                </button>
                <button
                  type="button"
                  className="semver-bump-btn"
                  onClick={() => handleSemverBump('minor')}
                  title="Increment minor version (+0.1.0)"
                >
                  +Minor
                </button>
                <button
                  type="button"
                  className="semver-bump-btn"
                  onClick={() => handleSemverBump('major')}
                  title="Increment major version (+1.0.0)"
                >
                  +Major
                </button>
              </div>
            </div>

            <div className="studio-input-duo" style={{ marginTop: '6px' }}>
              <div className="studio-field">
                <span className="studio-field-label">Version Number</span>
                <input
                  type="text"
                  className="studio-text-input"
                  value={version}
                  disabled={isUnreleased}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g. 1.2.0"
                  style={{ fontFamily: 'monospace', fontWeight: 600 }}
                />
              </div>

              <div className="studio-field">
                <span className="studio-field-label">Release Date</span>
                <input
                  type="date"
                  className="studio-text-input"
                  value={releaseDate}
                  disabled={isUnreleased}
                  onChange={(e) => setReleaseDate(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <label className="badge-toggle-switch">
                <input
                  type="checkbox"
                  checked={isUnreleased}
                  onChange={(e) => setIsUnreleased(e.target.checked)}
                />
                <span>Mark as <strong>[Unreleased]</strong> work in progress</span>
              </label>
            </div>
          </div>

          {/* Add Changelog Item */}
          <div className="studio-section">
            <label className="studio-section-label">Add Changelog Item</label>
            <div className="studio-segmented-styles">
              {CHANGELOG_CATEGORIES.map((cat) => {
                const count = (entries[cat.id] || []).length
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`studio-style-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                    style={isActive ? { borderColor: cat.color, color: cat.color } : {}}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '12px', verticalAlign: 'middle', marginRight: '3px' }}
                    >
                      {cat.icon}
                    </span>
                    <span>{cat.label}</span>
                    {count > 0 && (
                      <span
                        style={{
                          marginLeft: '5px',
                          fontSize: '10px',
                          background: 'rgba(255,255,255,0.12)',
                          padding: '1px 5px',
                          borderRadius: '8px'
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <form onSubmit={handleAddEntry} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', marginTop: '10px' }}>
              <input
                type="text"
                className="studio-text-input"
                placeholder={`Describe ${activeCategory} item (e.g. Added dark mode toggle)...`}
                value={newEntryText}
                onChange={(e) => setNewEntryText(e.target.value)}
              />
              <button
                type="submit"
                className="btn-studio-primary"
                style={{ height: '28px', padding: '0 10px' }}
              >
                <span className="material-symbols-outlined icon-xs">add</span>
                <span>Add Item</span>
              </button>
            </form>
          </div>

          {/* Manage All Entries */}
          <div className="studio-section">
            <div className="studio-section-header">
              <label className="studio-section-label">Categorized Items ({totalItemsCount})</label>
            </div>

            <div className="changelog-item-list custom-scrollbar" style={{ maxHeight: '340px', overflowY: 'auto' }}>
              {CHANGELOG_CATEGORIES.map((cat) => {
                const items = entries[cat.id] || []
                if (items.length === 0) return null

                return (
                  <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: cat.color }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                        {cat.icon}
                      </span>
                      <span>{cat.label} ({items.length})</span>
                    </div>

                    {items.map((item, idx) => (
                      <div key={idx} className="changelog-entry-row">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1, minWidth: 0 }}>
                          <span style={{ color: cat.color, fontWeight: 'bold' }}>•</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                            {item}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="modal-close-icon-btn"
                          onClick={() => handleRemoveEntry(cat.id, idx)}
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined icon-xs">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )
              })}

              {totalItemsCount === 0 && (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  No changelog items added yet. Choose a category and type a change description above.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resizer Splitter Handle */}
        <div
          className={`studio-resizer-handle ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title="Drag to resize form and preview sections • Double-click to reset"
        />

        {/* Right Column: Live Markdown Output Canvas */}
        <div className="studio-preview-column custom-scrollbar" style={{ flex: 1, minWidth: 0 }}>
          {/* Card Preview */}
          <div className="studio-card">
            <div className="studio-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="mac-dot dot-red" />
                <span className="mac-dot dot-yellow" />
                <span className="mac-dot dot-green" />
                <span className="studio-card-title">Keep-a-Changelog Markdown Preview</span>
              </div>
              <span className="studio-card-tag" style={{ color: '#38bdf8' }}>
                {isUnreleased ? 'Unreleased' : `v${version}`}
              </span>
            </div>

            <pre className="studio-code-block custom-scrollbar" style={{ maxHeight: '520px', lineHeight: 1.6 }}>
              <code>{generatedMarkdown}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
