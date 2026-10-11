/**
 * README Studio - Electron Main Process
 * Manages desktop window lifecycle, frameless window controls, native file system, and Python sidecar.
 */
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
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

  // External URLs opened in user default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })

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
        spawn('cmd.exe', ['/k', 'cd', '/d', cwd], { cwd, detached: true, stdio: 'ignore' }).unref()
      } else {
        // PowerShell
        spawn('powershell.exe', ['-NoExit', '-Command', `Set-Location -LiteralPath '${cwd.replace(/'/g, "''")}'`], {
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
    return { success: true }
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

  if (statusCheck.rawStdout) {
    const lines = statusCheck.rawStdout.split('\n')
    for (const line of lines) {
      if (!line.trim()) continue
      const code = line.slice(0, 2).trim()
      const rawPath = line.slice(3).trim().replace(/^"(.*)"$/, '$1').replace(/\\/g, '/')
      if (rawPath) {
        let status = 'M'
        let label = 'Modified'
        if (code.includes('?')) {
          status = 'U'
          label = 'Untracked'
        } else if (code.includes('A')) {
          status = 'A'
          label = 'Added'
        } else if (code.includes('D')) {
          status = 'D'
          label = 'Deleted'
        } else if (code.includes('R')) {
          status = 'R'
          label = 'Renamed'
        }
        statusMap[rawPath] = status
        changes.push({
          path: rawPath,
          fullPath: path.join(folderPath, rawPath),
          name: path.basename(rawPath),
          status,
          label
        })
      }
    }
  }

  // 4. Remote URL and latest commit
  const [remoteCheck, logCheck] = await Promise.all([
    runGit(['config', '--get', 'remote.origin.url'], folderPath, 3000),
    runGit(['log', '-1', '--format=%h - %s (%cr)'], folderPath, 3000)
  ])

  return {
    isRepo: true,
    branch: branch || 'main',
    remoteUrl: remoteCheck.stdout || null,
    hasChanges: changes.length > 0,
    changesCount: changes.length,
    changes,
    statusMap,
    latestCommit: logCheck.stdout || null
  }
}

ipcMain.handle('git-get-status', async (_event, folderPath) => {
  const targetDir = folderPath && fs.existsSync(folderPath) ? folderPath : path.resolve(__dirname, '../../')
  return getGitFullInfo(targetDir)
})

ipcMain.handle('git-stage-all', async (_event, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  const res = await runGit(['add', '-A'], folderPath, 5000)
  return res.success ? { success: true } : { success: false, error: res.error }
})

ipcMain.handle('git-commit', async (_event, { folderPath, message }) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  if (!message?.trim()) return { success: false, error: 'Commit message is required' }
  // Parameterized argument array - immune to command injection and quote escaping bugs
  const res = await runGit(['commit', '-m', message.trim()], folderPath, 8000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('git-init', async (_event, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) return { success: false, error: 'Path not found' }
  const res = await runGit(['init'], folderPath, 5000)
  return res.success ? { success: true, output: res.stdout } : { success: false, error: res.error }
})

ipcMain.handle('workspace-read-tree', async (_event, folderPath) => {
  const targetDir = folderPath && fs.existsSync(folderPath) ? folderPath : path.resolve(__dirname, '../../')
  const tree = scanFullDirectoryTree(targetDir)
  const gitInfo = await getGitFullInfo(targetDir)
  return {
    rootPath: targetDir,
    rootName: path.basename(targetDir),
    tree,
    gitStatus: gitInfo.statusMap || {},
    gitInfo
  }
})

ipcMain.handle('workspace-get-default', async () => {
  const targetDir = path.resolve(__dirname, '../../')
  const tree = scanFullDirectoryTree(targetDir)
  const gitInfo = await getGitFullInfo(targetDir)
  return {
    rootPath: targetDir,
    rootName: path.basename(targetDir),
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

// External link and shell helpers
ipcMain.on('open-external-url', (_event, url) => {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    shell.openExternal(url)
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

// App Lifecycle
app.whenReady().then(async () => {
  await ensureSidecar()
  createWindow()

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
