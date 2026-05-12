import https from 'https';
import chalk from 'chalk';
import semver from 'semver';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'cross-spawn';
import { execSync } from 'child_process';
import os from 'os';
import path from 'path';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get config directory path (cross-platform)
function getConfigPath() {
  const configDir = process.platform === 'win32' 
    ? path.join(os.homedir(), 'AppData', 'Local', 'dasyl')
    : path.join(os.homedir(), '.dasyl');
  
  // Ensure directory exists
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  return path.join(configDir, 'config.json');
}

// Load update preferences
function loadUpdateConfig() {
  try {
    const configPath = getConfigPath();
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch (error) {
    // Return defaults if config can't be read
  }
  
  return {
    autoUpdate: null, // null = not set, true = enabled, false = disabled
    lastChecked: null,
    lastUpdatePrompted: null
  };
}

// Save update preferences
function saveUpdateConfig(config) {
  try {
    const configPath = getConfigPath();
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    // Silently fail - don't interrupt user experience
  }
}

// Perform auto-update
async function performAutoUpdate(packageName, newVersion) {
  return new Promise((resolve) => {
    console.log(chalk.blue('\n🔄 Auto-updating dasyl...'));
    
    // Determine npm command (Windows compatibility)
    let npmCommand = 'npm';
    if (process.platform === 'win32') {
      try {
        execSync('where npm.cmd', { stdio: 'ignore' });
        npmCommand = 'npm.cmd';
      } catch (e) {
        // Fall back to npm
      }
    }
    
    const updateProcess = spawn(npmCommand, ['install', '-g', packageName], {
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    let output = '';
    let errorOutput = '';
    
    updateProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    updateProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    updateProcess.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green(`✅ Successfully updated to dasyl v${newVersion}!`));
        console.log(chalk.cyan('💡 Please run your command again to use the latest version.\n'));
      } else {
        console.log(chalk.red('❌ Auto-update failed. Please update manually:'));
        console.log(chalk.cyan(`   npm install -g ${packageName}\n`));
      }
      resolve(code === 0);
    });
    
    updateProcess.on('error', () => {
      console.log(chalk.red('❌ Auto-update failed. Please update manually:'));
      console.log(chalk.cyan(`   npm install -g ${packageName}\n`));
      resolve(false);
    });
  });
}

export async function checkForUpdates(options = {}) {
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(join(__dirname, '../package.json'), 'utf-8')
    );
    const currentVersion = packageJson.version;
    const packageName = packageJson.name;

    const latestVersion = await getLatestVersion(packageName);
    
    if (latestVersion && semver.gt(latestVersion, currentVersion)) {
      const config = loadUpdateConfig();
      const now = new Date().toISOString();
      
      // Update last checked time
      config.lastChecked = now;
      
      // If auto-update is not configured, ask user
      if (config.autoUpdate === null && !options.silent) {
        if (!process.stdin.isTTY) {
          return;
        }

        console.log(chalk.yellow('\n╭────────────────────────────────────────────╮'));
        console.log(chalk.yellow('│') + chalk.bold('  Update Available!                         ') + chalk.yellow('│'));
        console.log(chalk.yellow('│                                            │'));
        console.log(chalk.yellow('│') + `  Current: ${chalk.red(currentVersion)}                          ` + chalk.yellow('│'));
        console.log(chalk.yellow('│') + `  Latest:  ${chalk.green(latestVersion)}                          ` + chalk.yellow('│'));
        console.log(chalk.yellow('│') + `  Released: ${chalk.gray(now.split('T')[0])}                   ` + chalk.yellow('│'));
        console.log(chalk.yellow('╰────────────────────────────────────────────╯\n'));

        const { updateChoice } = await inquirer.prompt([
          {
            type: 'list',
            name: 'updateChoice',
            message: chalk.magenta('🤖 Enable auto-updates?'),
            choices: [
              { name: 'Yes, auto-update when available', value: 'y' },
              { name: 'No, just notify me', value: 'n' },
              { name: 'Update now and ask later', value: 'u' }
            ]
          }
        ]);

        if (updateChoice === 'y') {
          config.autoUpdate = true;
          console.log(chalk.green('✅ Auto-updates enabled!'));
        } else if (updateChoice === 'n') {
          config.autoUpdate = false;
          console.log(chalk.yellow('📢 Auto-updates disabled. You will be notified of new versions.'));
        }

        if (updateChoice === 'y' || updateChoice === 'u') {
          const updateSuccess = await performAutoUpdate(packageName, latestVersion);
          if (updateSuccess) {
            config.lastUpdatePrompted = now;
            saveUpdateConfig(config);
            process.exit(0);
          }
        }
        
        saveUpdateConfig(config);
        return;
      }
      
      // If auto-update is enabled, perform it
      if (config.autoUpdate === true) {
        console.log(chalk.blue(`\n🆕 New version available: ${chalk.green(latestVersion)} (current: ${chalk.red(currentVersion)})`));
        console.log(chalk.gray(`Released: ${now.split('T')[0]}`));
        
        const updateSuccess = await performAutoUpdate(packageName, latestVersion);
        
        if (updateSuccess) {
          config.lastUpdatePrompted = now;
          saveUpdateConfig(config);
          // Exit after successful update so user runs the updated version
          process.exit(0);
        }
      }
      
      // If auto-update is disabled, show notification
      if (config.autoUpdate === false) {
        // Only show notification once per day
        const lastPrompted = config.lastUpdatePrompted ? new Date(config.lastUpdatePrompted) : new Date(0);
        const daysSinceLastPrompt = (new Date() - lastPrompted) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastPrompt >= 1) {
          console.log(chalk.yellow('\n╭────────────────────────────────────────────╮'));
          console.log(chalk.yellow('│') + chalk.bold('  Update Available!                         ') + chalk.yellow('│'));
          console.log(chalk.yellow('│                                            │'));
          console.log(chalk.yellow('│') + `  Current: ${chalk.red(currentVersion)}                          ` + chalk.yellow('│'));
          console.log(chalk.yellow('│') + `  Latest:  ${chalk.green(latestVersion)}                          ` + chalk.yellow('│'));
          console.log(chalk.yellow('│') + `  Released: ${chalk.gray(now.split('T')[0])}                   ` + chalk.yellow('│'));
          console.log(chalk.yellow('│                                            │'));
          console.log(chalk.yellow('│') + `  Run ${chalk.cyan('npm i -g ' + packageName)} to update    ` + chalk.yellow('│'));
          console.log(chalk.yellow('│') + `  Or run ${chalk.cyan('dasyl --enable-auto-update')}     ` + chalk.yellow('│'));
          console.log(chalk.yellow('╰────────────────────────────────────────────╯\n'));
          
          config.lastUpdatePrompted = now;
        }
      }
      
      saveUpdateConfig(config);
    }
  } catch (error) {
    // Silently fail - don't interrupt user experience
  }
}

// Function to handle auto-update settings
export function handleAutoUpdateSetting(enable) {
  const config = loadUpdateConfig();
  config.autoUpdate = enable;
  saveUpdateConfig(config);
  
  if (enable) {
    console.log(chalk.green('✅ Auto-updates enabled! DASYL will update automatically when new versions are available.'));
  } else {
    console.log(chalk.yellow('📢 Auto-updates disabled. You will receive notifications about new versions.'));
  }
}

function getLatestVersion(packageName) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'registry.npmjs.org',
      path: `/${packageName}/latest`,
      method: 'GET',
      headers: {
        'User-Agent': 'dasyl-cli'
      },
      timeout: 3000
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.version);
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => {
      resolve(null);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });

    req.end();
  });
}
