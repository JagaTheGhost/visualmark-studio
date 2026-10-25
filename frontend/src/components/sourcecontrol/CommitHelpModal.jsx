import React from 'react'

export default function CommitHelpModal({
  isOpen = false,
  onClose = () => {}
}) {
  if (!isOpen) return null

  return (
    <div className="sc-modal-overlay" onClick={onClose}>
      <div className="sc-modal-card sc-help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sc-modal-header">
          <div className="sc-help-modal-title">
            <span className="material-symbols-outlined" style={{ color: '#38bdf8', fontSize: '20px' }}>
              help
            </span>
            <span>Git Commit Guide & Command Help</span>
          </div>
          <button
            type="button"
            className="sc-btn-close-modal"
            onClick={onClose}
            title="Close Help"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="sc-modal-body sc-help-modal-body custom-scrollbar">
          {/* Section 1: What is a Commit Message? */}
          <div className="sc-help-section">
            <h4 className="sc-help-heading">
              <span className="material-symbols-outlined sc-help-icon">edit_note</span>
              What should you write in the Commit Message?
            </h4>
            <p className="sc-help-p">
              A <strong>Commit Message</strong> is a brief, human-readable summary of the changes you made in this checkpoint. It tells you and your collaborators <em>what</em> was added, fixed, or modified.
            </p>
            
            <div className="sc-help-tips-box">
              <div className="sc-help-tip-title">Recommended Best Practices:</div>
              <ul className="sc-help-list">
                <li><strong>Be concise & descriptive:</strong> e.g., <code>Add flowchart diagram to README</code> instead of just <code>update</code> or terminal commands.</li>
                <li><strong>Use Conventional Commits prefixes (optional but standard):</strong>
                  <div className="sc-help-prefix-grid">
                    <span className="sc-badge-prefix"><code>feat:</code> New feature or diagram</span>
                    <span className="sc-badge-prefix"><code>fix:</code> Bug fix or typo correction</span>
                    <span className="sc-badge-prefix"><code>docs:</code> Documentation or README edit</span>
                    <span className="sc-badge-prefix"><code>style:</code> Formatting, colors, or CSS</span>
                    <span className="sc-badge-prefix"><code>refactor:</code> Code cleanup without changing behavior</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2: Command Clarifications */}
          <div className="sc-help-section">
            <h4 className="sc-help-heading">
              <span className="material-symbols-outlined sc-help-icon">terminal</span>
              Understanding the Commit Actions
            </h4>
            
            <div className="sc-commands-grid">
              {/* 1. Commit */}
              <div className="sc-command-card">
                <div className="sc-command-header">
                  <span className="material-symbols-outlined sc-cmd-icon check">check</span>
                  <span className="sc-cmd-name">Commit</span>
                  <span className="sc-cmd-scope local">Local Only</span>
                </div>
                <p className="sc-cmd-desc">
                  Saves a snapshot of your staged changes locally on your computer in Git history.
                </p>
                <div className="sc-cmd-footer">
                  <span className="material-symbols-outlined">cloud_off</span>
                  <span><strong>Does NOT upload to GitHub</strong>. Safe to use while offline.</span>
                </div>
              </div>

              {/* 2. Commit & Push */}
              <div className="sc-command-card featured">
                <div className="sc-command-header">
                  <span className="material-symbols-outlined sc-cmd-icon push">upload</span>
                  <span className="sc-cmd-name">Commit & Push</span>
                  <span className="sc-cmd-scope remote">Local + GitHub</span>
                </div>
                <p className="sc-cmd-desc">
                  Saves the commit locally AND immediately uploads it to your remote GitHub repository.
                </p>
                <div className="sc-cmd-footer">
                  <span className="material-symbols-outlined">cloud_upload</span>
                  <span><strong>Live on GitHub</strong>. Requires an internet connection.</span>
                </div>
              </div>

              {/* 3. Commit & Sync */}
              <div className="sc-command-card">
                <div className="sc-command-header">
                  <span className="material-symbols-outlined sc-cmd-icon sync">swap_vert</span>
                  <span className="sc-cmd-name">Commit & Sync</span>
                  <span className="sc-cmd-scope remote">Two-Way Sync</span>
                </div>
                <p className="sc-cmd-desc">
                  Commits locally, pulls latest changes from remote (<code>git pull --rebase</code>), and then pushes your new commits to GitHub.
                </p>
                <div className="sc-cmd-footer">
                  <span className="material-symbols-outlined">sync</span>
                  <span>Prevents conflict when multiple teammates push to the same branch.</span>
                </div>
              </div>

              {/* 4. Commit (Amend) */}
              <div className="sc-command-card">
                <div className="sc-command-header">
                  <span className="material-symbols-outlined sc-cmd-icon amend">history</span>
                  <span className="sc-cmd-name">Commit (Amend)</span>
                  <span className="sc-cmd-scope rewrite">Rewrites Last Commit</span>
                </div>
                <p className="sc-cmd-desc">
                  Updates or replaces the <strong>very latest commit</strong> with your current changes and message instead of creating a brand new commit.
                </p>
                <div className="sc-cmd-footer">
                  <span className="material-symbols-outlined">info</span>
                  <span>Great for fixing a quick typo or adding a forgotten file to the last commit.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sc-modal-footer">
          <button
            type="button"
            className="sc-btn-primary-modal"
            onClick={onClose}
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  )
}
