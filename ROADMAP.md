# Dasyl Roadmap

**Last Updated:** May 13, 2026  
**Current Version:** 1.8.1

This document outlines the planned features and enhancements for Dasyl CLI. The roadmap is subject to change based on community feedback and priorities.

---

## Version 1.6.0 - Enhanced Backend Options

**Target Release:** Q2 2026

### New Backend Frameworks

- **Django Support** - Python web framework with admin panel
  - Full project structure with apps
  - Settings configuration
  - SQLite/PostgreSQL setup
  - Admin interface setup
  
- **FastAPI Support** - Modern Python API framework
  - Async API structure
  - Automatic API documentation (Swagger/ReDoc)
  - Pydantic models
  - CORS middleware setup
  
- **NestJS Support** - TypeScript Node.js framework
  - Modular architecture
  - Decorators-based routing
  - TypeORM integration
  - Authentication guards
  
- **Go Fiber/Gin Support** - Golang web frameworks
  - High-performance API setup
  - Middleware configuration
  - Environment setup
  - Project structure

---

## Version 1.7.0 - Frontend Enhancements

**Target Release:** Q3 2026

### Modern Frontend Frameworks

- **Next.js** - Dedicated template (beyond Vite)
  - App Router structure (Next.js 14+)
  - API routes setup
  - TypeScript configuration
  - Image optimization
  - Font optimization
  
- **Nuxt.js** - Vue.js meta-framework
  - Pages directory structure
  - Auto-imports
  - Server routes
  - Nitro engine setup
  
- **SvelteKit** - Svelte application framework
  - File-based routing
  - Server-side rendering
  - API endpoints
  - TypeScript support
  
- **Astro** - Content-focused sites
  - Component islands
  - MDX support
  - Static site generation
  - Multi-framework support

### Styling Options

- **TailwindCSS Integration**
  - Auto-install and configure
  - PostCSS setup
  - Config file with theme
  - Example components
  
- **Shadcn UI Integration**
  - Component library setup
  - Theme configuration
  - CLI integration
  - Sample page with components

---

## Version 1.8.0 - Code Quality & Testing (COMPLETED)

**Released:** May 13, 2026

### Laravel Integration
- [v] **Laravel Scaffolding Fixes** - Fixed API scaffolding setup using `php artisan install:api`.
- [v] **Static Analysis** - Integrated **PHPStan** and **Larastan** into the Laravel generator.
- [v] **Code Styling** - Integrated **Laravel Pint** for automatic code formatting.
- [v] **Custom Command** - Added `php artisan run:test` command to run analysis and styling in one go.

### Node.js Integration
- [v] **Linting & Formatting** - Integrated **ESLint** and **Prettier** into both JavaScript and TypeScript Node.js generators.
- [v] **Utility Scripts** - Added `npm run lint`, `npm run lint:fix`, and `npm run format` scripts to `package.json`.

### General Improvements
- [v] **Async Flow Fixes** - Fixed missing `await` statements in the main CLI entry point.
- [v] **Website Overhaul** - Updated the project website with a new theme (Primary: #ff2200) and documentation for new features.

---

## Version 1.9.0 - Mobile Support (COMPLETED)

**Released:** May 13, 2026

### Mobile Stack
- [v] **Expo Integration** - Added support for scaffolding mobile applications using Expo.
- [v] **Nativewind Setup** - Integrated **Nativewind** for Tailwind CSS support in React Native.
- [v] **Reanimated & Safe Area** - Pre-installed and configured essential mobile libraries.
- [v] **Babel & Metro Config** - Automatic configuration of Babel and Metro for Nativewind support.
- [v] **Quick Shortcut** - Added `dasyl mobile <name>` shortcut for instant mobile project creation.

---

## Version 1.10.0 - Database Templates

**Target Release:** Q4 2026

### Database Selection During Setup

Add interactive database choice with full configuration:

- **PostgreSQL**
  - Prisma ORM integration
  - TypeORM integration option
  - Connection pool setup
  - Migration scripts
  
- **MySQL**
  - Sequelize integration
  - TypeORM support
  - Connection configuration
  - Schema setup
  
- **MongoDB** (Enhanced)
  - Mongoose schemas
  - Connection retry logic
  - Indexes setup
  - Aggregation examples
  
- **SQLite**
  - Local development setup
  - Better-sqlite3 integration
  - Migration support
  
- **Supabase Integration**
  - Client setup
  - Authentication ready
  - Real-time subscriptions
  - Storage configuration

### Features

- Auto-generate database config files
- Environment variable templates
- Migration system setup
- Seeder files
- Database connection testing

---

## Version 1.10.0 - Authentication Boilerplate

**Target Release:** Q1 2027

### Complete Authentication Templates

- **JWT Authentication**
  - Login/Register endpoints
  - Token generation & refresh
  - Password hashing (bcrypt)
  - Protected routes middleware
  - Email verification
  - Password reset flow
  
- **OAuth2 Integration**
  - Google authentication
  - GitHub authentication
  - Facebook authentication
  - OAuth2 flow implementation
  
- **Passport.js Integration**
  - Local strategy
  - JWT strategy
  - Social strategies
  - Session management
  
- **NextAuth.js** (for Next.js projects)
  - Credentials provider
  - OAuth providers
  - Database adapter
  - Session handling
  
- **Session-based Auth**
  - Express-session setup
  - Redis integration
  - Cookie configuration
  - CSRF protection

---

## Version 2.0.0 - Mobile & Desktop

**Target Release:** Q2 2027

### Cross-Platform Development

- **React Native Support (Expo)**
  - Expo managed workflow
  - Navigation setup (React Navigation)
  - TypeScript configuration
  - Component structure
  - Expo Router option
  
- **Flutter Support**
  - Material Design setup
  - State management (Provider/Riverpod)
  - Project structure
  - API service layer
  
- **Electron Support**
  - Main/Renderer process setup
  - IPC communication
  - Auto-updater configuration
  - Build scripts (electron-builder)
  
- **Tauri Support**
  - Rust backend setup
  - Frontend integration
  - System tray
  - Native APIs

---

## Version 2.1.0 - DevOps Ready

**Target Release:** Q3 2027

### Containerization & CI/CD

- **Docker Setup**
  - Multi-stage Dockerfile
  - docker-compose.yml for services
  - .dockerignore optimization
  - Development vs Production configs
  - Database container setup
  
- **GitHub Actions Templates**
  - CI pipeline (test, lint, build)
  - CD pipeline (deploy)
  - Environment-based deployments
  - Automated testing
  - Security scanning
  
- **Deployment Configurations**
  - Vercel config (vercel.json)
  - Netlify config (netlify.toml)
  - Render config (render.yaml)
  - Railway config
  - AWS Elastic Beanstalk
  - Digital Ocean App Platform
  
- **Kubernetes Support**
  - Basic K8s manifests
  - Deployment, Service, Ingress
  - ConfigMaps and Secrets
  - Helm charts option

---

## Version 2.2.0 - Testing Setup

**Target Release:** Q4 2027

### Testing Frameworks Integration

- **JavaScript/TypeScript**
  - Jest configuration
  - Vitest (for Vite projects)
  - React Testing Library
  - Supertest (API testing)
  - Sample test files
  - Coverage reporting
  
- **Python**
  - Pytest setup
  - Unit test examples
  - Integration tests
  - Mock configurations
  
- **Go**
  - Standard testing package
  - Testify library
  - Mock generation
  - Benchmark tests

### Testing Features

- E2E testing setup (Playwright/Cypress)
- Component testing
- API endpoint tests
- Test scripts in package.json
- CI integration
- Code coverage badges

---

## Version 2.3.0 - Monitoring & Logging

**Target Release:** Q1 2028

### Production-Ready Observability

- **Logging Systems**
  - Winston setup (Node.js)
  - Pino (high-performance logging)
  - Log rotation
  - Log levels configuration
  - Structured logging
  
- **Error Tracking**
  - Sentry integration
  - Error boundary setup (React)
  - Source maps configuration
  - Release tracking
  
- **Performance Monitoring**
  - Application Performance Monitoring (APM)
  - Request/Response logging
  - Slow query detection
  - Memory leak detection
  
- **Health Checks**
  - /health endpoint
  - /metrics endpoint (Prometheus format)
  - Database health check
  - External services check
  
- **API Documentation**
  - Swagger/OpenAPI auto-generation
  - Postman collection export
  - API versioning
  - Interactive docs UI

---

## Version 2.4.0 - Full Stack Templates

**Target Release:** Q2 2028

### Complete Stack Configurations

- **MERN Stack**
  - MongoDB + Express + React + Node
  - Monorepo structure (Turborepo/Nx)
  - Shared types between frontend/backend
  - Authentication flow
  - Sample CRUD operations
  
- **PERN Stack**
  - PostgreSQL + Express + React + Node
  - Prisma ORM
  - Type-safe API
  - Migration system
  
- **T3 Stack**
  - Next.js + tRPC + Prisma + Tailwind
  - Type-safe end-to-end
  - NextAuth integration
  - Zod validation
  
- **JAMstack**
  - Next.js/Gatsby
  - Headless CMS integration (Contentful/Strapi)
  - Incremental Static Regeneration
  - Edge functions
  
- **Serverless Stack**
  - AWS Lambda functions
  - API Gateway setup
  - DynamoDB integration
  - Infrastructure as Code (Terraform/CloudFormation)

---

## Quick Wins (Minor Versions)

### Version 1.5.2 - Command Line Flags - COMPLETED

**Released:** March 13, 2026

- [v] `--skip-install` - Skip dependency installation
- [v] `--skip-git` - Skip Git initialization
- [v] `--skip-editor` - Skip opening in VS Code
- [v] `--yes` or `-y` - Accept all defaults
- [v] `--dir <path>` - Custom directory

### Version 1.5.3 - Developer Experience - COMPLETED

**Released:** March 13, 2026

- [v] **Update Checker** - Notify when new version available
- [v] **Better Validation** - Enhanced project name validation
- [v] **Improved Error Messages** - More helpful error descriptions
- [v] **Progress Indicators** - Better visual feedback with ora spinners

### Version 1.5.4 - Code Quality Tools - COMPLETED

**Released:** March 13, 2026

- [v] **.editorconfig** generation
- [v] **.prettierrc** setup with auto-format
- [v] **.eslintrc** configuration
- [v] **Husky** pre-commit hooks
- [v] **lint-staged** integration
- [v] **VS Code workspace settings**

### Version 1.6.0 - Auto-Update System - COMPLETED

**Released:** March 13, 2026

- [v] **Auto-Update Functionality** - Automatic version detection and update
- [v] **User Preference Management** - Enable/disable auto-updates
- [v] **Cross-platform Config Storage** - ~/.dasyl/ or AppData/Local/dasyl
- [v] **Smart Update Frequency** - Daily notifications
- [v] **Windows Compatibility** - Better npm command detection

### Version 1.7.0 - Scaffolding Improvements - COMPLETED

**Released:** May 12, 2026

- [v] **Laravel Scaffold Fixes** - Automatically install API routes
- [v] **Package Sanitization** - Better fallback for package name sanitization
- [v] **Improved Project Scaffolding** - General enhancements and bug fixes
- [v] **GitHub Actions Optimization** - Improved CI/CD workflows

---

## Version 1.8.0 - Enhanced Backend Options


### High Priority (Next 3 Releases)

1. **Next.js & NestJS Support** (v1.6.0)
   - Most requested frameworks
   - Large community demand
   - Industry standard
   
2. **TailwindCSS Integration** (v1.7.0)
   - Most popular CSS framework
   - Quick to implement
   - High user value
   
3. **Command Line Flags** (v1.5.2)
   - Improves flexibility
   - Easy to implement
   - Better automation support

### Medium Priority (Q3-Q4 2026)

4. **Database Selection** (v1.8.0)
   - Makes templates production-ready
   - Essential for real projects
   
5. **Docker Setup** (v2.1.0)
   - Modern deployment standard
   - DevOps essential
   
6. **Testing Setup** (v2.2.0)
   - Professional development need
   - Quality assurance

### Long Term (2027+)

7. **Authentication Templates** (v1.9.0)
8. **Mobile & Desktop Support** (v2.0.0)
9. **Full Stack Templates** (v2.4.0)
10. **Monitoring & Logging** (v2.3.0)

---

## Suggestion Box

### Community Features

- **Templates Gallery Website**
  - Browse templates visually
  - Search and filter
  - Live previews
  - Template ratings
  
- **Project Migration Tool**
  - Upgrade existing projects
  - Add new features to old projects
  - Framework migration assistance
  
- **Plugin System**
  - Community can add project types
  - Extend functionality
  - NPM package plugins

### Educational Features

- **Interactive Tutorials**
  - Post-creation walkthroughs
  - Step-by-step guides
  - Best practices
  
- **Code Examples**
  - Sample implementations
  - Common patterns
  - API integrations

### Analytics & Insights

- **Telemetry** (Anonymous, Opt-in)
  - Popular stack combinations
  - Usage patterns
  - Feature requests
  
- **Project Statistics**
  - Show popular choices
  - Trending templates
  - Community insights

### Cloud Integration

- **One-Command Deployment**
  - Deploy to cloud providers
  - Automated CI/CD setup
  - Domain configuration
  
- **Environment Management**
  - Manage environment variables
  - Multiple environments
  - Secrets management

### AI Features

- **AI Assistant**
  - Project recommendations
  - Best practices suggestions
  - Code generation helpers
  
- **Smart Templates**
  - Learn from project requirements
  - Suggest optimal stack
  - Auto-configure based on needs

---

## Contributing to the Roadmap

We welcome community input! Here's how you can contribute:

1. **Feature Requests** - Open an issue on GitHub
2. **Priority Feedback** - Vote on existing issues
3. **Implementation** - Submit PRs for roadmap items
4. **Templates** - Share your custom templates

### How to Request a Feature

1. Check if feature exists in roadmap
2. Open GitHub issue with label `feature-request`
3. Describe use case and benefits
4. Community can vote with +1 reactions

---

## Links

- **GitHub Repository:** [https://github.com/SeniorCub/dasyl](https://github.com/SeniorCub/dasyl)
- **NPM Package:** [https://www.npmjs.com/package/dasyl](https://www.npmjs.com/package/dasyl)
- **Issue Tracker:** [https://github.com/SeniorCub/dasyl/issues](https://github.com/SeniorCub/dasyl/issues)
- **Discussions:** [https://github.com/SeniorCub/dasyl/discussions](https://github.com/SeniorCub/dasyl/discussions)

---

## Release Cycle

- **Major Versions** (X.0.0) - Every 6-12 months, breaking changes
- **Minor Versions** (1.X.0) - Every 2-3 months, new features
- **Patch Versions** (1.5.X) - As needed, bug fixes and small improvements

---

## Completed Features

### Version 1.5.3 (March 2026)
- [v] Update checker - Notifies when new version available
- [v] Enhanced project name validation with detailed feedback
- [v] Improved error messages with helpful suggestions
- [v] Better progress indicators with ora spinners
- [v] Validation for reserved names and npm limitations

### Version 1.5.2 (March 2026)
- [v] Command line flags support
- [v] `--skip-install` flag to skip dependency installation
- [v] `--skip-git` flag to skip Git initialization
- [v] `--skip-editor` flag to skip opening in VS Code
- [v] `-y/--yes` flag to accept all defaults
- [v] `--dir <path>` flag for custom directory

### Version 1.5.1 (March 2026)
- [v] Windows compatibility fix with try-catch blocks

### Version 1.5.0 (March 2026)
- [v] Colorful UI with chalk
- [v] Operation cancellation handling
- [v] Enhanced user experience

### Version 1.4.0 (February 2026)
- [v] Node.js Express boilerplate
- [v] TypeScript support
- [v] Laravel integration
- [v] React/Vue/Svelte via Vite

### Version 1.0.0 (January 2026)
- [v] Interactive CLI
- [v] Quick shortcuts
- [v] Git integration
- [v] VS Code integration
- [v] Auto dependency installation

---

**Note:** This roadmap is a living document and will be updated as priorities shift and new ideas emerge. Star the repository to stay updated!
