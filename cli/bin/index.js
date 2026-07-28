#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs';
import { printHelp, logo } from '../lib/utils/ui.js';
import { checkForUpdates, handleAutoUpdateSetting } from '../lib/update-checker.js';
import { requireAuthentication } from '../lib/telemetry.js';
import { handleCreate } from '../lib/commands/create.js';

// Global error handlers
process.on('uncaughtException', (error) => {
  if (error.code === 'ERR_USE_AFTER_CLOSE' || error.message?.includes('readline')) {
    console.log(chalk.yellow('\n(!) Operation cancelled by user'));
    process.exit(0);
  }
  throw error;
});

process.on('unhandledRejection', (reason) => {
  if (reason && (reason.message === 'Prompt was canceled' || reason.name === 'ExitPromptError')) {
    console.log(chalk.yellow('\n(!) Operation cancelled by user'));
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  console.log(chalk.yellow('\n(!) Operation cancelled by user'));
  process.exit(0);
});

// Check Help or Version
if (process.argv.includes('-h') || process.argv.includes('--help')) {
  printHelp();
  process.exit(0);
}

if (process.argv.includes('-v') || process.argv.includes('--version')) {
  const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
  console.log(chalk.blue.bold(`dasyl v${packageJson.version}`));
  console.log(chalk.gray(`Created by SeniorCub (seniorcub.name.ng)`));
  process.exit(0);
}

// Auto update settings
if (process.argv.includes('--enable-auto-update')) {
  handleAutoUpdateSetting(true);
  process.exit(0);
}

if (process.argv.includes('--disable-auto-update')) {
  handleAutoUpdateSetting(false);
  process.exit(0);
}

// Parse CLI Flags
const cliFlags = {
  skipInstall: process.argv.includes('--skip-install'),
  skipGit: process.argv.includes('--skip-git'),
  skipEditor: process.argv.includes('--skip-editor'),
  yes: process.argv.includes('-y') || process.argv.includes('--yes'),
  customDir: null,
  structure: null
};

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
    process.exit(1);
  }
}

// Startup Display
console.log(chalk.blue.bold(logo));
const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
console.log(chalk.gray(`v${packageJson.version}`));
console.log(chalk.cyan.bold('Fast, opinionated CLI for modern development\n'));

// Run CLI
(async () => {
  await checkForUpdates();
  
  const args = process.argv.slice(2).filter(arg => !arg.startsWith('--') && arg !== '-y');
  const command = args[0];
  const projectName = args[1];

  // Real Login Flow
  if (command === 'login') {
    const { handleLogin } = await import('../lib/commands/login.js');
    await handleLogin();
    process.exit(0);
  }

  // Ensure telemetry passes
  await requireAuthentication();

  const { getUserEmail } = await import('../lib/commands/login.js');
  const email = getUserEmail();
  console.log(chalk.green(`Welcome back, ${email}! 🚀\n`));

  if (['react', 'vue', 'svelte', 'node', 'node-ts', 'laravel', 'mobile', 'new', 'create'].includes(command) || !command) {
    await handleCreate(command, projectName, cliFlags);
  } else {
    console.log(chalk.red(`\n[x] Error: Unknown command '${command}'.`));
    console.log(chalk.yellow(`\n[!] Run ${chalk.cyan('dasyl --help')} for usage.`));
    process.exit(1);
  }
})();
