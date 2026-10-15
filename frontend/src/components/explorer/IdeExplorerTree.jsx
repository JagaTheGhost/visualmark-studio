import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { FolderIcon, getTreeItemIcon } from './ExplorerIcons'
import ExplorerContextMenu from './ExplorerContextMenu'
import InlineCreationRow from './InlineCreationRow'
import TreeNodeRow from './TreeNodeRow'

export default function IdeExplorerTree({
  files = {},
  activeFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  workspaceDirectory,
  onOpenFolder,
  onCloneRepo = () => {},
  onCloseWorkspace = () => {},
  showToast = () => {}
}) {
  const [treeData, setTreeData] = useState([])
  const [gitStatusMap, setGitStatusMap] = useState({})
  const [rootFolderName, setRootFolderName] = useState(() => (workspaceDirectory?.name || 'workspace').toUpperCase())
  const [isRootExpanded, setIsRootExpanded] = useState(true)

  // Focused / Selected Item State (VS Code standard)
  const [selectedNode, setSelectedNode] = useState(null)
  const [expandedFolders, setExpandedFolders] = useState(() => new Set())

  // Inline Creation State
  const [inlineAction, setInlineAction] = useState(null) // { type: 'file' | 'folder', parentPath: string, depth: number }
  const [inlineName, setInlineName] = useState('')
  const inlineInputRef = useRef(null)

  // Inline Rename State
  const [renamingNode, setRenamingNode] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const renameInputRef = useRef(null)

  // Context Menu State
  const [contextMenu, setContextMenu] = useState(null) // { x, y, node }
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const moreMenuRef = useRef(null)
  const containerRef = useRef(null)

  // Drag and Drop state
  const [draggedNode, setDraggedNode] = useState(null)
  const [dragOverNode, setDragOverNode] = useState(null)

  // Close more menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setIsMoreMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close context menu on click or Escape
  useEffect(() => {
    if (!contextMenu) return
    const handleClose = () => setContextMenu(null)
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setContextMenu(null)
    }
    window.addEventListener('click', handleClose)
    window.addEventListener('contextmenu', handleClose)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('click', handleClose)
      window.removeEventListener('contextmenu', handleClose)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [contextMenu])

  // Focus inline inputs when opened
  useEffect(() => {
    if (inlineAction && inlineInputRef.current) {
      inlineInputRef.current.focus()
      inlineInputRef.current.select()
    }
  }, [inlineAction])

  // Read full tree from Electron IPC or fallback to in-memory files
  const refreshTree = useCallback(async () => {
    if (typeof window !== 'undefined' && window.electronAPI?.readWorkspaceTree) {
      try {
        const targetPath = workspaceDirectory?.path || null
        const res = targetPath
          ? await window.electronAPI.readWorkspaceTree(targetPath)
          : (window.electronAPI.getDefaultWorkspace ? await window.electronAPI.getDefaultWorkspace() : null)

        if (res && Array.isArray(res.tree) && (targetPath || res.rootPath)) {
          const sortNodes = (nodes) => {
            return [...nodes].sort((a, b) => {
              if (a.isDirectory === b.isDirectory) {
                return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
              }
              return a.isDirectory ? -1 : 1
            }).map((n) => (n.children ? { ...n, children: sortNodes(n.children) } : n))
          }

          setTreeData(sortNodes(res.tree))
          setGitStatusMap(res.gitStatus || {})
          setRootFolderName((res.rootName || workspaceDirectory?.name || 'workspace').toUpperCase())
          return
        } else if (!targetPath && !res?.rootPath) {
          setTreeData([])
          setGitStatusMap({})
          setRootFolderName('NO FOLDER OPENED')
          return
        }
      } catch (err) {
        console.warn('Failed to read workspace tree via IPC:', err)
      }
    }

    // Web fallback: show in-memory files
    const fileEntries = Object.keys(files || {})
    if (fileEntries.length > 0) {
      const liveTree = fileEntries.map((name) => ({
        name,
        relPath: name,
        isDirectory: false,
        status: name === activeFile ? 'M' : undefined
      }))
      setTreeData(liveTree)
      setRootFolderName((workspaceDirectory?.name || 'workspace').toUpperCase())
    } else {
      setTreeData([])
    }
  }, [files, activeFile, workspaceDirectory])

  useEffect(() => {
    refreshTree()
  }, [refreshTree])

  useEffect(() => {
    const handleTreeRefresh = () => refreshTree()
    window.addEventListener('workspace-tree-refresh', handleTreeRefresh)
    return () => window.removeEventListener('workspace-tree-refresh', handleTreeRefresh)
  }, [refreshTree])

  // Auto-Reveal active file in tree
  useEffect(() => {
    if (!activeFile || treeData.length === 0) return

    const findParents = (nodes, target, currentParents = []) => {
      for (const node of nodes) {
        if (!node.isDirectory) {
          if (node.relPath === target) {
            return { node, parents: currentParents }
          }
        } else if (node.children) {
          const res = findParents(node.children, target, [...currentParents, node.relPath || node.name])
          if (res) return res
        }
      }
      return null
    }

    let found = findParents(treeData, activeFile)
    if (!found) {
      const findByName = (nodes, target, currentParents = []) => {
        for (const node of nodes) {
          if (!node.isDirectory) {
            if (node.name === target) {
              return { node, parents: currentParents }
            }
          } else if (node.children) {
            const res = findByName(node.children, target, [...currentParents, node.relPath || node.name])
            if (res) return res
          }
        }
        return null
      }
      found = findByName(treeData, activeFile)
    }

    if (found) {
      setSelectedNode(found.node)
      if (found.parents.length > 0) {
        setExpandedFolders((prev) => new Set([...prev, ...found.parents]))
      }
    }
  }, [activeFile, treeData])

  const toggleFolder = useCallback((folderKey) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderKey)) {
        next.delete(folderKey)
      } else {
        next.add(folderKey)
      }
      return next
    })
  }, [])

  const collapseAll = useCallback(() => {
    setExpandedFolders(new Set())
  }, [])

  const handleStartCreation = (type, forcedParentPath = null, forcedDepth = 1) => {
    let parentPath = ''
    let depth = 1

    if (forcedParentPath !== null) {
      parentPath = forcedParentPath
      depth = forcedDepth
    } else if (selectedNode) {
      if (selectedNode.isDirectory) {
        parentPath = selectedNode.relPath || selectedNode.name
        depth = (parentPath.split('/').length || 1) + 1
      } else if (selectedNode.relPath && selectedNode.relPath.includes('/')) {
        parentPath = selectedNode.relPath.substring(0, selectedNode.relPath.lastIndexOf('/'))
        depth = (parentPath.split('/').length || 1) + 1
      }
    }

    setIsRootExpanded(true)
    if (parentPath) {
      setExpandedFolders((prev) => new Set([...prev, parentPath]))
    }

    setInlineAction({ type, parentPath, depth })
    setInlineName('')
  }

  const handleCommitCreation = async (e) => {
    e?.preventDefault()
    if (!inlineAction) return

    const rawName = inlineName.trim()
    if (!rawName) {
      setInlineAction(null)
      return
    }

    const baseDir = workspaceDirectory?.path
    const parentPath = inlineAction.parentPath ? `${inlineAction.parentPath}/` : ''
    const relPath = `${parentPath}${rawName}`.replace(/\\/g, '/')
    let fullPath = null

    if (baseDir) {
      fullPath = `${baseDir.replace(/[\\/]+$/, '')}/${relPath}`.replace(/\\/g, '/')
    }

    if (inlineAction.type === 'file') {
      const initialContent = rawName.endsWith('.md')
        ? `# ${rawName.replace(/\.[^/.]+$/, '')}\n\n`
        : ''

      if (typeof window !== 'undefined' && window.electronAPI?.createFileDirect && fullPath) {
        await window.electronAPI.createFileDirect(fullPath, initialContent)
      }

      onCreateFile(relPath, initialContent, fullPath)
      setSelectedNode({ name: rawName, relPath, isDirectory: false, path: fullPath })
      showToast(`Created file "${rawName}"`, 'success')
    } else {
      if (typeof window !== 'undefined' && window.electronAPI?.createFolderDirect && fullPath) {
        await window.electronAPI.createFolderDirect(fullPath)
      }
      setExpandedFolders((prev) => new Set([...prev, relPath]))
      setSelectedNode({ name: rawName, relPath, isDirectory: true, path: fullPath })
      showToast(`Created folder "${rawName}"`, 'success')
    }

    setInlineAction(null)
    setInlineName('')
    refreshTree()
  }

  const handleStartRename = (node) => {
    setRenamingNode(node)
    setRenameValue(node.name)
    setContextMenu(null)
    setTimeout(() => {
      if (renameInputRef.current) {
        renameInputRef.current.focus()
        const dotIdx = node.name.lastIndexOf('.')
        if (dotIdx > 0 && !node.isDirectory) {
          renameInputRef.current.setSelectionRange(0, dotIdx)
        } else {
          renameInputRef.current.select()
        }
      }
    }, 50)
  }

  const handleCommitRename = async (e) => {
    e?.preventDefault()
    if (!renamingNode) return
    const newName = renameValue.trim()
    const oldNode = renamingNode
    setRenamingNode(null)
    if (!newName || newName === oldNode.name) return

    const oldPath = oldNode.path
    if (oldPath && typeof window !== 'undefined' && window.electronAPI?.moveFileDirect) {
      const dir = oldPath.substring(0, Math.max(oldPath.lastIndexOf('/'), oldPath.lastIndexOf('\\')))
      const newPath = `${dir}/${newName}`.replace(/\\/g, '/')
      const res = await window.electronAPI.moveFileDirect(oldPath, newPath)
      if (res?.success) {
        showToast(`Renamed to "${newName}"`, 'success')
        refreshTree()
      }
    }
  }

  const handleOpenFile = async (node) => {
    setSelectedNode(node)
    if (node.isDirectory) {
      toggleFolder(node.relPath || node.name)
      return
    }

    if (typeof window !== 'undefined' && window.electronAPI?.readFile && node.path) {
      try {
        const res = await window.electronAPI.readFile(node.path)
        if (res?.success) {
          if (res.isUnsupported) {
            onSelectFile(node.relPath || node.name, null, node.path, res)
          } else {
            onSelectFile(node.relPath || node.name, res.content, node.path)
          }
          return
        }
      } catch (err) {
        console.warn('Error reading file:', err)
      }
    }

    onSelectFile(node.relPath || node.name)
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirmTarget) return
    const target = deleteConfirmTarget
    setDeleteConfirmTarget(null)

    if (target.path && typeof window !== 'undefined' && window.electronAPI?.deleteFileDirect) {
      await window.electronAPI.deleteFileDirect(target.path)
    }

    onDeleteFile(target.relPath || target.name)
    showToast(`Deleted ${target.name}`, 'info')
    refreshTree()
  }

  // Handle external drag-and-drop
  const handleExternalDrop = useCallback(async (e, targetFolder = workspaceDirectory?.path) => {
    e.preventDefault()
    e.stopPropagation()
    if (!targetFolder || typeof window === 'undefined' || !window.electronAPI?.copyFileDirect) return
    const dropFiles = e.dataTransfer.files
    if (!dropFiles || dropFiles.length === 0) return

    let copiedCount = 0
    let firstMd = null

    for (let i = 0; i < dropFiles.length; i++) {
      const file = dropFiles[i]
      if (file.path) {
        const destPath = `${targetFolder.replace(/[\\/]+$/, '')}/${file.name}`
        try {
          const res = await window.electronAPI.copyFileDirect(file.path, destPath)
          if (res?.success) {
            copiedCount++
            if (!firstMd && /\.(md|markdown|txt)$/i.test(file.name)) {
              firstMd = { name: file.name, path: destPath }
            }
          }
        } catch (err) {
          console.warn('Failed to copy external file to tree:', err)
        }
      }
    }

    if (copiedCount > 0) {
      showToast(`✓ Copied ${copiedCount} file(s) into ${targetFolder.split(/[\\/]/).pop() || 'workspace'}`, 'success')
      refreshTree()
      if (firstMd && onSelectFile) {
        const normWs = (workspaceDirectory?.path || '').replace(/\\/g, '/').replace(/\/+$/, '')
        const normFile = firstMd.path.replace(/\\/g, '/')
        const relPath = normWs && normFile.toLowerCase().startsWith(normWs.toLowerCase() + '/')
          ? normFile.slice(normWs.length + 1)
          : firstMd.name
        onSelectFile(relPath, null, firstMd.path)
      }
    }
  }, [workspaceDirectory, showToast, refreshTree, onSelectFile])

  // Flattened visible nodes list for keyboard navigation
  const visibleNodes = useMemo(() => {
    const list = []
    const traverse = (nodes) => {
      for (const n of nodes) {
        list.push(n)
        const isExp = expandedFolders.has(n.relPath || n.name)
        if (n.isDirectory && isExp && n.children) {
          traverse(n.children)
        }
      }
    }
    if (isRootExpanded) traverse(treeData)
    return list
  }, [treeData, isRootExpanded, expandedFolders])

  const handleKeyDown = (e) => {
    if (inlineAction || renamingNode) return
    if (visibleNodes.length === 0) return

    const currentIndex = selectedNode
      ? visibleNodes.findIndex((n) => (n.path || n.name) === (selectedNode.path || selectedNode.name))
      : -1

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextIdx = Math.min(visibleNodes.length - 1, currentIndex + 1)
      setSelectedNode(visibleNodes[nextIdx])
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevIdx = Math.max(0, currentIndex - 1)
      setSelectedNode(visibleNodes[prevIdx])
    } else if (e.key === 'ArrowRight') {
      if (selectedNode && selectedNode.isDirectory) {
        setExpandedFolders((prev) => new Set([...prev, selectedNode.relPath || selectedNode.name]))
      }
    } else if (e.key === 'ArrowLeft') {
      if (selectedNode && selectedNode.isDirectory) {
        setExpandedFolders((prev) => {
          const next = new Set(prev)
          next.delete(selectedNode.relPath || selectedNode.name)
          return next
        })
      }
    } else if (e.key === 'Enter') {
      if (selectedNode) {
        handleOpenFile(selectedNode)
      }
    } else if (e.key === 'F2') {
      if (selectedNode) {
        handleStartRename(selectedNode)
      }
    } else if (e.key === 'Delete') {
      if (selectedNode && selectedNode.name !== 'README.md') {
        setDeleteConfirmTarget(selectedNode)
      }
    }
  }

  // Drag and Drop handlers within tree
  const handleDragStart = (e, node) => {
    setDraggedNode(node)
    e.dataTransfer.setData('text/plain', node.path || node.relPath || node.name)
  }

  const handleDragOver = (e, node) => {
    e.preventDefault()
    if (draggedNode && (draggedNode.path || draggedNode.name) !== (node.path || node.name)) {
      setDragOverNode(node.path || node.name)
    }
  }

  const handleDragLeave = () => {
    setDragOverNode(null)
  }

  const handleDrop = async (e, targetNode) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverNode(null)
    if (!draggedNode) return

    if ((draggedNode.path || draggedNode.name) === (targetNode.path || targetNode.name)) {
      setDraggedNode(null)
      return
    }

    const targetDir = targetNode.isDirectory
      ? targetNode.path
      : targetNode.path?.substring(0, Math.max(targetNode.path.lastIndexOf('/'), targetNode.path.lastIndexOf('\\')))

    if (draggedNode.path && targetDir && window.electronAPI?.moveFileDirect) {
      const destPath = `${targetDir}/${draggedNode.name}`.replace(/\\/g, '/')
      const res = await window.electronAPI.moveFileDirect(draggedNode.path, destPath)
      if (res?.success) {
        showToast(`Moved "${draggedNode.name}"`, 'success')
        refreshTree()
      }
    }
    setDraggedNode(null)
  }

  // Recursive tree renderer
  const renderTreeNode = (node, depth = 1) => {
    const isExpanded = expandedFolders.has(node.relPath || node.name)
    const isSelected = selectedNode && (selectedNode.path || selectedNode.name) === (node.path || node.name)
    const isActive = !node.isDirectory && (node.relPath === activeFile || node.name === activeFile)
    const gitStatus = gitStatusMap[node.path] || gitStatusMap[node.relPath]
    const isInlineTarget = inlineAction && inlineAction.parentPath === (node.relPath || node.name)

    return (
      <React.Fragment key={node.path || node.relPath || node.name}>
        <TreeNodeRow
          node={node}
          depth={depth}
          isExpanded={isExpanded}
          isSelected={isSelected}
          isActive={isActive}
          gitStatus={gitStatus}
          renamingNode={renamingNode}
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          renameInputRef={renameInputRef}
          onCommitRename={handleCommitRename}
          onCancelRename={() => setRenamingNode(null)}
          onToggleExpand={toggleFolder}
          onSelectNode={setSelectedNode}
          onOpenFile={handleOpenFile}
          onContextMenu={(e, n) => {
            const x = Math.min(e.clientX, window.innerWidth - 220)
            const y = Math.min(e.clientY, window.innerHeight - 300)
            setContextMenu({ x, y, node: n })
          }}
          onStartCreation={handleStartCreation}
          dragOverNode={dragOverNode}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />

        {node.isDirectory && isExpanded && (
          <div className="ide-tree-children">
            {isInlineTarget && (
              <InlineCreationRow
                depth={depth}
                action={inlineAction}
                name={inlineName}
                setName={setInlineName}
                onSubmit={handleCommitCreation}
                onCancel={() => setInlineAction(null)}
                inputRef={inlineInputRef}
              />
            )}
            {node.children && node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </React.Fragment>
    )
  }

  return (
    <div
      ref={containerRef}
      className="ide-explorer-container select-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => setSelectedNode(null)}
      onDragOver={(e) => {
        if (e.dataTransfer.types && (e.dataTransfer.types.includes('Files') || e.dataTransfer.files?.length > 0)) {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        }
      }}
      onDrop={(e) => {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleExternalDrop(e, workspaceDirectory?.path)
        }
      }}
      onContextMenu={(e) => {
        if (e.target.closest('.ide-tree-row')) return
        e.preventDefault()
        const x = Math.min(e.clientX, window.innerWidth - 220)
        const y = Math.min(e.clientY, window.innerHeight - 300)
        setContextMenu({ x, y, node: null })
      }}
    >
      {/* 1. Header Toolbar */}
      <div className="ide-explorer-header">
        <span className="ide-explorer-title">Explorer</span>
        <div className="ide-explorer-top-actions">
          <div className="ide-more-menu-wrapper" ref={moreMenuRef}>
            <button
              type="button"
              className={`ide-header-btn ${isMoreMenuOpen ? 'active' : ''}`}
              title="Views and More Actions..."
              onClick={(e) => {
                e.stopPropagation()
                setIsMoreMenuOpen((prev) => !prev)
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>more_horiz</span>
            </button>

            {isMoreMenuOpen && (
              <div className="ide-dropdown-menu">
                <button
                  type="button"
                  className="ide-dropdown-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false)
                    onOpenFolder()
                  }}
                >
                  <span className="material-symbols-outlined">folder_open</span>
                  <span>Open Folder...</span>
                </button>
                <button
                  type="button"
                  className="ide-dropdown-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false)
                    onCloneRepo()
                  }}
                >
                  <span className="material-symbols-outlined">download</span>
                  <span>Clone Repository...</span>
                </button>
                <div className="ide-dropdown-divider" />
                <button
                  type="button"
                  className="ide-dropdown-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false)
                    refreshTree()
                  }}
                >
                  <span className="material-symbols-outlined">refresh</span>
                  <span>Refresh Explorer</span>
                </button>
                <button
                  type="button"
                  className="ide-dropdown-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false)
                    collapseAll()
                  }}
                >
                  <span className="material-symbols-outlined">collapse_all</span>
                  <span>Collapse Folders In Explorer</span>
                </button>
                <div className="ide-dropdown-divider" />
                <button
                  type="button"
                  className="ide-dropdown-item is-danger"
                  onClick={() => {
                    setIsMoreMenuOpen(false)
                    onCloseWorkspace()
                  }}
                >
                  <span className="material-symbols-outlined">close</span>
                  <span>Close Workspace</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Workspace Root Section Header */}
      <div
        className="ide-project-root-header ide-root-folder-bar"
        onClick={() => setIsRootExpanded((prev) => !prev)}
      >
        <div className="ide-root-title-group">
          <span className="material-symbols-outlined ide-root-chevron">
            {isRootExpanded ? 'expand_more' : 'chevron_right'}
          </span>
          <span className="ide-root-name truncate">{rootFolderName}</span>
        </div>

        {/* Hover Action Strip (Right-Aligned in Marked Location) */}
        <div className="ide-root-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="ide-root-action-btn ide-row-quick-btn"
            onClick={() => handleStartCreation('file')}
            title="New File (Ctrl+N)"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>note_add</span>
          </button>
          <button
            type="button"
            className="ide-root-action-btn ide-row-quick-btn"
            onClick={() => handleStartCreation('folder')}
            title="New Folder"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>create_new_folder</span>
          </button>
          <button
            type="button"
            className="ide-root-action-btn ide-row-quick-btn"
            onClick={refreshTree}
            title="Refresh Explorer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>refresh</span>
          </button>
          <button
            type="button"
            className="ide-root-action-btn ide-row-quick-btn"
            onClick={collapseAll}
            title="Collapse Folders in Explorer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>collapse_all</span>
          </button>
        </div>
      </div>

      {/* 3. Tree Content */}
      {isRootExpanded && (
        <div className="ide-tree-scroll-container custom-scrollbar">
          {/* Inline creation at root level */}
          {inlineAction && !inlineAction.parentPath && (
            <InlineCreationRow
              depth={0}
              action={inlineAction}
              name={inlineName}
              setName={setInlineName}
              onSubmit={handleCommitCreation}
              onCancel={() => setInlineAction(null)}
              inputRef={inlineInputRef}
            />
          )}

          {treeData.length === 0 ? (
            <div className="ide-empty-tree-placeholder">
              <span>No files in this workspace</span>
              <button
                type="button"
                className="ide-btn-create-first"
                onClick={() => handleStartCreation('file')}
              >
                Create New Document
              </button>
            </div>
          ) : (
            treeData.map((node) => renderTreeNode(node, 1))
          )}
        </div>
      )}

      {/* 4. Right-Click Context Menu */}
      <ExplorerContextMenu
        contextMenu={contextMenu}
        onClose={() => setContextMenu(null)}
        onStartCreation={handleStartCreation}
        onOpenFile={handleOpenFile}
        onStartRename={handleStartRename}
        onDeleteTarget={setDeleteConfirmTarget}
        onOpenFolder={onOpenFolder}
        showToast={showToast}
      />

      {/* 5. Safe Delete Confirmation Dialog */}
      {deleteConfirmTarget && (
        <div className="ide-modal-overlay" onClick={() => setDeleteConfirmTarget(null)}>
          <div className="ide-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ide-dialog-header">
              <span className="material-symbols-outlined" style={{ color: '#ef4444' }}>warning</span>
              <span className="ide-dialog-title">
                Delete {deleteConfirmTarget.isDirectory ? 'Folder' : 'File'}?
              </span>
            </div>
            <p className="ide-dialog-message">
              Are you sure you want to permanently delete <strong>{deleteConfirmTarget.name}</strong>
              {deleteConfirmTarget.isDirectory ? ' and all of its contents' : ''}?
            </p>
            <div className="ide-dialog-actions">
              <button
                type="button"
                className="ide-btn-cancel"
                onClick={() => setDeleteConfirmTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ide-btn-danger"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
