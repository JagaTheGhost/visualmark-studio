import React from 'react'
import { BADGE_STYLES, COLOR_THEMES } from '../../../data/badgeStudioData'
import { escapeShieldsText } from '../../../utils/modernRepoCardEngine'

export default function BadgeRackForm({
  rackBadges,
  style,
  setActiveMode,
  handleRemoveRackBadge,
  rackLayout,
  setRackLayout,
  handleApplyStyleToRack,
  handleApplyThemeToRack
}) {
  return (
    <div className="badge-rack-container">
      <div className="studio-section">
        <div className="studio-section-header">
          <label className="studio-section-label">
            Configured Badges Rack ({rackBadges.length} Active)
          </label>
          <button
            type="button"
            className="btn-studio-secondary"
            onClick={() => setActiveMode('single')}
            style={{ height: '24px', fontSize: '10px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>add</span>
            <span>Create New</span>
          </button>
        </div>

        <div className="badge-rack-list custom-scrollbar">
          {rackBadges.map((b, idx) => {
            const bC = (b.color || '6366f1').replace('#', '')
            let bUrl = ''
            if (b.format === 'brand-plate') {
              bUrl = `https://img.shields.io/badge/${escapeShieldsText(b.title || b.label)}-${bC}?style=${b.style || style}`
            } else if (b.format === 'icon-only') {
              bUrl = `https://img.shields.io/badge/--${bC}?style=${b.style || style}`
            } else {
              bUrl = `https://img.shields.io/badge/${escapeShieldsText(b.label)}-${escapeShieldsText(b.message)}-${bC}?style=${b.style || style}`
            }
            if (b.logo) bUrl += `&logo=${encodeURIComponent(b.logo)}&logoColor=white`

            return (
              <div key={b.id || idx} className="badge-rack-item">
                <div className="badge-rack-item-left">
                  <img
                    src={bUrl}
                    alt={`${b.label} ${b.message}`}
                    className="badge-rack-img"
                  />
                </div>
                <div className="badge-rack-item-actions">
                  <button
                    type="button"
                    className="btn-rack-mini delete"
                    onClick={() => handleRemoveRackBadge(b.id)}
                    title="Remove badge from rack"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                  </button>
                </div>
              </div>
            )
          })}
          {rackBadges.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '11px' }}>
              No badges in your rack yet. Switch to "Badge Designer" or "Curated Packs" to add badges.
            </div>
          )}
        </div>
      </div>

      {/* Layout Alignment Format */}
      <div className="studio-section">
        <label className="studio-section-label">Rack Markdown Layout Structure</label>
        <div className="studio-segmented-styles">
          <button
            type="button"
            className={`studio-style-btn ${rackLayout === 'center-div' ? 'active' : ''}`}
            onClick={() => setRackLayout('center-div')}
          >
            📐 Centered HTML Grid (&lt;div align="center"&gt;)
          </button>
          <button
            type="button"
            className={`studio-style-btn ${rackLayout === 'inline' ? 'active' : ''}`}
            onClick={() => setRackLayout('inline')}
          >
            🔗 Inline Markdown Row
          </button>
          <button
            type="button"
            className={`studio-style-btn ${rackLayout === 'lines' ? 'active' : ''}`}
            onClick={() => setRackLayout('lines')}
          >
            📋 Stacked Lines
          </button>
        </div>
      </div>

      {/* Bulk Style & Theme Application */}
      <div className="studio-section">
        <label className="studio-section-label">Batch Operations for Entire Rack</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {BADGE_STYLES.map((st) => (
              <button
                key={st.id}
                type="button"
                className="studio-style-btn"
                onClick={() => handleApplyStyleToRack(st.id)}
              >
                Set all to {st.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
            {COLOR_THEMES.slice(0, 6).map((th) => (
              <button
                key={th.id}
                type="button"
                className="studio-style-btn"
                onClick={() => handleApplyThemeToRack(th)}
              >
                Apply {th.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
