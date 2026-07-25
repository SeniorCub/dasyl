import chalk from 'chalk';
import shell from 'shelljs';
import { safePrompt } from '../utils/ui.js';
import { isDirectoryEmpty } from '../utils/system.js';
import { generateNodeProject } from '../node-generator.js';
import { generateLaravelProject } from '../laravel-generator.js';
import { generateMobileProject } from '../mobile-generator.js';
import { generateFrontendProject } from '../frontend-generator.js';
import { trackUsage } from '../telemetry.js';

export async function handleCreate(command, projectName, cliFlags) {
  if (['react', 'vue', 'svelte', 'node', 'node-ts', 'laravel', 'mobile'].includes(command)) {
    await quickCreate(command, projectName, cliFlags);
    await trackUsage();
  } else {
    await interactiveCreate(cliFlags);
    await trackUsage();
  }
}

async function quickCreate(type, name, cliFlags) {
  if (!name) {
    console.log(chalk.red('\n[x] Error: Please provide a project name.'));
    console.log(chalk.yellow(`\n[!] Usage: ${chalk.cyan(`dasyl ${type} <project-name>`)}`));
    process.exit(1);
  }

  const targetDir = cliFlags.customDir ? `${cliFlags.customDir}/${name}` : name;
  const allowExistingEmpty = type === 'node' || type === 'node-ts';
  
  if (shell.test('-d', targetDir) && (!allowExistingEmpty || !isDirectoryEmpty(targetDir))) {
    console.log(chalk.red(`\n[x] Error: Directory '${targetDir}' already exists.`));
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
        process.exit(1);
      }
      await generateLaravelProject(targetDir, cliFlags);
      break;
    case 'mobile':
      await generateMobileProject(targetDir, cliFlags);
      break;
  }
}

async function interactiveCreate(cliFlags) {
  let projectName = cliFlags.yes ? 'my-app' : (await safePrompt([{
    type: 'input',
    name: 'projectName',
    message: chalk.cyan('Enter your project name:'),
    default: 'my-app'
  }])).projectName;

  const targetDir = cliFlags.customDir ? `${cliFlags.customDir}/${projectName}` : projectName;

  if (shell.test('-d', targetDir)) {
    console.log(chalk.red(`\n[x] Error: Directory '${targetDir}' already exists.`));
    process.exit(1);
  }

  let stackChoice = cliFlags.yes ? 'backend' : (await safePrompt([{
    type: 'list',
    name: 'stackChoice',
    message: chalk.magenta('Choose your tech stack:'),
    choices: [
      { name: chalk.blue('Frontend (React/Vue/etc via Vite)'), value: 'frontend' },
      { name: chalk.green('Backend (Node.js, Laravel)'), value: 'backend' },
      { name: chalk.yellow('Mobile (Expo, Nativewind)'), value: 'mobile' }
    ]
  }])).stackChoice;

  if (stackChoice === 'frontend') {
    await generateFrontendProject(targetDir, cliFlags);
  } else if (stackChoice === 'mobile') {
    await generateMobileProject(targetDir, cliFlags);
  } else {
    let backendType = cliFlags.yes ? 'node' : (await safePrompt([{
      type: 'list',
      name: 'backendType',
      message: chalk.magenta('Choose Backend Framework:'),
      choices: [
        { name: chalk.green('Node.js (Express API Boilerplate)'), value: 'node' },
        { name: chalk.red('Laravel (PHP)'), value: 'laravel' }
      ]
    }])).backendType;

    if (backendType === 'node') {
      let language = cliFlags.yes ? 'javascript' : (await safePrompt([{
        type: 'list',
        name: 'language',
        message: chalk.magenta('Choose your language:'),
        choices: [
          { name: chalk.yellow('JavaScript'), value: 'javascript' },
          { name: chalk.blue('TypeScript'), value: 'typescript' }
        ]
      }])).language;

      let structure = cliFlags.structure || (cliFlags.yes ? 'basic' : (await safePrompt([{
        type: 'list',
        name: 'nodeStructure',
        message: chalk.magenta('Choose your Node.js folder structure:'),
        choices: [
          { name: chalk.yellow('Basic (controllers, routes)'), value: 'basic' },
          { name: chalk.blue('Modern (modules/<feature>)'), value: 'modern' }
        ],
        default: 'basic'
      }])).nodeStructure);

      await generateNodeProject(targetDir, language === 'typescript', cliFlags, structure);
    } else {
      if (!shell.which('composer')) {
        console.log(chalk.red('Error: Composer is not installed or not in PATH.'));
        process.exit(1);
      }
      await generateLaravelProject(targetDir, cliFlags);
    }
  }
}
