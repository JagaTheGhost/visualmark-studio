import React, { useState, useEffect, useMemo } from 'react'
import {
  REPO_CARD_THEMES,
  REPO_CARD_TEMPLATES,
  generateOfficialPinSvg,
  generateBentoSpecSvg,
  generateLanguagesBarSvg,
  generateMinimalCompactSvg,
  generateCyberGlowSvg,
  generateGlassFrostedSvg,
  generateSocialHeroSvg,
  generateTerminalCliSvg
} from '../../utils/modernRepoCardEngine'
import { GITHUB_LANG_COLORS } from '../../data/badgeStudioData'

/**
 * Custom Hook containing all GitHub Repo Card state and actions.
 */
export function useRepoCardState({
  repoUrl = '',
  onInsertBadge = () => {}
} = {}) {
  // Target Repo & Sync
  const initialRepo = useMemo(() => {
    if (!repoUrl) return 'facebook/react'
    return repoUrl.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')
  }, [repoUrl])

  const [targetRepo, setTargetRepo] = useState(initialRepo)
  const [isFetching, setIsFetching] = useState(false)
  const [syncStatus, setSyncStatus] = useState(null) // { type: 'success' | 'error', message: string }

  // Template & Theme
  const [template, setTemplate] = useState('official-pin')
  const [theme, setTheme] = useState('auto-adaptive')
  const [accentColor, setAccentColor] = useState('#58a6ff')
  const [radius, setRadius] = useState(8)
  const [previewBg, setPreviewBg] = useState('dark') // 'dark' | 'light'

  // Card Metadata
  const [desc, setDesc] = useState('The library for web and native user interfaces')
  const [stars, setStars] = useState('230k')
  const [forks, setForks] = useState('46k')
  const [issues, setIssues] = useState('1.1k')
  const [license, setLicense] = useState('MIT')
  const [lang, setLang] = useState('JavaScript')
  const [langColor, setLangColor] = useState('#f1e05a')
  const [languagesList, setLanguagesList] = useState([
    { name: 'JavaScript', percent: 78.4, color: '#f1e05a' },
    { name: 'TypeScript', percent: 14.2, color: '#3178c6' },
    { name: 'HTML', percent: 4.1, color: '#e34c26' },
    { name: 'CSS', percent: 3.3, color: '#563d7c' }
  ])

  // Custom Data Override Drawer
  const [showDataOverrides, setShowDataOverrides] = useState(false)
  const [saveStatusMessage, setSaveStatusMessage] = useState('')

  // Split owner and repo name
  const cleanRepo = useMemo(() => {
    return targetRepo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '') || 'owner/repo'
  }, [targetRepo])

  const [repoOwner, repoName] = useMemo(() => {
    const parts = cleanRepo.split('/')
    return [parts[0] || 'owner', parts[1] || 'repo']
  }, [cleanRepo])

  // Fetch real data from GitHub API
  const handleSyncGitHub = async (overrideRepo = null) => {
    const target = overrideRepo || cleanRepo
    if (!target || !target.includes('/')) {
      setSyncStatus({ type: 'error', message: 'Enter a valid owner/repo (e.g. facebook/react)' })
      return
    }

    const [owner, name] = target.split('/')
    setIsFetching(true)
    setSyncStatus(null)

    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${name}`)
      if (res.status === 404) {
        setSyncStatus({ type: 'error', message: `Repository "${owner}/${name}" not found on GitHub.` })
        return
      }
      if (res.status === 403) {
        setSyncStatus({ type: 'error', message: 'GitHub API rate limit exceeded. You can edit stats manually below.' })
        return
      }
      if (!res.ok) {
        setSyncStatus({ type: 'error', message: `GitHub API error (${res.status}): ${res.statusText}` })
        return
      }

      const data = await res.json()
      if (data.description) setDesc(data.description)
      if (data.stargazers_count !== undefined) {
        const sc = data.stargazers_count
        setStars(sc >= 1000 ? `${(sc / 1000).toFixed(1)}k` : String(sc))
      }
      if (data.forks_count !== undefined) {
        const fc = data.forks_count
        setForks(fc >= 1000 ? `${(fc / 1000).toFixed(1)}k` : String(fc))
      }
      if (data.open_issues_count !== undefined) {
        setIssues(String(data.open_issues_count))
      }
      if (data.license?.spdx_id) {
        setLicense(data.license.spdx_id)
      } else if (data.license?.name) {
        setLicense(data.license.name)
      }
      if (data.language) {
        setLang(data.language)
        const matched = GITHUB_LANG_COLORS[data.language]
        if (matched) setLangColor(matched)
      }

      // Fetch languages distribution breakdown
      try {
        const langRes = await fetch(`https://api.github.com/repos/${owner}/${name}/languages`)
        if (langRes.ok) {
          const lData = await langRes.json()
          const totalBytes = Object.values(lData).reduce((a, b) => a + b, 0)
          if (totalBytes > 0) {
            const parsedLangs = Object.entries(lData)
              .map(([lName, bytes]) => ({
                name: lName,
                percent: Math.round((bytes / totalBytes) * 1000) / 10,
                color: GITHUB_LANG_COLORS[lName] || '#8b949e'
              }))
              .filter((l) => l.percent >= 0.5)
              .slice(0, 5)

            if (parsedLangs.length > 0) {
              setLanguagesList(parsedLangs)
            }
          }
        }
      } catch (lErr) {
        console.warn('Could not fetch language distribution:', lErr)
      }

      setSyncStatus({ type: 'success', message: `Synced live stats for ${owner}/${name}!` })
      setTimeout(() => setSyncStatus(null), 4000)
    } catch (err) {
      console.error('Fetch GitHub Data Error:', err)
      setSyncStatus({ type: 'error', message: 'Network error contacting GitHub API.' })
    } finally {
      setIsFetching(false)
    }
  }

  // Detect local git repo from Electron workspace
  const handleDetectWorkspaceGit = async () => {
    if (typeof window === 'undefined' || !window.electronAPI) return
    try {
      if (window.electronAPI.detectGitRemote) {
        const detected = await window.electronAPI.detectGitRemote()
        if (detected && detected.repo) {
          const parsed = detected.repo.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')
          setTargetRepo(parsed)
          await handleSyncGitHub(parsed)
        }
      }
    } catch (err) {
      console.warn('Could not detect local git remote:', err)
    }
  }

  // Generate SVG on the fly using modern pure vector engine
  const currentSvg = useMemo(() => {
    const params = {
      owner: repoOwner,
      repo: repoName,
      desc,
      stars,
      forks,
      issues,
      license,
      lang,
      langColor,
      languages: languagesList,
      accentColor,
      theme,
      radius: Number(radius)
    }

    switch (template) {
      case 'official-pin':
        return generateOfficialPinSvg(params)
      case 'bento-spec':
        return generateBentoSpecSvg(params)
      case 'languages-distribution':
        return generateLanguagesBarSvg(params)
      case 'minimal-compact':
        return generateMinimalCompactSvg(params)
      case 'cyber-glow':
        return generateCyberGlowSvg(params)
      case 'glass-frosted':
        return generateGlassFrostedSvg(params)
      case 'social-hero':
        return generateSocialHeroSvg(params)
      case 'terminal-cli':
        return generateTerminalCliSvg(params)
      default:
        return generateOfficialPinSvg(params)
    }
  }, [
    template,
    repoOwner,
    repoName,
    desc,
    stars,
    forks,
    issues,
    license,
    lang,
    langColor,
    languagesList,
    accentColor,
    theme,
    radius
  ])

  // Unified Embed Handler: saves .svg to ./assets/ and embeds into Markdown
  const handleInsertCard = async () => {
    try {
      const filename = `${repoName}-card.svg`
      const relativePath = `assets/${filename}`
      let saved = false

      if (typeof window !== 'undefined' && window.electronAPI) {
        if (window.electronAPI.getDefaultWorkspace) {
          const ws = await window.electronAPI.getDefaultWorkspace()
          if (ws && ws.rootPath) {
            const cleanRoot = ws.rootPath.replace(/[/\\]+$/, '')
            const fullPath = `${cleanRoot}/${relativePath}`
            const res = await window.electronAPI.createFileDirect(fullPath, currentSvg)
            if (res && res.success) saved = true
          }
        }
        if (!saved && window.electronAPI.createFileDirect) {
          const res = await window.electronAPI.createFileDirect(relativePath, currentSvg)
          if (res && res.success) saved = true
        }
      }

      const snippet = `<div align="center">\n  <a href="https://github.com/${cleanRepo}">\n    <img src="${relativePath}" alt="${repoName}" width="500" />\n  </a>\n</div>`
      onInsertBadge(snippet)

      setSaveStatusMessage(saved ? `✓ Saved to ${relativePath} and embedded!` : '✓ Embedded into markdown document!')
      setTimeout(() => setSaveStatusMessage(''), 3000)
    } catch (err) {
      console.error('Insert card error:', err)
      const snippet = `<div align="center">\n  <a href="https://github.com/${cleanRepo}">\n    <img src="assets/${repoName}-card.svg" alt="${repoName}" width="500" />\n  </a>\n</div>`
      onInsertBadge(snippet)
    }
  }

  const handleCopySvg = () => {
    navigator.clipboard.writeText(currentSvg)
    setSaveStatusMessage('✓ Copied SVG code to clipboard!')
    setTimeout(() => setSaveStatusMessage(''), 2500)
  }

  const handleCopyMarkdown = () => {
    const snippet = `<div align="center">\n  <a href="https://github.com/${cleanRepo}">\n    <img src="assets/${repoName}-card.svg" alt="${repoName}" width="500" />\n  </a>\n</div>`
    navigator.clipboard.writeText(snippet)
    setSaveStatusMessage('✓ Copied Markdown to clipboard!')
    setTimeout(() => setSaveStatusMessage(''), 2500)
  }

  const handleDownloadSvg = () => {
    const filename = `${repoName}-card.svg`
    const blob = new Blob([currentSvg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
    setSaveStatusMessage(`✓ Downloaded ${filename}!`)
    setTimeout(() => setSaveStatusMessage(''), 2500)
  }

  const generatedSnippet = `<div align="center">\n  <a href="https://github.com/${cleanRepo}">\n    <img src="assets/${repoName}-card.svg" alt="${repoName}" width="500" />\n  </a>\n</div>`

  return {
    targetRepo,
    setTargetRepo,
    cleanRepo,
    repoOwner,
    repoName,
    isFetching,
    syncStatus,
    setSyncStatus,
    handleSyncGitHub,
    handleDetectWorkspaceGit,
    template,
    setTemplate,
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    radius,
    setRadius,
    previewBg,
    setPreviewBg,
    desc,
    setDesc,
    stars,
    setStars,
    forks,
    setForks,
    issues,
    setIssues,
    license,
    setLicense,
    lang,
    setLang,
    langColor,
    setLangColor,
    languagesList,
    setLanguagesList,
    showDataOverrides,
    setShowDataOverrides,
    saveStatusMessage,
    currentSvg,
    generatedSnippet,
    handleInsertCard,
    handleCopySvg,
    handleCopyMarkdown,
    handleDownloadSvg
  }
}

/**
 * Left Inspector Panel Component (3-Step Guided Workflow)
 */
export function RepoCardInspector(props) {
  const resolved = props.cardState || props
  const {
    targetRepo,
    setTargetRepo,
    isFetching,
    syncStatus,
    setSyncStatus,
    handleSyncGitHub,
    handleDetectWorkspaceGit,
    template,
    setTemplate,
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    radius,
    setRadius,
    desc,
    setDesc,
    stars,
    setStars,
    forks,
    setForks,
    issues,
    setIssues,
    license,
    setLicense,
    lang,
    setLang,
    langColor,
    setLangColor,
    showDataOverrides,
    setShowDataOverrides
  } = resolved

  return (
    <div className="repo-card-inspector custom-scrollbar">
      {/* Step 1: Target Repository & Sync */}
      <div className="inspector-step-card">
        <div className="inspector-step-header">
          <span className="inspector-step-num">1</span>
          <span className="inspector-step-title">Target Repository &amp; Live Data</span>
        </div>

        <div className="inspector-field-group">
          <div className="repo-target-input-row">
            <input
              type="text"
              className="studio-text-input repo-target-input"
              value={targetRepo}
              onChange={(e) => setTargetRepo(e.target.value)}
              placeholder="owner/repo (e.g. facebook/react)"
            />
            <button
              type="button"
              className="btn-sync-action primary"
              onClick={() => handleSyncGitHub()}
              disabled={isFetching}
              title="Fetch live stats from GitHub REST API"
            >
              <span className={`material-symbols-outlined ${isFetching ? 'spin' : ''}`} style={{ fontSize: '15px' }}>
                {isFetching ? 'sync' : 'bolt'}
              </span>
              <span>{isFetching ? 'Syncing...' : 'Sync Live'}</span>
            </button>
            {typeof window !== 'undefined' && window.electronAPI && (
              <button
                type="button"
                className="btn-sync-action secondary"
                onClick={handleDetectWorkspaceGit}
                title="Detect from workspace Git remote"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>folder_open</span>
                <span>Local Git</span>
              </button>
            )}
          </div>

          {syncStatus && (
            <div className={`repo-sync-alert ${syncStatus.type}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                {syncStatus.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span>{syncStatus.message}</span>
              <button
                type="button"
                className="repo-sync-alert-close"
                onClick={() => setSyncStatus(null)}
              >
                ✕
              </button>
            </div>
          )}

          {/* Collapsible Manual Data Customization */}
          <div className="repo-override-accordion">
            <button
              type="button"
              className="repo-override-toggle-btn"
              onClick={() => setShowDataOverrides(!showDataOverrides)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                {showDataOverrides ? 'expand_less' : 'tune'}
              </span>
              <span>{showDataOverrides ? 'Hide Data Customization' : 'Customize Stats & Tagline Manually'}</span>
            </button>

            {showDataOverrides && (
              <div className="repo-override-fields">
                <div className="studio-field">
                  <span className="studio-field-label">Repository Tagline</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Repository description..."
                  />
                </div>
                <div className="repo-fields-row">
                  <div className="studio-field">
                    <span className="studio-field-label">Stars</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={stars}
                      onChange={(e) => setStars(e.target.value)}
                    />
                  </div>
                  <div className="studio-field">
                    <span className="studio-field-label">Forks</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={forks}
                      onChange={(e) => setForks(e.target.value)}
                    />
                  </div>
                  <div className="studio-field">
                    <span className="studio-field-label">Issues</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={issues}
                      onChange={(e) => setIssues(e.target.value)}
                    />
                  </div>
                  <div className="studio-field">
                    <span className="studio-field-label">License</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                    />
                  </div>
                </div>
                <div className="repo-fields-row">
                  <div className="studio-field" style={{ flex: 1 }}>
                    <span className="studio-field-label">Primary Language</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                    />
                  </div>
                  <div className="studio-field">
                    <span className="studio-field-label">Language Color</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="color"
                        value={langColor}
                        onChange={(e) => setLangColor(e.target.value)}
                        className="studio-color-dot-picker"
                      />
                      <input
                        type="text"
                        className="studio-text-input"
                        value={langColor}
                        onChange={(e) => setLangColor(e.target.value)}
                        style={{ width: '80px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 2: Card Architecture Template */}
      <div className="inspector-step-card">
        <div className="inspector-step-header">
          <span className="inspector-step-num">2</span>
          <span className="inspector-step-title">Card Template Architecture</span>
        </div>

        <div className="template-cards-grid">
          {REPO_CARD_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              className={`template-selector-card ${template === tmpl.id ? 'active' : ''}`}
              onClick={() => setTemplate(tmpl.id)}
            >
              <div className="template-card-top">
                <span className="material-symbols-outlined template-card-icon">{tmpl.icon}</span>
                <span className="template-card-title">{tmpl.title}</span>
                <span className="template-card-badge">{tmpl.badge}</span>
              </div>
              <p className="template-card-desc">{tmpl.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Theme & Visual Styling */}
      <div className="inspector-step-card">
        <div className="inspector-step-header">
          <span className="inspector-step-num">3</span>
          <span className="inspector-step-title">Visual Theme &amp; Styling</span>
        </div>

        {/* Color Themes */}
        <div className="studio-field">
          <span className="studio-field-label">Card Theme Palette</span>
          <div className="theme-chips-row">
            {REPO_CARD_THEMES.map((th) => (
              <button
                key={th.id}
                type="button"
                className={`theme-chip-btn ${theme === th.id ? 'active' : ''}`}
                onClick={() => {
                  setTheme(th.id)
                  setAccentColor(th.title)
                }}
              >
                <span className="theme-chip-dot" style={{ backgroundColor: th.title }} />
                <span className="theme-chip-name">{th.name}</span>
                {th.isAdaptive && <span className="theme-chip-tag">Auto</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="studio-field" style={{ marginTop: '12px' }}>
          <span className="studio-field-label">Accent Highlight Color</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="studio-color-dot-picker"
            />
            <input
              type="text"
              className="studio-text-input"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              style={{ width: '90px' }}
            />
            <div className="quick-accent-swatches">
              {['#58a6ff', '#38bdf8', '#6366f1', '#10b981', '#ec4899', '#f59e0b', '#a855f7'].map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`accent-circle ${accentColor === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setAccentColor(c)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Corner Curvature */}
        <div className="studio-field" style={{ marginTop: '12px' }}>
          <span className="studio-field-label">Corner Radius</span>
          <div className="studio-segmented-styles">
            {[
              { label: 'Sharp (0px)', val: 0 },
              { label: 'Rounded (8px)', val: 8 },
              { label: 'Squircle (12px)', val: 12 },
              { label: 'Pill (18px)', val: 18 }
            ].map((r) => (
              <button
                key={r.val}
                type="button"
                className={`studio-style-btn ${radius === r.val ? 'active' : ''}`}
                onClick={() => setRadius(r.val)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Right Column Live Vector SVG Preview & Action Bar Component
 */
export function RepoCardPreview(props) {
  const {
    template,
    previewBg,
    setPreviewBg,
    currentSvg,
    saveStatusMessage,
    handleInsertCard,
    handleCopySvg,
    handleDownloadSvg,
    handleCopyMarkdown,
    generatedSnippet
  } = props

  return (
    <div className="repo-card-preview-area custom-scrollbar">
      {/* Live Canvas Box */}
      <div className="repo-canvas-card">
        <div className="repo-canvas-header">
          <div className="repo-canvas-header-left">
            <span className="studio-card-title">Live Vector SVG Preview</span>
            <span className="repo-canvas-meta-pill">
              {REPO_CARD_TEMPLATES.find((t) => t.id === template)?.title || 'Official Pin'}
            </span>
          </div>

          <div className="repo-canvas-bg-toggles">
            <button
              type="button"
              className={`canvas-tool-btn ${previewBg === 'dark' ? 'active' : ''}`}
              onClick={() => setPreviewBg('dark')}
              title="Preview against GitHub Dark background"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>dark_mode</span>
              <span>Dark Canvas</span>
            </button>
            <button
              type="button"
              className={`canvas-tool-btn ${previewBg === 'light' ? 'active' : ''}`}
              onClick={() => setPreviewBg('light')}
              title="Preview against GitHub Light background"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>light_mode</span>
              <span>Light Canvas</span>
            </button>
          </div>
        </div>

        {/* Render Area */}
        <div className={`repo-canvas-stage ${previewBg === 'light' ? 'stage-light' : 'stage-dark'}`}>
          <div
            className="repo-svg-render-wrapper"
            dangerouslySetInnerHTML={{ __html: currentSvg }}
          />
        </div>

        {/* Status Message Notification */}
        {saveStatusMessage && (
          <div className="repo-action-toast">
            <span>{saveStatusMessage}</span>
          </div>
        )}

        {/* Unified Action Footer */}
        <div className="repo-unified-action-bar">
          <button
            type="button"
            className="btn-embed-primary"
            onClick={handleInsertCard}
            title="Save SVG directly into ./assets/ and embed into document"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_circle</span>
            <span>Insert into Document</span>
          </button>

          <button
            type="button"
            className="btn-embed-secondary"
            onClick={handleCopySvg}
            title="Copy raw SVG markup to clipboard"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>code</span>
            <span>Copy SVG</span>
          </button>

          <button
            type="button"
            className="btn-embed-secondary"
            onClick={handleDownloadSvg}
            title="Download standalone .svg vector image"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
            <span>Download .svg</span>
          </button>

          <button
            type="button"
            className="btn-embed-secondary"
            onClick={handleCopyMarkdown}
            title="Copy markdown image tag"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>content_copy</span>
            <span>Copy Markdown</span>
          </button>
        </div>
      </div>

      {/* Generated Markdown Syntax Box */}
      <div className="repo-syntax-card">
        <div className="repo-syntax-header">
          <span className="repo-syntax-title">Generated Markdown Embed</span>
          <button
            type="button"
            className="repo-syntax-copy-btn"
            onClick={handleCopyMarkdown}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>content_copy</span>
            <span>Copy</span>
          </button>
        </div>
        <pre className="repo-syntax-pre custom-scrollbar">
          <code>{generatedSnippet}</code>
        </pre>
      </div>
    </div>
  )
}

/**
 * Default Full Studio Component (Combines Inspector and Preview in a layout)
 */
export default function RepoCardStudio(props) {
  const state = useRepoCardState(props)

  return (
    <div className="repo-card-studio-layout">
      <RepoCardInspector {...state} />
      <RepoCardPreview {...state} />
    </div>
  )
}
