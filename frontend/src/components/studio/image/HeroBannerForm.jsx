import React, { useState } from 'react'
import {
  BANNER_STYLES,
  LOCAL_SVG_TYPES,
  COLOR_THEMES,
  CAPSULE_SHAPES,
  CAPSULE_ANIMATIONS,
  TEXT_COLOR_PRESETS
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
  isCustomColor,
  setIsCustomColor,
  customHex1,
  setCustomHex1,
  customHex2,
  setCustomHex2,
  capsuleFontColor,
  setCapsuleFontColor,
  capsuleDescColor,
  setCapsuleDescColor,
  capsuleAnimation,
  setCapsuleAnimation,
  capsuleTitleSize,
  setCapsuleTitleSize,
  capsuleDescSize,
  setCapsuleDescSize,
  capsuleFontAlignY,
  setCapsuleFontAlignY,
  capsuleDescAlignY,
  setCapsuleDescAlignY,
  capsuleStroke,
  setCapsuleStroke,
  hudVersion,
  setHudVersion,
  hudStatus,
  setHudStatus,
  hudMetric1,
  setHudMetric1,
  hudMetric2,
  setHudMetric2,
  hudMetric3,
  setHudMetric3,
  neofetchOs,
  setNeofetchOs,
  neofetchLicense,
  setNeofetchLicense,
  neofetchPrompt,
  setNeofetchPrompt,
  neofetchShell,
  setNeofetchShell,
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
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

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
      {bannerType !== 'typing' && (
        <div className="studio-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label className="studio-section-label" style={{ margin: 0 }}>Color Theme & Gradients</label>
            <div className="studio-segmented-styles" style={{ margin: 0 }}>
              <button
                type="button"
                className={`studio-style-btn ${!isCustomColor ? 'active' : ''}`}
                onClick={() => setIsCustomColor(false)}
                style={{ padding: '2px 8px', fontSize: '10.5px' }}
              >
                Presets ({COLOR_THEMES.length})
              </button>
              <button
                type="button"
                className={`studio-style-btn ${isCustomColor ? 'active' : ''}`}
                onClick={() => setIsCustomColor(true)}
                style={{ padding: '2px 8px', fontSize: '10.5px' }}
              >
                🎨 Custom Hex
              </button>
            </div>
          </div>

          {!isCustomColor ? (
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
          ) : (
            <div className="custom-gradient-panel">
              <div className="custom-gradient-row">
                <div className="studio-field">
                  <span className="studio-field-label">Gradient Start (Color 1)</span>
                  <div className="custom-color-input-group">
                    <input
                      type="color"
                      className="custom-color-picker"
                      value={customHex1.startsWith('#') ? customHex1 : `#${customHex1}`}
                      onChange={(e) => setCustomHex1(e.target.value)}
                    />
                    <input
                      type="text"
                      className="custom-color-hex-input"
                      value={customHex1}
                      onChange={(e) => setCustomHex1(e.target.value)}
                      placeholder="#4f46e5"
                    />
                  </div>
                </div>

                <div className="studio-field">
                  <span className="studio-field-label">Gradient End (Color 2)</span>
                  <div className="custom-color-input-group">
                    <input
                      type="color"
                      className="custom-color-picker"
                      value={customHex2.startsWith('#') ? customHex2 : `#${customHex2}`}
                      onChange={(e) => setCustomHex2(e.target.value)}
                    />
                    <input
                      type="text"
                      className="custom-color-hex-input"
                      value={customHex2}
                      onChange={(e) => setCustomHex2(e.target.value)}
                      placeholder="#db2777"
                    />
                  </div>
                </div>
              </div>

              <div
                className="gradient-preview-strip"
                style={{
                  background: `linear-gradient(90deg, ${customHex1} 0%, ${customHex2} 100%)`
                }}
                title="Live Gradient Blend"
              />
            </div>
          )}
        </div>
      )}


      {/* Title & Subtitle */}
      {bannerType !== 'typing' && (
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
        </div>
      )}

      {/* Specific Options: Stitch Sci-Fi HUD Telemetry */}
      {bannerType === 'hud-telemetry' && (
        <div className="studio-section">
          <label className="studio-section-label">HUD Telemetry Coordinates & Metrics</label>
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

          <div className="studio-input-duo" style={{ marginTop: '6px' }}>
            <div className="studio-field">
              <span className="studio-field-label">Metric 1 (CPU / Frequency)</span>
              <input
                type="text"
                className="studio-text-input"
                value={hudMetric1}
                onChange={(e) => setHudMetric1(e.target.value)}
                placeholder="CPU: 12% // 4.8GHz"
              />
            </div>
            <div className="studio-field">
              <span className="studio-field-label">Metric 2 (Memory / Storage)</span>
              <input
                type="text"
                className="studio-text-input"
                value={hudMetric2}
                onChange={(e) => setHudMetric2(e.target.value)}
                placeholder="MEM: 1.4GB / 32GB"
              />
            </div>
          </div>

          <div className="studio-field" style={{ marginTop: '6px' }}>
            <span className="studio-field-label">Metric 3 (Security Enclave)</span>
            <input
              type="text"
              className="studio-text-input"
              value={hudMetric3}
              onChange={(e) => setHudMetric3(e.target.value)}
              placeholder="STATUS: ENCLAVE_SECURE"
            />
          </div>
        </div>
      )}

      {/* Specific Options: Neofetch Terminal */}
      {bannerType === 'neofetch' && (
        <div className="studio-section">
          <label className="studio-section-label">Neofetch Terminal Configuration</label>
          <div className="studio-input-duo">
            <div className="studio-field">
              <span className="studio-field-label">Shell Prompt</span>
              <input
                type="text"
                className="studio-text-input"
                value={neofetchPrompt}
                onChange={(e) => setNeofetchPrompt(e.target.value)}
                placeholder="user@visualmark:~#"
              />
            </div>
            <div className="studio-field">
              <span className="studio-field-label">Shell & Kernel</span>
              <input
                type="text"
                className="studio-text-input"
                value={neofetchShell}
                onChange={(e) => setNeofetchShell(e.target.value)}
                placeholder="zsh 5.9 (x86_64)"
              />
            </div>
          </div>

          <div className="studio-input-duo" style={{ marginTop: '6px' }}>
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

      {/* Specific Options: Capsule Shape, Height, Typography & Animations */}
      {bannerType === 'capsule' && (
        <div className="studio-section">
          <label className="studio-section-label">Wave Geometry & Frame Height</label>
          <div className="studio-segmented-styles" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
            {CAPSULE_SHAPES.map((shape) => (
              <button
                key={shape.id}
                type="button"
                className={`studio-style-btn ${capsuleShape === shape.id ? 'active' : ''}`}
                onClick={() => setCapsuleShape(shape.id)}
                style={{ padding: '6px 4px', fontSize: '11px', textAlign: 'center' }}
              >
                {shape.label}
              </button>
            ))}
          </div>

          <div className="studio-segmented-styles" style={{ marginTop: '8px' }}>
            {['160', '180', '220', '260', '300'].map((h) => (
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

          {/* Typography Color & Contrast */}
          <div style={{ marginTop: '12px' }}>
            <label className="studio-section-label">Typography Color & Contrast</label>
            <div className="studio-chips-rack" style={{ marginBottom: '6px' }}>
              {TEXT_COLOR_PRESETS.map((tc) => (
                <button
                  key={tc.hex}
                  type="button"
                  className={`studio-chip-btn ${capsuleFontColor.toLowerCase() === tc.hex ? 'active' : ''}`}
                  onClick={() => {
                    setCapsuleFontColor(tc.hex)
                    if (tc.hex === 'ffffff') setCapsuleDescColor('e0e7ff')
                    else setCapsuleDescColor(tc.hex)
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: `#${tc.hex}`,
                      marginRight: '4px',
                      border: '1px solid rgba(255,255,255,0.4)'
                    }}
                  />
                  <span>{tc.label}</span>
                </button>
              ))}
            </div>

            <div className="studio-input-duo">
              <div className="studio-field">
                <span className="studio-field-label">Title Text Hex</span>
                <div className="custom-color-input-group">
                  <input
                    type="color"
                    className="custom-color-picker"
                    value={capsuleFontColor.startsWith('#') ? capsuleFontColor : `#${capsuleFontColor}`}
                    onChange={(e) => setCapsuleFontColor(e.target.value.replace('#', ''))}
                  />
                  <input
                    type="text"
                    className="custom-color-hex-input"
                    value={capsuleFontColor.startsWith('#') ? capsuleFontColor : `#${capsuleFontColor}`}
                    onChange={(e) => setCapsuleFontColor(e.target.value.replace('#', ''))}
                    placeholder="ffffff"
                  />
                </div>
              </div>

              <div className="studio-field">
                <span className="studio-field-label">Subtitle / Tagline Hex</span>
                <div className="custom-color-input-group">
                  <input
                    type="color"
                    className="custom-color-picker"
                    value={capsuleDescColor.startsWith('#') ? capsuleDescColor : `#${capsuleDescColor}`}
                    onChange={(e) => setCapsuleDescColor(e.target.value.replace('#', ''))}
                  />
                  <input
                    type="text"
                    className="custom-color-hex-input"
                    value={capsuleDescColor.startsWith('#') ? capsuleDescColor : `#${capsuleDescColor}`}
                    onChange={(e) => setCapsuleDescColor(e.target.value.replace('#', ''))}
                    placeholder="e0e7ff"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Entrance Animation */}
          <div style={{ marginTop: '10px' }}>
            <span className="studio-field-label">Live Entrance Animation</span>
            <div className="studio-segmented-styles">
              {CAPSULE_ANIMATIONS.map((anim) => (
                <button
                  key={anim.id}
                  type="button"
                  className={`studio-style-btn ${capsuleAnimation === anim.id ? 'active' : ''}`}
                  onClick={() => setCapsuleAnimation(anim.id)}
                >
                  {anim.label}
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Advanced Typography & Offsets Accordion */}
          <div style={{ marginTop: '12px' }}>
            <button
              type="button"
              className="advanced-toggle-btn"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>tune</span>
                <span>Fine-Tuning: Font Sizes & Vertical Alignment</span>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {isAdvancedOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isAdvancedOpen && (
              <div className="advanced-panel">
                <div className="studio-slider-field">
                  <div className="studio-slider-header">
                    <span>Title Font Size</span>
                    <span className="studio-slider-value">{capsuleTitleSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="95"
                    step="2"
                    className="studio-range-input"
                    value={capsuleTitleSize}
                    onChange={(e) => setCapsuleTitleSize(e.target.value)}
                  />
                </div>

                <div className="studio-slider-field">
                  <div className="studio-slider-header">
                    <span>Subtitle Font Size</span>
                    <span className="studio-slider-value">{capsuleDescSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="32"
                    step="1"
                    className="studio-range-input"
                    value={capsuleDescSize}
                    onChange={(e) => setCapsuleDescSize(e.target.value)}
                  />
                </div>

                <div className="studio-slider-field">
                  <div className="studio-slider-header">
                    <span>Title Vertical Position (Y-Offset)</span>
                    <span className="studio-slider-value">{capsuleFontAlignY}%</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="55"
                    step="1"
                    className="studio-range-input"
                    value={capsuleFontAlignY}
                    onChange={(e) => setCapsuleFontAlignY(e.target.value)}
                  />
                </div>

                <div className="studio-slider-field">
                  <div className="studio-slider-header">
                    <span>Subtitle Vertical Position (Y-Offset)</span>
                    <span className="studio-slider-value">{capsuleDescAlignY}%</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="75"
                    step="1"
                    className="studio-range-input"
                    value={capsuleDescAlignY}
                    onChange={(e) => setCapsuleDescAlignY(e.target.value)}
                  />
                </div>

                <div className="studio-slider-field">
                  <div className="studio-slider-header">
                    <span>Title Text Outline Stroke</span>
                    <span className="studio-slider-value">{capsuleStroke}</span>
                  </div>
                  <div className="studio-segmented-styles">
                    {[
                      { id: 'none', label: 'None' },
                      { id: '000000', label: 'Dark Stroke' },
                      { id: 'ffffff', label: 'White Halo' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`studio-style-btn ${capsuleStroke === s.id ? 'active' : ''}`}
                        onClick={() => setCapsuleStroke(s.id)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </>
  )
}
