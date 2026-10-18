import React, { useState, useEffect } from 'react'
import { APP_CURRENT_VERSION } from '../../data/releaseNotes'
import { useToast } from '../../context/ToastContext'
import {
  loadFloatingToolbarConfig,
  saveFloatingToolbarConfig,
  DEFAULT_FLOATING_TOOLBAR_CONFIG
} from '../../utils/floatingToolbarConfig'

import AppearanceSettingsSection from './AppearanceSettingsSection'
import EditorSettingsSection from './EditorSettingsSection'
import ToolbarSettingsSection from './ToolbarSettingsSection'
import ExportSettingsSection from './ExportSettingsSection'
import NotificationsSettingsSection from './NotificationsSettingsSection'
import UpdateSettingsSection from './UpdateSettingsSection'
import IntegrationsSettingsSection from './IntegrationsSettingsSection'

const CATEGORIES = [
  { id: 'all', label: 'All Settings' },
  { id: 'editor', label: 'Text Editor' },
  { id: 'toolbar', label: 'Floating Toolbar' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'files', label: 'Files & Export' },
  { id: 'notifications', label: 'Notifications & Toasts' },
  { id: 'updates', label: 'App Updates' },
  { id: 'github', label: 'GitHub & Integrations' }
]

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
  onOpenShortcuts = () => {},
  autoDownloadUpdates = false,
  setAutoDownloadUpdates = () => {},
  onCheckForUpdates = () => {},
  isCheckingUpdate = false,
  currentVersion = APP_CURRENT_VERSION,
  onOpenWhatsNew = () => {},
  updateProgress = null,
  updateDownloaded = null,
  updateError = null,
  pendingUpdateInfo = null,
  onStartDownloadUpdate = () => {},
  onRestartToUpdate = () => {},
  tabGroupingEnabled = true,
  setTabGroupingEnabled = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showToken, setShowToken] = useState(false)

  const {
    toastFilterLevel,
    setToastFilterLevel,
    history = [],
    clearHistory = () => {},
    showToast = () => {}
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
          {CATEGORIES.map((cat) => (
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
        <EditorSettingsSection
          activeCategory={activeCategory}
          matchesSearch={matchesSearch}
          editorEngine={editorEngine}
          setEditorEngine={setEditorEngine}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          handleFontFamilyChange={handleFontFamilyChange}
          tabSize={tabSize}
          setTabSize={setTabSize}
          wordWrap={wordWrap}
          setWordWrap={setWordWrap}
          showLineNumbers={showLineNumbers}
          setShowLineNumbers={setShowLineNumbers}
          syncScroll={syncScroll}
          setSyncScroll={setSyncScroll}
          formatOnSave={formatOnSave}
          handleFormatOnSaveChange={handleFormatOnSaveChange}
          autoSaveMode={autoSaveMode}
          handleAutoSaveModeChange={handleAutoSaveModeChange}
        />

        <ToolbarSettingsSection
          activeCategory={activeCategory}
          matchesSearch={matchesSearch}
          toolbarConfig={toolbarConfig}
          setToolbarConfig={setToolbarConfig}
          showToast={showToast}
        />

        <AppearanceSettingsSection
          activeCategory={activeCategory}
          matchesSearch={matchesSearch}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          orientation={orientation}
          setOrientation={setOrientation}
          tabGroupingEnabled={tabGroupingEnabled}
          setTabGroupingEnabled={setTabGroupingEnabled}
        />

        <ExportSettingsSection
          activeCategory={activeCategory}
          matchesSearch={matchesSearch}
          badgeStyle={badgeStyle}
          handleBadgeStyleChange={handleBadgeStyleChange}
          pdfPageSize={pdfPageSize}
          handlePdfPageSizeChange={handlePdfPageSizeChange}
        />

        <NotificationsSettingsSection
          activeCategory={activeCategory}
          matchesSearch={matchesSearch}
          toastFilterLevel={toastFilterLevel}
          setToastFilterLevel={setToastFilterLevel}
          history={history}
          clearHistory={clearHistory}
        />

        <UpdateSettingsSection
          activeCategory={activeCategory}
          matchesSearch={matchesSearch}
          autoDownloadUpdates={autoDownloadUpdates}
          setAutoDownloadUpdates={setAutoDownloadUpdates}
          updateProgress={updateProgress}
          updateDownloaded={updateDownloaded}
          pendingUpdateInfo={pendingUpdateInfo}
          updateError={updateError}
          currentVersion={currentVersion}
          isCheckingUpdate={isCheckingUpdate}
          onCheckForUpdates={onCheckForUpdates}
          onOpenWhatsNew={onOpenWhatsNew}
          onStartDownloadUpdate={onStartDownloadUpdate}
          onRestartToUpdate={onRestartToUpdate}
        />

        <IntegrationsSettingsSection
          activeCategory={activeCategory}
          matchesSearch={matchesSearch}
          githubToken={githubToken}
          setGithubToken={setGithubToken}
          showToken={showToken}
          setShowToken={setShowToken}
        />
      </div>
    </div>
  )
}
