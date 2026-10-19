const fs = require('fs')
const path = require('path')
const { execFile } = require('child_process')

/**
 * Validate that a target path is safe for installation
 */
function isSafeInstallPath(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') return false
  const resolved = path.resolve(targetPath)
  const root = path.parse(resolved).root

  // Disallow drive root directly (e.g. C:\ or D:\)
  if (resolved.toLowerCase() === root.toLowerCase()) return false

  // Disallow critical Windows system directories
  const winDir = process.env.WINDIR ? path.resolve(process.env.WINDIR).toLowerCase() : 'c:\\windows'
  const sysDrive = process.env.SystemDrive ? path.resolve(process.env.SystemDrive).toLowerCase() : 'c:'
  const programFiles = process.env.ProgramFiles ? path.resolve(process.env.ProgramFiles).toLowerCase() : 'c:\\program files'
  const userProfile = process.env.USERPROFILE ? path.resolve(process.env.USERPROFILE).toLowerCase() : ''

  const lower = resolved.toLowerCase()
  if (lower === winDir || lower.startsWith(path.join(winDir, 'system32').toLowerCase())) return false
  if (lower === programFiles || lower === userProfile) return false

  return true
}

/**
 * Strict safety check for uninstallation directory deletion
 */
function isSafeUninstallPath(targetPath) {
  if (!isSafeInstallPath(targetPath)) return false
  const resolved = path.resolve(targetPath)
  if (!fs.existsSync(resolved)) return false

  // Must strictly be a VisualMark Studio directory
  const base = path.basename(resolved).toLowerCase()
  if (!base.includes('visualmark')) return false

  return true
}

/**
 * Execute command with argument array (safe against shell injection)
 */
function runCommand(cmd, args) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { windowsHide: true }, (err, stdout, stderr) => {
      if (err) return reject(new Error(`${stderr || stdout || err.message}`))
      resolve(stdout)
    })
  })
}

/**
 * Recursively copy files with progress reporting
 */
async function copyFolderRecursive(src, dest, onProgress, totalFilesRef = { count: 0, current: 0 }) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyFolderRecursive(srcPath, destPath, onProgress, totalFilesRef)
    } else {
      fs.copyFileSync(srcPath, destPath)
      totalFilesRef.current++
      if (onProgress && totalFilesRef.count > 0) {
        const percent = Math.min(92, Math.floor((totalFilesRef.current / totalFilesRef.count) * 65) + 10)
        onProgress(percent, `Copying: ${entry.name}`)
      }
    }
  }
}

function countFiles(dir) {
  let count = 0
  if (!fs.existsSync(dir)) return count
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dir, entry.name))
    } else {
      count++
    }
  }
  return count
}

/**
 * Safe registry writes using reg.exe with strictly verified keys
 */
async function setRegistryValue(key, valueName, data, type = 'REG_SZ') {
  if (!key.startsWith('HKCU\\Software\\')) {
    throw new Error(`Security Exception: Registry writes restricted to HKCU\\Software\\. Key: ${key}`)
  }
  try {
    const args = ['add', key, '/f']
    if (valueName === null || valueName === '') {
      args.push('/ve')
    } else {
      args.push('/v', valueName)
    }
    args.push('/t', type, '/d', data)
    await runCommand('reg.exe', args)
  } catch (err) {
    console.warn(`[Registry] Notice setting ${key}: ${err.message}`)
  }
}

/**
 * Parameterized shortcut creator using PowerShell with EncodedCommand
 */
async function createShortcut(targetExe, shortcutPath, description = 'VisualMark Studio', workingDir = '') {
  const psScript = `
param([string]$target, [string]$lnk, [string]$workDir, [string]$desc)
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($lnk)
$Shortcut.TargetPath = $target
$Shortcut.WorkingDirectory = $workDir
$Shortcut.IconLocation = "$target,0"
$Shortcut.Description = $desc
$Shortcut.Save()
`
  const encodedCommand = Buffer.from(psScript, 'utf16le').toString('base64')
  await runCommand('powershell.exe', [
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy', 'Bypass',
    '-EncodedCommand', encodedCommand,
    targetExe,
    shortcutPath,
    (workingDir || path.dirname(targetExe)),
    description
  ])
}

/**
 * Core Secure Installation Routine
 */
async function executeInstallation(config, progressCallback) {
  const {
    installPath,
    createDesktopShortcut = true,
    createStartMenuShortcut = true,
    addContextMenu = true,
    addToPath = true,
    associateMarkdown = true,
    appVersion = '1.1.2'
  } = config

  // Security check: Destination validation
  if (!isSafeInstallPath(installPath)) {
    throw new Error(`Security validation failed: Installation to "${installPath}" is not permitted.`)
  }

  progressCallback(5, 'Preparing destination directory...')
  fs.mkdirSync(installPath, { recursive: true })

  // 1. Locate and copy application payload
  progressCallback(10, 'Locating application binaries...')
  const possiblePayloadDirs = [
    path.join(__dirname, 'payload', 'app'),
    path.join(__dirname, '..', 'frontend', 'release', 'win-unpacked'),
    path.join(process.resourcesPath || '', 'payload', 'app')
  ]

  let payloadSrc = possiblePayloadDirs.find(p => fs.existsSync(p))
  const targetExe = path.join(installPath, 'VisualMark Studio.exe')

  if (payloadSrc) {
    progressCallback(15, 'Extracting VisualMark Studio runtime and packages...')
    const totalFiles = countFiles(payloadSrc)
    await copyFolderRecursive(payloadSrc, installPath, (pct, status) => {
      progressCallback(pct, status)
    }, { count: totalFiles, current: 0 })
  } else {
    // Development fallback
    progressCallback(15, 'Syncing application bundle...')
    const distSrc = path.join(__dirname, '..', 'frontend', 'dist')
    const electronSrc = path.join(__dirname, '..', 'frontend', 'electron')
    if (fs.existsSync(distSrc)) {
      const appDest = path.join(installPath, 'resources', 'app')
      fs.mkdirSync(path.join(appDest, 'dist'), { recursive: true })
      fs.mkdirSync(path.join(appDest, 'electron'), { recursive: true })
      await copyFolderRecursive(distSrc, path.join(appDest, 'dist'), null)
      await copyFolderRecursive(electronSrc, path.join(appDest, 'electron'), null)
    }
  }

  // Rename electron.exe to VisualMark Studio.exe if needed
  const unbrandedExe = path.join(installPath, 'electron.exe')
  if (fs.existsSync(unbrandedExe) && !fs.existsSync(targetExe)) {
    try {
      fs.renameSync(unbrandedExe, targetExe)
    } catch {
      fs.copyFileSync(unbrandedExe, targetExe)
    }
  }

  // 2. Windows Explorer Context Menu
  if (addContextMenu) {
    progressCallback(75, 'Registering Explorer context menus...')
    await setRegistryValue('HKCU\\Software\\Classes\\Directory\\Background\\shell\\VisualMarkStudio', '', 'Open with VisualMark Studio')
    await setRegistryValue('HKCU\\Software\\Classes\\Directory\\Background\\shell\\VisualMarkStudio', 'Icon', `"${targetExe}",0`)
    await setRegistryValue('HKCU\\Software\\Classes\\Directory\\Background\\shell\\VisualMarkStudio\\command', '', `"${targetExe}" "%V"`)

    await setRegistryValue('HKCU\\Software\\Classes\\Directory\\shell\\VisualMarkStudio', '', 'Open with VisualMark Studio')
    await setRegistryValue('HKCU\\Software\\Classes\\Directory\\shell\\VisualMarkStudio', 'Icon', `"${targetExe}",0`)
    await setRegistryValue('HKCU\\Software\\Classes\\Directory\\shell\\VisualMarkStudio\\command', '', `"${targetExe}" "%1"`)

    await setRegistryValue('HKCU\\Software\\Classes\\*\\shell\\VisualMarkStudio', '', 'Open with VisualMark Studio')
    await setRegistryValue('HKCU\\Software\\Classes\\*\\shell\\VisualMarkStudio', 'Icon', `"${targetExe}",0`)
    await setRegistryValue('HKCU\\Software\\Classes\\*\\shell\\VisualMarkStudio\\command', '', `"${targetExe}" "%1"`)
  }

  // 3. Command Line PATH (App Paths)
  if (addToPath) {
    progressCallback(82, 'Configuring CLI commands (visualmark & vms)...')
    await setRegistryValue('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\visualmark.exe', '', targetExe)
    await setRegistryValue('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\visualmark.exe', 'Path', installPath)
    await setRegistryValue('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\vms.exe', '', targetExe)
    await setRegistryValue('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\vms.exe', 'Path', installPath)
  }

  // 4. File Association
  if (associateMarkdown) {
    progressCallback(88, 'Associating Markdown documents...')
    await setRegistryValue('HKCU\\Software\\Classes\\.md', '', 'VisualMarkStudio.md')
    await setRegistryValue('HKCU\\Software\\Classes\\.markdown', '', 'VisualMarkStudio.md')
    await setRegistryValue('HKCU\\Software\\Classes\\VisualMarkStudio.md', '', 'Markdown Document')
    await setRegistryValue('HKCU\\Software\\Classes\\VisualMarkStudio.md\\DefaultIcon', '', `"${targetExe}",0`)
    await setRegistryValue('HKCU\\Software\\Classes\\VisualMarkStudio.md\\shell\\open\\command', '', `"${targetExe}" "%1"`)
  }

  // 5. Shortcuts
  progressCallback(92, 'Generating application shortcuts...')
  if (createDesktopShortcut) {
    const desktopPath = path.join(process.env.USERPROFILE || '', 'Desktop', 'VisualMark Studio.lnk')
    await createShortcut(targetExe, desktopPath, 'VisualMark Studio — Code + Visual Markdown IDE')
  }

  if (createStartMenuShortcut) {
    const startMenuDir = path.join(process.env.APPDATA || '', 'Microsoft', 'Windows', 'Start Menu', 'Programs')
    const startMenuPath = path.join(startMenuDir, 'VisualMark Studio.lnk')
    await createShortcut(targetExe, startMenuPath, 'VisualMark Studio — Code + Visual Markdown IDE')
  }

  // 6. Copy Uninstaller Executable into install folder
  progressCallback(96, 'Configuring uninstaller and Windows Apps integration...')
  const destUninstallerExe = path.join(installPath, 'Uninstall.exe')
  const fallbackUninstallBat = path.join(installPath, 'uninstall.bat')

  try {
    const currentExe = process.execPath
    if (path.basename(currentExe).toLowerCase().endsWith('.exe') && !path.basename(currentExe).toLowerCase().includes('electron')) {
      fs.copyFileSync(currentExe, destUninstallerExe)
    }
  } catch (err) {
    console.warn('[Uninstaller] Notice deploying executable:', err.message)
  }

  // Always generate fallback cleanup script
  const uninstallBatContent = `@echo off
echo Cleaning up VisualMark Studio...
taskkill /f /im "VisualMark Studio.exe" >nul 2>&1
reg delete "HKCU\\Software\\Classes\\Directory\\Background\\shell\\VisualMarkStudio" /f >nul 2>&1
reg delete "HKCU\\Software\\Classes\\Directory\\shell\\VisualMarkStudio" /f >nul 2>&1
reg delete "HKCU\\Software\\Classes\\*\\shell\\VisualMarkStudio" /f >nul 2>&1
reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\visualmark.exe" /f >nul 2>&1
reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\vms.exe" /f >nul 2>&1
reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\VisualMarkStudio" /f >nul 2>&1
del "%USERPROFILE%\\Desktop\\VisualMark Studio.lnk" >nul 2>&1
del "%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\VisualMark Studio.lnk" >nul 2>&1
start /b "" cmd /c timeout /t 2 /nobreak >nul & rd /s /q "${installPath}"
exit
`
  fs.writeFileSync(fallbackUninstallBat, uninstallBatContent, 'utf-8')

  // Register in Windows "Apps & Features" (Add / Remove Programs)
  const uninstallRegKey = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\VisualMarkStudio'
  const uninstallCommand = fs.existsSync(destUninstallerExe) ? `"${destUninstallerExe}"` : `"${fallbackUninstallBat}"`

  await setRegistryValue(uninstallRegKey, 'DisplayName', 'VisualMark Studio')
  await setRegistryValue(uninstallRegKey, 'DisplayVersion', appVersion)
  await setRegistryValue(uninstallRegKey, 'Publisher', 'JagaTheGhost')
  await setRegistryValue(uninstallRegKey, 'DisplayIcon', `"${targetExe}",0`)
  await setRegistryValue(uninstallRegKey, 'InstallLocation', installPath)
  await setRegistryValue(uninstallRegKey, 'UninstallString', uninstallCommand)
  await setRegistryValue(uninstallRegKey, 'NoModify', '1', 'REG_DWORD')
  await setRegistryValue(uninstallRegKey, 'NoRepair', '1', 'REG_DWORD')

  progressCallback(100, 'Installation finalized successfully!')
  return { success: true, targetExe }
}

/**
 * Core Secure Uninstallation Routine
 */
async function executeUninstallation(options, progressCallback) {
  const {
    installPath,
    removeContextMenu = true,
    removeFromPath = true,
    removeShortcuts = true,
    removeUserData = false
  } = options

  // Security check: Validate uninstallation directory
  if (!isSafeUninstallPath(installPath)) {
    throw new Error(`Security validation failed: Directory "${installPath}" is not safe for uninstallation.`)
  }

  progressCallback(10, 'Terminating running VisualMark Studio processes...')
  try {
    await runCommand('taskkill', ['/f', '/im', 'VisualMark Studio.exe'])
  } catch {}

  // 1. Context Menus
  if (removeContextMenu) {
    progressCallback(30, 'Removing Explorer context menus...')
    try { await runCommand('reg.exe', ['delete', 'HKCU\\Software\\Classes\\Directory\\Background\\shell\\VisualMarkStudio', '/f']) } catch {}
    try { await runCommand('reg.exe', ['delete', 'HKCU\\Software\\Classes\\Directory\\shell\\VisualMarkStudio', '/f']) } catch {}
    try { await runCommand('reg.exe', ['delete', 'HKCU\\Software\\Classes\\*\\shell\\VisualMarkStudio', '/f']) } catch {}
  }

  // 2. PATH
  if (removeFromPath) {
    progressCallback(50, 'Removing CLI commands from App Paths...')
    try { await runCommand('reg.exe', ['delete', 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\visualmark.exe', '/f']) } catch {}
    try { await runCommand('reg.exe', ['delete', 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\vms.exe', '/f']) } catch {}
  }

  // 3. Shortcuts
  if (removeShortcuts) {
    progressCallback(70, 'Removing Desktop and Start Menu shortcuts...')
    const desktopPath = path.join(process.env.USERPROFILE || '', 'Desktop', 'VisualMark Studio.lnk')
    const startMenuPath = path.join(process.env.APPDATA || '', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'VisualMark Studio.lnk')
    try { if (fs.existsSync(desktopPath)) fs.unlinkSync(desktopPath) } catch {}
    try { if (fs.existsSync(startMenuPath)) fs.unlinkSync(startMenuPath) } catch {}
  }

  // 4. File Associations & Windows Add/Remove Programs
  progressCallback(85, 'Unregistering application and file associations...')
  try { await runCommand('reg.exe', ['delete', 'HKCU\\Software\\Classes\\VisualMarkStudio.md', '/f']) } catch {}
  try { await runCommand('reg.exe', ['delete', 'HKCU\\Software\\Classes\\.md', '/f']) } catch {}
  try { await runCommand('reg.exe', ['delete', 'HKCU\\Software\\Classes\\.markdown', '/f']) } catch {}
  try { await runCommand('reg.exe', ['delete', 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\VisualMarkStudio', '/f']) } catch {}

  // 5. User Data (if specifically opted in)
  if (removeUserData) {
    progressCallback(90, 'Removing user cached data and configurations...')
    const appDataPath = path.join(process.env.APPDATA || '', 'visualmark-studio')
    try { if (fs.existsSync(appDataPath)) fs.rmSync(appDataPath, { recursive: true, force: true }) } catch {}
  }

  // 6. Delete install folder (scheduled post-exit)
  progressCallback(95, 'Cleaning up installation directory...')
  if (installPath && fs.existsSync(installPath)) {
    const cleanupCmd = `timeout /t 2 /nobreak >nul & rd /s /q "${installPath}"`
    runCommand('cmd.exe', ['/c', `start /b "" cmd /c ${cleanupCmd}`]).catch(() => {})
  }

  progressCallback(100, 'Uninstallation complete!')
  return { success: true }
}

module.exports = {
  executeInstallation,
  executeUninstallation,
  isSafeInstallPath,
  isSafeUninstallPath,
  runCommand
}
