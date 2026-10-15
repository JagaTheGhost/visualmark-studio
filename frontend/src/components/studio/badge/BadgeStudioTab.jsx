import React, { useState, useEffect, useMemo } from 'react'
import { useStudioSplit } from '../../../utils/useResizableSplit'
import {
  STUDIO_MODES,
  SIMPLE_ICONS,
  SKILL_ICONS_LIST,
  GITHUB_METRICS,
  CURATED_PACKS
} from '../../../data/badgeStudioData'
import { escapeShieldsText } from '../../../utils/modernRepoCardEngine'
import { useRepoCardState, RepoCardInspector } from '../RepoCardStudio'
import SingleBadgeForm from './SingleBadgeForm'
import SkillIconsForm from './SkillIconsForm'
import BadgeRackForm from './BadgeRackForm'
import GithubMetricsForm from './GithubMetricsForm'
import CuratedPacksForm from './CuratedPacksForm'
import BadgeLivePreview from './BadgeLivePreview'

export default function BadgeStudioTab({
  onInsertBadge,
  repoUrl = '',
  onBackToReadme,
  targetContext = null
}) {
  // Navigation Mode
  const [activeMode, setActiveMode] = useState('single')

  // Badge Architecture Format
  const [formatType, setFormatType] = useState('brand-plate') // 'split' | 'brand-plate' | 'icon-only' | 'badgen'

  // Single Badge Parameters
  const [label, setLabel] = useState('React')
  const [message, setMessage] = useState('19.0')
  const [plateTitle, setPlateTitle] = useState('React 19')
  const [color, setColor] = useState('61dafb')
  const [labelColor, setLabelColor] = useState('18181b')
  const [twoTone, setTwoTone] = useState(false)
  const { formWidth, isDragging, handleMouseDown, handleDoubleClick } = useStudioSplit(520)
  const [style, setStyle] = useState('for-the-badge')
  const [logo, setLogo] = useState('react')
  const [logoColor, setLogoColor] = useState('black')
  const [linkUrl, setLinkUrl] = useState('')

  // Icon Directory State
  const [iconCategory, setIconCategory] = useState('all')
  const [iconSearch, setIconSearch] = useState('')

  // SkillIcons Mode State
  const [selectedSkillIcons, setSelectedSkillIcons] = useState([
    'react', 'ts', 'tailwind', 'nextjs', 'nodejs', 'fastapi', 'py', 'docker', 'postgres', 'git'
  ])
  const [skillTheme, setSkillTheme] = useState('dark') // 'dark' | 'light'
  const [skillPerLine, setSkillPerLine] = useState('10')
  const [skillSearch, setSkillSearch] = useState('')

  // GitHub Repo Card State (Modern Client-Side Vector Engine)
  const repoCardState = useRepoCardState({
    repoUrl,
    onInsertBadge
  })

  // Rack Mode State
  const [rackBadges, setRackBadges] = useState([
    { id: '1', format: 'brand-plate', title: 'React 19', label: 'react', message: '19.0', color: '61dafb', labelColor: '18181b', style: 'for-the-badge', logo: 'react', link: '' },
    { id: '2', format: 'brand-plate', title: 'TypeScript 5.8', label: 'typescript', message: '5.8+', color: '3178c6', labelColor: '18181b', style: 'for-the-badge', logo: 'typescript', link: '' },
    { id: '3', format: 'brand-plate', title: 'FastAPI', label: 'backend', message: 'FastAPI', color: '009688', labelColor: '18181b', style: 'for-the-badge', logo: 'fastapi', link: '' },
    { id: '4', format: 'brand-plate', title: 'Docker Ready', label: 'docker', message: 'ready', color: '2496ed', labelColor: '18181b', style: 'for-the-badge', logo: 'docker', link: '' },
    { id: '5', format: 'split', title: 'MIT License', label: 'license', message: 'MIT', color: '10b981', labelColor: '064e3b', style: 'for-the-badge', logo: '', link: '' }
  ])
  const [rackLayout, setRackLayout] = useState('center-div')

  // GitHub Metrics Mode State
  const [customRepo, setCustomRepo] = useState('')
  const [githubMetricsStyle, setGithubMetricsStyle] = useState('for-the-badge')
  const [selectedMetrics, setSelectedMetrics] = useState(['stars', 'forks', 'issues', 'prs', 'release', 'license'])

  // Curated Packs State
  const [selectedPackId, setSelectedPackId] = useState('pack-fullstack')

  // Preview Settings
  const [canvasBg, setCanvasBg] = useState('dark') // 'dark' | 'light'
  const [syntaxView, setSyntaxView] = useState('markdown') // 'markdown' | 'html' | 'url'
  const [copied, setCopied] = useState(false)

  // Preview Error / Offline Resilience States
  const [singleBadgeError, setSingleBadgeError] = useState(false)
  const [skillIconsError, setSkillIconsError] = useState(false)
  const [metricsError, setMetricsError] = useState(false)

  useEffect(() => {
    setSingleBadgeError(false)
  }, [formatType, label, message, color, labelColor, style, logo, logoColor, plateTitle])

  useEffect(() => {
    setSkillIconsError(false)
  }, [selectedSkillIcons, skillTheme, skillPerLine])

  // Parse repo owner/repo
  const cleanRepo = useMemo(() => {
    const target = customRepo.trim() || repoUrl.trim()
    if (!target) return 'facebook/react'
    return target.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')
  }, [customRepo, repoUrl])

  // Single Badge Image URL generator
  const singleBadgeUrl = useMemo(() => {
    const cleanC = color.replace('#', '').trim() || '6366f1'

    if (formatType === 'brand-plate') {
      const cleanT = escapeShieldsText(plateTitle || label || 'brand')
      let url = `https://img.shields.io/badge/${cleanT}-${cleanC}?style=${style}`
      if (logo.trim()) {
        url += `&logo=${encodeURIComponent(logo.trim())}`
        if (logoColor) url += `&logoColor=${encodeURIComponent(logoColor)}`
      }
      return url
    }

    if (formatType === 'icon-only') {
      let url = `https://img.shields.io/badge/--${cleanC}?style=${style}`
      if (logo.trim()) {
        url += `&logo=${encodeURIComponent(logo.trim())}`
        if (logoColor) url += `&logoColor=${encodeURIComponent(logoColor)}`
      }
      return url
    }

    if (formatType === 'badgen') {
      const cleanL = encodeURIComponent((label || 'badge').trim())
      const cleanM = encodeURIComponent((message || 'value').trim())
      let url = `https://badgen.net/badge/${cleanL}/${cleanM}/${cleanC}`
      if (logo.trim()) url += `?icon=${encodeURIComponent(logo.trim())}`
      return url
    }

    // Default 'split' dual segment
    const cleanL = escapeShieldsText(label || 'badge')
    const cleanM = escapeShieldsText(message || 'value')
    let url = `https://img.shields.io/badge/${cleanL}-${cleanM}-${cleanC}?style=${style}`
    if (twoTone && labelColor.trim()) {
      url += `&labelColor=${encodeURIComponent(labelColor.replace('#', '').trim())}`
    }
    if (logo.trim()) {
      url += `&logo=${encodeURIComponent(logo.trim())}`
      if (logoColor) url += `&logoColor=${encodeURIComponent(logoColor)}`
    }
    return url
  }, [formatType, plateTitle, label, message, color, labelColor, twoTone, style, logo, logoColor])

  // SkillIcons Image URL
  const skillIconsUrl = useMemo(() => {
    const iconsParam = selectedSkillIcons.join(',') || 'react,ts,py'
    return `https://skillicons.dev/icons?i=${iconsParam}&theme=${skillTheme}&perline=${skillPerLine}`
  }, [selectedSkillIcons, skillTheme, skillPerLine])

  // Single Badge Markdown
  const singleBadgeMarkdown = useMemo(() => {
    const alt = formatType === 'brand-plate' ? plateTitle : `${label} - ${message}`
    const target = linkUrl.trim() || repoUrl || '#'
    return `[![${alt}](${singleBadgeUrl})](${target})`
  }, [formatType, plateTitle, label, message, singleBadgeUrl, linkUrl, repoUrl])

  // Single Badge HTML
  const singleBadgeHtml = useMemo(() => {
    const alt = formatType === 'brand-plate' ? plateTitle : `${label} - ${message}`
    const target = linkUrl.trim() || repoUrl || '#'
    return `<a href="${target}"><img src="${singleBadgeUrl}" alt="${alt}" /></a>`
  }, [formatType, plateTitle, label, message, singleBadgeUrl, linkUrl, repoUrl])

  // Multi-Badge Rack Markdown
  const rackMarkdown = useMemo(() => {
    if (!rackBadges.length) return ''

    const lines = rackBadges.map((b) => {
      const bC = (b.color || '6366f1').replace('#', '').trim()
      let bUrl = ''
      let alt = ''

      if (b.format === 'brand-plate') {
        const bT = escapeShieldsText(b.title || b.label)
        bUrl = `https://img.shields.io/badge/${bT}-${bC}?style=${b.style || style}`
        alt = b.title || b.label
      } else if (b.format === 'icon-only') {
        bUrl = `https://img.shields.io/badge/--${bC}?style=${b.style || style}`
        alt = b.logo || 'icon'
      } else {
        const bL = escapeShieldsText(b.label || 'badge')
        const bM = escapeShieldsText(b.message || 'value')
        bUrl = `https://img.shields.io/badge/${bL}-${bM}-${bC}?style=${b.style || style}`
        if (b.labelColor) bUrl += `&labelColor=${encodeURIComponent(b.labelColor.replace('#', ''))}`
        alt = `${b.label} - ${b.message}`
      }

      if (b.logo) bUrl += `&logo=${encodeURIComponent(b.logo)}&logoColor=white`
      const bLink = b.link || repoUrl || '#'
      return `[![${alt}](${bUrl})](${bLink})`
    })

    if (rackLayout === 'center-div') {
      return `<div align="center">\n\n${lines.join('\n')}\n\n</div>`
    } else if (rackLayout === 'lines') {
      return lines.join('\n')
    } else {
      return lines.join(' ')
    }
  }, [rackBadges, rackLayout, style, repoUrl])

  // SkillIcons Markdown
  const skillIconsMarkdown = useMemo(() => {
    return `<div align="center">\n\n[![My Skills](${skillIconsUrl})](https://skillicons.dev)\n\n</div>`
  }, [skillIconsUrl])

  // Dynamic GitHub Metrics Markdown
  const dynamicMetricsMarkdown = useMemo(() => {
    const metricsToRender = GITHUB_METRICS.filter((m) => selectedMetrics.includes(m.id))
    const lines = metricsToRender.map((m) => {
      let bUrl = ''
      if (m.id === 'actions') {
        bUrl = `https://img.shields.io/github/actions/workflow/status/${cleanRepo}/${m.workflow}?style=${githubMetricsStyle}&logo=githubactions&logoColor=white`
      } else {
        bUrl = `https://img.shields.io/github/${m.path}/${cleanRepo}?style=${githubMetricsStyle}`
      }
      const target = `https://github.com/${cleanRepo}${m.linkSuffix || ''}`
      return `[![${m.title}](${bUrl})](${target})`
    })

    return `<div align="center">\n\n${lines.join('\n')}\n\n</div>`
  }, [cleanRepo, selectedMetrics, githubMetricsStyle])

  // Curated Pack Markdown Helper
  const getPackMarkdown = (pack) => {
    if (!pack) return ''
    const lines = pack.badges.map((b) => {
      const bL = escapeShieldsText(b.label)
      const bM = escapeShieldsText(b.message)
      let bUrl = `https://img.shields.io/badge/${bL}-${bM}-${b.color}?style=${b.style || style}`
      if (b.logo) bUrl += `&logo=${encodeURIComponent(b.logo)}&logoColor=white`
      const target = repoUrl || '#'
      return `[![${b.label} - ${b.message}](${bUrl})](${target})`
    })
    return `<div align="center">\n\n${lines.join('\n')}\n\n</div>`
  }

  const selectedPack = useMemo(() => {
    return CURATED_PACKS.find((p) => p.id === selectedPackId) || CURATED_PACKS[0]
  }, [selectedPackId])

  const packMarkdown = useMemo(() => {
    return getPackMarkdown(selectedPack)
  }, [selectedPack, style, repoUrl])

  // Active Output Snippet based on current studio mode
  const activeSnippet = useMemo(() => {
    if (activeMode === 'single') {
      if (syntaxView === 'html') return singleBadgeHtml
      if (syntaxView === 'url') return singleBadgeUrl
      return singleBadgeMarkdown
    }
    if (activeMode === 'rack') return rackMarkdown
    if (activeMode === 'skillicons') return skillIconsMarkdown
    if (activeMode === 'repocards') return repoCardState.generatedSnippet
    if (activeMode === 'github') return dynamicMetricsMarkdown
    if (activeMode === 'packs') return packMarkdown
    return singleBadgeMarkdown
  }, [activeMode, syntaxView, singleBadgeHtml, singleBadgeUrl, singleBadgeMarkdown, rackMarkdown, skillIconsMarkdown, repoCardState.generatedSnippet, dynamicMetricsMarkdown, packMarkdown])

  // Filtered SimpleIcons
  const filteredIcons = useMemo(() => {
    let list = SIMPLE_ICONS
    if (iconCategory !== 'all') {
      list = list.filter((i) => i.category === iconCategory)
    }
    if (iconSearch.trim()) {
      const q = iconSearch.toLowerCase()
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.slug.toLowerCase().includes(q))
    }
    return list
  }, [iconCategory, iconSearch])

  // Filtered SkillIcons
  const filteredSkillIcons = useMemo(() => {
    if (!skillSearch.trim()) return SKILL_ICONS_LIST
    const q = skillSearch.toLowerCase()
    return SKILL_ICONS_LIST.filter((i) => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
  }, [skillSearch])

  // Handlers
  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInsert = async () => {
    if (activeMode === 'repocards') {
      await repoCardState.handleInsertCard()
      return
    }
    onInsertBadge(activeSnippet)
  }

  const handleApplyTheme = (theme) => {
    setColor(theme.color)
    setLabelColor(theme.labelColor)
    setTwoTone(true)
  }

  const handleSelectIcon = (iconItem) => {
    setLogo(iconItem.slug)
    if (iconItem.color) {
      setColor(iconItem.color)
    }
    if (iconItem.label) setLabel(iconItem.label)
    if (iconItem.message) setMessage(iconItem.message)
    if (iconItem.name) setPlateTitle(iconItem.name)
  }

  const toggleSkillIcon = (id) => {
    setSelectedSkillIcons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleAddCurrentToRack = () => {
    const newBadge = {
      id: Date.now().toString(),
      format: formatType,
      title: plateTitle || label,
      label: label || 'badge',
      message: message || 'value',
      color: color || '6366f1',
      labelColor: twoTone ? labelColor : '',
      style: style,
      logo: logo,
      link: linkUrl
    }
    setRackBadges((prev) => [...prev, newBadge])
    setActiveMode('rack')
  }

  const handleRemoveRackBadge = (id) => {
    setRackBadges((prev) => prev.filter((b) => b.id !== id))
  }

  const handleApplyStyleToRack = (newStyle) => {
    setRackBadges((prev) => prev.map((b) => ({ ...b, style: newStyle })))
  }

  const handleApplyThemeToRack = (theme) => {
    setRackBadges((prev) =>
      prev.map((b) => ({
        ...b,
        color: theme.color,
        labelColor: theme.labelColor
      }))
    )
  }

  const handleLoadPackIntoRack = (pack) => {
    const loaded = pack.badges.map((b, idx) => ({
      id: `${Date.now()}_${idx}`,
      format: 'split',
      title: `${b.label} ${b.message}`,
      label: b.label,
      message: b.message,
      color: b.color,
      labelColor: '',
      style: b.style || style,
      logo: b.logo || '',
      link: repoUrl || ''
    }))
    setRackBadges(loaded)
    setActiveMode('rack')
  }

  const toggleMetric = (metricId) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]
    )
  }

  const toggleAllMetrics = () => {
    if (selectedMetrics.length === GITHUB_METRICS.length) {
      setSelectedMetrics([])
    } else {
      setSelectedMetrics(GITHUB_METRICS.map((m) => m.id))
    }
  }

  return (
    <div className="studio-tab-view select-none">
      {/* Studio Top Navigation Strip */}
      <div className="studio-top-bar">
        <div className="studio-bar-left">
          <div className="studio-badge-halo">
            <span className="material-symbols-outlined text-secondary">shield</span>
          </div>
          <div>
            <div className="studio-title-row">
              <h2 className="studio-title">Shields.io & Badges Studio Pro</h2>
              <span className="studio-tag" style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#38bdf8' }}>Visual Identity Studio</span>
              {targetContext && (
                <span className="studio-tag" style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)' }}>
                  Target: {targetContext.label || 'Table Cell'}
                </span>
              )}
            </div>
            <p className="studio-subtitle">
              Single brand plates, dual-segment badges, SkillIcons macOS squircles, GitHub repo pin cards, and Badgen.net micro-badges.
            </p>
          </div>
        </div>

        <div className="studio-bar-actions">
          {onBackToReadme && (
            <button
              type="button"
              className="btn-studio-secondary"
              onClick={onBackToReadme}
              title={targetContext ? 'Cancel and return' : 'Return to active markdown document'}
            >
              <span className="material-symbols-outlined icon-xs">arrow_back</span>
              <span>{targetContext ? 'Cancel & Return' : 'Back to Editor'}</span>
            </button>
          )}
          <button
            type="button"
            className="btn-studio-secondary"
            onClick={handleCopy}
            title="Copy formatted markdown to clipboard"
          >
            <span className="material-symbols-outlined icon-xs">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
          </button>
          <button
            type="button"
            className="btn-studio-primary"
            onClick={handleInsert}
            title={targetContext ? `Insert selected badge into ${targetContext.label}` : 'Insert rendered badge into an open document'}
          >
            <span className="material-symbols-outlined icon-xs">add_circle</span>
            <span>
              {targetContext
                ? `Insert into ${targetContext.label}`
                : (activeMode === 'single'
                  ? 'Insert Badge into Document'
                  : activeMode === 'rack'
                  ? 'Insert Badge Rack'
                  : activeMode === 'skillicons'
                  ? 'Insert SkillIcons Grid'
                  : activeMode === 'repocards'
                  ? 'Insert Repo Card'
                  : activeMode === 'github'
                  ? 'Insert GitHub Metrics'
                  : 'Insert Tech Pack')}
            </span>
          </button>
        </div>
      </div>

      {/* Main Studio 2-Column Responsive Layout */}
      <div className="studio-content-grid">
        {/* Left Column: Form Controls */}
        <div
          className="studio-form-column custom-scrollbar"
          style={{ width: `${formWidth}px`, minWidth: `${formWidth}px`, maxWidth: `${formWidth}px`, flex: 'none' }}
        >
          {/* Top Sub-Navigation Modes */}
          <div className="studio-section">
            <label className="studio-section-label">Studio Workflow Engine</label>
            <div className="badge-mode-nav custom-scrollbar" data-horizontal-scroll="true">
              {STUDIO_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`badge-mode-tab ${activeMode === mode.id ? 'active' : ''}`}
                  onClick={() => setActiveMode(mode.id)}
                >
                  <span className="material-symbols-outlined icon-xs">{mode.icon}</span>
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode 1: Single Badge Designer */}
          {activeMode === 'single' && (
            <SingleBadgeForm
              formatType={formatType}
              setFormatType={setFormatType}
              plateTitle={plateTitle}
              setPlateTitle={setPlateTitle}
              label={label}
              setLabel={setLabel}
              message={message}
              setMessage={setMessage}
              style={style}
              setStyle={setStyle}
              twoTone={twoTone}
              setTwoTone={setTwoTone}
              color={color}
              setColor={setColor}
              labelColor={labelColor}
              setLabelColor={setLabelColor}
              handleApplyTheme={handleApplyTheme}
              logo={logo}
              setLogo={setLogo}
              logoColor={logoColor}
              setLogoColor={setLogoColor}
              iconSearch={iconSearch}
              setIconSearch={setIconSearch}
              iconCategory={iconCategory}
              setIconCategory={setIconCategory}
              filteredIcons={filteredIcons}
              handleSelectIcon={handleSelectIcon}
              linkUrl={linkUrl}
              setLinkUrl={setLinkUrl}
              repoUrl={repoUrl}
              handleAddCurrentToRack={handleAddCurrentToRack}
            />
          )}

          {/* Mode 2: SkillIcons Squircles */}
          {activeMode === 'skillicons' && (
            <SkillIconsForm
              selectedSkillIcons={selectedSkillIcons}
              toggleSkillIcon={toggleSkillIcon}
              skillTheme={skillTheme}
              setSkillTheme={setSkillTheme}
              skillPerLine={skillPerLine}
              setSkillPerLine={setSkillPerLine}
              skillSearch={skillSearch}
              setSkillSearch={setSkillSearch}
              filteredSkillIcons={filteredSkillIcons}
            />
          )}

          {/* Mode 3: GitHub Repo Pin & Activity Cards */}
          {activeMode === 'repocards' && (
            <RepoCardInspector {...repoCardState} />
          )}

          {/* Mode 4: Tech Stack & Rack Builder */}
          {activeMode === 'rack' && (
            <BadgeRackForm
              rackBadges={rackBadges}
              style={style}
              setActiveMode={setActiveMode}
              handleRemoveRackBadge={handleRemoveRackBadge}
              rackLayout={rackLayout}
              setRackLayout={setRackLayout}
              handleApplyStyleToRack={handleApplyStyleToRack}
              handleApplyThemeToRack={handleApplyThemeToRack}
            />
          )}

          {/* Mode 5: Dynamic GitHub Repo Metrics */}
          {activeMode === 'github' && (
            <GithubMetricsForm
              customRepo={customRepo}
              cleanRepo={cleanRepo}
              setCustomRepo={setCustomRepo}
              selectedMetrics={selectedMetrics}
              toggleAllMetrics={toggleAllMetrics}
              toggleMetric={toggleMetric}
              githubMetricsStyle={githubMetricsStyle}
              setGithubMetricsStyle={setGithubMetricsStyle}
            />
          )}

          {/* Mode 6: Curated Tech Packs */}
          {activeMode === 'packs' && (
            <CuratedPacksForm
              selectedPackId={selectedPackId}
              setSelectedPackId={setSelectedPackId}
              style={style}
              handleLoadPackIntoRack={handleLoadPackIntoRack}
              onInsertBadge={onInsertBadge}
              getPackMarkdown={getPackMarkdown}
            />
          )}
        </div>

        {/* Resizer Splitter Handle */}
        <div
          className={`studio-resizer-handle ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title="Drag to resize form and preview sections • Double-click to reset"
        />

        {/* Right Column: Live Render Canvas & Markdown Card */}
        <BadgeLivePreview
          activeMode={activeMode}
          formatType={formatType}
          style={style}
          selectedSkillIcons={selectedSkillIcons}
          skillTheme={skillTheme}
          repoCardState={repoCardState}
          rackBadges={rackBadges}
          selectedMetrics={selectedMetrics}
          selectedPack={selectedPack}
          canvasBg={canvasBg}
          setCanvasBg={setCanvasBg}
          singleBadgeError={singleBadgeError}
          setSingleBadgeError={setSingleBadgeError}
          singleBadgeUrl={singleBadgeUrl}
          plateTitle={plateTitle}
          label={label}
          message={message}
          color={color}
          labelColor={labelColor}
          skillIconsError={skillIconsError}
          setSkillIconsError={setSkillIconsError}
          skillIconsUrl={skillIconsUrl}
          skillPerLine={skillPerLine}
          cleanRepo={cleanRepo}
          githubMetricsStyle={githubMetricsStyle}
          metricsError={metricsError}
          setMetricsError={setMetricsError}
          syntaxView={syntaxView}
          setSyntaxView={setSyntaxView}
          copied={copied}
          handleCopy={handleCopy}
          activeSnippet={activeSnippet}
        />
      </div>
    </div>
  )
}
