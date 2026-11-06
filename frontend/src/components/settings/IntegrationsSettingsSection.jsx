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

  // API Keys state
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('visualmark_gemini_key') || '')
  const [showGeminiKey, setShowGeminiKey] = useState(false)

  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('visualmark_openai_key') || '')
  const [showOpenaiKey, setShowOpenaiKey] = useState(false)

  const [anthropicKey, setAnthropicKey] = useState(() => localStorage.getItem('visualmark_anthropic_key') || '')
  const [showAnthropicKey, setShowAnthropicKey] = useState(false)

  const [groqKey, setGroqKey] = useState(() => localStorage.getItem('visualmark_groq_key') || '')
  const [showGroqKey, setShowGroqKey] = useState(false)

  const [ollamaUrl, setOllamaUrl] = useState(() => localStorage.getItem('visualmark_ollama_url') || 'http://localhost:11434')
  const [ollamaEnabled, setOllamaEnabled] = useState(() => localStorage.getItem('visualmark_ollama_enabled') === 'true')

  if (activeCategory !== 'all' && activeCategory !== 'github' && activeCategory !== 'ai') return null

  const inputStyle = {
    flex: 1,
    background: 'var(--surface-high, #2d2d30)',
    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
    color: 'var(--text-primary, #cccccc)',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '12px'
  }

  const eyeBtnStyle = {
    padding: '4px 8px',
    height: '28px',
    display: 'flex',
    alignItems: 'center'
  }

  return (
    <section className="settings-group-section">
      <div className="settings-group-header">
        <span className="material-symbols-outlined" style={{ color: 'var(--text-secondary)' }}>hub</span>
        <h3>{t('settings.github.title', 'AI Providers & Integrations')}</h3>
      </div>

      <div style={{ padding: '0 0 12px 0', fontSize: '12px', color: 'var(--text-secondary, #94a3b8)' }}>
        Configure one or more AI providers below. VisualMark Studio can switch between them seamlessly and will automatically fall back if your primary model is unavailable.
      </div>

      {/* 1. Google Gemini AI Studio API Key */}
      {matchesSearch('gemini google ai copilot api key vmarks studio llm') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">
              <span>Google Gemini API Key</span>
            </div>
            <div className="settings-card-sublabel">
              Powers Gemini 3.5 Flash & Flash Lite with live workspace analysis, diff reviews, and Badge Studio automation.
              Get a free API key at{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}
              >
                aistudio.google.com/app/apikey ↗
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
                  window.dispatchEvent(new CustomEvent('visualmark:ai-key-updated', { detail: { provider: 'gemini', key: val } }))
                }}
                style={inputStyle}
              />
              <button
                type="button"
                className="settings-action-btn"
                onClick={() => setShowGeminiKey(!showGeminiKey)}
                title={showGeminiKey ? 'Hide key' : 'Show key'}
                style={eyeBtnStyle}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  {showGeminiKey ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. OpenAI API Key */}
      {matchesSearch('openai chatgpt gpt-4o gpt-4o-mini copilot api key') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">
              <span>OpenAI API Key (GPT-4o & GPT-4o Mini)</span>
            </div>
            <div className="settings-card-sublabel">
              Powers GPT-4o Mini and GPT-4o for markdown scaffolding and technical architecture diagrams.
              Keys available at{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}
              >
                platform.openai.com/api-keys ↗
              </a>.
            </div>
          </div>
          <div className="settings-card-control" style={{ minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
              <input
                type={showOpenaiKey ? 'text' : 'password'}
                className="settings-input-text"
                placeholder="sk-proj-xxxxxxxxxxxx"
                value={openaiKey}
                onChange={(e) => {
                  const val = e.target.value.trim()
                  setOpenaiKey(val)
                  localStorage.setItem('visualmark_openai_key', val)
                  window.dispatchEvent(new CustomEvent('visualmark:ai-key-updated', { detail: { provider: 'openai', key: val } }))
                }}
                style={inputStyle}
              />
              <button
                type="button"
                className="settings-action-btn"
                onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                title={showOpenaiKey ? 'Hide key' : 'Show key'}
                style={eyeBtnStyle}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  {showOpenaiKey ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Anthropic Claude API Key */}
      {matchesSearch('anthropic claude sonnet haiku copilot api key') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">
              <span>Anthropic Claude API Key (Claude 3.5 Sonnet & Haiku)</span>
            </div>
            <div className="settings-card-sublabel">
              Exceptional markdown authoring and prose refinement.
              Get your key from{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}
              >
                console.anthropic.com ↗
              </a>.
            </div>
          </div>
          <div className="settings-card-control" style={{ minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
              <input
                type={showAnthropicKey ? 'text' : 'password'}
                className="settings-input-text"
                placeholder="sk-ant-xxxxxxxxxxxx"
                value={anthropicKey}
                onChange={(e) => {
                  const val = e.target.value.trim()
                  setAnthropicKey(val)
                  localStorage.setItem('visualmark_anthropic_key', val)
                  window.dispatchEvent(new CustomEvent('visualmark:ai-key-updated', { detail: { provider: 'anthropic', key: val } }))
                }}
                style={inputStyle}
              />
              <button
                type="button"
                className="settings-action-btn"
                onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                title={showAnthropicKey ? 'Hide key' : 'Show key'}
                style={eyeBtnStyle}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  {showAnthropicKey ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Groq Cloud API Key */}
      {matchesSearch('groq llama deepseek lpu ultra fast free api key') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">
              <span>Groq Cloud API Key (Llama 3.3 70B & DeepSeek R1)</span>
            </div>
            <div className="settings-card-sublabel">
              Ultra-fast open weights inference powered by Groq LPU chips. Free tier available at{' '}
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}
              >
                console.groq.com/keys ↗
              </a>.
            </div>
          </div>
          <div className="settings-card-control" style={{ minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
              <input
                type={showGroqKey ? 'text' : 'password'}
                className="settings-input-text"
                placeholder="gsk_xxxxxxxxxxxx"
                value={groqKey}
                onChange={(e) => {
                  const val = e.target.value.trim()
                  setGroqKey(val)
                  localStorage.setItem('visualmark_groq_key', val)
                  window.dispatchEvent(new CustomEvent('visualmark:ai-key-updated', { detail: { provider: 'groq', key: val } }))
                }}
                style={inputStyle}
              />
              <button
                type="button"
                className="settings-action-btn"
                onClick={() => setShowGroqKey(!showGroqKey)}
                title={showGroqKey ? 'Hide key' : 'Show key'}
                style={eyeBtnStyle}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  {showGroqKey ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Ollama Local Offline LLM */}
      {matchesSearch('ollama local offline private llama3 qwen mistral url') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">
              <span>Ollama (Local Offline LLM)</span>
            </div>
            <div className="settings-card-sublabel">
              Run models like Llama 3.2, Qwen 2.5, or Mistral completely locally on your machine with zero telemetry.
              Requires{' '}
              <a
                href="https://ollama.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}
              >
                Ollama ↗
              </a>{' '}
              running in the background.
            </div>
          </div>
          <div className="settings-card-control" style={{ minWidth: '260px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12 }}>
                  <input
                    type="checkbox"
                    checked={ollamaEnabled}
                    onChange={(e) => {
                      const enabled = e.target.checked
                      setOllamaEnabled(enabled)
                      localStorage.setItem('visualmark_ollama_enabled', String(enabled))
                      window.dispatchEvent(new CustomEvent('visualmark:ai-key-updated', { detail: { provider: 'ollama', enabled } }))
                    }}
                  />
                  <span>Enable Local Ollama</span>
                </label>
              </div>
              <input
                type="text"
                className="settings-input-text"
                placeholder="http://localhost:11434"
                value={ollamaUrl}
                disabled={!ollamaEnabled}
                onChange={(e) => {
                  const val = e.target.value.trim()
                  setOllamaUrl(val)
                  localStorage.setItem('visualmark_ollama_url', val)
                }}
                style={{
                  ...inputStyle,
                  opacity: ollamaEnabled ? 1 : 0.5
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* GitHub Personal Access Token */}
      {matchesSearch('github token pat rate limit authorization api private repo') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">
              <span>{t('settings.github.token', 'GitHub: Personal Access Token (PAT)')}</span>
            </div>
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
                style={inputStyle}
              />
              <button
                type="button"
                className="settings-action-btn"
                onClick={() => setShowToken(!showToken)}
                title={showToken ? t('settings.github.hideToken', 'Hide token') : t('settings.github.showToken', 'Show token')}
                style={eyeBtnStyle}
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
