import React, { useState, useEffect, useMemo, useCallback } from 'react'
import StudioShell from '../common/StudioShell'
import {
  STUDIO_MODES,
  SIMPLE_ICONS,
  SKILL_ICONS_LIST,
  GITHUB_METRICS,
  CURATED_PACKS
} from '../../../data/badgeStudioData'
import {
  generateShieldsBadgeUrl,
  generateSkillIconsUrl,
  formatSingleBadgeMarkdown,
  formatSingleBadgeHtml,
  formatRackMarkdown,
  formatSkillIconsMarkdown,
  formatPackMarkdown,
  getRackBadgeUrl,
  getStoredCustomPacks
} from '../../../utils/badgeEngine'
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
  // Navigation Mode: 'single' | 'rack' | 'skillicons' | 'github' | 'packs'
  const [activeMode, setActiveMode] = useState('single')

  // Badge Architecture Format: 'split' | 'brand-plate' | 'icon-only' | 'badgen'
  const [formatType, setFormatType] = useState('brand-plate')

  // Single Badge Parameters
  const [label, setLabel] = useState('React')
  const [message, setMessage] = useState('19.0')
  const [plateTitle, setPlateTitle] = useState('React 19')
  const [color, setColor] = useState('61dafb')
  const [labelColor, setLabelColor] = useState('18181b')
  const [twoTone, setTwoTone] = useState(false)
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

  // Rack Mode State
  const [rackBadges, setRackBadges] = useState([
    { id: '1', format: 'brand-plate', title: 'React 19', label: 'react', message: '19.0', color: '61dafb', labelColor: '18181b', style: 'for-the-badge', logo: 'react', link: '' },
    { id: '2', format: 'brand-plate', title: 'TypeScript 5.8', label: 'typescript', message: '5.8+', color: '3178c6', labelColor: '18181b', style: 'for-the-badge', logo: 'typescript', link: '' },
    { id: '3', format: 'brand-plate', title: 'FastAPI', label: 'backend', message: 'FastAPI', color: '009688', labelColor: '18181b', style: 'for-the-badge', logo: 'fastapi', link: '' },
    { id: '4', format: 'brand-plate', title: 'Docker Ready', label: 'docker', message: 'ready', color: '2496ed', labelColor: '18181b', style: 'for-the-badge', logo: 'docker', link: '' },
    { id: '5', format: 'split', title: 'MIT License', label: 'license', message: 'MIT', color: '10b981', labelColor: '064e3b', style: 'for-the-badge', logo: '', link: '' }
  ])
  const [rackLayout, setRackLayout] = useState('center-div')

  // AI Agent Studio Hydration Listener
  useEffect(() => {
    const applyBadgeData = (data) => {
      if (!data) return
      const list = Array.isArray(data)
        ? data
        : (data.badge_studio || data.badges_studio || data.badges || [])
      if (!Array.isArray(list) || list.length === 0) return

      const newRack = list.map((b, idx) => {
        const hasMessage = Boolean(b.message && String(b.message).trim())
        const rawLabel = b.label || b.name || 'Tech'
        const rawMsg = b.message || b.value || ''
        const title = b.title || (hasMessage ? `${rawLabel} ${rawMsg}` : rawLabel)
        const format = b.format || (hasMessage ? 'split' : 'brand-plate')
        const color = (b.color || '6366f1').replace('#', '').trim()
        const labelColor = (b.labelColor || '18181b').replace('#', '').trim()
        const logo = b.logo
          ? String(b.logo).toLowerCase().trim()
          : (b.label || '').toLowerCase().replace(/[^a-z0-9]/g, '')
        const logoColor = b.logoColor || (color.toUpperCase() === '61DAFB' ? 'black' : 'white')

        return {
          id: String(Date.now() + idx),
          format,
          title,
          label: rawLabel,
          message: rawMsg,
          color,
          labelColor,
          style: b.style || 'for-the-badge',
          logo,
          logoColor,
          link: b.url || b.link || ''
        }
      })

      setRackBadges(newRack)
      setActiveMode('rack')
    }

    const handleSetBadges = (e) => {
      applyBadgeData(e.detail)
    }

    // Auto-hydrate on mount if pending data was cached before lazy tab load
    try {
      const pending = sessionStorage.getItem('visualmark_pending_badge_data')
      if (pending) {
        sessionStorage.removeItem('visualmark_pending_badge_data')
        const parsed = JSON.parse(pending)
        applyBadgeData(parsed)
      }
    } catch (err) {
      console.warn('Failed to parse pending badge data:', err)
    }

    window.addEventListener('visualmark:set-badge-data', handleSetBadges)
    return () => window.removeEventListener('visualmark:set-badge-data', handleSetBadges)
  }, [])

  // GitHub Metrics Mode State
  const [customRepo, setCustomRepo] = useState('')
  const [ciWorkflow, setCiWorkflow] = useState('ci.yml')
  const [githubMetricsStyle, setGithubMetricsStyle] = useState('for-the-badge')
  const [selectedMetrics, setSelectedMetrics] = useState(['stars', 'forks', 'issues', 'prs', 'release', 'license'])

  // Curated Packs State
  const [selectedPackId, setSelectedPackId] = useState('pack-fullstack-next')
  const [packLayout, setPackLayout] = useState('centered')

  // Output Syntax view (markdown vs html vs url vs svg)
  const [syntaxView, setSyntaxView] = useState('markdown')

  // Error States
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
    return generateShieldsBadgeUrl({
      formatType,
      plateTitle,
      label,
      message,
      color,
      labelColor,
      twoTone,
      style,
      logo,
      logoColor
    })
  }, [formatType, plateTitle, label, message, color, labelColor, twoTone, style, logo, logoColor])

  // Single Badge Markdown code
  const singleBadgeMarkdown = useMemo(() => {
    const alt = plateTitle || `${label} ${message}`.trim() || 'Badge'
    return formatSingleBadgeMarkdown({ url: singleBadgeUrl, alt, link: linkUrl })
  }, [singleBadgeUrl, linkUrl, plateTitle, label, message])

  // Single Badge HTML code
  const singleBadgeHtml = useMemo(() => {
    const alt = plateTitle || `${label} ${message}`.trim() || 'Badge'
    return formatSingleBadgeHtml({ url: singleBadgeUrl, alt, link: linkUrl })
  }, [singleBadgeUrl, linkUrl, plateTitle, label, message])

  // SkillIcons Image URL generator
  const skillIconsUrl = useMemo(() => {
    return generateSkillIconsUrl(selectedSkillIcons, skillTheme, skillPerLine)
  }, [selectedSkillIcons, skillTheme, skillPerLine])

  // SkillIcons Markdown
  const skillIconsMarkdown = useMemo(() => {
    return formatSkillIconsMarkdown(skillIconsUrl, repoUrl)
  }, [skillIconsUrl, repoUrl])

  // Rack Markdown code
  const rackMarkdown = useMemo(() => {
    return formatRackMarkdown(rackBadges, rackLayout, style)
  }, [rackBadges, rackLayout, style])

  // GitHub Metrics Markdown
  const dynamicMetricsMarkdown = useMemo(() => {
    const metricsToRender = GITHUB_METRICS.filter((m) => selectedMetrics.includes(m.id))
    const lines = metricsToRender.map((m) => {
      let bUrl = ''
      if (m.id === 'actions') {
        bUrl = `https://img.shields.io/github/actions/workflow/status/${cleanRepo}/${ciWorkflow || 'ci.yml'}?style=${githubMetricsStyle}&logo=githubactions&logoColor=white`
      } else {
        bUrl = `https://img.shields.io/github/${m.path}/${cleanRepo}?style=${githubMetricsStyle}`
      }
      const target = `https://github.com/${cleanRepo}${m.linkSuffix || ''}`
      return `[![${m.title}](${bUrl})](${target})`
    })

    return `<div align="center">\n\n${lines.join('\n')}\n\n</div>`
  }, [selectedMetrics, cleanRepo, githubMetricsStyle, ciWorkflow])

  // Curated & Custom Packs selected
  const selectedPack = useMemo(() => {
    const custom = getStoredCustomPacks()
    const all = [...custom, ...CURATED_PACKS]
    return all.find((p) => p.id === selectedPackId) || CURATED_PACKS[0]
  }, [selectedPackId])

  // Curated Pack Markdown
  const packMarkdown = useMemo(() => {
    return formatPackMarkdown(selectedPack, style, repoUrl, packLayout)
  }, [selectedPack, style, repoUrl, packLayout])

  // Active Output Snippet based on current mode & syntax switcher
  const activeSnippet = useMemo(() => {
    if (activeMode === 'single') {
      if (syntaxView === 'html') return singleBadgeHtml
      if (syntaxView === 'url') return singleBadgeUrl
      return singleBadgeMarkdown
    }
    if (activeMode === 'rack') return rackMarkdown
    if (activeMode === 'skillicons') return skillIconsMarkdown
    if (activeMode === 'github') return dynamicMetricsMarkdown
    if (activeMode === 'packs') return packMarkdown
    return singleBadgeMarkdown
  }, [
    activeMode,
    syntaxView,
    singleBadgeHtml,
    singleBadgeUrl,
    singleBadgeMarkdown,
    rackMarkdown,
    skillIconsMarkdown,
    dynamicMetricsMarkdown,
    packMarkdown
  ])

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

  // Action Handlers
  const handleInsert = useCallback(() => {
    if (typeof onInsertBadge === 'function') {
      onInsertBadge(activeSnippet)
    }
  }, [onInsertBadge, activeSnippet])

  const handleReset = useCallback(() => {
    setLabel('React')
    setMessage('19.0')
    setPlateTitle('React 19')
    setColor('61dafb')
    setLabelColor('18181b')
    setStyle('for-the-badge')
    setLogo('react')
    setLogoColor('black')
    setLinkUrl('')
  }, [])

  const handleApplyTheme = (th) => {
    setColor(th.color)
    setLabelColor(th.labelColor)
    setTwoTone(true)
  }

  const handleSelectIcon = (iconItem) => {
    setLogo(iconItem.slug)
    if (iconItem.color) setColor(iconItem.color)
    if (iconItem.label) setLabel(iconItem.label)
    if (iconItem.message) setMessage(iconItem.message)
    if (iconItem.name) setPlateTitle(iconItem.name)
  }

  const toggleSkillIcon = (id) => {
    setSelectedSkillIcons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleAddCurrentToRack = useCallback(() => {
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
      logoColor: logoColor,
      link: linkUrl
    }
    setRackBadges((prev) => [...prev, newBadge])
    setActiveMode('rack')
  }, [formatType, plateTitle, label, message, color, twoTone, labelColor, style, logo, logoColor, linkUrl])

  const handleEditBadgeInSingle = useCallback((b) => {
    setFormatType(b.format || 'brand-plate')
    setPlateTitle(b.title || b.label || '')
    setLabel(b.label || '')
    setMessage(b.message || '')
    setColor(b.color || '6366f1')
    setLabelColor(b.labelColor || '18181b')
    setTwoTone(Boolean(b.labelColor))
    setStyle(b.style || 'for-the-badge')
    setLogo(b.logo || '')
    setLogoColor(b.logoColor || 'white')
    setLinkUrl(b.link || '')
    setActiveMode('single')
  }, [])

  const handleRemoveRackBadge = (id) => {
    setRackBadges((prev) => prev.filter((b) => b.id !== id))
  }

  const handleApplyStyleToRack = (newStyle) => {
    setRackBadges((prev) => prev.map((b) => ({ ...b, style: newStyle })))
  }

  const handleApplyThemeToRack = (th) => {
    setRackBadges((prev) =>
      prev.map((b) => ({
        ...b,
        color: th.color,
        labelColor: th.labelColor
      }))
    )
  }

  const handleLoadPackIntoRack = (pack) => {
    if (!pack || !pack.badges) return
    const loaded = pack.badges.map((b, idx) => ({
      id: `${Date.now()}_${idx}`,
      format: b.message ? 'split' : 'brand-plate',
      title: b.title || `${b.label} ${b.message}`.trim(),
      label: b.label || 'tech',
      message: b.message || '',
      color: b.color || '6366f1',
      labelColor: b.labelColor || '',
      style: b.style || style,
      logo: b.logo || '',
      logoColor: 'white',
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

  // Syntax switcher pills for canvas header
  const canvasHeaderExtras = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="canvas-header-divider" />
      {activeMode === 'single' && (
        <div className="canvas-bg-switcher">
          <button
            type="button"
            className={`bg-switch-btn ${syntaxView === 'markdown' ? 'active' : ''}`}
            onClick={() => setSyntaxView('markdown')}
          >
            Markdown
          </button>
          <button
            type="button"
            className={`bg-switch-btn ${syntaxView === 'html' ? 'active' : ''}`}
            onClick={() => setSyntaxView('html')}
          >
            HTML
          </button>
          <button
            type="button"
            className={`bg-switch-btn ${syntaxView === 'url' ? 'active' : ''}`}
            onClick={() => setSyntaxView('url')}
          >
            URL
          </button>
        </div>
      )}
      <span className="canvas-mode-tag">
        {activeMode === 'single'
          ? `${formatType} • ${style}`
          : activeMode === 'rack'
          ? `${rackBadges.length} in rack`
          : activeMode === 'skillicons'
          ? `${selectedSkillIcons.length} skills • ${skillTheme}`
          : activeMode === 'github'
          ? `${selectedMetrics.length} metrics`
          : selectedPack?.title || 'Pack'}
      </span>
    </div>
  )

  // Label for insert button
  const insertLabel = useMemo(() => {
    if (targetContext) return `Insert into ${targetContext.label}`
    switch (activeMode) {
      case 'rack': return 'Insert Badge Rack'
      case 'skillicons': return 'Insert SkillIcons'
      case 'github': return 'Insert GitHub Metrics'
      case 'packs': return 'Insert Tech Pack'
      default: return 'Insert Badge'
    }
  }, [activeMode, targetContext])

  return (
    <StudioShell
      studioId="badges.studio"
      title="Shields.io Badge Studio"
      subtitle="Vector shields, developer tech racks, and real-time repository metrics"
      badge="Shields.io"
      accentColor="#38bdf8"
      icon={
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0c-.3 0-.6.1-.8.3L2.4 3.7c-.3.2-.4.6-.4.9v5.2c0 3.8 2.6 7.1 6 8.2 3.4-1.1 6-4.4 6-8.2V4.6c0-.3-.1-.7-.4-.9L8.8.3C8.6.1 8.3 0 8 0zm0 1.5l4.5 2.5v4.8c0 3-2 5.7-4.5 6.6-2.5-.9-4.5-3.6-4.5-6.6V4L8 1.5z"/>
        </svg>
      }
      modes={STUDIO_MODES}
      activeMode={activeMode}
      onModeChange={setActiveMode}
      markdownCode={activeSnippet}
      onInsert={handleInsert}
      insertLabel={insertLabel}
      onReset={activeMode === 'single' ? handleReset : null}
      onBackToReadme={onBackToReadme}
      canvasHeaderExtras={canvasHeaderExtras}
      defaultSplitWidth={520}
      inspectorContent={
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              onAddToRack={handleAddCurrentToRack}
              handleAddCurrentToRack={handleAddCurrentToRack}
            />
          )}

          {activeMode === 'rack' && (
            <BadgeRackForm
              rackBadges={rackBadges}
              setRackBadges={setRackBadges}
              style={style}
              handleRemoveRackBadge={handleRemoveRackBadge}
              handleApplyStyleToRack={handleApplyStyleToRack}
              handleApplyThemeToRack={handleApplyThemeToRack}
              rackLayout={rackLayout}
              setRackLayout={setRackLayout}
              setActiveMode={setActiveMode}
              onSwitchToSingle={() => setActiveMode('single')}
              onEditBadgeInSingle={handleEditBadgeInSingle}
            />
          )}

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
              setSelectedSkillIcons={setSelectedSkillIcons}
            />
          )}

          {activeMode === 'github' && (
            <GithubMetricsForm
              customRepo={customRepo}
              cleanRepo={cleanRepo}
              setCustomRepo={setCustomRepo}
              ciWorkflow={ciWorkflow}
              setCiWorkflow={setCiWorkflow}
              githubMetricsStyle={githubMetricsStyle}
              setGithubMetricsStyle={setGithubMetricsStyle}
              selectedMetrics={selectedMetrics}
              toggleMetric={toggleMetric}
              toggleAllMetrics={toggleAllMetrics}
            />
          )}

          {activeMode === 'packs' && (
            <CuratedPacksForm
              selectedPackId={selectedPackId}
              setSelectedPackId={setSelectedPackId}
              style={style}
              setStyle={setStyle}
              packLayout={packLayout}
              setPackLayout={setPackLayout}
              repoUrl={repoUrl}
              handleLoadPackIntoRack={handleLoadPackIntoRack}
              onInsertBadge={onInsertBadge}
            />
          )}
        </div>
      }
      canvasContent={
        <BadgeLivePreview
          activeMode={activeMode}
          formatType={formatType}
          style={style}
          singleBadgeUrl={singleBadgeUrl}
          plateTitle={plateTitle}
          label={label}
          message={message}
          color={color}
          labelColor={labelColor}
          singleBadgeError={singleBadgeError}
          setSingleBadgeError={setSingleBadgeError}
          skillIconsUrl={skillIconsUrl}
          selectedSkillIcons={selectedSkillIcons}
          skillTheme={skillTheme}
          skillPerLine={skillPerLine}
          skillIconsError={skillIconsError}
          setSkillIconsError={setSkillIconsError}
          rackBadges={rackBadges}
          rackLayout={rackLayout}
          selectedMetrics={selectedMetrics}
          githubMetricsStyle={githubMetricsStyle}
          cleanRepo={cleanRepo}
          ciWorkflow={ciWorkflow}
          metricsError={metricsError}
          setMetricsError={setMetricsError}
          selectedPack={selectedPack}
          packLayout={packLayout}
          logo={logo}
        />
      }
    />
  )
}
