import React from 'react'

export default function ChangesList({
  stagedChanges = [],
  unstagedChanges = [],
  getStatusColor = () => '#94a3b8',
  onOpenDiff = () => {},
  onStageFile = () => {},
  onUnstageFile = () => {},
  onDiscardFile = () => {},
  onUnstageAll = () => {}
}) {
  return (
    <>
      {/* Staged Changes Subsection */}
      {stagedChanges.length > 0 && (
        <div className="sc-sub-changes-group">
          <div className="sc-sub-header">
            <span className="sc-sub-title">STAGED CHANGES</span>
            <span className="sc-sub-count">{stagedChanges.length}</span>
            <button
              type="button"
              className="sc-icon-btn-micro"
              onClick={onUnstageAll}
              title="Unstage all files"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>

          <div className="sc-file-list">
            {stagedChanges.map((item) => (
              <div
                key={`staged-${item.path}`}
                className="sc-file-row"
                onClick={() => onOpenDiff(item, true)}
                title={`${item.path} - Click to view staged diff`}
              >
                <span className="material-symbols-outlined sc-file-type-icon">
                  description
                </span>
                <span className="sc-file-name truncate">{item.name}</span>
                <span className="sc-file-dir truncate">
                  {item.path.includes('/') ? item.path.substring(0, item.path.lastIndexOf('/')) : ''}
                </span>

                {/* Hover actions */}
                <div className="sc-row-hover-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="sc-icon-action"
                    onClick={(e) => onUnstageFile(item.path, e)}
                    title="Unstage file"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                </div>

                <span
                  className="sc-status-badge"
                  style={{ color: getStatusColor(item.status) }}
                  title={item.label}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Working Tree Changes Subsection */}
      <div className="sc-sub-changes-group">
        {stagedChanges.length > 0 && (
          <div className="sc-sub-header">
            <span className="sc-sub-title">CHANGES</span>
            <span className="sc-sub-count">{unstagedChanges.length}</span>
          </div>
        )}

        {unstagedChanges.length === 0 && stagedChanges.length === 0 ? (
          <div className="sc-empty-clean-box">
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#10b981' }}>
              check_circle
            </span>
            <span>Working tree clean</span>
          </div>
        ) : (
          <div className="sc-file-list">
            {unstagedChanges.map((item) => (
              <div
                key={`unstaged-${item.path}`}
                className="sc-file-row"
                onClick={() => onOpenDiff(item, false)}
                title={`${item.path} - Click to view diff / open`}
              >
                <span className="material-symbols-outlined sc-file-type-icon">
                  draft
                </span>
                <span className="sc-file-name truncate">{item.name}</span>
                <span className="sc-file-dir truncate">
                  {item.path.includes('/') ? item.path.substring(0, item.path.lastIndexOf('/')) : ''}
                </span>

                {/* Hover actions */}
                <div className="sc-row-hover-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="sc-icon-action"
                    onClick={(e) => onStageFile(item.path, e)}
                    title="Stage file"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                  <button
                    type="button"
                    className="sc-icon-action"
                    onClick={(e) => onDiscardFile(item.path, e)}
                    title="Discard changes"
                  >
                    <span className="material-symbols-outlined">undo</span>
                  </button>
                </div>

                <span
                  className="sc-status-badge"
                  style={{ color: getStatusColor(item.status) }}
                  title={item.label}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
