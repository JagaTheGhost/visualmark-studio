import React, { useState, useEffect } from 'react'
import { saveAs } from 'file-saver'
import { getOptimizedImageUrl, requiresAsyncResolution, resolveRedirectImageUrl } from '../../../utils/imageUtils'
import { useStudioSplit } from '../../../utils/useResizableSplit'
import {
  STUDIO_MODES,
  LOCAL_SVG_TYPES,
  COLOR_THEMES,
  escapeXml
} from './imageStudioConstants'
import { getActiveSvgCode } from './svgBannerGenerators'
import HeroBannerForm from './HeroBannerForm'
import VisualMockupForm from './VisualMockupForm'
import AdaptiveThemeForm from './AdaptiveThemeForm'
import ComparisonForm from './ComparisonForm'
import ImageStudioLivePreview from './ImageStudioLivePreview'

export default function ImageStudioTab({
  repoUrl = '',
  onInsertImage = () => {},
  onBackToReadme = () => {}
}) {
  const [activeMode, setActiveMode] = useState('banner')
  const [copied, setCopied] = useState(false)
  const { formWidth, isDragging: isSplitDragging, handleMouseDown, handleDoubleClick } = useStudioSplit(520)

  // Parse repo owner and name if available
  const parsedRepo = (() => {
    if (!repoUrl) return { owner: 'username', repo: 'repository' }
    const cleaned = repoUrl.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')
    const parts = cleaned.split('/')
    if (parts.length >= 2) return { owner: parts[0], repo: parts[1] }
    return { owner: 'username', repo: cleaned || 'repository' }
  })()

  // 1. Banner Creator State
  const [bannerType, setBannerType] = useState('capsule')
  const [bannerSyntaxMode, setBannerSyntaxMode] = useState('asset-path')
  const [capsuleShape, setCapsuleShape] = useState('waving')
  const [bannerTitle, setBannerTitle] = useState('README Studio')
  const [bannerSubtitle, setBannerSubtitle] = useState('State-of-the-Art Markdown Documentation Platform')
  const [bannerTheme, setBannerTheme] = useState(COLOR_THEMES[0])
  const [bannerTags, setBannerTags] = useState('FastAPI, React, Vite, Tailwind')
  const [bannerHeight, setBannerHeight] = useState('220')

  // Stitch HUD Telemetry Specific State
  const [hudVersion, setHudVersion] = useState('v2.4.0')
  const [hudStatus, setHudStatus] = useState('SYSTEM NOMINAL')

  // Neofetch Specific State
  const [neofetchOs, setNeofetchOs] = useState('GitHub / Linux x86_64')
  const [neofetchLicense, setNeofetchLicense] = useState('MIT License')

  // GitHub Stats Card Specific State
  const [githubRepoOwner, setGithubRepoOwner] = useState(parsedRepo.owner)
  const [githubRepoName, setGithubRepoName] = useState(parsedRepo.repo)
  const [githubStatsTheme, setGithubStatsTheme] = useState('tokyonight')

  // Typing SVG State
  const [typingLines, setTypingLines] = useState(
    'Welcome to README Studio;Automated Documentation Platform;Built with React and Python'
  )
  const [typingFont, setTypingFont] = useState('Fira Code')
  const [typingColor, setTypingColor] = useState('6366F1')
  const [typingPause, setTypingPause] = useState('1000')
  const [typingError, setTypingError] = useState(false)

  useEffect(() => {
    setTypingError(false)
  }, [typingLines, typingFont, typingColor, typingPause])

  // 2. Mockup State (Shared between Link and Upload)
  const [imageUrl, setImageUrl] = useState('')
  const [resolvedUrl, setResolvedUrl] = useState('')
  const [isResolving, setIsResolving] = useState(false)
  const [resolveNote, setResolveNote] = useState('')
  const [imageAlt, setImageAlt] = useState('Project Preview')
  const [imageCaption, setImageCaption] = useState('')
  const [frameStyle, setFrameStyle] = useState('clean')
  const [browserUrl, setBrowserUrl] = useState('https://readme-studio.dev')
  const [terminalCommand, setTerminalCommand] = useState('$ npm run start')
  const [imageAlign, setImageAlign] = useState('center')
  const [imageWidth, setImageWidth] = useState('800')

  // 3. Theme Adaptive State (Light & Dark Pair)
  const [darkThemeUrl, setDarkThemeUrl] = useState('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80')
  const [lightThemeUrl, setLightThemeUrl] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80')
  const [adaptiveAlt, setAdaptiveAlt] = useState('Project Theme Preview')
  const [adaptiveFormat, setAdaptiveFormat] = useState('gh-hash')
  const [previewThemeMode, setPreviewThemeMode] = useState('dark')

  // 4. Upload & Screenshot State
  const [uploadedDataUrl, setUploadedDataUrl] = useState('')
  const [uploadMeta, setUploadMeta] = useState(null)
  const [uploadAlt, setUploadAlt] = useState('Application Screenshot')
  const [uploadSyntaxChoice, setUploadSyntaxChoice] = useState('relative')
  const [uploadRelativePath, setUploadRelativePath] = useState('assets/screenshot.webp')
  const [isDragging, setIsDragging] = useState(false)

  // 5. Comparison State
  const [compTitle1, setCompTitle1] = useState('Light Mode')
  const [compUrl1, setCompUrl1] = useState('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80')
  const [compTitle2, setCompTitle2] = useState('Dark Mode')
  const [compUrl2, setCompUrl2] = useState('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80')

  const API_BASE_URL = import.meta.env.VITE_API_URL || ''

  // Auto-resolve indirect links whenever imageUrl changes
  useEffect(() => {
    if (!imageUrl.trim()) {
      setResolvedUrl('')
      setResolveNote('')
      return
    }

    const optimized = getOptimizedImageUrl(imageUrl)
    if (optimized !== imageUrl) {
      setResolvedUrl(optimized)
      setResolveNote('⚡ Auto-converted into direct asset URL')
      return
    }

    if (requiresAsyncResolution(imageUrl)) {
      setIsResolving(true)
      setResolveNote('Resolving redirect link via backend...')
      resolveRedirectImageUrl(imageUrl, API_BASE_URL).then((res) => {
        setIsResolving(false)
        if (res && res !== imageUrl) {
          setResolvedUrl(res)
          setResolveNote('✓ Successfully resolved to direct image')
        } else {
          setResolvedUrl(imageUrl)
          setResolveNote('Direct link')
        }
      })
    } else {
      setResolvedUrl(imageUrl)
      setResolveNote('')
    }
  }, [imageUrl, API_BASE_URL])

  // Canvas Image Compressor
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const rawData = e.target.result
        const img = new Image()
        img.onload = () => {
          const maxDim = 1280
          let { width, height } = img
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width)
              width = maxDim
            } else {
              width = Math.round((width * maxDim) / height)
              height = maxDim
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          let compressedData = canvas.toDataURL('image/webp', 0.85)
          if (!compressedData.startsWith('data:image/webp')) {
            compressedData = canvas.toDataURL('image/jpeg', 0.85)
          }

          const origKb = (file.size / 1024).toFixed(1)
          const compBytes = Math.round((compressedData.length * 3) / 4)
          const compKb = (compBytes / 1024).toFixed(1)
          const savings = Math.max(0, Math.round(((file.size - compBytes) / file.size) * 100))

          resolve({
            compressedData,
            meta: {
              name: file.name.replace(/\.[^/.]+$/, '') + '.webp',
              origKb,
              compKb,
              savings,
              width,
              height
            }
          })
        }
        img.src = rawData
      }
      reader.readAsDataURL(file)
    })
  }

  // Handle Drag & Drop / File Upload with Auto-Compression
  const handleFileUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const { compressedData, meta } = await compressImage(file)
    setUploadedDataUrl(compressedData)
    setUploadMeta(meta)
    setUploadRelativePath(`assets/${meta.name}`)
  }

  const handlePaste = (e) => {
    if (e.clipboardData && e.clipboardData.items) {
      for (const item of e.clipboardData.items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) handleFileUpload(file)
          break
        }
      }
    }
  }

  // Toggle tech tag in rack
  const handleToggleTechTag = (tech) => {
    const tagsArr = bannerTags.split(',').map((t) => t.trim()).filter(Boolean)
    const exists = tagsArr.some((t) => t.toLowerCase() === tech.toLowerCase())
    if (exists) {
      setBannerTags(tagsArr.filter((t) => t.toLowerCase() !== tech.toLowerCase()).join(', '))
    } else {
      setBannerTags([...tagsArr, tech].join(', '))
    }
  }

  // Capsule render URL generator
  const getCapsuleUrl = () => {
    const textParam = encodeURIComponent(bannerTitle.trim() || 'Project')
    const descParam = encodeURIComponent(bannerSubtitle.trim())
    const hex1 = (bannerTheme.hex1 || '#6366f1').replace('#', '')
    const hex2 = (bannerTheme.hex2 || '#38bdf8').replace('#', '')
    return `https://capsule-render.vercel.app/api?type=${capsuleShape}&color=0:${hex1},100:${hex2}&height=${bannerHeight}&section=header&text=${textParam}&fontSize=40&fontAlignY=38${descParam ? `&desc=${descParam}&descAlignY=62` : ''}`
  }

  // Typing SVG URL generator
  const getTypingUrl = () => {
    const formattedLines = typingLines
      .split(';')
      .map((l) => l.trim())
      .filter(Boolean)
      .join(';')
    const encoded = encodeURIComponent(formattedLines)
    return `https://readme-typing-svg.demolab.com?font=${encodeURIComponent(typingFont)}&pause=${typingPause}&color=${typingColor}&center=true&vCenter=true&width=650&lines=${encoded}`
  }

  // GitHub Pin Card URL generator
  const getGithubPinUrl = () => {
    return `https://github-readme-stats.vercel.app/api/pin/?username=${encodeURIComponent(githubRepoOwner)}&repo=${encodeURIComponent(githubRepoName)}&theme=${githubStatsTheme}&show_owner=true`
  }

  const currentSvgParams = {
    bannerTitle,
    bannerSubtitle,
    hudStatus,
    hudVersion,
    bannerTags,
    bannerTheme,
    neofetchOs,
    neofetchLicense
  }

  const currentActiveSvgCode = () => getActiveSvgCode(bannerType, currentSvgParams)

  // Generate standard RFC 2397 Data URI with charset=utf-8
  const getActiveSvgDataUri = () => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(currentActiveSvgCode())}`
  }

  // Generate badge chips markdown for tags
  const getBadgeChipsMarkdown = () => {
    const tags = bannerTags.split(',').map((t) => t.trim()).filter(Boolean)
    if (tags.length === 0) return ''
    const badges = tags.map((t) => {
      const clean = encodeURIComponent(t)
      return `<img src="https://img.shields.io/badge/${clean}-21262d?style=flat-square&logoColor=white" alt="${t}" />`
    })
    return `<p align="center">\n  ${badges.join('\n  ')}\n</p>`
  }

  // Export asset (PNG/SVG/WebP) directly
  const handleDownloadAsset = async () => {
    try {
      const isLocalSvg = LOCAL_SVG_TYPES.includes(bannerType)
      if (activeMode === 'banner' && isLocalSvg) {
        const svgCode = currentActiveSvgCode()
        const safeName = bannerTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'hero'
        const fileName = `${safeName}-${bannerType}.svg`
        if (typeof window !== 'undefined' && window.electronAPI?.saveTextExportDialog) {
          await window.electronAPI.saveTextExportDialog({
            defaultPath: fileName,
            filters: [{ name: 'SVG Image', extensions: ['svg'] }, { name: 'All Files', extensions: ['*'] }],
            content: svgCode
          })
          return
        }
        const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' })
        saveAs(blob, fileName)
        return
      }

      if (activeMode === 'upload' && uploadedDataUrl) {
        const fileName = uploadMeta?.name || 'screenshot.webp'
        if (typeof window !== 'undefined' && window.electronAPI?.saveBinaryDialog && uploadedDataUrl.includes(',')) {
          const base64Data = uploadedDataUrl.split(',')[1]
          await window.electronAPI.saveBinaryDialog({
            defaultPath: fileName,
            filters: [{ name: 'Image', extensions: ['webp', 'png', 'jpg'] }, { name: 'All Files', extensions: ['*'] }],
            base64Data
          })
          return
        }
        const res = await fetch(uploadedDataUrl)
        const blob = await res.blob()
        saveAs(blob, fileName)
        return
      }

      const targetUrl =
        activeMode === 'banner' && bannerType === 'capsule'
          ? getCapsuleUrl()
          : activeMode === 'banner' && bannerType === 'typing'
          ? getTypingUrl()
          : activeMode === 'banner' && bannerType === 'github-stats'
          ? getGithubPinUrl()
          : activeMode === 'banner' && bannerType === 'cover'
          ? bannerTheme.coverUrl
          : resolvedUrl || imageUrl

      if (targetUrl) {
        const res = await fetch(targetUrl)
        if (res.ok) {
          const blob = await res.blob()
          const ext = blob.type.includes('svg') ? 'svg' : 'png'
          const defaultName = `${bannerTitle.toLowerCase().replace(/\s+/g, '-')}-asset.${ext}`
          if (typeof window !== 'undefined' && window.electronAPI?.saveBinaryDialog) {
            const buffer = await blob.arrayBuffer()
            const bytes = new Uint8Array(buffer)
            let binary = ''
            for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
            const base64Data = window.btoa(binary)
            await window.electronAPI.saveBinaryDialog({
              defaultPath: defaultName,
              filters: [{ name: 'Image Asset', extensions: [ext] }, { name: 'All Files', extensions: ['*'] }],
              base64Data
            })
            return
          }
          saveAs(blob, defaultName)
        } else {
          if (window.electronAPI?.openExternalUrl) {
            window.electronAPI.openExternalUrl(targetUrl)
          } else {
            window.open(targetUrl, '_blank')
          }
        }
      }
    } catch {
      const fallbackUrl =
        activeMode === 'banner' && bannerType === 'capsule'
          ? getCapsuleUrl()
          : activeMode === 'banner' && bannerType === 'typing'
          ? getTypingUrl()
          : resolvedUrl || imageUrl
      if (fallbackUrl) {
        if (window.electronAPI?.openExternalUrl) {
          window.electronAPI.openExternalUrl(fallbackUrl)
        } else {
          window.open(fallbackUrl, '_blank')
        }
      }
    }
  }

  // Helper to generate framed markdown syntax - 100% GitHub-compatible without stripped CSS
  const generateFramedMarkdown = (rawTargetSrc, altText) => {
    const targetSrc = getOptimizedImageUrl(rawTargetSrc)
    const widthAttr = imageWidth ? ` width="${imageWidth}"` : ''
    const safeAlt = escapeXml(altText || 'Project Image')

    if (frameStyle === 'mac-window') {
      return `<div align="${imageAlign}">
  <p><sub><strong>🔴 🟡 🟢 &nbsp; ${safeAlt}</strong></sub></p>
  <img src="${targetSrc}" alt="${safeAlt}"${widthAttr} />${imageCaption ? `\n  <p><em>${escapeXml(imageCaption)}</em></p>` : ''}
</div>`
    }

    if (frameStyle === 'browser-bar') {
      const safeUrl = escapeXml(browserUrl || 'https://my-app.dev')
      return `<div align="${imageAlign}">
  <p><sub>🔒 <code>${safeUrl}</code></sub></p>
  <img src="${targetSrc}" alt="${safeAlt}"${widthAttr} />${imageCaption ? `\n  <p><em>${escapeXml(imageCaption)}</em></p>` : ''}
</div>`
    }

    if (frameStyle === 'terminal') {
      const cleanCmd = escapeXml(terminalCommand.replace(/^\$\s*/, '') || 'npm run dev')
      return `<div align="${imageAlign}">
  <p><code>$ ${cleanCmd}</code></p>
  <img src="${targetSrc}" alt="${safeAlt}"${widthAttr} />${imageCaption ? `\n  <p><em>${escapeXml(imageCaption)}</em></p>` : ''}
</div>`
    }

    if (frameStyle === 'mobile') {
      return `<div align="${imageAlign}">
  <p><sub>📱 <em>${safeAlt}</em></sub></p>
  <img src="${targetSrc}" alt="${safeAlt}"${widthAttr} />${imageCaption ? `\n  <p><em>${escapeXml(imageCaption)}</em></p>` : ''}
</div>`
    }

    if (frameStyle === 'rounded-card') {
      return `<div align="${imageAlign}">
  <img src="${targetSrc}" alt="${safeAlt}"${widthAttr} />${imageCaption ? `\n  <p><em>${escapeXml(imageCaption)}</em></p>` : ''}
</div>`
    }

    // Clean Borderless (Default)
    if (imageAlign === 'center') {
      return `<p align="center">\n  <img src="${targetSrc}" alt="${safeAlt}"${widthAttr} />${imageCaption ? `\n  <br/>\n  <em>${escapeXml(imageCaption)}</em>` : ''}\n</p>`
    }
    return `![${safeAlt}](${targetSrc})`
  }

  // Compute final Markdown Snippet based on active mode
  const getGeneratedMarkdown = () => {
    if (activeMode === 'banner') {
      if (LOCAL_SVG_TYPES.includes(bannerType)) {
        const safeName = bannerTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'hero'
        const fileName = `${safeName}-${bannerType}.svg`
        if (bannerSyntaxMode === 'asset-path') {
          return `<p align="center">\n  <img src="assets/${fileName}" alt="${bannerTitle} Banner" width="100%" />\n</p>`
        }
        const svgUri = getActiveSvgDataUri()
        return `<p align="center">\n  <img src="${svgUri}" alt="${bannerTitle} Banner" width="100%" />\n</p>`
      }

      if (bannerType === 'github-stats') {
        const pinUrl = getGithubPinUrl()
        const chipsMd = getBadgeChipsMarkdown()
        return `<p align="center">\n  <a href="https://github.com/${githubRepoOwner}/${githubRepoName}">\n    <img src="${pinUrl}" alt="${githubRepoName} GitHub Stats" />\n  </a>\n</p>${chipsMd ? `\n\n${chipsMd}` : ''}`
      }

      if (bannerType === 'capsule') {
        const capsuleUrl = getCapsuleUrl()
        const chipsMd = getBadgeChipsMarkdown()
        return `<p align="center">\n  <img src="${capsuleUrl}" alt="${bannerTitle} Banner" width="100%" />\n</p>${chipsMd ? `\n\n${chipsMd}` : ''}`
      }

      if (bannerType === 'typing') {
        const typingUrl = getTypingUrl()
        const chipsMd = getBadgeChipsMarkdown()
        return `<p align="center">\n  <img src="${typingUrl}" alt="${bannerTitle} Typing" />\n</p>${chipsMd ? `\n\n${chipsMd}` : ''}`
      }

      if (bannerType === 'cover') {
        const chipsMd = getBadgeChipsMarkdown()
        return `<p align="center">\n  <img src="${bannerTheme.coverUrl}" alt="${bannerTitle} Cover" width="100%" />\n</p>${chipsMd ? `\n\n${chipsMd}` : ''}`
      }
    }

    if (activeMode === 'link') {
      const rawSrc = resolvedUrl || imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
      const targetSrc = getOptimizedImageUrl(rawSrc)
      return generateFramedMarkdown(targetSrc, imageAlt)
    }

    if (activeMode === 'adaptive') {
      const widthAttr = imageWidth ? ` width="${imageWidth}"` : ''
      const safeDark = getOptimizedImageUrl(darkThemeUrl)
      const safeLight = getOptimizedImageUrl(lightThemeUrl)
      if (adaptiveFormat === 'picture') {
        return `<p align="${imageAlign}">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${safeDark}">
    <source media="(prefers-color-scheme: light)" srcset="${safeLight}">
    <img alt="${adaptiveAlt}" src="${safeLight}"${widthAttr} />
  </picture>
</p>`
      }

      return `<p align="${imageAlign}">
  <img src="${safeDark}#gh-dark-mode-only" alt="${adaptiveAlt} (Dark Mode)"${widthAttr} />
  <img src="${safeLight}#gh-light-mode-only" alt="${adaptiveAlt} (Light Mode)"${widthAttr} />
</p>`
    }

    if (activeMode === 'upload') {
      if (!uploadedDataUrl) return `![${uploadAlt}](https://via.placeholder.com/800x400?text=Paste+or+Drop+Screenshot)`

      const targetSrc = uploadSyntaxChoice === 'relative' ? uploadRelativePath : uploadedDataUrl.replace(/[\r\n\t]/g, '')
      return generateFramedMarkdown(targetSrc, uploadAlt)
    }

    if (activeMode === 'comparison') {
      const src1 = getOptimizedImageUrl(compUrl1)
      const src2 = getOptimizedImageUrl(compUrl2)
      return `| ${compTitle1} | ${compTitle2} |
| :---: | :---: |
| <img src="${src1}" alt="${compTitle1}" width="400" /> | <img src="${src2}" alt="${compTitle2}" width="400" /> |`
    }

    return ''
  }

  const markdownSnippet = getGeneratedMarkdown()

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInsert = () => {
    onInsertImage(markdownSnippet)
  }

  return (
    <div className="studio-tab-view select-none" onPaste={handlePaste}>
      {/* Studio Top Control Strip */}
      <div className="studio-top-bar">
        <div className="studio-bar-left">
          <div className="studio-badge-halo">
            <span className="material-symbols-outlined text-secondary" style={{ color: '#818cf8' }}>image</span>
          </div>
          <div>
            <div className="studio-title-row">
              <h2 className="studio-title">Image & Banner Studio</h2>
              <span className="studio-tag" style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#38bdf8' }}>Visual Assets Pro</span>
            </div>
            <p className="studio-subtitle">
              Stitch HUD telemetry, Neofetch terminal, Swiss grids, device mockups, and screenshot compression.
            </p>
          </div>
        </div>

        <div className="studio-bar-actions">
          {onBackToReadme && (
            <button
              type="button"
              className="btn-studio-secondary"
              onClick={onBackToReadme}
              title="Return to active markdown document"
            >
              <span className="material-symbols-outlined icon-xs">arrow_back</span>
              <span>Back to Editor</span>
            </button>
          )}
          <button
            type="button"
            className="btn-studio-secondary"
            onClick={handleDownloadAsset}
            title="Download active graphic as standalone file"
          >
            <span className="material-symbols-outlined icon-xs">download</span>
            <span>Download Asset</span>
          </button>
          <button
            type="button"
            className="btn-studio-secondary"
            onClick={handleCopy}
            title="Copy snippet to clipboard"
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
            title="Insert rendered image into an open document"
          >
            <span className="material-symbols-outlined icon-xs">add_circle</span>
            <span>Insert into Document</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body: 2-Column Responsive Layout */}
      <div className="studio-content-grid">
        {/* Left Column: Form Controls */}
        <div
          className="studio-form-column custom-scrollbar"
          style={{ width: `${formWidth}px`, minWidth: `${formWidth}px`, maxWidth: `${formWidth}px`, flex: 'none' }}
        >
          {/* Sub-Mode Selector */}
          <div className="studio-section">
            <label className="studio-section-label">Studio Mode</label>
            <div className="studio-category-tabs">
              {STUDIO_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`studio-category-tab ${activeMode === mode.id ? 'active' : ''}`}
                  onClick={() => setActiveMode(mode.id)}
                >
                  <span className="material-symbols-outlined icon-xs">{mode.icon}</span>
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 1. HERO BANNER MODE */}
          {activeMode === 'banner' && (
            <HeroBannerForm
              bannerType={bannerType}
              setBannerType={setBannerType}
              bannerSyntaxMode={bannerSyntaxMode}
              setBannerSyntaxMode={setBannerSyntaxMode}
              bannerTitle={bannerTitle}
              setBannerTitle={setBannerTitle}
              bannerSubtitle={bannerSubtitle}
              setBannerSubtitle={setBannerSubtitle}
              bannerTheme={bannerTheme}
              setBannerTheme={setBannerTheme}
              bannerTags={bannerTags}
              setBannerTags={setBannerTags}
              handleToggleTechTag={handleToggleTechTag}
              hudVersion={hudVersion}
              setHudVersion={setHudVersion}
              hudStatus={hudStatus}
              setHudStatus={setHudStatus}
              neofetchOs={neofetchOs}
              setNeofetchOs={setNeofetchOs}
              neofetchLicense={neofetchLicense}
              setNeofetchLicense={setNeofetchLicense}
              githubRepoOwner={githubRepoOwner}
              setGithubRepoOwner={setGithubRepoOwner}
              githubRepoName={githubRepoName}
              setGithubRepoName={setGithubRepoName}
              githubStatsTheme={githubStatsTheme}
              setGithubStatsTheme={setGithubStatsTheme}
              typingLines={typingLines}
              setTypingLines={setTypingLines}
              typingFont={typingFont}
              setTypingFont={setTypingFont}
              typingPause={typingPause}
              setTypingPause={setTypingPause}
              typingColor={typingColor}
              setTypingColor={setTypingColor}
              capsuleShape={capsuleShape}
              setCapsuleShape={setCapsuleShape}
              bannerHeight={bannerHeight}
              setBannerHeight={setBannerHeight}
              handleDownloadAsset={handleDownloadAsset}
            />
          )}

          {/* 2 & 3. DEVICE MOCKUP FRAMES (LINK & UPLOAD MODES) */}
          {(activeMode === 'link' || activeMode === 'upload') && (
            <VisualMockupForm
              activeMode={activeMode}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              resolveNote={resolveNote}
              isResolving={isResolving}
              imageAlt={imageAlt}
              setImageAlt={setImageAlt}
              imageCaption={imageCaption}
              setImageCaption={setImageCaption}
              frameStyle={frameStyle}
              setFrameStyle={setFrameStyle}
              browserUrl={browserUrl}
              setBrowserUrl={setBrowserUrl}
              terminalCommand={terminalCommand}
              setTerminalCommand={setTerminalCommand}
              imageAlign={imageAlign}
              setImageAlign={setImageAlign}
              imageWidth={imageWidth}
              setImageWidth={setImageWidth}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              handleFileUpload={handleFileUpload}
              uploadMeta={uploadMeta}
              uploadAlt={uploadAlt}
              setUploadAlt={setUploadAlt}
              uploadSyntaxChoice={uploadSyntaxChoice}
              setUploadSyntaxChoice={setUploadSyntaxChoice}
              uploadRelativePath={uploadRelativePath}
              setUploadRelativePath={setUploadRelativePath}
              uploadedDataUrl={uploadedDataUrl}
              handleDownloadAsset={handleDownloadAsset}
            />
          )}

          {/* 4. THEME ADAPTIVE MODE (LIGHT & DARK PAIR) */}
          {activeMode === 'adaptive' && (
            <AdaptiveThemeForm
              darkThemeUrl={darkThemeUrl}
              setDarkThemeUrl={setDarkThemeUrl}
              lightThemeUrl={lightThemeUrl}
              setLightThemeUrl={setLightThemeUrl}
              adaptiveAlt={adaptiveAlt}
              setAdaptiveAlt={setAdaptiveAlt}
              adaptiveFormat={adaptiveFormat}
              setAdaptiveFormat={setAdaptiveFormat}
              imageAlign={imageAlign}
              setImageAlign={setImageAlign}
              imageWidth={imageWidth}
              setImageWidth={setImageWidth}
            />
          )}

          {/* 5. COMPARISON MODE */}
          {activeMode === 'comparison' && (
            <ComparisonForm
              compTitle1={compTitle1}
              setCompTitle1={setCompTitle1}
              compUrl1={compUrl1}
              setCompUrl1={setCompUrl1}
              compTitle2={compTitle2}
              setCompTitle2={setCompTitle2}
              compUrl2={compUrl2}
              setCompUrl2={setCompUrl2}
            />
          )}
        </div>

        {/* Resizer Splitter Handle */}
        <div
          className={`studio-resizer-handle ${isSplitDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title="Drag to resize form and preview sections • Double-click to reset"
        />

        {/* Right Column: Visual Render & Syntax */}
        <ImageStudioLivePreview
          activeMode={activeMode}
          bannerType={bannerType}
          bannerTitle={bannerTitle}
          bannerSubtitle={bannerSubtitle}
          hudStatus={hudStatus}
          hudVersion={hudVersion}
          bannerTags={bannerTags}
          bannerTheme={bannerTheme}
          neofetchOs={neofetchOs}
          neofetchLicense={neofetchLicense}
          githubRepoName={githubRepoName}
          getGithubPinUrl={getGithubPinUrl}
          getCapsuleUrl={getCapsuleUrl}
          getTypingUrl={getTypingUrl}
          typingError={typingError}
          setTypingError={setTypingError}
          typingColor={typingColor}
          typingFont={typingFont}
          typingLines={typingLines}
          resolvedUrl={resolvedUrl}
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          imageAlign={imageAlign}
          imageWidth={imageWidth}
          imageCaption={imageCaption}
          frameStyle={frameStyle}
          browserUrl={browserUrl}
          terminalCommand={terminalCommand}
          previewThemeMode={previewThemeMode}
          setPreviewThemeMode={setPreviewThemeMode}
          darkThemeUrl={darkThemeUrl}
          lightThemeUrl={lightThemeUrl}
          adaptiveAlt={adaptiveAlt}
          uploadedDataUrl={uploadedDataUrl}
          uploadAlt={uploadAlt}
          compTitle1={compTitle1}
          compUrl1={compUrl1}
          compTitle2={compTitle2}
          compUrl2={compUrl2}
          markdownSnippet={markdownSnippet}
          copied={copied}
          handleCopy={handleCopy}
        />
      </div>
    </div>
  )
}
