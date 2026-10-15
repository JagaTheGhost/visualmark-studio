import React from 'react'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-markdown'
import 'prismjs/themes/prism-tomorrow.css'
import MonacoEditorPane from './MonacoEditorPane'
import { decorateFoldTokensInPrismHtml } from '../../utils/dataUriFold'

export default function EditorSurface({
  editorEngine = 'monaco',
  activeFile = 'README.md',
  safeMarkdown,
  onMarkdownChange,
  previewPreset,
  fontSize,
  wordWrap,
  showLineNumbers,
  tabSize,
  themeMode,
  editorLanguage,
  setActiveLine,
  onCursorChange,
  handleMonacoScroll,
  monacoEditorRef,
  editorScrollRef,
  gutterRef,
  isEditorDragOver,
  handleEditorDragOver,
  handleEditorDragLeave,
  handleEditorDrop,
  lineFoldState,
  handleExpandFold,
  handleFoldCurrent,
  lines,
  activeLine,
  lineHeights,
  handleGutterLineClick,
  handleEditorScroll,
  handleEditorKeyUpOrClick,
  handleEditorKeyDown,
  handleEditorBlur,
  findReplaceWidget = null
}) {
  return (
    <div
      className="editor-surface"
      onDragOver={handleEditorDragOver}
      onDragEnter={handleEditorDragOver}
      onDragLeave={handleEditorDragLeave}
      onDrop={handleEditorDrop}
    >
      {findReplaceWidget}
      {isEditorDragOver && (
        <div className="editor-drop-zone-overlay">
          <div className="editor-drop-zone-box">
            <span className="material-symbols-outlined editor-drop-icon">cloud_upload</span>
            <div className="editor-drop-title">Drop to import into project</div>
            <div className="editor-drop-desc">Images will be copied to ./assets/ and linked in Markdown</div>
          </div>
        </div>
      )}

      {editorEngine === 'monaco' ? (
        <MonacoEditorPane
          value={safeMarkdown}
          onChange={previewPreset ? () => {} : onMarkdownChange}
          activeFile={activeFile}
          fontSize={fontSize}
          wordWrap={wordWrap}
          showLineNumbers={showLineNumbers}
          tabSize={tabSize}
          themeMode={themeMode}
          language={editorLanguage}
          onCursorChange={(pos) => {
            setActiveLine(pos.line)
            if (onCursorChange) {
              onCursorChange({ line: pos.line, col: pos.col })
            }
          }}
          onScroll={handleMonacoScroll}
          editorRef={monacoEditorRef}
        />
      ) : (
        <>
          {/* Inline / Floating Action Bar for Folded or Expanded Data URIs */}
          {lineFoldState && (
            <div className={`editor-fold-bar ${lineFoldState.type === 'expanded' ? 'expanded' : ''}`}>
              <span className="material-symbols-outlined text-sm">
                {lineFoldState.type === 'folded' ? 'data_object' : 'unfold_less'}
              </span>
              <span>
                {lineFoldState.type === 'folded'
                  ? `Data URI Collapsed (${lineFoldState.size})`
                  : `Data URI Expanded (${lineFoldState.size})`}
              </span>
              {lineFoldState.type === 'folded' ? (
                <button
                  type="button"
                  className="editor-fold-bar-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleExpandFold(lineFoldState.id)}
                  title="Click or press Alt+F to expand full Data URI"
                >
                  <span className="material-symbols-outlined text-xs">unfold_more</span>
                  <span>Expand</span>
                  <kbd>Alt+F</kbd>
                </button>
              ) : (
                <button
                  type="button"
                  className="editor-fold-bar-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleFoldCurrent}
                  title="Fold back into short form (or click outside to auto-fold)"
                >
                  <span className="material-symbols-outlined text-xs">unfold_less</span>
                  <span>Fold back</span>
                  <kbd>Alt+F</kbd>
                </button>
              )}
            </div>
          )}

          {/* Numerical Line Gutter */}
          {showLineNumbers && (
            <div className="editor-gutter custom-scrollbar" ref={gutterRef}>
              {lines.map((_, idx) => {
                const lineNum = idx + 1
                const isCurrent = lineNum === activeLine
                const lineH = lineHeights && lineHeights[idx] ? lineHeights[idx] : null
                return (
                  <div
                    key={lineNum}
                    className={`gutter-line ${isCurrent ? 'active' : ''}`}
                    style={lineH ? { height: `${lineH}px`, minHeight: `${lineH}px` } : undefined}
                    onClick={() => handleGutterLineClick(lineNum)}
                    title={`Line ${lineNum}`}
                  >
                    <span className="gutter-num">{lineNum}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Code Text Area */}
          <div
            className={`editor-scroll-area custom-scrollbar ${wordWrap ? 'wrap' : 'nowrap'}`}
            ref={editorScrollRef}
            onScroll={handleEditorScroll}
            onBlur={handleEditorBlur}
          >
            <Editor
              value={safeMarkdown}
              onValueChange={previewPreset ? () => {} : onMarkdownChange}
              highlight={(code) => {
                let highlighted = ''
                if (Prism.languages.markdown) {
                  highlighted = Prism.highlight(code || '', Prism.languages.markdown, 'markdown')
                  highlighted = decorateFoldTokensInPrismHtml(highlighted)
                } else {
                  highlighted = decorateFoldTokensInPrismHtml(code || '')
                }
                let lineIdx = 1
                return (
                  `<span class="editor-line-anchor" data-line="1"></span>` +
                  highlighted.replace(/\n/g, () => {
                    lineIdx++
                    return `\n<span class="editor-line-anchor" data-line="${lineIdx}"></span>`
                  })
                )
              }}
              onClick={handleEditorKeyUpOrClick}
              onKeyUp={handleEditorKeyUpOrClick}
              onKeyDown={handleEditorKeyDown}
              padding={16}
              tabSize={2}
              insertSpaces={true}
              className="ide-code-textarea"
              textareaClassName="ide-code-inner-textarea"
              preClassName="ide-code-inner-pre"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
                fontSize: fontSize,
                backgroundColor: 'transparent',
                minHeight: '100%',
                width: '100%',
                outline: 'none',
                border: 'none',
                boxShadow: 'none'
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
