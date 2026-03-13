#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import shell from 'shelljs';
import { generateNodeProject } from '../lib/node-generator.js';
import { spawn } from 'child_process';
import fs from 'fs';
import ora from 'ora';

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
`;

if (process.argv.includes('-h') || process.argv.includes('--help')) {
  console.log(helpMessage);
  process.exit(0);
}

if (process.argv.includes('-v') || process.argv.includes('--version')) {
  const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
  console.log(chalk.blue.bold(`dasyl v${packageJson.version}`));
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

console.log(chalk.blue.bold(logo));
console.log(chalk.cyan.bold('⚡ Fast, opinionated CLI for modern development\n'));

// Handle command shortcuts
const args = process.argv.slice(2).filter(arg => !arg.startsWith('--') && arg !== '-y');
const command = args[0];
const projectName = args[1];

async function quickCreate(type, name) {
  if (!name) {
    console.log(chalk.red('Error: Please provide a project name.'));
    console.log(chalk.yellow(`Usage: dasyl ${type} <project-name>`));
    process.exit(1);
  }

  const targetDir = cliFlags.customDir ? `${cliFlags.customDir}/${name}` : name;
  
  if (shell.test('-d', targetDir)) {
    console.log(chalk.red(`Error: Directory '${targetDir}' already exists.`));
    process.exit(1);
  }

  switch (type) {
    case 'react':
    case 'vue':
    case 'svelte':
      console.log(chalk.blue(`🚀 Creating ${type.charAt(0).toUpperCase() + type.slice(1)} app '${name}'...`));
      await new Promise((resolve, reject) => {
        const child = spawn('npm', ['create', 'vite@latest', targetDir, '--'], { stdio: 'inherit' });
        child.on('close', code => code === 0 ? resolve() : reject(new Error(`Process exited with code ${code}`)));
        child.on('error', reject);
      });
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
      console.log(chalk.blue(`🚀 Creating Laravel project '${name}'...`));
      if (!shell.which('composer')) {
        console.log(chalk.red('Error: Composer is not installed or not in PATH.'));
        process.exit(1);
      }
      await shell.exec(`composer create-project --prefer-dist laravel/laravel "${name}"`);
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
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: chalk.cyan('Enter your project name:'),
          default: 'my-app',
          validate: (input) => {
            if (/^([a-z0-9\-\_.])+$/.test(input)) return true;
            return 'Project name may only include name, numbers, dashes and underscores.';
          }
        }
      ]);
      projectName = answer.projectName;
    } catch (error) {
      console.log(chalk.yellow('\n⚠️  Operation cancelled'));
      process.exit(0);
    }
  }

  const targetDir = cliFlags.customDir ? `${cliFlags.customDir}/${projectName}` : projectName;

  if (shell.test('-d', targetDir)) {
    console.log(chalk.red(`Error: Directory '${targetDir}' already exists.`));
    process.exit(1);
  }

  // 2. Choose Stack
  let stackChoice;
  
  if (cliFlags.yes) {
    stackChoice = 'backend';
    console.log(chalk.cyan(`Using default stack: Backend (Node.js)`));
  } else {
    try {
      const answer = await inquirer.prompt([
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
      console.log(chalk.yellow('\n⚠️  Operation cancelled'));
      process.exit(0);
    }
  }

  if (stackChoice === 'frontend') {
    console.log(chalk.blue(`\n🎨 Setting up Frontend project '${projectName}'...`));
    // Run npm create vite
    await new Promise((resolve, reject) => {
      const command = 'npm';
      const args = ['create', 'vite@latest', targetDir, '--'];
      
      const child = spawn(command, args, { stdio: 'inherit' });

      child.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      child.on('error', err => {
        reject(err);
      });
    });
  } else {
    // Backend Choices
    let backendType;
    
    if (cliFlags.yes) {
      backendType = 'node';
      console.log(chalk.cyan(`Using default backend: Node.js`));
    } else {
      try {
        const answer = await inquirer.prompt([
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
        console.log(chalk.yellow('\n⚠️  Operation cancelled'));
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
          const answer = await inquirer.prompt([
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
          console.log(chalk.yellow('\n⚠️  Operation cancelled'));
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
