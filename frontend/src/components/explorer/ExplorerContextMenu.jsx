import React from 'react'

export default function ExplorerContextMenu({
  contextMenu = null,
  onClose = () => {},
  onStartCreation = () => {},
  onOpenFile = () => {},
  onStartRename = () => {},
  onDeleteTarget = () => {},
  onOpenFolder = () => {},
  showToast = () => {}
}) {
  if (!contextMenu) return null

  return (
    <div
      className="ide-context-menu"
      style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      {contextMenu.node ? (
        <>
          {contextMenu.node.isDirectory ? (
            <>
              <button
                type="button"
                className="ide-context-item"
                onClick={() => {
                  onStartCreation('file', contextMenu.node.relPath)
                  onClose()
                }}
              >
                <div className="ide-context-item-left">
                  <span className="material-symbols-outlined ide-context-icon">note_add</span>
                  <span>New File...</span>
                </div>
              </button>

              <button
                type="button"
                className="ide-context-item"
                onClick={() => {
                  onStartCreation('folder', contextMenu.node.relPath)
                  onClose()
                }}
              >
                <div className="ide-context-item-left">
                  <span className="material-symbols-outlined ide-context-icon">create_new_folder</span>
                  <span>New Folder...</span>
                </div>
              </button>

              <div className="ide-context-separator" />

              <button
                type="button"
                className="ide-context-item"
                onClick={() => onStartRename(contextMenu.node)}
              >
                <div className="ide-context-item-left">
                  <span className="material-symbols-outlined ide-context-icon">edit</span>
                  <span>Rename...</span>
                </div>
                <span className="ide-context-shortcut">F2</span>
              </button>

              <button
                type="button"
                className="ide-context-item is-danger"
                onClick={() => {
                  onDeleteTarget(contextMenu.node)
                  onClose()
                }}
              >
                <div className="ide-context-item-left">
                  <span className="material-symbols-outlined ide-context-icon">delete</span>
                  <span>Delete Folder...</span>
                </div>
                <span className="ide-context-shortcut">Del</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="ide-context-item"
                onClick={() => {
                  onOpenFile(contextMenu.node)
                  onClose()
                }}
              >
                <div className="ide-context-item-left">
                  <span className="material-symbols-outlined ide-context-icon">file_open</span>
                  <span>Open File</span>
                </div>
              </button>

              <button
                type="button"
                className="ide-context-item"
                onClick={() => onStartRename(contextMenu.node)}
              >
                <div className="ide-context-item-left">
                  <span className="material-symbols-outlined ide-context-icon">edit</span>
                  <span>Rename...</span>
                </div>
                <span className="ide-context-shortcut">F2</span>
              </button>

              {contextMenu.node.name !== 'README.md' && (
                <button
                  type="button"
                  className="ide-context-item is-danger"
                  onClick={() => {
                    onDeleteTarget(contextMenu.node)
                    onClose()
                  }}
                >
                  <div className="ide-context-item-left">
                    <span className="material-symbols-outlined ide-context-icon">delete</span>
                    <span>Delete File...</span>
                  </div>
                  <span className="ide-context-shortcut">Del</span>
                </button>
              )}
            </>
          )}

          <div className="ide-context-separator" />

          <button
            type="button"
            className="ide-context-item"
            onClick={() => {
              navigator.clipboard?.writeText(contextMenu.node.relPath || contextMenu.node.name)
              onClose()
              showToast('Copied relative path', 'info', { minor: true })
            }}
          >
            <div className="ide-context-item-left">
              <span className="material-symbols-outlined ide-context-icon">content_copy</span>
              <span>Copy Relative Path</span>
            </div>
          </button>

          {contextMenu.node.path && (
            <button
              type="button"
              className="ide-context-item"
              onClick={() => {
                navigator.clipboard?.writeText(contextMenu.node.path)
                onClose()
                showToast('Copied full path', 'info', { minor: true })
              }}
            >
              <div className="ide-context-item-left">
                <span className="material-symbols-outlined ide-context-icon">content_copy</span>
                <span>Copy Full Path</span>
              </div>
            </button>
          )}

          {contextMenu.node.path && typeof window !== 'undefined' && window.electronAPI?.showItemInFolder && (
            <>
              <div className="ide-context-separator" />
              <button
                type="button"
                className="ide-context-item"
                onClick={() => {
                  window.electronAPI.showItemInFolder(contextMenu.node.path)
                  onClose()
                }}
              >
                <div className="ide-context-item-left">
                  <span className="material-symbols-outlined ide-context-icon">folder_open</span>
                  <span>Reveal in File Explorer</span>
                </div>
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            className="ide-context-item"
            onClick={() => {
              onStartCreation('file')
              onClose()
            }}
          >
            <div className="ide-context-item-left">
              <span className="material-symbols-outlined ide-context-icon">note_add</span>
              <span>New File</span>
            </div>
          </button>

          <button
            type="button"
            className="ide-context-item"
            onClick={() => {
              onStartCreation('folder')
              onClose()
            }}
          >
            <div className="ide-context-item-left">
              <span className="material-symbols-outlined ide-context-icon">create_new_folder</span>
              <span>New Folder</span>
            </div>
          </button>

          <div className="ide-context-separator" />

          <button
            type="button"
            className="ide-context-item"
            onClick={() => {
              onOpenFolder()
              onClose()
            }}
          >
            <div className="ide-context-item-left">
              <span className="material-symbols-outlined ide-context-icon">folder_open</span>
              <span>Open Folder...</span>
            </div>
          </button>
        </>
      )}
    </div>
  )
}
