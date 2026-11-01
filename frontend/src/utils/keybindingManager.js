// Utility for managing and persisting customizable IDE keyboard shortcuts

export const DEFAULT_KEYBINDINGS = [
  // Navigation & File Management
  { id: 'file.new', title: 'File: New Document', category: 'File', defaultKey: 'Ctrl + N', desc: 'Create a new markdown document tab' },
  { id: 'file.save', title: 'File: Quick Save Document', category: 'File', defaultKey: 'Ctrl + S', desc: 'Save current active document to disk or local storage' },
  { id: 'file.saveAs', title: 'File: Save As...', category: 'File', defaultKey: 'Ctrl + Shift + S', desc: 'Save active document as a new local file' },
  { id: 'file.open', title: 'File: Open File...', category: 'File', defaultKey: 'Ctrl + O', desc: 'Open native markdown or text file' },
  { id: 'file.openFolder', title: 'File: Open Folder...', category: 'File', defaultKey: 'Ctrl + Shift + O', desc: 'Open native folder directory' },
  { id: 'file.closeTab', title: 'File: Close Active Tab', category: 'File', defaultKey: 'Ctrl + W', desc: 'Close currently active editor tab' },
  { id: 'file.closeWorkspace', title: 'File: Close Workspace', category: 'File', defaultKey: 'Ctrl + Shift + W', desc: 'Close active workspace folder and return to Welcome Launcher' },
  { id: 'file.clearDraft', title: 'Danger: Reset Active Markdown Buffer', category: 'File', defaultKey: '', desc: 'Clear the current file content' },

  // Git
  { id: 'git.clone', title: 'Git: Clone Repository...', category: 'Git', defaultKey: '', desc: 'Clone a remote Git repository to local disk and open workspace' },

  // Clipboard
  { id: 'edit.copyMarkdown', title: 'Clipboard: Copy Markdown to Clipboard', category: 'Clipboard', defaultKey: 'Ctrl + Shift + C', desc: 'Copy active markdown text to system clipboard' },

  // Preferences & Workspace
  { id: 'pref.settings', title: 'Preferences: Open Settings Tab', category: 'Preferences', defaultKey: 'Ctrl + ,', desc: 'Open Editor & Application Settings tab' },
  { id: 'pref.shortcuts', title: 'Preferences: Open Keyboard Shortcuts', category: 'Preferences', defaultKey: 'Ctrl + /', desc: 'Open Keyboard Shortcuts configuration tab' },
  { id: 'pref.toggleTheme', title: 'Preferences: Toggle Light / Dark Mode', category: 'Preferences', defaultKey: 'Ctrl + Alt + T', desc: 'Switch between preferred Light and Dark themes' },

  // View & Navigation
  { id: 'view.commandPalette', title: 'View: Open Command Palette', category: 'Navigation', defaultKey: 'Ctrl + Shift + P', desc: 'Open interactive command palette and search (also F1 / Ctrl+K)' },
  { id: 'view.toggleSidebar', title: 'View: Toggle Primary Sidebar', category: 'View', defaultKey: 'Ctrl + B', desc: 'Show or collapse the left activity sidebar' },
  { id: 'view.output', title: 'View: Toggle Output & Logs Panel', category: 'View', defaultKey: 'Ctrl + `', desc: 'Open or close system output and diagnostics drawer' },
  { id: 'view.problems', title: 'View: Toggle Problems Diagnostics', category: 'View', defaultKey: 'Ctrl + J', desc: 'Open or close markdown syntax errors and warnings' },
  { id: 'view.cycleMode', title: 'View: Toggle Split / Preview Mode', category: 'View', defaultKey: 'Ctrl + Shift + V', desc: 'Cycle between Split, Editor-only, and Preview-only' },
  { id: 'view.split', title: 'View: Split Editor & Preview', category: 'View', defaultKey: '', desc: '50/50 Code Editor and GitHub preview' },
  { id: 'view.editor', title: 'View: Editor Only', category: 'View', defaultKey: '', desc: 'Maximize raw code editor space' },
  { id: 'view.preview', title: 'View: Preview Only', category: 'View', defaultKey: '', desc: 'Read-only GitHub formatted documentation view' },
  { id: 'view.toggleOrientation', title: 'View: Toggle Split Orientation', category: 'View', defaultKey: 'Ctrl + \\', desc: 'Toggle between Side-by-Side and Stacked editor views' },
  { id: 'view.toggleZen', title: 'View: Toggle Zen / Full Screen Mode', category: 'View', defaultKey: 'F11', desc: 'Toggle distraction-free full-screen editor mode' },

  // Sidebar Panels
  { id: 'nav.explorer', title: 'View: Open File Explorer', category: 'Navigation', defaultKey: 'Ctrl + Shift + E', desc: 'Reveal Workspace Docs explorer sidebar' },
  { id: 'nav.generator', title: 'Config: Open Documentation Config', category: 'Navigation', defaultKey: 'Ctrl + Shift + G', desc: 'Reveal Documentation Configuration sidebar' },
  { id: 'doc.create', title: 'Create: Create Documentation', category: 'Create', defaultKey: 'Ctrl + Enter', desc: 'Create documentation skeleton from active configuration' },

  // Editor Actions
  { id: 'edit.find', title: 'Edit: Find in Document', category: 'Editor', defaultKey: 'Ctrl + F', desc: 'Open interactive Find widget in code editor' },
  { id: 'edit.replace', title: 'Edit: Find and Replace', category: 'Editor', defaultKey: 'Ctrl + H', desc: 'Open Find and Replace widget in code editor' },
  { id: 'editor.addCursorAbove', title: 'Editor: Add Cursor Above', category: 'Editor', defaultKey: 'Ctrl + Alt + Up', desc: 'Insert additional cursor on the line above' },
  { id: 'editor.addCursorBelow', title: 'Editor: Add Cursor Below', category: 'Editor', defaultKey: 'Ctrl + Alt + Down', desc: 'Insert additional cursor on the line below' },
  { id: 'editor.changeAllOccurrences', title: 'Editor: Change All Occurrences', category: 'Editor', defaultKey: 'Ctrl + F2', desc: 'Select all instances of current word for multi-cursor editing' },
  { id: 'editor.formatDocument', title: 'Editor: Format Document', category: 'Editor', defaultKey: 'Shift + Alt + F', desc: 'Format and beautify document syntax' },
  { id: 'editor.toggleWordWrap', title: 'Editor: Toggle Word Wrap', category: 'Editor', defaultKey: 'Alt + Z', desc: 'Toggle soft word wrap in code editor' },

  // Studio Tools
  { id: 'studio.badges', title: 'Studio: Open Shields.io Badges Designer', category: 'Studio', defaultKey: 'Ctrl + Shift + B', desc: 'Open interactive Badges Studio tab' },
  { id: 'studio.diagrams', title: 'Studio: Open Mermaid Diagram Designer', category: 'Studio', defaultKey: 'Ctrl + Shift + M', desc: 'Open visual Mermaid Architecture Diagrams tab' },
  { id: 'studio.tables', title: 'Studio: Open Table Designer', category: 'Studio', defaultKey: 'Ctrl + Shift + T', desc: 'Open interactive Markdown Table Studio tab' },
  { id: 'studio.snippets', title: 'Studio: Open Snippets & Callouts', category: 'Studio', defaultKey: 'Ctrl + Shift + K', desc: 'Open Code Snippets and GitHub Callouts tab' },
  { id: 'studio.images', title: 'Studio: Open Image & Banners Designer', category: 'Studio', defaultKey: 'Ctrl + Shift + I', desc: 'Open Image and Banner Studio tab' },
  { id: 'studio.tree', title: 'Studio: Open Directory Tree Studio', category: 'Studio', defaultKey: 'Ctrl + Shift + D', desc: 'Visual ASCII, Unicode, and Emoji folder tree generator' },
  { id: 'studio.api', title: 'Studio: Open API & Endpoints Studio', category: 'Studio', defaultKey: 'Ctrl + Shift + A', desc: 'Interactive REST route designer with parameter matrix and cURL' },
  { id: 'studio.audit', title: 'Studio: Open README Auditor & Linter', category: 'Studio', defaultKey: 'Ctrl + Shift + U', desc: 'Documentation health scorecard, A-F grade, and missing section boilerplate' },
  { id: 'studio.contributors', title: 'Studio: Open Contributor & Team Studio', category: 'Studio', defaultKey: 'Ctrl + Shift + R', desc: 'All-Contributors table, avatar matrix, and role badges' },
  { id: 'studio.changelog', title: 'Studio: Open Changelog & Release Notes', category: 'Studio', defaultKey: 'Ctrl + Shift + L', desc: 'Keep-a-Changelog standard release notes with SemVer bumping' },
  { id: 'studio.icons', title: 'Studio: Open Icons & Emoji Studio', category: 'Studio', defaultKey: 'Ctrl + Shift + Y', desc: 'Curated developer emojis, GitHub shortcodes, vector symbols, and heading decorators' },

  // Help
  { id: 'help.whatsNew', title: 'Help: Patch Notes', category: 'Help', defaultKey: '', desc: 'View version patch notes, highlights, and update changelog' },
  { id: 'help.checkUpdates', title: 'Help: Check for Updates...', category: 'Help', defaultKey: '', desc: 'Check for latest application updates on GitHub' },
  { id: 'help.welcome', title: 'Help: Welcome & Getting Started', category: 'Help', defaultKey: '', desc: 'Open the first-run welcome and onboarding dashboard' },
  { id: 'help.openPlayground', title: 'Help: Open Interactive Playground', category: 'Help', defaultKey: '', desc: 'Open sample document with live Mermaid diagrams, badges, and tables' },
  { id: 'help.quickSetup', title: 'Help: Run Workspace Setup Wizard', category: 'Help', defaultKey: '', desc: 'Re-open 1st-time onboarding setup popup to configure theme, engine & layout' }
]

const STORAGE_KEY = 'readme_custom_keybindings'

export function loadKeybindings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_KEYBINDINGS.map(k => ({ ...k, key: k.defaultKey, isCustom: false }))

    const savedMap = JSON.parse(raw)
    return DEFAULT_KEYBINDINGS.map(item => {
      if (savedMap && Object.prototype.hasOwnProperty.call(savedMap, item.id)) {
        return {
          ...item,
          key: savedMap[item.id],
          isCustom: savedMap[item.id] !== item.defaultKey
        }
      }
      return { ...item, key: item.defaultKey, isCustom: false }
    })
  } catch (err) {
    console.warn('Failed to parse keybindings from localStorage:', err)
    return DEFAULT_KEYBINDINGS.map(k => ({ ...k, key: k.defaultKey, isCustom: false }))
  }
}

export function normalizeKeyString(str) {
  if (!str || typeof str !== 'string') return ''
  const trimmed = str.trim()
  if (!trimmed || trimmed.toLowerCase() === 'none') return ''
  return trimmed
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\bcmd\b/g, 'ctrl')
    .replace(/\bmeta\b/g, 'ctrl')
    .replace(/\boption\b/g, 'alt')
    .replace(/\breturn\b/g, 'enter')
    .replace(/\bescape\b/g, 'esc')
}

export function findKeybindingConflicts(keybindings = []) {
  const map = {}
  for (const item of keybindings) {
    const norm = normalizeKeyString(item.key)
    if (!norm) continue
    if (!map[norm]) map[norm] = []
    map[norm].push(item)
  }
  return map
}

export function saveKeybindingOverride(commandId, newKey, replaceConflicts = false) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const savedMap = raw ? JSON.parse(raw) : {}

    if (replaceConflicts && newKey) {
      const targetNorm = normalizeKeyString(newKey)
      const currentList = loadKeybindings()
      for (const item of currentList) {
        if (item.id !== commandId && normalizeKeyString(item.key) === targetNorm) {
          // Unbind the conflicting command
          savedMap[item.id] = ''
        }
      }
    }

    if (newKey !== undefined) {
      savedMap[commandId] = newKey
    } else {
      delete savedMap[commandId]
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMap))
  } catch (err) {
    console.warn('Failed to save keybinding override:', err)
  }
}

export function resetAllKeybindings() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.warn('Failed to reset keybindings:', err)
  }
}

export function normalizeKeyCombination(e) {
  const parts = []
  if (e.ctrlKey || e.metaKey) parts.push('Ctrl')
  if (e.altKey) parts.push('Alt')
  if (e.shiftKey) parts.push('Shift')

  const key = e.key
  // Ignore lone modifier presses
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
    return ''
  }

  // Format special keys
  let formattedKey = key
  if (key === ' ') formattedKey = 'Space'
  else if (key === 'Escape') formattedKey = 'Esc'
  else if (key === 'ArrowUp') formattedKey = 'Up'
  else if (key === 'ArrowDown') formattedKey = 'Down'
  else if (key === 'ArrowLeft') formattedKey = 'Left'
  else if (key === 'ArrowRight') formattedKey = 'Right'
  else if (key.length === 1) formattedKey = key.toUpperCase()

  parts.push(formattedKey)
  return parts.join(' + ')
}

export function matchesKeybinding(e, shortcutString) {
  if (!shortcutString || typeof shortcutString !== 'string') return false

  const parts = shortcutString.split('+').map(s => s.trim().toLowerCase())
  const hasCtrl = parts.includes('ctrl') || parts.includes('cmd') || parts.includes('meta')
  const hasAlt = parts.includes('alt')
  const hasShift = parts.includes('shift')

  // Find the primary non-modifier key
  const mainKeys = parts.filter(p => !['ctrl', 'cmd', 'meta', 'alt', 'shift'].includes(p))
  if (mainKeys.length === 0) return false
  const targetKey = mainKeys[0]

  const eventCtrl = e.ctrlKey || e.metaKey
  const eventAlt = e.altKey
  const eventShift = e.shiftKey

  if (hasCtrl !== eventCtrl) return false
  if (hasAlt !== eventAlt) return false
  if (hasShift !== eventShift) return false

  const eKey = e.key.toLowerCase()
  if (targetKey === 'space') return eKey === ' '
  if (targetKey === 'esc' || targetKey === 'escape') return eKey === 'escape'
  if (targetKey === 'enter' || targetKey === 'return') return eKey === 'enter'
  if (targetKey === '\\') return eKey === '\\'
  if (targetKey === '/') return eKey === '/'
  if (targetKey === ',') return eKey === ','
  if (targetKey === '`' || targetKey === '~') return eKey === '`' || eKey === '~' || e.code === 'Backquote'
  if (targetKey === 'up') return eKey === 'arrowup' || eKey === 'up'
  if (targetKey === 'down') return eKey === 'arrowdown' || eKey === 'down'
  if (targetKey === 'left') return eKey === 'arrowleft' || eKey === 'left'
  if (targetKey === 'right') return eKey === 'arrowright' || eKey === 'right'
  if (targetKey.startsWith('f') && !isNaN(Number(targetKey.slice(1)))) {
    return eKey === targetKey
  }

  return eKey === targetKey
}
