#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import shell from 'shelljs';
import { generateNodeProject } from '../lib/node-generator.js';
import { spawn } from 'child_process';

const logo = `
    __         __
   / /   ___  / /_
  / /   / _ \/ __/
 / /___/  __/ /_
/_____/\___/\__/
`;

const helpMessage = `
${chalk.blue.bold(logo)}
${chalk.blue.bold('dasyl')} - Create and release development projects faster.

${chalk.bold('Usage:')}
  dasyl [command] [options]

${chalk.bold('Commands:')}
  new      Create a new project.

${chalk.bold('Options:')}
  -h, --help    Show this help message.
`;

if (process.argv.includes('-h') || process.argv.includes('--help')) {
  console.log(helpMessage);
  process.exit(0);
}

console.log(chalk.blue.bold('Welcome to dasyl!'));

async function main() {
  // 1. Get Project Name
  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter your project name:',
      default: 'my-app',
      validate: (input) => {
        if (/^([a-z0-9\-\_.])+$/.test(input)) return true;
        return 'Project name may only include name, numbers, dashes and underscores.';
      }
    }
  ]);

  if (shell.test('-d', projectName)) {
    console.log(chalk.red(`Error: Directory '${projectName}' already exists.`));
    process.exit(1);
  }

  // 2. Choose Stack
  const { stackChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'stackChoice',
      message: 'Choose your tech stack:',
      choices: [
        { name: 'Frontend (React/Vue/etc via Vite)', value: 'frontend' },
        { name: 'Backend (Node.js, Laravel)', value: 'backend' }
      ]
    }
  ]);

  if (stackChoice === 'frontend') {
    console.log(chalk.blue(`Setting up Frontend project '${projectName}'...`));
    // Run npm create vite
    await new Promise((resolve, reject) => {
      const command = 'npm';
      const args = ['create', 'vite@latest', projectName, '--'];
      
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
    const { backendType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'backendType',
        message: 'Choose Backend Framework:',
        choices: [
          { name: 'Node.js (Express API Boilerplate)', value: 'node' },
          { name: 'Laravel (PHP)', value: 'laravel' }
        ]
      }
    ]);

    if (backendType === 'node') {
      console.log(chalk.blue(`\n🚀 Setting up Node.js API in '${projectName}'...`));
      generateNodeProject(projectName);
    } else {
      console.log(chalk.blue(`\n🚀 Setting up Laravel project '${projectName}'...`));
      if (!shell.which('composer')) {
        console.log(chalk.red('Error: Composer is not installed or not in PATH.'));
        process.exit(1);
      }
      await shell.exec(`composer create-project --prefer-dist laravel/laravel "${projectName}"`);
    }
  }
}

main().catch(err => {
  console.error(chalk.red(err));
  process.exit(1);
});
