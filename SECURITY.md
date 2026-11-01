# Security Policy

VisualMark Studio takes the security of our application, code, and users seriously. We appreciate the efforts of security researchers and community contributors who responsibly report vulnerabilities to us.

---

## Supported Versions

Only the latest active minor release receives official security patches and updates. We recommend all users keep their desktop installations up to date.

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| < 1.2.0 | :x:                |

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities via public GitHub Issues or Discussions.** Public disclosure puts all users at risk before a patch is ready.

### Preferred Method: GitHub Private Vulnerability Reporting
1. Navigate to the repository's [Security Advisories](https://github.com/JagaTheGhost/visualmark-studio/security/advisories) tab.
2. Click **Report a vulnerability**.
3. Fill in the details of the issue including:
   - Type of vulnerability (e.g., IPC command injection, SSRF, XSS, Path Traversal, Protocol Handler Abuse).
   - Step-by-step reproduction instructions.
   - Proof-of-concept (PoC) code or script if applicable.
   - Any suggested remediations or patches.

### Alternative Reporting
If you cannot submit via GitHub Private Vulnerability Reporting, you may open an encrypted issue or reach out directly to the maintainer via GitHub profile contact.

---

## Response & Disclosure Process

When a security vulnerability is reported:

1. **Acknowledgment:** We will acknowledge receipt of your vulnerability report within **48 hours**.
2. **Investigation & Triage:** We will verify the vulnerability, evaluate its severity using CVSS scoring, and reproduce the issue in an isolated test environment.
3. **Remediation:** A patch will be authored, reviewed, and validated against regression tests.
4. **Coordinated Release:** A new patch release will be cut (e.g. `v1.2.1`) and published with an accompanying GitHub Security Advisory crediting the researcher (unless anonymity is requested).

---

## Security Architecture & Best Practices

VisualMark Studio incorporates several security layers by design:

- **Electron Process Isolation & Sender Validation:** Renderer processes run with `contextIsolation: true` and `nodeIntegration: false`. Privileged IPC handlers validate `event.senderFrame` origin before processing.
- **Workspace Path Containment & Confinement:** Native filesystem and Git IPC handlers restrict all read, write, create, move, copy, and delete operations strictly to explicitly opened workspaces and user-selected files (`isPathWithinWorkspace`), canonicalizing paths with `fs.realpathSync` to eliminate symlink and directory traversal escapes. Active workspace root directories are guarded against accidental or malicious deletion.
- **Strict Vector & Markdown Sanitization:** Markdown and Mermaid diagram previews run in `securityLevel: 'strict'` mode and sanitize all generated SVG elements using hardened DOMPurify allowlists, stripping active script tags, executable URL schemes, and inline event handlers before DOM insertion.
- **Windows AppContainer Sandbox Compliance:** NSIS installers and desktop runtime enforce `ALL APPLICATION PACKAGES` (`*S-1-15-2-1`) read/execute permissions, preventing Chromium sandbox initialization aborts on secondary partitions while revoking unprivileged `Authenticated Users` write permissions.
- **Navigation & Protocol Hardening:** The application blocks arbitrary in-window navigation (`will-navigate`) and validates external URL schemes (`shell.openExternal`) strictly against `['http:', 'https:', 'mailto:']`.
- **Localhost-Only Backend Sidecar:** The bundled Python/FastAPI daemon binds exclusively to `127.0.0.1`, preventing any unauthorized exposure over local networks.
- **Git Command Parameterization:** Internal Git operations use parameterized argument arrays (`execFile`) rather than string interpolation, eliminating shell command injection risks.
- **Transparent Network Boundaries & Zero Telemetry:** VisualMark Studio operates on a local-first architecture. All workspace files, markdown content, and local repository metadata remain strictly on your machine. There is zero telemetry, analytics tracking, or advertising scripts. External network operations are transparent and strictly user-initiated (querying the GitHub API for repo statistics, loading Shields.io badges, or checking GitHub Releases for updates), protected by origin validation and SSRF defenses.

Thank you for helping keep VisualMark Studio safe for everyone!
