import React from 'react'
import { useI18n } from '../../i18n/I18nContext'

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
  setTabGroupingEnabled = () => {}
}) {
  const { locale, setLocale, supportedLanguages, t } = useI18n()

  if (activeCategory !== 'all' && activeCategory !== 'appearance') return null

  return (
    <section className="settings-group-section">
      <div className="settings-group-header">
        <span className="material-symbols-outlined">palette</span>
        <h3>{t('settings.appearance', 'Appearance & Window')}</h3>
      </div>

      {/* Application Language (i18n) */}
      {matchesSearch('language locale i18n translation english chinese spanish japanese german french russian hindi portuguese italian') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">{t('settings.language', 'Application Language')}</div>
            <div className="settings-card-sublabel">
              {t('settings.languageDesc', 'Select the interface display language for VisualMark Studio.')}
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
      )}


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

      {/* Workbench Tab Grouping */}
      {matchesSearch('tab grouping categories studio documents tabs flat') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">Workbench: Tab Grouping</div>
            <div className="settings-card-sublabel">
              Organize open studio tools, markdown documents, and presets into collapsible Chrome/Arc-style categories.
            </div>
          </div>
          <div className="settings-card-control">
            <select
              className="settings-input-select"
              value={tabGroupingEnabled ? 'enabled' : 'disabled'}
              onChange={(e) => setTabGroupingEnabled(e.target.value === 'enabled')}
            >
              <option value="enabled">Enabled (Categorize into Docs & Studios)</option>
              <option value="disabled">Disabled (Flat Traditional Tabs)</option>
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
  )
}
