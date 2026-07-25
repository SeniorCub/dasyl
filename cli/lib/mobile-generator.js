import shell from 'shelljs';
import chalk from 'chalk';
import { spawn } from 'cross-spawn';

// Helper function to find npx command on different platforms
function getNpxCommand() {
  if (process.platform === 'win32') {
    if (shell.which('npx.cmd')) {
      return 'npx.cmd';
    } else if (shell.which('npx')) {
      return 'npx';
    } else {
      throw new Error('npx not found. Please ensure Node.js and npm are installed and in your PATH.');
    }
  } else {
    if (shell.which('npx')) {
      return 'npx';
    } else {
      throw new Error('npx not found. Please ensure Node.js and npm are installed and in your PATH.');
    }
  }
}

export async function generateMobileProject(projectName, cliFlags = {}) {
  console.log(chalk.blue(`\nSetting up Mobile project (Expo + Nativewind) in '${projectName}'...`));
  
  const npxCommand = getNpxCommand();
  
  // The user recommended npx rn-new --nativewind
  // We'll pass the project name as well. Assuming rn-new takes it as an argument or we might need to handle it.
  // Most "new" commands take the name as the first argument.
  
  return new Promise((resolve, reject) => {
    // We'll use rn-new with --nativewind as suggested. 
    // We might need to handle the directory correctly if customDir is used.
    
    const args = ['rn-new', projectName, '--nativewind'];
    
    const child = spawn(npxCommand, args, { 
      stdio: 'inherit'
    });

    child.on('close', code => {
      if (code === 0) {
        console.log(chalk.green(`\nMobile project '${projectName}' created successfully!`));
        console.log(chalk.cyan('\nHappy coding!\n'));
        resolve();
      } else {
        reject(new Error(`Mobile project creation failed with code ${code}`));
      }
    });

    child.on('error', err => {
      reject(err);
    });
  });
}
