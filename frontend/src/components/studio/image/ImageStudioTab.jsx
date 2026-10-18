import React, { useState, useEffect } from 'react'
import { saveAs } from 'file-saver'
import { getOptimizedImageUrl, requiresAsyncResolution, resolveRedirectImageUrl } from '../../../utils/imageUtils'
import StudioShell from '../common/StudioShell'
import {
  STUDIO_MODES,
  LOCAL_SVG_TYPES,
  COLOR_THEMES,
  escapeXml
} from './imageStudioConstants'
import { getActiveSvgCode } from './svgBannerGenerators'
import HeroBannerForm from './HeroBannerForm'
import MotionHeroForm from './MotionHeroForm'
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
  const [isCustomColor, setIsCustomColor] = useState(false)
  const [customHex1, setCustomHex1] = useState('#4f46e5')
  const [customHex2, setCustomHex2] = useState('#db2777')
  const [capsuleFontColor, setCapsuleFontColor] = useState('ffffff')
  const [capsuleDescColor, setCapsuleDescColor] = useState('e0e7ff')
  const [capsuleAnimation, setCapsuleAnimation] = useState('fadeIn')
  const [capsuleTitleSize, setCapsuleTitleSize] = useState('70')
  const [capsuleDescSize, setCapsuleDescSize] = useState('20')
  const [capsuleFontAlignY, setCapsuleFontAlignY] = useState('38')
  const [capsuleDescAlignY, setCapsuleDescAlignY] = useState('60')
  const [capsuleStroke, setCapsuleStroke] = useState('none')
  const [bannerHeight, setBannerHeight] = useState('220')

  // Stitch HUD Telemetry Specific State
  const [hudVersion, setHudVersion] = useState('v2.4.0')
  const [hudStatus, setHudStatus] = useState('SYSTEM NOMINAL')
  const [hudMetric1, setHudMetric1] = useState('CPU: 12% // 4.8GHz')
  const [hudMetric2, setHudMetric2] = useState('MEM: 1.4GB / 32GB')
  const [hudMetric3, setHudMetric3] = useState('STATUS: ENCLAVE_SECURE')

  // Neofetch Specific State
  const [neofetchOs, setNeofetchOs] = useState('GitHub / Linux x86_64')
  const [neofetchLicense, setNeofetchLicense] = useState('MIT License')
  const [neofetchPrompt, setNeofetchPrompt] = useState('user@visualmark:~#')
  const [neofetchShell, setNeofetchShell] = useState('zsh 5.9 (x86_64)')

  // Motion & Video / GIF State
  const [motionUrl, setMotionUrl] = useState('https://raw.githubusercontent.com/charmbracelet/vhs/main/examples/demo.gif')
  const [motionType, setMotionType] = useState('gif')
  const [motionFrameStyle, setMotionFrameStyle] = useState('mac-window')
  const [motionTitle, setMotionTitle] = useState('VisualMark Studio - Live Demo')
  const [motionCaption, setMotionCaption] = useState('Interactive developer workflow demonstration')
  const [motionAlign, setMotionAlign] = useState('center')
  const [motionWidth, setMotionWidth] = useState('100%')
  const [motionAutoplay, setMotionAutoplay] = useState(true)
  const [motionLoop, setMotionLoop] = useState(true)
  const [motionMuted, setMotionMuted] = useState(true)
  const [motionControls, setMotionControls] = useState(false)
  const [motionGlow, setMotionGlow] = useState('deep')
  const [motionBrowserUrl, setMotionBrowserUrl] = useState('https://visualmark.dev/demo')


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
  const [macWindowTitle, setMacWindowTitle] = useState('VisualMark Studio')
  const [mockupGlow, setMockupGlow] = useState('soft')

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
    const suggestedPath = `assets/${meta.name}`
    setUploadRelativePath(suggestedPath)
  }

  // Native Clipboard Paste Handler
  const handlePaste = async (e) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) {
          setActiveMode('upload')
          await handleFileUpload(file)
          break
        }
      }
    }
  }



  // Compute live Capsule Render URL
  const getCapsuleUrl = () => {
    const params = new URLSearchParams()
    params.set('type', capsuleShape)

    if (isCustomColor) {
      const h1 = (customHex1 || '#4f46e5').replace('#', '')
      const h2 = (customHex2 || '#db2777').replace('#', '')
      params.set('color', `0:${h1},100:${h2}`)
    } else {
      params.set('color', bannerTheme?.colorParam || bannerTheme?.capsuleList || '0:4f46e5,100:db2777')
    }

    params.set('height', bannerHeight || '220')
    params.set('section', 'header')
    params.set('text', bannerTitle || 'Project Title')
    if (bannerSubtitle.trim()) {
      params.set('desc', bannerSubtitle.trim())
    }

    params.set('fontSize', capsuleTitleSize || '70')
    params.set('fontColor', (capsuleFontColor || 'ffffff').replace('#', ''))
    params.set('fontAlignY', capsuleFontAlignY || '38')

    if (bannerSubtitle.trim()) {
      params.set('descSize', capsuleDescSize || '20')
      params.set('descColor', (capsuleDescColor || 'e0e7ff').replace('#', ''))
      params.set('descAlignY', capsuleDescAlignY || '60')
    }

    if (capsuleAnimation && capsuleAnimation !== 'none') {
      params.set('animation', capsuleAnimation)
    }

    if (capsuleStroke && capsuleStroke !== 'none') {
      params.set('stroke', capsuleStroke.replace('#', ''))
      params.set('strokeWidth', '2')
    }

    return `https://capsule-render.vercel.app/api?${params.toString()}`
  }


  // Compute live Typing SVG URL
  const getTypingUrl = () => {
    const params = new URLSearchParams()
    params.set('font', typingFont)
    params.set('color', typingColor.replace('#', ''))
    params.set('size', '28')
    params.set('pause', typingPause)
    params.set('lines', typingLines)
    params.set('center', 'true')
    params.set('width', '800')
    params.set('height', '100')
    params.set('vCenter', 'true')
    return `https://readme-typing-svg.demolab.com?${params.toString()}`
  }




  // Download active graphic as standalone file
  const handleDownloadAsset = async () => {
    if (activeMode === 'banner') {
      if (LOCAL_SVG_TYPES.includes(bannerType) || bannerType === 'capsule') {
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

        const svgCode = getActiveSvgCode({
          bannerType,
          bannerTitle,
          bannerSubtitle,
          capsuleShape,
          hudStatus,
          hudVersion,
          hudMetric1,
          hudMetric2,
          hudMetric3,
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
          capsuleAnimation,
          neofetchOs,
          neofetchLicense,
          neofetchPrompt,
          neofetchShell
        })
        const fileName = `${(bannerTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'hero')}-${bannerType}-banner.svg`

        if (typeof window !== 'undefined' && window.electronAPI?.saveTextExportDialog) {
          await window.electronAPI.saveTextExportDialog({
            defaultPath: fileName,
            filters: [{ name: 'SVG Vector Image', extensions: ['svg'] }, { name: 'All Files', extensions: ['*'] }],
            content: svgCode
          })
          return
        }
        const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' })
        saveAs(blob, fileName)
      }
    } else if (activeMode === 'upload' && uploadedDataUrl) {
      const fileName = uploadMeta?.name || 'screenshot.webp'
      if (typeof window !== 'undefined' && window.electronAPI?.saveBinaryDialog) {
        const base64Data = uploadedDataUrl.split(',')[1]
        await window.electronAPI.saveBinaryDialog({
          defaultPath: fileName,
          filters: [{ name: 'WebP Image', extensions: ['webp'] }, { name: 'All Files', extensions: ['*'] }],
          base64Data
        })
        return
      }
      const byteString = atob(uploadedDataUrl.split(',')[1])
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: 'image/webp' })
      saveAs(blob, fileName)
    }
  }

  // Generate Framed Markdown snippet for device mockups
  const generateFramedMarkdown = (src, alt) => {
    const widthAttr = imageWidth ? ` width="${imageWidth}"` : ''
    const captionHtml = imageCaption.trim()
      ? `\n  <br/>\n  <sub align="center"><em>${escapeXml(imageCaption.trim())}</em></sub>`
      : ''

    if (frameStyle === 'mac-window') {
      const windowTitleText = macWindowTitle ? ` &nbsp; ${escapeXml(macWindowTitle)}` : ''
      return `<div align="${imageAlign}">
  <table border="0" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th bgcolor="#161b22" align="left" style="padding: 7px 12px; border-radius: 6px 6px 0 0; color: #8b949e; font-family: -apple-system,BlinkMacSystemFont,monospace; font-size: 11px;">
          <span style="color: #ef4444;">●</span> <span style="color: #eab308;">●</span> <span style="color: #22c55e;">●</span>${windowTitleText}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td bgcolor="#0d1117" align="center" style="padding: 0; border-radius: 0 0 6px 6px;">
          <img src="${src}" alt="${escapeXml(alt)}"${widthAttr} />
        </td>
      </tr>
    </tbody>
  </table>${captionHtml}
</div>`
    }


    if (frameStyle === 'browser-bar') {
      return `<div align="${imageAlign}">
  <table border="0" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th bgcolor="#1e293b" align="center" style="padding: 8px 12px; border-radius: 6px 6px 0 0; color: #94a3b8; font-family: monospace; font-size: 11px;">
          🔒 ${escapeXml(browserUrl)}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td bgcolor="#0f172a" align="center" style="padding: 0; border-radius: 0 0 6px 6px;">
          <img src="${src}" alt="${escapeXml(alt)}"${widthAttr} />
        </td>
      </tr>
    </tbody>
  </table>${captionHtml}
</div>`
    }

    if (frameStyle === 'terminal') {
      return `<div align="${imageAlign}">
  <table border="0" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th bgcolor="#000000" align="left" style="padding: 6px 12px; border-radius: 6px 6px 0 0; color: #10b981; font-family: monospace; font-size: 11px;">
          ${escapeXml(terminalCommand)}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td bgcolor="#000000" align="center" style="padding: 0; border-radius: 0 0 6px 6px;">
          <img src="${src}" alt="${escapeXml(alt)}"${widthAttr} />
        </td>
      </tr>
    </tbody>
  </table>${captionHtml}
</div>`
    }

    return `<p align="${imageAlign}">\n  <img src="${src}" alt="${escapeXml(alt)}"${widthAttr} />${captionHtml}\n</p>`
  }

  // Master Generated Markdown Snippet
  const getGeneratedMarkdown = () => {
    if (activeMode === 'banner') {
      if (LOCAL_SVG_TYPES.includes(bannerType)) {
        if (bannerSyntaxMode === 'asset-path') {
          return `<div align="center">\n  <img src="assets/${bannerType}-banner.svg" alt="${bannerTitle} Banner" width="100%" />\n</div>`
        }
        const svgCode = getActiveSvgCode({
          bannerType,
          bannerTitle,
          bannerSubtitle,
          hudStatus,
          hudVersion,
          bannerTheme,
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
        })
        return `<!-- Save as assets/${bannerType}-banner.svg -->\n${svgCode}`
      }

      if (bannerType === 'capsule') {
        const capsuleUrl = getCapsuleUrl()
        return `<div align="center">\n  <img src="${capsuleUrl}" alt="${bannerTitle} Header" width="100%" />\n</div>`
      }

      if (bannerType === 'typing') {
        const typingUrl = getTypingUrl()
        return `<p align="center">\n  <img src="${typingUrl}" alt="${bannerTitle} Typing" />\n</p>`
      }

      if (bannerType === 'cover') {
        return `<p align="center">\n  <img src="${bannerTheme.coverUrl}" alt="${bannerTitle} Cover" width="100%" />\n</p>`
      }
    }

    if (activeMode === 'motion') {
      const targetSrc = motionUrl || 'assets/demo.mp4'
      const widthAttr = motionWidth === '100%' ? 'width="100%"' : `width="${motionWidth}"`
      const captionSub = motionCaption ? `\n  <br/>\n  <sub><em>${motionCaption}</em></sub>` : ''

      if (motionType === 'video') {
        const autoplayAttr = motionAutoplay ? 'autoplay ' : ''
        const loopAttr = motionLoop ? 'loop ' : ''
        const mutedAttr = motionMuted ? 'muted ' : ''
        const controlsAttr = motionControls ? 'controls ' : ''

        return `<div align="${motionAlign}">
  <video ${autoplayAttr}${loopAttr}${mutedAttr}${controlsAttr}playsinline ${widthAttr}>
    <source src="${targetSrc}" type="video/mp4">
    Your browser does not support the video tag.
  </video>${captionSub}
</div>`
      }

      if (motionFrameStyle === 'mac-window') {
        return `<div align="${motionAlign}">
  <table border="0" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th bgcolor="#161b22" align="left" style="padding: 6px 12px; border-radius: 6px 6px 0 0; color: #8b949e; font-family: monospace; font-size: 11px;">
          <span style="color: #ef4444;">●</span> <span style="color: #eab308;">●</span> <span style="color: #22c55e;">●</span> &nbsp; ${escapeXml(motionTitle || 'Demo')}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td bgcolor="#000000" align="center" style="padding: 0; border-radius: 0 0 6px 6px;">
          <img src="${targetSrc}" alt="${escapeXml(motionTitle || 'Demo')}" ${widthAttr} />
        </td>
      </tr>
    </tbody>
  </table>${captionSub}
</div>`
      }

      return `<div align="${motionAlign}">
  <img src="${targetSrc}" alt="${escapeXml(motionTitle || 'Demo')}" ${widthAttr} />${captionSub}
</div>`
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

  const handleInsert = () => {
    if (typeof onInsertImage === 'function') {
      onInsertImage(markdownSnippet)
    }
  }

  // Download asset action button in top header
  const extraHeaderActions = (
    <button
      type="button"
      className="studio-shell-btn studio-shell-btn-secondary"
      onClick={handleDownloadAsset}
      title="Download active graphic as standalone file"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
      <span>Download</span>
    </button>
  )

  // Status tag in canvas header
  const canvasHeaderExtras = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="canvas-header-divider" />
      <span className="canvas-mode-tag">
        {activeMode.toUpperCase()}{activeMode === 'banner' ? ` • ${bannerType.toUpperCase()}` : ''}
      </span>
    </div>
  )

  return (
    <div onPaste={handlePaste} style={{ width: '100%', height: '100%' }}>
      <StudioShell
        studioId="images.studio"
        title="Image & Asset Studio"
        subtitle="Hero banners, CLI terminals, Stitch HUDs, device frames & optimizer"
        badge="Visual Assets Pro"
        accentColor="#38bdf8"
        icon={<span className="material-symbols-outlined" style={{ fontSize: '20px' }}>image</span>}
        modes={STUDIO_MODES}
        activeMode={activeMode}
        onModeChange={setActiveMode}
        markdownCode={markdownSnippet}
        codeLanguage="markdown"
        onInsert={handleInsert}
        insertLabel="Insert Graphic"
        onBackToReadme={onBackToReadme}
        extraHeaderActions={extraHeaderActions}
        canvasHeaderExtras={canvasHeaderExtras}
        defaultSplitWidth={520}
        minSplitWidth={380}
        maxSplitWidth={880}
        inspectorContent={
          <div style={{ padding: '16px' }}>
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
                isCustomColor={isCustomColor}
                setIsCustomColor={setIsCustomColor}
                customHex1={customHex1}
                setCustomHex1={setCustomHex1}
                customHex2={customHex2}
                setCustomHex2={setCustomHex2}
                capsuleFontColor={capsuleFontColor}
                setCapsuleFontColor={setCapsuleFontColor}
                capsuleDescColor={capsuleDescColor}
                setCapsuleDescColor={setCapsuleDescColor}
                capsuleAnimation={capsuleAnimation}
                setCapsuleAnimation={setCapsuleAnimation}
                capsuleTitleSize={capsuleTitleSize}
                setCapsuleTitleSize={setCapsuleTitleSize}
                capsuleDescSize={capsuleDescSize}
                setCapsuleDescSize={setCapsuleDescSize}
                capsuleFontAlignY={capsuleFontAlignY}
                setCapsuleFontAlignY={setCapsuleFontAlignY}
                capsuleDescAlignY={capsuleDescAlignY}
                setCapsuleDescAlignY={setCapsuleDescAlignY}
                capsuleStroke={capsuleStroke}
                setCapsuleStroke={setCapsuleStroke}
                hudVersion={hudVersion}
                setHudVersion={setHudVersion}
                hudStatus={hudStatus}
                setHudStatus={setHudStatus}
                hudMetric1={hudMetric1}
                setHudMetric1={setHudMetric1}
                hudMetric2={hudMetric2}
                setHudMetric2={setHudMetric2}
                hudMetric3={hudMetric3}
                setHudMetric3={setHudMetric3}
                neofetchOs={neofetchOs}
                setNeofetchOs={setNeofetchOs}
                neofetchLicense={neofetchLicense}
                setNeofetchLicense={setNeofetchLicense}
                neofetchPrompt={neofetchPrompt}
                setNeofetchPrompt={setNeofetchPrompt}
                neofetchShell={neofetchShell}
                setNeofetchShell={setNeofetchShell}
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

            {/* MOTION & VIDEO / GIF MODE */}
            {activeMode === 'motion' && (
              <MotionHeroForm
                motionUrl={motionUrl}
                setMotionUrl={setMotionUrl}
                motionType={motionType}
                setMotionType={setMotionType}
                motionFrameStyle={motionFrameStyle}
                setMotionFrameStyle={setMotionFrameStyle}
                motionTitle={motionTitle}
                setMotionTitle={setMotionTitle}
                motionCaption={motionCaption}
                setMotionCaption={setMotionCaption}
                motionAlign={motionAlign}
                setMotionAlign={setMotionAlign}
                motionWidth={motionWidth}
                setMotionWidth={setMotionWidth}
                motionAutoplay={motionAutoplay}
                setMotionAutoplay={setMotionAutoplay}
                motionLoop={motionLoop}
                setMotionLoop={setMotionLoop}
                motionMuted={motionMuted}
                setMotionMuted={setMotionMuted}
                motionControls={motionControls}
                setMotionControls={setMotionControls}
                motionGlow={motionGlow}
                setMotionGlow={setMotionGlow}
                motionBrowserUrl={motionBrowserUrl}
                setMotionBrowserUrl={setMotionBrowserUrl}
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
                macWindowTitle={macWindowTitle}
                setMacWindowTitle={setMacWindowTitle}
                mockupGlow={mockupGlow}
                setMockupGlow={setMockupGlow}
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
        }
        canvasContent={
          <ImageStudioLivePreview
            activeMode={activeMode}
            bannerType={bannerType}
            bannerTitle={bannerTitle}
            bannerSubtitle={bannerSubtitle}
            hudStatus={hudStatus}
            hudVersion={hudVersion}
            bannerTheme={bannerTheme}
            isCustomColor={isCustomColor}
            customHex1={customHex1}
            customHex2={customHex2}
            hudMetric1={hudMetric1}
            hudMetric2={hudMetric2}
            hudMetric3={hudMetric3}
            neofetchPrompt={neofetchPrompt}
            neofetchShell={neofetchShell}
            capsuleFontColor={capsuleFontColor}
            capsuleDescColor={capsuleDescColor}
            capsuleAnimation={capsuleAnimation}
            capsuleTitleSize={capsuleTitleSize}
            capsuleDescSize={capsuleDescSize}
            capsuleFontAlignY={capsuleFontAlignY}
            capsuleDescAlignY={capsuleDescAlignY}
            capsuleShape={capsuleShape}
            bannerHeight={bannerHeight}
            neofetchOs={neofetchOs}
            neofetchLicense={neofetchLicense}
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
            macWindowTitle={macWindowTitle}
            mockupGlow={mockupGlow}
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
            motionUrl={motionUrl}
            motionType={motionType}
            motionFrameStyle={motionFrameStyle}
            motionTitle={motionTitle}
            motionCaption={motionCaption}
            motionAlign={motionAlign}
            motionWidth={motionWidth}
            motionAutoplay={motionAutoplay}
            motionLoop={motionLoop}
            motionMuted={motionMuted}
            motionControls={motionControls}
            motionGlow={motionGlow}
            motionBrowserUrl={motionBrowserUrl}
          />
        }

      />
    </div>
  )
}
