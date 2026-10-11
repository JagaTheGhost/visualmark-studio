import { useState, useCallback } from 'react'

/**
 * Custom hook to enable smooth mouse drag resizing for two-column Studio layouts.
 * Persists the preferred column width to localStorage.
 */
export function useStudioSplit(defaultWidth = 500, min = 340, max = 850) {
  const [formWidth, setFormWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('ide_studio_form_width')
      return saved ? parseInt(saved, 10) : defaultWidth
    } catch {
      return defaultWidth
    }
  })
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
    const startX = e.clientX
    const startW = formWidth

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX
      const nextW = Math.max(min, Math.min(max, startW + delta))
      setFormWidth(nextW)
      try {
        localStorage.setItem('ide_studio_form_width', String(nextW))
      } catch {}
    }

    const onMouseUp = () => {
      setIsDragging(false)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [formWidth, min, max])

  const handleDoubleClick = useCallback(() => {
    setFormWidth(defaultWidth)
    try {
      localStorage.setItem('ide_studio_form_width', String(defaultWidth))
    } catch {}
  }, [defaultWidth])

  return { formWidth, isDragging, handleMouseDown, handleDoubleClick }
}
