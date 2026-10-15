import { Suspense, lazy } from 'react'
import CloneRepoModal from '../modals/CloneRepoModal'

const CommandPalette = lazy(() => import('../modals/CommandPalette'))
const InsertTargetModal = lazy(() => import('../modals/InsertTargetModal'))

/**
 * AppModals - encapsulates all modal dialogs and overlays for the IDE
 */
export default function AppModals({
  commandPaletteOpen,
  setCommandPaletteOpen,
  commands,
  handleOpenShortcutsTab,
  showToast,
  insertModalState,
  setInsertModalState,
  openDocTabs,
  lastActiveDocRef,
  fileCursorPositions,
  handleExecuteInsertSnippet,
  handleInsertIntoNewDoc,
  pendingUpdateInfo,
  setPendingUpdateInfo,
  handleStartDownloadUpdate,
  showInitialUpdateModal,
  setShowInitialUpdateModal,
  autoDownloadUpdates,
  setAutoDownloadUpdates,
  handleToggleAutoDownloadUpdates,
  isCloneModalOpen,
  setIsCloneModalOpen,
  openWorkspaceDirectory,
  workspaceDirectory
}) {
  return (
    <>
      {/* Command Palette Modal */}
      {commandPaletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
            commands={commands}
            onConfigureKeybinding={(cmd) => {
              setCommandPaletteOpen(false)
              handleOpenShortcutsTab?.(cmd.title || '', cmd.id)
              showToast?.(`Configure shortcut for: ${cmd.title}`, 'info')
            }}
          />
        </Suspense>
      )}

      {/* Dynamic Snippet Insertion Target Selection Modal */}
      {insertModalState?.isOpen && (
        <Suspense fallback={null}>
          <InsertTargetModal
            isOpen={insertModalState.isOpen}
            onClose={() => setInsertModalState({ isOpen: false, snippet: '', snippetType: '' })}
            snippet={insertModalState.snippet}
            snippetType={insertModalState.snippetType}
            openDocTabs={openDocTabs}
            lastActiveDoc={lastActiveDocRef?.current}
            fileCursorPositions={fileCursorPositions?.current}
            onConfirm={(targetFile) => handleExecuteInsertSnippet(targetFile, insertModalState.snippet, insertModalState.snippetType)}
            onCreateNewDoc={() => handleInsertIntoNewDoc(insertModalState.snippet, insertModalState.snippetType)}
          />
        </Suspense>
      )}

      {/* Update Available Confirmation Dialog (When auto-download is disabled) */}
      {pendingUpdateInfo && (
        <div className="ide-update-prompt-overlay" onClick={() => setPendingUpdateInfo(null)}>
          <div className="ide-update-prompt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ide-update-prompt-header">
              <div className="ide-update-prompt-title">
                <span className="material-symbols-outlined" style={{ color: '#38bdf8', fontSize: '20px' }}>system_update</span>
                <h3>Update Available (v{pendingUpdateInfo.version})</h3>
              </div>
              <button
                type="button"
                className="ide-update-prompt-close"
                onClick={() => setPendingUpdateInfo(null)}
                title="Dismiss"
              >
                ✕
              </button>
            </div>
            <div className="ide-update-prompt-body">
              <p>
                A new version of VisualMark Studio (<strong>v{pendingUpdateInfo.version}</strong>) is ready to download.
              </p>
              <p className="ide-update-prompt-sub">
                Would you like to start downloading this update now? You can continue working in the editor while it downloads in the background.
              </p>
            </div>
            <div className="ide-update-prompt-actions">
              <button
                type="button"
                className="ide-update-prompt-btn secondary"
                onClick={() => {
                  setPendingUpdateInfo(null)
                  showToast?.('Update postponed.', 'info', { source: 'Update', minor: true })
                }}
              >
                Later
              </button>
              <button
                type="button"
                className="ide-update-prompt-btn primary"
                onClick={() => handleStartDownloadUpdate(pendingUpdateInfo)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
                Download Update Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* First Startup: Ask user for Auto vs Manual Update preference */}
      {showInitialUpdateModal && (
        <div className="ide-update-prompt-overlay">
          <div className="ide-update-prompt-modal startup-mode-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ide-update-prompt-header">
              <div className="ide-update-prompt-title">
                <span className="material-symbols-outlined" style={{ color: '#38bdf8', fontSize: '20px' }}>
                  system_update
                </span>
                <h3>Software Update Preference</h3>
              </div>
            </div>

            <div className="ide-update-prompt-body">
              <p style={{ fontSize: '13px', color: '#e4e4e7', marginBottom: '6px' }}>
                Welcome to <strong>VisualMark Studio</strong>! How would you like the application to handle software updates?
              </p>

              <div className="startup-update-choices">
                <div
                  className={`startup-update-card ${autoDownloadUpdates ? 'is-selected' : ''}`}
                  onClick={() => setAutoDownloadUpdates(true)}
                >
                  <div className="startup-update-card-radio">
                    <span className="material-symbols-outlined" style={{ color: autoDownloadUpdates ? '#38bdf8' : '#71717a' }}>
                      {autoDownloadUpdates ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <div className="startup-update-card-content">
                    <div className="startup-update-card-title">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#38bdf8' }}>bolt</span>
                      <span>Automatic Updates (Recommended)</span>
                    </div>
                    <div className="startup-update-card-desc">
                      VisualMark Studio checks and downloads new releases silently in the background, then notifies you when ready to restart.
                    </div>
                  </div>
                </div>

                <div
                  className={`startup-update-card ${!autoDownloadUpdates ? 'is-selected' : ''}`}
                  onClick={() => setAutoDownloadUpdates(false)}
                >
                  <div className="startup-update-card-radio">
                    <span className="material-symbols-outlined" style={{ color: !autoDownloadUpdates ? '#38bdf8' : '#71717a' }}>
                      {!autoDownloadUpdates ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <div className="startup-update-card-content">
                    <div className="startup-update-card-title">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#a1a1aa' }}>touch_app</span>
                      <span>Manual Updates</span>
                    </div>
                    <div className="startup-update-card-desc">
                      VisualMark Studio notifies you when an update is available and asks for your confirmation before downloading.
                    </div>
                  </div>
                </div>
              </div>

              <p className="ide-update-prompt-sub" style={{ marginTop: '8px' }}>
                💡 You can change this setting anytime under <strong>Settings &gt; Application Updates</strong>.
              </p>
            </div>

            <div className="ide-update-prompt-actions">
              <button
                type="button"
                className="ide-update-prompt-btn primary"
                onClick={() => {
                  handleToggleAutoDownloadUpdates(autoDownloadUpdates)
                  try {
                    localStorage.setItem('vm_update_mode_configured', 'true')
                  } catch {}
                  setShowInitialUpdateModal(false)
                }}
              >
                <span>Confirm Preference</span>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Git Clone Modal */}
      <CloneRepoModal
        isOpen={isCloneModalOpen}
        onClose={() => setIsCloneModalOpen(false)}
        onWorkspaceOpened={async (destPath, folderName) => {
          await openWorkspaceDirectory(destPath, folderName)
        }}
        showToast={showToast}
        initialParentDir={workspaceDirectory?.path ? workspaceDirectory.path.replace(/[\\/][^\\/]+$/, '') : ''}
      />
    </>
  )
}
