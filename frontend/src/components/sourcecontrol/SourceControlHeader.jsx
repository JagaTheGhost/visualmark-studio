import React from 'react'

export default function SourceControlHeader({
  isRefreshing = false,
  isHeaderMenuOpen = false,
  setIsHeaderMenuOpen = () => {},
  onRefresh = () => {},
  onPull = () => {},
  onPush = () => {},
  onFetch = () => {},
  onSync = () => {},
  onOpenCloneModal = () => {},
  onOpenBranchModal = () => {},
  onStageAll = () => {},
  onUnstageAll = () => {},
  onDiscardAll = () => {}
}) {
  return (
    <div className="sc-header-bar">
      <span className="sc-header-title">Source Control</span>

      <div className="sc-header-actions sc-dropdown-container">
        <button
          type="button"
          className="sc-icon-btn"
          onClick={onRefresh}
          title="Refresh Git Status"
          disabled={isRefreshing}
        >
          <span className={`material-symbols-outlined ${isRefreshing ? 'animate-spin' : ''}`}>
            refresh
          </span>
        </button>

        <button
          type="button"
          className="sc-icon-btn"
          onClick={(e) => {
            e.stopPropagation()
            setIsHeaderMenuOpen((prev) => !prev)
          }}
          title="More Actions..."
        >
          <span className="material-symbols-outlined">more_horiz</span>
        </button>

        {isHeaderMenuOpen && (
          <div className="sc-dropdown-menu">
            <button
              type="button"
              onClick={() => {
                setIsHeaderMenuOpen(false)
                onPull()
              }}
            >
              <span className="material-symbols-outlined">download</span> Pull
            </button>
            <button
              type="button"
              onClick={() => {
                setIsHeaderMenuOpen(false)
                onPush()
              }}
            >
              <span className="material-symbols-outlined">upload</span> Push
            </button>
            <button
              type="button"
              onClick={() => {
                setIsHeaderMenuOpen(false)
                onFetch()
              }}
            >
              <span className="material-symbols-outlined">sync</span> Fetch
            </button>
            <button
              type="button"
              onClick={() => {
                setIsHeaderMenuOpen(false)
                onSync()
              }}
            >
              <span className="material-symbols-outlined">swap_vert</span> Synchronize
            </button>
            <div className="sc-menu-divider" />
            <button
              type="button"
              onClick={() => {
                setIsHeaderMenuOpen(false)
                onOpenCloneModal()
              }}
            >
              <span className="material-symbols-outlined">download</span> Clone Repository...
            </button>
            <button
              type="button"
              onClick={() => {
                setIsHeaderMenuOpen(false)
                onOpenBranchModal()
              }}
            >
              <span className="material-symbols-outlined">fork_right</span> Checkout Branch...
            </button>
            <button
              type="button"
              onClick={() => {
                setIsHeaderMenuOpen(false)
                onStageAll()
              }}
            >
              <span className="material-symbols-outlined">check</span> Stage All Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setIsHeaderMenuOpen(false)
                onUnstageAll()
              }}
            >
              <span className="material-symbols-outlined">remove</span> Unstage All Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setIsHeaderMenuOpen(false)
                onDiscardAll()
              }}
            >
              <span className="material-symbols-outlined">undo</span> Discard All Changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
