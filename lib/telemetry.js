import fs from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios';
import inquirer from 'inquirer';
import chalk from 'chalk';

const CONFIG_PATH = path.join(os.homedir(), '.dasyl-config.json');
const API_BASE_URL = process.env.DASYL_API_URL || 'https://dasyl-ten.vercel.app/api';

export function getTelemetryConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    } catch (err) {
      return null;
    }
  }
  return null;
}

export function saveTelemetryConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

export async function loginToLeaderboard(usernameOverride) {
  let username = usernameOverride;
  if (!username) {
    console.log(chalk.cyan('\nJoin the Dasyl Community Leaderboard! 🚀'));
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: chalk.magenta('Enter your chosen username:'),
        validate: (input) => input.length > 2 ? true : 'Username must be at least 3 characters.',
      }
    ]);
    username = answer.username;
  }

  try {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, { username });
    if (res.data && res.data.userId) {
      saveTelemetryConfig({ userId: res.data.userId, username: res.data.username });
      console.log(chalk.green(`\n[✔] ${res.data.message} Welcome to the leaderboard, ${res.data.username}!`));
      return true;
    }
  } catch (error) {
    console.log(chalk.red(`\n[x] Failed to register: ${error.response?.data?.error || error.message}`));
    return false;
  }
}

export async function requireAuthentication() {
  const config = getTelemetryConfig();
  if (config && config.userId) {
    if (config.username) {
      console.log(chalk.green(`Welcome back, ${config.username}! 🚀`));
    }
    return true; // Already authenticated
  }
  
  // Not authenticated, block and prompt
  console.log(chalk.yellow('\n[!] Dasyl now features a global leaderboard to track usage!'));
  console.log(chalk.yellow('You must register a username to continue using the CLI.'));
  
  const success = await loginToLeaderboard();
  if (!success) {
    console.log(chalk.red('\nAuthentication is required to use Dasyl. Exiting...'));
    process.exit(1);
  }
  return true;
}

export async function trackUsage() {
  const config = getTelemetryConfig();
  if (!config || !config.userId) return; // Silent fail if somehow no config
  
  try {
    await axios.post(`${API_BASE_URL}/telemetry/track`, { userId: config.userId });
  } catch (err) {
    // Silently fail on telemetry error
  }
}
