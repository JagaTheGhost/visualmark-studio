import { Suspense, lazy, useMemo } from 'react'
import Preview from '../preview/Preview'
import WelcomeLauncher from '../WelcomeLauncher'
import UnsupportedFileViewer from '../UnsupportedFileViewer'

// Code-split heavy studio tooling and modal workspaces to shrink main bundle
const BadgeStudioTab = lazy(() => import('../studio/badge/BadgeStudioTab'))
const RepoCardStudioTab = lazy(() => import('../studio/RepoCardStudioTab'))
const DiagramStudioTab = lazy(() => import('../studio/DiagramStudioTab'))
const TableStudioTab = lazy(() => import('../studio/TableStudioTab'))
const SnippetStudioTab = lazy(() => import('../studio/SnippetStudioTab'))
const ImageStudioTab = lazy(() => import('../studio/image/ImageStudioTab'))
const DirectoryTreeStudioTab = lazy(() => import('../studio/DirectoryTreeStudioTab'))
const ApiStudioTab = lazy(() => import('../studio/ApiStudioTab'))
const AuditStudioTab = lazy(() => import('../studio/AuditStudioTab'))
const ContributorStudioTab = lazy(() => import('../studio/ContributorStudioTab'))
const ChangelogStudioTab = lazy(() => import('../studio/ChangelogStudioTab'))
const IconEmojiStudioTab = lazy(() => import('../studio/IconEmojiStudioTab'))
const SettingsTab = lazy(() => import('../settings/SettingsTab'))
const ShortcutsTab = lazy(() => import('../ShortcutsTab'))
const WhatsNewTab = lazy(() => import('../WhatsNewTab'))

export function StudioLoadingFallback({ title = 'Studio Tool' }) {
  return (
    <div className="studio-tab-loading">
      <div className="studio-loading-spinner" />
      <div className="studio-loading-text">Loading {title}...</div>
    </div>
  )
}

export const isStudioTabId = (id) => {
  return (
    typeof id === 'string' &&
    (id.endsWith('.studio') || id === 'settings' || id === 'shortcuts' || id === 'whats-new' || id === 'release-notes' || id === 'welcome')
  )
}

/**
 * StudioWorkspaceRenderer - renders the active workspace view:
 * preset preview, studio tab, welcome launcher, unsupported file viewer, or markdown editor/preview.
 * 
 * Performance & State Retention Architecture:
 * - Employs Keep-Alive containerization: Open studios and active document editors remain mounted
 *   in the DOM with CSS visibility toggling (`display: none` / `flex`).
 * - Switching between Doc tabs, Studio tabs, and Settings preserves all in-progress drafts,
 *   canvas nodes, scroll offsets, and undo/redo histories with 0ms unmount lag.
 * - Explicitly closing a tab frees its component instance and memory.
 */
export default function StudioWorkspaceRenderer({
  activeFile,
  openStudioTabs = [],
  activePreset,
  orientation,
  zoomLevel,
  fontSize,
  wordWrap,
  showLineNumbers,
  syncScroll,
  scrollToHeadingTarget,
  editorEngine,
  themeMode,
  tabSize,
  handleExitAllPresetPreviews,
  handleLoadPresetAsNewFile,
  repoUrl,
  handleRequestInsertSnippet,
  handleBackToReadme,
  workspaceDirectory,
  allFiles,
  openDocTabs,
  lastActiveDocRef,
  handleExecuteInsertSnippet,
  gitInfo,
  setThemeMode,
  setTabSize,
  setFontSize,
  setWordWrap,
  setShowLineNumbers,
  setZoomLevel,
  setOrientation,
  handleSetSyncScroll,
  githubToken,
  setGithubToken,
  setEditorEngine,
  autoDownloadUpdates,
  handleToggleAutoDownloadUpdates,
  handleCheckForUpdates,
  isCheckingUpdate,
  appVersion,
  handleOpenWhatsNewTab,
  handleCloseStudioTab,
  handleOpenShortcutsTab,
  updateProgress,
  updateDownloaded,
  updateError,
  pendingUpdateInfo,
  handleStartDownloadUpdate,
  handleRestartToUpdate,
  keybindings,
  handleUpdateKeybinding,
  handleResetKeybindings,
  shortcutsInitialQuery,
  shortcutsAutoEditId,
  handleOpenSettingsTab,
  setIsCloneModalOpen,
  handleOpenNativeFolder,
  handleCreateUntitledFile,
  handleOpenNativeFile,
  setActiveActivityTab,
  setSidebarCollapsed,
  recentWorkspaces,
  handleOpenRecentWorkspace,
  handleClearRecentWorkspaces,
  unsupportedFilesMap,
  handleCloseFile,
  currentContent,
  handleContentChange,
  handleDropExternalFile,
  showToast,
  viewMode,
  setCursorPosition,
  fileCursorPositions,
  handleOpenStudioTab,
  findReplaceOpen,
  setFindReplaceOpen,
  findReplaceMode,
  setFindReplaceMode = () => {},
  tabGroupingEnabled = true,
  setTabGroupingEnabled = () => {},
  handleOpenSampleDoc = () => {},
  setViewMode = () => {},
  showWelcomeOnStartup = true,
  handleToggleShowWelcomeOnStartup = () => {},
  handleOpenQuickSetup = () => {}
}) {
  // Collect all unique studio tabs that are open or actively viewed
  const activeStudiosToRender = useMemo(() => {
    const list = Array.isArray(openStudioTabs) ? [...openStudioTabs] : []
    if (isStudioTabId(activeFile) && !list.includes(activeFile)) {
      list.push(activeFile)
    }
    return list
  }, [openStudioTabs, activeFile])

  // Determine active states for workspace partitions
  const isDocActive = !isStudioTabId(activeFile) && Boolean(activeFile) && !activePreset && !unsupportedFilesMap?.[activeFile]
  const shouldMountDoc = isDocActive || (Array.isArray(openDocTabs) && openDocTabs.length > 0 && !activePreset)
  const isUnsupportedActive = Boolean(activeFile && unsupportedFilesMap?.[activeFile] && !activePreset)
  const isWelcomeActive = !activeFile && !activePreset && (!openDocTabs || openDocTabs.length === 0) && activeStudiosToRender.length === 0

  const renderStudio = (tabId) => {
    switch (tabId) {
      case 'badges.studio':
        return (
          <Suspense fallback={<StudioLoadingFallback title="Shields.io Badges" />}>
            <BadgeStudioTab
              repoUrl={repoUrl}
              onInsertBadge={(badgeMd) => handleRequestInsertSnippet(badgeMd, 'Badge')}
              onBackToReadme={handleBackToReadme}
            />
          </Suspense>
        )
      case 'repocard.studio':
        return (
          <Suspense fallback={<StudioLoadingFallback title="GitHub Repo Card Studio" />}>
            <RepoCardStudioTab
              repoUrl={repoUrl}
              onInsertCard={(cardMd) => handleRequestInsertSnippet(cardMd, 'GitHub Repo Card')}
              onBackToReadme={handleBackToReadme}
            />
          </Suspense>
        )
      case 'diagrams.studio':
        return (
          <Suspense fallback={<StudioLoadingFallback title="Mermaid Diagrams" />}>
            <DiagramStudioTab
              onInsertDiagram={(diagramMd) => handleRequestInsertSnippet(diagramMd, 'Diagram')}
              onBackToReadme={handleBackToReadme}
            />
          </Suspense>
        )
      case 'tables.studio':
        return (
          <Suspense fallback={<StudioLoadingFallback title="Table Designer" />}>
            <TableStudioTab
              onInsertTable={(tableMd) => handleRequestInsertSnippet(tableMd, 'Table')}
              onBackToReadme={handleBackToReadme}
            />
          </Suspense>
        )
      case 'snippets.studio':
        return (
          <Suspense fallback={<StudioLoadingFallback title="Code & Callout Snippets" />}>
            <SnippetStudioTab
              onInsertSnippet={(snippetMd) => handleRequestInsertSnippet(snippetMd, 'Snippet')}
              onBackToReadme={handleBackToReadme}
            />
          </Suspense>
        )
      case 'images.studio':
        return (
          <Suspense fallback={<StudioLoadingFallback title="Image & Banner Studio" />}>
            <ImageStudioTab
              repoUrl={repoUrl}
              onInsertImage={(imageMd) => handleRequestInsertSnippet(imageMd, 'Image')}
              onBackToReadme={handleBackToReadme}
            />
          </Suspense>
        )
      case 'tree.studio':
        return (
          <Suspense fallback={<StudioLoadingFallback title="Directory Tree Studio" />}>
            <DirectoryTreeStudioTab
              workspaceDirectory={workspaceDirectory}
              allFiles={allFiles}
              onInsertTree={(treeMd) => handleRequestInsertSnippet(treeMd, 'Directory Tree')}
              onBackToReadme={handleBackToReadme}
            />
          </Suspense>
        )
      case 'api.studio':
        return (
          <Suspense fallback={<StudioLoadingFallback title="API & Endpoints Studio" />}>
            <ApiStudioTab
              onInsertApi={(apiMd) => handleRequestInsertSnippet(apiMd, 'API Endpoint')}
              onBackToReadme={handleBackToReadme}
            />
          </Suspense>
        )
      case 'audit.studio':
        return (
          <Suspense fallback={<StudioLoadingFallback title="Documentation Auditor" />}>
            <AuditStudioTab
              allFiles={allFiles}
              openDocTabs={openDocTabs}
              initialFile={lastActiveDocRef?.current || 'README.md'}
              onInsertSection={(secMd, targetFile) => {
                const file = targetFile || lastActiveDocRef?.current || 'README.md'
                handleExecuteInsertSnippet(file, secMd, 'Documentation Section')
              }}
              onBackToReadme={(targetFile) => handleBackToReadme(targetFile || lastActiveDocRef?.current || 'README.md')}
            />
          </Suspense>
        )
      case 'contributors.studio':
        return (
          <Suspense fallback={<StudioLoadingFallback title="Contributors Studio" />}>
            <ContributorStudioTab
              onInsertContributors={(contribMd) => handleRequestInsertSnippet(contribMd, 'Contributors')}
              onBackToReadme={handleBackToReadme}
            />
          </Suspense>
        )
      case 'changelog.studio':
        return (
          <Suspense fallback={<StudioLoadingFallback title="Changelog Studio" />}>
            <ChangelogStudioTab
              gitInfo={gitInfo}
              onInsertChangelog={(clMd) => handleRequestInsertSnippet(clMd, 'Changelog')}
              onBackToReadme={handleBackToReadme}
            />
          </Suspense>
        )
      case 'icons.studio':
        return (
          <Suspense fallback={<StudioLoadingFallback title="Icons & Emoji Studio" />}>
            <IconEmojiStudioTab
              onInsertEmoji={(emojiMd) => handleRequestInsertSnippet(emojiMd, 'Icon & Emoji')}
              onBackToReadme={handleBackToReadme}
            />
          </Suspense>
        )
      case 'settings':
        return (
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
              autoDownloadUpdates={autoDownloadUpdates}
              setAutoDownloadUpdates={handleToggleAutoDownloadUpdates}
              onCheckForUpdates={handleCheckForUpdates}
              isCheckingUpdate={isCheckingUpdate}
              currentVersion={appVersion}
              onOpenWhatsNew={handleOpenWhatsNewTab}
              onClose={() => handleCloseStudioTab('settings')}
              onOpenShortcuts={handleOpenShortcutsTab}
              updateProgress={updateProgress}
              updateDownloaded={updateDownloaded}
              updateError={updateError}
              pendingUpdateInfo={pendingUpdateInfo}
              onStartDownloadUpdate={handleStartDownloadUpdate}
              onRestartToUpdate={handleRestartToUpdate}
              tabGroupingEnabled={tabGroupingEnabled}
              setTabGroupingEnabled={setTabGroupingEnabled}
              showWelcomeOnStartup={showWelcomeOnStartup}
              onToggleShowWelcomeOnStartup={handleToggleShowWelcomeOnStartup}
            />
          </Suspense>
        )
      case 'shortcuts':
        return (
          <Suspense fallback={<StudioLoadingFallback title="Shortcuts" />}>
            <ShortcutsTab
              keybindings={keybindings}
              onUpdateKeybinding={handleUpdateKeybinding}
              onResetKeybindings={handleResetKeybindings}
              onClose={() => handleCloseStudioTab('shortcuts')}
              initialQuery={shortcutsInitialQuery}
              autoEditId={shortcutsAutoEditId}
            />
          </Suspense>
        )
      case 'whats-new':
      case 'release-notes':
        return (
          <Suspense fallback={<StudioLoadingFallback title="Release Notes" />}>
            <WhatsNewTab
              updateDownloaded={updateDownloaded}
              updateProgress={updateProgress}
              updateError={updateError}
              onRestartToUpdate={handleRestartToUpdate}
              onClose={() => handleCloseStudioTab(tabId)}
              onOpenSettings={handleOpenSettingsTab}
              onOpenShortcuts={handleOpenShortcutsTab}
              onCheckForUpdates={handleCheckForUpdates}
            />
          </Suspense>
        )
      case 'welcome':
        return (
          <WelcomeLauncher
            onCloneRepo={() => setIsCloneModalOpen(true)}
            onOpenFolder={handleOpenNativeFolder}
            onCreateNewDoc={handleCreateUntitledFile}
            onOpenNativeFile={handleOpenNativeFile}
            onOpenConfig={() => {
              setActiveActivityTab('generator')
              setSidebarCollapsed(false)
            }}
            onOpenAiAgent={() => {
              setActiveActivityTab('ai-agent')
              setSidebarCollapsed(false)
            }}
            recentWorkspaces={recentWorkspaces}
            onOpenRecentWorkspace={handleOpenRecentWorkspace}
            onClearRecentWorkspaces={handleClearRecentWorkspaces}
            appVersion={appVersion}
            onOpenSampleDoc={handleOpenSampleDoc}
            onOpenStudioTab={handleOpenStudioTab}
            showWelcomeOnStartup={showWelcomeOnStartup}
            onToggleShowWelcomeOnStartup={handleToggleShowWelcomeOnStartup}
            onOpenQuickSetup={handleOpenQuickSetup}
            onOpenSettings={handleOpenSettingsTab}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="ide-editor-container">
      {/* 1. Temporary Preset Preview (takes full priority when active) */}
      {activePreset && (
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
      )}

      {/* 2. Welcome Launcher (when no documents, studios, or presets are open) */}
      {isWelcomeActive && (
        <WelcomeLauncher
          onCloneRepo={() => setIsCloneModalOpen(true)}
          onOpenFolder={handleOpenNativeFolder}
          onCreateNewDoc={handleCreateUntitledFile}
          onOpenNativeFile={handleOpenNativeFile}
          onOpenConfig={() => {
            setActiveActivityTab('generator')
            setSidebarCollapsed(false)
          }}
          onOpenAiAgent={() => {
            setActiveActivityTab('ai-agent')
            setSidebarCollapsed(false)
          }}
          recentWorkspaces={recentWorkspaces}
          onOpenRecentWorkspace={handleOpenRecentWorkspace}
          onClearRecentWorkspaces={handleClearRecentWorkspaces}
          appVersion={appVersion}
          onOpenSampleDoc={handleOpenSampleDoc}
          onOpenStudioTab={handleOpenStudioTab}
          showWelcomeOnStartup={showWelcomeOnStartup}
          onToggleShowWelcomeOnStartup={handleToggleShowWelcomeOnStartup}
          onOpenQuickSetup={handleOpenQuickSetup}
          onOpenSettings={handleOpenSettingsTab}
        />
      )}

      {/* 3. Unsupported File Viewer */}
      {isUnsupportedActive && (
        <UnsupportedFileViewer
          fileInfo={unsupportedFilesMap[activeFile]}
          onCloseTab={() => handleCloseFile(activeFile)}
          onOpenStudioTab={handleOpenStudioTab}
        />
      )}

      {/* 4. Keep-Alive Document Workspace & Monaco Live Preview Pane */}
      {shouldMountDoc && !activePreset && (
        <div
          className="studio-workspace-pane doc-preview-pane"
          style={{
            display: isDocActive ? 'flex' : 'none',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            flex: '1 1 0%',
            minHeight: 0
          }}
        >
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
            setFindReplaceMode={setFindReplaceMode}
            editorEngine={editorEngine}
            themeMode={themeMode}
            tabSize={tabSize}
          />
        </div>
      )}

      {/* 5. Keep-Alive Studio Tooling Panes (Badges, Repo Cards, Diagrams, Tables, Settings, etc.) */}
      {!activePreset && activeStudiosToRender.map((tabId) => (
        <div
          key={tabId}
          className="studio-workspace-pane"
          style={{
            display: activeFile === tabId ? 'flex' : 'none',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            flex: '1 1 0%',
            minHeight: 0
          }}
        >
          {renderStudio(tabId)}
        </div>
      ))}
    </div>
  )
}
