// Utility for managing and persisting customizable IDE keyboard shortcuts

export const DEFAULT_KEYBINDINGS = [
  // Navigation & File Management
  { id: 'file.new', title: 'File: New Document', category: 'File', defaultKey: 'Ctrl + N', desc: 'Create a new markdown document tab' },
  { id: 'file.save', title: 'File: Quick Save Document', category: 'File', defaultKey: 'Ctrl + S', desc: 'Save current active document to disk or local storage' },
  { id: 'file.saveAs', title: 'File: Save As...', category: 'File', defaultKey: 'Ctrl + Shift + S', desc: 'Save active document as a new local file' },
  { id: 'file.open', title: 'File: Open File...', category: 'File', defaultKey: 'Ctrl + O', desc: 'Open native markdown or text file' },
  { id: 'file.openFolder', title: 'File: Open Folder...', category: 'File', defaultKey: 'Ctrl + Shift + O', desc: 'Open native folder directory' },
  { id: 'file.exportPdf', title: 'File: Export as PDF', category: 'File', defaultKey: 'Ctrl + P', desc: 'Print / Export active document as PDF' },

  // Preferences & Workspace
  { id: 'pref.settings', title: 'Preferences: Open Settings Tab', category: 'Preferences', defaultKey: 'Ctrl + ,', desc: 'Open Editor & Application Settings tab' },
  { id: 'pref.shortcuts', title: 'Preferences: Open Keyboard Shortcuts', category: 'Preferences', defaultKey: 'Ctrl + /', desc: 'Open Keyboard Shortcuts configuration tab' },
  { id: 'view.commandPalette', title: 'View: Open Command Palette', category: 'Navigation', defaultKey: 'Ctrl + K', desc: 'Open interactive command palette and search' },
  { id: 'view.toggleSidebar', title: 'View: Toggle Primary Sidebar', category: 'View', defaultKey: 'Ctrl + B', desc: 'Show or collapse the left activity sidebar' },
  { id: 'view.cycleMode', title: 'View: Toggle Split / Preview Mode', category: 'View', defaultKey: 'Ctrl + Shift + P', desc: 'Cycle between Split, Editor-only, and Preview-only' },
  { id: 'view.toggleOrientation', title: 'View: Toggle Split Orientation', category: 'View', defaultKey: 'Ctrl + \\', desc: 'Toggle between Side-by-Side and Stacked editor views' },
  { id: 'view.toggleZen', title: 'View: Toggle Zen / Full Screen Mode', category: 'View', defaultKey: 'F11', desc: 'Toggle distraction-free full-screen editor mode' },

  // Navigation & Creation
  { id: 'nav.explorer', title: 'View: Open File Explorer', category: 'Navigation', defaultKey: 'Ctrl + Shift + E', desc: 'Reveal Workspace Docs explorer sidebar' },
  { id: 'nav.generator', title: 'Config: Open Documentation Config', category: 'Navigation', defaultKey: 'Ctrl + Shift + G', desc: 'Reveal Documentation Configuration sidebar' },
  { id: 'doc.create', title: 'Create: Create Documentation', category: 'Create', defaultKey: 'Ctrl + Enter', desc: 'Create documentation skeleton from active configuration' },

  // Editor Actions
  { id: 'edit.find', title: 'Edit: Find in Document', category: 'Editor', defaultKey: 'Ctrl + F', desc: 'Open interactive Find widget in code editor' },
  { id: 'edit.replace', title: 'Edit: Find and Replace', category: 'Editor', defaultKey: 'Ctrl + H', desc: 'Open Find and Replace widget in code editor' },

  // Studio Tools
  { id: 'studio.badges', title: 'Studio: Open Shields.io Badges Designer', category: 'Studio', defaultKey: 'Ctrl + Shift + B', desc: 'Open interactive Badges Studio tab' },
  { id: 'studio.diagrams', title: 'Studio: Open Mermaid Diagram Designer', category: 'Studio', defaultKey: 'Ctrl + Shift + M', desc: 'Open visual Mermaid Architecture Diagrams tab' },
  { id: 'studio.tables', title: 'Studio: Open Table Designer', category: 'Studio', defaultKey: 'Ctrl + Shift + T', desc: 'Open interactive Markdown Table Studio tab' },
  { id: 'studio.snippets', title: 'Studio: Open Snippets & Callouts', category: 'Studio', defaultKey: 'Ctrl + Shift + K', desc: 'Open Code Snippets and GitHub Callouts tab' },
  { id: 'studio.images', title: 'Studio: Open Image & Banners Designer', category: 'Studio', defaultKey: 'Ctrl + Shift + I', desc: 'Open Image and Banner Studio tab' }
]

const STORAGE_KEY = 'readme_custom_keybindings'

export function loadKeybindings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_KEYBINDINGS.map(k => ({ ...k, key: k.defaultKey, isCustom: false }))

    const savedMap = JSON.parse(raw)
    return DEFAULT_KEYBINDINGS.map(item => {
      if (savedMap && savedMap[item.id]) {
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

export function saveKeybindingOverride(commandId, newKey) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const savedMap = raw ? JSON.parse(raw) : {}
    if (newKey) {
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
  if (targetKey.startsWith('f') && !isNaN(Number(targetKey.slice(1)))) {
    return eKey === targetKey
  }

  return eKey === targetKey
}
