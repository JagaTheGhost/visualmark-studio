import React, { useRef } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { THEMES } from '../../themes/themeRegistry'

export default function AppearanceSettingsSection({
  activeCategory,
  matchesSearch,
  themeMode,
  setThemeMode,
  zoomLevel,
  setZoomLevel,
  orientation,
  setOrientation,
  tabGroupingEnabled = true,
  setTabGroupingEnabled = () => {},
  showWelcomeOnStartup = true,
  onToggleShowWelcomeOnStartup = () => {},
  showToast = () => {}
}) {
  const {
    locale,
    setLocale,
    supportedLanguages,
    t,
    exportLanguagePack,
    importCustomLanguage,
    deleteCustomLanguage,
    isCustomLanguage,
    getLanguageStats
  } = useI18n()

  const fileInputRef = useRef(null)

  if (activeCategory !== 'all' && activeCategory !== 'appearance') return null

  const isCustom = isCustomLanguage(locale)

  const handleFileImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result)
        const pack = importCustomLanguage(json)
        showToast(
          t('settings.appearance.importSuccess', "Custom language pack '{name}' imported successfully!", { name: pack.label || pack.code }),
          'success',
          { source: 'i18n' }
        )
      } catch (err) {
        showToast(
          t('settings.appearance.importError', 'Failed to import language pack: {error}', { error: err.message }),
          'error',
          { source: 'i18n' }
        )
      }
    }
    reader.readAsText(file)
    // Reset file input so user can import the same file again if edited
    e.target.value = ''
  }

  const handleDeleteCustom = () => {
    const activeLang = supportedLanguages.find((l) => l.code === locale)
    const name = activeLang?.label || locale
    if (window.confirm(t('settings.appearance.removeConfirm', "Are you sure you want to remove the custom language pack '{name}'?", { name }))) {
      deleteCustomLanguage(locale)
      showToast(`Language pack '${name}' removed. Reverted to English.`, 'info', { source: 'i18n' })
    }
  }

  return (
    <section className="settings-group-section">
      <div className="settings-group-header">
        <span className="material-symbols-outlined">palette</span>
        <h3>{t('settings.appearance.title', 'Appearance & Window')}</h3>
      </div>

      {/* Application Language (i18n) */}
      {matchesSearch('language locale i18n translation english chinese spanish japanese german french russian hindi portuguese italian tamil Φ¿ÇΦ¬₧ Φ¿ÇΦæë') && (
        <div className="settings-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <div className="settings-card-info">
              <div className="settings-card-label">{t('settings.appearance.language', 'Application Language')}</div>
              <div className="settings-card-sublabel">
                {t('settings.appearance.languageDesc', 'Select the interface display language for VisualMark Studio.')}
              </div>
            </div>
            <div className="settings-card-control">
              <select
                className="settings-input-select"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.native} ({lang.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Community Translation Actions Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: '8px',
              paddingTop: '2px',
              fontSize: '11.5px'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileImport}
            />

            <button
              type="button"
              className="settings-action-btn"
              onClick={() => exportLanguagePack(locale)}
              title="Download this language pack as JSON to edit or translate"
              style={{ fontSize: '11px', padding: '3px 9px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>download</span>
              <span>{t('settings.appearance.exportPack', 'Export Pack (.json)')}</span>
            </button>

            <button
              type="button"
              className="settings-action-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Install a community or custom JSON language pack"
              style={{ fontSize: '11px', padding: '3px 9px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>upload_file</span>
              <span>{t('settings.appearance.importPack', 'Import Pack (.json)')}</span>
            </button>

            {isCustom && (
              <button
                type="button"
                className="settings-action-btn danger"
                onClick={handleDeleteCustom}
                title="Remove this custom language pack"
                style={{ fontSize: '11px', padding: '3px 9px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>delete</span>
                <span>{t('settings.appearance.removePack', 'Remove Pack')}</span>
              </button>
            )}

            <a
              href="https://github.com/JagaTheGhost/visualmark-studio/discussions"
              target="_blank"
              rel="noreferrer"
              className="settings-action-btn"
              style={{ fontSize: '11px', padding: '3px 9px', textDecoration: 'none' }}
              title="Join GitHub discussions or share translations"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>forum</span>
              <span>{t('settings.appearance.discussions', 'Discussions Γåù')}</span>
            </a>
          </div>
        </div>
      )}

      {/* Color Theme */}
      {matchesSearch('theme color dark modern slate light tokyo dracula one monokai github solarized πâåπâ╝πâ₧ Φë▓ πé½πâ⌐πâ╝') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">{t('settings.appearance.colorTheme', 'Workbench: Color Theme')}</div>
            <div className="settings-card-sublabel">
              {t('settings.appearance.colorThemeDesc', 'Specifies the color theme used in the workbench, editor canvas, and markdown preview.')}
            </div>
          </div>
          <div className="settings-card-control">
            <select
              className="settings-input-select"
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value)}
            >
              <optgroup label={t('settings.appearance.darkThemes', 'Dark Themes')}>
                {THEMES.filter(t => t.type === 'dark').map(theme => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name} {theme.badge ? `(${theme.badge})` : ''}
                  </option>
                ))}
              </optgroup>
              <optgroup label={t('settings.appearance.lightThemes', 'Light Themes')}>
                {THEMES.filter(t => t.type === 'light').map(theme => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name} {theme.badge ? `(${theme.badge})` : ''}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      )}

      {/* Workbench Tab Grouping */}
      {matchesSearch('tab grouping categories studio documents tabs flat πé┐πâû πé░πâ½πâ╝πâù') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">{t('settings.appearance.tabGrouping', 'Workbench: Tab Grouping')}</div>
            <div className="settings-card-sublabel">
              {t('settings.appearance.tabGroupingDesc', 'Organize open studio tools, markdown documents, and presets into collapsible Chrome/Arc-style categories.')}
            </div>
          </div>
          <div className="settings-card-control">
            <select
              className="settings-input-select"
              value={tabGroupingEnabled ? 'enabled' : 'disabled'}
              onChange={(e) => setTabGroupingEnabled(e.target.value === 'enabled')}
            >
              <option value="enabled">{t('settings.appearance.tabGroupingEnabled', 'Enabled (Categorize into Docs & Studios)')}</option>
              <option value="disabled">{t('settings.appearance.tabGroupingDisabled', 'Disabled (Flat Traditional Tabs)')}</option>
            </select>
          </div>
        </div>
      )}

      {/* UI Zoom */}
      {matchesSearch('zoom scale interface πé║πâ╝πâá µïíσñº τ╕«σ░Å') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">{t('settings.appearance.zoomLevel', 'Window: Zoom Level')}</div>
            <div className="settings-card-sublabel">
              {t('settings.appearance.zoomLevelDesc', 'Adjust the display zoom level across the application interface.')}
            </div>
          </div>
          <div className="settings-card-control">
            <select
              className="settings-input-select"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
            >
              <option value={90}>{t('settings.appearance.zoomCompact', '90% (Compact)')}</option>
              <option value={100}>{t('settings.appearance.zoomStandard', '100% (Standard)')}</option>
              <option value={115}>{t('settings.appearance.zoomEnlarged', '115% (Enlarged)')}</option>
            </select>
          </div>
        </div>
      )}

      {/* Split Orientation */}
      {matchesSearch('orientation split layout side by side stacked σêåσë▓ πâ¼πéñπéóπéªπâê') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">{t('settings.appearance.splitOrientation', 'Editor: Default Split Orientation')}</div>
            <div className="settings-card-sublabel">
              {t('settings.appearance.splitOrientationDesc', 'Default split layout for the code editor and live markdown preview.')}
            </div>
          </div>
          <div className="settings-card-control">
            <select
              className="settings-input-select"
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
            >
              <option value="vertical">{t('settings.appearance.splitVertical', 'Side-by-Side (Vertical Split)')}</option>
              <option value="horizontal">{t('settings.appearance.splitHorizontal', 'Stacked (Horizontal Split)')}</option>
            </select>
          </div>
        </div>
      )}

      {/* Show Welcome On Startup */}
      {matchesSearch('welcome startup onboarding landing page getting started πé╣πé┐πâ╝πâê πéêπüåπüôπü¥ Φ╡╖σïò') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">{t('settings.appearance.welcomeStartup', 'Workbench: Show Welcome Page on Startup')}</div>
            <div className="settings-card-sublabel">
              {t('settings.appearance.welcomeStartupDesc', 'Open the Welcome / Getting Started dashboard when launching VisualMark Studio.')}
            </div>
          </div>
          <div className="settings-card-control">
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={Boolean(showWelcomeOnStartup)}
                onChange={(e) => onToggleShowWelcomeOnStartup(e.target.checked)}
              />
              <span className="settings-switch-slider" />
            </label>
          </div>
        </div>
      )}
    </section>
  )
}
