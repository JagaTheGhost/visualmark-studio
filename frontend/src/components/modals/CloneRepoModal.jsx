import React, { useState, useEffect, useCallback } from 'react'
import { apiPost } from '../../utils/apiClient'

/**
 * CloneRepoModal
 * Universal Git Clone modal for VisualMark Studio.
 * Supports:
 * - Full HTTPS, SSH, and GitHub shorthand (owner/repo)
 * - Native folder browsing with selectCloneParentDialog and openFolderDialog fallbacks
 * - Dual execution engines: Native Electron IPC and FastAPI sidecar /git-clone endpoint
 * - Auto-opens cloned workspace upon successful cloning
 */
export default function CloneRepoModal({
  isOpen,
  onClose = () => {},
  onWorkspaceOpened = () => {},
  showToast = () => {},
  initialParentDir = ''
}) {
  const [cloneUrl, setCloneUrl] = useState('')
  const [cloneTargetDir, setCloneTargetDir] = useState('')
  const [cloneFolderName, setCloneFolderName] = useState('')
  const [isCloning, setIsCloning] = useState(false)
  const [cloneError, setCloneError] = useState('')

  // Initialize destination directory on open
  useEffect(() => {
    if (isOpen) {
      setCloneError('')
      if (initialParentDir) {
        setCloneTargetDir(initialParentDir)
      } else if (window.electronAPI?.gitGetDefaultCloneDir) {
        window.electronAPI.gitGetDefaultCloneDir().then((dir) => {
          if (dir) setCloneTargetDir(dir)
        }).catch(() => {})
      }
    }
  }, [isOpen, initialParentDir])

  // Auto-derive folder name when user types or pastes URL
  const handleUrlChange = (val) => {
    setCloneUrl(val)
    setCloneError('')
    const clean = val.trim().replace(/\/+$/, '')
    const stripped = clean.endsWith('.git') ? clean.slice(0, -4) : clean
    const suggested = stripped.split('/').pop() || ''
    if (suggested && !suggested.includes(' ')) {
      setCloneFolderName(suggested)
    }
  }

  // Browse local disk for parent folder
  const handleBrowseFolder = async () => {
    try {
      if (window.electronAPI?.selectCloneParentDialog) {
        const res = await window.electronAPI.selectCloneParentDialog()
        if (!res.canceled && res.folderPath) {
          setCloneTargetDir(res.folderPath)
          return
        }
      }
      if (window.electronAPI?.openFolderDialog) {
        const res = await window.electronAPI.openFolderDialog()
        if (!res.canceled && res.folderPath) {
          setCloneTargetDir(res.folderPath)
          return
        }
      }
    } catch (err) {
      setCloneError('Failed to select destination folder: ' + err.message)
    }
  }

  // Execute Git clone
  const handleExecuteClone = async () => {
    if (!cloneUrl.trim()) {
      setCloneError('Please enter a Git repository URL or GitHub slug.')
      return
    }

    setIsCloning(true)
    setCloneError('')
    try {
      let res = null

      // 1. Try Native Electron IPC
      if (window.electronAPI?.gitClone) {
        res = await window.electronAPI.gitClone({
          repoUrl: cloneUrl.trim(),
          targetDir: cloneTargetDir.trim(),
          folderName: cloneFolderName.trim()
        })
      } else {
        // 2. Seamless Sidecar Fallback via FastAPI
        const apiRes = await apiPost('/git-clone', {
          repo_url: cloneUrl.trim(),
          target_dir: cloneTargetDir.trim() || null,
          folder_name: cloneFolderName.trim() || null
        })
        res = apiRes.data
      }

      if (res?.success) {
        showToast(`Successfully cloned "${res.folderName || 'repository'}"!`, 'success')
        onClose()
        setCloneUrl('')
        setCloneFolderName('')

        if (res.destinationPath && typeof onWorkspaceOpened === 'function') {
          await onWorkspaceOpened(res.destinationPath, res.folderName)
        }
      } else {
        setCloneError(res?.error || 'Failed to clone repository.')
      }
    } catch (err) {
      setCloneError(err.response?.data?.detail || err.message || 'Error occurred while cloning repository.')
    } finally {
      setIsCloning(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="sc-modal-overlay" onClick={() => !isCloning && onClose()}>
      <div className="sc-modal-card sc-clone-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sc-modal-header">
          <div className="sc-modal-title-wrap">
            <span className="material-symbols-outlined" style={{ color: '#38bdf8', fontSize: '22px' }}>
              cloud_download
            </span>
            <span className="sc-modal-title">Clone Git Repository</span>
          </div>
          <button
            type="button"
            className="sc-btn-close-modal"
            onClick={() => !isCloning && onClose()}
            disabled={isCloning}
            title="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="sc-modal-body">
          <p className="sc-clone-subtitle">
            Clone a remote repository from GitHub, GitLab, or any Git URL to your computer and automatically open it in VisualMark Studio.
          </p>

          <div className="sc-form-group">
            <label className="sc-form-label">Repository URL or GitHub Slug</label>
            <input
              type="text"
              className="sc-branch-input"
              placeholder="e.g. https://github.com/owner/repo.git or owner/repo"
              value={cloneUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExecuteClone()
              }}
              disabled={isCloning}
              autoFocus
            />
            <span className="sc-form-hint">Supports HTTPS, SSH (git@github.com:...), or GitHub shorthand (owner/repo).</span>
          </div>

          <div className="sc-form-group">
            <label className="sc-form-label">Clone Destination Folder</label>
            <div className="sc-folder-select-row">
              <input
                type="text"
                className="sc-branch-input"
                value={cloneTargetDir}
                onChange={(e) => setCloneTargetDir(e.target.value)}
                placeholder="Select destination parent folder..."
                disabled={isCloning}
              />
              <button
                type="button"
                className="sc-btn-browse"
                onClick={handleBrowseFolder}
                disabled={isCloning}
                title="Choose destination directory on your disk"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>folder_open</span>
                <span>Browse...</span>
              </button>
            </div>
          </div>

          <div className="sc-form-group">
            <label className="sc-form-label">Local Folder Name</label>
            <input
              type="text"
              className="sc-branch-input"
              value={cloneFolderName}
              onChange={(e) => setCloneFolderName(e.target.value)}
              placeholder="Folder name (defaults to repository name)"
              disabled={isCloning}
            />
            {cloneTargetDir && cloneFolderName && (
              <span className="sc-form-hint">
                Target path: <code>{cloneTargetDir}/{cloneFolderName}</code>
              </span>
            )}
          </div>

          {cloneError && (
            <div className="sc-clone-error-box">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
              <span>{cloneError}</span>
            </div>
          )}

          <div className="sc-modal-actions">
            <button
              type="button"
              className="sc-btn-cancel"
              onClick={onClose}
              disabled={isCloning}
            >
              Cancel
            </button>
            <button
              type="button"
              className="sc-btn-confirm-clone"
              onClick={handleExecuteClone}
              disabled={isCloning || !cloneUrl.trim()}
            >
              {isCloning ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: '16px' }}>refresh</span>
                  <span>Cloning Repository...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
                  <span>Clone Repository</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
