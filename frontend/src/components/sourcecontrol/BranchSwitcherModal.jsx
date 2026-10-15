import React from 'react'

export default function BranchSwitcherModal({
  isOpen = false,
  branches = { current: 'main', local: [], remote: [] },
  branchSearch = '',
  setBranchSearch = () => {},
  newBranchName = '',
  setNewBranchName = () => {},
  onCheckoutBranch = () => {},
  onCreateBranch = () => {},
  onClose = () => {}
}) {
  if (!isOpen) return null

  return (
    <div className="sc-modal-overlay" onClick={onClose}>
      <div className="sc-modal-card sc-branch-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sc-modal-header">
          <span className="sc-modal-title">Switch or Create Branch</span>
          <button
            type="button"
            className="sc-btn-close-modal"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="sc-modal-body">
          {/* Create new branch input */}
          <div className="sc-create-branch-row">
            <input
              type="text"
              className="sc-branch-input"
              placeholder="Create new branch name..."
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onCreateBranch()
              }}
            />
            <button
              type="button"
              className="sc-btn-create-branch"
              onClick={onCreateBranch}
              disabled={!newBranchName.trim()}
            >
              Create & Switch
            </button>
          </div>

          {/* Filter existing branches */}
          <input
            type="text"
            className="sc-branch-filter-input"
            placeholder="Filter branches..."
            value={branchSearch}
            onChange={(e) => setBranchSearch(e.target.value)}
          />

          <div className="sc-branch-list custom-scrollbar">
            <div className="sc-branch-group-label">Local Branches</div>
            {branches.local
              .filter(b => b.toLowerCase().includes(branchSearch.toLowerCase()))
              .map(b => (
                <div
                  key={`local-${b}`}
                  className={`sc-branch-item ${b === branches.current ? 'current' : ''}`}
                  onClick={() => onCheckoutBranch(b)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    {b === branches.current ? 'check' : 'fork_right'}
                  </span>
                  <span>{b}</span>
                  {b === branches.current && (
                    <span className="sc-current-badge">current</span>
                  )}
                </div>
              ))}

            {branches.remote && branches.remote.length > 0 && (
              <>
                <div className="sc-branch-group-label" style={{ marginTop: '12px' }}>Remote Branches</div>
                {branches.remote
                  .filter(b => b.toLowerCase().includes(branchSearch.toLowerCase()))
                  .map(b => (
                    <div
                      key={`remote-${b}`}
                      className="sc-branch-item sc-remote-branch"
                      onClick={() => onCheckoutBranch(b)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#64748b' }}>
                        cloud
                      </span>
                      <span>{b}</span>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
