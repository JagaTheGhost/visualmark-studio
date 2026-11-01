import React from 'react'
import { GITHUB_METRICS, SKILL_ICONS_LIST } from '../../../data/badgeStudioData'
import { escapeShieldsText, getRackBadgeUrl } from '../../../utils/badgeEngine'

/**
 * Focused Live Preview Surface for Shields.io Badges, SkillIcons, and Racks.
 * Designed to fit seamlessly inside StudioShell's canvas stage.
 */
export default function BadgeLivePreview({
  activeMode,
  formatType,
  style = 'for-the-badge',
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
  rackLayout = 'centered',
  selectedMetrics = [],
  githubMetricsStyle = 'for-the-badge',
  cleanRepo = 'facebook/react',
  ciWorkflow = 'ci.yml',
  metricsError,
  setMetricsError,
  selectedPack,
  packLayout = 'centered',
  logo = ''
}) {
  return (
    <div className="badge-live-stage-content">
      {/* 1. Single Badge Preview */}
      {activeMode === 'single' && (
        <div className="badge-preview-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          {!singleBadgeError ? (
            <img
              src={singleBadgeUrl}
              alt={plateTitle || `${label} ${message}`}
              className="badge-render-img"
              style={{
                height: style === 'for-the-badge' ? '28px' : '20px',
                maxWidth: '100%',
                display: 'block'
              }}
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
                <span>Preview fallback active</span>
              </div>
            </div>
          )}

          {/* Dimension & Telemetry HUD */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono, monospace)',
              color: 'var(--text-muted)',
              userSelect: 'none'
            }}
          >
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{style}</span>
            <span>·</span>
            <span>{formatType}</span>
            {logo && (
              <>
                <span>·</span>
                <span style={{ color: 'var(--secondary, #38bdf8)' }}>icon: {logo}</span>
              </>
            )}
            <span>·</span>
            <span style={{ color: `#${color.replace('#', '') || '6366f1'}` }}>#{color.replace('#', '') || '6366f1'}</span>
          </div>
        </div>
      )}

      {/* 2. SkillIcons Grid Preview */}
      {activeMode === 'skillicons' && (
        <div className="badge-preview-box">
          {!skillIconsError ? (
            <img
              src={skillIconsUrl}
              alt="SkillIcons Grid"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', display: 'block' }}
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
            </div>
          )}
        </div>
      )}

      {/* 3. Tech Stack Rack Mode Preview */}
      {activeMode === 'rack' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
          {rackLayout === 'table' ? (
            <div className="badge-preview-table-container">
              <table className="badge-preview-table">
                <thead>
                  <tr>
                    <th style={{ width: '30%' }}>Technology</th>
                    <th style={{ width: '45%', textAlign: 'center' }}>Badge</th>
                    <th style={{ width: '25%' }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {rackBadges.map((b, idx) => {
                    const bUrl = getRackBadgeUrl(b, style)
                    return (
                      <tr key={b.id || idx}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {b.title || b.label || 'Tech'}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <img
                            src={bUrl}
                            alt={`${b.label} ${b.message}`}
                            className="badge-render-img"
                            style={{ height: (b.style || style) === 'for-the-badge' ? '26px' : '20px' }}
                            onError={(e) => { e.target.style.opacity = '0.5' }}
                          />
                        </td>
                        <td>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Core Stack</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className="badge-rack-preview-flow"
              style={{
                justifyContent: rackLayout === 'centered' ? 'center' : 'flex-start',
                flexDirection: rackLayout === 'lines' ? 'column' : 'row',
                alignItems: rackLayout === 'lines' ? 'center' : 'center',
                width: rackLayout === 'inline' ? '100%' : 'auto'
              }}
            >
              {rackBadges.map((b, idx) => {
                const bUrl = getRackBadgeUrl(b, style)
                return (
                  <img
                    key={b.id || idx}
                    src={bUrl}
                    alt={`${b.label} ${b.message}`}
                    className="badge-render-img"
                    style={{ height: (b.style || style) === 'for-the-badge' ? '28px' : '20px' }}
                    onError={(e) => { e.target.style.opacity = '0.5' }}
                  />
                )
              })}
            </div>
          )}

          {rackBadges.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', padding: '24px' }}>
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
                  bUrl = `https://img.shields.io/github/actions/workflow/status/${cleanRepo}/${ciWorkflow || 'ci.yml'}?style=${githubMetricsStyle}&logo=githubactions&logoColor=white`
                } else {
                  bUrl = `https://img.shields.io/github/${m.path}/${cleanRepo}?style=${githubMetricsStyle}`
                }
                return (
                  <img
                    key={m.id}
                    src={bUrl}
                    alt={m.title}
                    className="badge-render-img"
                    style={{ height: githubMetricsStyle === 'for-the-badge' ? '28px' : '20px' }}
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
          {packLayout === 'table' ? (
            <div className="badge-preview-table-container">
              <table className="badge-preview-table">
                <thead>
                  <tr>
                    <th style={{ width: '28%' }}>Technology</th>
                    <th style={{ width: '46%', textAlign: 'center' }}>Badge / Version</th>
                    <th style={{ width: '26%' }}>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedPack.badges || []).map((b, idx) => {
                    const bC = (b.color || '6366f1').replace('#', '')
                    const bL = escapeShieldsText(b.label)
                    const bM = escapeShieldsText(b.message || '')
                    const badgeStyle = style || b.style || 'for-the-badge'
                    const bUrl = `https://img.shields.io/badge/${bL}-${bM}-${bC}?style=${badgeStyle}&logo=${encodeURIComponent(b.logo || '')}&logoColor=white`
                    return (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {b.label}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <img
                            src={bUrl}
                            alt={`${b.label} ${b.message || ''}`}
                            className="badge-render-img"
                            style={{ height: badgeStyle === 'for-the-badge' ? '26px' : '20px' }}
                            onError={(e) => { e.target.style.opacity = '0.5' }}
                          />
                        </td>
                        <td>
                          <span
                            className="badge-pack-count"
                            style={{
                              fontSize: '9.5px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(56, 189, 248, 0.12)',
                              color: 'var(--secondary, #38bdf8)'
                            }}
                          >
                            {selectedPack.category || 'Core Stack'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className="badge-rack-preview-flow"
              style={{
                justifyContent: packLayout === 'centered' ? 'center' : 'flex-start',
                width: packLayout === 'inline' ? '100%' : 'auto',
                maxWidth: '100%'
              }}
            >
              {(selectedPack.badges || []).map((b, idx) => {
                const bC = (b.color || '6366f1').replace('#', '')
                const bL = escapeShieldsText(b.label)
                const bM = escapeShieldsText(b.message || '')
                const badgeStyle = style || b.style || 'for-the-badge'
                const bUrl = `https://img.shields.io/badge/${bL}-${bM}-${bC}?style=${badgeStyle}&logo=${encodeURIComponent(b.logo || '')}&logoColor=white`
                return (
                  <img
                    key={idx}
                    src={bUrl}
                    alt={`${b.label} ${b.message || ''}`}
                    className="badge-render-img"
                    style={{ height: badgeStyle === 'for-the-badge' ? '28px' : '20px' }}
                    onError={(e) => { e.target.style.opacity = '0.5' }}
                  />
                )
              })}
            </div>
          )}

          {/* Telemetry HUD */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono, monospace)',
              color: 'var(--text-muted)',
              userSelect: 'none'
            }}
          >
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{style}</span>
            <span>·</span>
            <span style={{ color: 'var(--secondary, #38bdf8)' }}>layout: {packLayout}</span>
            <span>·</span>
            <span>{selectedPack.badges?.length || 0} badges</span>
            <span>·</span>
            <span>{selectedPack.category}</span>
          </div>
        </div>
      )}
    </div>
  )
}
