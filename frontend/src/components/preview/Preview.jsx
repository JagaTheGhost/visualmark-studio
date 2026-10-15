import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import EditorToolbar from './EditorToolbar'
import FindReplaceWidget from './FindReplaceWidget'
import PreviewBreadcrumbs from './PreviewBreadcrumbs'
import EditorSurface from './EditorSurface'
import LivePreviewPane from './LivePreviewPane'
import { useEditorHistory } from './useEditorHistory'
import { usePreviewScrollSync } from './usePreviewScrollSync'
import { useEditorKeyHandlers } from './useEditorKeyHandlers'
import { useEditorExternalDrop } from './useEditorExternalDrop'
import { useLineMeasurement } from './useLineMeasurement'
import { unfoldDataUris } from '../../utils/dataUriFold'

export default function Preview({
  markdown,
  onMarkdownChange,
  activeFile = 'README.md',
  viewMode = 'split',
  orientation = 'vertical',
  zoomLevel = 100,
  fontSize = 13,
  wordWrap = true,
  showLineNumbers = true,
  syncScroll = true,
  onCursorChange,
  scrollToHeadingTarget,
  onOpenBadgeBuilder,
  onOpenDiagramStudio,
  onOpenTableStudio,
  onOpenSnippetStudio,
  onOpenImageStudio,
  findReplaceOpen = false,
  setFindReplaceOpen = () => {},
  findReplaceMode = 'find',
  setFindReplaceMode = () => {},
  previewPreset = null,
  onExitPresetPreview = () => {},
  onConfirmLoadPreset = () => {},
  editorEngine = 'monaco',
  themeMode = 'dark',
  tabSize = 2,
  workspaceDirectory = null,
  onDropExternalFile = () => {},
  showToast = () => {}
}) {
  const safeMarkdown = markdown || ''
  const editorScrollRef = useRef(null)
  const monacoEditorRef = useRef(null)
  const previewRef = useRef(null)
  const gutterRef = useRef(null)
  const lastActiveFileRef = useRef(activeFile)

  // Map file extension to Monaco language mode
  const editorLanguage = useMemo(() => {
    if (!activeFile) return 'markdown'
    const ext = activeFile.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'json': return 'json'
      case 'js':
      case 'cjs':
      case 'mjs':
      case 'jsx': return 'javascript'
      case 'ts':
      case 'tsx': return 'typescript'
      case 'py': return 'python'
      case 'html': return 'html'
      case 'css': return 'css'
      case 'yml':
      case 'yaml': return 'yaml'
      case 'sh':
      case 'bash': return 'shell'
      case 'sql': return 'sql'
      case 'xml':
      case 'svg': return 'xml'
      case 'md':
      case 'markdown':
      default: return 'markdown'
    }
  }, [activeFile])

  // External drag-and-drop file imports (e.g. images)
  const {
    isEditorDragOver,
    handleEditorDragOver,
    handleEditorDragLeave,
    handleEditorDrop
  } = useEditorExternalDrop({
    editorEngine,
    monacoEditorRef,
    editorScrollRef,
    safeMarkdown,
    onMarkdownChange,
    workspaceDirectory,
    showToast,
    onDropExternalFile
  })

  // Scroll to top whenever a preset preview is triggered
  useEffect(() => {
    if (previewPreset && previewRef.current) {
      previewRef.current.scrollTop = 0
    }
  }, [previewPreset])

  // Synchronize active file reference without clobbering scroll position
  useEffect(() => {
    lastActiveFileRef.current = activeFile
  }, [activeFile])

  // Calculate lines array
  const lines = useMemo(() => {
    const splitLines = safeMarkdown.split('\n')
    return splitLines.length > 0 ? splitLines : ['']
  }, [safeMarkdown])

  const [activeLine, setActiveLine] = useState(1)
  const [lineFoldState, setLineFoldState] = useState(null)
  const expandedLineRef = useRef(null)

  // Resizable split state between editor and live preview
  const [splitRatio, setSplitRatio] = useState(() => {
    try {
      const saved = localStorage.getItem('ide_preview_split_ratio')
      return saved ? parseFloat(saved) : 50
    } catch {
      return 50
    }
  })
  const [isDraggingSplit, setIsDraggingSplit] = useState(false)
  const splitContainerRef = useRef(null)

  const handleSplitMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDraggingSplit(true)
    const container = splitContainerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const isVertical = orientation === 'vertical'

    const onMouseMove = (moveEvent) => {
      let ratio
      if (isVertical) {
        const offset = moveEvent.clientX - rect.left
        ratio = (offset / rect.width) * 100
      } else {
        const offset = moveEvent.clientY - rect.top
        ratio = (offset / rect.height) * 100
      }
      const clamped = Math.max(15, Math.min(85, ratio))
      setSplitRatio(clamped)
      try {
        localStorage.setItem('ide_preview_split_ratio', String(clamped))
      } catch {}
    }

    const onMouseUp = () => {
      setIsDraggingSplit(false)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [orientation])

  const handleResetSplit = useCallback(() => {
    setSplitRatio(50)
    try {
      localStorage.setItem('ide_preview_split_ratio', '50')
    } catch {}
  }, [])

  // Listen for Monaco or menu triggers to open Find & Replace
  useEffect(() => {
    const handleOpenFindWidget = (e) => {
      const mode = e.detail === 'replace' ? 'replace' : 'find'
      setFindReplaceMode(mode)
      setFindReplaceOpen(true)
    }
    window.addEventListener('open-find-widget', handleOpenFindWidget)
    return () => window.removeEventListener('open-find-widget', handleOpenFindWidget)
  }, [setFindReplaceMode, setFindReplaceOpen])

  // Undo & Redo History
  const { canUndo, canRedo, handleUndo, handleRedo } = useEditorHistory(
    activeFile,
    safeMarkdown,
    onMarkdownChange
  )

  // Word-wrap line height tracking for gutter synchronization
  const { lineHeights } = useLineMeasurement({
    wordWrap,
    fontSize,
    safeMarkdown,
    editorScrollRef
  })

  // Synchronized scrolling between Editor and Preview
  const {
    handleMonacoScroll,
    handleEditorScroll,
    handlePreviewScroll
  } = usePreviewScrollSync({
    syncScroll,
    viewMode,
    lines,
    fontSize,
    lineHeights,
    editorEngine,
    monacoEditorRef,
    editorScrollRef,
    previewRef,
    gutterRef,
    setActiveLine,
    scrollToHeadingTarget
  })

  // Keyboard and cursor handlers (Indentation, auto-pair, line moves, fold tokens)
  const {
    handleExpandFold,
    handleFoldCurrent,
    handleEditorBlur,
    handleEditorKeyUpOrClick,
    handleGutterLineClick,
    handleEditorKeyDown
  } = useEditorKeyHandlers({
    safeMarkdown,
    onMarkdownChange,
    lines,
    activeLine,
    setActiveLine,
    onCursorChange,
    lineFoldState,
    setLineFoldState,
    expandedLineRef,
    editorScrollRef,
    handleUndo,
    handleRedo
  })

  // Find & Replace match navigation handler
  const handleNavigateMatch = useCallback((match, currentIdx, total, focusEditor = false) => {
    if (!match) return

    if (editorEngine === 'monaco' && monacoEditorRef.current) {
      const editor = monacoEditorRef.current
      const model = editor.getModel()
      if (model) {
        const pStart = model.getPositionAt(match.index)
        const pEnd = model.getPositionAt(match.index + match.length)
        editor.setSelection({
          startLineNumber: pStart.lineNumber,
          startColumn: pStart.column,
          endLineNumber: pEnd.lineNumber,
          endColumn: pEnd.column
        })
        editor.revealRangeInCenter({
          startLineNumber: pStart.lineNumber,
          startColumn: pStart.column,
          endLineNumber: pEnd.lineNumber,
          endColumn: pEnd.column
        })
        if (focusEditor) {
          editor.focus()
        }
        setActiveLine(pStart.lineNumber)
      }
      return
    }

    if (!editorScrollRef.current) return
    const textarea = editorScrollRef.current.querySelector('textarea')
    if (!textarea) return

    // Select matched substring without stealing focus unless asked
    if (focusEditor) {
      textarea.focus({ preventScroll: true })
    }
    textarea.setSelectionRange(match.index, match.index + match.length)

    // Scroll editor smoothly so match is centered
    const textBefore = safeMarkdown.substring(0, match.index)
    const lineNum = textBefore.split('\n').length
    setActiveLine(lineNum)

    const approxLineHeight = fontSize * 1.55
    const targetScrollTop = Math.max(0, (lineNum - 1) * approxLineHeight - 120)
    editorScrollRef.current.scrollTop = targetScrollTop
  }, [safeMarkdown, fontSize, editorEngine, setActiveLine])

  // Live preview rendered with full, genuine data URIs (or preset content if previewing)
  const previewMarkdown = useMemo(() => {
    const raw = previewPreset ? previewPreset.content : safeMarkdown
    return unfoldDataUris(raw || '')
  }, [previewPreset, safeMarkdown])

  // Active section heading resolution for breadcrumb trail
  const activeHeading = useMemo(() => {
    const splitLines = safeMarkdown.split('\n')
    const currentLineIdx = Math.min(splitLines.length - 1, Math.max(0, activeLine - 1))
    for (let i = currentLineIdx; i >= 0; i--) {
      const match = splitLines[i].match(/^(#{1,6})\s+(.*)$/)
      if (match) {
        return match[2].trim()
      }
    }
    return ''
  }, [safeMarkdown, activeLine])

  return (
    <div
      ref={splitContainerRef}
      className={`editor-workspace-split mode-${viewMode} orientation-${orientation}`}
      style={{
        '--editor-font-size': `${fontSize}px`,
        transform: `scale(${zoomLevel / 100})`,
        transformOrigin: 'top left',
        userSelect: isDraggingSplit ? 'none' : 'auto'
      }}
    >
      {/* ==================== LEFT PANE: CODE EDITOR ==================== */}
      {(viewMode === 'split' || viewMode === 'editor') && (
        <div
          className="editor-pane"
          style={
            viewMode === 'split'
              ? orientation === 'vertical'
                ? { flex: `0 0 ${splitRatio}%`, width: `${splitRatio}%`, minWidth: '15%' }
                : { flex: `0 0 ${splitRatio}%`, height: `${splitRatio}%`, minHeight: '15%' }
              : undefined
          }
        >
          {/* Breadcrumbs Trail */}
          <PreviewBreadcrumbs
            activeFile={activeFile}
            activeHeading={activeHeading}
            previewPreset={previewPreset}
          />

          {/* Sub Toolbar for Formatting */}
          <EditorToolbar
            markdown={safeMarkdown}
            setMarkdown={onMarkdownChange}
            textareaRef={editorScrollRef}
            monacoEditorRef={monacoEditorRef}
            activeFile={activeFile}
            activeHeading={activeHeading}
            onOpenBadgeBuilder={onOpenBadgeBuilder}
            onOpenDiagramStudio={onOpenDiagramStudio}
            onOpenTableStudio={onOpenTableStudio}
            onOpenSnippetStudio={onOpenSnippetStudio}
            onOpenImageStudio={onOpenImageStudio}
            onOpenFindReplace={() => setFindReplaceOpen(true)}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
          />

          {/* Editor Container with Gutter & External Drag-and-Drop */}
          <EditorSurface
            findReplaceWidget={
              <FindReplaceWidget
                isOpen={findReplaceOpen}
                onClose={() => setFindReplaceOpen(false)}
                markdown={safeMarkdown}
                onMarkdownChange={onMarkdownChange}
                showReplaceInitially={findReplaceMode === 'replace'}
                onNavigateMatch={handleNavigateMatch}
              />
            }
            editorEngine={editorEngine}
            activeFile={activeFile}
            safeMarkdown={safeMarkdown}
            onMarkdownChange={onMarkdownChange}
            previewPreset={previewPreset}
            fontSize={fontSize}
            wordWrap={wordWrap}
            showLineNumbers={showLineNumbers}
            tabSize={tabSize}
            themeMode={themeMode}
            editorLanguage={editorLanguage}
            setActiveLine={setActiveLine}
            onCursorChange={onCursorChange}
            handleMonacoScroll={handleMonacoScroll}
            monacoEditorRef={monacoEditorRef}
            editorScrollRef={editorScrollRef}
            gutterRef={gutterRef}
            isEditorDragOver={isEditorDragOver}
            handleEditorDragOver={handleEditorDragOver}
            handleEditorDragLeave={handleEditorDragLeave}
            handleEditorDrop={handleEditorDrop}
            lineFoldState={lineFoldState}
            handleExpandFold={handleExpandFold}
            handleFoldCurrent={handleFoldCurrent}
            lines={lines}
            activeLine={activeLine}
            lineHeights={lineHeights}
            handleGutterLineClick={handleGutterLineClick}
            handleEditorScroll={handleEditorScroll}
            handleEditorKeyUpOrClick={handleEditorKeyUpOrClick}
            handleEditorKeyDown={handleEditorKeyDown}
            handleEditorBlur={handleEditorBlur}
          />
        </div>
      )}

      {/* Interactive Draggable Split Divider */}
      {viewMode === 'split' && (
        <div
          className={`split-resizer-handle ${orientation} ${isDraggingSplit ? 'is-dragging' : ''}`}
          onMouseDown={handleSplitMouseDown}
          onDoubleClick={handleResetSplit}
          title="Drag to resize split panes (double-click to reset 50/50)"
        />
      )}

      {/* ==================== RIGHT PANE: LIVE PREVIEW ==================== */}
      <LivePreviewPane
        previewRef={previewRef}
        previewMarkdown={previewMarkdown}
        previewPreset={previewPreset}
        onConfirmLoadPreset={onConfirmLoadPreset}
        onExitPresetPreview={onExitPresetPreview}
        onScroll={handlePreviewScroll}
        viewMode={viewMode}
        orientation={orientation}
        splitRatio={splitRatio}
      />
    </div>
  )
}
