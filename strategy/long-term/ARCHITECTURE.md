# Dasyl: Technical Architecture (Platform Overview)

*This document defines the high-level architecture of the Dasyl Ecosystem, detailing how the distinct components communicate and compound value.*

---

## The Dasyl Ecosystem Platform

```
                    DASYL CLOUD (The Hub)
          ┌───────────────────────────────────────┐
          │  • Central Template Registry          │
          │  • Deployment & Usage Analytics       │
          │  • User Authentication (Sync)         │
          │  • Plugin Marketplace                 │
          └──────────────────┬────────────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
      Dasyl CLI        Dasyl Pulse       Dasyl AI
   (Scaffolding)      (Monitoring)    (Intelligence)
            │                │                │
            └───────────────┬┴────────────────┘
                            │
                            ▼
              Project Shared Context (Local)
            (`dasyl.json` / `.dasyl` directory)
```

## Component Definitions

### 1. Dasyl CLI (The Engine)
- **Role:** The foundational scaffolding and configuration engine.
- **Tech Stack:** Node.js, Commander.js, Inquirer, Vite.
- **Architecture:** 
  - Monolithic today, but shifting to a **Plugin SDK architecture**.
  - Standard commands: `create`, `add`, `deploy`.
  - Maintains local state via a standard `dasyl.json` configuration file at the root of generated projects.

### 2. Dasyl Pulse (Runtime Intelligence)
- **Role:** A browser extension acting as the developer's runtime monitoring dashboard.
- **Tech Stack:** React (Vite), Chrome WebRequest API, PerformanceObserver API.
- **Architecture:**
  - Background Service Worker intercepts and parses XHR/Fetch requests.
  - Injects a Content Script to evaluate DOM performance metrics (LCP, JS Bundle execution times).
  - Detects `dasyl.json` or Dasyl-specific footprints on the current page to enable deep-framework specific debugging.

### 3. Dasyl AI (Embedded Intelligence)
- **Role:** An AI assistant integrated directly into the CLI and Pulse.
- **Tech Stack:** LLM integrations (OpenAI/Anthropic APIs) proxied through Dasyl Cloud.
- **Architecture:**
  - Passes local project context (package.json, tree structure, error stacks) securely to the cloud.
  - Provides actionable CLI commands and architectural patterns instead of chat.

### 4. Dasyl Cloud (The Connective Tissue)
- **Role:** The centralized backend infrastructure orchestrating the ecosystem.
- **Tech Stack:** Node.js, Express, MongoDB Atlas, Serverless (Vercel).
- **Architecture:**
  - **Telemetry API:** Ingests scaffolding metrics securely.
  - **Registry API:** Serves the marketplace templates and plugins to the CLI.
  - **Authentication API:** Allows users to log in (`dasyl login`) to sync their templates and configurations across devices.

## The `dasyl.json` Contract

The most important architectural shift is the introduction of the `dasyl.json` file in every scaffolded project. This file acts as the local context bridge between the CLI, Pulse, and AI.

**Example Contract:**
```json
{
  "version": "2.0.0",
  "project": "my-api",
  "type": "node-ts",
  "plugins": [
    "@dasyl/plugin-prisma",
    "@dasyl/plugin-jest"
  ],
  "pulse_id": "abc-123",
  "deployment": {
    "provider": "vercel"
  }
}
```

- **When Pulse opens**, it reads the `pulse_id` and tailors debugging rules to a Node/TS project.
- **When Dasyl AI is invoked**, it reads `dasyl.json` to immediately know the stack.
- **When Dasyl Cloud is pinged**, it authenticates the project telemetry.
