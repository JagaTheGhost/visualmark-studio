import { escapeXml } from './imageStudioConstants'

// 1. Sci-Fi HUD Telemetry (Stitch Clinical Bio-Telemetry HUD aesthetics)
export function getHudTelemetrySvg({
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
  hudMetric3
}) {
  const hex1 = isCustomColor ? (customHex1 || '#06b6d4') : (bannerTheme?.hex1 || '#06b6d4')
  const hex2 = isCustomColor ? (customHex2 || '#3b82f6') : (bannerTheme?.hex2 || '#3b82f6')
  const safeTitle = escapeXml(bannerTitle || 'Project Title')
  const safeSub = escapeXml(bannerSubtitle || '')
  const safeStatus = escapeXml(hudStatus || 'SYSTEM NOMINAL')
  const safeVer = escapeXml(hudVersion || 'v2.4.0')

  const m1 = escapeXml(hudMetric1 || 'CPU: 12% // 4.8GHz')
  const m2 = escapeXml(hudMetric2 || 'MEM: 1.4GB / 32GB')
  const m3 = escapeXml(hudMetric3 || 'STATUS: ENCLAVE_SECURE')

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
  <line x1="40" y1="168" x2="860" y2="168" stroke="#1e293b" stroke-width="1"/>
  <!-- Telemetry Coordinate Metrics -->
  <g transform="translate(40, 188)">
    <rect width="180" height="26" rx="4" fill="#ffffff" fill-opacity="0.04" stroke="${hex1}" stroke-opacity="0.3" stroke-width="1"/>
    <text x="90" y="17" fill="#38bdf8" font-family="'JetBrains Mono',monospace" font-size="10.5" font-weight="600" text-anchor="middle">${m1}</text>
  </g>
  <g transform="translate(230, 188)">
    <rect width="180" height="26" rx="4" fill="#ffffff" fill-opacity="0.04" stroke="${hex2}" stroke-opacity="0.3" stroke-width="1"/>
    <text x="90" y="17" fill="#a78bfa" font-family="'JetBrains Mono',monospace" font-size="10.5" font-weight="600" text-anchor="middle">${m2}</text>
  </g>
  <g transform="translate(420, 188)">
    <rect width="210" height="26" rx="4" fill="#ffffff" fill-opacity="0.04" stroke="#10b981" stroke-opacity="0.3" stroke-width="1"/>
    <text x="105" y="17" fill="#34d399" font-family="'JetBrains Mono',monospace" font-size="10.5" font-weight="600" text-anchor="middle">${m3}</text>
  </g>
</svg>`
}

// 2. Neofetch CLI Terminal
export function getNeofetchSvg({
  bannerTitle,
  bannerSubtitle,
  neofetchOs,
  neofetchLicense,
  hudVersion,
  bannerTheme,
  customHex1,
  isCustomColor,
  neofetchPrompt,
  neofetchShell
}) {
  const hex1 = isCustomColor ? (customHex1 || '#6366f1') : (bannerTheme?.hex1 || '#6366f1')
  const safeTitle = escapeXml(bannerTitle || 'Project Title')
  const safeSub = escapeXml((bannerSubtitle || '').slice(0, 56))
  const safeOs = escapeXml(neofetchOs || 'Linux x86_64')
  const safeLic = escapeXml(neofetchLicense || 'MIT License')
  const safeVer = escapeXml(hudVersion || 'v1.0.0')
  const safePrompt = escapeXml(neofetchPrompt || 'user@visualmark:~#')
  const safeShell = escapeXml(neofetchShell || 'zsh 5.9 (x86_64)')

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
  <text x="450" y="21" fill="#8b949e" font-family="'JetBrains Mono',monospace" font-size="11" text-anchor="middle">${safePrompt} neofetch</text>
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
  <text x="205" y="158" fill="${hex1}" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700">Shell:</text>
  <text x="290" y="158" fill="#58a6ff" font-family="'JetBrains Mono',monospace" font-size="11">${safeShell}</text>
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
export function getCyberpunkGridSvg({ bannerTitle, bannerSubtitle, bannerTheme, customHex1, customHex2, isCustomColor }) {
  const hex1 = isCustomColor ? (customHex1 || '#db2777') : (bannerTheme?.hex1 || '#db2777')
  const hex2 = isCustomColor ? (customHex2 || '#4f46e5') : (bannerTheme?.hex2 || '#4f46e5')
  const safeTitle = escapeXml((bannerTitle || 'CYBERPUNK').toUpperCase())
  const safeSub = escapeXml(bannerSubtitle || '')

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
export function getSwissMinimalSvg({ bannerTitle, bannerSubtitle, bannerTheme, customHex1, isCustomColor }) {
  const hex1 = isCustomColor ? (customHex1 || '#ef4444') : (bannerTheme?.hex1 || '#ef4444')
  const safeTitle = escapeXml(bannerTitle || 'Project Title')
  const safeSub = escapeXml(bannerSubtitle || '')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 240" width="900" height="240">
  <!-- Minimal Dark Carbon Substrate -->
  <rect width="900" height="240" rx="4" fill="#111318"/>
  <rect width="898" height="238" x="1" y="1" rx="4" fill="none" stroke="#232730" stroke-width="1"/>
  <!-- Swiss Color Block Accent -->
  <rect x="40" y="32" width="12" height="12" fill="${hex1}"/>
  <text x="64" y="42" fill="#8b949e" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="600" letter-spacing="2">SPEC 01 // ARCHITECTURE</text>
  <!-- Title & Subtitle -->
  <text x="40" y="105" fill="#f8fafc" font-family="'Inter',-apple-system,sans-serif" font-size="38" font-weight="800" letter-spacing="-1">${safeTitle}</text>
  <text x="40" y="142" fill="#94a3b8" font-family="'Inter',-apple-system,sans-serif" font-size="15" font-weight="400">${safeSub}</text>
  <!-- Hairline Grid Divider -->
  <line x1="40" y1="174" x2="860" y2="174" stroke="#232730" stroke-width="1"/>
  <!-- Footer Specs Grid -->
  <text x="40" y="204" fill="#64748b" font-family="'JetBrains Mono',monospace" font-size="11">STANDARDS:</text>
  <text x="130" y="204" fill="#e2e8f0" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="600">PRODUCTION READY // HIGH RELIABILITY</text>
  <text x="860" y="204" fill="#64748b" font-family="'JetBrains Mono',monospace" font-size="11" text-anchor="end">OPEN SOURCE REPOSITORY</text>
</svg>`
}

// 5. Glassmorphism Tech Matrix
export function getGlassOrbitSvg({ bannerTitle, bannerSubtitle, bannerTheme, customHex1, customHex2, isCustomColor }) {
  const hex1 = isCustomColor ? (customHex1 || '#6366f1') : (bannerTheme?.hex1 || '#6366f1')
  const hex2 = isCustomColor ? (customHex2 || '#ec4899') : (bannerTheme?.hex2 || '#ec4899')
  const safeTitle = escapeXml(bannerTitle || 'Project Title')
  const safeSub = escapeXml(bannerSubtitle || '')

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
  <g transform="translate(50, 184)">
    <rect width="180" height="26" rx="6" fill="#ffffff" fill-opacity="0.06" stroke="${hex1}" stroke-opacity="0.3" stroke-width="1"/>
    <text x="90" y="17" fill="#f8fafc" font-family="'JetBrains Mono',sans-serif" font-size="10.5" font-weight="600" text-anchor="middle">MODERN DESKTOP IDE</text>
  </g>
  <g transform="translate(245, 184)">
    <rect width="180" height="26" rx="6" fill="#ffffff" fill-opacity="0.06" stroke="${hex2}" stroke-opacity="0.3" stroke-width="1"/>
    <text x="90" y="17" fill="#f8fafc" font-family="'JetBrains Mono',sans-serif" font-size="10.5" font-weight="600" text-anchor="middle">VISUALMARK STUDIO</text>
  </g>
</svg>`
}

// 6. Aurora Flowing Gradient Ribbon
export function getGradientRibbonSvg({ bannerTitle, bannerSubtitle, bannerTheme, customHex1, customHex2, isCustomColor }) {
  const hex1 = isCustomColor ? (customHex1 || '#4f46e5') : (bannerTheme?.hex1 || '#4f46e5')
  const hex2 = isCustomColor ? (customHex2 || '#db2777') : (bannerTheme?.hex2 || '#db2777')
  const safeTitle = escapeXml(bannerTitle || 'Project Title')
  const safeSub = escapeXml(bannerSubtitle || '')

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
  <text x="50" y="212" fill="#64748b" font-family="'JetBrains Mono',monospace" font-size="11">ENGINE: HIGH PERFORMANCE // ULTRA RESPONSIVE</text>
</svg>`
}

// 7. Dynamic Capsule Banner (Standalone SVG Vector & Live Fallback)
export function getCapsuleSvg({
  bannerTitle,
  bannerSubtitle,
  capsuleShape = 'waving',
  bannerTheme,
  customHex1,
  customHex2,
  isCustomColor,
  fontColor = 'ffffff',
  descColor = 'e0e7ff',
  bannerHeight = 220,
  fontSize = 70,
  descSize = 20,
  fontAlignY = 38,
  descAlignY = 60,
  capsuleAnimation = 'none'
}) {
  const h1 = isCustomColor ? (customHex1 || '#4f46e5') : (bannerTheme?.hex1 || '#4f46e5')
  const h2 = isCustomColor ? (customHex2 || '#db2777') : (bannerTheme?.hex2 || '#db2777')
  const fColor = `#${(fontColor || 'ffffff').replace('#', '')}`
  const dColor = `#${(descColor || 'e0e7ff').replace('#', '')}`
  const h = parseInt(bannerHeight, 10) || 220
  const safeTitle = escapeXml(bannerTitle || 'Project Title')
  const safeSub = escapeXml(bannerSubtitle || '')

  let shapePath = `M 0 0 L 0 ${h - 50} Q 225 ${h - 10} 450 ${h - 50} T 900 ${h - 50} L 900 0 Z`
  if (capsuleShape === 'cylinder') {
    shapePath = `M 0 0 L 0 ${h - 60} Q 450 ${h} 900 ${h - 60} L 900 0 Z`
  } else if (capsuleShape === 'soft') {
    shapePath = `M 0 0 L 0 ${h - 40} Q 450 ${h - 10} 900 ${h - 40} L 900 0 Z`
  } else if (capsuleShape === 'slice') {
    shapePath = `M 0 0 L 0 ${h - 20} L 900 ${h - 70} L 900 0 Z`
  } else if (capsuleShape === 'rect') {
    shapePath = `M 0 0 L 0 ${h} L 900 ${h} L 900 0 Z`
  } else if (capsuleShape === 'shark') {
    shapePath = `M 0 0 L 0 ${h - 30} Q 250 ${h - 90} 500 ${h - 20} T 900 ${h - 60} L 900 0 Z`
  } else if (capsuleShape === 'mountain') {
    shapePath = `M 0 0 L 0 ${h - 60} L 300 ${h - 20} L 600 ${h - 70} L 900 ${h - 30} L 900 0 Z`
  } else if (capsuleShape === 'transparent') {
    shapePath = ''
  }

  const animStyle = capsuleAnimation === 'fadeIn'
    ? `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .anim-text { animation: fadeIn 0.8s ease-in-out forwards; }`
    : capsuleAnimation === 'scaleIn'
    ? `@keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } } .anim-text { animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; transform-origin: center; }`
    : ''

  const titleY = Math.round((h * (parseInt(fontAlignY, 10) || 38)) / 100)
  const descY = Math.round((h * (parseInt(descAlignY, 10) || 60)) / 100)
  const scaledTitleSize = Math.max(24, Math.round((parseInt(fontSize, 10) || 70) * 0.72))
  const scaledDescSize = Math.max(13, Math.round((parseInt(descSize, 10) || 20) * 0.85))

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 ${h}" width="900" height="${h}">
  <defs>
    <linearGradient id="capsuleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${h1}"/>
      <stop offset="100%" stop-color="${h2}"/>
    </linearGradient>
    <style>
      ${animStyle}
      .cap-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 800; font-size: ${scaledTitleSize}px; fill: ${fColor}; }
      .cap-desc { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 500; font-size: ${scaledDescSize}px; fill: ${dColor}; }
    </style>
  </defs>
  ${shapePath ? `<path d="${shapePath}" fill="url(#capsuleGrad)"/>` : ''}
  <g class="anim-text">
    <text x="50%" y="${titleY}" text-anchor="middle" dominant-baseline="middle" class="cap-title">${safeTitle}</text>
    ${safeSub ? `<text x="50%" y="${descY}" text-anchor="middle" dominant-baseline="middle" class="cap-desc">${safeSub}</text>` : ''}
  </g>
</svg>`
}

// 8. Animated Typewriter Loop (100% Pure Vector SVG with Real Discrete Letter Typing & Erasing)
export function getTypingSvg({
  bannerTitle = 'VisualMark Studio',
  bannerSubtitle = 'Documentation Platform',
  typingLines = "Your're right; I should have included a screenshot; to demonstrate the visual features; Thanks for pointing that out !",
  typingFont = 'Fira Code',
  typingColor = '6366f1',
  typingPause = '1000',
  typingSpeed = '50',
  typingEffect = 'discrete', // 'discrete' (real character-by-character keystrokes) | 'smooth'
  typingLayout = 'clean', // 'clean' | 'terminal' | 'card'
  typingAlign = 'center', // 'center' | 'left'
  typingFontSize = '24',
  typingWidth = 750,
  typingHeight = 90,
  bannerTheme,
  customHex1,
  customHex2,
  isCustomColor
} = {}) {
  const hex = isCustomColor ? (customHex1 || '#6366f1') : (bannerTheme?.hex1 || '#6366f1')
  const color = `#${(typingColor || hex).replace('#', '')}`

  const rawLines = (typingLines || `${bannerTitle};${bannerSubtitle}`)
    .split(';')
    .map((l) => l.trim())
    .filter(Boolean)
  const lines = rawLines.length > 0 ? rawLines : [bannerTitle || 'VisualMark Studio']
  const N = lines.length

  const isClean = typingLayout === 'clean'
  const isTerminal = typingLayout === 'terminal'
  const isCard = typingLayout === 'card'

  const fontSize = parseInt(typingFontSize, 10) || (isClean ? 24 : 22)
  const charWidth = fontSize * 0.6

  const width = parseInt(typingWidth, 10) || (isClean ? 750 : 850)
  const height = parseInt(typingHeight, 10) || (isClean ? 90 : 160)
  const align = typingAlign || (isClean ? 'center' : 'left')

  const textY = isClean
    ? Math.round(height / 2) + Math.round(fontSize * 0.35)
    : 92
  const cursorY = isClean
    ? Math.round(height / 2) - Math.round(fontSize * 0.6)
    : 70
  const cursorHeight = Math.round(fontSize * 1.2)
  const cursorWidth = Math.max(3, Math.round(fontSize * 0.45))

  let defsContent = ''
  let linesContent = ''

  lines.forEach((lineText, idx) => {
    const escaped = escapeXml(lineText)
    const chars = Math.max(1, lineText.length)
    const speed = parseInt(typingSpeed, 10) || 45

    const typeDur = Math.max(700, chars * speed)
    const pauseDur = parseInt(typingPause, 10) || 1000
    const deleteDur = Math.max(350, Math.round(typeDur * 0.35))
    const totalLineMs = typeDur + pauseDur + deleteDur

    const t1 = (typeDur / totalLineMs).toFixed(3)
    const t2 = ((typeDur + pauseDur) / totalLineMs).toFixed(3)

    const prevIdx = (idx - 1 + N) % N
    const isSingle = N === 1
    const beginVal = isSingle
      ? '0s;anim0.end'
      : idx === 0
      ? `0s;anim${prevIdx}.end`
      : `anim${prevIdx}.end`

    const repeatAttr = isSingle ? ' repeatCount="indefinite"' : ''

    let textX
    let startX
    let endX
    let textAnchor
    const textPixelWidth = Math.round(chars * charWidth)

    if (align === 'center') {
      textX = Math.round(width / 2)
      textAnchor = 'middle'
      startX = Math.round(textX - textPixelWidth / 2)
      endX = startX + textPixelWidth
    } else {
      textX = isTerminal ? 56 : 32
      textAnchor = 'start'
      startX = textX
      endX = startX + textPixelWidth
    }

    const clipX = startX - 2
    const calcMode = typingEffect === 'smooth' ? 'linear' : 'discrete'

    let widthValues = ''
    let cursorValues = ''
    let keyTimes = ''

    if (typingEffect === 'smooth') {
      const maxClipW = textPixelWidth + 14
      widthValues = `0; ${maxClipW}; ${maxClipW}; 0`
      cursorValues = `${startX}; ${endX}; ${endX}; ${startX}`
      keyTimes = `0; ${t1}; ${t2}; 1`
    } else {
      // Real mechanical typewriter discrete character-by-character step values
      const wList = [0]
      const cList = [startX]
      const ktList = [0]

      // Keystroke typing phase: each character reveals discretely one by one
      for (let c = 1; c <= chars; c++) {
        const w = Math.round(c * charWidth)
        wList.push(w)
        cList.push(startX + w)
        const t = ((c / chars) * typeDur) / totalLineMs
        ktList.push(t)
      }

      // Pause duration hold at fully typed line
      const pauseEndT = (typeDur + pauseDur) / totalLineMs
      wList.push(textPixelWidth + 4)
      cList.push(endX)
      ktList.push(pauseEndT)

      // Deleting phase: backspacing character by character
      for (let c = chars - 1; c >= 1; c--) {
        const w = Math.round(c * charWidth)
        wList.push(w)
        cList.push(startX + w)
        const progress = (chars - c) / chars
        const t = (typeDur + pauseDur + progress * deleteDur) / totalLineMs
        ktList.push(Math.min(0.9999, t))
      }

      // Final reset step: 0 characters
      wList.push(0)
      cList.push(startX)
      ktList.push(1)

      // Monotonic guard for keyTimes
      for (let k = 1; k < ktList.length; k++) {
        if (ktList[k] < ktList[k - 1]) {
          ktList[k] = ktList[k - 1]
        }
      }

      widthValues = wList.join('; ')
      cursorValues = cList.join('; ')
      keyTimes = ktList.map((t) => Number(t.toFixed(4))).join('; ')
    }

    defsContent += `
    <clipPath id="typing-clip-${idx}">
      <rect x="${clipX}" y="0" width="0" height="${height}">
        <animate
          id="anim${idx}"
          attributeName="width"
          begin="${beginVal}"
          dur="${totalLineMs}ms"
          fill="remove"
          calcMode="${calcMode}"
          values="${widthValues}"
          keyTimes="${keyTimes}"${repeatAttr}
        />
      </rect>
    </clipPath>`

    linesContent += `
    <g clip-path="url(#typing-clip-${idx})">
      <text
        x="${textX}"
        y="${textY}"
        fill="${color}"
        font-family="'${escapeXml(typingFont)}', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        font-size="${fontSize}px"
        font-weight="600"
        text-anchor="${textAnchor}"
      >${escaped}</text>
    </g>

    <g opacity="0">
      <animate
        attributeName="opacity"
        begin="${beginVal}"
        dur="${totalLineMs}ms"
        fill="remove"
        values="1; 1; 1; 0"
        keyTimes="0; 0.98; 0.99; 1"${repeatAttr}
      />
      <rect
        x="${startX}"
        y="${cursorY}"
        width="${cursorWidth}"
        height="${cursorHeight}"
        rx="2"
        fill="${color}"
      >
        <animate
          attributeName="x"
          begin="${beginVal}"
          dur="${totalLineMs}ms"
          fill="remove"
          calcMode="${calcMode}"
          values="${cursorValues}"
          keyTimes="${keyTimes}"${repeatAttr}
        />
        <animate
          attributeName="opacity"
          values="1; 0; 1"
          dur="700ms"
          repeatCount="indefinite"
        />
      </rect>
    </g>`
  })

  let backgroundMarkup = ''
  if (isTerminal) {
    backgroundMarkup = `
  <rect width="${width}" height="${height}" rx="10" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
  <rect width="${width}" height="36" rx="10" fill="#161b22"/>
  <rect y="26" width="${width}" height="10" fill="#161b22"/>
  <circle cx="24" cy="18" r="4.5" fill="#ff5f56"/>
  <circle cx="38" cy="18" r="4.5" fill="#ffbd2e"/>
  <circle cx="52" cy="18" r="4.5" fill="#27c93f"/>
  <text x="${Math.round(width / 2)}" y="22" fill="#8b949e" font-family="ui-monospace,monospace" font-size="11" font-weight="600" text-anchor="middle">terminal ~ zsh</text>
  <text x="32" y="${textY}" fill="#38bdf8" font-family="'${escapeXml(typingFont)}', monospace" font-size="${Math.round(fontSize * 0.9)}" font-weight="700">❯</text>`
  } else if (isCard) {
    backgroundMarkup = `
  <rect width="${width}" height="${height}" rx="12" fill="#090d16" stroke="${color}" stroke-width="1.5" stroke-opacity="0.3"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="11" fill="none" stroke="url(#cardGrad)" stroke-width="1" stroke-opacity="0.6"/>`
    defsContent += `
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.1"/>
    </linearGradient>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>${defsContent}
  </defs>
  ${backgroundMarkup}
  ${linesContent}
</svg>`
}

// 9. Geometric Polygon & Crystal Mesh Cover (100% Pure Vector SVG)
export function getGeometricMeshSvg({
  bannerTitle,
  bannerSubtitle,
  bannerTheme,
  customHex1,
  customHex2,
  isCustomColor
}) {
  const h1 = isCustomColor ? (customHex1 || '#4f46e5') : (bannerTheme?.hex1 || '#4f46e5')
  const h2 = isCustomColor ? (customHex2 || '#db2777') : (bannerTheme?.hex2 || '#db2777')
  const safeTitle = escapeXml(bannerTitle || 'Project Title')
  const safeSub = escapeXml(bannerSubtitle || 'Modern Vector Architecture')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 240" width="900" height="240">
  <defs>
    <linearGradient id="meshGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${h1}"/>
      <stop offset="100%" stop-color="${h2}"/>
    </linearGradient>
    <linearGradient id="meshGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${h2}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${h1}" stop-opacity="0.3"/>
    </linearGradient>
    <radialGradient id="meshGlow" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>
    </radialGradient>
  </defs>
  <rect width="900" height="240" rx="12" fill="#090d16"/>
  <!-- Faceted Geometric Vector Mesh -->
  <polygon points="0,0 300,0 200,140 0,100" fill="url(#meshGrad1)" fill-opacity="0.35"/>
  <polygon points="300,0 600,0 520,120 200,140" fill="url(#meshGrad2)" fill-opacity="0.25"/>
  <polygon points="600,0 900,0 900,110 520,120" fill="url(#meshGrad1)" fill-opacity="0.4"/>
  <polygon points="0,100 200,140 120,240 0,240" fill="url(#meshGrad2)" fill-opacity="0.3"/>
  <polygon points="200,140 520,120 460,240 120,240" fill="url(#meshGrad1)" fill-opacity="0.2"/>
  <polygon points="520,120 900,110 900,240 460,240" fill="url(#meshGrad2)" fill-opacity="0.35"/>
  <rect width="900" height="240" rx="12" fill="url(#meshGlow)"/>
  <rect width="898" height="238" x="1" y="1" rx="11" fill="none" stroke="#334155" stroke-opacity="0.4" stroke-width="1"/>
  <!-- Typography Stage -->
  <g transform="translate(450, 105)" text-anchor="middle">
    <text y="0" fill="#ffffff" font-family="'Space Grotesk', -apple-system, sans-serif" font-size="38" font-weight="800" letter-spacing="-0.5">${safeTitle}</text>
    <text y="38" fill="#cbd5e1" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="16" font-weight="500">${safeSub}</text>
  </g>
</svg>`
}

// 10. Device Frame Vector Mockup (macOS / Browser / Terminal in Pure SVG)
export function getMockupSvg({
  macWindowTitle = 'VisualMark Studio',
  browserUrl = 'https://visualmark.dev',
  terminalCommand = '$ npm run build',
  frameStyle = 'mac-window',
  bannerTheme,
  customHex1,
  customHex2,
  isCustomColor
}) {
  const h1 = isCustomColor ? (customHex1 || '#38bdf8') : (bannerTheme?.hex1 || '#38bdf8')
  const h2 = isCustomColor ? (customHex2 || '#818cf8') : (bannerTheme?.hex2 || '#818cf8')
  const safeTitle = escapeXml(macWindowTitle || 'Application Preview')
  const safeUrl = escapeXml(browserUrl || 'https://visualmark.dev')
  const safeCmd = escapeXml(terminalCommand || '$ npm run start')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 320" width="900" height="320">
  <defs>
    <linearGradient id="mockupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${h1}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${h2}" stop-opacity="0.04"/>
    </linearGradient>
    <filter id="mockupShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect x="20" y="20" width="860" height="280" rx="10" fill="#0d1117" stroke="#30363d" stroke-width="1" filter="url(#mockupShadow)"/>
  <rect x="20" y="20" width="860" height="38" rx="10" fill="#161b22"/>
  <rect x="20" y="48" width="860" height="10" fill="#161b22"/>
  <!-- Traffic Light Window Controls -->
  <circle cx="44" cy="39" r="5" fill="#ff5f56"/>
  <circle cx="60" cy="39" r="5" fill="#ffbd2e"/>
  <circle cx="76" cy="39" r="5" fill="#27c93f"/>
  ${frameStyle === 'browser-bar' ? `
    <rect x="200" y="28" width="500" height="22" rx="4" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
    <text x="450" y="43" fill="#8b949e" font-family="ui-monospace, monospace" font-size="11" text-anchor="middle">🔒 ${safeUrl}</text>
  ` : `
    <text x="450" y="44" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600" text-anchor="middle">${safeTitle}</text>
  `}
  <!-- Interior Canvas -->
  <rect x="21" y="58" width="858" height="241" rx="0 0 10 10" fill="url(#mockupGrad)"/>
  <!-- Vector Code/Output Content -->
  <g transform="translate(60, 100)">
    <text x="0" y="0" fill="#10b981" font-family="ui-monospace, monospace" font-size="13" font-weight="600">${safeCmd}</text>
    <text x="0" y="28" fill="#58a6ff" font-family="ui-monospace, monospace" font-size="12">✔ Compiled visual assets in 18ms</text>
    <text x="0" y="50" fill="#e6edf3" font-family="ui-monospace, monospace" font-size="12">  ➜  Assets:  dist/assets/ (100% Vector SVG Engine)</text>
    <text x="0" y="72" fill="#8b949e" font-family="ui-monospace, monospace" font-size="12">  ➜  Status:  READY • 0 vulnerabilities • High-DPI Crisp</text>
    <text x="0" y="100" fill="#38bdf8" font-family="ui-monospace, monospace" font-size="12">✔ Live vector preview running on localhost</text>
  </g>
</svg>`
}

// 11. Motion & Video Demo Player Card
export function getMotionDemoCardSvg({
  motionTitle,
  motionCaption,
  motionUrl,
  motionType,
  bannerTheme,
  customHex1,
  customHex2,
  isCustomColor
}) {
  const hex1 = isCustomColor ? (customHex1 || '#6366f1') : (bannerTheme?.hex1 || '#6366f1')
  const hex2 = isCustomColor ? (customHex2 || '#a855f7') : (bannerTheme?.hex2 || '#a855f7')
  const safeTitle = escapeXml(motionTitle || 'Interactive Product Demonstration')
  const safeCaption = escapeXml(motionCaption || 'Watch the high-performance developer workflow in action')
  const safeType = escapeXml((motionType || 'Demo').toUpperCase())

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 420" width="900" height="420">
  <defs>
    <linearGradient id="motionBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="motionAccent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${hex1}"/>
      <stop offset="100%" stop-color="${hex2}"/>
    </linearGradient>
    <radialGradient id="motionGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${hex1}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${hex1}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Frame Background -->
  <rect width="900" height="420" rx="12" fill="url(#motionBg)"/>
  <rect width="898" height="418" x="1" y="1" rx="11" fill="none" stroke="#334155" stroke-width="1.5"/>

  <!-- Top Window Header Bar -->
  <path d="M 1 12 C 1 5.925 5.925 1 12 1 L 888 1 C 894.075 1 899 5.925 899 12 L 899 44 L 1 44 Z" fill="#1e293b"/>
  <line x1="1" y1="44" x2="899" y2="44" stroke="#334155" stroke-width="1"/>

  <!-- Window Dots -->
  <circle cx="24" cy="22" r="5.5" fill="#ef4444"/>
  <circle cx="42" cy="22" r="5.5" fill="#f59e0b"/>
  <circle cx="60" cy="22" r="5.5" fill="#10b981"/>

  <!-- Title & Mode Badge in Window Header -->
  <text x="84" y="27" fill="#f1f5f9" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600">${safeTitle}</text>
  <rect x="780" y="12" width="96" height="20" rx="10" fill="#0f172a"/>
  <text x="828" y="26" fill="#38bdf8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10.5" font-weight="700" text-anchor="middle">▶ ${safeType}</text>

  <!-- Player Canvas / Central Viewport -->
  <rect x="24" y="64" width="852" height="280" rx="8" fill="#090d16"/>
  <circle cx="450" cy="204" r="140" fill="url(#motionGlow)"/>

  <!-- Central Play Button with Outer Pulse Ring -->
  <circle cx="450" cy="204" r="42" fill="none" stroke="${hex1}" stroke-width="2" stroke-opacity="0.6"/>
  <circle cx="450" cy="204" r="34" fill="url(#motionAccent)"/>
  <polygon points="443,190 443,218 465,204" fill="#ffffff"/>

  <!-- Subtitle Caption -->
  <text x="450" y="266" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" text-anchor="middle">${safeCaption}</text>

  <!-- Player Controls Bar -->
  <g transform="translate(24, 362)">
    <!-- Scrubber Timeline Background -->
    <rect x="0" y="0" width="852" height="5" rx="2.5" fill="#334155"/>
    <rect x="0" y="0" width="340" height="5" rx="2.5" fill="url(#motionAccent)"/>
    <circle cx="340" cy="2.5" r="5" fill="#ffffff"/>

    <!-- Bottom Action Row -->
    <text x="0" y="26" fill="#64748b" font-family="ui-monospace, monospace" font-size="11">01:24 / 03:45</text>
    <rect x="740" y="14" width="44" height="18" rx="4" fill="#1e293b"/>
    <text x="762" y="27" fill="#cbd5e1" font-family="ui-monospace, monospace" font-size="10" font-weight="700" text-anchor="middle">1080p</text>
    <rect x="792" y="14" width="60" height="18" rx="4" fill="#1e293b"/>
    <text x="822" y="27" fill="#10b981" font-family="ui-monospace, monospace" font-size="10" font-weight="700" text-anchor="middle">60 FPS</text>
  </g>
</svg>`
}

// 12. Theme Adaptive Graphic (Dual Dark & Light Mode)
export function getAdaptiveThemeSvg({
  adaptiveAlt,
  bannerTheme,
  customHex1,
  customHex2,
  isCustomColor
}) {
  const hex1 = isCustomColor ? (customHex1 || '#6366f1') : (bannerTheme?.hex1 || '#6366f1')
  const hex2 = isCustomColor ? (customHex2 || '#06b6d4') : (bannerTheme?.hex2 || '#06b6d4')
  const safeAlt = escapeXml(adaptiveAlt || 'VisualMark Theme Adaptive Interface')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 280" width="900" height="280">
  <style>
    .adaptive-bg { fill: #0f172a; }
    .adaptive-card { fill: #1e293b; stroke: #334155; }
    .adaptive-title { fill: #f8fafc; }
    .adaptive-sub { fill: #94a3b8; }
    .adaptive-badge { fill: #020617; stroke: #475569; }
    .adaptive-badge-txt { fill: #38bdf8; }
    @media (prefers-color-scheme: light) {
      .adaptive-bg { fill: #f8fafc; }
      .adaptive-card { fill: #ffffff; stroke: #e2e8f0; }
      .adaptive-title { fill: #0f172a; }
      .adaptive-sub { fill: #64748b; }
      .adaptive-badge { fill: #f1f5f9; stroke: #cbd5e1; }
      .adaptive-badge-txt { fill: #0284c7; }
    }
  </style>
  <defs>
    <linearGradient id="adaptGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${hex1}"/>
      <stop offset="100%" stop-color="${hex2}"/>
    </linearGradient>
  </defs>

  <rect width="900" height="280" rx="12" class="adaptive-bg"/>
  <rect width="852" height="232" x="24" y="24" rx="10" class="adaptive-card" stroke-width="1.5"/>

  <!-- Accent Indicator Top Strip -->
  <path d="M 24 34 C 24 28.477 28.477 24 34 24 L 866 24 C 871.523 24 876 28.477 876 34 L 876 38 L 24 38 Z" fill="url(#adaptGrad)"/>

  <!-- Content Group -->
  <g transform="translate(64, 86)">
    <rect x="0" y="0" width="130" height="24" rx="12" class="adaptive-badge" stroke-width="1"/>
    <text x="65" y="16" class="adaptive-badge-txt" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">THEME ADAPTIVE</text>

    <text x="0" y="56" class="adaptive-title" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800">${safeAlt}</text>
    <text x="0" y="86" class="adaptive-sub" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14">Seamlessly responds to system and GitHub dark &amp; light theme preferences.</text>

    <g transform="translate(0, 114)">
      <circle cx="6" cy="6" r="4" fill="#10b981"/>
      <text x="18" y="10" class="adaptive-sub" font-family="ui-monospace, monospace" font-size="12">Automatic Vector Media Queries Enabled (@media prefers-color-scheme)</text>
    </g>
  </g>
</svg>`
}

// 13. Comparison Matrix Graphic (Before & After)
export function getComparisonMatrixSvg({
  compTitle1,
  compTitle2,
  bannerTheme,
  customHex1,
  customHex2,
  isCustomColor
}) {
  const hex1 = isCustomColor ? (customHex1 || '#ef4444') : '#f43f5e'
  const hex2 = isCustomColor ? (customHex2 || '#10b981') : '#10b981'
  const t1 = escapeXml(compTitle1 || 'Standard / Before')
  const t2 = escapeXml(compTitle2 || 'Optimized / After')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 320" width="900" height="320">
  <defs>
    <linearGradient id="compBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>

  <rect width="900" height="320" rx="12" fill="url(#compBg)"/>
  <rect width="898" height="318" x="1" y="1" rx="11" fill="none" stroke="#1e293b" stroke-width="1.5"/>

  <!-- Left Column: Before -->
  <g transform="translate(24, 24)">
    <rect width="406" height="272" rx="8" fill="#111827" stroke="#374151" stroke-width="1"/>
    <path d="M 0 8 C 0 3.58 3.58 0 8 0 L 398 0 C 402.42 0 406 3.58 406 8 L 406 36 L 0 36 Z" fill="#1f2937"/>
    <circle cx="20" cy="18" r="4" fill="${hex1}"/>
    <text x="34" y="22" fill="#f87171" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700">BEFORE</text>
    <text x="20" y="74" fill="#f3f4f6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600">${t1}</text>
    <text x="20" y="106" fill="#9ca3af" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13">• Complex manual configuration</text>
    <text x="20" y="134" fill="#9ca3af" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13">• Inconsistent visual assets</text>
    <text x="20" y="162" fill="#9ca3af" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13">• Broken relative paths and broken links</text>
    <rect x="20" y="214" width="120" height="26" rx="13" fill="#374151"/>
    <text x="80" y="231" fill="#e5e7eb" font-family="ui-monospace, monospace" font-size="11" font-weight="600" text-anchor="middle">Legacy State</text>
  </g>

  <!-- VS Badge -->
  <circle cx="450" cy="160" r="22" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <text x="450" y="165" fill="#38bdf8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="900" text-anchor="middle">VS</text>

  <!-- Right Column: After -->
  <g transform="translate(470, 24)">
    <rect width="406" height="272" rx="8" fill="#064e3b" fill-opacity="0.25" stroke="#059669" stroke-width="1.5"/>
    <path d="M 0 8 C 0 3.58 3.58 0 8 0 L 398 0 C 402.42 0 406 3.58 406 8 L 406 36 L 0 36 Z" fill="#064e3b" fill-opacity="0.6"/>
    <circle cx="20" cy="18" r="4" fill="${hex2}"/>
    <text x="34" y="22" fill="#34d399" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700">AFTER</text>
    <text x="20" y="74" fill="#ecfdf5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600">${t2}</text>
    <text x="20" y="106" fill="#a7f3d0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13">✔ Automated 1-Click Studio generation</text>
    <text x="20" y="134" fill="#a7f3d0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13">✔ Crisp vector SVGs with High-DPI support</text>
    <text x="20" y="162" fill="#a7f3d0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13">✔ Verified links and production badges</text>
    <rect x="20" y="214" width="130" height="26" rx="13" fill="#047857"/>
    <text x="85" y="231" fill="#ffffff" font-family="ui-monospace, monospace" font-size="11" font-weight="700" text-anchor="middle">✨ Production Ready</text>
  </g>
</svg>`
}

export function getActiveSvgCode(bannerTypeOrOptions, maybeParams) {
  const isObject = typeof bannerTypeOrOptions === 'object' && bannerTypeOrOptions !== null
  const bannerType = isObject ? bannerTypeOrOptions.bannerType : bannerTypeOrOptions
  const params = isObject ? bannerTypeOrOptions : (maybeParams || {})

  let svg = ''
  switch (bannerType) {
    case 'capsule': svg = getCapsuleSvg(params); break
    case 'typing': svg = getTypingSvg(params); break
    case 'geometric-mesh':
    case 'cover': svg = getGeometricMeshSvg(params); break
    case 'hud-telemetry': svg = getHudTelemetrySvg(params); break
    case 'neofetch': svg = getNeofetchSvg(params); break
    case 'cyberpunk-grid': svg = getCyberpunkGridSvg(params); break
    case 'swiss-minimal': svg = getSwissMinimalSvg(params); break
    case 'glass-orbit': svg = getGlassOrbitSvg(params); break
    case 'gradient-ribbon': svg = getGradientRibbonSvg(params); break
    case 'mockup': svg = getMockupSvg(params); break
    case 'motion': svg = getMotionDemoCardSvg(params); break
    case 'adaptive': svg = getAdaptiveThemeSvg(params); break
    case 'comparison': svg = getComparisonMatrixSvg(params); break
    default: svg = getCapsuleSvg(params); break
  }
  return svg.split('\n').filter((line) => line.trim().length > 0).join('\n')
}
