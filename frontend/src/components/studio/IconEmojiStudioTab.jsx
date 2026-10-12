import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useStudioSplit } from '../../utils/useResizableSplit'
import {
  EMOJI_CATEGORIES,
  HEADING_PRESETS,
  EMOJI_ITEMS,
  MATERIAL_ICONS
} from '../../data/iconsAndEmojisData'

const VECTOR_COLOR_SWATCHES = [
  { label: 'White', color: '#ffffff' },
  { label: 'Sky Blue', color: '#38bdf8' },
  { label: 'GitHub Blue', color: '#58a6ff' },
  { label: 'Emerald', color: '#10b981' },
  { label: 'Amber', color: '#f59e0b' },
  { label: 'Coral', color: '#f87171' },
  { label: 'Purple', color: '#a855f7' },
  { label: 'Pink', color: '#ec4899' },
  { label: 'Slate', color: '#94a3b8' }
]

// Convert Google ligature name to Iconify kebab-case name
// e.g. 'bug_report' -> 'bug-report', 'rocket_launch' -> 'rocket-launch', 'check_circle' -> 'check-circle', 'inventory_2' -> 'inventory-2'
function toIconifyName(iconName) {
  if (!iconName) return ''
  return iconName.replace(/_/g, '-')
}

export default function IconEmojiStudioTab({
  onInsertEmoji = () => {},
  onBackToReadme = () => {}
}) {
  const { formWidth, isDragging, handleMouseDown, handleDoubleClick } = useStudioSplit(520)

  // Top-Level Studio Mode: 'vector' (Material Symbols) vs 'emoji' (Developer Emojis)
  const [studioMode, setStudioMode] = useState('vector')

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('all')

  // Color Customization for Vector Icons
  const [vectorColor, setVectorColor] = useState('#38bdf8')
  const [tintCatalogGrid, setTintCatalogGrid] = useState(true)

  // Selected Item (Default to Bug Report in vector mode)
  const [selectedItem, setSelectedItem] = useState(MATERIAL_ICONS[5] || MATERIAL_ICONS[0])

  // Heading Decorator State
  const [headingLevel, setHeadingLevel] = useState('##') // '#', '##', '###', '####'
  const [headingTitle, setHeadingTitle] = useState('Bug Reports & Proposals')
  const [headingPosition, setHeadingPosition] = useState('prefix') // 'prefix' | 'suffix'
  const [includeBoilerplate, setIncludeBoilerplate] = useState(false)

  // Icon Format: 'vector-cdn' | 'local-svg' (for vector mode) | 'emoji' (for emoji mode)
  const [iconFormat, setIconFormat] = useState('vector-cdn')
  const [svgSize, setSvgSize] = useState(20)

  // Image loading fallback state for live preview
  const [previewImgError, setPreviewImgError] = useState(false)

  // Feedback Notification
  const [copyFeedback, setCopyFeedback] = useState('')

  // Safe Hex computation for URL encoding & inline style
  const safeHexColor = useMemo(() => {
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(vectorColor)) {
      return vectorColor
    }
    return '#38bdf8'
  }, [vectorColor])

  // Reset image preview error when selection or color changes
  useEffect(() => {
    setPreviewImgError(false)
  }, [selectedItem, safeHexColor])

  // Copy helper
  const handleCopy = useCallback((text, label = 'Copied') => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(label)
      setTimeout(() => setCopyFeedback(''), 1800)
    })
  }, [])

  // Switch between Vector Icons and Developer Emojis
  const handleSwitchMode = (mode) => {
    setStudioMode(mode)
    setSearchQuery('')
    if (mode === 'vector') {
      setIconFormat('vector-cdn')
      if (!selectedItem?.icon) {
        setSelectedItem(MATERIAL_ICONS[5] || MATERIAL_ICONS[0])
        setHeadingTitle('Bug Reports & Proposals')
      }
    } else {
      setIconFormat('emoji')
      if (selectedItem?.icon) {
        setSelectedItem(EMOJI_ITEMS[0])
        setHeadingTitle('Contributing')
      }
    }
  }

  // Download SVG Helper (with custom color baked in and sanitized iconify name)
  const handleDownloadSvg = useCallback(async (item) => {
    const iconName = item?.icon || 'icon'
    const iconifyId = toIconifyName(iconName)
    const hex = safeHexColor
    try {
      const url = `https://api.iconify.design/material-symbols:${iconifyId}.svg?color=${encodeURIComponent(hex)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('CDN download failed')
      const svgText = await res.text()
      const blob = new Blob([svgText], { type: 'image/svg+xml' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${iconifyId}-${hex.replace('#', '')}.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
      setCopyFeedback(`Downloaded ${iconifyId}.svg!`)
      setTimeout(() => setCopyFeedback(''), 1800)
    } catch {
      // Offline fallback: create valid SVG with the specified color
      const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="${hex}" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>`
      const blob = new Blob([fallbackSvg], { type: 'image/svg+xml' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${iconifyId}.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
      setCopyFeedback(`Downloaded ${iconifyId}.svg!`)
      setTimeout(() => setCopyFeedback(''), 1800)
    }
  }, [safeHexColor])

  // Filter Catalog Items according to active mode and category
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    let items = []
    if (studioMode === 'vector') {
      items = MATERIAL_ICONS
    } else {
      if (activeEmojiCategory === 'all') {
        items = EMOJI_ITEMS
      } else {
        items = EMOJI_ITEMS.filter((item) => item.category === activeEmojiCategory)
      }
    }

    if (!q) return items

    return items.filter((item) => {
      const matchName = item.name.toLowerCase().includes(q)
      const matchShortcode = (item.shortcode || '').toLowerCase().includes(q)
      const matchKeywords = (item.keywords || '').toLowerCase().includes(q)
      const matchChar = item.char === q
      const matchIcon = (item.icon || '').toLowerCase().includes(q)
      const matchIconify = toIconifyName(item.icon || '').toLowerCase().includes(q)
      return matchName || matchShortcode || matchKeywords || matchChar || matchIcon || matchIconify
    })
  }, [studioMode, activeEmojiCategory, searchQuery])

  // Compute Icon Markdown Tag according to active mode & format
  const activeIconMarkdown = useMemo(() => {
    if (!selectedItem) return '✨'

    // Emoji Mode
    if (studioMode === 'emoji' || iconFormat === 'emoji' || !selectedItem.icon) {
      return selectedItem.char || '✨'
    }

    // Vector Mode with sanitized kebab-case for Iconify
    const iconifyId = toIconifyName(selectedItem.icon)
    const colorParam = `?color=${encodeURIComponent(safeHexColor)}`

    if (iconFormat === 'local-svg') {
      return `<img src="./assets/icons/${iconifyId}.svg" width="${svgSize}" align="center" alt="${selectedItem.name}" />`
    }

    // Default: 'vector-cdn'
    return `<img src="https://api.iconify.design/material-symbols:${iconifyId}.svg${colorParam}" width="${svgSize}" align="center" alt="${selectedItem.name}" />`
  }, [selectedItem, studioMode, iconFormat, svgSize, safeHexColor])

  // Computed Markdown Heading
  const generatedHeadingSnippet = useMemo(() => {
    const iconSnippet = activeIconMarkdown
    const title = headingTitle.trim() || 'Section Title'
    const headingText = headingPosition === 'prefix'
      ? `${iconSnippet} ${title}`
      : `${title} ${iconSnippet}`

    let fullSnippet = `${headingLevel} ${headingText}`

    if (includeBoilerplate) {
      const lower = title.toLowerCase()
      if (lower.includes('contribut')) {
        fullSnippet += `\n\nWe love contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.\n\n1. Fork the Project\n2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)\n3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)\n4. Push to the Branch (\`git push origin feature/AmazingFeature\`)\n5. Open a Pull Request`
      } else if (lower.includes('conduct')) {
        fullSnippet += `\n\nThis project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.`
      } else if (lower.includes('bug') || lower.includes('issue') || lower.includes('proposal')) {
        fullSnippet += `\n\nIf you discover an issue or defect, please report it via [GitHub Issues](https://github.com/issues). Be sure to include steps to reproduce, environment details, and relevant console logs.`
      } else if (lower.includes('install')) {
        fullSnippet += `\n\nInstall the latest stable release using your preferred package manager:\n\n\`\`\`bash\nnpm install my-project\n\`\`\``
      } else if (lower.includes('license')) {
        fullSnippet += `\n\nDistributed under the **MIT License**. See \`LICENSE\` for more information.`
      } else if (lower.includes('security')) {
        fullSnippet += `\n\nPlease report any security issues privately via email to security@example.com instead of opening a public issue.`
      } else if (lower.includes('quickstart') || lower.includes('start')) {
        fullSnippet += `\n\nGet up and running in just a few minutes:\n\n\`\`\`bash\ngit clone https://github.com/owner/project.git\ncd project\nnpm install\nnpm run dev\n\`\`\``
      } else {
        fullSnippet += `\n\nDetailed documentation and instructions for this section.`
      }
    }

    return fullSnippet
  }, [activeIconMarkdown, headingLevel, headingTitle, headingPosition, includeBoilerplate])

  // Select Preset Handler
  const handleSelectPreset = (preset) => {
    setHeadingTitle(preset.title)
    if (studioMode === 'vector') {
      const match = MATERIAL_ICONS.find((m) => m.icon === preset.icon) ||
        MATERIAL_ICONS.find((m) => m.name.toLowerCase() === preset.title.toLowerCase()) ||
        MATERIAL_ICONS[0]
      setSelectedItem(match)
      setIconFormat('vector-cdn')
    } else {
      const match = EMOJI_ITEMS.find((e) => e.char === preset.emoji) ||
        EMOJI_ITEMS.find((e) => e.shortcode === preset.shortcode) ||
        EMOJI_ITEMS[0]
      setSelectedItem(match)
      setIconFormat('emoji')
    }
  }

  // Card Selection Handler
  const handleSelectCard = (item) => {
    setSelectedItem(item)
    if (item.icon) {
      setIconFormat('vector-cdn')
    } else {
      setIconFormat('emoji')
    }
  }

  // Insert Actions
  const handleInsertHeading = () => {
    onInsertEmoji(generatedHeadingSnippet)
  }

  const handleInsertRaw = (snippet) => {
    onInsertEmoji(snippet)
  }

  // Hex input change handler
  const handleHexInputChange = (e) => {
    let val = e.target.value.trim()
    if (val && !val.startsWith('#')) {
      val = '#' + val
    }
    setVectorColor(val)
  }

  const selectedIconifyId = selectedItem?.icon ? toIconifyName(selectedItem.icon) : ''

  return (
    <div className="studio-tab-view select-none">
      {/* Top Header Bar */}
      <div className="studio-top-bar">
        <div className="studio-bar-left">
          <div
            className="studio-badge-halo"
            style={{
              backgroundColor: studioMode === 'vector' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(234, 179, 8, 0.12)',
              borderColor: studioMode === 'vector' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(234, 179, 8, 0.3)'
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                color: studioMode === 'vector' ? '#38bdf8' : '#eab308',
                fontSize: '20px'
              }}
            >
              {studioMode === 'vector' ? 'palette' : 'sentiment_satisfied'}
            </span>
          </div>
          <div>
            <div className="studio-title-row">
              <h2 className="studio-title">Icons & Emoji Studio</h2>
              <span className="studio-tag">
                {studioMode === 'vector' ? 'Vector Material Icons' : 'Developer Emojis'}
              </span>
            </div>
            <p className="studio-subtitle">
              {studioMode === 'vector'
                ? 'Customize color and insert crisp GitHub-compatible vector icons via <img /> or local SVG.'
                : 'Browse and insert standard Unicode emojis and shortcodes for headings and lists.'}
            </p>
          </div>
        </div>

        <div className="studio-bar-actions">
          {onBackToReadme && (
            <button
              type="button"
              className="btn-studio-secondary"
              onClick={onBackToReadme}
              title="Return to active markdown document"
            >
              <span className="material-symbols-outlined icon-xs">arrow_back</span>
              <span>Back to Editor</span>
            </button>
          )}

          <button
            type="button"
            className="btn-studio-secondary"
            onClick={() => handleCopy(generatedHeadingSnippet, 'Heading Copied!')}
            title="Copy decorated heading markdown to clipboard"
          >
            <span className="material-symbols-outlined icon-xs">
              {copyFeedback === 'Heading Copied!' ? 'check' : 'content_copy'}
            </span>
            <span>{copyFeedback === 'Heading Copied!' ? 'Copied!' : 'Copy Heading'}</span>
          </button>

          <button
            type="button"
            className="btn-studio-primary"
            onClick={handleInsertHeading}
            title="Insert decorated heading into active document"
          >
            <span className="material-symbols-outlined icon-xs">add_circle</span>
            <span>Insert Heading</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Nav Bar: Vector Icons vs Developer Emojis */}
      <div className="emoji-studio-nav-bar">
        <button
          type="button"
          className={`emoji-studio-nav-btn ${studioMode === 'vector' ? 'active' : ''}`}
          onClick={() => handleSwitchMode('vector')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
            palette
          </span>
          <span>Vector Icons (Material Symbols)</span>
          <span className="emoji-studio-nav-badge">{MATERIAL_ICONS.length}</span>
        </button>

        <button
          type="button"
          className={`emoji-studio-nav-btn ${studioMode === 'emoji' ? 'active' : ''}`}
          onClick={() => handleSwitchMode('emoji')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
            sentiment_satisfied
          </span>
          <span>Developer Emojis</span>
          <span className="emoji-studio-nav-badge">{EMOJI_ITEMS.length}</span>
        </button>
      </div>

      {/* Main 2-Column Split Content */}
      <div className="studio-content-grid">
        {/* Left Form & Catalog Column */}
        <div
          className="studio-form-column custom-scrollbar"
          style={{ width: `${formWidth}px`, flexShrink: 0 }}
        >
          {/* Section 1: Interactive Heading Decorator Tool */}
          <div className="studio-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                className="studio-section-label"
                style={{
                  color: studioMode === 'vector' ? 'var(--secondary, #38bdf8)' : '#eab308',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  title
                </span>
                Heading Decorator Tool
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {studioMode === 'vector' ? 'Vector SVG Headings' : 'Emoji Headings'}
              </span>
            </div>

            <div className="emoji-studio-heading-box">
              {/* Presets Chips Rack */}
              <div>
                <span
                  style={{
                    fontSize: '10.5px',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginBottom: '6px'
                  }}
                >
                  Popular Section Presets (1-Click)
                </span>
                <div className="emoji-presets-wrap custom-scrollbar">
                  {HEADING_PRESETS.map((preset) => {
                    const isCurrent = headingTitle === preset.title
                    return (
                      <button
                        key={preset.title}
                        type="button"
                        className={`emoji-preset-pill ${isCurrent ? 'active' : ''}`}
                        onClick={() => handleSelectPreset(preset)}
                        title={`Apply preset: ${preset.title}`}
                      >
                        {studioMode === 'vector' ? (
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontSize: '13px',
                              color: isCurrent ? safeHexColor : 'var(--text-secondary)'
                            }}
                          >
                            {preset.icon || 'star'}
                          </span>
                        ) : (
                          <span>{preset.emoji}</span>
                        )}
                        <span>{preset.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Title & Level Config Row */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ width: '90px' }}>
                  <span className="studio-field-label">Level</span>
                  <select
                    className="studio-text-input"
                    value={headingLevel}
                    onChange={(e) => setHeadingLevel(e.target.value)}
                    style={{ height: '32px' }}
                  >
                    <option value="#">H1 (#)</option>
                    <option value="##">H2 (##)</option>
                    <option value="###">H3 (###)</option>
                    <option value="####">H4 (####)</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <span className="studio-field-label">Heading Title</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={headingTitle}
                    onChange={(e) => setHeadingTitle(e.target.value)}
                    placeholder="Section title..."
                    style={{ height: '32px', fontWeight: 600 }}
                  />
                </div>

                <div style={{ width: '64px', textAlign: 'center' }}>
                  <span className="studio-field-label">Active Icon</span>
                  <div
                    style={{
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--surface-base)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '18px'
                    }}
                    title={selectedItem?.name}
                  >
                    {studioMode === 'vector' && selectedItem?.icon ? (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '20px', color: safeHexColor }}
                      >
                        {selectedItem.icon}
                      </span>
                    ) : (
                      <span>{selectedItem?.char || '✨'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Vector Format Controls (Only in Vector Mode) */}
              {studioMode === 'vector' ? (
                <div className="emoji-format-controls">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Format:
                    </span>
                    <div className="studio-segmented-styles">
                      <button
                        type="button"
                        className={`studio-style-btn ${iconFormat === 'vector-cdn' ? 'active' : ''}`}
                        onClick={() => setIconFormat('vector-cdn')}
                        title="Generates a vector SVG image tag via Iconify CDN (renders color on GitHub)"
                      >
                        🖼️ Vector SVG (&lt;img&gt;)
                      </button>
                      <button
                        type="button"
                        className={`studio-style-btn ${iconFormat === 'local-svg' ? 'active' : ''}`}
                        onClick={() => setIconFormat('local-svg')}
                        title="Generates local file path: ./assets/icons/icon.svg"
                      >
                        📁 Local SVG
                      </button>
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Size:</span>
                    {[16, 20, 24, 32].map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`studio-style-btn ${svgSize === size ? 'active' : ''}`}
                        onClick={() => setSvgSize(size)}
                        style={{ padding: '2px 6px', fontSize: '10px' }}
                      >
                        {size}px
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Position & Boilerplate Toggles Row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '2px'
                }}
              >
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className={`btn-studio-secondary ${headingPosition === 'prefix' ? 'active' : ''}`}
                    onClick={() => setHeadingPosition('prefix')}
                    style={{
                      height: '24px',
                      fontSize: '11px',
                      borderColor: headingPosition === 'prefix' ? 'var(--primary)' : undefined,
                      backgroundColor: headingPosition === 'prefix' ? 'var(--surface-high)' : undefined
                    }}
                  >
                    Prefix: Icon Title
                  </button>
                  <button
                    type="button"
                    className={`btn-studio-secondary ${headingPosition === 'suffix' ? 'active' : ''}`}
                    onClick={() => setHeadingPosition('suffix')}
                    style={{
                      height: '24px',
                      fontSize: '11px',
                      borderColor: headingPosition === 'suffix' ? 'var(--primary)' : undefined,
                      backgroundColor: headingPosition === 'suffix' ? 'var(--surface-high)' : undefined
                    }}
                  >
                    Suffix: Title Icon
                  </button>
                </div>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11.5px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={includeBoilerplate}
                    onChange={(e) => setIncludeBoilerplate(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Include starter template</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Vector Color Modification Toolbar (Exclusive to Vector Mode) */}
          {studioMode === 'vector' && (
            <div className="studio-section" style={{ marginTop: '14px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}
              >
                <span
                  className="studio-section-label"
                  style={{
                    color: 'var(--secondary, #38bdf8)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                    colorize
                  </span>
                  Icon Color Modification
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: safeHexColor,
                    fontWeight: 600
                  }}
                >
                  {safeHexColor}
                </span>
              </div>

              <div className="vector-color-toolbar">
                {/* Preset Color Swatches */}
                <div className="vector-color-swatches">
                  {VECTOR_COLOR_SWATCHES.map((swatch) => {
                    const isSelected = safeHexColor.toLowerCase() === swatch.color.toLowerCase()
                    return (
                      <button
                        key={swatch.color}
                        type="button"
                        className={`vector-color-chip ${isSelected ? 'active' : ''}`}
                        onClick={() => setVectorColor(swatch.color)}
                        title={`Select color: ${swatch.label} (${swatch.color})`}
                      >
                        <span
                          className="vector-color-dot"
                          style={{
                            backgroundColor: swatch.color,
                            border: swatch.color === '#ffffff' ? '1px solid #555' : 'none'
                          }}
                        />
                        <span>{swatch.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Custom Color Input & Native Picker */}
                <div className="vector-color-custom-input">
                  <input
                    type="color"
                    className="vector-color-native-picker"
                    value={safeHexColor}
                    onChange={(e) => setVectorColor(e.target.value)}
                    title="Open native color picker wheel"
                  />
                  <input
                    type="text"
                    className="studio-text-input"
                    value={vectorColor}
                    onChange={handleHexInputChange}
                    placeholder="#38bdf8"
                    style={{
                      width: '74px',
                      height: '24px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      textAlign: 'center',
                      padding: '2px 4px'
                    }}
                    title="Enter custom HEX code"
                  />
                </div>

                {/* Catalog Tint Toggle */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    width: '100%',
                    paddingTop: '4px',
                    borderTop: '1px solid var(--border-color)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={tintCatalogGrid}
                    onChange={(e) => setTintCatalogGrid(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Tint catalog icons with selected color</span>
                </label>
              </div>
            </div>
          )}

          {/* Section 3: Search & Category Navigation */}
          <div className="studio-section" style={{ marginTop: studioMode === 'vector' ? '10px' : '14px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}
            >
              <span className="studio-section-label">
                {studioMode === 'vector' ? 'Material Icons Catalog' : 'Developer Emojis Catalog'}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {filteredItems.length} available
              </span>
            </div>

            {/* Search Input Bar */}
            <div style={{ position: 'relative', marginBottom: studioMode === 'emoji' ? '10px' : '6px' }}>
              <span
                className="material-symbols-outlined"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '16px',
                  color: 'var(--text-muted)'
                }}
              >
                search
              </span>
              <input
                type="text"
                className="studio-text-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  studioMode === 'vector'
                    ? 'Search 40+ icons (e.g. bug, settings, cloud, bolt, terminal)...'
                    : 'Search developer emojis (e.g. :bug:, handshake, rocket)...'
                }
                style={{
                  paddingLeft: '32px',
                  paddingRight: searchQuery ? '30px' : '10px',
                  height: '34px'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Emoji Category Filter Pills (Only in Emoji Mode) */}
            {studioMode === 'emoji' && (
              <div className="studio-chips-rack custom-scrollbar" style={{ paddingBottom: '6px' }}>
                {EMOJI_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`studio-chip-btn ${activeEmojiCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveEmojiCategory(cat.id)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                      {cat.icon}
                    </span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Interactive Grid Catalog */}
          <div className="studio-section" style={{ marginTop: '4px' }}>
            <div className="emoji-catalog-grid custom-scrollbar">
              {filteredItems.map((item) => {
                const isSelected =
                  selectedItem &&
                  ((item.id && item.id === selectedItem.id) ||
                    (item.char && item.char === selectedItem.char))

                return (
                  <div
                    key={item.id}
                    className={`emoji-item-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectCard(item)}
                    title={`${item.name} (${item.char || item.icon}) • Click to select`}
                  >
                    {item.icon ? (
                      <span
                        className="material-symbols-outlined emoji-glyph-large"
                        style={{
                          color: tintCatalogGrid ? safeHexColor : 'var(--text-primary)'
                        }}
                      >
                        {item.icon}
                      </span>
                    ) : (
                      <span className="emoji-glyph-large">{item.char}</span>
                    )}

                    <span className="emoji-card-name truncate" title={item.name}>
                      {item.name}
                    </span>

                    <span className="emoji-card-code truncate">
                      {item.icon ? toIconifyName(item.icon) : item.shortcode}
                    </span>
                  </div>
                )
              })}

              {filteredItems.length === 0 && (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    padding: '32px 16px',
                    textAlign: 'center',
                    color: 'var(--text-muted)'
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '36px', opacity: 0.5, display: 'block', marginBottom: '8px' }}
                  >
                    search_off
                  </span>
                  <p style={{ margin: 0, fontSize: '13px' }}>
                    No {studioMode === 'vector' ? 'vector icons' : 'emojis'} match "{searchQuery}"
                  </p>
                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={() => setSearchQuery('')}
                    style={{ marginTop: '12px' }}
                  >
                    Reset Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resizer Splitter Handle */}
        <div
          className={`studio-resizer-handle ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title="Drag to resize form and preview sections • Double-click to reset"
        />

        {/* Right Preview & Inspector Column */}
        <div className="studio-preview-column custom-scrollbar" style={{ flex: 1, minWidth: 0 }}>
          {/* Item Inspector Card */}
          <div className="studio-card">
            <div className="studio-card-header">
              <span className="studio-card-title">Selected Element Inspector</span>
              <span className="studio-card-tag">
                {studioMode === 'vector' ? 'MATERIAL VECTOR' : 'DEVELOPER EMOJI'}
              </span>
            </div>

            <div className="emoji-inspector-showcase">
              <div className="emoji-showcase-avatar">
                {selectedItem?.icon ? (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '34px', color: safeHexColor }}
                  >
                    {selectedItem.icon}
                  </span>
                ) : (
                  <span>{selectedItem?.char}</span>
                )}
              </div>

              <div className="emoji-showcase-details">
                <span className="emoji-showcase-title">{selectedItem?.name}</span>
                <span className="emoji-showcase-shortcode">
                  {selectedItem?.icon
                    ? `Material Icon: ${selectedItem.icon}`
                    : `Shortcode: ${selectedItem?.shortcode}`}
                </span>
                <span className="emoji-showcase-meta">
                  {studioMode === 'vector'
                    ? `Color: ${safeHexColor} • Size: ${svgSize}px • Mode: ${iconFormat === 'vector-cdn' ? 'CDN SVG' : 'Local SVG'}`
                    : `Type: Universal UTF-8 Emoji`}
                </span>
                {selectedItem?.keywords && (
                  <span className="emoji-showcase-meta truncate" title={selectedItem.keywords}>
                    Keywords: {selectedItem.keywords.split(' ').slice(0, 6).join(', ')}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="emoji-action-buttons-grid" style={{ marginTop: '10px' }}>
              {/* Vector Mode Specific Actions */}
              {selectedItem?.icon && (
                <>
                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={() => handleInsertRaw(activeIconMarkdown)}
                    title="Insert crisp Vector SVG <img /> markdown tag"
                  >
                    <span className="material-symbols-outlined icon-xs">image</span>
                    <span>Insert Vector SVG (&lt;img&gt;)</span>
                  </button>

                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={() => handleDownloadSvg(selectedItem)}
                    title={`Download ${selectedIconifyId}.svg with ${safeHexColor} color baked in`}
                  >
                    <span className="material-symbols-outlined icon-xs">download</span>
                    <span>Download {selectedIconifyId}.svg</span>
                  </button>

                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={() => handleCopy(activeIconMarkdown, 'Tag Copied!')}
                    title="Copy vector <img /> markdown tag"
                  >
                    <span className="material-symbols-outlined icon-xs">
                      {copyFeedback === 'Tag Copied!' ? 'check' : 'content_copy'}
                    </span>
                    <span>Copy &lt;img&gt; Tag</span>
                  </button>

                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={() =>
                      handleCopy(
                        `<span class="material-symbols-outlined">${selectedItem.icon}</span>`,
                        'HTML Copied!'
                      )
                    }
                    title="Copy HTML Material Symbol tag"
                  >
                    <span className="material-symbols-outlined icon-xs">html</span>
                    <span>Copy HTML Tag</span>
                  </button>
                </>
              )}

              {/* Emoji Mode Specific Actions */}
              {selectedItem?.char && !selectedItem?.icon && (
                <>
                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={() => handleInsertRaw(selectedItem.char)}
                    title={`Insert universal emoji (${selectedItem.char})`}
                  >
                    <span className="material-symbols-outlined icon-xs">add</span>
                    <span>Insert Emoji ({selectedItem.char})</span>
                  </button>

                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={() => handleCopy(selectedItem.char, 'Character Copied!')}
                    title="Copy character to clipboard"
                  >
                    <span className="material-symbols-outlined icon-xs">
                      {copyFeedback === 'Character Copied!' ? 'check' : 'content_copy'}
                    </span>
                    <span>Copy Character</span>
                  </button>

                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={() => handleCopy(selectedItem.shortcode, 'Shortcode Copied!')}
                    title="Copy markdown shortcode"
                  >
                    <span className="material-symbols-outlined icon-xs">
                      {copyFeedback === 'Shortcode Copied!' ? 'check' : 'content_copy'}
                    </span>
                    <span>Copy Shortcode</span>
                  </button>
                </>
              )}

              {/* Shared Insert as Heading */}
              <button
                type="button"
                className="btn-studio-secondary"
                onClick={handleInsertHeading}
                title="Insert formatted heading with this icon"
              >
                <span className="material-symbols-outlined icon-xs">title</span>
                <span>Insert as Heading</span>
              </button>

              {/* Shared Insert as Bullet Item */}
              <button
                type="button"
                className="btn-studio-secondary"
                onClick={() =>
                  handleInsertRaw(`- ${activeIconMarkdown} **${selectedItem?.name}**: `)
                }
                title="Insert as a markdown bullet list item"
              >
                <span className="material-symbols-outlined icon-xs">format_list_bulleted</span>
                <span>Insert Bullet Item</span>
              </button>
            </div>
          </div>

          {/* Live Markdown Heading Preview */}
          <div className="studio-card">
            <div className="studio-card-header">
              <span className="studio-card-title">Live Markdown Heading Preview</span>
              <span className="studio-card-tag">
                {studioMode === 'vector' ? 'Vector SVG Render' : 'Emoji Render'}
              </span>
            </div>

            <div className="emoji-preview-markdown-box">
              <div className="emoji-preview-heading-rendered">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {headingPosition === 'prefix' && (
                    studioMode === 'vector' && selectedItem?.icon ? (
                      !previewImgError ? (
                        <img
                          src={`https://api.iconify.design/material-symbols:${selectedIconifyId}.svg?color=${encodeURIComponent(safeHexColor)}`}
                          width={svgSize + 4}
                          height={svgSize + 4}
                          alt={selectedItem.name}
                          onError={() => setPreviewImgError(true)}
                          style={{ verticalAlign: 'middle', display: 'inline-block' }}
                        />
                      ) : (
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: `${svgSize + 4}px`,
                            color: safeHexColor,
                            verticalAlign: 'middle',
                            lineHeight: 1
                          }}
                        >
                          {selectedItem.icon}
                        </span>
                      )
                    ) : (
                      <span style={{ fontSize: '22px' }}>{selectedItem?.char || '✨'}</span>
                    )
                  )}

                  <span
                    style={{
                      fontSize:
                        headingLevel === '#'
                          ? '22px'
                          : headingLevel === '##'
                          ? '18px'
                          : headingLevel === '###'
                          ? '15px'
                          : '13px',
                      fontWeight: 700,
                      color: 'var(--text-primary)'
                    }}
                  >
                    {headingTitle || 'Section Title'}
                  </span>

                  {headingPosition === 'suffix' && (
                    studioMode === 'vector' && selectedItem?.icon ? (
                      !previewImgError ? (
                        <img
                          src={`https://api.iconify.design/material-symbols:${selectedIconifyId}.svg?color=${encodeURIComponent(safeHexColor)}`}
                          width={svgSize + 4}
                          height={svgSize + 4}
                          alt={selectedItem.name}
                          onError={() => setPreviewImgError(true)}
                          style={{ verticalAlign: 'middle', display: 'inline-block' }}
                        />
                      ) : (
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: `${svgSize + 4}px`,
                            color: safeHexColor,
                            verticalAlign: 'middle',
                            lineHeight: 1
                          }}
                        >
                          {selectedItem.icon}
                        </span>
                      )
                    ) : (
                      <span style={{ fontSize: '22px' }}>{selectedItem?.char || '✨'}</span>
                    )
                  )}
                </div>
              </div>

              {includeBoilerplate && (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <p style={{ margin: 0 }}>
                    Sample starter documentation template is enabled and ready to be inserted.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Generated Code Block */}
          <div className="studio-card">
            <div className="studio-card-header">
              <span className="studio-card-title">Generated Markdown Code</span>
              <button
                type="button"
                className="snippet-copy-btn"
                onClick={() => handleCopy(generatedHeadingSnippet, 'Markdown Copied!')}
              >
                <span className="material-symbols-outlined icon-xs">
                  {copyFeedback === 'Markdown Copied!' ? 'check' : 'content_copy'}
                </span>
                <span>{copyFeedback === 'Markdown Copied!' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="studio-code-block custom-scrollbar" style={{ maxHeight: '160px' }}>
              <code>{generatedHeadingSnippet}</code>
            </pre>
          </div>

          {/* Platform Capability Note */}
          <div className="emoji-autocomplete-banner">
            <span
              className="material-symbols-outlined"
              style={{ color: 'var(--secondary, #38bdf8)', fontSize: '18px' }}
            >
              verified
            </span>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>
                {studioMode === 'vector' ? 'GitHub Vector Compatible:' : 'Universal UTF-8 Support:'}
              </strong>{' '}
              {studioMode === 'vector' ? (
                <>
                  Using{' '}
                  <code
                    style={{
                      color: 'var(--secondary)',
                      background: 'var(--surface-base)',
                      padding: '1px 5px',
                      borderRadius: '3px'
                    }}
                  >
                    &lt;img /&gt;
                  </code>{' '}
                  with color tags renders crisp vector icons on GitHub, GitLab, and web previews in your chosen theme color.
                </>
              ) : (
                'Standard emojis render universally on all operating systems, markdown viewports, and terminals.'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
