/**
 * VisualMark Studio — Comprehensive Editor Theme Registry
 * Includes standard developer themes across Dark and Light schemes.
 */

export const THEMES = [
  // ==========================================
  // Dark Themes
  // ==========================================
  {
    id: 'dark-modern',
    name: 'Dark Modern',
    type: 'dark',
    description: 'Default Antigravity & VS Code dark theme with balanced neutral slate surfaces',
    badge: 'Default',
    colors: {
      base: '#1e1e1e',
      lowest: '#18181b',
      low: '#18181b',
      mid: '#252526',
      high: '#2d2d30',
      highest: '#37373d',
      titlebar: '#18181b',
      tabbar: '#18181b',
      tabActive: '#1e1e1e',
      border: 'rgba(255, 255, 255, 0.08)',
      borderSubtle: 'rgba(255, 255, 255, 0.05)',
      textPrimary: '#cccccc',
      textSecondary: '#969696',
      textMuted: '#6e7681',
      primary: '#007acc',
      primaryHover: '#0062a3',
      secondary: '#38bdf8',
      accentGlow: 'rgba(0, 122, 204, 0.28)',
      swatch: ['#1e1e1e', '#007acc', '#cccccc']
    },
    monacoTheme: 'studio-dark-modern'
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    type: 'dark',
    description: 'Official GitHub dark palette with high-contrast borders and deep midnight surfaces',
    badge: 'Popular',
    colors: {
      base: '#0d1117',
      lowest: '#010409',
      low: '#010409',
      mid: '#161b22',
      high: '#21262d',
      highest: '#30363d',
      titlebar: '#010409',
      tabbar: '#010409',
      tabActive: '#0d1117',
      border: '#30363d',
      borderSubtle: '#21262d',
      textPrimary: '#e6edf3',
      textSecondary: '#8b949e',
      textMuted: '#6e7681',
      primary: '#2f81f7',
      primaryHover: '#1f6feb',
      secondary: '#58a6ff',
      accentGlow: 'rgba(47, 129, 247, 0.25)',
      swatch: ['#0d1117', '#2f81f7', '#e6edf3']
    },
    monacoTheme: 'studio-github-dark'
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    type: 'dark',
    description: 'Clean midnight blue with electric cyan, purple, and magenta highlights',
    badge: 'Modern',
    colors: {
      base: '#1a1b26',
      lowest: '#16161e',
      low: '#16161e',
      mid: '#1f2335',
      high: '#292e42',
      highest: '#3b4261',
      titlebar: '#16161e',
      tabbar: '#16161e',
      tabActive: '#1a1b26',
      border: '#292e42',
      borderSubtle: '#1f2335',
      textPrimary: '#c0caf5',
      textSecondary: '#9aa5ce',
      textMuted: '#565f89',
      primary: '#7aa2f7',
      primaryHover: '#5d87e0',
      secondary: '#bb9af7',
      accentGlow: 'rgba(122, 162, 247, 0.25)',
      swatch: ['#1a1b26', '#7aa2f7', '#bb9af7']
    },
    monacoTheme: 'studio-tokyo-night'
  },
  {
    id: 'dracula',
    name: 'Dracula',
    type: 'dark',
    description: 'Iconic gothic dark theme with vibrant pink, purple, and green syntax colors',
    colors: {
      base: '#282a36',
      lowest: '#21222c',
      low: '#21222c',
      mid: '#343746',
      high: '#44475a',
      highest: '#6272a4',
      titlebar: '#21222c',
      tabbar: '#21222c',
      tabActive: '#282a36',
      border: '#44475a',
      borderSubtle: '#343746',
      textPrimary: '#f8f8f2',
      textSecondary: '#bd93f9',
      textMuted: '#6272a4',
      primary: '#bd93f9',
      primaryHover: '#a371f7',
      secondary: '#ff79c6',
      accentGlow: 'rgba(189, 147, 249, 0.25)',
      swatch: ['#282a36', '#bd93f9', '#ff79c6']
    },
    monacoTheme: 'studio-dracula'
  },
  {
    id: 'one-dark-pro',
    name: 'One Dark Pro',
    type: 'dark',
    description: 'Atom-inspired dark theme with warm charcoal tones and pleasing soft accents',
    colors: {
      base: '#282c34',
      lowest: '#21252b',
      low: '#21252b',
      mid: '#2c313a',
      high: '#3e4451',
      highest: '#4b5263',
      titlebar: '#21252b',
      tabbar: '#21252b',
      tabActive: '#282c34',
      border: '#3e4451',
      borderSubtle: '#2c313a',
      textPrimary: '#abb2bf',
      textSecondary: '#828997',
      textMuted: '#5c6370',
      primary: '#61afef',
      primaryHover: '#4d97d5',
      secondary: '#98c379',
      accentGlow: 'rgba(97, 175, 239, 0.25)',
      swatch: ['#282c34', '#61afef', '#abb2bf']
    },
    monacoTheme: 'studio-one-dark-pro'
  },
  {
    id: 'monokai',
    name: 'Monokai Classic',
    type: 'dark',
    description: 'Classic high-contrast dark palette with bright yellow, magenta, and green syntax',
    colors: {
      base: '#272822',
      lowest: '#1e1f1c',
      low: '#1e1f1c',
      mid: '#32332d',
      high: '#3e3d32',
      highest: '#49483e',
      titlebar: '#1e1f1c',
      tabbar: '#1e1f1c',
      tabActive: '#272822',
      border: '#49483e',
      borderSubtle: '#3e3d32',
      textPrimary: '#f8f8f2',
      textSecondary: '#e6db74',
      textMuted: '#75715e',
      primary: '#a6e22e',
      primaryHover: '#8ac41f',
      secondary: '#f92672',
      accentGlow: 'rgba(166, 226, 46, 0.25)',
      swatch: ['#272822', '#e6db74', '#a6e22e']
    },
    monacoTheme: 'studio-monokai'
  },

  // ==========================================
  // Light Themes
  // ==========================================
  {
    id: 'light-modern',
    name: 'Light Modern',
    type: 'light',
    description: 'Clean VS Code light modern theme with high-contrast slate text and crisp borders',
    badge: 'Recommended',
    colors: {
      base: '#ffffff',
      lowest: '#f1f5f9',
      low: '#f8fafc',
      mid: '#f1f5f9',
      high: '#e2e8f0',
      highest: '#cbd5e1',
      titlebar: '#f8fafc',
      tabbar: '#f1f5f9',
      tabActive: '#ffffff',
      border: '#e2e8f0',
      borderSubtle: '#f1f5f9',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#64748b',
      primary: '#007acc',
      primaryHover: '#0062a3',
      secondary: '#0284c7',
      accentGlow: 'rgba(0, 122, 204, 0.15)',
      swatch: ['#ffffff', '#007acc', '#0f172a']
    },
    monacoTheme: 'studio-light-modern'
  },
  {
    id: 'github-light',
    name: 'GitHub Light',
    type: 'light',
    description: 'Clean GitHub documentation aesthetic with clear contrast and elegant slate gray borders',
    badge: 'Popular',
    colors: {
      base: '#ffffff',
      lowest: '#f6f8fa',
      low: '#f6f8fa',
      mid: '#eaeef2',
      high: '#d0d7de',
      highest: '#afb8c1',
      titlebar: '#f6f8fa',
      tabbar: '#f6f8fa',
      tabActive: '#ffffff',
      border: '#d0d7de',
      borderSubtle: '#eaeef2',
      textPrimary: '#1f2328',
      textSecondary: '#59636e',
      textMuted: '#8c959f',
      primary: '#0969da',
      primaryHover: '#0550ae',
      secondary: '#1a7f37',
      accentGlow: 'rgba(9, 105, 218, 0.15)',
      swatch: ['#ffffff', '#0969da', '#1f2328']
    },
    monacoTheme: 'studio-github-light'
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    type: 'light',
    description: 'Warm parchment background designed specifically to reduce glare and optical strain',
    colors: {
      base: '#fdf6e3',
      lowest: '#eee8d5',
      low: '#eee8d5',
      mid: '#e4dcbe',
      high: '#d3c9a8',
      highest: '#93a1a1',
      titlebar: '#eee8d5',
      tabbar: '#eee8d5',
      tabActive: '#fdf6e3',
      border: '#d3c9a8',
      borderSubtle: '#e4dcbe',
      textPrimary: '#073642',
      textSecondary: '#586e75',
      textMuted: '#839496',
      primary: '#268bd2',
      primaryHover: '#1a6fa8',
      secondary: '#2aa198',
      accentGlow: 'rgba(38, 139, 210, 0.18)',
      swatch: ['#fdf6e3', '#268bd2', '#073642']
    },
    monacoTheme: 'studio-solarized-light'
  },
  {
    id: 'one-light',
    name: 'One Light',
    type: 'light',
    description: 'Atom One Light clean cool silver palette with distinctive violet and azure accents',
    colors: {
      base: '#fafafa',
      lowest: '#f0f0f0',
      low: '#f0f0f0',
      mid: '#e5e5e6',
      high: '#d7d7d9',
      highest: '#c0c0c2',
      titlebar: '#f0f0f0',
      tabbar: '#f0f0f0',
      tabActive: '#fafafa',
      border: '#d7d7d9',
      borderSubtle: '#e5e5e6',
      textPrimary: '#24292e',
      textSecondary: '#57606a',
      textMuted: '#6a737d',
      primary: '#4078f2',
      primaryHover: '#2b62d8',
      secondary: '#50a14f',
      accentGlow: 'rgba(64, 120, 242, 0.15)',
      swatch: ['#fafafa', '#4078f2', '#24292e']
    },
    monacoTheme: 'studio-one-light'
  }
]

/**
 * Normalizes legacy theme keys ('dark', 'slate', 'light') to theme IDs.
 */
export function normalizeThemeId(rawId) {
  if (!rawId) return 'dark-modern'
  if (rawId === 'dark') return 'dark-modern'
  if (rawId === 'slate') return 'tokyo-night'
  if (rawId === 'light') return 'light-modern'
  const found = THEMES.find((t) => t.id === rawId)
  return found ? found.id : 'dark-modern'
}

/**
 * Retrieves theme definition by ID with fallback.
 */
export function getThemeById(themeId) {
  const normId = normalizeThemeId(themeId)
  return THEMES.find((t) => t.id === normId) || THEMES[0]
}

/**
 * Checks if a theme is a dark mode theme.
 */
export function isDarkTheme(themeId) {
  const theme = getThemeById(themeId)
  return theme.type === 'dark'
}
