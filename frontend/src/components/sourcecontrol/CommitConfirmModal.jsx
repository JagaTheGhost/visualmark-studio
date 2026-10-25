import React from 'react'

export default function CommitConfirmModal({
  isOpen = false,
  actionType = 'commit',
  branch = 'main',
  remoteUrl = null,
  commitMessage = '',
  stagedChanges = [],
  unstagedChanges = [],
  isCommitting = false,
  onConfirm = () => {},
  onClose = () => {}
}) {
  if (!isOpen) return null

  const getActionDetails = () => {
    switch (actionType) {
      case 'commit-push':
        return {
          title: 'Confirm Commit & Push',
          badge: 'Commit & Push',
          badgeClass: 'badge-push',
          icon: 'upload',
          buttonLabel: 'Confirm & Push to Remote',
          desc: 'This will create a local commit and immediately push it to your remote GitHub repository.'
        }
      case 'commit-sync':
        return {
          title: 'Confirm Commit & Sync',
          badge: 'Commit & Sync',
          badgeClass: 'badge-sync',
          icon: 'swap_vert',
          buttonLabel: 'Confirm & Sync',
          desc: 'This will create a local commit, pull incoming changes from GitHub, and push your commits to remote.'
        }
      case 'commit-amend':
        return {
          title: 'Confirm Commit (Amend)',
          badge: 'Amend Last Commit',
          badgeClass: 'badge-amend',
          icon: 'history',
          buttonLabel: 'Confirm Amend',
          desc: 'This will modify and rewrite the most recent commit in your history.'
        }
      default:
        return {
          title: 'Confirm Commit',
          badge: 'Local Commit',
          badgeClass: 'badge-commit',
          icon: 'check',
          buttonLabel: 'Confirm Local Commit',
          desc: 'This will save a commit locally in your repository history (offline, no upload to GitHub).'
        }
    }
  }

  const details = getActionDetails()
  const filesToCommit = stagedChanges.length > 0 ? stagedChanges : unstagedChanges
  const isAutoStaging = stagedChanges.length === 0 && unstagedChanges.length > 0 && actionType !== 'commit-amend'

  // Format clean remote repository URL for presentation
  const formattedRemote = remoteUrl
    ? remoteUrl.replace(/^https?:\/\/github\.com\//, 'github:').replace(/\.git$/, '')
    : 'Local repository only'

  return (
    <div className="sc-modal-overlay" onClick={isCommitting ? undefined : onClose}>
      <div className="sc-modal-card sc-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sc-modal-header">
          <div className="sc-confirm-modal-title">
            <span className="material-symbols-outlined sc-confirm-title-icon">
              {details.icon}
            </span>
            <span>{details.title}</span>
          </div>
          <button
            type="button"
            className="sc-btn-close-modal"
            onClick={onClose}
            disabled={isCommitting}
            title="Cancel"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="sc-modal-body sc-confirm-modal-body custom-scrollbar">
          {/* Action Notice */}
          <div className="sc-confirm-action-banner">
            <div className="sc-confirm-badge-row">
              <span className={`sc-action-badge ${details.badgeClass}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{details.icon}</span>
                {details.badge}
              </span>
              <span className="sc-branch-badge">
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>alt_route</span>
                {branch}
              </span>
            </div>
            <p className="sc-confirm-action-desc">{details.desc}</p>
          </div>

          {/* Destination Details */}
          <div className="sc-confirm-grid">
            <div className="sc-confirm-meta-row">
              <span className="sc-confirm-label">Target Repo:</span>
              <span className="sc-confirm-value sc-repo-url" title={remoteUrl || 'Local only'}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#94a3b8' }}>
                  {remoteUrl ? 'cloud' : 'folder'}
                </span>
                {formattedRemote}
              </span>
            </div>
            <div className="sc-confirm-meta-row">
              <span className="sc-confirm-label">Branch:</span>
              <span className="sc-confirm-value sc-bold">
                {branch}
              </span>
            </div>
          </div>

          {/* Commit Message Box */}
          <div className="sc-confirm-message-section">
            <div className="sc-confirm-section-label">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chat_bubble_outline</span>
              <span>Commit Message</span>
            </div>
            <div className="sc-confirm-message-box">
              {commitMessage.trim() ? (
                <div className="sc-confirm-message-text">{commitMessage.trim()}</div>
              ) : (
                <div className="sc-confirm-message-empty">
                  <em>(No message specified &mdash; amending with previous message)</em>
                </div>
              )}
            </div>
          </div>

          {/* Files to be committed */}
          <div className="sc-confirm-files-section">
            <div className="sc-confirm-files-header">
              <div className="sc-confirm-section-label">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>inventory_2</span>
                <span>Files to be Committed</span>
              </div>
              <span className="sc-files-count-badge">
                {filesToCommit.length} file{filesToCommit.length === 1 ? '' : 's'}
              </span>
            </div>

            {isAutoStaging && (
              <div className="sc-autostage-notice">
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#f59e0b' }}>info</span>
                <span>Staging is empty: all {unstagedChanges.length} uncommitted file(s) will be automatically staged.</span>
              </div>
            )}

            <div className="sc-confirm-files-list custom-scrollbar">
              {filesToCommit.length === 0 ? (
                <div className="sc-confirm-no-files">No changed files detected.</div>
              ) : (
                filesToCommit.map((file, idx) => {
                  const filePath = typeof file === 'string' ? file : (file.path || file.filePath || String(file))
                  const fileName = filePath.split(/[/\\]/).pop() || filePath
                  const fileDir = filePath.includes('/') || filePath.includes('\\')
                    ? filePath.substring(0, Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\')))
                    : ''
                  return (
                    <div key={idx} className="sc-confirm-file-row">
                      <span className="material-symbols-outlined sc-file-icon">description</span>
                      <span className="sc-file-name">{fileName}</span>
                      {fileDir && <span className="sc-file-dir">{fileDir}</span>}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="sc-modal-footer sc-confirm-modal-footer">
          <button
            type="button"
            className="sc-btn-secondary-modal"
            onClick={onClose}
            disabled={isCommitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="sc-btn-primary-modal sc-btn-confirm-action"
            onClick={onConfirm}
            disabled={isCommitting || (filesToCommit.length === 0 && actionType !== 'commit-amend')}
          >
            {isCommitting ? (
              <>
                <span className="material-symbols-outlined sc-spin-fast">progress_activity</span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">{details.icon}</span>
                <span>{details.buttonLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
