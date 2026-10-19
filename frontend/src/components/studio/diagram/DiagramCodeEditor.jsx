import React, { useEffect, useRef } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { registerMermaidLanguage } from './monacoMermaid'

export default function DiagramCodeEditor({
  code = '',
  onChange,
  onApplySnippet
}) {
  const monaco = useMonaco()
  const editorRef = useRef(null)

  useEffect(() => {
    if (monaco) {
      registerMermaidLanguage(monaco)
    }
  }, [monaco])

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor
  }

  // Quick Snippet Insert
  const handleInsertSnippet = (snippetText) => {
    if (editorRef.current) {
      const editor = editorRef.current
      const selection = editor.getSelection()
      const op = {
        range: selection,
        text: snippetText,
        forceMoveMarkers: true
      }
      editor.executeEdits('diagram-studio', [op])
      editor.focus()
      if (typeof onChange === 'function') {
        onChange(editor.getValue())
      }
    } else if (typeof onApplySnippet === 'function') {
      onApplySnippet(snippetText)
    }
  }

  const QUICK_SNIPPETS = [
    { label: '+ Subgraph', text: '\nsubgraph ClusterName ["Cluster Title"]\n  NodeA["Component A"] --> NodeB["Component B"]\nend\n' },
    { label: '+ Box Node', text: 'NodeID["Component Name"]' },
    { label: '+ Pill Node', text: 'ClientID(["Web / Mobile Client"])' },
    { label: '+ DB Cylinder', text: 'DBID[("PostgreSQL DB")]' },
    { label: '+ Arrow -->', text: ' -->|HTTPS| ' },
    { label: '+ Dotted -.->', text: ' -.->|Async| ' },
    { label: '+ Thick ==>', text: ' ==>|High Throughput| ' },
    { label: '+ Note Over', text: '\nNote over Alice,Bob: Security Handshake\n' },
    { label: '+ Loop Box', text: '\nloop Pulse (Every 30s)\n  Ping ->> Pong: PING / PONG\nend\n' },
    { label: '+ ER Table', text: '\nTABLE_NAME {\n  uuid id PK\n  string name\n  timestamp created_at\n}\n' }
  ]

  const lineCount = (code || '').split('\n').length
  const charCount = (code || '').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '8px' }}>
      {/* Editor Header & Snippet Toolbar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#818cf8' }}>code</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>architecture.mmd</span>
            <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
              ({lineCount} lines • {charCount} chars)
            </span>
          </div>

          <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
            Monaco Mermaid Engine
          </span>
        </div>

        {/* Quick Insert Snippets Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {QUICK_SNIPPETS.map((snip) => (
            <button
              key={snip.label}
              type="button"
              className="diagram-quick-chip"
              onClick={() => handleInsertSnippet(snip.text)}
              style={{ padding: '3px 6px', fontSize: '10px', fontFamily: 'monospace' }}
            >
              <span>{snip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div
        style={{
          flex: 1,
          minHeight: '420px',
          borderRadius: '6px',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          background: '#1e1e1e'
        }}
      >
        <Editor
          height="100%"
          language="mermaid"
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 12,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
            lineNumbers: 'on',
            minimap: { enabled: false },
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true },
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>
    </div>
  )
}
