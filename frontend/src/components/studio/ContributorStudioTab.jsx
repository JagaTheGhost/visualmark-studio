import React, { useState, useMemo } from 'react'
import { useStudioSplit } from '../../utils/useResizableSplit'

const CONTRIBUTION_TYPES = [
  { id: 'code', label: 'Code', icon: '💻' },
  { id: 'docs', label: 'Docs', icon: '📖' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'bugs', label: 'Bug Reports', icon: '🐛' },
  { id: 'ideas', label: 'Ideas & Spec', icon: '💡' },
  { id: 'infra', label: 'Infra / CI', icon: '🔧' },
  { id: 'tests', label: 'Tests', icon: '🧪' },
  { id: 'review', label: 'Review', icon: '👀' }
]

const DEFAULT_CONTRIBUTORS = [
  {
    username: 'octocat',
    name: 'The Octocat',
    roles: ['code', 'docs', 'infra']
  },
  {
    username: 'torvalds',
    name: 'Linus Torvalds',
    roles: ['code', 'review']
  },
  {
    username: 'gaearon',
    name: 'Dan Abramov',
    roles: ['docs', 'ideas', 'design']
  }
]

export default function ContributorStudioTab({
  onInsertContributors = () => {},
  onBackToReadme = () => {}
}) {
  const [contributors, setContributors] = useState(DEFAULT_CONTRIBUTORS)
  const [layoutStyle, setLayoutStyle] = useState('grid') // 'grid' | 'badges' | 'list'
  const [columnsCount, setColumnsCount] = useState(6)
  const [avatarSize, setAvatarSize] = useState(80)
  const [includeSponsors, setIncludeSponsors] = useState(false)
  const [copied, setCopied] = useState(false)
  const { formWidth, isDragging, handleMouseDown, handleDoubleClick } = useStudioSplit(500)

  // Form input for adding new contributor
  const [newUsername, setNewUsername] = useState('')
  const [newName, setNewName] = useState('')
  const [newRoles, setNewRoles] = useState(['code'])

  const handleToggleNewRole = (roleId) => {
    setNewRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
    )
  }

  const handleAddContributor = (e) => {
    e.preventDefault()
    if (!newUsername.trim()) return
    const uname = newUsername.trim().replace(/^@/, '')
    setContributors((prev) => [
      ...prev,
      {
        username: uname,
        name: newName.trim() || uname,
        roles: newRoles.length > 0 ? newRoles : ['code']
      }
    ])
    setNewUsername('')
    setNewName('')
    setNewRoles(['code'])
  }

  const handleRemoveContributor = (idx) => {
    setContributors((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleToggleRole = (idx, roleId) => {
    setContributors((prev) =>
      prev.map((c, i) => {
        if (i !== idx) return c
        const hasRole = c.roles.includes(roleId)
        const nextRoles = hasRole ? c.roles.filter((r) => r !== roleId) : [...c.roles, roleId]
        return { ...c, roles: nextRoles.length > 0 ? nextRoles : ['code'] }
      })
    )
  }

  // Construct Markdown representation
  const generatedMarkdown = useMemo(() => {
    let md = `## 👥 Contributors & Acknowledgements\n\n`
    md += `Thanks goes to these wonderful people for contributing to this project:\n\n`

    if (layoutStyle === 'grid') {
      md += `<table>\n`
      for (let i = 0; i < contributors.length; i += columnsCount) {
        const slice = contributors.slice(i, i + columnsCount)
        md += `  <tr>\n`
        slice.forEach((c) => {
          const roleIcons = c.roles
            .map((r) => {
              const item = CONTRIBUTION_TYPES.find((t) => t.id === r)
              return item ? `<span title="${item.label}">${item.icon}</span>` : ''
            })
            .join(' ')

          md += `    <td align="center" width="${Math.round(100 / columnsCount)}%">\n`
          md += `      <a href="https://github.com/${c.username}">\n`
          md += `        <img src="https://github.com/${c.username}.png?size=${avatarSize}" width="${avatarSize}px;" alt="${c.name}" style="border-radius: 50%;" /><br />\n`
          md += `        <sub><b>${c.name}</b></sub>\n`
          md += `      </a><br />\n`
          md += `      ${roleIcons}\n`
          md += `    </td>\n`
        })
        md += `  </tr>\n`
      }
      md += `</table>\n\n`
    } else if (layoutStyle === 'badges') {
      contributors.forEach((c) => {
        const rolesText = c.roles.join(', ')
        md += `[![${c.name}](https://img.shields.io/badge/@${c.username}-${rolesText}-6366f1?style=for-the-badge&logo=github)](https://github.com/${c.username}) `
      })
      md += `\n\n`
    } else {
      // List style
      contributors.forEach((c) => {
        const roleIcons = c.roles
          .map((r) => {
            const item = CONTRIBUTION_TYPES.find((t) => t.id === r)
            return item ? `${item.icon} ${item.label}` : ''
          })
          .join(', ')
        md += `- [**${c.name}** (@${c.username})](https://github.com/${c.username}) — ${roleIcons}\n`
      })
      md += `\n`
    }

    if (includeSponsors) {
      md += `### 💖 Sponsors & Backers\n\n`
      md += `Support this project by becoming a sponsor. Your logo will show up here with a link to your website!\n\n`
      md += `[![Sponsor via GitHub](https://img.shields.io/badge/Sponsor-GitHub_Sponsors-ea4aaa?style=for-the-badge&logo=github-sponsors)](https://github.com/sponsors)\n`
    }

    return md
  }, [contributors, layoutStyle, columnsCount, avatarSize, includeSponsors])

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMarkdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInsert = () => {
    onInsertContributors(generatedMarkdown)
  }

  return (
    <div className="studio-tab-view select-none">
      {/* Studio Top Navigation Strip */}
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
              groups
            </span>
          </div>
          <div>
            <div className="studio-title-row">
              <h2 className="studio-title">Contributor & Team Hall of Fame</h2>
              <span className="studio-tag" style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#38bdf8' }}>
                All-Contributors Specification
              </span>
            </div>
            <p className="studio-subtitle">
              Assemble beautiful contributor avatar matrices, team recognition grids, and sponsor acknowledgements.
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
            title="Copy contributors markdown block to clipboard"
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
            title="Insert contributors block into active document at cursor line"
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
          {/* Layout Style Selector */}
          <div className="studio-section">
            <label className="studio-section-label">Grid Layout Style</label>
            <div className="studio-segmented-styles">
              <button
                type="button"
                className={`studio-style-btn ${layoutStyle === 'grid' ? 'active' : ''}`}
                onClick={() => setLayoutStyle('grid')}
              >
                👥 Avatar Grid (Table)
              </button>
              <button
                type="button"
                className={`studio-style-btn ${layoutStyle === 'badges' ? 'active' : ''}`}
                onClick={() => setLayoutStyle('badges')}
              >
                🛡️ Shield Badges
              </button>
              <button
                type="button"
                className={`studio-style-btn ${layoutStyle === 'list' ? 'active' : ''}`}
                onClick={() => setLayoutStyle('list')}
              >
                📝 Markdown List
              </button>
            </div>

            {layoutStyle === 'grid' && (
              <div className="studio-input-duo" style={{ marginTop: '10px' }}>
                <div className="studio-field">
                  <span className="studio-field-label">Columns per Row ({columnsCount})</span>
                  <input
                    type="range"
                    min="3"
                    max="8"
                    className="studio-slider"
                    value={columnsCount}
                    onChange={(e) => setColumnsCount(parseInt(e.target.value, 10))}
                    style={{ marginTop: '8px' }}
                  />
                </div>
                <div className="studio-field">
                  <span className="studio-field-label">Avatar Size ({avatarSize}px)</span>
                  <input
                    type="range"
                    min="50"
                    max="120"
                    step="5"
                    className="studio-slider"
                    value={avatarSize}
                    onChange={(e) => setAvatarSize(parseInt(e.target.value, 10))}
                    style={{ marginTop: '8px' }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginTop: '10px' }}>
              <label className="badge-toggle-switch">
                <input
                  type="checkbox"
                  checked={includeSponsors}
                  onChange={(e) => setIncludeSponsors(e.target.checked)}
                />
                <span>Include GitHub Sponsors & Backers recognition tier</span>
              </label>
            </div>
          </div>

          {/* Add Contributor Form */}
          <div className="studio-section">
            <label className="studio-section-label">Add Contributor</label>
            <form onSubmit={handleAddContributor} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="studio-input-duo">
                <div className="studio-field">
                  <span className="studio-field-label">GitHub Username</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    placeholder="e.g. torvalds"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </div>
                <div className="studio-field">
                  <span className="studio-field-label">Display Name (Optional)</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    placeholder="e.g. Linus Torvalds"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <span className="studio-field-label" style={{ display: 'block', marginBottom: '4px' }}>
                  Select Contribution Types
                </span>
                <div className="contributor-role-chips">
                  {CONTRIBUTION_TYPES.map((t) => {
                    const isSelected = newRoles.includes(t.id)
                    return (
                      <button
                        key={t.id}
                        type="button"
                        className={`contributor-role-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleToggleNewRole(t.id)}
                      >
                        <span style={{ marginRight: '3px' }}>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="btn-studio-primary"
                style={{ height: '30px', alignSelf: 'flex-start', marginTop: '4px' }}
              >
                <span className="material-symbols-outlined icon-xs">add</span>
                <span>Add Contributor</span>
              </button>
            </form>
          </div>

          {/* Manage Contributors List */}
          <div className="studio-section">
            <div className="studio-section-header">
              <label className="studio-section-label">Team Members ({contributors.length})</label>
            </div>

            <div className="contributor-list-table custom-scrollbar" style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {contributors.map((c, idx) => (
                <div key={idx} className="contributor-item-row">
                  <img
                    src={`https://github.com/${c.username}.png?size=48`}
                    alt={c.name}
                    className="contributor-avatar-circle"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://github.com/github.png'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                        {c.name}
                      </span>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        @{c.username}
                      </span>
                    </div>

                    <div className="contributor-role-chips">
                      {CONTRIBUTION_TYPES.map((t) => {
                        const isSelected = c.roles.includes(t.id)
                        return (
                          <button
                            key={t.id}
                            type="button"
                            className={`contributor-role-chip ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleToggleRole(idx, t.id)}
                            title={`Toggle ${t.label} role`}
                          >
                            <span style={{ marginRight: '2px' }}>{t.icon}</span>
                            <span>{t.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="modal-close-icon-btn"
                    onClick={() => handleRemoveContributor(idx)}
                    title="Remove contributor"
                  >
                    <span className="material-symbols-outlined icon-xs">close</span>
                  </button>
                </div>
              ))}

              {contributors.length === 0 && (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  No contributors added yet. Add usernames above to generate your Hall of Fame.
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

        {/* Right Column: Visual Preview Canvas & Generated Code */}
        <div className="studio-preview-column custom-scrollbar" style={{ flex: 1, minWidth: 0 }}>
          {/* Visual Live Preview Card */}
          <div className="studio-card">
            <div className="studio-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="mac-dot dot-red" />
                <span className="mac-dot dot-yellow" />
                <span className="mac-dot dot-green" />
                <span className="studio-card-title">Live Visual Preview</span>
              </div>
              <span className="studio-card-tag" style={{ color: '#f43f5e' }}>
                {contributors.length} Members
              </span>
            </div>

            <div className="studio-render-canvas dark-bg custom-scrollbar" style={{ padding: '20px', minHeight: '160px' }}>
              {layoutStyle === 'grid' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`,
                    gap: '16px',
                    width: '100%',
                    justifyItems: 'center'
                  }}
                >
                  {contributors.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: '4px'
                      }}
                    >
                      <img
                        src={`https://github.com/${c.username}.png?size=${avatarSize}`}
                        alt={c.name}
                        style={{
                          width: `${Math.min(avatarSize, 70)}px`,
                          height: `${Math.min(avatarSize, 70)}px`,
                          borderRadius: '50%',
                          border: '2px solid rgba(99, 102, 241, 0.4)',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = 'https://github.com/github.png'
                        }}
                      />
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '90px' }} className="truncate">
                        {c.name}
                      </span>
                      <div style={{ display: 'flex', gap: '2px', fontSize: '11px' }}>
                        {c.roles.map((r) => {
                          const item = CONTRIBUTION_TYPES.find((t) => t.id === r)
                          return item ? <span key={r} title={item.label}>{item.icon}</span> : null
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {layoutStyle === 'badges' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {contributors.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        background: '#6366f1',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>person</span>
                      <span>@{c.username}</span>
                      <span style={{ opacity: 0.8, fontSize: '10px' }}>({c.roles.join(', ')})</span>
                    </div>
                  ))}
                </div>
              )}

              {layoutStyle === 'list' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                  {contributors.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <span style={{ color: '#f43f5e' }}>•</span>
                      <strong>{c.name}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>@{c.username}</span>
                      <span>—</span>
                      <span>{c.roles.map((r) => CONTRIBUTION_TYPES.find((t) => t.id === r)?.icon).filter(Boolean).join(' ')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Generated Code Block */}
          <div className="studio-card">
            <div className="studio-card-header">
              <span className="studio-card-title">Generated Markdown Code Block</span>
              <button
                type="button"
                className="snippet-copy-btn"
                onClick={handleCopy}
              >
                <span className="material-symbols-outlined icon-xs">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="studio-code-block custom-scrollbar" style={{ maxHeight: '360px', lineHeight: 1.5 }}>
              <code>{generatedMarkdown}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
