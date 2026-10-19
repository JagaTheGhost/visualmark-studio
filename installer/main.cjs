const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const { executeInstallation, executeUninstallation } = require('./engine.cjs')

let mainWindow = null
const isUninstallMode = process.argv.some(arg => arg.toLowerCase().includes('uninstall')) ||
                        path.basename(process.execPath).toLowerCase().includes('uninstall')

function createInstallerWindow() {
  mainWindow = new BrowserWindow({
    width: 860,
    height: 520,
    minWidth: 840,
    minHeight: 500,
    frame: false,
    resizable: false,
    center: true,
    backgroundColor: '#0a0d14',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      webSecurity: true,
      spellcheck: false
    }
  })

  // Security: Deny creation of secondary windows or external popups
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))

  // Security: Prevent in-window navigation away from installer UI
  mainWindow.webContents.on('will-navigate', (event) => {
    event.preventDefault()
  })

  const targetHtml = isUninstallMode ? 'uninstaller.html' : 'index.html'
  mainWindow.loadFile(path.join(__dirname, targetHtml))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createInstallerWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createInstallerWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC Handlers
ipcMain.handle('get-default-path', () => {
  const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || 'C:\\', 'AppData', 'Local')
  return path.join(localAppData, 'Programs', 'VisualMark Studio')
})

ipcMain.handle('select-directory', async () => {
  if (!mainWindow) return null
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Installation Directory',
    properties: ['openDirectory', 'createDirectory', 'promptToCreate']
  })
  if (result.canceled || result.filePaths.length === 0) return null
  let selected = result.filePaths[0]
  if (!selected.toLowerCase().endsWith('visualmark studio')) {
    selected = path.join(selected, 'VisualMark Studio')
  }
  return selected
})

ipcMain.handle('start-installation', async (_event, config) => {
  try {
    const result = await executeInstallation(config, (percent, status) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('install-progress', { percent, status })
      }
    })
    return { success: true, targetExe: result.targetExe }
  } catch (err) {
    console.error('Installation failed:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('start-uninstallation', async (_event, config) => {
  try {
    const result = await executeUninstallation(config, (percent, status) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('uninstall-progress', { percent, status })
      }
    })
    return { success: true }
  } catch (err) {
    console.error('Uninstallation failed:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('launch-app', (_event, appPath) => {
  try {
    const child = spawn(appPath, [], { detached: true, stdio: 'ignore' })
    child.unref()
    setTimeout(() => {
      app.quit()
    }, 350)
    return true
  } catch (err) {
    console.error('Failed to launch application:', err)
    return false
  }
})

ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize()
})

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close()
})
