import shell from 'shelljs';
import { spawn } from 'cross-spawn';
import fs from 'fs';

export function getNpmCommand() {
  if (process.platform === 'win32') {
    if (shell.which('npm.cmd')) {
      return 'npm.cmd';
    } else if (shell.which('npm')) {
      return 'npm';
    } else {
      throw new Error('npm not found. Please ensure Node.js and npm are installed and in your PATH.');
    }
  } else {
    if (shell.which('npm')) {
      return 'npm';
    } else {
      throw new Error('npm not found. Please ensure Node.js and npm are installed and in your PATH.');
    }
  }
}

export async function spawnNpm(args, options = {}) {
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

export function isDirectoryEmpty(targetDir) {
  try {
    const files = fs.readdirSync(targetDir).filter(file => !['.DS_Store', 'Thumbs.db'].includes(file));
    return files.length === 0;
  } catch (error) {
    return false;
  }
}
