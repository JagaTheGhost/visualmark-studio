import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import MermaidRenderer from '../MermaidRenderer'
import MarkdownImage from './MarkdownImage'
import CodeBlock from './CodeBlock'
import { ALERT_ICONS, remarkGithubAlerts } from './PreviewAlerts'

export default function LivePreviewPane({
  previewRef,
  previewMarkdown = '',
  previewPreset = null,
  onConfirmLoadPreset = () => {},
  onExitPresetPreview = () => {},
  onScroll,
  viewMode = 'split',
  orientation = 'vertical',
  splitRatio = 50,
  workspaceDirectory = null,
  activeFile = null
}) {
  return (
    <div
      className={`preview-pane custom-scrollbar ${viewMode === 'editor' ? 'pane-hidden-editor' : ''}`}
      ref={previewRef}
      onScroll={onScroll}
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
              if (!url || typeof url !== 'string') return ''
              const trimmed = url.replace(/[\r\n\t]/g, '').trim()
              const lower = trimmed.toLowerCase()
              if (
                lower.startsWith('javascript:') ||
                lower.startsWith('vbscript:') ||
                lower.startsWith('data:text/html') ||
                lower.startsWith('file:')
              ) {
                return ''
              }
              if (
                trimmed.startsWith('data:image/') ||
                trimmed.startsWith('http://') ||
                trimmed.startsWith('https://') ||
                trimmed.startsWith('/') ||
                trimmed.startsWith('./') ||
                trimmed.startsWith('../') ||
                trimmed.startsWith('#') ||
                trimmed.startsWith('mailto:') ||
                (!trimmed.includes(':') && !trimmed.startsWith('//'))
              ) {
                return trimmed
              }
              return ''
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
                    <MarkdownImage
                      src={actualSrc}
                      alt={alt}
                      title={title}
                      workspaceDirectory={workspaceDirectory}
                      activeFile={activeFile}
                      {...props}
                    />
                  </span>
                )
              },
              video({ node, children, ...props }) {
                return (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    style={{ maxWidth: '100%', borderRadius: '8px', ...props.style }}
                    {...props}
                  >
                    {children}
                  </video>
                )
              },
              svg({ node, children, ...props }) {
                return (
                  <svg
                    data-source-line={node?.position?.start?.line}
                    style={{ maxWidth: '100%', height: 'auto', ...props.style }}
                    {...props}
                  >
                    {children}
                  </svg>
                )
              },
              text({ node, children, ...props }) {
                const cleanProps = {}
                const style = { ...(props.style || {}) }
                for (const [k, v] of Object.entries(props)) {
                  if (k === 'font-family') style.fontFamily = v
                  else if (k === 'font-size') style.fontSize = v
                  else if (k === 'font-weight') style.fontWeight = v
                  else if (k === 'letter-spacing') style.letterSpacing = v
                  else if (k === 'text-transform') style.textTransform = v
                  else if (k === 'text-anchor') cleanProps.textAnchor = v
                  else if (k === 'dominant-baseline') cleanProps.dominantBaseline = v
                  else if (k === 'fill-opacity') cleanProps.fillOpacity = v
                  else if (k === 'stroke-width') cleanProps.strokeWidth = v
                  else if (k === 'stroke-opacity') cleanProps.strokeOpacity = v
                  else cleanProps[k] = v
                }
                cleanProps.style = style
                return <text {...cleanProps}>{children}</text>
              },
              tspan({ node, children, ...props }) {
                const cleanProps = {}
                const style = { ...(props.style || {}) }
                for (const [k, v] of Object.entries(props)) {
                  if (k === 'font-family') style.fontFamily = v
                  else if (k === 'font-size') style.fontSize = v
                  else if (k === 'font-weight') style.fontWeight = v
                  else if (k === 'letter-spacing') style.letterSpacing = v
                  else if (k === 'text-transform') style.textTransform = v
                  else if (k === 'text-anchor') cleanProps.textAnchor = v
                  else if (k === 'dominant-baseline') cleanProps.dominantBaseline = v
                  else cleanProps[k] = v
                }
                cleanProps.style = style
                return <tspan {...cleanProps}>{children}</tspan>
              },
              a({ node, href, children, ...props }) {
                const trimmedHref = (typeof href === 'string') ? href.trim() : ''
                const isSafe =
                  trimmedHref.startsWith('http://') ||
                  trimmedHref.startsWith('https://') ||
                  trimmedHref.startsWith('mailto:') ||
                  trimmedHref.startsWith('#') ||
                  trimmedHref.startsWith('/') ||
                  trimmedHref.startsWith('./') ||
                  trimmedHref.startsWith('../')
                const safeHref = isSafe ? trimmedHref : '#'
                const isExternal = safeHref.startsWith('http://') || safeHref.startsWith('https://')

                return (
                  <a
                    href={safeHref}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    onClick={(e) => {
                      if (isExternal) {
                        e.preventDefault()
                        if (window.electronAPI?.openExternalUrl) {
                          window.electronAPI.openExternalUrl(safeHref)
                        } else {
                          window.open(safeHref, '_blank', 'noopener,noreferrer')
                        }
                      }
                    }}
                    {...props}
                  >
                    {children}
                  </a>
                )
              },
              script: () => null,
              iframe: () => null,
              object: () => null,
              embed: () => null,
              form: () => null
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
  )
}
