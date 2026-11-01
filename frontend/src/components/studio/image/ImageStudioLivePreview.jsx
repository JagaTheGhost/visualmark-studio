import React, { useState, useEffect } from 'react'
import { sanitizeSafeMediaUrl, sanitizeSvg } from '../../../utils/securityUtils'
import { parseVideoEmbed, resolveLocalMediaPath } from '../../../utils/mediaUtils'
import {
  getHudTelemetrySvg,
  getNeofetchSvg,
  getCyberpunkGridSvg,
  getSwissMinimalSvg,
  getGlassOrbitSvg,
  getGradientRibbonSvg,
  getCapsuleSvg,
  getTypingSvg,
  getGeometricMeshSvg,
  getMockupSvg
} from './svgBannerGenerators'

export default function ImageStudioLivePreview({
  activeMode,
  bannerType,
  bannerTitle,
  bannerSubtitle,
  hudStatus,
  hudVersion,
  bannerTheme,
  isCustomColor,
  customHex1,
  customHex2,
  hudMetric1,
  hudMetric2,
  hudMetric3,
  neofetchPrompt,
  neofetchShell,
  capsuleFontColor,
  capsuleDescColor,
  capsuleAnimation,
  capsuleTitleSize,
  capsuleDescSize,
  capsuleFontAlignY,
  capsuleDescAlignY,
  capsuleShape,
  bannerHeight,
  bannerSyntaxMode,
  neofetchOs,
  neofetchLicense,
  getCapsuleUrl,
  getTypingUrl,
  typingError,
  setTypingError,
  typingColor,
  typingFont,
  typingLines,
  typingPause,
  typingSpeed,
  typingEffect,
  typingLayout,
  typingAlign,
  typingFontSize,
  typingWidth,
  typingHeight,
  resolvedUrl,
  imageUrl,
  imageAlt,
  imageAlign,
  imageWidth,
  imageCaption,
  frameStyle,
  browserUrl,
  terminalCommand,
  macWindowTitle,
  mockupGlow,
  previewThemeMode,
  setPreviewThemeMode,
  darkThemeUrl,
  lightThemeUrl,
  adaptiveAlt,
  uploadedDataUrl,
  uploadAlt,
  compTitle1,
  compUrl1,
  compTitle2,
  compUrl2,
  motionUrl,
  motionType,
  motionFrameStyle,
  motionTitle,
  motionCaption,
  motionAlign,
  motionWidth,
  motionAutoplay,
  motionLoop,
  motionMuted,
  motionControls,
  motionGlow,
  motionBrowserUrl,
  workspaceDirectory = null
}) {
  const [capsuleError, setCapsuleError] = useState(false)
  const [motionMediaError, setMotionMediaError] = useState(false)
  const [resolvedMotionSrc, setResolvedMotionSrc] = useState(motionUrl)

  useEffect(() => {
    let active = true
    setMotionMediaError(false)

    if (!motionUrl || !motionUrl.trim()) {
      setResolvedMotionSrc('')
      return
    }

    const clean = motionUrl.trim()
    const embed = parseVideoEmbed(clean)
    if (embed) {
      setResolvedMotionSrc(embed.embedUrl)
      return
    }

    if (/^(https?:|\/\/|data:|blob:)/i.test(clean)) {
      setResolvedMotionSrc(clean)
      return
    }

    const localPath = resolveLocalMediaPath(clean, workspaceDirectory)
    if (localPath && window.electronAPI?.readLocalMedia) {
      window.electronAPI.readLocalMedia(localPath).then((res) => {
        if (!active) return
        if (res?.success && res.dataUrl) {
          setResolvedMotionSrc(res.dataUrl)
        } else {
          setResolvedMotionSrc(clean)
        }
      }).catch(() => {
        if (active) setResolvedMotionSrc(clean)
      })
      return () => {
        active = false
      }
    }

    setResolvedMotionSrc(clean)
  }, [motionUrl, workspaceDirectory])

  // Reset motion error on url or type change
  useEffect(() => {
    setMotionMediaError(false)
  }, [motionUrl, motionType])

  // Reset capsule error when relevant props change
  useEffect(() => {
    setCapsuleError(false)
  }, [
    capsuleShape,
    bannerTheme,
    isCustomColor,
    customHex1,
    customHex2,
    capsuleFontColor,
    capsuleDescColor,
    bannerHeight,
    bannerTitle,
    bannerSubtitle,
    capsuleAnimation
  ])

  const renderVisualMockup = (targetSrc, altText) => {
    const safeSrc = sanitizeSafeMediaUrl(
      targetSrc,
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
    )

    const glowStyle = {
      maxWidth: imageWidth === '100%' ? '100%' : `${imageWidth}px`,
      boxShadow:
        mockupGlow === 'none'
          ? 'none'
          : mockupGlow === 'soft'
          ? '0 8px 24px rgba(0, 0, 0, 0.25)'
          : mockupGlow === 'glow'
          ? '0 12px 36px rgba(99, 102, 241, 0.35), 0 0 24px rgba(236, 72, 153, 0.25)'
          : '0 20px 48px -8px rgba(0, 0, 0, 0.6)'
    }

    return (
      <div className={`link-preview-box align-${imageAlign}`}>
        {frameStyle === 'mac-window' ? (
          <div className="mockup-mac-window" style={glowStyle}>
            <div className="mac-window-bar">
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="mac-dot dot-red" />
                <span className="mac-dot dot-yellow" />
                <span className="mac-dot dot-green" />
              </div>
              {macWindowTitle && (
                <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', margin: '0 auto', paddingRight: '48px' }}>
                  {macWindowTitle}
                </span>
              )}
            </div>
            <img src={safeSrc} alt={altText} className="mockup-img" />
          </div>
        ) : frameStyle === 'browser-bar' ? (
          <div className="mockup-browser" style={glowStyle}>
            <div className="browser-window-bar">
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="mac-dot dot-red" />
                <span className="mac-dot dot-yellow" />
                <span className="mac-dot dot-green" />
              </div>
              <div className="browser-address-bar">
                <span className="material-symbols-outlined" style={{ fontSize: '12px', color: '#10b981' }}>lock</span>
                <span>{browserUrl}</span>
              </div>
            </div>
            <img src={safeSrc} alt={altText} className="mockup-img" />
          </div>
        ) : frameStyle === 'terminal' ? (
          <div className="mockup-terminal" style={glowStyle}>
            <div className="terminal-window-bar">
              <span className="terminal-title">bash - 80×24</span>
              <span style={{ fontSize: '10px', color: '#58a6ff' }}>{terminalCommand}</span>
            </div>
            <img src={safeSrc} alt={altText} className="mockup-img" />
          </div>
        ) : frameStyle === 'mobile' ? (
          <div className="mockup-mobile" style={mockupGlow === 'none' ? { boxShadow: 'none' } : {}}>
            <div className="mobile-notch-bar">
              <div className="mobile-notch-pill" />
            </div>
            <img src={safeSrc} alt={altText} className="mockup-img" />
          </div>
        ) : frameStyle === 'rounded-card' ? (
          <div className="mockup-clean-card" style={glowStyle}>
            <img src={safeSrc} alt={altText} className="mockup-img" />
          </div>
        ) : (
          <img
            src={safeSrc}
            alt={altText}
            style={{
              maxWidth: imageWidth === '100%' ? '100%' : `${imageWidth}px`,
              borderRadius: '6px',
              ...glowStyle
            }}
          />
        )}
        {imageCaption && <div className="preview-caption-text">{imageCaption}</div>}
      </div>
    )
  }

  const renderMotionMediaContent = () => {
    const cleanUrl = (motionUrl || '').trim()

    // 1. Video Embeds (YouTube, Vimeo, Loom)
    const embed = parseVideoEmbed(cleanUrl)
    if (embed) {
      return (
        <div className="motion-video-wrapper" style={{ width: '100%', lineHeight: 0, position: 'relative' }}>
          <iframe
            key={embed.embedUrl}
            src={embed.embedUrl}
            title={motionTitle || 'Video Demo'}
            width="100%"
            height="380"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              width: '100%',
              minHeight: '340px',
              border: 'none',
              display: 'block',
              borderRadius: motionFrameStyle === 'clean-border' ? '8px' : '0 0 6px 6px'
            }}
          />
        </div>
      )
    }

    // 2. Playback / Error Handling
    if (!cleanUrl) {
      return (
        <div className="motion-placeholder-card">
          <div className="motion-placeholder-icon-wrap">
            <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#38bdf8' }}>
              {motionType === 'video' ? 'videocam' : 'gif'}
            </span>
          </div>
          <div className="motion-placeholder-title">{motionTitle || 'Motion Showcase Canvas'}</div>
          <div className="motion-placeholder-desc">
            Enter a YouTube link, local workspace path (e.g. <code>assets/demo.mp4</code>), or select a sample preset.
          </div>
          <div className="motion-placeholder-badge">
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>verified</span>
            <span>{motionType === 'video' ? 'Video Player Ready' : 'Animated GIF Ready'}</span>
          </div>
        </div>
      )
    }

    if (motionMediaError) {
      return (
        <div className="motion-placeholder-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <div className="motion-placeholder-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#f87171' }}>
              movie_off
            </span>
          </div>
          <div className="motion-placeholder-title" style={{ color: '#fca5a5' }}>Unable to Play Media Stream</div>
          <div className="motion-placeholder-desc">
            Failed to load video codec or media file at: <code style={{ wordBreak: 'break-all', color: '#cbd5e1' }}>{cleanUrl}</code>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              type="button"
              className="video-fallback-btn"
              onClick={() => {
                if (window.electronAPI?.openExternalUrl && cleanUrl.startsWith('http')) {
                  window.electronAPI.openExternalUrl(cleanUrl)
                } else if (cleanUrl.startsWith('http')) {
                  window.open(cleanUrl, '_blank')
                }
              }}
            >
              <span className="material-symbols-outlined">open_in_new</span>
              <span>Open in Browser</span>
            </button>
            <button
              type="button"
              className="video-fallback-btn"
              onClick={() => setMotionMediaError(false)}
            >
              <span className="material-symbols-outlined">refresh</span>
              <span>Retry</span>
            </button>
          </div>
        </div>
      )
    }

    // 3. Direct HTML5 Video
    if (motionType === 'video') {
      const videoSrc = resolvedMotionSrc || cleanUrl
      return (
        <div className="motion-video-wrapper" style={{ width: '100%', position: 'relative' }}>
          <video
            key={videoSrc}
            src={sanitizeSafeMediaUrl(videoSrc, '')}
            autoPlay={motionAutoplay}
            loop={motionLoop}
            muted={motionMuted}
            controls={motionControls}
            playsInline
            onError={() => setMotionMediaError(true)}
            style={{ width: '100%', height: 'auto', display: 'block', minHeight: '200px', objectFit: 'contain', background: '#000' }}
          />
        </div>
      )
    }

    // 4. Animated GIF / Image
    const imgSrc = resolvedMotionSrc || cleanUrl
    return (
      <div className="motion-video-wrapper" style={{ width: '100%', position: 'relative' }}>
        <img
          key={imgSrc}
          src={sanitizeSafeMediaUrl(imgSrc, '')}
          alt={motionTitle || 'Motion Demo'}
          onError={() => setMotionMediaError(true)}
          style={{ width: '100%', height: 'auto', display: 'block', minHeight: '160px', objectFit: 'contain' }}
        />
      </div>
    )
  }


  const activeTheme = isCustomColor
    ? {
        id: 'custom',
        name: 'Custom Gradient',
        bg: `linear-gradient(135deg, ${customHex1} 0%, ${customHex2} 100%)`,
        hex1: customHex1,
        hex2: customHex2,
        colorParam: `0:${customHex1.replace('#', '')},100:${customHex2.replace('#', '')}`,
        coverUrl: bannerTheme?.coverUrl || ''
      }
    : bannerTheme

  const svgParams = {
    bannerTitle,
    bannerSubtitle,
    hudStatus,
    hudVersion,
    bannerTheme: activeTheme,
    customHex1,
    customHex2,
    isCustomColor,
    hudMetric1,
    hudMetric2,
    hudMetric3,
    neofetchOs,
    neofetchLicense,
    neofetchPrompt,
    neofetchShell
  }

  return (
    <div
      className="studio-image-preview-stage"
      style={{
        width: '100%',
        maxWidth: '960px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      {activeMode === 'banner' && (
        <div className="banner-preview-box" style={{ width: '100%' }}>
          {/* Stitch HUD Telemetry */}
          {bannerType === 'hud-telemetry' && (
            <div dangerouslySetInnerHTML={{ __html: sanitizeSvg(getHudTelemetrySvg(svgParams)) }} />
          )}

          {/* Neofetch Terminal */}
          {bannerType === 'neofetch' && (
            <div dangerouslySetInnerHTML={{ __html: sanitizeSvg(getNeofetchSvg(svgParams)) }} />
          )}

          {/* Cyberpunk Perspective Grid */}
          {bannerType === 'cyberpunk-grid' && (
            <div dangerouslySetInnerHTML={{ __html: sanitizeSvg(getCyberpunkGridSvg(svgParams)) }} />
          )}

          {/* Swiss Typographic Grid */}
          {bannerType === 'swiss-minimal' && (
            <div dangerouslySetInnerHTML={{ __html: sanitizeSvg(getSwissMinimalSvg(svgParams)) }} />
          )}

          {/* Glassmorphism Tech Matrix */}
          {bannerType === 'glass-orbit' && (
            <div dangerouslySetInnerHTML={{ __html: sanitizeSvg(getGlassOrbitSvg(svgParams)) }} />
          )}

          {/* Aurora Flowing Ribbon */}
          {bannerType === 'gradient-ribbon' && (
            <div dangerouslySetInnerHTML={{ __html: sanitizeSvg(getGradientRibbonSvg(svgParams)) }} />
          )}



          {/* Dynamic Capsule Vector Header */}
          {bannerType === 'capsule' && (
            <div
              style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}
              dangerouslySetInnerHTML={{
                __html: sanitizeSvg(getCapsuleSvg({
                  bannerTitle,
                  bannerSubtitle,
                  capsuleShape,
                  bannerTheme: activeTheme,
                  customHex1,
                  customHex2,
                  isCustomColor,
                  fontColor: capsuleFontColor,
                  descColor: capsuleDescColor,
                  bannerHeight,
                  fontSize: capsuleTitleSize,
                  descSize: capsuleDescSize,
                  fontAlignY: capsuleFontAlignY,
                  descAlignY: capsuleDescAlignY,
                  capsuleAnimation
                }))
              }}
            />
          )}

          {/* Animated Typing Terminal Loop */}
          {bannerType === 'typing' && (
            bannerSyntaxMode === 'service-url' && !typingError ? (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: (typingAlign || 'center') === 'center' ? 'center' : 'flex-start',
                  padding: '24px 16px',
                  background: typingLayout === 'clean' ? 'transparent' : 'rgba(0, 0, 0, 0.25)',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={getTypingUrl()}
                  alt="README Typing SVG Preview"
                  onError={() => setTypingError(true)}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: (typingAlign || 'center') === 'center' ? 'center' : 'flex-start',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  padding: typingLayout === 'clean' ? '16px 0' : '0'
                }}
                dangerouslySetInnerHTML={{
                  __html: sanitizeSvg(getTypingSvg({
                    bannerTitle,
                    bannerSubtitle,
                    typingLines,
                    typingFont,
                    typingColor,
                    typingPause,
                    typingSpeed,
                    typingEffect,
                    typingLayout,
                    typingAlign,
                    typingFontSize,
                    typingWidth,
                    typingHeight: typingLayout === 'clean' ? 90 : 160,
                    bannerTheme: activeTheme,
                    customHex1,
                    customHex2,
                    isCustomColor
                  }))
                }}
              />
            )
          )}

          {/* Geometric Polygon & Crystal Mesh Cover */}
          {(bannerType === 'geometric-mesh' || bannerType === 'cover') && (
            <div
              style={{ width: '100%', borderRadius: '10px', overflow: 'hidden' }}
              dangerouslySetInnerHTML={{
                __html: sanitizeSvg(getGeometricMeshSvg({
                  bannerTitle,
                  bannerSubtitle,
                  bannerTheme: activeTheme,
                  customHex1,
                  customHex2,
                  isCustomColor
                }))
              }}
            />
          )}
        </div>
      )}

      {activeMode === 'link' && renderVisualMockup(
        resolvedUrl || imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        imageAlt
      )}

      {activeMode === 'adaptive' && (
        <div style={{ width: '100%' }}>
          <div className="adaptive-theme-bar">
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>GitHub Theme Preview Simulator:</span>
            <div className="adaptive-theme-toggle">
              <button
                type="button"
                className={`studio-style-btn ${previewThemeMode === 'dark' ? 'active' : ''}`}
                onClick={() => setPreviewThemeMode('dark')}
              >
                🌙 Dark Mode
              </button>
              <button
                type="button"
                className={`studio-style-btn ${previewThemeMode === 'light' ? 'active' : ''}`}
                onClick={() => setPreviewThemeMode('light')}
              >
                ☀️ Light Mode
              </button>
            </div>
          </div>

          <div className={`adaptive-canvas-box theme-${previewThemeMode}`}>
            <img
              src={sanitizeSafeMediaUrl(previewThemeMode === 'dark' ? darkThemeUrl : lightThemeUrl, '')}
              alt={adaptiveAlt}
              style={{
                maxWidth: imageWidth === '100%' ? '100%' : `${imageWidth}px`,
                borderRadius: '6px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}
            />
          </div>
        </div>
      )}

      {/* Motion & Video / GIF Preview */}
      {activeMode === 'motion' && (
        <div
          className="motion-preview-box"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: motionAlign === 'left' ? 'flex-start' : motionAlign === 'right' ? 'flex-end' : 'center'
          }}
        >
          <div
            style={{
              width: motionWidth === '100%' ? '100%' : `${motionWidth}px`,
              maxWidth: '100%'
            }}
          >
            {/* macOS Window Frame */}
            {motionFrameStyle === 'mac-window' && (
              <div
                className="mockup-frame mockup-mac"
                style={{
                  boxShadow:
                    motionGlow === 'deep'
                      ? '0 24px 48px -12px rgba(0, 0, 0, 0.7)'
                      : motionGlow === 'glow'
                      ? '0 0 35px -5px rgba(56, 189, 248, 0.35)'
                      : motionGlow === 'soft'
                      ? '0 10px 30px -10px rgba(0, 0, 0, 0.4)'
                      : 'none',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#0d1117'
                }}
              >
                <div
                  className="mac-header"
                  style={{
                    padding: '8px 14px',
                    background: 'linear-gradient(180deg, #1f242c 0%, #161b22 100%)',
                    borderBottom: '1px solid #30363d',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <div className="mac-dots" style={{ display: 'flex', gap: '7px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: 'inset 0 0 1px rgba(0,0,0,0.5)' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: 'inset 0 0 1px rgba(0,0,0,0.5)' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: 'inset 0 0 1px rgba(0,0,0,0.5)' }} />
                  </div>
                  <span
                    className="mac-title"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: '11px',
                      color: '#c9d1d9',
                      fontFamily: 'monospace',
                      fontWeight: 600
                    }}
                  >
                    {motionTitle || 'VisualMark Studio - Live Demo'}
                  </span>
                  <div style={{ width: '48px' }} />
                </div>
                {renderMotionMediaContent()}
              </div>
            )}

            {/* Browser Address Bar Frame */}
            {motionFrameStyle === 'browser-bar' && (
              <div
                className="mockup-frame mockup-browser"
                style={{
                  boxShadow:
                    motionGlow === 'deep'
                      ? '0 24px 48px -12px rgba(0, 0, 0, 0.7)'
                      : motionGlow === 'glow'
                      ? '0 0 35px -5px rgba(56, 189, 248, 0.35)'
                      : motionGlow === 'soft'
                      ? '0 10px 30px -10px rgba(0, 0, 0, 0.4)'
                      : 'none',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#0d1117'
                }}
              >
                <div
                  className="browser-header"
                  style={{
                    padding: '7px 12px',
                    background: 'linear-gradient(180deg, #1f242c 0%, #161b22 100%)',
                    borderBottom: '1px solid #30363d',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div className="mac-dots" style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  </div>
                  <div className="browser-nav-icons" style={{ display: 'flex', gap: '4px', color: '#64748b' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>refresh</span>
                  </div>
                  <div
                    className="browser-url-bar"
                    style={{
                      flex: 1,
                      background: '#0d1117',
                      border: '1px solid #30363d',
                      borderRadius: '5px',
                      padding: '3px 10px',
                      fontSize: '11px',
                      color: '#c9d1d9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px', color: '#10b981' }}>lock</span>
                    <span className="truncate">{motionBrowserUrl || 'https://visualmark.dev/demo'}</span>
                  </div>
                </div>
                {renderMotionMediaContent()}
              </div>
            )}

            {/* Terminal Frame */}
            {motionFrameStyle === 'terminal' && (
              <div
                className="mockup-frame mockup-terminal"
                style={{
                  boxShadow:
                    motionGlow === 'deep'
                      ? '0 24px 48px -12px rgba(0, 0, 0, 0.7)'
                      : motionGlow === 'glow'
                      ? '0 0 35px -5px rgba(56, 189, 248, 0.35)'
                      : motionGlow === 'soft'
                      ? '0 10px 30px -10px rgba(0, 0, 0, 0.4)'
                      : 'none',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#0d1117'
                }}
              >
                <div
                  className="terminal-header"
                  style={{
                    padding: '7px 12px',
                    background: 'linear-gradient(180deg, #1f242c 0%, #161b22 100%)',
                    borderBottom: '1px solid #30363d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#30363d', display: 'inline-block' }} />
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#30363d', display: 'inline-block' }} />
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#30363d', display: 'inline-block' }} />
                  </div>
                  <span style={{ fontSize: '11px', color: '#8b949e', fontFamily: 'monospace' }}>
                    {motionTitle || 'user@visualmark:~ (zsh)'}
                  </span>
                  <div style={{ width: '30px' }} />
                </div>
                {renderMotionMediaContent()}
              </div>
            )}

            {/* Wide Video Banner & Clean Frame */}
            {(motionFrameStyle === 'banner' || motionFrameStyle === 'clean') && (
              <div
                style={{
                  boxShadow:
                    motionGlow === 'deep'
                      ? '0 24px 48px -12px rgba(0, 0, 0, 0.7)'
                      : motionGlow === 'glow'
                      ? '0 0 35px -5px rgba(56, 189, 248, 0.35)'
                      : motionGlow === 'soft'
                      ? '0 10px 30px -10px rgba(0, 0, 0, 0.4)'
                      : 'none',
                  border: motionFrameStyle === 'clean' ? '1px solid #30363d' : 'none',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#000000'
                }}
              >
                {renderMotionMediaContent()}
              </div>
            )}

            {motionCaption && (
              <div
                className="preview-caption-text"
                style={{
                  textAlign: motionAlign,
                  marginTop: '12px',
                  fontSize: '12px',
                  color: '#94a3b8',
                  fontStyle: 'italic',
                  letterSpacing: '0.2px'
                }}
              >
                {motionCaption}
              </div>
            )}
          </div>
        </div>
      )}

      {activeMode === 'upload' && (
        <div className="upload-preview-box" style={{ width: '100%' }}>
          {uploadedDataUrl ? (
            renderVisualMockup(uploadedDataUrl, uploadAlt)
          ) : (
            <div className="upload-empty-placeholder">
              <span className="material-symbols-outlined">image</span>
              <span>No screenshot pasted yet. Press Ctrl+V anywhere.</span>
            </div>
          )}
        </div>
      )}

      {activeMode === 'comparison' && (
        <div className="comp-preview-grid" style={{ width: '100%' }}>
          <div className="comp-card">
            <span className="comp-label">{compTitle1}</span>
            <img src={sanitizeSafeMediaUrl(compUrl1, '')} alt={compTitle1} className="comp-img" />
          </div>
          <div className="comp-card">
            <span className="comp-label">{compTitle2}</span>
            <img src={sanitizeSafeMediaUrl(compUrl2, '')} alt={compTitle2} className="comp-img" />
          </div>
        </div>
      )}
    </div>
  )
}
