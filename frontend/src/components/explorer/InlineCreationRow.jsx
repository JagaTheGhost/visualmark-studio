import React from 'react'
import { FolderIcon } from './ExplorerIcons'

export default function InlineCreationRow({
  depth = 0,
  action = { type: 'file', parentPath: '' }, // { type: 'file' | 'folder', parentPath }
  name = '',
  setName = () => {},
  onSubmit = () => {},
  onCancel = () => {},
  inputRef = null
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="ide-tree-row is-creating-row"
      style={{ paddingLeft: `${(depth + 1) * 14 + 6}px` }}
    >
      <span className="ide-tree-chevron">
        <span className="tree-spacer" />
      </span>
      <span className="ide-tree-icon">
        {action.type === 'folder' ? (
          <FolderIcon isExpanded={false} />
        ) : (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="#38bdf8">
            <path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM3 11V6h1.5l1.5 2 1.5-2H9v5H7.5V8.5L6 10.5 4.5 8.5V11H3zm9.5 0L10 8.5h1.5V6H13v2.5h1.5L12.5 11z"/>
          </svg>
        )}
      </span>
      <input
        ref={inputRef}
        type="text"
        className="ide-inline-rename-input"
        placeholder={action.type === 'folder' ? 'folder-name' : 'new-file.md'}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation()
            onCancel()
          }
        }}
        onBlur={onSubmit}
        autoFocus
      />
    </form>
  )
}
