import React, { useState, useEffect, useRef, useCallback } from 'react'

/**
 * SourceControlDrawer
 * Authentic Git / Source Control sidebar panel matching the VisualMark Studio & VS Code theme.
 * Features:
 * - Changes section with Staged / Unstaged lists, hover actions (+ / - / ↺)
 * - Standard Git commit box with Ctrl+Enter commit support (No AI/LLM buttons)
 * - Split Commit button (Commit, Commit & Push, Commit & Sync, Commit Amend with verified icons)
 * - Visual Git Commit Graph with HEAD hollow ring, trunk line, branch badges (◎ main), remote (☁), and author
 * - Auto-refreshing status and commit history on mount, tab switch, and window focus
 * - Built-in Diff Viewer Modal & Commit Inspector Modal
 * - Branch Switcher & Creator Dialog
 */
export default function SourceControlDrawer({
  gitInfo = null,
  workspaceDirectory = null,
  onRefreshGit = () => {},
  onSelectFile = () => {},
  isRefreshing = false,
  showToast = () => {}
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

  // Inline feedback
  const [feedback, setFeedback] = useState(null)

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
  const behind = gitInfo?.behind || 0

  // Fallback to gitInfo commits if graphCommits state is empty
  const displayCommits = graphCommits.length > 0 ? graphCommits : (gitInfo?.commits || [])

  // --------------------------------------------------------------------------
  // 1. Fetch Git Graph History
  // --------------------------------------------------------------------------
  const loadGitGraph = useCallback(async (customPath = folderPath) => {
    const target = customPath || folderPath
    if (!target) return
    setIsLoadingGraph(true)
    try {
      if (window.electronAPI?.gitGetGraph) {
        const res = await window.electronAPI.gitGetGraph(target, 50)
        if (res?.success && Array.isArray(res.commits) && res.commits.length > 0) {
          setGraphCommits(res.commits)
          return
        }
      }

      // If gitInfo has commits embedded
      if (gitInfo?.commits && gitInfo.commits.length > 0) {
        setGraphCommits(gitInfo.commits)
        return
      }

      // Fallback single commit representation if latestCommit string is known
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
      }
    } catch (err) {
      console.warn('Failed to load git graph:', err)
    } finally {
      setIsLoadingGraph(false)
    }
  }, [folderPath, gitInfo?.commits, gitInfo?.latestCommit, branch])

  // Auto-refresh Git status and graph on mount & periodic polling
  useEffect(() => {
    if (folderPath) {
      onRefreshGit(folderPath)
      loadGitGraph(folderPath)
    }
  }, [folderPath, onRefreshGit, loadGitGraph])

  useEffect(() => {
    const timer = setInterval(() => {
      if (folderPath) {
        onRefreshGit(folderPath)
        loadGitGraph(folderPath)
      }
    }, 4000)

    const onFocus = () => {
      if (folderPath) {
        onRefreshGit(folderPath)
        loadGitGraph(folderPath)
      }
    }
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', onFocus)
    }
  }, [folderPath, onRefreshGit, loadGitGraph])

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.sc-dropdown-container')) {
        setIsSplitMenuOpen(false)
        setIsHeaderMenuOpen(false)
        setIsChangesMenuOpen(false)
        setIsGraphMenuOpen(false)
      }
    }
    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [])

  // --------------------------------------------------------------------------
  // 2. Staging, Unstaging, Discarding
  // --------------------------------------------------------------------------
  const handleStageAll = async () => {
    if (!folderPath || !window.electronAPI?.gitStageAll) return
    try {
      const res = await window.electronAPI.gitStageAll(folderPath)
      if (res?.success) {
        showToast('All changes staged', 'success')
        onRefreshGit(folderPath)
        loadGitGraph(folderPath)
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
        showToast('All changes unstaged', 'success')
        onRefreshGit(folderPath)
      } else {
        showToast(res?.error || 'Failed to unstage', 'error')
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

  // --------------------------------------------------------------------------
  // 3. Commit Operations (Split button: Commit, Commit & Push, Sync, Amend)
  // --------------------------------------------------------------------------
  const executeCommit = async (actionType = commitAction) => {
    if (!commitMessage.trim() && actionType !== 'commit-amend') {
      showToast('Please enter a commit message', 'warning')
      return
    }
    if (!folderPath) return

    setIsCommitting(true)
    setFeedback(null)

    try {
      // Auto stage all if nothing staged yet
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

  // --------------------------------------------------------------------------
  // 4. Remote Operations: Push, Pull, Fetch, Sync
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // 5. Branch Switching & Branch Creation
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // 6. Locate HEAD in Git Graph (Target bullseye icon ◎)
  // --------------------------------------------------------------------------
  const handleLocateHead = () => {
    if (graphListRef.current) {
      graphListRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      setHighlightHead(true)
      setTimeout(() => setHighlightHead(false), 1600)
    }
  }

  // --------------------------------------------------------------------------
  // 7. Diff Viewer & Commit Details
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  const getStatusColor = (status) => {
    switch (status) {
      case 'M': return '#f59e0b' // modified amber
      case 'U': return '#10b981' // untracked green
      case 'A': return '#38bdf8' // added cyan
      case 'D': return '#ef4444' // deleted red
      case 'R': return '#a855f7' // renamed purple
      default: return '#94a3b8'
    }
  }

  const getCommitButtonLabel = () => {
    switch (commitAction) {
      case 'commit-push': return 'Commit & Push'
      case 'commit-sync': return 'Commit & Sync'
      case 'commit-amend': return 'Commit (Amend)'
      default: return 'Commit'
    }
  }

  return (
    <div className="source-control-drawer">
      {/* ====================================================================
          1. HEADER BAR
          ==================================================================== */}
      <div className="sc-header-bar">
        <span className="sc-header-title">Source Control</span>

        <div className="sc-header-actions sc-dropdown-container">
          <button
            type="button"
            className="sc-icon-btn"
            onClick={() => {
              if (folderPath) {
                onRefreshGit(folderPath)
                loadGitGraph(folderPath)
              }
            }}
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
              setIsHeaderMenuOpen(prev => !prev)
            }}
            title="More Actions..."
          >
            <span className="material-symbols-outlined">more_horiz</span>
          </button>

          {isHeaderMenuOpen && (
            <div className="sc-dropdown-menu">
              <button type="button" onClick={() => { setIsHeaderMenuOpen(false); handlePull() }}>
                <span className="material-symbols-outlined">download</span> Pull
              </button>
              <button type="button" onClick={() => { setIsHeaderMenuOpen(false); handlePush() }}>
                <span className="material-symbols-outlined">upload</span> Push
              </button>
              <button type="button" onClick={() => { setIsHeaderMenuOpen(false); handleFetch() }}>
                <span className="material-symbols-outlined">sync</span> Fetch
              </button>
              <button type="button" onClick={() => { setIsHeaderMenuOpen(false); handleSync() }}>
                <span className="material-symbols-outlined">swap_vert</span> Synchronize
              </button>
              <div className="sc-menu-divider" />
              <button type="button" onClick={() => { setIsHeaderMenuOpen(false); handleOpenBranchModal() }}>
                <span className="material-symbols-outlined">fork_right</span> Checkout Branch...
              </button>
              <button type="button" onClick={() => { setIsHeaderMenuOpen(false); handleStageAll() }}>
                <span className="material-symbols-outlined">check</span> Stage All Changes
              </button>
              <button type="button" onClick={() => { setIsHeaderMenuOpen(false); handleUnstageAll() }}>
                <span className="material-symbols-outlined">remove</span> Unstage All Changes
              </button>
              <button type="button" onClick={() => { setIsHeaderMenuOpen(false); handleDiscardAll() }}>
                <span className="material-symbols-outlined">undo</span> Discard All Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {!isRepo ? (
        /* Not a Git Repository Card */
        <div className="sc-not-repo-card">
          <div className="sc-empty-icon-wrap">
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#64748b' }}>
              fork_right
            </span>
          </div>
          <p className="sc-not-repo-title">Not a Git Repository</p>
          <p className="sc-not-repo-desc">
            The opened workspace directory does not have Git source control initialized.
          </p>
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
              <span>Initialize Git Repository</span>
            </button>
          )}
        </div>
      ) : (
        <div className="sc-body-content custom-scrollbar">
          {/* ====================================================================
              2. CHANGES SECTION (Collapsible)
              ==================================================================== */}
          <div className="sc-section-block">
            <div
              className="sc-section-header"
              onClick={() => setChangesExpanded(prev => !prev)}
            >
              <span className="sc-caret-icon material-symbols-outlined">
                {changesExpanded ? 'expand_more' : 'chevron_right'}
              </span>
              <span className="sc-section-label">Changes</span>
              {totalChangesCount > 0 && (
                <span className="sc-count-badge">{totalChangesCount}</span>
              )}

              {/* Section Header Action Icons (✓, ↺, ...) */}
              <div
                className="sc-section-actions sc-dropdown-container"
                onClick={(e) => e.stopPropagation()}
              >
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
                  onClick={handleDiscardAll}
                  title="Discard All Changes / Refresh"
                >
                  <span className="material-symbols-outlined">refresh</span>
                </button>
                <button
                  type="button"
                  className="sc-icon-btn-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsChangesMenuOpen(prev => !prev)
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
                {/* Clean Commit Message Box */}
                <div className="sc-commit-container">
                  <div className="sc-commit-input-wrapper">
                    <textarea
                      className="sc-commit-textarea custom-scrollbar"
                      placeholder={`Message (Ctrl+Enter to commit on "${branch}"...)`}
                      rows={2}
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault()
                          executeCommit()
                        }
                      }}
                    />
                  </div>

                  {/* Split Commit Button: Primary button + Dropdown caret */}
                  <div className="sc-split-commit-group sc-dropdown-container">
                    <button
                      type="button"
                      className="sc-btn-primary-commit"
                      disabled={isCommitting || (totalChangesCount === 0 && commitAction !== 'commit-amend')}
                      onClick={() => executeCommit(commitAction)}
                      title={`Execute: ${getCommitButtonLabel()} (Ctrl+Enter)`}
                    >
                      <span className="material-symbols-outlined sc-commit-icon">check</span>
                      <span>{isCommitting ? 'Committing...' : getCommitButtonLabel()}</span>
                    </button>

                    <button
                      type="button"
                      className="sc-btn-split-toggle"
                      disabled={isCommitting}
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsSplitMenuOpen(prev => !prev)
                      }}
                      title="Select Commit Action"
                    >
                      <span className="material-symbols-outlined">expand_more</span>
                    </button>

                    {isSplitMenuOpen && (
                      <div className="sc-dropdown-menu sc-split-menu">
                        <button
                          type="button"
                          className={commitAction === 'commit' ? 'selected' : ''}
                          onClick={() => { setCommitAction('commit'); executeCommit('commit') }}
                        >
                          <span className="material-symbols-outlined">check</span> Commit
                        </button>
                        <button
                          type="button"
                          className={commitAction === 'commit-push' ? 'selected' : ''}
                          onClick={() => { setCommitAction('commit-push'); executeCommit('commit-push') }}
                        >
                          <span className="material-symbols-outlined">upload</span> Commit & Push
                        </button>
                        <button
                          type="button"
                          className={commitAction === 'commit-sync' ? 'selected' : ''}
                          onClick={() => { setCommitAction('commit-sync'); executeCommit('commit-sync') }}
                        >
                          <span className="material-symbols-outlined">swap_vert</span> Commit & Sync
                        </button>
                        <button
                          type="button"
                          className={commitAction === 'commit-amend' ? 'selected' : ''}
                          onClick={() => { setCommitAction('commit-amend'); executeCommit('commit-amend') }}
                        >
                          <span className="material-symbols-outlined">history</span> Commit (Amend)
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Staged Changes Subsection */}
                {stagedChanges.length > 0 && (
                  <div className="sc-sub-changes-group">
                    <div className="sc-sub-header">
                      <span className="sc-sub-title">STAGED CHANGES</span>
                      <span className="sc-sub-count">{stagedChanges.length}</span>
                      <button
                        type="button"
                        className="sc-icon-btn-micro"
                        onClick={handleUnstageAll}
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
                          onClick={() => handleOpenDiff(item, true)}
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
                              onClick={(e) => handleUnstageFile(item.path, e)}
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
                          onClick={() => handleOpenDiff(item, false)}
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
                              onClick={(e) => handleStageFile(item.path, e)}
                              title="Stage file"
                            >
                              <span className="material-symbols-outlined">add</span>
                            </button>
                            <button
                              type="button"
                              className="sc-icon-action"
                              onClick={(e) => handleDiscardFile(item.path, e)}
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
              </div>
            )}
          </div>

          {/* ====================================================================
              3. GRAPH SECTION (Git Commit Graph & History)
              ==================================================================== */}
          <div className="sc-section-block sc-graph-block">
            <div
              className="sc-section-header"
              onClick={() => setGraphExpanded(prev => !prev)}
            >
              <span className="sc-caret-icon material-symbols-outlined">
                {graphExpanded ? 'expand_more' : 'chevron_right'}
              </span>
              <span className="sc-section-label">Graph</span>

              {/* Header Action Icons matching Antigravity:
                  Auto, ◎ (Locate HEAD), ⇣ (Pull), ⇡ (Push), ⇅ (Sync), ↺ (Refresh), ... */}
              <div
                className="sc-section-actions sc-dropdown-container"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className={`sc-btn-pill-auto ${branchFilter === 'auto' ? 'active' : ''}`}
                  onClick={() => setBranchFilter(prev => prev === 'auto' ? 'current' : 'auto')}
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
                  onClick={() => loadGitGraph()}
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
                    setIsGraphMenuOpen(prev => !prev)
                  }}
                  title="More Graph Actions..."
                >
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>

                {isGraphMenuOpen && (
                  <div className="sc-dropdown-menu">
                    <button type="button" onClick={() => { setIsGraphMenuOpen(false); handleOpenBranchModal() }}>
                      <span className="material-symbols-outlined">fork_right</span> Switch Branch...
                    </button>
                    <button type="button" onClick={() => { setIsGraphMenuOpen(false); handleLocateHead() }}>
                      <span className="material-symbols-outlined">adjust</span> Center on HEAD
                    </button>
                    <button type="button" onClick={() => { setIsGraphMenuOpen(false); loadGitGraph() }}>
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
        </div>
      )}

      {/* ====================================================================
          4. DIFF VIEWER MODAL
          ==================================================================== */}
      {diffTarget && (
        <div className="sc-modal-overlay" onClick={() => setDiffTarget(null)}>
          <div className="sc-modal-card sc-diff-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sc-modal-header">
              <div className="sc-diff-header-meta">
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#38bdf8' }}>
                  difference
                </span>
                <span className="sc-diff-filename">{diffTarget.filePath}</span>
                <span
                  className="sc-diff-status-pill"
                  style={{ color: getStatusColor(diffTarget.status) }}
                >
                  {diffTarget.staged ? 'STAGED' : 'WORKING TREE'}
                </span>
              </div>

              <div className="sc-modal-header-actions">
                <button
                  type="button"
                  className="sc-btn-open-editor"
                  onClick={() => {
                    const full = folderPath
                      ? `${folderPath.replace(/[\\/]+$/, '')}/${diffTarget.filePath}`
                      : diffTarget.filePath
                    onSelectFile(full)
                    setDiffTarget(null)
                  }}
                  title="Open file in Monaco Editor"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>open_in_new</span>
                  <span>Open in Editor</span>
                </button>
                <button
                  type="button"
                  className="sc-btn-close-modal"
                  onClick={() => setDiffTarget(null)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="sc-modal-body custom-scrollbar">
              {isLoadingDiff ? (
                <div className="sc-diff-loading">
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: '24px' }}>
                    refresh
                  </span>
                  <span>Generating diff...</span>
                </div>
              ) : (
                <pre className="sc-diff-code-view">
                  {diffContent.split('\n').map((line, i) => {
                    let lineClass = 'diff-context'
                    if (line.startsWith('+') && !line.startsWith('+++')) lineClass = 'diff-add'
                    else if (line.startsWith('-') && !line.startsWith('---')) lineClass = 'diff-del'
                    else if (line.startsWith('@@')) lineClass = 'diff-hunk'

                    return (
                      <div key={i} className={`sc-diff-line ${lineClass}`}>
                        <span className="sc-diff-linenum">{i + 1}</span>
                        <span className="sc-diff-text">{line}</span>
                      </div>
                    )
                  })}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          5. COMMIT DETAILS INSPECTOR MODAL
          ==================================================================== */}
      {selectedCommit && (
        <div className="sc-modal-overlay" onClick={() => setSelectedCommit(null)}>
          <div className="sc-modal-card sc-commit-inspector" onClick={(e) => e.stopPropagation()}>
            <div className="sc-modal-header">
              <div className="sc-commit-modal-title">
                <span className="material-symbols-outlined" style={{ color: '#007acc' }}>commit</span>
                <span>Commit {selectedCommit.shortHash}</span>
              </div>
              <button
                type="button"
                className="sc-btn-close-modal"
                onClick={() => setSelectedCommit(null)}
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
      )}

      {/* ====================================================================
          6. BRANCH SWITCHER & CREATOR MODAL
          ==================================================================== */}
      {isBranchModalOpen && (
        <div className="sc-modal-overlay" onClick={() => setIsBranchModalOpen(false)}>
          <div className="sc-modal-card sc-branch-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sc-modal-header">
              <span className="sc-modal-title">Switch or Create Branch</span>
              <button
                type="button"
                className="sc-btn-close-modal"
                onClick={() => setIsBranchModalOpen(false)}
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
                    if (e.key === 'Enter') handleCreateBranch()
                  }}
                />
                <button
                  type="button"
                  className="sc-btn-create-branch"
                  onClick={handleCreateBranch}
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
                      onClick={() => handleCheckoutBranch(b)}
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

                {branches.remote.length > 0 && (
                  <>
                    <div className="sc-branch-group-label" style={{ marginTop: '12px' }}>Remote Branches</div>
                    {branches.remote
                      .filter(b => b.toLowerCase().includes(branchSearch.toLowerCase()))
                      .map(b => (
                        <div
                          key={`remote-${b}`}
                          className="sc-branch-item"
                          onClick={() => handleCheckoutBranch(b)}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#a855f7' }}>
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
      )}
    </div>
  )
}
