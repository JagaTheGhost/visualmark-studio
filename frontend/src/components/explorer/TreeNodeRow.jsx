import React from 'react'
import { getTreeItemIcon } from './ExplorerIcons'

export default function TreeNodeRow({
  node,
  depth = 0,
  isExpanded = false,
  isSelected = false,
  isActive = false,
  gitStatus = null,
  renamingNode = null,
  renameValue = '',
  setRenameValue = () => {},
  renameInputRef = null,
  onCommitRename = () => {},
  onCancelRename = () => {},
  onToggleExpand = () => {},
  onSelectNode = () => {},
  onOpenFile = () => {},
  onContextMenu = () => {},
  onStartCreation = () => {},
  dragOverNode = null,
  onDragStart = () => {},
  onDragOver = () => {},
  onDragLeave = () => {},
  onDrop = () => {}
}) {
  const isRenaming = renamingNode && (renamingNode.path || renamingNode.name) === (node.path || node.name)
  const isDragOver = dragOverNode === (node.path || node.name)

  return (
    <div
      className={`ide-tree-row ${isSelected ? 'is-selected' : ''} ${isActive ? 'is-active' : ''} ${isDragOver ? 'is-drag-over' : ''}`}
      style={{ paddingLeft: `${depth * 14 + 6}px` }}
      onClick={(e) => {
        e.stopPropagation()
        onSelectNode(node)
        if (node.isDirectory) {
          onToggleExpand(node.relPath)
        } else {
          onOpenFile(node)
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onContextMenu(e, node)
      }}
      draggable
      onDragStart={(e) => onDragStart(e, node)}
      onDragOver={(e) => onDragOver(e, node)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, node)}
    >
      {/* Chevron for directories, spacer for files */}
      <span
        className="ide-tree-chevron"
        onClick={(e) => {
          if (node.isDirectory) {
            e.stopPropagation()
            onToggleExpand(node.relPath)
          }
        }}
      >
        {node.isDirectory ? (
          <span className="material-symbols-outlined">
            {isExpanded ? 'expand_more' : 'chevron_right'}
          </span>
        ) : (
          <span className="tree-spacer" />
        )}
      </span>

      {/* File or Folder Icon */}
      <span className="ide-tree-icon">
        {getTreeItemIcon(node, isExpanded)}
      </span>

      {/* Label or Inline Rename Input */}
      {isRenaming ? (
        <form
          onSubmit={onCommitRename}
          onClick={(e) => e.stopPropagation()}
          style={{ flex: 1, display: 'flex', minWidth: 0 }}
        >
          <input
            ref={renameInputRef}
            type="text"
            className="ide-inline-rename-input"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation()
                onCancelRename()
              }
            }}
            onBlur={onCommitRename}
            autoFocus
          />
        </form>
      ) : (
        <span
          className={`ide-tree-label truncate ${gitStatus === 'M' ? 'status-modified' : ''} ${gitStatus === 'U' ? 'status-untracked' : ''}`}
        >
          {node.name}
        </span>
      )}

      {/* Git Tag or Hover Quick Actions */}
      <div className="ide-tree-meta">
        {gitStatus && !node.isDirectory && (
          <span
            className={`ide-git-tag status-${gitStatus.toLowerCase()}`}
            title={`Git: ${gitStatus === 'M' ? 'Modified' : 'Untracked'}`}
          >
            {gitStatus}
          </span>
        )}

        {node.isDirectory && (
          <div className="ide-folder-hover-actions" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ide-row-quick-btn"
              onClick={() => onStartCreation('file', node.relPath, depth + 1)}
              title={`New file inside ${node.name}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>note_add</span>
            </button>
            <button
              type="button"
              className="ide-row-quick-btn"
              onClick={() => onStartCreation('folder', node.relPath, depth + 1)}
              title={`New folder inside ${node.name}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>create_new_folder</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
