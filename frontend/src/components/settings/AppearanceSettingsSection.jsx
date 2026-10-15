import React from 'react'

export default function AppearanceSettingsSection({
  activeCategory,
  matchesSearch,
  themeMode,
  setThemeMode,
  zoomLevel,
  setZoomLevel,
  orientation,
  setOrientation
}) {
  if (activeCategory !== 'all' && activeCategory !== 'appearance') return null

  return (
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
  )
}
