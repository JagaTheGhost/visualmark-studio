import React, { useState, useEffect } from 'react'
import { APP_CURRENT_VERSION } from '../data/releaseNotes'
import { useToast } from '../context/ToastContext'
import {
  FLOATING_TOOLBAR_ACTIONS,
  loadFloatingToolbarConfig,
  saveFloatingToolbarConfig,
  DEFAULT_FLOATING_TOOLBAR_CONFIG
} from '../utils/floatingToolbarConfig'

function formatBytes(bytes) {
  if (!bytes || isNaN(bytes) || bytes <= 0) return '0 MB'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(2)} GB`
  }
  return `${mb.toFixed(1)} MB`
}

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
  setSyncScroll = () => { },
  githubToken = '',
  setGithubToken = () => { },
  editorEngine = 'monaco',
  setEditorEngine = () => { },
  onClose = () => { },
  onOpenShortcuts = () => { },
  autoDownloadUpdates = false,
  setAutoDownloadUpdates = () => { },
  onCheckForUpdates = () => { },
  isCheckingUpdate = false,
  currentVersion = APP_CURRENT_VERSION,
  onOpenWhatsNew = () => { },
  updateProgress = null,
  updateDownloaded = null,
  updateError = null,
  pendingUpdateInfo = null,
  onStartDownloadUpdate = () => { },
  onRestartToUpdate = () => { }
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showToken, setShowToken] = useState(false)

  const {
    toastFilterLevel,
    setToastFilterLevel,
    history = [],
    clearHistory = () => { },
    showToast = () => { }
  } = useToast()

  useEffect(() => {
    const handleCategoryJump = (e) => {
      if (e.detail) setActiveCategory(e.detail)
    }
    window.addEventListener('open-settings-tab', handleCategoryJump)
    return () => window.removeEventListener('open-settings-tab', handleCategoryJump)
  }, [])

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
  const [toolbarConfig, setToolbarConfig] = useState(loadFloatingToolbarConfig)

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
      setToolbarConfig({ ...DEFAULT_FLOATING_TOOLBAR_CONFIG })
      saveFloatingToolbarConfig(DEFAULT_FLOATING_TOOLBAR_CONFIG)
    }
  }

  const categories = [
    { id: 'all', label: 'All Settings' },
    { id: 'editor', label: 'Text Editor' },
    { id: 'toolbar', label: 'Floating Toolbar' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'files', label: 'Files & Export' },
    { id: 'notifications', label: 'Notifications & Toasts' },
    { id: 'updates', label: 'App Updates' },
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
                <path d="M14 2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2h2v2H3V5zm3 0h2v2H6V5zm3 0h2v2H9V5zm3 0h1v2h-1V5zM3 8h1v2H3V8zm2 0h6v2H5V8zm7 0h1v2h-1V8z" />
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
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
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
                    Choose between the high-performance Monaco Editor (with minimap, code folding, smart autocompletion) or the Classic lightweight editor.
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

        {/* ==================== CATEGORY: FLOATING SELECTION TOOLBAR ==================== */}
        {(activeCategory === 'all' || activeCategory === 'toolbar') && (
          <section className="settings-group-section">
            <div className="settings-group-header">
              <span className="material-symbols-outlined">auto_fix_high</span>
              <h3>Floating Quick-Action Toolbar</h3>
              <span className="settings-env-badge" style={{ marginLeft: 'auto', textTransform: 'none' }}>
                {toolbarConfig.enabled
                  ? `${FLOATING_TOOLBAR_ACTIONS.filter(a => toolbarConfig[a.id]).length} / ${FLOATING_TOOLBAR_ACTIONS.length} tools active`
                  : 'Disabled'}
              </span>
            </div>

            {/* Master Enable/Disable */}
            {matchesSearch('floating toolbar quick actions highlight selection word notion popup hud') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Enable Floating Selection Toolbar</div>
                  <div className="settings-card-sublabel">
                    When text is highlighted in the editor, display a floating HUD with quick formatting actions, headings, lists, and callout insertion.
                  </div>
                </div>
                <div className="settings-card-control">
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={toolbarConfig.enabled}
                      onChange={(e) => {
                        const updated = { ...toolbarConfig, enabled: e.target.checked }
                        setToolbarConfig(updated)
                        saveFloatingToolbarConfig(updated)
                        showToast(
                          e.target.checked ? 'Floating selection toolbar enabled' : 'Floating selection toolbar disabled',
                          'info',
                          { source: 'Settings' }
                        )
                      }}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}

            {/* Actions Modular Control Grid */}
            {toolbarConfig.enabled && matchesSearch('quick action tools format headings bold italic lists tables callouts badges') && (
              <div className="settings-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div className="settings-card-info">
                    <div className="settings-card-label">Modular Toolbar Tools</div>
                    <div className="settings-card-sublabel">
                      Choose exactly which buttons and dropdown menus appear in your floating HUD.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      className="settings-action-btn"
                      onClick={() => {
                        const updated = { ...toolbarConfig }
                        FLOATING_TOOLBAR_ACTIONS.forEach(a => { updated[a.id] = true })
                        setToolbarConfig(updated)
                        saveFloatingToolbarConfig(updated)
                      }}
                    >
                      Enable All
                    </button>
                    <button
                      type="button"
                      className="settings-action-btn"
                      onClick={() => {
                        const updated = { ...toolbarConfig }
                        FLOATING_TOOLBAR_ACTIONS.forEach(a => { updated[a.id] = false })
                        setToolbarConfig(updated)
                        saveFloatingToolbarConfig(updated)
                      }}
                    >
                      Disable All
                    </button>
                    <button
                      type="button"
                      className="settings-action-btn"
                      onClick={() => {
                        setToolbarConfig({ ...DEFAULT_FLOATING_TOOLBAR_CONFIG })
                        saveFloatingToolbarConfig(DEFAULT_FLOATING_TOOLBAR_CONFIG)
                      }}
                      title="Reset toolbar to defaults"
                    >
                      Reset HUD Defaults
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '8px',
                    backgroundColor: 'var(--surface-lowest, #1e1e1e)',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle, rgba(255,255,255,0.06))'
                  }}
                >
                  {FLOATING_TOOLBAR_ACTIONS.map(action => {
                    const isChecked = !!toolbarConfig[action.id]
                    return (
                      <label
                        key={action.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          backgroundColor: isChecked ? 'rgba(0, 122, 204, 0.1)' : 'transparent',
                          border: isChecked ? '1px solid rgba(0, 122, 204, 0.3)' : '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.1s ease',
                          userSelect: 'none'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const updated = { ...toolbarConfig, [action.id]: e.target.checked }
                            setToolbarConfig(updated)
                            saveFloatingToolbarConfig(updated)
                          }}
                          style={{ cursor: 'pointer', accentColor: '#007acc' }}
                        />
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: '16px',
                            color: isChecked ? '#38bdf8' : 'var(--text-muted, #858585)'
                          }}
                        >
                          {action.icon}
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            color: isChecked ? '#ffffff' : 'var(--text-secondary, #cccccc)',
                            fontWeight: isChecked ? '500' : 'normal'
                          }}
                        >
                          {action.label}
                        </span>
                      </label>
                    )
                  })}
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

        {/* ==================== CATEGORY: NOTIFICATIONS & TOASTS ==================== */}
        {(activeCategory === 'all' || activeCategory === 'notifications') && (
          <section className="settings-group-section">
            <div className="settings-group-header">
              <span className="material-symbols-outlined">notifications</span>
              <h3>Notifications & Toasts</h3>
            </div>

            {/* Notification Popup Level */}
            {matchesSearch('notifications toasts popup alert warning important level popup filter') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Notifications: Popup Toast Level</div>
                  <div className="settings-card-sublabel">
                    Controls which notifications pop up as floating cards over your workspace.
                    By default, routine file operations (closing files, switching tabs) are muted to prevent distraction. All notifications are permanently saved to the Notification Center history.
                  </div>
                </div>
                <div className="settings-card-control">
                  <select
                    className="settings-input-select"
                    value={toastFilterLevel}
                    onChange={(e) => setToastFilterLevel(e.target.value)}
                  >
                    <option value="important">Strict: Important & Warnings Only (Default - Recommended)</option>
                    <option value="balanced">Balanced: Standard Notifications</option>
                    <option value="all">Verbose: All Notifications</option>
                    <option value="errors">Errors Only</option>
                    <option value="silent">Do Not Disturb (Silent - No Popups)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Notification History Management */}
            {matchesSearch('notifications history clear count log') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Notification Center History</div>
                  <div className="settings-card-sublabel">
                    Currently storing {history.length} notification(s). Clear history log from Notification Center.
                  </div>
                </div>
                <div className="settings-card-control" style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="settings-action-btn"
                    onClick={clearHistory}
                    disabled={history.length === 0}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete_sweep</span>
                    <span>Clear History</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ==================== CATEGORY: APPLICATION UPDATES ==================== */}
        {(activeCategory === 'all' || activeCategory === 'updates') && (
          <section className="settings-group-section">
            <div className="settings-group-header">
              <span className="material-symbols-outlined">system_update</span>
              <h3>Application Updates</h3>
            </div>

            {/* Auto vs Manual Updates Setting */}
            {matchesSearch('updates auto manual download automatic background version upgrade mode') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Automatically Download Updates</div>
                  <div className="settings-card-sublabel">
                    When enabled (Automatic), updates are downloaded silently in the background. When disabled (Manual), VisualMark Studio asks for your confirmation before downloading.
                  </div>
                </div>
                <div className="settings-card-control">
                  <label className="settings-toggle-switch" title={autoDownloadUpdates ? "Automatic updates enabled (Click to switch to Manual)" : "Manual updates enabled (Click to switch to Automatic)"}>
                    <input
                      type="checkbox"
                      checked={autoDownloadUpdates}
                      onChange={(e) => setAutoDownloadUpdates(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}

            {/* Live Update Download Progress Card (Visible for both Auto and Manual Downloads) */}
            {updateProgress && !updateDownloaded && (
              <div className="settings-card">
                <div className="settings-card-info" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined spin" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                        sync
                      </span>
                      <span className="settings-card-label" style={{ margin: 0 }}>
                        Downloading Update {updateProgress.version ? `v${updateProgress.version}` : ''}
                      </span>
                      <span className="settings-update-mode-badge">
                        {autoDownloadUpdates ? 'Auto' : 'Manual'}
                      </span>
                    </div>
                    <span className="settings-update-percent">
                      {Math.round(updateProgress.percent || 0)}%
                    </span>
                  </div>

                  {/* Clean IDE Progress Bar */}
                  <div className="settings-update-progress-track">
                    <div
                      className="settings-update-progress-fill"
                      style={{ width: `${Math.min(100, Math.max(0, updateProgress.percent || 0))}%` }}
                    />
                  </div>

                  {/* Transfer Details / Stats */}
                  <div className="settings-update-stats">
                    <span>
                      {updateProgress.total > 0
                        ? `${formatBytes(updateProgress.transferred || 0)} of ${formatBytes(updateProgress.total || 0)}`
                        : `${formatBytes(updateProgress.transferred || 0)} transferred`}
                    </span>
                    {updateProgress.bytesPerSecond > 0 && (
                      <span>Speed: {formatBytes(updateProgress.bytesPerSecond)}/s</span>
                    )}
                    <span>
                      {autoDownloadUpdates ? 'Downloading in background' : 'Downloading requested release'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Update Ready to Install Card */}
            {updateDownloaded && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
                      check_circle
                    </span>
                    <span className="settings-card-label" style={{ margin: 0 }}>
                      Update Ready to Install: v{updateDownloaded.version || 'New Release'}
                    </span>
                    <span className="settings-update-mode-badge">Ready</span>
                  </div>
                  <div className="settings-card-sublabel">
                    VisualMark Studio downloaded the latest release {autoDownloadUpdates ? 'in the background' : 'successfully'}. Restart the app to apply the update immediately.
                  </div>
                </div>
                <div className="settings-card-control">
                  <button
                    type="button"
                    className="settings-action-btn primary"
                    onClick={onRestartToUpdate}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>restart_alt</span>
                    <span>Restart &amp; Install</span>
                  </button>
                </div>
              </div>
            )}

            {/* Manual Update Available Prompt Card */}
            {pendingUpdateInfo && !updateProgress && !updateDownloaded && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
                      cloud_download
                    </span>
                    <span className="settings-card-label" style={{ margin: 0 }}>
                      Update v{pendingUpdateInfo.version} Available
                    </span>
                    <span className="settings-update-mode-badge">Available</span>
                  </div>
                  <div className="settings-card-sublabel">
                    A new version is available. Since automatic background downloading is disabled, click below to start downloading.
                  </div>
                </div>
                <div className="settings-card-control">
                  <button
                    type="button"
                    className="settings-action-btn"
                    onClick={() => onStartDownloadUpdate(pendingUpdateInfo)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
                    <span>Download Now</span>
                  </button>
                </div>
              </div>
            )}

            {/* Update Error Notice Card */}
            {updateError && !updateProgress && !updateDownloaded && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
                      info
                    </span>
                    <span className="settings-card-label" style={{ margin: 0 }}>
                      Update Notice
                    </span>
                  </div>
                  <div className="settings-card-sublabel">
                    {updateError}
                  </div>
                </div>
              </div>
            )}

            {/* Check for Updates & Release Notes */}
            {matchesSearch('check for updates current version release notes patch') && (
              <div className="settings-card">
                <div className="settings-card-info">
                  <div className="settings-card-label">Current Version: v{currentVersion}</div>
                  <div className="settings-card-sublabel">
                    VisualMark Studio checks for new releases on GitHub. You can check for updates manually or review patch release notes.
                  </div>
                </div>
                <div className="settings-card-control" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="settings-action-btn"
                    onClick={onCheckForUpdates}
                    disabled={isCheckingUpdate || Boolean(updateProgress)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span className={`material-symbols-outlined ${isCheckingUpdate ? 'spin' : ''}`} style={{ fontSize: '15px' }}>
                      {isCheckingUpdate ? 'sync' : 'refresh'}
                    </span>
                    <span>{isCheckingUpdate ? 'Checking...' : updateProgress ? 'Downloading...' : 'Check for Updates'}</span>
                  </button>

                  <button
                    type="button"
                    className="settings-action-btn"
                    onClick={onOpenWhatsNew}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>new_releases</span>
                    <span>What's New</span>
                  </button>
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
