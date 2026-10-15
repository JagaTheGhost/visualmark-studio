import React from 'react'
import {
  FLOATING_TOOLBAR_ACTIONS,
  saveFloatingToolbarConfig,
  DEFAULT_FLOATING_TOOLBAR_CONFIG
} from '../../utils/floatingToolbarConfig'

export default function ToolbarSettingsSection({
  activeCategory,
  matchesSearch,
  toolbarConfig,
  setToolbarConfig,
  showToast
}) {
  if (activeCategory !== 'all' && activeCategory !== 'toolbar') return null

  return (
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
  )
}
