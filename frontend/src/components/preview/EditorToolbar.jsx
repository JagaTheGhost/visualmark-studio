import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  applySmartFormat,
  formatMarkdownDocument,
  generateTableOfContents
} from '../../utils/markdownEditorHelpers'
import { foldDataUris, unfoldDataUris, hasFoldedTokens } from '../../utils/dataUriFold'

export default function EditorToolbar({
  markdown = '',
  setMarkdown = () => {},
  textareaRef,
  monacoEditorRef = null,
  activeFile = 'README.md',
  activeHeading = '',
  onScrollToHeading = () => {},
  onOpenBadgeBuilder,
  onOpenDiagramStudio,
  onOpenTableStudio,
  onOpenSnippetStudio,
  onOpenImageStudio,
  onOpenFindReplace,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}) {
  const [activeDropdown, setActiveDropdown] = useState(null) // 'heading' | 'codeLang' | 'callout' | 'table' | 'diagram' | 'outline'
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const toolbarRef = useRef(null)
  const dropdownRef = useRef(null)

  // Close open dropdowns when clicking outside or scrolling/resizing
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target))
      ) {
        setActiveDropdown(null)
      }
    }
    const handleClose = () => setActiveDropdown(null)

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', handleClose)
    window.addEventListener('scroll', handleClose, true)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleClose)
      window.removeEventListener('scroll', handleClose, true)
    }
  }, [])

  // Helper to extract active textarea
  const getTextarea = () => {
    const scrollContainer = textareaRef?.current
    return scrollContainer?.querySelector ? scrollContainer.querySelector('textarea') : scrollContainer
  }

  // Core Smart Formatting Action Dispatcher
  const executeFormat = (action, options = {}) => {
    setActiveDropdown(null)
    const isMonaco = Boolean(monacoEditorRef?.current)
    const textarea = getTextarea()
    const scrollContainer = textareaRef?.current

    let start = markdown.length
    let end = markdown.length

    if (isMonaco) {
      const editor = monacoEditorRef.current
      const model = editor.getModel()
      if (model) {
        const selection = editor.getSelection()
        if (selection) {
          start = model.getOffsetAt(selection.getStartPosition())
          end = model.getOffsetAt(selection.getEndPosition())
        }
      }
    } else {
      if (!textarea) return
      start = typeof textarea.selectionStart === 'number' ? textarea.selectionStart : markdown.length
      end = typeof textarea.selectionEnd === 'number' ? textarea.selectionEnd : markdown.length
    }

    // Record pre-execution positions
    const savedScrollTop = scrollContainer ? scrollContainer.scrollTop : 0
    const savedScrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0
    const previewArea = document.querySelector('.preview-pane')
    const savedPreviewTop = previewArea ? previewArea.scrollTop : 0

    const result = applySmartFormat(markdown, start, end, action, options)

    if (result && result.newContent !== undefined) {
      setMarkdown(result.newContent)

      if (isMonaco) {
        const editor = monacoEditorRef.current
        const model = editor.getModel()
        if (model && typeof result.newStart === 'number' && typeof result.newEnd === 'number') {
          setTimeout(() => {
            const pStart = model.getPositionAt(result.newStart)
            const pEnd = model.getPositionAt(result.newEnd)
            editor.setSelection({
              startLineNumber: pStart.lineNumber,
              startColumn: pStart.column,
              endLineNumber: pEnd.lineNumber,
              endColumn: pEnd.column
            })
            editor.focus()
          }, 0)
        }
      } else if (textarea) {
        const restoreScrollAndFocus = () => {
          if (scrollContainer) {
            scrollContainer.scrollTop = savedScrollTop
            scrollContainer.scrollLeft = savedScrollLeft
          }
          if (previewArea) {
            previewArea.scrollTop = savedPreviewTop
          }
          const gutter = document.querySelector('.editor-gutter')
          if (gutter && scrollContainer) {
            gutter.scrollTop = savedScrollTop
          }

          textarea.focus({ preventScroll: true })
          if (typeof result.newStart === 'number' && typeof result.newEnd === 'number') {
            textarea.setSelectionRange(result.newStart, result.newEnd)
          }
        }

        setTimeout(() => {
          restoreScrollAndFocus()
          window.requestAnimationFrame(restoreScrollAndFocus)
          setTimeout(restoreScrollAndFocus, 50)
        }, 0)
      }
    }
  }

  // Auto-format document tables and spacing
  const handleAutoFormatDocument = () => {
    const formatted = formatMarkdownDocument(markdown)
    if (formatted !== markdown) {
      setMarkdown(formatted)
    }
  }

  // Parse document outline for breadcrumb jumping
  const documentHeadings = React.useMemo(() => {
    const list = []
    const lines = (markdown || '').split('\n')
    lines.forEach((line, idx) => {
      const match = line.match(/^(#{1,6})\s+(.*)$/)
      if (match) {
        list.push({
          level: match[1].length,
          title: match[2].trim(),
          line: idx + 1
        })
      }
    })
    return list
  }, [markdown])

  const toggleDropdown = (key, event) => {
    if (activeDropdown === key) {
      setActiveDropdown(null)
      return
    }
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect()
      const left = Math.min(Math.max(8, rect.left), Math.max(8, window.innerWidth - 220))
      setDropdownPos({ top: rect.bottom + 4, left })
    }
    setActiveDropdown(key)
  }

  return (
    <div className="editor-sub-toolbar select-none" ref={toolbarRef}>
      {/* 1. Left Cluster: Typography, Formatting, Code & Block Structure */}
      <div className="toolbar-left-group" data-horizontal-scroll="true">
        {/* Headings Picker (H1 - H6) */}
        <div className="relative-dropdown">
          <button
            type="button"
            className={`toolbar-tool-btn dropdown-btn ${activeDropdown === 'heading' ? 'active' : ''}`}
            onClick={(e) => toggleDropdown('heading', e)}
            title="Heading Styles (H1 - H6, Normal Text)"
          >
            <span className="material-symbols-outlined icon-tool" style={{ fontSize: '14px' }}>title</span>
            <span className="btn-label-text">Headings</span>
            <span className="material-symbols-outlined icon-xs">
              {activeDropdown === 'heading' ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
          </button>

          {activeDropdown === 'heading' && typeof document !== 'undefined' && createPortal(
            <div
              ref={dropdownRef}
              className="heading-dropdown-menu"
              style={{ position: 'fixed', top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px`, zIndex: 9999 }}
            >
              <button type="button" onClick={() => executeFormat('heading', { level: 1 })} className="heading-item">
                <span className="item-h1">#</span> Heading 1 (Document Title)
              </button>
              <button type="button" onClick={() => executeFormat('heading', { level: 2 })} className="heading-item">
                <span className="item-h2">##</span> Heading 2 (Major Section)
              </button>
              <button type="button" onClick={() => executeFormat('heading', { level: 3 })} className="heading-item">
                <span className="item-h3">###</span> Heading 3 (Subsection)
              </button>
              <button type="button" onClick={() => executeFormat('heading', { level: 4 })} className="heading-item">
                <span className="item-h4">####</span> Heading 4 (Minor Section)
              </button>
              <button type="button" onClick={() => executeFormat('heading', { level: 5 })} className="heading-item">
                <span className="item-h5">#####</span> Heading 5 (Paragraph Header)
              </button>
              <button type="button" onClick={() => executeFormat('heading', { level: 6 })} className="heading-item">
                <span className="item-h6">######</span> Heading 6 (Subheader)
              </button>
              <div className="dropdown-divider" />
              <button type="button" onClick={() => executeFormat('heading', { level: 0 })} className="heading-item">
                <span className="item-p">P</span> Normal Paragraph
              </button>
            </div>,
            document.body
          )}
        </div>

        <span className="tool-separator" />

        {/* Inline Formatting: Bold, Italic, Strikethrough, Code, Quote */}
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={() => executeFormat('bold')}
          title="Bold (Ctrl+B / **text**)"
        >
          <span className="material-symbols-outlined icon-tool">format_bold</span>
        </button>
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={() => executeFormat('italic')}
          title="Italic (Ctrl+I / *text*)"
        >
          <span className="material-symbols-outlined icon-tool">format_italic</span>
        </button>
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={() => executeFormat('strikethrough')}
          title="Strikethrough (~~text~~)"
        >
          <span className="material-symbols-outlined icon-tool">strikethrough_s</span>
        </button>
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={() => executeFormat('inlineCode')}
          title="Inline Code (`code`)"
        >
          <span className="material-symbols-outlined icon-tool">code</span>
        </button>
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={() => executeFormat('blockquote')}
          title="Blockquote (> line)"
        >
          <span className="material-symbols-outlined icon-tool">format_quote</span>
        </button>

        <span className="tool-separator" />

        {/* Code Block with Language Dropdown */}
        <div className="relative-dropdown">
          <button
            type="button"
            className={`toolbar-tool-btn dropdown-btn ${activeDropdown === 'codeLang' ? 'active' : ''}`}
            onClick={(e) => toggleDropdown('codeLang', e)}
            title="Insert Code Block (```lang)"
          >
            <span className="material-symbols-outlined icon-tool">code_blocks</span>
            <span className="material-symbols-outlined icon-xs">
              {activeDropdown === 'codeLang' ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
          </button>

          {activeDropdown === 'codeLang' && typeof document !== 'undefined' && createPortal(
            <div
              ref={dropdownRef}
              className="heading-dropdown-menu code-lang-dropdown"
              style={{ position: 'fixed', top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px`, zIndex: 9999 }}
            >
              <div className="dropdown-menu-title">Select Language</div>
              {[
                { label: 'Bash / Shell', lang: 'bash' },
                { label: 'JavaScript', lang: 'javascript' },
                { label: 'TypeScript', lang: 'typescript' },
                { label: 'Python', lang: 'python' },
                { label: 'JSON', lang: 'json' },
                { label: 'HTML / XML', lang: 'html' },
                { label: 'CSS', lang: 'css' },
                { label: 'YAML', lang: 'yaml' },
                { label: 'SQL', lang: 'sql' },
                { label: 'Dockerfile', lang: 'dockerfile' }
              ].map((item) => (
                <button
                  key={item.lang}
                  type="button"
                  className="heading-item"
                  onClick={() => executeFormat('codeBlock', { language: item.lang })}
                >
                  <span className="code-lang-tag">{item.lang}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>,
            document.body
          )}
        </div>

        {/* Hyperlink */}
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={() => executeFormat('link')}
          title="Hyperlink ([text](url))"
        >
          <span className="material-symbols-outlined icon-tool">link</span>
        </button>

        {/* Image */}
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={() => executeFormat('image')}
          title="Image (![alt](url))"
        >
          <span className="material-symbols-outlined icon-tool">image</span>
        </button>

        <span className="tool-separator" />

        {/* Lists & Task Checklists */}
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={() => executeFormat('bulletList')}
          title="Bullet List (- item)"
        >
          <span className="material-symbols-outlined icon-tool">format_list_bulleted</span>
        </button>
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={() => executeFormat('numberList')}
          title="Numbered List (1. item)"
        >
          <span className="material-symbols-outlined icon-tool">format_list_numbered</span>
        </button>
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={() => executeFormat('taskList')}
          title="Task Checklist (- [ ] task)"
        >
          <span className="material-symbols-outlined icon-tool">check_box</span>
        </button>
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={() => executeFormat('divider')}
          title="Horizontal Rule (---)"
        >
          <span className="material-symbols-outlined icon-tool">horizontal_rule</span>
        </button>

        <span className="tool-separator" />

        {/* Table Dropdown */}
        <div className="relative-dropdown">
          <button
            type="button"
            className={`toolbar-tool-btn dropdown-btn ${activeDropdown === 'table' ? 'active' : ''}`}
            onClick={(e) => toggleDropdown('table', e)}
            title="Markdown Table Grid"
          >
            <span className="material-symbols-outlined icon-tool">table</span>
            <span className="material-symbols-outlined icon-xs">
              {activeDropdown === 'table' ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
          </button>

          {activeDropdown === 'table' && typeof document !== 'undefined' && createPortal(
            <div
              ref={dropdownRef}
              className="heading-dropdown-menu"
              style={{ position: 'fixed', top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px`, zIndex: 9999 }}
            >
              <div className="dropdown-menu-title">Insert Table</div>
              <button type="button" className="heading-item" onClick={() => executeFormat('table', { rows: 3, cols: 3 })}>
                <span className="item-h2">3×3</span> Standard Table
              </button>
              <button type="button" className="heading-item" onClick={() => executeFormat('table', { rows: 4, cols: 4 })}>
                <span className="item-h3">4×4</span> Feature Matrix
              </button>
              <button type="button" className="heading-item" onClick={() => executeFormat('table', { rows: 2, cols: 2 })}>
                <span className="item-p">2×2</span> Key-Value Table
              </button>
              <div className="dropdown-divider" />
              <button
                type="button"
                className="heading-item text-primary"
                onClick={() => {
                  setActiveDropdown(null)
                  if (onOpenTableStudio) onOpenTableStudio()
                }}
              >
                <span className="material-symbols-outlined text-xs">table_chart</span> Visual Table Studio...
              </button>
            </div>,
            document.body
          )}
        </div>

        {/* GitHub Alerts / Callouts Dropdown */}
        <div className="relative-dropdown">
          <button
            type="button"
            className={`toolbar-tool-btn dropdown-btn ${activeDropdown === 'callout' ? 'active' : ''}`}
            onClick={(e) => toggleDropdown('callout', e)}
            title="GitHub Alert Callouts (> [!NOTE])"
          >
            <span className="material-symbols-outlined icon-tool">campaign</span>
            <span className="material-symbols-outlined icon-xs">
              {activeDropdown === 'callout' ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
          </button>

          {activeDropdown === 'callout' && typeof document !== 'undefined' && createPortal(
            <div
              ref={dropdownRef}
              className="heading-dropdown-menu"
              style={{ position: 'fixed', top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px`, zIndex: 9999 }}
            >
              <div className="dropdown-menu-title">GitHub Alerts</div>
              <button type="button" className="heading-item" onClick={() => executeFormat('callout', { type: 'NOTE' })}>
                <span className="callout-chip chip-note">NOTE</span> Informative note
              </button>
              <button type="button" className="heading-item" onClick={() => executeFormat('callout', { type: 'TIP' })}>
                <span className="callout-chip chip-tip">TIP</span> Helpful tip or hint
              </button>
              <button type="button" className="heading-item" onClick={() => executeFormat('callout', { type: 'IMPORTANT' })}>
                <span className="callout-chip chip-important">IMPORTANT</span> Crucial details
              </button>
              <button type="button" className="heading-item" onClick={() => executeFormat('callout', { type: 'WARNING' })}>
                <span className="callout-chip chip-warning">WARNING</span> Warning notice
              </button>
              <button type="button" className="heading-item" onClick={() => executeFormat('callout', { type: 'CAUTION' })}>
                <span className="callout-chip chip-caution">CAUTION</span> Danger / critical
              </button>
            </div>,
            document.body
          )}
        </div>

        {/* Mermaid Diagram Dropdown */}
        <div className="relative-dropdown">
          <button
            type="button"
            className={`toolbar-tool-btn dropdown-btn ${activeDropdown === 'diagram' ? 'active' : ''}`}
            onClick={(e) => toggleDropdown('diagram', e)}
            title="Mermaid Diagrams & Architecture"
          >
            <span className="material-symbols-outlined icon-tool">schema</span>
            <span className="material-symbols-outlined icon-xs">
              {activeDropdown === 'diagram' ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
          </button>

          {activeDropdown === 'diagram' && typeof document !== 'undefined' && createPortal(
            <div
              ref={dropdownRef}
              className="heading-dropdown-menu"
              style={{ position: 'fixed', top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px`, zIndex: 9999 }}
            >
              <div className="dropdown-menu-title">Insert Diagram</div>
              <button
                type="button"
                className="heading-item"
                onClick={() => {
                  setActiveDropdown(null)
                  const snippet = '\n```mermaid\ngraph TD\n  Client[Client Browser] -->|HTTP / REST| API[FastAPI Gateway]\n  API --> Service[Documentation Engine]\n  Service --> Output[Generated Markdown]\n```\n\n'
                  const t = getTextarea()
                  const pos = t?.selectionStart || markdown.length
                  setMarkdown(markdown.substring(0, pos) + snippet + markdown.substring(pos))
                }}
              >
                <span className="material-symbols-outlined text-xs">account_tree</span> Flowchart (TD)
              </button>
              <button
                type="button"
                className="heading-item"
                onClick={() => {
                  setActiveDropdown(null)
                  const snippet = '\n```mermaid\nsequenceDiagram\n  autonumber\n  Actor->>Client: Request Doc\n  Client->>Server: POST /generate\n  Server-->>Client: 200 Streamed Content\n```\n\n'
                  const t = getTextarea()
                  const pos = t?.selectionStart || markdown.length
                  setMarkdown(markdown.substring(0, pos) + snippet + markdown.substring(pos))
                }}
              >
                <span className="material-symbols-outlined text-xs">sync_alt</span> Sequence Diagram
              </button>
              <div className="dropdown-divider" />
              <button
                type="button"
                className="heading-item text-primary"
                onClick={() => {
                  setActiveDropdown(null)
                  if (onOpenDiagramStudio) onOpenDiagramStudio()
                }}
              >
                <span className="material-symbols-outlined text-xs">hub</span> Visual Diagram Studio...
              </button>
            </div>,
            document.body
          )}
        </div>

        {/* Collapsible Section <details> */}
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={() => executeFormat('details')}
          title="Collapsible Dropdown (<details><summary>)"
        >
          <span className="material-symbols-outlined icon-tool">unfold_more</span>
        </button>

        {/* Generate Table of Contents */}
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={() => executeFormat('toc')}
          title="Generate Table of Contents from Document Headings"
        >
          <span className="material-symbols-outlined icon-tool">toc</span>
        </button>

        {/* Shields.io Badge Studio Shortcut */}
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={onOpenBadgeBuilder}
          title="Open Shields.io Badge Studio"
        >
          <span className="material-symbols-outlined icon-tool text-indigo-400">shield</span>
        </button>
      </div>

      {/* 2. Right Cluster: Document Utilities (Undo, Redo, Format, Fold, Find) */}
      <div className="toolbar-right-group">
        {/* Undo */}
        <button
          type="button"
          className={`toolbar-tool-btn ${!canUndo ? 'btn-disabled' : ''}`}
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <span className="material-symbols-outlined icon-tool">undo</span>
        </button>

        {/* Redo */}
        <button
          type="button"
          className={`toolbar-tool-btn ${!canRedo ? 'btn-disabled' : ''}`}
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
        >
          <span className="material-symbols-outlined icon-tool">redo</span>
        </button>

        <span className="tool-separator" />

        {/* Auto-Format Document Tables & Spacing */}
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={handleAutoFormatDocument}
          title="Format Document (Align markdown tables & trim spacing)"
        >
          <span className="material-symbols-outlined icon-tool">auto_fix_high</span>
        </button>

        {/* Fold / Unfold Data URIs */}
        <button
          type="button"
          className={`toolbar-tool-btn ${hasFoldedTokens(markdown) ? 'active text-primary-400' : ''}`}
          onClick={() => {
            if (hasFoldedTokens(markdown)) {
              setMarkdown(unfoldDataUris(markdown))
            } else {
              setMarkdown(foldDataUris(markdown))
            }
          }}
          title={hasFoldedTokens(markdown) ? 'Unfold all Data URIs to full text (Alt+F)' : 'Fold long Data URIs & Banners into short form (Alt+F)'}
        >
          <span className="material-symbols-outlined icon-tool">
            {hasFoldedTokens(markdown) ? 'unfold_more' : 'unfold_less'}
          </span>
        </button>

        {/* In-Editor Find & Replace */}
        <button
          type="button"
          className="toolbar-tool-btn"
          onClick={onOpenFindReplace}
          title="Find & Replace in Buffer (Ctrl+F)"
        >
          <span className="material-symbols-outlined icon-tool">find_replace</span>
        </button>
      </div>
    </div>
  )
}
