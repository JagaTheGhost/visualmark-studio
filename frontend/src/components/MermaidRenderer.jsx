import React, { useEffect, useRef, useState } from 'react'
import { sanitizeSvg } from '../utils/securityUtils'

let mermaidInstance = null
let mermaidPromise = null

async function getMermaid() {
  if (mermaidInstance) return mermaidInstance
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((m) => {
      const mModule = m.default || m
      mModule.initialize({
        startOnLoad: false,
        suppressErrorRendering: true,
        theme: 'base',
        themeVariables: {
          darkMode: true,
          background: '#10141a',
          primaryColor: '#262a31',
          primaryTextColor: '#dfe2eb',
          textColor: '#dfe2eb',
          nodeTextColor: '#dfe2eb',
          primaryBorderColor: '#6366f1',
          lineColor: '#7bd0ff',
          secondaryColor: '#181c22',
          tertiaryColor: '#1c2026',
          fontFamily: 'Inter, JetBrains Mono, monospace',
          fontSize: '13px'
        },
        securityLevel: 'strict'
      })
      mermaidInstance = mModule
      return mermaidInstance
    })
  }
  return mermaidPromise
}

export default function MermaidRenderer({ chart, plain = false }) {
  const containerRef = useRef(null)
  const [svgContent, setSvgContent] = useState('')
  const [renderError, setRenderError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let isMounted = true
    const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`

    // Remove any previously injected stray Mermaid error DOM nodes from document.body
    if (typeof document !== 'undefined') {
      document.querySelectorAll('svg[id^="dmermaid-svg-"], div[id^="dmermaid-svg-"], [id^="dmermaid-"]').forEach((el) => el.remove())
    }

    const renderChart = async () => {
      if (!chart || !chart.trim()) {
        setSvgContent('')
        setRenderError(null)
        return
      }

      const trimmedChart = chart.trim()

      try {
        setRenderError(null)
        const mermaid = await getMermaid()

        // 1. Validate syntax with parse() first to avoid polluting the DOM with error SVGs
        if (typeof mermaid.parse === 'function') {
          await mermaid.parse(trimmedChart)
        }

        // 2. Render only if parse succeeded and sanitize generated SVG before DOM injection
        const { svg } = await mermaid.render(uniqueId, trimmedChart)
        if (isMounted) {
          setSvgContent(sanitizeSvg(svg))
        }
      } catch (err) {
        // Remove any stray error elements Mermaid might have appended to document.body
        if (typeof document !== 'undefined') {
          document.querySelectorAll(`[id^="d${uniqueId}"], [id^="${uniqueId}"], svg[id^="dmermaid-svg-"], div[id^="dmermaid-svg-"]`).forEach((el) => el.remove())
        }
        if (isMounted) {
          console.warn('Mermaid rendering syntax error:', err)
          setRenderError(err.message || 'Syntax error in Mermaid diagram')
        }
      }
    }

    renderChart()

    return () => {
      isMounted = false
      if (typeof document !== 'undefined') {
        document.querySelectorAll(`[id^="d${uniqueId}"], [id^="${uniqueId}"]`).forEach((el) => el.remove())
      }
    }
  }, [chart])

  const handleCopySource = () => {
    navigator.clipboard.writeText(chart)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (renderError) {
    return (
      <div className="mermaid-error-card">
        <div className="mermaid-error-header">
          <span className="material-symbols-outlined text-amber">warning</span>
          <span>Mermaid Diagram Syntax Issue</span>
        </div>
        <p className="mermaid-error-msg">{renderError}</p>
        <pre className="mermaid-source-preview"><code>{chart}</code></pre>
      </div>
    )
  }

  if (plain) {
    return (
      <div
        ref={containerRef}
        className="mermaid-plain-viewport select-none"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    )
  }

  return (
    <div className="mermaid-wrapper select-none">
      <div className="mermaid-header">
        <span className="mermaid-badge">
          <span className="material-symbols-outlined icon-xs text-primary">schema</span>
          <span>Architecture Flowchart</span>
        </span>
        <button
          type="button"
          className="code-copy-btn"
          onClick={handleCopySource}
          title="Copy Mermaid diagram source"
        >
          <span className="material-symbols-outlined icon-copy-btn">
            {copied ? 'check' : 'content_copy'}
          </span>
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      <div
        ref={containerRef}
        className="mermaid-viewport custom-scrollbar"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  )
}
