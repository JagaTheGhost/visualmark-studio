"""
PyInstaller Packaging Script for README Studio FastAPI Sidecar
Bundles desktop_server.py into a standalone executable server.exe for Electron.
"""
import os
import sys
import shutil
import subprocess

def build_sidecar():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(backend_dir, ".."))
    frontend_dir = os.path.join(project_root, "frontend")
    target_sidecar_dir = os.path.join(frontend_dir, "resources", "backend-sidecar")

    os.makedirs(target_sidecar_dir, exist_ok=True)

    print("=" * 60)
    print("Building README Studio Standalone Python Sidecar")
    print(f"Backend Dir: {backend_dir}")
    print(f"Target Dir:  {target_sidecar_dir}")
    print("=" * 60)

    entry_script = os.path.join(backend_dir, "desktop_server.py")
    if not os.path.exists(entry_script):
        print(f"Error: {entry_script} not found.")
        sys.exit(1)

    hidden_imports = [
        "uvicorn",
        "uvicorn.logging",
        "uvicorn.loops",
        "uvicorn.loops.auto",
        "uvicorn.protocols",
        "uvicorn.protocols.http",
        "uvicorn.protocols.http.auto",
        "uvicorn.protocols.http.h11_impl",
        "uvicorn.protocols.websockets",
        "uvicorn.protocols.websockets.auto",
        "uvicorn.lifespans",
        "uvicorn.lifespans.on",
        "uvicorn.lifespans.off",
        "fastapi",
        "pydantic",
        "pydantic_core",
        "starlette",
        "httpx",
        "requests",
        "app",
        "prompts",
    ]

    cmd = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--name=server",
        "--onedir", # onedir starts up 10x faster than onefile
        "--clean",
        "--noconfirm",
        f"--distpath={target_sidecar_dir}",
        f"--workpath={os.path.join(backend_dir, 'build')}",
        f"--specpath={backend_dir}",
    ]

    for imp in hidden_imports:
        cmd.extend(["--hidden-import", imp])

    # Include backend directory in search path
    cmd.extend(["--paths", backend_dir])
    cmd.append(entry_script)

    print("\nExecuting PyInstaller command:\n" + " ".join(cmd) + "\n")
    result = subprocess.run(cmd, cwd=backend_dir)

    if result.returncode == 0:
        print("\n" + "=" * 60)
        print("[OK] Standalone sidecar built successfully!")
        print(f"Location: {os.path.join(target_sidecar_dir, 'server', 'server.exe')}")
        print("=" * 60)
    else:
        print("\nPyInstaller build failed with exit code:", result.returncode)
        sys.exit(result.returncode)

if __name__ == "__main__":
    build_sidecar()
