import React from 'react'
import { APP_CURRENT_VERSION } from '../data/releaseNotes'
import { useI18n } from '../i18n/I18nContext'
import { openAboutModal } from '../utils/sponsorGratitude'

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
  onRestartToUpdate = () => {},
  onOpenSettings = () => {},
  onOpenAbout = null
}) {
  const { t, currentLanguage } = useI18n()
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200))
  const isGitRepo = gitInfo?.isRepo ?? false
  const branchName = isGitRepo ? gitInfo.branch : t('statusBar.noRepo', 'No Repo')

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

        {/* System Output & Logs Button */}
        <div
          className="status-item output-status-btn"
          onClick={() => onToggleBottomPanel('output')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
          data-tooltip="Toggle System Output & Diagnostics (Ctrl+`)"
          data-tooltip-pos="top"
        >
          <span className="material-symbols-outlined status-icon" style={{ fontSize: '14px' }}>output</span>
          <span className="hide-mobile">Output</span>
        </div>

        {/* Position & Typography details */}
        <div
          className="status-item cursor-pos hide-tablet"
          data-tooltip="Go to Line/Column"
          data-tooltip-pos="top"
        >
          <span>{t('statusBar.lines', 'Ln')} {cursorPosition.line}, {t('statusBar.cols', 'Col')} {cursorPosition.col}</span>
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
          <span>{wordCount.toLocaleString()} {t('statusBar.words', 'words')}</span>
        </div>
      </div>


      {/* Right Cluster */}
      <div className="status-cluster-right">
        {/* Estimated Reading Time */}
        <div className="status-item hide-mobile" data-tooltip="Estimated Document Reading Time" data-tooltip-pos="top">
          <span>⏱️ ~{readMinutes} {t('statusBar.readTime', 'min read')}</span>
        </div>

        {/* Character Count */}
        <div className="status-item hide-tablet" data-tooltip="Total Characters in Active Document" data-tooltip-pos="top">
          <span>{charCount.toLocaleString()} {t('statusBar.chars', 'chars')}</span>
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
              <span className="hide-mobile text-amber">{t('statusBar.unsaved', 'Unsaved')}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined status-icon text-emerald">check_circle</span>
              <span className="hide-mobile">{t('statusBar.saved', 'Saved')}</span>
            </>
          )}
        </div>

        {/* Live Update Downloading Circular Progress Indicator */}
        {updateProgress && !updateDownloaded && (() => {
          const rawPercent = updateProgress.percent || 0
          const percent = Math.min(100, Math.max(0, Math.round(rawPercent)))
          const radius = 9.5
          const circumference = 2 * Math.PI * radius
          const offset = circumference - (percent / 100) * circumference
          const transferredMb = Math.round((updateProgress.transferred || 0) / 1048576)
          const totalMb = Math.round((updateProgress.total || 0) / 1048576)
          const speedMb = updateProgress.bytesPerSecond ? ` • ${(updateProgress.bytesPerSecond / 1048576).toFixed(1)} MB/s` : ''

          return (
            <div
              className="status-item update-progress-badge"
              data-tooltip={`Downloading update: ${percent}% (${transferredMb} MB / ${totalMb} MB${speedMb})`}
              data-tooltip-pos="top"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                borderRadius: '12px',
                padding: '1px 7px 1px 4px',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'default',
                userSelect: 'none'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  style={{
                    transform: 'rotate(-90deg)',
                    display: 'block'
                  }}
                >
                  {/* Background Track */}
                  <circle
                    cx="12"
                    cy="12"
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="2.2"
                  />
                  {/* Progress Arc */}
                  <circle
                    cx="12"
                    cy="12"
                    r={radius}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.2"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dashoffset 0.25s ease-out'
                    }}
                  />
                </svg>
                {/* Percentage Centered Inside Circle */}
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: percent >= 100 ? '6.5px' : '7.5px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono, monospace)',
                    color: '#38bdf8',
                    letterSpacing: '-0.5px',
                    lineHeight: 1
                  }}
                >
                  {percent}%
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 500 }}>
                Updating
              </span>
            </div>
          )
        })()}

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

        {/* Language Switcher Pill */}
        <div
          className="status-item language-pill"
          onClick={() => onOpenSettings('appearance')}
          data-tooltip={`VisualMark Studio Language: ${currentLanguage?.label || 'English'} (Click to change in Settings)`}
          data-tooltip-pos="top"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <span>{currentLanguage?.flag || '🌐'} {currentLanguage?.code?.toUpperCase() || 'EN'}</span>
        </div>

                {/* Community & Bug Feedback Expandable Chat Icon (near version pill) */}
        <a
          href="https://github.com/JagaTheGhost/visualmark-studio/discussions"
          target="_blank"
          rel="noreferrer"
          className="status-item status-community-expandable"
          data-tooltip="This is an open-source project under active development. Bugs, issues, and other user-related problems may occur — please share your experience with the VisualMark community so the developers can resolve your problems!"
          data-tooltip-pos="top"
        >
          <span className="material-symbols-outlined status-icon">chat</span>
          <span className="community-expand-label">Bugs & Feedback</span>
        </a>

        {/* Sponsor / Fuel Project Expandable Heart Icon */}
        <div
          className="status-item status-sponsor-expandable"
          onClick={onOpenAbout || openAboutModal}
          data-tooltip="💖 Support VisualMark Studio & JagaTheGhost on GitHub Sponsors"
          data-tooltip-pos="top"
          role="button"
          tabIndex={0}
        >
          <span className="material-symbols-outlined status-icon">favorite</span>
          <span className="sponsor-expand-label">Sponsor</span>
        </div>

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
