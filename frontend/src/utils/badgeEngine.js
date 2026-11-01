/**
 * VisualMark Studio - Badge Engine
 * Pure generator utilities for Shields.io URLs, Badgen.net URLs, SkillIcons,
 * local native SVG rendering, snippet formatters, and export routines.
 */

/**
 * Escapes characters for Shields.io URL path segments
 * Replaces '-' with '--', '_' with '__', and ' ' with '_'
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
 * Sanitizes hex color codes (removes leading #, trims)
 */
export function cleanHexColor(hex = '', fallback = '6366f1') {
  if (!hex) return fallback
  const cleaned = String(hex).replace(/#/g, '').trim()
  return cleaned.length > 0 ? cleaned : fallback
}

/**
 * Determines whether text over a given hex color should be white or black
 */
export function getContrastTextColor(hex = '6366f1') {
  const clean = cleanHexColor(hex, '6366f1')
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 150 ? '#000000' : '#ffffff'
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16)
    const g = parseInt(clean.substring(2, 4), 16)
    const b = parseInt(clean.substring(4, 6), 16)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 150 ? '#000000' : '#ffffff'
  }
  return '#ffffff'
}

/**
 * Generates Shields.io image URL for single badge
 */
export function generateShieldsBadgeUrl({
  formatType = 'brand-plate',
  plateTitle = '',
  label = '',
  message = '',
  color = '6366f1',
  labelColor = '',
  twoTone = false,
  style = 'for-the-badge',
  logo = '',
  logoColor = 'white',
  logoWidth = ''
}) {
  const cleanC = cleanHexColor(color, '6366f1')

  if (formatType === 'brand-plate') {
    const text = escapeShieldsText(plateTitle || label || 'brand')
    let url = `https://img.shields.io/badge/${text}-${cleanC}?style=${style}`
    if (logo && logo.trim()) {
      url += `&logo=${encodeURIComponent(logo.trim())}`
      if (logoColor) url += `&logoColor=${encodeURIComponent(logoColor)}`
      if (logoWidth) url += `&logoWidth=${encodeURIComponent(logoWidth)}`
    }
    return url
  }

  if (formatType === 'icon-only') {
    let url = `https://img.shields.io/badge/--${cleanC}?style=${style}`
    if (logo && logo.trim()) {
      url += `&logo=${encodeURIComponent(logo.trim())}&logoColor=${encodeURIComponent(logoColor || 'white')}`
      if (logoWidth) url += `&logoWidth=${encodeURIComponent(logoWidth)}`
    }
    return url
  }

  if (formatType === 'badgen') {
    const bLabel = encodeURIComponent(label.trim() || 'badge')
    const bStatus = encodeURIComponent(message.trim() || 'status')
    return `https://badgen.net/badge/${bLabel}/${bStatus}/${cleanC}`
  }

  // Dual Segment 'split'
  const cleanL = escapeShieldsText(label || 'badge')
  const cleanM = escapeShieldsText(message || 'value')
  let url = `https://img.shields.io/badge/${cleanL}-${cleanM}-${cleanC}?style=${style}`
  if (twoTone && labelColor && labelColor.trim()) {
    url += `&labelColor=${encodeURIComponent(cleanHexColor(labelColor))}`
  }
  if (logo && logo.trim()) {
    url += `&logo=${encodeURIComponent(logo.trim())}`
    if (logoColor) url += `&logoColor=${encodeURIComponent(logoColor)}`
    if (logoWidth) url += `&logoWidth=${encodeURIComponent(logoWidth)}`
  }
  return url
}

/**
 * Builds item URL for items inside a Rack
 */
export function getRackBadgeUrl(b, fallbackStyle = 'for-the-badge') {
  const format = b.format || (b.message ? 'split' : 'brand-plate')
  const bC = cleanHexColor(b.color, '6366f1')
  const bStyle = b.style || fallbackStyle
  const logoParam = b.logo
    ? `&logo=${encodeURIComponent(b.logo)}&logoColor=${encodeURIComponent(b.logoColor || 'white')}`
    : ''

  if (format === 'brand-plate') {
    const text = escapeShieldsText(b.title || b.label || 'stack')
    return `https://img.shields.io/badge/${text}-${bC}?style=${bStyle}${logoParam}`
  }
  if (format === 'icon-only') {
    return `https://img.shields.io/badge/--${bC}?style=${bStyle}${logoParam}`
  }
  // split
  const bL = escapeShieldsText(b.label || 'tech')
  const bM = escapeShieldsText(b.message || 'ready')
  let url = `https://img.shields.io/badge/${bL}-${bM}-${bC}?style=${bStyle}`
  if (b.labelColor) {
    url += `&labelColor=${encodeURIComponent(cleanHexColor(b.labelColor))}`
  }
  return url + logoParam
}

/**
 * Generates SkillIcons.dev URL
 */
export function generateSkillIconsUrl(selectedIcons = [], theme = 'dark', perLine = '10') {
  const iconsParam = (selectedIcons || []).join(',')
  return `https://skillicons.dev/icons?i=${iconsParam}&theme=${theme}&perline=${perLine}`
}

/**
 * Generates dynamic GitHub Metric Badge URL
 */
export function generateGithubMetricUrl(metric, cleanRepo = 'facebook/react', style = 'for-the-badge') {
  if (!metric) return ''
  if (metric.id === 'actions') {
    return `https://img.shields.io/github/actions/workflow/status/${cleanRepo}/${metric.workflow || 'ci.yml'}?style=${style}&logo=githubactions&logoColor=white`
  }
  return `https://img.shields.io/github/${metric.path}/${cleanRepo}?style=${style}`
}

/**
 * Markdown & HTML formatting helpers
 */
export function formatSingleBadgeMarkdown({ url, alt = 'Badge', link = '' }) {
  const safeAlt = alt.replace(/[\[\]]/g, '')
  if (link && link.trim()) {
    return `[![${safeAlt}](${url})](${link.trim()})`
  }
  return `![${safeAlt}](${url})`
}

export function formatSingleBadgeHtml({ url, alt = 'Badge', link = '' }) {
  const safeAlt = alt.replace(/["']/g, '')
  if (link && link.trim()) {
    return `<a href="${link.trim()}" target="_blank" rel="noopener noreferrer"><img src="${url}" alt="${safeAlt}" /></a>`
  }
  return `<img src="${url}" alt="${safeAlt}" />`
}

export function formatRackMarkdown(rackBadges = [], rackLayout = 'center-div', fallbackStyle = 'for-the-badge') {
  if (!rackBadges || rackBadges.length === 0) return '<!-- Empty Badge Rack -->'

  const items = rackBadges.map((b) => {
    const url = getRackBadgeUrl(b, fallbackStyle)
    const alt = b.title || `${b.label} ${b.message}`.trim() || 'Tech'
    return b.link ? `[![${alt}](${url})](${b.link})` : `![${alt}](${url})`
  })

  if (rackLayout === 'center-div') {
    return `<div align="center">\n\n${items.join('\n')}\n\n</div>`
  }
  if (rackLayout === 'paragraph') {
    return `<p align="center">\n  ${items.join('\n  ')}\n</p>`
  }
  if (rackLayout === 'table') {
    const headers = '| Technology | Status / Badge | Role |\n| :--- | :---: | :--- |'
    const rows = rackBadges.map((b) => {
      const url = getRackBadgeUrl(b, fallbackStyle)
      const alt = b.title || `${b.label} ${b.message}`.trim() || 'Tech'
      const badgeSnippet = b.link ? `[![${alt}](${url})](${b.link})` : `![${alt}](${url})`
      return `| **${b.title || b.label}** | ${badgeSnippet} | Core Stack |`
    })
    return `${headers}\n${rows.join('\n')}`
  }
  if (rackLayout === 'lines') {
    return items.join('\n')
  }
  // inline row
  return items.join(' ')
}

export function formatSkillIconsMarkdown(url, repoUrl = '') {
  const link = repoUrl ? repoUrl : 'https://skillicons.dev'
  return `<div align="center">\n  <a href="${link}">\n    <img src="${url}" alt="My Skills" />\n  </a>\n</div>`
}

export function formatPackMarkdown(pack, style = 'for-the-badge', repoUrl = '', layout = 'centered') {
  if (!pack || !pack.badges) return ''
  const items = pack.badges.map((b) => {
    const bC = cleanHexColor(b.color, '6366f1')
    const bL = escapeShieldsText(b.label)
    const bM = escapeShieldsText(b.message || '')
    const bStyle = style || b.style || 'for-the-badge'
    let bUrl = `https://img.shields.io/badge/${bL}-${bM}-${bC}?style=${bStyle}`
    if (b.logo) bUrl += `&logo=${encodeURIComponent(b.logo)}&logoColor=white`
    const alt = `${b.label} ${b.message || ''}`.trim()
    return repoUrl ? `[![${alt}](${bUrl})](${repoUrl})` : `![${alt}](${bUrl})`
  })

  if (layout === 'inline') {
    return items.join(' ')
  }
  if (layout === 'table') {
    const headers = '| Technology | Badge / Version | Category |\n| :--- | :---: | :--- |'
    const rows = pack.badges.map((b) => {
      const bC = cleanHexColor(b.color, '6366f1')
      const bL = escapeShieldsText(b.label)
      const bM = escapeShieldsText(b.message || '')
      const bStyle = style || b.style || 'for-the-badge'
      let bUrl = `https://img.shields.io/badge/${bL}-${bM}-${bC}?style=${bStyle}`
      if (b.logo) bUrl += `&logo=${encodeURIComponent(b.logo)}&logoColor=white`
      const alt = `${b.label} ${b.message || ''}`.trim()
      const badgeSnippet = repoUrl ? `[![${alt}](${bUrl})](${repoUrl})` : `![${alt}](${bUrl})`
      return `| **${b.label}** | ${badgeSnippet} | ${pack.category || 'Core'} |`
    })
    return `${headers}\n${rows.join('\n')}`
  }

  return `<div align="center">\n\n${items.join('\n')}\n\n</div>`
}


/**
 * User Custom Saved Packs (stored in localStorage)
 */
const STORAGE_KEY_CUSTOM_PACKS = 'visualmark_user_custom_badge_packs'

export function getStoredCustomPacks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PACKS)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.warn('Failed to load custom badge packs from localStorage:', err)
    return []
  }
}

export function saveCustomPack(name, badges = []) {
  if (!name || !badges.length) return null
  try {
    const existing = getStoredCustomPacks()
    const newPack = {
      id: `user_pack_${Date.now()}`,
      title: name.trim(),
      desc: `${badges.length} custom saved badges`,
      category: 'User Custom Packs',
      isCustom: true,
      badges: badges.map((b) => ({
        label: b.label || b.title || 'stack',
        message: b.message || '',
        color: b.color || '6366f1',
        labelColor: b.labelColor || '',
        logo: b.logo || '',
        style: b.style || 'for-the-badge'
      }))
    }
    const updated = [newPack, ...existing]
    localStorage.setItem(STORAGE_KEY_CUSTOM_PACKS, JSON.stringify(updated))
    return newPack
  } catch (err) {
    console.error('Failed to save custom pack:', err)
    return null
  }
}

export function deleteCustomPack(packId) {
  try {
    const existing = getStoredCustomPacks()
    const updated = existing.filter((p) => p.id !== packId)
    localStorage.setItem(STORAGE_KEY_CUSTOM_PACKS, JSON.stringify(updated))
    return updated
  } catch (err) {
    console.error('Failed to delete custom pack:', err)
    return []
  }
}
