import React from 'react'
import {
  BADGE_FORMATS,
  BADGE_STYLES,
  COLOR_THEMES,
  COLOR_SWATCHES
} from '../../../data/badgeStudioData'

export default function SingleBadgeForm({
  formatType,
  setFormatType,
  plateTitle,
  setPlateTitle,
  label,
  setLabel,
  message,
  setMessage,
  style,
  setStyle,
  twoTone,
  setTwoTone,
  color,
  setColor,
  labelColor,
  setLabelColor,
  handleApplyTheme,
  logo,
  setLogo,
  logoColor,
  setLogoColor,
  iconSearch,
  setIconSearch,
  iconCategory,
  setIconCategory,
  filteredIcons,
  handleSelectIcon,
  linkUrl,
  setLinkUrl,
  repoUrl,
  handleAddCurrentToRack
}) {
  return (
    <>
      {/* Badge Format Selector */}
      <div className="studio-section">
        <label className="studio-section-label">Badge Format & Architecture</label>
        <div className="badge-format-selector">
          {BADGE_FORMATS.map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              className={`badge-format-btn ${formatType === fmt.id ? 'active' : ''}`}
              onClick={() => setFormatType(fmt.id)}
            >
              <span className="material-symbols-outlined badge-format-icon">{fmt.icon}</span>
              <span className="badge-format-title">{fmt.title}</span>
              <span className="badge-format-subtitle">{fmt.subtitle}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content Inputs depending on format */}
      <div className="studio-section">
        <label className="studio-section-label">Badge Content</label>

        {formatType === 'brand-plate' ? (
          <div className="studio-field">
            <span className="studio-field-label">Solid Brand Plate Title</span>
            <input
              type="text"
              className="studio-text-input"
              value={plateTitle}
              onChange={(e) => setPlateTitle(e.target.value)}
              placeholder="e.g. React 19, Python 3.12, Docker Compose"
            />
          </div>
        ) : formatType === 'icon-only' ? (
          <div style={{ padding: '8px 10px', background: 'var(--surface-base)', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-secondary)' }}>
            Minimalist logo tile with centered icon and zero text. Select your icon and background color below.
          </div>
        ) : (
          <div className="studio-input-duo">
            <div className="studio-field">
              <span className="studio-field-label">Left Label</span>
              <input
                type="text"
                className="studio-text-input"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. version, license, code"
              />
            </div>
            <div className="studio-field">
              <span className="studio-field-label">Right Message</span>
              <input
                type="text"
                className="studio-text-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. 1.0.0, MIT, passing"
              />
            </div>
          </div>
        )}
      </div>

      {/* Badge Geometry Style Selector (for Shields.io) */}
      {formatType !== 'badgen' && (
        <div className="studio-section">
          <label className="studio-section-label">Geometry Style ({BADGE_STYLES.length} Styles)</label>
          <div className="badge-styles-card-grid">
            {BADGE_STYLES.map((st) => (
              <button
                key={st.id}
                type="button"
                className={`badge-style-card ${style === st.id ? 'active' : ''}`}
                onClick={() => setStyle(st.id)}
              >
                <div className="badge-style-card-header">
                  <span className="badge-style-card-title">{st.label}</span>
                  <span className="badge-style-card-tag">{st.tag}</span>
                </div>
                <span className="badge-style-card-desc">{st.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dual-Tone Curated Theme Palettes */}
      <div className="studio-section">
        <div className="badge-toggle-row">
          <label className="studio-section-label" style={{ margin: 0 }}>
            Curated Color Themes
          </label>
          {formatType === 'split' && (
            <label className="badge-toggle-switch">
              <input
                type="checkbox"
                checked={twoTone}
                onChange={(e) => setTwoTone(e.target.checked)}
              />
              <span>Two-Tone Duotone Mode</span>
            </label>
          )}
        </div>
        <div className="badge-theme-grid">
          {COLOR_THEMES.map((th) => (
            <button
              key={th.id}
              type="button"
              className={`badge-theme-card ${color.toLowerCase() === th.color.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleApplyTheme(th)}
            >
              <div className="badge-theme-duo-swatch">
                <div
                  className="badge-theme-duo-left"
                  style={{ backgroundColor: `#${th.labelColor}` }}
                />
                <div
                  className="badge-theme-duo-right"
                  style={{ backgroundColor: `#${th.color}` }}
                />
              </div>
              <div className="badge-theme-info">
                <span className="badge-theme-name">{th.name}</span>
                <span className="badge-theme-hexes">#{th.color}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Categorized Swatches Matrix */}
      <div className="studio-section">
        <label className="studio-section-label">Color Swatches Palette</label>
        <div className="studio-swatches-grid">
          {COLOR_SWATCHES.map((swatch, idx) => (
            <button
              key={idx}
              type="button"
              className={`color-swatch-circle ${color.toLowerCase() === swatch.hex.toLowerCase() ? 'active' : ''}`}
              style={{ backgroundColor: `#${swatch.hex}` }}
              onClick={() => setColor(swatch.hex)}
              title={`${swatch.name} (#${swatch.hex})`}
            />
          ))}
        </div>

        <div className="studio-input-duo" style={{ marginTop: '6px' }}>
          <div className="studio-field">
            <span className="studio-field-label">Background HEX</span>
            <div className="studio-hex-row" style={{ marginTop: 0 }}>
              <span className="hex-prefix">#</span>
              <input
                type="text"
                className="studio-hex-input"
                value={color}
                onChange={(e) => setColor(e.target.value.replace('#', ''))}
                placeholder="61dafb"
                maxLength={6}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          {twoTone && formatType === 'split' && (
            <div className="studio-field">
              <span className="studio-field-label">Left Label HEX</span>
              <div className="studio-hex-row" style={{ marginTop: 0 }}>
                <span className="hex-prefix">#</span>
                <input
                  type="text"
                  className="studio-hex-input"
                  value={labelColor}
                  onChange={(e) => setLabelColor(e.target.value.replace('#', ''))}
                  placeholder="18181b"
                  maxLength={6}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Brand Logo & SimpleIcons Directory */}
      <div className="studio-section">
        <div className="studio-section-header">
          <label className="studio-section-label">Brand Icon (SimpleIcons)</label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              className={`btn-rack-mini ${logoColor === 'white' ? 'active' : ''}`}
              onClick={() => setLogoColor('white')}
              title="White icon tint"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>contrast</span>
            </button>
            <button
              type="button"
              className={`btn-rack-mini ${logoColor === 'black' ? 'active' : ''}`}
              onClick={() => setLogoColor('black')}
              title="Black icon tint"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>dark_mode</span>
            </button>
            {logo && (
              <button
                type="button"
                className="btn-rack-mini delete"
                onClick={() => setLogo('')}
                title="Remove icon"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
              </button>
            )}
          </div>
        </div>

        <div className="badge-icons-picker-container">
          <div className="badge-icons-filter-bar">
            <input
              type="text"
              className="studio-search-mini"
              placeholder="Search icons (react, python)..."
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
              style={{ flex: 1 }}
            />
            <div className="badge-icons-category-strip">
              {['all', 'languages', 'frameworks', 'databases', 'devops', 'tools', 'social'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`badge-icon-cat-btn ${iconCategory === cat ? 'active' : ''}`}
                  onClick={() => setIconCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="badge-icons-grid custom-scrollbar">
            {filteredIcons.map((ic) => (
              <button
                key={ic.slug}
                type="button"
                className={`badge-icon-tile ${logo === ic.slug ? 'active' : ''}`}
                onClick={() => handleSelectIcon(ic)}
              >
                <div
                  className="badge-icon-color-dot"
                  style={{ backgroundColor: `#${ic.color}` }}
                />
                <span className="badge-icon-name">{ic.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target Link & Rack Action */}
      <div className="studio-section">
        <div className="studio-field">
          <span className="studio-field-label">Target Hyperlink URL</span>
          <input
            type="text"
            className="studio-text-input"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder={repoUrl || 'https://github.com/...'}
          />
        </div>
        <div style={{ marginTop: '8px' }}>
          <button
            type="button"
            className="btn-studio-secondary"
            onClick={handleAddCurrentToRack}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span className="material-symbols-outlined icon-xs">add_box</span>
            <span>Add this Badge to Tech Stack Rack</span>
          </button>
        </div>
      </div>
    </>
  )
}
