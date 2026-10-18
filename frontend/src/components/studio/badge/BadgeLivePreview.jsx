import React from 'react'
import { GITHUB_METRICS, SKILL_ICONS_LIST } from '../../../data/badgeStudioData'
import { escapeShieldsText } from '../../../utils/modernRepoCardEngine'

/**
 * Focused Live Preview Surface for Shields.io Badges, SkillIcons, and Racks.
 * Designed to fit seamlessly inside StudioShell's canvas stage.
 */
export default function BadgeLivePreview({
  activeMode,
  formatType,
  style,
  singleBadgeUrl,
  plateTitle,
  label,
  message,
  color,
  labelColor,
  singleBadgeError,
  setSingleBadgeError,
  skillIconsUrl,
  selectedSkillIcons = [],
  skillTheme = 'dark',
  skillPerLine = 10,
  skillIconsError,
  setSkillIconsError,
  rackBadges = [],
  selectedMetrics = [],
  githubMetricsStyle = 'for-the-badge',
  cleanRepo = 'facebook/react',
  metricsError,
  setMetricsError,
  selectedPack
}) {
  return (
    <div className="badge-live-stage-content">
      {/* 1. Single Badge Preview */}
      {activeMode === 'single' && (
        <div className="badge-preview-box">
          {!singleBadgeError ? (
            <img
              src={singleBadgeUrl}
              alt={plateTitle || `${label} ${message}`}
              className="badge-render-img"
              onError={() => setSingleBadgeError(true)}
            />
          ) : (
            <div className="simulated-badge-preview">
              <div className={`simulated-badge simulated-style-${style}`}>
                {formatType === 'icon-only' ? (
                  <span className="sim-badge-body" style={{ backgroundColor: `#${color.replace('#', '')}` }}>
                    🏷️
                  </span>
                ) : formatType === 'brand-plate' ? (
                  <span className="sim-badge-body" style={{ backgroundColor: `#${color.replace('#', '')}` }}>
                    {plateTitle || label || 'BRAND'}
                  </span>
                ) : (
                  <>
                    <span
                      className="sim-badge-label"
                      style={{ backgroundColor: labelColor ? `#${labelColor.replace('#', '')}` : '#555555' }}
                    >
                      {label || 'badge'}
                    </span>
                    <span
                      className="sim-badge-message"
                      style={{ backgroundColor: `#${color.replace('#', '')}` }}
                    >
                      {message || 'value'}
                    </span>
                  </>
                )}
              </div>
              <div className="offline-notice-pill">
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>wifi_off</span>
                <span>Simulated Preview active (Shields.io CDN offline or formatting error)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. SkillIcons Squircle Grid Preview */}
      {activeMode === 'skillicons' && (
        <div className="badge-preview-box">
          {!skillIconsError ? (
            <img
              src={skillIconsUrl}
              alt="SkillIcons Grid"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
              onError={() => setSkillIconsError(true)}
            />
          ) : (
            <div className="simulated-skillicons-container">
              <div
                className="simulated-skillicons-deck"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(selectedSkillIcons.length || 1, Number(skillPerLine))}, 42px)`
                }}
              >
                {selectedSkillIcons.map((id) => {
                  const item = SKILL_ICONS_LIST.find((x) => x.id === id) || { name: id, color: '#6366f1', short: id }
                  return (
                    <div
                      key={id}
                      className="sim-skillicon-item"
                      style={{
                        backgroundColor: skillTheme === 'light' ? '#f1f5f9' : '#1e293b',
                        borderColor: `${item.color}60`
                      }}
                      title={item.name}
                    >
                      <span className="sim-skillicon-dot" style={{ backgroundColor: item.color }} />
                      <span className="sim-skillicon-code" style={{ color: item.color === '#ffffff' ? '#e2e8f0' : item.color }}>
                        {item.short}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="offline-notice-pill">
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>wifi_off</span>
                <span>Simulated Preview active</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Tech Stack Rack Mode Preview */}
      {activeMode === 'rack' && (
        <div className="badge-rack-preview-flow">
          {rackBadges.map((b, idx) => {
            const bC = (b.color || '6366f1').replace('#', '')
            let bUrl = ''
            if (b.format === 'brand-plate') {
              bUrl = `https://img.shields.io/badge/${escapeShieldsText(b.title || b.label)}-${bC}?style=${b.style || style}`
            } else if (b.format === 'icon-only') {
              bUrl = `https://img.shields.io/badge/--${bC}?style=${b.style || style}`
            } else {
              bUrl = `https://img.shields.io/badge/${escapeShieldsText(b.label)}-${escapeShieldsText(b.message)}-${bC}?style=${b.style || style}`
              if (b.labelColor) bUrl += `&labelColor=${encodeURIComponent(b.labelColor.replace('#', ''))}`
            }
            if (b.logo) bUrl += `&logo=${encodeURIComponent(b.logo)}&logoColor=white`

            return (
              <img
                key={b.id || idx}
                src={bUrl}
                alt={`${b.label} ${b.message}`}
                className="badge-render-img"
                onError={(e) => { e.target.style.opacity = '0.4' }}
              />
            )
          })}
          {rackBadges.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
              No badges in rack. Click "+ Add Custom Badge" or load from Curated Packs.
            </div>
          )}
        </div>
      )}

      {/* 4. Dynamic GitHub Metrics Preview */}
      {activeMode === 'github' && (
        <div className="badge-preview-box">
          {!metricsError ? (
            <div className="badge-rack-preview-flow">
              {GITHUB_METRICS.filter((m) => selectedMetrics.includes(m.id)).map((m) => {
                let bUrl = ''
                if (m.id === 'actions') {
                  bUrl = `https://img.shields.io/github/actions/workflow/status/${cleanRepo}/${m.workflow || 'ci.yml'}?style=${githubMetricsStyle}&logo=githubactions&logoColor=white`
                } else {
                  bUrl = `https://img.shields.io/github/${m.path}/${cleanRepo}?style=${githubMetricsStyle}`
                }
                return (
                  <img
                    key={m.id}
                    src={bUrl}
                    alt={m.title}
                    className="badge-render-img"
                    onError={() => setMetricsError(true)}
                  />
                )
              })}
              {selectedMetrics.length === 0 && (
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  Select at least one metric from the inspector to preview.
                </span>
              )}
            </div>
          ) : (
            <div className="offline-notice-pill">
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>wifi_off</span>
              <span>Shields GitHub endpoint unreachable • Syntax is valid for GitHub README</span>
            </div>
          )}
        </div>
      )}

      {/* 5. Curated Packs Preview */}
      {activeMode === 'packs' && selectedPack && (
        <div className="badge-rack-preview-flow">
          {selectedPack.badges.map((b, idx) => {
            const bC = (b.color || '6366f1').replace('#', '')
            const bUrl = `https://img.shields.io/badge/${escapeShieldsText(b.label)}-${escapeShieldsText(b.message)}-${bC}?style=${b.style || style}&logo=${encodeURIComponent(b.logo || '')}&logoColor=white`
            return (
              <img
                key={idx}
                src={bUrl}
                alt={`${b.label} ${b.message}`}
                className="badge-render-img"
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
