import React from 'react'
import {
  BANNER_STYLES,
  LOCAL_SVG_TYPES,
  COLOR_THEMES,
  POPULAR_TECH_STACK,
  CAPSULE_SHAPES
} from './imageStudioConstants'

export default function HeroBannerForm({
  bannerType,
  setBannerType,
  bannerSyntaxMode,
  setBannerSyntaxMode,
  bannerTitle,
  setBannerTitle,
  bannerSubtitle,
  setBannerSubtitle,
  bannerTheme,
  setBannerTheme,
  bannerTags,
  setBannerTags,
  handleToggleTechTag,
  hudVersion,
  setHudVersion,
  hudStatus,
  setHudStatus,
  neofetchOs,
  setNeofetchOs,
  neofetchLicense,
  setNeofetchLicense,
  githubRepoOwner,
  setGithubRepoOwner,
  githubRepoName,
  setGithubRepoName,
  githubStatsTheme,
  setGithubStatsTheme,
  typingLines,
  setTypingLines,
  typingFont,
  setTypingFont,
  typingPause,
  setTypingPause,
  typingColor,
  setTypingColor,
  capsuleShape,
  setCapsuleShape,
  bannerHeight,
  setBannerHeight,
  handleDownloadAsset
}) {
  return (
    <>
      {/* Stitch-Inspired Banner Types */}
      <div className="studio-section">
        <label className="studio-section-label">Banner Architecture ({BANNER_STYLES.length} Distinct Styles)</label>
        <div className="banner-type-card-grid">
          {BANNER_STYLES.map((bs) => (
            <button
              key={bs.id}
              type="button"
              className={`banner-type-card ${bannerType === bs.id ? 'active' : ''}`}
              onClick={() => setBannerType(bs.id)}
            >
              <span className="material-symbols-outlined banner-card-icon">{bs.icon}</span>
              <div className="banner-card-info">
                <span className="banner-card-title">{bs.label}</span>
                <span className="banner-card-desc">{bs.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Syntax Format Selector for Local SVG Banners */}
      {LOCAL_SVG_TYPES.includes(bannerType) && (
        <div className="studio-section">
          <label className="studio-section-label">Markdown Insertion Format</label>
          <div className="studio-segmented-styles">
            <button
              type="button"
              className={`studio-style-btn ${bannerSyntaxMode === 'asset-path' ? 'active' : ''}`}
              onClick={() => setBannerSyntaxMode('asset-path')}
              title="Relative file path for GitHub repositories (e.g. assets/hero-banner.svg)"
            >
              📁 Repository Asset (GitHub Recommended)
            </button>
            <button
              type="button"
              className={`studio-style-btn ${bannerSyntaxMode === 'data-uri' ? 'active' : ''}`}
              onClick={() => setBannerSyntaxMode('data-uri')}
              title="Direct self-contained data URI (renders in local viewers, blocked by GitHub)"
            >
              ⚡ Direct Data URI (Local Only)
            </button>
          </div>
          {bannerSyntaxMode === 'asset-path' ? (
            <div style={{ marginTop: '8px', padding: '10px 14px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#38bdf8', marginBottom: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
                <span>GitHub Setup Instructions:</span>
              </div>
              <p style={{ margin: '0 0 6px 0', color: 'var(--text-secondary)' }}>
                GitHub Camo blocks inline SVG data URIs for security. To display this vector graphic on GitHub:
              </p>
              <ol style={{ margin: '0 0 8px 18px', padding: 0, color: 'var(--text-secondary)' }}>
                <li>Click the download button below to save the SVG.</li>
                <li>Commit the file to your repository in an <code>assets/</code> folder.</li>
              </ol>
              <button
                type="button"
                className="btn-studio-secondary"
                onClick={handleDownloadAsset}
                style={{ fontSize: '11px', padding: '4px 10px', height: '28px', background: 'rgba(56, 189, 248, 0.15)', borderColor: '#38bdf8', color: '#e0f2fe' }}
              >
                <span className="material-symbols-outlined icon-xs">download</span>
                <span>Download {(bannerTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'hero')}-{bannerType}.svg</span>
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '8px', padding: '10px 14px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '12px', color: '#f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', marginBottom: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>warning</span>
                <span>GitHub Incompatibility Notice</span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                GitHub Camo image sanitizer <strong>blocks data:image/svg+xml URIs</strong>. If you paste this code into a GitHub repository, it will show as a broken image. Switch to <strong>Repository Asset</strong> or pick <strong>Dynamic GitHub Header</strong> (Capsule) for instant cloud rendering.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Color Palette Theme Selection */}
      {bannerType !== 'typing' && bannerType !== 'github-stats' && (
        <div className="studio-section">
          <label className="studio-section-label">Color Theme Palette</label>
          <div className="theme-swatch-grid">
            {COLOR_THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={`theme-swatch-card ${bannerTheme.id === theme.id ? 'active' : ''}`}
                onClick={() => setBannerTheme(theme)}
                title={theme.name}
              >
                <span className="theme-swatch-circle" style={{ background: theme.bg }} />
                <span className="theme-swatch-name">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Title & Subtitle */}
      {bannerType !== 'typing' && bannerType !== 'github-stats' && (
        <div className="studio-section">
          <label className="studio-section-label">Banner Content</label>
          <div className="studio-field">
            <span className="studio-field-label">Project Title</span>
            <input
              type="text"
              className="studio-text-input"
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
              placeholder="e.g. README Studio"
            />
          </div>

          <div className="studio-field">
            <span className="studio-field-label">Tagline / Mission Statement</span>
            <input
              type="text"
              className="studio-text-input"
              value={bannerSubtitle}
              onChange={(e) => setBannerSubtitle(e.target.value)}
              placeholder="e.g. State-of-the-Art Markdown Documentation Platform"
            />
          </div>

          <div className="studio-field">
            <span className="studio-field-label">Tech Chips (comma separated)</span>
            <input
              type="text"
              className="studio-text-input"
              value={bannerTags}
              onChange={(e) => setBannerTags(e.target.value)}
              placeholder="e.g. FastAPI, React, Vite, Tailwind"
            />
          </div>

          {/* Interactive Tech Stack Quick Rack */}
          <div className="studio-field" style={{ marginTop: '4px' }}>
            <span className="studio-field-label">Popular Tech Presets (Click to add)</span>
            <div className="studio-chips-rack">
              {POPULAR_TECH_STACK.map((tech) => {
                const tagsArr = bannerTags.split(',').map((t) => t.trim().toLowerCase())
                const isSelected = tagsArr.includes(tech.toLowerCase())
                return (
                  <button
                    key={tech}
                    type="button"
                    className={`studio-chip-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleToggleTechTag(tech)}
                  >
                    <span>{isSelected ? '✓ ' : '+ '}</span>
                    <span>{tech}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Specific Options: Stitch Sci-Fi HUD Telemetry */}
      {bannerType === 'hud-telemetry' && (
        <div className="studio-section">
          <label className="studio-section-label">HUD Telemetry Coordinates</label>
          <div className="studio-input-duo">
            <div className="studio-field">
              <span className="studio-field-label">Version Tag</span>
              <input
                type="text"
                className="studio-text-input"
                value={hudVersion}
                onChange={(e) => setHudVersion(e.target.value)}
                placeholder="v2.4.0"
              />
            </div>
            <div className="studio-field">
              <span className="studio-field-label">Status Beacon</span>
              <input
                type="text"
                className="studio-text-input"
                value={hudStatus}
                onChange={(e) => setHudStatus(e.target.value)}
                placeholder="SYSTEM NOMINAL"
              />
            </div>
          </div>
        </div>
      )}

      {/* Specific Options: Neofetch Terminal */}
      {bannerType === 'neofetch' && (
        <div className="studio-section">
          <label className="studio-section-label">Neofetch System Telemetry</label>
          <div className="studio-input-duo">
            <div className="studio-field">
              <span className="studio-field-label">Host OS Specs</span>
              <input
                type="text"
                className="studio-text-input"
                value={neofetchOs}
                onChange={(e) => setNeofetchOs(e.target.value)}
                placeholder="GitHub / Linux x86_64"
              />
            </div>
            <div className="studio-field">
              <span className="studio-field-label">License Type</span>
              <input
                type="text"
                className="studio-text-input"
                value={neofetchLicense}
                onChange={(e) => setNeofetchLicense(e.target.value)}
                placeholder="MIT License"
              />
            </div>
          </div>
        </div>
      )}

      {/* Specific Options: Live GitHub Repo Pin */}
      {bannerType === 'github-stats' && (
        <div className="studio-section">
          <label className="studio-section-label">GitHub Repository Pin Target</label>
          <div className="studio-input-duo">
            <div className="studio-field">
              <span className="studio-field-label">Owner / Username</span>
              <input
                type="text"
                className="studio-text-input"
                value={githubRepoOwner}
                onChange={(e) => setGithubRepoOwner(e.target.value)}
                placeholder="e.g. JagaTheGhost"
              />
            </div>
            <div className="studio-field">
              <span className="studio-field-label">Repository Name</span>
              <input
                type="text"
                className="studio-text-input"
                value={githubRepoName}
                onChange={(e) => setGithubRepoName(e.target.value)}
                placeholder="e.g. auto-readme-generator"
              />
            </div>
          </div>

          <div className="studio-field" style={{ marginTop: '6px' }}>
            <span className="studio-field-label">Stats Theme</span>
            <div className="studio-segmented-styles">
              {['tokyonight', 'radical', 'synthwave', 'dark', 'dracula'].map((th) => (
                <button
                  key={th}
                  type="button"
                  className={`studio-style-btn capitalize ${githubStatsTheme === th ? 'active' : ''}`}
                  onClick={() => setGithubStatsTheme(th)}
                >
                  {th}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Specific Options: Typing SVG Configurator */}
      {bannerType === 'typing' && (
        <div className="studio-section">
          <label className="studio-section-label">Animated Typing Text</label>
          <div className="studio-field">
            <span className="studio-field-label">Typing Lines (Semicolon separated)</span>
            <textarea
              rows={3}
              className="studio-text-area"
              value={typingLines}
              onChange={(e) => setTypingLines(e.target.value)}
              placeholder="Line 1;Line 2;Line 3"
            />
          </div>

          <div className="studio-input-duo">
            <div className="studio-field">
              <span className="studio-field-label">Monospace Font</span>
              <select
                className="studio-select-input"
                value={typingFont}
                onChange={(e) => setTypingFont(e.target.value)}
              >
                <option value="Fira Code">Fira Code</option>
                <option value="Roboto Mono">Roboto Mono</option>
                <option value="Source Code Pro">Source Code Pro</option>
                <option value="Courier New">Courier New</option>
                <option value="monospace">Standard Monospace</option>
              </select>
            </div>

            <div className="studio-field">
              <span className="studio-field-label">Pause Duration (ms)</span>
              <select
                className="studio-select-input"
                value={typingPause}
                onChange={(e) => setTypingPause(e.target.value)}
              >
                <option value="500">Fast (500ms)</option>
                <option value="1000">Normal (1000ms)</option>
                <option value="1500">Relaxed (1500ms)</option>
                <option value="2500">Long (2500ms)</option>
              </select>
            </div>
          </div>

          <div className="studio-field">
            <span className="studio-field-label">Text Accent Hex Color</span>
            <div className="studio-segmented-styles">
              {[
                { label: 'Indigo', hex: '6366F1' },
                { label: 'Cyan', hex: '06B6D4' },
                { label: 'Emerald', hex: '10B981' },
                { label: 'Amber', hex: 'F59E0B' },
                { label: 'Rose', hex: 'F43F5E' },
                { label: 'White', hex: 'FFFFFF' }
              ].map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  className={`studio-style-btn ${typingColor === c.hex ? 'active' : ''}`}
                  onClick={() => setTypingColor(c.hex)}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: `#${c.hex}`,
                      marginRight: '4px'
                    }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Specific Options: Capsule Shape / Height */}
      {bannerType === 'capsule' && (
        <div className="studio-section">
          <label className="studio-section-label">Wave Geometry & Height</label>
          <div className="studio-segmented-styles">
            {CAPSULE_SHAPES.map((shape) => (
              <button
                key={shape.id}
                type="button"
                className={`studio-style-btn ${capsuleShape === shape.id ? 'active' : ''}`}
                onClick={() => setCapsuleShape(shape.id)}
              >
                {shape.label}
              </button>
            ))}
          </div>

          <div className="studio-segmented-styles" style={{ marginTop: '6px' }}>
            {['180', '220', '260'].map((h) => (
              <button
                key={h}
                type="button"
                className={`studio-style-btn ${bannerHeight === h ? 'active' : ''}`}
                onClick={() => setBannerHeight(h)}
              >
                {h}px Height
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
