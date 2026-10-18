import React, { useState, useMemo } from 'react'
import StudioShell from './common/StudioShell'
import '../../styles/studios/extendedStudios.css'

const CHANGELOG_CATEGORIES = [
  { id: 'added', label: 'Added', icon: 'add_circle', color: '#10b981', desc: 'New capabilities or user features' },
  { id: 'changed', label: 'Changed', icon: 'sync', color: '#38bdf8', desc: 'Changes in existing functionality' },
  { id: 'fixed', label: 'Fixed', icon: 'bug_report', color: '#f59e0b', desc: 'Bug fixes and resolution of issues' },
  { id: 'deprecated', label: 'Deprecated', icon: 'warning', color: '#f97316', desc: 'Features to be removed in future releases' },
  { id: 'removed', label: 'Removed', icon: 'delete', color: '#ef4444', desc: 'Features removed in this version' },
  { id: 'security', label: 'Security', icon: 'security', color: '#a855f7', desc: 'Vulnerability patches and hardening' }
]

const CHANGELOG_PRESETS = [
  {
    id: 'feature-release',
    name: 'Feature Release (v1.2.0)',
    version: '1.2.0',
    entries: {
      added: [
        'Interactive Directory Tree Studio with custom depth levels and emoji formatting',
        'REST API & Endpoint Studio with live cURL, fetch, and python generators',
        'Documentation Auditor with A-F grading scorecard and 7 standard profiles'
      ],
      changed: [
        'Standardized 2-pane StudioShell across all studio tools for consistency',
        'Enhanced responsive resizer splitter with double-click auto-reset'
      ],
      fixed: [
        'Resolved tab close fallback resetting active view unexpectedly',
        'Fixed scroll jump when switching between documents in file tree'
      ],
      deprecated: [],
      removed: [],
      security: []
    }
  },
  {
    id: 'patch-release',
    name: 'Bug Fix Patch (v1.1.2)',
    version: '1.1.2',
    entries: {
      added: [],
      changed: [
        'Optimized build bundle chunks for 28% faster initial load time'
      ],
      fixed: [
        'Fixed Bento card SVG group translation text stacking overlap',
        'Resolved modal z-index layer collision during image exports',
        'Fixed light mode contrast on status badges and code blocks'
      ],
      deprecated: [],
      removed: [],
      security: [
        'Upgraded dependency parser to patch upstream advisory CVE-2026-821'
      ]
    }
  },
  {
    id: 'major-release',
    name: 'Major Milestone (v2.0.0)',
    version: '2.0.0',
    entries: {
      added: [
        'Next-generation VisualMark Studio ecosystem with 12 specialized studios',
        'Mermaid live visual diagram builder and direct SVG/PNG canvas export',
        'Team recognition Hall of Fame generator with GitHub Sponsors tier'
      ],
      changed: [
        'Migrated state architecture to unified reactive store',
        'Overhauled design system to high-contrast modern dark palette'
      ],
      fixed: [
        'Fixed memory retention on rapid multi-studio switching'
      ],
      deprecated: [
        'Legacy v1 plain markdown table generator is deprecated in favor of Table Studio Pro'
      ],
      removed: [
        'Removed deprecated static badge builder v0'
      ],
      security: [
        'Enforced strict input sanitization on all raw HTML rendering blocks'
      ]
    }
  }
]

const CHANGELOG_MODES = [
  { id: 'keep-a-changelog', label: 'Keep-a-Changelog', icon: 'format_list_bulleted' },
  { id: 'github-releases', label: 'GitHub Release', icon: 'campaign' },
  { id: 'compact', label: 'Compact Bullets', icon: 'short_text' },
  { id: 'details', label: 'Collapsible <details>', icon: 'unfold_more' }
]

export default function ChangelogStudioTab({
  gitInfo = null,
  onInsertChangelog = () => {},
  onBackToReadme = () => {}
}) {
  const [version, setVersion] = useState('1.2.0')
  const [releaseDate, setReleaseDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [isUnreleased, setIsUnreleased] = useState(false)
  const [repoUrl, setRepoUrl] = useState('https://github.com/your-org/your-repo')
  const [outputFormat, setOutputFormat] = useState('keep-a-changelog')

  // Items bucketed by category
  const [entries, setEntries] = useState(CHANGELOG_PRESETS[0].entries)
  const [activeCategory, setActiveCategory] = useState('added')
  const [newEntryText, setNewEntryText] = useState('')

  const handleAddEntry = (e) => {
    if (e && e.preventDefault) e.preventDefault()
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

  const handleClearCategory = (category) => {
    setEntries((prev) => ({
      ...prev,
      [category]: []
    }))
  }

  const handleClearAll = () => {
    setEntries({
      added: [],
      changed: [],
      fixed: [],
      deprecated: [],
      removed: [],
      security: []
    })
  }

  const handleLoadPreset = (preset) => {
    setVersion(preset.version)
    setEntries(preset.entries)
    setIsUnreleased(false)
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

  // Construct Markdown representation based on outputFormat
  const generatedMarkdown = useMemo(() => {
    const cleanRepo = repoUrl.replace(/\/$/, '')
    const versionHeader = isUnreleased ? '[Unreleased]' : `[${version}] - ${releaseDate}`

    if (outputFormat === 'keep-a-changelog') {
      let md = `## ${versionHeader}\n\n`
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
      if (!isUnreleased && cleanRepo) {
        md += `[${version}]: ${cleanRepo}/releases/tag/v${version}\n`
      }
      return md
    }

    if (outputFormat === 'github-releases') {
      let md = `# 🚀 Release v${version} (${releaseDate})\n\n`
      md += `## ✨ What's Changed\n\n`
      CHANGELOG_CATEGORIES.forEach((cat) => {
        const items = entries[cat.id] || []
        if (items.length > 0) {
          md += `### ${cat.desc} (${cat.label})\n\n`
          items.forEach((item) => {
            md += `- ${item}\n`
          })
          md += `\n`
        }
      })
      if (cleanRepo) {
        md += `---\n**Full Changelog**: ${cleanRepo}/commits/v${version}\n`
      }
      return md
    }

    if (outputFormat === 'compact') {
      let md = `### 📦 Release v${version} (${releaseDate})\n\n`
      CHANGELOG_CATEGORIES.forEach((cat) => {
        const items = entries[cat.id] || []
        items.forEach((item) => {
          md += `- **${cat.label}**: ${item}\n`
        })
      })
      md += `\n`
      return md
    }

    if (outputFormat === 'details') {
      let md = `<details>\n<summary><b>📦 Release Notes: v${version}</b> — <i>${releaseDate}</i></summary>\n\n`
      CHANGELOG_CATEGORIES.forEach((cat) => {
        const items = entries[cat.id] || []
        if (items.length > 0) {
          md += `#### ${cat.label}\n\n`
          items.forEach((item) => {
            md += `- ${item}\n`
          })
          md += `\n`
        }
      })
      md += `</details>\n`
      return md
    }

    return ''
  }, [version, releaseDate, isUnreleased, entries, repoUrl, outputFormat])

  const totalItemsCount = useMemo(() => {
    return Object.values(entries).reduce((acc, list) => acc + list.length, 0)
  }, [entries])

  const handleInsert = () => {
    onInsertChangelog(generatedMarkdown)
  }

  // Canvas Header Extras: Semver Bump Buttons, Total count, Unreleased toggle
  const canvasHeaderExtras = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {/* Version Tag */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          color: '#38bdf8',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          fontFamily: 'var(--font-mono, monospace)'
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>tag</span>
        <span>{isUnreleased ? 'Unreleased WIP' : `v${version}`}</span>
      </span>

      {/* Quick SemVer Bump Buttons */}
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

      {/* Items count badge */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          padding: '2px 7px',
          borderRadius: '4px',
          background: 'var(--surface-mid, rgba(255,255,255,0.06))',
          border: '1px solid var(--border-color)',
          color: 'var(--text-muted, #94a3b8)',
          fontFamily: 'var(--font-mono, monospace)'
        }}
      >
        <span>{totalItemsCount} Changes</span>
      </span>
    </div>
  )

  return (
    <StudioShell
      studioId="changelog.studio"
      title="Changelog & Release Notes Studio"
      subtitle="Assemble clean, standardized release logs compliant with SemVer and Keep-a-Changelog specifications."
      icon="history_edu"
      accentColor="#8b5cf6"
      badge={isUnreleased ? 'Unreleased' : `v${version}`}
      modes={CHANGELOG_MODES}
      activeMode={outputFormat}
      onModeChange={setOutputFormat}
      markdownCode={generatedMarkdown}
      codeLanguage="markdown"
      onInsert={handleInsert}
      insertLabel="Insert Changelog"
      onBackToReadme={onBackToReadme}
      canvasHeaderExtras={canvasHeaderExtras}
      defaultSplitWidth={500}
      minSplitWidth={380}
      maxSplitWidth={880}
      inspectorContent={
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section 1: Release Presets */}
          <div className="studio-section">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              1 • Release Presets & Milestones
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {CHANGELOG_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="badge-style-card"
                  onClick={() => handleLoadPreset(p)}
                  style={{ padding: '8px 10px', textAlign: 'left', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <span style={{ fontWeight: 600, fontSize: '11px', color: '#f1f5f9', display: 'block' }}>
                    {p.name}
                  </span>
                  <span style={{ fontSize: '9.5px', color: '#38bdf8', display: 'block', marginTop: '2px', fontFamily: 'monospace' }}>
                    v{p.version}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Release Version & Date Settings */}
          <div className="studio-section">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              2 • Version & Target Date
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="studio-field">
                <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Version Tag</span>
                <input
                  type="text"
                  className="studio-text-input"
                  value={version}
                  disabled={isUnreleased}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g. 1.2.0"
                  style={{ width: '100%', fontFamily: 'monospace', fontWeight: 600, fontSize: '11.5px' }}
                />
              </div>

              <div className="studio-field">
                <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Release Date</span>
                <input
                  type="date"
                  className="studio-text-input"
                  value={releaseDate}
                  disabled={isUnreleased}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  style={{ width: '100%', fontSize: '11.5px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '11.5px', color: '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={isUnreleased}
                  onChange={(e) => setIsUnreleased(e.target.checked)}
                />
                <span>Mark as <strong>[Unreleased]</strong> work in progress</span>
              </label>
            </div>

            <div className="studio-field" style={{ marginTop: '10px' }}>
              <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Repository URL (For Release Diff Links)</span>
              <input
                type="text"
                className="studio-text-input"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/your-org/your-repo"
                style={{ width: '100%', fontSize: '11px', fontFamily: 'monospace' }}
              />
            </div>
          </div>

          {/* Section 3: Add Changelog Item */}
          <div className="studio-section">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              3 • Add Changelog Item
            </label>
            <div className="studio-segmented-styles" style={{ flexWrap: 'wrap', gap: '4px' }}>
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
                          marginLeft: '4px',
                          fontSize: '9.5px',
                          background: 'rgba(255,255,255,0.12)',
                          padding: '0 4px',
                          borderRadius: '6px'
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <form onSubmit={handleAddEntry} style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <input
                type="text"
                className="studio-text-input"
                placeholder={`Describe ${activeCategory} item (e.g. Added dark mode toggle)...`}
                value={newEntryText}
                onChange={(e) => setNewEntryText(e.target.value)}
                style={{ flex: 1, fontSize: '11.5px' }}
              />
              <button
                type="submit"
                className="btn-studio-primary"
                style={{ height: '30px', padding: '0 10px', fontSize: '11.5px' }}
              >
                <span className="material-symbols-outlined icon-xs">add</span>
                <span>Add Item</span>
              </button>
            </form>
          </div>

          {/* Section 4: Categorized Changes Matrix */}
          <div className="studio-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', margin: 0 }}>
                4 • Logged Changes ({totalItemsCount})
              </label>
              {totalItemsCount > 0 && (
                <button
                  type="button"
                  className="btn-studio-secondary"
                  onClick={handleClearAll}
                  style={{ height: '22px', fontSize: '10px', padding: '0 6px', color: '#f87171' }}
                  title="Remove all changes"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="changelog-item-list custom-scrollbar" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {CHANGELOG_CATEGORIES.map((cat) => {
                const items = entries[cat.id] || []
                if (items.length === 0) return null

                return (
                  <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: cat.color }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                          {cat.icon}
                        </span>
                        <span>{cat.label} ({items.length})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleClearCategory(cat.id)}
                        style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '10px', cursor: 'pointer' }}
                        title={`Clear ${cat.label} items`}
                      >
                        clear
                      </button>
                    </div>

                    {items.map((item, idx) => (
                      <div key={idx} className="changelog-entry-row">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1, minWidth: 0 }}>
                          <span style={{ color: cat.color, fontWeight: 'bold' }}>•</span>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
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
                <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                  No changelog items added yet. Choose a category and type a change description above.
                </div>
              )}
            </div>
          </div>
        </div>
      }
      canvasContent={
        <div style={{ width: '100%', maxWidth: '820px', padding: '24px', boxSizing: 'border-box' }}>
          {/* Main Visual Changelog Card */}
          <div
            className="changelog-stage-card"
            style={{
              backgroundColor: 'var(--surface-base, #1e1e1e)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '24px'
            }}
          >
            {/* Release Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <div>
                <h3 className="changelog-card-title" style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 800 }}>
                  {isUnreleased ? 'Unreleased Work in Progress' : `Release v${version}`}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', fontFamily: 'var(--font-mono, monospace)' }}>
                  Published on {releaseDate}
                </span>
              </div>

              {/* Category Count Summary Chips */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {CHANGELOG_CATEGORIES.map((cat) => {
                  const count = (entries[cat.id] || []).length
                  if (count === 0) return null
                  return (
                    <span
                      key={cat.id}
                      className="changelog-summary-chip"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        backgroundColor: `${cat.color}18`,
                        color: cat.color,
                        border: `1px solid ${cat.color}40`,
                        fontFamily: 'monospace'
                      }}
                    >
                      <span>{cat.label}:</span>
                      <span>{count}</span>
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Categorized Entries */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {CHANGELOG_CATEGORIES.map((cat) => {
                const items = entries[cat.id] || []
                if (items.length === 0) return null

                return (
                  <div key={cat.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: cat.color }}>
                        {cat.icon}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: cat.color }}>
                        {cat.label}
                      </h4>
                    </div>

                    <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {items.map((item, idx) => (
                        <li key={idx} className="changelog-item-text" style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}

              {totalItemsCount === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                  No changelog items logged yet.
                </div>
              )}
            </div>

            {/* Diff Link Footer */}
            {repoUrl && !isUnreleased && (
              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '11px',
                  color: 'var(--text-muted, #94a3b8)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#38bdf8' }}>
                  commit
                </span>
                <span>Release Comparison:</span>
                <code style={{ color: '#38bdf8', fontSize: '10.5px' }}>
                  {repoUrl}/releases/tag/v{version}
                </code>
              </div>
            )}
          </div>
        </div>
      }
    />
  )
}
