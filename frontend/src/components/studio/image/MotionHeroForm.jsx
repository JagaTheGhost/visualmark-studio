import React from 'react'
import { MOTION_FRAME_STYLES, MOCKUP_GLOW_STYLES, MOTION_PRESETS } from './imageStudioConstants'

export default function MotionHeroForm({
  motionUrl,
  setMotionUrl,
  motionType,
  setMotionType,
  motionFrameStyle,
  setMotionFrameStyle,
  motionTitle,
  setMotionTitle,
  motionCaption,
  setMotionCaption,
  motionAlign,
  setMotionAlign,
  motionWidth,
  setMotionWidth,
  motionAutoplay,
  setMotionAutoplay,
  motionLoop,
  setMotionLoop,
  motionMuted,
  setMotionMuted,
  motionControls,
  setMotionControls,
  motionGlow,
  setMotionGlow,
  motionBrowserUrl,
  setMotionBrowserUrl
}) {
  return (
    <div className="studio-form-stack">
      {/* 1. Media Source & Format */}
      <div className="studio-section">
        <label className="studio-section-label">Media Source (GIF / Video)</label>
        
        {/* Format Switcher */}
        <div className="studio-segmented-styles" style={{ marginBottom: '10px' }}>
          <button
            type="button"
            className={`studio-style-btn ${motionType === 'video' ? 'active' : ''}`}
            onClick={() => setMotionType('video')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px', marginRight: '5px' }}>videocam</span>
            <span>MP4 / WebM Video</span>
          </button>
          <button
            type="button"
            className={`studio-style-btn ${motionType === 'gif' ? 'active' : ''}`}
            onClick={() => setMotionType('gif')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px', marginRight: '5px' }}>gif</span>
            <span>Animated GIF</span>
          </button>
        </div>

        <div className="studio-field">
          <span className="studio-field-label">File Path or Direct Media URL</span>
          <input
            type="text"
            className="studio-text-input"
            value={motionUrl}
            onChange={(e) => setMotionUrl(e.target.value)}
            placeholder={motionType === 'video' ? 'assets/demo.mp4 or https://...' : 'assets/preview.gif or https://...'}
          />
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted, #8b949e)', marginTop: '4px' }}>
            Supports relative workspace paths (e.g. <code>assets/demo.mp4</code>) or direct HTTPS URLs.
          </span>
        </div>

        {/* Quick Demo Presets */}
        <div className="studio-field" style={{ marginTop: '10px' }}>
          <span className="studio-field-label">Sample Media Presets</span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {MOTION_PRESETS.map((preset) => {
              const isCurrent = motionUrl === preset.url
              return (
                <button
                  key={preset.name}
                  type="button"
                  className={`studio-chip-btn ${isCurrent ? 'active' : ''}`}
                  onClick={() => {
                    setMotionUrl(preset.url)
                    setMotionType(preset.type)
                    if (preset.title) setMotionTitle(preset.title)
                  }}
                  title={`Load ${preset.name} (${preset.type.toUpperCase()})`}
                >
                  <span style={{ color: preset.type === 'video' ? '#38bdf8' : '#ec4899', fontWeight: 700, fontSize: '9px' }}>
                    [{preset.type.toUpperCase()}]
                  </span>
                  <span>{preset.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 2. Device Frame & Presentation Architecture */}
      <div className="studio-section">
        <label className="studio-section-label">Presentation Frame</label>
        <div className="banner-type-card-grid">
          {MOTION_FRAME_STYLES.map((frame) => {
            const isSelected = motionFrameStyle === frame.id
            return (
              <button
                key={frame.id}
                type="button"
                className={`banner-type-card ${isSelected ? 'active' : ''}`}
                onClick={() => setMotionFrameStyle(frame.id)}
              >
                <span className="material-symbols-outlined banner-card-icon">{frame.icon}</span>
                <div className="banner-card-info">
                  <span className="banner-card-title">{frame.label}</span>
                  <span className="banner-card-desc">{frame.desc}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Frame Specific Options */}
        {(motionFrameStyle === 'mac-window' || motionFrameStyle === 'terminal') && (
          <div className="studio-field" style={{ marginTop: '10px' }}>
            <span className="studio-field-label">Window Title Bar Label</span>
            <input
              type="text"
              className="studio-text-input"
              value={motionTitle}
              onChange={(e) => setMotionTitle(e.target.value)}
              placeholder="e.g. VisualMark Studio - Live Demo"
            />
          </div>
        )}

        {motionFrameStyle === 'browser-bar' && (
          <div className="studio-field" style={{ marginTop: '10px' }}>
            <span className="studio-field-label">Browser Address Bar URL</span>
            <input
              type="text"
              className="studio-text-input"
              value={motionBrowserUrl}
              onChange={(e) => setMotionBrowserUrl(e.target.value)}
              placeholder="https://visualmark.dev/demo"
            />
          </div>
        )}

        {/* Glow & Elevation Effect */}
        <div className="studio-field" style={{ marginTop: '10px' }}>
          <span className="studio-field-label">Frame Shadow & Elevation Glow</span>
          <div className="studio-segmented-styles">
            {MOCKUP_GLOW_STYLES.map((glow) => (
              <button
                key={glow.id}
                type="button"
                className={`studio-style-btn ${motionGlow === glow.id ? 'active' : ''}`}
                onClick={() => setMotionGlow(glow.id)}
              >
                {glow.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Playback & Video Options (for video type) */}
      {motionType === 'video' && (
        <div className="studio-section">
          <label className="studio-section-label">Video Playback Behavior</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <label className="studio-checkbox-label">
              <input
                type="checkbox"
                checked={motionAutoplay}
                onChange={(e) => setMotionAutoplay(e.target.checked)}
              />
              <span>Autoplay on Load</span>
            </label>
            <label className="studio-checkbox-label">
              <input
                type="checkbox"
                checked={motionLoop}
                onChange={(e) => setMotionLoop(e.target.checked)}
              />
              <span>Loop Continuously</span>
            </label>
            <label className="studio-checkbox-label">
              <input
                type="checkbox"
                checked={motionMuted}
                onChange={(e) => setMotionMuted(e.target.checked)}
              />
              <span>Muted (Required for Autoplay)</span>
            </label>
            <label className="studio-checkbox-label">
              <input
                type="checkbox"
                checked={motionControls}
                onChange={(e) => setMotionControls(e.target.checked)}
              />
              <span>Show Native Controls</span>
            </label>
          </div>
        </div>
      )}

      {/* 4. Layout Sizing & Captions */}
      <div className="studio-section">
        <label className="studio-section-label">Dimensions & Layout</label>
        
        <div className="studio-input-duo">
          <div className="studio-field">
            <span className="studio-field-label">Alignment</span>
            <div className="studio-segmented-styles">
              {['center', 'left', 'right'].map((al) => (
                <button
                  key={al}
                  type="button"
                  className={`studio-style-btn capitalize ${motionAlign === al ? 'active' : ''}`}
                  onClick={() => setMotionAlign(al)}
                >
                  {al}
                </button>
              ))}
            </div>
          </div>

          <div className="studio-field">
            <span className="studio-field-label">Width Constraint</span>
            <div className="studio-segmented-styles">
              {['100%', '800', '640'].map((w) => (
                <button
                  key={w}
                  type="button"
                  className={`studio-style-btn ${motionWidth === w ? 'active' : ''}`}
                  onClick={() => setMotionWidth(w)}
                >
                  {w === '100%' ? 'Full (100%)' : `${w}px`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="studio-field" style={{ marginTop: '10px' }}>
          <span className="studio-field-label">Sub-caption (Optional)</span>
          <input
            type="text"
            className="studio-text-input"
            value={motionCaption}
            onChange={(e) => setMotionCaption(e.target.value)}
            placeholder="e.g. Interactive developer workflow demonstration"
          />
        </div>
      </div>
    </div>
  )
}
