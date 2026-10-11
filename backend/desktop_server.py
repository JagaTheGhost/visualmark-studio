"""
Desktop Entrypoint for README Studio FastAPI Sidecar
Optimized for standalone frozen execution via PyInstaller in Electron desktop mode.
"""
import sys
import os
import multiprocessing

# Add script directory to sys.path so app and prompts can be imported cleanly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn
from app import app

def run_desktop_server():
    # Support for Windows multiprocessing when frozen with PyInstaller
    multiprocessing.freeze_support()

    # Parse port from command line arguments if passed (e.g. `server.exe --port 8000` or `server.exe 8000`)
    port = 8000
    if len(sys.argv) > 1:
        for i, arg in enumerate(sys.argv):
            if arg in ("--port", "-p") and i + 1 < len(sys.argv):
                try:
                    port = int(sys.argv[i + 1])
                except ValueError:
                    pass
            elif arg.isdigit():
                port = int(arg)

    print(f"[README-Studio-Sidecar] Starting FastAPI sidecar daemon on http://127.0.0.1:{port}", flush=True)

    # In frozen mode, pass the app object directly without string reloading
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=port,
        log_level="info",
        access_log=False,
    )

if __name__ == "__main__":
    run_desktop_server()
