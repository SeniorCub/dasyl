#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import shell from 'shelljs';
import { generateNodeProject } from '../lib/node-generator.js';
import { checkForUpdates, handleAutoUpdateSetting } from '../lib/update-checker.js';
import { spawn } from 'child_process';
import fs from 'fs';
import ora from 'ora';

// Enable keypress events for better Ctrl+C handling
process.stdin.setRawMode && process.stdin.setRawMode(false);
if (process.stdin.isTTY) {
  process.stdin.setEncoding('utf8');
}

// Helper function to find npm command on different platforms
function getNpmCommand() {
  if (process.platform === 'win32') {
    // On Windows, try npm.cmd first, then npm
    if (shell.which('npm.cmd')) {
      return 'npm.cmd';
    } else if (shell.which('npm')) {
      return 'npm';
    } else {
      throw new Error('npm not found. Please ensure Node.js and npm are installed and in your PATH.');
    }
  } else {
    // On Unix-like systems
    if (shell.which('npm')) {
      return 'npm';
    } else {
      throw new Error('npm not found. Please ensure Node.js and npm are installed and in your PATH.');
    }
  }
}

// Helper function to spawn npm with proper Windows handling
async function spawnNpm(args, options = {}) {
  const npmCommand = getNpmCommand();
  
  return new Promise((resolve, reject) => {
    const child = spawn(npmCommand, args, { 
      stdio: 'inherit', 
      shell: process.platform === 'win32', // Use shell on Windows
      ...options 
    });

    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    child.on('error', err => {
      if (err.code === 'ENOENT') {
        reject(new Error('npm not found. Please ensure Node.js and npm are installed and in your PATH.'));
      } else {
        reject(err);
      }
    });
  });
}

// Create a wrapper for inquirer that handles cancellation properly
async function safePrompt(questions) {
  // Set up a promise race between the prompt and a SIGINT handler
  const promptPromise = inquirer.prompt(questions);
  
  // Create a promise that resolves when SIGINT is received
  const sigintPromise = new Promise((_, reject) => {
    const handler = () => {
      process.off('SIGINT', handler);
      reject(new Error('CANCELLED_BY_USER'));
    };
    process.on('SIGINT', handler);
  });
  
  try {
    return await Promise.race([promptPromise, sigintPromise]);
  } catch (error) {
    if (error.message === 'CANCELLED_BY_USER') {
      console.log(chalk.yellow('\n⚠️  Operation cancelled by user'));
      process.exit(0);
    }
    throw error;
  }
}

const logo = `
 ██████╗  █████╗ ███████╗██╗   ██╗██╗     
 ██╔══██╗██╔══██╗██╔════╝╚██╗ ██╔╝██║     
 ██║  ██║███████║███████╗ ╚████╔╝ ██║     
 ██║  ██║██╔══██║╚════██║  ╚██╔╝  ██║     
 ██████╔╝██║  ██║███████║   ██║   ███████╗
 ╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝
`;

const helpMessage = `
${chalk.blue.bold(logo)}
${chalk.blue.bold('dasyl')} - Create and release development projects faster.

${chalk.bold('Usage:')}
  dasyl [command] [options]

${chalk.bold('Commands:')}
  new              Create a new project (interactive)
  create <name>    Quick create with defaults
  
${chalk.bold('Quick Shortcuts:')}
  dasyl react <name>      Create React app with Vite
  dasyl node <name>       Create Node.js Express API (JavaScript)
  dasyl node-ts <name>    Create Node.js Express API (TypeScript)
  dasyl laravel <name>    Create Laravel project

${chalk.bold('Options:')}
  -h, --help           Show this help message
  -v, --version        Show version number
  -y, --yes            Accept all defaults (skip prompts)
  --skip-install       Skip dependency installation
  --skip-git           Skip Git initialization
  --skip-editor        Skip opening in VS Code
  --dir <path>         Create project in custom directory
  --enable-auto-update Enable automatic updates
  --disable-auto-update Disable automatic updates
`;

if (process.argv.includes('-h') || process.argv.includes('--help')) {
  const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
  const helpMessageWithVersion = `
${chalk.blue.bold(logo)}
${chalk.gray(`v${packageJson.version}`)}
${chalk.blue.bold('dasyl')} - Create and release development projects faster.

${chalk.bold('Usage:')}
  dasyl [command] [options]

${chalk.bold('Commands:')}
  new              Create a new project (interactive)
  create <name>    Quick create with defaults
  
${chalk.bold('Quick Shortcuts:')}
  dasyl react <name>      Create React app with Vite
  dasyl node <name>       Create Node.js Express API (JavaScript)
  dasyl node-ts <name>    Create Node.js Express API (TypeScript)
  dasyl laravel <name>    Create Laravel project

${chalk.bold('Options:')}
  -h, --help           Show this help message
  -v, --version        Show version number
  -y, --yes            Accept all defaults (skip prompts)
  --skip-install       Skip dependency installation
  --skip-git           Skip Git initialization
  --skip-editor        Skip opening in VS Code
  --dir <path>         Create project in custom directory
  --enable-auto-update Enable automatic updates
  --disable-auto-update Disable automatic updates
`;
  console.log(helpMessageWithVersion);
  process.exit(0);
}

if (process.argv.includes('-v') || process.argv.includes('--version')) {
  const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
  console.log(chalk.blue.bold(`dasyl v${packageJson.version}`));
  process.exit(0);
}

// Handle auto-update settings
if (process.argv.includes('--enable-auto-update')) {
  handleAutoUpdateSetting(true);
  process.exit(0);
}

if (process.argv.includes('--disable-auto-update')) {
  handleAutoUpdateSetting(false);
  process.exit(0);
}

// Parse command line flags
const cliFlags = {
  skipInstall: process.argv.includes('--skip-install'),
  skipGit: process.argv.includes('--skip-git'),
  skipEditor: process.argv.includes('--skip-editor'),
  yes: process.argv.includes('-y') || process.argv.includes('--yes'),
  customDir: null
};

// Parse custom directory
const dirIndex = process.argv.indexOf('--dir');
if (dirIndex !== -1 && process.argv[dirIndex + 1]) {
  cliFlags.customDir = process.argv[dirIndex + 1];
}

// Handle SIGINT (Ctrl+C) gracefully
let isPrompting = false;

const handleExit = () => {
  console.log(chalk.yellow('\n⚠️  Operation cancelled by user'));
  process.exit(0);
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

// Handle uncaught exceptions gracefully  
process.on('uncaughtException', (error) => {
  if (error.code === 'ERR_USE_AFTER_CLOSE' || error.message?.includes('readline')) {
    console.log(chalk.yellow('\n⚠️  Operation cancelled by user'));
    process.exit(0);
  }
  throw error;
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  if (reason && (reason.message === 'Prompt was canceled' || reason.name === 'ExitPromptError')) {
    console.log(chalk.yellow('\n⚠️  Operation cancelled by user'));
    process.exit(0);
  }
});

console.log(chalk.blue.bold(logo));

// Get and display version
const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
console.log(chalk.gray(`v${packageJson.version}`));
console.log(chalk.cyan.bold('⚡ Fast, opinionated CLI for modern development\n'));

// Check for updates (async, non-blocking)
checkForUpdates();

// Handle command shortcuts
const args = process.argv.slice(2).filter(arg => !arg.startsWith('--') && arg !== '-y');
const command = args[0];
const projectName = args[1];

async function quickCreate(type, name) {
  if (!name) {
    console.log(chalk.red('\n❌ Error: Please provide a project name.'));
    console.log(chalk.yellow(`\n💡 Usage: ${chalk.cyan(`dasyl ${type} <project-name>`)}`));
    console.log(chalk.gray(`\nExample: ${chalk.cyan(`dasyl ${type} my-awesome-app`)}`));
    process.exit(1);
  }

  const targetDir = cliFlags.customDir ? `${cliFlags.customDir}/${name}` : name;
  
  if (shell.test('-d', targetDir)) {
    console.log(chalk.red(`\n❌ Error: Directory '${targetDir}' already exists.`));
    console.log(chalk.yellow('\n💡 Suggestions:'));
    console.log(chalk.cyan(`  1. Choose a different project name`));
    console.log(chalk.cyan(`  2. Delete the existing directory: rm -rf ${targetDir}`));
    process.exit(1);
  }

  switch (type) {
    case 'react':
    case 'vue':
    case 'svelte':
      console.log(chalk.blue(`🚀 Creating ${type.charAt(0).toUpperCase() + type.slice(1)} app '${name}'...`));
      try {
        await spawnNpm(['create', 'vite@latest', targetDir, '--']);
      } catch (error) {
        console.log(chalk.red(`\n❌ Error: ${error.message}`));
        console.log(chalk.yellow('\n💡 Make sure Node.js and npm are installed and in your PATH.'));
        process.exit(1);
      }
      break;
    
    case 'node':
      console.log(chalk.blue(`🚀 Creating Node.js Express API '${name}'...`));
      await generateNodeProject(targetDir, false, cliFlags);
      break;
    
    case 'node-ts':
      console.log(chalk.blue(`🚀 Creating Node.js Express API with TypeScript '${name}'...`));
      await generateNodeProject(targetDir, true, cliFlags);
      break;
    
    case 'laravel':
      if (!shell.which('composer')) {
        console.log(chalk.red('\n❌ Error: Composer is not installed or not in PATH.'));
        console.log(chalk.yellow('\n💡 Install Composer:'));
        console.log(chalk.cyan('  Visit: https://getcomposer.org/download/'));
        process.exit(1);
      }
      const spinner = ora({ text: chalk.blue(`Creating Laravel project '${name}'...`), color: 'blue' }).start();
      const result = await shell.exec(`composer create-project --prefer-dist laravel/laravel "${targetDir}"`, { silent: true });
      if (result.code === 0) {
        spinner.succeed(chalk.green(`Laravel project '${name}' created successfully!`));
      } else {
        spinner.fail(chalk.red(`Failed to create Laravel project`));
        process.exit(1);
      }
      break;
      break;
  }
}

// Check for shortcuts
if (['react', 'vue', 'svelte', 'node', 'node-ts', 'laravel'].includes(command)) {
  quickCreate(command, projectName).catch(err => {
    console.error(chalk.red(err.message));
    process.exit(1);
  });
} else {
  main().catch(err => {
    console.error(chalk.red(err.message));
    process.exit(1);
  });
}

async function main() {
  // 1. Get Project Name
  let projectName;
  
  if (cliFlags.yes) {
    projectName = 'my-app';
    console.log(chalk.cyan(`Using default project name: ${projectName}`));
  } else {
    try {
      const answer = await safePrompt([
        {
          type: 'input',
          name: 'projectName',
          message: chalk.cyan('Enter your project name:'),
          default: 'my-app',
          validate: (input) => {
            // Trim whitespace
            const trimmed = input.trim();
            
            // Check if empty
            if (!trimmed) {
              return chalk.red('❌ Project name cannot be empty');
            }
            
            // Check length
            if (trimmed.length < 2) {
              return chalk.red('❌ Project name must be at least 2 characters long');
            }
            
            if (trimmed.length > 214) {
              return chalk.red('❌ Project name must be less than 214 characters (npm limitation)');
            }
            
            // Check for invalid characters
            if (!/^([a-z0-9\-\_.])+$/.test(trimmed)) {
              return chalk.red('❌ Project name may only include lowercase letters, numbers, dashes, underscores, and dots');
            }
            
            // Check if starts with dot or underscore
            if (trimmed.startsWith('.') || trimmed.startsWith('_')) {
              return chalk.yellow('⚠️  Warning: Project names starting with . or _ are not recommended');
            }
            
            // Check for reserved names
            const reserved = ['node_modules', 'favicon.ico'];
            if (reserved.includes(trimmed.toLowerCase())) {
              return chalk.red(`❌ "${trimmed}" is a reserved name and cannot be used`);
            }
            
            return true;
          }
        }
      ]);
      projectName = answer.projectName;
    } catch (error) {
      // Handle different types of cancellation
      if (error.isTtyError || error.name === 'ExitPromptError') {
        console.log(chalk.yellow('\n⚠️  Operation cancelled by user'));
      } else {
        console.log(chalk.yellow('\n⚠️  Operation cancelled'));
      }
      process.exit(0);
    }
  }

  const targetDir = cliFlags.customDir ? `${cliFlags.customDir}/${projectName}` : projectName;

  if (shell.test('-d', targetDir)) {
    console.log(chalk.red(`\n❌ Error: Directory '${targetDir}' already exists.`));
    console.log(chalk.yellow('\n💡 Suggestions:'));
    console.log(chalk.cyan(`  1. Choose a different project name`));
    console.log(chalk.cyan(`  2. Delete the existing directory: rm -rf ${targetDir}`));
    console.log(chalk.cyan(`  3. Use a different directory: dasyl --dir /path/to/directory`));
    process.exit(1);
  }

  // 2. Choose Stack
  let stackChoice;
  
  if (cliFlags.yes) {
    stackChoice = 'backend';
    console.log(chalk.cyan(`Using default stack: Backend (Node.js)`));
  } else {
    try {
      const answer = await safePrompt([
        {
          type: 'list',
          name: 'stackChoice',
          message: chalk.magenta('Choose your tech stack:'),
          choices: [
            { name: chalk.blue('Frontend (React/Vue/etc via Vite)'), value: 'frontend' },
            { name: chalk.green('Backend (Node.js, Laravel)'), value: 'backend' }
          ]
        }
      ]);
      stackChoice = answer.stackChoice;
    } catch (error) {
      // Handle different types of cancellation
      if (error.isTtyError || error.name === 'ExitPromptError') {
        console.log(chalk.yellow('\n⚠️  Operation cancelled by user'));
      } else {
        console.log(chalk.yellow('\n⚠️  Operation cancelled'));
      }
      process.exit(0);
    }
  }

  if (stackChoice === 'frontend') {
    console.log(chalk.blue(`\n🎨 Setting up Frontend project '${projectName}'...`));
    // Run npm create vite
    try {
      await spawnNpm(['create', 'vite@latest', targetDir, '--']);
    } catch (error) {
      console.log(chalk.red(`\n❌ Error: ${error.message}`));
      console.log(chalk.yellow('\n💡 Troubleshooting:'));
      console.log(chalk.cyan('  1. Make sure Node.js is installed: https://nodejs.org/'));
      console.log(chalk.cyan('  2. Restart your terminal/command prompt'));
      console.log(chalk.cyan('  3. Verify npm is working: npm --version'));
      process.exit(1);
    }
  } else {
    // Backend Choices
    let backendType;
    
    if (cliFlags.yes) {
      backendType = 'node';
      console.log(chalk.cyan(`Using default backend: Node.js`));
    } else {
      try {
        const answer = await safePrompt([
          {
            type: 'list',
            name: 'backendType',
            message: chalk.magenta('Choose Backend Framework:'),
            choices: [
              { name: chalk.green('Node.js (Express API Boilerplate)'), value: 'node' },
              { name: chalk.red('Laravel (PHP)'), value: 'laravel' }
            ]
          }
        ]);
        backendType = answer.backendType;
      } catch (error) {
        // Handle different types of cancellation
        if (error.isTtyError || error.name === 'ExitPromptError') {
          console.log(chalk.yellow('\n⚠️  Operation cancelled by user'));
        } else {
          console.log(chalk.yellow('\n⚠️  Operation cancelled'));
        }
        process.exit(0);
      }
    }

    if (backendType === 'node') {
      let language;
      
      if (cliFlags.yes) {
        language = 'javascript';
        console.log(chalk.cyan(`Using default language: JavaScript`));
      } else {
        try {
          const answer = await safePrompt([
            {
              type: 'list',
              name: 'language',
              message: chalk.magenta('Choose your language:'),
              choices: [
                { name: chalk.yellow('JavaScript'), value: 'javascript' },
                { name: chalk.blue('TypeScript'), value: 'typescript' }
              ]
            }
          ]);
          language = answer.language;
        } catch (error) {
          // Handle different types of cancellation
          if (error.isTtyError || error.name === 'ExitPromptError') {
            console.log(chalk.yellow('\n⚠️  Operation cancelled by user'));
          } else {
            console.log(chalk.yellow('\n⚠️  Operation cancelled'));
          }
          process.exit(0);
        }
      }
      const useTypeScript = language === 'typescript';
      console.log(chalk.green(`\n🚀 Setting up Node.js API in '${projectName}'...`));
      generateNodeProject(targetDir, useTypeScript, cliFlags);
    } else {
      console.log(chalk.red(`\n🚀 Setting up Laravel project '${projectName}'...`));
      if (!shell.which('composer')) {
        console.log(chalk.red('Error: Composer is not installed or not in PATH.'));
        process.exit(1);
      }
      await shell.exec(`composer create-project --prefer-dist laravel/laravel "${targetDir}"`);
    }
  }
}
