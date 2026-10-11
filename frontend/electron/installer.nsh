; =======================================================================
; VisualMark Studio - NSIS Windows Explorer Context Menu & Shell Integration
; =======================================================================
; Adds native "Open with VisualMark Studio" right-click options to:
; 1. Directory context menu (right-clicking any folder)
; 2. Directory background context menu (right-clicking empty space inside a folder)
; 3. File context menu (right-clicking any document or markdown file)
; =======================================================================

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
!macroend

!macro customUnInstall
  DetailPrint "Cleaning up VisualMark Studio Windows Explorer registry entries..."
  DeleteRegKey HKCU "Software\Classes\Directory\shell\VisualMarkStudio"
  DeleteRegKey HKCU "Software\Classes\Directory\Background\shell\VisualMarkStudio"
  DeleteRegKey HKCU "Software\Classes\*\shell\VisualMarkStudio"
!macroend
