import React from 'react'

function formatBytes(bytes) {
  if (!bytes || isNaN(bytes) || bytes <= 0) return '0 MB'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(2)} GB`
  }
  return `${mb.toFixed(1)} MB`
}

export default function UpdateSettingsSection({
  activeCategory,
  matchesSearch,
  autoDownloadUpdates = false,
  setAutoDownloadUpdates = () => {},
  updateProgress = null,
  updateDownloaded = null,
  pendingUpdateInfo = null,
  updateError = null,
  currentVersion,
  isCheckingUpdate = false,
  onCheckForUpdates = () => {},
  onOpenWhatsNew = () => {},
  onStartDownloadUpdate = () => {},
  onRestartToUpdate = () => {}
}) {
  if (activeCategory !== 'all' && activeCategory !== 'updates') return null

  return (
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
  )
}
