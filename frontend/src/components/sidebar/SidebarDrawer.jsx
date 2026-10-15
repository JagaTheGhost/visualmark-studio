import React, { useState, useMemo } from 'react'
import GeneratorPanel from './GeneratorPanel'
import IdeExplorerTree from '../explorer/IdeExplorerTree'
import SourceControlDrawer from '../sourcecontrol/SourceControlDrawer'
import OutlinePanel from './OutlinePanel'
import TemplatesPanel from './TemplatesPanel'
import StudioToolsPanel from './StudioToolsPanel'
import { PRESET_TEMPLATES } from '../../data/presetTemplates'
import { parseMarkdownOutline } from '../../utils/markdownOutline'

export default function SidebarDrawer({
  activeTab,
  collapsed,
  files,
  workspaceDirectory = null,
  onOpenFolder = () => {},
  onCloneRepo = () => {},
  onCloseWorkspace = () => {},
  openDocTabs = [],
  activeFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  showToast = () => {},
  markdown,
  onScrollToHeading,
  onLoadTemplate,
  onLoadPreset,
  openPresetTabs = [],
  onTogglePresetPreview = () => {},
  onClosePresetTab = () => {},
  openStudioTabs = [],
  onOpenStudioTab = () => {},
  onCloseStudioTab = () => {},
  onInsertInstantSyntax = () => {},
  // Git / Source Control props
  gitInfo = null,
  onRefreshGit = () => {},
  isRefreshingGit = false,
  onOpenWorkspaceDirectory = () => {},
  // Props for Input (Documentation Config)
  onGenerate,
  loading,
  generateSuite,
  setGenerateSuite,
  theme,
  setTheme,
  sectionOrder,
  setSectionOrder,
  repoUrl,
  setRepoUrl,
  description,
  setDescription,
  selectedTechs,
  setSelectedTechs,
  error,
  // Template Preview & Navigation props
  previewPreset = null,
  onPreviewTemplate = () => {},
  onClosePresetPreview = () => {},
  onNavigateToTemplates = () => {}
}) {
  const currentPreviewPreset = useMemo(() => {
    if (previewPreset) return previewPreset
    if (activeFile && typeof activeFile === 'string' && activeFile.startsWith('preset:')) {
      const pId = activeFile.replace('preset:', '')
      return PRESET_TEMPLATES.find((p) => p.id === pId) || null
    }
    return null
  }, [previewPreset, activeFile])

  // Resizable sidebar drawer width state
  const [drawerWidth, setDrawerWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('ide_sidebar_width')
      return saved ? parseInt(saved, 10) : 300
    } catch {
      return 300
    }
  })
  const [isResizing, setIsResizing] = useState(false)

  const handleStartResize = (e) => {
    e.preventDefault()
    setIsResizing(true)
    const startX = e.clientX
    const startWidth = drawerWidth

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX
      const nextWidth = Math.max(220, Math.min(650, startWidth + delta))
      setDrawerWidth(nextWidth)
      try {
        localStorage.setItem('ide_sidebar_width', String(nextWidth))
      } catch {}
    }

    const onMouseUp = () => {
      setIsResizing(false)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const handleResetResize = () => {
    setDrawerWidth(300)
    try {
      localStorage.setItem('ide_sidebar_width', '300')
    } catch {}
  }

  // Parse document outline from active markdown
  const outline = useMemo(() => {
    return parseMarkdownOutline(markdown)
  }, [markdown])

  if (collapsed) {
    return null
  }

  return (
    <aside
      className={`sidebar-drawer ide-sidebar-drawer ${isResizing ? 'resizing' : ''}`}
      style={{ width: `${drawerWidth}px` }}
    >
      {/* Header with Title (Hidden when activeTab === 'explorer' or 'git' because they render their own custom headers) */}
      {activeTab !== 'explorer' && activeTab !== 'git' && activeTab !== 'source-control' && (
        <div className="drawer-header">
          <div className="drawer-title-group">
            <span className="material-symbols-outlined drawer-title-icon">
              {activeTab === 'generator' && 'tune'}
              {activeTab === 'outline' && 'toc'}
              {activeTab === 'templates' && 'bookmark_border'}
              {activeTab === 'tools' && 'widgets'}
            </span>
            <span className="drawer-title">
              {activeTab === 'generator' && 'Documentation Config'}
              {activeTab === 'outline' && 'Document Outline'}
              {activeTab === 'templates' && 'Templates & Presets'}
              {activeTab === 'tools' && 'Studio Tools & Builders'}
            </span>
          </div>
        </div>
      )}

      {/* Main Drawer Body Scrollable Container */}
      <div className={`drawer-body custom-scrollbar ${activeTab === 'explorer' || activeTab === 'git' || activeTab === 'source-control' ? 'no-padding' : ''}`}>
        {/* ==================== 1. EXPLORER TREE ==================== */}
        {activeTab === 'explorer' && (
          <IdeExplorerTree
            files={files}
            openDocTabs={openDocTabs}
            activeFile={activeFile}
            workspaceDirectory={workspaceDirectory}
            onOpenFolder={onOpenFolder}
            onCloneRepo={onCloneRepo}
            onCloseWorkspace={onCloseWorkspace}
            onSelectFile={onSelectFile}
            onCreateFile={onCreateFile}
            onDeleteFile={onDeleteFile}
            showToast={showToast}
          />
        )}

        {/* ==================== 1B. GIT SOURCE CONTROL ==================== */}
        {(activeTab === 'git' || activeTab === 'source-control') && (
          <SourceControlDrawer
            workspaceDirectory={workspaceDirectory}
            gitInfo={gitInfo}
            onRefreshGit={onRefreshGit}
            isRefreshingGit={isRefreshingGit}
            onOpenFolder={onOpenFolder}
            onCloneRepo={onCloneRepo}
            onSelectFile={onSelectFile}
            showToast={showToast}
          />
        )}

        {/* ==================== 2. GENERATOR CONFIG PANEL ==================== */}
        {activeTab === 'generator' && (
          <div className="generator-panel">
            <GeneratorPanel
              onGenerate={onGenerate}
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
              activeFile={activeFile}
              onNavigateToTemplates={onNavigateToTemplates}
            />
          </div>
        )}

        {/* ==================== 3. OUTLINE PANEL ==================== */}
        {activeTab === 'outline' && (
          <OutlinePanel
            outline={outline}
            activeFile={activeFile}
            onScrollToHeading={onScrollToHeading}
          />
        )}

        {/* ==================== 4. TEMPLATES PANEL ==================== */}
        {activeTab === 'templates' && (
          <TemplatesPanel
            openPresetTabs={openPresetTabs}
            currentPreviewPreset={currentPreviewPreset}
            activeFile={activeFile}
            onClosePresetPreview={onClosePresetPreview}
            onClosePresetTab={onClosePresetTab}
            onPreviewTemplate={onPreviewTemplate}
            onTogglePresetPreview={onTogglePresetPreview}
            onLoadPreset={onLoadPreset}
            onLoadTemplate={onLoadTemplate}
          />
        )}

        {/* ==================== 5. STUDIO TOOLS & BUILDERS PANEL ==================== */}
        {activeTab === 'tools' && (
          <StudioToolsPanel
            openStudioTabs={openStudioTabs}
            activeFile={activeFile}
            onSelectFile={onSelectFile}
            onOpenStudioTab={onOpenStudioTab}
            onCloseStudioTab={onCloseStudioTab}
          />
        )}
      </div>

      {/* Drag handle to resize sidebar drawer width */}
      <div
        className={`sidebar-resize-handle ${isResizing ? 'is-active' : ''}`}
        onMouseDown={handleStartResize}
        onDoubleClick={handleResetResize}
        title="Drag horizontally to resize panel width, double-click to reset"
      >
        <div className="resize-indicator-bar" />
      </div>
    </aside>
  )
}
