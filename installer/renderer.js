// Multi-Step State Machine
let currentStep = 1
const TOTAL_CONFIG_STEPS = 3 // Steps 1 to 3 are user configuration
let installedExePath = ''

// Step Views mapping
const STEP_ELEMENT_IDS = {
  1: 'step-license',
  2: 'step-destination',
  3: 'step-options',
  4: 'step-installing',
  5: 'step-finish'
}

// DOM Elements
const btnMinimize = document.getElementById('btn-minimize')
const btnClose = document.getElementById('btn-close')
const btnCancel = document.getElementById('btn-cancel')
const btnBack = document.getElementById('btn-back')
const btnNext = document.getElementById('btn-next')
const btnBrowse = document.getElementById('btn-browse')

const brandHeadline = document.getElementById('brand-headline')
const inputInstallPath = document.getElementById('input-install-path')
const radLicenseAccept = document.getElementById('rad-license-accept')
const radLicenseDecline = document.getElementById('rad-license-decline')

const optContextMenu = document.getElementById('opt-context-menu')
const optPath = document.getElementById('opt-path')
const optDesktop = document.getElementById('opt-desktop')
const optStartMenu = document.getElementById('opt-startmenu')
const optAssociations = document.getElementById('opt-associations')

const progressBarFill = document.getElementById('progress-bar-fill')
const progressPercent = document.getElementById('progress-percent')
const statusText = document.getElementById('status-text')
const progressSub = document.getElementById('progress-sub')
const chkLaunchApp = document.getElementById('chk-launch-app')

/**
 * Switch active step view
 */
function goToStep(step) {
  currentStep = step

  // Show active step view
  document.querySelectorAll('.step-view').forEach((view) => {
    view.classList.remove('active')
  })
  const activeId = STEP_ELEMENT_IDS[step]
  if (activeId) {
    document.getElementById(activeId).classList.add('active')
  }

  // Update Left Brand Panel Headline (matching Figma frames)
  if (step === 5) {
    // When installation is finished, change to: THANKS FOR TRYING US OUT!
    brandHeadline.innerHTML = `
      <span>THANKS</span>
      <span>FOR</span>
      <span>TRYING</span>
      <span>US OUT!</span>
    `
  } else {
    // During installation, show: WELCOME TO THE COMMUNITY!
    brandHeadline.innerHTML = `
      <span>WELCOME</span>
      <span>TO THE</span>
      <span>COMMUNITY!</span>
    `
  }

  // Update Navigation Controls
  if (step === 1) {
    btnBack.disabled = true
    btnNext.disabled = !radLicenseAccept.checked
    btnNext.textContent = 'Next >'
    btnCancel.style.display = 'inline-block'
  } else if (step === 2) {
    btnBack.disabled = false
    btnNext.disabled = false
    btnNext.textContent = 'Next >'
    btnCancel.style.display = 'inline-block'
  } else if (step === 3) {
    btnBack.disabled = false
    btnNext.disabled = false
    btnNext.textContent = 'Install'
    btnCancel.style.display = 'inline-block'
  } else if (step === 4) {
    btnBack.disabled = true
    btnNext.disabled = true
    btnNext.textContent = 'Installing...'
    btnCancel.disabled = true
  } else if (step === 5) {
    btnBack.disabled = true
    btnNext.disabled = false
    btnNext.textContent = chkLaunchApp.checked ? 'Launch Studio' : 'Finish'
    btnCancel.style.display = 'none'
  }
}

/**
 * Execute Installation
 */
async function startInstallation() {
  goToStep(4)

  const config = {
    installPath: inputInstallPath.value.trim(),
    addContextMenu: optContextMenu.checked,
    addToPath: optPath.checked,
    createDesktopShortcut: optDesktop.checked,
    createStartMenuShortcut: optStartMenu.checked,
    associateMarkdown: optAssociations.checked,
    appVersion: '1.1.2'
  }

  if (window.installerAPI) {
    const result = await window.installerAPI.startInstallation(config)
    if (result && result.success) {
      installedExePath = result.targetExe
      setTimeout(() => {
        goToStep(5)
      }, 500)
    } else {
      statusText.textContent = `Error: ${result ? result.error : 'Installation failed.'}`
      statusText.style.color = '#ef4444'
      btnCancel.disabled = false
    }
  } else {
    // Demo browser simulation
    let p = 0
    const sim = setInterval(() => {
      p += 20
      progressBarFill.style.width = `${p}%`
      progressPercent.textContent = `${p}%`
      if (p >= 100) {
        clearInterval(sim)
        setTimeout(() => goToStep(5), 400)
      }
    }, 250)
  }
}

/**
 * Handle Launch / Finish
 */
function handleFinish() {
  if (chkLaunchApp.checked && installedExePath && window.installerAPI) {
    window.installerAPI.launchApp(installedExePath)
  } else if (window.installerAPI) {
    window.installerAPI.closeWindow()
  }
}

// Button Events
btnNext.addEventListener('click', () => {
  if (currentStep === 3) {
    startInstallation()
  } else if (currentStep === 5) {
    handleFinish()
  } else {
    goToStep(currentStep + 1)
  }
})

btnBack.addEventListener('click', () => {
  if (currentStep > 1 && currentStep <= TOTAL_CONFIG_STEPS) {
    goToStep(currentStep - 1)
  }
})

btnCancel.addEventListener('click', () => {
  if (window.installerAPI) {
    window.installerAPI.closeWindow()
  }
})

// License acceptance
radLicenseAccept.addEventListener('change', () => {
  if (currentStep === 1) btnNext.disabled = false
})

radLicenseDecline.addEventListener('change', () => {
  if (currentStep === 1) btnNext.disabled = true
})

// Browse Directory
btnBrowse.addEventListener('click', async () => {
  if (window.installerAPI) {
    const chosen = await window.installerAPI.selectDirectory()
    if (chosen) {
      inputInstallPath.value = chosen
    }
  }
})

// Window controls
btnMinimize.addEventListener('click', () => {
  if (window.installerAPI) window.installerAPI.minimizeWindow()
})

btnClose.addEventListener('click', () => {
  if (window.installerAPI) window.installerAPI.closeWindow()
})

// Checkbox label change
chkLaunchApp.addEventListener('change', () => {
  if (currentStep === 5) {
    btnNext.textContent = chkLaunchApp.checked ? 'Launch Studio' : 'Finish'
  }
})

// Initialize
async function init() {
  if (window.installerAPI) {
    const defaultPath = await window.installerAPI.getDefaultInstallPath()
    inputInstallPath.value = defaultPath

    // Progress events
    window.installerAPI.onProgress(({ percent, status }) => {
      progressBarFill.style.width = `${percent}%`
      progressPercent.textContent = `${percent}%`
      if (status) {
        statusText.textContent = status
        progressSub.textContent = status
      }
    })
  } else {
    inputInstallPath.value = 'C:\\Users\\User\\AppData\\Local\\Programs\\VisualMark Studio'
  }

  goToStep(1)
}

init()
