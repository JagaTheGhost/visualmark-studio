import React, { useState, useEffect, useMemo } from 'react'
import { saveAs } from 'file-saver'
import { useStudioSplit } from '../../utils/useResizableSplit'
import {
  STUDIO_MODES,
  BADGE_FORMATS,
  BADGE_STYLES,
  COLOR_THEMES,
  COLOR_SWATCHES,
  SIMPLE_ICONS,
  SKILL_ICONS_LIST,
  GITHUB_METRICS,
  GITHUB_LANG_COLORS,
  NATIVE_REPO_CARD_TYPES,
  CURATED_PACKS
} from '../../data/badgeStudioData'
import {
  escapeXml,
  escapeShieldsText,
  getClassicRepoPinSvg,
  getLanguagesBarSvg,
  getLanguagesDonutSvg,
  getMetricsGridSvg,
  getBentoSpecSvg,
  getGlassmorphismCardSvg,
  getCyberpunkCardSvg,
  getTerminalNeofetchCardSvg,
  getAuroraGlowSvg,
  getMinimalCleanSvg
} from '../../utils/repoCardSvgGenerators'

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

  // GitHub Repo Card State (100% Native Vector SVG Generator)
  const [nativeCardStyle, setNativeCardStyle] = useState('native-classic')
  const [cardCustomDesc, setCardCustomDesc] = useState('Automated Documentation Platform & GitHub Repository')
  const [cardCustomStars, setCardCustomStars] = useState('1.2k')
  const [cardCustomForks, setCardCustomForks] = useState('240')
  const [cardCustomIssues, setCardCustomIssues] = useState('12')
  const [cardCustomLicense, setCardCustomLicense] = useState('MIT')
  const [cardCustomLang, setCardCustomLang] = useState('TypeScript')
  const [cardCustomLangColor, setCardCustomLangColor] = useState('#3178c6')
  const [cardCustomLanguagesList, setCardCustomLanguagesList] = useState([
    { name: 'TypeScript', percent: 64.5, color: '#3178c6' },
    { name: 'JavaScript', percent: 23.2, color: '#f1e05a' },
    { name: 'CSS', percent: 8.8, color: '#563d7c' },
    { name: 'HTML', percent: 3.5, color: '#e34c26' }
  ])
  const [cardThemeColor, setCardThemeColor] = useState('#6366f1')
  const [repoCardRadius, setRepoCardRadius] = useState('8') // '0', '8', '12', '18'
  const [nativeEmbedMode, setNativeEmbedMode] = useState('relative-asset') // 'relative-asset' | 'raw-cdn'
  const [isFetchingGitHub, setIsFetchingGitHub] = useState(false)
  const [githubSyncStatus, setGithubSyncStatus] = useState(null) // { type: 'success' | 'error', message: string }
  const [saveStatusMessage, setSaveStatusMessage] = useState('')

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

  const repoOwner = useMemo(() => {
    const parts = cleanRepo.split('/')
    return parts[0] || 'owner'
  }, [cleanRepo])

  const repoName = useMemo(() => {
    const parts = cleanRepo.split('/')
    return parts[1] || 'repository'
  }, [cleanRepo])

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


  // Native Vector SVG Generator
  const nativeCardSvg = useMemo(() => {
    const params = {
      owner: repoOwner,
      repo: repoName,
      desc: cardCustomDesc || 'Automated Documentation Platform & GitHub Repository',
      stars: cardCustomStars || '1.2k',
      forks: cardCustomForks || '240',
      issues: cardCustomIssues || '12',
      license: cardCustomLicense || 'MIT',
      lang: cardCustomLang || 'TypeScript',
      langColor: cardCustomLangColor || '#3178c6',
      languages: cardCustomLanguagesList,
      themeColor: cardThemeColor || '#6366f1',
      radius: Number(repoCardRadius) || 8
    }

    switch (nativeCardStyle) {
      case 'native-classic':
        return getClassicRepoPinSvg(params)
      case 'native-bento':
        return getBentoSpecSvg(params)
      case 'native-glass':
        return getGlassmorphismCardSvg(params)
      case 'native-cyberpunk':
        return getCyberpunkCardSvg(params)
      case 'native-aurora':
        return getAuroraGlowSvg(params)
      case 'native-terminal':
        return getTerminalNeofetchCardSvg(params)
      case 'native-minimal':
        return getMinimalCleanSvg(params)
      case 'native-langs-bar':
        return getLanguagesBarSvg(params)
      case 'native-langs-donut':
        return getLanguagesDonutSvg(params)
      case 'native-metrics-grid':
        return getMetricsGridSvg(params)
      default:
        return getClassicRepoPinSvg(params)
    }
  }, [
    nativeCardStyle, repoOwner, repoName, cardCustomDesc, cardCustomStars, cardCustomForks,
    cardCustomIssues, cardCustomLicense, cardCustomLang, cardCustomLangColor,
    cardCustomLanguagesList, cardThemeColor, repoCardRadius
  ])

  // Export Native SVG File handler
  const handleDownloadNativeSvg = async () => {
    try {
      const defaultName = `${repoName || 'repo'}-card.svg`
      if (typeof window !== 'undefined' && window.electronAPI?.saveTextExportDialog) {
        await window.electronAPI.saveTextExportDialog({
          defaultPath: defaultName,
          filters: [{ name: 'SVG Vector Image', extensions: ['svg'] }, { name: 'All Files', extensions: ['*'] }],
          content: nativeCardSvg
        })
        return
      }
      const blob = new Blob([nativeCardSvg], { type: 'image/svg+xml;charset=utf-8' })
      saveAs(blob, defaultName)
    } catch (err) {
      console.error('Download SVG error:', err)
    }
  }

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

  // Repo Card Markdown (100% Native Vector SVG)
  const repoCardMarkdown = useMemo(() => {
    let filename = `${repoName}-card.svg`
    if (nativeCardStyle === 'native-langs-bar' || nativeCardStyle === 'native-langs-donut') {
      filename = `${repoName}-langs.svg`
    } else if (nativeCardStyle === 'native-metrics-grid') {
      filename = `${repoName}-metrics.svg`
    }
    const imgSrc = nativeEmbedMode === 'raw-cdn'
      ? `https://raw.githubusercontent.com/${cleanRepo}/main/assets/${filename}`
      : `assets/${filename}`
    return `<div align="center">\n  <a href="https://github.com/${cleanRepo}">\n    <img src="${imgSrc}" alt="${repoOwner}/${repoName}" width="500" />\n  </a>\n</div>`
  }, [nativeEmbedMode, nativeCardStyle, cleanRepo, repoName, repoOwner])


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
    if (activeMode === 'repocards') return repoCardMarkdown
    if (activeMode === 'github') return dynamicMetricsMarkdown
    if (activeMode === 'packs') return packMarkdown
    return singleBadgeMarkdown
  }, [activeMode, syntaxView, singleBadgeHtml, singleBadgeUrl, singleBadgeMarkdown, rackMarkdown, skillIconsMarkdown, repoCardMarkdown, dynamicMetricsMarkdown, packMarkdown])

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

  const handleCopySvgCode = () => {
    navigator.clipboard.writeText(nativeCardSvg)
    setSaveStatusMessage('✓ Copied SVG code to clipboard!')
    setTimeout(() => setSaveStatusMessage(''), 2500)
  }

  const handleFetchGitHubData = async (overrideRepo = null) => {
    const target = overrideRepo || cleanRepo
    if (!target || !target.includes('/')) {
      setGithubSyncStatus({ type: 'error', message: 'Please specify a valid owner/repo (e.g. facebook/react)' })
      return
    }
    const [owner, name] = target.split('/')
    setIsFetchingGitHub(true)
    setGithubSyncStatus(null)

    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${name}`)
      if (res.status === 404) {
        setGithubSyncStatus({ type: 'error', message: `Repository "${owner}/${name}" not found on GitHub.` })
        return
      }
      if (res.status === 403) {
        setGithubSyncStatus({ type: 'error', message: 'GitHub API rate limit reached. Values remain editable manually.' })
        return
      }
      if (!res.ok) {
        setGithubSyncStatus({ type: 'error', message: `GitHub API error (${res.status}): ${res.statusText}` })
        return
      }

      const data = await res.json()
      if (data.description) setCardCustomDesc(data.description)
      if (data.stargazers_count !== undefined) {
        const sc = data.stargazers_count
        setCardCustomStars(sc >= 1000 ? `${(sc / 1000).toFixed(1)}k` : String(sc))
      }
      if (data.forks_count !== undefined) {
        const fc = data.forks_count
        setCardCustomForks(fc >= 1000 ? `${(fc / 1000).toFixed(1)}k` : String(fc))
      }
      if (data.open_issues_count !== undefined) {
        setCardCustomIssues(String(data.open_issues_count))
      }
      if (data.license) {
        setCardCustomLicense(data.license.spdx_id || data.license.name || 'MIT')
      }
      if (data.language) {
        setCardCustomLang(data.language)
        if (GITHUB_LANG_COLORS[data.language]) {
          setCardCustomLangColor(GITHUB_LANG_COLORS[data.language])
        }
      }

      // Fetch languages breakdown
      try {
        const langRes = await fetch(`https://api.github.com/repos/${owner}/${name}/languages`)
        if (langRes.ok) {
          const langData = await langRes.json()
          const totalBytes = Object.values(langData).reduce((a, b) => a + b, 0)
          if (totalBytes > 0) {
            const parsedLangs = Object.entries(langData).map(([lName, bytes]) => {
              const pct = Number(((bytes / totalBytes) * 100).toFixed(1))
              return {
                name: lName,
                percent: pct,
                color: GITHUB_LANG_COLORS[lName] || '#8b949e'
              }
            }).filter((l) => l.percent > 0.5)
            if (parsedLangs.length > 0) {
              setCardCustomLanguagesList(parsedLangs)
            }
          }
        }
      } catch (errLangs) {
        console.warn('Could not fetch language breakdown:', errLangs)
      }

      setGithubSyncStatus({
        type: 'success',
        message: `Synced with GitHub: ${data.stargazers_count} stars, ${data.forks_count} forks, primary language ${data.language || 'N/A'}`
      })
    } catch (err) {
      setGithubSyncStatus({ type: 'error', message: `Fetch failed: ${err.message}` })
    } finally {
      setIsFetchingGitHub(false)
    }
  }

  const handleDetectWorkspaceGit = async () => {
    if (typeof window === 'undefined' || !window.electronAPI) return
    try {
      if (window.electronAPI.getGitInfo) {
        const info = await window.electronAPI.getGitInfo()
        if (info && info.remoteUrl) {
          const parsed = info.remoteUrl
            .replace(/^git@github\.com:/, '')
            .replace(/^https?:\/\/github\.com\//, '')
            .replace(/\.git$/, '')
            .trim()
          if (parsed) {
            setCustomRepo(parsed)
            setGithubSyncStatus({ type: 'success', message: `Detected local git repository: ${parsed}` })
            handleFetchGitHubData(parsed)
            return
          }
        }
      }
      setGithubSyncStatus({ type: 'error', message: 'No git remote origin URL found in current workspace.' })
    } catch (err) {
      setGithubSyncStatus({ type: 'error', message: `Could not inspect local git: ${err.message}` })
    }
  }

  const handleSaveToWorkspaceAndEmbed = async () => {
    try {
      let filename = `${repoName || 'repo'}-card.svg`
      if (nativeCardStyle === 'native-langs-bar' || nativeCardStyle === 'native-langs-donut') {
        filename = `${repoName || 'repo'}-langs.svg`
      } else if (nativeCardStyle === 'native-metrics-grid') {
        filename = `${repoName || 'repo'}-metrics.svg`
      }
      const relativePath = `assets/${filename}`

      let saved = false
      if (typeof window !== 'undefined' && window.electronAPI) {
        if (window.electronAPI.getDefaultWorkspace) {
          const ws = await window.electronAPI.getDefaultWorkspace()
          if (ws && ws.rootPath) {
            const cleanRoot = ws.rootPath.replace(/[/\\]+$/, '')
            const fullPath = `${cleanRoot}/${relativePath}`
            const res = await window.electronAPI.createFileDirect(fullPath, nativeCardSvg)
            if (res && res.success) saved = true
          }
        }
        if (!saved && window.electronAPI.createFileDirect) {
          const res = await window.electronAPI.createFileDirect(relativePath, nativeCardSvg)
          if (res && res.success) saved = true
        }
      }

      const snippet = `<div align="center">\n  <a href="https://github.com/${cleanRepo}">\n    <img src="${relativePath}" alt="${repoName}" width="500" />\n  </a>\n</div>`
      onInsertBadge(snippet)

      setSaveStatusMessage(saved ? `✓ Saved to ${relativePath} and embedded!` : '✓ Embedded into markdown document!')
      setTimeout(() => setSaveStatusMessage(''), 3500)
    } catch (err) {
      console.error('Save to workspace error:', err)
      const snippet = `<div align="center">\n  <a href="https://github.com/${cleanRepo}">\n    <img src="assets/${repoName}-card.svg" alt="${repoName}" width="500" />\n  </a>\n</div>`
      onInsertBadge(snippet)
    }
  }

  const handleInsert = async () => {
    if (activeMode === 'repocards' && cardEngine === 'native-svg' && nativeEmbedMode === 'relative-asset') {
      await handleSaveToWorkspaceAndEmbed()
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
        {/* Left Column: Form Controls, Themes, and Directory */}
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

          {/* =========================================================================
              MODE 1: SINGLE BADGE DESIGNER
             ========================================================================= */}
          {activeMode === 'single' && (
            <>
              {/* Badge Format Selector */}
              <div className="studio-section">
                <label className="studio-section-label">Badge Format & Architecture</label>
                <div className="badge-format-selector">
                  {BADGE_FORMATS.map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      className={`badge-format-btn ${formatType === fmt.id ? 'active' : ''}`}
                      onClick={() => setFormatType(fmt.id)}
                    >
                      <span className="material-symbols-outlined badge-format-icon">{fmt.icon}</span>
                      <span className="badge-format-title">{fmt.title}</span>
                      <span className="badge-format-subtitle">{fmt.subtitle}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Content Inputs depending on format */}
              <div className="studio-section">
                <label className="studio-section-label">Badge Content</label>

                {formatType === 'brand-plate' ? (
                  <div className="studio-field">
                    <span className="studio-field-label">Solid Brand Plate Title</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={plateTitle}
                      onChange={(e) => setPlateTitle(e.target.value)}
                      placeholder="e.g. React 19, Python 3.12, Docker Compose"
                    />
                  </div>
                ) : formatType === 'icon-only' ? (
                  <div style={{ padding: '8px 10px', background: 'var(--surface-base)', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Minimalist logo tile with centered icon and zero text. Select your icon and background color below.
                  </div>
                ) : (
                  <div className="studio-input-duo">
                    <div className="studio-field">
                      <span className="studio-field-label">Left Label</span>
                      <input
                        type="text"
                        className="studio-text-input"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g. version, license, code"
                      />
                    </div>
                    <div className="studio-field">
                      <span className="studio-field-label">Right Message</span>
                      <input
                        type="text"
                        className="studio-text-input"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. 1.0.0, MIT, passing"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Badge Geometry Style Selector (for Shields.io) */}
              {formatType !== 'badgen' && (
                <div className="studio-section">
                  <label className="studio-section-label">Geometry Style ({BADGE_STYLES.length} Styles)</label>
                  <div className="badge-styles-card-grid">
                    {BADGE_STYLES.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        className={`badge-style-card ${style === st.id ? 'active' : ''}`}
                        onClick={() => setStyle(st.id)}
                      >
                        <div className="badge-style-card-header">
                          <span className="badge-style-card-title">{st.label}</span>
                          <span className="badge-style-card-tag">{st.tag}</span>
                        </div>
                        <span className="badge-style-card-desc">{st.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dual-Tone Curated Theme Palettes */}
              <div className="studio-section">
                <div className="badge-toggle-row">
                  <label className="studio-section-label" style={{ margin: 0 }}>
                    Curated Color Themes
                  </label>
                  {formatType === 'split' && (
                    <label className="badge-toggle-switch">
                      <input
                        type="checkbox"
                        checked={twoTone}
                        onChange={(e) => setTwoTone(e.target.checked)}
                      />
                      <span>Two-Tone Duotone Mode</span>
                    </label>
                  )}
                </div>
                <div className="badge-theme-grid">
                  {COLOR_THEMES.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      className={`badge-theme-card ${color.toLowerCase() === th.color.toLowerCase() ? 'active' : ''}`}
                      onClick={() => handleApplyTheme(th)}
                    >
                      <div className="badge-theme-duo-swatch">
                        <div
                          className="badge-theme-duo-left"
                          style={{ backgroundColor: `#${th.labelColor}` }}
                        />
                        <div
                          className="badge-theme-duo-right"
                          style={{ backgroundColor: `#${th.color}` }}
                        />
                      </div>
                      <div className="badge-theme-info">
                        <span className="badge-theme-name">{th.name}</span>
                        <span className="badge-theme-hexes">#{th.color}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Categorized Swatches Matrix */}
              <div className="studio-section">
                <label className="studio-section-label">Color Swatches Palette</label>
                <div className="studio-swatches-grid">
                  {COLOR_SWATCHES.map((swatch, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`color-swatch-circle ${color.toLowerCase() === swatch.hex.toLowerCase() ? 'active' : ''}`}
                      style={{ backgroundColor: `#${swatch.hex}` }}
                      onClick={() => setColor(swatch.hex)}
                      title={`${swatch.name} (#${swatch.hex})`}
                    />
                  ))}
                </div>

                <div className="studio-input-duo" style={{ marginTop: '6px' }}>
                  <div className="studio-field">
                    <span className="studio-field-label">Background HEX</span>
                    <div className="studio-hex-row" style={{ marginTop: 0 }}>
                      <span className="hex-prefix">#</span>
                      <input
                        type="text"
                        className="studio-hex-input"
                        value={color}
                        onChange={(e) => setColor(e.target.value.replace('#', ''))}
                        placeholder="61dafb"
                        maxLength={6}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                  {twoTone && formatType === 'split' && (
                    <div className="studio-field">
                      <span className="studio-field-label">Left Label HEX</span>
                      <div className="studio-hex-row" style={{ marginTop: 0 }}>
                        <span className="hex-prefix">#</span>
                        <input
                          type="text"
                          className="studio-hex-input"
                          value={labelColor}
                          onChange={(e) => setLabelColor(e.target.value.replace('#', ''))}
                          placeholder="18181b"
                          maxLength={6}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Logo & SimpleIcons Directory */}
              <div className="studio-section">
                <div className="studio-section-header">
                  <label className="studio-section-label">Brand Icon (SimpleIcons)</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      className={`btn-rack-mini ${logoColor === 'white' ? 'active' : ''}`}
                      onClick={() => setLogoColor('white')}
                      title="White icon tint"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>contrast</span>
                    </button>
                    <button
                      type="button"
                      className={`btn-rack-mini ${logoColor === 'black' ? 'active' : ''}`}
                      onClick={() => setLogoColor('black')}
                      title="Black icon tint"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>dark_mode</span>
                    </button>
                    {logo && (
                      <button
                        type="button"
                        className="btn-rack-mini delete"
                        onClick={() => setLogo('')}
                        title="Remove icon"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="badge-icons-picker-container">
                  <div className="badge-icons-filter-bar">
                    <input
                      type="text"
                      className="studio-search-mini"
                      placeholder="Search icons (react, python)..."
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <div className="badge-icons-category-strip">
                      {['all', 'languages', 'frameworks', 'databases', 'devops', 'tools', 'social'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`badge-icon-cat-btn ${iconCategory === cat ? 'active' : ''}`}
                          onClick={() => setIconCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="badge-icons-grid custom-scrollbar">
                    {filteredIcons.map((ic) => (
                      <button
                        key={ic.slug}
                        type="button"
                        className={`badge-icon-tile ${logo === ic.slug ? 'active' : ''}`}
                        onClick={() => handleSelectIcon(ic)}
                      >
                        <div
                          className="badge-icon-color-dot"
                          style={{ backgroundColor: `#${ic.color}` }}
                        />
                        <span className="badge-icon-name">{ic.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Link & Rack Action */}
              <div className="studio-section">
                <div className="studio-field">
                  <span className="studio-field-label">Target Hyperlink URL</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder={repoUrl || 'https://github.com/...'}
                  />
                </div>
                <div style={{ marginTop: '8px' }}>
                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={handleAddCurrentToRack}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span className="material-symbols-outlined icon-xs">add_box</span>
                    <span>Add this Badge to Tech Stack Rack</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              MODE 2: SKILLICONS SQUIRCLES (macOS App Icon Grid)
             ========================================================================= */}
          {activeMode === 'skillicons' && (
            <div className="skillicons-container">
              <div className="studio-section">
                <label className="studio-section-label">
                  Selected Tech Icons ({selectedSkillIcons.length} in Grid)
                </label>
                <div className="skillicons-selected-rack custom-scrollbar">
                  {selectedSkillIcons.map((slug) => {
                    const match = SKILL_ICONS_LIST.find((i) => i.id === slug)
                    return (
                      <div key={slug} className="skillicon-chip">
                        <span>{match ? match.name : slug}</span>
                        <button
                          type="button"
                          className="skillicon-chip-remove"
                          onClick={() => toggleSkillIcon(slug)}
                        >
                          ×
                        </button>
                      </div>
                    )
                  })}
                  {selectedSkillIcons.length === 0 && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Click icons below to add them to your macOS squircle grid
                    </span>
                  )}
                </div>
              </div>

              {/* Theme & Icons Per Line */}
              <div className="studio-input-duo">
                <div className="studio-field">
                  <span className="studio-field-label">Theme Mode</span>
                  <div className="studio-segmented-styles">
                    <button
                      type="button"
                      className={`studio-style-btn ${skillTheme === 'dark' ? 'active' : ''}`}
                      onClick={() => setSkillTheme('dark')}
                    >
                      🌙 Dark Mode
                    </button>
                    <button
                      type="button"
                      className={`studio-style-btn ${skillTheme === 'light' ? 'active' : ''}`}
                      onClick={() => setSkillTheme('light')}
                    >
                      ☀️ Light Mode
                    </button>
                  </div>
                </div>
                <div className="studio-field">
                  <span className="studio-field-label">Icons Per Row (perline)</span>
                  <div className="studio-segmented-styles">
                    {['6', '8', '10', '12', '16'].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`studio-style-btn ${skillPerLine === n ? 'active' : ''}`}
                        onClick={() => setSkillPerLine(n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SkillIcons Selection Grid */}
              <div className="studio-section">
                <div className="studio-section-header">
                  <label className="studio-section-label">All Available Technologies</label>
                  <input
                    type="text"
                    className="studio-search-mini"
                    placeholder="Search technologies..."
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                  />
                </div>
                <div className="skillicons-grid custom-scrollbar">
                  {filteredSkillIcons.map((ic) => {
                    const isSelected = selectedSkillIcons.includes(ic.id)
                    return (
                      <button
                        key={ic.id}
                        type="button"
                        className={`skillicon-tile ${isSelected ? 'active' : ''}`}
                        onClick={() => toggleSkillIcon(ic.id)}
                        title={`${ic.name} (${ic.category})`}
                      >
                        <div
                          className="skillicon-tile-badge"
                          style={{
                            backgroundColor: `${ic.color}1c`,
                            borderColor: isSelected ? 'var(--primary)' : `${ic.color}35`,
                            color: ic.color === '#ffffff' ? '#e2e8f0' : ic.color
                          }}
                        >
                          <span className="skillicon-tile-code">{ic.short || ic.name.slice(0, 2)}</span>
                        </div>
                        <span className="skillicon-tile-name">{ic.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODE 3: GITHUB REPO PIN & ACTIVITY CARDS
             ========================================================================= */}
          {activeMode === 'repocards' && (
            <div className="repocards-container">
              <div className="repocard-native-banner">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>verified</span>
                <span>Client-Side Vector Engine: 0 external API dependencies, 100% free offline generation, scales without limits.</span>
              </div>

                  <div className="studio-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label className="studio-section-label" style={{ margin: 0 }}>Target GitHub Repository</label>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Local Desktop + Direct API</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="studio-text-input"
                        value={customRepo || cleanRepo}
                        onChange={(e) => setCustomRepo(e.target.value)}
                        placeholder="owner/repo (e.g. facebook/react)"
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="btn-studio-secondary"
                        onClick={() => handleFetchGitHubData()}
                        disabled={isFetchingGitHub}
                        title="Fetch live stats directly from GitHub REST API"
                        style={{ height: '32px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <span className={`material-symbols-outlined icon-xs ${isFetchingGitHub ? 'spin' : ''}`}>
                          {isFetchingGitHub ? 'sync' : 'bolt'}
                        </span>
                        <span>{isFetchingGitHub ? 'Syncing...' : 'Sync Live'}</span>
                      </button>
                      {typeof window !== 'undefined' && window.electronAPI && (
                        <button
                          type="button"
                          className="btn-studio-secondary"
                          onClick={handleDetectWorkspaceGit}
                          title="Detect repository from local workspace git origin URL"
                          style={{ height: '32px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <span className="material-symbols-outlined icon-xs">folder_open</span>
                          <span>Local Git</span>
                        </button>
                      )}
                    </div>
                    {githubSyncStatus && (
                      <div
                        style={{
                          marginTop: '8px',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: githubSyncStatus.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                          color: githubSyncStatus.type === 'success' ? '#34d399' : '#f87171',
                          border: `1px solid ${githubSyncStatus.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                          {githubSyncStatus.type === 'success' ? 'check_circle' : 'error'}
                        </span>
                        <span style={{ flex: 1 }}>{githubSyncStatus.message}</span>
                        <button
                          type="button"
                          onClick={() => setGithubSyncStatus(null)}
                          style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Native SVG Style Grid */}
                  <div className="studio-section">
                    <label className="studio-section-label">
                      Vector Card Architecture ({NATIVE_REPO_CARD_TYPES.length} Styles)
                    </label>
                    <div className="repocard-types-grid">
                      {NATIVE_REPO_CARD_TYPES.map((nrc) => (
                        <button
                          key={nrc.id}
                          type="button"
                          className={`repocard-type-card ${nativeCardStyle === nrc.id ? 'active' : ''}`}
                          onClick={() => setNativeCardStyle(nrc.id)}
                        >
                          <div className="repocard-card-header">
                            <span className="repocard-type-title">{nrc.title}</span>
                            <span className="repocard-type-tag" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                              {nrc.tag}
                            </span>
                          </div>
                          <span className="repocard-type-desc">{nrc.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Telemetry & Content Customization */}
                  <div className="studio-section">
                    <label className="studio-section-label">Telemetry & Content Customization</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="studio-field">
                        <span className="studio-field-label">Repository Tagline / Description</span>
                        <input
                          type="text"
                          className="studio-text-input"
                          value={cardCustomDesc}
                          onChange={(e) => setCardCustomDesc(e.target.value)}
                          placeholder="Automated Documentation Platform & GitHub Repository"
                        />
                      </div>
                      <div className="repocard-fields-grid">
                        <div className="studio-field">
                          <span className="studio-field-label">Stars Count</span>
                          <input
                            type="text"
                            className="studio-text-input"
                            value={cardCustomStars}
                            onChange={(e) => setCardCustomStars(e.target.value)}
                            placeholder="e.g. 1.2k"
                          />
                        </div>
                        <div className="studio-field">
                          <span className="studio-field-label">Forks Count</span>
                          <input
                            type="text"
                            className="studio-text-input"
                            value={cardCustomForks}
                            onChange={(e) => setCardCustomForks(e.target.value)}
                            placeholder="e.g. 240"
                          />
                        </div>
                      </div>
                      <div className="repocard-fields-grid">
                        <div className="studio-field">
                          <span className="studio-field-label">Open Issues</span>
                          <input
                            type="text"
                            className="studio-text-input"
                            value={cardCustomIssues}
                            onChange={(e) => setCardCustomIssues(e.target.value)}
                            placeholder="e.g. 12"
                          />
                        </div>
                        <div className="studio-field">
                          <span className="studio-field-label">License SPDX</span>
                          <input
                            type="text"
                            className="studio-text-input"
                            value={cardCustomLicense}
                            onChange={(e) => setCardCustomLicense(e.target.value)}
                            placeholder="e.g. MIT"
                          />
                        </div>
                      </div>
                      <div className="repocard-fields-grid">
                        <div className="studio-field">
                          <span className="studio-field-label">Primary Language</span>
                          <input
                            type="text"
                            className="studio-text-input"
                            value={cardCustomLang}
                            onChange={(e) => setCardCustomLang(e.target.value)}
                            placeholder="TypeScript"
                          />
                        </div>
                        <div className="studio-field">
                          <span className="studio-field-label">Language Dot Color</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input
                              type="color"
                              value={cardCustomLangColor}
                              onChange={(e) => setCardCustomLangColor(e.target.value)}
                              style={{ width: '32px', height: '32px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                            />
                            <input
                              type="text"
                              className="studio-text-input"
                              value={cardCustomLangColor}
                              onChange={(e) => setCardCustomLangColor(e.target.value)}
                              placeholder="#3178c6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Language Breakdown Display for Lang Cards */}
                  {(nativeCardStyle === 'native-langs-bar' || nativeCardStyle === 'native-langs-donut') && (
                    <div className="studio-section">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label className="studio-section-label" style={{ margin: 0 }}>Detected Language Breakdown</label>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Proportional Share</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {cardCustomLanguagesList.map((l, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              fontSize: '11.5px'
                            }}
                          >
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: l.color }} />
                            <span style={{ color: '#f0f6fc', fontWeight: 600 }}>{l.name}</span>
                            <span style={{ color: '#8b949e' }}>{l.percent}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accent Color & Curvature */}
                  <div className="studio-section">
                    <label className="studio-section-label">Aesthetic Accent Color & Curvature</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={cardThemeColor}
                          onChange={(e) => setCardThemeColor(e.target.value)}
                          style={{ width: '32px', height: '32px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                        />
                        <input
                          type="text"
                          className="studio-text-input"
                          value={cardThemeColor}
                          onChange={(e) => setCardThemeColor(e.target.value)}
                          placeholder="#6366f1"
                        />
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {['#6366f1', '#10b981', '#38bdf8', '#ec4899', '#f59e0b', '#a855f7'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setCardThemeColor(c)}
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: c,
                                border: cardThemeColor === c ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                                cursor: 'pointer'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="studio-segmented-styles">
                        {[
                          { label: 'Sharp (0px)', val: '0' },
                          { label: 'Rounded (8px)', val: '8' },
                          { label: 'Squircle (12px)', val: '12' },
                          { label: 'Pill (18px)', val: '18' }
                        ].map((rad) => (
                          <button
                            key={rad.val}
                            type="button"
                            className={`studio-style-btn ${repoCardRadius === rad.val ? 'active' : ''}`}
                            onClick={() => setRepoCardRadius(rad.val)}
                          >
                            {rad.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Embed Strategy */}
                  <div className="studio-section">
                    <label className="studio-section-label">README Integration Mode</label>
                    <div className="studio-segmented-styles">
                      <button
                        type="button"
                        className={`studio-style-btn ${nativeEmbedMode === 'relative-asset' ? 'active' : ''}`}
                        onClick={() => setNativeEmbedMode('relative-asset')}
                      >
                        📁 Repo Asset (assets/card.svg)
                      </button>
                      <button
                        type="button"
                        className={`studio-style-btn ${nativeEmbedMode === 'raw-cdn' ? 'active' : ''}`}
                        onClick={() => setNativeEmbedMode('raw-cdn')}
                      >
                        🌐 Raw GitHub CDN URL
                      </button>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      {nativeEmbedMode === 'relative-asset'
                        ? 'Download the .svg and place it in your repository\'s assets/ folder for permanent self-hosted uptime.'
                        : 'Directly references raw.githubusercontent.com for instant global CDN delivery.'}
                    </span>
                  </div>
            </div>
          )}


          {/* =========================================================================
              MODE 4: TECH STACK & RACK BUILDER
             ========================================================================= */}
          {activeMode === 'rack' && (
            <div className="badge-rack-container">
              <div className="studio-section">
                <div className="studio-section-header">
                  <label className="studio-section-label">
                    Configured Badges Rack ({rackBadges.length} Active)
                  </label>
                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={() => setActiveMode('single')}
                    style={{ height: '24px', fontSize: '10px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>add</span>
                    <span>Create New</span>
                  </button>
                </div>

                <div className="badge-rack-list custom-scrollbar">
                  {rackBadges.map((b, idx) => {
                    const bC = (b.color || '6366f1').replace('#', '')
                    let bUrl = ''
                    if (b.format === 'brand-plate') {
                      bUrl = `https://img.shields.io/badge/${escapeShieldsText(b.title || b.label)}-${bC}?style=${b.style || style}`
                    } else if (b.format === 'icon-only') {
                      bUrl = `https://img.shields.io/badge/--${bC}?style=${b.style || style}`
                    } else {
                      bUrl = `https://img.shields.io/badge/${escapeShieldsText(b.label)}-${escapeShieldsText(b.message)}-${bC}?style=${b.style || style}`
                    }
                    if (b.logo) bUrl += `&logo=${encodeURIComponent(b.logo)}&logoColor=white`

                    return (
                      <div key={b.id || idx} className="badge-rack-item">
                        <div className="badge-rack-item-left">
                          <img
                            src={bUrl}
                            alt={`${b.label} ${b.message}`}
                            className="badge-rack-img"
                          />
                        </div>
                        <div className="badge-rack-item-actions">
                          <button
                            type="button"
                            className="btn-rack-mini delete"
                            onClick={() => handleRemoveRackBadge(b.id)}
                            title="Remove badge from rack"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  {rackBadges.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '11px' }}>
                      No badges in your rack yet. Switch to "Badge Designer" or "Curated Packs" to add badges.
                    </div>
                  )}
                </div>
              </div>

              {/* Layout Alignment Format */}
              <div className="studio-section">
                <label className="studio-section-label">Rack Markdown Layout Structure</label>
                <div className="studio-segmented-styles">
                  <button
                    type="button"
                    className={`studio-style-btn ${rackLayout === 'center-div' ? 'active' : ''}`}
                    onClick={() => setRackLayout('center-div')}
                  >
                    📐 Centered HTML Grid (&lt;div align="center"&gt;)
                  </button>
                  <button
                    type="button"
                    className={`studio-style-btn ${rackLayout === 'inline' ? 'active' : ''}`}
                    onClick={() => setRackLayout('inline')}
                  >
                    🔗 Inline Markdown Row
                  </button>
                  <button
                    type="button"
                    className={`studio-style-btn ${rackLayout === 'lines' ? 'active' : ''}`}
                    onClick={() => setRackLayout('lines')}
                  >
                    📋 Stacked Lines
                  </button>
                </div>
              </div>

              {/* Bulk Style & Theme Application */}
              <div className="studio-section">
                <label className="studio-section-label">Batch Operations for Entire Rack</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {BADGE_STYLES.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        className="studio-style-btn"
                        onClick={() => handleApplyStyleToRack(st.id)}
                      >
                        Set all to {st.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {COLOR_THEMES.slice(0, 6).map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        className="studio-style-btn"
                        onClick={() => handleApplyThemeToRack(th)}
                      >
                        Apply {th.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODE 5: DYNAMIC GITHUB REPO METRICS
             ========================================================================= */}
          {activeMode === 'github' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="studio-section">
                <label className="studio-section-label">Target GitHub Repository</label>
                <input
                  type="text"
                  className="studio-text-input"
                  value={customRepo || cleanRepo}
                  onChange={(e) => setCustomRepo(e.target.value)}
                  placeholder="owner/repo (e.g. facebook/react)"
                />
              </div>

              <div className="studio-section">
                <div className="studio-section-header">
                  <label className="studio-section-label">
                    Live Shields.io Metrics ({selectedMetrics.length} selected)
                  </label>
                  <button
                    type="button"
                    className="studio-style-btn"
                    onClick={toggleAllMetrics}
                    style={{ fontSize: '9.5px', padding: '1px 6px' }}
                  >
                    {selectedMetrics.length === GITHUB_METRICS.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="badge-github-metrics-grid">
                  {GITHUB_METRICS.map((metric) => {
                    const isChecked = selectedMetrics.includes(metric.id)
                    return (
                      <div
                        key={metric.id}
                        className={`badge-metric-card ${isChecked ? 'active' : ''}`}
                        onClick={() => toggleMetric(metric.id)}
                      >
                        <input
                          type="checkbox"
                          className="badge-metric-checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                        />
                        <div className="badge-metric-details">
                          <span className="badge-metric-title">{metric.title}</span>
                          <span className="badge-metric-endpoint">/github/{metric.path}/...</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="studio-section">
                <label className="studio-section-label">Metric Badge Geometry</label>
                <div className="studio-segmented-styles">
                  {BADGE_STYLES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      className={`studio-style-btn ${githubMetricsStyle === st.id ? 'active' : ''}`}
                      onClick={() => setGithubMetricsStyle(st.id)}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODE 6: CURATED TECH PACKS
             ========================================================================= */}
          {activeMode === 'packs' && (
            <div className="badge-pack-grid">
              {CURATED_PACKS.map((pack) => {
                const isSelected = selectedPackId === pack.id
                return (
                  <div
                    key={pack.id}
                    className={`badge-pack-card ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedPackId(pack.id)}
                    title={`Click to preview ${pack.title} in the Live Canvas`}
                  >
                    <div className="badge-pack-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge-pack-title">{pack.title}</span>
                        {isSelected && (
                          <span
                            className="studio-tag"
                            style={{
                              fontSize: '9.5px',
                              padding: '1px 7px',
                              background: 'rgba(99, 102, 241, 0.2)',
                              color: '#818cf8',
                              borderColor: 'rgba(99, 102, 241, 0.5)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>visibility</span>
                            <span>Active Preview</span>
                          </span>
                        )}
                      </div>
                      <span className="badge-pack-count">{pack.category}</span>
                    </div>
                    <span className="badge-pack-desc">{pack.desc}</span>

                    <div className="badge-pack-preview-rack">
                      {pack.badges.map((b, idx) => {
                        const bL = escapeShieldsText(b.label)
                        const bM = escapeShieldsText(b.message)
                        let bUrl = `https://img.shields.io/badge/${bL}-${bM}-${b.color}?style=${b.style || style}`
                        if (b.logo) bUrl += `&logo=${encodeURIComponent(b.logo)}&logoColor=white`
                        return (
                          <img
                            key={idx}
                            src={bUrl}
                            alt={`${b.label} ${b.message}`}
                            style={{ height: '20px' }}
                          />
                        )
                      })}
                    </div>

                    <div className="badge-pack-actions">
                      <button
                        type="button"
                        className="btn-studio-secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLoadPackIntoRack(pack)
                        }}
                        style={{ height: '26px', fontSize: '10.5px' }}
                        title="Load this pack into Rack Editor for custom rearranging and badge additions"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>edit</span>
                        <span>Customize in Rack</span>
                      </button>
                      <button
                        type="button"
                        className="btn-studio-primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedPackId(pack.id)
                          onInsertBadge(getPackMarkdown(pack))
                        }}
                        style={{ height: '26px', fontSize: '10.5px' }}
                        title={`Insert ${pack.title} into your document or table`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>add_circle</span>
                        <span>Insert Pack into Document</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
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
        <div className="studio-preview-column custom-scrollbar" style={{ flex: 1, minWidth: 0 }}>
          {/* Live Render Canvas Card */}
          <div className="studio-card">
            <div className="studio-card-header">
              <div className="canvas-toolbar">
                <div className="canvas-toolbar-group">
                  <span className="studio-card-title">Live Canvas Preview</span>
                  <span className="studio-card-tag">
                    {activeMode === 'single'
                      ? `${formatType} (${style})`
                      : activeMode === 'skillicons'
                      ? `${selectedSkillIcons.length} skills (${skillTheme})`
                      : activeMode === 'repocards'
                      ? `${NATIVE_REPO_CARD_TYPES.find((s) => s.id === nativeCardStyle)?.title || 'Vector SVG'}`
                      : activeMode === 'rack'
                      ? `${rackBadges.length} in rack`
                      : activeMode === 'github'
                      ? `${selectedMetrics.length} metrics`
                      : selectedPack.title}
                  </span>
                </div>
                <div className="canvas-toolbar-group">
                  <button
                    type="button"
                    className={`canvas-tool-btn ${canvasBg === 'dark' ? 'active' : ''}`}
                    onClick={() => setCanvasBg('dark')}
                    title="GitHub Dark background preview (#0d1117)"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>dark_mode</span>
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    className={`canvas-tool-btn ${canvasBg === 'light' ? 'active' : ''}`}
                    onClick={() => setCanvasBg('light')}
                    title="GitHub Light background preview (#ffffff)"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>light_mode</span>
                    <span>Light</span>
                  </button>
                </div>
              </div>
            </div>

            <div className={`studio-render-canvas ${canvasBg === 'light' ? 'light-bg' : 'dark-bg'}`}>
              {/* Single Badge Preview */}
              {activeMode === 'single' && (
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  {!singleBadgeError ? (
                    <img
                      src={singleBadgeUrl}
                      alt={plateTitle || `${label} ${message}`}
                      className="badge-render-img"
                      onError={() => setSingleBadgeError(true)}
                    />
                  ) : (
                    <div className="simulated-badge-preview">
                      <div className={`simulated-badge simulated-style-${style}`}>
                        {formatType === 'icon-only' ? (
                          <span className="sim-badge-body" style={{ backgroundColor: `#${color.replace('#', '')}` }}>
                            🏷️
                          </span>
                        ) : formatType === 'brand-plate' ? (
                          <span className="sim-badge-body" style={{ backgroundColor: `#${color.replace('#', '')}` }}>
                            {plateTitle || label || 'BRAND'}
                          </span>
                        ) : (
                          <>
                            <span
                              className="sim-badge-label"
                              style={{ backgroundColor: labelColor ? `#${labelColor.replace('#', '')}` : '#555555' }}
                            >
                              {label || 'badge'}
                            </span>
                            <span
                              className="sim-badge-message"
                              style={{ backgroundColor: `#${color.replace('#', '')}` }}
                            >
                              {message || 'value'}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="offline-notice-pill">
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>wifi_off</span>
                        <span>External CDN Unreachable • Simulated Preview active • Markdown syntax is valid</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SkillIcons Squircle Grid Preview */}
              {activeMode === 'skillicons' && (
                <div style={{ textAlign: 'center', padding: '16px', maxWidth: '100%', overflowX: 'auto' }}>
                  {!skillIconsError ? (
                    <img
                      src={skillIconsUrl}
                      alt="SkillIcons Grid"
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                      onError={() => setSkillIconsError(true)}
                    />
                  ) : (
                    <div className="simulated-skillicons-container">
                      <div
                        className="simulated-skillicons-deck"
                        style={{
                          gridTemplateColumns: `repeat(${Math.min(selectedSkillIcons.length || 1, skillPerLine)}, 42px)`
                        }}
                      >
                        {selectedSkillIcons.map((id) => {
                          const item = SKILL_ICONS_LIST.find((x) => x.id === id) || { name: id, color: '#6366f1', short: id }
                          return (
                            <div
                              key={id}
                              className="sim-skillicon-item"
                              style={{
                                backgroundColor: skillTheme === 'light' ? '#f1f5f9' : '#1e293b',
                                borderColor: `${item.color}60`
                              }}
                              title={item.name}
                            >
                              <span className="sim-skillicon-dot" style={{ backgroundColor: item.color }} />
                              <span className="sim-skillicon-code" style={{ color: item.color === '#ffffff' ? '#e2e8f0' : item.color }}>
                                {item.short}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="offline-notice-pill">
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>wifi_off</span>
                        <span>SkillIcons CDN Unreachable • Simulated Preview active • Markdown syntax is valid</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Repo Card Preview */}
              {activeMode === 'repocards' && (
                <div style={{ textAlign: 'center', padding: '16px', maxWidth: '100%', overflowX: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div
                      dangerouslySetInnerHTML={{ __html: nativeCardSvg }}
                      style={{ maxWidth: '100%', display: 'inline-flex', justifyContent: 'center' }}
                    />
                    <div className="repocard-download-bar" style={{ width: '100%', maxWidth: '500px', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#10b981' }}>verified_user</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Native Vector SVG • Zero External Dependencies</span>
                        </div>
                        {saveStatusMessage && (
                          <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 600 }}>{saveStatusMessage}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                        <button
                          type="button"
                          className="btn-studio-primary"
                          onClick={handleSaveToWorkspaceAndEmbed}
                          title="Save SVG directly into ./assets/ and embed into document"
                          style={{ flex: 1, height: '30px', fontSize: '11px' }}
                        >
                          <span className="material-symbols-outlined icon-xs">save</span>
                          <span>Save to ./assets/ & Embed</span>
                        </button>
                        <button
                          type="button"
                          className="btn-studio-secondary"
                          onClick={handleCopySvgCode}
                          title="Copy vector SVG XML markup to clipboard"
                          style={{ height: '30px', fontSize: '11px' }}
                        >
                          <span className="material-symbols-outlined icon-xs">code</span>
                          <span>Copy SVG</span>
                        </button>
                        <button
                          type="button"
                          className="btn-studio-secondary"
                          onClick={handleDownloadNativeSvg}
                          title="Download vector SVG file"
                          style={{ height: '30px', fontSize: '11px' }}
                        >
                          <span className="material-symbols-outlined icon-xs">download</span>
                          <span>Export .svg</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rack Mode Preview */}
              {activeMode === 'rack' && (
                <div className="badge-rack-preview-flow">
                  {rackBadges.map((b, idx) => {
                    const bC = (b.color || '6366f1').replace('#', '')
                    let bUrl = ''
                    if (b.format === 'brand-plate') {
                      bUrl = `https://img.shields.io/badge/${escapeShieldsText(b.title || b.label)}-${bC}?style=${b.style || style}`
                    } else if (b.format === 'icon-only') {
                      bUrl = `https://img.shields.io/badge/--${bC}?style=${b.style || style}`
                    } else {
                      bUrl = `https://img.shields.io/badge/${escapeShieldsText(b.label)}-${escapeShieldsText(b.message)}-${bC}?style=${b.style || style}`
                      if (b.labelColor) bUrl += `&labelColor=${encodeURIComponent(b.labelColor.replace('#', ''))}`
                    }
                    if (b.logo) bUrl += `&logo=${encodeURIComponent(b.logo)}&logoColor=white`

                    return (
                      <img
                        key={b.id || idx}
                        src={bUrl}
                        alt={`${b.label} ${b.message}`}
                        className="badge-render-img"
                        onError={(e) => { e.target.style.opacity = '0.4' }}
                      />
                    )
                  })}
                  {rackBadges.length === 0 && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      Add badges to preview rack layout
                    </span>
                  )}
                </div>
              )}

              {/* Dynamic GitHub Metrics Preview */}
              {activeMode === 'github' && (
                <div className="badge-rack-preview-flow">
                  {GITHUB_METRICS.filter((m) => selectedMetrics.includes(m.id)).map((m) => {
                    let bUrl = ''
                    if (m.id === 'actions') {
                      bUrl = `https://img.shields.io/github/actions/workflow/status/${cleanRepo}/${m.workflow}?style=${githubMetricsStyle}&logo=githubactions&logoColor=white`
                    } else {
                      bUrl = `https://img.shields.io/github/${m.path}/${cleanRepo}?style=${githubMetricsStyle}`
                    }
                    return (
                      <img
                        key={m.id}
                        src={bUrl}
                        alt={m.title}
                        className="badge-render-img"
                        onError={(e) => { e.target.style.opacity = '0.4'; setMetricsError(true); }}
                      />
                    )
                  })}
                  {metricsError && (
                    <div className="offline-notice-pill" style={{ width: '100%', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>wifi_off</span>
                      <span>Shields.io metrics CDN unreachable (DNS / offline) • Generated markdown is valid</span>
                    </div>
                  )}
                </div>
              )}

              {/* Curated Pack Preview */}
              {activeMode === 'packs' && (
                <div className="badge-rack-preview-flow">
                  {selectedPack.badges.map((b, idx) => {
                    const bL = escapeShieldsText(b.label)
                    const bM = escapeShieldsText(b.message)
                    let bUrl = `https://img.shields.io/badge/${bL}-${bM}-${b.color}?style=${b.style || style}`
                    if (b.logo) bUrl += `&logo=${encodeURIComponent(b.logo)}&logoColor=white`
                    return (
                      <img
                        key={idx}
                        src={bUrl}
                        alt={`${b.label} ${b.message}`}
                        className="badge-render-img"
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Generated Code Card */}
          <div className="studio-card">
            <div className="studio-card-header">
              <div className="canvas-toolbar-group">
                <span className="studio-card-title">Generated Syntax</span>
                {activeMode === 'single' && (
                  <div className="studio-segmented-styles" style={{ gap: '2px' }}>
                    <button
                      type="button"
                      className={`canvas-tool-btn ${syntaxView === 'markdown' ? 'active' : ''}`}
                      onClick={() => setSyntaxView('markdown')}
                    >
                      Markdown
                    </button>
                    <button
                      type="button"
                      className={`canvas-tool-btn ${syntaxView === 'html' ? 'active' : ''}`}
                      onClick={() => setSyntaxView('html')}
                    >
                      HTML
                    </button>
                    <button
                      type="button"
                      className={`canvas-tool-btn ${syntaxView === 'url' ? 'active' : ''}`}
                      onClick={() => setSyntaxView('url')}
                    >
                      URL
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="snippet-copy-btn"
                onClick={handleCopy}
              >
                <span className="material-symbols-outlined icon-xs">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="studio-code-block custom-scrollbar">
              <code>{activeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
