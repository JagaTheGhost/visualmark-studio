import {
  handleListContinuationOnEnter,
  handleTabIndentation,
  duplicateCurrentLine,
  moveLine
} from '../../utils/markdownEditorHelpers'
import {
  foldDataUris,
  unfoldDataUris,
  expandSingleVaultToken,
  hasFoldedTokens,
  hasLongDataUris,
  formatByteSize
} from '../../utils/dataUriFold'

export function useEditorKeyHandlers({
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
}) {
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

  return {
    handleExpandFold,
    handleFoldCurrent,
    checkLineFold,
    handleEditorBlur,
    handleEditorKeyUpOrClick,
    handleGutterLineClick,
    handleEditorKeyDown
  }
}
