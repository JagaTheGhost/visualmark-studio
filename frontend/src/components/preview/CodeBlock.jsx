import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Reusable CodeBlock component with language badge and copy action
export default function CodeBlock({ language, value, ...props }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-lang">{language || 'text'}</span>
        <button
          type="button"
          className="code-copy-btn"
          onClick={handleCopy}
          title="Copy code snippet"
        >
          <span className="material-symbols-outlined icon-copy-btn">
            {copied ? 'check' : 'content_copy'}
          </span>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          background: 'var(--surface-container-lowest, #0a0e14)',
          borderRadius: '0 0 var(--radius-sm, 4px) var(--radius-sm, 4px)',
          fontSize: '0.82rem',
          lineHeight: '1.5',
          border: '1px solid var(--border-color, #30363d)',
          borderTop: 'none'
        }}
        {...props}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}
