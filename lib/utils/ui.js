import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';

export async function safePrompt(questions) {
  try {
    return await inquirer.prompt(questions);
  } catch (error) {
    if (error.isTtyError || error.name === 'ExitPromptError' || 
        error.message?.includes('User force closed')) {
      console.log(chalk.yellow('\n(!) Operation cancelled by user'));
      process.exit(0);
    }
    throw error;
  }
}

export const logo = `
     _                 _ 
    | |               | |
  __| | __ _ ___ _   _| |
 / _' |/ _' / __| | | | |
| (_| | (_| \__ \ |_| | |_ 
 \__,_|\__,_|___/\__, |_ _|
                  __/ |  
                 |___/   
`;

export function printHelp() {
  const packageJson = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf-8'));
  const helpMessageWithVersion = `
${chalk.blue.bold(logo)}
${chalk.gray(`v${packageJson.version}`)}
${chalk.blue.bold('dasyl')} - Create and release development projects faster.

${chalk.bold('Usage:')}
  dasyl [command] [options]

${chalk.bold('Commands:')}
  new              Create a new project (interactive)
  create <name>    Quick create with defaults
  
${chalk.bold('Quick Shortcuts:')}
  dasyl react <name>      Create React app with Vite
  dasyl node <name>       Create Node.js Express API (JavaScript)
  dasyl node-ts <name>    Create Node.js Express API (TypeScript)
  dasyl laravel <name>    Create Laravel project
  dasyl mobile <name>     Create Expo Mobile app with Nativewind

${chalk.bold('Options:')}
  -h, --help           Show this help message
  -v, --version        Show version number
  -y, --yes            Accept all defaults (skip prompts)
  --skip-install       Skip dependency installation
  --skip-git           Skip Git initialization
  --skip-editor        Skip opening in VS Code
  --dir <path>         Create project in custom directory
  --structure <type>   Node.js structure: basic or modern
  --enable-auto-update Enable automatic updates
  --disable-auto-update Disable automatic updates

${chalk.bold('Created by:')}
  ${chalk.cyan('SeniorCub')} ${chalk.gray('(seniorcub.name.ng)')}
`;
  console.log(helpMessageWithVersion);
}
