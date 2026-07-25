# Dasyl: Vision 2030 (The 12-Layer Roadmap)

*This document serves as the 5-year North Star for the Dasyl Ecosystem. It outlines the strategic shift from a standalone scaffolding CLI to a comprehensive developer operating system.*

---

## The Paradigm Shift
Most developer tools are built as isolated features. **Dasyl is built as a platform.**

The goal is no longer to just generate code. The goal is to create an interconnected ecosystem where scaffolding (CLI), monitoring (Pulse), and intelligence (AI) all compound in value and feed into a unified Cloud architecture.

---

## Layer 1: The Ultimate Scaffolding Tool (CLI Core)
The CLI remains the core acquisition channel and entry point into the Dasyl ecosystem.
- **Framework Expansion:** Beyond React, Vue, and Laravel, Dasyl will natively support Next.js, Nuxt, Astro, Remix, Solid, Angular, NestJS, FastAPI, Django, Go Fiber, Go Gin, and Spring Boot.
- **Database Presets:** Seamless setup for PostgreSQL, MySQL, SQLite, Redis, Prisma, Drizzle, Supabase, and Firebase.
- **Authentication:** Turn-key setups for JWT, Passport, Clerk, Supabase Auth, NextAuth, Firebase Auth, Laravel Sanctum, and Laravel Passport.
- **Deployment & Testing:** Native commands for `dasyl deploy [target]` (Vercel, Railway, Render, Netlify, Docker) and automated scaffolding for Jest, Vitest, Playwright, Cypress, and Pest.
- **Composable Configurations:** `dasyl add` to chain tools (e.g., Next → Tailwind → Shadcn → ESLint → Prisma → Supabase).

## Layer 2: Pulse (Runtime Intelligence)
Pulse transcends basic network logging. It becomes an indispensable Developer / QA Runtime Intelligence extension.
- **The Dashboard:** Replaces generic speed tests with contextual metrics: Current Site, Requests, Slow Requests, Failed Requests, Average API Time, Largest Payload, and Connection Quality.
- **Request History:** Stores the last 100 requests with full export (cURL/HAR) and search capabilities.
- **Smart Warnings:** Real-time interception of 500s, CORS origin mismatches, slow APIs (>2.5s).
- **Performance Guards:** Warnings for massive JS bundles, oversized images, and infinite loop detection (e.g., identical API called 27 times).

## Layer 3: Dasyl AI (The "Senior Engineer")
Dasyl AI is deeply contextual, acting as an embedded senior engineer rather than a generic chatbot.
- **`dasyl doctor`:** Audits `package.json`, Docker, Git, node versions, and ports.
- **`dasyl explain`:** Paste an error, get the cause, fix, and exact terminal commands.
- **`dasyl architect`:** Takes a prompt ("Build Uber") and outputs scalable architectural diagrams and folder structures.
- **`dasyl optimize`:** Scans for duplicate dependencies, bundle bloat, and security vulnerabilities.

## Layer 4: Dasyl Cloud
The connective tissue of the ecosystem.
- Accounts, project histories, team sync, deployment analytics, and centralized template management.

## Layer 5: The Marketplace
A decentralized hub for scaffolding templates.
- Creators can publish community, premium, or agency-grade boilerplates.
- Users can run `dasyl create --template [creator]/[name]`.

## Layer 6: The Plugin SDK
Transitioning from a monolithic CLI to a plugin architecture.
- Behavior mimics `npm install`: `dasyl add prisma`, `dasyl add stripe`, `dasyl add docker`.

## Layer 7: Team & Enterprise Standards
- Shared organization templates, enforced coding standards, internal boilerplates, and private registries.

## Layer 8: Pulse + AI Integration
When a 500 Error is caught by Pulse, a single click passes the stack trace to Dasyl AI, which returns exact possible causes (e.g., Laravel CSRF mismatch, Expired Token, SQL timeout) and fix suggestions.

## Layer 9: CLI + Pulse Symbiosis
- Dasyl CLI recommends Pulse installation upon project creation.
- Pulse detects Dasyl-generated projects and enables framework-specific debugging helpers.

## Layer 10: VS Code Extension
The ultimate integration point. A unified Command Palette interface to create APIs, generate Dockerfiles, analyze folders, and review code—all without leaving the IDE.

## Layer 11: Dasyl Desktop Studio
A massive dashboard application combining project management, analytics, AI chat, monitoring, and deployments.

## Layer 12: Enterprise Scale
Private CLI registries, rigid company policies, shared components, and dedicated Dasyl instances.
