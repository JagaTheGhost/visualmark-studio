import React, { useState, useEffect, useRef, useCallback } from 'react'
import SourceControlHeader from './SourceControlHeader'
import CommitBox from './CommitBox'
import ChangesList from './ChangesList'
import CommitHistorySection from './CommitHistorySection'
import DiffViewerModal from './DiffViewerModal'
import CommitInspectorModal from './CommitInspectorModal'
import BranchSwitcherModal from './BranchSwitcherModal'

export default function SourceControlDrawer({
  gitInfo = null,
  workspaceDirectory = null,
  onRefreshGit = () => {},
  onSelectFile = () => {},
  isRefreshing = false,
  showToast = () => {},
  onOpenWorkspaceDirectory = () => {}
}) {
  // Commit message and commit actions
  const [commitMessage, setCommitMessage] = useState('')
  const [isCommitting, setIsCommitting] = useState(false)
  const [commitAction, setCommitAction] = useState('commit') // 'commit' | 'commit-push' | 'commit-sync' | 'commit-amend'
  const [isSplitMenuOpen, setIsSplitMenuOpen] = useState(false)

  // Collapsible section states
  const [changesExpanded, setChangesExpanded] = useState(true)
  const [graphExpanded, setGraphExpanded] = useState(true)

  // Header & section menus
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const [isChangesMenuOpen, setIsChangesMenuOpen] = useState(false)
  const [isGraphMenuOpen, setIsGraphMenuOpen] = useState(false)

  // Dynamic folder path resolution
  const [activeFolderPath, setActiveFolderPath] = useState(() => {
    return typeof workspaceDirectory === 'string' ? workspaceDirectory : (workspaceDirectory?.path || null)
  })

  // Git Graph state
  const [graphCommits, setGraphCommits] = useState([])
  const [isLoadingGraph, setIsLoadingGraph] = useState(false)
  const [branchFilter, setBranchFilter] = useState('auto') // 'auto' | 'current' | 'all'
  const [highlightHead, setHighlightHead] = useState(false)
  const graphListRef = useRef(null)

  // Commit Inspector & Diff Viewer Modals
  const [selectedCommit, setSelectedCommit] = useState(null)
  const [diffTarget, setDiffTarget] = useState(null) // { filePath, staged, status }
  const [diffContent, setDiffContent] = useState('')
  const [isLoadingDiff, setIsLoadingDiff] = useState(false)

  // Branch Switcher Modal
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false)
  const [branches, setBranches] = useState({ current: 'main', local: [], remote: [] })
  const [newBranchName, setNewBranchName] = useState('')
  const [branchSearch, setBranchSearch] = useState('')

  // Resolve directory
  useEffect(() => {
    let p = typeof workspaceDirectory === 'string' ? workspaceDirectory : (workspaceDirectory?.path || null)
    if (p) {
      setActiveFolderPath(p)
    } else if (window.electronAPI?.getDefaultWorkspace) {
      window.electronAPI.getDefaultWorkspace().then((ws) => {
        if (ws?.rootPath) {
          setActiveFolderPath(ws.rootPath)
        }
      }).catch(() => {})
    }
  }, [workspaceDirectory])

  // Extract gitInfo values
  const folderPath = activeFolderPath || (typeof workspaceDirectory === 'string' ? workspaceDirectory : (workspaceDirectory?.path || null))
  const isRepo = gitInfo?.isRepo ?? (!!folderPath)
  const branch = gitInfo?.branch || 'main'
  const stagedChanges = gitInfo?.stagedChanges || []
  const unstagedChanges = gitInfo?.unstagedChanges || (gitInfo?.changes || [])
  const totalChangesCount = stagedChanges.length + unstagedChanges.length
  const ahead = gitInfo?.ahead || 0

  const displayCommits = graphCommits.length > 0 ? graphCommits : (gitInfo?.commits || [])

  // 1. Fetch Git Graph History
  const loadGitGraph = useCallback(async (customPath = folderPath, isSilent = false) => {
    const target = customPath || folderPath
    if (!target) return
    if (!isSilent) setIsLoadingGraph(true)
    try {
      if (window.electronAPI?.gitGetGraph) {
        const res = await window.electronAPI.gitGetGraph(target, 50)
        if (res?.success && Array.isArray(res.commits) && res.commits.length > 0) {
          setGraphCommits(res.commits)
          return
        }
      }

      if (gitInfo?.commits && gitInfo.commits.length > 0) {
        setGraphCommits(gitInfo.commits)
        return
      }

      if (gitInfo?.latestCommit) {
        const parts = gitInfo.latestCommit.split(' - ')
        const shortHash = parts[0]?.trim() || 'HEAD'
        const subject = parts.slice(1).join(' - ') || 'Latest commit'
        setGraphCommits([
          {
            hash: shortHash,
            shortHash,
            subject,
            author: 'Current',
            relativeDate: 'latest',
            decorations: { isHead: true, branches: [branch], remotes: [], tags: [] },
            parents: []
          }
        ])
        return
      }

      setGraphCommits([])
    } catch (err) {
      console.warn('Failed to load git graph:', err)
    } finally {
      if (!isSilent) setIsLoadingGraph(false)
    }
  }, [folderPath, gitInfo?.commits, gitInfo?.latestCommit, branch])

  useEffect(() => {
    if (folderPath && isRepo) {
      loadGitGraph(folderPath, true)
    }
  }, [folderPath, isRepo, loadGitGraph])

  // 2. Stage / Unstage / Discard Handlers
  const handleStageAll = async () => {
    if (!folderPath || !window.electronAPI?.gitStageAll) return
    try {
      const res = await window.electronAPI.gitStageAll(folderPath)
      if (res?.success) {
        showToast('All changes staged', 'success')
        onRefreshGit(folderPath)
      } else {
        showToast(res?.error || 'Failed to stage changes', 'error')
      }
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleStageFile = async (filePath, e) => {
    if (e) e.stopPropagation()
    if (!folderPath || !window.electronAPI?.gitStageFile) return
    try {
      const res = await window.electronAPI.gitStageFile(folderPath, filePath)
      if (res?.success) {
        showToast(`Staged ${filePath}`, 'success')
        onRefreshGit(folderPath)
      } else {
        showToast(res?.error || 'Failed to stage file', 'error')
      }
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleUnstageAll = async () => {
    if (!folderPath || !window.electronAPI?.gitUnstageAll) return
    try {
      const res = await window.electronAPI.gitUnstageAll(folderPath)
      if (res?.success) {
        showToast('All changes unstaged', 'info')
        onRefreshGit(folderPath)
      } else {
        showToast(res?.error || 'Failed to unstage changes', 'error')
      }
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleUnstageFile = async (filePath, e) => {
    if (e) e.stopPropagation()
    if (!folderPath || !window.electronAPI?.gitUnstageFile) return
    try {
      const res = await window.electronAPI.gitUnstageFile(folderPath, filePath)
      if (res?.success) {
        showToast(`Unstaged ${filePath}`, 'success')
        onRefreshGit(folderPath)
      } else {
        showToast(res?.error || 'Failed to unstage file', 'error')
      }
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleDiscardFile = async (filePath, e) => {
    if (e) e.stopPropagation()
    if (!folderPath || !window.electronAPI?.gitDiscardFile) return
    const confirmed = window.confirm(`Discard changes in "${filePath}"? This action cannot be undone.`)
    if (!confirmed) return

    try {
      const res = await window.electronAPI.gitDiscardFile(folderPath, filePath)
      if (res?.success) {
        showToast(`Discarded changes in ${filePath}`, 'info')
        onRefreshGit(folderPath)
      } else {
        showToast(res?.error || 'Failed to discard changes', 'error')
      }
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleDiscardAll = async () => {
    if (!folderPath || !window.electronAPI?.gitDiscardAll) return
    const confirmed = window.confirm('Discard all changes across the working tree? Untracked files will be deleted.')
    if (!confirmed) return

    try {
      const res = await window.electronAPI.gitDiscardAll(folderPath)
      if (res?.success) {
        showToast('All changes discarded', 'info')
        onRefreshGit(folderPath)
      } else {
        showToast(res?.error || 'Failed to discard all changes', 'error')
      }
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  // 3. Commit Operations
  const executeCommit = async (actionType = commitAction) => {
    if (!commitMessage.trim() && actionType !== 'commit-amend') {
      showToast('Please enter a commit message', 'warning')
      return
    }
    if (!folderPath) return

    setIsCommitting(true)
    try {
      if (stagedChanges.length === 0 && unstagedChanges.length > 0 && actionType !== 'commit-amend') {
        await window.electronAPI?.gitStageAll?.(folderPath)
      }

      if (window.electronAPI?.gitCommitAction) {
        const res = await window.electronAPI.gitCommitAction(folderPath, commitMessage.trim(), actionType)
        if (res?.success) {
          showToast(`Commit succeeded (${actionType})`, 'success')
          if (res.warning) showToast(res.warning, 'warning')
          setCommitMessage('')
          onRefreshGit(folderPath)
          loadGitGraph(folderPath)
        } else {
          showToast(res?.error || 'Commit failed', 'error')
        }
      } else if (window.electronAPI?.gitCommit) {
        const res = await window.electronAPI.gitCommit(folderPath, commitMessage.trim())
        if (res?.success) {
          showToast('Committed successfully', 'success')
          setCommitMessage('')
          onRefreshGit(folderPath)
          loadGitGraph(folderPath)
        } else {
          showToast(res?.error || 'Commit failed', 'error')
        }
      }
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setIsCommitting(false)
      setIsSplitMenuOpen(false)
    }
  }

  // 4. Remote Operations
  const handlePush = async () => {
    if (!folderPath || !window.electronAPI?.gitPush) return
    showToast('Pushing to remote origin...', 'info')
    try {
      const res = await window.electronAPI.gitPush(folderPath)
      if (res?.success) {
        showToast('Pushed changes successfully to remote', 'success')
        onRefreshGit(folderPath)
        loadGitGraph(folderPath)
      } else {
        showToast(res?.error || 'Push failed. Check remote credentials.', 'error')
      }
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handlePull = async () => {
    if (!folderPath || !window.electronAPI?.gitPull) return
    showToast('Pulling from remote origin...', 'info')
    try {
      const res = await window.electronAPI.gitPull(folderPath)
      if (res?.success) {
        showToast('Pull completed successfully', 'success')
        onRefreshGit(folderPath)
        loadGitGraph(folderPath)
      } else {
        showToast(res?.error || 'Pull failed', 'error')
      }
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleFetch = async () => {
    if (!folderPath || !window.electronAPI?.gitFetch) return
    showToast('Fetching latest remote references...', 'info')
    try {
      const res = await window.electronAPI.gitFetch(folderPath)
      if (res?.success) {
        showToast('Fetch completed', 'success')
        onRefreshGit(folderPath)
        loadGitGraph(folderPath)
      } else {
        showToast(res?.error || 'Fetch failed', 'error')
      }
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleSync = async () => {
    await handlePull()
    await handlePush()
  }

  // 5. Branch Switching & Branch Creation
  const handleOpenBranchModal = async () => {
    if (!folderPath || !window.electronAPI?.gitGetBranches) return
    try {
      const res = await window.electronAPI.gitGetBranches(folderPath)
      if (res?.success) {
        setBranches({
          current: res.current || branch,
          local: res.local || [],
          remote: res.remote || []
        })
        setIsBranchModalOpen(true)
      }
    } catch (err) {
      showToast('Failed to list branches: ' + err.message, 'error')
    }
  }

  const handleCheckoutBranch = async (targetBranch) => {
    if (!folderPath || !window.electronAPI?.gitCheckoutBranch) return
    try {
      const res = await window.electronAPI.gitCheckoutBranch(folderPath, targetBranch)
      if (res?.success) {
        showToast(`Switched to branch "${targetBranch}"`, 'success')
        setIsBranchModalOpen(false)
        onRefreshGit(folderPath)
        loadGitGraph(folderPath)
      } else {
        showToast(res?.error || `Failed to checkout "${targetBranch}"`, 'error')
      }
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleCreateBranch = async () => {
    if (!newBranchName.trim() || !folderPath || !window.electronAPI?.gitCreateBranch) return
    try {
      const res = await window.electronAPI.gitCreateBranch(folderPath, newBranchName.trim())
      if (res?.success) {
        showToast(`Created & switched to branch "${newBranchName.trim()}"`, 'success')
        setNewBranchName('')
        setIsBranchModalOpen(false)
        onRefreshGit(folderPath)
        loadGitGraph(folderPath)
      } else {
        showToast(res?.error || 'Failed to create branch', 'error')
      }
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleLocateHead = () => {
    if (graphListRef.current) {
      graphListRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      setHighlightHead(true)
      setTimeout(() => setHighlightHead(false), 1600)
    }
  }

  const handleOpenDiff = async (item, staged = false) => {
    setDiffTarget({ filePath: item.path, staged, status: item.status })
    setIsLoadingDiff(true)
    setDiffContent('')
    try {
      if (window.electronAPI?.gitDiff && folderPath) {
        const res = await window.electronAPI.gitDiff(folderPath, item.path, staged)
        setDiffContent(res?.diff || 'No text difference found.')
      } else {
        setDiffContent(`Viewing diff for ${item.path} (${item.status})`)
      }
    } catch (err) {
      setDiffContent('Error reading diff: ' + err.message)
    } finally {
      setIsLoadingDiff(false)
    }
  }

  const handleOpenCommitDetails = async (commit) => {
    if (!folderPath || !window.electronAPI?.gitShowCommit) {
      setSelectedCommit(commit)
      return
    }
    try {
      const res = await window.electronAPI.gitShowCommit(folderPath, commit.hash)
      if (res?.success) {
        setSelectedCommit({
          ...commit,
          meta: res.meta,
          files: res.files || [],
          diff: res.diff || ''
        })
      } else {
        setSelectedCommit(commit)
      }
    } catch {
      setSelectedCommit(commit)
    }
  }

  const handleOpenCloneModal = () => {
    window.dispatchEvent(new CustomEvent('open-git-clone-dialog'))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'M': return '#f59e0b'
      case 'U': return '#10b981'
      case 'A': return '#38bdf8'
      case 'D': return '#ef4444'
      case 'R': return '#a855f7'
      default: return '#94a3b8'
    }
  }

  return (
    <div className="source-control-drawer">
      {/* 1. Header Bar */}
      <SourceControlHeader
        isRefreshing={isRefreshing}
        isHeaderMenuOpen={isHeaderMenuOpen}
        setIsHeaderMenuOpen={setIsHeaderMenuOpen}
        onRefresh={() => {
          if (folderPath) {
            onRefreshGit(folderPath, false)
            loadGitGraph(folderPath, false)
          }
        }}
        onPull={handlePull}
        onPush={handlePush}
        onFetch={handleFetch}
        onSync={handleSync}
        onOpenCloneModal={handleOpenCloneModal}
        onOpenBranchModal={handleOpenBranchModal}
        onStageAll={handleStageAll}
        onUnstageAll={handleUnstageAll}
        onDiscardAll={handleDiscardAll}
      />

      {!isRepo ? (
        <div className="sc-not-repo-card">
          <div className="sc-empty-icon-wrap">
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#64748b' }}>
              fork_right
            </span>
          </div>
          <p className="sc-not-repo-title">Not a Git Repository</p>
          <p className="sc-not-repo-desc">
            The opened workspace directory does not have Git source control initialized, or you can clone an existing repository from GitHub.
          </p>
          <div className="sc-not-repo-actions">
            {folderPath && window.electronAPI?.gitInit && (
              <button
                type="button"
                className="sc-btn-init"
                onClick={async () => {
                  const res = await window.electronAPI.gitInit(folderPath)
                  if (res?.success) {
                    showToast('Initialized empty Git repository!', 'success')
                    onRefreshGit(folderPath)
                  }
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_circle</span>
                <span>Initialize Repository</span>
              </button>
            )}
            <button
              type="button"
              className="sc-btn-clone"
              onClick={handleOpenCloneModal}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
              <span>Clone Repository</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="sc-body-content custom-scrollbar">
          {/* 2. Changes Section */}
          <div className="sc-section-block">
            <div
              className="sc-section-header"
              onClick={() => setChangesExpanded((prev) => !prev)}
            >
              <span className="sc-caret-icon material-symbols-outlined">
                {changesExpanded ? 'expand_more' : 'chevron_right'}
              </span>
              <span className="sc-section-label">Changes</span>
              {totalChangesCount > 0 && (
                <span className="sc-count-badge">{totalChangesCount}</span>
              )}

              <div
                className="sc-section-actions sc-dropdown-container"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="sc-icon-btn-sm"
                  onClick={handleDiscardAll}
                  title="Discard All Changes"
                >
                  <span className="material-symbols-outlined">undo</span>
                </button>
                <button
                  type="button"
                  className="sc-icon-btn-sm"
                  onClick={handleStageAll}
                  title="Stage All Changes"
                >
                  <span className="material-symbols-outlined">check</span>
                </button>
                <button
                  type="button"
                  className="sc-icon-btn-sm"
                  onClick={() => {
                    if (folderPath) {
                      onRefreshGit(folderPath, false)
                      loadGitGraph(folderPath, false)
                    }
                  }}
                  title="Refresh Changes"
                  disabled={isRefreshing}
                >
                  <span className={`material-symbols-outlined ${isRefreshing ? 'animate-spin' : ''}`}>
                    refresh
                  </span>
                </button>
                <button
                  type="button"
                  className="sc-icon-btn-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsChangesMenuOpen((prev) => !prev)
                  }}
                  title="More Changes Actions"
                >
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>

                {isChangesMenuOpen && (
                  <div className="sc-dropdown-menu">
                    <button type="button" onClick={() => { setIsChangesMenuOpen(false); handleStageAll() }}>
                      <span className="material-symbols-outlined">check</span> Stage All
                    </button>
                    <button type="button" onClick={() => { setIsChangesMenuOpen(false); handleUnstageAll() }}>
                      <span className="material-symbols-outlined">remove</span> Unstage All
                    </button>
                    <button type="button" onClick={() => { setIsChangesMenuOpen(false); handleDiscardAll() }}>
                      <span className="material-symbols-outlined">undo</span> Discard All
                    </button>
                  </div>
                )}
              </div>
            </div>

            {changesExpanded && (
              <div className="sc-changes-body">
                <CommitBox
                  branch={branch}
                  commitMessage={commitMessage}
                  setCommitMessage={setCommitMessage}
                  isCommitting={isCommitting}
                  totalChangesCount={totalChangesCount}
                  commitAction={commitAction}
                  setCommitAction={setCommitAction}
                  isSplitMenuOpen={isSplitMenuOpen}
                  setIsSplitMenuOpen={setIsSplitMenuOpen}
                  onExecuteCommit={executeCommit}
                />

                <ChangesList
                  stagedChanges={stagedChanges}
                  unstagedChanges={unstagedChanges}
                  getStatusColor={getStatusColor}
                  onOpenDiff={handleOpenDiff}
                  onStageFile={handleStageFile}
                  onUnstageFile={handleUnstageFile}
                  onDiscardFile={handleDiscardFile}
                  onUnstageAll={handleUnstageAll}
                />
              </div>
            )}
          </div>

          {/* 3. Commit Graph Section */}
          <CommitHistorySection
            graphExpanded={graphExpanded}
            setGraphExpanded={setGraphExpanded}
            branchFilter={branchFilter}
            setBranchFilter={setBranchFilter}
            handleLocateHead={handleLocateHead}
            handlePull={handlePull}
            handlePush={handlePush}
            handleSync={handleSync}
            loadGitGraph={loadGitGraph}
            isLoadingGraph={isLoadingGraph}
            isGraphMenuOpen={isGraphMenuOpen}
            setIsGraphMenuOpen={setIsGraphMenuOpen}
            handleOpenBranchModal={handleOpenBranchModal}
            graphListRef={graphListRef}
            displayCommits={displayCommits}
            highlightHead={highlightHead}
            handleOpenCommitDetails={handleOpenCommitDetails}
            branch={branch}
            ahead={ahead}
            folderPath={folderPath}
          />
        </div>
      )}

      {/* 4. Diff Viewer Modal */}
      <DiffViewerModal
        diffTarget={diffTarget}
        diffContent={diffContent}
        isLoadingDiff={isLoadingDiff}
        onClose={() => setDiffTarget(null)}
      />

      {/* 5. Commit Inspector Modal */}
      <CommitInspectorModal
        selectedCommit={selectedCommit}
        getStatusColor={getStatusColor}
        showToast={showToast}
        onClose={() => setSelectedCommit(null)}
      />

      {/* 6. Branch Switcher Modal */}
      <BranchSwitcherModal
        isOpen={isBranchModalOpen}
        branches={branches}
        branchSearch={branchSearch}
        setBranchSearch={setBranchSearch}
        newBranchName={newBranchName}
        setNewBranchName={setNewBranchName}
        onCheckoutBranch={handleCheckoutBranch}
        onCreateBranch={handleCreateBranch}
        onClose={() => setIsBranchModalOpen(false)}
      />
    </div>
  )
}
