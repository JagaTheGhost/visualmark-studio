import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import MermaidRenderer from '../MermaidRenderer'
import MarkdownImage from './MarkdownImage'
import MarkdownVideo from './MarkdownVideo'
import MarkdownAudio from './MarkdownAudio'
import { isSafeEmbedUrl } from '../../utils/mediaUtils'
import CodeBlock from './CodeBlock'
import { ALERT_ICONS, remarkGithubAlerts } from './PreviewAlerts'
import { sanitizeSvg } from '../../utils/securityUtils'

function escapeXml(unsafe = '') {
  return String(unsafe ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function hastToXml(node) {
  if (!node) return ''
  if (node.type === 'text') return escapeXml(node.value || '')
  if (node.type === 'raw') return node.value || ''
  if (node.type === 'element') {
    const tag = node.tagName || 'svg'
    let attrs = ''
    if (node.properties) {
      for (const [k, v] of Object.entries(node.properties)) {
        if (v === true) {
          attrs += ` ${k}`
        } else if (v !== false && v != null) {
          const val = Array.isArray(v) ? v.join(' ') : String(v)
          attrs += ` ${k}="${escapeXml(val)}"`
        }
      }
    }
    const childrenStr = (node.children || []).map(hastToXml).join('')
    const voidTags = ['path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'ellipse', 'stop', 'use', 'image']
    if (!childrenStr && voidTags.includes(tag.toLowerCase())) {
      return `<${tag}${attrs}/>`
    }
    return `<${tag}${attrs}>${childrenStr}</${tag}>`
  }
  return ''
}

export default function LivePreviewPane({
  previewRef,
  previewMarkdown = '',
  previewPreset = null,
  onConfirmLoadPreset = (_preset) => {},
  onExitPresetPreview = () => {},
  onScroll,
  viewMode = 'split',
  orientation = 'vertical',
  splitRatio = 50,
  workspaceDirectory = null,
  activeFile = ''
}) {
  const trimmed = previewMarkdown ? previewMarkdown.trim() : ''
  const isStandaloneSvg = Boolean(
    (typeof activeFile === 'string' && activeFile.toLowerCase().endsWith('.svg')) ||
    (trimmed.startsWith('<svg') && trimmed.includes('</svg>'))
  )

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
              <span className="preview-banner-title">{previewPreset?.title || ''}</span>
            </div>
          </div>
          <div className="preset-preview-banner-right">
            <span className="preview-banner-hint">Browsing presets ΓÇó Active document is safe</span>
            <button
              type="button"
              className="btn-preview-banner-load"
              onClick={() => previewPreset && onConfirmLoadPreset(previewPreset)}
              title={`Load "${previewPreset?.title || 'Preset'}" into active editor`}
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

      <div className="preview-canvas markdown-body" key={activeFile || 'canvas'}>
        {isStandaloneSvg ? (
          <div className="preview-standalone-svg-container" key={`svg-${activeFile}`}>
            <div className="preview-standalone-svg-artboard">
              <div
                className="preview-standalone-svg-wrapper"
                dangerouslySetInnerHTML={{ __html: sanitizeSvg(previewMarkdown) }}
              />
            </div>
          </div>
        ) : previewMarkdown.trim() ? (
          <ReactMarkdown
            remarkPlugins={[remarkGithubAlerts, remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            urlTransform={(url) => {
              if (!url || typeof url !== 'string') return ''
              const trimmedUrl = url.replace(/[\r\n\t]/g, '').trim()
              if (!trimmedUrl) return ''

              // 1. Allow standard web protocols (HTTP, HTTPS, mailto)
              if (/^https?:\/\//i.test(trimmedUrl) || /^mailto:/i.test(trimmedUrl)) {
                return trimmedUrl
              }

              // 2. Allow relative workspace paths, local disk paths, and in-page anchors
              if (
                trimmedUrl.startsWith('/') ||
                trimmedUrl.startsWith('./') ||
                trimmedUrl.startsWith('../') ||
                trimmedUrl.startsWith('#') ||
                /^[a-zA-Z]:[\\/]/.test(trimmedUrl) ||
                (!trimmedUrl.includes(':') && !trimmedUrl.startsWith('//'))
              ) {
                return trimmedUrl
              }

              // 3. Allow safe raster image, video, and audio data URIs
              if (/^data:(image\/(png|jpe?g|webp|gif|bmp|x-icon|avif|tiff|svg\+xml)|video\/(mp4|webm|ogg|quicktime|x-matroska|x-msvideo)|audio\/(mp3|wav|ogg|aac|m4a|webm|mpeg|flac));base64,/i.test(trimmedUrl)) {
                return trimmedUrl
              }

              // 4. Allow blob URIs for media playback
              if (/^blob:/i.test(trimmedUrl)) {
                return trimmedUrl
              }

              // 5. Safe SVG data URI with content inspection
              if (/^data:image\/svg\+xml/i.test(trimmedUrl)) {
                const lower = trimmedUrl.toLowerCase()
                if (!lower.includes('<script') && !lower.includes('javascript:') && !lower.includes('onload=') && !lower.includes('onerror=')) {
                  return trimmedUrl
                }
              }

              return ''
            }}
            components={{
              code({ node, className, children, ...props }) {
                const line = node?.position?.start?.line
                const match = /language-(\w+)/.exec(className || '')
                const inline = !match && !String(children).includes('\n')
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
                const alertAttr = props['data-alert-type']
                if (alertAttr || (className && className.includes('markdown-alert-title'))) {
                  const rawType = String(alertAttr || children).toUpperCase()
                  const alertType = Object.prototype.hasOwnProperty.call(ALERT_ICONS, rawType) ? rawType : 'NOTE'
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
                const isFull = props.width === '100%' || props.style?.width === '100%' || node?.properties?.width === '100%'
                return (
                  <span
                    data-source-line={node?.position?.start?.line}
                    style={{ display: isFull ? 'block' : 'inline-block', width: isFull ? '100%' : undefined }}
                  >
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
                const actualSrc = props.src || node?.properties?.src || ''
                return (
                  <span data-source-line={node?.position?.start?.line} style={{ display: 'block', width: '100%' }}>
                    <MarkdownVideo
                      src={actualSrc}
                      workspaceDirectory={workspaceDirectory}
                      activeFile={activeFile || ''}
                      {...props}
                    >
                      {children}
                    </MarkdownVideo>
                  </span>
                )
              },
              audio({ node, children, ...props }) {
                const actualSrc = props.src || node?.properties?.src || ''
                return (
                  <span data-source-line={node?.position?.start?.line} style={{ display: 'block', width: '100%' }}>
                    <MarkdownAudio
                      src={actualSrc}
                      workspaceDirectory={workspaceDirectory}
                      activeFile={activeFile || ''}
                      {...props}
                    >
                      {children}
                    </MarkdownAudio>
                  </span>
                )
              },
              iframe({ node, src, title, width, height, ...props }) {
                const cleanSrc = (src || '').trim()
                const isSafe = isSafeEmbedUrl(cleanSrc)
                if (!isSafe) {
                  return (
                    <div className="preview-iframe-blocked select-none">
                      <span className="material-symbols-outlined">shield</span>
                      <span>External embed blocked for security: {cleanSrc || 'unknown'}</span>
                    </div>
                  )
                }
                return (
                  <div
                    data-source-line={node?.position?.start?.line}
                    className="preview-iframe-responsive-container"
                    style={{ margin: '14px 0', width: width || '100%', maxWidth: '100%' }}
                  >
                    <iframe
                      src={cleanSrc}
                      title={title || 'Embedded Video Preview'}
                      width="100%"
                      height={height || '380'}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="preview-markdown-iframe"
                      style={{ borderRadius: '8px', border: 'none', width: '100%', display: 'block' }}
                      {...props}
                    />
                  </div>
                )
              },
              svg({ node }) {
                const rawSvg = hastToXml(node)
                const cleanSvg = sanitizeSvg(rawSvg)
                return (
                  <span
                    data-source-line={node?.position?.start?.line}
                    className="preview-inline-svg-stage"
                    style={{ display: 'block', width: '100%', maxWidth: '100%', verticalAlign: 'middle', overflow: 'visible' }}
                    dangerouslySetInnerHTML={{ __html: cleanSvg }}
                  />
                )
              },
              rect: () => null,
              circle: () => null,
              path: () => null,
              g: () => null,
              text: () => null,
              tspan: () => null,
              line: () => null,
              polyline: () => null,
              polygon: () => null,
              ellipse: () => null,
              a({ node, href, children, ...props }) {
                const trimmedHref = (typeof href === 'string') ? href.trim() : ''
                // Protocol-relative URLs (e.g. //example.com) should be safely normalized to HTTPS external links
                let normalizedHref = trimmedHref
                if (normalizedHref.startsWith('//')) {
                  normalizedHref = `https:${normalizedHref}`
                }

                const isSafe =
                  normalizedHref.startsWith('http://') ||
                  normalizedHref.startsWith('https://') ||
                  normalizedHref.startsWith('mailto:') ||
                  normalizedHref.startsWith('#') ||
                  (normalizedHref.startsWith('/') && !normalizedHref.startsWith('//')) ||
                  normalizedHref.startsWith('./') ||
                  normalizedHref.startsWith('../')
                const safeHref = isSafe ? normalizedHref : '#'
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
