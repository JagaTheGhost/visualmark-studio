import React, { useState, useEffect, useRef } from 'react'

function getFileIcon(filename) {
  const lower = filename.toLowerCase()
  if (lower.endsWith('.md')) {
    return (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="#38bdf8">
        <path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM3 11V6h1.5l1.5 2 1.5-2H9v5H7.5V8.5L6 10.5 4.5 8.5V11H3zm9-1.5l-1.5 2v-4.5h-1v4.5l-1.5-2-.7.7 2.7 2.8 2.7-2.8-.7-.7z"/>
      </svg>
    )
  }
  if (lower.endsWith('.json') || lower.endsWith('.js') || lower.endsWith('.ts')) {
    return (
      <span style={{ color: '#e5c07b', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}>
        {'{ }'}
      </span>
    )
  }
  return (
    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#94a3b8' }}>
      description
    </span>
  )
}

export default function InsertTargetModal({
  isOpen,
  onClose,
  snippet = '',
  snippetType = 'Snippet',
  openDocTabs = [],
  lastActiveDoc = '',
  fileCursorPositions = {},
  onConfirm = () => {},
  onCreateNewDoc = () => {}
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const dialogRef = useRef(null)

  // Filter out any studio tab IDs just in case
  const docList = openDocTabs.filter(
    (f) => typeof f === 'string' && !f.endsWith('.studio') && f !== 'settings' && f !== 'shortcuts' && f !== 'whats-new' && f !== 'release-notes'
  )

  useEffect(() => {
    if (isOpen) {
      // Preselect the last active document if present
      if (lastActiveDoc && docList.includes(lastActiveDoc)) {
        const idx = docList.indexOf(lastActiveDoc)
        setSelectedIndex(Math.max(0, idx))
      } else {
        setSelectedIndex(0)
      }
    }
  }, [isOpen, lastActiveDoc, openDocTabs])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (docList.length > 0) {
          setSelectedIndex((prev) => (prev + 1) % docList.length)
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (docList.length > 0) {
          setSelectedIndex((prev) => (prev - 1 + docList.length) % docList.length)
        }
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (docList.length > 0 && docList[selectedIndex]) {
          onConfirm(docList[selectedIndex])
        } else {
          onCreateNewDoc()
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, docList, onConfirm, onCreateNewDoc, onClose])

  if (!isOpen) return null

  return (
    <div className="palette-backdrop insert-target-backdrop" onClick={onClose}>
      <div
        className="palette-dialog insert-target-dialog"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="insert-target-header">
          <div className="insert-target-title-group">
            <span className="material-symbols-outlined insert-target-header-icon text-primary">
              post_add
            </span>
            <div>
              <h3 className="insert-target-title">
                Insert {snippetType} into Document
              </h3>
              <p className="insert-target-subtitle">
                Choose an open document tab to insert at your cursor line:
              </p>
            </div>
          </div>
          <button
            type="button"
            className="insert-target-close-btn"
            onClick={onClose}
            title="Cancel insertion (Esc)"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
          </button>
        </div>

        {/* List of open document tabs */}
        <div className="insert-target-body custom-scrollbar">
          {docList.length > 0 ? (
            <div className="insert-target-list">
              {docList.map((fileName, idx) => {
                const isSelected = idx === selectedIndex
                const isRecent = fileName === lastActiveDoc
                const cursor = fileCursorPositions[fileName]
                const cursorLine = cursor?.line || 1

                return (
                  <div
                    key={fileName}
                    className={`insert-target-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => onConfirm(fileName)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    title={`Click or press Enter to insert into ${fileName} at line ${cursorLine}`}
                  >
                    <div className="insert-target-item-left">
                      <span className="insert-target-file-icon">
                        {getFileIcon(fileName)}
                      </span>
                      <span className="insert-target-file-name truncate">
                        {fileName}
                      </span>
                    </div>

                    <div className="insert-target-item-right">
                      {isRecent && (
                        <span className="insert-target-pill pill-active">
                          Active Tab
                        </span>
                      )}
                      <span className="insert-target-pill pill-line">
                        Ln {cursorLine}
                      </span>
                      <span className="material-symbols-outlined insert-target-arrow">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="insert-target-empty">
              <span className="material-symbols-outlined empty-icon">draft</span>
              <p className="empty-title">No document tabs are currently open</p>
              <p className="empty-desc">
                Create a new document to insert your {snippetType.toLowerCase()} into.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="insert-target-footer">
          <button
            type="button"
            className="btn-studio-secondary"
            onClick={onCreateNewDoc}
            title="Create a new untitled buffer and insert here"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
            <span>New Document</span>
          </button>

          <div className="insert-target-footer-right">
            <button
              type="button"
              className="btn-studio-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            {docList.length > 0 && (
              <button
                type="button"
                className="btn-studio-primary"
                onClick={() => onConfirm(docList[selectedIndex] || docList[0])}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span>
                <span>Insert into {docList[selectedIndex] || 'Document'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
