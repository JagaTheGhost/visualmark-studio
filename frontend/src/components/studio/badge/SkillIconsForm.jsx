import React, { useState, useMemo } from 'react'
import { SKILL_ICONS_LIST } from '../../../data/badgeStudioData'

export default function SkillIconsForm({
  selectedSkillIcons = [],
  toggleSkillIcon,
  skillTheme = 'dark',
  setSkillTheme,
  skillPerLine = '10',
  setSkillPerLine,
  skillSearch = '',
  setSkillSearch,
  filteredSkillIcons = [],
  setSelectedSkillIcons
}) {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = ['all', 'languages', 'frameworks', 'databases', 'devops', 'tools']

  const displayedIcons = useMemo(() => {
    let list = filteredSkillIcons
    if (activeCategory !== 'all') {
      list = list.filter((i) => i.category === activeCategory)
    }
    return list
  }, [filteredSkillIcons, activeCategory])

  // Move selected icon left/right in order
  const handleMoveIcon = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= selectedSkillIcons.length) return
    const next = [...selectedSkillIcons]
    const temp = next[targetIndex]
    next[targetIndex] = next[index]
    next[index] = temp
    if (typeof setSelectedSkillIcons === 'function') {
      setSelectedSkillIcons(next)
    }
  }

  // Quick preset stacks
  const applyPreset = (preset) => {
    if (typeof setSelectedSkillIcons === 'function') {
      setSelectedSkillIcons(preset)
    }
  }

  return (
    <div className="skillicons-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. Selected Tech Icons Rack with Order Controls */}
      <div className="studio-section">
        <div className="studio-section-header">
          <label className="studio-section-label">
            Selected Tech Icons ({selectedSkillIcons.length} in Grid)
          </label>
          {selectedSkillIcons.length > 0 && (
            <button
              type="button"
              className="btn-studio-secondary"
              onClick={() => setSelectedSkillIcons([])}
              style={{ height: '22px', fontSize: '10px', color: '#f87171' }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="skillicons-selected-rack custom-scrollbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', minHeight: '44px', padding: '8px' }}>
          {selectedSkillIcons.map((slug, idx) => {
            const match = SKILL_ICONS_LIST.find((i) => i.id === slug)
            return (
              <div
                key={slug}
                className="skillicon-chip"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  background: 'var(--surface-base)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '9999px',
                  fontSize: '11px'
                }}
              >
                {/* Left arrow */}
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMoveIcon(idx, -1)}
                    title="Move left"
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    ‹
                  </button>
                )}

                <span style={{ fontWeight: 500 }}>{match ? match.name : slug}</span>

                {/* Right arrow */}
                {idx < selectedSkillIcons.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleMoveIcon(idx, 1)}
                    title="Move right"
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    ›
                  </button>
                )}

                {/* Remove */}
                <button
                  type="button"
                  className="skillicon-chip-remove"
                  onClick={() => toggleSkillIcon(slug)}
                  title="Remove icon"
                  style={{ marginLeft: '2px', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
            )
          })}
          {selectedSkillIcons.length === 0 && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '6px' }}>
              Click technologies from the catalog below to add them to your macOS-style squircle grid.
            </span>
          )}
        </div>

        {/* Quick presets */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', alignSelf: 'center' }}>Presets:</span>
          <button
            type="button"
            className="studio-style-btn"
            style={{ fontSize: '9.5px', padding: '2px 6px' }}
            onClick={() => applyPreset(['react', 'ts', 'tailwind', 'nextjs', 'nodejs', 'postgres', 'docker', 'git'])}
          >
            Web Fullstack
          </button>
          <button
            type="button"
            className="studio-style-btn"
            style={{ fontSize: '9.5px', padding: '2px 6px' }}
            onClick={() => applyPreset(['py', 'fastapi', 'postgres', 'redis', 'docker', 'linux', 'git', 'github'])}
          >
            Python Backend
          </button>
          <button
            type="button"
            className="studio-style-btn"
            style={{ fontSize: '9.5px', padding: '2px 6px' }}
            onClick={() => applyPreset(['docker', 'kubernetes', 'aws', 'linux', 'ubuntu', 'terraform', 'githubactions'])}
          >
            Cloud DevOps
          </button>
        </div>
      </div>

      {/* 2. Theme & Icons Per Line */}
      <div className="studio-input-duo">
        <div className="studio-field">
          <span className="studio-field-label">Theme Mode</span>
          <div className="studio-segmented-styles">
            <button
              type="button"
              className={`studio-style-btn ${skillTheme === 'dark' ? 'active' : ''}`}
              onClick={() => setSkillTheme('dark')}
            >
              🌙 Dark Mode
            </button>
            <button
              type="button"
              className={`studio-style-btn ${skillTheme === 'light' ? 'active' : ''}`}
              onClick={() => setSkillTheme('light')}
            >
              ☀️ Light Mode
            </button>
          </div>
        </div>
        <div className="studio-field">
          <span className="studio-field-label">Icons Per Row (perline)</span>
          <div className="studio-segmented-styles">
            {['6', '8', '10', '12', '16'].map((n) => (
              <button
                key={n}
                type="button"
                className={`studio-style-btn ${skillPerLine === n ? 'active' : ''}`}
                onClick={() => setSkillPerLine(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SkillIcons Selection Catalog */}
      <div className="studio-section">
        <div className="studio-section-header">
          <label className="studio-section-label">Available Technologies ({displayedIcons.length})</label>
          <input
            type="text"
            className="studio-search-mini"
            placeholder="Search tech (react, go, rust)..."
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            style={{ width: '160px' }}
          />
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`badge-icon-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              style={{ fontSize: '9.5px', padding: '2px 7px' }}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        <div className="skillicons-grid custom-scrollbar" style={{ maxHeight: '280px' }}>
          {displayedIcons.map((ic) => {
            const isSelected = selectedSkillIcons.includes(ic.id)
            return (
              <button
                key={ic.id}
                type="button"
                className={`skillicon-tile ${isSelected ? 'active' : ''}`}
                onClick={() => toggleSkillIcon(ic.id)}
                title={`${ic.name} (${ic.category})`}
              >
                <div
                  className="skillicon-tile-badge"
                  style={{
                    backgroundColor: `${ic.color}1c`,
                    borderColor: isSelected ? 'var(--primary)' : `${ic.color}35`,
                    color: ic.color === '#ffffff' ? '#e2e8f0' : ic.color
                  }}
                >
                  <span className="skillicon-tile-code">{ic.short || ic.name.slice(0, 2)}</span>
                </div>
                <span className="skillicon-tile-name">{ic.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
