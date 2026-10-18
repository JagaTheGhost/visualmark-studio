import React, { useState, useMemo, useEffect } from 'react'
import { getPresetById } from '../../data/presetTemplates'
import { STUDIO_TABS_CONFIG, getTabIcon } from './tabBarConstants'
import TabBarControls from './TabBarControls'
import '../../styles/tabGroups.css'

export default function TabBar({
  files = {},
  openDocTabs,
  onReorderDocTabs = () => {},
  activeFile,
  dirtyFiles = {},
  onSelectFile,
  onCloseFile,
  onCreateFile,
  onNewUntitledFile,
  openStudioTabs = [],
  onOpenStudioTab = () => {},
  onCloseStudioTab = () => {},
  onOpenToolsDrawer = () => {},
  viewMode,
  setViewMode,
  zoomLevel,
  setZoomLevel,
  isZenMode,
  setIsZenMode,
  orientation,
  setOrientation,
  openPresetTabs = [],
  onClosePresetTab = () => {},
  onDropExternalFile = () => {},
  updateProgress = null,
  updateDownloaded = null,
  isGroupingEnabled: propGroupingEnabled,
  onToggleGrouping: propToggleGrouping
}) {
  const rawList = Array.isArray(openDocTabs) ? openDocTabs : Object.keys(files)
  const tabList = rawList.filter(
    (f) => typeof f === 'string' && !f.endsWith('.studio') && f !== 'settings' && f !== 'shortcuts' && f !== 'whats-new' && f !== 'release-notes' && !f.startsWith('preset:')
  )

  // Track duplicate file basenames across open tabs for path disambiguation
  const baseNameCounts = useMemo(() => {
    const counts = {}
    for (const f of tabList) {
      const base = f.includes('/') || f.includes('\\') ? f.split(/[\\/]/).pop() : f
      counts[base] = (counts[base] || 0) + 1
    }
    return counts
  }, [tabList])

  // Drag-and-drop state for reordering tabs and receiving dragged files
  const [draggedTab, setDraggedTab] = useState(null)
  const [dropTargetTab, setDropTargetTab] = useState(null)
  const [dropPosition, setDropPosition] = useState(null) // 'before' | 'after'
  const [isContainerDropActive, setIsContainerDropActive] = useState(false)

  // Tab Grouping state (Chrome / Arc style collapsible groups)
  const [localGroupingEnabled, setLocalGroupingEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('visualmark_tab_grouping')
      return saved !== null ? saved === 'true' : true
    } catch {
      return true
    }
  })

  const isGroupingEnabled = typeof propGroupingEnabled === 'boolean' ? propGroupingEnabled : localGroupingEnabled

  const [collapsedGroups, setCollapsedGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('visualmark_tab_groups_collapsed')
      return saved ? JSON.parse(saved) : { documents: false, studios: false, presets: false }
    } catch {
      return { documents: false, studios: false, presets: false }
    }
  })

  const handleToggleGrouping = () => {
    if (typeof propToggleGrouping === 'function') {
      propToggleGrouping(!isGroupingEnabled)
    } else {
      setLocalGroupingEnabled((prev) => {
        const next = !prev
        try {
          localStorage.setItem('visualmark_tab_grouping', String(next))
        } catch {}
        return next
      })
    }
  }

  const handleToggleGroupCollapse = (groupId) => {
    setCollapsedGroups((prev) => {
      const next = { ...prev, [groupId]: !prev[groupId] }
      try {
        localStorage.setItem('visualmark_tab_groups_collapsed', JSON.stringify(next))
      } catch {}
      return next
    })
  }

  // Auto-expand group when activeFile switches to a tab inside that group
  useEffect(() => {
    if (!activeFile) return
    if (tabList.includes(activeFile) && collapsedGroups.documents) {
      setCollapsedGroups((prev) => {
        const next = { ...prev, documents: false }
        try { localStorage.setItem('visualmark_tab_groups_collapsed', JSON.stringify(next)) } catch {}
        return next
      })
    } else if (openStudioTabs.includes(activeFile) && collapsedGroups.studios) {
      setCollapsedGroups((prev) => {
        const next = { ...prev, studios: false }
        try { localStorage.setItem('visualmark_tab_groups_collapsed', JSON.stringify(next)) } catch {}
        return next
      })
    }
  }, [activeFile])

  // Close All helpers for groups
  const handleCloseAllStudios = () => {
    if (openStudioTabs && openStudioTabs.length > 0) {
      [...openStudioTabs].forEach((tabId) => onCloseStudioTab(tabId))
    }
  }

  const handleCloseAllDocs = () => {
    if (tabList && tabList.length > 0) {
      [...tabList].forEach((fileName) => onCloseFile(fileName))
    }
  }

  const handleCloseAllPresets = () => {
    if (openPresetTabs && openPresetTabs.length > 0) {
      [...openPresetTabs].forEach((presetId) => onClosePresetTab(presetId))
    }
  }

  const hasGroupableTabs =
    (tabList.length > 0 && openStudioTabs.length > 0) ||
    tabList.length + openStudioTabs.length >= 4 ||
    openPresetTabs.length > 0
  const shouldShowGroups = isGroupingEnabled && hasGroupableTabs

  // Find labels for active item inside collapsed groups
  const activeDocLabel = tabList.includes(activeFile)
    ? (activeFile.includes('/') || activeFile.includes('\\') ? activeFile.split(/[\\/]/).pop() : activeFile)
    : null

  const activeStudioConfig = openStudioTabs.includes(activeFile) ? STUDIO_TABS_CONFIG[activeFile] : null
  const activeStudioLabel = activeStudioConfig ? activeStudioConfig.label : null

  const activePresetId = activeFile && activeFile.startsWith('preset:') ? activeFile.replace('preset:', '') : null
  const activePreset = activePresetId ? getPresetById(activePresetId) : null
  const activePresetLabel = activePreset ? activePreset.title : null

  const handleZoomToggle = () => {
    if (zoomLevel === 100) setZoomLevel(115)
    else if (zoomLevel === 115) setZoomLevel(90)
    else setZoomLevel(100)
  }

  const isStudioTabActive =
    activeFile && (activeFile.endsWith('.studio') || activeFile === 'settings' || activeFile === 'shortcuts' || activeFile === 'whats-new' || activeFile === 'release-notes')

  // Handle dropping onto a specific tab
  const handleTabDrop = (e, targetTabName) => {
    e.preventDefault()
    e.stopPropagation()

    // Handle external files dropped from Windows Explorer
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        onDropExternalFile(e.dataTransfer.files[i])
      }
      setDraggedTab(null)
      setDropTargetTab(null)
      setDropPosition(null)
      setIsContainerDropActive(false)
      return
    }

    const sourceTab = e.dataTransfer.getData('application/x-ide-tab-id') || draggedTab
    const droppedFileName = e.dataTransfer.getData('application/x-ide-file-name')

    if (sourceTab && sourceTab !== targetTabName) {
      // Reordering an existing tab
      const currentList = [...tabList]
      const fromIdx = currentList.indexOf(sourceTab)
      if (fromIdx !== -1) {
        currentList.splice(fromIdx, 1)
        let toIdx = currentList.indexOf(targetTabName)
        if (dropPosition === 'after') {
          toIdx += 1
        }
        currentList.splice(toIdx, 0, sourceTab)
        onReorderDocTabs(currentList)
      }
    } else if (droppedFileName) {
      // Dropping a file from the Explorer tree onto a tab slot
      onSelectFile(droppedFileName)
      const currentList = [...tabList]
      const fromIdx = currentList.indexOf(droppedFileName)
      if (fromIdx !== -1) {
        currentList.splice(fromIdx, 1)
      }
      let toIdx = currentList.indexOf(targetTabName)
      if (dropPosition === 'after') {
        toIdx += 1
      }
      currentList.splice(toIdx, 0, droppedFileName)
      onReorderDocTabs(currentList)
    }

    setDraggedTab(null)
    setDropTargetTab(null)
    setDropPosition(null)
    setIsContainerDropActive(false)
  }

  // Handle dropping anywhere on the tabs container strip
  const handleContainerDrop = (e) => {
    e.preventDefault()

    // Handle external files dropped from Windows Explorer
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        onDropExternalFile(e.dataTransfer.files[i])
      }
      setDraggedTab(null)
      setDropTargetTab(null)
      setDropPosition(null)
      setIsContainerDropActive(false)
      return
    }

    const sourceTab = e.dataTransfer.getData('application/x-ide-tab-id') || draggedTab
    const droppedFileName = e.dataTransfer.getData('application/x-ide-file-name')

    if (sourceTab) {
      // Move dragged tab to the very end
      const currentList = [...tabList]
      const fromIdx = currentList.indexOf(sourceTab)
      if (fromIdx !== -1) {
        currentList.splice(fromIdx, 1)
        currentList.push(sourceTab)
        onReorderDocTabs(currentList)
      }
    } else if (droppedFileName) {
      // Open file dragged from Explorer onto empty strip area
      onSelectFile(droppedFileName)
      if (!tabList.includes(droppedFileName)) {
        onReorderDocTabs([...tabList, droppedFileName])
      }
    }

    setDraggedTab(null)
    setDropTargetTab(null)
    setDropPosition(null)
    setIsContainerDropActive(false)
  }

  // Render individual document tab
  const renderDocTab = (fileName) => {
    const isActive = activeFile === fileName
    const iconInfo = getTabIcon(fileName)
    const isDirty = Boolean(dirtyFiles[fileName])
    const isBeingDragged = draggedTab === fileName
    const isDropTarget = dropTargetTab === fileName

    const tabLabel = fileName.includes('/') || fileName.includes('\\')
      ? fileName.split(/[\\/]/).pop()
      : fileName
    const isDuplicate = (baseNameCounts[tabLabel] || 0) > 1
    let folderHint = null
    if (isDuplicate) {
      const parts = fileName.split(/[\\/]/)
      folderHint = parts.length > 1 ? parts[parts.length - 2] : 'root'
    }

    return (
      <div
        key={fileName}
        draggable={true}
        onDragStart={(e) => {
          e.dataTransfer.setData('application/x-ide-tab-id', fileName)
          e.dataTransfer.setData('text/plain', fileName)
          e.dataTransfer.effectAllowed = 'move'
          setDraggedTab(fileName)
        }}
        onDragEnd={() => {
          setDraggedTab(null)
          setDropTargetTab(null)
          setDropPosition(null)
          setIsContainerDropActive(false)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'move'
          const rect = e.currentTarget.getBoundingClientRect()
          const relX = e.clientX - rect.left
          const pos = relX < rect.width / 2 ? 'before' : 'after'
          setDropTargetTab(fileName)
          setDropPosition(pos)
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            if (dropTargetTab === fileName) {
              setDropTargetTab(null)
              setDropPosition(null)
            }
          }
        }}
        onDrop={(e) => handleTabDrop(e, fileName)}
        className={`editor-tab ${isActive ? 'active' : ''} ${isBeingDragged ? 'is-dragging' : ''} ${
          isDropTarget && dropPosition === 'before' ? 'drop-target-before' : ''
        } ${isDropTarget && dropPosition === 'after' ? 'drop-target-after' : ''}`}
        onClick={() => onSelectFile(fileName)}
        title={`${fileName} (drag to reorder)`}
      >
        <span className="tab-file-icon" style={{ color: iconInfo.color }}>
          {iconInfo.icon}
        </span>
        <span className="tab-file-title truncate">{tabLabel}</span>
        {folderHint && <span className="tab-folder-hint">{folderHint}</span>}

        {/* Close Tab Button (VS Code SVG ✕ or Dirty Dot ●) */}
        <button
          type="button"
          className={`tab-close-btn ${isDirty ? 'is-dirty' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onCloseFile(fileName)
          }}
          title={isDirty ? `Unsaved changes (click to close ${fileName})` : `Close ${fileName}`}
        >
          {isDirty && <span className="tab-dirty-dot">●</span>}
          <svg className="tab-close-x" width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293z"/>
          </svg>
        </button>
      </div>
    )
  }

  // Render individual studio tool tab
  const renderStudioTab = (tabId) => {
    const config = STUDIO_TABS_CONFIG[tabId]
    if (!config) return null
    const isActive = activeFile === tabId
    const isUpdateTab = tabId === 'settings' || tabId === 'whats-new' || tabId === 'release-notes'

    return (
      <div
        key={tabId}
        className={`editor-tab studio-tool-tab ${isActive ? 'active' : ''}`}
        onClick={() => onSelectFile(tabId)}
        title={tabId.endsWith('.studio') ? `${config.label} Studio` : config.label}
        style={{ position: 'relative' }}
      >
        <span className="tab-file-icon" style={{ color: config.iconColor }}>
          {config.icon}
        </span>
        <span className="tab-file-title truncate">{config.label}</span>

        {/* Download Progress Indicator Pill on Tab Header */}
        {isUpdateTab && updateProgress && !updateDownloaded && (
          <span className="tab-update-progress-pill" title={`Downloading Update: ${Math.round(updateProgress.percent || 0)}%`}>
            <span className="material-symbols-outlined tab-progress-spinner">sync</span>
            <span>{Math.round(updateProgress.percent || 0)}%</span>
          </span>
        )}

        {/* Update Ready Indicator on Tab Header */}
        {isUpdateTab && updateDownloaded && (
          <span className="tab-update-ready-pill" title={`Update v${updateDownloaded.version} ready to install`}>
            ● Ready
          </span>
        )}

        {/* Live animated bottom progress bar on the tab */}
        {isUpdateTab && updateProgress && !updateDownloaded && (
          <div
            className="tab-progress-bottom-bar"
            style={{ width: `${Math.min(100, Math.max(0, updateProgress.percent || 0))}%` }}
          />
        )}

        <button
          type="button"
          className="tab-close-btn"
          onClick={(e) => {
            e.stopPropagation()
            onCloseStudioTab(tabId)
          }}
          title={`Close ${config.label}`}
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293z"/>
          </svg>
        </button>
      </div>
    )
  }

  // Render individual preset preview tab
  const renderPresetTab = (presetId) => {
    const preset = getPresetById(presetId)
    if (!preset) return null
    const tabId = `preset:${presetId}`
    const isActive = activeFile === tabId

    return (
      <div
        key={tabId}
        className={`editor-tab preset-preview-tab ${isActive ? 'active' : ''}`}
        onClick={() => onSelectFile(tabId)}
        title={`[Preset Blueprint] ${preset.title} (Click to preview and compare)`}
      >
        <span className="material-symbols-outlined tab-preview-live-icon">visibility</span>
        <span className="tab-file-title truncate">[Preset] {preset.title}</span>

        <button
          type="button"
          className="tab-close-btn"
          onClick={(e) => {
            e.stopPropagation()
            onClosePresetTab(presetId)
          }}
          title={`Close [Preset] ${preset.title}`}
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293z"/>
          </svg>
        </button>
      </div>
    )
  }

  // Floating quick tab when update is actively downloading and Settings is not open
  const renderFloatingUpdateTab = () => {
    if (!updateProgress || updateDownloaded || openStudioTabs.includes('settings') || openStudioTabs.includes('whats-new')) {
      return null
    }
    return (
      <div
        key="floating-update-tab"
        className="editor-tab studio-tool-tab tab-downloading-shortcut"
        onClick={() => onOpenStudioTab('settings')}
        title="Update downloading in background. Click to open Settings"
        style={{ position: 'relative' }}
      >
        <span className="material-symbols-outlined spin" style={{ fontSize: '13px', color: '#38bdf8' }}>
          sync
        </span>
        <span className="tab-file-title" style={{ color: '#38bdf8', fontWeight: 600 }}>
          Updating {Math.round(updateProgress.percent || 0)}%
        </span>
        <div
          className="tab-progress-bottom-bar"
          style={{ width: `${Math.min(100, Math.max(0, updateProgress.percent || 0))}%` }}
        />
      </div>
    )
  }

  return (
    <div className="tab-strip-bar select-none">
      {/* Tabs List (Antigravity IDE / VS Code Style with Collapsible Tab Groups) */}
      <div
        className={`tabs-container custom-scrollbar ${isContainerDropActive ? 'is-drop-active' : ''}`}
        data-horizontal-scroll="true"
        onDragOver={(e) => {
          e.preventDefault()
          setIsContainerDropActive(true)
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsContainerDropActive(false)
          }
        }}
        onDrop={handleContainerDrop}
      >
        {shouldShowGroups ? (
          <>
            {/* GROUP 1: Documents Group */}
            {tabList.length > 0 && (
              <div
                className={`tab-group-wrapper group-documents ${
                  collapsedGroups.documents ? 'is-collapsed' : 'is-expanded'
                } ${activeDocLabel ? 'has-active-tab' : ''}`}
              >
                <div
                  className={`tab-group-chip group-chip-documents ${
                    activeDocLabel && collapsedGroups.documents ? 'active-collapsed' : ''
                  }`}
                  onClick={() => handleToggleGroupCollapse('documents')}
                  title={`Documents (${tabList.length}) • Click to ${
                    collapsedGroups.documents ? 'expand' : 'collapse'
                  }`}
                >
                  <span className="tab-group-icon" style={{ color: '#10b981' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                      description
                    </span>
                  </span>
                  <span className="tab-group-title">Docs</span>
                  <span
                    className="tab-group-badge"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.18)',
                      color: '#10b981',
                      borderColor: 'rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    {tabList.length}
                  </span>

                  {collapsedGroups.documents && activeDocLabel && (
                    <span className="tab-group-active-item" title={`Active Document: ${activeDocLabel}`}>
                      • <span className="tab-group-active-name">{activeDocLabel}</span>
                    </span>
                  )}

                  <span
                    className={`tab-group-chevron material-symbols-outlined ${
                      collapsedGroups.documents ? 'collapsed' : 'expanded'
                    }`}
                  >
                    {collapsedGroups.documents ? 'chevron_right' : 'expand_more'}
                  </span>

                  {tabList.length > 1 && (
                    <button
                      type="button"
                      className="tab-group-close-all-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCloseAllDocs()
                      }}
                      title="Close all open documents"
                    >
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293z"/>
                      </svg>
                    </button>
                  )}
                </div>

                {!collapsedGroups.documents && (
                  <div className="tab-group-items group-items-documents">
                    {tabList.map(renderDocTab)}
                  </div>
                )}
              </div>
            )}

            {/* GROUP 2: Studios Group */}
            {openStudioTabs.length > 0 && (
              <div
                className={`tab-group-wrapper group-studios ${
                  collapsedGroups.studios ? 'is-collapsed' : 'is-expanded'
                } ${activeStudioLabel ? 'has-active-tab' : ''}`}
              >
                <div
                  className={`tab-group-chip group-chip-studios ${
                    activeStudioLabel && collapsedGroups.studios ? 'active-collapsed' : ''
                  }`}
                  onClick={() => handleToggleGroupCollapse('studios')}
                  title={`Studio Tools (${openStudioTabs.length}) • Click to ${
                    collapsedGroups.studios ? 'expand' : 'collapse'
                  }`}
                >
                  <span className="tab-group-icon" style={{ color: '#818cf8' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                      auto_awesome
                    </span>
                  </span>
                  <span className="tab-group-title">Studios</span>
                  <span
                    className="tab-group-badge"
                    style={{
                      backgroundColor: 'rgba(129, 140, 248, 0.18)',
                      color: '#818cf8',
                      borderColor: 'rgba(129, 140, 248, 0.35)'
                    }}
                  >
                    {openStudioTabs.length}
                  </span>

                  {collapsedGroups.studios && activeStudioLabel && (
                    <span className="tab-group-active-item" title={`Active Studio: ${activeStudioLabel}`}>
                      • <span className="tab-group-active-name">{activeStudioLabel}</span>
                    </span>
                  )}

                  <span
                    className={`tab-group-chevron material-symbols-outlined ${
                      collapsedGroups.studios ? 'collapsed' : 'expanded'
                    }`}
                  >
                    {collapsedGroups.studios ? 'chevron_right' : 'expand_more'}
                  </span>

                  <button
                    type="button"
                    className="tab-group-close-all-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCloseAllStudios()
                    }}
                    title="Close all studio tabs"
                  >
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293z"/>
                    </svg>
                  </button>
                </div>

                {!collapsedGroups.studios && (
                  <div className="tab-group-items group-items-studios">
                    {openStudioTabs.map(renderStudioTab)}
                  </div>
                )}
              </div>
            )}

            {/* GROUP 3: Preset Blueprints Group */}
            {openPresetTabs.length > 0 && (
              <div
                className={`tab-group-wrapper group-presets ${
                  collapsedGroups.presets ? 'is-collapsed' : 'is-expanded'
                } ${activePresetLabel ? 'has-active-tab' : ''}`}
              >
                <div
                  className={`tab-group-chip group-chip-presets ${
                    activePresetLabel && collapsedGroups.presets ? 'active-collapsed' : ''
                  }`}
                  onClick={() => handleToggleGroupCollapse('presets')}
                  title={`Preset Blueprints (${openPresetTabs.length}) • Click to ${
                    collapsedGroups.presets ? 'expand' : 'collapse'
                  }`}
                >
                  <span className="tab-group-icon" style={{ color: '#f59e0b' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                      visibility
                    </span>
                  </span>
                  <span className="tab-group-title">Presets</span>
                  <span
                    className="tab-group-badge"
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.18)',
                      color: '#f59e0b',
                      borderColor: 'rgba(245, 158, 11, 0.35)'
                    }}
                  >
                    {openPresetTabs.length}
                  </span>

                  {collapsedGroups.presets && activePresetLabel && (
                    <span className="tab-group-active-item" title={`Active Preset: ${activePresetLabel}`}>
                      • <span className="tab-group-active-name">{activePresetLabel}</span>
                    </span>
                  )}

                  <span
                    className={`tab-group-chevron material-symbols-outlined ${
                      collapsedGroups.presets ? 'collapsed' : 'expanded'
                    }`}
                  >
                    {collapsedGroups.presets ? 'chevron_right' : 'expand_more'}
                  </span>

                  <button
                    type="button"
                    className="tab-group-close-all-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCloseAllPresets()
                    }}
                    title="Close all preset preview tabs"
                  >
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293z"/>
                    </svg>
                  </button>
                </div>

                {!collapsedGroups.presets && (
                  <div className="tab-group-items group-items-presets">
                    {openPresetTabs.map(renderPresetTab)}
                  </div>
                )}
              </div>
            )}

            {renderFloatingUpdateTab()}
          </>
        ) : (
          <>
            {/* Flat Tabs View (when grouping is disabled or not applicable) */}
            {tabList.map(renderDocTab)}
            {openStudioTabs.map(renderStudioTab)}
            {renderFloatingUpdateTab()}
            {openPresetTabs.map(renderPresetTab)}
          </>
        )}

        {/* Tab Add Button '+' */}
        <button
          type="button"
          className="tab-add-btn"
          onClick={() => {
            if (onNewUntitledFile) {
              onNewUntitledFile()
            } else if (onCreateFile) {
              onCreateFile('Untitled.md')
            }
          }}
          title="New Untitled Document (+)"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2z"/>
          </svg>
        </button>
      </div>

      {/* Right Controls: View Mode, Zooms & Orientation */}
      <TabBarControls
        activeFile={activeFile}
        isStudioTabActive={isStudioTabActive}
        viewMode={viewMode}
        setViewMode={setViewMode}
        orientation={orientation}
        setOrientation={setOrientation}
        zoomLevel={zoomLevel}
        handleZoomToggle={handleZoomToggle}
      />
    </div>
  )
}
