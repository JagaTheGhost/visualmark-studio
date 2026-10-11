import { useState, useEffect, useCallback, useMemo, useRef, Suspense, lazy } from 'react'
import './index.css'
import TopMenuBar from './components/TopMenuBar'
import ActivityBar from './components/ActivityBar'
import SidebarDrawer from './components/SidebarDrawer'
import TabBar from './components/TabBar'
import Preview from './components/Preview'
import StatusBar from './components/StatusBar'
import IdeTooltip from './components/IdeTooltip'
import {
  loadKeybindings,
  saveKeybindingOverride,
  resetAllKeybindings,
  matchesKeybinding
} from './utils/keybindingManager'
import { initGlobalHorizontalWheelHandler } from './utils/horizontalScrollHelper'
import { ToastContainer, NotificationHistoryPanel } from './components/Toast'
import { useToast } from './context/ToastContext'
import { useEditorPreferences } from './hooks/useEditorPreferences'
import { useBottomPanel } from './hooks/useBottomPanel'
import {
  copyDocumentToClipboard,
  downloadActiveFile,
  downloadDocumentationSuite,
  downloadHtmlDocument,
  downloadPdfDocument
} from './utils/documentExportUtils'
import { validateDocFilename } from './utils/filenameUtils'
import { foldDataUris, unfoldDataUris } from './utils/dataUriFold'
import UnsupportedFileViewer from './components/UnsupportedFileViewer'
import BottomPanelDrawer from './components/BottomPanelDrawer'
import { lintMarkdownDocument } from './utils/markdownLinter'
import { PRESET_TEMPLATES, getPresetById } from './data/presetTemplates'
import { apiPost } from './utils/apiClient'

// Code-split heavy studio tooling and modal workspaces to shrink main bundle
const BadgeStudioTab = lazy(() => import('./components/studio/BadgeStudioTab'))
const DiagramStudioTab = lazy(() => import('./components/studio/DiagramStudioTab'))
const TableStudioTab = lazy(() => import('./components/studio/TableStudioTab'))
const SnippetStudioTab = lazy(() => import('./components/studio/SnippetStudioTab'))
const ImageStudioTab = lazy(() => import('./components/studio/ImageStudioTab'))
const DirectoryTreeStudioTab = lazy(() => import('./components/studio/DirectoryTreeStudioTab'))
const ApiStudioTab = lazy(() => import('./components/studio/ApiStudioTab'))
const AuditStudioTab = lazy(() => import('./components/studio/AuditStudioTab'))
const ContributorStudioTab = lazy(() => import('./components/studio/ContributorStudioTab'))
const ChangelogStudioTab = lazy(() => import('./components/studio/ChangelogStudioTab'))
const SettingsTab = lazy(() => import('./components/SettingsTab'))
const ShortcutsTab = lazy(() => import('./components/ShortcutsTab'))
const CommandPalette = lazy(() => import('./components/CommandPalette'))
const InsertTargetModal = lazy(() => import('./components/InsertTargetModal'))
const WhatsNewTab = lazy(() => import('./components/WhatsNewTab'))
import { APP_CURRENT_VERSION } from './data/releaseNotes'

function StudioLoadingFallback({ title = 'Studio Tool' }) {
  return (
    <div className="studio-tab-loading">
      <div className="studio-loading-spinner" />
      <div className="studio-loading-text">Loading {title}...</div>
    </div>
  )
}

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch (err) {
    console.warn(`LocalStorage quota exceeded saving "${key}":`, err)
  }
}

const isStudioTabId = (id) => {
  return (
    typeof id === 'string' &&
    (id.endsWith('.studio') || id === 'settings' || id === 'shortcuts' || id === 'whats-new' || id === 'release-notes')
  )
}

function App() {
  // LocalStorage-backed core state
  const [repoUrl, setRepoUrl] = useState(() => localStorage.getItem('readme_repo_url') || '')
  const [description, setDescription] = useState(() => localStorage.getItem('readme_description') || '')
  const [selectedTechs, setSelectedTechs] = useState(() => {
    try {
      const saved = localStorage.getItem('readme_techs')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Desktop native file path and workspace directory state (Electron mode)
  const [localFilePath, setLocalFilePath] = useState(null)
  const [filePathsMap, setFilePathsMap] = useState({})
  const [workspaceDirectory, setWorkspaceDirectory] = useState(() => {
    try {
      const saved = localStorage.getItem('readme_workspace_directory')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [gitInfo, setGitInfo] = useState(null)
  const [isRefreshingGit, setIsRefreshingGit] = useState(false)
  const [unsupportedFilesMap, setUnsupportedFilesMap] = useState({})

  // Clean starter markdown default if empty
  const defaultMarkdown = `# Project Title

A clean and comprehensive documentation draft for your project.

## Overview

Describe what this project does, why it exists, and who it is built for.

## Features

- **High Performance:** Designed for responsiveness, reliability, and speed.
- **Intuitive Workflow:** Simple configuration and clear architecture.
- **Developer Ready:** Well-documented API and easy local setup.

## Getting Started

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/username/project.git
cd project

# Install dependencies
npm install
\`\`\`

### Running Locally

\`\`\`bash
npm run dev
\`\`\`

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request!

## License

Distributed under the MIT License.
`

  const [markdown, setMarkdown] = useState(() => {
    const saved = localStorage.getItem('readme_draft_markdown') || defaultMarkdown
    return foldDataUris(saved)
  })
  const [generateSuite, setGenerateSuite] = useState(true)
  const [theme, setTheme] = useState('default')
  const [sectionOrder, setSectionOrder] = useState([])
  const [additionalFiles, setAdditionalFiles] = useState(() => {
    try {
      const saved = localStorage.getItem('readme_additional_files')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const [activeFile, setActiveFile] = useState(() => {
    try {
      const savedTabs = localStorage.getItem('readme_open_doc_tabs')
      let parsedTabs = []
      if (savedTabs !== null) {
        try {
          const parsed = JSON.parse(savedTabs)
          if (Array.isArray(parsed)) {
            parsedTabs = parsed.filter((f) => !isStudioTabId(f))
          }
        } catch {}
      }
      const saved = localStorage.getItem('readme_active_file')
      if (saved && parsedTabs.includes(saved)) {
        return saved
      }
      if (parsedTabs.length > 0) {
        return parsedTabs[0]
      }
    } catch {}
    return null
  })
  const [hasGenerated, setHasGenerated] = useState(() => Boolean(localStorage.getItem('readme_has_generated')))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // IDE Workspace State
  const [activeActivityTab, setActiveActivityTab] = useState('explorer') // 'explorer' | 'generator' | 'outline' | 'templates'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const {
    viewMode,
    setViewMode,
    orientation,
    setOrientation,
    zoomLevel,
    setZoomLevel,
    fontSize,
    setFontSize,
    tabSize,
    setTabSize,
    wordWrap,
    setWordWrap,
    showLineNumbers,
    setShowLineNumbers,
    syncScroll,
    setSyncScroll,
    handleSetSyncScroll,
    isZenMode,
    setIsZenMode,
    themeMode,
    setThemeMode,
    cursorPosition,
    setCursorPosition,
    scrollToHeadingTarget,
    setScrollToHeadingTarget,
    editorEngine,
    setEditorEngine
  } = useEditorPreferences()
  const [openPresetTabs, setOpenPresetTabs] = useState([]) // Multi-preset comparison tabs e.g. ['fullstack', 'cli-tool']
  const prePreviewViewModeRef = useRef(null)

  const isPresetTabId = (id) => typeof id === 'string' && id.startsWith('preset:')
  const isPresetActive = activeFile && isPresetTabId(activeFile)
  const activePreset = isPresetActive ? getPresetById(activeFile.replace('preset:', '')) : null

  // Modals & Studio tabs state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [findReplaceOpen, setFindReplaceOpen] = useState(false)
  const [findReplaceMode, setFindReplaceMode] = useState('find') // 'find' | 'replace'
  const [openStudioTabs, setOpenStudioTabs] = useState([]) // ['badges.studio', 'diagrams.studio', 'settings', 'shortcuts']
  const [keybindings, setKeybindings] = useState(() => loadKeybindings())
  const [dirtyFiles, setDirtyFiles] = useState({}) // Tracks unsaved modifications { [fileName]: true }
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('readme_github_token') || '')
  const [recentWorkspaces, setRecentWorkspaces] = useState(() => {
    try {
      const saved = localStorage.getItem('visualmark_recent_workspaces')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [openDocTabs, setOpenDocTabs] = useState(() => {
    try {
      const saved = localStorage.getItem('readme_open_doc_tabs')
      if (saved !== null) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((f) => !isStudioTabId(f) && !isPresetTabId(f))
          return filtered
        }
      }
    } catch {
      // ignore
    }
    return ['README.md']
  })
  const fileScrollPositions = useRef({})
  const fileCursorPositions = useRef({})
  const lastActiveDocRef = useRef('README.md')
  const [updateDownloaded, setUpdateDownloaded] = useState(null)
  const [updateProgress, setUpdateProgress] = useState(null)
  const [updateError, setUpdateError] = useState(null)
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false)
  const [appVersion, setAppVersion] = useState(APP_CURRENT_VERSION)

  // Synchronize dynamic app version from Electron package.json if available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI?.getAppVersion) {
      window.electronAPI.getAppVersion().then((ver) => {
        if (ver) setAppVersion(ver)
      }).catch(() => {})
    }
  }, [])

  // Integrated Bottom Panel & Diagnostics State (VS Code / Antigravity IDE)
  const {
    isBottomPanelOpen,
    setIsBottomPanelOpen,
    activeBottomTab,
    setActiveBottomTab,
    systemLogs,
    setSystemLogs,
    handleToggleBottomPanel,
    addSystemLog
  } = useBottomPanel()

  // Global horizontal scroll handler: converts vertical mouse wheel to smooth horizontal scroll
  useEffect(() => {
    const cleanup = initGlobalHorizontalWheelHandler()
    return cleanup
  }, [])

  // Synchronize last active document reference whenever a regular doc is active
  useEffect(() => {
    if (activeFile && !isStudioTabId(activeFile) && !isPresetTabId(activeFile)) {
      lastActiveDocRef.current = activeFile
    }
  }, [activeFile])

  // Persistent storage effects
  useEffect(() => {
    const filtered = openDocTabs.filter((f) => !isStudioTabId(f) && !isPresetTabId(f))
    localStorage.setItem('readme_open_doc_tabs', JSON.stringify(filtered))
  }, [openDocTabs])

  useEffect(() => {
    if (activeFile) {
      localStorage.setItem('readme_active_file', activeFile)
    } else {
      localStorage.removeItem('readme_active_file')
    }
  }, [activeFile])

  // Invariant: keep activeFile synchronized with openDocTabs, openStudioTabs & openPresetTabs
  // If activeFile is a document, it must be in openDocTabs; if studio tab, in openStudioTabs; if preset tab, in openPresetTabs
  useEffect(() => {
    if (!activeFile) return
    if (isPresetTabId(activeFile)) {
      const presetId = activeFile.replace('preset:', '')
      if (!openPresetTabs.includes(presetId)) {
        if (openPresetTabs.length > 0) {
          setActiveFile(`preset:${openPresetTabs[openPresetTabs.length - 1]}`)
        } else {
          const validDocs = openDocTabs.filter((f) => !isStudioTabId(f) && !isPresetTabId(f))
          const validLast = lastActiveDocRef.current &&
            !isPresetTabId(lastActiveDocRef.current) &&
            !isStudioTabId(lastActiveDocRef.current) &&
            validDocs.includes(lastActiveDocRef.current)
            ? lastActiveDocRef.current
            : null
          const nextDoc = validLast || (validDocs.length > 0 ? validDocs[validDocs.length - 1] : null) || (openStudioTabs.length > 0 ? openStudioTabs[0] : null)
          setActiveFile(nextDoc)
          if (nextDoc && !isStudioTabId(nextDoc) && !isPresetTabId(nextDoc)) {
            setOpenDocTabs((prev) => (prev.includes(nextDoc) ? prev : [...prev, nextDoc]))
          }
        }
      }
      return
    }
    const isStudio = isStudioTabId(activeFile)
    if (isStudio) {
      if (!openStudioTabs.includes(activeFile)) {
        if (openStudioTabs.length > 0) {
          setActiveFile(openStudioTabs[openStudioTabs.length - 1])
        } else if (openDocTabs.length > 0) {
          setActiveFile(openDocTabs[openDocTabs.length - 1])
        } else {
          setActiveFile(null)
        }
      }
    } else {
      if (!openDocTabs.includes(activeFile)) {
        if (openDocTabs.length > 0) {
          setActiveFile(openDocTabs[openDocTabs.length - 1])
        } else if (openStudioTabs.length > 0) {
          setActiveFile(openStudioTabs[openStudioTabs.length - 1])
        } else {
          setActiveFile(null)
        }
      }
    }
  }, [activeFile, openDocTabs, openStudioTabs, openPresetTabs])

  useEffect(() => {
    localStorage.setItem('readme_repo_url', repoUrl)
  }, [repoUrl])

  useEffect(() => {
    localStorage.setItem('readme_description', description)
  }, [description])

  useEffect(() => {
    localStorage.setItem('readme_techs', JSON.stringify(selectedTechs))
  }, [selectedTechs])

  useEffect(() => {
    if (markdown) {
      safeSetItem('readme_draft_markdown', markdown)
    }
  }, [markdown])

  useEffect(() => {
    safeSetItem('readme_additional_files', JSON.stringify(additionalFiles))
  }, [additionalFiles])


  // Git status refresher
  const refreshGitStatus = useCallback(async (folderPath = workspaceDirectory?.path) => {
    if (!folderPath || typeof window === 'undefined' || !window.electronAPI?.getGitInfo) return
    setIsRefreshingGit(true)
    try {
      const info = await window.electronAPI.getGitInfo(folderPath)
      if (info) setGitInfo(info)
    } catch (err) {
      console.warn('Failed to query git status:', err)
    } finally {
      setIsRefreshingGit(false)
    }
  }, [workspaceDirectory])

  const { showToast: triggerToast } = useToast()

  const showToast = useCallback((message, type = 'success', options = {}) => {
    return triggerToast(message, type, options)
  }, [triggerToast])

  // Recent Workspaces Management
  const addRecentWorkspace = useCallback((wsPath, wsName) => {
    if (!wsPath) return
    try {
      const raw = localStorage.getItem('visualmark_recent_workspaces')
      const list = raw ? JSON.parse(raw) : []
      const name = wsName || wsPath.replace(/\\/g, '/').split('/').filter(Boolean).pop() || 'workspace'
      const filtered = list.filter((item) => item.path.toLowerCase() !== wsPath.toLowerCase())
      const updated = [{ name, path: wsPath, timestamp: Date.now() }, ...filtered].slice(0, 10)
      setRecentWorkspaces(updated)
      localStorage.setItem('visualmark_recent_workspaces', JSON.stringify(updated))
    } catch {}
  }, [])

  const handleClearRecentWorkspaces = useCallback(() => {
    setRecentWorkspaces([])
    localStorage.removeItem('visualmark_recent_workspaces')
    showToast('Cleared recently opened workspaces list', 'info')
  }, [showToast])

  // Hot Exit & Crash Resilience: cache unsaved draft edits across crashes or computer restarts
  const updateHotExitDraft = useCallback((fileKey, content, filePath = null) => {
    if (!fileKey || isStudioTabId(fileKey) || isPresetTabId(fileKey)) return
    try {
      const drafts = JSON.parse(localStorage.getItem('visualmark_hot_exit_drafts') || '{}')
      drafts[fileKey] = {
        content,
        filePath: filePath || filePathsMap[fileKey] || null,
        timestamp: Date.now(),
        isDirty: true
      }
      localStorage.setItem('visualmark_hot_exit_drafts', JSON.stringify(drafts))
    } catch {}
  }, [filePathsMap])

  const clearHotExitDraft = useCallback((fileKey) => {
    if (!fileKey) return
    try {
      const drafts = JSON.parse(localStorage.getItem('visualmark_hot_exit_drafts') || '{}')
      if (drafts[fileKey]) {
        delete drafts[fileKey]
        localStorage.setItem('visualmark_hot_exit_drafts', JSON.stringify(drafts))
      }
    } catch {}
  }, [])

  // Unified Workspace Directory Loader: sets workspace, restores session or entry doc, prevents README collision
  const openWorkspaceDirectory = useCallback(async (folderPath, folderName = null, preScannedFiles = null) => {
    if (!folderPath || typeof window === 'undefined') return
    try {
      const resolvedName = folderName || folderPath.replace(/\\/g, '/').split('/').filter(Boolean).pop() || 'workspace'
      const wsObj = {
        name: resolvedName,
        path: folderPath,
        files: []
      }
      setWorkspaceDirectory(wsObj)
      safeSetItem('readme_workspace_directory', JSON.stringify({ name: wsObj.name, path: wsObj.path }))
      addRecentWorkspace(folderPath, resolvedName)

      // Fetch live Git info
      if (window.electronAPI?.getGitInfo) {
        const git = await window.electronAPI.getGitInfo(folderPath)
        if (git) setGitInfo(git)
      }

      // Read workspace doc files
      const folderFiles = preScannedFiles || (window.electronAPI?.readWorkspaceFiles ? await window.electronAPI.readWorkspaceFiles(folderPath) : [])
      const newPathsMap = {}
      for (const f of folderFiles) {
        // Key by unique relPath (e.g. 'README.md', 'frontend/README.md') so multiple files never collide!
        newPathsMap[f.relPath] = f.fullPath
      }

      // Check for saved workspace session
      const sessionKey = 'visualmark_ws_session_' + encodeURIComponent(folderPath.toLowerCase())
      const savedSessionRaw = localStorage.getItem(sessionKey)
      let savedSession = null
      try {
        if (savedSessionRaw) savedSession = JSON.parse(savedSessionRaw)
      } catch {}

      let tabsToOpen = []
      let fileToActive = null

      if (savedSession && Array.isArray(savedSession.openTabs)) {
        tabsToOpen = savedSession.openTabs.filter((t) => newPathsMap[t] !== undefined)
        if (savedSession.activeFile && tabsToOpen.includes(savedSession.activeFile)) {
          fileToActive = savedSession.activeFile
        } else if (tabsToOpen.length > 0) {
          fileToActive = tabsToOpen[0]
        }
      } else {
        // If NO saved session exists at all (first time opening this workspace), determine initial document
        const rootReadme = folderFiles.find((f) => f.relPath.toLowerCase() === 'readme.md')
        if (rootReadme) {
          tabsToOpen = [rootReadme.relPath]
          fileToActive = rootReadme.relPath
        } else if (folderFiles.length > 0) {
          tabsToOpen = [folderFiles[0].relPath]
          fileToActive = folderFiles[0].relPath
        } else {
          tabsToOpen = []
          fileToActive = null
        }
      }

      // Read content for the open tabs
      const loadedAdditional = {}
      for (const tabKey of tabsToOpen) {
        const diskPath = newPathsMap[tabKey]
        if (diskPath && window.electronAPI?.readFile) {
          const readRes = await window.electronAPI.readFile(diskPath)
          if (readRes?.success && !readRes.isUnsupported) {
            if (tabKey === 'README.md') {
              setMarkdown(readRes.content)
            } else {
              loadedAdditional[tabKey] = readRes.content
            }
          }
        }
      }

      setAdditionalFiles(loadedAdditional)
      setFilePathsMap(newPathsMap)
      setOpenDocTabs(tabsToOpen)
      setActiveFile(fileToActive)
      setLocalFilePath(fileToActive ? newPathsMap[fileToActive] || null : null)

      window.dispatchEvent(new CustomEvent('workspace-tree-refresh'))
      showToast(`Loaded workspace: ${resolvedName} (${folderFiles.length} docs found)`, 'success')
    } catch (err) {
      console.error('Error opening workspace:', err)
      showToast('Failed to open workspace directory: ' + err.message, 'error')
    }
  }, [addRecentWorkspace, showToast])

  const handleOpenRecentWorkspace = useCallback(async (folderPath) => {
    await openWorkspaceDirectory(folderPath)
  }, [openWorkspaceDirectory])



  // Hot Exit & Crash Resilience: Restore unsaved buffers and tab states on reload/restart
  useEffect(() => {
    try {
      const rawDrafts = localStorage.getItem('visualmark_hot_exit_drafts')
      if (!rawDrafts) return
      const drafts = JSON.parse(rawDrafts)
      const draftKeys = Object.keys(drafts)
      if (draftKeys.length === 0) return

      const restoredAdditional = {}
      const restoredPaths = {}
      const restoredDirty = {}
      let hasDrafts = false

      for (const key of draftKeys) {
        const draft = drafts[key]
        if (draft && typeof draft.content === 'string') {
          hasDrafts = true
          restoredDirty[key] = true
          if (draft.filePath) restoredPaths[key] = draft.filePath
          if (key === 'README.md') {
            setMarkdown(draft.content)
          } else {
            restoredAdditional[key] = draft.content
          }
        }
      }

      if (hasDrafts) {
        setAdditionalFiles((prev) => ({ ...prev, ...restoredAdditional }))
        setFilePathsMap((prev) => ({ ...prev, ...restoredPaths }))
        setDirtyFiles((prev) => ({ ...prev, ...restoredDirty }))
        setOpenDocTabs((prev) => {
          const combined = [...prev]
          for (const k of draftKeys) {
            if (!combined.includes(k)) combined.push(k)
          }
          return combined
        })
        showToast(`⚡ Auto-recovered ${draftKeys.length} unsaved draft(s) from previous session (Hot Exit)`, 'info')
      }
    } catch (err) {
      console.warn('Failed restoring hot exit drafts:', err)
    }
  }, [showToast])

  // Save workspace tab session state whenever openDocTabs or activeFile changes
  useEffect(() => {
    if (workspaceDirectory?.path) {
      const sessionKey = 'visualmark_ws_session_' + encodeURIComponent(workspaceDirectory.path.toLowerCase())
      const validDocs = openDocTabs.filter((f) => !isStudioTabId(f) && !isPresetTabId(f))
      try {
        localStorage.setItem(sessionKey, JSON.stringify({
          openTabs: validDocs,
          activeFile: isStudioTabId(activeFile) || isPresetTabId(activeFile) ? null : activeFile
        }))
      } catch {}
    }
  }, [openDocTabs, activeFile, workspaceDirectory])

  // Open "What's New" release notes in the editor tab section
  const handleOpenWhatsNewTab = useCallback(() => {
    setOpenDocTabs((prev) => prev.filter((f) => !isStudioTabId(f)))
    setOpenStudioTabs((prev) => (prev.includes('whats-new') ? prev : [...prev, 'whats-new']))
    setActiveFile('whats-new')
  }, [])

  // Startup version check & "What's New" release notes editor tab
  useEffect(() => {
    try {
      const lastSeenVersion = localStorage.getItem('visualmark_last_seen_version')
      const suppressAuto = localStorage.getItem('visualmark_suppress_whats_new') === 'true'

      if (!lastSeenVersion) {
        // Initial launch of VisualMark Studio: open release notes tab
        localStorage.setItem('visualmark_last_seen_version', appVersion)
        handleOpenWhatsNewTab()
      } else if (lastSeenVersion !== appVersion) {
        // App updated to a newer version!
        localStorage.setItem('visualmark_last_seen_version', appVersion)
        if (!suppressAuto) {
          handleOpenWhatsNewTab()
        } else {
          showToast(`VisualMark Studio updated to v${appVersion}!`, 'info')
        }
      }
    } catch (e) {
      console.warn('Error reading version from localStorage:', e)
    }
  }, [appVersion, showToast, handleOpenWhatsNewTab])

  // Electron Auto-Updater IPC event listeners
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      const cleanupAvailable = window.electronAPI.onUpdateAvailable?.((info) => {
        setUpdateProgress({ percent: 0, transferred: 0, total: 0, version: info?.version })
        setUpdateError(null)
        showToast(`Downloading update v${info?.version || ''} in background...`, 'info')
      })

      const cleanupProgress = window.electronAPI.onUpdateProgress?.((progress) => {
        setUpdateProgress(progress)
      })

      const cleanupDownloaded = window.electronAPI.onUpdateDownloaded?.((info) => {
        setUpdateProgress(null)
        setUpdateDownloaded(info)
        setUpdateError(null)
        showToast(`Update v${info?.version || ''} downloaded! Click status bar to restart & install.`, 'success')
      })

      const cleanupError = window.electronAPI.onUpdateError?.((err) => {
        setUpdateProgress(null)
        const errMsg = err?.message || 'Update check/download failed'
        setUpdateError(errMsg)
        showToast(`Update failed: ${errMsg}`, 'warning')
      })

      return () => {
        if (typeof cleanupAvailable === 'function') cleanupAvailable()
        if (typeof cleanupProgress === 'function') cleanupProgress()
        if (typeof cleanupDownloaded === 'function') cleanupDownloaded()
        if (typeof cleanupError === 'function') cleanupError()
      }
    }
  }, [showToast])

  const handleCheckForUpdates = useCallback(async () => {
    if (isCheckingUpdate) return
    setIsCheckingUpdate(true)
    if (typeof window !== 'undefined' && window.electronAPI?.checkForUpdates) {
      try {
        showToast('Checking for updates...', 'info')
        const res = await window.electronAPI.checkForUpdates()
        if (res?.status === 'dev') {
          showToast('Auto-updater is active in production packaged builds.', 'info')
        }
      } catch {
        showToast('Unable to check for updates right now.', 'warning')
      } finally {
        setTimeout(() => setIsCheckingUpdate(false), 2000)
      }
    } else {
      showToast(`VisualMark Studio v${appVersion} is up to date.`, 'info')
      setIsCheckingUpdate(false)
    }
  }, [appVersion, isCheckingUpdate, showToast])

  const handleRestartToUpdate = useCallback(() => {
    if (window.electronAPI?.quitAndInstallUpdate) {
      window.electronAPI.quitAndInstallUpdate()
    } else {
      showToast('Restart the application to apply update.', 'info')
    }
  }, [showToast])

  // Documentation Generation
  const handleGenerate = async (url = repoUrl, desc = description, techStack = selectedTechs, options = {}) => {
    let opt = {}
    if (typeof url === 'object' && url !== null && !Array.isArray(url) && (url.repoUrl !== undefined || url.selectedDocs !== undefined || url.creationMode !== undefined)) {
      opt = url
      url = opt.repoUrl !== undefined ? opt.repoUrl : repoUrl
      desc = opt.description !== undefined ? opt.description : description
      techStack = opt.selectedTechs !== undefined ? opt.selectedTechs : selectedTechs
    } else {
      opt = options || {}
    }

    if (!url?.trim() && !desc?.trim()) {
      setError('Please provide either a GitHub repository URL or a project description.')
      showToast('Please provide a repository URL or project description.', 'error')
      setActiveActivityTab('generator')
      setSidebarCollapsed(false)
      return
    }

    setLoading(true)
    setError('')

    const mode = opt.creationMode || 'overwrite' // 'overwrite' or 'new'
    const chosenMainName = (opt.targetFileName || 'README.md').trim() || 'README.md'
    const chosenSelectedDocs = Array.isArray(opt.selectedDocs) && opt.selectedDocs.length > 0
      ? opt.selectedDocs
      : ['README.md', ...(generateSuite ? ['CONTRIBUTING.md', 'SETUP.md', 'ARCHITECTURE.md', 'LICENSE'] : [])]

    try {
      const response = await apiPost('/api/generate-readme', {
        repo_url: url || null,
        description: desc || null,
        tech_stack: techStack.length > 0 ? techStack : null,
        generate_suite: generateSuite || chosenSelectedDocs.some((d) => d !== 'README.md'),
        selected_documents: chosenSelectedDocs.filter((d) => d !== 'README.md'),
        theme: opt.theme || theme,
        section_order: opt.sectionOrder || (sectionOrder.length > 0 ? sectionOrder : null),
        github_token: githubToken || null,
      })

      const generatedMarkdown = response.data.markdown || ''
      const rawAdditional = response.data.additional_files || {}

      // Fallback generator for docs requested but not provided by backend
      const projName = response.data.metadata?.project_name || 'Project'
      const finalAdditional = {}
      for (const doc of chosenSelectedDocs) {
        if (doc === 'README.md') continue
        if (rawAdditional[doc]) {
          finalAdditional[doc] = rawAdditional[doc]
        } else if (doc === 'CHANGELOG.md') {
          finalAdditional[doc] = `# Changelog: ${projName} 📦\n\nAll notable changes to this project will be documented in this file.\n\n## [Unreleased]\n### Added\n- Automated documentation suites.\n\n## [1.0.0] - ${new Date().toISOString().slice(0, 10)}\n### Added\n- Initial release.\n`
        } else if (doc === 'CONTRIBUTING.md') {
          finalAdditional[doc] = `# Contributing to ${projName} 🤝\n\nThank you for contributing!\n`
        } else if (doc === 'SETUP.md') {
          finalAdditional[doc] = `# Setup & Local Development: ${projName} 💻\n\nInstructions for configuring local dev environment.\n`
        } else if (doc === 'ARCHITECTURE.md') {
          finalAdditional[doc] = `# System Architecture: ${projName} 🏛️\n\nArchitectural overview and service topology.\n`
        } else if (doc === 'LICENSE') {
          finalAdditional[doc] = `MIT License\n\nCopyright (c) ${new Date().getFullYear()} ${projName} Contributors\n`
        }
      }

      // Existing files map
      const currentFilesMap = { 'README.md': markdown, ...additionalFiles }
      const existingKeys = new Set([...Object.keys(currentFilesMap), ...openDocTabs])

      // Determine target filenames for Overwrite vs Create New
      let finalMainFileName = chosenMainName
      if (mode === 'new') {
        if (existingKeys.has(finalMainFileName)) {
          const dotIdx = finalMainFileName.lastIndexOf('.')
          const base = dotIdx !== -1 ? finalMainFileName.substring(0, dotIdx) : finalMainFileName
          const ext = dotIdx !== -1 ? finalMainFileName.substring(dotIdx) : '.md'
          let counter = 1
          let candidate = `${base} (${counter})${ext}`
          while (existingKeys.has(candidate)) {
            counter++
            candidate = `${base} (${counter})${ext}`
          }
          finalMainFileName = candidate
        }
      }

      // If mode === 'new', rename any companion files that already exist so they aren't clobbered
      const finalFilesMap = {}
      for (const [docName, docContent] of Object.entries(finalAdditional)) {
        let finalDocName = docName
        if (mode === 'new') {
          if (existingKeys.has(finalDocName)) {
            const dotIdx = finalDocName.lastIndexOf('.')
            const base = dotIdx !== -1 ? finalDocName.substring(0, dotIdx) : finalDocName
            const ext = dotIdx !== -1 ? finalDocName.substring(dotIdx) : ''
            let counter = 1
            let candidate = `${base} (${counter})${ext}`
            while (existingKeys.has(candidate)) {
              counter++
              candidate = `${base} (${counter})${ext}`
            }
            finalDocName = candidate
          }
        }
        finalFilesMap[finalDocName] = docContent
      }

      // 💾 Persist to Disk if Electron and Workspace directory is active
      const hasElectronFs = typeof window !== 'undefined' && window.electronAPI && workspaceDirectory?.path
      if (hasElectronFs) {
        const baseDir = workspaceDirectory.path.replace(/[\\/]+$/, '')
        try {
          // Write main file
          const mainDiskPath = `${baseDir}/${finalMainFileName}`
          if (window.electronAPI.saveDirectFile) {
            await window.electronAPI.saveDirectFile(mainDiskPath, generatedMarkdown)
          } else if (window.electronAPI.createFileDirect) {
            await window.electronAPI.createFileDirect(mainDiskPath, generatedMarkdown)
          }
          setFilePathsMap((prev) => ({ ...prev, [finalMainFileName]: mainDiskPath }))
          if (finalMainFileName === activeFile || finalMainFileName === 'README.md') {
            setLocalFilePath(mainDiskPath)
          }

          // Write companion files
          for (const [docName, docContent] of Object.entries(finalFilesMap)) {
            const docDiskPath = `${baseDir}/${docName}`
            if (window.electronAPI.saveDirectFile) {
              await window.electronAPI.saveDirectFile(docDiskPath, docContent)
            } else if (window.electronAPI.createFileDirect) {
              await window.electronAPI.createFileDirect(docDiskPath, docContent)
            }
            setFilePathsMap((prev) => ({ ...prev, [docName]: docDiskPath }))
          }

          // Notify Explorer Tree to refresh
          window.dispatchEvent(new CustomEvent('workspace-tree-refresh'))
        } catch (fsErr) {
          console.warn('Failed to save generated files to disk:', fsErr)
        }
      }

      // Update React State
      if (finalMainFileName === 'README.md') {
        setMarkdown(generatedMarkdown)
      } else {
        setAdditionalFiles((prev) => ({
          ...prev,
          [finalMainFileName]: generatedMarkdown
        }))
      }

      if (Object.keys(finalFilesMap).length > 0) {
        setAdditionalFiles((prev) => ({
          ...prev,
          ...finalFilesMap
        }))
      }

      // Open new/updated tabs
      const companionNames = Object.keys(finalFilesMap)
      setOpenDocTabs((prev) => {
        const next = [...prev]
        if (!next.includes(finalMainFileName)) next.push(finalMainFileName)
        for (const name of companionNames) {
          if (!next.includes(name)) next.push(name)
        }
        return next
      })

      // Select active tab
      setActiveFile(finalMainFileName)

      // Clear dirty flags for these files since they are saved
      setDirtyFiles((prev) => {
        const next = { ...prev }
        delete next[finalMainFileName]
        for (const name of companionNames) {
          delete next[name]
        }
        return next
      })

      setHasGenerated(true)
      localStorage.setItem('readme_has_generated', 'true')

      const totalCount = 1 + companionNames.length
      const actionVerb = mode === 'new' ? 'Created new' : 'Updated'
      const targetLabel = totalCount > 1
        ? `${actionVerb} ${finalMainFileName} and ${companionNames.length} companion documents`
        : `${actionVerb} ${finalMainFileName}`

      if (response.data.rate_limited) {
        showToast(`${targetLabel}! (Heuristic inference applied)`, 'info')
      } else {
        showToast(`✨ ${targetLabel} successfully${hasElectronFs ? ' on disk' : ''}!`, 'success')
      }
    } catch (err) {
      console.warn('Create documentation error:', err)
      const isConnError = err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || !err.response || (err.response?.status === 500 && !err.response?.data?.detail)
      let errorMsg = err.response?.data?.detail || err.message || 'Failed to create documentation'
      if (isConnError) {
        errorMsg = 'Backend server is not reachable. Please ensure the Python backend is running on port 8000.'
      }
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Active files map - dynamic and clean
  const allFiles = useMemo(() => {
    const res = { ...additionalFiles }
    if (filePathsMap['README.md'] || openDocTabs.includes('README.md') || !workspaceDirectory) {
      res['README.md'] = markdown
    }
    return res
  }, [markdown, additionalFiles, filePathsMap, openDocTabs, workspaceDirectory])

  const currentContent = activeFile === 'README.md'
    ? markdown
    : (activeFile ? (additionalFiles[activeFile] ?? '') : '')

  const handleContentChange = (newContent) => {
    setDirtyFiles((prev) => ({ ...prev, [activeFile]: true }))
    updateHotExitDraft(activeFile, newContent, filePathsMap[activeFile] || localFilePath)
    if (activeFile === 'README.md') {
      setMarkdown(newContent)
    } else {
      setAdditionalFiles((prev) => ({
        ...prev,
        [activeFile]: newContent
      }))
    }
  }

  // Live Markdown Diagnostics for Problems Tab & Status Bar
  const problems = useMemo(() => {
    if (!activeFile || isStudioTabId(activeFile) || unsupportedFilesMap[activeFile]) return []
    return lintMarkdownDocument(currentContent, activeFile)
  }, [currentContent, activeFile, unsupportedFilesMap])

  const errorCount = useMemo(() => problems.filter((p) => p.severity === 'error').length, [problems])
  const warningCount = useMemo(() => problems.filter((p) => p.severity === 'warning').length, [problems])

  // Create an untitled tab instantly like Notepad / VS Code (+)
  const handleCreateUntitledFile = useCallback(() => {
    const existing = new Set([...Object.keys(allFiles), ...openDocTabs])
    let index = 1
    let name = `Untitled-${index}.md`
    while (existing.has(name) || existing.has(`Untitled-${index}`)) {
      index++
      name = `Untitled-${index}.md`
    }

    setAdditionalFiles((prev) => ({
      ...prev,
      [name]: ''
    }))
    setFilePathsMap((prev) => ({
      ...prev,
      [name]: null
    }))
    setLocalFilePath(null)
    setOpenDocTabs((prev) => (prev.includes(name) ? prev : [...prev, name]))
    setActiveFile(name)

    setTimeout(() => {
      const textarea = document.querySelector('.editor-textarea')
      if (textarea) textarea.focus()
    }, 60)
  }, [allFiles, openDocTabs])

  // File management
  const handleCreateFile = useCallback((rawFilename, initialContent = null, fullPath = null) => {
    let filename = rawFilename?.trim()
    if (!filename) return

    if (!filename.includes('.')) {
      filename = `${filename}.md`
    }

    setOpenDocTabs((prev) => (prev.includes(filename) ? prev : [...prev, filename]))

    if (allFiles[filename] !== undefined && !fullPath) {
      setActiveFile(filename)
      return
    }

    const content = initialContent !== null
      ? initialContent
      : `# ${filename.replace(/\.[^/.]+$/, '')}\n\nAdd content here.\n`

    setAdditionalFiles((prev) => ({
      ...prev,
      [filename]: content
    }))

    if (fullPath) {
      setFilePathsMap((prev) => ({ ...prev, [filename]: fullPath }))
      setLocalFilePath(fullPath)
    } else if (workspaceDirectory?.path) {
      const computed = `${workspaceDirectory.path.replace(/[\\/]+$/, '')}/${filename}`
      setFilePathsMap((prev) => ({ ...prev, [filename]: computed }))
      setLocalFilePath(computed)
    }

    setActiveFile(filename)
    showToast(`Created ${filename}`, 'success')
  }, [allFiles, workspaceDirectory, showToast])

  const handleDeleteFile = (filename) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${filename}"?\n\nThis will permanently remove this file.`
    )
    if (!confirmed) return

    clearHotExitDraft(filename)

    if (filename === 'README.md') {
      setMarkdown('')
    } else {
      setAdditionalFiles((prev) => {
        const next = { ...prev }
        delete next[filename]
        return next
      })
    }

    setFilePathsMap((prev) => {
      const next = { ...prev }
      delete next[filename]
      return next
    })

    const nextTabs = openDocTabs.filter((f) => f !== filename)
    setOpenDocTabs(nextTabs)

    if (activeFile === filename) {
      if (nextTabs.length > 0) {
        setActiveFile(nextTabs[0])
        setLocalFilePath(filePathsMap[nextTabs[0]] || null)
      } else {
        setActiveFile(null)
        setLocalFilePath(null)
      }
    }
    showToast(`Deleted ${filename}`, 'info')
  }

  const handleReorderDocTabs = useCallback((newTabs) => {
    setOpenDocTabs(newTabs)
    try {
      localStorage.setItem('readme_open_doc_tabs', JSON.stringify(newTabs))
    } catch {}
  }, [])

  const handleSelectFile = useCallback(async (filename, content = null, filePath = null, unsupportedInfo = null) => {
    const editorArea = document.querySelector('.editor-scroll-area')
    const previewArea = document.querySelector('.preview-pane')
    if (activeFile && !isStudioTabId(activeFile) && !isPresetTabId(activeFile)) {
      fileScrollPositions.current[activeFile] = {
        editor: editorArea ? editorArea.scrollTop : 0,
        preview: previewArea ? previewArea.scrollTop : 0
      }
    }

    if (isPresetTabId(filename)) {
      const presetId = filename.replace('preset:', '')
      setOpenDocTabs((prev) => prev.filter((f) => !isPresetTabId(f)))
      setOpenPresetTabs((prev) => (prev.includes(presetId) ? prev : [...prev, presetId]))
      setActiveFile(filename)
      return
    }

    if (isStudioTabId(filename)) {
      setOpenDocTabs((prev) => prev.filter((f) => !isStudioTabId(f)))
      setOpenStudioTabs((prev) => (prev.includes(filename) ? prev : [...prev, filename]))
      setActiveFile(filename)
      return
    }

    // Direct unsupported file info passed
    if (unsupportedInfo) {
      setUnsupportedFilesMap((prev) => ({ ...prev, [filename]: unsupportedInfo }))
      setOpenDocTabs((prev) => (prev.includes(filename) ? prev : [...prev, filename]))
      setActiveFile(filename)
      if (filePath) {
        setLocalFilePath(filePath)
        setFilePathsMap((prev) => ({ ...prev, [filename]: filePath }))
      }
      return
    }

    // If filePath is passed but content is null, read file from disk
    let resolvedContent = content
    let resolvedPath = filePath || filePathsMap[filename] || null
    if (resolvedContent === null && resolvedPath && typeof window !== 'undefined' && window.electronAPI?.readFile) {
      try {
        const readRes = await window.electronAPI.readFile(resolvedPath)
        if (readRes?.success) {
          if (readRes.isUnsupported) {
            setUnsupportedFilesMap((prev) => ({ ...prev, [filename]: readRes }))
            setOpenDocTabs((prev) => (prev.includes(filename) ? prev : [...prev, filename]))
            setActiveFile(filename)
            setLocalFilePath(resolvedPath)
            setFilePathsMap((prev) => ({ ...prev, [filename]: resolvedPath }))
            return
          }
          resolvedContent = readRes.content
        }
      } catch (err) {
        console.warn('Error reading file:', err)
      }
    }

    // Supported text file: clear unsupported flag
    setUnsupportedFilesMap((prev) => {
      if (!prev[filename]) return prev
      const next = { ...prev }
      delete next[filename]
      return next
    })

    if (resolvedContent !== null && resolvedContent !== undefined) {
      if (filename === 'README.md') {
        setMarkdown(resolvedContent)
      } else {
        setAdditionalFiles((prev) => ({
          ...prev,
          [filename]: resolvedContent
        }))
      }
    }

    if (filePath) {
      setLocalFilePath(filePath)
      setFilePathsMap((prev) => ({ ...prev, [filename]: filePath }))
    } else {
      setLocalFilePath(filePathsMap[filename] || null)
    }

    setOpenDocTabs((prev) => (prev.includes(filename) ? prev : [...prev, filename]))
    setActiveFile(filename)

    const saved = fileScrollPositions.current[filename] || { editor: 0, preview: 0 }
    const restore = () => {
      const ed = document.querySelector('.editor-scroll-area')
      const pr = document.querySelector('.preview-pane')
      const gt = document.querySelector('.editor-gutter')
      if (ed) ed.scrollTop = saved.editor
      if (pr) pr.scrollTop = saved.preview
      if (gt) gt.scrollTop = saved.editor
    }
    restore()
    window.requestAnimationFrame(restore)
    setTimeout(restore, 50)
    setTimeout(restore, 150)
  }, [activeFile, filePathsMap])

  const openWorkspaceDirectoryRef = useRef(openWorkspaceDirectory)
  openWorkspaceDirectoryRef.current = openWorkspaceDirectory
  const handleSelectFileRef = useRef(handleSelectFile)
  handleSelectFileRef.current = handleSelectFile
  const showToastRef = useRef(showToast)
  showToastRef.current = showToast
  const hasInitializedStartupWs = useRef(false)

  // Desktop: Auto-detect workspace on startup (runs strictly ONCE on mount)
  useEffect(() => {
    if (hasInitializedStartupWs.current) return
    hasInitializedStartupWs.current = true

    if (typeof window !== 'undefined' && window.electronAPI) {
      if (window.electronAPI.getDefaultWorkspace) {
        window.electronAPI.getDefaultWorkspace().then(async (ws) => {
          if (ws?.isArgv && ws.rootPath) {
            await openWorkspaceDirectoryRef.current(ws.rootPath, ws.rootName)
            if (ws.initialFile) {
              const normWs = ws.rootPath.replace(/\\/g, '/').replace(/\/+$/, '')
              const normFile = ws.initialFile.replace(/\\/g, '/')
              const rel = normFile.toLowerCase().startsWith(normWs.toLowerCase() + '/')
                ? normFile.slice(normWs.length + 1)
                : ws.initialFile.split(/[\\/]/).pop()
              handleSelectFileRef.current(rel, null, ws.initialFile)
            }
            return
          }

          // Fallback to restored workspace session if no CLI argument
          const savedWsRaw = localStorage.getItem('readme_workspace_directory')
          let savedWs = null
          try {
            if (savedWsRaw) savedWs = JSON.parse(savedWsRaw)
          } catch {}

          // Sanitize: never re-open the application's own installation folder
          if (savedWs?.path) {
            const p = savedWs.path.toLowerCase()
            if (p.includes('programs\\visualmark-studio') || p.includes('programs/visualmark-studio') || p.endsWith('visualmark studio')) {
              localStorage.removeItem('readme_workspace_directory')
              savedWs = null
            }
          }

          if (savedWs?.path) {
            openWorkspaceDirectoryRef.current(savedWs.path, savedWs.name)
          } else if (ws?.rootPath) {
            openWorkspaceDirectoryRef.current(ws.rootPath, ws.rootName)
          }
        }).catch((err) => {
          console.warn('Could not load default workspace on startup:', err)
        })
      }
    }
  }, [])

  // Listen for Windows Explorer "Open with VisualMark Studio" while app is already open
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      const cleanWs = window.electronAPI.onOpenExternalWorkspace?.(async (ws) => {
        if (ws?.folderPath) {
          await openWorkspaceDirectoryRef.current(ws.folderPath, ws.folderName)
          showToastRef.current(`Opened workspace: ${ws.folderName || ws.folderPath}`, 'info')
        }
      })
      const cleanFile = window.electronAPI.onOpenExternalFile?.(async (file) => {
        if (file?.filePath) {
          handleSelectFileRef.current(file.fileName, null, file.filePath)
          showToastRef.current(`Opened file: ${file.fileName}`, 'info')
        }
      })
      return () => {
        if (typeof cleanWs === 'function') cleanWs()
        if (typeof cleanFile === 'function') cleanFile()
      }
    }
  }, [])

  const handleSelectProblem = useCallback((problem) => {
    if (!problem) return
    if (problem.file && problem.file !== activeFile) {
      handleSelectFile(problem.file)
    }
    if (problem.line) {
      setCursorPosition({ line: problem.line, col: problem.col || 1 })
      setScrollToHeadingTarget({ line: problem.line, timestamp: Date.now() })
    }
  }, [activeFile, handleSelectFile])

  const handleOpenStudioTab = useCallback((tabId) => {
    const editorArea = document.querySelector('.editor-scroll-area')
    const previewArea = document.querySelector('.preview-pane')
    if (activeFile && !isStudioTabId(activeFile) && !isPresetTabId(activeFile)) {
      lastActiveDocRef.current = activeFile
      fileScrollPositions.current[activeFile] = {
        editor: editorArea ? editorArea.scrollTop : 0,
        preview: previewArea ? previewArea.scrollTop : 0
      }
      const textarea = editorArea?.querySelector('textarea')
      if (textarea && typeof textarea.selectionStart === 'number') {
        const selStart = textarea.selectionStart
        const selEnd = textarea.selectionEnd
        const textBefore = (currentContent || '').substring(0, selStart)
        const lineNum = textBefore.split('\n').length
        const lastNewline = textBefore.lastIndexOf('\n')
        const colNum = selStart - lastNewline
        fileCursorPositions.current[activeFile] = {
          line: lineNum,
          col: colNum,
          index: selStart,
          selectionEnd: selEnd
        }
      }
    }
    setOpenDocTabs((prev) => prev.filter((f) => !isStudioTabId(f)))
    setOpenStudioTabs((prev) => (prev.includes(tabId) ? prev : [...prev, tabId]))
    setActiveFile(tabId)
  }, [activeFile, currentContent])

  const handleCloseStudioTab = useCallback((tabId) => {
    setOpenStudioTabs((prev) => prev.filter((t) => t !== tabId))
    setActiveFile((current) => {
      if (current !== tabId) return current
      const remainingStudio = openStudioTabs.filter((t) => t !== tabId)
      if (remainingStudio.length > 0) {
        return remainingStudio[remainingStudio.length - 1]
      }
      if (openDocTabs && openDocTabs.length > 0) {
        return openDocTabs[openDocTabs.length - 1]
      }
      return null
    })
  }, [openStudioTabs, openDocTabs])

  const handleOpenSettingsTab = useCallback(() => {
    setOpenDocTabs((prev) => prev.filter((f) => !isStudioTabId(f)))
    setOpenStudioTabs((prev) => (prev.includes('settings') ? prev : [...prev, 'settings']))
    setActiveFile('settings')
  }, [])

  const handleOpenShortcutsTab = useCallback(() => {
    setOpenDocTabs((prev) => prev.filter((f) => !isStudioTabId(f)))
    setOpenStudioTabs((prev) => (prev.includes('shortcuts') ? prev : [...prev, 'shortcuts']))
    setActiveFile('shortcuts')
  }, [])


  const handleUpdateKeybinding = useCallback((commandId, newKey) => {
    saveKeybindingOverride(commandId, newKey)
    setKeybindings(loadKeybindings())
  }, [])

  const handleResetKeybindings = useCallback(() => {
    resetAllKeybindings()
    setKeybindings(loadKeybindings())
  }, [])

  // Open the target document selection modal to insert snippet at cursor line
  const handleRequestInsertSnippet = useCallback((snippet, snippetType = 'Snippet') => {
    setInsertModalState({
      isOpen: true,
      snippet,
      snippetType
    })
  }, [])

  // Execute insertion of snippet into chosen target document at the exact cursor line
  const handleExecuteInsertSnippet = useCallback((targetFile, snippet, snippetType = 'Snippet') => {
    if (!targetFile || !snippet) return

    const originalContent = targetFile === 'README.md'
      ? markdown
      : (additionalFiles[targetFile] || '')

    const cursor = fileCursorPositions.current[targetFile] || { line: 1, col: 1, index: 0 }
    const targetLine = Math.max(1, cursor.line || 1)

    const foldedSnippet = foldDataUris(snippet).trim()
    const lines = originalContent.split('\n')
    const lineIdx = Math.min(Math.max(0, targetLine - 1), lines.length)
    const currentLineText = lines[lineIdx] ?? ''

    let newLines = [...lines]
    let insertedAtLine = targetLine

    if (lines.length === 0 || (lines.length === 1 && lines[0] === '')) {
      newLines = [foldedSnippet]
      insertedAtLine = 1
    } else if (currentLineText.trim() === '') {
      newLines.splice(lineIdx, 1, foldedSnippet)
      insertedAtLine = targetLine
    } else {
      if (cursor.col === 1) {
        newLines.splice(lineIdx, 0, foldedSnippet)
        insertedAtLine = targetLine
      } else {
        newLines.splice(lineIdx + 1, 0, foldedSnippet)
        insertedAtLine = targetLine + 1
      }
    }

    const updatedContent = newLines.join('\n')

    if (targetFile === 'README.md') {
      setMarkdown(updatedContent)
    } else {
      setAdditionalFiles((prev) => ({
        ...prev,
        [targetFile]: updatedContent
      }))
    }
    setDirtyFiles((prev) => ({ ...prev, [targetFile]: true }))

    setOpenDocTabs((prev) => (prev.includes(targetFile) ? prev : [...prev, targetFile]))
    setActiveFile(targetFile)
    lastActiveDocRef.current = targetFile

    const snippetLineCount = foldedSnippet.split('\n').length
    const nextCursorLine = insertedAtLine + snippetLineCount
    fileCursorPositions.current[targetFile] = { line: nextCursorLine, col: 1 }

    setInsertModalState({ isOpen: false, snippet: '', snippetType: '' })
    showToast(`✓ Inserted ${snippetType} into ${targetFile} at line ${insertedAtLine}!`, 'success')

    const scrollToInsertedLine = () => {
      const editorArea = document.querySelector('.editor-scroll-area')
      if (editorArea) {
        const lineAnchor = editorArea.querySelector(`.editor-line-anchor[data-line="${insertedAtLine}"]`)
        if (lineAnchor) {
          lineAnchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        const textarea = editorArea.querySelector('textarea')
        if (textarea) {
          const linesBefore = newLines.slice(0, insertedAtLine - 1)
          const charOffset = linesBefore.join('\n').length + (linesBefore.length > 0 ? 1 : 0)
          textarea.focus({ preventScroll: true })
          textarea.setSelectionRange(charOffset, charOffset)
        }
      }
    }

    setTimeout(scrollToInsertedLine, 60)
    setTimeout(scrollToInsertedLine, 180)
  }, [markdown, additionalFiles, showToast])

  // Create a new document tab and insert snippet at line 1
  const handleInsertIntoNewDoc = useCallback((snippet, snippetType = 'Snippet') => {
    let count = 1
    let name = `Untitled-${count}.md`
    const allDocNames = ['README.md', ...Object.keys(additionalFiles), ...openDocTabs]
    while (allDocNames.includes(name)) {
      count++
      name = `Untitled-${count}.md`
    }

    const foldedSnippet = foldDataUris(snippet).trim()
    setAdditionalFiles((prev) => ({
      ...prev,
      [name]: foldedSnippet
    }))
    setDirtyFiles((prev) => ({ ...prev, [name]: true }))
    setOpenDocTabs((prev) => (prev.includes(name) ? prev : [...prev, name]))
    setActiveFile(name)
    lastActiveDocRef.current = name
    fileCursorPositions.current[name] = { line: 1, col: 1 }

    setInsertModalState({ isOpen: false, snippet: '', snippetType: '' })
    showToast(`✓ Created ${name} and inserted ${snippetType}!`, 'success')
  }, [additionalFiles, openDocTabs, showToast])

  const handleBackToReadme = useCallback((targetFileOverride) => {
    const docTabs = openDocTabs.filter((f) => !isStudioTabId(f))
    const target = (targetFileOverride && (docTabs.includes(targetFileOverride) || allFiles[targetFileOverride] !== undefined))
      ? targetFileOverride
      : ((lastActiveDocRef.current && docTabs.includes(lastActiveDocRef.current))
        ? lastActiveDocRef.current
        : (docTabs.length > 0 ? docTabs[0] : 'README.md'))
    setOpenDocTabs((prev) => (prev.includes(target) ? prev : [target, ...prev]))
    setActiveFile(target)
  }, [openDocTabs, allFiles])

  const handleCloseFile = (filename) => {
    if (isStudioTabId(filename)) {
      handleCloseStudioTab(filename)
      return
    }

    setUnsupportedFilesMap((prev) => {
      if (!prev[filename]) return prev
      const next = { ...prev }
      delete next[filename]
      return next
    })

    if (dirtyFiles[filename]) {
      const confirmDiscard = window.confirm(
        `"${filename}" has unsaved changes.\n\nDo you want to close this tab and discard modifications?`
      )
      if (!confirmDiscard) return
      setDirtyFiles((prev) => {
        const next = { ...prev }
        delete next[filename]
        return next
      })
    }

    clearHotExitDraft(filename)
    const nextTabs = openDocTabs.filter((f) => f !== filename)
    setOpenDocTabs(nextTabs)
    if (lastActiveDocRef.current === filename) {
      lastActiveDocRef.current = nextTabs[0] || null
    }
    if (activeFile === filename) {
      if (nextTabs.length > 0) {
        const closedIdx = openDocTabs.indexOf(filename)
        const newActive = nextTabs[Math.max(0, closedIdx - 1)] || nextTabs[0]
        setActiveFile(newActive)
      } else if (openStudioTabs.length > 0) {
        setActiveFile(openStudioTabs[0])
      } else if (openPresetTabs.length > 0) {
        setActiveFile(`preset:${openPresetTabs[0]}`)
      } else {
        setActiveFile(null)
      }
    }
  }

  // Clipboard & Native Desktop Export
  const handleCopy = () => copyDocumentToClipboard(currentContent, activeFile, showToast)

  const handleDownloadActiveFile = () => downloadActiveFile(currentContent, activeFile, showToast)

  const handleDownloadSuite = () => downloadDocumentationSuite(markdown, additionalFiles, showToast)

  const handleDownload = handleDownloadActiveFile

  const handleDownloadHtml = () => downloadHtmlDocument(currentContent, activeFile, showToast)

  const handleDownloadPdf = () =>
    downloadPdfDocument({
      content: currentContent,
      filename: activeFile,
      themeMode,
      previewElement: document.querySelector('.preview-canvas'),
      showToast
    })

  // Desktop Native Open File
  const handleOpenNativeFile = useCallback(async () => {
    if (typeof window !== 'undefined' && window.electronAPI?.openFileDialog) {
      const res = await window.electronAPI.openFileDialog()
      if (!res.canceled && res.content !== undefined) {
        const normWs = (workspaceDirectory?.path || '').replace(/\\/g, '/').replace(/\/+$/, '')
        const normFile = (res.filePath || '').replace(/\\/g, '/')
        const relPath = normWs && normFile.toLowerCase().startsWith(normWs.toLowerCase() + '/')
          ? normFile.slice(normWs.length + 1)
          : res.fileName

        handleSelectFile(relPath, res.content, res.filePath)
        showToast(`Opened ${res.fileName} from disk`, 'info')
      }
    } else {
      // Web fallback: trigger file input
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.md,.markdown,.txt'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (re) => {
            handleSelectFile(file.name, re.target.result)
            showToast(`Loaded ${file.name}`, 'info')
          }
          reader.readAsText(file)
        }
      }
      input.click()
    }
  }, [workspaceDirectory, handleSelectFile, showToast])

  // Desktop Native Open Folder
  const handleOpenNativeFolder = useCallback(async () => {
    if (typeof window !== 'undefined' && window.electronAPI?.openFolderDialog) {
      try {
        const res = await window.electronAPI.openFolderDialog()
        if (res.canceled || !res.folderPath) return
        await openWorkspaceDirectory(res.folderPath, res.folderName, res.files)
      } catch (err) {
        console.error('Error opening folder:', err)
        showToast('Failed to open workspace directory: ' + err.message, 'error')
      }
    }
  }, [openWorkspaceDirectory, showToast])

  // External file drop handler (TabBar, Preview, etc.)
  const handleDropExternalFile = useCallback(async (file) => {
    if (!file) return
    if (typeof window !== 'undefined' && window.electronAPI?.readFile && file.path) {
      try {
        const readRes = await window.electronAPI.readFile(file.path)
        if (readRes?.success) {
          const normWs = (workspaceDirectory?.path || '').replace(/\\/g, '/').replace(/\/+$/, '')
          const normFile = file.path.replace(/\\/g, '/')
          const relPath = normWs && normFile.toLowerCase().startsWith(normWs.toLowerCase() + '/')
            ? normFile.slice(normWs.length + 1)
            : file.name

          if (readRes.isUnsupported) {
            handleSelectFile(relPath, null, file.path, readRes)
          } else {
            handleSelectFile(relPath, readRes.content, file.path)
          }
          showToast(`✓ Opened ${file.name}`, 'info')
          return
        }
      } catch (err) {
        console.warn('Failed to read external dropped file:', err)
      }
    }

    // Web fallback
    const reader = new FileReader()
    reader.onload = (e) => {
      handleSelectFile(file.name, e.target.result)
      showToast(`✓ Opened ${file.name}`, 'info')
    }
    reader.readAsText(file)
  }, [workspaceDirectory, handleSelectFile, showToast])

  // Desktop Native Direct Save (or Save As)
  const handleSaveNativeFile = useCallback(async (saveAs = false) => {
    const content = currentContent || ''
    const currentPath = filePathsMap[activeFile] || localFilePath || null

    if (typeof window !== 'undefined' && window.electronAPI?.saveDirectFile) {
      if (!saveAs && currentPath) {
        const res = await window.electronAPI.saveDirectFile(currentPath, content)
        if (res.success) {
          setDirtyFiles((prev) => ({ ...prev, [activeFile]: false }))
          clearHotExitDraft(activeFile)
          showToast(`✓ Saved ${activeFile}`, 'success')
          return
        }
      }

      const defaultSuggest = currentPath || (workspaceDirectory?.path
        ? `${workspaceDirectory.path.replace(/[\\/]+$/, '')}/${activeFile || 'README.md'}`
        : (activeFile || 'README.md'))

      const res = await window.electronAPI.saveFileDialog(content, defaultSuggest)
      if (!res.canceled && res.filePath) {
        const savedFileName = res.fileName || activeFile
        setFilePathsMap((prev) => ({ ...prev, [savedFileName]: res.filePath }))
        setLocalFilePath(res.filePath)
        setDirtyFiles((prev) => ({ ...prev, [savedFileName]: false }))
        clearHotExitDraft(savedFileName)
        if (savedFileName !== activeFile) clearHotExitDraft(activeFile)

        if (savedFileName !== activeFile) {
          if (activeFile === 'README.md') {
            setAdditionalFiles((prev) => ({ ...prev, [savedFileName]: content }))
          } else {
            setAdditionalFiles((prev) => {
              const next = { ...prev }
              delete next[activeFile]
              next[savedFileName] = content
              return next
            })
          }
          setOpenDocTabs((prev) => prev.map((t) => (t === activeFile ? savedFileName : t)))
          setActiveFile(savedFileName)
        }
        showToast(`✓ Saved ${savedFileName} to disk`, 'success')
      }
    } else {
      handleDownloadActiveFile()
      setDirtyFiles((prev) => ({ ...prev, [activeFile]: false }))
      clearHotExitDraft(activeFile)
    }
  }, [currentContent, activeFile, localFilePath, filePathsMap, workspaceDirectory, clearHotExitDraft, handleDownloadActiveFile, showToast])

  const handleClear = () => {
    if (window.confirm(`Are you sure you want to reset the active markdown buffer? Any unsaved edits to ${activeFile} will be cleared.`)) {
      localStorage.removeItem('readme_draft_markdown')
      setMarkdown('')
      showToast('Reset active markdown buffer.', 'info')
    }
  }

  const handleLoadTemplate = (content, title) => {
    setMarkdown(content)
    setOpenDocTabs((prev) => (prev.includes('README.md') ? prev : ['README.md', ...prev]))
    setActiveFile('README.md')
    showToast(`Loaded ${title} template into editor!`, 'success')

    // Reset scroll to top (line 1) across multiple frames so new preset template doesn't open scrolled down
    const resetScrollToTop = () => {
      const editorArea = document.querySelector('.editor-scroll-area')
      const previewArea = document.querySelector('.preview-pane')
      const gutter = document.querySelector('.editor-gutter')
      if (editorArea) editorArea.scrollTop = 0
      if (previewArea) previewArea.scrollTop = 0
      if (gutter) gutter.scrollTop = 0
    }
    resetScrollToTop()
    window.requestAnimationFrame(resetScrollToTop)
    setTimeout(resetScrollToTop, 50)
    setTimeout(resetScrollToTop, 150)
    setTimeout(resetScrollToTop, 300)
  }

  // Preset Tab Handlers (Multiple Preset Comparison Tabs & Direct File Creation)
  const handleClosePresetTab = useCallback((presetId) => {
    const tabId = `preset:${presetId}`
    const preset = getPresetById(presetId)

    // 1. Update openPresetTabs
    const nextPresetTabs = openPresetTabs.filter((id) => id !== presetId)
    setOpenPresetTabs(nextPresetTabs)

    // 2. Ensure openDocTabs does not contain any preset IDs
    setOpenDocTabs((prevDocs) => prevDocs.filter((f) => !isPresetTabId(f)))

    // 3. Switch active file if this preset was active
    if (activeFile === tabId) {
      if (nextPresetTabs.length > 0) {
        const closedIdx = openPresetTabs.indexOf(presetId)
        const newPresetId = nextPresetTabs[Math.max(0, closedIdx - 1)] || nextPresetTabs[0]
        setActiveFile(`preset:${newPresetId}`)
      } else {
        // Exiting all preset previews: return to real document
        const validDocs = openDocTabs.filter((f) => !isStudioTabId(f) && !isPresetTabId(f))
        const validLast = lastActiveDocRef.current &&
          !isPresetTabId(lastActiveDocRef.current) &&
          !isStudioTabId(lastActiveDocRef.current) &&
          validDocs.includes(lastActiveDocRef.current)
          ? lastActiveDocRef.current
          : null

        const targetDoc = validLast || (validDocs.length > 0 ? validDocs[validDocs.length - 1] : null) || (openStudioTabs.length > 0 ? openStudioTabs[0] : 'README.md')
        setActiveFile(targetDoc)

        if (!isStudioTabId(targetDoc) && !isPresetTabId(targetDoc)) {
          setOpenDocTabs((prevDocs) => {
            const cleaned = prevDocs.filter((f) => !isPresetTabId(f))
            return cleaned.includes(targetDoc) ? cleaned : [...cleaned, targetDoc]
          })
        }
      }
    }
  }, [activeFile, openPresetTabs, openDocTabs, openStudioTabs])

  const handleExitAllPresetPreviews = useCallback(() => {
    setOpenPresetTabs([])
    setOpenDocTabs((prevDocs) => prevDocs.filter((f) => !isPresetTabId(f)))

    const validDocs = openDocTabs.filter((f) => !isStudioTabId(f) && !isPresetTabId(f))
    const validLast = lastActiveDocRef.current &&
      !isPresetTabId(lastActiveDocRef.current) &&
      !isStudioTabId(lastActiveDocRef.current) &&
      validDocs.includes(lastActiveDocRef.current)
      ? lastActiveDocRef.current
      : null

    const targetDoc = validLast || (validDocs.length > 0 ? validDocs[validDocs.length - 1] : null) || (openStudioTabs.length > 0 ? openStudioTabs[0] : null)
    setActiveFile(targetDoc)

    if (targetDoc && !isStudioTabId(targetDoc) && !isPresetTabId(targetDoc)) {
      setOpenDocTabs((prevDocs) => {
        const cleaned = prevDocs.filter((f) => !isPresetTabId(f))
        return cleaned.includes(targetDoc) ? cleaned : [...cleaned, targetDoc]
      })
    }
  }, [openDocTabs, openStudioTabs])

  const handleTogglePresetPreview = useCallback((template) => {
    if (!template) return
    const tabId = `preset:${template.id}`
    if (activeFile === tabId) {
      // Toggle off if already active
      handleClosePresetTab(template.id)
    } else {
      setOpenPresetTabs((prev) => (prev.includes(template.id) ? prev : [...prev, template.id]))
      setActiveFile(tabId)
      showToast(`Viewing preset "${template.title}" in preview tab`, 'info')
    }
  }, [activeFile, handleClosePresetTab, showToast])

  // Fix Major Bug: When user clicks "Load", create a new file named after the preset instead of modifying README.md
  const handleLoadPresetAsNewFile = useCallback((template) => {
    if (!template) return

    // Clean up template title into a valid filename (e.g. "🚀 Full-Stack SaaS" -> "Full-Stack-SaaS")
    let cleanTitle = (template.title || 'Preset')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    if (!cleanTitle) cleanTitle = 'Preset-Template'

    let targetFilename = `${cleanTitle}.md`
    let collisionCounter = 1

    const existingNames = new Set([
      ...Object.keys(allFiles),
      ...openDocTabs
    ].map((n) => n.toLowerCase()))

    while (existingNames.has(targetFilename.toLowerCase())) {
      targetFilename = `${cleanTitle}-${collisionCounter}.md`
      collisionCounter++
    }

    handleCreateFile(targetFilename, template.content)
    setDirtyFiles((prev) => ({ ...prev, [targetFilename]: true }))

    // Close preview tab if it was open
    if (template.id && openPresetTabs.includes(template.id)) {
      setOpenPresetTabs((prev) => prev.filter((id) => id !== template.id))
    }

    // Switch viewMode to split so user can immediately edit their new document
    setViewMode('split')

    showToast(`✓ Created new document "${targetFilename}" from ${template.title}!`, 'success')
  }, [allFiles, openDocTabs, openPresetTabs, handleCreateFile, showToast])

  // Dynamic Keyboard shortcut listener
  useEffect(() => {
    const getKey = (id) => keybindings.find((k) => k.id === id)?.key

    const handleKeyDown = (e) => {
      // Preferences: Settings
      if (matchesKeybinding(e, getKey('pref.settings') || 'Ctrl + ,')) {
        e.preventDefault()
        handleOpenSettingsTab()
      }
      // Preferences: Shortcuts
      else if (matchesKeybinding(e, getKey('pref.shortcuts') || 'Ctrl + /')) {
        e.preventDefault()
        handleOpenShortcutsTab()
      }
      // Command Palette
      else if (matchesKeybinding(e, getKey('view.commandPalette') || 'Ctrl + K')) {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
      // Toggle Primary Sidebar
      else if (matchesKeybinding(e, getKey('view.toggleSidebar') || 'Ctrl + B')) {
        e.preventDefault()
        setSidebarCollapsed((prev) => !prev)
      }
      // Create Documentation
      else if (matchesKeybinding(e, getKey('doc.create') || getKey('ai.generate') || 'Ctrl + Enter')) {
        e.preventDefault()
        handleGenerate()
      }
      // File: New Document
      else if (matchesKeybinding(e, getKey('file.new') || 'Ctrl + N')) {
        e.preventDefault()
        handleCreateUntitledFile()
      }
      // File: Close Active Tab (Ctrl + W)
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'w' || e.key === 'W') && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        if (activeFile) {
          handleCloseFile(activeFile)
        }
      }
      // File: Open File
      else if (matchesKeybinding(e, getKey('file.open') || 'Ctrl + O')) {
        e.preventDefault()
        handleOpenNativeFile()
      }
      // File: Open Folder
      else if (matchesKeybinding(e, getKey('file.openFolder') || 'Ctrl + Shift + O')) {
        e.preventDefault()
        handleOpenNativeFolder()
      }
      // File: Quick Save
      else if (matchesKeybinding(e, getKey('file.save') || 'Ctrl + S')) {
        e.preventDefault()
        handleSaveNativeFile(false)
      }
      // File: Save As
      else if (matchesKeybinding(e, getKey('file.saveAs') || 'Ctrl + Shift + S')) {
        e.preventDefault()
        handleSaveNativeFile(true)
      }
      // File: Export PDF
      else if (matchesKeybinding(e, getKey('file.exportPdf') || 'Ctrl + P')) {
        e.preventDefault()
        handleDownloadPdf()
      }
      // Navigation: Explorer
      else if (matchesKeybinding(e, getKey('nav.explorer') || 'Ctrl + Shift + E')) {
        e.preventDefault()
        setActiveActivityTab('explorer')
        setSidebarCollapsed(false)
      }
      // AI: Generator sidebar
      else if (matchesKeybinding(e, getKey('nav.generator') || 'Ctrl + Shift + G')) {
        e.preventDefault()
        setActiveActivityTab('generator')
        setSidebarCollapsed(false)
      }
      // View: Cycle View Mode
      else if (matchesKeybinding(e, getKey('view.cycleMode') || 'Ctrl + Shift + P')) {
        e.preventDefault()
        setViewMode((prev) => (prev === 'split' ? 'preview' : prev === 'preview' ? 'editor' : 'split'))
      }
      // View: Toggle Split Orientation
      else if (
        matchesKeybinding(e, getKey('view.toggleOrientation') || 'Ctrl + \\') ||
        (e.altKey && e.shiftKey && (e.key === '0' || e.code === 'Digit0'))
      ) {
        e.preventDefault()
        setOrientation((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'))
      }
      // View: Zen Mode
      else if (matchesKeybinding(e, getKey('view.toggleZen') || 'F11')) {
        e.preventDefault()
        setIsZenMode((prev) => !prev)
      }
      // Edit: Find
      else if (matchesKeybinding(e, getKey('edit.find') || 'Ctrl + F')) {
        e.preventDefault()
        setFindReplaceMode('find')
        setFindReplaceOpen(true)
      }
      // Edit: Replace
      else if (matchesKeybinding(e, getKey('edit.replace') || 'Ctrl + H')) {
        e.preventDefault()
        setFindReplaceMode('replace')
        setFindReplaceOpen(true)
      }
      // Studio: Badges
      else if (matchesKeybinding(e, getKey('studio.badges') || 'Ctrl + Shift + B')) {
        e.preventDefault()
        handleOpenStudioTab('badges.studio')
      }
      // Studio: Diagrams
      else if (matchesKeybinding(e, getKey('studio.diagrams') || 'Ctrl + Shift + M')) {
        e.preventDefault()
        handleOpenStudioTab('diagrams.studio')
      }
      // Studio: Tables
      else if (matchesKeybinding(e, getKey('studio.tables') || 'Ctrl + Shift + T')) {
        e.preventDefault()
        handleOpenStudioTab('tables.studio')
      }
      // Studio: Snippets
      else if (matchesKeybinding(e, getKey('studio.snippets') || 'Ctrl + Shift + K')) {
        e.preventDefault()
        handleOpenStudioTab('snippets.studio')
      }
      // Studio: Images
      else if (matchesKeybinding(e, getKey('studio.images') || 'Ctrl + Shift + I')) {
        e.preventDefault()
        handleOpenStudioTab('images.studio')
      }
      // View: Toggle Integrated Terminal (Ctrl + `)
      else if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.code === 'Backquote' || e.key === '~')) {
        e.preventDefault()
        handleToggleBottomPanel('terminal')
      }
      // View: Toggle Bottom Panel Drawer (Ctrl + J)
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault()
        handleToggleBottomPanel()
      }
      // Escape -> Close dialogs / Return from studio tab
      else if (e.key === 'Escape') {
        if (findReplaceOpen) setFindReplaceOpen(false)
        else if (commandPaletteOpen) setCommandPaletteOpen(false)
        else if (isBottomPanelOpen) setIsBottomPanelOpen(false)
        else if (isZenMode) setIsZenMode(false)
        else if (isStudioTabId(activeFile)) {
          handleCloseStudioTab(activeFile)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    keybindings,
    commandPaletteOpen,
    findReplaceOpen,
    isBottomPanelOpen,
    handleToggleBottomPanel,
    isZenMode,
    activeFile,
    handleOpenStudioTab,
    handleOpenSettingsTab,
    handleOpenShortcutsTab,
    handleGenerate,
    handleOpenNativeFile,
    handleOpenNativeFolder,
    handleSaveNativeFile,
    handleDownloadPdf,
    handleCreateFile
  ])

  // Commands for Command Palette
  const commands = useMemo(() => [
    {
      id: 'create-doc',
      title: 'Create Documentation',
      description: 'Create documentation skeleton from configuration',
      icon: 'note_add',
      category: 'Action',
      shortcut: 'Ctrl+Enter',
      action: () => handleGenerate()
    },
    {
      id: 'view-split',
      title: 'View: Split Editor & Preview',
      description: '50/50 Code Editor and GitHub preview',
      icon: 'vertical_split',
      category: 'Layout',
      action: () => setViewMode('split')
    },
    {
      id: 'view-editor',
      title: 'View: Editor Only',
      description: 'Maximize raw code editor space',
      icon: 'code',
      category: 'Layout',
      action: () => setViewMode('editor')
    },
    {
      id: 'view-preview',
      title: 'View: Preview Only',
      description: 'Read-only GitHub formatted documentation view',
      icon: 'visibility',
      category: 'Layout',
      action: () => setViewMode('preview')
    },
    {
      id: 'copy-md',
      title: `Copy ${activeFile} Markdown`,
      description: 'Copy active markdown text to system clipboard',
      icon: 'content_copy',
      category: 'Clipboard',
      shortcut: 'Ctrl+Shift+C',
      action: handleCopy
    },
    {
      id: 'download-file',
      title: `Export: Save Active File (${activeFile})`,
      description: 'Download the current raw markdown buffer',
      icon: 'description',
      category: 'Export',
      action: handleDownloadActiveFile
    },
    {
      id: 'download-suite',
      title: 'Export: Download Documentation Suite (.zip)',
      description: 'Bundle all markdown documents into a zip archive',
      icon: 'folder_zip',
      category: 'Export',
      action: handleDownloadSuite
    },
    {
      id: 'download-html',
      title: 'Export: Standalone HTML Page',
      description: 'Self-contained GitHub-styled HTML file',
      icon: 'html',
      category: 'Export',
      action: handleDownloadHtml
    },
    {
      id: 'download-pdf',
      title: 'Export: PDF Document (.pdf)',
      description: 'High-fidelity GitHub-styled vector PDF document',
      icon: 'picture_as_pdf',
      category: 'Export',
      shortcut: 'Ctrl+P',
      action: handleDownloadPdf
    },
    {
      id: 'toggle-sidebar',
      title: 'Toggle Primary Sidebar Drawer',
      description: 'Expand or collapse the left drawer panel',
      icon: 'view_sidebar',
      category: 'Layout',
      shortcut: 'Ctrl+B',
      action: () => setSidebarCollapsed(prev => !prev)
    },
    {
      id: 'zen-mode',
      title: 'Toggle Zen / Focus Mode',
      description: 'Hide sidebar and chrome for distraction-free writing',
      icon: 'fullscreen',
      category: 'Layout',
      action: () => setIsZenMode(prev => !prev)
    },
    {
      id: 'toggle-split-orientation',
      title: `Toggle Split Layout (${orientation === 'horizontal' ? 'Side-by-Side' : 'Top & Bottom'})`,
      description: 'Switch between side-by-side vertical split and top-and-bottom stacked horizontal split',
      icon: orientation === 'horizontal' ? 'view_column' : 'table_rows',
      category: 'Layout',
      shortcut: 'Alt+Shift+0',
      action: () => setOrientation((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'))
    },
    {
      id: 'open-shortcuts',
      title: 'Open Keyboard Shortcuts Tab',
      description: 'Configure and customize all IDE hotkeys and shortcuts',
      icon: 'keyboard',
      category: 'Preferences',
      shortcut: 'Ctrl+/',
      action: handleOpenShortcutsTab
    },
    {
      id: 'open-settings',
      title: 'Open Settings Tab',
      description: 'Configure editor, appearance, fonts, and export preferences',
      icon: 'settings',
      category: 'Preferences',
      shortcut: 'Ctrl+,',
      action: handleOpenSettingsTab
    },
    {
      id: 'badge-builder',
      title: 'Open Shields.io Badge Studio Tab',
      description: 'Interactive custom badge designer & generator',
      icon: 'shield',
      category: 'Studio',
      shortcut: 'Ctrl+Shift+B',
      action: () => handleOpenStudioTab('badges.studio')
    },
    {
      id: 'diagram-studio',
      title: 'Open Mermaid Architecture Studio Tab',
      description: 'Visually configure architecture diagrams, pipelines, and git graphs',
      icon: 'schema',
      category: 'Studio',
      shortcut: 'Ctrl+Shift+M',
      action: () => handleOpenStudioTab('diagrams.studio')
    },
    {
      id: 'table-studio',
      title: 'Open Visual Markdown Table Studio Tab',
      description: 'Interactive visual table builder with live preview',
      icon: 'table_chart',
      category: 'Studio',
      shortcut: 'Ctrl+Shift+T',
      action: () => handleOpenStudioTab('tables.studio')
    },
    {
      id: 'snippet-studio',
      title: 'Open Code & Callouts Snippets Studio Tab',
      description: 'GitHub alerts, multi-language code blocks, and collapsible sections',
      icon: 'code_blocks',
      category: 'Studio',
      action: () => handleOpenStudioTab('snippets.studio')
    },
    {
      id: 'image-studio',
      title: 'Open Image & Banner Studio Tab',
      description: 'Hero banners, screenshot window frames, and comparison grids',
      icon: 'image',
      category: 'Studio',
      action: () => handleOpenStudioTab('images.studio')
    },
    {
      id: 'tree-studio',
      title: 'Open Directory Tree Studio Tab',
      description: 'Visual ASCII, Unicode, and Emoji folder tree generator',
      icon: 'account_tree',
      category: 'Studio',
      action: () => handleOpenStudioTab('tree.studio')
    },
    {
      id: 'api-studio',
      title: 'Open API & Endpoints Studio Tab',
      description: 'Interactive REST route designer with parameter matrix and cURL',
      icon: 'api',
      category: 'Studio',
      action: () => handleOpenStudioTab('api.studio')
    },
    {
      id: 'audit-studio',
      title: 'Open README Auditor & Linter Tab',
      description: 'Documentation health scorecard, A-F grade, and missing section boilerplate',
      icon: 'verified_user',
      category: 'Studio',
      action: () => handleOpenStudioTab('audit.studio')
    },
    {
      id: 'contributors-studio',
      title: 'Open Contributor & Team Studio Tab',
      description: 'All-Contributors table, avatar matrix, and role badges',
      icon: 'group',
      category: 'Studio',
      action: () => handleOpenStudioTab('contributors.studio')
    },
    {
      id: 'changelog-studio',
      title: 'Open Changelog & Release Notes Tab',
      description: 'Keep-a-Changelog standard release notes with SemVer bumping',
      icon: 'history',
      category: 'Studio',
      action: () => handleOpenStudioTab('changelog.studio')
    },
    {
      id: 'find-replace',
      title: 'Find & Replace in Buffer',
      description: 'Search and replace text in current document',
      icon: 'find_replace',
      category: 'Editor',
      shortcut: 'Ctrl+F',
      action: () => {
        setFindReplaceMode('find')
        setFindReplaceOpen(true)
      }
    },
    {
      id: 'clear-draft',
      title: 'Reset Active Markdown Buffer',
      description: 'Clear the current file content',
      icon: 'delete_sweep',
      category: 'Danger',
      action: handleClear
    },
    {
      id: 'toggle-terminal',
      title: 'Terminal: Toggle Integrated Terminal',
      description: 'Open or close PowerShell/CMD terminal drawer',
      icon: 'terminal',
      category: 'Terminal',
      shortcut: 'Ctrl+`',
      action: () => handleToggleBottomPanel('terminal')
    },
    {
      id: 'toggle-problems',
      title: 'View: Toggle Problems Diagnostics',
      description: 'View markdown syntax errors and warnings',
      icon: 'error_outline',
      category: 'View',
      shortcut: 'Ctrl+J',
      action: () => handleToggleBottomPanel('problems')
    },
    {
      id: 'toggle-output',
      title: 'View: Toggle Output Panel',
      description: 'View IDE daemon and system output logs',
      icon: 'list_alt',
      category: 'View',
      action: () => handleToggleBottomPanel('output')
    },
    {
      id: 'whats-new',
      title: 'Patch Notes',
      description: 'View version patch notes, highlights, and update changelog',
      icon: 'description',
      category: 'Help',
      action: handleOpenWhatsNewTab
    },
    {
      id: 'check-updates',
      title: 'Check for Updates...',
      description: 'Check for latest application updates on GitHub',
      icon: 'system_update',
      category: 'Help',
      action: handleCheckForUpdates
    }
  ], [activeFile, handleCopy, handleDownloadActiveFile, handleDownloadSuite, handleDownloadHtml, handleDownloadPdf, handleToggleBottomPanel, handleCheckForUpdates, handleOpenWhatsNewTab])

  return (
    <div className={`ide-app-root theme-${themeMode} ${isZenMode ? 'zen-mode' : ''}`}>
      {/* Stacked Toast Notification Viewport & Notification Center */}
      <ToastContainer />
      <NotificationHistoryPanel />

      {/* Top Application Bar (Hidden in Zen Mode) */}
      {!isZenMode && (
        <TopMenuBar
          activeFile={activeFile}
          repoUrl={repoUrl}
          workspaceName={workspaceDirectory?.name}
          recentWorkspaces={recentWorkspaces}
          onOpenRecentWorkspace={handleOpenRecentWorkspace}
          onClearRecentWorkspaces={handleClearRecentWorkspaces}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onGenerate={() => handleGenerate()}
          onCopy={handleCopy}
          onDownload={handleDownloadActiveFile}
          onDownloadSuite={handleDownloadSuite}
          onDownloadHtml={handleDownloadHtml}
          onDownloadPdf={handleDownloadPdf}
          onOpenFile={handleOpenNativeFile}
          onOpenFolder={handleOpenNativeFolder}
          onSaveFile={handleSaveNativeFile}
          localFilePath={localFilePath}
          workspaceDirectory={workspaceDirectory}
          isDocPack={Object.keys(additionalFiles).length > 0}
          loading={loading}
          hasGenerated={hasGenerated}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
          onOpenSettings={handleOpenSettingsTab}
          onOpenShortcuts={handleOpenShortcutsTab}
          onNewFile={handleCreateUntitledFile}
          onToggleZen={() => setIsZenMode(prev => !prev)}
          isZenMode={isZenMode}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onFind={() => { setFindReplaceOpen(true); setFindReplaceMode('find') }}
          onReplace={() => { setFindReplaceOpen(true); setFindReplaceMode('replace') }}
          onToggleBottomPanel={handleToggleBottomPanel}
          editorEngine={editorEngine}
          setEditorEngine={setEditorEngine}
          onOpenWhatsNew={handleOpenWhatsNewTab}
          onCheckForUpdates={handleCheckForUpdates}
          onCloseTab={handleCloseFile}
          appVersion={appVersion}
        />
      )}

          {/* Main Workspace Frame */}
          <div className="ide-workspace-frame">
            {/* Left Activity Rail (Hidden in Zen Mode) */}
            {!isZenMode && (
              <ActivityBar
                activeTab={activeActivityTab}
                onTabChange={(tab) => {
                  setActiveActivityTab(tab)
                  setSidebarCollapsed(false)
                }}
                sidebarCollapsed={sidebarCollapsed}
                onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
                onOpenShortcuts={handleOpenShortcutsTab}
                onOpenSettings={handleOpenSettingsTab}
              />
            )}

            {/* Primary Collapsible Drawer (Hidden in Zen Mode) */}
            {!isZenMode && (
              <SidebarDrawer
                activeTab={activeActivityTab}
                collapsed={sidebarCollapsed}
                files={allFiles}
                openDocTabs={openDocTabs}
                activeFile={activeFile}
                workspaceDirectory={workspaceDirectory}
                onOpenFolder={handleOpenNativeFolder}
                onSelectFile={handleSelectFile}
                onCreateFile={handleCreateFile}
                onDeleteFile={handleDeleteFile}
                showToast={showToast}
                markdown={currentContent}
                onScrollToHeading={(headingText) => setScrollToHeadingTarget(headingText)}
                onLoadTemplate={handleLoadTemplate}
                openStudioTabs={openStudioTabs}
                onOpenStudioTab={handleOpenStudioTab}
                onCloseStudioTab={handleCloseStudioTab}
                onInsertInstantSyntax={(syntax) => {
                  if (activeFile && !isStudioTabId(activeFile)) {
                    const editorArea = document.querySelector('.editor-scroll-area')
                    const previewArea = document.querySelector('.preview-pane')
                    const savedScrollTop = editorArea ? editorArea.scrollTop : 0
                    const savedPreviewTop = previewArea ? previewArea.scrollTop : 0

                    const updated = currentContent + (currentContent.endsWith('\n\n') ? '' : '\n\n') + syntax + '\n'
                    handleContentChange(updated)
                    showToast(`Inserted template into ${activeFile}`, 'success')

                    // Maintain current scroll position without jumping down across multiple frames
                    const restoreScroll = () => {
                      const ed = document.querySelector('.editor-scroll-area')
                      const pr = document.querySelector('.preview-pane')
                      const gt = document.querySelector('.editor-gutter')
                      if (ed) ed.scrollTop = savedScrollTop
                      if (pr) pr.scrollTop = savedPreviewTop
                      if (gt) gt.scrollTop = savedScrollTop
                    }
                    restoreScroll()
                    window.requestAnimationFrame(restoreScroll)
                    setTimeout(restoreScroll, 50)
                    setTimeout(restoreScroll, 150)
                    setTimeout(restoreScroll, 300)
                  } else {
                    showToast('Switch to a document tab (e.g. README.md) to insert template', 'info')
                  }
                }}
                onGenerate={handleGenerate}
                loading={loading}
                generateSuite={generateSuite}
                setGenerateSuite={setGenerateSuite}
                theme={theme}
                setTheme={setTheme}
                sectionOrder={sectionOrder}
                setSectionOrder={setSectionOrder}
                repoUrl={repoUrl}
                setRepoUrl={setRepoUrl}
                description={description}
                setDescription={setDescription}
                selectedTechs={selectedTechs}
                setSelectedTechs={setSelectedTechs}
                error={error}
                onLoadPreset={handleLoadPresetAsNewFile}
                openPresetTabs={openPresetTabs}
                onTogglePresetPreview={handleTogglePresetPreview}
                onClosePresetTab={handleClosePresetTab}
                previewPreset={activePreset}
                onClosePresetPreview={handleExitAllPresetPreviews}
                onNavigateToTemplates={() => {
                  setActiveActivityTab('templates')
                  setSidebarCollapsed(false)
                }}
              />
            )}

            {/* Central Editor Canvas */}
            <main className="ide-main-editor-area">
              {/* Loading Overlay */}
              {loading && (
                <div className="ide-loading-overlay">
                  <div className="ide-loading-card">
                    <span className="material-symbols-outlined loading-sparkle-spin">sync</span>
                    <h3>Creating Documentation...</h3>
                    <p>Building documentation skeleton and formatting files.</p>
                    <div className="loading-bar-track">
                      <div className="loading-bar-fill"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Tab Bar */}
              <TabBar
                files={allFiles}
                openDocTabs={openDocTabs}
                onReorderDocTabs={handleReorderDocTabs}
                activeFile={activeFile}
                dirtyFiles={dirtyFiles}
                onSelectFile={handleSelectFile}
                onCloseFile={handleCloseFile}
                onCreateFile={handleCreateFile}
                onNewUntitledFile={handleCreateUntitledFile}
                onDropExternalFile={handleDropExternalFile}
                openStudioTabs={openStudioTabs}
                onOpenStudioTab={handleOpenStudioTab}
                onCloseStudioTab={handleCloseStudioTab}
                onOpenToolsDrawer={() => {
                  setActiveActivityTab('tools')
                  setSidebarCollapsed(false)
                }}
                viewMode={viewMode}
                setViewMode={setViewMode}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
                isZenMode={isZenMode}
                setIsZenMode={setIsZenMode}
                orientation={orientation}
                setOrientation={setOrientation}
                openPresetTabs={openPresetTabs}
                onClosePresetTab={handleClosePresetTab}
              />

              {/* Central Workspace: Dedicated Studio Tabs or Markdown Preview */}
              <div className="ide-editor-container">
                {activePreset ? (
                  <Preview
                    markdown={activePreset.content}
                    onMarkdownChange={() => {}}
                    activeFile={activeFile}
                    viewMode="preview"
                    orientation={orientation}
                    zoomLevel={zoomLevel}
                    fontSize={fontSize}
                    wordWrap={wordWrap}
                    showLineNumbers={showLineNumbers}
                    syncScroll={syncScroll}
                    onCursorChange={() => {}}
                    scrollToHeadingTarget={scrollToHeadingTarget}
                    findReplaceOpen={false}
                    setFindReplaceOpen={() => {}}
                    previewPreset={activePreset}
                    onExitPresetPreview={handleExitAllPresetPreviews}
                    onConfirmLoadPreset={() => handleLoadPresetAsNewFile(activePreset)}
                    editorEngine={editorEngine}
                    themeMode={themeMode}
                    tabSize={tabSize}
                  />
                ) : activeFile === 'badges.studio' ? (
                  <Suspense fallback={<StudioLoadingFallback title="Shields.io Badges" />}>
                    <BadgeStudioTab
                      repoUrl={repoUrl}
                      onInsertBadge={(badgeMd) => handleRequestInsertSnippet(badgeMd, 'Badge')}
                      onBackToReadme={handleBackToReadme}
                    />
                  </Suspense>
                ) : activeFile === 'diagrams.studio' ? (
                  <Suspense fallback={<StudioLoadingFallback title="Mermaid Diagrams" />}>
                    <DiagramStudioTab
                      onInsertDiagram={(diagramMd) => handleRequestInsertSnippet(diagramMd, 'Diagram')}
                      onBackToReadme={handleBackToReadme}
                    />
                  </Suspense>
                ) : activeFile === 'tables.studio' ? (
                  <Suspense fallback={<StudioLoadingFallback title="Table Designer" />}>
                    <TableStudioTab
                      onInsertTable={(tableMd) => handleRequestInsertSnippet(tableMd, 'Table')}
                      onBackToReadme={handleBackToReadme}
                    />
                  </Suspense>
                ) : activeFile === 'snippets.studio' ? (
                  <Suspense fallback={<StudioLoadingFallback title="Code & Callout Snippets" />}>
                    <SnippetStudioTab
                      onInsertSnippet={(snippetMd) => handleRequestInsertSnippet(snippetMd, 'Snippet')}
                      onBackToReadme={handleBackToReadme}
                    />
                  </Suspense>
                ) : activeFile === 'images.studio' ? (
                  <Suspense fallback={<StudioLoadingFallback title="Image & Banner Studio" />}>
                    <ImageStudioTab
                      repoUrl={repoUrl}
                      onInsertImage={(imageMd) => handleRequestInsertSnippet(imageMd, 'Image')}
                      onBackToReadme={handleBackToReadme}
                    />
                  </Suspense>
                ) : activeFile === 'tree.studio' ? (
                  <Suspense fallback={<StudioLoadingFallback title="Directory Tree Studio" />}>
                    <DirectoryTreeStudioTab
                      workspaceDirectory={workspaceDirectory}
                      allFiles={allFiles}
                      onInsertTree={(treeMd) => handleRequestInsertSnippet(treeMd, 'Directory Tree')}
                      onBackToReadme={handleBackToReadme}
                    />
                  </Suspense>
                ) : activeFile === 'api.studio' ? (
                  <Suspense fallback={<StudioLoadingFallback title="API & Endpoints Studio" />}>
                    <ApiStudioTab
                      onInsertApi={(apiMd) => handleRequestInsertSnippet(apiMd, 'API Endpoint')}
                      onBackToReadme={handleBackToReadme}
                    />
                  </Suspense>
                ) : activeFile === 'audit.studio' ? (
                  <Suspense fallback={<StudioLoadingFallback title="Documentation Auditor" />}>
                    <AuditStudioTab
                      allFiles={allFiles}
                      openDocTabs={openDocTabs}
                      initialFile={lastActiveDocRef.current || 'README.md'}
                      onInsertSection={(secMd, targetFile) => {
                        const file = targetFile || lastActiveDocRef.current || 'README.md'
                        handleExecuteInsertSnippet(file, secMd, 'Documentation Section')
                      }}
                      onBackToReadme={(targetFile) => handleBackToReadme(targetFile || lastActiveDocRef.current || 'README.md')}
                    />
                  </Suspense>
                ) : activeFile === 'contributors.studio' ? (
                  <Suspense fallback={<StudioLoadingFallback title="Contributors Studio" />}>
                    <ContributorStudioTab
                      onInsertContributors={(contribMd) => handleRequestInsertSnippet(contribMd, 'Contributors')}
                      onBackToReadme={handleBackToReadme}
                    />
                  </Suspense>
                ) : activeFile === 'changelog.studio' ? (
                  <Suspense fallback={<StudioLoadingFallback title="Changelog Studio" />}>
                    <ChangelogStudioTab
                      gitInfo={gitInfo}
                      onInsertChangelog={(clMd) => handleRequestInsertSnippet(clMd, 'Changelog')}
                      onBackToReadme={handleBackToReadme}
                    />
                  </Suspense>
                ) : activeFile === 'settings' ? (
                  <Suspense fallback={<StudioLoadingFallback title="Settings" />}>
                    <SettingsTab
                      themeMode={themeMode}
                      setThemeMode={setThemeMode}
                      tabSize={tabSize}
                      setTabSize={setTabSize}
                      fontSize={fontSize}
                      setFontSize={setFontSize}
                      wordWrap={wordWrap}
                      setWordWrap={setWordWrap}
                      showLineNumbers={showLineNumbers}
                      setShowLineNumbers={setShowLineNumbers}
                      zoomLevel={zoomLevel}
                      setZoomLevel={setZoomLevel}
                      orientation={orientation}
                      setOrientation={setOrientation}
                      syncScroll={syncScroll}
                      setSyncScroll={handleSetSyncScroll}
                      githubToken={githubToken}
                      setGithubToken={setGithubToken}
                      editorEngine={editorEngine}
                      setEditorEngine={setEditorEngine}
                      onClose={() => handleCloseStudioTab('settings')}
                      onOpenShortcuts={handleOpenShortcutsTab}
                    />
                  </Suspense>
                ) : activeFile === 'shortcuts' ? (
                  <Suspense fallback={<StudioLoadingFallback title="Shortcuts" />}>
                    <ShortcutsTab
                      keybindings={keybindings}
                      onUpdateKeybinding={handleUpdateKeybinding}
                      onResetKeybindings={handleResetKeybindings}
                      onClose={() => handleCloseStudioTab('shortcuts')}
                    />
                  </Suspense>
                ) : (activeFile === 'whats-new' || activeFile === 'release-notes') ? (
                  <Suspense fallback={<StudioLoadingFallback title="Release Notes" />}>
                    <WhatsNewTab
                      updateDownloaded={updateDownloaded}
                      updateProgress={updateProgress}
                      updateError={updateError}
                      onRestartToUpdate={handleRestartToUpdate}
                      onClose={() => handleCloseStudioTab(activeFile)}
                      onOpenSettings={handleOpenSettingsTab}
                      onOpenShortcuts={handleOpenShortcutsTab}
                      onCheckForUpdates={handleCheckForUpdates}
                    />
                  </Suspense>
                ) : !activeFile && !activePreset ? (
                  <div className="workspace-empty-state">
                    <div className="empty-state-card">
                      <div className="empty-state-icon-box">
                        <span className="material-symbols-outlined empty-icon-symbol">draft</span>
                        <span className="empty-icon-glow"></span>
                      </div>
                      <h3 className="empty-state-title">No Document Currently Open</h3>
                      <p className="empty-state-desc">
                        All document tabs are closed. Open a file from the <strong>Explorer</strong> on the left, or choose an action below to get started.
                      </p>
                      <div className="empty-state-actions">
                        <button
                          type="button"
                          className="btn-empty-action btn-empty-primary"
                          onClick={() => {
                            const firstFile = Object.keys(filePathsMap)[0] || 'README.md'
                            handleSelectFile(firstFile)
                          }}
                          title="Open or focus primary document"
                        >
                          <span className="material-symbols-outlined">description</span>
                          <span>Open Document</span>
                        </button>
                        <button
                          type="button"
                          className="btn-empty-action btn-empty-secondary"
                          onClick={handleCreateUntitledFile}
                          title="Create a new untitled buffer (Notepad / VS Code style)"
                        >
                          <span className="material-symbols-outlined">add</span>
                          <span>New Document</span>
                        </button>
                        <button
                          type="button"
                          className="btn-empty-action btn-empty-secondary"
                          onClick={handleOpenNativeFolder}
                          title="Open a different workspace folder on your computer"
                        >
                          <span className="material-symbols-outlined">folder_open</span>
                          <span>Open Folder...</span>
                        </button>
                        <button
                          type="button"
                          className="btn-empty-action btn-empty-secondary"
                          onClick={() => {
                            setActiveActivityTab('generator')
                            setSidebarCollapsed(false)
                          }}
                          title="Open Documentation Configuration"
                        >
                          <span className="material-symbols-outlined">tune</span>
                          <span>Doc Config</span>
                        </button>
                      </div>
                      <div className="empty-state-footer-hints">
                        <div className="empty-hint-chip">
                          <kbd>Ctrl</kbd> + <kbd>K</kbd>
                          <span>Command Palette</span>
                        </div>
                        <div className="empty-hint-chip">
                          <kbd>Ctrl</kbd> + <kbd>O</kbd>
                          <span>Open File</span>
                        </div>
                        <div className="empty-hint-chip">
                          <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>E</kbd>
                          <span>Toggle Explorer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : unsupportedFilesMap[activeFile] ? (
                  <UnsupportedFileViewer
                    fileInfo={unsupportedFilesMap[activeFile]}
                    onCloseTab={() => handleCloseFile(activeFile)}
                  />
                ) : (
                  <Preview
                    markdown={currentContent}
                    onMarkdownChange={handleContentChange}
                    activeFile={activeFile || 'README.md'}
                    workspaceDirectory={workspaceDirectory}
                    onDropExternalFile={handleDropExternalFile}
                    showToast={showToast}
                    viewMode={viewMode}
                    orientation={orientation}
                    zoomLevel={zoomLevel}
                    fontSize={fontSize}
                    wordWrap={wordWrap}
                    showLineNumbers={showLineNumbers}
                    syncScroll={syncScroll}
                    onCursorChange={(pos) => {
                      setCursorPosition(pos)
                      if (activeFile && !isStudioTabId(activeFile)) {
                        fileCursorPositions.current[activeFile] = pos
                      }
                    }}
                    scrollToHeadingTarget={scrollToHeadingTarget}
                    onOpenBadgeBuilder={() => handleOpenStudioTab('badges.studio')}
                    onOpenDiagramStudio={() => handleOpenStudioTab('diagrams.studio')}
                    onOpenTableStudio={() => handleOpenStudioTab('tables.studio')}
                    onOpenSnippetStudio={() => handleOpenStudioTab('snippets.studio')}
                    onOpenImageStudio={() => handleOpenStudioTab('images.studio')}
                    findReplaceOpen={findReplaceOpen}
                    setFindReplaceOpen={setFindReplaceOpen}
                    findReplaceMode={findReplaceMode}
                    editorEngine={editorEngine}
                    themeMode={themeMode}
                    tabSize={tabSize}
                  />
                )}
              </div>

              {/* Integrated Bottom Panel Drawer (VS Code / Antigravity IDE) */}
              <BottomPanelDrawer
                isOpen={isBottomPanelOpen}
                onClose={() => setIsBottomPanelOpen(false)}
                activeTab={activeBottomTab}
                setActiveTab={setActiveBottomTab}
                workspaceDirectory={workspaceDirectory}
                activeFile={activeFile || 'README.md'}
                problems={problems}
                onSelectProblem={handleSelectProblem}
                systemLogs={systemLogs}
                onClearLogs={() => setSystemLogs([])}
              />
            </main>
          </div>

          {/* Bottom Status Bar (Always present) */}
          <StatusBar
            cursorPosition={cursorPosition}
            charCount={currentContent.length}
            wordCount={currentContent.trim() ? currentContent.trim().split(/\s+/).length : 0}
            loading={loading}
            error={error}
            errorCount={errorCount}
            warningCount={warningCount}
            isDirty={!!dirtyFiles[activeFile]}
            gitInfo={gitInfo}
            onOpenGitTab={() => {
              setActiveActivityTab('source-control')
              setSidebarCollapsed(false)
            }}
            isBottomPanelOpen={isBottomPanelOpen}
            onToggleBottomPanel={handleToggleBottomPanel}
            currentVersion={appVersion}
            updateDownloaded={updateDownloaded}
            updateProgress={updateProgress}
            updateError={updateError}
            onOpenWhatsNew={handleOpenWhatsNewTab}
            onRestartToUpdate={handleRestartToUpdate}
          />

          {/* Global IDE Tooltip System (Antigravity IDE / VS Code Style) */}
          <IdeTooltip />

          {/* Command Palette Modal */}
          {commandPaletteOpen && (
            <Suspense fallback={null}>
              <CommandPalette
                isOpen={commandPaletteOpen}
                onClose={() => setCommandPaletteOpen(false)}
                commands={commands}
              />
            </Suspense>
          )}

          {/* Dynamic Snippet Insertion Target Selection Modal */}
          {insertModalState.isOpen && (
            <Suspense fallback={null}>
              <InsertTargetModal
                isOpen={insertModalState.isOpen}
                onClose={() => setInsertModalState({ isOpen: false, snippet: '', snippetType: '' })}
                snippet={insertModalState.snippet}
                snippetType={insertModalState.snippetType}
                openDocTabs={openDocTabs}
                lastActiveDoc={lastActiveDocRef.current}
                fileCursorPositions={fileCursorPositions.current}
                onConfirm={(targetFile) => handleExecuteInsertSnippet(targetFile, insertModalState.snippet, insertModalState.snippetType)}
                onCreateNewDoc={() => handleInsertIntoNewDoc(insertModalState.snippet, insertModalState.snippetType)}
              />
            </Suspense>
          )}
        </div>
  )
}

export default App
