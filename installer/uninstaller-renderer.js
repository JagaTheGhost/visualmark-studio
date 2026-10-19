// Uninstaller DOM Elements
const btnMinimize = document.getElementById('btn-minimize')
const btnClose = document.getElementById('btn-close')
const btnCancel = document.getElementById('btn-cancel')
const btnUninstall = document.getElementById('btn-uninstall')
const btnCloseFinish = document.getElementById('btn-close-finish')

const inputInstallPath = document.getElementById('uninst-install-path')
const optContext = document.getElementById('uninst-opt-context')
const optPath = document.getElementById('uninst-opt-path')
const optShortcuts = document.getElementById('uninst-opt-shortcuts')
const optUserData = document.getElementById('uninst-opt-userdata')

const stepConfirm = document.getElementById('uninst-step-confirm')
const stepProgress = document.getElementById('uninst-step-progress')
const stepFinish = document.getElementById('uninst-step-finish')

const progressFill = document.getElementById('uninst-progress-fill')
const progressPercent = document.getElementById('uninst-progress-percent')
const statusText = document.getElementById('uninst-status-text')
const progressSub = document.getElementById('uninst-progress-sub')

function showStep(stepElem) {
  [stepConfirm, stepProgress, stepFinish].forEach(s => s.classList.remove('active'))
  stepElem.classList.add('active')
}

// Window controls
btnMinimize.addEventListener('click', () => {
  if (window.installerAPI) window.installerAPI.minimizeWindow()
})

btnClose.addEventListener('click', () => {
  if (window.installerAPI) window.installerAPI.closeWindow()
})

btnCancel.addEventListener('click', () => {
  if (window.installerAPI) window.installerAPI.closeWindow()
})

btnCloseFinish.addEventListener('click', () => {
  if (window.installerAPI) window.installerAPI.closeWindow()
})

// Start uninstallation
btnUninstall.addEventListener('click', async () => {
  showStep(stepProgress)

  const config = {
    installPath: inputInstallPath.value.trim(),
    removeContextMenu: optContext.checked,
    removeFromPath: optPath.checked,
    removeShortcuts: optShortcuts.checked,
    removeUserData: optUserData.checked
  }

  if (window.installerAPI) {
    const result = await window.installerAPI.startUninstallation(config)
    if (result && result.success) {
      setTimeout(() => {
        showStep(stepFinish)
      }, 500)
    } else {
      statusText.textContent = `Error: ${result ? result.error : 'Uninstallation failed'}`
      statusText.style.color = '#ef4444'
    }
  } else {
    // Demo simulation
    let p = 0
    const sim = setInterval(() => {
      p += 25
      progressFill.style.width = `${p}%`
      progressPercent.textContent = `${p}%`
      if (p >= 100) {
        clearInterval(sim)
        setTimeout(() => showStep(stepFinish), 400)
      }
    }, 250)
  }
})

// Initialize
async function init() {
  if (window.installerAPI) {
    const defaultPath = await window.installerAPI.getDefaultInstallPath()
    inputInstallPath.value = defaultPath

    window.installerAPI.onUninstallProgress(({ percent, status }) => {
      progressFill.style.width = `${percent}%`
      progressPercent.textContent = `${percent}%`
      if (status) {
        statusText.textContent = status
        progressSub.textContent = status
      }
    })
  } else {
    inputInstallPath.value = 'C:\\Users\\User\\AppData\\Local\\Programs\\VisualMark Studio'
  }
}

init()
