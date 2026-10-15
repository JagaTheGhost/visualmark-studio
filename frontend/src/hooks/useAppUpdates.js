import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook to manage Electron auto-updates, preferences, and update dialog states.
 */
export function useAppUpdates({ appVersion, showToast, handleOpenWhatsNewTab }) {
  const [autoDownloadUpdates, setAutoDownloadUpdates] = useState(() => {
    try {
      const saved = localStorage.getItem('vm_auto_download_updates')
      return saved !== null ? saved === 'true' : true
    } catch {
      return true
    }
  })
  const [updateProgress, setUpdateProgress] = useState(null)
  const [updateDownloaded, setUpdateDownloaded] = useState(null)
  const [updateError, setUpdateError] = useState(null)
  const [pendingUpdateInfo, setPendingUpdateInfo] = useState(null)
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false)
  const [showInitialUpdateModal, setShowInitialUpdateModal] = useState(() => {
    try {
      return localStorage.getItem('vm_update_mode_configured') !== 'true'
    } catch {
      return false
    }
  })

  const autoDownloadUpdatesRef = useRef(autoDownloadUpdates)
  useEffect(() => {
    autoDownloadUpdatesRef.current = autoDownloadUpdates
  }, [autoDownloadUpdates])

  // Startup version check & "What's New" release notes editor tab
  useEffect(() => {
    try {
      const lastSeenVersion = localStorage.getItem('visualmark_last_seen_version')
      const suppressAuto = localStorage.getItem('visualmark_suppress_whats_new') === 'true'

      if (!lastSeenVersion) {
        // Initial launch of VisualMark Studio: open release notes tab
        localStorage.setItem('visualmark_last_seen_version', appVersion)
        handleOpenWhatsNewTab?.()
      } else if (lastSeenVersion !== appVersion) {
        // App updated to a newer version!
        localStorage.setItem('visualmark_last_seen_version', appVersion)
        if (!suppressAuto) {
          handleOpenWhatsNewTab?.()
        } else {
          showToast?.(`VisualMark Studio updated to v${appVersion}!`, 'info')
        }
      }
    } catch (e) {
      console.warn('Error reading version from localStorage:', e)
    }
  }, [appVersion, showToast, handleOpenWhatsNewTab])

  const handleToggleAutoDownloadUpdates = useCallback((enabled) => {
    setAutoDownloadUpdates(enabled)
    try {
      localStorage.setItem('vm_auto_download_updates', enabled ? 'true' : 'false')
    } catch {}
    if (typeof window !== 'undefined' && window.electronAPI?.setAutoDownload) {
      window.electronAPI.setAutoDownload(enabled)
    }
    showToast?.(
      enabled
        ? 'Automatic update downloads enabled (updates will download in background).'
        : 'Automatic update downloads disabled (VisualMark Studio will prompt before downloading).',
      'info',
      { source: 'Update' }
    )
  }, [showToast])

  const handleStartDownloadUpdate = useCallback(async (info) => {
    setPendingUpdateInfo(null)
    setUpdateProgress({ percent: 0, transferred: 0, total: 0, version: info?.version })
    setUpdateError(null)
    showToast?.(`Starting download of update v${info?.version || ''}...`, 'info', { source: 'Update', important: true })
    if (typeof window !== 'undefined' && window.electronAPI?.downloadUpdate) {
      try {
        const res = await window.electronAPI.downloadUpdate()
        if (res && res.success === false) {
          setUpdateProgress(null)
          showToast?.(`Failed to start download: ${res.error || 'Unknown error'}`, 'error', { source: 'Update', important: true })
        }
      } catch (err) {
        setUpdateProgress(null)
        showToast?.(`Download failed: ${err.message}`, 'error', { source: 'Update', important: true })
      }
    }
  }, [showToast])

  const handleRestartToUpdate = useCallback(() => {
    if (window.electronAPI?.quitAndInstallUpdate) {
      window.electronAPI.quitAndInstallUpdate()
    } else {
      showToast?.('Restart the application to apply update.', 'info')
    }
  }, [showToast])

  // Electron Auto-Updater IPC event listeners
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      const cleanupAvailable = window.electronAPI.onUpdateAvailable?.((info) => {
        setUpdateError(null)
        if (autoDownloadUpdatesRef.current) {
          setUpdateProgress({ percent: 0, transferred: 0, total: 0, version: info?.version })
          showToast?.(`Downloading update v${info?.version || ''} in background...`, 'info', { source: 'Update', important: true })
        } else {
          setPendingUpdateInfo(info)
          showToast?.(`Update v${info?.version || ''} is available! Would you like to download it now?`, 'info', {
            source: 'Update',
            important: true,
            duration: 15000,
            action: {
              label: 'Download Now',
              onClick: () => handleStartDownloadUpdate(info)
            }
          })
        }
      })

      const cleanupProgress = window.electronAPI.onUpdateProgress?.((progress) => {
        setUpdateProgress(progress)
      })

      const cleanupDownloaded = window.electronAPI.onUpdateDownloaded?.((info) => {
        setUpdateProgress(null)
        setUpdateDownloaded(info)
        setPendingUpdateInfo(null)
        setUpdateError(null)
        showToast?.(`Update v${info?.version || ''} downloaded! Click status bar to restart & install.`, 'success', {
          source: 'Update',
          important: true,
          action: {
            label: 'Restart Now',
            onClick: () => handleRestartToUpdate()
          }
        })
      })

      const cleanupError = window.electronAPI.onUpdateError?.((err) => {
        setUpdateProgress(null)
        const errMsg = err?.message || 'Update check/download failed'
        setUpdateError(errMsg)
        showToast?.(`Update failed: ${errMsg}`, 'warning', { source: 'Update', important: true })
      })

      return () => {
        if (typeof cleanupAvailable === 'function') cleanupAvailable()
        if (typeof cleanupProgress === 'function') cleanupProgress()
        if (typeof cleanupDownloaded === 'function') cleanupDownloaded()
        if (typeof cleanupError === 'function') cleanupError()
      }
    }
  }, [showToast, handleStartDownloadUpdate, handleRestartToUpdate])

  const handleCheckForUpdates = useCallback(async () => {
    if (isCheckingUpdate) return
    setIsCheckingUpdate(true)
    if (typeof window !== 'undefined' && window.electronAPI?.checkForUpdates) {
      try {
        showToast?.('Checking for updates...', 'info')
        const res = await window.electronAPI.checkForUpdates()
        if (res?.status === 'dev') {
          showToast?.('Auto-updater is active in production packaged builds.', 'info')
        }
      } catch {
        showToast?.('Unable to check for updates right now.', 'warning')
      } finally {
        setTimeout(() => setIsCheckingUpdate(false), 2000)
      }
    } else {
      showToast?.(`VisualMark Studio v${appVersion} is up to date.`, 'info')
      setIsCheckingUpdate(false)
    }
  }, [appVersion, isCheckingUpdate, showToast])

  return {
    autoDownloadUpdates,
    setAutoDownloadUpdates,
    updateProgress,
    setUpdateProgress,
    updateDownloaded,
    updateError,
    pendingUpdateInfo,
    setPendingUpdateInfo,
    isCheckingUpdate,
    showInitialUpdateModal,
    setShowInitialUpdateModal,
    handleToggleAutoDownloadUpdates,
    handleStartDownloadUpdate,
    handleRestartToUpdate,
    handleCheckForUpdates
  }
}
