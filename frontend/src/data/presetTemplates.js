// Production-ready starter blueprints equipped with Mermaid diagrams, Shields.io badges, Directory trees, Tables, and GitHub alert callouts.

export const PRESET_TEMPLATES = [
  {
    id: 'fullstack',
    title: '🚀 Full-Stack SaaS',
    category: 'Web App',
    description: 'Production-ready README with Mermaid Architecture, Tree Studio Directory Structure, Docker, and API endpoints.',
    tags: ['React', 'FastAPI', 'PostgreSQL', 'Docker'],
    content: `<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366f1,70:3b82f6,100:10b981&height=220&section=header&text=Nexus%20SaaS%20Platform&fontSize=42&fontAlignY=36&desc=Next-Generation%20Cloud%20Operations%20%26%20Telemetry%20Platform&descAlignY=60&descAlign=50" width="100%" alt="Nexus Banner" />
</p>

# Nexus SaaS Platform ⚡

> **Next-generation cloud operations platform for modern engineering teams.**

<div align="center">

![Build Status](https://img.shields.io/badge/Build-Passing-10b981?style=for-the-badge) ![License](https://img.shields.io/badge/License-MIT-0969da?style=for-the-badge) ![Coverage](https://img.shields.io/badge/Coverage-96%25-6366f1?style=for-the-badge)
<br/>
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

<div align="center">

[🚀 Getting Started](#-getting-started) &nbsp;•&nbsp; [✨ Features](#-features) &nbsp;•&nbsp; [🏛️ Architecture](#️-architecture) &nbsp;•&nbsp; [📁 Project Structure](#-project-structure) &nbsp;•&nbsp; [🌐 API Specification](#-api-specification) &nbsp;•&nbsp; [⚙️ Configuration](#-configuration) &nbsp;•&nbsp; [📄 License](#-license)

</div>

## ✨ Features

- **⚡ Real-Time Telemetry:** Live websocket streaming with sub-millisecond response latency.
- **🔒 Enterprise RBAC:** Granular role-based access control, JWT session signing, and audit logging.
- **🐳 Multi-Stage Containerization:** Single-command local environment spinning via Docker Compose.

### 📊 Capability Matrix

| Capability | Status | Target / Protocol | Description |
| :--- | :---: | :--- | :--- |
| **Telemetry Engine** | ✅ Active | WebSocket / TCP | Sub-millisecond stream ingestion |
| **Access Control** | ✅ Active | OAuth2 / JWT | Multi-tenant team authentication |
| **Database Store** | ✅ Active | PostgreSQL / Pooled | Persistent audit logs & relational state |
| **Cache Broker** | ✅ Active | Redis 7.2 | In-memory session store & query caching |

## 🏛️ Architecture

\`\`\`mermaid
graph TD
    Client["🌐 Client (React + Vite)"] -->|HTTPS / REST| Gateway["⚡ API Gateway (FastAPI)"]
    Gateway -->|JWT Auth & RBAC| AuthService["🔐 Auth & Tenant Manager"]
    Gateway -->|Async Telemetry| StreamEngine["📡 Telemetry Streamer"]
    Gateway -->|CRUD Operations| CoreService["💼 Business Logic Core"]
    CoreService -->|Pooled TCP| DB[("🗄️ PostgreSQL DB")]
    StreamEngine -->|Pub/Sub Ingestion| Cache[("⚡ Redis Cache")]
\`\`\`

## 📁 Project Structure

\`\`\`
nexus-saas/
├── 📁 frontend/             # React 18 + Vite client application
│   ├── 📁 src/components/   # Reusable UI component primitives
│   ├── 📁 src/hooks/        # Custom React hooks (auth, query)
│   └── 📄 package.json      # Node dependencies & build scripts
├── 📁 backend/              # FastAPI Python service
│   ├── 📁 app/api/          # REST route handlers (v1)
│   ├── 📁 app/core/         # Config, security & JWT utilities
│   ├── 📁 app/models/       # SQLAlchemy ORM models
│   └── 📄 requirements.txt  # Python package specifications
├── 📁 docker/               # Compose recipes & Dockerfiles
└── 📄 docker-compose.yml    # Multi-container local orchestration
\`\`\`

## 🚀 Getting Started

### Quick Start

\`\`\`bash
# Clone the repository
$ git clone https://github.com/example/nexus-saas.git && cd nexus-saas

# Spin up complete stack with Docker Compose
$ docker-compose up -d --build
\`\`\`

#### Manual Setup

<details open>
<summary><b>Backend (Python & FastAPI)</b></summary>

\`\`\`bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
\`\`\`

</details>

<details>
<summary><b>Frontend (React & Vite)</b></summary>

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

</details>

## 🌐 API Specification

| Method | Endpoint | Auth | Rate Limit | Description |
| :--- | :--- | :---: | :---: | :--- |
| \`POST\` | \`/api/v1/auth/login\` | ⚪ Public | 5 req/min | Authenticate & issue JWT Bearer Token |
| \`GET\` | \`/api/v1/telemetry/stats\` | 🔒 Bearer | 120 req/min | Real-time cluster health and metrics |
| \`POST\` | \`/api/v1/projects\` | 🔒 Bearer | 30 req/min | Provision a new tenant project workspace |

## ⚙️ Configuration

| Variable | Type | Default | Requirement | Description |
| :--- | :--- | :--- | :--- | :--- |
| \`PORT\` | \`number\` | \`8000\` | ✅ Required | API server HTTP port |
| \`DATABASE_URL\` | \`string\` | \`postgresql://...\` | ✅ Required | Database connection URI |
| \`REDIS_URL\` | \`string\` | \`redis://localhost:6379\` | ⚪ Optional | Cache & session broker |
| \`JWT_SECRET_KEY\` | \`string\` | \`...\` | ✅ Required | Secret key for JWT signature validation |

> [!NOTE]
> Ensure Docker is running before executing \`docker-compose up\`.

> [!TIP]
> Copy \`.env.example\` to \`.env\` and customize your local credentials before starting.

## 📄 License

Distributed under the **MIT License**. See [\`LICENSE\`](./LICENSE) for details.
`
  },
  {
    id: 'cli-tool',
    title: '⚡ Developer CLI Utility',
    category: 'Dev Tool',
    description: 'Terminal tool template with Mermaid execution pipeline, Directory Tree, Flags, and Benchmarks.',
    tags: ['Rust', 'Python', 'Go', 'CLI'],
    content: `<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:f59e0b,70:ef4444,100:6366f1&height=220&section=header&text=hyper-fetch&fontSize=42&fontAlignY=36&desc=Blazing%20Fast%20Asynchronous%20CLI%20Tool%20%26%20Engine&descAlignY=60&descAlign=50" width="100%" alt="hyper-fetch Banner" />
</p>

# hyper-fetch ⚡

> **Blazing fast asynchronous HTTP and documentation generator terminal utility.**

<div align="center">

![Crates.io](https://img.shields.io/badge/Crates.io-v1.2.0-orange.svg?style=for-the-badge) ![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg?style=for-the-badge) ![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Linux%20%7C%20Windows-brightgreen.svg?style=for-the-badge)
<br/>
![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white) ![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white) ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

</div>

<div align="center">

[📦 Installation](#-installation) &nbsp;•&nbsp; [🔄 Execution Pipeline](#-execution-pipeline) &nbsp;•&nbsp; [📁 Structure](#-project-structure) &nbsp;•&nbsp; [💻 Usage](#-usage) &nbsp;•&nbsp; [⚙️ CLI Flags](#️-command-options) &nbsp;•&nbsp; [📊 Benchmarks](#-benchmarks) &nbsp;•&nbsp; [🤝 Contributing](#-contributing)

</div>

## 📦 Installation

### Quick Start

\`\`\`bash
# Cargo (Rust)
$ cargo install hyper-fetch

# Homebrew (macOS / Linux)
$ brew install hyper-fetch

# Python pip
$ pip install hyper-fetch
\`\`\`

## 🔄 Execution Pipeline

\`\`\`mermaid
graph LR
    Input["⌨️ Terminal Args & Flags"] --> Parser["🔍 Clap / StructOpt Parser"]
    Parser --> Validator["🛡️ Input Validator & Config"]
    Validator --> Engine["⚡ Async Execution Engine"]
    Engine --> Worker["🧵 Tokio ThreadPool"]
    Worker --> Formatter["🎨 Rich Terminal / JSON Output"]
\`\`\`

## 📁 Project Structure

\`\`\`
hyper-fetch/
├── 📁 src/
│   ├── 📄 main.rs           # Entry point & CLI argument parser
│   ├── 📁 commands/         # Subcommand handlers (generate, watch, scan)
│   ├── 📁 engine/           # Async HTTP pipeline & worker pool
│   └── 📁 render/           # ANSI colors, tables & progress bars
├── 📁 tests/                # Integration & CLI snapshot tests
├── 📁 benches/              # Criterion performance microbenchmarks
└── 📄 Cargo.toml            # Rust package manifest & dependencies
\`\`\`

## 💻 Usage

\`\`\`bash
# Analyze a repository and generate docs
hyper-fetch generate --repo https://github.com/user/project --output ./docs

# Live watch mode with ANSI colors
hyper-fetch watch --live --format json
\`\`\`

## ⚙️ Command Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| \`--output\` | \`-o\` | \`string\` | \`./dist\` | Destination directory path |
| \`--verbose\` | \`-v\` | \`boolean\` | \`false\` | Enable verbose telemetry logs |
| \`--format\` | \`-f\` | \`string\` | \`md\` | Output format (\`md\`, \`json\`, \`html\`) |
| \`--concurrency\` | \`-c\` | \`number\` | \`16\` | Maximum concurrent worker tasks |

## 📊 Benchmarks

| Tool | Requests / Sec | P99 Latency | Memory Footprint |
| :--- | :---: | :---: | :---: |
| **hyper-fetch (Rust)** | **148,200 req/s** | **2.1 ms** | **14 MB** |
| \`curl\` | 34,100 req/s | 8.4 ms | 22 MB |
| \`python-requests\` | 8,900 req/s | 31.0 ms | 64 MB |

> [!TIP]
> Run with \`--verbose\` to display granular timing benchmarks for every network payload.

## 🤝 Contributing

Contributions are welcomed! See \`CONTRIBUTING.md\` for testing instructions.
`
  },
  {
    id: 'react-lib',
    title: '⚛️ React Component Library',
    category: 'Frontend',
    description: 'Design system template with Mermaid Component Flow, Directory Tree, TSX code, and Props table.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Rollup'],
    content: `<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:38bdf8,70:6366f1,100:a855f7&height=220&section=header&text=@ui-craft/core&fontSize=42&fontAlignY=36&desc=Accessible%20Headless%20React%20UI%20Primitives&descAlignY=60&descAlign=50" width="100%" alt="@ui-craft/core Banner" />
</p>

# @ui-craft/core 🎨

> **Accessible, headless, and themeable React UI primitives for high-performance applications.**

<div align="center">

![npm version](https://img.shields.io/badge/npm-v2.4.0-cb3837?style=for-the-badge&logo=npm) ![License](https://img.shields.io/badge/License-MIT-0969da?style=for-the-badge) ![Bundle Size](https://img.shields.io/badge/Bundle-<3.2kB-10b981?style=for-the-badge)
<br/>
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

<div align="center">

[📦 Installation](#-installation) &nbsp;•&nbsp; [🏗️ Architecture](#️-architecture) &nbsp;•&nbsp; [📁 Package Structure](#-package-structure) &nbsp;•&nbsp; [🚀 Quick Start](#-quick-start) &nbsp;•&nbsp; [📚 API & Props](#-props-specification) &nbsp;•&nbsp; [📄 License](#-license)

</div>

## 📦 Installation

\`\`\`bash
# npm
npm install @ui-craft/core

# pnpm
pnpm add @ui-craft/core

# bun
bun add @ui-craft/core
\`\`\`

## 🏗️ Architecture

\`\`\`mermaid
graph TD
    Theme["🎨 Theme Tokens (CSS / Tailwind)"] --> Primitives["🧩 Headless Core Primitives"]
    Primitives --> Accessible["♿ WAI-ARIA Focus & Screen Reader"]
    Accessible --> Components["📦 Styled UI Components (Button, Modal, Select)"]
    Components --> App["🚀 Consumer Next.js / Vite Application"]
\`\`\`

## 📁 Package Structure

\`\`\`
ui-craft-core/
├── 📁 src/
│   ├── 📁 components/       # Primitives (Button, Modal, Input, Drawer)
│   ├── 📁 hooks/            # Keyboard navigation & accessibility hooks
│   ├── 📁 styles/           # Tailwind preset & CSS custom properties
│   └── 📄 index.ts          # Public exports & TypeScript types
├── 📁 .storybook/           # Storybook documentation configuration
├── 📁 stories/              # Interactive component stories & playground
└── 📄 package.json          # Rollup bundling & exports map
\`\`\`

## 🚀 Quick Start

\`\`\`tsx
import React from 'react'
import { Button, Modal, useDisclosure } from '@ui-craft/core'

export function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
      <Button variant="primary" onClick={onOpen}>
        Open Studio Modal
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2>Studio Workspace</h2>
      </Modal>
    </div>
  )
}
\`\`\`

## 📚 Props Specification

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| \`variant\` | \`'primary' | 'secondary' | 'ghost'\` | \`'primary'\` | Visual button hierarchy |
| \`size\` | \`'sm' | 'md' | 'lg'\` | \`'md'\` | Component size scaling |
| \`disabled\` | \`boolean\` | \`false\` | Disable interactions |
| \`loading\` | \`boolean\` | \`false\` | Display spinner and prevent clicks |

> [!TIP]
> All primitives conform strictly to WAI-ARIA authoring guidelines with out-of-the-box keyboard focus management.

## 📄 License

Distributed under the **MIT License**. See [\`LICENSE\`](./LICENSE) for details.
`
  },
  {
    id: 'api-service',
    title: '🌐 RESTful API Microservice',
    category: 'Backend / API',
    description: 'High-throughput microservice with Mermaid Sequence Diagram, OpenAPI specs, and JWT auth.',
    tags: ['FastAPI', 'Python', 'PostgreSQL', 'Redis', 'Docker'],
    content: `<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0ea5e9,70:6366f1,100:14b8a6&height=220&section=header&text=Aero%20API%20Engine&fontSize=42&fontAlignY=36&desc=High-Throughput%20RESTful%20Microservice%20%26%20Event%20Gateway&descAlignY=60&descAlign=50" width="100%" alt="Aero API Banner" />
</p>

# Aero API Engine 🌐

> **High-throughput asynchronous RESTful API service with OpenAPI 3.1 specification, JWT auth, and Redis caching.**

<div align="center">

![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white) ![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-7.2-DC382D?style=for-the-badge&logo=redis&logoColor=white)
<br/>
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-0969da?style=for-the-badge)

</div>

<div align="center">

[🔄 Request Lifecycle](#-request-lifecycle) &nbsp;•&nbsp; [📁 Repository Layout](#-repository-layout) &nbsp;•&nbsp; [🌐 API Endpoints](#-api-endpoints) &nbsp;•&nbsp; [⚙️ Configuration](#-configuration) &nbsp;•&nbsp; [🐳 Docker Setup](#-docker-setup)

</div>

## 🔄 Request Lifecycle

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Client as 🌐 Client
    participant Gateway as ⚡ API Gateway
    participant Auth as 🔐 JWT Middleware
    participant Cache as ⚡ Redis Cache
    participant DB as 🗄️ PostgreSQL

    Client->>Gateway: POST /api/v1/auth/login
    Gateway->>Auth: Validate Credentials
    Auth-->>Client: 200 OK (JWT Bearer Token)

    Client->>Gateway: GET /api/v1/analytics/metrics
    Gateway->>Auth: Verify JWT Signature
    Gateway->>Cache: Query Cache Key
    alt Cache Hit
        Cache-->>Client: 200 OK (Redis Hit: 1.2ms)
    else Cache Miss
        Gateway->>DB: Execute Query
        DB-->>Gateway: Result Rows
        Gateway->>Cache: Set Key (TTL 300s)
        Gateway-->>Client: 200 OK (DB Query: 14ms)
    end
\`\`\`

## 📁 Repository Layout

\`\`\`
fastapi-service/
├── 📁 app/
│   ├── 📁 api/              # Versioned API routes (v1/auth, v1/metrics)
│   ├── 📁 core/             # Security, JWT tokens, Settings (pydantic)
│   ├── 📁 db/               # SQLAlchemy session, migrations (Alembic)
│   ├── 📁 schemas/          # Pydantic request / response validation models
│   └── 📄 main.py           # FastAPI application factory & middleware
├── 📁 tests/                # Pytest async unit & integration tests
├── 📁 alembic/              # Database migration scripts
├── 📄 Dockerfile            # Multi-stage lightweight container
└── 📄 docker-compose.yml    # App + PostgreSQL + Redis local stack
\`\`\`

## 🌐 API Endpoints

| Method | Endpoint | Auth | Rate Limit | Description |
| :--- | :--- | :---: | :---: | :--- |
| \`POST\` | \`/api/v1/auth/login\` | ⚪ Public | 5 req/min | Exchange credentials for JWT access token |
| \`POST\` | \`/api/v1/auth/refresh\` | 🔒 Bearer | 10 req/min | Refresh expired access token |
| \`GET\` | \`/api/v1/users/me\` | 🔒 Bearer | 60 req/min | Retrieve current authenticated user profile |
| \`GET\` | \`/api/v1/metrics/live\` | 🔒 Bearer | 120 req/min | Live aggregated system metrics |
| \`POST\` | \`/api/v1/events/batch\` | 🔒 Bearer | 30 req/min | Ingest batch telemetry events |

## ⚙️ Configuration

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| \`DATABASE_URL\` | \`string\` | \`postgresql+asyncpg://...\` | Connection pool URL |
| \`REDIS_URL\` | \`string\` | \`redis://localhost:6379/0\` | Redis connection URI |
| \`JWT_SECRET_KEY\` | \`string\` | \`change_me_in_prod\` | Cryptographic signing secret |
| \`ACCESS_TOKEN_EXPIRE_MINUTES\`| \`number\` | \`60\` | Access token duration |

## 🐳 Docker Setup

\`\`\`bash
# Build and run the service stack
docker-compose up --build -d

# Check live logs
docker-compose logs -f app
\`\`\`

> [!NOTE]
> Interactive OpenAPI documentation is automatically served at \`http://localhost:8000/docs\`.
`
  },
  {
    id: 'ai-pipeline',
    title: '🤖 AI Agent & LLM Pipeline',
    category: 'AI / Machine Learning',
    description: 'Production RAG and autonomous AI agent pipeline with Mermaid RAG flow, ChromaDB, and benchmarks.',
    tags: ['Python', 'LangChain', 'OpenAI', 'ChromaDB', 'RAG'],
    content: `<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:8b5cf6,70:ec4899,100:6366f1&height=220&section=header&text=Synapse%20AI%20Agent&fontSize=42&fontAlignY=36&desc=Autonomous%20RAG%20%26%20Multi-Tool%20Agentic%20Pipeline&descAlignY=60&descAlign=50" width="100%" alt="Synapse AI Banner" />
</p>

# Synapse AI Agent & Pipeline 🤖

> **Autonomous multi-tool agent with hybrid semantic vector retrieval, reranking, and guardrail validation.**

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white) ![LangChain](https://img.shields.io/badge/LangChain-0.2-1C3C3C?style=for-the-badge) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)
<br/>
![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_Store-FF6F00?style=for-the-badge) ![Accuracy](https://img.shields.io/badge/Evaluation-94.8%25-10b981?style=for-the-badge) ![License](https://img.shields.io/badge/License-Apache--2.0-blue?style=for-the-badge)

</div>

<div align="center">

[🧠 RAG Architecture](#-rag-architecture) &nbsp;•&nbsp; [📁 Structure](#-project-structure) &nbsp;•&nbsp; [🚀 Quickstart](#-quickstart) &nbsp;•&nbsp; [📊 Model Benchmarks](#-model-benchmarks) &nbsp;•&nbsp; [⚙️ Configuration](#️-configuration)

</div>

## 🧠 RAG Architecture

\`\`\`mermaid
graph TD
    User["👤 User Query / Instruction"] --> Embed["🔢 OpenAI text-embedding-3-small"]
    Embed --> VectorDB[("📚 ChromaDB Vector Store")]
    VectorDB -->|Cosine Similarity k=5| Retrieval["🔍 Semantic Context Retriever"]
    Retrieval --> ReRanker["⚖️ Cross-Encoder Re-Ranker"]
    ReRanker --> Augment["📝 Prompt Context Augmentation"]
    User --> Augment
    Augment --> LLM["🧠 LLM Reasoning (GPT-4o)"]
    LLM --> Guardrails["🛡️ Output Guardrails & Safety Filter"]
    Guardrails --> Response["💬 Final Streamed Answer"]
\`\`\`

## 📁 Project Structure

\`\`\`
agentic-rag-pipeline/
├── 📁 pipeline/
│   ├── 📁 ingest/           # Document chunking (PDF, Markdown, Web)
│   ├── 📁 embeddings/       # Vector generation & store indexing
│   ├── 📁 retriever/        # Hybrid semantic + keyword BM25 search
│   ├── 📁 agents/           # LangGraph agent definitions & tools
│   └── 📄 workflow.py       # Orchestration graph & execution state
├── 📁 eval/                 # Ragas evaluation & benchmark datasets
├── 📁 config/               # Model temperature, thresholds, prompts
└── 📄 pyproject.toml        # uv package manager specifications
\`\`\`

## 🚀 Quickstart

\`\`\`bash
# Clone and install dependencies with uv
$ git clone https://github.com/example/synapse-ai.git && cd synapse-ai
$ uv sync

# Ingest knowledge documents
$ uv run python -m pipeline.ingest --source ./knowledge-base

# Run the interactive agent CLI
$ uv run python -m pipeline.workflow
\`\`\`

### Agent Invocation

\`\`\`python
from pipeline.workflow import create_rag_agent

agent = create_rag_agent(model="gpt-4o", temperature=0.2)
response = agent.invoke({"query": "Explain our authentication protocol"})
print(response.output)
\`\`\`

## 📊 Model Benchmarks

| Metric | Target | Score | Framework |
| :--- | :---: | :---: | :--- |
| **Faithfulness** | > 90% | **96.2%** | Ragas Framework |
| **Answer Relevance** | > 85% | **94.8%** | Ragas Framework |
| **Context Recall** | > 88% | **91.4%** | Ground Truth Q&A |
| **P90 Latency** | < 1.5s | **1.18s** | Streaming Tokens |

## ⚙️ Configuration

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| \`OPENAI_API_KEY\` | \`string\` | \`...\` | OpenAI platform API credential |
| \`EMBEDDING_MODEL\` | \`string\` | \`text-embedding-3-small\` | Vector embedding model |
| \`CHUNK_SIZE\` | \`number\` | \`512\` | Token chunk size for splitting |
| \`TOP_K_RESULTS\` | \`number\` | \`5\` | Number of context snippets retrieved |

> [!IMPORTANT]
> Never commit API keys or vector store credentials to GitHub. Always load secrets via \`.env\`.
`
  },
  {
    id: 'rust-engine',
    title: '🦀 High-Performance Systems Engine',
    category: 'Systems / Rust',
    description: 'Multi-threaded compute engine with SIMD vectorization and zero-cost abstractions.',
    tags: ['Rust', 'Tokio', 'WebAssembly', 'SIMD'],
    content: `<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:ea580c,70:f59e0b,100:10b981&height=220&section=header&text=Turbo%20Compute%20Engine&fontSize=42&fontAlignY=36&desc=Zero-Cost%20SIMD%20Multi-Threaded%20Parallel%20Execution%20Engine&descAlignY=60&descAlign=50" width="100%" alt="Turbo Engine Banner" />
</p>

# Turbo Compute Engine 🦀

> **Ultra-low-latency parallel compute engine written in Rust with SIMD vectorization and lock-free concurrency.**

<div align="center">

![Rust](https://img.shields.io/badge/Rust-2024_Edition-DEA584?style=for-the-badge&logo=rust&logoColor=white) ![Crates.io](https://img.shields.io/badge/Crates.io-v0.8.4-orange?style=for-the-badge) ![SIMD](https://img.shields.io/badge/SIMD-AVX--512-brightgreen?style=for-the-badge)
<br/>
![Tokio](https://img.shields.io/badge/Tokio-Async-blue?style=for-the-badge) ![Throughput](https://img.shields.io/badge/Throughput-1.8M_ops%2Fsec-success?style=for-the-badge) ![License](https://img.shields.io/badge/License-MIT-0969da?style=for-the-badge)

</div>

<div align="center">

[⚡ Architecture](#-architecture) &nbsp;•&nbsp; [📁 Structure](#-project-structure) &nbsp;•&nbsp; [📊 Benchmarks](#-benchmarks) &nbsp;•&nbsp; [🛠️ Installation](#️-installation) &nbsp;•&nbsp; [⚙️ Tuning](#️-tuning-parameters)

</div>

## ⚡ Architecture

\`\`\`mermaid
graph LR
    Input["📥 High-Throughput Stream"] --> RingBuffer["🔄 Zero-Copy RingBuffer"]
    RingBuffer --> Dispatcher["⚡ Tokio Work-Stealing Scheduler"]
    Dispatcher --> Core1["🧵 Worker Thread 1 (SIMD AVX-512)"]
    Dispatcher --> Core2["🧵 Worker Thread 2 (SIMD AVX-512)"]
    Dispatcher --> Core3["🧵 Worker Thread 3 (SIMD AVX-512)"]
    Core1 --> Collector["📦 Lock-Free Concurrent Queue"]
    Core2 --> Collector
    Core3 --> Collector
    Collector --> Output["📤 Aggregated Sink (WebAssembly / TCP)"]
\`\`\`

## 📁 Project Structure

\`\`\`
turbo-engine/
├── 📁 src/
│   ├── 📄 lib.rs            # Public API & C-ABI foreign exports
│   ├── 📁 core/             # Ringbuffer, lock-free queues & atomic state
│   ├── 📁 simd/             # Platform-specific AVX-512 & NEON intrinsics
│   ├── 📁 scheduler/        # Work-stealing threadpool orchestration
│   └── 📁 wasm/             # WebAssembly JS bindings via wasm-bindgen
├── 📁 benches/              # Criterion microbenchmarks & CPU profiling
└── 📄 Cargo.toml            # Feature flags & compiler optimization profile
\`\`\`

## 📊 Benchmarks

*Hardware: AMD Ryzen 9 7950X, 32 Threads, 64GB DDR5*

| Engine | Operations / Sec | Throughput | P99 Latency |
| :--- | :---: | :---: | :---: |
| **Turbo Engine (Rust + SIMD)** | **1,840,000 ops/s** | **3.8 GB/s** | **840 ns** |
| Standard Multi-Threaded C++ | 920,000 ops/s | 1.9 GB/s | 1.8 μs |
| Go Goroutine Pool | 410,000 ops/s | 850 MB/s | 4.2 μs |

## 🛠️ Installation

\`\`\`bash
# Add to your Cargo.toml
[dependencies]
turbo-engine = { version = "0.8", features = ["avx512", "tokio"] }
\`\`\`

### Compilation with Native CPU Target

\`\`\`bash
# Compile with maximum processor acceleration
RUSTFLAGS="-C target-cpu=native" cargo build --release
\`\`\`

## ⚙️ Tuning Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| \`ring_buffer_capacity\` | \`usize\` | \`65536\` | Pre-allocated circular ring buffer slots |
| \`worker_threads\` | \`usize\` | \`NumCPUs\` | Dedicated OS worker threads |
| \`batch_size\` | \`usize\` | \`256\` | SIMD vector vectorization stride |

> [!TIP]
> Enable the \`wasm\` feature flag to generate native browser packages using \`wasm-pack build\`.
`
  },
  {
    id: 'electron-desktop',
    title: '🖥️ Desktop Application & IDE',
    category: 'Desktop App',
    description: 'Cross-platform native desktop app with IPC Architecture, Shortcuts, and Build guide.',
    tags: ['Electron', 'React', 'TypeScript', 'Node.js'],
    content: `<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:334155,70:0284c7,100:6366f1&height=220&section=header&text=Aura%20Desktop%20IDE&fontSize=42&fontAlignY=36&desc=Cross-Platform%20Modern%20Desktop%20Workspace&descAlignY=60&descAlign=50" width="100%" alt="Aura Desktop Banner" />
</p>

# Aura Desktop IDE 🖥️

> **Native cross-platform desktop application and editor built with Electron, React, and typed IPC bridge.**

<div align="center">

![Electron](https://img.shields.io/badge/Electron-31+-47848F?style=for-the-badge&logo=electron&logoColor=white) ![React](https://img.shields.io/badge/React-18.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
<br/>
![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white) ![macOS](https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=apple&logoColor=white) ![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black) ![License](https://img.shields.io/badge/License-MIT-0969da?style=for-the-badge)

</div>

<div align="center">

[🏛️ IPC Architecture](#️-ipc-architecture) &nbsp;•&nbsp; [📁 Structure](#-project-structure) &nbsp;•&nbsp; [⌨️ Shortcuts](#️-keyboard-shortcuts) &nbsp;•&nbsp; [📦 Build & Package](#-build--packaging) &nbsp;•&nbsp; [📄 License](#-license)

</div>

## 🏛️ IPC Architecture

\`\`\`mermaid
graph TD
    subgraph MainProcess ["⚙️ Electron Main Process (Node.js)"]
        Window["🪟 BrowserWindow Lifecycle"]
        FileSys["💾 Native Filesystem & OS Dialogs"]
        AutoUpdate["🔄 Auto-Updater & Menu Bar"]
    end
    subgraph PreloadBridge ["🔐 ContextBridge Preload"]
        IPC["🔒 Secure Typed IPC Channel"]
    end
    subgraph RendererProcess ["🎨 Renderer Process (React + Vite)"]
        Store["📦 State Store (Tabs, Workspace)"]
        Editor["📝 Code Editor & Markdown Engine"]
        Terminal["💻 Integrated Terminal Emulator"]
    end
    Window --> IPC
    FileSys --> IPC
    AutoUpdate --> IPC
    IPC --> Store
    IPC --> Editor
    IPC --> Terminal
\`\`\`

## 📁 Project Structure

\`\`\`
desktop-ide/
├── 📁 electron/
│   ├── 📄 main.cjs          # Window management, IPC handlers & lifecycle
│   └── 📄 preload.cjs       # contextBridge safe IPC exposing
├── 📁 frontend/
│   ├── 📁 src/components/   # TabBar, EditorToolbar, Workspace, Preview
│   ├── 📁 src/utils/        # Native file I/O bridges & shortcuts
│   └── 📄 package.json      # Client dependencies
├── 📁 assets/               # Platform icons (.ico, .icns, .png)
└── 📄 electron-builder.yml  # Packaging configuration (NSIS, DMG, AppImage)
\`\`\`

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Scope |
| :--- | :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>N</kbd> | New Document Tab | Global |
| <kbd>Ctrl</kbd> + <kbd>O</kbd> | Open Local File / Folder | Global |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> | Save Active Buffer to Disk | Active Editor |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> | Open Command Palette | Global |
| <kbd>Ctrl</kbd> + <kbd>\`</kbd> | Toggle Integrated Terminal | Bottom Drawer |

## 📦 Build & Packaging

\`\`\`bash
# Development Mode
npm run electron:dev

# Package Windows (.exe installer)
npm run build:win

# Package macOS (.dmg installer)
npm run build:mac

# Package Linux (.AppImage / .deb)
npm run build:linux
\`\`\`

> [!NOTE]
> All IPC events pass strictly through \`contextBridge.exposeInMainWorld\` to prevent Node.js remote code execution.
`
  },
  {
    id: 'mobile-app',
    title: '📱 Cross-Platform Mobile App',
    category: 'Mobile App',
    description: 'Native mobile app template with Offline Sync diagram, Directory Tree, and Expo setup.',
    tags: ['React Native', 'Expo', 'iOS', 'Android', 'TypeScript'],
    content: `<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:10b981,70:0284c7,100:6366f1&height=220&section=header&text=Pulse%20Mobile&fontSize=42&fontAlignY=36&desc=Offline-First%20Cross-Platform%20Mobile%20Experience&descAlignY=60&descAlign=50" width="100%" alt="Pulse Mobile Banner" />
</p>

# Pulse Mobile 📱

> **Offline-first, cross-platform mobile application powered by React Native, Expo SDK, and SQLite.**

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-0.74-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Expo](https://img.shields.io/badge/Expo-SDK_51-000020?style=for-the-badge&logo=expo&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
<br/>
![iOS](https://img.shields.io/badge/iOS-16+-000000?style=for-the-badge&logo=apple&logoColor=white) ![Android](https://img.shields.io/badge/Android-14+-3DDC84?style=for-the-badge&logo=android&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-0969da?style=for-the-badge)

</div>

<div align="center">

[📱 Architecture](#-offline-sync-architecture) &nbsp;•&nbsp; [📁 Structure](#-project-structure) &nbsp;•&nbsp; [✨ Feature Matrix](#-feature-matrix) &nbsp;•&nbsp; [🚀 Getting Started](#-getting-started) &nbsp;•&nbsp; [⚙️ Permissions](#️-device-permissions)

</div>

## 📱 Offline Sync Architecture

\`\`\`mermaid
graph TD
    Screen["📱 Mobile UI Screens"] --> Action["⚡ User Gesture / Action"]
    Action --> Zustand["📦 Zustand Global State"]
    Zustand --> SQLite[("💾 Local SQLite Database (Offline-First)")]
    SQLite --> SyncQueue["📬 Background Sync Queue"]
    SyncQueue -->|Network Available| SyncWorker["🔄 Expo Background Fetch"]
    SyncWorker -->|HTTPS REST / GraphQL| Cloud["☁️ Cloud Backend API"]
    Cloud -->|Delta Sync| SQLite
\`\`\`

## 📁 Project Structure

\`\`\`
mobile-app/
├── 📁 app/                  # Expo Router file-based screens
│   ├── 📄 _layout.tsx       # Root navigation stack & theme provider
│   ├── 📄 index.tsx         # Home dashboard screen
│   └── 📁 (tabs)/           # Bottom tab bar navigators
├── 📁 src/
│   ├── 📁 components/       # Native touchables, modals & lists
│   ├── 📁 database/         # SQLite schema & offline sync engine
│   └── 📁 store/            # Zustand global stores & persistent storage
├── 📁 assets/               # Splash screen, app icons & fonts
└── 📄 app.json              # Expo configuration, bundle IDs & permissions
\`\`\`

## ✨ Feature Matrix

| Feature | iOS | Android | Offline Mode | Description |
| :--- | :---: | :---: | :---: | :--- |
| **Instant Biometrics** | ✅ FaceID | ✅ Fingerprint | ✅ Yes | Secure local key storage |
| **Delta Synchronization**| ✅ Active | ✅ Active | ✅ Yes | Auto-sync changes on reconnect |
| **Push Notifications** | ✅ APNs | ✅ FCM | ⚪ Online | Granular user alerts & updates |
| **Haptic Feedback** | ✅ Taptic | ✅ Vibration | ✅ Yes | Micro-tactile interactions |

## 🚀 Getting Started

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Start Expo local development server
npx expo start

# 3. Launch on iOS simulator (macOS required)
npx expo run:ios

# 4. Launch on Android emulator
npx expo run:android
\`\`\`

## ⚙️ Device Permissions

| Permission | iOS Key | Android Manifest | Usage Purpose |
| :--- | :--- | :--- | :--- |
| **Camera** | \`NSCameraUsageDescription\` | \`CAMERA\` | QR Code & document scanning |
| **Notifications** | User Alert Dialog | \`POST_NOTIFICATIONS\` | Real-time push updates |
| **Biometrics** | \`NSFaceIDUsageDescription\` | \`USE_BIOMETRIC\` | Fast passwordless login |

> [!TIP]
> Test offline persistence anytime by enabling Airplane Mode on your simulator device.
`
  }
]

export const getPresetById = (id) => {
  return PRESET_TEMPLATES.find((tpl) => tpl.id === id) || null
}

export default PRESET_TEMPLATES
