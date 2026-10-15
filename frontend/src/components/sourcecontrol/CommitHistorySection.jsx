import React from 'react'

export default function CommitHistorySection({
  graphExpanded = true,
  setGraphExpanded = () => {},
  branchFilter = 'auto',
  setBranchFilter = () => {},
  handleLocateHead = () => {},
  handlePull = () => {},
  handlePush = () => {},
  handleSync = () => {},
  loadGitGraph = () => {},
  isLoadingGraph = false,
  isGraphMenuOpen = false,
  setIsGraphMenuOpen = () => {},
  handleOpenBranchModal = () => {},
  graphListRef = null,
  displayCommits = [],
  highlightHead = false,
  handleOpenCommitDetails = () => {},
  branch = 'main',
  ahead = 0,
  folderPath = null
}) {
  return (
    <div className="sc-section-block sc-graph-block">
      <div
        className="sc-section-header"
        onClick={() => setGraphExpanded((prev) => !prev)}
      >
        <span className="sc-caret-icon material-symbols-outlined">
          {graphExpanded ? 'expand_more' : 'chevron_right'}
        </span>
        <span className="sc-section-label">Graph</span>

        {/* Header Action Icons */}
        <div
          className="sc-section-actions sc-dropdown-container"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={`sc-btn-pill-auto ${branchFilter === 'auto' ? 'active' : ''}`}
            onClick={() => setBranchFilter((prev) => (prev === 'auto' ? 'current' : 'auto'))}
            title={`Branch Mode: ${branchFilter.toUpperCase()}`}
          >
            Auto
          </button>

          <button
            type="button"
            className="sc-icon-btn-sm"
            onClick={handleLocateHead}
            title="Locate HEAD Commit (◎)"
          >
            <span className="material-symbols-outlined">adjust</span>
          </button>

          <button
            type="button"
            className="sc-icon-btn-sm"
            onClick={handlePull}
            title="Pull Remote Commits (⇣)"
          >
            <span className="material-symbols-outlined">download</span>
          </button>

          <button
            type="button"
            className="sc-icon-btn-sm"
            onClick={handlePush}
            title="Push Commits to Remote (⇡)"
          >
            <span className="material-symbols-outlined">upload</span>
          </button>

          <button
            type="button"
            className="sc-icon-btn-sm"
            onClick={handleSync}
            title="Sync with Remote (⇅)"
          >
            <span className="material-symbols-outlined">swap_vert</span>
          </button>

          <button
            type="button"
            className="sc-icon-btn-sm"
            onClick={() => loadGitGraph(folderPath, false)}
            title="Refresh Graph History (↺)"
            disabled={isLoadingGraph}
          >
            <span className={`material-symbols-outlined ${isLoadingGraph ? 'animate-spin' : ''}`}>
              refresh
            </span>
          </button>

          <button
            type="button"
            className="sc-icon-btn-sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsGraphMenuOpen((prev) => !prev)
            }}
            title="More Graph Actions..."
          >
            <span className="material-symbols-outlined">more_horiz</span>
          </button>

          {isGraphMenuOpen && (
            <div className="sc-dropdown-menu">
              <button
                type="button"
                onClick={() => {
                  setIsGraphMenuOpen(false)
                  handleOpenBranchModal()
                }}
              >
                <span className="material-symbols-outlined">fork_right</span> Switch Branch...
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsGraphMenuOpen(false)
                  handleLocateHead()
                }}
              >
                <span className="material-symbols-outlined">adjust</span> Center on HEAD
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsGraphMenuOpen(false)
                  loadGitGraph(folderPath, false)
                }}
              >
                <span className="material-symbols-outlined">refresh</span> Reload Commits
              </button>
            </div>
          )}
        </div>
      </div>

      {graphExpanded && (
        <div className="sc-graph-container custom-scrollbar" ref={graphListRef}>
          {displayCommits.length === 0 ? (
            <div className="sc-no-commits-box">
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>
                history
              </span>
              <span>{isLoadingGraph ? 'Loading commit history...' : 'No git commits found.'}</span>
            </div>
          ) : (
            <div className="sc-graph-tree-list">
              {displayCommits.map((commit, idx) => {
                const isHead = idx === 0 || commit.decorations?.isHead
                const hasBranchBadge = commit.decorations?.branches?.length > 0 || isHead
                const branchLabel = commit.decorations?.branches?.[0] || (isHead ? branch : null)
                const hasRemote = commit.decorations?.remotes?.length > 0 || (isHead && ahead >= 0)
                const hasTag = commit.decorations?.tags?.length > 0
                const tagLabel = commit.decorations?.tags?.[0]

                return (
                  <div
                    key={commit.hash || idx}
                    className={`sc-graph-row ${isHead && highlightHead ? 'head-highlighted' : ''}`}
                    onClick={() => handleOpenCommitDetails(commit)}
                    title={`${commit.shortHash} - ${commit.subject} (${commit.author}, ${commit.relativeDate})`}
                  >
                    {/* Visual Git Graph Column on the Left */}
                    <div className="sc-graph-node-col">
                      {/* Vertical Trunk Line */}
                      {idx < displayCommits.length - 1 && (
                        <div className="sc-graph-trunk-line" />
                      )}
                      {idx > 0 && (
                        <div className="sc-graph-trunk-line-top" />
                      )}

                      {/* Node: Distinctive Hollow Ring for HEAD (◎), Solid Dot for Past Commits (●) */}
                      {isHead ? (
                        <div className="sc-graph-head-ring" title="HEAD Commit">
                          <div className="sc-graph-head-inner-dot" />
                        </div>
                      ) : (
                        <div className="sc-graph-solid-dot" />
                      )}
                    </div>

                    {/* Commit Subject & Info */}
                    <div className="sc-graph-content truncate">
                      <span className="sc-commit-subject truncate">
                        {commit.subject}
                      </span>

                      {/* Branch Badge (◎ main) */}
                      {hasBranchBadge && branchLabel && (
                        <span className="sc-badge-branch" title={`Branch: ${branchLabel}`}>
                          <span className="sc-badge-dot">◎</span>
                          <span>{branchLabel}</span>
                        </span>
                      )}

                      {/* Remote Cloud Badge (☁) */}
                      {hasRemote && (
                        <span className="sc-badge-remote" title="Remote Tracking Branch">
                          ☁
                        </span>
                      )}

                      {/* Tag Badge */}
                      {hasTag && (
                        <span className="sc-badge-tag" title={`Tag: ${tagLabel}`}>
                          {tagLabel}
                        </span>
                      )}
                    </div>

                    {/* Author Name on the Far Right */}
                    <div className="sc-graph-author-col truncate">
                      <span>{commit.author}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
