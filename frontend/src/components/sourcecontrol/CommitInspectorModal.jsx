import React from 'react'

export default function CommitInspectorModal({
  selectedCommit = null,
  getStatusColor = () => '#94a3b8',
  showToast = () => {},
  onClose = () => {}
}) {
  if (!selectedCommit) return null

  return (
    <div className="sc-modal-overlay" onClick={onClose}>
      <div className="sc-modal-card sc-commit-inspector" onClick={(e) => e.stopPropagation()}>
        <div className="sc-modal-header">
          <div className="sc-commit-modal-title">
            <span className="material-symbols-outlined" style={{ color: '#007acc' }}>commit</span>
            <span>Commit {selectedCommit.shortHash}</span>
          </div>
          <button
            type="button"
            className="sc-btn-close-modal"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="sc-modal-body custom-scrollbar">
          <div className="sc-commit-meta-grid">
            <div className="sc-meta-item">
              <span className="sc-meta-label">Subject:</span>
              <span className="sc-meta-value sc-bold">{selectedCommit.subject}</span>
            </div>
            <div className="sc-meta-item">
              <span className="sc-meta-label">Author:</span>
              <span className="sc-meta-value">{selectedCommit.author} {selectedCommit.email ? `<${selectedCommit.email}>` : ''}</span>
            </div>
            <div className="sc-meta-item">
              <span className="sc-meta-label">Date:</span>
              <span className="sc-meta-value">{selectedCommit.relativeDate}</span>
            </div>
            <div className="sc-meta-item">
              <span className="sc-meta-label">Hash:</span>
              <span className="sc-meta-value font-mono">
                {selectedCommit.hash}
                <button
                  type="button"
                  className="sc-btn-copy-hash"
                  onClick={() => {
                    navigator.clipboard?.writeText(selectedCommit.hash)
                    showToast('Commit hash copied to clipboard', 'success')
                  }}
                  title="Copy full hash"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>content_copy</span>
                </button>
              </span>
            </div>
          </div>

          {selectedCommit.files && selectedCommit.files.length > 0 && (
            <div className="sc-commit-files-section">
              <div className="sc-commit-files-header">
                <span>Changed Files ({selectedCommit.files.length})</span>
              </div>
              <div className="sc-commit-files-list">
                {selectedCommit.files.map((f, i) => (
                  <div key={i} className="sc-commit-file-row">
                    <span className="sc-file-status-letter" style={{ color: getStatusColor(f.status) }}>
                      {f.status}
                    </span>
                    <span className="sc-commit-filename">{f.path}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
