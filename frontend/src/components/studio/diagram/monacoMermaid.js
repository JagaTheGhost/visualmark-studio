/**
 * Monaco Editor Monarch Syntax Highlighting Definition for Mermaid.js
 */

export function registerMermaidLanguage(monaco) {
  if (!monaco || !monaco.languages) return

  const registeredLangs = monaco.languages.getLanguages()
  if (registeredLangs.some((l) => l.id === 'mermaid')) {
    return
  }

  monaco.languages.register({ id: 'mermaid' })

  monaco.languages.setMonarchTokensProvider('mermaid', {
    defaultToken: '',
    tokenPostfix: '.mermaid',

    keywords: [
      'graph',
      'flowchart',
      'sequenceDiagram',
      'classDiagram',
      'stateDiagram',
      'stateDiagram-v2',
      'erDiagram',
      'journey',
      'gantt',
      'pie',
      'gitGraph',
      'mindmap',
      'quadrantChart',
      'timeline',
      'C4Context',
      'C4Container',
      'C4Component',
      'subgraph',
      'end',
      'direction',
      'participant',
      'actor',
      'activate',
      'deactivate',
      'loop',
      'alt',
      'else',
      'opt',
      'par',
      'and',
      'critical',
      'break',
      'rect',
      'autonumber',
      'Note',
      'note',
      'over',
      'left of',
      'right of',
      'as',
      'commit',
      'branch',
      'checkout',
      'merge',
      'tag',
      'title',
      'accTitle',
      'accDescr',
      'class',
      'classDef',
      'style',
      'linkStyle',
      'click',
      'interpolate',
      'fill',
      'stroke',
      'stroke-width',
      'color',
      'TD',
      'TB',
      'BT',
      'RL',
      'LR',
      'PK',
      'FK',
      'UK'
    ],

    operators: [
      '-->',
      '-.->',
      '==>',
      '<-->',
      '---',
      '-.-',
      '===',
      '->>',
      '-->>',
      '->',
      '-->',
      '-x',
      '--x',
      '||--o{',
      '||--||',
      '}o--o{',
      '||--o|',
      '<|--',
      '*--',
      'o--',
      '..|>'
    ],

    tokenizer: {
      root: [
        // Comments
        [/%%.*$/, 'comment'],

        // Directives %%{init: ...}%%
        [/%%\{.*?\}%%/, 'meta'],

        // Keywords
        [
          /[a-zA-Z_][a-zA-Z0-9_-]*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@default': 'identifier'
            }
          }
        ],

        // Strings
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'([^'\\]|\\.)*'/, 'string'],

        // Arrows & Connectors
        [/(-->|-.->|==>|<-->|---|->>|-->>|\|\|--o\{|\|\|--\|\||\}o--o\{)/, 'operator'],

        // Labels inside pipes |label|
        [/\|[^|]+\|/, 'string.pipe'],

        // Delimiters and brackets
        [/[{}()[\]]/, '@brackets'],
        [/[:;,.]/, 'delimiter'],

        // Numbers
        [/\b\d+(\.\d+)?\b/, 'number']
      ]
    }
  })

  // Register completion item provider for helpful snippets
  monaco.languages.registerCompletionItemProvider('mermaid', {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        {
          label: 'subgraph',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'subgraph ${1:ClusterId} ["${2:Cluster Name}"]\n  ${3:NodeA} --> ${4:NodeB}\nend',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Insert a visual Subgraph / VPC cluster container'
        },
        {
          label: 'node-box',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '${1:nodeId}["${2:Node Label}"]',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Rectangle box node'
        },
        {
          label: 'node-pill',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '${1:nodeId}(["${2:Client / Start}"])',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Rounded pill / stadium node'
        },
        {
          label: 'node-database',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '${1:dbId}[("${2:PostgreSQL Database}")]',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Database cylinder node'
        },
        {
          label: 'sequence-participant',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'participant ${1:API} as ${2:Backend REST API}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Sequence participant with alias'
        },
        {
          label: 'sequence-note',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'Note over ${1:Alice,Bob}: ${2:Security Token Verification}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Sequence diagram note box'
        },
        {
          label: 'er-table',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '${1:TABLE_NAME} {\n  uuid id PK\n  string name\n  timestamp created_at\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'ER Diagram entity table'
        }
      ]
      return { suggestions }
    }
  })
}
