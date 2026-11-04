/**
 * README Studio - Electron Main Process
 * Manages desktop window lifecycle, frameless window controls, native file system, and Python sidecar.
 */
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const fs = require('fs')
const { spawn, execFile, exec, spawnSync } = require('child_process')
const http = require('http')
const net = require('net')

let mainWindow = null
let sidecarProcess = null
const DEFAULT_BACKEND_PORT = 8000
let activeBackendPort = DEFAULT_BACKEND_PORT
const isDev = !app.isPackaged || process.env.NODE_ENV === 'development'
if (isDev) {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
}
const activeTerminals = new Map()

// Helper to extract file or directory path from command line arguments (e.g. from Explorer context menu)
function parsePathFromArgv(args) {
  if (!Array.isArray(args)) return null
  const appExe = app.isPackaged ? app.getPath('exe') : null
  const appDir = appExe ? path.dirname(appExe) : null
  const startIndex = app.isPackaged ? 1 : 2
  for (let i = startIndex; i < args.length; i++) {
    const arg = args[i]
    if (!arg || arg.startsWith('--') || arg.startsWith('-')) continue
    try {
      const resolved = path.resolve(arg)
      // Never treat application's own executable or installation directory as a workspace
      if (app.isPackaged && appDir && (resolved === appExe || resolved === appDir || resolved.startsWith(appDir + path.sep))) {
        continue
      }
      if (fs.existsSync(resolved)) {
        return resolved
      }
    } catch {}
  }
  return null
}

function handleOpenExternalPath(targetPath) {
  if (!mainWindow || mainWindow.isDestroyed() || !targetPath) return
  try {
    const stat = fs.statSync(targetPath)
    if (stat.isDirectory()) {
      mainWindow.webContents.send('open-external-workspace', {
        folderPath: targetPath,
        folderName: path.basename(targetPath)
      })
    } else {
      mainWindow.webContents.send('open-external-file', {
        filePath: targetPath,
        fileName: path.basename(targetPath)
      })
    }
  } catch (err) {
    console.warn('[CLI] Error handling external path:', err)
  }
}

// Single-instance lock to ensure single IDE window and forward CLI/context-menu arguments
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      const targetPath = parsePathFromArgv(commandLine)
      if (targetPath) {
        handleOpenExternalPath(targetPath)
      }
    }
  })
}

/**
 * Check if a TCP port is currently free on localhost.
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.once('error', () => resolve(false))
    server.once('listening', () => {
      server.close(() => resolve(true))
    })
    server.listen(port, '127.0.0.1')
  })
}

/**
 * Scan for an available port starting at startPort (checks up to maxAttempts).
 */
async function findAvailablePort(startPort = 8000, maxAttempts = 30) {
  for (let port = startPort; port < startPort + maxAttempts; port++) {
    if (await isPortAvailable(port)) {
      return port
    }
  }
  return startPort
}

/**
 * Health check helper to verify if the backend daemon is responsive.
 */
function checkBackendHealth(port = activeBackendPort) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/health`, (res) => {
      resolve(res.statusCode === 200)
    })
    req.on('error', () => resolve(false))
    req.setTimeout(1000, () => {
      req.destroy()
      resolve(false)
    })
  })
}

/**
 * Launch or verify the Python FastAPI sidecar process.
 * Resilient against port 8000 conflicts with automatic fallback to free port.
 */
async function ensureSidecar() {
  // 1. Check if backend is already active on default port 8000
  const isDefaultActive = await checkBackendHealth(DEFAULT_BACKEND_PORT)
  if (isDefaultActive) {
    activeBackendPort = DEFAULT_BACKEND_PORT
    console.log('[Sidecar] Backend already active on port', activeBackendPort)
    return
  }

  // 2. Resolve a free port (prefers 8000 if unoccupied, otherwise dynamic port 8001-8030)
  activeBackendPort = await findAvailablePort(DEFAULT_BACKEND_PORT)
  console.log('[Sidecar] Allocated backend port:', activeBackendPort)

  // Determine path to bundled binary or live python script
  const pythonScript = path.resolve(__dirname, '../../backend/desktop_server.py')
  const preferLiveDev = isDev && fs.existsSync(pythonScript)

  const isWindows = process.platform === 'win32'
  const binaryName = isWindows ? 'server.exe' : 'server'

  const candidatePaths = [
    app.isPackaged ? path.join(process.resourcesPath, 'backend-sidecar', 'server', binaryName) : null,
    app.isPackaged ? path.join(process.resourcesPath, 'backend-sidecar', binaryName) : null,
    path.join(__dirname, '../resources/backend-sidecar', 'server', binaryName),
    path.join(__dirname, '../resources/backend-sidecar', binaryName),
  ].filter(Boolean)

  const bundledExe = candidatePaths.find((p) => fs.existsSync(p))

  if (preferLiveDev) {
    const pyCmd = isWindows ? 'python' : (process.env.PYTHON || 'python3')
    console.log('[Sidecar Dev] Spawning live python daemon:', pythonScript)
    try {
      sidecarProcess = spawn(pyCmd, [pythonScript, '--port', String(activeBackendPort)], {
        cwd: path.dirname(pythonScript),
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
        detached: false
      })
      sidecarProcess.stdout?.on('data', (chunk) => {
        const text = chunk.toString('utf-8').trim()
        if (text) console.log(`[Sidecar Dev] ${text}`)
      })
      sidecarProcess.stderr?.on('data', (chunk) => {
        const text = chunk.toString('utf-8').trim()
        if (text) console.warn(`[Sidecar Dev Err] ${text}`)
      })
      sidecarProcess.on('error', () => {
        console.log('[Sidecar Dev] Python direct spawn skipped (external terminal might be running).')
      })

      for (let attempt = 0; attempt < 16; attempt++) {
        const ok = await checkBackendHealth(activeBackendPort)
        if (ok) {
          console.log(`[Sidecar Dev] Successfully connected to backend daemon on port ${activeBackendPort} (attempt ${attempt + 1})`)
          break
        }
        await new Promise((resolve) => setTimeout(resolve, 250))
      }
    } catch (err) {
      console.error('[Sidecar Dev Spawn Failed]', err)
    }
  } else if (bundledExe) {
    if (!isWindows) {
      try {
        fs.chmodSync(bundledExe, 0o755)
      } catch (err) {
        console.warn('[Sidecar] Warning: Could not chmod executable:', err)
      }
    }
    console.log('[Sidecar] Launching bundled sidecar binary:', bundledExe)
    try {
      const sidecarCwd = path.dirname(bundledExe)
      sidecarProcess = spawn(bundledExe, ['--port', String(activeBackendPort)], {
        cwd: sidecarCwd,
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
        detached: false
      })
      sidecarProcess.stdout?.on('data', (chunk) => {
        const text = chunk.toString('utf-8').trim()
        if (text) console.log(`[Sidecar] ${text}`)
      })
      sidecarProcess.stderr?.on('data', (chunk) => {
        const text = chunk.toString('utf-8').trim()
        if (text) console.warn(`[Sidecar Err] ${text}`)
      })
      sidecarProcess.on('error', (err) => console.error('[Sidecar Error]', err))
      sidecarProcess.on('exit', (code, signal) => {
        console.warn(`[Sidecar Exit] Sidecar exited with code ${code}, signal ${signal}`)
      })

      // Poll for backend to be healthy before continuing (up to 4s)
      for (let attempt = 0; attempt < 16; attempt++) {
        const ok = await checkBackendHealth(activeBackendPort)
        if (ok) {
          console.log(`[Sidecar] Successfully connected to backend daemon on port ${activeBackendPort} (attempt ${attempt + 1})`)
          break
        }
        await new Promise((resolve) => setTimeout(resolve, 250))
      }
    } catch (err) {
      console.error('[Sidecar Spawn Failed]', err)
    }
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'VisualMark Studio',
    icon: path.join(__dirname, '../public/icon.png'),
    width: 1440,
    height: 900,
    minWidth: 1040,
    minHeight: 640,
    frame: false, // Frameless for VS Code / Antigravity custom titlebar
    backgroundColor: '#0d1117',
    show: false, // Show once ready-to-show to prevent white flash
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      spellcheck: true,
      devTools: isDev
    }
  })

  // Smooth window reveal
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Window maximized state listeners
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-maximized-state', true)
  })
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-maximized-state', false)
  })

  // External URLs opened in user default browser (strictly deny creation of secondary electron windows)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsed = new URL(url)
      if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
        shell.openExternal(url)
      }
    } catch {}
    return { action: 'deny' }
  })

  // Prevent arbitrary top-level in-window navigation
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    try {
      const parsed = new URL(navigationUrl)
      if (isDev && parsed.origin === 'http://localhost:3000') {
        return // Allow Vite dev server reload/navigation
      }
      if (navigationUrl.startsWith('file://')) {
        // Only allow internal bundled UI file navigation (e.g. dist/index.html)
        const allowedDistDir = path.normalize(path.join(__dirname, '../dist')).toLowerCase()
        const rawFilePath = decodeURIComponent(parsed.pathname || '').replace(/^\/([a-zA-Z]:)/, '$1')
        const normalizedTarget = path.normalize(rawFilePath).toLowerCase()
        if (normalizedTarget.startsWith(allowedDistDir)) {
          return // Allow bundled application asset navigation
        }
        event.preventDefault()
        return // Block arbitrary file:// disk navigation
      }
      event.preventDefault()
      if (['http:', 'https:'].includes(parsed.protocol)) {
        shell.openExternal(navigationUrl)
      }
    } catch {
      event.preventDefault()
    }
  })

  // Developer shortcuts & renderer error logging in development mode
  if (isDev) {
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.control && input.shift && input.key.toLowerCase() === 'i') {
        mainWindow.webContents.toggleDevTools()
        event.preventDefault()
      }
      if (input.key === 'F5' || (input.control && input.key.toLowerCase() === 'r')) {
        mainWindow.reload()
        event.preventDefault()
      }
    })
    mainWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
      if (level >= 2) {
        console.log(`[Renderer ${level === 3 ? 'ERROR' : 'WARN'}] ${message} (${sourceId}:${line})`)
      }
    })
  } else {
    // In production builds: strictly disable and block any DevTools shortcuts and inspect keys
    mainWindow.webContents.on('before-input-event', (event, input) => {
      const key = (input.key || '').toLowerCase()
      if (
        key === 'f12' ||
        (input.control && input.shift && (key === 'i' || key === 'j' || key === 'c')) ||
        (input.control && key === 'u')
      ) {
        event.preventDefault()
      }
    })
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  // Load dev server or built bundle
  const devUrl = 'http://localhost:3000'
  if (isDev && process.env.VITE_DEV_SERVER !== 'false') {
    mainWindow.loadURL(devUrl).catch(() => {
      // Fallback to dist if dev server isn't active
      const distPath = path.join(__dirname, '../dist/index.html')
      if (fs.existsSync(distPath)) {
        mainWindow.loadFile(distPath)
      }
    })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// ==================== WORKSPACE & IPC SECURITY CONFINEMENT ====================

const activeWorkspaces = new Set()
const authorizedFiles = new Set()
let currentActiveWorkspace = null

/**
 * Validates that an incoming IPC request originated from the legitimate local UI frame.
 */
function validateIpcSender(event) {
  if (!event || !event.senderFrame) return false
  const frameUrl = event.senderFrame.url
  if (!frameUrl) return false
  if (isDev) {
    return (
      frameUrl.startsWith('http://localhost:3000') ||
      frameUrl.startsWith('http://127.0.0.1:3000') ||
      frameUrl.startsWith('file://')
    )
  }
  return frameUrl.startsWith('file://')
}

/**
 * Normalizes and canonicalizes a path, resolving symlinks when target exists.
 */
function getCanonicalPath(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') return null
  try {
    const resolved = path.resolve(targetPath)
    if (fs.existsSync(resolved)) {
      return fs.realpathSync(resolved)
    }
    // If target does not exist yet (e.g. creating new file), resolve parent realpath
    const parentDir = path.dirname(resolved)
    if (fs.existsSync(parentDir)) {
      const canonicalParent = fs.realpathSync(parentDir)
      return path.join(canonicalParent, path.basename(resolved))
    }
    return resolved
  } catch {
    return path.resolve(targetPath)
  }
}

/**
 * Registers an authorized workspace directory after validating it is not a sensitive OS path.
 */
function registerAuthorizedWorkspace(folderPath) {
  if (!folderPath || typeof folderPath !== 'string') return false
  try {
    const resolved = path.resolve(folderPath)
    if (!fs.existsSync(resolved)) return false
    const stat = fs.statSync(resolved)
    if (!stat.isDirectory()) return false

    // Prevent registering root of filesystem (e.g. C:\ or /)
    const root = path.parse(resolved).root
    if (resolved.toLowerCase() === root.toLowerCase()) {
      console.warn('[Security] Denied root directory as workspace:', resolved)
      return false
    }

    const lower = resolved.toLowerCase()
    const forbiddenPaths = [
      'c:\\windows',
      'c:\\program files',
      'c:\\program files (x86)',
      'c:\\programdata',
      '/etc',
      '/bin',
      '/sbin',
      '/usr',
      '/var',
      '/sys',
      '/proc',
      '/system',
      '/library'
    ]
    for (const forbidden of forbiddenPaths) {
      if (lower === forbidden || lower.startsWith(forbidden + path.sep)) {
        console.warn('[Security] Denied system directory as workspace:', resolved)
        return false
      }
    }

    // Disallow registering application installation folder itself
    const appDir = path.dirname(process.execPath).toLowerCase()
    if (lower === appDir || lower.startsWith(appDir + path.sep)) {
      console.warn('[Security] Denied application install directory as workspace:', resolved)
      return false
    }

    const canonical = getCanonicalPath(resolved)
    if (canonical) {
      activeWorkspaces.add(canonical)
      currentActiveWorkspace = canonical
      return true
    }
    return false
  } catch {
    return false
  }
}

/**
 * Registers a specific file explicitly chosen by the user via native open/save dialogs.
 */
function registerAuthorizedFile(filePath) {
  const canonical = getCanonicalPath(filePath)
  if (canonical) {
    authorizedFiles.add(canonical)
    try {
      const parentDir = path.dirname(canonical)
      if (parentDir && fs.existsSync(parentDir)) {
        registerAuthorizedWorkspace(parentDir)
      }
    } catch {}
  }
}

/**
 * Enforces path containment within authorized workspaces or explicitly selected files.
 */
function isPathWithinWorkspace(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') return false

  // If path is relative and we have active workspaces, check if resolving against ws is valid
  if (!path.isAbsolute(targetPath) && activeWorkspaces.size > 0) {
    for (const ws of activeWorkspaces) {
      const resolvedAgainstWs = path.resolve(ws, targetPath)
      const rel = path.relative(ws, resolvedAgainstWs)
      if (!rel.startsWith('..') && !path.isAbsolute(rel)) {
        return true
      }
    }
  }

  const canonical = getCanonicalPath(targetPath)
  if (!canonical) return false

  // Directly authorized single file
  if (authorizedFiles.has(canonical)) {
    return true
  }

  // Contained within an authorized workspace directory
  for (const ws of activeWorkspaces) {
    const rel = path.relative(ws, canonical)
    if (!rel.startsWith('..') && !path.isAbsolute(rel)) {
      return true
    }
  }

  return false
}

// ==================== IPC HANDLERS ====================

// Window controls
ipcMain.on('window-minimize', (event) => {
  if (!validateIpcSender(event)) return
  if (mainWindow) mainWindow.minimize()
})

ipcMain.on('window-maximize', (event) => {
  if (!validateIpcSender(event)) return
  if (!mainWindow) return
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})

ipcMain.on('window-close', (event) => {
  if (!validateIpcSender(event)) return
  if (mainWindow) mainWindow.close()
})

ipcMain.handle('window-is-maximized', (event) => {
  if (!validateIpcSender(event)) return false
  return mainWindow ? mainWindow.isMaximized() : false
})

// Native Open File Dialog
ipcMain.handle('dialog-open-file', async (event) => {
  if (!validateIpcSender(event)) return { canceled: true, error: 'Unauthorized IPC origin' }
  if (!mainWindow) return { canceled: true }
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Markdown File',
    filters: [
      { name: 'Markdown Documents', extensions: ['md', 'markdown', 'mdown', 'mkd'] },
      { name: 'Text Documents', extensions: ['txt', 'rst', 'org'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  })

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true }
  }

  const targetPath = result.filePaths[0]
  registerAuthorizedFile(targetPath)
  try {
    const content = await fs.promises.readFile(targetPath, 'utf-8')
    return {
      canceled: false,
      filePath: targetPath,
      fileName: path.basename(targetPath),
      content
    }
  } catch (err) {
    return { canceled: false, error: err.message }
  }
})

// Native Save File Dialog (Save As)
ipcMain.handle('dialog-save-file', async (event, { content, defaultPath }) => {
  if (!validateIpcSender(event)) return { canceled: true, error: 'Unauthorized IPC origin' }
  if (!mainWindow) return { canceled: true }
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Save Markdown Document',
    defaultPath: defaultPath || 'README.md',
    filters: [
      { name: 'Markdown Document', extensions: ['md'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (result.canceled || !result.filePath) {
    return { canceled: true }
  }

  registerAuthorizedFile(result.filePath)
  try {
    await fs.promises.writeFile(result.filePath, content, 'utf-8')
    return {
      canceled: false,
      filePath: result.filePath,
      fileName: path.basename(result.filePath)
    }
  } catch (err) {
    return { canceled: false, error: err.message }
  }
})

// Direct File Save (Ctrl+S without dialog)
ipcMain.handle('file-save-direct', async (event, { filePath, content }) => {
  if (!validateIpcSender(event)) return { success: false, error: 'Unauthorized IPC origin' }
  if (!filePath) return { success: false, error: 'No file path specified' }
  if (!isPathWithinWorkspace(filePath)) {
    console.warn('[Security] Refused file-save-direct outside workspace:', filePath)
    return { success: false, error: 'Access denied: Path is outside active workspace' }
  }
  try {
    await fs.promises.writeFile(filePath, content, 'utf-8')
    return { success: true, filePath, fileName: path.basename(filePath) }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Native Save Binary Dialog (for ZIP archives, PDF documents, rendered images)
ipcMain.handle('dialog-save-binary', async (event, { defaultPath, filters, base64Data }) => {
  if (!validateIpcSender(event)) return { canceled: true, error: 'Unauthorized IPC origin' }
  if (!mainWindow) return { canceled: true }
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export File',
    defaultPath: defaultPath || 'export.bin',
    filters: filters || [{ name: 'All Files', extensions: ['*'] }]
  })
  if (result.canceled || !result.filePath) {
    return { canceled: true }
  }
  registerAuthorizedFile(result.filePath)
  try {
    const buffer = Buffer.from(base64Data, 'base64')
    await fs.promises.writeFile(result.filePath, buffer)
    return { canceled: false, filePath: result.filePath, fileName: path.basename(result.filePath) }
  } catch (err) {
    return { canceled: false, error: err.message }
  }
})

// Native Save Text Export Dialog (for HTML, Markdown, etc.)
ipcMain.handle('dialog-save-text-export', async (event, { defaultPath, filters, content }) => {
  if (!validateIpcSender(event)) return { canceled: true, error: 'Unauthorized IPC origin' }
  if (!mainWindow) return { canceled: true }
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Document',
    defaultPath: defaultPath || 'export.html',
    filters: filters || [{ name: 'All Files', extensions: ['*'] }]
  })
  if (result.canceled || !result.filePath) {
    return { canceled: true }
  }
  registerAuthorizedFile(result.filePath)
  try {
    await fs.promises.writeFile(result.filePath, content || '', 'utf-8')
    return { canceled: false, filePath: result.filePath, fileName: path.basename(result.filePath) }
  } catch (err) {
    return { canceled: false, error: err.message }
  }
})

// Toggle Developer Tools (Only allowed in development mode)
ipcMain.on('window-toggle-devtools', () => {
  if (mainWindow && isDev) {
    mainWindow.webContents.toggleDevTools()
  }
})

// Query whether app is in development mode
ipcMain.handle('app-is-dev', () => isDev)

// Reload window
ipcMain.on('window-reload', () => {
  if (mainWindow) {
    mainWindow.webContents.reload()
  }
})

// Common binary, media, executable and archive extensions that cannot be parsed as text
const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico', 'webp', 'tiff', 'psd',
  'pdf', 'zip', 'tar', 'gz', '7z', 'rar', 'bz2', 'xz',
  'exe', 'dll', 'so', 'dylib', 'bin', 'pyc', 'pyo', 'pyd', 'class', 'jar', 'wasm',
  'mp4', 'mov', 'avi', 'mkv', 'webm', 'mp3', 'wav', 'ogg', 'flac', 'aac',
  'db', 'sqlite', 'sqlite3', 'iso', 'dmg',
  'woff', 'woff2', 'ttf', 'eot', 'otf',
  'docx', 'xlsx', 'pptx'
])

// Dangerous executable and script extensions that must never be launched directly via shell.openPath
const DANGEROUS_EXECUTABLE_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'vbs', 'vbe', 'js', 'jse', 'wsf', 'wsh', 'ps1', 'ps1xml',
  'ps2', 'psc1', 'psc2', 'msh', 'msh1', 'msh2', 'mshxml', 'msh1xml', 'msh2xml',
  'scr', 'msi', 'msp', 'com', 'pif', 'hta', 'cpl', 'jar', 'reg', 'inf', 'scf', 'lnk', 'url'
])

// Read arbitrary file with binary / unsupported format fail-safe (atomic file handle to prevent race conditions)
ipcMain.handle('file-read', async (event, filePath) => {
  if (!validateIpcSender(event)) {
    return { success: false, error: 'Unauthorized IPC origin' }
  }
  if (!filePath || typeof filePath !== 'string') {
    return { success: false, error: 'Invalid path' }
  }
  if (!isPathWithinWorkspace(filePath)) {
    console.warn('[Security] Refused file-read outside workspace:', filePath)
    return { success: false, error: 'Access denied: Path is outside active workspace' }
  }
  let fd = null
  try {
    fd = await fs.promises.open(filePath, 'r')
    const stat = await fd.stat()
    if (stat.isDirectory()) {
      await fd.close()
      return { success: false, error: 'Target is a directory' }
    }
    const ext = path.extname(filePath).toLowerCase().replace(/^\./, '')
    const fileName = path.basename(filePath)

    // 1. Extension check
    if (BINARY_EXTENSIONS.has(ext)) {
      await fd.close()
      return {
        success: true,
        isUnsupported: true,
        reason: 'binary_extension',
        fileName,
        filePath,
        extension: ext,
        size: stat.size
      }
    }

    // 2. File size safety guard (> 5MB is treated as oversized document)
    if (stat.size > 5 * 1024 * 1024) {
      await fd.close()
      return {
        success: true,
        isUnsupported: true,
        reason: 'file_too_large',
        fileName,
        filePath,
        extension: ext,
        size: stat.size
      }
    }

    // 3. Buffer inspection: check for null bytes in initial chunk
    const sampleSize = Math.min(1024, stat.size)
    const buffer = Buffer.alloc(sampleSize)
    if (sampleSize > 0) {
      await fd.read(buffer, 0, sampleSize, 0)
    }

    if (buffer.includes(0)) {
      await fd.close()
      return {
        success: true,
        isUnsupported: true,
        reason: 'binary_content',
        fileName,
        filePath,
        extension: ext,
        size: stat.size
      }
    }

    const content = await fd.readFile({ encoding: 'utf-8' })
    await fd.close()
    return { success: true, content, fileName, filePath, size: stat.size }
  } catch (err) {
    if (fd) {
      try { await fd.close() } catch {}
    }
    if (err.code === 'ENOENT') {
      return { success: false, error: 'File does not exist' }
    }
    return { success: false, error: err.message }
  }
})

// Read workspace media file (SVG, PNG, JPG, GIF, WebP, MP4, Audio) for Markdown Preview (atomic file handle)
ipcMain.handle('read-local-media', async (event, filePath) => {
  if (!validateIpcSender(event)) {
    return { success: false, error: 'Unauthorized IPC origin' }
  }
  if (!filePath || typeof filePath !== 'string') {
    return { success: false, error: 'Invalid path' }
  }
  let cleanInput = filePath.split('?')[0].split('#')[0]
  try {
    cleanInput = decodeURIComponent(cleanInput)
  } catch {}
  let targetPath = cleanInput

  if (!path.isAbsolute(targetPath) && activeWorkspaces.size > 0) {
    for (const ws of activeWorkspaces) {
      const candidate1 = path.resolve(ws, targetPath)
      if (fs.existsSync(candidate1)) {
        targetPath = candidate1
        break
      }
      const candidate2 = path.resolve(ws, targetPath.replace(/^[/\\]+/, ''))
      if (fs.existsSync(candidate2)) {
        targetPath = candidate2
        break
      }
    }
  }
  if (!isPathWithinWorkspace(targetPath)) {
    console.warn('[Security] Refused read-local-media outside workspace:', filePath)
    return { success: false, error: 'Access denied: Path is outside active workspace' }
  }
  let fd = null
  try {
    fd = await fs.promises.open(targetPath, 'r')
    const stat = await fd.stat()
    if (stat.isDirectory()) {
      await fd.close()
      return { success: false, error: 'Target is a directory' }
    }
    if (stat.size > 50 * 1024 * 1024) {
      await fd.close()
      return { success: false, error: 'File exceeds size limit (>50MB)' }
    }
    const ext = path.extname(targetPath).toLowerCase().replace(/^\./, '')
    if (ext === 'svg') {
      const content = await fd.readFile({ encoding: 'utf-8' })
      await fd.close()
      return { success: true, isSvg: true, content, filePath: targetPath }
    }

    const mimeMap = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      webp: 'image/webp',
      bmp: 'image/bmp',
      ico: 'image/x-icon',
      avif: 'image/avif',
      tiff: 'image/tiff',
      tif: 'image/tiff',
      mp4: 'video/mp4',
      webm: 'video/webm',
      ogg: 'video/ogg',
      ogv: 'video/ogg',
      mov: 'video/quicktime',
      m4v: 'video/mp4',
      mkv: 'video/x-matroska',
      avi: 'video/x-msvideo',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      aac: 'audio/aac',
      m4a: 'audio/mp4',
      oga: 'audio/ogg',
      flac: 'audio/flac',
      weba: 'audio/webm'
    }
    const mime = mimeMap[ext] || 'image/png'
    const buffer = await fd.readFile()
    await fd.close()
    const base64 = buffer.toString('base64')
    return { success: true, isSvg: false, dataUrl: `data:${mime};base64,${base64}`, filePath: targetPath }
  } catch (err) {
    if (fd) {
      try { await fd.close() } catch {}
    }
    if (err.code === 'ENOENT') {
      return { success: false, error: 'File does not exist' }
    }
    return { success: false, error: err.message }
  }
})


// Native Open Folder / Workspace Dialog
ipcMain.handle('dialog-open-folder', async (event) => {
  if (!validateIpcSender(event)) return { canceled: true, error: 'Unauthorized IPC origin' }
  if (!mainWindow) return { canceled: true }
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Workspace Directory',
    properties: ['openDirectory']
  })

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true }
  }

  const folderPath = result.filePaths[0]
  registerAuthorizedWorkspace(folderPath)
  const scan = scanMarkdownFolder(folderPath)
  return {
    canceled: false,
    folderPath,
    folderName: path.basename(folderPath),
    files: scan
  }
})

// Native Select Destination Folder for Clone Dialog
ipcMain.handle('dialog-select-clone-parent', async (event) => {
  if (!validateIpcSender(event)) return { canceled: true, error: 'Unauthorized IPC origin' }
  if (!mainWindow) return { canceled: true }
  let defaultDir = null
  try {
    defaultDir = app.getPath('documents') || app.getPath('home')
  } catch {}

  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Destination Folder for Cloned Repository',
    defaultPath: defaultDir || undefined,
    properties: ['openDirectory', 'createDirectory']
  })

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true }
  }

  return {
    canceled: false,
    folderPath: result.filePaths[0]
  }
})

// Helper to scan directory for markdown & doc files
function scanMarkdownFolder(dir, baseDir = dir, depth = 0) {
  if (depth > 5) return []
  const filesList = []
  const ignored = new Set(['node_modules', '.git', '.vscode', '.idea', 'dist', 'build', '__pycache__', '.pytest_cache'])

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (ignored.has(entry.name)) continue
      const fullPath = path.join(dir, entry.name)
      const relPath = path.relative(baseDir, fullPath)

      if (entry.isDirectory()) {
        const subFiles = scanMarkdownFolder(fullPath, baseDir, depth + 1)
        filesList.push(...subFiles)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        const isDoc = ['.md', '.markdown', '.txt', '.rst', '.org'].includes(ext) || entry.name.toUpperCase().startsWith('LICENSE')
        if (isDoc) {
          filesList.push({
            name: entry.name,
            relPath: relPath.replace(/\\/g, '/'),
            fullPath
          })
        }
      }
    }
  } catch {}
  return filesList
}

ipcMain.handle('workspace-read-files', async (event, folderPath) => {
  if (!validateIpcSender(event)) return []
  if (!folderPath) return []
  if (!registerAuthorizedWorkspace(folderPath) && !isPathWithinWorkspace(folderPath)) {
    console.warn('[Security] Refused workspace-read-files outside authorized workspace:', folderPath)
    return []
  }
  return scanMarkdownFolder(folderPath)
})

// Full IDE Directory Tree Scanner
function scanFullDirectoryTree(dir, baseDir = dir, depth = 0) {
  if (depth > 6) return []
  const ignored = new Set(['node_modules', '.git', '.vscode', '.idea', 'dist', 'release'])
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    const result = []

    entries.sort((a, b) => {
      if (a.isDirectory() === b.isDirectory()) return a.name.localeCompare(b.name)
      return a.isDirectory() ? -1 : 1
    })

    for (const entry of entries) {
      if (ignored.has(entry.name)) continue
      const fullPath = path.join(dir, entry.name)
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/')

      if (entry.isDirectory()) {
        const children = scanFullDirectoryTree(fullPath, baseDir, depth + 1)
        result.push({
          name: entry.name,
          path: fullPath,
          relPath,
          isDirectory: true,
          children
        })
      } else if (entry.isFile()) {
        result.push({
          name: entry.name,
          path: fullPath,
          relPath,
          isDirectory: false
        })
      }
    }
    return result
  } catch {
    return []
  }
}

// Safe Git runner using execFile (bypasses shell, immune to command injection)
function runGit(args, cwd, timeout = 5000) {
  return new Promise((resolve) => {
    execFile('git', args, { cwd, timeout, windowsHide: true }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        error: error ? (stderr?.trim() || error.message) : null,
        stdout: stdout ? stdout.trim() : '',
        rawStdout: stdout || ''
      })
    })
  })
}

// Comprehensive Git status inspector
async function getGitFullInfo(folderPath) {
  const emptyResult = { isRepo: false, branch: null, hasChanges: false, changesCount: 0, changes: [], statusMap: {}, latestCommit: null, remoteUrl: null }
  if (!folderPath || !fs.existsSync(folderPath)) {
    return emptyResult
  }

  // 1. Check if valid git repository
  const workTreeCheck = await runGit(['rev-parse', '--is-inside-work-tree'], folderPath, 3000)
  if (!workTreeCheck.success || workTreeCheck.stdout !== 'true') {
    return emptyResult
  }

  // 2. Query branch
  let branch = ''
  const branchCheck = await runGit(['branch', '--show-current'], folderPath, 3000)
  if (branchCheck.success && branchCheck.stdout) {
    branch = branchCheck.stdout
  } else {
    const headCheck = await runGit(['rev-parse', '--abbrev-ref', 'HEAD'], folderPath, 3000)
    branch = headCheck.stdout || 'HEAD'
  }

  // 3. Query porcelain status
  const statusCheck = await runGit(['status', '--porcelain'], folderPath, 4000)
  const statusMap = {}
  const changes = []
  const stagedChanges = []
  const unstagedChanges = []

  if (statusCheck.rawStdout) {
    const lines = statusCheck.rawStdout.split('\n')
    for (const line of lines) {
      if (!line.trim() || line.length < 3) continue
      const x = line[0]
      const y = line[1]
      let rawPath = line.slice(3).trim().replace(/^"(.*)"$/, '$1').replace(/\\/g, '/')
      if (rawPath.includes(' -> ')) {
        rawPath = rawPath.split(' -> ')[1].trim()
      }
      if (!rawPath) continue

      const getDetails = (code) => {
        switch (code) {
          case 'M': return { status: 'M', label: 'Modified' }
          case 'A': return { status: 'A', label: 'Added' }
          case 'D': return { status: 'D', label: 'Deleted' }
          case 'R': return { status: 'R', label: 'Renamed' }
          case '?': return { status: 'U', label: 'Untracked' }
          default: return { status: code, label: 'Modified' }
        }
      }

      // Check staged (X is not space, and not ?)
      if (x !== ' ' && x !== '?') {
        const d = getDetails(x)
        stagedChanges.push({
          path: rawPath,
          fullPath: path.join(folderPath, rawPath),
          name: path.basename(rawPath),
          status: d.status,
          label: d.label,
          staged: true
        })
      }

      // Check unstaged (Y is not space, or ??)
      if (y !== ' ' || (x === '?' && y === '?')) {
        const d = getDetails(x === '?' && y === '?' ? '?' : y)
        unstagedChanges.push({
          path: rawPath,
          fullPath: path.join(folderPath, rawPath),
          name: path.basename(rawPath),
          status: d.status,
          label: d.label,
          staged: false
        })
        statusMap[rawPath] = d.status
      } else {
        statusMap[rawPath] = stagedChanges[stagedChanges.length - 1]?.status || 'M'
      }

      changes.push({
        path: rawPath,
        fullPath: path.join(folderPath, rawPath),
        name: path.basename(rawPath),
        status: statusMap[rawPath] || 'M',
        label: (y !== ' ' || (x === '?' && y === '?')) ? 'Modified' : 'Staged'
      })
    }
  }

  // 4. Remote URL, latest commit, full graph log, and sync state (ahead / behind)
  const [remoteCheck, logCheck, branchStatusCheck, logGraphCheck] = await Promise.all([
    runGit(['config', '--get', 'remote.origin.url'], folderPath, 3000),
    runGit(['log', '-1', '--format=%h - %s (%cr)'], folderPath, 3000),
    runGit(['rev-list', '--left-right', '--count', `${branch}...@{u}`], folderPath, 3000),
    runGit(['log', '-n', '50', '--pretty=format:%H%x00%h%x00%s%x00%an%x00%ae%x00%cr%x00%d%x00%P'], folderPath, 6000)
  ])

  let ahead = 0
  let behind = 0
  if (branchStatusCheck.success && branchStatusCheck.stdout) {
    const counts = branchStatusCheck.stdout.split(/\s+/)
    ahead = parseInt(counts[0], 10) || 0
    behind = parseInt(counts[1], 10) || 0
  }

  const commits = []
  if (logGraphCheck.success && logGraphCheck.rawStdout) {
    const lines = logGraphCheck.rawStdout.split('\n')
    for (const line of lines) {
      if (!line.trim()) continue
      const parts = line.split('\0')
      if (parts.length < 7) continue
      const [hash, shortHash, subject, author, email, relativeDate, decorationsRaw, parentsRaw] = parts

      const decorations = {
        isHead: false,
        branches: [],
        remotes: [],
        tags: []
      }
      if (decorationsRaw) {
        const clean = decorationsRaw.trim().replace(/^\(|\)$/g, '')
        if (clean) {
          clean.split(',').forEach(item => {
            const s = item.trim()
            if (s.startsWith('HEAD -> ')) {
              decorations.isHead = true
              decorations.branches.push(s.replace('HEAD -> ', ''))
            } else if (s === 'HEAD') {
              decorations.isHead = true
            } else if (s.startsWith('tag: ')) {
              decorations.tags.push(s.replace('tag: ', ''))
            } else if (s.includes('/')) {
              if (!s.endsWith('/HEAD')) {
                decorations.remotes.push(s)
              }
            } else if (s) {
              decorations.branches.push(s)
            }
          })
        }
      }

      commits.push({
        hash,
        shortHash,
        subject,
        author,
        email,
        relativeDate,
        decorations,
        parents: parentsRaw ? parentsRaw.trim().split(/\s+/) : []
      })
    }
  }

  return {
    isRepo: true,
    branch: branch || 'main',
    remoteUrl: remoteCheck.stdout || null,
    hasChanges: stagedChanges.length > 0 || unstagedChanges.length > 0,
    changesCount: stagedChanges.length + unstagedChanges.length,
    stagedChanges,
    unstagedChanges,
    changes,
    statusMap,
    latestCommit: logCheck.stdout || null,
    commits,
    ahead,
    behind
  }
}

function isAuthorizedGitFolder(event, folderPath) {
  if (!validateIpcSender(event)) return false
  if (!folderPath || typeof folderPath !== 'string') return false
  return registerAuthorizedWorkspace(folderPath) || isPathWithinWorkspace(folderPath)
}

ipcMain.handle('git-get-status', async (event, folderPath) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) {
    return { isRepo: false, branch: null, hasChanges: false, changesCount: 0, changes: [], stagedChanges: [], unstagedChanges: [], statusMap: {}, latestCommit: null, remoteUrl: null, ahead: 0, behind: 0 }
  }
  return getGitFullInfo(folderPath)
})

ipcMain.handle('git-stage-all', async (event, folderPath) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  const res = await runGit(['add', '-A'], folderPath, 8000)
  return res.success ? { success: true } : { success: false, error: res.error }
})

ipcMain.handle('git-stage-file', async (event, { folderPath, filePath }) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  if (!filePath || typeof filePath !== 'string') return { success: false, error: 'Invalid file path' }
  const res = await runGit(['add', '--', filePath], folderPath, 8000)
  return res.success ? { success: true } : { success: false, error: res.error }
})

ipcMain.handle('git-unstage-all', async (event, folderPath) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  const res = await runGit(['restore', '--staged', '--', '.'], folderPath, 8000)
  return res.success ? { success: true } : { success: false, error: res.error }
})

ipcMain.handle('git-unstage-file', async (event, { folderPath, filePath }) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  if (!filePath || typeof filePath !== 'string') return { success: false, error: 'Invalid file path' }
  const res = await runGit(['restore', '--staged', '--', filePath], folderPath, 8000)
  return res.success ? { success: true } : { success: false, error: res.error }
})

ipcMain.handle('git-discard-file', async (event, { folderPath, filePath }) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  if (!filePath || typeof filePath !== 'string') return { success: false, error: 'Invalid file path' }
  // Try clean for untracked and restore for tracked
  await runGit(['clean', '-f', '--', filePath], folderPath, 5000)
  const res = await runGit(['restore', '--', filePath], folderPath, 5000)
  if (!res.success) {
    // Fallback to checkout
    await runGit(['checkout', '--', filePath], folderPath, 5000)
  }
  return { success: true }
})

ipcMain.handle('git-discard-all', async (event, folderPath) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  await runGit(['restore', '--', '.'], folderPath, 8000)
  await runGit(['clean', '-fd'], folderPath, 8000)
  return { success: true }
})

ipcMain.handle('git-commit', async (event, { folderPath, message }) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  if (!message?.trim()) return { success: false, error: 'Commit message is required' }
  const res = await runGit(['commit', '-m', message.trim()], folderPath, 10000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-commit-action', async (event, { folderPath, message, action = 'commit' }) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  if (!message?.trim() && action !== 'commit-amend') {
    return { success: false, error: 'Commit message is required' }
  }

  if (action === 'commit-amend') {
    const commitMsg = message?.trim() ? ['-m', message.trim()] : ['--no-edit']
    const res = await runGit(['commit', '--amend', ...commitMsg], folderPath, 10000)
    return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
  }

  // 1. Commit
  const commitRes = await runGit(['commit', '-m', message.trim()], folderPath, 10000)
  if (!commitRes.success) {
    return { success: false, error: commitRes.error }
  }

  // 2. Secondary action
  if (action === 'commit-push') {
    const pushRes = await runGit(['push'], folderPath, 25000)
    if (!pushRes.success) {
      return { success: true, warning: 'Committed locally, but Push failed: ' + (pushRes.error || '') }
    }
  } else if (action === 'commit-sync') {
    await runGit(['pull', '--rebase'], folderPath, 25000)
    const pushRes = await runGit(['push'], folderPath, 25000)
    if (!pushRes.success) {
      return { success: true, warning: 'Committed locally, but Sync Push failed: ' + (pushRes.error || '') }
    }
  }

  return { success: true, output: commitRes.stdout }
})

ipcMain.handle('git-push', async (event, folderPath) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  const res = await runGit(['push'], folderPath, 25000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-pull', async (event, folderPath) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  const res = await runGit(['pull'], folderPath, 25000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-fetch', async (event, folderPath) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  const res = await runGit(['fetch'], folderPath, 20000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-get-graph', async (event, { folderPath, maxCount = 50 }) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, commits: [] }
  const args = ['log', `-n`, `${maxCount}`, '--pretty=format:%H%x00%h%x00%s%x00%an%x00%ae%x00%cr%x00%d%x00%P']
  const res = await runGit(args, folderPath, 10000)
  if (!res.success) return { success: false, error: res.error, commits: [] }

  const lines = res.rawStdout.split('\n')
  const commits = []
  for (const line of lines) {
    if (!line.trim()) continue
    const parts = line.split('\0')
    if (parts.length < 7) continue
    const [hash, shortHash, subject, author, email, relativeDate, decorationsRaw, parentsRaw] = parts

    const decorations = {
      isHead: false,
      branches: [],
      remotes: [],
      tags: []
    }
    if (decorationsRaw) {
      const clean = decorationsRaw.trim().replace(/^\(|\)$/g, '')
      if (clean) {
        clean.split(',').forEach(item => {
          const s = item.trim()
          if (s.startsWith('HEAD -> ')) {
            decorations.isHead = true
            decorations.branches.push(s.replace('HEAD -> ', ''))
          } else if (s === 'HEAD') {
            decorations.isHead = true
          } else if (s.startsWith('tag: ')) {
            decorations.tags.push(s.replace('tag: ', ''))
          } else if (s.includes('/')) {
            if (!s.endsWith('/HEAD')) {
              decorations.remotes.push(s)
            }
          } else if (s) {
            decorations.branches.push(s)
          }
        })
      }
    }

    commits.push({
      hash,
      shortHash,
      subject,
      author,
      email,
      relativeDate,
      decorations,
      parents: parentsRaw ? parentsRaw.trim().split(/\s+/) : []
    })
  }

  return { success: true, commits }
})

ipcMain.handle('git-get-branches', async (event, folderPath) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, local: [], remote: [], current: 'main' }
  const res = await runGit(['branch', '-a'], folderPath, 5000)
  if (!res.success) return { success: false, error: res.error, local: [], remote: [], current: 'main' }

  let current = 'main'
  const local = []
  const remote = []
  const lines = res.rawStdout.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const isCur = trimmed.startsWith('*')
    const branchName = trimmed.replace(/^\*\s*/, '').trim()
    if (branchName.includes('->')) continue

    if (isCur) current = branchName

    if (branchName.startsWith('remotes/')) {
      remote.push(branchName.replace(/^remotes\//, ''))
    } else {
      local.push(branchName)
    }
  }

  return { success: true, current, local, remote }
})

ipcMain.handle('git-checkout-branch', async (event, { folderPath, branch }) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  if (!branch || typeof branch !== 'string' || branch.startsWith('-')) return { success: false, error: 'Invalid branch name' }
  const res = await runGit(['checkout', '--', branch], folderPath, 8000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-create-branch', async (event, { folderPath, branch }) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  if (!branch || typeof branch !== 'string' || branch.startsWith('-')) return { success: false, error: 'Invalid branch name' }
  const res = await runGit(['checkout', '-b', branch], folderPath, 8000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-diff', async (event, { folderPath, filePath, staged = false }) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, diff: '' }
  if (filePath && typeof filePath === 'string' && filePath.startsWith('-')) return { success: false, diff: '' }
  const args = staged
    ? (filePath ? ['diff', '--staged', '--', filePath] : ['diff', '--staged'])
    : (filePath ? ['diff', '--', filePath] : ['diff'])
  const res = await runGit(args, folderPath, 8000)
  let diff = res.stdout || ''

  // If empty and file exists, it might be untracked
  if (!diff && filePath) {
    const full = path.join(folderPath, filePath)
    if (fs.existsSync(full)) {
      try {
        const content = fs.readFileSync(full, 'utf-8')
        const lines = content.split('\n').map(l => '+' + l).join('\n')
        diff = `--- /dev/null\n+++ b/${filePath}\n@@ -0,0 +1,${content.split('\n').length} @@\n${lines}`
      } catch {
        // ignore
      }
    }
  }

  return { success: true, diff }
})

ipcMain.handle('git-show-commit', async (event, { folderPath, hash }) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath) || !hash || typeof hash !== 'string' || hash.startsWith('-')) return { success: false, commit: null }
  const [showRes, statRes] = await Promise.all([
    runGit(['show', '--stat', '--patch', '--', hash], folderPath, 10000),
    runGit(['show', '--name-status', '--format=%H%x00%s%x00%an%x00%cr', '--', hash], folderPath, 8000)
  ])

  let meta = {}
  const files = []
  if (statRes.rawStdout) {
    const lines = statRes.rawStdout.split('\n')
    if (lines.length > 0 && lines[0].includes('\0')) {
      const parts = lines[0].split('\0')
      meta = {
        hash: parts[0],
        subject: parts[1],
        author: parts[2],
        relativeDate: parts[3]
      }
    }
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      const statusChar = line[0]
      const fPath = line.slice(1).trim()
      files.push({ status: statusChar, path: fPath })
    }
  }

  return {
    success: true,
    meta,
    files,
    diff: showRes.stdout || ''
  }
})

ipcMain.handle('git-generate-commit-message', async (event, folderPath) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) {
    return { success: false, message: 'chore: update files' }
  }

  try {
    const [statusRes, diffRes] = await Promise.all([
      runGit(['status', '--porcelain'], folderPath, 4000),
      runGit(['diff', '--stat'], folderPath, 4000)
    ])

    const files = []
    if (statusRes.rawStdout) {
      statusRes.rawStdout.split('\n').forEach(line => {
        if (line.trim().length > 3) {
          const p = line.slice(3).trim()
          files.push(p)
        }
      })
    }

    if (files.length === 0) {
      return { success: true, message: 'chore: working tree update' }
    }

    // Heuristics based on filenames
    let type = 'feat'
    let scope = ''
    const lowerFiles = files.map(f => f.toLowerCase())

    if (lowerFiles.some(f => f.includes('sourcecontrol') || f.includes('git'))) {
      type = 'feat'
      scope = 'source-control'
    } else if (lowerFiles.some(f => f.includes('test') || f.includes('spec'))) {
      type = 'test'
      scope = 'unit'
    } else if (lowerFiles.every(f => f.endsWith('.md') || f.includes('doc'))) {
      type = 'docs'
      scope = 'readme'
    } else if (lowerFiles.some(f => f.includes('style') || f.endsWith('.css'))) {
      type = 'style'
      scope = 'ui'
    } else if (lowerFiles.some(f => f.includes('fix') || f.includes('bug') || f.includes('error'))) {
      type = 'fix'
      scope = 'core'
    } else if (lowerFiles.some(f => f.includes('package.json') || f.includes('docker') || f.includes('requirements'))) {
      type = 'chore'
      scope = 'deps'
    } else if (lowerFiles.some(f => f.includes('electron') || f.includes('main.cjs'))) {
      type = 'fix'
      scope = 'electron'
    } else {
      type = 'feat'
      scope = path.basename(files[0]).split('.')[0] || 'app'
    }

    const firstFileName = path.basename(files[0])
    const countNote = files.length > 1 ? ` and ${files.length - 1} other files` : ''
    const summary = `update ${firstFileName}${countNote}`
    const message = scope ? `${type}(${scope}): ${summary}` : `${type}: ${summary}`

    return { success: true, message }
  } catch (err) {
    return { success: true, message: 'chore: update repository files' }
  }
})

ipcMain.handle('git-init', async (event, folderPath) => {
  if (!isAuthorizedGitFolder(event, folderPath) || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found or unauthorized' }
  const res = await runGit(['init'], folderPath, 5000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-get-default-clone-dir', async () => {
  try {
    return app.getPath('documents') || app.getPath('home') || process.cwd()
  } catch {
    return process.cwd()
  }
})

ipcMain.handle('git-clone', async (_event, { repoUrl, targetDir, folderName }) => {
  if (!repoUrl?.trim()) return { success: false, error: 'Repository URL is required.' }

  let cleanUrl = repoUrl.trim()

  // Guard against git flag injection (e.g. --upload-pack)
  if (cleanUrl.startsWith('-')) {
    return { success: false, error: 'Invalid repository URL.' }
  }

  // Support GitHub shorthand: owner/repo or github.com/owner/repo
  if (!cleanUrl.includes('://') && !cleanUrl.startsWith('git@')) {
    const ghMatch = cleanUrl.match(/^(?:(?:https?:\/\/)?(?:www\.)?github\.com\/)?([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/)
    if (ghMatch) {
      const [, owner, repo] = ghMatch
      if (!owner.startsWith('-') && !repo.startsWith('-')) {
        cleanUrl = `https://github.com/${owner}/${repo}.git`
      }
    }
  }

  // Validate allowed protocols strictly to prevent ext:: or file:// abuse
  if (!cleanUrl.startsWith('https://') && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('git@') && !cleanUrl.startsWith('ssh://')) {
    return { success: false, error: 'Only HTTP/HTTPS and SSH git repository URLs are supported.' }
  }

  let effectiveTargetDir = targetDir?.trim()
  if (!effectiveTargetDir) {
    try {
      effectiveTargetDir = app.getPath('documents') || app.getPath('home')
    } catch {
      effectiveTargetDir = process.cwd()
    }
  }

  if (!fs.existsSync(effectiveTargetDir)) {
    try {
      fs.mkdirSync(effectiveTargetDir, { recursive: true })
    } catch (e) {
      return { success: false, error: `Destination directory cannot be created: ${e.message}` }
    }
  }

  // Derive repo folder name if not provided
  let destDirName = folderName?.trim()
  if (!destDirName) {
    const urlWithoutGit = cleanUrl.replace(/\/+$/, '').replace(/\.git$/, '')
    destDirName = urlWithoutGit.split('/').pop() || 'cloned-repo'
  }

  // Sanitize folder name: disallow leading hyphen or path separators to prevent directory traversal
  if (destDirName.startsWith('-') || destDirName.includes('..') || destDirName.includes('/') || destDirName.includes('\\')) {
    return { success: false, error: 'Invalid destination folder name.' }
  }

  const destinationPath = path.join(effectiveTargetDir, destDirName)
  if (fs.existsSync(destinationPath)) {
    try {
      const entries = fs.readdirSync(destinationPath)
      if (entries.length > 0) {
        return { success: false, error: `Folder "${destDirName}" already exists in the destination directory and is not empty.` }
      }
    } catch {}
  }

  // Execute git clone safely with option delimiter '--' and 3-minute timeout
  const res = await runGit(['clone', '--', cleanUrl, destDirName], effectiveTargetDir, 180000)
  if (!res.success) {
    return { success: false, error: res.error || 'Git clone failed.' }
  }

  registerAuthorizedWorkspace(destinationPath)

  return {
    success: true,
    destinationPath,
    folderName: destDirName,
    output: res.stdout
  }
})

ipcMain.handle('workspace-read-tree', async (event, folderPath) => {
  if (!validateIpcSender(event)) {
    return { rootPath: null, rootName: null, tree: [], gitStatus: {}, gitInfo: {} }
  }
  if (!folderPath || !fs.existsSync(folderPath)) {
    return {
      rootPath: null,
      rootName: null,
      tree: [],
      gitStatus: {},
      gitInfo: { isRepo: false, branch: null, hasChanges: false, changesCount: 0, changes: [], statusMap: {}, latestCommit: null, remoteUrl: null }
    }
  }
  if (!registerAuthorizedWorkspace(folderPath) && !isPathWithinWorkspace(folderPath)) {
    console.warn('[Security] Refused workspace-read-tree outside authorized workspace:', folderPath)
    return { rootPath: null, rootName: null, tree: [], gitStatus: {}, gitInfo: {} }
  }
  const tree = scanFullDirectoryTree(folderPath)
  const gitInfo = await getGitFullInfo(folderPath)
  return {
    rootPath: folderPath,
    rootName: path.basename(folderPath),
    tree,
    gitStatus: gitInfo.statusMap || {},
    gitInfo
  }
})

ipcMain.handle('file-create-direct', async (event, { filePath, initialContent }) => {
  if (!validateIpcSender(event)) return { success: false, error: 'Unauthorized IPC origin' }
  if (!filePath) return { success: false, error: 'No file path specified' }

  let targetPath = filePath
  if (!path.isAbsolute(targetPath)) {
    const activeWs = currentActiveWorkspace || Array.from(activeWorkspaces).slice(-1)[0]
    if (activeWs) {
      targetPath = path.resolve(activeWs, targetPath)
    }
  }

  if (!isPathWithinWorkspace(targetPath)) {
    console.warn('[Security] Refused file-create-direct outside workspace:', filePath)
    return { success: false, error: 'Access denied: Path is outside active workspace' }
  }
  try {
    const dir = path.dirname(targetPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    await fs.promises.writeFile(targetPath, initialContent || '', 'utf-8')
    registerAuthorizedFile(targetPath)
    return { success: true, savedPath: targetPath }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('folder-create-direct', async (event, folderPath) => {
  if (!validateIpcSender(event)) return { success: false, error: 'Unauthorized IPC origin' }
  if (!folderPath) return { success: false, error: 'No folder path specified' }
  let targetPath = folderPath
  if (!path.isAbsolute(targetPath)) {
    const activeWs = currentActiveWorkspace || Array.from(activeWorkspaces).slice(-1)[0]
    if (activeWs) {
      targetPath = path.resolve(activeWs, targetPath)
    }
  }
  if (!isPathWithinWorkspace(targetPath)) {
    console.warn('[Security] Refused folder-create-direct outside workspace:', folderPath)
    return { success: false, error: 'Access denied: Path is outside active workspace' }
  }
  try {
    if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true })
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('workspace-set-active', async (event, folderPath) => {
  if (!validateIpcSender(event)) return { success: false }
  if (folderPath && typeof folderPath === 'string') {
    const canonical = getCanonicalPath(folderPath)
    if (canonical && fs.existsSync(canonical)) {
      registerAuthorizedWorkspace(canonical)
      currentActiveWorkspace = canonical
      return { success: true, activeWorkspace: canonical }
    }
  }
  return { success: false }
})

ipcMain.handle('file-delete-direct', async (event, filePath) => {
  if (!validateIpcSender(event)) return { success: false, error: 'Unauthorized IPC origin' }
  if (!filePath || typeof filePath !== 'string') return { success: false, error: 'No file path specified' }
  const resolved = path.resolve(filePath)
  if (!isPathWithinWorkspace(resolved)) {
    console.warn('[Security] Refused file-delete-direct outside workspace:', filePath)
    return { success: false, error: 'Access denied: Path is outside active workspace' }
  }
  // Strictly prevent deleting the active workspace root itself
  const canonical = getCanonicalPath(resolved)
  for (const ws of activeWorkspaces) {
    if (canonical && canonical.toLowerCase() === ws.toLowerCase()) {
      return { success: false, error: 'Access denied: Cannot delete active workspace root directory' }
    }
  }
  try {
    if (fs.existsSync(resolved)) {
      const stat = fs.statSync(resolved)
      if (stat.isDirectory()) {
        fs.rmSync(resolved, { recursive: true, force: true })
      } else {
        fs.unlinkSync(resolved)
      }
    }
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('file-move-direct', async (event, { sourcePath, targetPath }) => {
  if (!validateIpcSender(event)) return { success: false, error: 'Unauthorized IPC origin' }
  if (!sourcePath || !targetPath) return { success: false, error: 'Invalid paths' }
  if (!isPathWithinWorkspace(sourcePath) || !isPathWithinWorkspace(targetPath)) {
    console.warn('[Security] Refused file-move-direct outside workspace:', { sourcePath, targetPath })
    return { success: false, error: 'Access denied: Path is outside active workspace' }
  }
  try {
    if (!fs.existsSync(sourcePath)) {
      return { success: false, error: 'Source item does not exist' }
    }
    const targetDir = path.dirname(targetPath)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }
    await fs.promises.rename(sourcePath, targetPath)
    registerAuthorizedFile(targetPath)
    return { success: true, targetPath }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('file-copy-direct', async (event, { sourcePath, targetPath }) => {
  if (!validateIpcSender(event)) return { success: false, error: 'Unauthorized IPC origin' }
  if (!sourcePath || !targetPath) return { success: false, error: 'Invalid paths' }
  if (!isPathWithinWorkspace(sourcePath) || !isPathWithinWorkspace(targetPath)) {
    console.warn('[Security] Refused file-copy-direct outside workspace:', { sourcePath, targetPath })
    return { success: false, error: 'Access denied: Path is outside active workspace' }
  }
  try {
    if (!fs.existsSync(sourcePath)) {
      return { success: false, error: 'Source file does not exist' }
    }
    const targetDir = path.dirname(targetPath)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }
    await fs.promises.copyFile(sourcePath, targetPath)
    registerAuthorizedFile(targetPath)
    return { success: true, targetPath }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// External link and shell helpers (strictly validate allowed protocols to prevent injection)
ipcMain.on('open-external-url', (event, targetUrl) => {
  if (!validateIpcSender(event)) return
  if (!targetUrl || typeof targetUrl !== 'string') return
  try {
    const parsed = new URL(targetUrl)
    if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      shell.openExternal(targetUrl)
    }
  } catch {
    console.warn('[Security] Refused to open invalid or dangerous external URL:', targetUrl)
  }
})

ipcMain.on('show-in-folder', (event, filePath) => {
  if (!validateIpcSender(event)) return
  if (filePath && isPathWithinWorkspace(filePath) && fs.existsSync(filePath)) {
    shell.showItemInFolder(filePath)
  }
})

ipcMain.handle('open-path-in-os', async (event, filePath) => {
  if (!validateIpcSender(event)) return { success: false, error: 'Unauthorized IPC origin' }
  if (!filePath || !isPathWithinWorkspace(filePath) || !fs.existsSync(filePath)) {
    return { success: false, error: 'File does not exist or access denied' }
  }
  try {
    const ext = path.extname(filePath).toLowerCase().replace(/^\./, '')
    if (DANGEROUS_EXECUTABLE_EXTENSIONS.has(ext)) {
      // Prevent accidental execution of executable binaries or shell scripts from untrusted repos
      shell.showItemInFolder(filePath)
      return {
        success: false,
        error: `Direct execution of executable files or scripts (.${ext}) is restricted for safety. Revealed file in Explorer instead.`
      }
    }
    await shell.openPath(filePath)
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('get-backend-url', () => {
  return `http://127.0.0.1:${activeBackendPort}`
})

// Default or CLI Startup Workspace resolution
ipcMain.handle('workspace-get-default', async (event) => {
  if (!validateIpcSender(event)) return { rootPath: null }
  const startupPath = parsePathFromArgv(process.argv)
  if (startupPath && fs.existsSync(startupPath)) {
    try {
      const stat = fs.statSync(startupPath)
      if (stat.isDirectory()) {
        registerAuthorizedWorkspace(startupPath)
        const tree = scanFullDirectoryTree(startupPath)
        const gitInfo = await getGitFullInfo(startupPath)
        return {
          rootPath: startupPath,
          rootName: path.basename(startupPath),
          isArgv: true,
          tree,
          gitStatus: gitInfo.statusMap || {},
          gitInfo
        }
      } else {
        const rootDir = path.dirname(startupPath)
        registerAuthorizedWorkspace(rootDir)
        registerAuthorizedFile(startupPath)
        const tree = scanFullDirectoryTree(rootDir)
        const gitInfo = await getGitFullInfo(rootDir)
        return {
          rootPath: rootDir,
          rootName: path.basename(rootDir),
          initialFile: startupPath,
          isArgv: true,
          tree,
          gitStatus: gitInfo.statusMap || {},
          gitInfo
        }
      }
    } catch {}
  }
  // If a valid workspace was already set as active, return it
  if (currentActiveWorkspace && fs.existsSync(currentActiveWorkspace)) {
    try {
      const tree = scanFullDirectoryTree(currentActiveWorkspace)
      const gitInfo = await getGitFullInfo(currentActiveWorkspace)
      return {
        rootPath: currentActiveWorkspace,
        rootName: path.basename(currentActiveWorkspace),
        isArgv: false,
        tree,
        gitStatus: gitInfo.statusMap || {},
        gitInfo
      }
    } catch {}
  }

  // In packaged desktop mode, if no folder CLI argument was passed, do not auto-open installation folder
  if (app.isPackaged) {
    return {
      rootPath: null,
      rootName: null,
      isArgv: false,
      tree: [],
      gitStatus: {},
      gitInfo: { isRepo: false, branch: null, hasChanges: false, changesCount: 0, changes: [], statusMap: {}, latestCommit: null, remoteUrl: null }
    }
  }

  // Development mode only: convenient fallback to project root
  const defaultDir = path.resolve(__dirname, '../../')
  registerAuthorizedWorkspace(defaultDir)
  const tree = scanFullDirectoryTree(defaultDir)
  const gitInfo = await getGitFullInfo(defaultDir)
  return {
    rootPath: defaultDir,
    rootName: path.basename(defaultDir),
    isArgv: false,
    tree,
    gitStatus: gitInfo.statusMap || {},
    gitInfo
  }
})

// ==================== AUTO UPDATER PIPELINE ====================
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true
// Enable differential delta downloads using .blockmap (~5-15MB instead of ~170MB)
autoUpdater.disableDifferentialDownload = false

ipcMain.handle('app-set-auto-download', (_event, enabled) => {
  autoUpdater.autoDownload = Boolean(enabled)
  console.log('[AutoUpdater] autoDownload updated to:', autoUpdater.autoDownload)
  return autoUpdater.autoDownload
})

ipcMain.handle('app-get-auto-download', () => {
  return autoUpdater.autoDownload
})

ipcMain.handle('app-download-update', async () => {
  console.log('[AutoUpdater] Explicit downloadUpdate requested...')
  try {
    const res = await autoUpdater.downloadUpdate()
    return { success: true, result: res }
  } catch (err) {
    console.error('[AutoUpdater] downloadUpdate failed:', err)
    return { success: false, error: err ? (err.message || String(err)) : 'Failed to download update' }
  }
})

function initAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    console.log('[AutoUpdater] Checking for updates...')
  })

  autoUpdater.on('update-available', (info) => {
    console.log('[AutoUpdater] Update available:', info.version)
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('app-update-available', {
        version: info.version,
        releaseDate: info.releaseDate,
        releaseNotes: info.releaseNotes
      })
    }
  })

  autoUpdater.on('update-not-available', (info) => {
    console.log('[AutoUpdater] Update not available. Current version is up to date.')
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('app-update-not-available', {
        version: app.getVersion()
      })
    }
  })

  autoUpdater.on('download-progress', (progressObj) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('app-update-progress', {
        percent: Math.round(progressObj.percent),
        transferred: progressObj.transferred,
        total: progressObj.total,
        bytesPerSecond: progressObj.bytesPerSecond
      })
    }
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('[AutoUpdater] Update downloaded successfully:', info.version)
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('app-update-downloaded', {
        version: info.version,
        releaseNotes: info.releaseNotes
      })
    }
  })

  autoUpdater.on('error', (err) => {
    console.warn('[AutoUpdater] Error checking/downloading update:', err ? (err.stack || err).toString() : 'unknown')
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('app-update-error', {
        message: err ? err.message : 'Unknown auto-updater error'
      })
    }
  })

  // Check on startup after initial window stabilization
  setTimeout(() => {
    if (!isDev) {
      autoUpdater.checkForUpdates().catch((err) => {
        console.warn('[AutoUpdater] Startup update check failed:', err)
      })
    }
  }, 6000)
}

ipcMain.handle('app-get-version', () => {
  return app.getVersion()
})

ipcMain.handle('app-check-for-updates', async () => {
  if (isDev) {
    return {
      status: 'dev',
      message: 'Running in development mode (v' + app.getVersion() + '). Auto-updates run against GitHub Releases in packaged desktop builds.'
    }
  }
  try {
    const result = await autoUpdater.checkForUpdates()
    return { status: 'ok', updateInfo: result ? result.updateInfo : null }
  } catch (err) {
    return { status: 'error', message: err.message }
  }
})

ipcMain.on('app-quit-and-install', () => {
  console.log('[AutoUpdater] App update quit-and-install requested. Terminating sidecar and installing...')
  terminateSidecar()
  setImmediate(() => {
    autoUpdater.quitAndInstall(false, true)
  })
})

// App Lifecycle
app.whenReady().then(async () => {
  // Windows AppContainer Sandbox Self-Healing:
  // When installed on secondary partitions or non-standard folders, folder ACLs may lack
  // read/execute access for ALL APPLICATION PACKAGES (*S-1-15-2-1), causing Chromium sandbox child
  // processes to abort on launch with error -2147483645.
  if (process.platform === 'win32' && app.isPackaged) {
    try {
      const installDir = path.dirname(process.execPath)
      exec(`icacls "${installDir}" /grant "*S-1-15-2-1:(OI)(CI)(RX)" /T /C /Q`, (err) => {
        if (err) {
          // Silently proceed; handled primarily by installer
        }
      })
    } catch {}
  }

  await ensureSidecar()
  createWindow()
  initAutoUpdater()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function terminateSidecar() {
  if (sidecarProcess && sidecarProcess.pid) {
    try {
      console.log('[Sidecar] Terminating sidecar child process PID:', sidecarProcess.pid)
      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/pid', String(sidecarProcess.pid), '/f', '/t'], { timeout: 2500 })
      } else {
        sidecarProcess.kill('SIGTERM')
      }
    } catch (err) {
      console.warn('[Sidecar Cleanup Error]', err)
    }
    sidecarProcess = null
  }
}

app.on('before-quit', () => {
  if (typeof activeTerminals !== 'undefined' && activeTerminals) {
    for (const [_id, item] of activeTerminals.entries()) {
      try {
        if (item?.proc?.pid) {
          if (process.platform === 'win32') {
            spawn('taskkill', ['/pid', String(item.proc.pid), '/f', '/t'])
          } else {
            item.proc.kill('SIGTERM')
          }
        }
      } catch {}
    }
    activeTerminals.clear()
  }

  terminateSidecar()
})

app.on('will-quit', () => {
  terminateSidecar()
})
