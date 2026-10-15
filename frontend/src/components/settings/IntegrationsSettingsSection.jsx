import React from 'react'

export default function IntegrationsSettingsSection({
  activeCategory,
  matchesSearch,
  githubToken = '',
  setGithubToken = () => {},
  showToken,
  setShowToken
}) {
  if (activeCategory !== 'all' && activeCategory !== 'github') return null

  return (
    <section className="settings-group-section">
      <div className="settings-group-header">
        <span className="material-symbols-outlined">hub</span>
        <h3>GitHub & Integrations</h3>
      </div>

      {/* GitHub Personal Access Token */}
      {matchesSearch('github token pat rate limit authorization api private repo') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">GitHub: Personal Access Token (PAT)</div>
            <div className="settings-card-sublabel">
              Increases GitHub API rate limits from 60 to 5,000 requests/hour and enables scanning of private repositories.
              Stored only on your local device.
            </div>
          </div>
          <div className="settings-card-control" style={{ minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
              <input
                type={showToken ? 'text' : 'password'}
                className="settings-input-text"
                placeholder="ghp_xxxxxxxxxxxx"
                value={githubToken}
                onChange={(e) => {
                  setGithubToken(e.target.value)
                  localStorage.setItem('readme_github_token', e.target.value.trim())
                }}
                style={{
                  flex: 1,
                  background: 'var(--surface-high, #2d2d30)',
                  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  color: 'var(--text-primary, #cccccc)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px'
                }}
              />
              <button
                type="button"
                className="settings-action-btn"
                onClick={() => setShowToken(!showToken)}
                title={showToken ? 'Hide token' : 'Show token'}
                style={{ padding: '4px 8px', height: '28px', display: 'flex', alignItems: 'center' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  {showToken ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
