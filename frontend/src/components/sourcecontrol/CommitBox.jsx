import React from 'react'

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
  onExecuteCommit = () => {}
}) {
  const getCommitButtonLabel = () => {
    switch (commitAction) {
      case 'commit-push': return 'Commit & Push'
      case 'commit-sync': return 'Commit & Sync'
      case 'commit-amend': return 'Commit (Amend)'
      default: return 'Commit'
    }
  }

  return (
    <div className="sc-commit-container">
      <div className="sc-commit-input-wrapper">
        <textarea
          className="sc-commit-textarea custom-scrollbar"
          placeholder={`Message (Ctrl+Enter to commit on "${branch}"...)`}
          rows={2}
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              onExecuteCommit()
            }
          }}
        />
      </div>

      {/* Split Commit Button: Primary button + Dropdown caret */}
      <div className="sc-split-commit-group sc-dropdown-container">
        <button
          type="button"
          className="sc-btn-primary-commit"
          disabled={isCommitting || (totalChangesCount === 0 && commitAction !== 'commit-amend')}
          onClick={() => onExecuteCommit(commitAction)}
          title={`Execute: ${getCommitButtonLabel()} (Ctrl+Enter)`}
        >
          <span className="material-symbols-outlined sc-commit-icon">check</span>
          <span>{isCommitting ? 'Committing...' : getCommitButtonLabel()}</span>
        </button>

        <button
          type="button"
          className="sc-btn-split-toggle"
          disabled={isCommitting}
          onClick={(e) => {
            e.stopPropagation()
            setIsSplitMenuOpen((prev) => !prev)
          }}
          title="Select Commit Action"
        >
          <span className="material-symbols-outlined">expand_more</span>
        </button>

        {isSplitMenuOpen && (
          <div className="sc-dropdown-menu sc-split-menu">
            <button
              type="button"
              className={commitAction === 'commit' ? 'selected' : ''}
              onClick={() => {
                setCommitAction('commit')
                setIsSplitMenuOpen(false)
                onExecuteCommit('commit')
              }}
            >
              <span className="material-symbols-outlined">check</span> Commit
            </button>
            <button
              type="button"
              className={commitAction === 'commit-push' ? 'selected' : ''}
              onClick={() => {
                setCommitAction('commit-push')
                setIsSplitMenuOpen(false)
                onExecuteCommit('commit-push')
              }}
            >
              <span className="material-symbols-outlined">upload</span> Commit & Push
            </button>
            <button
              type="button"
              className={commitAction === 'commit-sync' ? 'selected' : ''}
              onClick={() => {
                setCommitAction('commit-sync')
                setIsSplitMenuOpen(false)
                onExecuteCommit('commit-sync')
              }}
            >
              <span className="material-symbols-outlined">swap_vert</span> Commit & Sync
            </button>
            <button
              type="button"
              className={commitAction === 'commit-amend' ? 'selected' : ''}
              onClick={() => {
                setCommitAction('commit-amend')
                setIsSplitMenuOpen(false)
                onExecuteCommit('commit-amend')
              }}
            >
              <span className="material-symbols-outlined">history</span> Commit (Amend)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
