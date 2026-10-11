/**
 * README Studio - Electron Preload Script
 * Secure IPC Context Bridge exposing native desktop capabilities to React UI.
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,

  // Window Controls (VS Code / Antigravity IDE frameless titlebar)
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  isWindowMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  onMaximizedChange: (callback) => {
    const handler = (_event, isMax) => callback(isMax)
    ipcRenderer.on('window-maximized-state', handler)
    return () => ipcRenderer.removeListener('window-maximized-state', handler)
  },

  // Native File Dialogs and Disk Access
  openFileDialog: () => ipcRenderer.invoke('dialog-open-file'),
  saveFileDialog: (content, defaultPath) => ipcRenderer.invoke('dialog-save-file', { content, defaultPath }),
  saveDirectFile: (filePath, content) => ipcRenderer.invoke('file-save-direct', { filePath, content }),
  saveBinaryDialog: (options) => ipcRenderer.invoke('dialog-save-binary', options),
  saveTextExportDialog: (options) => ipcRenderer.invoke('dialog-save-text-export', options),
  readFile: (filePath) => ipcRenderer.invoke('file-read', filePath),

  // Workspace Directory Operations
  openFolderDialog: () => ipcRenderer.invoke('dialog-open-folder'),
  readWorkspaceFiles: (folderPath) => ipcRenderer.invoke('workspace-read-files', folderPath),
  readWorkspaceTree: (folderPath) => ipcRenderer.invoke('workspace-read-tree', folderPath),
  getDefaultWorkspace: () => ipcRenderer.invoke('workspace-get-default'),
  createFileDirect: (filePath, initialContent) => ipcRenderer.invoke('file-create-direct', { filePath, initialContent }),
  createFolderDirect: (folderPath) => ipcRenderer.invoke('folder-create-direct', folderPath),
  deleteFileDirect: (filePath) => ipcRenderer.invoke('file-delete-direct', filePath),
  moveFileDirect: (sourcePath, targetPath) => ipcRenderer.invoke('file-move-direct', { sourcePath, targetPath }),

  // System & External OS Actions
  openExternalUrl: (url) => ipcRenderer.send('open-external-url', url),
  showItemInFolder: (filePath) => ipcRenderer.send('show-in-folder', filePath),
  openPathInOs: (filePath) => ipcRenderer.invoke('open-path-in-os', filePath),
  openTerminal: (options) => ipcRenderer.invoke('terminal-open-external', options),
  toggleDevTools: () => ipcRenderer.send('window-toggle-devtools'),
  reloadWindow: () => ipcRenderer.send('window-reload'),

  // Embedded Integrated Terminal IPC
  startTerminalSession: (options) => ipcRenderer.invoke('terminal-session-start', options),
  writeTerminalSession: (options) => ipcRenderer.invoke('terminal-session-write', options),
  killTerminalSession: (options) => ipcRenderer.invoke('terminal-session-kill', options),
  onTerminalSessionData: (callback) => {
    const handler = (_event, payload) => callback(payload)
    ipcRenderer.on('terminal-session-data', handler)
    return () => ipcRenderer.removeListener('terminal-session-data', handler)
  },
  onTerminalSessionExit: (callback) => {
    const handler = (_event, payload) => callback(payload)
    ipcRenderer.on('terminal-session-exit', handler)
    return () => ipcRenderer.removeListener('terminal-session-exit', handler)
  },

  // Git / Source Control Operations
  getGitInfo: (folderPath) => ipcRenderer.invoke('git-get-status', folderPath),
  gitStageAll: (folderPath) => ipcRenderer.invoke('git-stage-all', folderPath),
  gitCommit: (folderPath, message) => ipcRenderer.invoke('git-commit', { folderPath, message }),
  gitInit: (folderPath) => ipcRenderer.invoke('git-init', folderPath),

  // Backend Sidecar Connection Info
  getBackendUrl: () => ipcRenderer.invoke('get-backend-url')
})

