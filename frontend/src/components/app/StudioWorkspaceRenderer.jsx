import { Suspense, lazy } from 'react'
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
    (id.endsWith('.studio') || id === 'settings' || id === 'shortcuts' || id === 'whats-new' || id === 'release-notes')
  )
}

/**
 * StudioWorkspaceRenderer - renders the active workspace view:
 * preset preview, studio tab, welcome launcher, unsupported file viewer, or markdown editor/preview.
 */
export default function StudioWorkspaceRenderer({
  activeFile,
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
  setTabGroupingEnabled = () => {}
}) {
  return (
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
      ) : activeFile === 'repocard.studio' ? (
        <Suspense fallback={<StudioLoadingFallback title="GitHub Repo Card Studio" />}>
          <RepoCardStudioTab
            repoUrl={repoUrl}
            onInsertCard={(cardMd) => handleRequestInsertSnippet(cardMd, 'GitHub Repo Card')}
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
            initialFile={lastActiveDocRef?.current || 'README.md'}
            onInsertSection={(secMd, targetFile) => {
              const file = targetFile || lastActiveDocRef?.current || 'README.md'
              handleExecuteInsertSnippet(file, secMd, 'Documentation Section')
            }}
            onBackToReadme={(targetFile) => handleBackToReadme(targetFile || lastActiveDocRef?.current || 'README.md')}
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
      ) : activeFile === 'icons.studio' ? (
        <Suspense fallback={<StudioLoadingFallback title="Icons & Emoji Studio" />}>
          <IconEmojiStudioTab
            onInsertEmoji={(emojiMd) => handleRequestInsertSnippet(emojiMd, 'Icon & Emoji')}
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
          />
        </Suspense>
      ) : activeFile === 'shortcuts' ? (
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
        <WelcomeLauncher
          onCloneRepo={() => setIsCloneModalOpen(true)}
          onOpenFolder={handleOpenNativeFolder}
          onCreateNewDoc={handleCreateUntitledFile}
          onOpenNativeFile={handleOpenNativeFile}
          onOpenConfig={() => {
            setActiveActivityTab('generator')
            setSidebarCollapsed(false)
          }}
          recentWorkspaces={recentWorkspaces}
          onOpenRecentWorkspace={handleOpenRecentWorkspace}
          onClearRecentWorkspaces={handleClearRecentWorkspaces}
          appVersion={appVersion}
        />
      ) : unsupportedFilesMap[activeFile] ? (
        <UnsupportedFileViewer
          fileInfo={unsupportedFilesMap[activeFile]}
          onCloseTab={() => handleCloseFile(activeFile)}
          onOpenStudioTab={handleOpenStudioTab}
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
          setFindReplaceMode={setFindReplaceMode}
          editorEngine={editorEngine}
          themeMode={themeMode}
          tabSize={tabSize}
        />
      )}
    </div>
  )
}
