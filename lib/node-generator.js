import shell from 'shelljs';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

// Create a wrapper for inquirer that handles cancellation properly
async function safePrompt(questions) {
  return new Promise((resolve, reject) => {
    // Create the inquirer prompt
    const promptInstance = inquirer.prompt(questions);
    
    // Override inquirer's UI to handle SIGINT properly
    promptInstance.then(answers => {
      resolve(answers);
    }).catch(error => {
      // Check if it's a cancellation error
      if (error.isTtyError || error.name === 'ExitPromptError' || 
          error.message?.includes('User force closed') ||
          error.message?.includes('canceled') ||
          error.message?.includes('interrupted') ||
          error.code === 'SIGINT') {
        if (!process.cancelHandled) {
          process.cancelHandled = true;
          console.log(chalk.yellow('\n⚠️  Operation cancelled by user'));
          process.exit(0);
        }
      }
      reject(error);
    });
    
    // Access inquirer's internal UI and override SIGINT behavior
    setTimeout(() => {
      if (promptInstance.ui && promptInstance.ui.rl) {
        const readline = promptInstance.ui.rl;
        
        // Remove inquirer's default SIGINT handling
        readline.removeAllListeners('SIGINT');
        
        // Add our own SIGINT handler that defers to the global one
        readline.on('SIGINT', () => {
          if (!process.cancelHandled) {
            process.cancelHandled = true;
            console.log(chalk.yellow('\n⚠️  Operation cancelled by user'));
            process.exit(0);
          }
        });
      }
    }, 10); // Small delay to let inquirer initialize
  });
}

export async function generateNodeProject(projectName, useTypeScript = false, cliFlags = {}, structure = 'basic') {
  const root = path.resolve(projectName);
  const sanitizedPackageName = path.basename(root)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/^[._-]+/, '')
    .replace(/-+/g, '-')
    .slice(0, 214);
  const packageName = sanitizedPackageName || 'my-app';
  const isModernStructure = structure === 'modern';
  
  // Create root folder
  shell.mkdir('-p', root);
  shell.cd(root);

  // Package.json
  const packageJson = {
    name: packageName,
    version: "1.0.0",
    description: "Node.js API Boilerplate",
    main: useTypeScript ? "dist/server.js" : "server.js",
    scripts: useTypeScript ? {
      start: "node dist/server.js",
      dev: "nodemon --exec ts-node src/server.ts",
      build: "tsc",
      "build:watch": "tsc --watch"
    } : {
      start: "node server.js",
      dev: "nodemon server.js"
    },
    dependencies: {
      express: "^4.18.2",
      dotenv: "^16.3.1",
      cors: "^2.8.5",
      mongoose: "^8.0.0",
      helmet: "^7.1.0",
      morgan: "^1.10.0"
    },
    devDependencies: useTypeScript ? {
      nodemon: "^3.0.1",
      typescript: "^5.3.3",
      "ts-node": "^10.9.2",
      "@types/node": "^20.10.5",
      "@types/express": "^4.17.21",
      "@types/cors": "^2.8.17",
      "@types/morgan": "^1.9.9",
      "eslint": "^8.56.0",
      "prettier": "^3.1.1",
      "eslint-config-prettier": "^9.1.0",
      "eslint-plugin-prettier": "^5.1.2",
      "@typescript-eslint/parser": "^6.15.0",
      "@typescript-eslint/eslint-plugin": "^6.15.0"
    } : {
      nodemon: "^3.0.1",
      "eslint": "^8.56.0",
      "prettier": "^3.1.1",
      "eslint-config-prettier": "^9.1.0",
      "eslint-plugin-prettier": "^5.1.2"
    }
  };
  
  // Add lint and format scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    lint: "eslint .",
    "lint:fix": "eslint . --fix",
    format: "prettier --write ."
  };

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

  // Create ESLint config
  const eslintConfig = useTypeScript ? {
    env: { node: true, es2021: true },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    rules: {}
  } : {
    env: { node: true, es2021: true, commonjs: true },
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    parserOptions: { ecmaVersion: "latest" },
    rules: {}
  };
  fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));

  // Create Prettier config
  const prettierConfig = {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: "es5"
  };
  fs.writeFileSync('.prettierrc', JSON.stringify(prettierConfig, null, 2));

  console.log(chalk.cyan('📂 Creating directory structure...'));

  // Create directories
  const baseDir = useTypeScript ? 'src' : '.';
  if (useTypeScript) {
    shell.mkdir('-p', 'src');
  }
  
  const commonDirs = [
    `${baseDir}/bin`,
    `${baseDir}/config`,
    `${baseDir}/middleware`,
    `${baseDir}/utils`,
    'public',
    'uploads',
    'docs',
    'postman'
  ];
  const structureDirs = isModernStructure
    ? [`${baseDir}/modules/auth`, `${baseDir}/modules/user`]
    : [`${baseDir}/controllers`, `${baseDir}/models`, `${baseDir}/routes`];
  shell.mkdir('-p', [...commonDirs, ...structureDirs]);

  // Create files
  shell.touch(`${baseDir}/bin/cli.${useTypeScript ? 'ts' : 'js'}`);
  shell.touch('uploads/.gitkeep');
  shell.touch('.gitignore');

  // TypeScript config
  if (useTypeScript) {
    const tsConfig = {
      compilerOptions: {
        target: "ES2020",
        module: "commonjs",
        lib: ["ES2020"],
        outDir: "./dist",
        rootDir: "./src",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        moduleResolution: "node"
      },
      include: ["src/**/*"],
      exclude: ["node_modules"]
    };
    fs.writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2));
  }

  // --- File Contents ---

  // config/database
  const dbConfig = useTypeScript 
    ? `import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/${packageName}');
        console.log(\`MongoDB Connected: \${conn.connection.host}\`);
    } catch (error) {
        console.error(\`Error: \${(error as Error).message}\`);
        process.exit(1);
    }
};

export default connectDB;`
    : `const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/${packageName}');
        console.log(\`MongoDB Connected: \${conn.connection.host}\`);
    } catch (error) {
        console.error(\`Error: \${error.message}\`);
        process.exit(1);
    }
};

module.exports = connectDB;`;
  fs.writeFileSync(`${baseDir}/config/database.${useTypeScript ? 'ts' : 'js'}`, dbConfig);

  // config/middleware & routes (empty)
  shell.touch(`${baseDir}/config/middleware.${useTypeScript ? 'ts' : 'js'}`);
  shell.touch(`${baseDir}/config/routes.${useTypeScript ? 'ts' : 'js'}`);

  // controllers/authController
  const authController = useTypeScript
    ? `import { Request, Response } from 'express';

export const register = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, message: 'Register route' });
};

export const login = (req: Request, res: Response): void => {
    res.status(200).json({ success: true, message: 'Login route' });
};`
    : `exports.register = (req, res) => {
    res.status(200).json({ success: true, message: 'Register route' });
};

exports.login = (req, res) => {
    res.status(200).json({ success: true, message: 'Login route' });
};`;
  fs.writeFileSync(
    isModernStructure
      ? `${baseDir}/modules/auth/auth.controller.${useTypeScript ? 'ts' : 'js'}`
      : `${baseDir}/controllers/authController.${useTypeScript ? 'ts' : 'js'}`,
    authController
  );
  shell.touch(
    isModernStructure
      ? `${baseDir}/modules/user/user.controller.${useTypeScript ? 'ts' : 'js'}`
      : `${baseDir}/controllers/userController.${useTypeScript ? 'ts' : 'js'}`
  );

  // Middleware
  shell.touch(`${baseDir}/middleware/auth.${useTypeScript ? 'ts' : 'js'}`);
  shell.touch(`${baseDir}/middleware/kyc.${useTypeScript ? 'ts' : 'js'}`);
  shell.touch(`${baseDir}/middleware/security.${useTypeScript ? 'ts' : 'js'}`);
  
  const errorHandler = useTypeScript
    ? `import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
};

export default errorHandler;`
    : `const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
};

module.exports = errorHandler;`;
  fs.writeFileSync(`${baseDir}/middleware/errorHandler.${useTypeScript ? 'ts' : 'js'}`, errorHandler);

  // Models
  const userModel = useTypeScript
    ? `import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

const UserSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IUser>('User', UserSchema);`
    : `const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);`;
  fs.writeFileSync(
    isModernStructure
      ? `${baseDir}/modules/user/user.model.${useTypeScript ? 'ts' : 'js'}`
      : `${baseDir}/models/User.${useTypeScript ? 'ts' : 'js'}`,
    userModel
  );

  // Routes
  const authRoutes = useTypeScript
    ? `import express from 'express';
import { register, login } from '${isModernStructure ? './auth.controller' : '../controllers/authController'}';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;`
    : `const express = require('express');
const router = express.Router();
const { register, login } = require('${isModernStructure ? './auth.controller' : '../controllers/authController'}');

router.post('/register', register);
router.post('/login', login);

module.exports = router;`;
  fs.writeFileSync(
    isModernStructure
      ? `${baseDir}/modules/auth/auth.routes.${useTypeScript ? 'ts' : 'js'}`
      : `${baseDir}/routes/authRoutes.${useTypeScript ? 'ts' : 'js'}`,
    authRoutes
  );
  shell.touch(
    isModernStructure
      ? `${baseDir}/modules/user/user.routes.${useTypeScript ? 'ts' : 'js'}`
      : `${baseDir}/routes/userRoutes.${useTypeScript ? 'ts' : 'js'}`
  );

  // Utils
  const ext = useTypeScript ? 'ts' : 'js';
  shell.touch(`${baseDir}/utils/apiResponse.${ext}`);
  shell.touch(`${baseDir}/utils/appError.${ext}`);
  shell.touch(`${baseDir}/utils/catchAsync.${ext}`);
  shell.touch(`${baseDir}/utils/cloudinary.${ext}`);
  shell.touch(`${baseDir}/utils/email.${ext}`);
  shell.touch(`${baseDir}/utils/paystack.${ext}`);
  shell.touch(`${baseDir}/utils/security.${ext}`);
  shell.touch(`${baseDir}/utils/sms.${ext}`);

  // Public
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${packageName} API</title>
</head>
<body>
    <h1>Welcome to ${packageName} API</h1>
</body>
</html>`;
  fs.writeFileSync('public/index.html', indexHtml);

  // Docs
  shell.touch('docs/api.md');
  shell.touch('postman/collection.json');

  // .env
  const envContent = `NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/${packageName}`;
  fs.writeFileSync('.env', envContent);

  // server file
  const serverJs = useTypeScript
    ? `import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import connectDB from './config/database';
import errorHandler from './middleware/errorHandler';
import authRoutes from '${isModernStructure ? './modules/auth/auth.routes' : './routes/authRoutes'}';

// Load env vars
dotenv.config();

// Connect to database
// connectDB(); // Uncomment after setting up MongoDB

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(\`Server running in \${process.env.NODE_ENV} mode on port \${PORT}\`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.log(\`Error: \${err.message}\`);
    // Close server & exit process
    server.close(() => process.exit(1));
});`
    : `const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
// connectDB(); // Uncomment after setting up MongoDB

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
const authRoutes = require('${isModernStructure ? './modules/auth/auth.routes' : './routes/authRoutes'}');
app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(\`Server running in \${process.env.NODE_ENV} mode on port \${PORT}\`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(\`Error: \${err.message}\`);
    // Close server & exit process
    server.close(() => process.exit(1));
});`;
  fs.writeFileSync(`${baseDir}/server.${useTypeScript ? 'ts' : 'js'}`, serverJs);

  console.log(chalk.green('✅ Boilerplate created successfully!'));
  
  // Ask if user wants to install dependencies and initialize git
  let installDeps, initGit, openEditor;
  
  if (cliFlags.yes) {
    installDeps = !cliFlags.skipInstall;
    initGit = !cliFlags.skipGit;
    openEditor = !cliFlags.skipEditor;
    console.log(chalk.cyan(`\nUsing default options:`));
    console.log(chalk.cyan(`  Install dependencies: ${installDeps}`));
    console.log(chalk.cyan(`  Initialize Git: ${initGit}`));
    console.log(chalk.cyan(`  Open in VS Code: ${openEditor}`));
  } else {
    // Override with flags if provided
    const skipInstallFlag = cliFlags.skipInstall;
    const skipGitFlag = cliFlags.skipGit;
    const skipEditorFlag = cliFlags.skipEditor;
    
    try {
      const prompts = [];
      
      if (!skipInstallFlag) {
        prompts.push({
          type: 'confirm',
          name: 'installDeps',
          message: chalk.cyan('📦 Install dependencies now?'),
          default: true
        });
      }
      
      if (!skipGitFlag) {
        prompts.push({
          type: 'confirm',
          name: 'initGit',
          message: chalk.yellow('🔧 Initialize Git repository?'),
          default: true
        });
      }
      
      if (!skipEditorFlag) {
        prompts.push({
          type: 'confirm',
          name: 'openEditor',
          message: chalk.magenta('💻 Open in VS Code?'),
          default: false
        });
      }
      
      if (prompts.length > 0) {
        const answers = await safePrompt(prompts);
        installDeps = skipInstallFlag ? false : (answers.installDeps ?? false);
        initGit = skipGitFlag ? false : (answers.initGit ?? false);
        openEditor = skipEditorFlag ? false : (answers.openEditor ?? false);
      } else {
        installDeps = false;
        initGit = false;
        openEditor = false;
      }
    } catch (error) {
      // Handle different types of cancellation
      if (error.isTtyError || error.name === 'ExitPromptError') {
        console.log(chalk.yellow('\n⚠️  Operation cancelled by user'));
      } else {
        console.log(chalk.yellow('\n⚠️  Operation cancelled'));
      }
      process.exit(0);
    }
  }

  // Install dependencies
  if (installDeps) {
    const spinner = ora({ text: chalk.cyan('Installing dependencies...'), color: 'cyan' }).start();
    const installResult = shell.exec('npm install', { silent: true });
    if (installResult.code === 0) {
      spinner.succeed(chalk.green('Dependencies installed!'));
    } else {
      spinner.warn(chalk.yellow('Some dependencies failed to install. You can run "npm install" manually.'));
    }
  }

  // Initialize Git
  if (initGit) {
    const spinner = ora({ text: chalk.yellow('Initializing Git repository...'), color: 'yellow' }).start();
    shell.exec('git init', { silent: true });
    
    // Create .gitignore
    const gitignoreContent = `node_modules/
${useTypeScript ? 'dist/\n' : ''}.env
*.log
.DS_Store
uploads/*
!uploads/.gitkeep`;
    fs.writeFileSync('.gitignore', gitignoreContent);
    
    shell.exec('git add .', { silent: true });
    shell.exec('git commit -m "Initial commit: Project scaffolded with dasyl"', { silent: true });
    spinner.succeed(chalk.green('Git repository initialized with initial commit!'));
  }

  // Open in VS Code
  if (openEditor) {
    const spinner = ora({ text: chalk.magenta('Opening in VS Code...'), color: 'magenta' }).start();
    shell.exec('code .', { silent: true });
    spinner.succeed(chalk.green('Opened in VS Code!'));
  }

  console.log(chalk.yellow('\n👉 Next steps:'));
  if (!['.', './'].includes(projectName)) {
    console.log(`   cd ${projectName}`);
  }
  if (!installDeps) {
    console.log('   npm install');
  }
  if (useTypeScript) {
    console.log('   npm run build  # Compile TypeScript');
  }
  console.log('   npm run dev');
  console.log(chalk.cyan('\n🚀 Happy coding!\n'));
}
