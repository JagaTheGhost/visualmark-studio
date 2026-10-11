## Description
<!-- Provide a clear description of the change and the rationale behind it. -->

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Security fix / dependency patch
- [ ] Documentation update

## Security Checklist
Please verify the following before submitting this pull request:
- [ ] **No Secrets:** No API keys, personal access tokens (`GITHUB_TOKEN`), private keys, or passwords are hardcoded or included in commits.
- [ ] **IPC Safety:** Any new Electron IPC channels validate their inputs, sanitize paths, and restrict URL protocols where applicable.
- [ ] **Dependency Hygiene:** Any new dependencies added have been audited and checked for CVEs or supply chain issues.
- [ ] **No Path Traversal:** File system operations normalize paths and prevent directory traversal.

## Testing & Verification
- [ ] `npm run build` succeeds cleanly in `./frontend`.
- [ ] Pytest passes for backend routes (`pytest backend/tests/test_api.py`).
- [ ] Tested locally on desktop (Electron).
