import React, { useRef, useEffect, useCallback, useMemo } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'

/**
 * Configure Custom Monaco Themes matching README Studio Design System
 */
function defineStudioThemes(monaco) {
  // VS Code Dark+ (Authentic Default Dark Modern matching Image 2)
  monaco.editor.defineTheme('studio-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
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
      { token: 'delimiter.html', foreground: '808080' },
      { token: 'metatag.html', foreground: '808080' },
      { token: 'metatag.content.html', foreground: '9cdcfe' },
      { token: 'keyword.md', foreground: '569cd6', fontStyle: 'bold' },
      { token: 'string.link.md', foreground: 'ce9178' },
      { token: 'variable.md', foreground: '9cdcfe' }
    ],
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editorLineNumber.foreground': '#858585',
      'editorLineNumber.activeForeground': '#c6c6c6',
      'editor.lineHighlightBackground': '#282828',
      'editor.lineHighlightBorder': '#28282800',
      'editor.selectionBackground': '#264f78',
      'editor.inactiveSelectionBackground': '#3a3d41',
      'editorCursor.foreground': '#aeafad',
      'editorWhitespace.foreground': '#3b3a32',
      'editorIndentGuide.background': '#404040',
      'editorIndentGuide.activeBackground': '#707070',
      'minimap.background': '#1e1e1e',
      'scrollbarSlider.background': '#79797944',
      'scrollbarSlider.hoverBackground': '#646464b3',
      'scrollbarSlider.activeBackground': '#bfbfbf66',
      'editorGutter.background': '#1e1e1e',
      'editorOverviewRuler.border': '#7f7f7f4d'
    }
  })

  // Slate Dark Theme (Deep Navy/Slate variant)
  monaco.editor.defineTheme('studio-slate', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '38bdf8', fontStyle: 'bold' },
      { token: 'string', foreground: 'ce9178' },
      { token: 'variable', foreground: '9cdcfe' }
    ],
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editorLineNumber.foreground': '#858585',
      'editorLineNumber.activeForeground': '#38bdf8',
      'editor.lineHighlightBackground': '#282828',
      'editor.selectionBackground': '#264f78',
      'minimap.background': '#1e1e1e'
    }
  })

  // Clean Light Theme
  monaco.editor.defineTheme('studio-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#1e293b',
      'editorLineNumber.foreground': '#94a3b8',
      'editorLineNumber.activeForeground': '#4f46e5',
      'editor.lineHighlightBackground': '#f8fafc',
      'editor.selectionBackground': '#c7d2fe80',
      'minimap.background': '#f8fafc'
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
}

let configured = false

export default function MonacoEditorPane({
  value = '',
  onChange = () => {},
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

  const activeTheme = useMemo(() => {
    if (themeMode === 'light') return 'studio-light'
    if (themeMode === 'slate') return 'studio-slate'
    return 'studio-dark'
  }, [themeMode])

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

    // Track active Monaco editor globally for studio commands
    window.activeMonacoEditor = editor

    // Intercept Monaco's built-in quickCommand action so clicking "Command Palette"
    // in the right-click context menu (Image 1) opens VisualMark Studio's customizable
    // Command Palette with configurable keybinding options (Image 3).
    try {
      const quickCommand = editor.getAction('editor.action.quickCommand')
      if (quickCommand) {
        quickCommand.run = () => {
          window.dispatchEvent(new CustomEvent('open-command-palette'))
          return Promise.resolve()
        }
      } else {
        editor.addAction({
          id: 'visualmark.openCommandPalette',
          label: 'Command Palette',
          keybindings: [
            monaco.KeyCode.F1,
            monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP
          ],
          contextMenuGroupId: 'navigation',
          contextMenuOrder: 1.5,
          run: () => {
            window.dispatchEvent(new CustomEvent('open-command-palette'))
          }
        })
      }

      // Explicitly bind F1 and Ctrl+Shift+P on editor instance
      editor.addCommand(monaco.KeyCode.F1, () => {
        window.dispatchEvent(new CustomEvent('open-command-palette'))
      })
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, () => {
        window.dispatchEvent(new CustomEvent('open-command-palette'))
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
    })
  }, [editorRef, activeTheme, onCursorChange, onScroll])

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
      <Editor
        height="100%"
        defaultLanguage="markdown"
        language={language}
        value={value}
        onChange={(val) => onChange(val || '')}
        options={options}
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
