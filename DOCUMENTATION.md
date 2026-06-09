# Dasyl Documentation

## Introduction

**Dasyl** is a fast, opinionated CLI for creating, configuring, and releasing modern development projects in seconds. It aims to eliminate the repetitive "new project" chores that every developer faces.

## Architecture

Dasyl is built with Node.js and uses several key libraries:
- **Inquirer.js**: For interactive command-line prompts.
- **ShellJS**: For executing shell commands across different platforms.
- **Ora**: For elegant terminal spinners.
- **Chalk**: For colorful terminal output.
- **Semver**: For version comparison and update checking.

### Project Structure

```
dasyl/
├── bin/
│   └── index.js           # CLI Entry point
├── lib/
│   ├── node-generator.js      # Node.js scaffolding logic
│   ├── laravel-generator.js   # Laravel scaffolding logic
│   ├── mobile-generator.js    # Mobile (Expo) scaffolding logic
│   ├── frontend-generator.js  # Frontend (Vite) scaffolding logic
│   └── update-checker.js      # Version update check logic
├── docs/                      # Website documentation
└── package.json               # Project configuration
```

## Generators

### Node.js Generator (`node-generator.js`)
Supports both JavaScript and TypeScript. It sets up a production-ready Express API with:
- Security middleware (Helmet, CORS).
- Authentication boilerplate (JWT ready).
- MongoDB/Mongoose integration.
- ESLint and Prettier for code quality.
- Choice of folder structure: Basic or Modern Modules.

### Laravel Generator (`laravel-generator.js`)
Scaffolds a Laravel project with modern standards:
- **PHP-aware**: Detects local PHP version and installs the most compatible Laravel version (11, 12, or 13).
- **API Ready**: Automatically runs `php artisan install:api`.
- **Code Quality**: Integrates PHPStan, Larastan, and Laravel Pint.
- **Custom Commands**: Adds `php artisan run:test` for streamlined testing.

### Frontend Generator (`frontend-generator.js`)
Uses Vite to scaffold React, Vue, or Svelte projects.
- Includes optional Tailwind CSS integration.
- Pre-configured folder structure.

### Mobile Generator (`mobile-generator.js`)
Uses Expo to scaffold mobile applications.
- Integrated with Nativewind (Tailwind CSS for React Native).
- Pre-configured with Reanimated and Safe Area Context.

## CLI Commands

### Interactive Mode
Run `dasyl` without arguments to start the interactive wizard.

### Quick Shortcuts
- `dasyl react <name>`: Create a React app.
- `dasyl node <name>`: Create a Node.js API (JS).
- `dasyl node-ts <name>`: Create a Node.js API (TS).
- `dasyl laravel <name>`: Create a Laravel project.
- `dasyl mobile <name>`: Create an Expo mobile app.

### Options
- `--skip-install`: Skip `npm install` or `composer install`.
- `--skip-git`: Skip `git init`.
- `--skip-editor`: Don't open VS Code automatically.
- `-y`, `--yes`: Skip prompts and use defaults.
- `--dir <path>`: Specify a custom output directory.

## Automatic Updates

Dasyl includes a built-in update checker that notifies you when a new version is released on NPM. You can manage this behavior with:
- `dasyl --enable-auto-update`
- `dasyl --disable-auto-update`

## Contributing

We welcome contributions! Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to submit pull requests and report bugs.

## License

Dasyl is licensed under the [ISC License](LICENSE).
