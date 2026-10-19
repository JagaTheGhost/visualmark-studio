import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import { saveAs } from 'file-saver'
import MermaidRenderer from '../../MermaidRenderer'
import { DIAGRAM_THEMES } from './diagramConstants'

const DiagramCanvas = forwardRef(function DiagramCanvas(
  {
    chart = '',
    themeKey = 'midnight',
    onZoomChange,
    onNodeClick,
    selectedNodeSymbol = '',
    selectedNodeText = ''
  },
  ref
) {
  const [zoomLevel, setZoomLevel] = useState(100)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [startPan, setStartPan] = useState({ x: 0, y: 0 })
  const dragDistRef = useRef(0)

  const containerRef = useRef(null)
  const stageRef = useRef(null)

  const updateZoom = useCallback((newZoom) => {
    const clamped = Math.min(250, Math.max(25, newZoom))
    setZoomLevel(clamped)
    if (typeof onZoomChange === 'function') {
      onZoomChange(clamped)
    }
  }, [onZoomChange])

  // Reset pan & zoom
  const handleReset = useCallback(() => {
    updateZoom(100)
    setPan({ x: 0, y: 0 })
  }, [updateZoom])

  // Center & Fit to the full available viewport
  const handleFit = useCallback(() => {
    setPan({ x: 0, y: 0 })
    if (stageRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const svgEl = stageRef.current.querySelector('svg')
      if (svgEl && containerRect.width > 0 && containerRect.height > 0) {
        const svgBbox = svgEl.getBoundingClientRect()
        const currentScale = Math.max(zoomLevel / 100, 0.1)
        const naturalWidth = (svgBbox.width || 800) / currentScale
        const naturalHeight = (svgBbox.height || 600) / currentScale
        const padding = 64
        const scaleX = (containerRect.width - padding) / (naturalWidth || 800)
        const scaleY = (containerRect.height - padding) / (naturalHeight || 600)
        const idealScale = Math.min(Math.max(Math.floor(Math.min(scaleX, scaleY) * 100), 25), 160)
        updateZoom(idealScale)
      } else {
        updateZoom(100)
      }
    }
  }, [updateZoom, zoomLevel])

  // Auto-fit to utilize full stage when diagram changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFit()
    }, 200)
    return () => clearTimeout(timer)
  }, [chart])

  // Active Selected Node Canvas Glow Highlight
  useEffect(() => {
    if (!stageRef.current) return
    const svgEl = stageRef.current.querySelector('svg')
    if (!svgEl) return

    svgEl.querySelectorAll('.canvas-selected-node').forEach((el) => {
      el.classList.remove('canvas-selected-node')
    })

    if (!selectedNodeSymbol && !selectedNodeText) return

    let targetEl = null
    if (selectedNodeSymbol) {
      targetEl = svgEl.querySelector(`[id*="${selectedNodeSymbol}"]`)
    }

    if (!targetEl && selectedNodeText) {
      const nodes = svgEl.querySelectorAll(
        'g.node, g.actor, g.note, text.messageText, text.noteText, g.entityBox, g.er, .er.entityBox, g.classGroup, .statediagram-state, .mindmap-node'
      )
      const cleanTarget = selectedNodeText.trim().toLowerCase()
      for (const el of nodes) {
        if (el.textContent.trim().toLowerCase().includes(cleanTarget)) {
          targetEl = el
          break
        }
      }
    }

    if (targetEl) {
      targetEl.classList.add('canvas-selected-node')
    }
  }, [selectedNodeSymbol, selectedNodeText, chart])

  // Mouse wheel zoom
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) {
      e.preventDefault()
      const delta = e.deltaY < 0 ? 10 : -10
      updateZoom(zoomLevel + delta)
    }
  }

  const startClientPosRef = useRef({ x: 0, y: 0 })

  // Traverses up from click target to find the parent Mermaid node (crosses foreignObject boundary)
  const findNodeElement = (target) => {
    let curr = target
    while (curr && curr !== document.body && curr.nodeType === 1) {
      if (curr.classList && (
        curr.classList.contains('node') ||
        curr.classList.contains('actor') ||
        curr.classList.contains('messageText') ||
        curr.classList.contains('note') ||
        curr.classList.contains('noteText') ||
        curr.classList.contains('entityBox') ||
        curr.classList.contains('er') ||
        curr.classList.contains('classGroup') ||
        curr.classList.contains('statediagram-state') ||
        curr.classList.contains('mindmap-node')
      )) {
        return curr
      }
      const id = curr.getAttribute ? curr.getAttribute('id') : ''
      if (id && (id.startsWith('flowchart-') || id.startsWith('node-') || id.startsWith('classId-') || id.startsWith('entity-'))) {
        return curr
      }
      curr = curr.parentElement || curr.parentNode
    }
    return null
  }

  // Pan & Click handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('button, select, input, textarea')) return
    setIsPanning(true)
    startClientPosRef.current = { x: e.clientX, y: e.clientY }
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e) => {
    if (!isPanning) return
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    })
  }

  const handleMouseUp = (e) => {
    setIsPanning(false)
    const dist = Math.hypot(
      e.clientX - startClientPosRef.current.x,
      e.clientY - startClientPosRef.current.y
    )
    if (dist < 10 && typeof onNodeClick === 'function') {
      const nodeEl = findNodeElement(e.target)
      if (nodeEl) {
        const rawId = nodeEl.getAttribute('id') || ''
        const text = nodeEl.textContent.trim()
        const numMatch = rawId.match(/N(\d+)_/)
        const index = numMatch ? parseInt(numMatch[1], 10) - 1 : undefined
        onNodeClick({ rawId, text, index, element: nodeEl })
      }
    }
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsPanning(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  // Export SVG
  const handleExportSvg = useCallback(async () => {
    if (!stageRef.current) return
    const svgEl = stageRef.current.querySelector('svg')
    if (!svgEl) return

    try {
      const svgXml = new XMLSerializer().serializeToString(svgEl)
      if (typeof window !== 'undefined' && window.electronAPI?.saveTextExportDialog) {
        await window.electronAPI.saveTextExportDialog({
          defaultPath: 'architecture-diagram.svg',
          filters: [{ name: 'SVG Vector Image', extensions: ['svg'] }, { name: 'All Files', extensions: ['*'] }],
          content: svgXml
        })
        return
      }
      const blob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' })
      saveAs(blob, 'architecture-diagram.svg')
    } catch (err) {
      console.error('Failed to export SVG:', err)
    }
  }, [])

  // Export Raster PNG (2x or 4x Retina)
  const handleExportPng = useCallback((scale = 2) => {
    if (!stageRef.current) return
    const svgEl = stageRef.current.querySelector('svg')
    if (!svgEl) return

    try {
      const svgXml = new XMLSerializer().serializeToString(svgEl)
      const svgBlob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' })
      const URL = window.URL || window.webkitURL || window
      const blobURL = URL.createObjectURL(svgBlob)
      const img = new Image()

      img.onload = () => {
        const bbox = svgEl.getBoundingClientRect()
        const width = Math.max(bbox.width || 800, 400)
        const height = Math.max(bbox.height || 600, 300)

        const canvas = document.createElement('canvas')
        canvas.width = width * scale
        canvas.height = height * scale
        const ctx = canvas.getContext('2d')

        const currentTheme = DIAGRAM_THEMES.find((t) => t.id === themeKey)
        ctx.fillStyle = currentTheme ? currentTheme.bg : '#090d16'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        if (typeof window !== 'undefined' && window.electronAPI?.saveBinaryDialog) {
          const base64Data = canvas.toDataURL('image/png').split(',')[1]
          window.electronAPI.saveBinaryDialog({
            defaultPath: scale >= 4 ? 'architecture-diagram-4k.png' : 'architecture-diagram.png',
            filters: [{ name: 'PNG Image', extensions: ['png'] }, { name: 'All Files', extensions: ['*'] }],
            base64Data
          })
          URL.revokeObjectURL(blobURL)
        } else {
          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, scale >= 4 ? 'architecture-diagram-4k.png' : 'architecture-diagram.png')
            }
            URL.revokeObjectURL(blobURL)
          }, 'image/png')
        }
      }

      img.onerror = (err) => {
        console.error('Error rasterizing SVG to PNG:', err)
        URL.revokeObjectURL(blobURL)
      }

      img.src = blobURL
    } catch (err) {
      console.error('Failed to export PNG:', err)
    }
  }, [themeKey])

  // Expose imperative API for parent StudioShell toolbar
  useImperativeHandle(ref, () => ({
    zoomIn: () => updateZoom(zoomLevel + 10),
    zoomOut: () => updateZoom(zoomLevel - 10),
    reset: handleReset,
    fit: handleFit,
    exportSvg: handleExportSvg,
    exportPng: (scale = 2) => handleExportPng(scale),
    getZoom: () => zoomLevel
  }), [updateZoom, zoomLevel, handleReset, handleFit, handleExportSvg, handleExportPng])

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
        position: 'relative',
        cursor: isPanning ? 'grabbing' : 'grab',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Pan & Zoom Transform Layer with direct plain Mermaid rendering */}
      <div
        ref={stageRef}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel / 100})`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 100ms ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        <MermaidRenderer chart={chart} plain={true} />
      </div>

      {/* Subtle Pan Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '12px',
          pointerEvents: 'none',
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.35)',
          fontFamily: 'monospace',
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '2px 8px',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        Drag background to Pan • Ctrl + Scroll to Zoom
      </div>
    </div>
  )
})

export default DiagramCanvas
