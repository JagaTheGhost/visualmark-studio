import React from 'react'
import { RepoCardPreview } from '../RepoCardStudio'
import { GITHUB_METRICS, SKILL_ICONS_LIST } from '../../../data/badgeStudioData'
import { escapeShieldsText } from '../../../utils/modernRepoCardEngine'

export default function BadgeLivePreview({
  activeMode,
  formatType,
  style,
  selectedSkillIcons,
  skillTheme,
  repoCardState,
  rackBadges,
  selectedMetrics,
  selectedPack,
  canvasBg,
  setCanvasBg,
  singleBadgeError,
  setSingleBadgeError,
  singleBadgeUrl,
  plateTitle,
  label,
  message,
  color,
  labelColor,
  skillIconsError,
  setSkillIconsError,
  skillIconsUrl,
  skillPerLine,
  cleanRepo,
  githubMetricsStyle,
  metricsError,
  setMetricsError,
  syntaxView,
  setSyntaxView,
  copied,
  handleCopy,
  activeSnippet
}) {
  return (
    <div className="studio-preview-column custom-scrollbar" style={{ flex: 1, minWidth: 0 }}>
      {/* Live Render Canvas Card */}
      <div className="studio-card">
        <div className="studio-card-header">
          <div className="canvas-toolbar">
            <div className="canvas-toolbar-group">
              <span className="studio-card-title">Live Canvas Preview</span>
              <span className="studio-card-tag">
                {activeMode === 'single'
                  ? `${formatType} (${style})`
                  : activeMode === 'skillicons'
                  ? `${selectedSkillIcons.length} skills (${skillTheme})`
                  : activeMode === 'repocards'
                  ? `${repoCardState.template} (${repoCardState.theme})`
                  : activeMode === 'rack'
                  ? `${rackBadges.length} in rack`
                  : activeMode === 'github'
                  ? `${selectedMetrics.length} metrics`
                  : selectedPack.title}
              </span>
            </div>
            <div className="canvas-toolbar-group">
              <button
                type="button"
                className={`canvas-tool-btn ${canvasBg === 'dark' ? 'active' : ''}`}
                onClick={() => setCanvasBg('dark')}
                title="GitHub Dark background preview (#0d1117)"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>dark_mode</span>
                <span>Dark</span>
              </button>
              <button
                type="button"
                className={`canvas-tool-btn ${canvasBg === 'light' ? 'active' : ''}`}
                onClick={() => setCanvasBg('light')}
                title="GitHub Light background preview (#ffffff)"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>light_mode</span>
                <span>Light</span>
              </button>
            </div>
          </div>
        </div>

        <div className={`studio-render-canvas ${canvasBg === 'light' ? 'light-bg' : 'dark-bg'}`}>
          {/* Single Badge Preview */}
          {activeMode === 'single' && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
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
                    <span>External CDN Unreachable • Simulated Preview active • Markdown syntax is valid</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SkillIcons Squircle Grid Preview */}
          {activeMode === 'skillicons' && (
            <div style={{ textAlign: 'center', padding: '16px', maxWidth: '100%', overflowX: 'auto' }}>
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
                      gridTemplateColumns: `repeat(${Math.min(selectedSkillIcons.length || 1, skillPerLine)}, 42px)`
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
                    <span>SkillIcons CDN Unreachable • Simulated Preview active • Markdown syntax is valid</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Repo Card Preview */}
          {activeMode === 'repocards' && (
            <RepoCardPreview {...repoCardState} />
          )}

          {/* Rack Mode Preview */}
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
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  Add badges to preview rack layout
                </span>
              )}
            </div>
          )}

          {/* Dynamic GitHub Metrics Preview */}
          {activeMode === 'github' && (
            <div className="badge-rack-preview-flow">
              {GITHUB_METRICS.filter((m) => selectedMetrics.includes(m.id)).map((m) => {
                let bUrl = ''
                if (m.id === 'actions') {
                  bUrl = `https://img.shields.io/github/actions/workflow/status/${cleanRepo}/${m.workflow}?style=${githubMetricsStyle}&logo=githubactions&logoColor=white`
                } else {
                  bUrl = `https://img.shields.io/github/${m.path}/${cleanRepo}?style=${githubMetricsStyle}`
                }
                return (
                  <img
                    key={m.id}
                    src={bUrl}
                    alt={m.title}
                    className="badge-render-img"
                    onError={(e) => { e.target.style.opacity = '0.4'; setMetricsError(true); }}
                  />
                )
              })}
              {metricsError && (
                <div className="offline-notice-pill" style={{ width: '100%', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>wifi_off</span>
                  <span>Shields.io metrics CDN unreachable (DNS / offline) • Generated markdown is valid</span>
                </div>
              )}
            </div>
          )}

          {/* Curated Pack Preview */}
          {activeMode === 'packs' && (
            <div className="badge-rack-preview-flow">
              {selectedPack.badges.map((b, idx) => {
                const bL = escapeShieldsText(b.label)
                const bM = escapeShieldsText(b.message)
                let bUrl = `https://img.shields.io/badge/${bL}-${bM}-${b.color}?style=${b.style || style}`
                if (b.logo) bUrl += `&logo=${encodeURIComponent(b.logo)}&logoColor=white`
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
      </div>

      {/* Generated Code Card */}
      <div className="studio-card">
        <div className="studio-card-header">
          <div className="canvas-toolbar-group">
            <span className="studio-card-title">Generated Syntax</span>
            {activeMode === 'single' && (
              <div className="studio-segmented-styles" style={{ gap: '2px' }}>
                <button
                  type="button"
                  className={`canvas-tool-btn ${syntaxView === 'markdown' ? 'active' : ''}`}
                  onClick={() => setSyntaxView('markdown')}
                >
                  Markdown
                </button>
                <button
                  type="button"
                  className={`canvas-tool-btn ${syntaxView === 'html' ? 'active' : ''}`}
                  onClick={() => setSyntaxView('html')}
                >
                  HTML
                </button>
                <button
                  type="button"
                  className={`canvas-tool-btn ${syntaxView === 'url' ? 'active' : ''}`}
                  onClick={() => setSyntaxView('url')}
                >
                  URL
                </button>
              </div>
            )}
          </div>
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
        <pre className="studio-code-block custom-scrollbar">
          <code>{activeSnippet}</code>
        </pre>
      </div>
    </div>
  )
}
