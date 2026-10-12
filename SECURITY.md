# Security Policy

VisualMark Studio takes the security of our application, code, and users seriously. We appreciate the efforts of security researchers and community contributors who responsibly report vulnerabilities to us.

---

## Supported Versions

Only the latest active minor release receives official security patches and updates. We recommend all users keep their desktop installations up to date.

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

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
4. **Coordinated Release:** A new patch release will be cut (e.g. `v1.0.1`) and published with an accompanying GitHub Security Advisory crediting the researcher (unless anonymity is requested).

---

## Security Architecture & Best Practices

VisualMark Studio incorporates several security layers by design:

- **Electron Process Isolation:** Renderer processes run with `contextIsolation: true` and `nodeIntegration: false`. System APIs are accessed strictly through explicitly exposed IPC bridges in `preload.cjs`.
- **Navigation & Protocol Hardening:** The application blocks arbitrary in-window navigation (`will-navigate`) and validates external URL schemes (`shell.openExternal`) strictly against `['http:', 'https:', 'mailto:']`.
- **Localhost-Only Backend Sidecar:** The bundled Python/FastAPI daemon binds exclusively to `127.0.0.1`, preventing any unauthorized exposure over local networks.
- **Git Command Parameterization:** Internal Git operations use parameterized argument arrays (`execFile`) rather than string interpolation, eliminating shell command injection risks.
- **Content Security Policy (CSP):** The application interface enforces a strict CSP restricting execution contexts and third-party script loading.

Thank you for helping keep VisualMark Studio safe for everyone!
