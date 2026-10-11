import React, { useRef, useEffect, useCallback, useMemo } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'

/**
 * Configure Custom Monaco Themes matching README Studio Design System
 */
function defineStudioThemes(monaco) {
  // Obsidian Dark Theme
  monaco.editor.defineTheme('studio-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: '818cf8', fontStyle: 'bold' },
      { token: 'string', foreground: '34d399' },
      { token: 'variable', foreground: '38bdf8' },
      { token: 'type', foreground: 'f472b6' }
    ],
    colors: {
      'editor.background': '#10141a',
      'editor.foreground': '#e2e8f0',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#818cf8',
      'editor.lineHighlightBackground': '#161d27',
      'editor.selectionBackground': '#6366f13d',
      'editor.inactiveSelectionBackground': '#6366f122',
      'editorCursor.foreground': '#38bdf8',
      'editorWhitespace.foreground': '#1e293b',
      'editorIndentGuide.background': '#1e293b',
      'editorIndentGuide.activeBackground': '#334155',
      'minimap.background': '#0c0f14',
      'scrollbarSlider.background': '#33415540',
      'scrollbarSlider.hoverBackground': '#47556980',
      'scrollbarSlider.activeBackground': '#6366f180',
      'editorGutter.background': '#10141a',
      'editorOverviewRuler.border': '#161d27'
    }
  })

  // Slate Dark Theme
  monaco.editor.defineTheme('studio-slate', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '38bdf8', fontStyle: 'bold' },
      { token: 'string', foreground: '10b981' }
    ],
    colors: {
      'editor.background': '#0f172a',
      'editor.foreground': '#f1f5f9',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#38bdf8',
      'editor.lineHighlightBackground': '#1e293b',
      'editor.selectionBackground': '#38bdf833',
      'minimap.background': '#0b1120'
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

  const options = useMemo(() => ({
    fontSize,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
    fontLigatures: true,
    lineNumbers: showLineNumbers ? 'on' : 'off',
    wordWrap: wordWrap ? 'on' : 'off',
    tabSize,
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
    renderLineHighlight: 'all',
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
