import React from 'react'

export default function DiffViewerModal({
  diffTarget = null,
  diffContent = '',
  isLoadingDiff = false,
  onClose = () => {}
}) {
  if (!diffTarget) return null

  return (
    <div className="sc-modal-overlay" onClick={onClose}>
      <div className="sc-modal-card sc-diff-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sc-modal-header">
          <div className="sc-diff-modal-title">
            <span className="material-symbols-outlined" style={{ color: '#007acc' }}>difference</span>
            <span>{diffTarget.staged ? 'Staged Changes: ' : 'Working Tree: '}{diffTarget.filePath}</span>
          </div>
          <button
            type="button"
            className="sc-btn-close-modal"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="sc-modal-body sc-diff-body custom-scrollbar">
          {isLoadingDiff ? (
            <div className="sc-modal-loading">
              <span className="material-symbols-outlined animate-spin">refresh</span>
              <span>Loading diff...</span>
            </div>
          ) : (
            <pre className="sc-diff-pre">
              {diffContent.split('\n').map((line, idx) => {
                const isAdd = line.startsWith('+') && !line.startsWith('+++')
                const isDel = line.startsWith('-') && !line.startsWith('---')
                const isHeader = line.startsWith('@@')
                return (
                  <div
                    key={idx}
                    className={`sc-diff-line ${isAdd ? 'sc-diff-add' : ''} ${isDel ? 'sc-diff-del' : ''} ${isHeader ? 'sc-diff-header' : ''}`}
                  >
                    <span className="sc-diff-num">{idx + 1}</span>
                    <span className="sc-diff-text">{line}</span>
                  </div>
                )
              })}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
