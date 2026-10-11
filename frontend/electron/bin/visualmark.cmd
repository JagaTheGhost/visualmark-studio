@echo off
setlocal
set "DIR=%~dp0..\"
if exist "%DIR%VisualMark Studio.exe" (
  start "" "%DIR%VisualMark Studio.exe" %*
) else (
  start "" "%DIR%..\VisualMark Studio.exe" %*
)
endlocal
