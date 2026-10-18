import React, { useState, useMemo } from 'react'
import StudioShell from './common/StudioShell'
import '../../styles/studios/extendedStudios.css'

const CONTRIBUTION_TYPES = [
  { id: 'code', label: 'Code', icon: '💻' },
  { id: 'docs', label: 'Docs', icon: '📖' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'bugs', label: 'Bug Reports', icon: '🐛' },
  { id: 'ideas', label: 'Ideas & Spec', icon: '💡' },
  { id: 'infra', label: 'Infra / CI', icon: '🔧' },
  { id: 'tests', label: 'Tests', icon: '🧪' },
  { id: 'review', label: 'Review', icon: '👀' },
  { id: 'security', label: 'Security', icon: '🛡️' },
  { id: 'translation', label: 'Translation', icon: '🌐' },
  { id: 'financial', label: 'Financial', icon: '💖' },
  { id: 'mentoring', label: 'Mentoring', icon: '🧑‍🏫' }
]

const TEAM_PRESETS = [
  {
    id: 'fullstack',
    name: 'OSS Legends Team',
    desc: 'Sample team of prominent open-source maintainers',
    contributors: [
      { username: 'octocat', name: 'The Octocat', roles: ['code', 'docs', 'infra'] },
      { username: 'torvalds', name: 'Linus Torvalds', roles: ['code', 'review', 'infra'] },
      { username: 'gaearon', name: 'Dan Abramov', roles: ['code', 'docs', 'ideas', 'design'] },
      { username: 'yyx990803', name: 'Evan You', roles: ['code', 'design', 'review'] },
      { username: 'sophiebits', name: 'Sophie Alpert', roles: ['code', 'tests', 'review'] }
    ]
  },
  {
    id: 'core-trio',
    name: 'Core Maintainers',
    desc: '3-person focused team (Architect, DevOps, Docs)',
    contributors: [
      { username: 'alexdev', name: 'Alex Architect', roles: ['code', 'ideas', 'review'] },
      { username: 'sarahops', name: 'Sarah Cloud', roles: ['infra', 'tests', 'security'] },
      { username: 'chriswrite', name: 'Chris Technical Writer', roles: ['docs', 'translation', 'design'] }
    ]
  },
  {
    id: 'solo-sponsor',
    name: 'Solo Founder + Sponsors',
    desc: 'Individual developer backed by community sponsors',
    contributors: [
      { username: 'developer', name: 'Solo Creator', roles: ['code', 'docs', 'infra', 'design', 'review'] }
    ]
  }
]

const CONTRIBUTOR_MODES = [
  { id: 'grid', label: 'Avatar Grid (Table)', icon: 'grid_view' },
  { id: 'badges', label: 'Shield Badges', icon: 'shield' },
  { id: 'list', label: 'Markdown List', icon: 'format_list_bulleted' },
  { id: 'cards', label: 'Team Member Cards', icon: 'contact_page' }
]

export default function ContributorStudioTab({
  onInsertContributors = () => {},
  onBackToReadme = () => {}
}) {
  const [contributors, setContributors] = useState(TEAM_PRESETS[0].contributors)
  const [layoutStyle, setLayoutStyle] = useState('grid') // 'grid' | 'badges' | 'list' | 'cards'
  const [columnsCount, setColumnsCount] = useState(5)
  const [avatarSize, setAvatarSize] = useState(80)
  const [includeSponsors, setIncludeSponsors] = useState(true)
  const [sponsorUrl, setSponsorUrl] = useState('https://github.com/sponsors')

  // Form input for adding new contributor
  const [newUsername, setNewUsername] = useState('')
  const [newName, setNewName] = useState('')
  const [newRoles, setNewRoles] = useState(['code'])

  const handleToggleNewRole = (roleId) => {
    setNewRoles((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]
    )
  }

  const handleAddContributor = (e) => {
    if (e && e.preventDefault) e.preventDefault()
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

  const handleLoadPreset = (preset) => {
    setContributors(preset.contributors)
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
        md += `[![${c.name}](https://img.shields.io/badge/@${c.username}-${encodeURIComponent(
          rolesText
        )}-6366f1?style=for-the-badge&logo=github)](https://github.com/${c.username}) `
      })
      md += `\n\n`
    } else if (layoutStyle === 'cards') {
      md += `<table>\n  <tr>\n`
      contributors.forEach((c) => {
        const roleBadges = c.roles
          .map((r) => {
            const item = CONTRIBUTION_TYPES.find((t) => t.id === r)
            return item ? `\`${item.icon} ${item.label}\`` : ''
          })
          .join(' ')

        md += `    <td align="center" width="${Math.round(100 / Math.min(contributors.length, columnsCount))}%">\n`
        md += `      <a href="https://github.com/${c.username}">\n`
        md += `        <img src="https://github.com/${c.username}.png?size=96" width="64px;" alt="${c.name}" style="border-radius: 50%;" /><br />\n`
        md += `        <b>${c.name}</b><br />\n`
        md += `        <sub>@${c.username}</sub>\n`
        md += `      </a><br /><br />\n`
        md += `      ${roleBadges}\n`
        md += `    </td>\n`
      })
      md += `  </tr>\n</table>\n\n`
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
      md += `Support this project by becoming a sponsor. Your avatar or organization logo will appear here with a link to your profile!\n\n`
      md += `[![Sponsor via GitHub](https://img.shields.io/badge/Sponsor-GitHub_Sponsors-ea4aaa?style=for-the-badge&logo=github-sponsors)](${sponsorUrl})\n`
    }

    return md
  }, [contributors, layoutStyle, columnsCount, avatarSize, includeSponsors, sponsorUrl])

  const handleInsert = () => {
    onInsertContributors(generatedMarkdown)
  }

  // Canvas Header Extras: Members count badge, Columns slider, Sponsor toggle
  const canvasHeaderExtras = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {/* Member count tag */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: 'rgba(244, 63, 94, 0.15)',
          color: '#fb7185',
          border: '1px solid rgba(244, 63, 94, 0.35)',
          fontFamily: 'var(--font-mono, monospace)'
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>group</span>
        <span>{contributors.length} Contributors</span>
      </span>

      {/* Grid columns toggle (for grid / cards mode) */}
      {(layoutStyle === 'grid' || layoutStyle === 'cards') && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' }}>
          <span>Columns:</span>
          {[3, 4, 5, 6].map((col) => (
            <button
              key={col}
              type="button"
              className={`studio-style-btn ${columnsCount === col ? 'active' : ''}`}
              onClick={() => setColumnsCount(col)}
              style={{ padding: '2px 6px', fontSize: '10.5px' }}
            >
              {col}
            </button>
          ))}
        </div>
      )}

      {/* Sponsor toggle */}
      <button
        type="button"
        className={`studio-style-btn ${includeSponsors ? 'active' : ''}`}
        onClick={() => setIncludeSponsors(!includeSponsors)}
        title="Toggle GitHub Sponsors recognition tier"
        style={{ fontSize: '11px', padding: '2px 8px' }}
      >
        <span>💖 Sponsors Tier</span>
      </button>
    </div>
  )

  return (
    <StudioShell
      studioId="contributors.studio"
      title="Contributor & Team Hall of Fame"
      subtitle="Assemble beautiful contributor avatar matrices, team recognition grids, and sponsor acknowledgements."
      icon="groups"
      accentColor="#ec4899"
      badge="All-Contributors Standard"
      modes={CONTRIBUTOR_MODES}
      activeMode={layoutStyle}
      onModeChange={setLayoutStyle}
      markdownCode={generatedMarkdown}
      codeLanguage="markdown"
      onInsert={handleInsert}
      insertLabel="Insert Hall of Fame"
      onBackToReadme={onBackToReadme}
      canvasHeaderExtras={canvasHeaderExtras}
      defaultSplitWidth={500}
      minSplitWidth={380}
      maxSplitWidth={880}
      inspectorContent={
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section 1: Team Preset Blueprints */}
          <div className="studio-section">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              1 • Team Presets & Starters
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {TEAM_PRESETS.map((p) => (
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
                  <span style={{ fontSize: '9.5px', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                    {p.contributors.length} members
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Add New Contributor */}
          <div className="studio-section">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              2 • Add Contributor to Team
            </label>
            <form onSubmit={handleAddContributor} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>GitHub Username</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    placeholder="e.g. torvalds"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    style={{ width: '100%', fontSize: '11.5px', fontFamily: 'monospace' }}
                  />
                </div>
                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Display Name</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    placeholder="e.g. Linus Torvalds"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ width: '100%', fontSize: '11.5px' }}
                  />
                </div>
              </div>

              <div>
                <span className="studio-field-label" style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#94a3b8' }}>
                  Contribution Types ({newRoles.length})
                </span>
                <div className="contributor-role-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {CONTRIBUTION_TYPES.map((t) => {
                    const isSelected = newRoles.includes(t.id)
                    return (
                      <button
                        key={t.id}
                        type="button"
                        className={`contributor-role-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleToggleNewRole(t.id)}
                        style={{ padding: '2px 6px', fontSize: '10.5px' }}
                      >
                        <span style={{ marginRight: '2px' }}>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="btn-studio-primary"
                style={{ height: '28px', alignSelf: 'flex-start', marginTop: '4px', fontSize: '11.5px' }}
              >
                <span className="material-symbols-outlined icon-xs">add</span>
                <span>Add to Team</span>
              </button>
            </form>
          </div>

          {/* Section 3: Layout Geometry & Sponsors */}
          <div className="studio-section">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              3 • Avatar Size & Sponsors Options
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="studio-field">
                <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Avatar Diameter: {avatarSize}px</span>
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="5"
                  className="studio-slider"
                  value={avatarSize}
                  onChange={(e) => setAvatarSize(parseInt(e.target.value, 10))}
                  style={{ width: '100%', marginTop: '6px' }}
                />
              </div>

              <div className="studio-field">
                <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Columns per Row: {columnsCount}</span>
                <input
                  type="range"
                  min="3"
                  max="8"
                  className="studio-slider"
                  value={columnsCount}
                  onChange={(e) => setColumnsCount(parseInt(e.target.value, 10))}
                  style={{ width: '100%', marginTop: '6px' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '11.5px', color: '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={includeSponsors}
                  onChange={(e) => setIncludeSponsors(e.target.checked)}
                />
                <span>Include GitHub Sponsors & Backers recognition tier</span>
              </label>

              {includeSponsors && (
                <input
                  type="text"
                  className="studio-text-input"
                  value={sponsorUrl}
                  onChange={(e) => setSponsorUrl(e.target.value)}
                  placeholder="https://github.com/sponsors/your-org"
                  style={{ width: '100%', fontSize: '11px', fontFamily: 'monospace' }}
                />
              )}
            </div>
          </div>

          {/* Section 4: Team Members List */}
          <div className="studio-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', margin: 0 }}>
                4 • Team Members ({contributors.length})
              </label>
              {contributors.length > 0 && (
                <button
                  type="button"
                  className="btn-studio-secondary"
                  onClick={() => setContributors([])}
                  style={{ height: '22px', fontSize: '10px', padding: '0 6px', color: '#f87171' }}
                  title="Remove all members"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="contributor-list-table custom-scrollbar" style={{ maxHeight: '280px', overflowY: 'auto' }}>
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
                      <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>
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
                <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                  No contributors added yet. Use form above to add members.
                </div>
              )}
            </div>
          </div>
        </div>
      }
      canvasContent={
        <div style={{ width: '100%', maxWidth: '820px', padding: '24px', boxSizing: 'border-box' }}>
          <div
            className="contributor-stage-card"
            style={{
              backgroundColor: 'var(--surface-base, #1e1e1e)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '24px'
            }}
          >
            {/* Stage Title */}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, color: 'inherit' }}>
                👥 Contributors & Team Hall of Fame
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted, #94a3b8)' }}>
                Thanks goes to these wonderful people for contributing to this project:
              </p>
            </div>

            {/* Layout 1: Grid Mode */}
            {layoutStyle === 'grid' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`,
                  gap: '20px',
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
                      gap: '6px'
                    }}
                  >
                    <img
                      src={`https://github.com/${c.username}.png?size=${avatarSize}`}
                      alt={c.name}
                      style={{
                        width: `${Math.min(avatarSize, 80)}px`,
                        height: `${Math.min(avatarSize, 80)}px`,
                        borderRadius: '50%',
                        border: '2px solid rgba(99, 102, 241, 0.4)',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'https://github.com/github.png'
                      }}
                    />
                    <span className="contributor-name-text" style={{ fontSize: '12px', fontWeight: 600, maxWidth: '100px' }}>
                      {c.name}
                    </span>
                    <div style={{ display: 'flex', gap: '3px', fontSize: '12px' }}>
                      {c.roles.map((r) => {
                        const item = CONTRIBUTION_TYPES.find((t) => t.id === r)
                        return item ? (
                          <span key={r} title={item.label}>
                            {item.icon}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Layout 2: Badges Mode */}
            {layoutStyle === 'badges' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {contributors.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      background: '#6366f1',
                      color: '#ffffff',
                      fontSize: '11.5px',
                      fontWeight: 700
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>person</span>
                    <span>@{c.username}</span>
                    <span style={{ opacity: 0.85, fontSize: '10px', fontFamily: 'monospace' }}>
                      ({c.roles.join(', ')})
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Layout 3: Cards Mode */}
            {layoutStyle === 'cards' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(columnsCount, 4)}, minmax(0, 1fr))`,
                  gap: '12px'
                }}
              >
                {contributors.map((c, i) => (
                  <div
                    key={i}
                    className="contributor-card-item"
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <img
                      src={`https://github.com/${c.username}.png?size=72`}
                      alt={c.name}
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        border: '2px solid rgba(99, 102, 241, 0.4)',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'https://github.com/github.png'
                      }}
                    />
                    <span className="contributor-name-text" style={{ fontSize: '12.5px', fontWeight: 700 }}>
                      {c.name}
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#94a3b8', fontFamily: 'monospace' }}>
                      @{c.username}
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center', marginTop: '4px' }}>
                      {c.roles.map((r) => {
                        const item = CONTRIBUTION_TYPES.find((t) => t.id === r)
                        return item ? (
                          <span
                            key={r}
                            style={{
                              fontSize: '9.5px',
                              padding: '1px 5px',
                              borderRadius: '3px',
                              background: 'rgba(99, 102, 241, 0.15)',
                              color: '#a5b4fc',
                              fontFamily: 'monospace'
                            }}
                          >
                            {item.icon} {item.label}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Layout 4: List Mode */}
            {layoutStyle === 'list' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                {contributors.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '12.5px',
                      color: 'inherit',
                      padding: '6px 12px',
                      background: 'var(--surface-mid, rgba(255, 255, 255, 0.04))',
                      borderRadius: '6px'
                    }}
                  >
                    <img
                      src={`https://github.com/${c.username}.png?size=32`}
                      alt={c.name}
                      style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'https://github.com/github.png'
                      }}
                    />
                    <strong className="contributor-name-text">{c.name}</strong>
                    <span style={{ color: 'var(--text-muted, #94a3b8)', fontFamily: 'monospace', fontSize: '11px' }}>
                      @{c.username}
                    </span>
                    <span>—</span>
                    <span>
                      {c.roles
                        .map((r) => {
                          const item = CONTRIBUTION_TYPES.find((t) => t.id === r)
                          return item ? `${item.icon} ${item.label}` : ''
                        })
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Sponsors Callout Tier */}
            {includeSponsors && (
              <div
                className="contributor-sponsor-callout"
                style={{
                  marginTop: '24px',
                  padding: '16px',
                  borderRadius: '6px',
                  border: '1px dashed rgba(234, 74, 170, 0.4)',
                  textAlign: 'center',
                  background: 'rgba(234, 74, 170, 0.04)'
                }}
              >
                <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 700, color: '#f472b6' }}>
                  💖 Sponsors & Backers
                </h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '11.5px', color: 'var(--text-muted, #94a3b8)' }}>
                  Support this project by becoming a sponsor. Your logo will show up here with a link to your website!
                </p>
                <a
                  href={sponsorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '4px',
                    background: '#ea4aaa',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>favorite</span>
                  <span>Sponsor via GitHub</span>
                </a>
              </div>
            )}
          </div>
        </div>
      }
    />
  )
}
