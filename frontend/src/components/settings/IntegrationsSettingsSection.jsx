import React, { useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'

export default function IntegrationsSettingsSection({
  activeCategory,
  matchesSearch,
  githubToken = '',
  setGithubToken = () => {},
  showToken,
  setShowToken
}) {
  const { t } = useI18n()
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('visualmark_gemini_key') || '')
  const [showGeminiKey, setShowGeminiKey] = useState(false)

  if (activeCategory !== 'all' && activeCategory !== 'github' && activeCategory !== 'ai') return null

  return (
    <section className="settings-group-section">
      <div className="settings-group-header">
        <span className="material-symbols-outlined">hub</span>
        <h3>{t('settings.github.title', 'GitHub & AI Integrations')}</h3>
      </div>

      {/* Google Gemini AI Studio API Key */}
      {matchesSearch('gemini ai copilot api key vmarks studio llm') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">Google Gemini API Key (VMarks Copilot)</div>
            <div className="settings-card-sublabel">
              Powers VMarks AI Copilot, live document diff reviews, and Shields.io Badge Studio automation.
              Get your free API key at{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#818cf8', textDecoration: 'underline' }}
              >
                aistudio.google.com/app/apikey
              </a>.
            </div>
          </div>
          <div className="settings-card-control" style={{ minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
              <input
                type={showGeminiKey ? 'text' : 'password'}
                className="settings-input-text"
                placeholder="AIzaSyxxxxxxxxxxxx"
                value={geminiKey}
                onChange={(e) => {
                  const val = e.target.value.trim()
                  setGeminiKey(val)
                  localStorage.setItem('visualmark_gemini_key', val)
                  window.dispatchEvent(new CustomEvent('visualmark:gemini-key-updated', { detail: val }))
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
                onClick={() => setShowGeminiKey(!showGeminiKey)}
                title={showGeminiKey ? 'Hide key' : 'Show key'}
                style={{ padding: '4px 8px', height: '28px', display: 'flex', alignItems: 'center' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  {showGeminiKey ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Personal Access Token */}
      {matchesSearch('github token pat rate limit authorization api private repo') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">{t('settings.github.token', 'GitHub: Personal Access Token (PAT)')}</div>
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
                title={showToken ? t('settings.github.hideToken', 'Hide token') : t('settings.github.showToken', 'Show token')}
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
