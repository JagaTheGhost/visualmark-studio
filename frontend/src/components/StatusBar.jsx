import React from 'react'

export default function StatusBar({
  cursorPosition = { line: 1, col: 1 },
  charCount = 0,
  wordCount = 0,
  loading = false,
  error = '',
  errorCount = 0,
  warningCount = 0,
  isDirty = false,
  gitInfo = null,
  onOpenGitTab = () => {},
  isBottomPanelOpen = false,
  onToggleBottomPanel = () => {}
}) {
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200))
  const isGitRepo = gitInfo?.isRepo ?? false
  const branchName = isGitRepo ? gitInfo.branch : 'No Repo'
  const hasChanges = isGitRepo && (gitInfo.hasChanges || gitInfo.changesCount > 0)
  const gitTooltip = isGitRepo
    ? `Git Branch: ${branchName}${hasChanges ? ` (${gitInfo.changesCount} uncommitted changes)` : ' (clean)'}`
    : 'No Git repository in current workspace (Click to open Source Control)'

  const totalErrors = error ? Math.max(1, errorCount) : errorCount

  return (
    <footer className="ide-status-bar select-none">
      {/* Left Cluster */}
      <div className="status-cluster-left">
        {/* Git Branch */}
        <div
          className={`status-item git-branch ${isGitRepo ? 'is-active-repo' : 'no-repo'}`}
          onClick={onOpenGitTab}
          data-tooltip={gitTooltip}
          data-tooltip-pos="top"
          style={{ cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined status-icon">fork_right</span>
          <span>{branchName}{hasChanges ? '*' : ''}</span>
        </div>

        {/* Combined Diagnostics Button (Errors & Warnings as one unified button like VS Code / Antigravity) */}
        <div
          className={`status-item status-diagnostics-btn ${totalErrors > 0 ? 'has-error' : ''} ${warningCount > 0 ? 'has-warning' : ''}`}
          onClick={() => onToggleBottomPanel('problems')}
          style={{ cursor: 'pointer' }}
          data-tooltip={`Problems: ${totalErrors} error${totalErrors === 1 ? '' : 's'}, ${warningCount} warning${warningCount === 1 ? '' : 's'} (Click to toggle)`}
          data-tooltip-pos="top"
        >
          <span className={`diag-segment ${totalErrors > 0 ? 'has-error' : ''}`}>
            <span className="material-symbols-outlined status-icon" style={{ fontSize: '13px' }}>cancel</span>
            <span>{totalErrors}</span>
          </span>
          <span className={`diag-segment ${warningCount > 0 ? 'text-amber' : ''}`}>
            <span className="material-symbols-outlined status-icon text-amber" style={{ fontSize: '13px' }}>warning</span>
            <span>{warningCount}</span>
          </span>
        </div>

        {/* Integrated Terminal Button */}
        <div
          className="status-item terminal-status-btn"
          onClick={() => onToggleBottomPanel('terminal')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
          data-tooltip="Toggle Integrated Terminal (Ctrl+`)"
          data-tooltip-pos="top"
        >
          <span className="material-symbols-outlined status-icon" style={{ fontSize: '14px' }}>terminal</span>
          <span className="hide-mobile">Terminal</span>
        </div>

        {/* Position & Typography details */}
        <div
          className="status-item cursor-pos hide-tablet"
          data-tooltip="Go to Line/Column"
          data-tooltip-pos="top"
        >
          <span>Ln {cursorPosition.line}, Col {cursorPosition.col}</span>
        </div>

        <div className="status-item hide-mobile" data-tooltip="Select Indentation" data-tooltip-pos="top">
          <span>Spaces: 2</span>
        </div>

        <div className="status-item hide-mobile" data-tooltip="Select Encoding" data-tooltip-pos="top">
          <span>UTF-8</span>
        </div>

        <div className="status-item format-badge" data-tooltip="Select Language Mode" data-tooltip-pos="top">
          <span className="lang-dot"></span>
          <span>Markdown</span>
        </div>

        <div className="status-item stats-badge hide-tablet" data-tooltip="Total Words in Active Document" data-tooltip-pos="top">
          <span>{wordCount.toLocaleString()} words</span>
        </div>
      </div>

      {/* Right Cluster */}
      <div className="status-cluster-right">
        {/* Estimated Reading Time */}
        <div className="status-item hide-mobile" data-tooltip="Estimated Document Reading Time" data-tooltip-pos="top">
          <span>⏱️ ~{readMinutes} min read</span>
        </div>

        {/* Character Count */}
        <div className="status-item hide-tablet" data-tooltip="Total Characters in Active Document" data-tooltip-pos="top">
          <span>{charCount.toLocaleString()} chars</span>
        </div>

        {/* Auto-save & Dirty Status */}
        <div
          className="status-item sync-status"
          data-tooltip={isDirty ? "Unsaved changes in active buffer (Ctrl+S to save)" : "All modifications saved to disk"}
          data-tooltip-pos="top"
        >
          {isDirty ? (
            <>
              <span className="material-symbols-outlined status-icon text-amber">pending</span>
              <span className="hide-mobile text-amber">Unsaved</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined status-icon text-emerald">check_circle</span>
              <span className="hide-mobile">Saved</span>
            </>
          )}
        </div>
      </div>
    </footer>
  )
}
