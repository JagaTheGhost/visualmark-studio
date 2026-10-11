import React, { useEffect, useRef, useState } from 'react'

let mermaidInstance = null
let mermaidPromise = null

async function getMermaid() {
  if (mermaidInstance) return mermaidInstance
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((m) => {
      const mModule = m.default || m
      mModule.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          darkMode: true,
          background: '#10141a',
          primaryColor: '#262a31',
          primaryTextColor: '#dfe2eb',
          primaryBorderColor: '#6366f1',
          lineColor: '#7bd0ff',
          secondaryColor: '#181c22',
          tertiaryColor: '#1c2026',
          fontFamily: 'Inter, JetBrains Mono, monospace',
          fontSize: '13px'
        },
        securityLevel: 'loose'
      })
      mermaidInstance = mModule
      return mermaidInstance
    })
  }
  return mermaidPromise
}

export default function MermaidRenderer({ chart }) {
  const containerRef = useRef(null)
  const [svgContent, setSvgContent] = useState('')
  const [renderError, setRenderError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let isMounted = true
    const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`

    const renderChart = async () => {
      if (!chart || !chart.trim()) {
        setSvgContent('')
        setRenderError(null)
        return
      }

      try {
        setRenderError(null)
        const mermaid = await getMermaid()
        const { svg } = await mermaid.render(uniqueId, chart.trim())
        if (isMounted) {
          setSvgContent(svg)
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Mermaid rendering syntax error:', err)
          setRenderError(err.message || 'Syntax error in Mermaid diagram')
        }
      }
    }

    renderChart()

    return () => {
      isMounted = false
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
