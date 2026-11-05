/**
 * Security & Sanitization Utilities
 * Protects against SSRF, DOM XSS, SVG code injection, and unsafe URL protocols.
 */
import DOMPurify from 'dompurify'

/**
 * Validates and sanitizes media URLs for use in <img src>, <video src>, or <a> tags.
 * Disallows javascript:, vbscript:, data:text/html, etc.
 */
export function sanitizeSafeMediaUrl(url, fallback = '') {
  if (!url || typeof url !== 'string') return fallback
  const trimmed = url.replace(/[\r\n\t]/g, '').trim()
  if (!trimmed) return fallback

  // 1. Allow standard web protocols (HTTP, HTTPS, mailto)
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) {
    return trimmed
  }

  // 2. Allow relative workspace paths or local disk paths (including Windows drives C:\... or C:/...)
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../') ||
    /^[a-zA-Z]:[\\/]/.test(trimmed) ||
    (!trimmed.includes(':') && !trimmed.startsWith('//'))
  ) {
    return trimmed
  }

  // 3. Allow safe raster image, video, and audio data URIs (PNG, JPEG, WebP, GIF, MP4, WebM, OGG, QuickTime, MP3, WAV, SVG)
  // Check prefix to prevent regex stack limits on multi-megabyte base64 strings
  if (/^data:(image\/(png|jpe?g|webp|gif|bmp|x-icon|avif|tiff|svg\+xml)|video\/(mp4|webm|ogg|quicktime|x-matroska|x-msvideo)|audio\/(mp3|wav|ogg|aac|m4a|webm|mpeg|flac));base64,/i.test(trimmed)) {
    return trimmed
  }

  // 4. Allow blob URIs for local playback
  if (/^blob:/i.test(trimmed)) {
    return trimmed
  }

  // 4. Safe SVG data URI with content inspection
  if (/^data:image\/svg\+xml/i.test(trimmed)) {
    const lower = trimmed.toLowerCase()
    if (!lower.includes('<script') && !lower.includes('javascript:') && !lower.includes('onload=') && !lower.includes('onerror=')) {
      return trimmed
    }
    return fallback
  }

  // Disallow any other protocols (e.g. javascript:, vbscript:, file:, etc.)
  return fallback
}

/**
 * Automatically injects viewBox="0 0 w h" if missing but width and height are present,
 * ensuring responsive scaling across all container widths and split panes.
 */
export function ensureSvgViewBox(svgCode) {
  if (!svgCode || typeof svgCode !== 'string') return svgCode
  if (/viewBox\s*=/i.test(svgCode)) return svgCode

  const svgMatch = svgCode.match(/<svg\b([^>]*)>/i)
  if (!svgMatch) return svgCode

  const attrs = svgMatch[1]
  const widthMatch = attrs.match(/\bwidth\s*=\s*["']?(\d+(?:\.\d+)?)(?:px)?["']?/i)
  const heightMatch = attrs.match(/\bheight\s*=\s*["']?(\d+(?:\.\d+)?)(?:px)?["']?/i)

  if (widthMatch && heightMatch) {
    const w = widthMatch[1]
    const h = heightMatch[1]
    const updated = `<svg${attrs} viewBox="0 0 ${w} ${h}">`
    return svgCode.replace(svgMatch[0], updated)
  }

  return svgCode
}

/**
 * Securely sanitizes SVG strings using DOMPurify with strict SVG profiles.
 */
export function sanitizeSvg(svgCode) {
  if (!svgCode || typeof svgCode !== 'string') return ''
  const withViewBox = ensureSvgViewBox(svgCode)
  try {
    return DOMPurify.sanitize(withViewBox, {
      USE_PROFILES: { svg: true, svgFilters: true, html: true },
      HTML_INTEGRATION_POINTS: { foreignobject: true, foreignObject: true },
      FORBID_TAGS: [
        'script',
        'iframe',
        'object',
        'embed',
        'base',
        'meta',
        'link',
        'form',
        'input',
        'button',
        'textarea',
        'select',
        'option'
      ],
      FORBID_ATTR: [
        'onerror',
        'onload',
        'onclick',
        'onmouseover',
        'onmouseout',
        'onfocus',
        'onblur',
        'onmouseenter',
        'onmouseleave',
        'onchange',
        'onsubmit',
        'onkeydown',
        'onkeypress',
        'onkeyup',
        'action',
        'formaction',
        'srcdoc'
      ],
      ALLOW_DATA_ATTR: false,
      ADD_TAGS: [
        'foreignObject',
        'foreignobject',
        'style',
        'text',
        'tspan',
        'textPath',
        'path',
        'defs',
        'clipPath',
        'rect',
        'circle',
        'line',
        'polygon',
        'polyline',
        'g',
        'linearGradient',
        'radialGradient',
        'stop',
        'use',
        'animate',
        'animateTransform',
        'div',
        'span',
        'p',
        'b',
        'i',
        'br',
        'strong',
        'em',
        'code',
        'pre',
        'sub',
        'sup',
        'small',
        'hr',
        'table',
        'thead',
        'tbody',
        'tr',
        'td',
        'th',
        'ul',
        'ol',
        'li',
        'mark',
        's',
        'del',
        'marker',
        'pattern',
        'desc',
        'title'
      ],
      ADD_ATTR: [
        'target',
        'xlink:href',
        'href',
        'id',
        'clip-path',
        'clipPathUnits',
        'dominant-baseline',
        'text-anchor',
        'transform-origin',
        'xmlns',
        'class',
        'style',
        'viewBox',
        'preserveAspectRatio',
        'transform',
        'x',
        'y',
        'dx',
        'dy',
        'rx',
        'ry',
        'cx',
        'cy',
        'r',
        'x1',
        'x2',
        'y1',
        'y2',
        'offset',
        'stop-color',
        'stop-opacity',
        'width',
        'height',
        'font-size',
        'font-family',
        'font-weight',
        'fill',
        'stroke',
        'stroke-width',
        'stroke-opacity',
        'stroke-dasharray',
        'stroke-linejoin',
        'stroke-linecap',
        'stroke-miterlimit',
        'opacity',
        'visibility',
        'attributeName',
        'begin',
        'dur',
        'values',
        'keyTimes',
        'repeatCount',
        'calcMode',
        'keySplines',
        'restart',
        'marker-start',
        'marker-mid',
        'marker-end',
        'markerUnits',
        'markerWidth',
        'markerHeight',
        'refX',
        'refY',
        'orient',
        'requiredExtensions',
        'd'
      ]
    })
  } catch (err) {
    console.warn('SVG sanitization error:', err)
    return ''
  }
}

/**
 * Checks if a URL strictly belongs to a target domain without substring spoofing.
 * Satisfies CodeQL rule js/incomplete-url-substring-sanitization.
 */
export function isSafeDomain(urlStr, targetDomain) {
  if (!urlStr || typeof urlStr !== 'string' || !targetDomain) return false
  try {
    const parsed = new URL(urlStr, 'https://dummy.host')
    const hostname = parsed.hostname.toLowerCase()
    const target = targetDomain.toLowerCase()
    return hostname === target || hostname.endsWith('.' + target)
  } catch {
    return false
  }
}

/**
 * Escapes characters for embedding inside SVG/XML templates.
 */
export function escapeXml(str) {
  if (str === null || str === undefined) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Strips all HTML tags and extracts plain text securely using DOMPurify.
 * Eliminates nested-tag bypasses and satisfies CodeQL rule js/incomplete-multi-character-sanitization.
 */
export function sanitizePlainText(str) {
  if (str === null || str === undefined) return ''
  try {
    return DOMPurify.sanitize(String(str), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim()
  } catch {
    return String(str).replace(/[<>]/g, '').trim()
  }
}
