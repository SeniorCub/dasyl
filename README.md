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
![build](https://img.shields.io/badge/status-active-brightgreen)

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
- **Laravel** - PHP framework for web applications

### Node.js Project Features

When creating a Node.js project, you get:

- ✅ Express.js setup with middleware
- ✅ MongoDB integration ready
- ✅ Environment configuration (.env)
- ✅ Error handling middleware
- ✅ Authentication routes boilerplate
- ✅ User model with validation
- ✅ Organized folder structure
- ✅ TypeScript support (optional)

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
# - Auto-install dependencies
# - Initialize Git
# - Open in VS Code
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

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
