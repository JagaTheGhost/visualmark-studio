import { useState, useCallback, useEffect, useLayoutEffect } from 'react'

export function useLineMeasurement({
  wordWrap,
  fontSize,
  safeMarkdown,
  editorScrollRef
}) {
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
  }, [wordWrap, fontSize, editorScrollRef])

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
  }, [wordWrap, measureLineHeights, editorScrollRef])

  // Re-measure when web fonts finish loading
  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        measureLineHeights()
      })
    }
  }, [measureLineHeights])

  return { lineHeights, measureLineHeights }
}
