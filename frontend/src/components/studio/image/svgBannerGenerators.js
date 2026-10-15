import { escapeXml } from './imageStudioConstants'

// 1. Sci-Fi HUD Telemetry (Stitch Clinical Bio-Telemetry HUD aesthetics)
export function getHudTelemetrySvg({ bannerTitle, bannerSubtitle, hudStatus, hudVersion, bannerTags, bannerTheme }) {
  const hex1 = bannerTheme?.hex1 || '#06b6d4'
  const safeTitle = escapeXml(bannerTitle)
  const safeSub = escapeXml(bannerSubtitle)
  const safeStatus = escapeXml(hudStatus)
  const safeVer = escapeXml(hudVersion)
  const tagsArr = (bannerTags || '').split(',').map((t) => escapeXml(t.trim())).filter(Boolean)
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
export function getNeofetchSvg({ bannerTitle, bannerSubtitle, neofetchOs, neofetchLicense, hudVersion, bannerTags, bannerTheme }) {
  const hex1 = bannerTheme?.hex1 || '#6366f1'
  const safeTitle = escapeXml(bannerTitle)
  const safeSub = escapeXml((bannerSubtitle || '').slice(0, 50))
  const safeOs = escapeXml(neofetchOs)
  const safeLic = escapeXml(neofetchLicense)
  const safeVer = escapeXml(hudVersion)
  const tagsArr = (bannerTags || '').split(',').map((t) => escapeXml(t.trim())).filter(Boolean).slice(0, 4).join(' • ')

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
export function getCyberpunkGridSvg({ bannerTitle, bannerSubtitle, bannerTheme }) {
  const hex1 = bannerTheme?.hex1 || '#db2777'
  const hex2 = bannerTheme?.hex2 || '#4f46e5'
  const safeTitle = escapeXml((bannerTitle || '').toUpperCase())
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
export function getSwissMinimalSvg({ bannerTitle, bannerSubtitle, bannerTags, bannerTheme }) {
  const hex1 = bannerTheme?.hex1 || '#ef4444'
  const safeTitle = escapeXml(bannerTitle)
  const safeSub = escapeXml(bannerSubtitle)
  const tagsArr = (bannerTags || '').split(',').map((t) => escapeXml(t.trim())).filter(Boolean).slice(0, 4).join(' / ')

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
export function getGlassOrbitSvg({ bannerTitle, bannerSubtitle, bannerTags, bannerTheme }) {
  const hex1 = bannerTheme?.hex1 || '#6366f1'
  const hex2 = bannerTheme?.hex2 || '#ec4899'
  const safeTitle = escapeXml(bannerTitle)
  const safeSub = escapeXml(bannerSubtitle)
  const tagsArr = (bannerTags || '').split(',').map((t) => escapeXml(t.trim())).filter(Boolean).slice(0, 5)
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
export function getGradientRibbonSvg({ bannerTitle, bannerSubtitle, bannerTags, bannerTheme }) {
  const hex1 = bannerTheme?.hex1 || '#4f46e5'
  const hex2 = bannerTheme?.hex2 || '#db2777'
  const safeTitle = escapeXml(bannerTitle)
  const safeSub = escapeXml(bannerSubtitle)
  const tagsArr = (bannerTags || '').split(',').map((t) => escapeXml(t.trim())).filter(Boolean).slice(0, 4).join(' * ')

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

export function getActiveSvgCode(bannerType, params) {
  switch (bannerType) {
    case 'hud-telemetry': return getHudTelemetrySvg(params)
    case 'neofetch': return getNeofetchSvg(params)
    case 'cyberpunk-grid': return getCyberpunkGridSvg(params)
    case 'swiss-minimal': return getSwissMinimalSvg(params)
    case 'glass-orbit': return getGlassOrbitSvg(params)
    case 'gradient-ribbon': return getGradientRibbonSvg(params)
    default: return getHudTelemetrySvg(params)
  }
}
