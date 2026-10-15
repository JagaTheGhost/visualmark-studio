import { useState, useCallback } from 'react'
import { foldDataUris } from '../../utils/dataUriFold'

export function useEditorExternalDrop({
  editorEngine,
  monacoEditorRef,
  editorScrollRef,
  safeMarkdown,
  onMarkdownChange,
  workspaceDirectory,
  showToast,
  onDropExternalFile
}) {
  const [isEditorDragOver, setIsEditorDragOver] = useState(false)

  // Helper to insert snippet at active editor cursor (Monaco or Textarea)
  const insertSnippetAtCursor = useCallback((snippet) => {
    if (editorEngine === 'monaco' && monacoEditorRef?.current) {
      const editor = monacoEditorRef.current
      const model = editor.getModel()
      if (model) {
        const selection = editor.getSelection()
        editor.executeEdits('drag-drop-insert', [{
          range: selection,
          text: snippet,
          forceMoveMarkers: true
        }])
        return
      }
    }

    const scrollContainer = editorScrollRef?.current
    const textarea = scrollContainer?.querySelector ? scrollContainer.querySelector('textarea') : scrollContainer
    const start = textarea?.selectionStart ?? safeMarkdown.length
    const updated = safeMarkdown.substring(0, start) + snippet + safeMarkdown.substring(start)
    onMarkdownChange(updated)
  }, [editorEngine, monacoEditorRef, editorScrollRef, safeMarkdown, onMarkdownChange])

  // Drag-and-drop handling for external files on editor surface
  const handleEditorDragOver = useCallback((e) => {
    if (e.dataTransfer.types && (e.dataTransfer.types.includes('Files') || e.dataTransfer.files.length > 0)) {
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = 'copy'
      setIsEditorDragOver(true)
    }
  }, [])

  const handleEditorDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsEditorDragOver(false)
    }
  }, [])

  const handleEditorDrop = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditorDragOver(false)

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const isImage = /\.(png|jpe?g|gif|svg|webp|bmp|avif)$/i.test(file.name)
      if (isImage) {
        let imported = false
        if (typeof window !== 'undefined' && window.electronAPI?.copyFileDirect && workspaceDirectory?.path && file.path) {
          try {
            const assetsDir = `${workspaceDirectory.path.replace(/[\\/]+$/, '')}/assets`
            if (window.electronAPI.createFolderDirect) {
              await window.electronAPI.createFolderDirect(assetsDir)
            }
            const destPath = `${assetsDir}/${file.name}`
            const copyRes = await window.electronAPI.copyFileDirect(file.path, destPath)
            if (copyRes?.success) {
              const snippet = `\n![${file.name.replace(/\.[^/.]+$/, '')}](./assets/${file.name})\n`
              insertSnippetAtCursor(snippet)
              window.dispatchEvent(new CustomEvent('workspace-tree-refresh'))
              if (showToast) showToast(`✓ Imported ${file.name} to ./assets/ and inserted image`, 'success')
              imported = true
            }
          } catch (err) {
            console.warn('Error copying image to workspace assets:', err)
          }
        }
        if (!imported) {
          const reader = new FileReader()
          reader.onload = (ev) => {
            const folded = foldDataUris(ev.target.result)
            const snippet = `\n![${file.name.replace(/\.[^/.]+$/, '')}](${folded})\n`
            insertSnippetAtCursor(snippet)
            if (showToast) showToast(`✓ Inserted image ${file.name}`, 'info')
          }
          reader.readAsDataURL(file)
        }
      } else {
        if (onDropExternalFile) {
          onDropExternalFile(file)
        }
      }
    }
  }, [workspaceDirectory, insertSnippetAtCursor, onDropExternalFile, showToast])

  return {
    isEditorDragOver,
    insertSnippetAtCursor,
    handleEditorDragOver,
    handleEditorDragLeave,
    handleEditorDrop
  }
}
