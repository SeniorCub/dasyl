# Dasyl Ecosystem

```
     _                 _ 
    | |               | |
  __| | __ _ ___ _   _| |
 / _' |/ _' / __| | | | |
| (_| | (_| \__ \ |_| | |_
 \__,_|\__,_|___/\__, |_ _|
                  __/ |  
                 |___/   
```

![npm](https://img.shields.io/npm/v/dasyl)
![downloads](https://img.shields.io/npm/dw/dasyl)
![license](https://img.shields.io/npm/l/dasyl)
![CI](https://github.com/SeniorCub/dasyl/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/SeniorCub/dasyl/actions/workflows/deploy-cpanel.yml/badge.svg)

**Live site:** [dasyl.seniorcub.name.ng](https://dasyl.seniorcub.name.ng)

---

## Create. Configure. Release.

**Dasyl** is shifting from a simple CLI into a full **API-first Developer SaaS Ecosystem**. 

From web apps to APIs and full stacks, Dasyl removes repetitive setup so you can focus on building, while instantly providing runtime intelligence and deployment tracking.

---

## 🏗️ The API-First Architecture (Phase 1 Focus)

Since we are moving to an API-first architecture, the repository is split into three main clients that all authenticate against a single unified backend. 

### 1. The Backend (`/server`)
This is the Vercel-deployed Serverless Express API. It is the "brain" of the ecosystem.
```text
server/
├── index.js          # The Express entry point (Routes for Auth, Telemetry, Leaderboard)
├── models/           # MongoDB Mongoose schemas (User.js)
└── package.json      # Backend dependencies (uuid, express, mongoose, etc.)
```
**Current Focus:** Building out `models/User.js`, setting up JWT authentication, and creating endpoints like `/api/auth/login` and `/api/auth/me`.

### 2. The CLI Client (`/bin` & `/lib`)
This is the NPM package codebase that runs on the developer's local machine.
```text
bin/
└── index.js          # The entry point that parses commands (dasyl login, dasyl create)

lib/
├── telemetry.js      # Sends usage data to the backend
├── frontend-generator.js # Scaffolds React/Vue
└── ...               # Other generators
```
**Current Focus:** Updating `bin/index.js` to support new commands (`dasyl login`, `dasyl whoami`) and writing logic to save their API token to `~/.dasyl/config.json`. Updating `telemetry.js` to send their API token in the `Authorization` header so the backend can track usage.

### 3. The Web Dashboard (`/docs`)
This is the Vite/React frontend deployed to cPanel (soon to be the SaaS Dashboard).
```text
docs/
├── index.html        
├── vite.config.js    
└── src/              # React components, pages, and styles
```
**Current Focus:** Adding a Login/Register page and a user Dashboard view where developers can generate their CLI API token and track their "Builds this month".

### 4. Dasyl Pulse (`/pulse`)
The Chrome Extension providing Developer / QA Runtime Intelligence.
```text
pulse/
├── background/       # Service worker (Tracks per-tab state)
├── content/          # inject.js and content.js (Intercepts fetch/xhr)
└── popup/            # HTML/JS for the dashboard UI
```
*Pulse silently monitors page requests to detect failures, analyze latency, and flag performance issues.*

---

## 🚀 CLI Installation & Usage

```bash
npm install -g dasyl
```

### Interactive Mode
Simply run `dasyl` to start the interactive project creator:
```bash
dasyl
```

### Quick Shortcuts
Create projects instantly with shortcuts:
```bash
dasyl react my-app            # Create React app
dasyl node my-api             # Create Node.js Express API (JavaScript)
dasyl node-ts my-api          # Create Node.js Express API (TypeScript)
dasyl laravel my-laravel-app  # Create Laravel project
dasyl mobile my-mobile-app    # Create Expo Mobile app
```

*(Note: Advanced CLI auth commands like `dasyl login`, `dasyl whoami`, and `dasyl plan` are currently under development in Phase 1).*
