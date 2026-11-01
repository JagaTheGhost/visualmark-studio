import React, { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { getOptimizedImageUrl, requiresAsyncResolution, resolveRedirectImageUrl } from '../../utils/imageUtils'
import { sanitizeSafeMediaUrl, sanitizeSvg, isSafeDomain } from '../../utils/securityUtils'
import { isVideoUrl, isAudioUrl, isGifUrl } from '../../utils/mediaUtils'
import MarkdownVideo from './MarkdownVideo'
import MarkdownAudio from './MarkdownAudio'

// Global cache to remember successfully loaded image sources across keystrokes/re-renders
const loadedImageCache = new Set()

/**
 * Safely decodes an SVG from any data:image/svg+xml URI (base64, utf-8, or percent-encoded).
 * Resilient against multi-line hard wrapping, line breaks, and split percent escapes.
 */
function decodeSvgDataUri(uri) {
  if (!uri || typeof uri !== 'string') return null
  // 1. Remove all line breaks, carriage returns, and tabs first so wrapped URLs re-connect!
  const cleaned = uri.replace(/[\r\n\t]/g, '').trim()
  if (
    !cleaned.includes('data:image/svg+xml') &&
    !cleaned.includes('<svg') &&
    !cleaned.includes('%3Csvg') &&
    !cleaned.includes('%3csvg')
  ) {
    return null
  }

  try {
    const commaIndex = cleaned.indexOf(',')
    let content = commaIndex !== -1 ? cleaned.slice(commaIndex + 1) : cleaned
    const meta = commaIndex !== -1 ? cleaned.slice(0, commaIndex).toLowerCase() : ''

    if (meta.includes(';base64')) {
      const sanitized = content.replace(/[\r\n\s]/g, '')
      const binary = atob(sanitized)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      const decoded = new TextDecoder('utf-8').decode(bytes)
      if (decoded.includes('<svg')) return decoded
    } else {
      // Re-connect any spaces inside split percent tokens (e.g., % 20 -> %20)
      content = content.replace(/%[ \t]*([0-9a-fA-F])[ \t]*([0-9a-fA-F])/gi, '%$1$2')

      let decoded = null
      try {
        decoded = decodeURIComponent(content)
      } catch {
        try {
          decoded = unescape(content)
        } catch {
          // Repair malformed single % characters
          const repaired = content.replace(/%([^0-9a-fA-F]|.[^0-9a-fA-F]|$)/gi, (m) => '%25' + m.slice(1))
          try {
            decoded = decodeURIComponent(repaired)
          } catch {}
        }
      }

      if (decoded && decoded.includes('<svg')) return decoded
      if (content.includes('<svg')) return content
    }
  } catch (err) {
    console.warn('SVG data URI decoding failed:', err)
  }
  return null
}

/**
 * Determines whether an image source or alt text corresponds to a status/shield badge.
 */
function isBadgeImage(src, alt = '', props = {}) {
  if (!src && !alt) return false

  // 1. If explicitly styled or given width="100%", it's a full banner/cover, never an inline badge
  if (props?.width === '100%' || props?.style?.width === '100%') {
    return false
  }

  const srcStr = typeof src === 'string' ? src.toLowerCase() : ''
  const altStr = typeof alt === 'string' ? alt.toLowerCase() : ''

  // 2. Explicit exclusions: Hero banners, header SVGs, typing animations, cover photos,
  // and GitHub statistics cards should NEVER be compressed into compact 28px inline badges.
  const bannerExclusionKeywords = [
    'capsule-render',
    'readme-typing-svg',
    'typing',
    'github-readme-stats',
    'github-readme-streak-stats',
    'streak-stats',
    'github-profile-trophy',
    'github-readme-activity-graph',
    'activity-graph',
    'banner',
    'header',
    'cover',
    'mockup',
    'screenshot'
  ]

  if (
    bannerExclusionKeywords.some((kw) => srcStr.includes(kw) || altStr.includes(kw)) ||
    isSafeDomain(srcStr, 'demolab.com')
  ) {
    return false
  }

  // Common badge domains, paths, and query params
  const badgeKeywords = [
    'img.shields.io',
    'shields.io',
    'badgen.net',
    'badge.fury.io',
    'travis-ci.com',
    'travis-ci.org',
    'circleci.com',
    'hits.seeyoufarm.com',
    'visitor-badge',
    'forthebadge.com',
    'pepy.tech',
    'crates.io/badges',
    'codecov.io',
    'coveralls.io',
    'api.codacy.com',
    'skillicons.dev'
  ]

  if (badgeKeywords.some((keyword) => srcStr.includes(keyword))) {
    return true
  }

  if (srcStr.includes('/badge/') || srcStr.includes('badges/') || srcStr.includes('/badges.')) {
    return true
  }

  if (
    srcStr.includes('style=for-the-badge') ||
    srcStr.includes('style=flat-square') ||
    srcStr.includes('style=flat') ||
    srcStr.includes('style=plastic') ||
    srcStr.includes('style=social')
  ) {
    return true
  }

  const badgeAltTerms = ['badge', 'shield', 'build status', 'coverage', 'downloads', 'npm version', 'visitors']
  if (badgeAltTerms.some((term) => altStr.includes(term))) {
    if (srcStr.includes('.svg') || srcStr.includes('badge') || srcStr.includes('shield')) {
      return true
    }
  }

  return false
}

export default function MarkdownImage({ src, alt, title, workspaceDirectory, activeFile, ...props }) {
  const cleanSrc = typeof src === 'string' ? src.replace(/[\r\n\t]/g, '').trim() : ''

  // 0. Smoothly delegate video or audio file paths to dedicated media players
  if (isVideoUrl(cleanSrc || src)) {
    return (
      <MarkdownVideo
        src={cleanSrc || src}
        alt={alt}
        title={title}
        workspaceDirectory={workspaceDirectory}
        activeFile={activeFile}
        {...props}
      />
    )
  }

  if (isAudioUrl(cleanSrc || src)) {
    return (
      <MarkdownAudio
        src={cleanSrc || src}
        title={title || alt}
        workspaceDirectory={workspaceDirectory}
        activeFile={activeFile}
        {...props}
      />
    )
  }
  const isDataUri = cleanSrc.startsWith('data:')
  const isRemote = /^(https?:|\/\/|data:)/i.test(cleanSrc)
  const isLocalFile = !isDataUri && !isRemote && typeof window !== 'undefined' && Boolean(window.electronAPI?.readLocalMedia)
  const cleanInitialSrc = isDataUri ? cleanSrc : (isLocalFile ? '' : getOptimizedImageUrl(src))

  // Synchronously check global vector cache so live-generated SVGs render with 0 flash/skeleton
  const initialSvgRaw = useMemo(() => {
    if (typeof window !== 'undefined' && window.__visualmarkSvgCache && cleanSrc) {
      const cache = window.__visualmarkSvgCache
      const cleanRel = cleanSrc.replace(/^\.[\\/]/, '')
      return cache[cleanSrc] || cache[cleanRel] || cache[`assets/${cleanRel}`] || null
    }
    return null
  }, [cleanSrc])

  const [currentSrc, setCurrentSrc] = useState(cleanInitialSrc)
  const [localSvgRaw, setLocalSvgRaw] = useState(initialSvgRaw)
  const [isLoading, setIsLoading] = useState(() => {
    if (isDataUri || initialSvgRaw) return false
    if (!isLocalFile && (loadedImageCache.has(cleanInitialSrc) || loadedImageCache.has(cleanSrc))) return false
    return true
  })
  const [hasError, setHasError] = useState(false)
  const [hasAttemptedResolution, setHasAttemptedResolution] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const isMountedRef = useRef(true)
  const imgRef = useRef(null)

  const API_BASE_URL = import.meta.env.VITE_API_URL || ''

  const isBadge = useMemo(() => isBadgeImage(cleanSrc || currentSrc || src, alt, props), [cleanSrc, currentSrc, src, alt, props])
  const isGif = useMemo(() => isGifUrl(cleanSrc || currentSrc || src), [cleanSrc, currentSrc, src])
  const isForTheBadge = useMemo(() => {
    const combined = `${cleanSrc} ${currentSrc} ${src}`.toLowerCase()
    return combined.includes('for-the-badge') || combined.includes('forthebadge')
  }, [cleanSrc, currentSrc, src])

  const isFullWidth = useMemo(() => {
    if (props.width === '100%' || props.style?.width === '100%') return true
    const combined = `${cleanSrc} ${currentSrc} ${src} ${alt || ''}`.toLowerCase()
    return combined.includes('capsule-render') || combined.includes('banner') || combined.includes('header')
  }, [props.width, props.style, cleanSrc, currentSrc, src, alt])

  const isTransparentSvgWidget = useMemo(() => {
    const combined = `${cleanSrc} ${currentSrc} ${src}`.toLowerCase()
    return (
      combined.includes('capsule-render') ||
      combined.includes('readme-typing-svg') ||
      combined.includes('typing') ||
      isSafeDomain(cleanSrc, 'demolab.com') ||
      isSafeDomain(currentSrc, 'demolab.com') ||
      isSafeDomain(src, 'demolab.com')
    )
  }, [cleanSrc, currentSrc, src])

  // Attempt to decode inline SVG data URI if present and sanitize it
  const inlineSvgCode = useMemo(() => {
    if (localSvgRaw) {
      return sanitizeSvg(localSvgRaw)
    }
    const raw = decodeSvgDataUri(cleanSrc) || decodeSvgDataUri(currentSrc) || decodeSvgDataUri(src)
    return raw ? sanitizeSvg(raw) : null
  }, [localSvgRaw, cleanSrc, currentSrc, src])

  // Immediately clear loading flag if the browser has already downloaded/cached this image
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      if (cleanSrc) loadedImageCache.add(cleanSrc)
      if (currentSrc) loadedImageCache.add(currentSrc)
      setIsLoading(false)
      setHasError(false)
    }
  }, [currentSrc, cleanSrc])

  // Resolve relative workspace paths (e.g. assets/banner.svg) to absolute disk path or clean relative path
  const resolveLocalPath = (relativePath) => {
    if (!relativePath || typeof relativePath !== 'string') return null
    if (/^(https?:|\/\/|data:|blob:)/i.test(relativePath)) return null

    let clean = relativePath.split('?')[0].split('#')[0].trim()
    try {
      clean = decodeURIComponent(clean)
    } catch {}

    // Absolute Windows or Unix path
    if (/^[a-zA-Z]:[\\/]/.test(clean) || clean.startsWith('/')) {
      return clean
    }

    const cleanRel = clean.replace(/^\.[\\/]/, '')
    const wsPath = workspaceDirectory?.path || (typeof workspaceDirectory === 'string' ? workspaceDirectory : null)

    // Check relative to activeFile's directory
    if (activeFile && typeof activeFile === 'string') {
      const cleanActive = activeFile.split('?')[0].split('#')[0].replace(/\\/g, '/')
      const lastSlash = cleanActive.lastIndexOf('/')
      if (lastSlash !== -1) {
        const activeDir = cleanActive.slice(0, lastSlash)
        if (wsPath) {
          const sep = wsPath.includes('\\') ? '\\' : '/'
          const normalizedWs = wsPath.replace(/[\\/]+$/, '')
          const combinedRel = `${activeDir}/${cleanRel}`.replace(/[\\/]+/g, sep)
          return `${normalizedWs}${sep}${combinedRel}`
        }
      }
    }

    if (wsPath) {
      const sep = wsPath.includes('\\') ? '\\' : '/'
      const normalizedWs = wsPath.replace(/[\\/]+$/, '')
      const normalizedRel = cleanRel.replace(/[\\/]+/g, sep)
      return `${normalizedWs}${sep}${normalizedRel}`
    }

    // Fallback: return clean relative path so Electron IPC can check activeWorkspaces directly
    return cleanRel
  }

  useEffect(() => {
    isMountedRef.current = true
    const handleCacheUpdated = (e) => {
      const cleanRel = cleanSrc ? cleanSrc.replace(/^\.[\\/]/, '') : ''
      if (
        e.detail?.path === cleanSrc ||
        (cleanRel && e.detail?.path === cleanRel) ||
        (cleanRel && e.detail?.path === `assets/${cleanRel}`)
      ) {
        if (e.detail?.svg) {
          setLocalSvgRaw(e.detail.svg)
          setIsLoading(false)
          setHasError(false)
        }
      }
    }
    window.addEventListener('visualmark:svg-cache-updated', handleCacheUpdated)
    return () => {
      isMountedRef.current = false
      window.removeEventListener('visualmark:svg-cache-updated', handleCacheUpdated)
    }
  }, [cleanSrc])

  useEffect(() => {
    let active = true
    const isData = typeof src === 'string' && src.trim().startsWith('data:')
    const isRemote = /^(https?:|\/\/|data:)/i.test(cleanSrc)
    const optimized = isData ? src.replace(/[\r\n\t]/g, '').trim() : getOptimizedImageUrl(src)

    // 0. Check in-memory global SVG vector cache first!
    if (typeof window !== 'undefined' && window.__visualmarkSvgCache) {
      const cache = window.__visualmarkSvgCache
      const cleanRel = cleanSrc ? cleanSrc.replace(/^\.[\\/]/, '') : ''
      const cached = cache[cleanSrc] || cache[cleanRel] || cache[`assets/${cleanRel}`]
      if (cached) {
        setLocalSvgRaw(cached)
        setCurrentSrc(optimized)
        setIsLoading(false)
        setHasError(false)
        return
      }
    }

    setLocalSvgRaw(null)
    setCurrentSrc(optimized)
    setHasError(false)

    if (isData || loadedImageCache.has(optimized) || loadedImageCache.has(cleanSrc)) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }

    // Handle Local Workspace Media in Electron
    if (!isData && !isRemote) {
      const localPath = resolveLocalPath(cleanSrc)
      if (localPath && typeof window !== 'undefined') {
        if (window.electronAPI?.readLocalMedia) {
          window.electronAPI.readLocalMedia(localPath).then((res) => {
            if (!active) return
            if (res && res.success) {
              if (res.isSvg && res.content) {
                setLocalSvgRaw(res.content)
              } else if (res.dataUrl) {
                setCurrentSrc(res.dataUrl)
              }
              setIsLoading(false)
              setHasError(false)
            } else {
              // Try fallback to readFile if it is an SVG file
              if (cleanSrc.toLowerCase().endsWith('.svg') && window.electronAPI?.readFile) {
                window.electronAPI.readFile(localPath).then((readRes) => {
                  if (!active) return
                  if (readRes && readRes.success && readRes.content) {
                    setLocalSvgRaw(readRes.content)
                    setIsLoading(false)
                    setHasError(false)
                    return
                  }
                  setIsLoading(false)
                  setHasError(true)
                }).catch(() => {
                  if (active) {
                    setIsLoading(false)
                    setHasError(true)
                  }
                })
                return
              }
              setIsLoading(false)
              setHasError(true)
            }
          }).catch(() => {
            if (active) {
              setIsLoading(false)
              setHasError(true)
            }
          })
          return () => {
            active = false
          }
        } else if (window.electronAPI?.readFile && cleanSrc.toLowerCase().endsWith('.svg')) {
          window.electronAPI.readFile(localPath).then((res) => {
            if (!active) return
            if (res && res.success && res.content) {
              setLocalSvgRaw(res.content)
              setIsLoading(false)
              setHasError(false)
            } else {
              setIsLoading(false)
              setHasError(true)
            }
          }).catch(() => {
            if (active) {
              setIsLoading(false)
              setHasError(true)
            }
          })
          return () => {
            active = false
          }
        }
      }
    }

    if (!isData && requiresAsyncResolution(src)) {
      resolveRedirectImageUrl(src, API_BASE_URL).then((resolved) => {
        if (active && resolved) {
          setCurrentSrc(resolved)
          setHasAttemptedResolution(true)
        }
      }).catch(() => {})
    }

    return () => {
      active = false
    }
  }, [src, cleanSrc, workspaceDirectory, API_BASE_URL])


  const handleImageError = async () => {
    // If still resolving a local workspace file in Electron, do not immediately fail
    if (isLocalFile && !currentSrc.startsWith('data:') && !currentSrc.startsWith('blob:') && !currentSrc.startsWith('http')) {
      return
    }

    if (isDataUri || (typeof src === 'string' && src.trim().startsWith('data:')) || isBadge) {
      setIsLoading(false)
      setHasError(true)
      return
    }

    // If not already resolved via backend, attempt one fallback resolution
    if (!hasAttemptedResolution && src) {
      setHasAttemptedResolution(true)
      try {
        const resolved = await resolveRedirectImageUrl(src, API_BASE_URL)
        if (resolved && resolved !== currentSrc) {
          setCurrentSrc(resolved)
          setIsLoading(true)
          return
        }
      } catch {
        // Fall through to error
      }
    }
    setIsLoading(false)
    setHasError(true)
  }

  const handleImageLoad = () => {
    if (cleanSrc) loadedImageCache.add(cleanSrc)
    if (currentSrc) loadedImageCache.add(currentSrc)
    setIsLoading(false)
    setHasError(false)
  }

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    setHasAttemptedResolution(false)
    if (currentSrc && currentSrc.startsWith('data:')) {
      setCurrentSrc(currentSrc)
      return
    }
    // Force cache bust if retry on remote URL
    const bustUrl = currentSrc.includes('?') ? `${currentSrc}&_r=${Date.now()}` : `${currentSrc}?_r=${Date.now()}`
    setCurrentSrc(bustUrl)
  }

  // 1. Direct inline SVG rendering for SVG data URIs (banners, vector diagrams, etc.)
  if (inlineSvgCode) {
    return (
      <>
        <span
          className="preview-markdown-svg-wrapper"
          onClick={() => setLightboxOpen(true)}
          title={title || alt || 'Click to enlarge SVG banner'}
          style={{ display: 'block', width: props.width || '100%', maxWidth: '100%', cursor: 'pointer' }}
          dangerouslySetInnerHTML={{ __html: inlineSvgCode }}
        />

        {lightboxOpen && typeof document !== 'undefined' && createPortal(
          <div
            className="preview-image-lightbox-overlay"
            onClick={() => setLightboxOpen(false)}
          >
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <div
                className="lightbox-svg-stage"
                style={{ width: '100%', maxWidth: '960px', padding: '16px' }}
                dangerouslySetInnerHTML={{ __html: inlineSvgCode }}
              />
              <div className="lightbox-bar">
                <span className="lightbox-alt truncate">{alt || 'SVG Banner Preview'}</span>
                <div className="lightbox-buttons">
                  <button
                    type="button"
                    className="lightbox-btn"
                    onClick={() => setLightboxOpen(false)}
                    title="Close (Esc)"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    )
  }

  // 2. Error handling: clean, compact inline badge for badges; sleek minimal banner indicator for images
  if (hasError) {
    if (isBadge) {
      return (
        <span className="preview-badge-wrapper select-none">
          <span
            className={`preview-badge-fallback ${isForTheBadge ? 'is-for-the-badge' : ''}`}
            title={`Badge failed to load: ${alt || src}`}
          >
            <span className="badge-fallback-label">{alt || 'badge'}</span>
            <span className="badge-fallback-dot" />
          </span>
        </span>
      )
    }

    return (
      <span className="preview-image-fallback-compact select-none" title={`Unable to load: ${alt || src}`}>
        <span className="material-symbols-outlined fallback-mini-icon">image_not_supported</span>
        <span className="fallback-mini-title truncate">{alt || 'Image Preview'}</span>
        {src && (
          <button
            type="button"
            className="fallback-mini-action"
            title="Open URL"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              if (window.electronAPI?.openExternalUrl) {
                window.electronAPI.openExternalUrl(src)
              } else {
                window.open(src, '_blank', 'noopener,noreferrer')
              }
            }}
          >
            <span className="material-symbols-outlined">open_in_new</span>
          </button>
        )}
        <button
          type="button"
          className="fallback-mini-action"
          onClick={handleRetry}
          title="Retry loading image"
        >
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </span>
    )
  }

  // 3. Badges: Compact inline-flex pill without heavy distracting skeleton blocks
  if (isBadge) {
    return (
      <span className="preview-badge-wrapper">
        <img
          src={sanitizeSafeMediaUrl(currentSrc, '')}
          alt={alt || ''}
          title={title || alt || ''}
          className="preview-markdown-badge is-loaded"
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...props}
        />
      </span>
    )
  }

  // 4. Normal <img> Element (Screenshots, hero banners, diagrams)
  return (
    <>
      <span
        className={`preview-image-wrapper ${isFullWidth ? 'is-full-width' : ''} ${isTransparentSvgWidget ? 'is-transparent-widget' : ''}`}
        style={isFullWidth ? { display: 'block', width: '100%', maxWidth: '100%' } : undefined}
      >
        {isLoading && !isTransparentSvgWidget && (
          <span
            className="preview-image-skeleton"
            style={props.width && props.width !== '100%' ? { width: props.width, maxWidth: '100%' } : undefined}
          >
            <span className="material-symbols-outlined skeleton-pulse-icon">image</span>
          </span>
        )}
        {isGif && !isLoading && !hasError && (
          <span className="preview-gif-badge select-none" title="Animated GIF (Click to enlarge)">
            GIF
          </span>
        )}
        <img
          ref={imgRef}
          src={sanitizeSafeMediaUrl(currentSrc, '')}
          alt={alt || ''}
          title={title || alt || ''}
          className={`preview-markdown-image ${isLoading ? 'is-loading' : 'is-loaded'} ${isTransparentSvgWidget ? 'no-shadow' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onClick={() => setLightboxOpen(true)}
          {...props}
          style={{
            ...(props.style || {}),
            ...(isFullWidth ? { width: '100%', maxWidth: '100%', height: 'auto', display: 'block' } : {}),
            ...(isTransparentSvgWidget ? { boxShadow: 'none', background: 'transparent' } : {})
          }}
        />
      </span>

      {/* Lightbox Modal rendered via Portal outside of any <p> container */}
      {lightboxOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="preview-image-lightbox-overlay"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={currentSrc} alt={alt || ''} className="lightbox-image" />
            <div className="lightbox-bar">
              <span className="lightbox-alt truncate">{alt || 'Image Preview'}</span>
              <div className="lightbox-buttons">
                <a
                  href={currentSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lightbox-btn"
                  title="Open in new tab"
                >
                  <span className="material-symbols-outlined">open_in_new</span>
                </a>
                <button
                  type="button"
                  className="lightbox-btn"
                  onClick={() => setLightboxOpen(false)}
                  title="Close (Esc)"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

