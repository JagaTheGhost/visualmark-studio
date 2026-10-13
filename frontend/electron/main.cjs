/**
 * README Studio - Electron Main Process
 * Manages desktop window lifecycle, frameless window controls, native file system, and Python sidecar.
 */
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const fs = require('fs')
const { spawn, execFile } = require('child_process')
const http = require('http')
const net = require('net')

let mainWindow = null
let sidecarProcess = null
const DEFAULT_BACKEND_PORT = 8000
let activeBackendPort = DEFAULT_BACKEND_PORT
const isDev = !app.isPackaged || process.env.NODE_ENV === 'development'

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

  // Determine path to bundled binary or python script
  const candidatePaths = [
    app.isPackaged ? path.join(process.resourcesPath, 'backend-sidecar', 'server', 'server.exe') : null,
    app.isPackaged ? path.join(process.resourcesPath, 'backend-sidecar', 'server.exe') : null,
    path.join(__dirname, '../resources/backend-sidecar', 'server', 'server.exe'),
    path.join(__dirname, '../resources/backend-sidecar', 'server.exe'),
  ].filter(Boolean)

  const bundledExe = candidatePaths.find((p) => fs.existsSync(p))

  if (bundledExe) {
    console.log('[Sidecar] Launching bundled sidecar binary:', bundledExe)
    try {
      sidecarProcess = spawn(bundledExe, ['--port', String(activeBackendPort)], {
        stdio: 'ignore',
        windowsHide: true,
        detached: false
      })
      sidecarProcess.on('error', (err) => console.error('[Sidecar Error]', err))
    } catch (err) {
      console.error('[Sidecar Spawn Failed]', err)
    }
  } else if (isDev) {
    // In dev mode, attempt to launch python script if python is in PATH
    const pythonScript = path.resolve(__dirname, '../../backend/desktop_server.py')
    if (fs.existsSync(pythonScript)) {
      console.log('[Sidecar Dev] Spawning python daemon:', pythonScript)
      try {
        sidecarProcess = spawn('python', [pythonScript, '--port', String(activeBackendPort)], {
          stdio: 'ignore',
          windowsHide: true,
          detached: false
        })
        sidecarProcess.on('error', () => {
          console.log('[Sidecar Dev] Python direct spawn skipped (external terminal might be running).')
        })
      } catch {}
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
      spellcheck: true
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
        return // Allow local HTML navigation
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

// ==================== IPC HANDLERS ====================

// Window controls
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize()
})

ipcMain.on('window-maximize', () => {
  if (!mainWindow) return
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close()
})

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false
})

// Native Open File Dialog
ipcMain.handle('dialog-open-file', async () => {
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
ipcMain.handle('dialog-save-file', async (_event, { content, defaultPath }) => {
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
ipcMain.handle('file-save-direct', async (_event, { filePath, content }) => {
  if (!filePath) return { success: false, error: 'No file path specified' }
  try {
    await fs.promises.writeFile(filePath, content, 'utf-8')
    return { success: true, filePath, fileName: path.basename(filePath) }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Native Save Binary Dialog (for ZIP archives, PDF documents, rendered images)
ipcMain.handle('dialog-save-binary', async (_event, { defaultPath, filters, base64Data }) => {
  if (!mainWindow) return { canceled: true }
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export File',
    defaultPath: defaultPath || 'export.bin',
    filters: filters || [{ name: 'All Files', extensions: ['*'] }]
  })
  if (result.canceled || !result.filePath) {
    return { canceled: true }
  }
  try {
    const buffer = Buffer.from(base64Data, 'base64')
    await fs.promises.writeFile(result.filePath, buffer)
    return { canceled: false, filePath: result.filePath, fileName: path.basename(result.filePath) }
  } catch (err) {
    return { canceled: false, error: err.message }
  }
})

// Native Save Text Export Dialog (for HTML, Markdown, etc.)
ipcMain.handle('dialog-save-text-export', async (_event, { defaultPath, filters, content }) => {
  if (!mainWindow) return { canceled: true }
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Document',
    defaultPath: defaultPath || 'export.html',
    filters: filters || [{ name: 'All Files', extensions: ['*'] }]
  })
  if (result.canceled || !result.filePath) {
    return { canceled: true }
  }
  try {
    await fs.promises.writeFile(result.filePath, content || '', 'utf-8')
    return { canceled: false, filePath: result.filePath, fileName: path.basename(result.filePath) }
  } catch (err) {
    return { canceled: false, error: err.message }
  }
})

// Native External Terminal Spawner (PowerShell, Command Prompt, or OS Terminal)
ipcMain.handle('terminal-open-external', async (_event, { folderPath, shellType = 'powershell' } = {}) => {
  const cwd = folderPath && fs.existsSync(folderPath) ? folderPath : path.resolve(__dirname, '../../')
  try {
    if (process.platform === 'win32') {
      if (shellType === 'cmd') {
        spawn('cmd.exe', ['/c', 'start', 'Command Prompt', 'cmd.exe', '/k', `cd /d "${cwd}"`], {
          cwd,
          detached: true,
          stdio: 'ignore'
        }).unref()
      } else {
        // Windows PowerShell
        spawn('cmd.exe', ['/c', 'start', 'PowerShell', 'powershell.exe', '-NoExit', '-Command', `Set-Location -LiteralPath '${cwd.replace(/'/g, "''")}'`], {
          cwd,
          detached: true,
          stdio: 'ignore'
        }).unref()
      }
    } else if (process.platform === 'darwin') {
      spawn('open', ['-a', 'Terminal', cwd], { detached: true }).unref()
    } else {
      spawn('x-terminal-emulator', [], { cwd, detached: true }).unref()
    }
    return { success: true, cwd, shellType }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Toggle Developer Tools
ipcMain.on('window-toggle-devtools', () => {
  if (mainWindow) {
    mainWindow.webContents.toggleDevTools()
  }
})

// Reload window
ipcMain.on('window-reload', () => {
  if (mainWindow) {
    mainWindow.webContents.reload()
  }
})

// ==================== EMBEDDED INTEGRATED TERMINAL ENGINE ====================
const activeTerminals = new Map() // termId -> { proc, shellType, cwd }

ipcMain.handle('terminal-session-start', async (_event, { termId = 'default', shellType = 'powershell', cwd }) => {
  const existing = activeTerminals.get(termId)
  if (existing) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(existing.proc.pid), '/f', '/t'])
      } else {
        existing.proc.kill('SIGTERM')
      }
    } catch {}
    activeTerminals.delete(termId)
  }

  const workingDir = cwd && fs.existsSync(cwd) ? cwd : path.resolve(__dirname, '../../')

  let shellExe = 'powershell.exe'
  let shellArgs = ['-NoLogo']

  if (shellType === 'cmd') {
    shellExe = 'cmd.exe'
    shellArgs = ['/k', 'cd', '/d', workingDir]
  } else if (process.platform !== 'win32') {
    shellExe = process.env.SHELL || '/bin/bash'
    shellArgs = []
  }

  try {
    const proc = spawn(shellExe, shellArgs, {
      cwd: workingDir,
      env: { ...process.env, TERM: 'xterm-256color' },
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true
    })

    activeTerminals.set(termId, { proc, shellType, cwd: workingDir })

    proc.stdout.on('data', (chunk) => {
      if (mainWindow) {
        mainWindow.webContents.send('terminal-session-data', { termId, data: chunk.toString('utf-8') })
      }
    })

    proc.stderr.on('data', (chunk) => {
      if (mainWindow) {
        mainWindow.webContents.send('terminal-session-data', { termId, data: chunk.toString('utf-8'), isError: true })
      }
    })

    proc.on('close', (code) => {
      activeTerminals.delete(termId)
      if (mainWindow) {
        mainWindow.webContents.send('terminal-session-exit', { termId, code })
      }
    })

    return { success: true, termId, shellType, cwd: workingDir }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('terminal-session-write', async (_event, { termId = 'default', command }) => {
  const item = activeTerminals.get(termId)
  if (!item || !item.proc || !item.proc.stdin) {
    return { success: false, error: 'Terminal session not active' }
  }
  try {
    item.proc.stdin.write(command + '\r\n')
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('terminal-session-kill', async (_event, { termId = 'default' }) => {
  const item = activeTerminals.get(termId)
  if (item && item.proc) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(item.proc.pid), '/f', '/t'])
      } else {
        item.proc.kill('SIGTERM')
      }
    } catch {}
    activeTerminals.delete(termId)
  }
  return { success: true }
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

// Read arbitrary file with binary / unsupported format fail-safe
ipcMain.handle('file-read', async (_event, filePath) => {
  try {
    if (!filePath || !fs.existsSync(filePath)) {
      return { success: false, error: 'File does not exist' }
    }
    const stat = await fs.promises.stat(filePath)
    if (stat.isDirectory()) {
      return { success: false, error: 'Target is a directory' }
    }
    const ext = path.extname(filePath).toLowerCase().replace(/^\./, '')
    const fileName = path.basename(filePath)

    // 1. Extension check
    if (BINARY_EXTENSIONS.has(ext)) {
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
    const fd = await fs.promises.open(filePath, 'r')
    const sampleSize = Math.min(1024, stat.size)
    const buffer = Buffer.alloc(sampleSize)
    if (sampleSize > 0) {
      await fd.read(buffer, 0, sampleSize, 0)
    }
    await fd.close()

    if (buffer.includes(0)) {
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

    const content = await fs.promises.readFile(filePath, 'utf-8')
    return { success: true, content, fileName, filePath, size: stat.size }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Native Open Folder / Workspace Dialog
ipcMain.handle('dialog-open-folder', async () => {
  if (!mainWindow) return { canceled: true }
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Workspace Directory',
    properties: ['openDirectory']
  })

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true }
  }

  const folderPath = result.filePaths[0]
  const scan = scanMarkdownFolder(folderPath)
  return {
    canceled: false,
    folderPath,
    folderName: path.basename(folderPath),
    files: scan
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

ipcMain.handle('workspace-read-files', async (_event, folderPath) => {
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

ipcMain.handle('git-get-status', async (_event, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) {
    return { isRepo: false, branch: null, hasChanges: false, changesCount: 0, changes: [], stagedChanges: [], unstagedChanges: [], statusMap: {}, latestCommit: null, remoteUrl: null, ahead: 0, behind: 0 }
  }
  return getGitFullInfo(folderPath)
})

ipcMain.handle('git-stage-all', async (_event, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  const res = await runGit(['add', '-A'], folderPath, 8000)
  return res.success ? { success: true } : { success: false, error: res.error }
})

ipcMain.handle('git-stage-file', async (_event, { folderPath, filePath }) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  const res = await runGit(['add', filePath], folderPath, 8000)
  return res.success ? { success: true } : { success: false, error: res.error }
})

ipcMain.handle('git-unstage-all', async (_event, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  const res = await runGit(['restore', '--staged', '.'], folderPath, 8000)
  return res.success ? { success: true } : { success: false, error: res.error }
})

ipcMain.handle('git-unstage-file', async (_event, { folderPath, filePath }) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  const res = await runGit(['restore', '--staged', filePath], folderPath, 8000)
  return res.success ? { success: true } : { success: false, error: res.error }
})

ipcMain.handle('git-discard-file', async (_event, { folderPath, filePath }) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  // Try clean for untracked and restore for tracked
  await runGit(['clean', '-f', filePath], folderPath, 5000)
  const res = await runGit(['restore', filePath], folderPath, 5000)
  if (!res.success) {
    // Fallback to checkout
    await runGit(['checkout', '--', filePath], folderPath, 5000)
  }
  return { success: true }
})

ipcMain.handle('git-discard-all', async (_event, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  await runGit(['restore', '.'], folderPath, 8000)
  await runGit(['clean', '-fd'], folderPath, 8000)
  return { success: true }
})

ipcMain.handle('git-commit', async (_event, { folderPath, message }) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  if (!message?.trim()) return { success: false, error: 'Commit message is required' }
  const res = await runGit(['commit', '-m', message.trim()], folderPath, 10000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-commit-action', async (_event, { folderPath, message, action = 'commit' }) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
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

ipcMain.handle('git-push', async (_event, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  const res = await runGit(['push'], folderPath, 25000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-pull', async (_event, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  const res = await runGit(['pull'], folderPath, 25000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-fetch', async (_event, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  const res = await runGit(['fetch'], folderPath, 20000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-get-graph', async (_event, { folderPath, maxCount = 50 }) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, commits: [] }
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

ipcMain.handle('git-get-branches', async (_event, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, local: [], remote: [], current: 'main' }
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

ipcMain.handle('git-checkout-branch', async (_event, { folderPath, branch }) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  const res = await runGit(['checkout', branch], folderPath, 8000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-create-branch', async (_event, { folderPath, branch }) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  const res = await runGit(['checkout', '-b', branch], folderPath, 8000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-diff', async (_event, { folderPath, filePath, staged = false }) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, diff: '' }
  const args = staged ? ['diff', '--staged', filePath] : ['diff', filePath]
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

ipcMain.handle('git-show-commit', async (_event, { folderPath, hash }) => {
  if (!folderPath || !fs.existsSync(folderPath) || !hash) return { success: false, commit: null }
  const [showRes, statRes] = await Promise.all([
    runGit(['show', '--stat', '--patch', hash], folderPath, 10000),
    runGit(['show', '--name-status', '--format=%H%x00%s%x00%an%x00%cr', hash], folderPath, 8000)
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

ipcMain.handle('git-generate-commit-message', async (_event, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) {
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

ipcMain.handle('git-init', async (_event, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  const res = await runGit(['init'], folderPath, 5000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('workspace-read-tree', async (_event, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) {
    return {
      rootPath: null,
      rootName: null,
      tree: [],
      gitStatus: {},
      gitInfo: { isRepo: false, branch: null, hasChanges: false, changesCount: 0, changes: [], statusMap: {}, latestCommit: null, remoteUrl: null }
    }
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

ipcMain.handle('file-create-direct', async (_event, { filePath, initialContent }) => {
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    await fs.promises.writeFile(filePath, initialContent || '', 'utf-8')
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('folder-create-direct', async (_event, folderPath) => {
  try {
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true })
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('file-delete-direct', async (_event, filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true })
      } else {
        fs.unlinkSync(filePath)
      }
    }
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('file-move-direct', async (_event, { sourcePath, targetPath }) => {
  try {
    if (!sourcePath || !fs.existsSync(sourcePath)) {
      return { success: false, error: 'Source item does not exist' }
    }
    const targetDir = path.dirname(targetPath)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }
    await fs.promises.rename(sourcePath, targetPath)
    return { success: true, targetPath }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('file-copy-direct', async (_event, { sourcePath, targetPath }) => {
  try {
    if (!sourcePath || !fs.existsSync(sourcePath)) {
      return { success: false, error: 'Source file does not exist' }
    }
    const targetDir = path.dirname(targetPath)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }
    await fs.promises.copyFile(sourcePath, targetPath)
    return { success: true, targetPath }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// External link and shell helpers (strictly validate allowed protocols to prevent injection)
ipcMain.on('open-external-url', (_event, targetUrl) => {
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

ipcMain.on('show-in-folder', (_event, filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    shell.showItemInFolder(filePath)
  }
})

ipcMain.handle('open-path-in-os', async (_event, filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      await shell.openPath(filePath)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }
  return { success: false, error: 'File does not exist' }
})

ipcMain.handle('get-backend-url', () => {
  return `http://127.0.0.1:${activeBackendPort}`
})

// Default or CLI Startup Workspace resolution
ipcMain.handle('workspace-get-default', async () => {
  const startupPath = parsePathFromArgv(process.argv)
  if (startupPath && fs.existsSync(startupPath)) {
    try {
      const stat = fs.statSync(startupPath)
      if (stat.isDirectory()) {
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
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

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
  autoUpdater.quitAndInstall(false, true)
})

// App Lifecycle
app.whenReady().then(async () => {
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

app.on('before-quit', () => {
  for (const [_id, item] of activeTerminals.entries()) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(item.proc.pid), '/f', '/t'])
      } else {
        item.proc.kill('SIGTERM')
      }
    } catch {}
  }
  activeTerminals.clear()

  if (sidecarProcess) {
    try {
      console.log('[Sidecar] Terminating sidecar child process...')
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(sidecarProcess.pid), '/f', '/t'])
      } else {
        sidecarProcess.kill('SIGTERM')
      }
    } catch {}
  }
})
