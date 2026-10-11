import React, { useState, useEffect } from 'react'

export default function SettingsTab({
  themeMode,
  setThemeMode,
  tabSize,
  setTabSize,
  fontSize,
  setFontSize,
  wordWrap,
  setWordWrap,
  showLineNumbers,
  setShowLineNumbers,
  zoomLevel,
  setZoomLevel,
  orientation,
  setOrientation,
  syncScroll = true,
  setSyncScroll = () => {},
  githubToken = '',
  setGithubToken = () => {},
  editorEngine = 'monaco',
  setEditorEngine = () => {},
  onClose = () => {},
  onOpenShortcuts = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showToken, setShowToken] = useState(false)

  // Local settings state
  const [fontFamily, setFontFamily] = useState(
    localStorage.getItem('readme_font_family') || "'JetBrains Mono', Consolas, monospace"
  )
  const [formatOnSave, setFormatOnSave] = useState(
    localStorage.getItem('readme_format_on_save') === 'true'
  )
  const [autoSaveMode, setAutoSaveMode] = useState(
    localStorage.getItem('readme_auto_save_mode') || 'afterDelay'
  )
  const [badgeStyle, setBadgeStyle] = useState(
    localStorage.getItem('readme_default_badge_style') || 'flat-square'
  )
  const [pdfPageSize, setPdfPageSize] = useState(
    localStorage.getItem('readme_pdf_size') || 'A4'
  )

  const handleFontFamilyChange = (val) => {
    setFontFamily(val)
    localStorage.setItem('readme_font_family', val)
    document.documentElement.style.setProperty('--font-mono', val)
  }

  const handleFormatOnSaveChange = (checked) => {
    setFormatOnSave(checked)
    localStorage.setItem('readme_format_on_save', checked ? 'true' : 'false')
  }

  const handleAutoSaveModeChange = (val) => {
    setAutoSaveMode(val)
    localStorage.setItem('readme_auto_save_mode', val)
  }

  const handleBadgeStyleChange = (val) => {
    setBadgeStyle(val)
    localStorage.setItem('readme_default_badge_style', val)
  }

  const handlePdfPageSizeChange = (val) => {
    setPdfPageSize(val)
    localStorage.setItem('readme_pdf_size', val)
  }

  const handleResetDefaults = () => {
    if (window.confirm('Reset all editor and application settings to defaults?')) {
      setThemeMode('dark')
      if (setEditorEngine) setEditorEngine('monaco')
      setFontSize(13)
      setTabSize(2)
      setWordWrap(true)
      setShowLineNumbers(true)
      setSyncScroll(true)
      setZoomLevel(100)
      setOrientation('vertical')
      handleFontFamilyChange("'JetBrains Mono', Consolas, monospace")
      handleFormatOnSaveChange(true)
      handleAutoSaveModeChange('afterDelay')
      handleBadgeStyleChange('flat-square')
      handlePdfPageSizeChange('A4')
    }
  }

  const categories = [
    { id: 'all', label: 'All Settings' },
    { id: 'editor', label: 'Text Editor' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'files', label: 'Files & Export' },
    { id: 'github', label: 'GitHub & Integrations' }
  ]

  const matchesSearch = (text) => {
    if (!searchQuery.trim()) return true
    return text.toLowerCase().includes(searchQuery.toLowerCase().trim())
  }

  return (
    <div className="settings-tab-workspace custom-scrollbar select-none">
      {/* 1. Header Toolbar */}
      <div className="settings-tab-header">
        <div className="settings-header-top">
          <div className="settings-title-group">
            <span className="material-symbols-outlined text-primary">settings</span>
            <h2 className="settings-main-title">Settings</h2>
            <span className="settings-env-badge">User & Workspace</span>
          </div>

          <div className="settings-header-actions">
            <button
              type="button"
              className="settings-action-btn"
              onClick={onOpenShortcuts}
              title="Configure Keyboard Shortcuts"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                <path d="M14 2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2h2v2H3V5zm3 0h2v2H6V5zm3 0h2v2H9V5zm3 0h1v2h-1V5zM3 8h1v2H3V8zm2 0h6v2H5V8zm7 0h1v2h-1V8z"/>
              </svg>
              <span>Keyboard Shortcuts</span>
            </button>
            <button
              type="button"
              className="settings-action-btn danger"
              onClick={handleResetDefaults}
              title="Reset all settings to default"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>restart_alt</span>
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Search Bar (VS Code style) */}
        <div className="settings-search-wrapper">
          <svg className="settings-search-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <input
            type="text"
            className="settings-search-input"
            placeholder="Search settings (e.g. font, wrap, gemini, theme, indentation)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="settings-search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="settings-category-pills">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`settings-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Content Body */}
      <div className="settings-tab-content">
        {/* ==================== CATEGORY: TEXT EDITOR ==================== */}
        {(activeCategory === 'all' || activeCategory === 'editor') && (
          <section className="settings-group-section">
            <div className="settings-group-header">
              <span className="material-symbols-outlined">edit_note</span>
              <h3>Text Editor</h3>
            </div>

            {/* Editor Engine */}
            {matchesSearch('editor engine monaco vs code classic lightweight') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Editor: Engine</div>
                  <div className="settings-card-sublabel">
                    Choose between the high-performance Monaco Editor (VS Code core with minimap, code folding, smart autocompletion) or the Classic lightweight editor.
                  </div>
                </div>
                <div className="settings-card-control">
                  <select
                    className="settings-input-select"
                    value={editorEngine}
                    onChange={(e) => setEditorEngine(e.target.value)}
                  >
                    <option value="monaco">Monaco (VS Code Engine - Recommended)</option>
                    <option value="classic">Classic (Lightweight Textarea)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Font Size */}
            {matchesSearch('font size scale editor') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Editor: Font Size</div>
                  <div className="settings-card-sublabel">Controls the font size in pixels for the markdown code editor.</div>
                </div>
                <div className="settings-card-control">
                  <select
                    className="settings-input-select"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                  >
                    <option value={11}>11px (Compact)</option>
                    <option value={12}>12px</option>
                    <option value={13}>13px (Default)</option>
                    <option value={14}>14px (Comfortable)</option>
                    <option value={16}>16px (Large)</option>
                    <option value={18}>18px (Extra Large)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Font Family */}
            {matchesSearch('font family jetbrains monospace') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Editor: Font Family</div>
                  <div className="settings-card-sublabel">Controls the primary monospaced typography font family.</div>
                </div>
                <div className="settings-card-control">
                  <select
                    className="settings-input-select"
                    value={fontFamily}
                    onChange={(e) => handleFontFamilyChange(e.target.value)}
                  >
                    <option value="'JetBrains Mono', Consolas, monospace">JetBrains Mono (Modern)</option>
                    <option value="'Fira Code', Consolas, monospace">Fira Code (Ligatures)</option>
                    <option value="Consolas, 'Courier New', monospace">Consolas (Windows Classic)</option>
                    <option value="'Source Code Pro', monospace">Source Code Pro</option>
                    <option value="ui-monospace, Menlo, Monaco, monospace">Monaco / Menlo (macOS / Unix)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Tab Size */}
            {matchesSearch('tab size indentation spaces') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Editor: Tab Size</div>
                  <div className="settings-card-sublabel">The number of spaces to insert when pressing the Tab key.</div>
                </div>
                <div className="settings-card-control">
                  <select
                    className="settings-input-select"
                    value={tabSize}
                    onChange={(e) => setTabSize(Number(e.target.value))}
                  >
                    <option value={2}>2 spaces (Standard)</option>
                    <option value={4}>4 spaces</option>
                  </select>
                </div>
              </div>
            )}

            {/* Word Wrap */}
            {matchesSearch('word wrap lines') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Editor: Word Wrap</div>
                  <div className="settings-card-sublabel">Controls whether long markdown lines wrap at the editor viewport edge.</div>
                </div>
                <div className="settings-card-control">
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={wordWrap}
                      onChange={(e) => setWordWrap(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}

            {/* Line Numbers Gutter */}
            {matchesSearch('line numbers gutter') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Editor: Line Numbers</div>
                  <div className="settings-card-sublabel">Controls the display of numerical line gutters on the left of the editor.</div>
                </div>
                <div className="settings-card-control">
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={showLineNumbers}
                      onChange={(e) => setShowLineNumbers(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}

            {/* Synchronized Scrolling */}
            {matchesSearch('synchronized scroll sync scroll preview editor split') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Editor: Synchronized Scrolling</div>
                  <div className="settings-card-sublabel">Synchronizes the scroll positions of the editor and live preview panes based on document line anchors.</div>
                </div>
                <div className="settings-card-control">
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={syncScroll}
                      onChange={(e) => setSyncScroll(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}

            {/* Format On Save */}
            {matchesSearch('format on save auto') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Editor: Format On Save</div>
                  <div className="settings-card-sublabel">Automatically clean up markdown headers, tables, and spacing when saving (Ctrl+S).</div>
                </div>
                <div className="settings-card-control">
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={formatOnSave}
                      onChange={(e) => handleFormatOnSaveChange(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}

            {/* Auto Save Mode */}
            {matchesSearch('auto save delay buffer') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Editor: Auto Save</div>
                  <div className="settings-card-sublabel">Controls how documents are automatically saved to local workspace storage.</div>
                </div>
                <div className="settings-card-control">
                  <select
                    className="settings-input-select"
                    value={autoSaveMode}
                    onChange={(e) => handleAutoSaveModeChange(e.target.value)}
                  >
                    <option value="afterDelay">afterDelay (Automatic 1s)</option>
                    <option value="onFocusChange">onFocusChange (When switching tabs)</option>
                    <option value="off">off (Manual Ctrl+S only)</option>
                  </select>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ==================== CATEGORY: APPEARANCE ==================== */}
        {(activeCategory === 'all' || activeCategory === 'appearance') && (
          <section className="settings-group-section">
            <div className="settings-group-header">
              <span className="material-symbols-outlined">palette</span>
              <h3>Appearance & Window</h3>
            </div>

            {/* Color Theme */}
            {matchesSearch('theme color dark modern slate light') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Workbench: Color Theme</div>
                  <div className="settings-card-sublabel">Specifies the color theme used in the workbench and editor canvas.</div>
                </div>
                <div className="settings-card-control">
                  <select
                    className="settings-input-select"
                    value={themeMode}
                    onChange={(e) => setThemeMode(e.target.value)}
                  >
                    <option value="dark">Dark Modern (Antigravity IDE / VS Code Default)</option>
                    <option value="slate">Sleek Slate (#10141a)</option>
                    <option value="light">Crisp Light Mode</option>
                  </select>
                </div>
              </div>
            )}

            {/* UI Zoom */}
            {matchesSearch('zoom scale interface') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Window: Zoom Level</div>
                  <div className="settings-card-sublabel">Adjust the display zoom level across the application interface.</div>
                </div>
                <div className="settings-card-control">
                  <select
                    className="settings-input-select"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(Number(e.target.value))}
                  >
                    <option value={90}>90% (Compact)</option>
                    <option value={100}>100% (Standard)</option>
                    <option value={115}>115% (Enlarged)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Split Orientation */}
            {matchesSearch('orientation split layout side by side stacked') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Editor: Default Split Orientation</div>
                  <div className="settings-card-sublabel">Default split layout for the code editor and live markdown preview.</div>
                </div>
                <div className="settings-card-control">
                  <select
                    className="settings-input-select"
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                  >
                    <option value="vertical">Side-by-Side (Vertical Split)</option>
                    <option value="horizontal">Stacked (Horizontal Split)</option>
                  </select>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ==================== CATEGORY: FILES & EXPORT ==================== */}
        {(activeCategory === 'all' || activeCategory === 'files') && (
          <section className="settings-group-section">
            <div className="settings-group-header">
              <span className="material-symbols-outlined">folder</span>
              <h3>Files & Exporting</h3>
            </div>

            {/* Badge Style */}
            {matchesSearch('badge style shields flat') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Shields.io: Default Badge Style</div>
                  <div className="settings-card-sublabel">Aesthetic appearance used when inserting dynamic repository badges.</div>
                </div>
                <div className="settings-card-control">
                  <select
                    className="settings-input-select"
                    value={badgeStyle}
                    onChange={(e) => handleBadgeStyleChange(e.target.value)}
                  >
                    <option value="flat-square">flat-square (Modern Developer)</option>
                    <option value="flat">flat (Classic Rounded)</option>
                    <option value="for-the-badge">for-the-badge (Bold Uppercase)</option>
                    <option value="plastic">plastic (Glossy)</option>
                  </select>
                </div>
              </div>
            )}

            {/* PDF Paper Size */}
            {matchesSearch('pdf export paper size a4 letter') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Export: PDF Paper Size</div>
                  <div className="settings-card-sublabel">Standard page format used when generating printable PDF documents.</div>
                </div>
                <div className="settings-card-control">
                  <select
                    className="settings-input-select"
                    value={pdfPageSize}
                    onChange={(e) => handlePdfPageSizeChange(e.target.value)}
                  >
                    <option value="A4">A4 (210 × 297 mm)</option>
                    <option value="Letter">US Letter (8.5 × 11 in)</option>
                  </select>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ==================== CATEGORY: GITHUB & INTEGRATIONS ==================== */}
        {(activeCategory === 'all' || activeCategory === 'github') && (
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
        )}
      </div>
    </div>
  )
}
