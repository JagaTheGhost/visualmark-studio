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
  onAddToRack,
  handleAddCurrentToRack
}) {
  const handleAdd = onAddToRack || handleAddCurrentToRack

  return (
    <div className="single-badge-form-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. Badge Format Architecture */}
      <div className="studio-section">
        <label className="studio-section-label">Badge Architecture Format</label>
        <div className="badge-format-selector" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {BADGE_FORMATS.map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              className={`badge-format-btn ${formatType === fmt.id ? 'active' : ''}`}
              onClick={() => setFormatType(fmt.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 4px',
                backgroundColor: formatType === fmt.id ? 'rgba(99, 102, 241, 0.12)' : 'var(--surface-base)',
                border: formatType === fmt.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Miniature visual badge representation */}
              {fmt.id === 'split' && (
                <div style={{ width: '40px', height: '14px', borderRadius: '2px', overflow: 'hidden', display: 'flex', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '40%', backgroundColor: '#27272a' }} />
                  <div style={{ width: '60%', backgroundColor: `#${color.replace('#', '') || '6366f1'}` }} />
                </div>
              )}
              {fmt.id === 'brand-plate' && (
                <div style={{ width: '40px', height: '14px', borderRadius: '2px', backgroundColor: `#${color.replace('#', '') || '6366f1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#ffffff', opacity: 0.9 }} />
                  <div style={{ width: '18px', height: '2px', borderRadius: '1px', backgroundColor: '#ffffff', opacity: 0.8 }} />
                </div>
              )}
              {fmt.id === 'icon-only' && (
                <div style={{ width: '18px', height: '14px', borderRadius: '2px', backgroundColor: `#${color.replace('#', '') || '6366f1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#ffffff', opacity: 0.9 }} />
                </div>
              )}
              {fmt.id === 'badgen' && (
                <div style={{ width: '40px', height: '12px', borderRadius: '6px', overflow: 'hidden', display: 'flex', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '40%', backgroundColor: '#3f3f46' }} />
                  <div style={{ width: '60%', backgroundColor: `#${color.replace('#', '') || '10b981'}` }} />
                </div>
              )}
              <span className="badge-format-title" style={{ fontSize: '10.5px', fontWeight: 600 }}>{fmt.title}</span>
              <span className="badge-format-subtitle" style={{ fontSize: '8.5px', color: 'var(--text-muted)' }}>{fmt.subtitle}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Dynamic Content Inputs depending on format */}
      <div className="studio-section">
        <label className="studio-section-label">Badge Content & Typography</label>

        {formatType === 'brand-plate' ? (
          <div className="studio-field">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span className="studio-field-label" style={{ margin: 0 }}>Solid Brand Plate Title</span>
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                {['React 19', 'TypeScript', 'Python 3.12', 'Docker', 'FastAPI'].map((tok) => (
                  <button
                    key={tok}
                    type="button"
                    onClick={() => setPlateTitle(tok)}
                    style={{
                      background: plateTitle === tok ? 'rgba(99, 102, 241, 0.2)' : 'var(--surface-mid)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '3px',
                      color: plateTitle === tok ? 'var(--secondary)' : 'var(--text-muted)',
                      fontSize: '9px',
                      padding: '1px 5px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    #{tok}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              className="studio-text-input"
              value={plateTitle}
              onChange={(e) => setPlateTitle(e.target.value)}
              placeholder="e.g. React 19, Python 3.12, Docker Ready"
            />
          </div>
        ) : formatType === 'icon-only' ? (
          <div style={{
            padding: '10px 12px',
            background: 'var(--surface-base)',
            borderRadius: 'var(--radius-xs, 6px)',
            border: '1px solid var(--border-color)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}>
            Minimalist micro tile with centered brand icon and zero text. Pick your icon and background color below.
          </div>
        ) : (
          <div className="studio-input-duo">
            <div className="studio-field">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="studio-field-label" style={{ margin: 0 }}>Left Label</span>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {['build', 'version', 'license', 'coverage'].map((tok) => (
                    <button
                      key={tok}
                      type="button"
                      onClick={() => setLabel(tok)}
                      style={{
                        background: label === tok ? 'rgba(99, 102, 241, 0.2)' : 'var(--surface-mid)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '3px',
                        color: label === tok ? 'var(--secondary)' : 'var(--text-muted)',
                        fontSize: '9px',
                        padding: '1px 4px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      #{tok}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                className="studio-text-input"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. version, license, build"
              />
            </div>
            <div className="studio-field">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="studio-field-label" style={{ margin: 0 }}>Right Message</span>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {['passing', 'v1.0.0', 'MIT', 'ready'].map((tok) => (
                    <button
                      key={tok}
                      type="button"
                      onClick={() => setMessage(tok)}
                      style={{
                        background: message === tok ? 'rgba(99, 102, 241, 0.2)' : 'var(--surface-mid)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '3px',
                        color: message === tok ? 'var(--secondary)' : 'var(--text-muted)',
                        fontSize: '9px',
                        padding: '1px 4px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      #{tok}
                    </button>
                  ))}
                </div>
              </div>
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

      {/* 3. Badge Geometry Style Selector (for Shields.io) */}
      {formatType !== 'badgen' && (
        <div className="studio-section">
          <label className="studio-section-label">Badge Geometry & Silhouette</label>
          <div className="badge-styles-card-grid">
            {BADGE_STYLES.map((st) => (
              <button
                key={st.id}
                type="button"
                className={`badge-style-card ${style === st.id ? 'active' : ''}`}
                onClick={() => setStyle(st.id)}
                title={st.desc}
              >
                <span className="badge-style-card-title">{st.label}</span>
                <span className="badge-style-card-tag">{st.tag}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Dual-Tone Curated Theme Palettes */}
      <div className="studio-section">
        <div className="badge-toggle-row">
          <label className="studio-section-label" style={{ margin: 0 }}>
            Curated Color Palettes
          </label>
          {formatType === 'split' && (
            <label className="badge-toggle-switch">
              <input
                type="checkbox"
                checked={twoTone}
                onChange={(e) => setTwoTone(e.target.checked)}
              />
              <span>Two-Tone Duotone</span>
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

      {/* 5. Custom Swatches & Direct Hex Input */}
      <div className="studio-section">
        <label className="studio-section-label">Color Swatches & Hex Codes</label>
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

        <div className="studio-input-duo" style={{ marginTop: '8px' }}>
          <div className="studio-field">
            <span className="studio-field-label">Right / Main Color HEX</span>
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
              <span className="studio-field-label">Left Segment HEX</span>
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

      {/* 6. Brand Logo & SimpleIcons Directory */}
      <div className="studio-section">
        <div className="studio-section-header">
          <label className="studio-section-label">Brand Logo (SimpleIcons)</label>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button
              type="button"
              className={`btn-rack-mini ${logoColor === 'white' ? 'active' : ''}`}
              onClick={() => setLogoColor('white')}
              title="White logo tint"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>contrast</span>
            </button>
            <button
              type="button"
              className={`btn-rack-mini ${logoColor === 'black' ? 'active' : ''}`}
              onClick={() => setLogoColor('black')}
              title="Black logo tint"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>dark_mode</span>
            </button>
            {logo && (
              <button
                type="button"
                className="btn-rack-mini delete"
                onClick={() => setLogo('')}
                title="Remove logo"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
              </button>
            )}
          </div>
        </div>

        {/* Direct Logo Slug Input */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="text"
            className="studio-text-input"
            value={logo}
            onChange={(e) => setLogo(e.target.value.toLowerCase().trim())}
            placeholder="Type any SimpleIcons slug (e.g. react, python, docker)..."
            style={{ flex: 1 }}
          />
        </div>

        <div className="badge-icons-picker-container">
          <div className="badge-icons-filter-bar">
            <input
              type="text"
              className="studio-search-mini"
              placeholder="Search catalog (react, next, postgres)..."
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
                title={`Select ${ic.name}`}
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

      {/* 7. Target Link & Rack Action */}
      <div className="studio-section">
        <div className="studio-field">
          <span className="studio-field-label">Target Hyperlink URL (Optional)</span>
          <input
            type="text"
            className="studio-text-input"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder={repoUrl || 'https://github.com/owner/repo'}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <button
            type="button"
            className="btn-studio-secondary"
            onClick={handleAdd}
            style={{ width: '100%', justifyContent: 'center', height: '32px' }}
          >
            <span className="material-symbols-outlined icon-xs">add_box</span>
            <span>Add this Badge to Tech Stack Rack</span>
          </button>
        </div>
      </div>
    </div>
  )
}
