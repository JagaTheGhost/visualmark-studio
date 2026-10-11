import React, { useState, useEffect, useRef } from 'react'
import { saveAs } from 'file-saver'
import { getOptimizedImageUrl, requiresAsyncResolution, resolveRedirectImageUrl } from '../../utils/imageUtils'
import { useStudioSplit } from '../../utils/useResizableSplit'

const STUDIO_MODES = [
  { id: 'banner', label: 'Hero Banner', icon: 'featured_play_list' },
  { id: 'link', label: 'Device Mockups', icon: 'devices' },
  { id: 'upload', label: 'Paste Screenshot', icon: 'add_photo_alternate' },
  { id: 'adaptive', label: 'Theme Adaptive', icon: 'contrast' },
  { id: 'comparison', label: 'Compare Grid', icon: 'compare' }
]

const BANNER_STYLES = [
  { id: 'capsule', label: 'Dynamic GitHub Header', icon: 'waves', desc: 'Capsule Render waving/curved gradient (works on GitHub instantly)' },
  { id: 'typing', label: 'Animated Typing Loop', icon: 'keyboard', desc: 'Live terminal typing text animation (works on GitHub instantly)' },
  { id: 'github-stats', label: 'Live GitHub Repo Pin', icon: 'star', desc: 'Dynamic live GitHub star/fork pin & activity stats (works on GitHub instantly)' },
  { id: 'cover', label: 'Tech Photo Cover', icon: 'photo_camera', desc: 'Curated high-res developer landscape from Unsplash' },
  { id: 'hud-telemetry', label: 'Sci-Fi HUD Telemetry', icon: 'sensors', desc: 'Stitch bio-telemetry HUD card (requires SVG file in repo)' },
  { id: 'neofetch', label: 'Neofetch CLI Terminal', icon: 'terminal', desc: 'Developer terminal with system info (requires SVG file in repo)' },
  { id: 'cyberpunk-grid', label: 'Cyberpunk Neon Grid', icon: 'grid_view', desc: 'Perspective wireframe matrix horizon (requires SVG file in repo)' },
  { id: 'swiss-minimal', label: 'Swiss Typographic Grid', icon: 'view_quilt', desc: 'High-contrast editorial layout (requires SVG file in repo)' },
  { id: 'glass-orbit', label: 'Glassmorphism Tech Matrix', icon: 'blur_on', desc: 'Translucent frosted glass card (requires SVG file in repo)' },
  { id: 'gradient-ribbon', label: 'Aurora Flowing Ribbon', icon: 'grain', desc: 'Sleek abstract gradient ribbon (requires SVG file in repo)' }
]

const LOCAL_SVG_TYPES = ['hud-telemetry', 'neofetch', 'cyberpunk-grid', 'swiss-minimal', 'glass-orbit', 'gradient-ribbon']

const escapeXml = (unsafe = '') => {
  return String(unsafe ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const CAPSULE_SHAPES = [
  { id: 'waving', label: 'Waving' },
  { id: 'cylinder', label: 'Cylinder' },
  { id: 'soft', label: 'Soft' },
  { id: 'slice', label: 'Slice' },
  { id: 'rect', label: 'Rect' }
]

const COLOR_THEMES = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Violet',
    bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
    capsuleList: '1,6,11',
    hex1: '#4f46e5',
    hex2: '#db2777',
    coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'emerald',
    name: 'Emerald Matrix',
    bg: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)',
    capsuleList: '3,8,13',
    hex1: '#06b6d4',
    hex2: '#10b981',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    bg: 'linear-gradient(135deg, #0f172a 0%, #0284c7 50%, #38bdf8 100%)',
    capsuleList: '0,2,7',
    hex1: '#0284c7',
    hex2: '#38bdf8',
    coverUrl: 'https://images.unsplash.com/photo-1534972195531-a756b112697b?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'sunset',
    name: 'Sunset Crimson',
    bg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #f59e0b 100%)',
    capsuleList: '5,10,15',
    hex1: '#ea580c',
    hex2: '#f59e0b',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Obsidian',
    bg: 'linear-gradient(135deg, #090d16 0%, #161e2e 50%, #232f46 100%)',
    capsuleList: '20,22,25',
    hex1: '#161e2e',
    hex2: '#232f46',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80'
  }
]

const FRAME_STYLES = [
  { id: 'clean', label: 'Clean Borderless (GitHub)', desc: 'Standard responsive markdown image' },
  { id: 'mac-window', label: 'macOS Window Title', desc: 'Header chrome with window dots' },
  { id: 'browser-bar', label: 'Browser Address Bar', desc: 'Secure URL address chip' },
  { id: 'terminal', label: 'Terminal / CLI Prompt', desc: 'Command prompt chip with code styling' },
  { id: 'mobile', label: 'Mobile Device Frame', desc: 'Mobile device labeled preview' },
  { id: 'rounded-card', label: 'Centered Image Card', desc: 'Centered clean image presentation' }
]

const POPULAR_TECH_STACK = [
  'React', 'Next.js', 'Vue', 'Python', 'FastAPI', 'Django',
  'TypeScript', 'JavaScript', 'Node.js', 'Go', 'Rust',
  'Docker', 'Kubernetes', 'AWS', 'Tailwind', 'PostgreSQL', 'MongoDB', 'GraphQL'
]

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

  // ==================== STITCH BANNER SVG BUILDERS ====================

  // 1. Sci-Fi HUD Telemetry (Stitch Clinical Bio-Telemetry HUD aesthetics)
  const getHudTelemetrySvg = () => {
    const hex1 = bannerTheme.hex1 || '#06b6d4'
    const safeTitle = escapeXml(bannerTitle)
    const safeSub = escapeXml(bannerSubtitle)
    const safeStatus = escapeXml(hudStatus)
    const safeVer = escapeXml(hudVersion)
    const tagsArr = bannerTags.split(',').map((t) => escapeXml(t.trim())).filter(Boolean)
    const tagsSvg = tagsArr
      .slice(0, 6)
      .map(
        (t, i) => `
      <g transform="translate(${40 + i * 110}, 190)">
        <rect width="100" height="26" rx="4" fill="#ffffff" fill-opacity="0.06" stroke="${hex1}" stroke-opacity="0.3" stroke-width="1"/>
        <text x="50" y="17" fill="#f8fafc" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="11" font-weight="600" text-anchor="middle">${t}</text>
      </g>`
      )
      .join('')

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 240" width="900" height="240">
  <defs>
    <linearGradient id="hudTitleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="${hex1}"/>
    </linearGradient>
    <radialGradient id="hudGlow" cx="50%" cy="25%" r="75%">
      <stop offset="0%" stop-color="${hex1}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0a0f1d" stop-opacity="0"/>
    </radialGradient>
    <pattern id="hudGrid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
  </defs>
  <!-- Base Background -->
  <rect width="900" height="240" rx="8" fill="#0a0f1d"/>
  <rect width="900" height="240" rx="8" fill="url(#hudGrid)"/>
  <rect width="900" height="240" rx="8" fill="url(#hudGlow)"/>
  <rect width="898" height="238" x="1" y="1" rx="8" fill="none" stroke="#1e293b" stroke-width="1"/>

  <!-- Corner Reticle Brackets -->
  <path d="M 12 24 L 12 12 L 24 12" fill="none" stroke="${hex1}" stroke-width="2"/>
  <path d="M 888 24 L 888 12 L 876 12" fill="none" stroke="${hex1}" stroke-width="2"/>
  <path d="M 12 216 L 12 228 L 24 228" fill="none" stroke="${hex1}" stroke-width="2"/>
  <path d="M 888 216 L 888 228 L 876 228" fill="none" stroke="${hex1}" stroke-width="2"/>

  <!-- Top Telemetry Status Header -->
  <circle cx="44" cy="36" r="4" fill="#10b981"/>
  <circle cx="44" cy="36" r="8" fill="#10b981" fill-opacity="0.25"/>
  <text x="58" y="40" fill="#10b981" font-family="'JetBrains Mono',ui-monospace,monospace" font-size="10" font-weight="700" letter-spacing="1.5">${safeStatus}</text>
  <rect x="740" y="26" width="116" height="20" rx="3" fill="#ffffff" fill-opacity="0.05" stroke="#334155" stroke-width="1"/>
  <text x="798" y="40" fill="#94a3b8" font-family="'JetBrains Mono',ui-monospace,monospace" font-size="10" font-weight="600" text-anchor="middle">${safeVer}</text>

  <!-- Title & Subtitle -->
  <text x="40" y="102" fill="url(#hudTitleGrad)" font-family="'Space Grotesk',-apple-system,sans-serif" font-size="38" font-weight="800" letter-spacing="-0.5">${safeTitle}</text>
  <text x="40" y="138" fill="#94a3b8" font-family="'Plus Jakarta Sans',-apple-system,sans-serif" font-size="15" font-weight="400">${safeSub}</text>

  <!-- Hairline divider -->
  <line x1="40" y1="170" x2="860" y2="170" stroke="#1e293b" stroke-width="1"/>
  ${tagsSvg}
</svg>`
  }

  // 2. Neofetch CLI Terminal
  const getNeofetchSvg = () => {
    const hex1 = bannerTheme.hex1 || '#6366f1'
    const safeTitle = escapeXml(bannerTitle)
    const safeSub = escapeXml(bannerSubtitle.slice(0, 50))
    const safeOs = escapeXml(neofetchOs)
    const safeLic = escapeXml(neofetchLicense)
    const safeVer = escapeXml(hudVersion)
    const tagsArr = bannerTags.split(',').map((t) => escapeXml(t.trim())).filter(Boolean).slice(0, 4).join(' • ')

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 240" width="900" height="240">
  <!-- Window Container -->
  <rect width="900" height="240" rx="8" fill="#0d1117"/>
  <rect width="898" height="238" x="1" y="1" rx="8" fill="none" stroke="#30363d" stroke-width="1"/>
  
  <!-- Window Bar -->
  <rect width="900" height="34" rx="8" fill="#161b22"/>
  <rect width="900" height="1" y="34" fill="#30363d"/>
  <circle cx="20" cy="17" r="4.5" fill="#ef4444"/>
  <circle cx="34" cy="17" r="4.5" fill="#f59e0b"/>
  <circle cx="48" cy="17" r="4.5" fill="#10b981"/>
  <text x="450" y="21" fill="#8b949e" font-family="'JetBrains Mono',monospace" font-size="11" text-anchor="middle">bash - 80x24 - neofetch</text>

  <!-- Left: ASCII Art Logo Box -->
  <rect x="36" y="56" width="140" height="156" rx="6" fill="#161b22" stroke="#30363d" stroke-width="1"/>
  <text x="106" y="112" fill="${hex1}" font-family="'JetBrains Mono',monospace" font-size="36" font-weight="800" text-anchor="middle">&gt;/_</text>
  <text x="106" y="146" fill="#58a6ff" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700" text-anchor="middle">ONLINE</text>
  <text x="106" y="174" fill="#8b949e" font-family="'JetBrains Mono',monospace" font-size="9" text-anchor="middle">${safeVer}</text>

  <!-- Right: Neofetch Specs -->
  <text x="205" y="78" fill="#f0f6fc" font-family="'JetBrains Mono',monospace" font-size="16" font-weight="700">${safeTitle}</text>
  <text x="205" y="96" fill="#388bfd" font-family="'JetBrains Mono',monospace" font-size="10">-------------------------------------------------------------</text>
  
  <text x="205" y="118" fill="${hex1}" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">OS:</text>
  <text x="290" y="118" fill="#c9d1d9" font-family="'JetBrains Mono',monospace" font-size="11">${safeOs}</text>
  
  <text x="205" y="138" fill="${hex1}" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">Desc:</text>
  <text x="290" y="138" fill="#8b949e" font-family="'JetBrains Mono',monospace" font-size="11">${safeSub}</text>
  
  <text x="205" y="158" fill="${hex1}" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">Stack:</text>
  <text x="290" y="158" fill="#58a6ff" font-family="'JetBrains Mono',monospace" font-size="11">${tagsArr}</text>
  
  <text x="205" y="178" fill="${hex1}" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">License:</text>
  <text x="290" y="178" fill="#7ee787" font-family="'JetBrains Mono',monospace" font-size="11">${safeLic}</text>

  <!-- Palette Swatches -->
  <g transform="translate(205, 196)">
    <rect x="0" y="0" width="16" height="12" rx="2" fill="#0d1117"/>
    <rect x="20" y="0" width="16" height="12" rx="2" fill="#ef4444"/>
    <rect x="40" y="0" width="16" height="12" rx="2" fill="#10b981"/>
    <rect x="60" y="0" width="16" height="12" rx="2" fill="#f59e0b"/>
    <rect x="80" y="0" width="16" height="12" rx="2" fill="#3b82f6"/>
    <rect x="100" y="0" width="16" height="12" rx="2" fill="#8b5cf6"/>
    <rect x="120" y="0" width="16" height="12" rx="2" fill="#06b6d4"/>
    <rect x="140" y="0" width="16" height="12" rx="2" fill="#f8fafc"/>
  </g>
</svg>`
  }

  // 3. Cyberpunk Perspective Neon Grid
  const getCyberpunkGridSvg = () => {
    const hex1 = bannerTheme.hex1 || '#db2777'
    const hex2 = bannerTheme.hex2 || '#4f46e5'
    const safeTitle = escapeXml(bannerTitle.toUpperCase())
    const safeSub = escapeXml(bannerSubtitle)

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 240" width="900" height="240">
  <defs>
    <linearGradient id="neonTitle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="${hex1}"/>
      <stop offset="100%" stop-color="#f43f5e"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="100%" r="60%">
      <stop offset="0%" stop-color="${hex1}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#050811" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Deep Background -->
  <rect width="900" height="240" rx="8" fill="#050811"/>
  <rect width="900" height="240" rx="8" fill="url(#sunGlow)"/>

  <!-- Perspective Horizon Grid -->
  <line x1="0" y1="140" x2="900" y2="140" stroke="${hex1}" stroke-opacity="0.5" stroke-width="1.5"/>
  <line x1="0" y1="165" x2="900" y2="165" stroke="${hex1}" stroke-opacity="0.35" stroke-width="1"/>
  <line x1="0" y1="195" x2="900" y2="195" stroke="${hex1}" stroke-opacity="0.25" stroke-width="1"/>
  <line x1="0" y1="230" x2="900" y2="230" stroke="${hex1}" stroke-opacity="0.15" stroke-width="1"/>

  <!-- Vanishing Perspective Lines -->
  <line x1="450" y1="140" x2="0" y2="240" stroke="${hex2}" stroke-opacity="0.3" stroke-width="1"/>
  <line x1="450" y1="140" x2="150" y2="240" stroke="${hex2}" stroke-opacity="0.3" stroke-width="1"/>
  <line x1="450" y1="140" x2="300" y2="240" stroke="${hex2}" stroke-opacity="0.3" stroke-width="1"/>
  <line x1="450" y1="140" x2="600" y2="240" stroke="${hex2}" stroke-opacity="0.3" stroke-width="1"/>
  <line x1="450" y1="140" x2="750" y2="240" stroke="${hex2}" stroke-opacity="0.3" stroke-width="1"/>
  <line x1="450" y1="140" x2="900" y2="240" stroke="${hex2}" stroke-opacity="0.3" stroke-width="1"/>

  <!-- Horizon Neon Flare -->
  <ellipse cx="450" cy="140" rx="160" ry="8" fill="${hex1}" fill-opacity="0.25"/>

  <!-- Content -->
  <text x="450" y="78" fill="url(#neonTitle)" font-family="'Space Grotesk',-apple-system,sans-serif" font-size="42" font-weight="900" letter-spacing="1" text-anchor="middle">${safeTitle}</text>
  <text x="450" y="112" fill="#e2e8f0" font-family="'Plus Jakarta Sans',sans-serif" font-size="14" font-weight="500" letter-spacing="0.5" text-anchor="middle">${safeSub}</text>
</svg>`
  }

  // 4. Swiss International Typographic Grid
  const getSwissMinimalSvg = () => {
    const hex1 = bannerTheme.hex1 || '#ef4444'
    const safeTitle = escapeXml(bannerTitle)
    const safeSub = escapeXml(bannerSubtitle)
    const tagsArr = bannerTags.split(',').map((t) => escapeXml(t.trim())).filter(Boolean).slice(0, 4).join(' / ')

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 240" width="900" height="240">
  <!-- Minimal Dark Carbon Substrate -->
  <rect width="900" height="240" rx="4" fill="#111318"/>
  <rect width="898" height="238" x="1" y="1" rx="4" fill="none" stroke="#232730" stroke-width="1"/>

  <!-- Swiss Color Block Accent -->
  <rect x="40" y="32" width="12" height="12" fill="${hex1}"/>
  <text x="64" y="42" fill="#8b949e" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="600" letter-spacing="2">No. 01 / REPOSITORY ARCHITECTURE</text>

  <!-- Title & Subtitle -->
  <text x="40" y="105" fill="#f8fafc" font-family="'Inter',-apple-system,sans-serif" font-size="38" font-weight="800" letter-spacing="-1">${safeTitle}</text>
  <text x="40" y="142" fill="#94a3b8" font-family="'Inter',-apple-system,sans-serif" font-size="15" font-weight="400">${safeSub}</text>

  <!-- Hairline Grid Divider -->
  <line x1="40" y1="174" x2="860" y2="174" stroke="#232730" stroke-width="1"/>

  <!-- Footer Specs Grid -->
  <text x="40" y="204" fill="#64748b" font-family="'JetBrains Mono',monospace" font-size="11">STACK:</text>
  <text x="96" y="204" fill="#e2e8f0" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="600">${tagsArr}</text>
  <text x="860" y="204" fill="#64748b" font-family="'JetBrains Mono',monospace" font-size="11" text-anchor="end">OPEN SOURCE SPECIFICATION</text>
</svg>`
  }

  // 5. Glassmorphism Tech Matrix
  const getGlassOrbitSvg = () => {
    const hex1 = bannerTheme.hex1 || '#6366f1'
    const hex2 = bannerTheme.hex2 || '#ec4899'
    const safeTitle = escapeXml(bannerTitle)
    const safeSub = escapeXml(bannerSubtitle)
    const tagsArr = bannerTags.split(',').map((t) => escapeXml(t.trim())).filter(Boolean).slice(0, 5)
    const tagsSvg = tagsArr.map((t, i) => `
      <g transform="translate(${50 + i * 115}, 184)">
        <rect width="105" height="28" rx="14" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.18" stroke-width="1"/>
        <text x="52.5" y="18" fill="#f8fafc" font-family="'Plus Jakarta Sans',sans-serif" font-size="11" font-weight="600" text-anchor="middle">${t}</text>
      </g>`).join('')

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 240" width="900" height="240">
  <defs>
    <linearGradient id="glassAura" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${hex1}" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="${hex2}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.5"/>
    </linearGradient>
    <radialGradient id="nebulaGlow" cx="20%" cy="30%" r="70%">
      <stop offset="0%" stop-color="${hex1}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#090d16" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nebulaGlow2" cx="80%" cy="70%" r="60%">
      <stop offset="0%" stop-color="${hex2}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#090d16" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Dark Obsidian Void -->
  <rect width="900" height="240" rx="12" fill="#090d16"/>
  <rect width="900" height="240" rx="12" fill="url(#nebulaGlow)"/>
  <rect width="900" height="240" rx="12" fill="url(#nebulaGlow2)"/>

  <!-- Frosted Glass Primary Panel -->
  <rect x="24" y="20" width="852" height="200" rx="10" fill="#ffffff" fill-opacity="0.03" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>

  <!-- Top Chrome Metrics -->
  <circle cx="54" cy="46" r="4" fill="#38bdf8"/>
  <text x="68" y="50" fill="#94a3b8" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="600" letter-spacing="1">PROJECT ECOSYSTEM</text>
  <rect x="740" y="36" width="112" height="22" rx="11" fill="url(#glassAura)" fill-opacity="0.2" stroke="${hex1}" stroke-opacity="0.5" stroke-width="1"/>
  <text x="796" y="51" fill="#f8fafc" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="700" text-anchor="middle">ACTIVE v2.5</text>

  <!-- Title & Headline -->
  <text x="50" y="106" fill="#ffffff" font-family="'Space Grotesk',sans-serif" font-size="38" font-weight="800" letter-spacing="-0.5">${safeTitle}</text>
  <text x="50" y="142" fill="#94a3b8" font-family="'Plus Jakarta Sans',sans-serif" font-size="15" font-weight="400">${safeSub}</text>

  <!-- Divider & Tech Badges -->
  <line x1="50" y1="168" x2="850" y2="168" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
  ${tagsSvg}
</svg>`
  }

  // 6. Aurora Flowing Gradient Ribbon
  const getGradientRibbonSvg = () => {
    const hex1 = bannerTheme.hex1 || '#4f46e5'
    const hex2 = bannerTheme.hex2 || '#db2777'
    const safeTitle = escapeXml(bannerTitle)
    const safeSub = escapeXml(bannerSubtitle)
    const tagsArr = bannerTags.split(',').map((t) => escapeXml(t.trim())).filter(Boolean).slice(0, 4).join(' * ')

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 240" width="900" height="240">
  <defs>
    <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${hex1}"/>
      <stop offset="50%" stop-color="${hex2}"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="900" height="240" rx="10" fill="#070a13"/>
  <rect width="898" height="238" x="1" y="1" rx="10" fill="none" stroke="#1e293b" stroke-width="1"/>

  <!-- Wave Ribbon Paths -->
  <path d="M 0 160 Q 225 100 450 160 T 900 130 L 900 240 L 0 240 Z" fill="url(#ribbonGrad)" fill-opacity="0.15"/>
  <path d="M 0 170 Q 225 120 450 170 T 900 150" fill="none" stroke="url(#ribbonGrad)" stroke-width="2.5" stroke-opacity="0.75"/>
  <path d="M 0 190 Q 225 150 450 190 T 900 175" fill="none" stroke="url(#ribbonGrad)" stroke-width="1.5" stroke-opacity="0.4"/>

  <!-- Status Chip -->
  <g transform="translate(50, 36)">
    <rect width="130" height="22" rx="4" fill="#ffffff" fill-opacity="0.05" stroke="#334155" stroke-width="1"/>
    <circle cx="12" cy="11" r="3" fill="#10b981"/>
    <text x="24" y="15" fill="#f8fafc" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="600">STABLE RELEASE</text>
  </g>

  <!-- Typography -->
  <text x="50" y="106" fill="url(#textGrad)" font-family="'Space Grotesk',sans-serif" font-size="40" font-weight="800" letter-spacing="-1">${safeTitle}</text>
  <text x="50" y="140" fill="#94a3b8" font-family="'Plus Jakarta Sans',sans-serif" font-size="15" font-weight="400">${safeSub}</text>
  
  <text x="50" y="212" fill="#64748b" font-family="'JetBrains Mono',monospace" font-size="11">STACK: ${tagsArr}</text>
</svg>`
  }

  // Get active SVG source for local SVG modes
  const getActiveSvgCode = () => {
    if (bannerType === 'hud-telemetry') return getHudTelemetrySvg()
    if (bannerType === 'neofetch') return getNeofetchSvg()
    if (bannerType === 'cyberpunk-grid') return getCyberpunkGridSvg()
    if (bannerType === 'swiss-minimal') return getSwissMinimalSvg()
    if (bannerType === 'glass-orbit') return getGlassOrbitSvg()
    if (bannerType === 'gradient-ribbon') return getGradientRibbonSvg()
    return getHudTelemetrySvg()
  }

  // Generate standard RFC 2397 Data URI with charset=utf-8
  const getActiveSvgDataUri = () => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(getActiveSvgCode())}`
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
        const svgCode = getActiveSvgCode()
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

  // Helper to generate framed markdown syntax
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

  // Shared visual mockup renderer
  const renderVisualMockup = (targetSrc, altText) => {
    return (
      <div className={`link-preview-box align-${imageAlign}`}>
        {frameStyle === 'mac-window' ? (
          <div className="mockup-mac-window" style={{ maxWidth: imageWidth === '100%' ? '100%' : `${imageWidth}px` }}>
            <div className="mac-window-bar">
              <span className="mac-dot dot-red" />
              <span className="mac-dot dot-yellow" />
              <span className="mac-dot dot-green" />
            </div>
            <img src={targetSrc} alt={altText} className="mockup-img" />
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
            <img src={targetSrc} alt={altText} className="mockup-img" />
          </div>
        ) : frameStyle === 'terminal' ? (
          <div className="mockup-terminal" style={{ maxWidth: imageWidth === '100%' ? '100%' : `${imageWidth}px` }}>
            <div className="terminal-window-bar">
              <span className="terminal-title">bash - 80×24</span>
              <span style={{ fontSize: '10px', color: '#58a6ff' }}>{terminalCommand}</span>
            </div>
            <img src={targetSrc} alt={altText} className="mockup-img" />
          </div>
        ) : frameStyle === 'mobile' ? (
          <div className="mockup-mobile">
            <div className="mobile-notch-bar">
              <div className="mobile-notch-pill" />
            </div>
            <img src={targetSrc} alt={altText} className="mockup-img" />
          </div>
        ) : frameStyle === 'rounded-card' ? (
          <div className="mockup-rounded-card" style={{ maxWidth: imageWidth === '100%' ? '100%' : `${imageWidth}px` }}>
            <img src={targetSrc} alt={altText} className="mockup-img" />
          </div>
        ) : (
          <img
            src={targetSrc}
            alt={altText}
            style={{ maxWidth: imageWidth === '100%' ? '100%' : `${imageWidth}px`, borderRadius: '6px' }}
          />
        )}
        {imageCaption && <div className="preview-caption-text">{imageCaption}</div>}
      </div>
    )
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
            <>
              {/* Stitch-Inspired Banner Types */}
              <div className="studio-section">
                <label className="studio-section-label">Banner Architecture ({BANNER_STYLES.length} Distinct Styles)</label>
                <div className="banner-type-card-grid">
                  {BANNER_STYLES.map((bs) => (
                    <button
                      key={bs.id}
                      type="button"
                      className={`banner-type-card ${bannerType === bs.id ? 'active' : ''}`}
                      onClick={() => setBannerType(bs.id)}
                    >
                      <span className="material-symbols-outlined banner-card-icon">{bs.icon}</span>
                      <div className="banner-card-info">
                        <span className="banner-card-title">{bs.label}</span>
                        <span className="banner-card-desc">{bs.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Syntax Format Selector for Local SVG Banners */}
              {LOCAL_SVG_TYPES.includes(bannerType) && (
                <div className="studio-section">
                  <label className="studio-section-label">Markdown Insertion Format</label>
                  <div className="studio-segmented-styles">
                    <button
                      type="button"
                      className={`studio-style-btn ${bannerSyntaxMode === 'asset-path' ? 'active' : ''}`}
                      onClick={() => setBannerSyntaxMode('asset-path')}
                      title="Relative file path for GitHub repositories (e.g. assets/hero-banner.svg)"
                    >
                      📁 Repository Asset (GitHub Recommended)
                    </button>
                    <button
                      type="button"
                      className={`studio-style-btn ${bannerSyntaxMode === 'data-uri' ? 'active' : ''}`}
                      onClick={() => setBannerSyntaxMode('data-uri')}
                      title="Direct self-contained data URI (renders in local viewers, blocked by GitHub)"
                    >
                      ⚡ Direct Data URI (Local Only)
                    </button>
                  </div>
                  {bannerSyntaxMode === 'asset-path' ? (
                    <div style={{ marginTop: '8px', padding: '10px 14px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#38bdf8', marginBottom: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
                        <span>GitHub Setup Instructions:</span>
                      </div>
                      <p style={{ margin: '0 0 6px 0', color: 'var(--text-secondary)' }}>
                        GitHub Camo blocks inline SVG data URIs for security. To display this vector graphic on GitHub:
                      </p>
                      <ol style={{ margin: '0 0 8px 18px', padding: 0, color: 'var(--text-secondary)' }}>
                        <li>Click the download button below to save the SVG.</li>
                        <li>Commit the file to your repository in an <code>assets/</code> folder.</li>
                      </ol>
                      <button
                        type="button"
                        className="btn-studio-secondary"
                        onClick={handleDownloadAsset}
                        style={{ fontSize: '11px', padding: '4px 10px', height: '28px', background: 'rgba(56, 189, 248, 0.15)', borderColor: '#38bdf8', color: '#e0f2fe' }}
                      >
                        <span className="material-symbols-outlined icon-xs">download</span>
                        <span>Download {(bannerTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'hero')}-{bannerType}.svg</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginTop: '8px', padding: '10px 14px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '12px', color: '#f59e0b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', marginBottom: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>warning</span>
                        <span>GitHub Incompatibility Notice</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                        GitHub Camo image sanitizer <strong>blocks data:image/svg+xml URIs</strong>. If you paste this code into a GitHub repository, it will show as a broken image. Switch to <strong>Repository Asset</strong> or pick <strong>Dynamic GitHub Header</strong> (Capsule) for instant cloud rendering.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Color Palette Theme Selection */}
              {bannerType !== 'typing' && bannerType !== 'github-stats' && (
                <div className="studio-section">
                  <label className="studio-section-label">Color Theme Palette</label>
                  <div className="theme-swatch-grid">
                    {COLOR_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        className={`theme-swatch-card ${bannerTheme.id === theme.id ? 'active' : ''}`}
                        onClick={() => setBannerTheme(theme)}
                        title={theme.name}
                      >
                        <span className="theme-swatch-circle" style={{ background: theme.bg }} />
                        <span className="theme-swatch-name">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}


              {/* Title & Subtitle (for styles with custom headers) */}
              {bannerType !== 'typing' && bannerType !== 'github-stats' && (
                <div className="studio-section">
                  <label className="studio-section-label">Banner Content</label>
                  <div className="studio-field">
                    <span className="studio-field-label">Project Title</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={bannerTitle}
                      onChange={(e) => setBannerTitle(e.target.value)}
                      placeholder="e.g. README Studio"
                    />
                  </div>

                  <div className="studio-field">
                    <span className="studio-field-label">Tagline / Mission Statement</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={bannerSubtitle}
                      onChange={(e) => setBannerSubtitle(e.target.value)}
                      placeholder="e.g. State-of-the-Art Markdown Documentation Platform"
                    />
                  </div>

                  <div className="studio-field">
                    <span className="studio-field-label">Tech Chips (comma separated)</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={bannerTags}
                      onChange={(e) => setBannerTags(e.target.value)}
                      placeholder="e.g. FastAPI, React, Vite, Tailwind"
                    />
                  </div>

                  {/* Interactive Tech Stack Quick Rack */}
                  <div className="studio-field" style={{ marginTop: '4px' }}>
                    <span className="studio-field-label">Popular Tech Presets (Click to add)</span>
                    <div className="studio-chips-rack">
                      {POPULAR_TECH_STACK.map((tech) => {
                        const tagsArr = bannerTags.split(',').map((t) => t.trim().toLowerCase())
                        const isSelected = tagsArr.includes(tech.toLowerCase())
                        return (
                          <button
                            key={tech}
                            type="button"
                            className={`studio-chip-btn ${isSelected ? 'active' : ''}`}
                            onClick={() => handleToggleTechTag(tech)}
                          >
                            <span>{isSelected ? '✓ ' : '+ '}</span>
                            <span>{tech}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Specific Options: Stitch Sci-Fi HUD Telemetry */}
              {bannerType === 'hud-telemetry' && (
                <div className="studio-section">
                  <label className="studio-section-label">HUD Telemetry Coordinates</label>
                  <div className="studio-input-duo">
                    <div className="studio-field">
                      <span className="studio-field-label">Version Tag</span>
                      <input
                        type="text"
                        className="studio-text-input"
                        value={hudVersion}
                        onChange={(e) => setHudVersion(e.target.value)}
                        placeholder="v2.4.0"
                      />
                    </div>
                    <div className="studio-field">
                      <span className="studio-field-label">Status Beacon</span>
                      <input
                        type="text"
                        className="studio-text-input"
                        value={hudStatus}
                        onChange={(e) => setHudStatus(e.target.value)}
                        placeholder="SYSTEM NOMINAL"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Specific Options: Neofetch Terminal */}
              {bannerType === 'neofetch' && (
                <div className="studio-section">
                  <label className="studio-section-label">Neofetch System Telemetry</label>
                  <div className="studio-input-duo">
                    <div className="studio-field">
                      <span className="studio-field-label">Host OS Specs</span>
                      <input
                        type="text"
                        className="studio-text-input"
                        value={neofetchOs}
                        onChange={(e) => setNeofetchOs(e.target.value)}
                        placeholder="GitHub / Linux x86_64"
                      />
                    </div>
                    <div className="studio-field">
                      <span className="studio-field-label">License Type</span>
                      <input
                        type="text"
                        className="studio-text-input"
                        value={neofetchLicense}
                        onChange={(e) => setNeofetchLicense(e.target.value)}
                        placeholder="MIT License"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Specific Options: Live GitHub Repo Pin */}
              {bannerType === 'github-stats' && (
                <div className="studio-section">
                  <label className="studio-section-label">GitHub Repository Pin Target</label>
                  <div className="studio-input-duo">
                    <div className="studio-field">
                      <span className="studio-field-label">Owner / Username</span>
                      <input
                        type="text"
                        className="studio-text-input"
                        value={githubRepoOwner}
                        onChange={(e) => setGithubRepoOwner(e.target.value)}
                        placeholder="e.g. JagaTheGhost"
                      />
                    </div>
                    <div className="studio-field">
                      <span className="studio-field-label">Repository Name</span>
                      <input
                        type="text"
                        className="studio-text-input"
                        value={githubRepoName}
                        onChange={(e) => setGithubRepoName(e.target.value)}
                        placeholder="e.g. auto-readme-generator"
                      />
                    </div>
                  </div>

                  <div className="studio-field" style={{ marginTop: '6px' }}>
                    <span className="studio-field-label">Stats Theme</span>
                    <div className="studio-segmented-styles">
                      {['tokyonight', 'radical', 'synthwave', 'dark', 'dracula'].map((th) => (
                        <button
                          key={th}
                          type="button"
                          className={`studio-style-btn capitalize ${githubStatsTheme === th ? 'active' : ''}`}
                          onClick={() => setGithubStatsTheme(th)}
                        >
                          {th}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Specific Options: Typing SVG Configurator */}
              {bannerType === 'typing' && (
                <div className="studio-section">
                  <label className="studio-section-label">Animated Typing Text</label>
                  <div className="studio-field">
                    <span className="studio-field-label">Typing Lines (Semicolon separated)</span>
                    <textarea
                      rows={3}
                      className="studio-text-area"
                      value={typingLines}
                      onChange={(e) => setTypingLines(e.target.value)}
                      placeholder="Line 1;Line 2;Line 3"
                    />
                  </div>

                  <div className="studio-input-duo">
                    <div className="studio-field">
                      <span className="studio-field-label">Monospace Font</span>
                      <select
                        className="studio-select-input"
                        value={typingFont}
                        onChange={(e) => setTypingFont(e.target.value)}
                      >
                        <option value="Fira Code">Fira Code</option>
                        <option value="Roboto Mono">Roboto Mono</option>
                        <option value="Source Code Pro">Source Code Pro</option>
                        <option value="Courier New">Courier New</option>
                        <option value="monospace">Standard Monospace</option>
                      </select>
                    </div>

                    <div className="studio-field">
                      <span className="studio-field-label">Pause Duration (ms)</span>
                      <select
                        className="studio-select-input"
                        value={typingPause}
                        onChange={(e) => setTypingPause(e.target.value)}
                      >
                        <option value="500">Fast (500ms)</option>
                        <option value="1000">Normal (1000ms)</option>
                        <option value="1500">Relaxed (1500ms)</option>
                        <option value="2500">Long (2500ms)</option>
                      </select>
                    </div>
                  </div>

                  <div className="studio-field">
                    <span className="studio-field-label">Text Accent Hex Color</span>
                    <div className="studio-segmented-styles">
                      {[
                        { label: 'Indigo', hex: '6366F1' },
                        { label: 'Cyan', hex: '06B6D4' },
                        { label: 'Emerald', hex: '10B981' },
                        { label: 'Amber', hex: 'F59E0B' },
                        { label: 'Rose', hex: 'F43F5E' },
                        { label: 'White', hex: 'FFFFFF' }
                      ].map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          className={`studio-style-btn ${typingColor === c.hex ? 'active' : ''}`}
                          onClick={() => setTypingColor(c.hex)}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: `#${c.hex}`,
                              marginRight: '4px'
                            }}
                          />
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Specific Options: Capsule Shape / Height */}
              {bannerType === 'capsule' && (
                <div className="studio-section">
                  <label className="studio-section-label">Wave Geometry & Height</label>
                  <div className="studio-segmented-styles">
                    {CAPSULE_SHAPES.map((shape) => (
                      <button
                        key={shape.id}
                        type="button"
                        className={`studio-style-btn ${capsuleShape === shape.id ? 'active' : ''}`}
                        onClick={() => setCapsuleShape(shape.id)}
                      >
                        {shape.label}
                      </button>
                    ))}
                  </div>

                  <div className="studio-segmented-styles" style={{ marginTop: '6px' }}>
                    {['180', '220', '260'].map((h) => (
                      <button
                        key={h}
                        type="button"
                        className={`studio-style-btn ${bannerHeight === h ? 'active' : ''}`}
                        onClick={() => setBannerHeight(h)}
                      >
                        {h}px Height
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* 2. DEVICE MOCKUP FRAMES (LINK MODE) */}
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

          {/* 3. UPLOAD / CLIPBOARD PASTE MODE WITH FRAMES */}
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

          {/* 4. THEME ADAPTIVE MODE (LIGHT & DARK PAIR) */}
          {activeMode === 'adaptive' && (
            <>
              <div className="studio-section">
                <label className="studio-section-label">Theme-Adaptive URLs (GitHub Light/Dark)</label>
                <div className="studio-field">
                  <span className="studio-field-label">🌙 Dark Mode Image URL (Rendered in dark themes)</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={darkThemeUrl}
                    onChange={(e) => setDarkThemeUrl(e.target.value)}
                    placeholder="https://.../banner-dark.png"
                  />
                </div>

                <div className="studio-field">
                  <span className="studio-field-label">☀️ Light Mode Image URL (Rendered in light themes)</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={lightThemeUrl}
                    onChange={(e) => setLightThemeUrl(e.target.value)}
                    placeholder="https://.../banner-light.png"
                  />
                </div>

                <div className="studio-field">
                  <span className="studio-field-label">Alt Description</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={adaptiveAlt}
                    onChange={(e) => setAdaptiveAlt(e.target.value)}
                    placeholder="e.g. Project Architecture Overview"
                  />
                </div>
              </div>

              <div className="studio-section">
                <label className="studio-section-label">Syntax Mode</label>
                <div className="studio-segmented-styles">
                  <button
                    type="button"
                    className={`studio-style-btn ${adaptiveFormat === 'gh-hash' ? 'active' : ''}`}
                    onClick={() => setAdaptiveFormat('gh-hash')}
                  >
                    GitHub Native #gh-dark-mode-only (Recommended)
                  </button>
                  <button
                    type="button"
                    className={`studio-style-btn ${adaptiveFormat === 'picture' ? 'active' : ''}`}
                    onClick={() => setAdaptiveFormat('picture')}
                  >
                    HTML5 &lt;picture&gt; (External Sites)
                  </button>
                </div>
                {adaptiveFormat === 'gh-hash' && (
                  <p style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    ✓ Uses GitHub's official <code>#gh-dark-mode-only</code> and <code>#gh-light-mode-only</code> URL fragments.
                  </p>
                )}
              </div>

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

          {/* 5. COMPARISON MODE */}
          {activeMode === 'comparison' && (
            <div className="studio-section">
              <label className="studio-section-label">Side-by-Side Comparison Grid</label>
              <div className="studio-input-duo">
                <div className="studio-field">
                  <span className="studio-field-label">Left Column Title</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={compTitle1}
                    onChange={(e) => setCompTitle1(e.target.value)}
                  />
                </div>
                <div className="studio-field">
                  <span className="studio-field-label">Right Column Title</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={compTitle2}
                    onChange={(e) => setCompTitle2(e.target.value)}
                  />
                </div>
              </div>

              <div className="studio-field">
                <span className="studio-field-label">Left Image URL</span>
                <input
                  type="text"
                  className="studio-text-input"
                  value={compUrl1}
                  onChange={(e) => setCompUrl1(e.target.value)}
                />
              </div>

              <div className="studio-field">
                <span className="studio-field-label">Right Image URL</span>
                <input
                  type="text"
                  className="studio-text-input"
                  value={compUrl2}
                  onChange={(e) => setCompUrl2(e.target.value)}
                />
              </div>
            </div>
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
                    <div dangerouslySetInnerHTML={{ __html: getHudTelemetrySvg() }} />
                  )}

                  {/* Neofetch Terminal */}
                  {bannerType === 'neofetch' && (
                    <div dangerouslySetInnerHTML={{ __html: getNeofetchSvg() }} />
                  )}

                  {/* Cyberpunk Perspective Grid */}
                  {bannerType === 'cyberpunk-grid' && (
                    <div dangerouslySetInnerHTML={{ __html: getCyberpunkGridSvg() }} />
                  )}

                  {/* Swiss Typographic Grid */}
                  {bannerType === 'swiss-minimal' && (
                    <div dangerouslySetInnerHTML={{ __html: getSwissMinimalSvg() }} />
                  )}

                  {/* Glassmorphism Tech Matrix */}
                  {bannerType === 'glass-orbit' && (
                    <div dangerouslySetInnerHTML={{ __html: getGlassOrbitSvg() }} />
                  )}

                  {/* Aurora Flowing Ribbon */}
                  {bannerType === 'gradient-ribbon' && (
                    <div dangerouslySetInnerHTML={{ __html: getGradientRibbonSvg() }} />
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
                          src={getTypingUrl()}
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
                      src={bannerTheme.coverUrl}
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
                      src={previewThemeMode === 'dark' ? darkThemeUrl : lightThemeUrl}
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
                    <img src={compUrl1} alt={compTitle1} className="comp-img" />
                  </div>
                  <div className="comp-card">
                    <span className="comp-label">{compTitle2}</span>
                    <img src={compUrl2} alt={compTitle2} className="comp-img" />
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
      </div>
    </div>
  )
}
