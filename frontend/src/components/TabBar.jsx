import React, { useState, useRef, useEffect, useMemo } from 'react'
import { validateDocFilename } from '../utils/filenameUtils'
import { getPresetById } from '../data/presetTemplates'

const STUDIO_TABS_CONFIG = {
  'badges.studio': {
    id: 'badges.studio',
    label: 'Shields.io Badges',
    iconColor: '#38bdf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0c-.3 0-.6.1-.8.3L2.4 3.7c-.3.2-.4.6-.4.9v5.2c0 3.8 2.6 7.1 6 8.2 3.4-1.1 6-4.4 6-8.2V4.6c0-.3-.1-.7-.4-.9L8.8.3C8.6.1 8.3 0 8 0zm0 1.5l4.5 2.5v4.8c0 3-2 5.7-4.5 6.6-2.5-.9-4.5-3.6-4.5-6.6V4L8 1.5z"/>
      </svg>
    )
  },
  'diagrams.studio': {
    id: 'diagrams.studio',
    label: 'Mermaid Diagrams',
    iconColor: '#818cf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zM5 10.5A1.5 1.5 0 0 1 6.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 5 13.5v-3z"/>
      </svg>
    )
  },
  'tables.studio': {
    id: 'tables.studio',
    label: 'Table Designer',
    iconColor: '#38bdf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm1 3v9a1 1 0 0 0 1 1h4.5V5H1zm6.5 10H14a1 1 0 0 0 1-1V5H7.5v10zM15 4V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2h14z"/>
      </svg>
    )
  },
  'snippets.studio': {
    id: 'snippets.studio',
    label: 'Code & Callouts',
    iconColor: '#818cf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
      </svg>
    )
  },
  'images.studio': {
    id: 'images.studio',
    label: 'Image & Banners',
    iconColor: '#38bdf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
      </svg>
    )
  },
  'tree.studio': {
    id: 'tree.studio',
    label: 'Directory Tree',
    iconColor: '#818cf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v1.25A1.5 1.5 0 0 1 5.5 5.25H2.5v5.5H5v-1.5A1.5 1.5 0 0 1 6.5 7.75h3A1.5 1.5 0 0 1 11 9.25v2.5A1.5 1.5 0 0 1 9.5 13.25h-3A1.5 1.5 0 0 1 5 11.75V11.5H2v-6A.5.5 0 0 1 2.5 5h3a.5.5 0 0 0 .5-.5V2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H5v1.25a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V12H2.5a1.5 1.5 0 0 1-1.5-1.5v-8z"/>
      </svg>
    )
  },
  'api.studio': {
    id: 'api.studio',
    label: 'API & Endpoints',
    iconColor: '#38bdf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1 2.5A2.5 2.5 0 0 1 3.5 0h9A2.5 2.5 0 0 1 15 2.5v11a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5v-11zM3.5 1A1.5 1.5 0 0 0 2 2.5v11A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 12.5 1h-9zm1.75 3.5a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5H6v1.5a.75.75 0 0 1-1.5 0V8.25H3a.75.75 0 0 1 0-1.5h1.5V5.25a.75.75 0 0 1 .75-.75zm4.25 1a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75zm0 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75zm0 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75z"/>
      </svg>
    )
  },
  'audit.studio': {
    id: 'audit.studio',
    label: 'Doc Auditor',
    iconColor: '#818cf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
        <path d="M8 0c-.3 0-.6.1-.8.3L2.4 3.7c-.3.2-.4.6-.4.9v5.2c0 3.8 2.6 7.1 6 8.2 3.4-1.1 6-4.4 6-8.2V4.6c0-.3-.1-.7-.4-.9L8.8.3C8.6.1 8.3 0 8 0zm0 1.5l4.5 2.5v4.8c0 3-2 5.7-4.5 6.6-2.5-.9-4.5-3.6-4.5-6.6V4L8 1.5z"/>
      </svg>
    )
  },
  'contributors.studio': {
    id: 'contributors.studio',
    label: 'Contributors',
    iconColor: '#38bdf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 1c-1.8 0-4 1-4 2.5V13h5.2a5.5 5.5 0 0 1-.2-1.5c0-.9.3-1.8.8-2.5H4.5z"/>
      </svg>
    )
  },
  'changelog.studio': {
    id: 'changelog.studio',
    label: 'Changelog',
    iconColor: '#818cf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
      </svg>
    )
  },
  'icons.studio': {
    id: 'icons.studio',
    label: 'Icons & Emojis',
    iconColor: '#38bdf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
      </svg>
    )
  },
  'settings': {
    id: 'settings',
    label: 'Settings',
    iconColor: '#38bdf8',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M9.1 1.2a1 1 0 0 0-2.2 0l-.3 1a6.002 6.002 0 0 0-1.4.8l-1-.4a1 1 0 0 0-1.6 1.6l.4 1a6.002 6.002 0 0 0-.8 1.4l-1 .3a1 1 0 0 0 0 2.2l1 .3a6.002 6.002 0 0 0 .8 1.4l-.4 1a1 1 0 0 0 1.6 1.6l1-.4a6.002 6.002 0 0 0 1.4.8l.3 1a1 1 0 0 0 2.2 0l.3-1a6.002 6.002 0 0 0 1.4-.8l1 .4a1 1 0 0 0 1.6-1.6l-.4-1a6.002 6.002 0 0 0 .8-1.4l1-.3a1 1 0 0 0 0-2.2l-1-.3a6.002 6.002 0 0 0-.8-1.4l.4-1a1 1 0 0 0-1.6-1.6l-1 .4a6.002 6.002 0 0 0-1.4-.8l-.3-1zM8 10.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
      </svg>
    )
  },
  'shortcuts': {
    id: 'shortcuts',
    label: 'Keyboard Shortcuts',
    iconColor: '#38bdf8',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M14 2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2h2v2H3V5zm3 0h2v2H6V5zm3 0h2v2H9V5zm3 0h1v2h-1V5zM3 8h1v2H3V8zm2 0h6v2H5V8zm7 0h1v2h-1V8z"/>
      </svg>
    )
  },
  'whats-new': {
    id: 'whats-new',
    label: 'Patch Notes',
    iconColor: '#a855f7',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/>
      </svg>
    )
  },
  'release-notes': {
    id: 'release-notes',
    label: 'Patch Notes',
    iconColor: '#a855f7',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/>
      </svg>
    )
  }
}

function getTabIcon(fileName) {
  const lower = fileName.toLowerCase()

  // CSS files: { } icon in cyan
  if (lower.endsWith('.css')) {
    return {
      color: '#38bdf8',
      icon: (
        <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '-1px' }}>
          {'{ }'}
        </span>
      )
    }
  }

  // React / JSX / TSX files: React Atom in cyan
  if (lower.endsWith('.jsx') || lower.endsWith('.tsx')) {
    return {
      color: '#61dafb',
      icon: (
        <svg width="13" height="13" viewBox="-11.5 -10.23 23 20.46" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="0" cy="0" r="2.05" fill="currentColor" />
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </svg>
      )
    }
  }

  // JS / TS / JSON files
  if (lower.endsWith('.js') || lower.endsWith('.ts') || lower.endsWith('.json')) {
    return {
      color: '#e5c07b',
      icon: (
        <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '-1px' }}>
          {'{ }'}
        </span>
      )
    }
  }

  if (lower.includes('license')) {
    return {
      color: '#e5c07b',
      icon: (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0c-.3 0-.6.1-.8.3L2.4 3.7c-.3.2-.4.6-.4.9v5.2c0 3.8 2.6 7.1 6 8.2 3.4-1.1 6-4.4 6-8.2V4.6c0-.3-.1-.7-.4-.9L8.8.3C8.6.1 8.3 0 8 0zm0 1.5l4.5 2.5v4.8c0 3-2 5.7-4.5 6.6-2.5-.9-4.5-3.6-4.5-6.6V4L8 1.5z"/>
        </svg>
      )
    }
  }
  if (lower.includes('setup')) {
    return {
      color: '#10b981',
      icon: (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 4.146a.5.5 0 1 0-.708-.708L2.793 7.793a.5.5 0 0 0 0 .708l2.353 2.353a.5.5 0 0 0 .708-.708L3.707 8.146l2.147-2zM8 10.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H8z"/>
        </svg>
      )
    }
  }
  if (lower.includes('contributing')) {
    return {
      color: '#34d399',
      icon: (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 1c-1.8 0-4 1-4 2.5V13h5.2a5.5 5.5 0 0 1-.2-1.5c0-.9.3-1.8.8-2.5H4.5z"/>
        </svg>
      )
    }
  }
  if (lower.includes('architecture')) {
    return {
      color: '#a78bfa',
      icon: (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
          <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM9 2.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zM5 10.5A1.5 1.5 0 0 1 6.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 5 13.5v-3z"/>
        </svg>
      )
    }
  }
  // Markdown file icon (M↓ style in Antigravity sky blue)
  return {
    color: '#38bdf8',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM3 11V6h1.5l1.5 2 1.5-2H9v5H7.5V8.5L6 10.5 4.5 8.5V11H3zm9-1.5l-1.5 2v-4.5h-1v4.5l-1.5-2-.7.7 2.7 2.8 2.7-2.8-.7-.7z"/>
      </svg>
    )
  }
}

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
      <div className="tab-controls-right">
        {activeFile && activeFile.startsWith('preset:') ? (
          /* Locked in Preview Mode for Preset blueprint comparison */
          <div className="preset-locked-mode-indicator" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#10b981' }}>visibility</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', fontWeight: 600 }}>Preview Only</span>
            <button
              type="button"
              className="btn-tab-ctrl zoom-badge"
              onClick={handleZoomToggle}
              title="Zoom Level (Click to cycle 90% / 100% / 115%)"
            >
              {zoomLevel}%
            </button>
          </div>
        ) : !isStudioTabActive && activeFile ? (
          <>
            {/* Split Orientation Toggle (moved to left of Split pill per request) */}
            {viewMode === 'split' && (
              <button
                type="button"
                className={`btn-tab-ctrl orientation-toggle-btn ${orientation === 'horizontal' ? 'is-horizontal' : 'is-vertical'}`}
                onClick={() => setOrientation((prev) => prev === 'horizontal' ? 'vertical' : 'horizontal')}
                title={
                  orientation === 'horizontal'
                    ? 'Current: Stacked. Click for Side-by-Side'
                    : 'Current: Side-by-Side. Click for Stacked'
                }
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  {orientation === 'horizontal' ? 'table_rows' : 'view_column'}
                </span>
                <span className="orientation-btn-text">
                  {orientation === 'horizontal' ? 'Stacked' : 'Side-by-Side'}
                </span>
              </button>
            )}

            {/* View Mode Segmented Pill */}
            <div className="view-mode-segmented">
              <button
                type="button"
                className={`view-mode-pill ${viewMode === 'split' ? 'active' : ''}`}
                onClick={() => setViewMode('split')}
                title="Split View"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 3h12v10H2V3zm1 1v8h4.5V4H3zm5.5 0v8H13V4H8.5z"/>
                </svg>
                <span>Split</span>
              </button>

              <button
                type="button"
                className={`view-mode-pill ${viewMode === 'editor' ? 'active' : ''}`}
                onClick={() => setViewMode('editor')}
                title="Editor Only"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
                </svg>
                <span>Editor</span>
              </button>

              <button
                type="button"
                className={`view-mode-pill ${viewMode === 'preview' ? 'active' : ''}`}
                onClick={() => setViewMode('preview')}
                title="Preview Only"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"/>
                </svg>
                <span>Preview</span>
              </button>
            </div>

            {/* Zoom Badge */}
            <button
              type="button"
              className="btn-tab-ctrl zoom-badge"
              onClick={handleZoomToggle}
              title="Zoom Level (Click to cycle 90% / 100% / 115%)"
            >
              {zoomLevel}%
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}
