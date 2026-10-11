import React from 'react'

/**
 * UnsupportedFileViewer
 * Fail-safe screen rendered when a user attempts to open a binary or unsupported file
 * (e.g. images, executables, compiled bytecode, databases, archives) inside the code/markdown editor.
 */
export default function UnsupportedFileViewer({ fileInfo, onCloseTab }) {
  const {
    fileName = 'Unknown File',
    filePath = '',
    extension = '',
    size = 0,
    reason = 'binary_content'
  } = fileInfo || {}

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleRevealInExplorer = () => {
    if (window.electronAPI?.showItemInFolder && filePath) {
      window.electronAPI.showItemInFolder(filePath)
    }
  }

  const handleOpenSystem = async () => {
    if (window.electronAPI?.openPathInOs && filePath) {
      await window.electronAPI.openPathInOs(filePath)
    }
  }

  const getReasonMessage = () => {
    if (reason === 'file_too_large') {
      return 'This file exceeds the 5MB editor memory safety threshold and was blocked to prevent the IDE from freezing.'
    }
    return 'The file contains binary data or an unsupported format that cannot be displayed as plain text.'
  }

  return (
    <div className="unsupported-viewer-container">
      <div className="unsupported-viewer-card">
        {/* Top Icon Badge */}
        <div className="unsupported-icon-badge">
          <span className="material-symbols-outlined" style={{ fontSize: '38px', color: '#f59e0b' }}>
            insert_drive_file
          </span>
          <span className="unsupported-sub-badge">
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#ef4444' }}>
              block
            </span>
          </span>
        </div>

        {/* Title */}
        <h2 className="unsupported-title">Cannot Open File in Editor</h2>
        <div className="unsupported-filename-chip">
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>draft</span>
          <span>{fileName}</span>
          {extension && <span className="unsupported-ext-badge">.{extension.toUpperCase()}</span>}
        </div>

        {/* Message */}
        <div className="unsupported-notice-box">
          <p className="unsupported-primary-msg">
            The IDE is currently not capable of rendering this file type in the text editor.
          </p>
          <p className="unsupported-dev-notice">
            <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '5px', color: '#38bdf8' }}>
              engineering
            </span>
            <strong>The developer is actively working on adding full preview capabilities for this file format in a future update.</strong>
          </p>
        </div>

        {/* File Metadata Info */}
        <div className="unsupported-meta-grid">
          <div className="unsupported-meta-row">
            <span className="meta-label">Reason:</span>
            <span className="meta-value">{getReasonMessage()}</span>
          </div>
          {size > 0 && (
            <div className="unsupported-meta-row">
              <span className="meta-label">File Size:</span>
              <span className="meta-value">{formatFileSize(size)}</span>
            </div>
          )}
          {filePath && (
            <div className="unsupported-meta-row">
              <span className="meta-label">Full Path:</span>
              <span className="meta-value path-text" title={filePath}>{filePath}</span>
            </div>
          )}
        </div>

        {/* Safe Actions */}
        <div className="unsupported-actions-row">
          {window.electronAPI && filePath && (
            <>
              <button
                type="button"
                className="btn-unsupported-primary"
                onClick={handleOpenSystem}
                title="Launch this file using default OS application"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>open_in_new</span>
                <span>Open in Default App</span>
              </button>

              <button
                type="button"
                className="btn-unsupported-secondary"
                onClick={handleRevealInExplorer}
                title="Open location in Windows Explorer"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>folder_open</span>
                <span>Reveal in Explorer</span>
              </button>
            </>
          )}

          {onCloseTab && (
            <button
              type="button"
              className="btn-unsupported-close"
              onClick={onCloseTab}
              title="Close this file tab"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>close</span>
              <span>Close Tab</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
