import React from 'react'
import { FRAME_STYLES } from './imageStudioConstants'

export default function VisualMockupForm({
  activeMode,
  imageUrl,
  setImageUrl,
  resolveNote,
  isResolving,
  imageAlt,
  setImageAlt,
  imageCaption,
  setImageCaption,
  frameStyle,
  setFrameStyle,
  browserUrl,
  setBrowserUrl,
  terminalCommand,
  setTerminalCommand,
  imageAlign,
  setImageAlign,
  imageWidth,
  setImageWidth,
  isDragging,
  setIsDragging,
  handleFileUpload,
  uploadMeta,
  uploadAlt,
  setUploadAlt,
  uploadSyntaxChoice,
  setUploadSyntaxChoice,
  uploadRelativePath,
  setUploadRelativePath,
  uploadedDataUrl,
  handleDownloadAsset
}) {
  return (
    <>
      {activeMode === 'link' && (
        <>
          <div className="studio-section">
            <label className="studio-section-label">Image Source URL</label>
            <div className="studio-field">
              <span className="studio-field-label">Direct URL or Google Share / GitHub Blob link</span>
              <input
                type="text"
                className="studio-text-input"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or https://share.google/..."
              />
              {resolveNote && (
                <div className={`url-resolve-status ${isResolving ? 'resolving' : 'resolved'}`}>
                  <span className="material-symbols-outlined icon-xs">
                    {isResolving ? 'sync' : 'check_circle'}
                  </span>
                  <span>{resolveNote}</span>
                </div>
              )}
            </div>

            <div className="studio-input-duo">
              <div className="studio-field">
                <span className="studio-field-label">Alt Text</span>
                <input
                  type="text"
                  className="studio-text-input"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="e.g. Dashboard Screenshot"
                />
              </div>
              <div className="studio-field">
                <span className="studio-field-label">Optional Caption</span>
                <input
                  type="text"
                  className="studio-text-input"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="e.g. Figure 1: Live Analytics"
                />
              </div>
            </div>
          </div>

          {/* 6 Mockup Frames Selector */}
          <div className="studio-section">
            <label className="studio-section-label">Mockup Frame Style (6 Presets)</label>
            <div className="frame-options-grid">
              {FRAME_STYLES.map((fs) => (
                <button
                  key={fs.id}
                  type="button"
                  className={`frame-option-card ${frameStyle === fs.id ? 'active' : ''}`}
                  onClick={() => setFrameStyle(fs.id)}
                >
                  <span className="frame-card-title">{fs.label}</span>
                  <span className="frame-card-desc">{fs.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Specific Frame Settings */}
          {frameStyle === 'browser-bar' && (
            <div className="studio-section">
              <label className="studio-section-label">Browser Address Bar URL</label>
              <input
                type="text"
                className="studio-text-input"
                value={browserUrl}
                onChange={(e) => setBrowserUrl(e.target.value)}
                placeholder="https://my-app.dev"
              />
            </div>
          )}

          {frameStyle === 'terminal' && (
            <div className="studio-section">
              <label className="studio-section-label">Terminal Prompt Command</label>
              <input
                type="text"
                className="studio-text-input"
                value={terminalCommand}
                onChange={(e) => setTerminalCommand(e.target.value)}
                placeholder="$ npm run dev"
              />
            </div>
          )}

          <div className="studio-section">
            <label className="studio-section-label">Alignment & Width</label>
            <div className="studio-segmented-styles">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  type="button"
                  className={`studio-style-btn capitalize ${imageAlign === align ? 'active' : ''}`}
                  onClick={() => setImageAlign(align)}
                >
                  {align}
                </button>
              ))}
            </div>

            <div className="studio-segmented-styles" style={{ marginTop: '6px' }}>
              {['400', '600', '800', '100%'].map((w) => (
                <button
                  key={w}
                  type="button"
                  className={`studio-style-btn ${imageWidth === w ? 'active' : ''}`}
                  onClick={() => setImageWidth(w)}
                >
                  {w === '100%' ? '100% Width' : `${w}px`}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {activeMode === 'upload' && (
        <div className="studio-section">
          <label className="studio-section-label">Screenshot Paste & Auto-Compressor</label>
          <div
            className={`dropzone-card ${isDragging ? 'dragging' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0])
            }}
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = 'image/*'
              input.onchange = (ev) => {
                if (ev.target.files?.[0]) handleFileUpload(ev.target.files[0])
              }
              input.click()
            }}
          >
            <span className="material-symbols-outlined dropzone-icon">auto_fix_high</span>
            <span className="dropzone-title">Press Ctrl+V anywhere or Drop Image here</span>
            <span className="dropzone-subtitle">Auto-downscaled & compressed to lightweight WebP</span>
          </div>

          {uploadMeta && (
            <>
              <div className="compression-badge">
                <span className="material-symbols-outlined icon-xs">bolt</span>
                <span>
                  Optimized: {uploadMeta.origKb} KB → {uploadMeta.compKb} KB (-{uploadMeta.savings}%)
                </span>
              </div>

              <div className="upload-meta-card">
                <div className="meta-row">
                  <span className="meta-lbl">Target Filename:</span>
                  <span className="meta-val truncate">{uploadMeta.name}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Dimensions:</span>
                  <span className="meta-val">{uploadMeta.width} × {uploadMeta.height} px</span>
                </div>
              </div>
            </>
          )}

          {/* 6 Mockup Frames Selector for Pasted Screenshots */}
          <div className="studio-section" style={{ marginTop: '10px' }}>
            <label className="studio-section-label">Mockup Frame Style (6 Presets)</label>
            <div className="frame-options-grid">
              {FRAME_STYLES.map((fs) => (
                <button
                  key={fs.id}
                  type="button"
                  className={`frame-option-card ${frameStyle === fs.id ? 'active' : ''}`}
                  onClick={() => setFrameStyle(fs.id)}
                >
                  <span className="frame-card-title">{fs.label}</span>
                  <span className="frame-card-desc">{fs.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Specific Frame Settings */}
          {frameStyle === 'browser-bar' && (
            <div className="studio-section" style={{ marginTop: '6px' }}>
              <label className="studio-section-label">Browser Address Bar URL</label>
              <input
                type="text"
                className="studio-text-input"
                value={browserUrl}
                onChange={(e) => setBrowserUrl(e.target.value)}
                placeholder="https://my-app.dev"
              />
            </div>
          )}

          {frameStyle === 'terminal' && (
            <div className="studio-section" style={{ marginTop: '6px' }}>
              <label className="studio-section-label">Terminal Prompt Command</label>
              <input
                type="text"
                className="studio-text-input"
                value={terminalCommand}
                onChange={(e) => setTerminalCommand(e.target.value)}
                placeholder="$ npm run dev"
              />
            </div>
          )}

          <div className="studio-field" style={{ marginTop: '8px' }}>
            <span className="studio-field-label">Alt Text</span>
            <input
              type="text"
              className="studio-text-input"
              value={uploadAlt}
              onChange={(e) => setUploadAlt(e.target.value)}
              placeholder="e.g. Application Screenshot"
            />
          </div>

          <div className="studio-section" style={{ marginTop: '8px' }}>
            <label className="studio-section-label">Markdown Reference Strategy</label>
            <div className="studio-segmented-styles">
              <button
                type="button"
                className={`studio-style-btn ${uploadSyntaxChoice === 'relative' ? 'active' : ''}`}
                onClick={() => setUploadSyntaxChoice('relative')}
              >
                📁 Repository Asset (GitHub Recommended)
              </button>
              <button
                type="button"
                className={`studio-style-btn ${uploadSyntaxChoice === 'base64' ? 'active' : ''}`}
                onClick={() => setUploadSyntaxChoice('base64')}
              >
                ⚡ Inline Base64 (Local Only)
              </button>
            </div>

            {uploadSyntaxChoice === 'relative' ? (
              <div style={{ marginTop: '8px' }}>
                <div className="studio-field">
                  <span className="studio-field-label">Relative Path</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={uploadRelativePath}
                    onChange={(e) => setUploadRelativePath(e.target.value)}
                    placeholder="assets/screenshot.webp"
                  />
                </div>
                {uploadedDataUrl && (
                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={handleDownloadAsset}
                    style={{ marginTop: '6px', fontSize: '11px', padding: '4px 10px', height: '28px', background: 'rgba(56, 189, 248, 0.15)', borderColor: '#38bdf8', color: '#e0f2fe' }}
                  >
                    <span className="material-symbols-outlined icon-xs">download</span>
                    <span>Download {uploadMeta?.name || 'screenshot.webp'}</span>
                  </button>
                )}
              </div>
            ) : (
              <div style={{ marginTop: '8px', padding: '10px 14px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '12px', color: '#f59e0b' }}>
                <strong>⚠️ GitHub Warning:</strong> GitHub Camo proxy strictly blocks Base64 data URIs in README files. Use <strong>Repository Asset</strong> to display this screenshot on GitHub.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
