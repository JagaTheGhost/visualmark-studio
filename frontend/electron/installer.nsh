; =======================================================================
; VisualMark Studio - NSIS Windows Explorer Context Menu & Shell Integration
; =======================================================================
; 1. Modern Slate-100 Theme Tint (#F1F5F9) with deep slate text (#1E293B)
; 2. Automatically skip the "All Users vs Only for me" page and default to current user
; 3. Add native "Open with VisualMark Studio" context menu to folders & files
; 4. Register "visualmark" and "vms" in Windows App Paths for quick terminal/Run launch
; =======================================================================

!define MUI_BGCOLOR "F1F5F9"
!define MUI_TEXTCOLOR "1E293B"
!define MUI_HEADERIMAGE_BITMAP_BGCOLOR "F1F5F9"

!macro customInstallMode
  ; Force installation for current user and skip the mode selection page
  StrCpy $isForceCurrentInstall "1"
!macroend

!macro customInstall
  DetailPrint "Registering VisualMark Studio Windows Explorer context menu actions..."

  ; 1. Right-click on a directory / folder -> Open with VisualMark Studio
  WriteRegStr HKCU "Software\Classes\Directory\shell\VisualMarkStudio" "" "Open with VisualMark Studio"
  WriteRegStr HKCU "Software\Classes\Directory\shell\VisualMarkStudio" "Icon" '"$appExe",0'
  WriteRegStr HKCU "Software\Classes\Directory\shell\VisualMarkStudio\command" "" '"$appExe" "%1"'

  ; 2. Right-click inside a folder background -> Open with VisualMark Studio
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\VisualMarkStudio" "" "Open with VisualMark Studio"
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\VisualMarkStudio" "Icon" '"$appExe",0'
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\VisualMarkStudio\command" "" '"$appExe" "%V"'

  ; 3. Right-click on any file -> Edit with VisualMark Studio
  WriteRegStr HKCU "Software\Classes\*\shell\VisualMarkStudio" "" "Open with VisualMark Studio"
  WriteRegStr HKCU "Software\Classes\*\shell\VisualMarkStudio" "Icon" '"$appExe",0'
  WriteRegStr HKCU "Software\Classes\*\shell\VisualMarkStudio\command" "" '"$appExe" "%1"'

  ; 4. Register App Paths for terminal and Win+R execution ("visualmark" and "vms")
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\App Paths\visualmark.exe" "" "$appExe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\App Paths\visualmark.exe" "Path" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\App Paths\vms.exe" "" "$appExe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\App Paths\vms.exe" "Path" "$INSTDIR"
!macroend

!macro customUnInstall
  DetailPrint "Cleaning up VisualMark Studio Windows Explorer registry entries..."
  DeleteRegKey HKCU "Software\Classes\Directory\shell\VisualMarkStudio"
  DeleteRegKey HKCU "Software\Classes\Directory\Background\shell\VisualMarkStudio"
  DeleteRegKey HKCU "Software\Classes\*\shell\VisualMarkStudio"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\App Paths\visualmark.exe"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\App Paths\vms.exe"
!macroend
