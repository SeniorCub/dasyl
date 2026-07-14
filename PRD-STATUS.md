# Dasyl - Project Requirements & Status Document (PRD)

## 1. Project Overview
**Dasyl** is a fast, opinionated CLI tool designed for rapidly scaffolding modern development projects. It automates repetitive setup tasks, configuring everything from frameworks to linters, database connections, and Git initialization, allowing developers to instantly start building.

### Core Architecture
The repository consists of three distinct components:
1. **The CLI Application (`lib/`, `bin/`)**
   - The core Node.js application distributed via NPM.
   - Provides scaffolding logic for React, Node.js (JS/TS), Laravel, and Expo Mobile apps.
   - Features built-in telemetry to anonymously track usage stats.
2. **The Frontend Website (`docs/`)**
   - A modern landing page built with React & Vite.
   - Serves as the documentation hub and marketing page.
   - Displays a dynamic usage leaderboard fetching data from the backend.
   - **Deployment:** Automatically deployed to Go54 cPanel via GitHub Actions (`deploy-cpanel.yml`).
3. **The Backend API (`server/`)**
   - An Express.js & MongoDB REST API.
   - Handles telemetry events sent by the CLI tool (tracking usage).
   - Serves the leaderboard endpoint to the frontend website.
   - **Deployment:** Automatically deployed as Serverless Functions to Vercel.

---

## 2. Recent Infrastructure & Deployment Fixes

During the most recent work sessions, we fully resolved a cascade of deployment and CI issues across both Vercel (backend) and Go54 (frontend). 

### Backend (Vercel) Stabilization
* **Express Preset Compatibility:** Vercel was throwing `No entrypoint found` and `500 FUNCTION_INVOCATION_FAILED` errors. We fixed this by correctly structuring the entrypoint (`server/index.js`) to satisfy Vercel's implicit Express framework preset, avoiding buggy configuration overrides.
* **ESM / CommonJS Crash:** The Vercel runtime repeatedly crashed with `ERR_REQUIRE_ESM`. This was caused by the CLI backend upgrading to `uuid` v14, which dropped `require()` support. We downgraded the backend to `uuid@11` (the LTS CommonJS version) to restore stability.
* **Database Resiliency:** The database connection strings were falling back to `localhost` causing 500 errors. We patched `server/index.js` to look for both `MONGO_URI` and `MONGODB_URI` environment variables to perfectly match your Vercel secrets configuration.
* **CORS Security:** Locked down the Express server's CORS policy to exclusively allow traffic from `https://dasyl.seniorcub.name.ng` (and local dev ports), securing the telemetry and leaderboard endpoints.

### Frontend (Go54) & GitHub Actions
* **Node.js Environment Upgrades:** Both the core CI pipeline (`ci.yml`) and the cPanel deployment pipeline (`deploy-cpanel.yml`) were failing with a `node:util` `styleText` syntax error. This happened because Vite 6 (used in the React frontend) strictly requires Node.js v20+, but the workflows were running Node v18. We upgraded the GitHub Actions matrix to explicitly use Node 20.x and 22.x, completely fixing the FTP upload failures.
* **NPM Publishing & Security:** Navigated NPM's strict new 2FA policies. Because the account uses a WebAuthn security key (which fails in CLI without browser prompts), we successfully bypassed the 403/404 publishing errors by transitioning to a web-generated **Granular Access Token (GAT)**.

---

## 3. Current Project State

- ✅ **CLI Tool:** Stable and published on NPM (`v1.11.1`). 
- ✅ **Frontend Website:** Successfully built with Vite, connected to the Vercel backend, and deploying via GitHub Actions to Go54 cPanel (`dasyl.seniorcub.name.ng`).
- ✅ **Backend API:** Successfully running serverlessly on Vercel (`dasyl-ten.vercel.app`), communicating with MongoDB Atlas, and securely providing telemetry and leaderboard routes.

## 4. Next Steps & Roadmap
Looking forward, development can safely shift back from DevOps/Infrastructure to core feature work:
1. Expand CLI scaffolding templates (e.g., Next.js, Nuxt).
2. Enhance the Frontend Leaderboard UI (e.g., adding user avatars or more advanced paginations).
3. Continue monitoring the Vercel and GitHub Actions logs for seamless continuous delivery.
