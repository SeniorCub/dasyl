# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.11.0] - 2026-06-09

### Added
- **PHP-aware Laravel Scaffolding**: Dasyl now detects the local PHP version and automatically selects the most compatible modern Laravel version (Laravel 11, 12, or 13).
- **Composer Security Audit Handling**: Improved error handling for Composer security advisories with friendly suggestions and recommended actions.
- **Improved Version Mapping**:
    - PHP 8.3+ -> Laravel 13
    - PHP 8.2 -> Laravel 12
    - PHP 8.1 -> Laravel 11

## [1.10.0] - 2026-05-13

### Added
- **Database Templates (Partial)**: Initial work on database selection during setup.
- **MongoDB Integration (Enhanced)**: Added Mongoose schemas, connection retry logic, and index setup for Node.js projects.

## [1.9.0] - 2026-05-13

### Added
- **Mobile Support**: Added support for scaffolding mobile applications using Expo.
- **Nativewind Integration**: Integrated Nativewind for Tailwind CSS support in React Native.
- **Mobile Quick Shortcut**: Added `dasyl mobile <name>` shortcut.
- **Pre-configured Mobile Libraries**: Includes Reanimated, Safe Area Context, Babel, and Metro configs for Expo.

## [1.8.0] - 2026-05-13

### Added
- **Laravel Static Analysis**: Integrated PHPStan and Larastan into Laravel projects.
- **Laravel Code Styling**: Integrated Laravel Pint for automatic code formatting.
- **Custom Laravel Command**: Added `php artisan run:test` for one-step quality checks.
- **Node.js Linting & Formatting**: Integrated ESLint and Prettier into Node.js (JS/TS) templates.
- **Node.js Utility Scripts**: Added `npm run lint`, `npm run lint:fix`, and `npm run format`.

### Fixed
- **Laravel API Scaffolding**: Fixed issue where API routes were not properly initialized.
- **Async Flow**: Fixed missing `await` statements in the CLI entry point.

## [1.7.0] - 2026-05-12

### Added
- **Tailwind CSS Support**: Added optional Tailwind CSS integration for React/Vue/Svelte projects.
- **GitHub Actions Optimization**: Improved CI/CD workflows.

### Changed
- **Package Sanitization**: Improved fallback for package name sanitization.

## [1.6.0] - 2026-03-13

### Added
- **Auto-Update System**: Automatic version detection and update notification.
- **User Preference Management**: Commands to enable/disable auto-updates (`--enable-auto-update`, `--disable-auto-update`).
- **Cross-platform Config Storage**: User settings now stored in `~/.dasyl/` or `AppData/Local/dasyl`.

## [1.5.4] - 2026-03-13

### Added
- **Developer Experience Tools**:
    - `.editorconfig` generation.
    - `.prettierrc` setup.
    - `.eslintrc` configuration.
    - Husky pre-commit hooks integration.
    - lint-staged integration.
    - VS Code workspace settings.

## [1.5.3] - 2026-03-13

### Added
- **Update Checker**: Notifies users when a new version is available.
- **Better Validation**: Enhanced project name validation with detailed feedback.
- **Progress Indicators**: Added ora spinners for visual feedback during long operations.

## [1.5.2] - 2026-03-13

### Added
- **Command Line Flags**:
    - `--skip-install`: Skip dependency installation.
    - `--skip-git`: Skip Git initialization.
    - `--skip-editor`: Skip opening in VS Code.
    - `-y/--yes`: Accept all defaults.
    - `--dir <path>`: Custom output directory.

## [1.4.0] - 2026-02-10

### Added
- **Node.js Express Boilerplate**: Comprehensive template for Node.js APIs.
- **TypeScript Support**: Added TypeScript option for Node.js projects.
- **Laravel Support**: Initial Laravel project scaffolding.
- **Vite Integration**: Added React/Vue/Svelte via Vite.

## [1.0.0] - 2026-01-15

### Added
- **Interactive CLI**: Initial release with interactive prompts.
- **Quick Shortcuts**: Fast commands for common project types.
- **Git & VS Code Integration**: Automatic Git initialization and opening in editor.
- **Auto Dependency Installation**: Option to install packages automatically.
