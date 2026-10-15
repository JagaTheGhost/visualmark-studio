import React from 'react'

export default function AdaptiveThemeForm({
  darkThemeUrl,
  setDarkThemeUrl,
  lightThemeUrl,
  setLightThemeUrl,
  adaptiveAlt,
  setAdaptiveAlt,
  adaptiveFormat,
  setAdaptiveFormat,
  imageAlign,
  setImageAlign,
  imageWidth,
  setImageWidth
}) {
  return (
    <>
      <div className="studio-section">
        <label className="studio-section-label">Theme-Adaptive URLs (GitHub Light/Dark)</label>
        <div className="studio-field">
          <span className="studio-field-label">🌙 Dark Mode Image URL (Rendered in dark themes)</span>
          <input
            type="text"
            className="studio-text-input"
            value={darkThemeUrl}
            onChange={(e) => setDarkThemeUrl(e.target.value)}
            placeholder="https://.../banner-dark.png"
          />
        </div>

        <div className="studio-field">
          <span className="studio-field-label">☀️ Light Mode Image URL (Rendered in light themes)</span>
          <input
            type="text"
            className="studio-text-input"
            value={lightThemeUrl}
            onChange={(e) => setLightThemeUrl(e.target.value)}
            placeholder="https://.../banner-light.png"
          />
        </div>

        <div className="studio-field">
          <span className="studio-field-label">Alt Description</span>
          <input
            type="text"
            className="studio-text-input"
            value={adaptiveAlt}
            onChange={(e) => setAdaptiveAlt(e.target.value)}
            placeholder="e.g. Project Architecture Overview"
          />
        </div>
      </div>

      <div className="studio-section">
        <label className="studio-section-label">Syntax Mode</label>
        <div className="studio-segmented-styles">
          <button
            type="button"
            className={`studio-style-btn ${adaptiveFormat === 'gh-hash' ? 'active' : ''}`}
            onClick={() => setAdaptiveFormat('gh-hash')}
          >
            GitHub Native #gh-dark-mode-only (Recommended)
          </button>
          <button
            type="button"
            className={`studio-style-btn ${adaptiveFormat === 'picture' ? 'active' : ''}`}
            onClick={() => setAdaptiveFormat('picture')}
          >
            HTML5 &lt;picture&gt; (External Sites)
          </button>
        </div>
        {adaptiveFormat === 'gh-hash' && (
          <p style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            ✓ Uses GitHub's official <code>#gh-dark-mode-only</code> and <code>#gh-light-mode-only</code> URL fragments.
          </p>
        )}
      </div>

      <div className="studio-section">
        <label className="studio-section-label">Alignment & Width</label>
        <div className="studio-segmented-styles">
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              type="button"
              className={`studio-style-btn capitalize ${imageAlign === align ? 'active' : ''}`}
              onClick={() => setImageAlign(align)}
            >
              {align}
            </button>
          ))}
        </div>

        <div className="studio-segmented-styles" style={{ marginTop: '6px' }}>
          {['400', '600', '800', '100%'].map((w) => (
            <button
              key={w}
              type="button"
              className={`studio-style-btn ${imageWidth === w ? 'active' : ''}`}
              onClick={() => setImageWidth(w)}
            >
              {w === '100%' ? '100% Width' : `${w}px`}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
