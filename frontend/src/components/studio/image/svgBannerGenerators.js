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

export function getActiveSvgCode(bannerTypeOrOptions, maybeParams) {
  const isObject = typeof bannerTypeOrOptions === 'object' && bannerTypeOrOptions !== null
  const bannerType = isObject ? bannerTypeOrOptions.bannerType : bannerTypeOrOptions
  const params = isObject ? bannerTypeOrOptions : (maybeParams || {})

  let svg = ''
  switch (bannerType) {
    case 'capsule': svg = getCapsuleSvg(params); break
    case 'hud-telemetry': svg = getHudTelemetrySvg(params); break
    case 'neofetch': svg = getNeofetchSvg(params); break
    case 'cyberpunk-grid': svg = getCyberpunkGridSvg(params); break
    case 'swiss-minimal': svg = getSwissMinimalSvg(params); break
    case 'glass-orbit': svg = getGlassOrbitSvg(params); break
    case 'gradient-ribbon': svg = getGradientRibbonSvg(params); break
    default: svg = getHudTelemetrySvg(params); break
  }
  return svg.split('\n').filter((line) => line.trim().length > 0).join('\n')
}
