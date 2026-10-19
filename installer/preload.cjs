const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('installerAPI', {
  getDefaultInstallPath: () => ipcRenderer.invoke('get-default-path'),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  startInstallation: (config) => ipcRenderer.invoke('start-installation', config),
  launchApp: (appPath) => ipcRenderer.invoke('launch-app', appPath),
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  onProgress: (callback) => {
    ipcRenderer.on('install-progress', (_event, data) => callback(data))
  },
  startUninstallation: (config) => ipcRenderer.invoke('start-uninstallation', config),
  onUninstallProgress: (callback) => {
    ipcRenderer.on('uninstall-progress', (_event, data) => callback(data))
  }
})
