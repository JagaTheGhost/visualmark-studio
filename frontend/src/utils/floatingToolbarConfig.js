/**
 * Configuration and persistence utility for the Floating Selection Toolbar (Quick Actions HUD).
 * Allows users to modularly customize which actions appear when text is highlighted.
 */

export const DEFAULT_FLOATING_TOOLBAR_CONFIG = {
  enabled: true,
  minSelectionChars: 1,
  showHeadings: true,
  showBold: true,
  showItalic: true,
  showStrikethrough: true,
  showInlineCode: true,
  showQuote: true,
  showCodeblock: true,
  showLink: true,
  showImage: true,
  showBulletList: true,
  showNumberedList: true,
  showTaskList: true,
  showDivider: true,
  showTable: true,
  showCallout: true,
  showDiagram: true,
  showDetails: true,
  showBadge: true
}

export const FLOATING_TOOLBAR_ACTIONS = [
  { id: 'showHeadings', label: 'Headings Dropdown (H1 - H3)', group: 'structure', icon: 'title' },
  { id: 'showBold', label: 'Bold (**text**)', group: 'inline', icon: 'format_bold' },
  { id: 'showItalic', label: 'Italic (*text*)', group: 'inline', icon: 'format_italic' },
  { id: 'showStrikethrough', label: 'Strikethrough (~~text~~)', group: 'inline', icon: 'format_strikethrough' },
  { id: 'showInlineCode', label: 'Inline Code (`code`)', group: 'inline', icon: 'code' },
  { id: 'showQuote', label: 'Blockquote (> quote)', group: 'structure', icon: 'format_quote' },
  { id: 'showCodeblock', label: 'Code Block (```lang)', group: 'structure', icon: 'data_object' },
  { id: 'showLink', label: 'Hyperlink ([text](url))', group: 'inline', icon: 'link' },
  { id: 'showImage', label: 'Image (![alt](url))', group: 'inline', icon: 'image' },
  { id: 'showBulletList', label: 'Bullet List (- item)', group: 'lists', icon: 'format_list_bulleted' },
  { id: 'showNumberedList', label: 'Numbered List (1. item)', group: 'lists', icon: 'format_list_numbered' },
  { id: 'showTaskList', label: 'Task Checklist (- [ ] item)', group: 'lists', icon: 'check_box' },
  { id: 'showDivider', label: 'Horizontal Divider (---)', group: 'structure', icon: 'horizontal_rule' },
  { id: 'showTable', label: 'Markdown Table Generator', group: 'studios', icon: 'table_chart' },
  { id: 'showCallout', label: 'GitHub Alert Callouts ([!NOTE], [!TIP]...)', group: 'studios', icon: 'campaign' },
  { id: 'showDiagram', label: 'Mermaid Diagram Block', group: 'studios', icon: 'schema' },
  { id: 'showDetails', label: 'Collapsible Accordion (<details>)', group: 'studios', icon: 'unfold_more' },
  { id: 'showBadge', label: 'Shields.io Badge Link', group: 'studios', icon: 'shield' }
]

const STORAGE_KEY = 'readme_floating_toolbar_config'

export function loadFloatingToolbarConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_FLOATING_TOOLBAR_CONFIG }
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_FLOATING_TOOLBAR_CONFIG, ...parsed }
  } catch {
    return { ...DEFAULT_FLOATING_TOOLBAR_CONFIG }
  }
}

export function saveFloatingToolbarConfig(newConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig))
    window.dispatchEvent(new CustomEvent('floating-toolbar-config-changed', { detail: newConfig }))
  } catch (err) {
    console.error('Failed to save floating toolbar config:', err)
  }
}
