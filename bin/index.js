#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import shell from 'shelljs';
import { generateNodeProject } from '../lib/node-generator.js';
import { generateLaravelProject } from '../lib/laravel-generator.js';
import { generateMobileProject } from '../lib/mobile-generator.js';
import { generateFrontendProject } from '../lib/frontend-generator.js';
import { checkForUpdates, handleAutoUpdateSetting } from '../lib/update-checker.js';
import { spawn } from 'cross-spawn';
import fs from 'fs';
import ora from 'ora';

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
  try {
    return await inquirer.prompt(questions);
  } catch (error) {
    // Check if it's a cancellation error
    if (error.isTtyError || error.name === 'ExitPromptError' || 
        error.message?.includes('User force closed')) {
      console.log(chalk.yellow('\n(!) Operation cancelled by user'));
      process.exit(0);
    }
    throw error;
  }
}

const logo = `
     _                 _ 
    | |               | |
  __| | __ _ ___ _   _| |
 / _' |/ _' / __| | | | |
| (_| | (_| \__ \ |_| | |
 \__,_|\__,_|___/\__, |_|
                  __/ |  
                 |___/   
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
  dasyl mobile <name>     Create Expo Mobile app with Nativewind

${chalk.bold('Options:')}
  -h, --help           Show this help message
  -v, --version        Show version number
  -y, --yes            Accept all defaults (skip prompts)
  --skip-install       Skip dependency installation
  --skip-git           Skip Git initialization
  --skip-editor        Skip opening in VS Code
  --dir <path>         Create project in custom directory
  --structure <type>   Node.js structure: basic or modern
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
  dasyl mobile <name>     Create Expo Mobile app with Nativewind

${chalk.bold('Options:')}
  -h, --help           Show this help message
  -v, --version        Show version number
  -y, --yes            Accept all defaults (skip prompts)
  --skip-install       Skip dependency installation
  --skip-git           Skip Git initialization
  --skip-editor        Skip opening in VS Code
  --dir <path>         Create project in custom directory
  --structure <type>   Node.js structure: basic or modern
  --enable-auto-update Enable automatic updates
  --disable-auto-update Disable automatic updates

${chalk.bold('Created by:')}
  ${chalk.cyan('SeniorCub')} ${chalk.gray('(seniorcub.name.ng)')}
`;
  console.log(helpMessageWithVersion);
  process.exit(0);
}

if (process.argv.includes('-v') || process.argv.includes('--version')) {
  const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
  console.log(chalk.blue.bold(`dasyl v${packageJson.version}`));
  console.log(chalk.gray(`Created by SeniorCub (seniorcub.name.ng)`));
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
  customDir: null,
  structure: null
};

// Parse custom directory
const dirIndex = process.argv.indexOf('--dir');
if (dirIndex !== -1 && process.argv[dirIndex + 1]) {
  cliFlags.customDir = process.argv[dirIndex + 1];
}

const structureIndex = process.argv.indexOf('--structure');
if (structureIndex !== -1 && process.argv[structureIndex + 1]) {
  const structure = process.argv[structureIndex + 1].toLowerCase();
  if (['basic', 'modern'].includes(structure)) {
    cliFlags.structure = structure;
  } else {
    console.log(chalk.red(`\n[x] Error: Invalid structure '${process.argv[structureIndex + 1]}'.`));
    console.log(chalk.yellow('\n[!] Valid options:'));
    console.log(chalk.cyan('  --structure basic'));
    console.log(chalk.cyan('  --structure modern'));
    process.exit(1);
  }
}

function isDirectoryEmpty(targetDir) {
  try {
    const files = fs.readdirSync(targetDir).filter(file => !['.DS_Store', 'Thumbs.db'].includes(file));
    return files.length === 0;
  } catch (error) {
    return false;
  }
}

// SIGINT handler is set up after startup display

// Handle uncaught exceptions gracefully  
process.on('uncaughtException', (error) => {
  if (error.code === 'ERR_USE_AFTER_CLOSE' || error.message?.includes('readline')) {
    console.log(chalk.yellow('\n(!) Operation cancelled by user'));
    process.exit(0);
  }
  throw error;
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  if (reason && (reason.message === 'Prompt was canceled' || reason.name === 'ExitPromptError')) {
    console.log(chalk.yellow('\n(!) Operation cancelled by user'));
    process.exit(0);
  }
});

console.log(chalk.blue.bold(logo));

// Get and display version
const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
console.log(chalk.gray(`v${packageJson.version}`));
console.log(chalk.cyan.bold('Fast, opinionated CLI for modern development\n'));

// Set up cancellation handling immediately after startup display
const handleCancel = () => {
  console.log(chalk.yellow('\n(!) Operation cancelled by user'));
  process.exit(0);
};

process.on('SIGINT', handleCancel);

// Check for updates
await checkForUpdates();

// Handle command shortcuts
const args = process.argv.slice(2).filter(arg => !arg.startsWith('--') && arg !== '-y');
const command = args[0];
const projectName = args[1];

async function quickCreate(type, name) {
  if (!name) {
    console.log(chalk.red('\n[x] Error: Please provide a project name.'));
    console.log(chalk.yellow(`\n[!] Usage: ${chalk.cyan(`dasyl ${type} <project-name>`)}`));
    console.log(chalk.gray(`\nExample: ${chalk.cyan(`dasyl ${type} my-awesome-app`)}`));
    process.exit(1);
  }

  const targetDir = cliFlags.customDir ? `${cliFlags.customDir}/${name}` : name;
  
  const allowExistingEmpty = type === 'node' || type === 'node-ts';
  if (shell.test('-d', targetDir) && (!allowExistingEmpty || !isDirectoryEmpty(targetDir))) {
    console.log(chalk.red(`\n[x] Error: Directory '${targetDir}' already exists.`));
    console.log(chalk.yellow('\n[!] Suggestions:'));
    console.log(chalk.cyan(`  1. Choose a different project name`));
    console.log(chalk.cyan(`  2. Delete the existing directory: rm -rf ${targetDir}`));
    if (allowExistingEmpty) {
      console.log(chalk.cyan(`  3. Use an empty directory to scaffold in place`));
    }
    process.exit(1);
  }

  let nodeStructure = cliFlags.structure || 'basic';
  if ((type === 'node' || type === 'node-ts') && !cliFlags.structure && !cliFlags.yes) {
    const answer = await safePrompt([
      {
        type: 'list',
        name: 'nodeStructure',
        message: chalk.magenta('Choose your Node.js folder structure:'),
        choices: [
          { name: chalk.yellow('Basic (controllers, routes, models folders)'), value: 'basic' },
          { name: chalk.blue('Modern (modules/<feature>/<feature>.controller files)'), value: 'modern' }
        ],
        default: 'basic'
      }
    ]);
    nodeStructure = answer.nodeStructure;
  }

  switch (type) {
    case 'react':
    case 'vue':
    case 'svelte':
      await generateFrontendProject(targetDir, cliFlags);
      break;
    
    case 'node':
      console.log(chalk.blue(`Creating Node.js Express API '${name}'...`));
      await generateNodeProject(targetDir, false, cliFlags, nodeStructure);
      break;
    
    case 'node-ts':
      console.log(chalk.blue(`Creating Node.js Express API with TypeScript '${name}'...`));
      await generateNodeProject(targetDir, true, cliFlags, nodeStructure);
      break;
    
    case 'laravel':
      if (!shell.which('composer')) {
        console.log(chalk.red('\n[x] Error: Composer is not installed or not in PATH.'));
        console.log(chalk.yellow('\n[!] Install Composer:'));
        console.log(chalk.cyan('  Visit: https://getcomposer.org/download/'));
        process.exit(1);
      }
      await generateLaravelProject(targetDir, cliFlags);
      break;
    
    case 'mobile':
      await generateMobileProject(targetDir, cliFlags);
      break;
  }
}

// Check for shortcuts
if (['react', 'vue', 'svelte', 'node', 'node-ts', 'laravel', 'mobile'].includes(command)) {
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
              return chalk.red('[x] Project name cannot be empty');
            }
            
            // Check length
            if (trimmed.length < 2) {
              return chalk.red('[x] Project name must be at least 2 characters long');
            }
            
            if (trimmed.length > 214) {
              return chalk.red('[x] Project name must be less than 214 characters (npm limitation)');
            }
            
            // Check for invalid characters
            if (!/^([a-z0-9\-\_.])+$/.test(trimmed)) {
              return chalk.red('[x] Project name may only include lowercase letters, numbers, dashes, underscores, and dots');
            }
            
            // Check if starts with dot or underscore
            if (trimmed.startsWith('.') || trimmed.startsWith('_')) {
              return chalk.yellow('[!] Warning: Project names starting with . or _ are not recommended');
            }
            
            // Check for reserved names
            const reserved = ['node_modules', 'favicon.ico'];
            if (reserved.includes(trimmed.toLowerCase())) {
              return chalk.red(`[x] "${trimmed}" is a reserved name and cannot be used`);
            }
            
            return true;
          }
        }
      ]);
      projectName = answer.projectName;
    } catch (error) {
      // Handle different types of cancellation
      if (error.isTtyError || error.name === 'ExitPromptError') {
        console.log(chalk.yellow('\n(!) Operation cancelled by user'));
      } else {
        console.log(chalk.yellow('\n(!) Operation cancelled'));
      }
      process.exit(0);
    }
  }

  const targetDir = cliFlags.customDir ? `${cliFlags.customDir}/${projectName}` : projectName;

  if (shell.test('-d', targetDir)) {
    console.log(chalk.red(`\n[x] Error: Directory '${targetDir}' already exists.`));
    console.log(chalk.yellow('\n[!] Suggestions:'));
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
            { name: chalk.green('Backend (Node.js, Laravel)'), value: 'backend' },
            { name: chalk.yellow('Mobile (Expo, Nativewind)'), value: 'mobile' }
          ]
        }
      ]);
      stackChoice = answer.stackChoice;
    } catch (error) {
      // Handle different types of cancellation
      if (error.isTtyError || error.name === 'ExitPromptError') {
        console.log(chalk.yellow('\n(!) Operation cancelled by user'));
      } else {
        console.log(chalk.yellow('\n(!) Operation cancelled'));
      }
      process.exit(0);
    }
  }

  if (stackChoice === 'frontend') {
    await generateFrontendProject(targetDir, cliFlags);
  } else if (stackChoice === 'mobile') {
    await generateMobileProject(targetDir, cliFlags);
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
          console.log(chalk.yellow('\n(!) Operation cancelled by user'));
        } else {
          console.log(chalk.yellow('\n(!) Operation cancelled'));
        }
        process.exit(0);
      }
    }

    if (backendType === 'node') {
      let language;
      let structure = cliFlags.structure || 'basic';
      
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
            console.log(chalk.yellow('\n(!) Operation cancelled by user'));
          } else {
            console.log(chalk.yellow('\n(!) Operation cancelled'));
          }
          process.exit(0);
        }
      }
      const useTypeScript = language === 'typescript';
      if (!cliFlags.structure && !cliFlags.yes) {
        const answer = await safePrompt([
          {
            type: 'list',
            name: 'nodeStructure',
            message: chalk.magenta('Choose your Node.js folder structure:'),
            choices: [
              { name: chalk.yellow('Basic (controllers, routes, models folders)'), value: 'basic' },
              { name: chalk.blue('Modern (modules/<feature>/<feature>.controller files)'), value: 'modern' }
            ],
            default: 'basic'
          }
        ]);
        structure = answer.nodeStructure;
      } else if (cliFlags.yes && !cliFlags.structure) {
        console.log(chalk.cyan('Using default Node.js structure: basic'));
      }
      console.log(chalk.green(`\nSetting up Node.js API in '${projectName}'...`));
      await generateNodeProject(targetDir, useTypeScript, cliFlags, structure);
    } else {
      if (!shell.which('composer')) {
        console.log(chalk.red('Error: Composer is not installed or not in PATH.'));
        process.exit(1);
      }
      await generateLaravelProject(targetDir, cliFlags);
    }
  }
}
