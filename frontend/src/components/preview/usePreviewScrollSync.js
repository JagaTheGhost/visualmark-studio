import { useRef, useCallback, useEffect } from 'react'

export function usePreviewScrollSync({
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
}) {
  const isSyncingRef = useRef(null) // 'editor' | 'preview' | null
  const syncTimeoutRef = useRef(null)
  const lastHandledTargetRef = useRef(null)
  const linesRef = useRef(lines)
  linesRef.current = lines
  const lineHeightsRef = useRef(lineHeights)
  lineHeightsRef.current = lineHeights

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
  }, [syncScroll, viewMode, lines.length, previewRef])

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

  // Smooth scroll to heading or line when target prop updates
  useEffect(() => {
    if (!scrollToHeadingTarget) return

    // Compare with last handled target to prevent duplicate execution
    const targetKey = typeof scrollToHeadingTarget === 'object'
      ? (scrollToHeadingTarget.timestamp || `${scrollToHeadingTarget.line}_${scrollToHeadingTarget.text || scrollToHeadingTarget.slug}`)
      : String(scrollToHeadingTarget)

    if (lastHandledTargetRef.current === targetKey) return
    lastHandledTargetRef.current = targetKey

    let targetText = ''
    let lineNum = null

    if (typeof scrollToHeadingTarget === 'object') {
      if (scrollToHeadingTarget.line) {
        lineNum = Number(scrollToHeadingTarget.line)
      }
      if (scrollToHeadingTarget.text) {
        targetText = String(scrollToHeadingTarget.text)
      } else if (scrollToHeadingTarget.slug) {
        targetText = String(scrollToHeadingTarget.slug)
      }
    } else if (typeof scrollToHeadingTarget === 'string') {
      targetText = scrollToHeadingTarget
    }

    const targetSlug = targetText
      ? targetText.toLowerCase().replace(/[^\w\s-]/g, '').trim()
      : ''

    const currentLines = linesRef.current || []
    const currentLineHeights = lineHeightsRef.current || []

    // 1. Scroll in Monaco or Simple Editor buffer
    if (lineNum !== null && !isNaN(lineNum) && lineNum > 0) {
      if (editorEngine === 'monaco' && monacoEditorRef.current) {
        monacoEditorRef.current.revealLineInCenter(lineNum)
        try {
          monacoEditorRef.current.setPosition({ lineNumber: lineNum, column: 1 })
        } catch {}
        if (setActiveLine) setActiveLine(lineNum)
      } else if (editorScrollRef.current) {
        const lineIdx = lineNum - 1
        let scrollTargetY = 0
        if (currentLineHeights && currentLineHeights.length === currentLines.length) {
          scrollTargetY = currentLineHeights.slice(0, lineIdx).reduce((a, b) => a + b, 0)
        } else {
          const approxLineHeight = fontSize * 1.55
          scrollTargetY = lineIdx * approxLineHeight
        }
        editorScrollRef.current.scrollTop = Math.max(0, scrollTargetY - 40)
        if (setActiveLine) setActiveLine(lineNum)
      }
    } else if (targetSlug) {
      const lineIdx = currentLines.findIndex((l) => {
        const cleaned = l.toLowerCase().replace(/[^\w\s-]/g, '').trim()
        return (cleaned.startsWith('#') || cleaned.length > 0) && (cleaned.includes(targetSlug) || targetSlug.includes(cleaned))
      })
      if (lineIdx !== -1) {
        const targetLine = lineIdx + 1
        if (editorEngine === 'monaco' && monacoEditorRef.current) {
          monacoEditorRef.current.revealLineInCenter(targetLine)
          try {
            monacoEditorRef.current.setPosition({ lineNumber: targetLine, column: 1 })
          } catch {}
          if (setActiveLine) setActiveLine(targetLine)
        } else if (editorScrollRef.current) {
          let scrollTargetY = 0
          if (currentLineHeights && currentLineHeights.length === currentLines.length) {
            scrollTargetY = currentLineHeights.slice(0, lineIdx).reduce((a, b) => a + b, 0)
          } else {
            const approxLineHeight = fontSize * 1.55
            scrollTargetY = lineIdx * approxLineHeight
          }
          editorScrollRef.current.scrollTop = Math.max(0, scrollTargetY - 30)
          if (setActiveLine) setActiveLine(targetLine)
        }
      }
    }

    // 2. Scroll in Preview if available and visible
    if (previewRef.current && viewMode !== 'editor' && targetSlug) {
      const headings = previewRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6')
      for (const h of headings) {
        const headingText = (h.textContent || '').toLowerCase().replace(/[^\w\s-]/g, '').trim()
        const headingId = (h.id || '').toLowerCase().replace(/[^\w\s-]/g, '').trim()
        if (
          (headingText && (headingText.includes(targetSlug) || targetSlug.includes(headingText))) ||
          (headingId && (headingId.includes(targetSlug) || targetSlug.includes(headingId)))
        ) {
          h.scrollIntoView({ behavior: 'smooth', block: 'start' })
          h.classList.add('heading-highlight-flash')
          setTimeout(() => h.classList.remove('heading-highlight-flash'), 2000)
          break
        }
      }
    }
  }, [scrollToHeadingTarget, fontSize, viewMode, editorEngine, setActiveLine, monacoEditorRef, editorScrollRef, previewRef])

  return {
    handleMonacoScroll,
    handleEditorScroll,
    handlePreviewScroll,
    getRelativeOffsetTop
  }
}
