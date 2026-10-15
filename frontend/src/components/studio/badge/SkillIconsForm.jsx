import React from 'react'
import { SKILL_ICONS_LIST } from '../../../data/badgeStudioData'

export default function SkillIconsForm({
  selectedSkillIcons,
  toggleSkillIcon,
  skillTheme,
  setSkillTheme,
  skillPerLine,
  setSkillPerLine,
  skillSearch,
  setSkillSearch,
  filteredSkillIcons
}) {
  return (
    <div className="skillicons-container">
      <div className="studio-section">
        <label className="studio-section-label">
          Selected Tech Icons ({selectedSkillIcons.length} in Grid)
        </label>
        <div className="skillicons-selected-rack custom-scrollbar">
          {selectedSkillIcons.map((slug) => {
            const match = SKILL_ICONS_LIST.find((i) => i.id === slug)
            return (
              <div key={slug} className="skillicon-chip">
                <span>{match ? match.name : slug}</span>
                <button
                  type="button"
                  className="skillicon-chip-remove"
                  onClick={() => toggleSkillIcon(slug)}
                >
                  ×
                </button>
              </div>
            )
          })}
          {selectedSkillIcons.length === 0 && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Click icons below to add them to your macOS squircle grid
            </span>
          )}
        </div>
      </div>

      {/* Theme & Icons Per Line */}
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

      {/* SkillIcons Selection Grid */}
      <div className="studio-section">
        <div className="studio-section-header">
          <label className="studio-section-label">All Available Technologies</label>
          <input
            type="text"
            className="studio-search-mini"
            placeholder="Search technologies..."
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
          />
        </div>
        <div className="skillicons-grid custom-scrollbar">
          {filteredSkillIcons.map((ic) => {
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
