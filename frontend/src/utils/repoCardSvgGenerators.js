/**
 * README Studio - Native Vector SVG Repository Card Builders
 * 100% Client-side vector SVG graphics generators for repository pin cards,
 * metrics matrices, languages distribution charts, and terminal frames.
 */

// XML / HTML attribute escaping
export const escapeXml = (unsafe = '') => {
  return String(unsafe ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Shields.io text escaping
export const escapeShieldsText = (str = '') => {
  return encodeURIComponent(
    String(str ?? '')
      .trim()
      .replace(/_/g, '__')
      .replace(/-/g, '--')
      .replace(/ /g, '_')
  )
}

export const getClassicRepoPinSvg = ({ owner, repo, desc, stars, forks, lang, langColor, themeColor, license, radius = 6 }) => {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const safeDesc = escapeXml(desc.slice(0, 95) + (desc.length > 95 ? '...' : ''))
  const safeStars = escapeXml(stars)
  const safeForks = escapeXml(forks)
  const safeLang = escapeXml(lang)
  const safeLicense = escapeXml(license || 'MIT')
  const langDot = langColor || '#3178c6'
  const accent = themeColor || '#58a6ff'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 150" width="500" height="150">
  <rect width="500" height="150" rx="${radius}" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
  
  <g transform="translate(24, 24)">
    <!-- Book Repo Icon -->
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 0 0 1.5h2.5v1.25a.25.25 0 0 1-.25.25H4.5A2.5 2.5 0 0 1 2 14.5v-12Zm10 12V1.5H4.5a1 1 0 0 0-1 1V14.5a1 1 0 0 0 1 1H11.5a2.25 2.25 0 0 1 .5-.05Z" fill="#7d8590"/>
    
    <!-- Title -->
    <text x="24" y="13" fill="${accent}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="14" font-weight="600">${safeOwner} / ${safeRepo}</text>
    
    <!-- Public Badge -->
    <rect x="396" y="0" width="56" height="20" rx="10" fill="#21262d" stroke="#30363d" stroke-width="1"/>
    <text x="424" y="14" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="10.5" font-weight="500" text-anchor="middle">Public</text>
    
    <!-- Description -->
    <text x="0" y="44" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="12" font-weight="400">${safeDesc}</text>
    
    <!-- Footer Row -->
    <g transform="translate(0, 84)">
      <!-- Language -->
      <circle cx="5" cy="5" r="5" fill="${langDot}"/>
      <text x="16" y="9" fill="#c9d1d9" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="11.5" font-weight="500">${safeLang}</text>
      
      <!-- Stars -->
      <g transform="translate(130, 0)">
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" fill="#e3b341"/>
        <text x="18" y="9.5" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="11.5" font-weight="500">${safeStars}</text>
      </g>
      
      <!-- Forks -->
      <g transform="translate(210, 0)">
        <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-.878Z" fill="#7d8590"/>
        <text x="18" y="9.5" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="11.5" font-weight="500">${safeForks}</text>
      </g>
      
      <!-- License -->
      <g transform="translate(290, 0)">
        <path d="M8.75.75a.75.75 0 0 0-1.5 0V2h-.5C4.56 2 2.75 3.81 2.75 6.05v.2c0 .414.336.75.75.75h9a.75.75 0 0 0 .75-.75v-.2C13.25 3.81 11.44 2 9.25 2h-.5V.75Z" fill="#7d8590"/>
        <text x="16" y="9.5" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="11.5" font-weight="500">${safeLicense}</text>
      </g>
    </g>
  </g>
</svg>`
}

export const getLanguagesBarSvg = ({ owner, repo, languages, radius = 8 }) => {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const langs = (languages && languages.length) ? languages : [
    { name: 'TypeScript', percent: 64.5, color: '#3178c6' },
    { name: 'JavaScript', percent: 23.2, color: '#f1e05a' },
    { name: 'CSS', percent: 8.8, color: '#563d7c' },
    { name: 'HTML', percent: 3.5, color: '#e34c26' }
  ]

  let currentX = 0
  const barWidth = 452
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
    const chipY = row * 24
    return `<g transform="translate(${chipX}, ${chipY})">
      <circle cx="5" cy="5" r="4.5" fill="${l.color}" />
      <text x="15" y="8.5" fill="#c9d1d9" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="11" font-weight="500">${escapeXml(l.name)}</text>
      <text x="135" y="8.5" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="11" font-weight="400" text-anchor="end">${l.percent}%</text>
    </g>`
  }).join('')

  const height = 116 + (Math.ceil(langs.length / 3) * 24)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 ${height}" width="500" height="${height}">
  <rect width="500" height="${height}" rx="${radius}" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
  
  <g transform="translate(24, 24)">
    <text x="0" y="14" fill="#f0f6fc" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="14" font-weight="600">${safeOwner} / ${safeRepo} — Top Languages</text>
    
    <g transform="translate(0, 32)">
      <rect width="452" height="10" rx="5" fill="#21262d"/>
      ${segments}
    </g>
    
    <g transform="translate(0, 60)">
      ${chips}
    </g>
  </g>
</svg>`
}

export const getLanguagesDonutSvg = ({ owner, repo, languages, radius = 10 }) => {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const langs = (languages && languages.length) ? languages : [
    { name: 'TypeScript', percent: 64.5, color: '#3178c6' },
    { name: 'JavaScript', percent: 23.2, color: '#f1e05a' },
    { name: 'CSS', percent: 8.8, color: '#563d7c' },
    { name: 'HTML', percent: 3.5, color: '#e34c26' }
  ]

  const cx = 95
  const cy = 110
  const r = 48
  const circumference = 2 * Math.PI * r
  let accumulatedPercent = 0

  const donutPaths = langs.map((l) => {
    const strokeDasharray = `${(l.percent / 100) * circumference} ${circumference}`
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference)
    accumulatedPercent += l.percent
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${l.color}" stroke-width="18" stroke-dasharray="${strokeDasharray}" stroke-dashoffset="${strokeDashoffset}" />`
  }).join('')

  const legendItems = langs.map((l, i) => {
    const y = 55 + (i * 26)
    return `<g transform="translate(210, ${y})">
      <rect width="10" height="10" rx="3" fill="${l.color}" />
      <text x="20" y="9.5" fill="#f0f6fc" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" font-weight="500">${escapeXml(l.name)}</text>
      <text x="250" y="9.5" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" font-weight="500" text-anchor="end">${l.percent}%</text>
    </g>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
  <rect width="500" height="200" rx="${radius}" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
  
  <text x="24" y="28" fill="#f0f6fc" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="14" font-weight="600">${safeOwner} / ${safeRepo} — Language Analytics</text>
  
  <g transform="rotate(-90 ${cx} ${cy})">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#21262d" stroke-width="18"/>
    ${donutPaths}
  </g>
  <text x="${cx}" y="${cy - 4}" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="10" font-weight="600" text-anchor="middle">TOTAL</text>
  <text x="${cx}" y="${cy + 14}" fill="#f0f6fc" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="14" font-weight="700" text-anchor="middle">100%</text>

  ${legendItems}
</svg>`
}

export const getMetricsGridSvg = ({ owner, repo, stars, forks, issues, license, themeColor, radius = 10 }) => {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const safeStars = escapeXml(stars)
  const safeForks = escapeXml(forks)
  const safeIssues = escapeXml(issues || '0')
  const safeLicense = escapeXml(license || 'MIT')
  const accent = themeColor || '#6366f1'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 180" width="500" height="180">
  <rect width="500" height="180" rx="${radius}" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
  
  <text x="20" y="26" fill="#f0f6fc" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="13" font-weight="700">${safeOwner} / ${safeRepo} — Project Health Telemetry</text>

  <!-- Cell 1: Stars -->
  <g transform="translate(16, 42)">
    <rect width="110" height="118" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1"/>
    <text x="55" y="32" fill="#e3b341" font-size="18" text-anchor="middle">★</text>
    <text x="55" y="66" fill="#f0f6fc" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="20" font-weight="800" text-anchor="middle">${safeStars}</text>
    <text x="55" y="92" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="10" font-weight="600" letter-spacing="1" text-anchor="middle">STARS</text>
  </g>

  <!-- Cell 2: Forks -->
  <g transform="translate(134, 42)">
    <rect width="110" height="118" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1"/>
    <text x="55" y="32" fill="${accent}" font-size="18" text-anchor="middle">⑂</text>
    <text x="55" y="66" fill="#f0f6fc" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="20" font-weight="800" text-anchor="middle">${safeForks}</text>
    <text x="55" y="92" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="10" font-weight="600" letter-spacing="1" text-anchor="middle">FORKS</text>
  </g>

  <!-- Cell 3: Issues -->
  <g transform="translate(252, 42)">
    <rect width="110" height="118" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1"/>
    <text x="55" y="32" fill="#38bdf8" font-size="18" text-anchor="middle">☉</text>
    <text x="55" y="66" fill="#f0f6fc" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="20" font-weight="800" text-anchor="middle">${safeIssues}</text>
    <text x="55" y="92" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="10" font-weight="600" letter-spacing="1" text-anchor="middle">ISSUES</text>
  </g>

  <!-- Cell 4: License -->
  <g transform="translate(370, 42)">
    <rect width="114" height="118" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1"/>
    <text x="57" y="32" fill="#10b981" font-size="18" text-anchor="middle">⚖</text>
    <text x="57" y="66" fill="#f0f6fc" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="16" font-weight="800" text-anchor="middle">${safeLicense}</text>
    <text x="57" y="92" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="10" font-weight="600" letter-spacing="1" text-anchor="middle">LICENSE</text>
  </g>
</svg>`
}

export const getBentoSpecSvg = ({ owner, repo, desc, stars, forks, lang, langColor, themeColor, radius = 12 }) => {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const safeDesc = escapeXml(desc.slice(0, 75) + (desc.length > 75 ? '...' : ''))
  const safeStars = escapeXml(stars)
  const safeForks = escapeXml(forks)
  const safeLang = escapeXml(lang)
  const accent = themeColor || '#6366f1'
  const langDot = langColor || '#3178c6'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 210" width="500" height="210">
  <defs>
    <linearGradient id="bentoCardGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#0a0f1d" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bentoTitleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="${accent}"/>
    </linearGradient>
  </defs>
  <rect width="500" height="210" rx="${radius}" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
  <rect width="500" height="210" rx="${radius}" fill="url(#bentoCardGlow)"/>

  <!-- Left Cell: Main Info -->
  <rect x="14" y="14" width="316" height="182" rx="10" fill="#161b22" stroke="#30363d" stroke-width="1"/>
  <g transform="translate(30, 42)">
    <path d="M0 0 L4 0 C7 0 9 2 9 5 L9 18 C7 17 4 16 0 16 Z M20 0 L16 0 C13 0 11 2 11 5 L11 18 C13 17 16 16 20 16 Z" fill="none" stroke="${accent}" stroke-width="2"/>
    <text x="26" y="14" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="12" font-weight="500">${safeOwner} /</text>
    <text x="26" y="32" fill="url(#bentoTitleGrad)" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="18" font-weight="700">${safeRepo}</text>
    <text x="0" y="68" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="12" font-weight="400">${safeDesc}</text>
    
    <g transform="translate(0, 114)">
      <rect width="110" height="24" rx="12" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
      <circle cx="12" cy="12" r="4.5" fill="${langDot}"/>
      <text x="24" y="16" fill="#c9d1d9" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="11" font-weight="600">${safeLang}</text>
    </g>
    <g transform="translate(118, 114)">
      <rect width="90" height="24" rx="12" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" stroke-width="1"/>
      <text x="45" y="16" fill="#34d399" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="10.5" font-weight="700" text-anchor="middle">ACTIVE</text>
    </g>
  </g>

  <!-- Right Cell 1: Stars -->
  <rect x="338" y="14" width="148" height="86" rx="10" fill="#161b22" stroke="#30363d" stroke-width="1"/>
  <g transform="translate(354, 40)">
    <path d="M8 0 L10.5 5.5 L16.5 6.3 L12 10.5 L13.2 16.5 L8 13.5 L2.8 16.5 L4 10.5 L-0.5 6.3 L5.5 5.5 Z" fill="#e3b341"/>
    <text x="26" y="14" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="11" font-weight="600" letter-spacing="1">STARS</text>
    <text x="0" y="44" fill="#f0f6fc" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="24" font-weight="800">${safeStars}</text>
  </g>

  <!-- Right Cell 2: Forks -->
  <rect x="338" y="110" width="148" height="86" rx="10" fill="#161b22" stroke="#30363d" stroke-width="1"/>
  <g transform="translate(354, 136)">
    <path d="M4 2 A3 3 0 0 1 10 2 M4 14 A3 3 0 0 1 10 14 M7 5 L7 11" fill="none" stroke="${accent}" stroke-width="2"/>
    <text x="26" y="14" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="11" font-weight="600" letter-spacing="1">FORKS</text>
    <text x="0" y="44" fill="#f0f6fc" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="24" font-weight="800">${safeForks}</text>
  </g>
</svg>`
}

export const getGlassmorphismCardSvg = ({ owner, repo, desc, stars, forks, lang, langColor, themeColor, radius = 16 }) => {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const safeDesc = escapeXml(desc.slice(0, 95) + (desc.length > 95 ? '...' : ''))
  const safeStars = escapeXml(stars)
  const safeForks = escapeXml(forks)
  const safeLang = escapeXml(lang)
  const accent = themeColor || '#38bdf8'
  const langDot = langColor || '#3178c6'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 210" width="500" height="210">
  <defs>
    <linearGradient id="glassBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.3"/>
    </linearGradient>
    <radialGradient id="glassOrb" cx="15%" cy="20%" r="65%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#050811" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="500" height="210" rx="${radius}" fill="#0b101e"/>
  <rect width="500" height="210" rx="${radius}" fill="url(#glassOrb)"/>
  <rect width="498" height="208" x="1" y="1" rx="${radius}" fill="none" stroke="url(#glassBorder)" stroke-width="1.5"/>

  <g transform="translate(32, 36)">
    <text x="0" y="14" fill="${accent}" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">GITHUB REPOSITORY</text>
    <text x="0" y="44" fill="#ffffff" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="22" font-weight="800">${safeOwner} / ${safeRepo}</text>
    <text x="0" y="74" fill="#94a3b8" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="13" font-weight="400">${safeDesc}</text>
    
    <g transform="translate(0, 114)">
      <rect width="112" height="28" rx="14" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>
      <circle cx="14" cy="14" r="5" fill="${langDot}"/>
      <text x="26" y="18" fill="#f8fafc" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" font-weight="600">${safeLang}</text>
      
      <g transform="translate(122, 0)">
        <rect width="98" height="28" rx="14" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>
        <text x="14" y="18" fill="#e3b341" font-size="14">★</text>
        <text x="32" y="18" fill="#f8fafc" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" font-weight="700">${safeStars}</text>
      </g>
      
      <g transform="translate(228, 0)">
        <rect width="98" height="28" rx="14" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>
        <text x="14" y="18" fill="${accent}" font-size="14">⑂</text>
        <text x="32" y="18" fill="#f8fafc" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" font-weight="700">${safeForks}</text>
      </g>
    </g>
  </g>
</svg>`
}

export const getCyberpunkCardSvg = ({ owner, repo, desc, stars, forks, lang, langColor, themeColor, radius = 4 }) => {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const safeDesc = escapeXml(desc.slice(0, 80) + (desc.length > 80 ? '...' : ''))
  const safeStars = escapeXml(stars)
  const safeForks = escapeXml(forks)
  const safeLang = escapeXml(lang)
  const accent = themeColor || '#06b6d4'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 210" width="500" height="210">
  <defs>
    <pattern id="cyberGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.1"/>
      <stop offset="50%" stop-color="${accent}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.1"/>
    </linearGradient>
  </defs>
  <rect width="500" height="210" rx="${radius}" fill="#080c14"/>
  <rect width="500" height="210" rx="${radius}" fill="url(#cyberGrid)"/>
  <rect width="498" height="208" x="1" y="1" rx="${radius}" fill="none" stroke="#1e293b" stroke-width="1"/>

  <path d="M 10 24 L 10 10 L 24 10" fill="none" stroke="${accent}" stroke-width="2"/>
  <path d="M 490 24 L 490 10 L 476 10" fill="none" stroke="${accent}" stroke-width="2"/>
  <path d="M 10 186 L 10 200 L 24 200" fill="none" stroke="${accent}" stroke-width="2"/>
  <path d="M 490 186 L 490 200 L 476 200" fill="none" stroke="${accent}" stroke-width="2"/>

  <g transform="translate(30, 26)">
    <circle cx="4" cy="8" r="4" fill="#10b981"/>
    <text x="16" y="12" fill="#10b981" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="700" letter-spacing="1.5">TELEMETRY // LIVE</text>
    <text x="440" y="12" fill="#64748b" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="600" text-anchor="end">SYS.VER: 2.0</text>
  </g>

  <text x="30" y="74" fill="#ffffff" font-family="'Space Grotesk',-apple-system,sans-serif" font-size="20" font-weight="800">${safeOwner} / ${safeRepo}</text>
  <text x="30" y="98" fill="#94a3b8" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12">${safeDesc}</text>

  <path d="M 30 140 Q 60 120, 90 145 T 150 135 T 210 150 T 270 125 T 330 140 T 390 130 T 470 140" fill="none" stroke="url(#waveGrad)" stroke-width="2.5"/>

  <g transform="translate(30, 180)">
    <text x="0" y="0" fill="${accent}" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">&gt; LANG:</text>
    <text x="56" y="0" fill="#f8fafc" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="600">${safeLang}</text>

    <text x="160" y="0" fill="${accent}" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">&gt; STARS:</text>
    <text x="220" y="0" fill="#f8fafc" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="600">${safeStars}</text>

    <text x="310" y="0" fill="${accent}" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">&gt; FORKS:</text>
    <text x="370" y="0" fill="#f8fafc" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="600">${safeForks}</text>
  </g>
</svg>`
}

export const getTerminalNeofetchCardSvg = ({ owner, repo, desc, stars, forks, lang, langColor, themeColor, radius = 8 }) => {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const safeDesc = escapeXml(desc.slice(0, 50))
  const safeStars = escapeXml(stars)
  const safeForks = escapeXml(forks)
  const safeLang = escapeXml(lang)
  const accent = themeColor || '#6366f1'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 210" width="500" height="210">
  <rect width="500" height="210" rx="${radius}" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
  <rect width="500" height="30" rx="${radius}" fill="#161b22"/>
  <rect width="500" height="1" y="30" fill="#30363d"/>
  
  <circle cx="16" cy="15" r="4.5" fill="#ef4444"/>
  <circle cx="28" cy="15" r="4.5" fill="#f59e0b"/>
  <circle cx="40" cy="15" r="4.5" fill="#10b981"/>
  <text x="250" y="19" fill="#8b949e" font-family="'JetBrains Mono',monospace" font-size="11" text-anchor="middle">${safeOwner}/${safeRepo} ~ neofetch</text>

  <rect x="20" y="48" width="100" height="142" rx="6" fill="#161b22" stroke="#30363d" stroke-width="1"/>
  <text x="70" y="105" fill="${accent}" font-family="'JetBrains Mono',monospace" font-size="28" font-weight="800" text-anchor="middle">&gt;/_</text>
  <text x="70" y="140" fill="#10b981" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="700" text-anchor="middle">ONLINE</text>

  <g transform="translate(138, 55)">
    <text x="0" y="18" fill="#f0f6fc" font-family="'JetBrains Mono',monospace" font-size="14" font-weight="700">${safeRepo}</text>
    <text x="0" y="32" fill="#388bfd" font-family="'JetBrains Mono',monospace" font-size="10">------------------------------------------------</text>
    
    <text x="0" y="52" fill="${accent}" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">Owner:</text>
    <text x="75" y="52" fill="#c9d1d9" font-family="'JetBrains Mono',monospace" font-size="11">${safeOwner}</text>
    
    <text x="0" y="72" fill="${accent}" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">Stars:</text>
    <text x="75" y="72" fill="#e3b341" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">${safeStars} ★</text>
    
    <text x="0" y="92" fill="${accent}" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">Forks:</text>
    <text x="75" y="92" fill="#c9d1d9" font-family="'JetBrains Mono',monospace" font-size="11">${safeForks}</text>

    <text x="0" y="112" fill="${accent}" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">Language:</text>
    <text x="75" y="112" fill="#58a6ff" font-family="'JetBrains Mono',monospace" font-size="11">${safeLang}</text>

    <text x="0" y="132" fill="${accent}" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">Status:</text>
    <text x="75" y="132" fill="#7ee787" font-family="'JetBrains Mono',monospace" font-size="11">Production Ready</text>
  </g>
</svg>`
}

export const getAuroraGlowSvg = ({ owner, repo, desc, stars, forks, lang, langColor, themeColor, radius = 14 }) => {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const safeDesc = escapeXml(desc.slice(0, 85) + (desc.length > 85 ? '...' : ''))
  const safeStars = escapeXml(stars)
  const safeForks = escapeXml(forks)
  const safeLang = escapeXml(lang)
  const accent = themeColor || '#a855f7'
  const langDot = langColor || '#3178c6'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 210" width="500" height="210">
  <defs>
    <linearGradient id="auroraMesh" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.25"/>
    </linearGradient>
    <linearGradient id="auroraText" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="${accent}"/>
    </linearGradient>
  </defs>
  <rect width="500" height="210" rx="${radius}" fill="#090d16"/>
  <rect width="500" height="210" rx="${radius}" fill="url(#auroraMesh)"/>
  <rect width="498" height="208" x="1" y="1" rx="${radius}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>

  <g transform="translate(32, 40)">
    <text x="0" y="12" fill="${accent}" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="11" font-weight="700" letter-spacing="2">AURORA REPO PIN</text>
    <text x="0" y="42" fill="url(#auroraText)" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="22" font-weight="800">${safeOwner} / ${safeRepo}</text>
    <text x="0" y="72" fill="#94a3b8" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="13">${safeDesc}</text>

    <g transform="translate(0, 110)">
      <rect width="112" height="28" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <circle cx="14" cy="14" r="5" fill="${langDot}"/>
      <text x="26" y="18" fill="#ffffff" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" font-weight="600">${safeLang}</text>

      <g transform="translate(122, 0)">
        <rect width="96" height="28" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
        <text x="14" y="18" fill="#fbbf24" font-size="13">★</text>
        <text x="32" y="18" fill="#ffffff" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" font-weight="700">${safeStars}</text>
      </g>

      <g transform="translate(226, 0)">
        <rect width="96" height="28" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
        <text x="14" y="18" fill="${accent}" font-size="13">⑂</text>
        <text x="32" y="18" fill="#ffffff" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" font-weight="700">${safeForks}</text>
      </g>
    </g>
  </g>
</svg>`
}

export const getMinimalCleanSvg = ({ owner, repo, desc, stars, forks, lang, langColor, themeColor, radius = 10 }) => {
  const safeOwner = escapeXml(owner)
  const safeRepo = escapeXml(repo)
  const safeDesc = escapeXml(desc.slice(0, 95) + (desc.length > 95 ? '...' : ''))
  const safeStars = escapeXml(stars)
  const safeForks = escapeXml(forks)
  const safeLang = escapeXml(lang)
  const accent = themeColor || '#58a6ff'
  const langDot = langColor || '#3178c6'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 210" width="500" height="210">
  <rect width="500" height="210" rx="${radius}" fill="#0d1117" stroke="#30363d" stroke-width="1"/>

  <g transform="translate(32, 38)">
    <path d="M0 2 A3 3 0 0 1 6 2 M0 14 A3 3 0 0 1 6 14 M3 5 L3 11" fill="none" stroke="${accent}" stroke-width="2"/>
    <text x="18" y="14" fill="${accent}" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="16" font-weight="700">${safeOwner} / ${safeRepo}</text>
    <text x="0" y="54" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="13" font-weight="400">${safeDesc}</text>

    <g transform="translate(0, 114)">
      <circle cx="6" cy="6" r="6" fill="${langDot}"/>
      <text x="18" y="10" fill="#c9d1d9" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" font-weight="500">${safeLang}</text>

      <g transform="translate(120, 0)">
        <text x="0" y="10" fill="#e3b341" font-size="14">★</text>
        <text x="16" y="10" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" font-weight="500">${safeStars}</text>
      </g>

      <g transform="translate(200, 0)">
        <text x="0" y="10" fill="#8b949e" font-size="14">⑂</text>
        <text x="16" y="10" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" font-weight="500">${safeForks}</text>
      </g>
    </g>
  </g>
</svg>`
}
