import React, { useMemo, useState, useEffect } from 'react'
import { useStudioSplit } from '../../utils/useResizableSplit'

export const STANDARDS = [
  {
    id: 'readme',
    name: 'Open-Source README Gateway',
    shortName: 'README Gateway',
    icon: 'stars',
    badge: 'GitHub Standard',
    color: '#818cf8',
    description: 'Repository entry point: value proposition, quick start, preview demo, features, and onboarding.'
  },
  {
    id: 'contributing',
    name: 'Contributor Guidelines',
    shortName: 'Contributing Guide',
    icon: 'handshake',
    badge: 'Community Standard',
    color: '#34d399',
    description: 'Welcoming guidelines for OSS contributors: Code of Conduct, dev setup, PR checklists, and git flow.'
  },
  {
    id: 'setup',
    name: 'Setup & Installation Guide',
    shortName: 'Setup Manual',
    icon: 'construction',
    badge: 'Dev Setup',
    color: '#f59e0b',
    description: 'Detailed environment prerequisites, step-by-step commands, .env configuration, and troubleshooting.'
  },
  {
    id: 'architecture',
    name: 'System Architecture Spec',
    shortName: 'Architecture Spec',
    icon: 'account_tree',
    badge: 'Design Spec',
    color: '#38bdf8',
    description: 'Technical blueprints: system topology diagrams, component boundaries, and data flow sequences.'
  },
  {
    id: 'changelog',
    name: 'Changelog & Releases',
    shortName: 'Changelog & Releases',
    icon: 'history',
    badge: 'SemVer Standard',
    color: '#a78bfa',
    description: 'Chronological release log following Keep a Changelog and Semantic Versioning standards.'
  },
  {
    id: 'api',
    name: 'REST API & Endpoints',
    shortName: 'API Spec',
    icon: 'api',
    badge: 'API Reference',
    color: '#ec4899',
    description: 'Endpoint route matrix, authentication headers, JSON payload schemas, and HTTP error codes.'
  },
  {
    id: 'general',
    name: 'General Markdown Quality',
    shortName: 'Universal Markdown',
    icon: 'description',
    badge: 'Universal Doc',
    color: '#94a3b8',
    description: 'Universal Markdown documentation standards: heading hierarchy, depth, code snippets, and structure.'
  }
]

export function detectStandardForFile(filename) {
  if (!filename) return 'general'
  const lower = filename.toLowerCase()

  if (lower.includes('readme')) return 'readme'
  if (lower.includes('contribut') || lower.includes('conduct') || lower.includes('coc')) return 'contributing'
  if (lower.includes('setup') || lower.includes('install') || lower.includes('deploy') || lower.includes('get_started')) return 'setup'
  if (lower.includes('arch') || lower.includes('design') || lower.includes('spec') || lower.includes('system')) return 'architecture'
  if (lower.includes('changelog') || lower.includes('release') || lower.includes('history')) return 'changelog'
  if (lower.includes('api') || lower.includes('endpoint') || lower.includes('route')) return 'api'

  return 'general'
}

const SECTION_TEMPLATES = {
  // README Templates
  features: `## ✨ Key Features\n\n- **⚡ High Performance:** Engineered for rapid execution with minimal footprint.\n- **🔒 Secure by Design:** Comprehensive input sanitization and zero-trust boundaries.\n- **🧩 Modular Architecture:** Highly extensible plugin interface for custom developer workflows.\n- **📊 Observability & Metrics:** Built-in structured telemetry, audit logs, and status dashboards.\n`,
  installation: `## 📦 Installation\n\n### Prerequisites\n- Node.js \`>= 18.0.0\`\n- npm \`>= 9.0.0\`\n\n\`\`\`bash\n# Clone the repository\ngit clone https://github.com/your-org/your-repo.git\ncd your-repo\n\n# Install client & server dependencies\nnpm install\n\`\`\`\n`,
  usage: `## 🚀 Quick Start & Usage\n\n\`\`\`bash\n# Run the development environment\nnpm run dev\n\n# Run unit and integration tests\nnpm test\n\`\`\`\n\nOpen \`http://localhost:5173\` in your browser to interact with the application.\n`,
  configuration: `## ⚙️ Environment Configuration\n\nCreate a \`.env\` file in the project root based on the following reference matrix:\n\n| Variable | Type | Default | Description |\n| :--- | :---: | :---: | :--- |\n| \`PORT\` | \`number\` | \`3000\` | Web application port |\n| \`DATABASE_URL\` | \`string\` | \`""\` | Database connection string |\n| \`DEBUG\` | \`boolean\` | \`false\` | Enable verbose logging |\n`,
  architecture: `## 🏛️ System Architecture\n\n\`\`\`mermaid\ngraph TD\n    Client[Client UI / Browser] --> API[API Gateway / Router]\n    API --> Service[Core Business Services]\n    Service --> Cache[(Redis Cache)]\n    Service --> DB[(Primary Database)]\n\`\`\`\n`,
  contributing: `## 🤝 Contributing\n\nWe warmly welcome community contributions! Please review our [\`CONTRIBUTING.md\`](./CONTRIBUTING.md) guide before opening a pull request.\n`,
  license: `## 📄 License\n\nDistributed under the **MIT License**. See [\`LICENSE\`](./LICENSE) for terms.\n`,

  // Contributing Templates
  contributing_coc: `## 📜 Code of Conduct\n\nThis project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/). We are committed to fostering an open, inclusive, and harassment-free environment for everyone.\n`,
  contributing_setup: `## 💻 Local Development Setup\n\n1. **Fork and Clone the Repository:**\n   \`\`\`bash\n   git clone https://github.com/your-username/your-repo.git\n   cd your-repo\n   \`\`\`\n2. **Install Dependencies:**\n   \`\`\`bash\n   npm install\n   \`\`\`\n3. **Start the Dev Server:**\n   \`\`\`bash\n   npm run dev\n   \`\`\`\n`,
  contributing_workflow: `## 🌿 Branching & Git Workflow\n\n- Create branches from \`main\` using standard prefixes:\n  - \`feat/feature-description\` for new functionality\n  - \`fix/issue-description\` for bug fixes\n  - \`docs/page-name\` for documentation improvements\n- Keep pull requests focused on a single logical change.\n`,
  contributing_commits: `## 📝 Commit Conventions\n\nWe follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:\n\n- \`feat:\` A new user-facing feature\n- \`fix:\` A bug fix\n- \`docs:\` Documentation modifications only\n- \`refactor:\` Code changes that neither fix a bug nor add a feature\n- \`test:\` Adding or updating tests\n`,
  contributing_tests: `## 🧪 Testing & Code Quality Gates\n\nBefore submitting a pull request, ensure all tests and linters pass:\n\n\`\`\`bash\n# Run automated test suites\nnpm test\n\n# Run static analysis and linting\nnpm run lint\n\`\`\`\n`,
  contributing_pr: `## 🚀 Pull Request Checklist\n\nWhen submitting a pull request, please verify:\n- [ ] Code compiles cleanly and passes all automated tests (\`npm test\`).\n- [ ] New code includes corresponding unit test coverage.\n- [ ] Documentation and comments have been updated accordingly.\n- [ ] No unneeded debug logs, credentials, or temporary files are committed.\n`,

  // Setup Manual Templates
  setup_prereq: `## 📋 System Prerequisites\n\nVerify that the following runtimes and tools are installed:\n\n| Runtime / Tool | Minimum Version | Recommended | Check Command |\n| :--- | :---: | :---: | :--- |\n| **Node.js** | \`v18.0.0\` | \`v20.x LTS\` | \`node -v\` |\n| **npm** | \`v9.0.0\` | \`v10.x\` | \`npm -v\` |\n| **Git** | \`v2.30.0\` | \`Latest\` | \`git --version\` |\n`,
  setup_steps: `## 🛠️ Step-by-Step Installation\n\n\`\`\`bash\n# 1. Clone repository\ngit clone https://github.com/your-org/your-repo.git\ncd your-repo\n\n# 2. Install all required dependencies\nnpm install\n\n# 3. Create initial environment file\ncp .env.example .env\n\`\`\`\n`,
  setup_env: `## 🔑 Environment Configuration (.env)\n\nConfigure the following variables in your local \`.env\` file:\n\n| Variable | Required | Default | Purpose |\n| :--- | :---: | :---: | :--- |\n| \`APP_ENV\` | Yes | \`development\` | Runtime environment mode |\n| \`PORT\` | No | \`3000\` | Local server listen port |\n| \`API_SECRET_KEY\` | Yes | — | Secret token for authentication |\n`,
  setup_services: `## 🗄️ Database & Services Initialization\n\n\`\`\`bash\n# Spin up required databases via Docker\ndocker compose up -d\n\n# Run database schema migrations\nnpm run db:migrate\n\n# (Optional) Seed initial development data\nnpm run db:seed\n\`\`\`\n`,
  setup_verify: `## ✅ Verification & Health Check\n\nConfirm that the service is operational:\n\n\`\`\`bash\n# Health check query\ncurl -i http://localhost:3000/api/health\n\`\`\`\n\nExpected response: \`{"status": "ok", "uptime": 12}\`.\n`,
  setup_troubleshoot: `## 🩺 Troubleshooting & Common Gotchas\n\n- **Port already in use (\`EADDRINUSE: 3000\`):** Change \`PORT=3001\` in your \`.env\` file or stop the conflicting process.\n- **Node Version Mismatch:** Use Node Version Manager (\`nvm use 20\`) to match the required LTS.\n- **Permission Errors:** Avoid \`sudo npm install\`; verify folder ownership with \`chown -R $USER .\`.\n`,

  // Architecture Spec Templates
  arch_diagram: `## 📐 System Architecture Diagram\n\n\`\`\`mermaid\nflowchart TD\n    subgraph Presentation ["Presentation Layer"]\n        UI[Client Application / Vite UI]\n    end\n\n    subgraph Core ["Application Core"]\n        Router[API Gateway & Router]\n        Engine[Business Logic Engine]\n    end\n\n    subgraph Storage ["Persistence Layer"]\n        DB[(Primary Database)]\n        Disk[File System Storage]\n    end\n\n    UI --> Router\n    Router --> Engine\n    Engine --> DB\n    Engine --> Disk\n\`\`\`\n`,
  arch_principles: `## 💡 Core Design Principles\n\n1. **Separation of Concerns:** Clear boundary isolation between UI presentation, domain rules, and storage.\n2. **Deterministic Behavior:** Input-driven modules with reproducible transformations.\n3. **Resilience & Fault Tolerance:** Graceful degradation on network or external API failures.\n4. **Security by Default:** Strict validation of all inputs at network and file boundaries.\n`,
  arch_components: `## 🧩 Component & Layer Boundaries\n\n- **\`frontend/\`**: User interface components, state management, and client routing.\n- **\`backend/\`**: REST endpoints, data transformation pipelines, and validation.\n- **\`shared/\`**: Type definitions, schemas, and utility constants used across tiers.\n`,
  arch_dataflow: `## 🔄 Data Flow & State Lifecycle\n\n\`\`\`mermaid\nsequenceDiagram\n    autonumber\n    actor User\n    participant UI as Frontend UI\n    participant API as Backend API\n    participant DB as Persistence\n\n    User->>UI: Submit Action\n    UI->>API: HTTP Request (JSON)\n    API->>API: Validate Schema\n    API->>DB: Write Record\n    DB-->>API: Confirm Save\n    API-->>UI: 200 OK (Response)\n    UI-->>User: Visual Update & Toast\n\`\`\`\n`,
  arch_security: `## 🛡️ Security & Access Control\n\n- **Authentication:** Token-based authentication passed via secure headers.\n- **Transport Security:** Strict TLS 1.3 enforced for all external communications.\n- **Sanitization:** All user-provided markdown and file paths are strictly sanitized to prevent traversal attacks.\n`,
  arch_tree: `## 📂 Codebase Directory Map\n\n\`\`\`bash\nproject-root/\n├── src/\n│   ├── components/      # UI components and views\n│   ├── hooks/           # Custom React hooks\n│   ├── services/        # API client and networking\n│   └── utils/           # Formatting and helpers\n├── public/              # Static icons and assets\n├── package.json         # Dependencies and scripts\n└── README.md            # Entry documentation\n\`\`\`\n`,

  // Changelog Templates
  cl_notice: `## 📌 Format & Specification Notice\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n`,
  cl_unreleased: `## [Unreleased]\n\n### Added\n- Staged experimental feature flags for upcoming release.\n\n### Fixed\n- Addressed edge-case bug in input validator.\n`,
  cl_version: `## [1.0.0] - 2026-10-11\n\n### Added\n- Initial production release.\n- Full documentation suite and interactive developer tools.\n\n### Fixed\n- Resolved cross-platform layout discrepancies.\n`,
  cl_categories: `### Added\n- New configuration preference settings.\n\n### Changed\n- Optimized caching layer for 35% faster rendering.\n\n### Fixed\n- Fixed listener leak on component unmount.\n\n### Security\n- Upgraded external dependencies to resolve security advisories.\n`,
  cl_links: `[unreleased]: https://github.com/your-org/your-repo/compare/v1.0.0...HEAD\n[1.0.0]: https://github.com/your-org/your-repo/releases/tag/v1.0.0\n`,

  // API Spec Templates
  api_auth: `## 🔐 Authentication & Headers\n\nAll authenticated API requests require a valid token in the \`Authorization\` header:\n\n\`\`\`http\nAuthorization: Bearer YOUR_API_KEY_HERE\nContent-Type: application/json\nAccept: application/json\n\`\`\`\n`,
  api_routes: `## 📡 Endpoints Matrix\n\n| Method | Endpoint | Description | Auth Required |\n| :---: | :--- | :--- | :---: |\n| \`GET\` | \`/api/v1/health\` | Service health status check | No |\n| \`GET\` | \`/api/v1/items\` | Retrieve paginated item collection | Yes |\n| \`POST\` | \`/api/v1/items\` | Create a new item resource | Yes |\n| \`GET\` | \`/api/v1/items/:id\` | Fetch item details by identifier | Yes |\n| \`DELETE\` | \`/api/v1/items/:id\` | Delete existing item resource | Yes |\n`,
  api_schemas: `## 📦 Request & Response Schemas\n\n### Create Resource\n\`POST /api/v1/items\`\n\n**Request Body:**\n\`\`\`json\n{\n  "name": "Production Cluster",\n  "category": "infrastructure",\n  "enabled": true\n}\n\`\`\`\n\n**Response (\`201 Created\`):**\n\`\`\`json\n{\n  "id": "item_82931",\n  "name": "Production Cluster",\n  "category": "infrastructure",\n  "enabled": true,\n  "createdAt": "2026-10-11T10:00:00Z"\n}\n\`\`\`\n`,
  api_errors: `## ⚠️ Error Responses & Status Codes\n\nErrors return a standardized JSON error structure:\n\n\`\`\`json\n{\n  "error": {\n    "code": "RESOURCE_NOT_FOUND",\n    "message": "The requested item was not found.",\n    "status": 404\n  }\n}\n\`\`\`\n\n| HTTP Code | Description |\n| :---: | :--- |\n| \`400 Bad Request\` | Invalid payload or missing parameters |\n| \`401 Unauthorized\` | Missing or invalid authentication token |\n| \`404 Not Found\` | Requested resource does not exist |\n| \`429 Too Many Requests\` | Rate limit threshold exceeded |\n`,
  api_ratelimits: `## ⏱️ Rate Limiting & Pagination\n\n- **Rate Limiting:** Requests are limited to \`100 requests per minute\` per API key. Exceeding returns HTTP \`429\`.\n- **Pagination:** Query collection endpoints with \`?page=1&limit=25\`. Total counts are returned in \`X-Total-Count\`.\n`,

  // General Markdown Templates
  gen_sections: `## 📖 Overview\n\nProvide an introductory summary describing the purpose, scope, and objectives of this documentation.\n\n### Key Objectives\n- Clearly document operational steps and expected outcomes.\n- Provide accessible reference points for engineering and operations teams.\n`,
  gen_summary: `> **Summary:** This document establishes reference standards and operational procedures. Review before making modifications to shared configurations.\n`,
  gen_code: `### Example Usage Snippet\n\n\`\`\`javascript\n// Example operational snippet\nimport { setupConfig } from './config'\n\nconst config = setupConfig({\n  env: 'production',\n  timeout: 5000\n})\n\`\`\`\n`,
  gen_table: `### Reference Matrix\n\n| Component | Status | Notes |\n| :--- | :---: | :--- |\n| Core Runtime | Stable | Verified across supported platforms |\n| API Gateway | Active | TLS 1.3 enforced |\n`,
  gen_links: `### 🔗 References & Related Documentation\n\n- [Architecture Specification](./ARCHITECTURE.md)\n- [Contributing Guidelines](./CONTRIBUTING.md)\n- [Setup & Deployment Guide](./SETUP.md)\n`
}

export default function AuditStudioTab({
  allFiles = {},
  openDocTabs = [],
  initialFile = 'README.md',
  markdown = '',
  activeFile = 'README.md',
  onInsertSection = () => {},
  onBackToReadme = () => {}
}) {
  const [copied, setCopied] = useState(false)
  const { formWidth, isDragging, handleMouseDown, handleDoubleClick } = useStudioSplit(480)

  // Calculate available files for auditing
  const availableFiles = useMemo(() => {
    const keys = Object.keys(allFiles || {})
    if (keys.length > 0) return keys
    if (openDocTabs && openDocTabs.length > 0) {
      return openDocTabs.filter(f => !f.endsWith('.studio') && f !== 'settings')
    }
    return [activeFile || initialFile || 'README.md']
  }, [allFiles, openDocTabs, activeFile, initialFile])

  // Selected file state
  const [selectedFile, setSelectedFile] = useState(() => {
    if (initialFile && allFiles && allFiles[initialFile] !== undefined) return initialFile
    if (activeFile && allFiles && allFiles[activeFile] !== undefined) return activeFile
    return availableFiles[0] || 'README.md'
  })

  // Sync selectedFile if initialFile changes and exists
  useEffect(() => {
    if (initialFile && allFiles && allFiles[initialFile] !== undefined) {
      setSelectedFile(initialFile)
    }
  }, [initialFile])

  // Keep selectedFile valid if file list changes
  useEffect(() => {
    if (availableFiles.length > 0 && !availableFiles.includes(selectedFile)) {
      setSelectedFile(availableFiles[0])
    }
  }, [availableFiles, selectedFile])

  // Standard Profile state with auto-detection
  const [selectedStandard, setSelectedStandard] = useState(() => detectStandardForFile(selectedFile))
  const [isManualStandard, setIsManualStandard] = useState(false)

  // Auto-switch standard when selectedFile changes (unless user manually locked a choice)
  const handleSelectFile = (file) => {
    setSelectedFile(file)
    if (!isManualStandard) {
      setSelectedStandard(detectStandardForFile(file))
    }
  }

  const handleSelectStandard = (stdId) => {
    setSelectedStandard(stdId)
    setIsManualStandard(true)
  }

  const handleResetAutoStandard = () => {
    setIsManualStandard(false)
    setSelectedStandard(detectStandardForFile(selectedFile))
  }

  // Active document content resolution
  const currentContent = useMemo(() => {
    if (allFiles && allFiles[selectedFile] !== undefined) {
      return allFiles[selectedFile] || ''
    }
    if (selectedFile === 'README.md' && markdown) {
      return markdown || ''
    }
    return ''
  }, [allFiles, selectedFile, markdown])

  // Get active standard configuration
  const activeStandardConfig = useMemo(() => {
    return STANDARDS.find(s => s.id === selectedStandard) || STANDARDS[0]
  }, [selectedStandard])

  // Rule-based audit evaluation against active standard
  const auditReport = useMemo(() => {
    const text = currentContent || ''
    const lines = text.split('\n')
    const words = text.trim() ? text.trim().split(/\s+/).length : 0

    let checks = []

    if (selectedStandard === 'readme') {
      checks = [
        {
          id: 'title',
          label: 'Project Heading (H1)',
          passed: /^#\s+.+/m.test(text),
          weight: 10,
          tip: 'Add a clear # Project Name heading at line 1'
        },
        {
          id: 'tagline',
          label: 'Subtitle / Value Proposition',
          passed: /^>\s+.+/m.test(text),
          weight: 8,
          tip: 'Add a single-sentence blockquote > summarizing project impact'
        },
        {
          id: 'badges',
          label: 'Shields.io / Status Badges',
          passed: /img\.shields\.io|shields\.io|badge/i.test(text),
          weight: 8,
          tip: 'Add status, version, and license badges via Badges Studio'
        },
        {
          id: 'demo',
          label: 'Visual Demo / Banner / Screenshot',
          passed: /!\[.*?\]\(.*?\)|<img\s+.*?src=/i.test(text),
          weight: 10,
          tip: 'Include a preview image or video demo to show how it works'
        },
        {
          id: 'features',
          label: 'Key Features Section',
          passed: /^#{1,3}\s+.*feature/im.test(text),
          weight: 12,
          tip: 'List core capabilities and differentiator bullet points',
          templateKey: 'features'
        },
        {
          id: 'installation',
          label: 'Installation & Prerequisites',
          passed: /^#{1,3}\s+.*(install|getting started|setup|prerequisite)/im.test(text),
          weight: 12,
          tip: 'Provide step-by-step installation commands',
          templateKey: 'installation'
        },
        {
          id: 'usage',
          label: 'Quick Start & Usage Examples',
          passed: /^#{1,3}\s+.*(usage|quick start|how to use|running)/im.test(text),
          weight: 12,
          tip: 'Add real code examples of how to run the project',
          templateKey: 'usage'
        },
        {
          id: 'configuration',
          label: 'Environment & Configuration Table',
          passed: /^#{1,3}\s+.*(config|environment|\.env)/im.test(text),
          weight: 8,
          tip: 'Document environment variables and .env settings',
          templateKey: 'configuration'
        },
        {
          id: 'architecture',
          label: 'Architecture / Directory Tree',
          passed: /^#{1,3}\s+.*(arch|tree|structure|diagram)/im.test(text) || /```mermaid/i.test(text),
          weight: 8,
          tip: 'Use Directory Tree Studio or Mermaid diagrams',
          templateKey: 'architecture'
        },
        {
          id: 'contributing',
          label: 'Contributing Guidelines Link',
          passed: /^#{1,3}\s+.*contribut/im.test(text) || /CONTRIBUTING\.md/i.test(text),
          weight: 6,
          tip: 'Welcome open-source PRs and link to CONTRIBUTING.md',
          templateKey: 'contributing'
        },
        {
          id: 'license',
          label: 'Open-Source License Notice',
          passed: /^#{1,3}\s+.*license/im.test(text) || /MIT License|Apache-2\.0|GPL/i.test(text),
          weight: 6,
          tip: 'Declare the software distribution terms and license',
          templateKey: 'license'
        }
      ]
    } else if (selectedStandard === 'contributing') {
      checks = [
        {
          id: 'contributing_title',
          label: 'Contributing Welcome Heading (H1)',
          passed: /^#\s+.*(contribut|welcome|guideline)/im.test(text) || /^#\s+.+/m.test(text),
          weight: 10,
          tip: 'Add a welcoming # Contributing Guidelines heading at the top'
        },
        {
          id: 'contributing_coc',
          label: 'Code of Conduct Reference',
          passed: /code of conduct|conduct|covenant|be respectful/i.test(text),
          weight: 12,
          tip: 'Reference the Contributor Covenant or project code of conduct',
          templateKey: 'contributing_coc'
        },
        {
          id: 'contributing_setup',
          label: 'Local Dev Environment Setup',
          passed: /^#{1,3}\s+.*(setup|prerequisite|environment|install|clone)/im.test(text) || /git clone/i.test(text),
          weight: 16,
          tip: 'Provide clear instructions to clone, install, and run locally',
          templateKey: 'contributing_setup'
        },
        {
          id: 'contributing_workflow',
          label: 'Branching & Git Workflow Rules',
          passed: /git (checkout|branch|flow|rebase)|fork/i.test(text) || /^#{1,3}\s+.*(branch|workflow|git)/im.test(text),
          weight: 14,
          tip: 'Specify branch naming conventions (feat/..., fix/...) and fork flow',
          templateKey: 'contributing_workflow'
        },
        {
          id: 'contributing_commits',
          label: 'Commit Message Conventions',
          passed: /conventional commit|commit message|feat:|fix:|chore:/i.test(text) || /^#{1,3}\s+.*(commit|message)/im.test(text),
          weight: 14,
          tip: 'Document commit guidelines (e.g., Conventional Commits)',
          templateKey: 'contributing_commits'
        },
        {
          id: 'contributing_tests',
          label: 'Testing & Quality Gates',
          passed: /^#{1,3}\s+.*(test|lint|typecheck|quality|qa)/im.test(text) || /(npm|yarn|pnpm|pytest|cargo)\s+(test|run lint)/i.test(text),
          weight: 16,
          tip: 'Detail commands to run unit tests, integration tests, and linters',
          templateKey: 'contributing_tests'
        },
        {
          id: 'contributing_pr',
          label: 'Pull Request Checklist & Review Flow',
          passed: /^#{1,3}\s+.*(pull request|pr process|submitting|review)/im.test(text) || /- \[[ x]\].*pr/i.test(text),
          weight: 18,
          tip: 'Provide a step-by-step PR checklist for contributors',
          templateKey: 'contributing_pr'
        }
      ]
    } else if (selectedStandard === 'setup') {
      checks = [
        {
          id: 'setup_title',
          label: 'Setup Guide Heading (H1)',
          passed: /^#\s+.+/m.test(text),
          weight: 10,
          tip: 'Add a clear # Setup & Installation Guide heading'
        },
        {
          id: 'setup_prereq',
          label: 'Prerequisites & Version Matrix',
          passed: /^#{1,3}\s+.*(prerequisite|requirement|system requirement|dependenc)/im.test(text) || /node(\.js)?\s*>=\s*\d+/i.test(text),
          weight: 15,
          tip: 'List required runtimes (Node, Python, Docker) and minimum versions',
          templateKey: 'setup_prereq'
        },
        {
          id: 'setup_steps',
          label: 'Step-by-Step Installation Commands',
          passed: /```(bash|sh|shell|zsh|powershell|cmd)[\s\S]*?(npm|pnpm|yarn|pip|cargo|go|docker)[\s\S]*?```/i.test(text) || /```bash/i.test(text),
          weight: 18,
          tip: 'Provide copy-pasteable terminal commands to clone and install dependencies',
          templateKey: 'setup_steps'
        },
        {
          id: 'setup_env',
          label: 'Environment (.env) Configuration Table',
          passed: /\|[\s-:]+\|[\s\S]*?(\.env|PORT|KEY|URL|SECRET)/i.test(text) || /^#{1,3}\s+.*(environment|config|\.env)/im.test(text),
          weight: 18,
          tip: 'Detail every required and optional environment variable in a table',
          templateKey: 'setup_env'
        },
        {
          id: 'setup_services',
          label: 'Database & Services Initialization',
          passed: /^#{1,3}\s+.*(database|migration|seed|docker|service|redis|postgres)/im.test(text) || /docker compose|db:migrate/i.test(text),
          weight: 15,
          tip: 'Explain database migration, seeding, and container setup',
          templateKey: 'setup_services'
        },
        {
          id: 'setup_verify',
          label: 'Verification & Health Check',
          passed: /^#{1,3}\s+.*(verif|health|smoke test|check|test run)/im.test(text) || /localhost:\d+|curl\s+/i.test(text),
          weight: 12,
          tip: 'Give a quick command or URL to verify successful startup',
          templateKey: 'setup_verify'
        },
        {
          id: 'setup_troubleshoot',
          label: 'Troubleshooting & FAQ Section',
          passed: /^#{1,3}\s+.*(troubleshoot|faq|common issues|error|problem)/im.test(text),
          weight: 12,
          tip: 'Document known gotchas, port conflicts, permissions, and solutions',
          templateKey: 'setup_troubleshoot'
        }
      ]
    } else if (selectedStandard === 'architecture') {
      checks = [
        {
          id: 'arch_title',
          label: 'Architecture Title & Scope (H1)',
          passed: /^#\s+.+/m.test(text),
          weight: 10,
          tip: 'Add a # System Architecture & Technical Design heading'
        },
        {
          id: 'arch_diagram',
          label: 'Visual Architecture Diagram',
          passed: /```mermaid[\s\S]*?```/i.test(text) || /!\[.*?arch.*?\]/i.test(text) || /```[\s\S]*?┌───[\s\S]*?```/i.test(text),
          weight: 20,
          tip: 'Include a Mermaid flowchart, sequence diagram, or topology visual',
          templateKey: 'arch_diagram'
        },
        {
          id: 'arch_principles',
          label: 'Core Design Principles & Philosophy',
          passed: /^#{1,3}\s+.*(principle|goal|philosophy|overview|foundation)/im.test(text),
          weight: 14,
          tip: 'List foundational architectural principles (modularity, resilience, isolation)',
          templateKey: 'arch_principles'
        },
        {
          id: 'arch_components',
          label: 'Component & Layer Boundaries',
          passed: /^#{1,3}\s+.*(component|layer|module|boundary|service|package)/im.test(text),
          weight: 16,
          tip: 'Define presentation, business logic, and storage tier responsibilities',
          templateKey: 'arch_components'
        },
        {
          id: 'arch_dataflow',
          label: 'Data Flow & Request Lifecycle',
          passed: /^#{1,3}\s+.*(data flow|lifecycle|pipeline|flow|state)/im.test(text) || /sequenceDiagram/i.test(text),
          weight: 16,
          tip: 'Trace how data moves from user action to database and response',
          templateKey: 'arch_dataflow'
        },
        {
          id: 'arch_security',
          label: 'Security & Access Isolation',
          passed: /^#{1,3}\s+.*(security|auth|encryption|rbac|isolation|compliance)/im.test(text),
          weight: 14,
          tip: 'Specify authentication, encryption at rest/transit, and access control',
          templateKey: 'arch_security'
        },
        {
          id: 'arch_tree',
          label: 'Directory Structure / Codebase Map',
          passed: /^#{1,3}\s+.*(directory|tree|folder|structure)/im.test(text) || /├──\s+/m.test(text),
          weight: 10,
          tip: 'Provide an annotated directory tree showing where modules live',
          templateKey: 'arch_tree'
        }
      ]
    } else if (selectedStandard === 'changelog') {
      checks = [
        {
          id: 'cl_title',
          label: 'Changelog Heading (H1)',
          passed: /^#\s+.*(changelog|release|history)/im.test(text) || /^#\s+.+/m.test(text),
          weight: 10,
          tip: 'Add a clear # Changelog heading at line 1'
        },
        {
          id: 'cl_notice',
          label: 'SemVer & Keep a Changelog Notice',
          passed: /semver\.org|semantic versioning|keepachangelog\.com/i.test(text),
          weight: 15,
          tip: 'State adherence to Semantic Versioning and Keep a Changelog',
          templateKey: 'cl_notice'
        },
        {
          id: 'cl_unreleased',
          label: '[Unreleased] Staging Section',
          passed: /^##\s+.*\[?unreleased\]?/im.test(text),
          weight: 20,
          tip: 'Include an [Unreleased] section for staged changes before tagging',
          templateKey: 'cl_unreleased'
        },
        {
          id: 'cl_version',
          label: 'Version Entries with ISO Dates',
          passed: /^##\s+.*\[?\d+\.\d+\.\d+\]?.*(\d{4}-\d{2}-\d{2})?/im.test(text),
          weight: 20,
          tip: 'Format versions as ## [X.Y.Z] - YYYY-MM-DD',
          templateKey: 'cl_version'
        },
        {
          id: 'cl_categories',
          label: 'Categorized Change Subheadings',
          passed: /^###\s+.*(Added|Changed|Deprecated|Removed|Fixed|Security)/im.test(text),
          weight: 20,
          tip: 'Group changes under Added, Changed, Fixed, or Security',
          templateKey: 'cl_categories'
        },
        {
          id: 'cl_links',
          label: 'Version Comparison Diff Links',
          passed: /\[\d+\.\d+\.\d+\]:\s+https?:\/\/github\.com/i.test(text) || /\[unreleased\]:\s+https?:\/\//i.test(text) || /\[.*?\]:\s+http/i.test(text),
          weight: 15,
          tip: 'Add Markdown comparison links at the footer comparing release tags',
          templateKey: 'cl_links'
        }
      ]
    } else if (selectedStandard === 'api') {
      checks = [
        {
          id: 'api_title',
          label: 'API Title & Base URL (H1)',
          passed: /^#\s+.*(api|endpoint|reference|rest)/im.test(text) || /^#\s+.+/m.test(text),
          weight: 15,
          tip: 'Specify API Title and Base URL endpoint'
        },
        {
          id: 'api_auth',
          label: 'Authentication & Headers Specification',
          passed: /^#{1,3}\s+.*(auth|bearer|token|header|api key)/im.test(text) || /Authorization:\s+Bearer/i.test(text),
          weight: 15,
          tip: 'Document Authorization headers, Bearer tokens, or API Keys',
          templateKey: 'api_auth'
        },
        {
          id: 'api_routes',
          label: 'Endpoint HTTP Methods & Routes',
          passed: /GET|POST|PUT|PATCH|DELETE/m.test(text),
          weight: 20,
          tip: 'Document endpoint HTTP verbs (GET, POST, etc.) and path patterns',
          templateKey: 'api_routes'
        },
        {
          id: 'api_schemas',
          label: 'Request & Response JSON Schemas',
          passed: /```json[\s\S]*?```/i.test(text) || /\|[\s-:]+\|[\s\S]*?(body|param|type|field)/i.test(text),
          weight: 20,
          tip: 'Provide sample JSON request bodies and response payloads',
          templateKey: 'api_schemas'
        },
        {
          id: 'api_errors',
          label: 'Error Codes & HTTP Status Matrix',
          passed: /400|401|403|404|422|500/m.test(text) || /^#{1,3}\s+.*(error|status code|response code)/im.test(text),
          weight: 15,
          tip: 'Include a status matrix with common error codes and explanations',
          templateKey: 'api_errors'
        },
        {
          id: 'api_ratelimits',
          label: 'Rate Limits & Pagination Guidelines',
          passed: /rate limit|paging|pagination|page_size|offset|cursor/i.test(text),
          weight: 15,
          tip: 'Document request throttling and pagination parameters',
          templateKey: 'api_ratelimits'
        }
      ]
    } else {
      // General Markdown Quality
      checks = [
        {
          id: 'gen_title',
          label: 'Clear Document Heading (H1)',
          passed: /^#\s+.+/m.test(text),
          weight: 15,
          tip: 'Add a single # Heading 1 document title at the top'
        },
        {
          id: 'gen_sections',
          label: 'Structured Subsections (H2 / H3)',
          passed: /^##\s+.+/m.test(text),
          weight: 15,
          tip: 'Organize content with clear ## Section and ### Subsection headings',
          templateKey: 'gen_sections'
        },
        {
          id: 'gen_summary',
          label: 'Executive Summary / Purpose Statement',
          passed: /^>\s+.+/m.test(text) || /^#{1,3}\s+.*(summary|overview|purpose|about)/im.test(text),
          weight: 15,
          tip: 'Provide a brief summary or callout blockquote explaining document purpose',
          templateKey: 'gen_summary'
        },
        {
          id: 'gen_code',
          label: 'Code Blocks or Practical Examples',
          passed: /```[a-z]*[\s\S]*?```/i.test(text),
          weight: 15,
          tip: 'Include syntax-highlighted code blocks or CLI demonstrations',
          templateKey: 'gen_code'
        },
        {
          id: 'gen_table',
          label: 'Structured Tables or Checklists',
          passed: /\|[\s-:]+\|/.test(text) || /- \[[ x]\]/.test(text),
          weight: 15,
          tip: 'Use Markdown tables or task checklists to organize information',
          templateKey: 'gen_table'
        },
        {
          id: 'gen_links',
          label: 'Related References & Deep Links',
          passed: /\[.*?\]\(https?:.*?\)|\[.*?\]\((\.\/|\.\.\/).*?\)/.test(text),
          weight: 15,
          tip: 'Link to related internal docs, specifications, or external resources',
          templateKey: 'gen_links'
        },
        {
          id: 'gen_words',
          label: 'Substantive Depth (> 150 Words)',
          passed: words >= 150,
          weight: 10,
          tip: 'Ensure the document has thorough context, explanations, and instructions'
        }
      ]
    }

    // Calculate score
    const totalPoints = checks.reduce((acc, c) => acc + (c.passed ? c.weight : 0), 0)
    const maxPoints = checks.reduce((acc, c) => acc + c.weight, 0) || 100
    const scorePct = Math.round((totalPoints / maxPoints) * 100)

    let grade = 'F'
    let gradeColor = '#ef4444'
    if (scorePct >= 92) { grade = 'A+'; gradeColor = '#10b981' }
    else if (scorePct >= 84) { grade = 'A'; gradeColor = '#10b981' }
    else if (scorePct >= 75) { grade = 'B'; gradeColor = '#38bdf8' }
    else if (scorePct >= 62) { grade = 'C'; gradeColor = '#f59e0b' }
    else if (scorePct >= 50) { grade = 'D'; gradeColor = '#f97316' }

    // Readability metrics
    const codeBlocksCount = (text.match(/```/g) || []).length / 2
    const tablesCount = (text.match(/\|[\s-:]+\|/g) || []).length
    const headingsCount = (text.match(/^#{1,6}\s+/gm) || []).length
    const readingMinutes = Math.max(1, Math.ceil(words / 200))

    // Warnings
    const hasExamplePlaceholders = /your-org|your-repo|username\/project|alex@example\.com|\bTODO\b|\bFIXME\b/i.test(text)
    const emptyLinks = /\[.*?\]\(\s*\)/.test(text)

    const warnings = []
    if (hasExamplePlaceholders) {
      warnings.push('Detected generic placeholders or TODOs (e.g., your-org/your-repo, TODO). Replace with project details.')
    }
    if (emptyLinks) {
      warnings.push('Detected empty link targets [text](). Ensure all links have valid relative or absolute URLs.')
    }
    if (words === 0) {
      warnings.push(`The document "${selectedFile}" is currently empty. Add content or boilerplate to begin auditing.`)
    } else if (words < 80) {
      warnings.push('Word count is under 80 words. Consider providing more context, examples, and instructions.')
    }

    return {
      scorePct,
      grade,
      gradeColor,
      checks,
      metrics: {
        words,
        lines: lines.length,
        readingMinutes,
        headingsCount,
        codeBlocksCount: Math.floor(codeBlocksCount),
        tablesCount
      },
      warnings
    }
  }, [currentContent, selectedStandard, selectedFile])

  // Formatted report for copying
  const reportText = useMemo(() => {
    return `## 📋 Documentation Health Audit Report (${selectedFile})\n` +
      `**Standard Profile:** ${activeStandardConfig.name} (${activeStandardConfig.badge})\n\n` +
      `- **Overall Grade:** ${auditReport.grade} (${auditReport.scorePct}/100)\n` +
      `- **Total Words:** ${auditReport.metrics.words.toLocaleString()} (~${auditReport.metrics.readingMinutes} min read)\n` +
      `- **Lines:** ${auditReport.metrics.lines} | **Headings:** ${auditReport.metrics.headingsCount} | **Code Blocks:** ${auditReport.metrics.codeBlocksCount} | **Tables:** ${auditReport.metrics.tablesCount}\n\n` +
      `### Passed Checks\n` +
      auditReport.checks.filter(c => c.passed).map(c => `- ✅ ${c.label}`).join('\n') + '\n\n' +
      `### Missing Elements\n` +
      (auditReport.checks.filter(c => !c.passed).map(c => `- ⚠️ ${c.label} (${c.tip})`).join('\n') || '- None! All checks passed.')
  }, [auditReport, selectedFile, activeStandardConfig])

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const passedChecksCount = auditReport.checks.filter(c => c.passed).length

  return (
    <div className="studio-tab-view select-none">
      {/* Studio Top Control Strip */}
      <div className="studio-top-bar">
        <div className="studio-bar-left">
          <div
            className="studio-badge-halo"
            style={{
              backgroundColor: `${activeStandardConfig.color}22`,
              borderColor: `${activeStandardConfig.color}55`,
              boxShadow: `0 0 12px ${activeStandardConfig.color}33`
            }}
          >
            <span className="material-symbols-outlined" style={{ color: activeStandardConfig.color }}>
              {activeStandardConfig.icon || 'verified_user'}
            </span>
          </div>
          <div>
            <div className="studio-title-row">
              <h2 className="studio-title">Documentation Health & Quality Auditor</h2>
              <span
                className="studio-tag"
                style={{
                  borderColor: `${activeStandardConfig.color}55`,
                  color: activeStandardConfig.color,
                  backgroundColor: `${activeStandardConfig.color}15`
                }}
              >
                {activeStandardConfig.badge}
              </span>
            </div>
            <p className="studio-subtitle">
              Audit structure, onboarding clarity, and quality standards for README and any documentation file.
            </p>
          </div>
        </div>

        <div className="studio-bar-actions">
          {onBackToReadme && (
            <button
              type="button"
              className="btn-studio-secondary"
              onClick={() => onBackToReadme(selectedFile)}
              title={`Return to active editor (${selectedFile})`}
            >
              <span className="material-symbols-outlined icon-xs">arrow_back</span>
              <span>Back to Editor</span>
            </button>
          )}

          <button
            type="button"
            className="btn-studio-secondary"
            onClick={handleCopyReport}
            title="Copy audit report markdown to clipboard"
          >
            <span className="material-symbols-outlined icon-xs">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy Audit Summary'}</span>
          </button>
        </div>
      </div>

      {/* Target File & Documentation Standard Bar */}
      <div className="audit-control-bar">
        {/* Left: Document Selector */}
        <div className="audit-control-group audit-doc-selector-group">
          <div className="audit-control-label">
            <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#38bdf8' }}>
              description
            </span>
            <span>Target Document:</span>
          </div>

          {/* Quick File Pills */}
          <div className="audit-file-pills custom-scrollbar">
            {availableFiles.map((filename) => {
              const isSelected = selectedFile === filename
              const fileContent = allFiles?.[filename] ?? ''
              const wordCount = fileContent.trim() ? fileContent.trim().split(/\s+/).length : 0
              return (
                <button
                  key={filename}
                  type="button"
                  className={`audit-file-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectFile(filename)}
                  title={`Audit ${filename} (${wordCount} words)`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                    {isSelected ? 'check' : 'article'}
                  </span>
                  <span className="audit-file-pill-name">{filename}</span>
                  <span className="audit-file-pill-words">{wordCount}w</span>
                </button>
              )
            })}
          </div>

          {/* Dropdown fallback for wide workspaces */}
          <select
            className="audit-select audit-doc-select"
            value={selectedFile}
            onChange={(e) => handleSelectFile(e.target.value)}
            title="Select target document file to audit"
          >
            {availableFiles.map((f) => (
              <option key={f} value={f}>
                📄 {f}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Standards Profile Switcher */}
        <div className="audit-control-group audit-standard-group">
          <div className="audit-control-label">
            <span className="material-symbols-outlined" style={{ fontSize: '15px', color: activeStandardConfig.color }}>
              fact_check
            </span>
            <span>Standard Profile:</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              className="audit-select audit-standard-select"
              value={selectedStandard}
              onChange={(e) => handleSelectStandard(e.target.value)}
              title="Select documentation audit standard ruleset"
            >
              {STANDARDS.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.name}
                </option>
              ))}
            </select>

            {isManualStandard ? (
              <button
                type="button"
                className="audit-auto-badge manual"
                onClick={handleResetAutoStandard}
                title="Custom profile chosen. Click to reset to auto-detect."
              >
                <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>sync</span>
                <span>Custom (Reset)</span>
              </button>
            ) : (
              <span className="audit-auto-badge auto" title="Automatically detected from filename">
                <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>bolt</span>
                <span>Auto-Detected</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Studio Body: 2-Column Responsive Layout */}
      <div className="studio-content-grid">
        {/* Left Column: Grade Scorecard, Metrics, and Warnings */}
        <div
          className="studio-form-column custom-scrollbar"
          style={{ width: `${formWidth}px`, minWidth: `${formWidth}px`, maxWidth: `${formWidth}px`, flex: 'none' }}
        >
          {/* Grade Hero Scorecard */}
          <div className="studio-section">
            <label className="studio-section-label">Documentation Scorecard</label>
            <div className="audit-grade-container">
              <div
                className="audit-grade-ring"
                style={{ borderColor: auditReport.gradeColor }}
              >
                <span className="audit-grade-letter" style={{ color: auditReport.gradeColor }}>
                  {auditReport.grade}
                </span>
                <span className="audit-grade-pct">{auditReport.scorePct}%</span>
              </div>

              <div className="audit-score-info">
                <span className="audit-score-title">
                  {auditReport.scorePct >= 85
                    ? 'Production Ready Documentation'
                    : auditReport.scorePct >= 65
                    ? 'Good Baseline, Needs Polish'
                    : 'Incomplete Documentation'}
                </span>
                <span className="audit-score-summary">
                  Auditing <strong>{selectedFile}</strong> against <em>{activeStandardConfig.shortName}</em> standards ({passedChecksCount}/{auditReport.checks.length} criteria passed).
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="studio-section">
            <label className="studio-section-label">Readability & Content Metrics</label>
            <div className="audit-metrics-grid">
              <div className="audit-metric-card">
                <div className="audit-metric-value">{auditReport.metrics.words.toLocaleString()}</div>
                <div className="audit-metric-name">Total Words</div>
              </div>

              <div className="audit-metric-card">
                <div className="audit-metric-value">~{auditReport.metrics.readingMinutes} min</div>
                <div className="audit-metric-name">Read Time</div>
              </div>

              <div className="audit-metric-card">
                <div className="audit-metric-value">{auditReport.metrics.lines}</div>
                <div className="audit-metric-name">Lines</div>
              </div>

              <div className="audit-metric-card">
                <div className="audit-metric-value">{auditReport.metrics.headingsCount}</div>
                <div className="audit-metric-name">Headings</div>
              </div>

              <div className="audit-metric-card">
                <div className="audit-metric-value">{auditReport.metrics.codeBlocksCount}</div>
                <div className="audit-metric-name">Code Blocks</div>
              </div>

              <div className="audit-metric-card">
                <div className="audit-metric-value">{auditReport.metrics.tablesCount}</div>
                <div className="audit-metric-name">Tables</div>
              </div>
            </div>
          </div>

          {/* Quality Warnings */}
          {auditReport.warnings.length > 0 && (
            <div className="studio-section">
              <label className="studio-section-label">Audit Quality Warnings ({auditReport.warnings.length})</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {auditReport.warnings.map((w, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      color: '#f59e0b'
                    }}
                  >
                    <span className="material-symbols-outlined icon-xs" style={{ fontSize: '15px' }}>
                      warning
                    </span>
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generated Audit Report Card */}
          <div className="studio-card" style={{ marginTop: '4px' }}>
            <div className="studio-card-header">
              <span className="studio-card-title">Generated Audit Summary Report</span>
              <button
                type="button"
                className="snippet-copy-btn"
                onClick={handleCopyReport}
              >
                <span className="material-symbols-outlined icon-xs">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="studio-code-block custom-scrollbar" style={{ maxHeight: '140px' }}>
              <code>{reportText}</code>
            </pre>
          </div>
        </div>

        {/* Resizer Splitter Handle */}
        <div
          className={`studio-resizer-handle ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title="Drag to resize form and preview sections • Double-click to reset"
        />

        {/* Right Column: Detailed Checklist & Quick Section Fixes */}
        <div className="studio-preview-column custom-scrollbar" style={{ flex: 1, minWidth: 0 }}>
          <div className="studio-card">
            <div className="studio-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="mac-dot dot-red" />
                <span className="mac-dot dot-yellow" />
                <span className="mac-dot dot-green" />
                <span className="studio-card-title">{activeStandardConfig.name} Checklist</span>
              </div>
              <span
                className="studio-card-tag"
                style={{
                  color: passedChecksCount === auditReport.checks.length ? '#10b981' : '#38bdf8'
                }}
              >
                {passedChecksCount} / {auditReport.checks.length} Passed
              </span>
            </div>

            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="audit-check-grid">
                {auditReport.checks.map((check) => (
                  <div
                    key={check.id}
                    className={`audit-check-card ${check.passed ? 'passed' : 'missing'}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: '18px',
                          color: check.passed ? '#10b981' : '#f59e0b',
                          flexShrink: 0
                        }}
                      >
                        {check.passed ? 'check_circle' : 'error'}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="audit-check-label">{check.label}</span>
                          <span
                            style={{
                              fontSize: '10px',
                              fontFamily: 'monospace',
                              color: 'var(--text-muted)',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              padding: '1px 5px',
                              borderRadius: '3px'
                            }}
                          >
                            +{check.weight} pts
                          </span>
                        </div>
                        <div className="audit-check-tip">{check.tip}</div>
                      </div>
                    </div>

                    {!check.passed && check.templateKey && SECTION_TEMPLATES[check.templateKey] && (
                      <button
                        type="button"
                        className="audit-fix-btn"
                        onClick={() => onInsertSection(SECTION_TEMPLATES[check.templateKey], selectedFile)}
                        title={`Insert ${check.label} starter boilerplate into ${selectedFile}`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>add</span>
                        <span>Add Section</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
