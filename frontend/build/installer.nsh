; VisualMark Studio - NSIS Custom Installer Hook
; Hardens installation directory permissions and resolves Windows AppContainer Sandbox failure (-2147483645)

!macro customInstall
  DetailPrint "Configuring Windows AppContainer Sandbox permissions..."
  ; Grant ALL APPLICATION PACKAGES (*S-1-15-2-1) read & execute access recursively
  ; This ensures Chromium's sandbox can launch renderer child processes when installed
  ; on secondary drives (e.g., D:\, E:\) or non-standard directory trees.
  nsExec::Exec 'icacls "$INSTDIR" /grant "*S-1-15-2-1:(OI)(CI)(RX)" /T /C /Q'

  ; Security Hardening: Revoke broad Authenticated Users (*S-1-5-11) modify permissions
  ; to prevent unprivileged accounts on the machine from tampering with application binaries.
  nsExec::Exec 'icacls "$INSTDIR" /remove "*S-1-5-11" /T /C /Q'
  nsExec::Exec 'icacls "$INSTDIR" /remove "Authenticated Users" /T /C /Q'
!macroend
