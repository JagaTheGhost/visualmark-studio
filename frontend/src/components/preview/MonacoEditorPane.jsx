import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'
import FloatingSelectionToolbar from './FloatingSelectionToolbar'
import { loadFloatingToolbarConfig } from '../../utils/floatingToolbarConfig'
import { EMOJI_ITEMS, MATERIAL_ICONS } from '../../data/iconsAndEmojisData'
import { getThemeById } from '../../themes/themeRegistry'

/**
 * Configure Custom Monaco Themes matching README Studio Design System
 */
function defineStudioThemes(monaco) {
  // 1. VS Code Dark Modern (Default Dark)
  const defaultDarkRules = [
    { token: '', foreground: 'd4d4d4' },
    { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
    { token: 'keyword', foreground: '569cd6' },
    { token: 'keyword.json', foreground: '569cd6' },
    { token: 'string', foreground: 'ce9178' },
    { token: 'string.json', foreground: 'ce9178' },
    { token: 'string.key.json', foreground: '9cdcfe' },
    { token: 'string.value.json', foreground: 'ce9178' },
    { token: 'number', foreground: 'b5cea8' },
    { token: 'number.json', foreground: 'b5cea8' },
    { token: 'type', foreground: '4ec9b0' },
    { token: 'class', foreground: '4ec9b0' },
    { token: 'function', foreground: 'dcdcaa' },
    { token: 'variable', foreground: '9cdcfe' },
    { token: 'variable.predefined', foreground: '4ec9b0' },
    { token: 'variable.parameter', foreground: '9cdcfe' },
    { token: 'constant', foreground: '4fc1ff' },
    { token: 'tag', foreground: '569cd6' },
    { token: 'tag.id', foreground: '9cdcfe' },
    { token: 'tag.class', foreground: '9cdcfe' },
    { token: 'attribute.name', foreground: '9cdcfe' },
    { token: 'attribute.value', foreground: 'ce9178' },
    { token: 'delimiter', foreground: 'd4d4d4' },
    { token: 'keyword.md', foreground: '569cd6', fontStyle: 'bold' },
    { token: 'string.link.md', foreground: 'ce9178' },
    { token: 'variable.md', foreground: '9cdcfe' }
  ]

  monaco.editor.defineTheme('studio-dark-modern', {
    base: 'vs-dark',
    inherit: true,
    rules: defaultDarkRules,
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editorLineNumber.foreground': '#858585',
      'editorLineNumber.activeForeground': '#c6c6c6',
      'editor.lineHighlightBackground': '#282828',
      'editor.selectionBackground': '#264f78',
      'minimap.background': '#1e1e1e',
      'editorGutter.background': '#1e1e1e'
    }
  })
  monaco.editor.defineTheme('studio-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: defaultDarkRules,
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editorLineNumber.foreground': '#858585',
      'editorLineNumber.activeForeground': '#c6c6c6',
      'editor.lineHighlightBackground': '#282828',
      'editor.selectionBackground': '#264f78',
      'minimap.background': '#1e1e1e',
      'editorGutter.background': '#1e1e1e'
    }
  })

  // 2. GitHub Dark
  monaco.editor.defineTheme('studio-github-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff7b72' },
      { token: 'string', foreground: 'a5d6ff' },
      { token: 'number', foreground: '79c0ff' },
      { token: 'type', foreground: '7ee787' },
      { token: 'function', foreground: 'd2a8ff' },
      { token: 'variable', foreground: 'ffa657' }
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#e6edf3',
      'editorLineNumber.foreground': '#6e7681',
      'editorLineNumber.activeForeground': '#e6edf3',
      'editor.lineHighlightBackground': '#161b22',
      'editor.selectionBackground': '#1f6feb40',
      'minimap.background': '#0d1117',
      'editorGutter.background': '#0d1117'
    }
  })

  // 3. Tokyo Night
  monaco.editor.defineTheme('studio-tokyo-night', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '565f89', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'bb9af7' },
      { token: 'string', foreground: '9ece6a' },
      { token: 'number', foreground: 'ff9e64' },
      { token: 'type', foreground: '2ac3de' },
      { token: 'function', foreground: '7aa2f7' },
      { token: 'variable', foreground: 'c0caf5' }
    ],
    colors: {
      'editor.background': '#1a1b26',
      'editor.foreground': '#c0caf5',
      'editorLineNumber.foreground': '#565f89',
      'editorLineNumber.activeForeground': '#7aa2f7',
      'editor.lineHighlightBackground': '#1f2335',
      'editor.selectionBackground': '#3b4261',
      'minimap.background': '#1a1b26',
      'editorGutter.background': '#1a1b26'
    }
  })
  monaco.editor.defineTheme('studio-slate', {
    base: 'vs-dark',
    inherit: true,
    rules: defaultDarkRules,
    colors: {
      'editor.background': '#1a1b26',
      'editor.foreground': '#c0caf5',
      'editorLineNumber.foreground': '#565f89',
      'editorLineNumber.activeForeground': '#7aa2f7',
      'editor.lineHighlightBackground': '#1f2335',
      'editor.selectionBackground': '#3b4261',
      'minimap.background': '#1a1b26'
    }
  })

  // 4. Dracula
  monaco.editor.defineTheme('studio-dracula', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff79c6' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'type', foreground: '8be9fd' },
      { token: 'function', foreground: '50fa7b' },
      { token: 'variable', foreground: 'f8f8f2' }
    ],
    colors: {
      'editor.background': '#282a36',
      'editor.foreground': '#f8f8f2',
      'editorLineNumber.foreground': '#6272a4',
      'editorLineNumber.activeForeground': '#f8f8f2',
      'editor.lineHighlightBackground': '#44475a50',
      'editor.selectionBackground': '#44475a90',
      'minimap.background': '#282a36',
      'editorGutter.background': '#282a36'
    }
  })

  // 5. One Dark Pro
  monaco.editor.defineTheme('studio-one-dark-pro', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c678dd' },
      { token: 'string', foreground: '98c379' },
      { token: 'number', foreground: 'd19a66' },
      { token: 'type', foreground: 'e5c07b' },
      { token: 'function', foreground: '61afef' },
      { token: 'variable', foreground: 'e06c75' }
    ],
    colors: {
      'editor.background': '#282c34',
      'editor.foreground': '#abb2bf',
      'editorLineNumber.foreground': '#5c6370',
      'editorLineNumber.activeForeground': '#abb2bf',
      'editor.lineHighlightBackground': '#2c313a',
      'editor.selectionBackground': '#3e4451',
      'minimap.background': '#282c34',
      'editorGutter.background': '#282c34'
    }
  })

  // 6. Monokai Classic
  monaco.editor.defineTheme('studio-monokai', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '75715e', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'f92672' },
      { token: 'string', foreground: 'e6db74' },
      { token: 'number', foreground: 'ae81ff' },
      { token: 'type', foreground: '66d9ef' },
      { token: 'function', foreground: 'a6e22e' },
      { token: 'variable', foreground: 'fd971f' }
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#f8f8f2',
      'editorLineNumber.foreground': '#75715e',
      'editorLineNumber.activeForeground': '#f8f8f2',
      'editor.lineHighlightBackground': '#3e3d32',
      'editor.selectionBackground': '#49483e',
      'minimap.background': '#272822',
      'editorGutter.background': '#272822'
    }
  })

  // 7. Light Modern (Clean VS Code Light)
  const defaultLightRules = [
    { token: 'comment', foreground: '008000', fontStyle: 'italic' },
    { token: 'keyword', foreground: '0000ff' },
    { token: 'string', foreground: 'a31515' },
    { token: 'number', foreground: '098658' },
    { token: 'type', foreground: '267f99' },
    { token: 'function', foreground: '795e26' },
    { token: 'variable', foreground: '001080' }
  ]

  monaco.editor.defineTheme('studio-light-modern', {
    base: 'vs',
    inherit: true,
    rules: defaultLightRules,
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#1e293b',
      'editorLineNumber.foreground': '#94a3b8',
      'editorLineNumber.activeForeground': '#007acc',
      'editor.lineHighlightBackground': '#f8fafc',
      'editor.selectionBackground': '#c7d2fe80',
      'minimap.background': '#f8fafc',
      'editorGutter.background': '#ffffff'
    }
  })
  monaco.editor.defineTheme('studio-light', {
    base: 'vs',
    inherit: true,
    rules: defaultLightRules,
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#1e293b',
      'editorLineNumber.foreground': '#94a3b8',
      'editorLineNumber.activeForeground': '#007acc',
      'editor.lineHighlightBackground': '#f8fafc',
      'editor.selectionBackground': '#c7d2fe80',
      'minimap.background': '#f8fafc',
      'editorGutter.background': '#ffffff'
    }
  })

  // 8. GitHub Light
  monaco.editor.defineTheme('studio-github-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6e7781', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'cf222e' },
      { token: 'string', foreground: '0a3069' },
      { token: 'number', foreground: '0550ae' },
      { token: 'type', foreground: '116329' },
      { token: 'function', foreground: '8250df' },
      { token: 'variable', foreground: '953800' }
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#1f2328',
      'editorLineNumber.foreground': '#8c959f',
      'editorLineNumber.activeForeground': '#1f2328',
      'editor.lineHighlightBackground': '#f6f8fa',
      'editor.selectionBackground': '#0969da25',
      'minimap.background': '#ffffff',
      'editorGutter.background': '#ffffff'
    }
  })

  // 9. Solarized Light
  monaco.editor.defineTheme('studio-solarized-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '93a1a1', fontStyle: 'italic' },
      { token: 'keyword', foreground: '859900' },
      { token: 'string', foreground: '2aa198' },
      { token: 'number', foreground: 'd33682' },
      { token: 'type', foreground: 'b58900' },
      { token: 'function', foreground: '268bd2' },
      { token: 'variable', foreground: '6c71c4' }
    ],
    colors: {
      'editor.background': '#fdf6e3',
      'editor.foreground': '#073642',
      'editorLineNumber.foreground': '#93a1a1',
      'editorLineNumber.activeForeground': '#586e75',
      'editor.lineHighlightBackground': '#eee8d5',
      'editor.selectionBackground': '#268bd230',
      'minimap.background': '#fdf6e3',
      'editorGutter.background': '#fdf6e3'
    }
  })

  // 10. One Light
  monaco.editor.defineTheme('studio-one-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: 'a0a1a7', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'a626a4' },
      { token: 'string', foreground: '50a14f' },
      { token: 'number', foreground: '986801' },
      { token: 'type', foreground: 'c18401' },
      { token: 'function', foreground: '4078f2' },
      { token: 'variable', foreground: 'e45649' }
    ],
    colors: {
      'editor.background': '#fafafa',
      'editor.foreground': '#383a42',
      'editorLineNumber.foreground': '#9d9d9f',
      'editorLineNumber.activeForeground': '#383a42',
      'editor.lineHighlightBackground': '#f0f0f0',
      'editor.selectionBackground': '#e5e5e6',
      'minimap.background': '#fafafa',
      'editorGutter.background': '#fafafa'
    }
  })
}

/**
 * Register Markdown Completions (Badges, Tables, Callouts, Mermaid)
 */
function registerMarkdownCompletions(monaco) {
  monaco.languages.registerCompletionItemProvider('markdown', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      }

      const suggestions = [
        {
          label: 'table-grid',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'Insert a formatted Markdown table',
          insertText: [
            '| Feature | Description | Status |',
            '| :--- | :--- | :--- |',
            '| **High Performance** | Sub-millisecond parsing | ✅ Active |',
            '| **Local-First** | 100% offline desktop runtime | ✅ Active |'
          ].join('\n'),
          range
        },
        {
          label: 'mermaid-flowchart',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'Insert a Mermaid architecture flowchart',
          insertText: [
            '```mermaid',
            'flowchart TD',
            '    Client[Client UI] --> Gateway[API Gateway]',
            '    Gateway --> Engine[Core Engine]',
            '    Engine --> Storage[(Local Persistence)]',
            '```'
          ].join('\n'),
          range
        },
        {
          label: 'mermaid-sequence',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'Insert a Mermaid sequence diagram',
          insertText: [
            '```mermaid',
            'sequenceDiagram',
            '    autonumber',
            '    actor User',
            '    participant UI as Desktop IDE',
            '    participant Daemon as Python Sidecar',
            '    User->>UI: Request Generation',
            '    UI->>Daemon: POST /api/generate-readme',
            '    Daemon-->>UI: 200 Streamed Content',
            '```'
          ].join('\n'),
          range
        },
        {
          label: 'callout-note',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'Insert GitHub Note Alert',
          insertText: '> [!NOTE]\n> ${1:Informational context or background details.}',
          insertTextRules: monaco.languages.CompletionItemInsertValueRule.InsertAsSnippet,
          range
        },
        {
          label: 'callout-tip',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'Insert GitHub Tip Alert',
          insertText: '> [!TIP]\n> ${1:Helpful tip or best practice for developers.}',
          insertTextRules: monaco.languages.CompletionItemInsertValueRule.InsertAsSnippet,
          range
        },
        {
          label: 'callout-important',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'Insert GitHub Important Alert',
          insertText: '> [!IMPORTANT]\n> ${1:Critical requirement or step.}',
          insertTextRules: monaco.languages.CompletionItemInsertValueRule.InsertAsSnippet,
          range
        },
        {
          label: 'callout-warning',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'Insert GitHub Warning Alert',
          insertText: '> [!WARNING]\n> ${1:Potential issue or breaking change.}',
          insertTextRules: monaco.languages.CompletionItemInsertValueRule.InsertAsSnippet,
          range
        },
        {
          label: 'callout-caution',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'Insert GitHub Caution Alert',
          insertText: '> [!CAUTION]\n> ${1:High-risk action that may cause data loss.}',
          insertTextRules: monaco.languages.CompletionItemInsertValueRule.InsertAsSnippet,
          range
        },
        {
          label: 'badge-shields',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'Insert Shields.io Badge snippet',
          insertText: '![${1:Label}](https://img.shields.io/badge/${2:Label}-${3:Message}-${4:6366f1}?style=for-the-badge)',
          insertTextRules: monaco.languages.CompletionItemInsertValueRule.InsertAsSnippet,
          range
        }
      ]

      return { suggestions }
    }
  })

  // Register Emoji & Shortcode Completion Provider (triggers on ':')
  monaco.languages.registerCompletionItemProvider('markdown', {
    triggerCharacters: [':'],
    provideCompletionItems: (model, position) => {
      const lineContent = model.getLineContent(position.lineNumber)
      const textUntilPosition = lineContent.substring(0, position.column - 1)

      const colonIndex = textUntilPosition.lastIndexOf(':')
      if (colonIndex === -1) {
        return { suggestions: [] }
      }

      const query = textUntilPosition.substring(colonIndex + 1).toLowerCase()
      if (/\s/.test(query)) {
        return { suggestions: [] }
      }

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: colonIndex + 1,
        endColumn: position.column
      }

      const allItems = [...EMOJI_ITEMS, ...MATERIAL_ICONS]
      const matched = allItems.filter((item) => {
        if (!query) return true
        const cleanCode = (item.shortcode || item.icon || '').replace(/:/g, '').toLowerCase()
        return (
          cleanCode.includes(query) ||
          item.name.toLowerCase().includes(query) ||
          (item.keywords && item.keywords.toLowerCase().includes(query))
        )
      })

      const suggestions = matched.slice(0, 40).map((item) => ({
        label: `${item.char}  ${item.shortcode}`,
        filterText: `:${item.shortcode.replace(/:/g, '')}`,
        kind: monaco.languages.CompletionItemKind.Value,
        detail: item.name,
        documentation: `${item.char} ${item.name} (${item.shortcode})\nCategory: ${item.category}`,
        insertText: item.char,
        range
      }))

      return { suggestions }
    }
  })
}

let configured = false

export default function MonacoEditorPane({
  value = '',
  onChange = () => {},
  activeFile = 'README.md',
  viewMode = 'split',
  fontSize = 13,
  wordWrap = true,
  showLineNumbers = true,
  tabSize = 2,
  themeMode = 'dark',
  language = 'markdown',
  onCursorChange = () => {},
  onScroll = () => {},
  scrollToLine = null,
  editorRef = null
}) {
  const localEditorRef = useRef(null)
  const isSyncingScrollRef = useRef(false)
  const isInternalEditRef = useRef(false)
  const lastEmittedValueRef = useRef(value)
  const prevActiveFileRef = useRef(activeFile)
  const viewStatesRef = useRef({})

  // Floating Selection Toolbar Config & State
  const [toolbarConfig, setToolbarConfig] = useState(loadFloatingToolbarConfig)
  const toolbarConfigRef = useRef(toolbarConfig)
  toolbarConfigRef.current = toolbarConfig

  const [selectionToolbarState, setSelectionToolbarState] = useState({
    visible: false,
    top: 0,
    left: 0,
    flipped: false,
    selectedText: '',
    range: null
  })

  // Relayout editor when transitioning back from preview mode to editor/split
  useEffect(() => {
    if (localEditorRef.current && (viewMode === 'split' || viewMode === 'editor')) {
      const timer = setTimeout(() => {
        localEditorRef.current?.layout()
      }, 30)
      return () => clearTimeout(timer)
    }
  }, [viewMode])

  // Listen for config changes from Settings tab
  useEffect(() => {
    const handleConfigChange = (e) => {
      const cfg = e.detail || loadFloatingToolbarConfig()
      setToolbarConfig(cfg)
      if (!cfg.enabled) {
        setSelectionToolbarState(prev => prev.visible ? { ...prev, visible: false } : prev)
      }
    }
    window.addEventListener('floating-toolbar-config-changed', handleConfigChange)
    return () => window.removeEventListener('floating-toolbar-config-changed', handleConfigChange)
  }, [])

  // Calculate coordinates & visibility of floating toolbar based on Monaco selection
  const updateSelectionToolbar = useCallback(() => {
    const editor = localEditorRef.current
    if (!editor) return

    const cfg = toolbarConfigRef.current
    if (!cfg || !cfg.enabled) {
      setSelectionToolbarState(prev => prev.visible ? { ...prev, visible: false } : prev)
      return
    }

    const selection = editor.getSelection()
    if (!selection || selection.isEmpty()) {
      setSelectionToolbarState(prev => prev.visible ? { ...prev, visible: false } : prev)
      return
    }

    const model = editor.getModel()
    if (!model) return

    const selectedText = model.getValueInRange(selection)
    const minChars = cfg.minSelectionChars || 1
    if (!selectedText || selectedText.trim().length < minChars) {
      setSelectionToolbarState(prev => prev.visible ? { ...prev, visible: false } : prev)
      return
    }

    const startPos = selection.getStartPosition()
    const startCoord = editor.getScrolledVisiblePosition(startPos)
    if (!startCoord) {
      setSelectionToolbarState(prev => prev.visible ? { ...prev, visible: false } : prev)
      return
    }

    const endPos = selection.getEndPosition()
    const endCoord = editor.getScrolledVisiblePosition(endPos) || startCoord
    const layout = editor.getLayoutInfo()

    // Position above selection start line; flip below if near the top
    const toolbarHeight = 36
    let flipped = false
    let top = startCoord.top - toolbarHeight - 8

    if (top < 8) {
      top = endCoord.top + endCoord.height + 8
      flipped = true
    }

    // Horizontal clamping: account for minimap and padding
    const availableWidth = layout ? layout.width : 600
    const minimapWidth = (layout && layout.minimap) ? layout.minimap.minimapWidth : 0
    const maxRight = availableWidth - minimapWidth - 20
    let left = Math.max(16, Math.min(startCoord.left, maxRight - 320))

    setSelectionToolbarState({
      visible: true,
      top: Math.round(top),
      left: Math.round(left),
      flipped,
      selectedText,
      range: selection
    })
  }, [])

  // Formatting applicator with full undo/redo stack retention via editor.executeEdits
  const handleApplyFormat = useCallback((type, extra = '') => {
    const editor = localEditorRef.current
    if (!editor) return

    const selection = editor.getSelection()
    if (!selection || selection.isEmpty()) return

    const model = editor.getModel()
    if (!model) return

    const text = model.getValueInRange(selection)
    let replacement = text

    switch (type) {
      case 'heading': {
        const level = typeof extra === 'number' ? extra : 1
        const prefix = '#'.repeat(level) + ' '
        const clean = text.replace(/^#+\s*/gm, '')
        replacement = clean.split('\n').map(line => line.trim() ? `${prefix}${line}` : line).join('\n')
        break
      }
      case 'bold': {
        if (text.startsWith('**') && text.endsWith('**') && text.length >= 4) {
          replacement = text.slice(2, -2)
        } else {
          replacement = `**${text}**`
        }
        break
      }
      case 'italic': {
        if (text.startsWith('*') && text.endsWith('*') && text.length >= 2) {
          replacement = text.slice(1, -1)
        } else {
          replacement = `*${text}*`
        }
        break
      }
      case 'strikethrough': {
        if (text.startsWith('~~') && text.endsWith('~~') && text.length >= 4) {
          replacement = text.slice(2, -2)
        } else {
          replacement = `~~${text}~~`
        }
        break
      }
      case 'code': {
        if (text.startsWith('`') && text.endsWith('`') && text.length >= 2) {
          replacement = text.slice(1, -1)
        } else {
          replacement = `\`${text}\``
        }
        break
      }
      case 'quote': {
        replacement = text.split('\n').map(line => `> ${line}`).join('\n')
        break
      }
      case 'codeblock': {
        const lang = extra || 'bash'
        replacement = `\`\`\`${lang}\n${text}\n\`\`\``
        break
      }
      case 'link': {
        const url = extra || 'https://'
        replacement = `[${text || 'link text'}](${url})`
        break
      }
      case 'image': {
        const url = extra || 'https://'
        replacement = `![${text || 'image description'}](${url})`
        break
      }
      case 'bulletList': {
        replacement = text.split('\n').map(line => line.startsWith('- ') ? line : `- ${line}`).join('\n')
        break
      }
      case 'numberedList': {
        replacement = text.split('\n')
          .map(line => line.replace(/^\d+\.\s*/, ''))
          .map((line, i) => `${i + 1}. ${line}`)
          .join('\n')
        break
      }
      case 'taskList': {
        replacement = text.split('\n').map(line => line.startsWith('- [ ] ') || line.startsWith('- [x] ') ? line : `- [ ] ${line}`).join('\n')
        break
      }
      case 'divider': {
        replacement = `${text}\n\n---\n`
        break
      }
      case 'table': {
        replacement = `| Column 1 | Column 2 | Column 3 |\n| :--- | :--- | :--- |\n| ${text || 'Item'} | Description | Status |\n| Secondary | Detail | Active |`
        break
      }
      case 'callout': {
        const tag = extra || 'NOTE'
        replacement = `> [!${tag}]\n> ${text || 'Details and important context.'}`
        break
      }
      case 'mermaid': {
        replacement = `\`\`\`mermaid\nflowchart TD\n    A[${text || 'Component A'}] --> B[Component B]\n\`\`\``
        break
      }
      case 'details': {
        const summary = extra || 'Details'
        replacement = `<details>\n<summary>${summary}</summary>\n\n${text || 'Detailed content here...'}\n</details>`
        break
      }
      case 'badge': {
        const label = encodeURIComponent(text || 'Status')
        replacement = `![${text || 'Badge'}](https://img.shields.io/badge/${label}-Active-blue?style=for-the-badge)`
        break
      }
      default:
        break
    }

    editor.executeEdits('floating-toolbar', [
      {
        range: selection,
        text: replacement,
        forceMoveMarkers: true
      }
    ])
    editor.pushUndoStop()
    editor.focus()
    setSelectionToolbarState(prev => ({ ...prev, visible: false }))
  }, [])

  const activeTheme = useMemo(() => {
    const theme = getThemeById(themeMode)
    return theme ? theme.monacoTheme : 'studio-dark-modern'
  }, [themeMode])

  const monacoInstance = useMonaco()
  useEffect(() => {
    if (monacoInstance && activeTheme) {
      monacoInstance.editor.setTheme(activeTheme)
    }
  }, [monacoInstance, activeTheme])

  const handleEditorDidMount = useCallback((editor, monaco) => {
    localEditorRef.current = editor
    if (editorRef) {
      if (typeof editorRef === 'function') {
        editorRef(editor)
      } else {
        editorRef.current = editor
      }
    }

    if (!configured) {
      defineStudioThemes(monaco)
      registerMarkdownCompletions(monaco)
      configured = true
    }

    // Set initial theme
    monaco.editor.setTheme(activeTheme)

    // Cursor position tracker
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange({
          line: e.position.lineNumber,
          col: e.position.column
        })
      }
    })

    // Floating selection toolbar event triggers
    editor.onDidChangeCursorSelection(() => {
      updateSelectionToolbar()
    })

    editor.onDidChangeModelContent(() => {
      setSelectionToolbarState(prev => prev.visible ? { ...prev, visible: false } : prev)
    })

    // Track active Monaco editor globally for studio commands
    window.activeMonacoEditor = editor

    // Intercept Monaco's built-in quickCommand action so clicking "Command Palette"
    // in the right-click context menu opens VisualMark Studio's customizable Command Palette
    try {
      const origTrigger = editor.trigger.bind(editor)
      editor.trigger = function (source, handlerId, payload) {
        if (handlerId === 'editor.action.quickCommand') {
          window.dispatchEvent(new CustomEvent('open-command-palette'))
          return
        }
        return origTrigger(source, handlerId, payload)
      }

      const quickCommand = editor.getAction('editor.action.quickCommand')
      if (quickCommand) {
        quickCommand.run = () => {
          window.dispatchEvent(new CustomEvent('open-command-palette'))
          return Promise.resolve()
        }
      }

      // Intercept key events on the editor canvas before Monaco's internal commands / chord service process them
      editor.onKeyDown((e) => {
        // 1. F1 -> VisualMark Command Palette
        if (e.keyCode === monaco.KeyCode.F1) {
          e.preventDefault()
          e.stopPropagation()
          window.dispatchEvent(new CustomEvent('open-command-palette'))
          return
        }

        // 2. Ctrl+K (or Cmd+K) -> VisualMark Command Palette (breaks Monaco chord-mode)
        if (
          (e.ctrlKey || e.metaKey) &&
          !e.shiftKey &&
          !e.altKey &&
          (e.keyCode === monaco.KeyCode.KeyK || e.browserEvent?.key === 'k' || e.browserEvent?.key === 'K')
        ) {
          e.preventDefault()
          e.stopPropagation()
          window.dispatchEvent(new CustomEvent('open-command-palette'))
          return
        }

        // 3. Ctrl+Shift+P (or Cmd+Shift+P) -> VisualMark Command Palette
        if (
          (e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          !e.altKey &&
          (e.keyCode === monaco.KeyCode.KeyP || e.browserEvent?.key === 'p' || e.browserEvent?.key === 'P')
        ) {
          e.preventDefault()
          e.stopPropagation()
          window.dispatchEvent(new CustomEvent('open-command-palette'))
          return
        }

        // 4. Ctrl+S -> Quick Save
        if (
          (e.ctrlKey || e.metaKey) &&
          !e.shiftKey &&
          !e.altKey &&
          (e.keyCode === monaco.KeyCode.KeyS || e.browserEvent?.key === 's' || e.browserEvent?.key === 'S')
        ) {
          e.preventDefault()
          e.stopPropagation()
          window.dispatchEvent(new CustomEvent('app-save-file', { detail: false }))
          return
        }

        // 5. Ctrl+Shift+S -> Save As
        if (
          (e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          !e.altKey &&
          (e.keyCode === monaco.KeyCode.KeyS || e.browserEvent?.key === 's' || e.browserEvent?.key === 'S')
        ) {
          e.preventDefault()
          e.stopPropagation()
          window.dispatchEvent(new CustomEvent('app-save-file', { detail: true }))
          return
        }
      })

      // Explicitly bind F1, Ctrl+Shift+P, and Ctrl+K on editor instance
      editor.addCommand(monaco.KeyCode.F1, () => {
        window.dispatchEvent(new CustomEvent('open-command-palette'))
      })
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, () => {
        window.dispatchEvent(new CustomEvent('open-command-palette'))
      })
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
        window.dispatchEvent(new CustomEvent('open-command-palette'))
      })

      // Explicitly route Ctrl+F and Ctrl+H to VisualMark Studio's unified Find & Replace widget
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
        window.dispatchEvent(new CustomEvent('open-find-widget', { detail: 'find' }))
      })
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
        window.dispatchEvent(new CustomEvent('open-find-widget', { detail: 'replace' }))
      })
    } catch (e) {
      console.warn('Could not intercept or register Command Palette action in Monaco:', e)
    }

    // Scroll change handler
    editor.onDidScrollChange((e) => {
      if (isSyncingScrollRef.current) return
      if (onScroll) {
        const visibleRanges = editor.getVisibleRanges()
        const firstVisibleLine = visibleRanges && visibleRanges.length > 0 ? visibleRanges[0].startLineNumber : 1
        onScroll({
          scrollTop: e.scrollTop,
          scrollHeight: e.scrollHeight,
          clientHeight: editor.getLayoutInfo().height,
          firstVisibleLine
        })
      }
      updateSelectionToolbar()
    })
  }, [editorRef, activeTheme, onCursorChange, onScroll, updateSelectionToolbar])

  // Update theme dynamically
  const monaco = useMonaco()
  useEffect(() => {
    if (monaco && configured) {
      monaco.editor.setTheme(activeTheme)
    }
  }, [monaco, activeTheme])

  // Synchronize dynamic model language based on open file (e.g. package.json -> json, app.py -> python)
  useEffect(() => {
    if (localEditorRef.current && monaco) {
      const model = localEditorRef.current.getModel()
      if (model && language) {
        try {
          monaco.editor.setModelLanguage(model, language)
        } catch {}
      }
    }
  }, [language, monaco])

  // Internal change handler invoked by Monaco
  const handleEditorChange = useCallback((newVal) => {
    isInternalEditRef.current = true
    lastEmittedValueRef.current = newVal || ''
    onChange(newVal || '')
  }, [onChange])

  // Synchronize external value changes (tab switch, preset loaded, template inserted, AI generation, etc.)
  useEffect(() => {
    const editor = localEditorRef.current
    if (!editor) return

    const isFileSwitch = prevActiveFileRef.current !== activeFile
    if (isFileSwitch) {
      const prevFile = prevActiveFileRef.current
      if (prevFile && editor.getModel()) {
        try {
          viewStatesRef.current[prevFile] = editor.saveViewState()
        } catch {}
      }
      prevActiveFileRef.current = activeFile
      isInternalEditRef.current = false
      const incomingVal = value || ''
      lastEmittedValueRef.current = incomingVal
      const model = editor.getModel()
      if (model) {
        if (model.getValue() !== incomingVal) {
          editor.setValue(incomingVal)
        }
        if (viewStatesRef.current[activeFile]) {
          try {
            editor.restoreViewState(viewStatesRef.current[activeFile])
          } catch {}
        } else {
          editor.setPosition({ lineNumber: 1, column: 1 })
        }
      }
      return
    }

    // If change was made internally by user typing/deleting inside Monaco, skip!
    if (isInternalEditRef.current) {
      isInternalEditRef.current = false
      return
    }

    const currentVal = editor.getValue() || ''
    const incomingVal = value || ''

    if (currentVal === incomingVal) return

    // Normalize comparison: ignore CRLF vs LF differences
    if (currentVal.replace(/\r\n/g, '\n') === incomingVal.replace(/\r\n/g, '\n')) {
      return
    }

    lastEmittedValueRef.current = incomingVal
    const model = editor.getModel()
    if (model) {
      const prevPosition = editor.getPosition()
      editor.executeEdits('external-update', [
        {
          range: model.getFullModelRange(),
          text: incomingVal,
          forceMoveMarkers: true
        }
      ])
      editor.pushUndoStop()

      if (prevPosition) {
        try {
          const maxLine = model.getLineCount()
          const safeLine = Math.min(prevPosition.lineNumber, maxLine)
          const maxCol = model.getLineMaxColumn(safeLine)
          const safeCol = Math.min(prevPosition.column, maxCol)
          editor.setPosition({ lineNumber: safeLine, column: safeCol })
        } catch {}
      }
    }
  }, [value, activeFile])

  // Scroll to requested line when prop changes
  useEffect(() => {
    if (scrollToLine && localEditorRef.current) {
      isSyncingScrollRef.current = true
      localEditorRef.current.revealLineInCenter(scrollToLine)
      setTimeout(() => {
        isSyncingScrollRef.current = false
      }, 100)
    }
  }, [scrollToLine])

  // Cleanup active editor reference on unmount
  useEffect(() => {
    return () => {
      if (window.activeMonacoEditor === localEditorRef.current) {
        window.activeMonacoEditor = null
      }
    }
  }, [])

  const options = useMemo(() => ({
    fontSize,
    fontFamily: "'Cascadia Code', 'JetBrains Mono', Consolas, 'Fira Code', 'Courier New', monospace",
    fontLigatures: true,
    lineNumbers: showLineNumbers ? 'on' : 'off',
    wordWrap: wordWrap ? 'on' : 'off',
    tabSize,
    bracketPairColorization: {
      enabled: true
    },
    guides: {
      bracketPairs: true,
      indentation: true
    },
    minimap: {
      enabled: true,
      maxColumn: 70,
      renderCharacters: false,
      showSlider: 'always'
    },
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    padding: { top: 12, bottom: 16 },
    renderLineHighlight: 'line',
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    automaticLayout: true,
    renderWhitespace: 'selection',
    contextmenu: true,
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true
    },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'smart'
  }), [fontSize, showLineNumbers, wordWrap, tabSize])

  return (
    <div className="monaco-editor-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
      {selectionToolbarState.visible && toolbarConfig.enabled && (
        <FloatingSelectionToolbar
          position={{
            top: selectionToolbarState.top,
            left: selectionToolbarState.left,
            flipped: selectionToolbarState.flipped
          }}
          selectedText={selectionToolbarState.selectedText}
          selectionRange={selectionToolbarState.range}
          config={toolbarConfig}
          onFormat={handleApplyFormat}
          onClose={() => setSelectionToolbarState(prev => ({ ...prev, visible: false }))}
        />
      )}
      <Editor
        height="100%"
        path={activeFile}
        defaultLanguage="markdown"
        language={language}
        defaultValue={value}
        onChange={handleEditorChange}
        options={options}
        theme={activeTheme}
        onMount={handleEditorDidMount}
        loading={
          <div className="studio-tab-loading">
            <div className="studio-loading-spinner" />
            <div className="studio-loading-text">Initializing Monaco Code Editor...</div>
          </div>
        }
      />
    </div>
  )
}
