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

  // Allow standard web protocols
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  // Allow relative workspace paths
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return trimmed
  }

  // Allow safe image data URIs (PNG, JPEG, WebP, GIF, SVG)
  if (/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
    return trimmed
  }

  if (trimmed.startsWith('data:image/svg+xml')) {
    // Avoid javascript/event handlers in SVG data URIs
    const lower = trimmed.toLowerCase()
    if (lower.includes('<script') || lower.includes('javascript:') || lower.includes('onload=') || lower.includes('onerror=')) {
      return fallback
    }
    return trimmed
  }

  // Disallow any other protocols (e.g. javascript:, vbscript:, file:, etc.)
  return fallback
}

/**
 * Securely sanitizes SVG strings using DOMPurify with strict SVG profiles.
 */
export function sanitizeSvg(svgCode) {
  if (!svgCode || typeof svgCode !== 'string') return ''
  try {
    return DOMPurify.sanitize(svgCode, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: ['use', 'animate', 'animateTransform'],
      ADD_ATTR: ['target', 'xlink:href']
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
