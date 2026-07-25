import fs from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios';
import chalk from 'chalk';
import { getApiToken, handleLogin } from './commands/login.js';

const API_BASE_URL = process.env.DASYL_API_URL || 'https://dasyl.seniorcub.name.ng/api';

export async function requireAuthentication() {
  const token = getApiToken();
  if (token) {
    return true; // Authenticated
  }
  
  // Not authenticated, block and prompt
  console.log(chalk.yellow('\n[!] Dasyl requires an API Token to build projects.'));
  
  await handleLogin();
  
  const newToken = getApiToken();
  if (!newToken) {
    console.log(chalk.red('\nAuthentication is required to use Dasyl. Exiting...'));
    process.exit(1);
  }
  return true;
}

export async function trackUsage() {
  const token = getApiToken();
  if (!token) return; // Silent fail if somehow no config
  
  try {
    await axios.post(`${API_BASE_URL}/telemetry/track`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (err) {
    // Silently fail on telemetry error
    // console.error(err.response?.data || err.message);
  }
}
