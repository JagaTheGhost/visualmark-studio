import React, { useState, useEffect, useRef, useMemo } from 'react'
import { sanitizeSafeMediaUrl } from '../../utils/securityUtils'
import { resolveLocalMediaPath, getMediaMimeType } from '../../utils/mediaUtils'

/**
 * Modern HTML5 Audio Player for Markdown Preview & READMEs.
 * Seamlessly resolves local workspace audio tracks (Electron), remote URLs, and data URIs.
 */
export default function MarkdownAudio({
  src,
  title = '',
  controls = true,
  autoPlay = false,
  loop = false,
  workspaceDirectory = null,
  activeFile = '',
  children,
  ...props
}) {
  const cleanInitialSrc = typeof src === 'string' ? src.replace(/[\r\n\t]/g, '').trim() : ''
  const isDataUri = cleanInitialSrc.startsWith('data:') || cleanInitialSrc.startsWith('blob:')
  const isRemote = /^(https?:|\/\/)/i.test(cleanInitialSrc)

  const [currentSrc, setCurrentSrc] = useState(cleanInitialSrc)
  const [resolvedSources, setResolvedSources] = useState([])
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef(null)

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

  useEffect(() => {
    let active = true
    const resolveSources = async () => {
      setHasError(false)

      if (cleanInitialSrc) {
        if (isDataUri || isRemote) {
          if (active) setCurrentSrc(cleanInitialSrc)
          return
        }

        const localPath = resolveLocalMediaPath(cleanInitialSrc, workspaceDirectory, activeFile)
        if (localPath && window.electronAPI?.readLocalMedia) {
          try {
            const res = await window.electronAPI.readLocalMedia(localPath)
            if (!active) return
            if (res?.success && res.dataUrl) {
              setCurrentSrc(res.dataUrl)
              return
            }
          } catch (err) {
            console.warn('Audio readLocalMedia error:', err)
          }
        }

        if (active) setCurrentSrc(cleanInitialSrc)
        return
      }

      if (childSources.length > 0) {
        const resolved = await Promise.all(
          childSources.map(async (item) => {
            const s = (item.src || '').trim()
            if (/^(https?:|\/\/|data:|blob:)/i.test(s)) return item
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
        if (active) setResolvedSources(resolved)
      }
    }

    resolveSources()
    return () => {
      active = false
    }
  }, [cleanInitialSrc, childSources, workspaceDirectory, activeFile])

  const formatName = () => {
    if (title) return title
    if (cleanInitialSrc) {
      return cleanInitialSrc.split(/[/\\]/).pop().split('?')[0]
    }
    return 'Audio Track'
  }

  const handleOpenSystem = () => {
    const target = cleanInitialSrc || (childSources[0]?.src) || ''
    const localPath = resolveLocalMediaPath(target, workspaceDirectory)
    if (localPath && window.electronAPI?.openPathInOs) {
      window.electronAPI.openPathInOs(localPath)
    } else if (target.startsWith('http') && window.electronAPI?.openExternalUrl) {
      window.electronAPI.openExternalUrl(target)
    }
  }

  if (hasError) {
    return (
      <div className="preview-audio-fallback select-none">
        <span className="material-symbols-outlined audio-fallback-icon">music_off</span>
        <span className="audio-fallback-title truncate">{formatName()}</span>
        <button type="button" className="video-fallback-btn" onClick={handleOpenSystem} title="Open in OS player">
          <span className="material-symbols-outlined">open_in_new</span>
        </button>
      </div>
    )
  }

  return (
    <div className="preview-audio-container select-none">
      <div className="preview-audio-card">
        <div className="audio-card-header">
          <div className="audio-badge-wrap">
            <span className="material-symbols-outlined audio-lead-icon">headphones</span>
            <span className="audio-track-tag">AUDIO</span>
          </div>
          <span className="audio-track-title truncate">{formatName()}</span>
          <button
            type="button"
            className="audio-system-open-btn"
            onClick={handleOpenSystem}
            title="Open in OS Media Player"
          >
            <span className="material-symbols-outlined">open_in_new</span>
          </button>
        </div>
        <audio
          ref={audioRef}
          src={currentSrc ? sanitizeSafeMediaUrl(currentSrc, '') : undefined}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          onError={() => setHasError(true)}
          className="preview-markdown-audio"
          {...props}
        >
          {resolvedSources.map((item, idx) => (
            <source key={idx} src={sanitizeSafeMediaUrl(item.src, '')} type={item.type} />
          ))}
          Your browser does not support HTML5 audio playback.
        </audio>
      </div>
    </div>
  )
}

