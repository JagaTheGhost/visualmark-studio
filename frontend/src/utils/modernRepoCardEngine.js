/**
 * Modern Vector SVG Repository Card Engine
 * 100% Client-Side Vector Generation with zero external server dependencies.
 * Features:
 * - Dual Light/Dark auto-adaptive SVGs via @media (prefers-color-scheme)
 * - Official GitHub Octicons (Star, Fork, Issue, Repo Book, License)
 * - Anti-overflow multi-line text wrapping
 * - 4 Handcrafted Templates: Official Pin, Bento Telemetry, Language Distribution, Minimal Compact
 */

export const REPO_CARD_THEMES = [
  {
    id: 'auto-adaptive',
    name: 'Auto-Adaptive',
    tag: 'Dark & Light',
    bg: '#0d1117',
    border: '#30363d',
    title: '#58a6ff',
    text: '#8b949e',
    isAdaptive: true
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    tag: 'Default Dark',
    bg: '#0d1117',
    border: '#30363d',
    title: '#58a6ff',
    text: '#8b949e',
    isAdaptive: false
  },
  {
    id: 'github-light',
    name: 'GitHub Light',
    tag: 'Clean White',
    bg: '#ffffff',
    border: '#d0d7de',
    title: '#0969da',
    text: '#57606a',
    isAdaptive: false
  },
  {
    id: 'obsidian-dark',
    name: 'Obsidian Slate',
    tag: 'IDE Modern',
    bg: '#18181b',
    border: '#27272a',
    title: '#38bdf8',
    text: '#a1a1aa',
    isAdaptive: false
  },
  {
    id: 'nord-frost',
    name: 'Nord Frost',
    tag: 'Arctic Blue',
    bg: '#2e3440',
    border: '#4c566a',
    title: '#88c0d0',
    text: '#d8dee9',
    isAdaptive: false
  },
  {
    id: 'dracula-purple',
    name: 'Dracula',
    tag: 'Vampire Dark',
    bg: '#282a36',
    border: '#44475a',
    title: '#bd93f9',
    text: '#f8f8f2',
    isAdaptive: false
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    tag: 'Cyber Neon',
    bg: '#1a1b26',
    border: '#2f3549',
    title: '#7aa2f7',
    text: '#9aa5ce',
    isAdaptive: false
  }
]

export const REPO_CARD_TEMPLATES = [
  {
    id: 'official-pin',
    title: 'GitHub Official Pin',
    badge: 'README Standard',
    desc: 'Pixel-perfect replication of native GitHub repository cards with book icon, public badge, and telemetry stats.',
    icon: 'push_pin'
  },
  {
    id: 'bento-spec',
    title: 'Modern Bento Telemetry',
    badge: 'Modular Bento',
    desc: 'Linear-inspired modular bento cards with metric capsules, subtle border glow, and modern typography.',
    icon: 'grid_view'
  },
  {
    id: 'languages-distribution',
    title: 'Language Distribution Bar',
    badge: 'Tech Stack',
    desc: 'Proportional color-coded language bar with official language chips and percentage breakdown shares.',
    icon: 'donut_large'
  },
  {
    id: 'minimal-compact',
    title: 'Minimalist Compact Spec',
    badge: 'Ultra Compact',
    desc: 'Streamlined low-height card optimized for side-by-side tables, contributor sections, and multi-repo displays.',
    icon: 'view_compact'
  }
]

export const GITHUB_OCTICONS = {
  repo: 'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 0 0 1.5h2.5v1.25a.25.25 0 0 1-.25.25H4.5A2.5 2.5 0 0 1 2 14.5v-12Zm10 12V1.5H4.5a1 1 0 0 0-1 1V14.5a1 1 0 0 0 1 1H11.5a2.25 2.25 0 0 1 .5-.05Z',
  star: 'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z',
  fork: 'M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-.878Z',
  issue: 'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm9 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-.25-6.25a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0v-3.5Z',
  license: 'M8.75.75a.75.75 0 0 0-1.5 0V2h-.5C4.56 2 2.75 3.81 2.75 6.05v.2c0 .414.336.75.75.75h9a.75.75 0 0 0 .75-.75v-.2C13.25 3.81 11.44 2 9.25 2h-.5V.75Z'
}

/**
 * Escapes XML characters for safe SVG text injection
 */
export function escapeXml(str = '') {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Escapes characters for Shields.io badge URLs
 */
export function escapeShieldsText(str = '') {
  return encodeURIComponent(
    String(str ?? '')
      .trim()
      .replace(/_/g, '__')
      .replace(/-/g, '--')
      .replace(/ /g, '_')
  )
}

/**
 * Wraps text into lines based on approximate character limit per line
 */
function wrapSvgLines(text, maxChars = 52, maxLines = 2) {
  if (!text) return []
  const words = text.trim().split(/\s+/)
  const lines = []
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim()
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
      if (lines.length === maxLines - 1) {
        break
      }
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine)
  }

  if (lines.length === maxLines && words.length > lines.join(' ').split(/\s+/).length) {
    const last = lines[lines.length - 1]
    if (last.length > maxChars - 3) {
      lines[lines.length - 1] = last.slice(0, maxChars - 3) + '...'
    } else {
      lines[lines.length - 1] = last + '...'
    }
  }

  return lines
}

/**
 * Generates Adaptive CSS block for dark/light themes
 */
function getThemeCss(themeId, accentColor) {
  const selectedTheme = REPO_CARD_THEMES.find((t) => t.id === themeId) || REPO_CARD_THEMES[0]
  const accent = accentColor || selectedTheme.title

  if (selectedTheme.isAdaptive) {
    return `
    .card-bg { fill: #0d1117; stroke: #30363d; stroke-width: 1; }
    .card-title { fill: ${accent}; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .card-text { fill: #8b949e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .card-badge-bg { fill: #21262d; stroke: #30363d; }
    .card-badge-text { fill: #8b949e; }
    .card-icon { fill: #7d8590; }
    .card-star-icon { fill: #e3b341; }
    .card-chip-bg { fill: rgba(255, 255, 255, 0.04); stroke: rgba(255, 255, 255, 0.08); }
    .card-chip-text { fill: #c9d1d9; }

    @media (prefers-color-scheme: light) {
      .card-bg { fill: #ffffff; stroke: #d0d7de; }
      .card-title { fill: #0969da; }
      .card-text { fill: #57606a; }
      .card-badge-bg { fill: #f6f8fa; stroke: #d0d7de; }
      .card-badge-text { fill: #57606a; }
      .card-icon { fill: #57606a; }
      .card-chip-bg { fill: rgba(0, 0, 0, 0.03); stroke: rgba(0, 0, 0, 0.08); }
      .card-chip-text { fill: #24292f; }
    }
    `
  }

  return `
    .card-bg { fill: ${selectedTheme.bg}; stroke: ${selectedTheme.border}; stroke-width: 1; }
    .card-title { fill: ${accent}; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .card-text { fill: ${selectedTheme.text}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .card-badge-bg { fill: rgba(255, 255, 255, 0.06); stroke: ${selectedTheme.border}; }
    .card-badge-text { fill: ${selectedTheme.text}; }
    .card-icon { fill: ${selectedTheme.text}; }
    .card-star-icon { fill: #e3b341; }
    .card-chip-bg { fill: rgba(255, 255, 255, 0.04); stroke: rgba(255, 255, 255, 0.08); }
    .card-chip-text { fill: #e6edf3; }
  `
}

// =========================================================================
// 1. TEMPLATE: Official GitHub Pin (Classic Pixel-Perfect)
// =========================================================================
export function generateOfficialPinSvg({
  owner = 'owner',
  repo = 'repo',
  desc = 'Automated Documentation Platform & GitHub Repository',
  stars = '1.2k',
  forks = '240',
  issues = '12',
  license = 'MIT',
  lang = 'TypeScript',
  langColor = '#3178c6',
  accentColor = '#58a6ff',
  theme = 'auto-adaptive',
  radius = 8,
  showStats = { stars: true, forks: true, issues: false, license: true, lang: true, desc: true }
}) {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const safeDescLines = showStats.desc ? wrapSvgLines(desc, 54, 2) : []
  const safeLang = escapeXml(lang || 'Code')
  const safeStars = escapeXml(stars || '0')
  const safeForks = escapeXml(forks || '0')
  const safeLicense = escapeXml(license || 'MIT')

  const width = 500
  const height = showStats.desc && safeDescLines.length > 0 ? 150 : 110
  const footerY = height - 26

  let statX = 24
  const statItems = []

  if (showStats.lang && lang) {
    statItems.push(`
      <g transform="translate(${statX}, ${footerY})">
        <circle cx="5" cy="5" r="5" fill="${langColor || '#3178c6'}" />
        <text x="16" y="9" class="card-chip-text" font-size="11.5" font-weight="500">${safeLang}</text>
      </g>
    `)
    statX += Math.max(90, safeLang.length * 8 + 35)
  }

  if (showStats.stars) {
    statItems.push(`
      <g transform="translate(${statX}, ${footerY})">
        <path d="${GITHUB_OCTICONS.star}" class="card-star-icon" />
        <text x="18" y="9.5" class="card-text" font-size="11.5" font-weight="500">${safeStars}</text>
      </g>
    `)
    statX += 80
  }

  if (showStats.forks) {
    statItems.push(`
      <g transform="translate(${statX}, ${footerY})">
        <path d="${GITHUB_OCTICONS.fork}" class="card-icon" />
        <text x="18" y="9.5" class="card-text" font-size="11.5" font-weight="500">${safeForks}</text>
      </g>
    `)
    statX += 80
  }

  if (showStats.license && license) {
    statItems.push(`
      <g transform="translate(${statX}, ${footerY})">
        <path d="${GITHUB_OCTICONS.license}" class="card-icon" />
        <text x="16" y="9.5" class="card-text" font-size="11.5" font-weight="500">${safeLicense}</text>
      </g>
    `)
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <style>
    ${getThemeCss(theme, accentColor)}
  </style>
  <rect width="${width}" height="${height}" rx="${radius}" class="card-bg"/>

  <g transform="translate(24, 24)">
    <!-- Repo Book Icon -->
    <path d="${GITHUB_OCTICONS.repo}" class="card-icon" />
    
    <!-- Title -->
    <text x="24" y="13" class="card-title" font-size="14">${safeOwner} / ${safeRepo}</text>
    
    <!-- Public Badge -->
    <rect x="${width - 48 - 60}" y="-4" width="58" height="20" rx="10" class="card-badge-bg"/>
    <text x="${width - 48 - 31}" y="10" class="card-badge-text" font-size="10.5" font-weight="500" text-anchor="middle">Public</text>

    <!-- Description Lines -->
    ${safeDescLines.map((line, i) => `
      <text x="0" y="${40 + i * 18}" class="card-text" font-size="12">${escapeXml(line)}</text>
    `).join('')}
  </g>

  <!-- Footer Stats -->
  ${statItems.join('')}
</svg>`
}

// =========================================================================
// 2. TEMPLATE: Linear Bento Telemetry Card
// =========================================================================
export function generateBentoSpecSvg({
  owner = 'owner',
  repo = 'repo',
  desc = 'Automated Documentation Platform & GitHub Repository',
  stars = '1.2k',
  forks = '240',
  issues = '12',
  license = 'MIT',
  lang = 'TypeScript',
  langColor = '#3178c6',
  accentColor = '#6366f1',
  theme = 'auto-adaptive',
  radius = 12,
  showStats = { stars: true, forks: true, issues: true, license: true, lang: true, desc: true }
}) {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const safeDescLines = showStats.desc ? wrapSvgLines(desc, 56, 2) : []
  const accent = accentColor || '#6366f1'

  const width = 520
  const height = 180

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <style>
    ${getThemeCss(theme, accent)}
    .bento-pulse { animation: bentoPulse 2s infinite ease-in-out; }
    @keyframes bentoPulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
  </style>

  <rect width="${width}" height="${height}" rx="${radius}" class="card-bg"/>

  <!-- Top Accent Glow Line -->
  <rect x="24" y="0" width="${width - 48}" height="2" rx="1" fill="${accent}" opacity="0.8"/>

  <!-- Top Header -->
  <g transform="translate(24, 26)">
    <circle cx="6" cy="7" r="4" fill="${accent}" class="bento-pulse"/>
    <text x="18" y="11" class="card-title" font-size="15">${safeOwner} / ${safeRepo}</text>
    <rect x="${width - 48 - 68}" y="-2" width="68" height="22" rx="6" fill="${accent}18" stroke="${accent}44" stroke-width="1"/>
    <text x="${width - 48 - 34}" y="13" fill="${accent}" font-size="10.5" font-weight="600" text-anchor="middle">ACTIVE</text>
  </g>

  <!-- Description -->
  <g transform="translate(24, 58)">
    ${safeDescLines.map((line, i) => `
      <text x="0" y="${i * 18}" class="card-text" font-size="12">${escapeXml(line)}</text>
    `).join('')}
  </g>

  <!-- Modular Bento Metrics Grid -->
  <g transform="translate(24, 114)">
    <!-- Stars Capsule -->
    <rect x="0" y="0" width="108" height="42" rx="8" class="card-chip-bg"/>
    <path d="${GITHUB_OCTICONS.star}" class="card-star-icon" transform="translate(14, 13) scale(1.1)"/>
    <text x="36" y="26" class="card-chip-text" font-size="13" font-weight="700">${escapeXml(stars)}</text>
    <text x="76" y="25" class="card-text" font-size="10" font-weight="500">stars</text>

    <!-- Forks Capsule -->
    <rect x="120" y="0" width="108" height="42" rx="8" class="card-chip-bg"/>
    <path d="${GITHUB_OCTICONS.fork}" class="card-icon" transform="translate(14, 13) scale(1.1)"/>
    <text x="36" y="26" class="card-chip-text" font-size="13" font-weight="700">${escapeXml(forks)}</text>
    <text x="76" y="25" class="card-text" font-size="10" font-weight="500">forks</text>

    <!-- Issues Capsule -->
    <rect x="240" y="0" width="108" height="42" rx="8" class="card-chip-bg"/>
    <path d="${GITHUB_OCTICONS.issue}" class="card-icon" transform="translate(14, 13) scale(1.1)"/>
    <text x="36" y="26" class="card-chip-text" font-size="13" font-weight="700">${escapeXml(issues)}</text>
    <text x="68" y="25" class="card-text" font-size="10" font-weight="500">issues</text>

    <!-- Language Capsule -->
    <rect x="360" y="0" width="112" height="42" rx="8" class="card-chip-bg"/>
    <circle cx="18" cy="21" r="5" fill="${langColor || '#3178c6'}"/>
    <text x="32" y="26" class="card-chip-text" font-size="12" font-weight="600">${escapeXml(lang)}</text>
  </g>
</svg>`
}

// =========================================================================
// 3. TEMPLATE: Language Distribution (Stacked Bar & Breakdown)
// =========================================================================
export function generateLanguagesBarSvg({
  owner = 'owner',
  repo = 'repo',
  languages = [],
  stars = '1.2k',
  forks = '240',
  accentColor = '#38bdf8',
  theme = 'auto-adaptive',
  radius = 10
}) {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const accent = accentColor || '#38bdf8'

  const langs = (languages && languages.length > 0) ? languages : [
    { name: 'TypeScript', percent: 64.5, color: '#3178c6' },
    { name: 'JavaScript', percent: 23.2, color: '#f1e05a' },
    { name: 'CSS', percent: 8.8, color: '#563d7c' },
    { name: 'HTML', percent: 3.5, color: '#e34c26' }
  ]

  const width = 500
  const barWidth = 452
  let currentX = 0

  const segments = langs.map((l, i) => {
    const w = Math.max(3, (l.percent / 100) * barWidth)
    const x = currentX
    currentX += w
    return `<rect x="${x.toFixed(1)}" y="0" width="${w.toFixed(1)}" height="10" rx="${i === 0 ? 5 : (i === langs.length - 1 ? 5 : 0)}" fill="${l.color}" />`
  }).join('')

  const chips = langs.map((l, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const chipX = col * 150
    const chipY = row * 22
    return `<g transform="translate(${chipX}, ${chipY})">
      <circle cx="5" cy="5" r="4.5" fill="${l.color}" />
      <text x="15" y="8.5" class="card-chip-text" font-size="11" font-weight="600">${escapeXml(l.name)}</text>
      <text x="135" y="8.5" class="card-text" font-size="11" font-weight="500" text-anchor="end">${l.percent}%</text>
    </g>`
  }).join('')

  const rowCount = Math.ceil(langs.length / 3)
  const height = 110 + rowCount * 24

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <style>
    ${getThemeCss(theme, accent)}
  </style>

  <rect width="${width}" height="${height}" rx="${radius}" class="card-bg"/>

  <g transform="translate(24, 22)">
    <path d="${GITHUB_OCTICONS.repo}" class="card-icon" />
    <text x="24" y="13" class="card-title" font-size="14">${safeOwner} / ${safeRepo}</text>

    <!-- Star & Fork Mini Pills -->
    <g transform="translate(${width - 48 - 140}, 0)">
      <path d="${GITHUB_OCTICONS.star}" class="card-star-icon" transform="translate(0, 1) scale(0.9)"/>
      <text x="14" y="11" class="card-text" font-size="11" font-weight="600">${escapeXml(stars)}</text>
      <path d="${GITHUB_OCTICONS.fork}" class="card-icon" transform="translate(68, 1) scale(0.9)"/>
      <text x="82" y="11" class="card-text" font-size="11" font-weight="600">${escapeXml(forks)}</text>
    </g>

    <!-- Proportional Stacked Bar -->
    <g transform="translate(0, 28)">
      <rect width="${barWidth}" height="10" rx="5" fill="rgba(255, 255, 255, 0.08)" />
      ${segments}
    </g>

    <!-- Language Percentage Grid -->
    <g transform="translate(0, 52)">
      ${chips}
    </g>
  </g>
</svg>`
}

// =========================================================================
// 4. TEMPLATE: Minimalist Compact Spec
// =========================================================================
export function generateMinimalCompactSvg({
  owner = 'owner',
  repo = 'repo',
  desc = 'Automated Documentation Platform & GitHub Repository',
  stars = '1.2k',
  forks = '240',
  license = 'MIT',
  lang = 'TypeScript',
  langColor = '#3178c6',
  accentColor = '#10b981',
  theme = 'auto-adaptive',
  radius = 6
}) {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const safeDesc = escapeXml(desc.length > 60 ? desc.slice(0, 57) + '...' : desc)
  const accent = accentColor || '#10b981'

  const width = 480
  const height = 90

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <style>
    ${getThemeCss(theme, accent)}
  </style>

  <rect width="${width}" height="${height}" rx="${radius}" class="card-bg"/>

  <g transform="translate(20, 20)">
    <!-- Header Row -->
    <path d="${GITHUB_OCTICONS.repo}" class="card-icon" transform="translate(0, 1)"/>
    <text x="22" y="13" class="card-title" font-size="14">${safeOwner} / ${safeRepo}</text>

    <!-- Compact Stats Row (Right Aligned) -->
    <g transform="translate(${width - 40 - 150}, 0)">
      <circle cx="5" cy="8" r="4.5" fill="${langColor || '#3178c6'}"/>
      <text x="14" y="12" class="card-chip-text" font-size="11" font-weight="600">${escapeXml(lang)}</text>

      <path d="${GITHUB_OCTICONS.star}" class="card-star-icon" transform="translate(85, 2) scale(0.9)"/>
      <text x="99" y="12" class="card-text" font-size="11" font-weight="600">${escapeXml(stars)}</text>
    </g>

    <!-- Description Row -->
    <text x="0" y="44" class="card-text" font-size="11.5">${safeDesc}</text>
  </g>
</svg>`
}
