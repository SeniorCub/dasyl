# dásílẹ → dasyl

*From Dásílẹ̀ (to create / release)*

```
 ██████╗  █████╗ ███████╗██╗   ██╗██╗     
 ██╔══██╗██╔══██╗██╔════╝╚██╗ ██╔╝██║     
 ██║  ██║███████║███████╗ ╚████╔╝ ██║     
 ██║  ██║██╔══██║╚════██║  ╚██╔╝  ██║     
 ██████╔╝██║  ██║███████║   ██║   ███████╗
 ╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝
```

![npm](https://img.shields.io/npm/v/dasyl)
![downloads](https://img.shields.io/npm/dw/dasyl)
![license](https://img.shields.io/npm/l/dasyl)
![CI](https://github.com/SeniorCub/dasyl/actions/workflows/ci.yml/badge.svg)
![Publish](https://github.com/SeniorCub/dasyl/actions/workflows/publish.yml/badge.svg)
![Deploy](https://github.com/SeniorCub/dasyl/actions/workflows/deploy-cpanel.yml/badge.svg)

🌐 **Live site:** [dasyl.seniorcub.name.ng](https://dasyl.seniorcub.name.ng)

## Create. Configure. Release.

**Dasyl** is a fast, opinionated CLI for creating, configuring, and releasing modern development projects in seconds.

From web apps to APIs and full stacks, Dasyl removes repetitive setup so you can focus on building.

## ✨ Features

- 🚀 **Quick Scaffolding** - Create projects with a single command
- 📦 **Auto Installation** - Optionally install dependencies automatically
- 🔧 **Git Integration** - Initialize Git repo with first commit
- 💻 **IDE Support** - Open in VS Code automatically
- ⚡ **TypeScript Support** - Choose between JavaScript or TypeScript
- 🎯 **Shortcuts** - Fast commands for common project types

## Installation

```bash
npm install -g dasyl
```

## Usage

### Interactive Mode

Simply run `dasyl` to start the interactive project creator:

```bash
dasyl
```

### Quick Shortcuts

Create projects instantly with shortcuts:

```bash
# Create React app
dasyl react my-app

# Create Node.js Express API (JavaScript)
dasyl node my-api

# Scaffold into current empty folder
dasyl node ./

# Create Node.js Express API (TypeScript)
dasyl node-ts my-api

# Create Laravel project
dasyl laravel my-laravel-app
```

### Commands

- `dasyl` - Interactive project creator
- `dasyl <type> <name>` - Quick create with shortcuts
- `dasyl -h` or `dasyl --help` - Show help
- `dasyl -v` or `dasyl --version` - Show version

### Available Project Types

#### Frontend
- **React/Vue/Svelte** - Modern frontend frameworks via Vite

#### Backend
- **Node.js Express** - REST API boilerplate with JavaScript
- **Node.js Express (TypeScript)** - REST API boilerplate with TypeScript
#### Laravel
- **PHP Framework** for modern web applications
- ✅ **API Scaffolding** - Automatically runs `php artisan install:api`
- ✅ **Static Analysis** - Integrated **PHPStan** and **Larastan**
- ✅ **Code Styling** - Integrated **Laravel Pint**
- ✅ **Custom Test Command** - Includes `php artisan run:test` out of the box

### Node.js Project Features

When creating a Node.js project, you get:

- ✅ Express.js setup with middleware
- ✅ **Code Quality** - Integrated **ESLint** and **Prettier**
- ✅ **Linting Scripts** - `npm run lint`, `npm run lint:fix`, and `npm run format`
- ✅ MongoDB integration ready
- ✅ Environment configuration (.env)
- ✅ Error handling middleware
- ✅ Authentication routes boilerplate
- ✅ User model with validation
- ✅ Organized folder structure
- ✅ Structure choice: basic or modern modules
- ✅ TypeScript support (optional)

### Laravel Project Features

When creating a Laravel project, you get:

- ✅ **Full API Setup** - Ready-to-go API scaffolding
- ✅ **Code Quality** - Pre-configured **PHPStan** (level 5)
- ✅ **Auto-Formatting** - Pre-configured **Laravel Pint**
- ✅ **run:test Command** - A single command to run analysis and styling:
  ```bash
  php artisan run:test
  ```

### Post-Creation Options
After scaffolding, Dasyl can:
- 📦 Install dependencies automatically
- 🔧 Initialize Git repository with initial commit
- 💻 Open project in VS Code

## Examples

### Create a TypeScript API

```bash
dasyl node-ts my-api
# Automatically creates src/ folder with TypeScript configs
```

### Create a React App

```bash
dasyl react my-react-app
# Uses Vite for fast development
```

### Interactive Mode with Full Control

```bash
dasyl
# Follow prompts to:
# - Choose project type
# - Select language (JS/TS for Node.js)
# - Select Node.js folder structure (basic/modern)
# - Auto-install dependencies
# - Initialize Git
# - Open in VS Code
```

### Choose a Node.js Structure from CLI

```bash
dasyl node my-api --structure modern
dasyl node-ts my-api --structure basic
```

## Project Structure (Node.js)

### JavaScript
```
my-api/
├── bin/
├── config/
│   ├── database.js
│   ├── middleware.js
│   └── routes.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── security.js
├── models/
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
├── utils/
├── public/
├── uploads/
├── .env
├── .gitignore
├── package.json
└── server.js
```

### TypeScript
```
my-api/
├── src/
│   ├── bin/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.ts
├── dist/           # Compiled output
├── public/
├── uploads/
├── .env
├── .gitignore
├── tsconfig.json
└── package.json
```

## Versioning

This project uses [Semantic Versioning](https://semver.org/).

## Contributing

Contributions are welcome! Please see the [contributing guidelines](CONTRIBUTING.md) for more information.

## About the Creator

**Dasyl** was created by **Farinde Reuben Ifeoluwa** ([@SeniorCub](https://github.com/SeniorCub)).

- 🐙 GitHub: [github.com/SeniorCub](https://github.com/SeniorCub)
- 🌐 Website: [dasyl.seniorcub.name.ng](https://dasyl.seniorcub.name.ng)

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
