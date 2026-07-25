import shell from 'shelljs';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { spawn } from 'cross-spawn';

// Helper function to find npm command on different platforms
function getNpmCommand() {
  if (process.platform === 'win32') {
    if (shell.which('npm.cmd')) return 'npm.cmd';
    if (shell.which('npm')) return 'npm';
    throw new Error('npm not found.');
  }
  if (shell.which('npm')) return 'npm';
  throw new Error('npm not found.');
}

// Helper function to find npx command on different platforms
function getNpxCommand() {
  if (process.platform === 'win32') {
    if (shell.which('npx.cmd')) return 'npx.cmd';
    if (shell.which('npx')) return 'npx';
    throw new Error('npx not found.');
  }
  if (shell.which('npx')) return 'npx';
  throw new Error('npx not found.');
}

// Create a wrapper for inquirer that handles cancellation properly
async function safePrompt(questions) {
  return await inquirer.prompt(questions);
}

export async function generateFrontendProject(projectName, cliFlags = {}) {
  const root = path.resolve(projectName);
  const npmCommand = getNpmCommand();
  const npxCommand = getNpxCommand();

  console.log(chalk.blue(`\nSetting up Frontend project '${projectName}' via Vite...`));

  // Run Vite initialization
  await new Promise((resolve, reject) => {
    const child = spawn(npmCommand, ['init', 'vite@latest', '-y', '--', projectName], { 
      stdio: 'inherit' 
    });

    child.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Vite initialization failed with code ${code}`));
    });

    child.on('error', err => reject(err));
  });

  // Check if user wants Tailwind
  let useTailwind = false;
  if (cliFlags.yes) {
    useTailwind = false; // Default to no for --yes unless we want it otherwise
  } else {
    try {
      const answer = await safePrompt([
        {
          type: 'confirm',
          name: 'useTailwind',
          message: chalk.cyan('Would you like to include Tailwind CSS?'),
          default: true
        }
      ]);
      useTailwind = answer.useTailwind;
    } catch (error) {
      console.log(chalk.yellow('\n(!) Skipping Tailwind setup due to interruption'));
    }
  }

  if (useTailwind) {
    const spinner = ora({ text: chalk.cyan('Setting up Tailwind CSS...'), color: 'cyan' }).start();
    
    try {
      shell.cd(root);

      // 1. Install dependencies
      const installResult = shell.exec(`${npmCommand} install -D tailwindcss postcss autoprefixer`, { silent: true });
      if (installResult.code !== 0) throw new Error('Failed to install Tailwind dependencies');

      // 2. Initialize Tailwind
      const initResult = shell.exec(`${npxCommand} tailwindcss init -p`, { silent: true });
      if (initResult.code !== 0) throw new Error('Failed to initialize Tailwind configuration');

      // 3. Detect framework and configure tailwind.config.js
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      let content = '["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]';
      if (deps.vue) {
        content = '["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"]';
      } else if (deps.svelte) {
        content = '["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"]';
      }

      const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ${content},
  theme: {
    extend: {},
  },
  plugins: [],
}`;
      fs.writeFileSync('tailwind.config.js', tailwindConfig);

      // 4. Add Tailwind directives to CSS
      // Vite default projects usually have src/style.css or src/index.css
      let cssPath = 'src/style.css';
      if (!fs.existsSync(cssPath)) {
        if (fs.existsSync('src/index.css')) {
          cssPath = 'src/index.css';
        } else {
          // Fallback: search for any .css file in src
          const cssFiles = shell.find('src').filter(file => file.endsWith('.css'));
          if (cssFiles.length > 0) cssPath = cssFiles[0];
        }
      }

      const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;

`;

      if (fs.existsSync(cssPath)) {
        const existingCss = fs.readFileSync(cssPath, 'utf8');
        fs.writeFileSync(cssPath, tailwindDirectives + existingCss);
      } else {
        // Create it if it doesn't exist
        shell.mkdir('-p', 'src');
        fs.writeFileSync('src/index.css', tailwindDirectives);
      }

      spinner.succeed(chalk.green('Tailwind CSS set up successfully!'));
    } catch (error) {
      spinner.fail(chalk.red(`Tailwind setup failed: ${error.message}`));
    }
    
    shell.cd('..');
  }

  // Ask if user wants to install dependencies and initialize git (similar to Node generator)
  // But wait, Vite projects usually need 'npm install' anyway.
  
  console.log(chalk.green('\nFrontend project created successfully!'));
  
  if (!cliFlags.yes) {
     console.log(chalk.yellow('\nNext steps:'));
     console.log(`   cd ${projectName}`);
     console.log('   npm install');
     console.log('   npm run dev');
  }
}
