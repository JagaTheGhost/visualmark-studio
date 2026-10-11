import React, { useState } from 'react'

/**
 * SourceControlDrawer
 * VS Code-style Git / Source Control sidebar panel.
 * Displays current repository branch, uncommitted modified/untracked files,
 * commit message input, stage, commit, and refresh operations.
 */
export default function SourceControlDrawer({
  gitInfo = null,
  workspaceDirectory = null,
  onRefreshGit = () => {},
  onSelectFile = () => {},
  isRefreshing = false
}) {
  const [commitMessage, setCommitMessage] = useState('')
  const [isCommitting, setIsCommitting] = useState(false)
  const [isStaging, setIsStaging] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const isRepo = gitInfo?.isRepo ?? false
  const branch = gitInfo?.branch || 'main'
  const changes = gitInfo?.changes || []
  const latestCommit = gitInfo?.latestCommit

  const handleStageAll = async () => {
    if (!window.electronAPI?.gitStageAll || !workspaceDirectory) return
    setIsStaging(true)
    setFeedback(null)
    try {
      const res = await window.electronAPI.gitStageAll(workspaceDirectory)
      if (res?.success) {
        setFeedback({ type: 'success', message: 'All changes staged into git index.' })
        onRefreshGit()
      } else {
        setFeedback({ type: 'error', message: res?.error || 'Failed to stage changes.' })
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    } finally {
      setIsStaging(false)
    }
  }

  const handleCommit = async (e) => {
    if (e) e.preventDefault()
    if (!commitMessage.trim()) {
      setFeedback({ type: 'error', message: 'Please enter a commit message.' })
      return
    }
    if (!window.electronAPI?.gitCommit || !workspaceDirectory) return

    setIsCommitting(true)
    setFeedback(null)
    try {
      // Auto stage all if not staged, or commit directly
      await window.electronAPI.gitStageAll?.(workspaceDirectory)
      const res = await window.electronAPI.gitCommit(workspaceDirectory, commitMessage.trim())
      if (res?.success) {
        setFeedback({ type: 'success', message: 'Committed successfully.' })
        setCommitMessage('')
        onRefreshGit()
      } else {
        setFeedback({ type: 'error', message: res?.error || 'Commit failed.' })
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    } finally {
      setIsCommitting(false)
    }
  }

  const handleInitRepo = async () => {
    if (!window.electronAPI?.gitInit || !workspaceDirectory) return
    setFeedback(null)
    try {
      const res = await window.electronAPI.gitInit(workspaceDirectory)
      if (res?.success) {
        setFeedback({ type: 'success', message: 'Initialized empty Git repository!' })
        onRefreshGit()
      } else {
        setFeedback({ type: 'error', message: res?.error || 'Failed to initialize git repository.' })
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'M': return '#f59e0b' // modified amber
      case 'U': return '#10b981' // untracked green
      case 'A': return '#38bdf8' // added cyan
      case 'D': return '#ef4444' // deleted red
      case 'R': return '#a855f7' // renamed purple
      default: return '#94a3b8'
    }
  }

  return (
    <div className="source-control-drawer">
      {/* Top Header Controls */}
      <div className="sc-header-bar">
        <span className="sc-header-title">SOURCE CONTROL</span>
        <div className="sc-header-actions">
          <button
            type="button"
            className="sc-icon-btn"
            onClick={onRefreshGit}
            title="Refresh Git Status"
            disabled={isRefreshing}
          >
            <span className={`material-symbols-outlined ${isRefreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
          </button>
        </div>
      </div>

      {!isRepo ? (
        <div className="sc-not-repo-card">
          <div className="sc-empty-icon-wrap">
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#64748b' }}>
              fork_right
            </span>
          </div>
          <p className="sc-not-repo-title">Not a Git Repository</p>
          <p className="sc-not-repo-desc">
            The currently opened workspace directory is not yet initialized with Git version control.
          </p>
          {workspaceDirectory && window.electronAPI?.gitInit && (
            <button
              type="button"
              className="sc-btn-init"
              onClick={handleInitRepo}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_circle</span>
              <span>Initialize Git Repository</span>
            </button>
          )}
        </div>
      ) : (
        <div className="sc-body-content">
          {/* Branch & Head Indicator */}
          <div className="sc-repo-summary">
            <div className="sc-branch-row">
              <span className="material-symbols-outlined sc-branch-icon">fork_right</span>
              <span className="sc-branch-name" title={`Current Branch: ${branch}`}>{branch}</span>
              {changes.length > 0 ? (
                <span className="sc-changes-pill" title={`${changes.length} uncommitted changes`}>
                  {changes.length} pending
                </span>
              ) : (
                <span className="sc-clean-pill">Clean</span>
              )}
            </div>
            {latestCommit && (
              <p className="sc-latest-commit" title={latestCommit}>
                {latestCommit}
              </p>
            )}
          </div>

          {/* Commit Message Box */}
          <form className="sc-commit-form" onSubmit={handleCommit}>
            <div className="sc-commit-box-wrap">
              <textarea
                className="sc-commit-input custom-scrollbar"
                placeholder="Message (Ctrl+Enter to commit)"
                rows={2}
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault()
                    handleCommit()
                  }
                }}
              />
            </div>

            <div className="sc-commit-actions">
              <button
                type="submit"
                className="sc-btn-commit"
                disabled={isCommitting || !commitMessage.trim()}
                title="Commit staged changes"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  {isCommitting ? 'hourglass_empty' : 'check'}
                </span>
                <span>{isCommitting ? 'Committing...' : 'Commit'}</span>
              </button>

              <button
                type="button"
                className="sc-btn-stage-all"
                onClick={handleStageAll}
                disabled={isStaging || changes.length === 0}
                title="Stage all modified and untracked files"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  {isStaging ? 'hourglass_empty' : 'done_all'}
                </span>
                <span>Stage All</span>
              </button>
            </div>
          </form>

          {/* Status Feedback Notification */}
          {feedback && (
            <div className={`sc-feedback-pill ${feedback.type}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                {feedback.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Changes Section */}
          <div className="sc-changes-section">
            <div className="sc-changes-header">
              <span className="sc-section-title">CHANGES</span>
              <span className="sc-section-count">{changes.length}</span>
            </div>

            {changes.length === 0 ? (
              <div className="sc-no-changes">
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#10b981' }}>
                  verified
                </span>
                <span>Working tree clean. No pending changes.</span>
              </div>
            ) : (
              <div className="sc-changes-list custom-scrollbar">
                {changes.map((item) => (
                  <div
                    key={item.path}
                    className="sc-change-item"
                    onClick={() => onSelectFile(item.fullPath || item.path)}
                    title={`${item.path} (${item.label}) - Click to open`}
                  >
                    <span className="sc-file-icon material-symbols-outlined">
                      draft
                    </span>
                    <span className="sc-file-name truncate">{item.name}</span>
                    <span className="sc-file-dir truncate">
                      {item.path.includes('/') ? item.path.substring(0, item.path.lastIndexOf('/')) : ''}
                    </span>
                    <span
                      className="sc-status-badge"
                      style={{ color: getStatusColor(item.status) }}
                      title={item.label}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
