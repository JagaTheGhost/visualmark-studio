import React, { useRef, useState, useEffect, useMemo, useCallback, useLayoutEffect } from 'react'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-markdown'
import 'prismjs/themes/prism-tomorrow.css'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import EditorToolbar from './EditorToolbar'
import MermaidRenderer from './MermaidRenderer'
import FindReplaceWidget from './FindReplaceWidget'
import MarkdownImage from './MarkdownImage'
import MonacoEditorPane from './MonacoEditorPane'
import {
  handleListContinuationOnEnter,
  handleTabIndentation,
  duplicateCurrentLine,
  moveLine
} from '../utils/markdownEditorHelpers'
import {
  foldDataUris,
  unfoldDataUris,
  expandSingleVaultToken,
  collapseSingleDataUri,
  hasFoldedTokens,
  hasLongDataUris,
  decorateFoldTokensInPrismHtml,
  formatByteSize
} from '../utils/dataUriFold'

// GitHub Alert Octicons matching official GitHub specifications
const ALERT_ICONS = {
  NOTE: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  ),
  TIP: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.21c-.04-.287-.197-.625-.453-.996a8.03 8.03 0 0 0-.776-.983l-.213-.253C2.88 7.31 2.25 6.326 2.25 5.25c0-2.89 2.36-5.25 5.75-5.25 3.39 0 5.75 2.36 5.75 5.25 0 1.076-.63 2.06-1.316 2.873l-.213.253c-.266.315-.53.642-.776.983-.256.371-.413.71-.453.996a.75.75 0 0 1-1.484-.21c.084-.594.337-1.079.621-1.49.204-.292.45-.584.673-.848l.214-.253c.56-.679.984-1.32.984-2.304 0-2.06-1.637-3.75-4-3.75ZM6 13.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75ZM7.25 15a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z" />
    </svg>
  ),
  IMPORTANT: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25v-9.5ZM8 3.5a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 8 3.5ZM8 10.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  ),
  WARNING: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575L6.457 1.047ZM8 5a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 8 5ZM8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  ),
  CAUTION: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4.47.04c.328-.04.652-.04.98 0l7.26 1.452a1.75 1.75 0 0 1 1.38 1.38l1.452 7.26c.04.328.04.652 0 .98l-1.452 7.26a1.75 1.75 0 0 1-1.38 1.38l-7.26 1.452c-.328.04-.652.04-.98 0l-7.26-1.452a1.75 1.75 0 0 1-1.38-1.38L.04 11.112a2.025 2.025 0 0 1 0-.98L1.492 2.872A1.75 1.75 0 0 1 2.872 1.492L4.47.04ZM8 4a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0v-4.5A.75.75 0 0 0 8 4ZM8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  )
}

// Custom Remark Plugin to parse GitHub-Flavored Markdown Callouts / Alerts ([!NOTE], [!TIP], etc.)
function remarkGithubAlerts() {
  return (tree) => {
    function walk(node) {
      if (!node || !node.children) return
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]
        if (child.type === 'blockquote') {
          processBlockquote(child)
        }
        walk(child)
      }
    }

    function processBlockquote(node) {
      if (!node.children || node.children.length === 0) return
      const firstChild = node.children[0]
      if (firstChild.type !== 'paragraph' || !firstChild.children || firstChild.children.length === 0) return

      const firstTextNode = firstChild.children[0]
      if (firstTextNode.type !== 'text') return

      const match = firstTextNode.value.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\r?\n|[ \t]+)?/i)
      if (!match) return

      const alertType = match[1].toUpperCase()

      // Strip the "[!NOTE]" prefix from text
      firstTextNode.value = firstTextNode.value.slice(match[0].length)

      if (!firstTextNode.value.trim()) {
        firstChild.children.shift()
      }
      if (firstChild.children.length === 0) {
        node.children.shift()
      }

      node.data = node.data || {}
      node.data.hName = 'div'
      node.data.hProperties = {
        ...(node.data.hProperties || {}),
        className: ['markdown-alert', `markdown-alert-${alertType.toLowerCase()}`],
        'data-alert-type': alertType
      }

      const titleNode = {
        type: 'paragraph',
        data: {
          hProperties: {
            className: ['markdown-alert-title'],
            'data-alert-type': alertType
          }
        },
        children: [
          {
            type: 'text',
            value: alertType.charAt(0) + alertType.slice(1).toLowerCase()
          }
        ]
      }

      node.children.unshift(titleNode)
    }

    walk(tree)
  }
}

// Reusable CodeBlock component with language badge and copy action
function CodeBlock({ language, value, ...props }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-lang">{language || 'text'}</span>
        <button
          type="button"
          className="code-copy-btn"
          onClick={handleCopy}
          title="Copy code snippet"
        >
          <span className="material-symbols-outlined icon-copy-btn">
            {copied ? 'check' : 'content_copy'}
          </span>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          background: 'var(--surface-container-lowest, #0a0e14)',
          borderRadius: '0 0 var(--radius-sm, 4px) var(--radius-sm, 4px)',
          fontSize: '0.82rem',
          lineHeight: '1.5',
          border: '1px solid var(--border-color, #30363d)',
          borderTop: 'none'
        }}
        {...props}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}

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
  previewPreset = null,
  onExitPresetPreview = () => {},
  onConfirmLoadPreset = () => {},
  editorEngine = 'monaco',
  themeMode = 'dark',
  tabSize = 2
}) {
  const safeMarkdown = markdown || ''
  const editorScrollRef = useRef(null)
  const monacoEditorRef = useRef(null)
  const previewRef = useRef(null)
  const gutterRef = useRef(null)
  const lastActiveFileRef = useRef(activeFile)

  // Scroll to top whenever a preset preview is triggered
  useEffect(() => {
    if (previewPreset && previewRef.current) {
      previewRef.current.scrollTop = 0
    }
  }, [previewPreset])

  const isSyncingRef = useRef(null) // 'editor' | 'preview' | null
  const syncTimeoutRef = useRef(null)

  // Synchronize active file reference without clobbering scroll position
  useEffect(() => {
    lastActiveFileRef.current = activeFile
  }, [activeFile])

  // Calculate line numbers
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

  // Dedicated in-memory Undo & Redo History System
  const fileHistoryMapRef = useRef({})
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const isUndoRedoActionRef = useRef(false)
  const lastPushedTextRef = useRef(safeMarkdown)
  const debounceHistoryTimerRef = useRef(null)

  // Initialize or restore history for active file
  useEffect(() => {
    if (!fileHistoryMapRef.current[activeFile]) {
      fileHistoryMapRef.current[activeFile] = {
        undo: [],
        redo: []
      }
    }
    const cur = fileHistoryMapRef.current[activeFile]
    setCanUndo(cur.undo.length > 0)
    setCanRedo(cur.redo.length > 0)
    lastPushedTextRef.current = safeMarkdown
  }, [activeFile])

  // Track markdown changes for history snapshots
  useEffect(() => {
    if (isUndoRedoActionRef.current) {
      isUndoRedoActionRef.current = false
      return
    }

    if (safeMarkdown === lastPushedTextRef.current) return

    if (!fileHistoryMapRef.current[activeFile]) {
      fileHistoryMapRef.current[activeFile] = { undo: [], redo: [] }
    }

    const curHistory = fileHistoryMapRef.current[activeFile]
    const previousText = lastPushedTextRef.current

    if (debounceHistoryTimerRef.current) {
      clearTimeout(debounceHistoryTimerRef.current)
    }

    debounceHistoryTimerRef.current = setTimeout(() => {
      curHistory.undo.push(previousText)
      if (curHistory.undo.length > 50) curHistory.undo.shift()
      curHistory.redo = []
      setCanUndo(true)
      setCanRedo(false)
      lastPushedTextRef.current = safeMarkdown
    }, 400)

    return () => {
      if (debounceHistoryTimerRef.current) clearTimeout(debounceHistoryTimerRef.current)
    }
  }, [safeMarkdown, activeFile])

  const handleUndo = useCallback(() => {
    if (!fileHistoryMapRef.current[activeFile]) return
    const curHistory = fileHistoryMapRef.current[activeFile]
    if (curHistory.undo.length === 0) return

    const prevText = curHistory.undo.pop()
    curHistory.redo.push(safeMarkdown)
    isUndoRedoActionRef.current = true
    lastPushedTextRef.current = prevText
    setCanUndo(curHistory.undo.length > 0)
    setCanRedo(true)
    onMarkdownChange(prevText)
  }, [activeFile, safeMarkdown, onMarkdownChange])

  const handleRedo = useCallback(() => {
    if (!fileHistoryMapRef.current[activeFile]) return
    const curHistory = fileHistoryMapRef.current[activeFile]
    if (curHistory.redo.length === 0) return

    const nextText = curHistory.redo.pop()
    curHistory.undo.push(safeMarkdown)
    isUndoRedoActionRef.current = true
    lastPushedTextRef.current = nextText
    setCanUndo(true)
    setCanRedo(curHistory.redo.length > 0)
    onMarkdownChange(nextText)
  }, [activeFile, safeMarkdown, onMarkdownChange])

  // Find & Replace match navigation handler
  const handleNavigateMatch = useCallback((match) => {
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
        editor.revealLineInCenter(pStart.lineNumber)
        editor.focus()
        setActiveLine(pStart.lineNumber)
      }
      return
    }

    if (!editorScrollRef.current) return
    const textarea = editorScrollRef.current.querySelector('textarea')
    if (!textarea) return

    // Focus & select matched substring
    textarea.focus({ preventScroll: true })
    textarea.setSelectionRange(match.index, match.index + match.length)

    // Scroll editor smoothly so match is centered
    const textBefore = safeMarkdown.substring(0, match.index)
    const lineNum = textBefore.split('\n').length
    setActiveLine(lineNum)

    const approxLineHeight = fontSize * 1.55
    const targetScrollTop = Math.max(0, (lineNum - 1) * approxLineHeight - 120)
    editorScrollRef.current.scrollTop = targetScrollTop
  }, [safeMarkdown, fontSize, editorEngine])

  // Word-wrap line height tracking for gutter synchronization
  const [lineHeights, setLineHeights] = useState(null)

  // Measure word-wrapped line heights directly from live editor line anchors
  const measureLineHeights = useCallback(() => {
    if (!wordWrap) {
      setLineHeights(null)
      return
    }

    const scrollEl = editorScrollRef.current
    if (!scrollEl) return

    const pre = scrollEl.querySelector('pre')
    if (!pre) return

    const anchors = pre.querySelectorAll('.editor-line-anchor')
    if (!anchors || anchors.length === 0) return

    const computed = window.getComputedStyle(pre)
    const padBottom = parseFloat(computed.paddingBottom) || 16
    const baseLineH = fontSize * 1.5

    const preRect = pre.getBoundingClientRect()
    const measured = new Array(anchors.length)

    for (let i = 0; i < anchors.length; i++) {
      const top = anchors[i].getBoundingClientRect().top
      let h = baseLineH
      if (i + 1 < anchors.length) {
        const nextTop = anchors[i + 1].getBoundingClientRect().top
        h = nextTop - top
      } else {
        const bottom = preRect.bottom - padBottom
        h = bottom - top
      }
      measured[i] = Math.max(Math.round(h * 10) / 10, baseLineH)
    }

    // Set state only if heights changed to avoid unnecessary re-renders
    setLineHeights((prev) => {
      if (prev && prev.length === measured.length) {
        let same = true
        for (let i = 0; i < prev.length; i++) {
          if (Math.abs(prev[i] - measured[i]) > 0.5) {
            same = false
            break
          }
        }
        if (same) return prev
      }
      return measured
    })
  }, [wordWrap, fontSize])

  // Recalculate heights on markdown, wordWrap, or fontSize change
  useLayoutEffect(() => {
    measureLineHeights()
    const frameId = requestAnimationFrame(() => {
      measureLineHeights()
    })
    return () => cancelAnimationFrame(frameId)
  }, [safeMarkdown, wordWrap, fontSize, measureLineHeights])

  // Observe editor width resizes (split dragging, window resize)
  useEffect(() => {
    if (!wordWrap) return
    const scrollEl = editorScrollRef.current
    if (!scrollEl || typeof ResizeObserver === 'undefined') return

    const ro = new ResizeObserver(() => {
      measureLineHeights()
    })

    ro.observe(scrollEl)
    return () => ro.disconnect()
  }, [wordWrap, measureLineHeights])

  // Re-measure when web fonts finish loading
  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        measureLineHeights()
      })
    }
  }, [measureLineHeights])

  // Handle click directly on gutter line number to jump cursor to that line
  const handleGutterLineClick = (lineNum) => {
    setActiveLine(lineNum)
    if (editorScrollRef.current) {
      const textarea = editorScrollRef.current.querySelector('textarea')
      if (textarea) {
        const linesBefore = lines.slice(0, lineNum - 1)
        const charOffset = linesBefore.join('\n').length + (linesBefore.length > 0 ? 1 : 0)
        textarea.focus()
        textarea.setSelectionRange(charOffset, charOffset)
      }
    }
    if (onCursorChange) {
      onCursorChange({ line: lineNum, col: 1 })
    }
  }

  // Live preview rendered with full, genuine data URIs (or preset content if previewing)
  const previewMarkdown = useMemo(() => {
    const raw = previewPreset ? previewPreset.content : safeMarkdown
    return unfoldDataUris(raw || '')
  }, [previewPreset, safeMarkdown])

  // Expand a single fold token by ID in editor buffer
  const handleExpandFold = (targetId) => {
    const expanded = expandSingleVaultToken(safeMarkdown, targetId)
    if (expanded !== safeMarkdown) {
      expandedLineRef.current = activeLine
      onMarkdownChange(expanded)
    }
  }

  // Fold back current expanded URI or all long URIs
  const handleFoldCurrent = () => {
    expandedLineRef.current = null
    const folded = foldDataUris(safeMarkdown)
    if (folded !== safeMarkdown) {
      onMarkdownChange(folded)
      setLineFoldState(null)
    }
  }

  // Check fold status on the given line
  const checkLineFold = (lineNum, currentText) => {
    const splitLines = currentText.split('\n')
    const lineText = splitLines[lineNum - 1] || ''

    // If cursor moved away from an expanded URI line, auto-fold back into short form!
    if (expandedLineRef.current !== null && expandedLineRef.current !== lineNum) {
      expandedLineRef.current = null
      const reFolded = foldDataUris(currentText)
      if (reFolded !== currentText) {
        onMarkdownChange(reFolded)
        setLineFoldState(null)
        return
      }
    }

    // Check for folded token on this line: data:image/...[size#id]...
    const foldMatch = /data:image\/[a-zA-Z0-9%_\+\-;=,]*?\.\.\.\[(?:···\s*)?([^#\]]+)#([a-zA-Z0-9_]+)\]\.\.\.[a-zA-Z0-9%_\+\-;=]*/.exec(lineText)
    if (foldMatch) {
      setLineFoldState({
        type: 'folded',
        id: foldMatch[2],
        size: foldMatch[1].trim(),
        lineNum
      })
      return
    }

    // Check for expanded long data URI on this line (>120 chars)
    const uriMatch = /data:image\/(?:svg\+xml|png|jpeg|webp|gif)[^"'\)\s]{100,}/.exec(lineText)
    if (uriMatch) {
      expandedLineRef.current = lineNum
      setLineFoldState({
        type: 'expanded',
        size: formatByteSize(uriMatch[0].length),
        lineNum
      })
      return
    }

    setLineFoldState(null)
  }

  // Auto-fold when editor loses focus (focus out of function/block)
  const handleEditorBlur = () => {
    if (expandedLineRef.current !== null || hasLongDataUris(safeMarkdown)) {
      expandedLineRef.current = null
      const folded = foldDataUris(safeMarkdown)
      if (folded !== safeMarkdown) {
        onMarkdownChange(folded)
        setLineFoldState(null)
      }
    }
  }

  // Track cursor position from textarea events
  const handleEditorKeyUpOrClick = (e) => {
    const textarea = e?.target?.tagName === 'TEXTAREA'
      ? e.target
      : editorScrollRef.current?.querySelector('textarea')
    if (!textarea || typeof textarea.selectionStart !== 'number') return
    const selStart = textarea.selectionStart
    const selEnd = textarea.selectionEnd
    const textBefore = safeMarkdown.substring(0, selStart)
    const lineNum = textBefore.split('\n').length
    const lastNewline = textBefore.lastIndexOf('\n')
    const colNum = selStart - lastNewline

    setActiveLine(lineNum)
    if (onCursorChange) {
      onCursorChange({ line: lineNum, col: colNum, index: selStart, selectionEnd: selEnd })
    }

    // Check if user clicked directly on a fold token/ellipsis
    const foldTokenRegex = /data:image\/[a-zA-Z0-9%_\+\-;=,]*?\.\.\.\[(?:···\s*)?([^#\]]+)#([a-zA-Z0-9_]+)\]\.\.\.[a-zA-Z0-9%_\+\-;=]*/g
    let match
    let clickedTokenId = null
    while ((match = foldTokenRegex.exec(safeMarkdown)) !== null) {
      const tokenStart = match.index
      const tokenEnd = tokenStart + match[0].length
      if (selStart >= tokenStart && selStart <= tokenEnd) {
        clickedTokenId = match[2]
        break
      }
    }

    if (clickedTokenId) {
      handleExpandFold(clickedTokenId)
      return
    }

    checkLineFold(lineNum, safeMarkdown)
  }

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

  // Advanced IDE Keyboard Behaviors (VS Code / Antigravity Style)
  const handleEditorKeyDown = (e) => {
    const textarea = e?.target?.tagName === 'TEXTAREA'
      ? e.target
      : editorScrollRef.current?.querySelector('textarea')

    // Keyboard Undo / Redo
    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
      if (e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          handleRedo()
        } else {
          handleUndo()
        }
        return
      }
      if (e.key.toLowerCase() === 'y') {
        e.preventDefault()
        handleRedo()
        return
      }
    }

    if (e.altKey && (e.key.toLowerCase() === 'f' || e.code === 'KeyF')) {
      e.preventDefault()
      if (lineFoldState?.type === 'folded') {
        handleExpandFold(lineFoldState.id)
      } else if (lineFoldState?.type === 'expanded') {
        handleFoldCurrent()
      } else if (hasFoldedTokens(safeMarkdown)) {
        onMarkdownChange(unfoldDataUris(safeMarkdown))
      } else if (hasLongDataUris(safeMarkdown)) {
        onMarkdownChange(foldDataUris(safeMarkdown))
      }
      return
    }

    if (!textarea || typeof textarea.selectionStart !== 'number') return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    // 1. Enter Key -> Auto list & blockquote continuation
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const res = handleListContinuationOnEnter(safeMarkdown, start)
      if (res.handled) {
        e.preventDefault()
        onMarkdownChange(res.newContent)
        setTimeout(() => {
          textarea.focus({ preventScroll: true })
          textarea.setSelectionRange(res.newCursor, res.newCursor)
        }, 0)
        return
      }
    }

    // 2. Tab & Shift+Tab Indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const res = handleTabIndentation(safeMarkdown, start, end, e.shiftKey)
      if (res.handled) {
        onMarkdownChange(res.newContent)
        setTimeout(() => {
          textarea.focus({ preventScroll: true })
          textarea.setSelectionRange(res.newStart, res.newEnd)
        }, 0)
        return
      }
    }

    // 3. Duplicate Line Down (Shift + Alt + Down)
    if (e.shiftKey && e.altKey && (e.key === 'ArrowDown' || e.code === 'ArrowDown')) {
      e.preventDefault()
      const res = duplicateCurrentLine(safeMarkdown, start)
      onMarkdownChange(res.newContent)
      setTimeout(() => {
        textarea.focus({ preventScroll: true })
        textarea.setSelectionRange(res.newCursor, res.newCursor)
      }, 0)
      return
    }

    // 4. Move Line Up / Down (Alt + Up / Alt + Down)
    if (e.altKey && !e.shiftKey && !e.ctrlKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault()
      const dir = e.key === 'ArrowUp' ? 'up' : 'down'
      const res = moveLine(safeMarkdown, start, dir)
      if (res.handled) {
        onMarkdownChange(res.newContent)
        setTimeout(() => {
          textarea.focus({ preventScroll: true })
          textarea.setSelectionRange(res.newCursor, res.newCursor)
        }, 0)
        return
      }
    }

    // 5. Auto-closing Pair & Wrapping
    const pairs = {
      '(': ')',
      '[': ']',
      '{': '}',
      '`': '`',
      '"': '"',
      "'": "'",
      '*': '*'
    }
    if (pairs[e.key]) {
      const closeChar = pairs[e.key]
      if (start !== end) {
        e.preventDefault()
        const selected = safeMarkdown.substring(start, end)
        const wrapped = e.key + selected + closeChar
        const nextContent = safeMarkdown.substring(0, start) + wrapped + safeMarkdown.substring(end)
        onMarkdownChange(nextContent)
        setTimeout(() => {
          textarea.focus({ preventScroll: true })
          textarea.setSelectionRange(start + 1, end + 1)
        }, 0)
        return
      } else if (['(', '[', '{'].includes(e.key)) {
        e.preventDefault()
        const pairText = e.key + closeChar
        const nextContent = safeMarkdown.substring(0, start) + pairText + safeMarkdown.substring(end)
        onMarkdownChange(nextContent)
        setTimeout(() => {
          textarea.focus({ preventScroll: true })
          textarea.setSelectionRange(start + 1, start + 1)
        }, 0)
        return
      }
    }
  }


  // Helper to compute exact top coordinate of an element relative to its scroll container
  const getRelativeOffsetTop = (element, container) => {
    if (!element || !container) return 0
    const elemRect = element.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    return elemRect.top - containerRect.top + container.scrollTop
  }

  // Handle synchronized scrolling from Monaco editor to live preview
  const handleMonacoScroll = useCallback((scrollInfo) => {
    if (!syncScroll || viewMode !== 'split') return
    if (isSyncingRef.current === 'preview') return

    isSyncingRef.current = 'editor'
    clearTimeout(syncTimeoutRef.current)
    syncTimeoutRef.current = setTimeout(() => {
      isSyncingRef.current = null
    }, 70)

    const preview = previewRef.current
    if (!preview) return

    const { scrollTop, scrollHeight, clientHeight, firstVisibleLine } = scrollInfo
    const maxEditorScroll = scrollHeight - clientHeight
    const maxPreviewScroll = preview.scrollHeight - preview.clientHeight

    if (maxEditorScroll <= 0 || maxPreviewScroll <= 0) return

    if (scrollTop <= 5) {
      preview.scrollTop = 0
      return
    }
    if (scrollTop >= maxEditorScroll - 10) {
      preview.scrollTop = maxPreviewScroll
      return
    }

    const targetLine = firstVisibleLine

    const previewBlocks = preview.querySelectorAll('[data-source-line]')
    if (!previewBlocks || previewBlocks.length === 0) {
      preview.scrollTop = (scrollTop / maxEditorScroll) * maxPreviewScroll
      return
    }

    let prevBlock = null
    let nextBlock = null

    for (let i = 0; i < previewBlocks.length; i++) {
      const block = previewBlocks[i]
      const blockLine = parseInt(block.getAttribute('data-source-line') || '0', 10)
      if (!blockLine) continue

      if (blockLine <= targetLine) {
        prevBlock = { element: block, line: blockLine }
      } else if (!nextBlock) {
        nextBlock = { element: block, line: blockLine }
        break
      }
    }

    let targetPreviewScroll = 0
    if (prevBlock && nextBlock) {
      const prevTop = getRelativeOffsetTop(prevBlock.element, preview)
      const nextTop = getRelativeOffsetTop(nextBlock.element, preview)
      const lineDelta = Math.max(1, nextBlock.line - prevBlock.line)
      const progress = (targetLine - prevBlock.line) / lineDelta
      targetPreviewScroll = prevTop + progress * (nextTop - prevTop)
    } else if (prevBlock) {
      const prevTop = getRelativeOffsetTop(prevBlock.element, preview)
      const remainingLines = Math.max(1, lines.length - prevBlock.line)
      const progress = Math.min(1, (targetLine - prevBlock.line) / remainingLines)
      targetPreviewScroll = prevTop + progress * (maxPreviewScroll - prevTop)
    } else if (nextBlock) {
      const nextTop = getRelativeOffsetTop(nextBlock.element, preview)
      const progress = targetLine / Math.max(1, nextBlock.line)
      targetPreviewScroll = progress * nextTop
    } else {
      targetPreviewScroll = (scrollTop / maxEditorScroll) * maxPreviewScroll
    }

    preview.scrollTop = Math.max(0, Math.min(maxPreviewScroll, targetPreviewScroll))
  }, [syncScroll, viewMode, lines.length])

  // Handle synchronized scrolling between editor and preview
  const handleEditorScroll = (e) => {
    // 1. Always keep numerical gutter in perfect sync
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.target.scrollTop
    }

    // 2. If sync scroll is disabled by user setting or not in split mode, exit early
    if (!syncScroll || viewMode !== 'split') return
    if (isSyncingRef.current === 'preview') return

    // 3. Prevent feedback loop
    isSyncingRef.current = 'editor'
    clearTimeout(syncTimeoutRef.current)
    syncTimeoutRef.current = setTimeout(() => {
      isSyncingRef.current = null
    }, 70)

    const editor = e.target
    const preview = previewRef.current
    if (!preview) return

    const editorScrollTop = editor.scrollTop
    const maxEditorScroll = editor.scrollHeight - editor.clientHeight
    const maxPreviewScroll = preview.scrollHeight - preview.clientHeight

    if (maxEditorScroll <= 0 || maxPreviewScroll <= 0) return

    // Fast path: Snap cleanly at absolute top and bottom
    if (editorScrollTop <= 5) {
      preview.scrollTop = 0
      return
    }
    if (editorScrollTop >= maxEditorScroll - 10) {
      preview.scrollTop = maxPreviewScroll
      return
    }

    // Find the fractional line number currently visible at top of editor
    const anchors = editor.querySelectorAll('.editor-line-anchor')
    let targetLine = 1

    if (anchors && anchors.length > 0) {
      let low = 0
      let high = anchors.length - 1
      let matchIdx = 0

      while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        const midTop = getRelativeOffsetTop(anchors[mid], editor)
        if (midTop <= editorScrollTop) {
          matchIdx = mid
          low = mid + 1
        } else {
          high = mid - 1
        }
      }

      const currAnchor = anchors[matchIdx]
      const nextAnchor = anchors[matchIdx + 1]
      const currLine = parseInt(currAnchor.getAttribute('data-line') || '1', 10)

      if (nextAnchor) {
        const currTop = getRelativeOffsetTop(currAnchor, editor)
        const nextTop = getRelativeOffsetTop(nextAnchor, editor)
        const lineSpan = Math.max(1, nextTop - currTop)
        const progress = Math.min(1, Math.max(0, (editorScrollTop - currTop) / lineSpan))
        targetLine = currLine + progress
      } else {
        targetLine = currLine
      }
    } else {
      targetLine = (editorScrollTop / maxEditorScroll) * lines.length
    }

    // Map targetLine to exact element in the Preview pane
    const previewBlocks = preview.querySelectorAll('[data-source-line]')
    if (!previewBlocks || previewBlocks.length === 0) {
      preview.scrollTop = (editorScrollTop / maxEditorScroll) * maxPreviewScroll
      return
    }

    let prevBlock = null
    let nextBlock = null

    for (let i = 0; i < previewBlocks.length; i++) {
      const block = previewBlocks[i]
      const blockLine = parseInt(block.getAttribute('data-source-line') || '0', 10)
      if (!blockLine) continue

      if (blockLine <= targetLine) {
        prevBlock = { element: block, line: blockLine }
      } else if (!nextBlock) {
        nextBlock = { element: block, line: blockLine }
        break
      }
    }

    let targetPreviewScroll = 0
    if (prevBlock && nextBlock) {
      const prevTop = getRelativeOffsetTop(prevBlock.element, preview)
      const nextTop = getRelativeOffsetTop(nextBlock.element, preview)
      const lineDelta = Math.max(1, nextBlock.line - prevBlock.line)
      const progress = (targetLine - prevBlock.line) / lineDelta
      targetPreviewScroll = prevTop + progress * (nextTop - prevTop)
    } else if (prevBlock) {
      const prevTop = getRelativeOffsetTop(prevBlock.element, preview)
      const remainingLines = Math.max(1, lines.length - prevBlock.line)
      const progress = Math.min(1, (targetLine - prevBlock.line) / remainingLines)
      targetPreviewScroll = prevTop + progress * (maxPreviewScroll - prevTop)
    } else if (nextBlock) {
      const nextTop = getRelativeOffsetTop(nextBlock.element, preview)
      const progress = targetLine / Math.max(1, nextBlock.line)
      targetPreviewScroll = progress * nextTop
    } else {
      targetPreviewScroll = (editorScrollTop / maxEditorScroll) * maxPreviewScroll
    }

    preview.scrollTop = Math.max(0, Math.min(maxPreviewScroll, targetPreviewScroll))
  }

  const handlePreviewScroll = (e) => {
    if (!syncScroll || viewMode !== 'split') return
    if (isSyncingRef.current === 'editor') return

    isSyncingRef.current = 'preview'
    clearTimeout(syncTimeoutRef.current)
    syncTimeoutRef.current = setTimeout(() => {
      isSyncingRef.current = null
    }, 70)

    const preview = e.target
    const isMonaco = editorEngine === 'monaco' && Boolean(monacoEditorRef.current)
    const editor = editorScrollRef.current
    if (!isMonaco && !editor) return

    const previewScrollTop = preview.scrollTop
    const maxPreviewScroll = preview.scrollHeight - preview.clientHeight
    const maxEditorScroll = isMonaco
      ? (monacoEditorRef.current.getScrollHeight() - monacoEditorRef.current.getLayoutInfo().height)
      : (editor.scrollHeight - editor.clientHeight)

    if (maxPreviewScroll <= 0 || maxEditorScroll <= 0) return

    // Fast path: Snap cleanly at absolute top and bottom
    if (previewScrollTop <= 5) {
      if (isMonaco) {
        monacoEditorRef.current.setScrollTop(0)
      } else {
        editor.scrollTop = 0
        if (gutterRef.current) gutterRef.current.scrollTop = 0
      }
      return
    }
    if (previewScrollTop >= maxPreviewScroll - 10) {
      if (isMonaco) {
        monacoEditorRef.current.setScrollTop(maxEditorScroll)
      } else {
        editor.scrollTop = maxEditorScroll
        if (gutterRef.current) gutterRef.current.scrollTop = maxEditorScroll
      }
      return
    }

    // Find the preview element visible at previewScrollTop
    const previewBlocks = preview.querySelectorAll('[data-source-line]')
    if (!previewBlocks || previewBlocks.length === 0) {
      const targetScroll = (previewScrollTop / maxPreviewScroll) * maxEditorScroll
      if (isMonaco) {
        monacoEditorRef.current.setScrollTop(targetScroll)
      } else {
        editor.scrollTop = targetScroll
        if (gutterRef.current) gutterRef.current.scrollTop = targetScroll
      }
      return
    }

    let prevBlock = null
    let nextBlock = null

    for (let i = 0; i < previewBlocks.length; i++) {
      const block = previewBlocks[i]
      const blockLine = parseInt(block.getAttribute('data-source-line') || '0', 10)
      if (!blockLine) continue
      const top = getRelativeOffsetTop(block, preview)

      if (top <= previewScrollTop) {
        prevBlock = { element: block, line: blockLine, top }
      } else if (!nextBlock) {
        nextBlock = { element: block, line: blockLine, top }
        break
      }
    }

    let targetLine = 1
    if (prevBlock && nextBlock) {
      const heightDelta = Math.max(1, nextBlock.top - prevBlock.top)
      const progress = (previewScrollTop - prevBlock.top) / heightDelta
      targetLine = prevBlock.line + progress * (nextBlock.line - prevBlock.line)
    } else if (prevBlock) {
      const progress = (previewScrollTop - prevBlock.top) / Math.max(1, maxPreviewScroll - prevBlock.top)
      targetLine = prevBlock.line + progress * (lines.length - prevBlock.line)
    } else if (nextBlock) {
      const progress = previewScrollTop / Math.max(1, nextBlock.top)
      targetLine = 1 + progress * (nextBlock.line - 1)
    } else {
      targetLine = (previewScrollTop / maxPreviewScroll) * lines.length
    }

    if (isMonaco) {
      monacoEditorRef.current.revealLineNearTop(Math.max(1, Math.floor(targetLine)))
      return
    }

    // Scroll editor to targetLine for classic editor
    const floorLine = Math.max(1, Math.floor(targetLine))
    const ceilLine = Math.min(lines.length, Math.ceil(targetLine))
    const anchorFloor = editor.querySelector(`.editor-line-anchor[data-line="${floorLine}"]`)
    const anchorCeil = editor.querySelector(`.editor-line-anchor[data-line="${ceilLine}"]`)

    let targetEditorScroll = 0
    if (anchorFloor && anchorCeil && floorLine !== ceilLine) {
      const topFloor = getRelativeOffsetTop(anchorFloor, editor)
      const topCeil = getRelativeOffsetTop(anchorCeil, editor)
      const progress = targetLine - floorLine
      targetEditorScroll = topFloor + progress * (topCeil - topFloor)
    } else if (anchorFloor) {
      targetEditorScroll = getRelativeOffsetTop(anchorFloor, editor)
    } else {
      targetEditorScroll = (previewScrollTop / maxPreviewScroll) * maxEditorScroll
    }

    editor.scrollTop = Math.max(0, Math.min(maxEditorScroll, targetEditorScroll))
    if (gutterRef.current) {
      gutterRef.current.scrollTop = editor.scrollTop
    }
  }

  // Smooth scroll to heading or line when target prop updates (in both Preview and Editor views)
  useEffect(() => {
    if (!scrollToHeadingTarget) return

    // 0. Support direct line jumping (from Diagnostics / Problems tab)
    if (typeof scrollToHeadingTarget === 'object' && scrollToHeadingTarget.line) {
      const lineNum = Number(scrollToHeadingTarget.line)
      const lineIdx = lineNum - 1

      if (editorEngine === 'monaco' && monacoEditorRef.current) {
        monacoEditorRef.current.revealLineInCenter(lineNum)
        setActiveLine(lineNum)
        return
      }

      if (editorScrollRef.current && lineIdx >= 0) {
        let scrollTargetY = 0
        if (lineHeights && lineHeights.length === lines.length) {
          scrollTargetY = lineHeights.slice(0, lineIdx).reduce((a, b) => a + b, 0)
        } else {
          const approxLineHeight = fontSize * 1.55
          scrollTargetY = lineIdx * approxLineHeight
        }
        editorScrollRef.current.scrollTop = Math.max(0, scrollTargetY - 40)
        setActiveLine(lineNum)
      }
      return
    }

    const targetSlug = typeof scrollToHeadingTarget === 'string'
      ? scrollToHeadingTarget.toLowerCase().replace(/[^\w\s-]/g, '').trim()
      : ''
    if (!targetSlug) return

    // 1. Scroll in Preview if available and visible
    if (previewRef.current && viewMode !== 'editor') {
      const headings = previewRef.current.querySelectorAll('h1, h2, h3, h4')
      for (const h of headings) {
        const headingText = h.textContent.toLowerCase().replace(/[^\w\s-]/g, '').trim()
        if (headingText.includes(targetSlug) || targetSlug.includes(headingText)) {
          h.scrollIntoView({ behavior: 'smooth', block: 'start' })
          h.classList.add('heading-highlight-flash')
          setTimeout(() => h.classList.remove('heading-highlight-flash'), 2000)
          break
        }
      }
    }

    // 2. Also scroll Editor buffer to the corresponding heading line
    if (editorEngine === 'monaco' && monacoEditorRef.current) {
      const lineIdx = lines.findIndex((l) => {
        const cleaned = l.toLowerCase().replace(/[^\w\s-]/g, '').trim()
        return (cleaned.startsWith('#') || cleaned.length > 0) && (cleaned.includes(targetSlug) || targetSlug.includes(cleaned))
      })
      if (lineIdx !== -1) {
        monacoEditorRef.current.revealLineInCenter(lineIdx + 1)
        setActiveLine(lineIdx + 1)
      }
      return
    }

    if (editorScrollRef.current) {
      const lineIdx = lines.findIndex((l) => {
        const cleaned = l.toLowerCase().replace(/[^\w\s-]/g, '').trim()
        return (cleaned.startsWith('#') || cleaned.length > 0) && (cleaned.includes(targetSlug) || targetSlug.includes(cleaned))
      })
      if (lineIdx !== -1) {
        let scrollTargetY = 0
        if (lineHeights && lineHeights.length === lines.length) {
          scrollTargetY = lineHeights.slice(0, lineIdx).reduce((a, b) => a + b, 0)
        } else {
          const approxLineHeight = fontSize * 1.55
          scrollTargetY = lineIdx * approxLineHeight
        }
        editorScrollRef.current.scrollTop = Math.max(0, scrollTargetY - 30)
        setActiveLine(lineIdx + 1)
      }
    }
  }, [scrollToHeadingTarget, lines, fontSize, viewMode, lineHeights, editorEngine])

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
          {/* Breadcrumbs Trail (VS Code / Antigravity IDE) */}
          <div className="editor-breadcrumbs-bar select-none">
            <span className="breadcrumb-segment" title="Workspace Root">
              <span className="material-symbols-outlined breadcrumb-icon">folder_open</span>
              <span>workspace</span>
            </span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-segment" title={`Active file: ${activeFile}`}>
              <span className="material-symbols-outlined breadcrumb-icon">description</span>
              <span>{activeFile}</span>
            </span>
            {activeHeading && (
              <>
                <span className="breadcrumb-separator">›</span>
                <span
                  className="breadcrumb-segment breadcrumb-heading"
                  title={`Active Section: ${activeHeading}`}
                >
                  <span className="material-symbols-outlined breadcrumb-icon text-primary">tag</span>
                  <span>{activeHeading}</span>
                </span>
              </>
            )}
            {previewPreset && (
              <>
                <span className="breadcrumb-separator">›</span>
                <span
                  className="breadcrumb-segment breadcrumb-preset-active"
                  title={`Currently previewing preset: ${previewPreset.title}`}
                >
                  <span className="material-symbols-outlined breadcrumb-icon text-amber">visibility</span>
                  <span>[Previewing Preset] {previewPreset.title}</span>
                </span>
              </>
            )}
          </div>

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

          {/* Floating Find & Replace Widget */}
          <FindReplaceWidget
            isOpen={findReplaceOpen}
            onClose={() => setFindReplaceOpen(false)}
            markdown={safeMarkdown}
            onMarkdownChange={onMarkdownChange}
            showReplaceInitially={findReplaceMode === 'replace'}
            onNavigateMatch={handleNavigateMatch}
          />

          {/* Editor Container with Gutter */}
          <div className="editor-surface">
            {editorEngine === 'monaco' ? (
              <MonacoEditorPane
                value={safeMarkdown}
                onChange={previewPreset ? () => {} : onMarkdownChange}
                fontSize={fontSize}
                wordWrap={wordWrap}
                showLineNumbers={showLineNumbers}
                tabSize={tabSize}
                themeMode={themeMode}
                onCursorChange={(pos) => {
                  setActiveLine(pos.line)
                  if (onCursorChange) {
                    onCursorChange({ line: pos.line, col: pos.col })
                  }
                }}
                onScroll={handleMonacoScroll}
                editorRef={monacoEditorRef}
              />
            ) : (
              <>
                {/* Inline / Floating Action Bar for Folded or Expanded Data URIs */}
                {lineFoldState && (
                  <div className={`editor-fold-bar ${lineFoldState.type === 'expanded' ? 'expanded' : ''}`}>
                    <span className="material-symbols-outlined text-sm">
                      {lineFoldState.type === 'folded' ? 'data_object' : 'unfold_less'}
                    </span>
                    <span>
                      {lineFoldState.type === 'folded'
                        ? `Data URI Collapsed (${lineFoldState.size})`
                        : `Data URI Expanded (${lineFoldState.size})`}
                    </span>
                    {lineFoldState.type === 'folded' ? (
                      <button
                        type="button"
                        className="editor-fold-bar-btn"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleExpandFold(lineFoldState.id)}
                        title="Click or press Alt+F to expand full Data URI"
                      >
                        <span className="material-symbols-outlined text-xs">unfold_more</span>
                        <span>Expand</span>
                        <kbd>Alt+F</kbd>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="editor-fold-bar-btn"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={handleFoldCurrent}
                        title="Fold back into short form (or click outside to auto-fold)"
                      >
                        <span className="material-symbols-outlined text-xs">unfold_less</span>
                        <span>Fold back</span>
                        <kbd>Alt+F</kbd>
                      </button>
                    )}
                  </div>
                )}

                {/* Numerical Line Gutter */}
                {showLineNumbers && (
                  <div className="editor-gutter custom-scrollbar" ref={gutterRef}>
                    {lines.map((_, idx) => {
                      const lineNum = idx + 1
                      const isCurrent = lineNum === activeLine
                      const lineH = lineHeights && lineHeights[idx] ? lineHeights[idx] : null
                      return (
                        <div
                          key={lineNum}
                          className={`gutter-line ${isCurrent ? 'active' : ''}`}
                          style={lineH ? { height: `${lineH}px`, minHeight: `${lineH}px` } : undefined}
                          onClick={() => handleGutterLineClick(lineNum)}
                          title={`Line ${lineNum}`}
                        >
                          <span className="gutter-num">{lineNum}</span>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Code Text Area */}
                <div
                  className={`editor-scroll-area custom-scrollbar ${wordWrap ? 'wrap' : 'nowrap'}`}
                  ref={editorScrollRef}
                  onScroll={handleEditorScroll}
                  onClick={handleEditorKeyUpOrClick}
                  onKeyUp={handleEditorKeyUpOrClick}
                  onKeyDown={handleEditorKeyDown}
                  onMouseUp={handleEditorKeyUpOrClick}
                  onBlur={handleEditorBlur}
                >
                  <Editor
                    value={safeMarkdown}
                    onValueChange={previewPreset ? () => {} : onMarkdownChange}
                    highlight={(code) => {
                      let highlighted = ''
                      if (Prism.languages.markdown) {
                        highlighted = Prism.highlight(code || '', Prism.languages.markdown, 'markdown')
                        highlighted = decorateFoldTokensInPrismHtml(highlighted)
                      } else {
                        highlighted = decorateFoldTokensInPrismHtml(code || '')
                      }
                      let lineIdx = 1
                      return (
                        `<span class="editor-line-anchor" data-line="1"></span>` +
                        highlighted.replace(/\n/g, () => {
                          lineIdx++
                          return `\n<span class="editor-line-anchor" data-line="${lineIdx}"></span>`
                        })
                      )
                    }}
                    onClick={handleEditorKeyUpOrClick}
                    onKeyUp={handleEditorKeyUpOrClick}
                    onKeyDown={handleEditorKeyDown}
                    padding={16}
                    tabSize={2}
                    insertSpaces={true}
                    className="ide-code-textarea"
                    textareaClassName="ide-code-inner-textarea"
                    preClassName="ide-code-inner-pre"
                    style={{
                      fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
                      fontSize: fontSize,
                      backgroundColor: 'transparent',
                      minHeight: '100%',
                      width: '100%',
                      outline: 'none',
                      border: 'none',
                      boxShadow: 'none'
                    }}
                  />
                </div>
              </>
            )}
          </div>
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
      <div
        className={`preview-pane custom-scrollbar ${viewMode === 'editor' ? 'pane-hidden-editor' : ''}`}
        ref={previewRef}
        onScroll={handlePreviewScroll}
        style={
          viewMode === 'split'
            ? orientation === 'vertical'
              ? { flex: `0 0 ${100 - splitRatio}%`, width: `${100 - splitRatio}%`, minWidth: '15%' }
              : { flex: `0 0 ${100 - splitRatio}%`, height: `${100 - splitRatio}%`, minHeight: '15%' }
            : undefined
        }
      >
        {/* Sticky Preset Live Preview Bar */}
        {previewPreset && (
          <div className="preset-live-preview-banner">
            <div className="preset-preview-banner-left">
              <span className="material-symbols-outlined preview-banner-icon pulse-icon">visibility</span>
              <div className="preview-banner-info">
                <span className="preview-banner-tag">LIVE PRESET PREVIEW</span>
                <span className="preview-banner-title">{previewPreset.title}</span>
              </div>
            </div>
            <div className="preset-preview-banner-right">
              <span className="preview-banner-hint">Browsing presets • Active document is safe</span>
              <button
                type="button"
                className="btn-preview-banner-load"
                onClick={() => onConfirmLoadPreset(previewPreset)}
                title={`Load "${previewPreset.title}" into active editor`}
              >
                <span className="material-symbols-outlined">bolt</span>
                <span>Load into Editor</span>
              </button>
              <button
                type="button"
                className="btn-preview-banner-exit"
                onClick={onExitPresetPreview}
                title="Exit preset preview and return to active document"
              >
                <span className="material-symbols-outlined">close</span>
                <span>Exit Preview</span>
              </button>
            </div>
          </div>
        )}

        <div className="preview-canvas markdown-body">
            {previewMarkdown.trim() ? (
              <ReactMarkdown
                remarkPlugins={[remarkGithubAlerts, remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
                urlTransform={(url) => {
                  if (!url) return ''
                  const trimmed = typeof url === 'string' ? url.trim() : ''
                  if (
                    trimmed.startsWith('data:image/') ||
                    trimmed.startsWith('http://') ||
                    trimmed.startsWith('https://') ||
                    trimmed.startsWith('/') ||
                    trimmed.startsWith('./') ||
                    trimmed.startsWith('../') ||
                    trimmed.startsWith('#') ||
                    trimmed.startsWith('mailto:')
                  ) {
                    return trimmed
                  }
                  return url
                }}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const line = node?.position?.start?.line
                    const match = /language-(\w+)/.exec(className || '')
                    const codeText = String(children).replace(/\n$/, '')
                    if (!inline && match && match[1] === 'mermaid') {
                      return (
                        <div data-source-line={line}>
                          <MermaidRenderer chart={codeText} />
                        </div>
                      )
                    }
                    return !inline && match ? (
                      <div data-source-line={line}>
                        <CodeBlock
                          language={match[1]}
                          value={codeText}
                          {...props}
                        />
                      </div>
                    ) : (
                      <code className={`inline-code-badge ${className || ''}`} {...props}>
                        {children}
                      </code>
                    )
                  },
                  p({ node, className, children, ...props }) {
                    const line = node?.position?.start?.line
                    if (props['data-alert-type'] || (className && className.includes('markdown-alert-title'))) {
                      const rawType = props['data-alert-type'] || String(children).toUpperCase()
                      const alertType = ALERT_ICONS[rawType] ? rawType : 'NOTE'
                      const titleText = alertType.charAt(0) + alertType.slice(1).toLowerCase()
                      return (
                        <p className={`markdown-alert-title ${className || ''}`} data-source-line={line} {...props}>
                          <span className="markdown-alert-icon">{ALERT_ICONS[alertType]}</span>
                          <span>{titleText}</span>
                        </p>
                      )
                    }
                    return <p className={className} data-source-line={line} {...props}>{children}</p>
                  },
                  h1({ node, children, ...props }) {
                    return (
                      <h1 className="preview-h1" data-source-line={node?.position?.start?.line} {...props}>
                        {children}
                      </h1>
                    )
                  },
                  h2({ node, children, ...props }) {
                    return (
                      <h2 className="preview-h2" data-source-line={node?.position?.start?.line} {...props}>
                        {children}
                      </h2>
                    )
                  },
                  h3({ node, children, ...props }) {
                    return (
                      <h3 className="preview-h3" data-source-line={node?.position?.start?.line} {...props}>
                        {children}
                      </h3>
                    )
                  },
                  h4({ node, children, ...props }) {
                    return (
                      <h4 data-source-line={node?.position?.start?.line} {...props}>
                        {children}
                      </h4>
                    )
                  },
                  h5({ node, children, ...props }) {
                    return (
                      <h5 data-source-line={node?.position?.start?.line} {...props}>
                        {children}
                      </h5>
                    )
                  },
                  h6({ node, children, ...props }) {
                    return (
                      <h6 data-source-line={node?.position?.start?.line} {...props}>
                        {children}
                      </h6>
                    )
                  },
                  table({ node, children, ...props }) {
                    return (
                      <div className="preview-table-container" data-source-line={node?.position?.start?.line}>
                        <table className="preview-table" {...props}>
                          {children}
                        </table>
                      </div>
                    )
                  },
                  blockquote({ node, children, ...props }) {
                    return (
                      <blockquote className="preview-callout" data-source-line={node?.position?.start?.line} {...props}>
                        {children}
                      </blockquote>
                    )
                  },
                  ul({ node, children, ...props }) {
                    return (
                      <ul data-source-line={node?.position?.start?.line} {...props}>
                        {children}
                      </ul>
                    )
                  },
                  ol({ node, children, ...props }) {
                    return (
                      <ol data-source-line={node?.position?.start?.line} {...props}>
                        {children}
                      </ol>
                    )
                  },
                  hr({ node, ...props }) {
                    return <hr data-source-line={node?.position?.start?.line} {...props} />
                  },
                  div({ node, children, ...props }) {
                    return <div data-source-line={node?.position?.start?.line} {...props}>{children}</div>
                  },
                  input({ node, ...props }) {
                    if (props.type === 'checkbox') {
                      return (
                        <input
                          type="checkbox"
                          className="preview-task-checkbox"
                          checked={props.checked}
                          readOnly
                        />
                      )
                    }
                    return <input {...props} />
                  },
                  img({ node, src, alt, title, ...props }) {
                    const actualSrc = src || (node && node.properties && node.properties.src) || ''
                    return (
                      <span data-source-line={node?.position?.start?.line} style={{ display: 'inline-block' }}>
                        <MarkdownImage src={actualSrc} alt={alt} title={title} {...props} />
                      </span>
                    )
                  }
                }}
              >
                {previewMarkdown}
              </ReactMarkdown>
            ) : (
              <div className="preview-empty-state">
                <span className="material-symbols-outlined empty-icon">edit_document</span>
                <h3>Document Canvas Ready</h3>
                <p>Start typing Markdown on the left, load a starter template, or click <strong>Create Documentation</strong> to build your skeleton.</p>
              </div>
            )}
          </div>
        </div>
    </div>
  )
}
