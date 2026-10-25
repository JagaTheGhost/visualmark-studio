import React from 'react'

export default function NotificationsSettingsSection({
  activeCategory,
  matchesSearch,
  toastFilterLevel,
  setToastFilterLevel,
  history = [],
  clearHistory = () => {}
}) {
  if (activeCategory !== 'all' && activeCategory !== 'notifications') return null

  return (
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
              By default, toast messages are only generated for software updates, Git source control actions, and interactive alerts. Routine operations (saving files, opening files, switching tabs, inserting snippets) are muted to prevent distraction.
            </div>
          </div>
          <div className="settings-card-control">
            <select
              className="settings-input-select"
              value={toastFilterLevel === 'important' ? 'updates_git' : toastFilterLevel}
              onChange={(e) => setToastFilterLevel(e.target.value)}
            >
              <option value="updates_git">Updates & Git Only (Default - Minimal Distraction)</option>
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
  )
}
