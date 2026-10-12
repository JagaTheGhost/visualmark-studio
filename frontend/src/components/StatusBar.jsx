import React from 'react'
import { APP_CURRENT_VERSION } from '../data/releaseNotes'

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
  onToggleBottomPanel = () => {},
  currentVersion = APP_CURRENT_VERSION,
  updateDownloaded = null,
  updateProgress = null,
  updateError = null,
  onOpenWhatsNew = () => {},
  onRestartToUpdate = () => {}
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

        {/* Live Update Downloading Progress Indicator */}
        {updateProgress && !updateDownloaded && (
          <div
            className="status-item update-progress-badge"
            data-tooltip={`Downloading update: ${updateProgress.percent || 0}% (${Math.round((updateProgress.transferred || 0) / 1048576)} MB / ${Math.round((updateProgress.total || 0) / 1048576)} MB${updateProgress.bytesPerSecond ? ` • ${(updateProgress.bytesPerSecond / 1048576).toFixed(1)} MB/s` : ''})`}
            data-tooltip-pos="top"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              borderRadius: '4px',
              padding: '1px 8px',
              fontSize: '11px',
              fontWeight: 500
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '13px', animation: 'spin 1.5s linear infinite' }}>sync</span>
            <span>Downloading {updateProgress.percent || 0}%</span>
            {updateProgress.total > 0 && (
              <span style={{ opacity: 0.75, fontSize: '10px' }}>
                ({Math.round((updateProgress.transferred || 0) / 1048576)}/{Math.round(updateProgress.total / 1048576)}MB)
              </span>
            )}
          </div>
        )}

        {/* Update Download Error Indicator */}
        {updateError && !updateDownloaded && !updateProgress && (
          <div
            className="status-item update-error-badge"
            data-tooltip={`Update error: ${updateError}`}
            data-tooltip-pos="top"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#ef4444',
              borderRadius: '4px',
              padding: '1px 8px',
              fontSize: '11px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>error</span>
            <span>Update Error</span>
          </div>
        )}

        {/* Update Downloaded Badge (Pulsing, Click to restart) */}
        {updateDownloaded && (
          <div
            className="status-item update-ready-badge"
            onClick={onRestartToUpdate}
            data-tooltip={`Update v${updateDownloaded.version} ready. Click to restart & apply update.`}
            data-tooltip-pos="top"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>bolt</span>
            <span>Update v{updateDownloaded.version}</span>
          </div>
        )}

        {/* Version Pill (Click to open Release Notes tab) */}
        <div
          className="status-item version-pill"
          onClick={onOpenWhatsNew}
          data-tooltip={`VisualMark Studio v${currentVersion} (Click to open release notes tab)`}
          data-tooltip-pos="top"
        >
          <span>v{currentVersion}</span>
        </div>
      </div>
    </footer>
  )
}
