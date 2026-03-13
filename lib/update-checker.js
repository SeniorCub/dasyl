import https from 'https';
import chalk from 'chalk';
import semver from 'semver';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function checkForUpdates() {
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(join(__dirname, '../package.json'), 'utf-8')
    );
    const currentVersion = packageJson.version;
    const packageName = packageJson.name;

    const latestVersion = await getLatestVersion(packageName);
    
    if (latestVersion && semver.gt(latestVersion, currentVersion)) {
      console.log(chalk.yellow('\n╭────────────────────────────────────────────╮'));
      console.log(chalk.yellow('│') + chalk.bold('  Update Available!                         ') + chalk.yellow('│'));
      console.log(chalk.yellow('│                                            │'));
      console.log(chalk.yellow('│') + `  Current: ${chalk.red(currentVersion)}                          ` + chalk.yellow('│'));
      console.log(chalk.yellow('│') + `  Latest:  ${chalk.green(latestVersion)}                          ` + chalk.yellow('│'));
      console.log(chalk.yellow('│                                            │'));
      console.log(chalk.yellow('│') + `  Run ${chalk.cyan('npm i -g ' + packageName)}          ` + chalk.yellow('│'));
      console.log(chalk.yellow('╰────────────────────────────────────────────╯\n'));
    }
  } catch (error) {
    // Silently fail - don't interrupt user experience
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
