import React, { useRef, useEffect } from 'react'

export default function CommitBox({
  branch = 'main',
  commitMessage = '',
  setCommitMessage = () => {},
  isCommitting = false,
  totalChangesCount = 0,
  commitAction = 'commit',
  setCommitAction = () => {},
  isSplitMenuOpen = false,
  setIsSplitMenuOpen = () => {},
  onInitiateCommit = () => {},
  onOpenHelp = () => {}
}) {
  const menuRef = useRef(null)

  // Close split dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsSplitMenuOpen(false)
      }
    }
    if (isSplitMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSplitMenuOpen, setIsSplitMenuOpen])

  const getCommitButtonLabel = () => {
    if (isCommitting) {
      switch (commitAction) {
        case 'commit-push': return 'Committing & Pushing...'
        case 'commit-sync': return 'Syncing with Remote...'
        case 'commit-amend': return 'Amending Commit...'
        default: return 'Committing...'
      }
    }
    switch (commitAction) {
      case 'commit-push': return 'Commit & Push'
      case 'commit-sync': return 'Commit & Sync'
      case 'commit-amend': return 'Commit (Amend)'
      default: return 'Commit'
    }
  }

  const getCommitIcon = () => {
    if (isCommitting) return 'progress_activity'
    switch (commitAction) {
      case 'commit-push': return 'upload'
      case 'commit-sync': return 'swap_vert'
      case 'commit-amend': return 'history'
      default: return 'check'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (!isCommitting) {
        onInitiateCommit(commitAction)
      }
    }
  }

  return (
    <div className="sc-commit-container">
      {/* Header Row: Label & Help "?" Button */}
      <div className="sc-commit-header-row">
        <label className="sc-commit-label">
          <span>Commit Message</span>
          <span className="sc-branch-indicator" title={`Current active branch: ${branch}`}>
            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>alt_route</span>
            {branch}
          </span>
        </label>
        <button
          type="button"
          className="sc-btn-help-trigger"
          onClick={onOpenHelp}
          title="What is a commit message? Learn about Commit, Push, Sync & Amend"
        >
          <span className="material-symbols-outlined sc-help-icon-symbol">help</span>
          <span>Help & Commands</span>
        </button>
      </div>

      {/* Commit Message Textarea */}
      <div className="sc-commit-input-wrapper">
        <textarea
          className="sc-commit-textarea custom-scrollbar"
          placeholder={`Describe your changes (Ctrl+Enter to commit on "${branch}")...`}
          rows={2}
          value={commitMessage}
          disabled={isCommitting}
          onChange={(e) => setCommitMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Split Commit Button: Primary button + Dropdown caret */}
      <div className="sc-split-commit-group sc-dropdown-container" ref={menuRef}>
        <button
          type="button"
          className={`sc-btn-primary-commit ${isCommitting ? 'is-loading' : ''}`}
          disabled={isCommitting || (totalChangesCount === 0 && commitAction !== 'commit-amend')}
          onClick={() => onInitiateCommit(commitAction)}
          title={`Review & Execute: ${getCommitButtonLabel()} (Ctrl+Enter)`}
        >
          <span className={`material-symbols-outlined sc-commit-icon ${isCommitting ? 'sc-spin-fast' : ''}`}>
            {getCommitIcon()}
          </span>
          <span>{getCommitButtonLabel()}</span>
        </button>

        <button
          type="button"
          className="sc-btn-split-toggle"
          disabled={isCommitting}
          onClick={(e) => {
            e.stopPropagation()
            setIsSplitMenuOpen((prev) => !prev)
          }}
          title="Select Commit Action (Commit, Push, Sync, Amend)"
        >
          <span className="material-symbols-outlined">expand_more</span>
        </button>

        {/* Dropdown Options: FIX: Selecting an option ONLY changes the mode, never accidentally executes! */}
        {isSplitMenuOpen && (
          <div className="sc-dropdown-menu sc-split-menu">
            <button
              type="button"
              className={`sc-split-menu-item ${commitAction === 'commit' ? 'selected' : ''}`}
              onClick={() => {
                setCommitAction('commit')
                setIsSplitMenuOpen(false)
              }}
            >
              <span className="material-symbols-outlined">check</span>
              <div className="sc-split-menu-text">
                <span className="sc-split-item-title">Commit</span>
                <span className="sc-split-item-subtitle">Save snapshot locally (No remote push)</span>
              </div>
            </button>

            <button
              type="button"
              className={`sc-split-menu-item ${commitAction === 'commit-push' ? 'selected' : ''}`}
              onClick={() => {
                setCommitAction('commit-push')
                setIsSplitMenuOpen(false)
              }}
            >
              <span className="material-symbols-outlined">upload</span>
              <div className="sc-split-menu-text">
                <span className="sc-split-item-title">Commit &amp; Push</span>
                <span className="sc-split-item-subtitle">Commit and immediately upload to GitHub</span>
              </div>
            </button>

            <button
              type="button"
              className={`sc-split-menu-item ${commitAction === 'commit-sync' ? 'selected' : ''}`}
              onClick={() => {
                setCommitAction('commit-sync')
                setIsSplitMenuOpen(false)
              }}
            >
              <span className="material-symbols-outlined">swap_vert</span>
              <div className="sc-split-menu-text">
                <span className="sc-split-item-title">Commit &amp; Sync</span>
                <span className="sc-split-item-subtitle">Pull updates from GitHub and push commits</span>
              </div>
            </button>

            <button
              type="button"
              className={`sc-split-menu-item ${commitAction === 'commit-amend' ? 'selected' : ''}`}
              onClick={() => {
                setCommitAction('commit-amend')
                setIsSplitMenuOpen(false)
              }}
            >
              <span className="material-symbols-outlined">history</span>
              <div className="sc-split-menu-text">
                <span className="sc-split-item-title">Commit (Amend)</span>
                <span className="sc-split-item-subtitle">Update and rewrite the last commit</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Active Progress Banner while Git is working with Remote */}
      {isCommitting && (
        <div className="sc-commit-progress-banner">
          <span className="material-symbols-outlined sc-spin-fast">sync</span>
          <div className="sc-progress-info">
            <span className="sc-progress-title">
              {commitAction === 'commit-push' ? 'Pushing commits to remote GitHub...' :
               commitAction === 'commit-sync' ? 'Syncing with remote GitHub repository...' :
               commitAction === 'commit-amend' ? 'Amending previous commit...' :
               'Creating Git commit...'}
            </span>
            <span className="sc-progress-sub">Please wait, contacting repository...</span>
          </div>
        </div>
      )}
    </div>
  )
}
