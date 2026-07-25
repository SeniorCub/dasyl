import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios';

const DASYL_DIR = path.join(os.homedir(), '.dasyl');
const CONFIG_PATH = path.join(DASYL_DIR, 'config.json');

// Get the API URL from environment variable or default to local/production
const API_URL = process.env.DASYL_API_URL || 'https://dasyl.seniorcub.name.ng';

export async function handleLogin() {
  console.log(chalk.cyan.bold('\nAuthenticate with Dasyl 🚀'));
  console.log(chalk.gray('Get your API Token from: ') + chalk.underline('https://dasyl.seniorcub.name.ng/dashboard\n'));

  const { token } = await inquirer.prompt([
    {
      type: 'password',
      name: 'token',
      message: chalk.magenta('Paste your Dasyl API Token:'),
      mask: '*',
      validate: (input) => {
        if (!input.startsWith('dsl_')) {
          return chalk.red('[x] Invalid token format. Must start with "dsl_"');
        }
        return true;
      }
    }
  ]);

  try {
    // Ideally we would hit /api/auth/me here to verify the token, but for now we just save it.
    if (!fs.existsSync(DASYL_DIR)) {
      fs.mkdirSync(DASYL_DIR, { recursive: true });
    }

    let config = {};
    if (fs.existsSync(CONFIG_PATH)) {
      config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }

    config.apiToken = token;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

    console.log(chalk.green('\n[✓] Successfully authenticated! You are ready to build.'));
  } catch (error) {
    console.log(chalk.red(`\n[x] Error saving token: ${error.message}`));
  }
}

export function getApiToken() {
  if (fs.existsSync(CONFIG_PATH)) {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    return config.apiToken;
  }
  return null;
}
