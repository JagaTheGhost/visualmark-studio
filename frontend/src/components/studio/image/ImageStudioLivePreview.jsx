import React from 'react'
import { sanitizeSafeMediaUrl } from '../../../utils/securityUtils'
import {
  getHudTelemetrySvg,
  getNeofetchSvg,
  getCyberpunkGridSvg,
  getSwissMinimalSvg,
  getGlassOrbitSvg,
  getGradientRibbonSvg
} from './svgBannerGenerators'

export default function ImageStudioLivePreview({
  activeMode,
  bannerType,
  bannerTitle,
  bannerSubtitle,
  hudStatus,
  hudVersion,
  bannerTags,
  bannerTheme,
  neofetchOs,
  neofetchLicense,
  githubRepoName,
  getGithubPinUrl,
  getCapsuleUrl,
  getTypingUrl,
  typingError,
  setTypingError,
  typingColor,
  typingFont,
  typingLines,
  resolvedUrl,
  imageUrl,
  imageAlt,
  imageAlign,
  imageWidth,
  imageCaption,
  frameStyle,
  browserUrl,
  terminalCommand,
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
  markdownSnippet,
  copied,
  handleCopy
}) {
  const renderVisualMockup = (targetSrc, altText) => {
    const safeSrc = sanitizeSafeMediaUrl(
      targetSrc,
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
    )
    return (
      <div className={`link-preview-box align-${imageAlign}`}>
        {frameStyle === 'mac-window' ? (
          <div className="mockup-mac-window" style={{ maxWidth: imageWidth === '100%' ? '100%' : `${imageWidth}px` }}>
            <div className="mac-window-bar">
              <span className="mac-dot dot-red" />
              <span className="mac-dot dot-yellow" />
              <span className="mac-dot dot-green" />
            </div>
            <img src={safeSrc} alt={altText} className="mockup-img" />
          </div>
        ) : frameStyle === 'browser-bar' ? (
          <div className="mockup-browser" style={{ maxWidth: imageWidth === '100%' ? '100%' : `${imageWidth}px` }}>
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
          <div className="mockup-terminal" style={{ maxWidth: imageWidth === '100%' ? '100%' : `${imageWidth}px` }}>
            <div className="terminal-window-bar">
              <span className="terminal-title">bash - 80×24</span>
              <span style={{ fontSize: '10px', color: '#58a6ff' }}>{terminalCommand}</span>
            </div>
            <img src={safeSrc} alt={altText} className="mockup-img" />
          </div>
        ) : frameStyle === 'mobile' ? (
          <div className="mockup-mobile">
            <div className="mobile-notch-bar">
              <div className="mobile-notch-pill" />
            </div>
            <img src={safeSrc} alt={altText} className="mockup-img" />
          </div>
        ) : frameStyle === 'rounded-card' ? (
          <div className="mockup-rounded-card" style={{ maxWidth: imageWidth === '100%' ? '100%' : `${imageWidth}px` }}>
            <img src={safeSrc} alt={altText} className="mockup-img" />
          </div>
        ) : (
          <img
            src={safeSrc}
            alt={altText}
            style={{ maxWidth: imageWidth === '100%' ? '100%' : `${imageWidth}px`, borderRadius: '6px' }}
          />
        )}
        {imageCaption && <div className="preview-caption-text">{imageCaption}</div>}
      </div>
    )
  }

  const svgParams = {
    bannerTitle,
    bannerSubtitle,
    hudStatus,
    hudVersion,
    bannerTags,
    bannerTheme,
    neofetchOs,
    neofetchLicense
  }

  return (
    <div className="studio-preview-column custom-scrollbar" style={{ flex: 1, minWidth: 0 }}>
      {/* Live Preview Card */}
      <div className="studio-card">
        <div className="studio-card-header">
          <span className="studio-card-title">Live Visual Render Preview</span>
          <span className="studio-card-tag">{activeMode.toUpperCase()}</span>
        </div>
        <div className="studio-image-preview-stage">
          {activeMode === 'banner' && (
            <div className="banner-preview-box">
              {/* Stitch HUD Telemetry */}
              {bannerType === 'hud-telemetry' && (
                <div dangerouslySetInnerHTML={{ __html: getHudTelemetrySvg(svgParams) }} />
              )}

              {/* Neofetch Terminal */}
              {bannerType === 'neofetch' && (
                <div dangerouslySetInnerHTML={{ __html: getNeofetchSvg(svgParams) }} />
              )}

              {/* Cyberpunk Perspective Grid */}
              {bannerType === 'cyberpunk-grid' && (
                <div dangerouslySetInnerHTML={{ __html: getCyberpunkGridSvg(svgParams) }} />
              )}

              {/* Swiss Typographic Grid */}
              {bannerType === 'swiss-minimal' && (
                <div dangerouslySetInnerHTML={{ __html: getSwissMinimalSvg(svgParams) }} />
              )}

              {/* Glassmorphism Tech Matrix */}
              {bannerType === 'glass-orbit' && (
                <div dangerouslySetInnerHTML={{ __html: getGlassOrbitSvg(svgParams) }} />
              )}

              {/* Aurora Flowing Ribbon */}
              {bannerType === 'gradient-ribbon' && (
                <div dangerouslySetInnerHTML={{ __html: getGradientRibbonSvg(svgParams) }} />
              )}

              {/* Live GitHub Repo Stats Pin */}
              {bannerType === 'github-stats' && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={getGithubPinUrl()}
                    alt={`${githubRepoName} Stats`}
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '6px' }}
                  />
                </div>
              )}

              {/* Dynamic Capsule Header */}
              {bannerType === 'capsule' && (
                <img
                  src={getCapsuleUrl()}
                  alt={`${bannerTitle} Banner`}
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
                />
              )}

              {/* Animated Typing Loop */}
              {bannerType === 'typing' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  {!typingError ? (
                    <img
                      src={sanitizeSafeMediaUrl(getTypingUrl(), '')}
                      alt={`${bannerTitle} Typing`}
                      style={{ maxWidth: '100%', height: 'auto' }}
                      onError={() => setTypingError(true)}
                    />
                  ) : (
                    <div className="simulated-typing-banner">
                      <div
                        className="simulated-typing-text"
                        style={{
                          color: `#${(typingColor || '6366F1').replace('#', '')}`,
                          fontFamily: typingFont === 'Fira Code' ? "'Fira Code', monospace" : 'monospace'
                        }}
                      >
                        <span>{typingLines.split(';')[0] || bannerTitle}</span>
                        <span className="simulated-typing-cursor">|</span>
                      </div>
                      <div className="offline-notice-pill">
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>wifi_off</span>
                        <span>Typing CDN timed out • Simulated preview active • Markdown is ready</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Curated Tech Cover */}
              {bannerType === 'cover' && (
                <img
                  src={sanitizeSafeMediaUrl(bannerTheme?.coverUrl, '')}
                  alt={`${bannerTitle} Cover`}
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px' }}
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

          {activeMode === 'upload' && (
            <div className="upload-preview-box">
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
            <div className="comp-preview-grid">
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
      </div>

      {/* Generated Markdown Syntax Card */}
      <div className="studio-card">
        <div className="studio-card-header">
          <span className="studio-card-title">Markdown Syntax Output</span>
          <button
            type="button"
            className="btn-studio-secondary"
            onClick={handleCopy}
            style={{ height: '24px', padding: '0 8px', fontSize: '10px' }}
          >
            <span className="material-symbols-outlined icon-xs">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <pre className="studio-code-block custom-scrollbar">
          <code>{markdownSnippet}</code>
        </pre>
      </div>
    </div>
  )
}
