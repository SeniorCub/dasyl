
import shell from 'shelljs';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

function getPHPVersion() {
  const output = shell.exec('php -r "echo PHP_MAJOR_VERSION.\'.\'.PHP_MINOR_VERSION;"', { silent: true });
  if (output.code !== 0) return null;
  return output.stdout.trim();
}

function getLaravelVersion(phpVersion) {
  if (!phpVersion) return null;
  const [major, minor] = phpVersion.split('.').map(Number);

  if (major > 8 || (major === 8 && minor >= 3)) {
    return '^13.0';
  }

  if (major === 8 && minor >= 2) {
    return '^12.0';
  }

  if (major === 8 && minor >= 1) {
    return '^11.0';
  }

  return null;
}

export async function generateLaravelProject(projectName, cliFlags = {}) {
  const root = path.resolve(projectName);
  const spinner = ora();

  // Detect PHP Version
  const phpVersion = getPHPVersion();
  if (!phpVersion) {
    console.error(chalk.red('Error: PHP is not installed or not in your PATH.'));
    return;
  }

  const laravelVersion = getLaravelVersion(phpVersion);
  if (!laravelVersion) {
    console.error(chalk.red(`Error: PHP ${phpVersion} detected. Modern Laravel versions require PHP 8.1+.`));
    return;
  }

  console.log(chalk.cyan(`PHP ${phpVersion} detected. Using Laravel ${laravelVersion}`));

  // Create Laravel project
  spinner.start('Creating Laravel project...');
  const createProject = shell.exec(`composer create-project laravel/laravel:"${laravelVersion}" "${projectName}"`, { silent: true });
  
  if (createProject.code !== 0) {
    spinner.fail('Failed to create Laravel project.');
    
    if (createProject.stderr.includes('affected by security advisories') || createProject.stdout.includes('affected by security advisories')) {
      console.log(chalk.yellow('\n[!] Security Advisory Detected:'));
      console.log(chalk.white('The selected Laravel version contains packages blocked by Composer security advisories.'));
      console.log(chalk.cyan('\nRecommended Actions:'));
      console.log(chalk.white('1. Upgrade your PHP version to 8.3+ to use the latest Laravel.'));
      console.log(chalk.white('2. Use a different Laravel version if compatible.'));
      console.log(chalk.gray(`\nDetected PHP: ${phpVersion}`));
      console.log(chalk.gray(`Attempted Laravel: ${laravelVersion}`));
    } else {
      console.log(chalk.red('\nComposer Error:'));
      console.log(createProject.stderr || createProject.stdout);
    }
    return;
  }
  spinner.succeed('Laravel project created.');

  shell.cd(root);

  // Install API scaffolding
  spinner.start('Installing Laravel API scaffolding...');
  if (shell.exec('php artisan install:api --quiet').code !== 0) {
    spinner.warn('Laravel API scaffolding setup failed. You may need to run "php artisan install:api" manually.');
  } else {
    spinner.succeed('Laravel API scaffolding installed.');
  }

  // Install dev dependencies
  spinner.start('Installing dev dependencies (PHPStan, Pint)...');
  if (shell.exec('composer require --dev phpstan/phpstan larastan/larastan').code !== 0) {
    spinner.fail('Failed to install phpstan/phpstan and larastan/larastan.');
    return;
  }
  if (shell.exec('composer require laravel/pint --dev').code !== 0) {
    spinner.fail('Failed to install laravel/pint.');
    return;
  }
  spinner.succeed('Dev dependencies installed.');

  // Create Runtest.php command
  spinner.start('Creating Runtest command...');
  const commandPath = path.join(root, 'app', 'Console', 'Commands');
  shell.mkdir('-p', commandPath);
  fs.writeFileSync(path.join(commandPath, 'Runtest.php'), `<?php

namespace App\\Console\\Commands;

use Illuminate\\Console\\Command;
use Symfony\\Component\\Process\\Process;

class Runtest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'run:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run PHPStan analysis and Laravel Pint';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Running PHPStan...');
        $phpstan = Process::fromShellCommandline('./vendor/bin/phpstan analyse --memory-limit=1G');
        if (Process::isTtySupported()) {
            $phpstan->setTty(true);
        }
        $phpstan->setTimeout(null);
        $phpstan->run(function ($type, $buffer) {
            $this->output->write($buffer);
        });

        $this->newLine();

        $this->info('Running Laravel Pint...');
        $pint = Process::fromShellCommandline('./vendor/bin/pint');
        if (Process::isTtySupported()) {
            $pint->setTty(true);
        }
        $pint->setTimeout(null);
        $pint->run(function ($type, $buffer) {
            $this->output->write($buffer);
        });

        $this->newLine();

        if (! $phpstan->isSuccessful() || ! $pint->isSuccessful()) {
            $this->error('Code quality checks failed!');

            return Command::FAILURE;
        }

        $this->info('All code quality checks passed successfully!');

        return Command::SUCCESS;
    }
}
`);
  spinner.succeed('Runtest command created.');

  // Create phpstan.neon file
  spinner.start('Creating phpstan.neon...');
  fs.writeFileSync(path.join(root, 'phpstan.neon'), `
parameters:
    paths:
        - app
        - routes
        - database
    level: 5

    ignoreErrors:
        - '#Call to an undefined method Illuminate#'
`);
  spinner.succeed('phpstan.neon created.');

  console.log(chalk.green('Laravel project setup complete!'));
}
