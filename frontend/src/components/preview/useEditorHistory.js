import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Dedicated in-memory Undo & Redo History System for the editor.
 */
export function useEditorHistory(activeFile, safeMarkdown, onMarkdownChange) {
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

  return {
    canUndo,
    canRedo,
    handleUndo,
    handleRedo
  }
}
