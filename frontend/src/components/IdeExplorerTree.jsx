import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'

// Base Outline Folder Icons matching VS Code / Antigravity IDE
function FolderIcon({ isExpanded, isSpecial = null }) {
  if (isSpecial === 'github') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <path
          d={isExpanded
            ? "M1.5 3.5h4l1.2 1.2h7.8c.5 0 .9.4.9.9v1.9H1.5M14.5 6l-1.8 6.5H1.5L3.3 6h11.2z"
            : "M1.5 3.5h4l1.2 1.2h7.8c.5 0 .9.4.9.9v6.4c0 .5-.4.9-.9.9H1.5c-.5 0-.9-.4-.9-.9V4.4c0-.5.4-.9.9-.9z"
          }
          stroke="#9d9d9d"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 5.6a2.4 2.4 0 0 0-.76 4.67c.12.02.16-.05.16-.12v-.42c-.67.14-.81-.32-.81-.32-.11-.28-.27-.35-.27-.35-.22-.15.02-.15.02-.15.24.02.37.25.37.25.22.37.57.26.71.2.02-.16.09-.27.16-.33-1.04-.12-1.76-.52-1.76-1.84 0-.38.14-.68.36-.92-.04-.09-.16-.43.03-.9 0 0 .29-.09.94.35a3.3 3.3 0 0 1 1.7 0c.65-.45.94-.35.94-.35.19.47.07.82.03.9.22.24.36.55.36.92 0 1.33-.73 1.72-1.77 1.83.09.08.16.23.16.47v.7c0 .07.05.14.17.12A2.4 2.4 0 0 0 8 5.6z"
          fill="#c084fc"
        />
      </svg>
    )
  }

  if (isSpecial === 'test') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <path
          d={isExpanded
            ? "M1.5 3.5h4l1.2 1.2h7.8c.5 0 .9.4.9.9v1.9H1.5M14.5 6l-1.8 6.5H1.5L3.3 6h11.2z"
            : "M1.5 3.5h4l1.2 1.2h7.8c.5 0 .9.4.9.9v6.4c0 .5-.4.9-.9.9H1.5c-.5 0-.9-.4-.9-.9V4.4c0-.5.4-.9.9-.9z"
          }
          stroke="#9d9d9d"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.5 8L4 9.5l1.5 1.5M10.5 8L12 9.5l-1.5 1.5"
          stroke="#f87171"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  // Standard VS Code Folder Icons
  if (isExpanded) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <path
          d="M1.5 3.5h4l1.2 1.2h7.8c.5 0 .9.4.9.9v1.9H1.5M14.5 6l-1.8 6.5H1.5L3.3 6h11.2z"
          stroke="#eab308"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M1.5 3.5h4l1.2 1.2h7.8c.5 0 .9.4.9.9v6.4c0 .5-.4.9-.9.9H1.5c-.5 0-.9-.4-.9-.9V4.4c0-.5.4-.9.9-.9z"
        stroke="#d4d4d8"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// File and Folder Icons matching VS Code & Antigravity IDE
function getTreeItemIcon(item, isExpanded) {
  if (item.isDirectory) {
    const nameLower = item.name.toLowerCase()
    if (nameLower === '.github') return <FolderIcon isExpanded={isExpanded} isSpecial="github" />
    if (nameLower === 'test' || nameLower === 'tests') return <FolderIcon isExpanded={isExpanded} isSpecial="test" />
    return <FolderIcon isExpanded={isExpanded} />
  }

  const nameLower = item.name.toLowerCase()
  const ext = nameLower.split('.').pop() || ''

  // Markdown files
  if (ext === 'md' || ext === 'markdown') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#38bdf8" style={{ flexShrink: 0 }}>
        <path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM3 11V6h1.5l1.5 2 1.5-2H9v5H7.5V8.5L6 10.5 4.5 8.5V11H3zm9.5 0L10 8.5h1.5V6H13v2.5h1.5L12.5 11z"/>
      </svg>
    )
  }

  // React & TypeScript
  if (ext === 'jsx') {
    return (
      <svg width="15" height="15" viewBox="-11.5 -10.23 23 20.46" fill="none" stroke="#61dafb" strokeWidth="1.3" style={{ flexShrink: 0 }}>
        <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </svg>
    )
  }

  if (ext === 'tsx') {
    return (
      <svg width="15" height="15" viewBox="-11.5 -10.23 23 20.46" fill="none" stroke="#3178c6" strokeWidth="1.3" style={{ flexShrink: 0 }}>
        <circle cx="0" cy="0" r="2.05" fill="#3178c6" />
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </svg>
    )
  }

  if (ext === 'ts') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#3178c6" style={{ flexShrink: 0 }}>
        <path d="M2 2v12h12V2H2zm3 3h4v1.5H7.2V11H5.8V6.5H5V5zm4.8 2.2h1.5c.6 0 1 .4 1 1 0 .4-.2.7-.6.9.5.1.8.5.8 1 0 .7-.5 1.1-1.2 1.1H9.8V7.2zm1.2 1.1c.3 0 .5-.2.5-.4 0-.3-.2-.4-.5-.4h-.4v.8h.4zm.1 1.9c.3 0 .6-.2.6-.5 0-.3-.3-.5-.6-.5h-.5v1h.5z"/>
      </svg>
    )
  }

  if (ext === 'js' || ext === 'mjs' || ext === 'cjs') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#f7df1e" style={{ flexShrink: 0 }}>
        <path d="M2 2v12h12V2H2zm8.5 8.5c-.3.5-.8.8-1.5.8-1.2 0-1.8-.8-1.8-2 0-1.4.8-2.1 2-2.1.6 0 1.1.2 1.4.6l-.6.6c-.2-.3-.5-.4-.8-.4-.7 0-1.2.5-1.2 1.3 0 .8.4 1.3 1.1 1.3.4 0 .7-.2.9-.4l.5.5z"/>
      </svg>
    )
  }

  // Python
  if (ext === 'py') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <path fill="#387eb8" d="M11.91 2C6.4 2 6.42 4.49 6.42 4.49H11.9v1.99H4.42S1.93 6.46 1.93 11.97s2.49 5.48 2.49 5.48h1.49v-2.73s-.08-3.23 3.19-3.23h5.48v-2.5s.4-3.5-3.59-3.5h-1.5zm-2.49 1.74a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/>
        <path fill="#ffe873" d="M12.09 22c5.51 0 5.49-2.49 5.49-2.49h-5.48v-1.99h7.48s2.49.02 2.49-5.49-2.49-5.48-2.49-5.48h-1.49v2.73s.08 3.23-3.19 3.23h-5.48v2.5s-.4 3.5 3.59 3.5h1.5zm2.49-1.74a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"/>
      </svg>
    )
  }

  // JSON
  if (ext === 'json') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#f59e0b" style={{ flexShrink: 0 }}>
        <path d="M4 2v3c0 1-1 1-1 2 0 1 1 1 1 2v3c0 1 1 1 2 1v-1c-.5 0-1 0-1-1v-2.5c0-.8-.7-1.2-1.2-1.5.5-.3 1.2-.7 1.2-1.5V3c0-1 .5-1 1-1V1c-1 0-2 0-2 1zm8 0c-1 0-2 0-2-1v1c.5 0 1 0 1 1v2.5c0 .8.7 1.2 1.2 1.5-.5.3-1.2.7-1.2 1.5V11c0 1-.5 1-1 1v1c1 0 2 0 2-1v-3c0-1 1-1 1-2 0-1-1-1-1-2V2z"/>
      </svg>
    )
  }

  // CSS / Styling
  if (ext === 'css' || ext === 'scss' || ext === 'less') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#38bdf8" style={{ flexShrink: 0 }}>
        <path d="M2 1h12l-1.5 13L8 15.5 3.5 14 2 1zm10.2 3.5H4.2l.3 2.5h7.3l-.4 3.5-3.4 1-3.4-1-.2-1.8H3l.3 3.2 4.7 1.4 4.7-1.4.8-7.4z"/>
      </svg>
    )
  }

  // HTML
  if (ext === 'html' || ext === 'htm') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#f97316" style={{ flexShrink: 0 }}>
        <path d="M5.5 3.5L2 8l3.5 4.5 1.2-1L3.9 8l2.8-3.5-1.2-1zm5 0l-1.2 1L12.1 8l-2.8 3.5 1.2 1L14 8l-3.5-4.5z"/>
      </svg>
    )
  }

  // Vector & Images
  if (ext === 'svg' || ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp' || ext === 'gif') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#c084fc" style={{ flexShrink: 0 }}>
        <path d="M2 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2zm11 11H3l3.5-4.5 2.5 3 2-2.5 2 4zm0-8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      </svg>
    )
  }

  // Shell & Scripts
  if (ext === 'sh' || ext === 'bash' || ext === 'ps1' || ext === 'bat' || ext === 'cmd') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#10b981" style={{ flexShrink: 0 }}>
        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11zM3 4.5l3 3-3 3 .8.8 3.8-3.8L3.8 3.7 3 4.5zm5 7h4v-1.2H8v1.2z"/>
      </svg>
    )
  }

  // YAML & Configs
  if (ext === 'yaml' || ext === 'yml' || ext === 'toml') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#ef4444" style={{ flexShrink: 0 }}>
        <path d="M2 3h12v10H2V3zm1 1v8h10V4H3zm2 2h6v1H5V6zm0 2h6v1H5V8zm0 2h4v1H5v-1z"/>
      </svg>
    )
  }

  // License
  if (nameLower.startsWith('license')) {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#eab308" style={{ flexShrink: 0 }}>
        <path d="M8 0L1 3v5c0 4.42 3.06 8.55 7 9.5 3.94-.95 7-5.08 7-9.5V3l-7-3zm3 7.5L7.25 11.25a.75.75 0 0 1-1.06 0l-1.5-1.5a.75.75 0 1 1 1.06-1.06l.97.97 3.22-3.22a.75.75 0 1 1 1.06 1.06z"/>
      </svg>
    )
  }

  // Default File
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="#94a3b8" style={{ flexShrink: 0 }}>
      <path d="M9 1H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7L9 1zm1 5V2.5L13.5 6H10z"/>
    </svg>
  )
}

export default function IdeExplorerTree({
  files = {},
  activeFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  workspaceDirectory,
  onOpenFolder,
  showToast = () => {}
}) {
  const [treeData, setTreeData] = useState([])
  const [gitStatusMap, setGitStatusMap] = useState({})
  const [rootFolderName, setRootFolderName] = useState(() => (workspaceDirectory?.name || 'workspace').toUpperCase())
  const [isRootExpanded, setIsRootExpanded] = useState(true)

  // Focused / Selected Item State (VS Code standard)
  const [selectedNode, setSelectedNode] = useState(null)
  const [expandedFolders, setExpandedFolders] = useState(() => new Set())

  // Inline Creation State (renders at the EXACT target folder level)
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

        if (res && Array.isArray(res.tree)) {
          // Sort folders first, then files alphabetically (VS Code standard)
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

  // Refresh tree on custom event (e.g., when docs are generated or saved)
  useEffect(() => {
    const handleTreeRefresh = () => refreshTree()
    window.addEventListener('workspace-tree-refresh', handleTreeRefresh)
    return () => window.removeEventListener('workspace-tree-refresh', handleTreeRefresh)
  }, [refreshTree])

  // Auto-Reveal: When activeFile changes, auto-expand its parent folders and select it in tree
  useEffect(() => {
    if (!activeFile || treeData.length === 0) return

    const findParents = (nodes, target, currentParents = []) => {
      // First pass: exact relative path match
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
      // Fallback: match by base name if activeFile has no directory prefix
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

  // Toggle Folder open/closed
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

  // Start inline creation: determines destination folder from current selection
  const handleStartCreation = (type, forcedParentPath = null, forcedDepth = 1) => {
    let parentPath = ''
    let depth = 1

    if (forcedParentPath !== null) {
      parentPath = forcedParentPath
      depth = forcedDepth
    } else if (selectedNode) {
      if (selectedNode.isDirectory) {
        parentPath = selectedNode.relPath || selectedNode.name
        // Calculate depth from slashes
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

  // Commit inline file or folder creation
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
      // Folder creation
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

  // Inline Rename
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

  // Open file in Editor Tab
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

  // Safe delete file or folder
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

  // Handle external drag-and-drop from Windows Explorer onto tree folders or root
  const handleExternalDrop = useCallback(async (e, targetFolder = workspaceDirectory?.path) => {
    e.preventDefault()
    e.stopPropagation()
    if (!targetFolder || typeof window === 'undefined' || !window.electronAPI?.copyFileDirect) return
    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    let copiedCount = 0
    let firstMd = null

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
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

  // Flattened visible nodes list for Keyboard Navigation (Arrow keys)
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

  // Keyboard navigation handler (ArrowDown, ArrowUp, ArrowRight, ArrowLeft, Enter, F2, Delete)
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
        const key = selectedNode.relPath || selectedNode.name
        if (!expandedFolders.has(key)) {
          e.preventDefault()
          toggleFolder(key)
        }
      }
    } else if (e.key === 'ArrowLeft') {
      if (selectedNode && selectedNode.isDirectory) {
        const key = selectedNode.relPath || selectedNode.name
        if (expandedFolders.has(key)) {
          e.preventDefault()
          toggleFolder(key)
        }
      }
    } else if (e.key === 'Enter') {
      if (selectedNode) {
        e.preventDefault()
        handleOpenFile(selectedNode)
      }
    } else if (e.key === 'F2') {
      if (selectedNode) {
        e.preventDefault()
        handleStartRename(selectedNode)
      }
    } else if (e.key === 'Delete') {
      if (selectedNode && selectedNode.name !== 'README.md') {
        e.preventDefault()
        setDeleteConfirmTarget(selectedNode)
      }
    }
  }

  // Recursive Tree Node Renderer
  const renderTreeNode = (node, depth = 1) => {
    const nodeKey = node.relPath || node.name
    const isExpanded = expandedFolders.has(nodeKey)
    const isSelected = selectedNode && (selectedNode.path || selectedNode.name) === (node.path || node.name)
    const isActive = activeFile === node.name || activeFile === node.relPath
    const gitStatus = gitStatusMap[node.relPath] || node.status

    // Check if inline creation should be rendered as first child of this folder
    const isInlineTarget = inlineAction && inlineAction.parentPath === node.relPath

    return (
      <React.Fragment key={nodeKey}>
        <div
          className={`ide-tree-row ${node.isDirectory ? 'is-dir' : 'is-file'} ${
            isActive ? 'active' : ''
          } ${isSelected && !isActive ? 'is-selected' : ''}`}
          style={{ paddingLeft: `${depth * 14 + 6}px` }}
          onClick={() => handleOpenFile(node)}
          onDragOver={(e) => {
            if (e.dataTransfer.types && (e.dataTransfer.types.includes('Files') || e.dataTransfer.files?.length > 0)) {
              e.preventDefault()
              e.stopPropagation()
              e.dataTransfer.dropEffect = 'copy'
            }
          }}
          onDrop={(e) => {
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const target = node.isDirectory ? node.path : (node.path ? node.path.replace(/[\\/][^\\/]+$/, '') : workspaceDirectory?.path)
              handleExternalDrop(e, target)
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setSelectedNode(node)
            const x = Math.min(e.clientX, window.innerWidth - 220)
            const y = Math.min(e.clientY, window.innerHeight - 300)
            setContextMenu({ x, y, node })
          }}
          title={node.path || node.relPath || node.name}
        >
          {/* Chevron twistie */}
          <span
            className="ide-tree-chevron"
            onClick={(e) => {
              if (node.isDirectory) {
                e.stopPropagation()
                toggleFolder(nodeKey)
              }
            }}
          >
            {node.isDirectory ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                {isExpanded ? (
                  <path d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"/>
                ) : (
                  <path d="M6 4l5 4-5 4z"/>
                )}
              </svg>
            ) : (
              <span className="tree-spacer" />
            )}
          </span>

          {/* Node Icon */}
          <span className="ide-tree-icon">
            {getTreeItemIcon(node, isExpanded)}
          </span>

          {/* Label or Inline Rename Input */}
          {renamingNode && (renamingNode.path || renamingNode.name) === (node.path || node.name) ? (
            <form
              onSubmit={handleCommitRename}
              onClick={(e) => e.stopPropagation()}
              style={{ flex: 1, display: 'flex', minWidth: 0 }}
            >
              <input
                ref={renameInputRef}
                type="text"
                className="ide-inline-rename-input"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.stopPropagation()
                    setRenamingNode(null)
                  }
                }}
                onBlur={handleCommitRename}
                autoFocus
              />
            </form>
          ) : (
            <span
              className={`ide-tree-label truncate ${gitStatus === 'M' ? 'status-modified' : ''} ${gitStatus === 'U' ? 'status-untracked' : ''}`}
            >
              {node.name}
            </span>
          )}

          {/* Git Tag or Hover Quick Actions */}
          <div className="ide-tree-meta">
            {gitStatus && !node.isDirectory && (
              <span className={`ide-git-tag status-${gitStatus.toLowerCase()}`} title={`Git: ${gitStatus === 'M' ? 'Modified' : 'Untracked'}`}>
                {gitStatus}
              </span>
            )}

            {/* Folder Quick Actions on Hover (VS Code standard) */}
            {node.isDirectory && (
              <div className="ide-folder-hover-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="ide-row-quick-btn"
                  onClick={() => handleStartCreation('file', node.relPath, depth + 1)}
                  title={`New file inside ${node.name}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>note_add</span>
                </button>
                <button
                  type="button"
                  className="ide-row-quick-btn"
                  onClick={() => handleStartCreation('folder', node.relPath, depth + 1)}
                  title={`New folder inside ${node.name}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>create_new_folder</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Children & Nested Inline Creation Row */}
        {node.isDirectory && isExpanded && (
          <div className="ide-tree-children">
            {/* Inline creation form inside this folder */}
            {isInlineTarget && (
              <form
                onSubmit={handleCommitCreation}
                className="ide-tree-row is-creating-row"
                style={{ paddingLeft: `${(depth + 1) * 14 + 6}px` }}
              >
                <span className="ide-tree-chevron"><span className="tree-spacer" /></span>
                <span className="ide-tree-icon">
                  {inlineAction.type === 'folder' ? (
                    <FolderIcon isExpanded={false} />
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="#38bdf8">
                      <path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM3 11V6h1.5l1.5 2 1.5-2H9v5H7.5V8.5L6 10.5 4.5 8.5V11H3zm9.5 0L10 8.5h1.5V6H13v2.5h1.5L12.5 11z"/>
                    </svg>
                  )}
                </span>
                <input
                  ref={inlineInputRef}
                  type="text"
                  className="ide-inline-rename-input"
                  placeholder={inlineAction.type === 'folder' ? 'folder-name' : 'new-file.md'}
                  value={inlineName}
                  onChange={(e) => setInlineName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.stopPropagation()
                      setInlineAction(null)
                    }
                  }}
                  onBlur={handleCommitCreation}
                  autoFocus
                />
              </form>
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
      {/* 1. Header Toolbar matching VS Code: "EXPLORER" and "..." */}
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
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>more_horiz</span>
            </button>
            {isMoreMenuOpen && (
              <div className="ide-more-dropdown-menu">
                <button
                  type="button"
                  className="ide-more-menu-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false)
                    if (onOpenFolder) onOpenFolder()
                  }}
                >
                  <span className="material-symbols-outlined menu-item-icon">folder_open</span>
                  <span>Open Folder...</span>
                </button>
                <button
                  type="button"
                  className="ide-more-menu-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false)
                    handleStartCreation('file')
                  }}
                >
                  <span className="material-symbols-outlined menu-item-icon">note_add</span>
                  <span>New File</span>
                </button>
                <button
                  type="button"
                  className="ide-more-menu-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false)
                    handleStartCreation('folder')
                  }}
                >
                  <span className="material-symbols-outlined menu-item-icon">create_new_folder</span>
                  <span>New Folder</span>
                </button>
                <div className="ide-menu-divider" />
                <button
                  type="button"
                  className="ide-more-menu-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false)
                    refreshTree()
                  }}
                >
                  <span className="material-symbols-outlined menu-item-icon">refresh</span>
                  <span>Refresh Explorer</span>
                </button>
                <button
                  type="button"
                  className="ide-more-menu-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false)
                    collapseAll()
                  }}
                >
                  <span className="material-symbols-outlined menu-item-icon">unfold_less</span>
                  <span>Collapse Folders in Explorer</span>
                </button>
                {workspaceDirectory?.path && (
                  <>
                    <div className="ide-menu-divider" />
                    <button
                      type="button"
                      className="ide-more-menu-item"
                      onClick={() => {
                        setIsMoreMenuOpen(false)
                        if (typeof window !== 'undefined' && window.electronAPI?.showItemInFolder) {
                          window.electronAPI.showItemInFolder(workspaceDirectory.path)
                        }
                      }}
                    >
                      <span className="material-symbols-outlined menu-item-icon">folder</span>
                      <span>Reveal in File Explorer</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Root Project Section */}
      <div className="ide-project-root-section">
        <div
          className="ide-project-root-header"
          onClick={(e) => {
            e.stopPropagation()
            setIsRootExpanded(!isRootExpanded)
            setSelectedNode(null)
          }}
        >
          <div className="ide-root-title-group truncate">
            <span className="ide-tree-chevron">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                {isRootExpanded ? (
                  <path d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"/>
                ) : (
                  <path d="M6 4l5 4-5 4z"/>
                )}
              </svg>
            </span>
            <span className="ide-root-name truncate" title={rootFolderName}>
              {rootFolderName}
            </span>
          </div>

          {/* Action Icons right on the root row matching VS Code */}
          <div className="ide-root-actions" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ide-root-action-btn"
              onClick={() => handleStartCreation('file')}
              title={selectedNode && selectedNode.isDirectory ? `New File inside ${selectedNode.name}` : "New File..."}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M9 1H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7L9 1zm1 5V2.5L13.5 6H10z"/>
                <path d="M7 8v2H5v1h2v2h1v-2h2v-1H8V8H7z"/>
              </svg>
            </button>

            <button
              type="button"
              className="ide-root-action-btn"
              onClick={() => handleStartCreation('folder')}
              title={selectedNode && selectedNode.isDirectory ? `New Folder inside ${selectedNode.name}` : "New Folder..."}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M7.5 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H9.5L8.5 3z"/>
                <path d="M8 7v2H6v1h2v2h1v-2h2v-1H9V7H8z"/>
              </svg>
            </button>

            <button
              type="button"
              className="ide-root-action-btn"
              onClick={refreshTree}
              title="Refresh Explorer"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.65 2.35A8 8 0 1 0 16 8h-2a6 6 0 1 1-1.76-4.24l-2.48 2.48H16V2l-2.35.35z"/>
              </svg>
            </button>

            <button
              type="button"
              className="ide-root-action-btn"
              onClick={collapseAll}
              title="Collapse Folders in Explorer"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 3h14v2H1V3zm0 8h14v2H1v-2zM3 7h10v2H3V7z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 3. Root Level Content */}
        {isRootExpanded && (
          <div className="ide-tree-content">
            {/* Root-level inline creation form */}
            {inlineAction && inlineAction.parentPath === '' && (
              <form
                onSubmit={handleCommitCreation}
                className="ide-tree-row is-creating-row"
                style={{ paddingLeft: '20px' }}
              >
                <span className="ide-tree-chevron"><span className="tree-spacer" /></span>
                <span className="ide-tree-icon">
                  {inlineAction.type === 'folder' ? (
                    <FolderIcon isExpanded={false} />
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="#38bdf8">
                      <path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM3 11V6h1.5l1.5 2 1.5-2H9v5H7.5V8.5L6 10.5 4.5 8.5V11H3zm9.5 0L10 8.5h1.5V6H13v2.5h1.5L12.5 11z"/>
                    </svg>
                  )}
                </span>
                <input
                  ref={inlineInputRef}
                  type="text"
                  className="ide-inline-rename-input"
                  placeholder={inlineAction.type === 'folder' ? 'folder-name' : 'new-file.md'}
                  value={inlineName}
                  onChange={(e) => setInlineName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.stopPropagation()
                      setInlineAction(null)
                    }
                  }}
                  onBlur={handleCommitCreation}
                  autoFocus
                />
              </form>
            )}

            {treeData.length > 0 ? (
              treeData.map((node) => renderTreeNode(node, 1))
            ) : (
              <div className="ide-empty-workspace-banner">
                <span className="material-symbols-outlined empty-folder-icon">folder_open</span>
                <p className="empty-workspace-text">Empty folder</p>
                <div className="empty-workspace-actions">
                  <button
                    type="button"
                    className="ide-btn-primary-sm"
                    onClick={() => onOpenFolder && onOpenFolder()}
                  >
                    Open Another Folder
                  </button>
                  <button
                    type="button"
                    className="ide-btn-secondary-sm"
                    onClick={() => handleStartCreation('file')}
                  >
                    + New File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Explorer Right-Click Context Menu */}
      {contextMenu && (
        <div
          className="ide-context-menu"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.node ? (
            <>
              {contextMenu.node.isDirectory ? (
                <>
                  <button
                    type="button"
                    className="ide-context-item"
                    onClick={() => {
                      const p = contextMenu.node.relPath || contextMenu.node.name
                      handleStartCreation('file', p, (p.split('/').length || 1) + 1)
                      setContextMenu(null)
                    }}
                  >
                    <div className="ide-context-item-left">
                      <span className="material-symbols-outlined ide-context-icon">note_add</span>
                      <span>New File Inside...</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="ide-context-item"
                    onClick={() => {
                      const p = contextMenu.node.relPath || contextMenu.node.name
                      handleStartCreation('folder', p, (p.split('/').length || 1) + 1)
                      setContextMenu(null)
                    }}
                  >
                    <div className="ide-context-item-left">
                      <span className="material-symbols-outlined ide-context-icon">create_new_folder</span>
                      <span>New Folder Inside...</span>
                    </div>
                  </button>

                  <div className="ide-context-separator" />

                  <button
                    type="button"
                    className="ide-context-item"
                    onClick={() => handleStartRename(contextMenu.node)}
                  >
                    <div className="ide-context-item-left">
                      <span className="material-symbols-outlined ide-context-icon">edit</span>
                      <span>Rename...</span>
                    </div>
                    <span className="ide-context-shortcut">F2</span>
                  </button>

                  <button
                    type="button"
                    className="ide-context-item is-danger"
                    onClick={() => {
                      setDeleteConfirmTarget(contextMenu.node)
                      setContextMenu(null)
                    }}
                  >
                    <div className="ide-context-item-left">
                      <span className="material-symbols-outlined ide-context-icon">delete</span>
                      <span>Delete Folder...</span>
                    </div>
                    <span className="ide-context-shortcut">Del</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="ide-context-item"
                    onClick={() => {
                      handleOpenFile(contextMenu.node)
                      setContextMenu(null)
                    }}
                  >
                    <div className="ide-context-item-left">
                      <span className="material-symbols-outlined ide-context-icon">file_open</span>
                      <span>Open File</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="ide-context-item"
                    onClick={() => handleStartRename(contextMenu.node)}
                  >
                    <div className="ide-context-item-left">
                      <span className="material-symbols-outlined ide-context-icon">edit</span>
                      <span>Rename...</span>
                    </div>
                    <span className="ide-context-shortcut">F2</span>
                  </button>

                  {contextMenu.node.name !== 'README.md' && (
                    <button
                      type="button"
                      className="ide-context-item is-danger"
                      onClick={() => {
                        setDeleteConfirmTarget(contextMenu.node)
                        setContextMenu(null)
                      }}
                    >
                      <div className="ide-context-item-left">
                        <span className="material-symbols-outlined ide-context-icon">delete</span>
                        <span>Delete File...</span>
                      </div>
                      <span className="ide-context-shortcut">Del</span>
                    </button>
                  )}
                </>
              )}

              <div className="ide-context-separator" />

              <button
                type="button"
                className="ide-context-item"
                onClick={() => {
                  navigator.clipboard.writeText(contextMenu.node.relPath || contextMenu.node.name)
                  setContextMenu(null)
                  showToast('Copied relative path', 'info')
                }}
              >
                <div className="ide-context-item-left">
                  <span className="material-symbols-outlined ide-context-icon">content_copy</span>
                  <span>Copy Relative Path</span>
                </div>
              </button>

              {contextMenu.node.path && (
                <button
                  type="button"
                  className="ide-context-item"
                  onClick={() => {
                    navigator.clipboard.writeText(contextMenu.node.path)
                    setContextMenu(null)
                    showToast('Copied full path', 'info')
                  }}
                >
                  <div className="ide-context-item-left">
                    <span className="material-symbols-outlined ide-context-icon">content_copy</span>
                    <span>Copy Full Path</span>
                  </div>
                </button>
              )}

              {contextMenu.node.path && typeof window !== 'undefined' && window.electronAPI?.showItemInFolder && (
                <>
                  <div className="ide-context-separator" />
                  <button
                    type="button"
                    className="ide-context-item"
                    onClick={() => {
                      window.electronAPI.showItemInFolder(contextMenu.node.path)
                      setContextMenu(null)
                    }}
                  >
                    <div className="ide-context-item-left">
                      <span className="material-symbols-outlined ide-context-icon">folder_open</span>
                      <span>Reveal in File Explorer</span>
                    </div>
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                className="ide-context-item"
                onClick={() => {
                  handleStartCreation('file')
                  setContextMenu(null)
                }}
              >
                <div className="ide-context-item-left">
                  <span className="material-symbols-outlined ide-context-icon">note_add</span>
                  <span>New File</span>
                </div>
              </button>

              <button
                type="button"
                className="ide-context-item"
                onClick={() => {
                  handleStartCreation('folder')
                  setContextMenu(null)
                }}
              >
                <div className="ide-context-item-left">
                  <span className="material-symbols-outlined ide-context-icon">create_new_folder</span>
                  <span>New Folder</span>
                </div>
              </button>

              <div className="ide-context-separator" />

              <button
                type="button"
                className="ide-context-item"
                onClick={() => {
                  refreshTree()
                  setContextMenu(null)
                }}
              >
                <div className="ide-context-item-left">
                  <span className="material-symbols-outlined ide-context-icon">refresh</span>
                  <span>Refresh Explorer</span>
                </div>
              </button>

              {workspaceDirectory?.path && typeof window !== 'undefined' && window.electronAPI?.showItemInFolder && (
                <button
                  type="button"
                  className="ide-context-item"
                  onClick={() => {
                    window.electronAPI.showItemInFolder(workspaceDirectory.path)
                    setContextMenu(null)
                  }}
                >
                  <div className="ide-context-item-left">
                    <span className="material-symbols-outlined ide-context-icon">folder_open</span>
                    <span>Reveal in File Explorer</span>
                  </div>
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* 5. Safe Delete Confirmation Modal */}
      {deleteConfirmTarget && (
        <div
          className="ide-modal-backdrop"
          onClick={() => setDeleteConfirmTarget(null)}
        >
          <div
            className="ide-delete-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="ide-delete-modal-header">
              <span className="material-symbols-outlined ide-delete-warn-icon">warning</span>
              <h4>Delete {deleteConfirmTarget.isDirectory ? 'Folder' : 'File'}?</h4>
            </div>
            <p className="ide-delete-modal-body">
              Are you sure you want to permanently delete <strong>{deleteConfirmTarget.name}</strong>
              {deleteConfirmTarget.isDirectory ? ' and all of its contents' : ''}?
              <br />
              This action cannot be undone.
            </p>
            <div className="ide-delete-modal-actions">
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
                autoFocus
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
