import React, { useMemo } from 'react'
import StudioShell from './common/StudioShell'
import { useRepoCardState, RepoCardInspector } from './RepoCardStudio'



/**
 * GitHub Repo Card Studio - Standalone First-Class Studio
 * Generates beautiful, self-contained SVG repository cards with live star counts,
 * language ribbons, and customizable themes.
 */
export default function RepoCardStudioTab({
  repoUrl = '',
  onInsertCard = () => {},
  onBackToReadme = () => {}
}) {
  const cardState = useRepoCardState({
    repoUrl,
    onInsertBadge: onInsertCard
  })

  const {
    cleanRepo,
    repoName,
    currentSvg,
    handleInsertCard,
    handleDownloadSvg,
    saveStatusMessage,
    template,
    setTemplate,
    theme
  } = cardState

  // Generated Markdown embed snippet
  const markdownSnippet = useMemo(() => {
    return `<div align="center">\n  <a href="https://github.com/${cleanRepo}">\n    <img src="assets/${repoName || 'repo'}-card.svg" alt="${repoName || 'Repository'}" width="500" />\n  </a>\n</div>`
  }, [cleanRepo, repoName])

  // Download SVG button in top header
  const extraHeaderActions = (
    <button
      type="button"
      className="studio-shell-btn studio-shell-btn-secondary"
      onClick={handleDownloadSvg}
      title="Download standalone .svg vector file"
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
      </svg>
      <span>Download SVG</span>
    </button>
  )

  // Status message tag in canvas header
  const canvasHeaderExtras = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="canvas-header-divider" />
      <span className="canvas-mode-tag">
        {template.toUpperCase()} • {theme.toUpperCase()}
      </span>
      {saveStatusMessage && (
        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
          {saveStatusMessage}
        </span>
      )}
    </div>
  )

  return (
    <StudioShell
      studioId="repocard.studio"
      title="GitHub Repo Card Studio"
      subtitle="High-fidelity vector repository overview cards with live GitHub metrics & language ribbons"
      badge="Vector Engine"
      accentColor="#58a6ff"
      icon={
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      }

      markdownCode={markdownSnippet}
      onInsert={handleInsertCard}
      insertLabel="Insert Repo Card"
      onBackToReadme={onBackToReadme}
      extraHeaderActions={extraHeaderActions}
      canvasHeaderExtras={canvasHeaderExtras}
      defaultSplitWidth={520}
      inspectorContent={
        <div style={{ padding: '16px' }}>
          <RepoCardInspector {...cardState} cardState={cardState} />
        </div>
      }
      canvasContent={
        <div className="repo-svg-render-wrapper" dangerouslySetInnerHTML={{ __html: currentSvg }} />
      }
    />
  )
}
