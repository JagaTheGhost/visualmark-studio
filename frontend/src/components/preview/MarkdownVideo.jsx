import React, { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { sanitizeSafeMediaUrl } from '../../utils/securityUtils'
import { resolveLocalMediaPath, getMediaMimeType, parseVideoEmbed } from '../../utils/mediaUtils'

/**
 * Modern HTML5 Video Player for Markdown Preview & READMEs.
 * Seamlessly resolves local workspace video files (Electron), remote URLs, and data URIs.
 */
export default function MarkdownVideo({
  src,
  alt = '',
  title = '',
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  playsInline = true,
  workspaceDirectory = null,
  activeFile = '',
  width = '100%',
  style = {},
  children,
  ...props
}) {
  const cleanInitialSrc = typeof src === 'string' ? src.replace(/[\r\n\t]/g, '').trim() : ''

  // 0. Auto-render YouTube, Vimeo, and Loom embeds
  const embed = parseVideoEmbed(cleanInitialSrc)
  if (embed) {
    return (
      <div className="preview-iframe-responsive-container" style={{ margin: '14px 0', width: width || '100%', maxWidth: '100%', ...style }}>
        <iframe
          src={embed.embedUrl}
          title={title || alt || 'Embedded Video Preview'}
          width="100%"
          height="380"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="preview-markdown-iframe"
          style={{ borderRadius: '8px', border: 'none', width: '100%', display: 'block' }}
        />
      </div>
    )
  }
  const isDataUri = cleanInitialSrc.startsWith('data:') || cleanInitialSrc.startsWith('blob:')
  const isRemote = /^(https?:|\/\/)/i.test(cleanInitialSrc)
  const isLocalFile = Boolean(cleanInitialSrc) && !isDataUri && !isRemote && typeof window !== 'undefined' && Boolean(window.electronAPI?.readLocalMedia)

  const [currentSrc, setCurrentSrc] = useState(isLocalFile ? '' : cleanInitialSrc)
  const [resolvedSources, setResolvedSources] = useState([])
  const [isLoading, setIsLoading] = useState(!isDataUri && Boolean(cleanInitialSrc || children))
  const [hasError, setHasError] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [meta, setMeta] = useState({ duration: 0, width: 0, height: 0 })
  const videoRef = useRef(null)
  const isMountedRef = useRef(true)

  // Extract sources if provided via <source> children
  const childSources = useMemo(() => {
    const list = []
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && (child.type === 'source' || child.props?.src)) {
        list.push({
          src: child.props.src || '',
          type: child.props.type || getMediaMimeType(child.props.src || '')
        })
      }
    })
    return list
  }, [children])

  // Resolve video sources (both direct src and child <source> elements)
  useEffect(() => {
    isMountedRef.current = true
    let active = true

    const resolveSources = async () => {
      setHasError(false)

      // 1. Direct src attribute
      if (cleanInitialSrc) {
        if (isDataUri || isRemote) {
          if (active) {
            setCurrentSrc(cleanInitialSrc)
            setIsLoading(false)
          }
          return
        }

        // Local workspace file in Electron
        const localPath = resolveLocalMediaPath(cleanInitialSrc, workspaceDirectory, activeFile)
        if (localPath && window.electronAPI?.readLocalMedia) {
          try {
            const res = await window.electronAPI.readLocalMedia(localPath)
            if (!active) return
            if (res?.success && res.dataUrl) {
              setCurrentSrc(res.dataUrl)
              setIsLoading(false)
              setHasError(false)
              return
            }
          } catch (err) {
            console.warn('Video readLocalMedia error:', err)
          }
        }

        if (active) {
          setCurrentSrc(cleanInitialSrc)
          setIsLoading(false)
        }
        return
      }

      // 2. Child <source> elements
      if (childSources.length > 0) {
        const resolved = await Promise.all(
          childSources.map(async (item) => {
            const s = (item.src || '').trim()
            if (/^(https?:|\/\/|data:|blob:)/i.test(s)) {
              return item
            }
            const localPath = resolveLocalMediaPath(s, workspaceDirectory, activeFile)
            if (localPath && window.electronAPI?.readLocalMedia) {
              try {
                const res = await window.electronAPI.readLocalMedia(localPath)
                if (res?.success && res.dataUrl) {
                  return { ...item, src: res.dataUrl }
                }
              } catch {}
            }
            return item
          })
        )

        if (active) {
          setResolvedSources(resolved)
          setIsLoading(false)
        }
      } else {
        if (active) setIsLoading(false)
      }
    }

    resolveSources()

    return () => {
      active = false
      isMountedRef.current = false
    }
  }, [cleanInitialSrc, childSources, workspaceDirectory, activeFile])

  const handleLoadedMetadata = (e) => {
    const el = e.target
    if (el) {
      setMeta({
        duration: el.duration || 0,
        width: el.videoWidth || 0,
        height: el.videoHeight || 0
      })
      setIsLoading(false)
      setHasError(false)
    }
  }

  const handleVideoError = () => {
    // If still resolving local workspace media in Electron, do not abort
    if (isLocalFile && !currentSrc.startsWith('data:') && !currentSrc.startsWith('blob:') && !currentSrc.startsWith('http')) {
      return
    }
    setIsLoading(false)
    setHasError(true)
  }

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    if (videoRef.current) {
      videoRef.current.load()
    }
  }

  const handleOpenSystem = () => {
    const target = cleanInitialSrc || (childSources[0]?.src) || ''
    const localPath = resolveLocalMediaPath(target, workspaceDirectory)
    if (localPath && window.electronAPI?.openPathInOs) {
      window.electronAPI.openPathInOs(localPath)
    } else if (target.startsWith('http') && window.electronAPI?.openExternalUrl) {
      window.electronAPI.openExternalUrl(target)
    } else if (target.startsWith('http')) {
      window.open(target, '_blank', 'noopener,noreferrer')
    }
  }

  const formatDuration = (sec) => {
    if (!sec || isNaN(sec)) return ''
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const formatName = () => {
    if (title) return title
    if (alt) return alt
    if (cleanInitialSrc) {
      return cleanInitialSrc.split(/[/\\]/).pop().split('?')[0]
    }
    return 'Video Player'
  }

  // Error fallback display
  if (hasError) {
    return (
      <div className="preview-video-fallback select-none">
        <div className="video-fallback-header">
          <span className="material-symbols-outlined video-fallback-icon">movie_off</span>
          <div className="video-fallback-info">
            <span className="video-fallback-title truncate">{formatName()}</span>
            <span className="video-fallback-desc">Unable to play video in preview</span>
          </div>
        </div>
        <div className="video-fallback-actions">
          <button type="button" className="video-fallback-btn" onClick={handleOpenSystem} title="Open in OS media player">
            <span className="material-symbols-outlined">open_in_new</span>
            <span>Open in OS</span>
          </button>
          <button type="button" className="video-fallback-btn" onClick={handleRetry} title="Retry playback">
            <span className="material-symbols-outlined">refresh</span>
            <span>Retry</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="preview-video-container" style={{ width: width || '100%', maxWidth: '100%', margin: '14px 0', ...style }}>
        <div className="preview-video-stage">
          {isLoading && (
            <div className="preview-video-skeleton">
              <span className="material-symbols-outlined skeleton-pulse-icon">smart_display</span>
            </div>
          )}

          <video
            ref={videoRef}
            src={currentSrc ? sanitizeSafeMediaUrl(currentSrc, '') : undefined}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            controls={controls}
            playsInline={playsInline}
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleVideoError}
            className="preview-markdown-video"
            style={{ width: '100%', display: 'block', borderRadius: '8px' }}
            {...props}
          >
            {resolvedSources.map((item, idx) => (
              <source key={idx} src={sanitizeSafeMediaUrl(item.src, '')} type={item.type} />
            ))}
            Your browser does not support HTML5 video playback.
          </video>

          {/* Sleek Overlay Header on Hover */}
          <div className="preview-video-overlay-bar">
            <div className="video-meta-left truncate">
              <span className="video-tag-pill">VIDEO</span>
              <span className="video-filename truncate">{formatName()}</span>
            </div>
            <div className="video-meta-right">
              {meta.duration > 0 && <span className="video-duration-pill">{formatDuration(meta.duration)}</span>}
              {meta.width > 0 && <span className="video-res-pill">{meta.width}├ù{meta.height}</span>}
              <button
                type="button"
                className="video-action-icon-btn"
                onClick={() => setLightboxOpen(true)}
                title="Theater View"
              >
                <span className="material-symbols-outlined">fullscreen</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen / Theater Modal */}
      {lightboxOpen && typeof document !== 'undefined' && createPortal(
        <div className="preview-image-lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90vw' }}>
            <video
              src={currentSrc ? sanitizeSafeMediaUrl(currentSrc, '') : undefined}
              controls
              autoPlay
              playsInline
              style={{ width: '100%', maxHeight: '80vh', borderRadius: '8px', background: '#000' }}
            >
              {resolvedSources.map((item, idx) => (
                <source key={idx} src={sanitizeSafeMediaUrl(item.src, '')} type={item.type} />
              ))}
            </video>
            <div className="lightbox-bar">
              <span className="lightbox-alt truncate">{formatName()}</span>
              <div className="lightbox-buttons">
                <button type="button" className="lightbox-btn" onClick={handleOpenSystem} title="Open in OS media player">
                  <span className="material-symbols-outlined">open_in_new</span>
                </button>
                <button type="button" className="lightbox-btn" onClick={() => setLightboxOpen(false)} title="Close (Esc)">
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

