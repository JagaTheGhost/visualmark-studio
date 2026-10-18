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
  readLocalMedia: (filePath) => ipcRenderer.invoke('read-local-media', filePath),

  // Workspace Directory Operations
  openFolderDialog: () => ipcRenderer.invoke('dialog-open-folder'),
  readWorkspaceFiles: (folderPath) => ipcRenderer.invoke('workspace-read-files', folderPath),
  readWorkspaceTree: (folderPath) => ipcRenderer.invoke('workspace-read-tree', folderPath),
  getDefaultWorkspace: () => ipcRenderer.invoke('workspace-get-default'),
  createFileDirect: (filePath, initialContent) => ipcRenderer.invoke('file-create-direct', { filePath, initialContent }),
  createFolderDirect: (folderPath) => ipcRenderer.invoke('folder-create-direct', folderPath),
  deleteFileDirect: (filePath) => ipcRenderer.invoke('file-delete-direct', filePath),
  moveFileDirect: (sourcePath, targetPath) => ipcRenderer.invoke('file-move-direct', { sourcePath, targetPath }),
  copyFileDirect: (sourcePath, targetPath) => ipcRenderer.invoke('file-copy-direct', { sourcePath, targetPath }),

  // System & External OS Actions
  openExternalUrl: (url) => ipcRenderer.send('open-external-url', url),
  showItemInFolder: (filePath) => ipcRenderer.send('show-in-folder', filePath),
  openPathInOs: (filePath) => ipcRenderer.invoke('open-path-in-os', filePath),
  toggleDevTools: () => ipcRenderer.send('window-toggle-devtools'),
  reloadWindow: () => ipcRenderer.send('window-reload'),

  // Git / Source Control Operations
  getGitInfo: (folderPath) => ipcRenderer.invoke('git-get-status', folderPath),
  gitStageAll: (folderPath) => ipcRenderer.invoke('git-stage-all', folderPath),
  gitStageFile: (folderPath, filePath) => ipcRenderer.invoke('git-stage-file', { folderPath, filePath }),
  gitUnstageAll: (folderPath) => ipcRenderer.invoke('git-unstage-all', folderPath),
  gitUnstageFile: (folderPath, filePath) => ipcRenderer.invoke('git-unstage-file', { folderPath, filePath }),
  gitDiscardFile: (folderPath, filePath) => ipcRenderer.invoke('git-discard-file', { folderPath, filePath }),
  gitDiscardAll: (folderPath) => ipcRenderer.invoke('git-discard-all', folderPath),
  gitCommit: (folderPath, message) => ipcRenderer.invoke('git-commit', { folderPath, message }),
  gitCommitAction: (folderPath, message, action) => ipcRenderer.invoke('git-commit-action', { folderPath, message, action }),
  gitPush: (folderPath) => ipcRenderer.invoke('git-push', folderPath),
  gitPull: (folderPath) => ipcRenderer.invoke('git-pull', folderPath),
  gitFetch: (folderPath) => ipcRenderer.invoke('git-fetch', folderPath),
  gitGetGraph: (folderPath, maxCount) => ipcRenderer.invoke('git-get-graph', { folderPath, maxCount }),
  gitGetBranches: (folderPath) => ipcRenderer.invoke('git-get-branches', folderPath),
  gitCheckoutBranch: (folderPath, branch) => ipcRenderer.invoke('git-checkout-branch', { folderPath, branch }),
  gitCreateBranch: (folderPath, branch) => ipcRenderer.invoke('git-create-branch', { folderPath, branch }),
  gitDiff: (folderPath, filePath, staged) => ipcRenderer.invoke('git-diff', { folderPath, filePath, staged }),
  gitShowCommit: (folderPath, hash) => ipcRenderer.invoke('git-show-commit', { folderPath, hash }),
  gitGenerateCommitMessage: (folderPath) => ipcRenderer.invoke('git-generate-commit-message', folderPath),
  gitInit: (folderPath) => ipcRenderer.invoke('git-init', folderPath),
  gitClone: (options) => ipcRenderer.invoke('git-clone', options),
  gitGetDefaultCloneDir: () => ipcRenderer.invoke('git-get-default-clone-dir'),
  selectCloneParentDialog: () => ipcRenderer.invoke('dialog-select-clone-parent'),

  // Backend Sidecar Connection Info
  getBackendUrl: () => ipcRenderer.invoke('get-backend-url'),

  // In-App Auto-Updater & What's New IPC
  getAppVersion: () => ipcRenderer.invoke('app-get-version'),
  checkForUpdates: () => ipcRenderer.invoke('app-check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('app-download-update'),
  setAutoDownload: (enabled) => ipcRenderer.invoke('app-set-auto-download', enabled),
  getAutoDownload: () => ipcRenderer.invoke('app-get-auto-download'),
  quitAndInstallUpdate: () => ipcRenderer.send('app-quit-and-install'),
  onUpdateAvailable: (callback) => {
    const handler = (_event, info) => callback(info)
    ipcRenderer.on('app-update-available', handler)
    return () => ipcRenderer.removeListener('app-update-available', handler)
  },
  onUpdateProgress: (callback) => {
    const handler = (_event, progress) => callback(progress)
    ipcRenderer.on('app-update-progress', handler)
    return () => ipcRenderer.removeListener('app-update-progress', handler)
  },
  onUpdateDownloaded: (callback) => {
    const handler = (_event, info) => callback(info)
    ipcRenderer.on('app-update-downloaded', handler)
    return () => ipcRenderer.removeListener('app-update-downloaded', handler)
  },
  onUpdateNotAvailable: (callback) => {
    const handler = (_event, info) => callback(info)
    ipcRenderer.on('app-update-not-available', handler)
    return () => ipcRenderer.removeListener('app-update-not-available', handler)
  },
  onUpdateError: (callback) => {
    const handler = (_event, err) => callback(err)
    ipcRenderer.on('app-update-error', handler)
    return () => ipcRenderer.removeListener('app-update-error', handler)
  },

  // Windows Shell & Context Menu External Open Listeners
  onOpenExternalWorkspace: (callback) => {
    const handler = (_event, ws) => callback(ws)
    ipcRenderer.on('open-external-workspace', handler)
    return () => ipcRenderer.removeListener('open-external-workspace', handler)
  },
  onOpenExternalFile: (callback) => {
    const handler = (_event, file) => callback(file)
    ipcRenderer.on('open-external-file', handler)
    return () => ipcRenderer.removeListener('open-external-file', handler)
  }
})

