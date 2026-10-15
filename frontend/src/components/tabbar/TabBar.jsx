import React, { useState, useMemo } from 'react'
import { getPresetById } from '../../data/presetTemplates'
import { STUDIO_TABS_CONFIG, getTabIcon } from './tabBarConstants'
import TabBarControls from './TabBarControls'

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
  updateDownloaded = null
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

  return (
    <div className="tab-strip-bar select-none">
      {/* Tabs List (Antigravity IDE / VS Code Style) */}
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
        {/* Markdown Document Tabs */}
        {tabList.map((fileName) => {
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
        })}

        {/* Studio Tool Tabs */}
        {openStudioTabs.map((tabId) => {
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
        })}

        {/* Floating Quick Tab when update is actively downloading and Settings is not opened */}
        {updateProgress && !updateDownloaded && !openStudioTabs.includes('settings') && !openStudioTabs.includes('whats-new') && (
          <div
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
        )}

        {/* Preset Blueprint Preview Tabs (Support multi-preset tabs for comparison) */}
        {openPresetTabs.map((presetId) => {
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
        })}

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
