import shell from 'shelljs';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export function generateNodeProject(projectName) {
  const root = path.resolve(projectName);
  
  // Create root folder
  shell.mkdir('-p', root);
  shell.cd(root);

  // Package.json
  const packageJson = {
    name: projectName,
    version: "1.0.0",
    description: "Node.js API Boilerplate",
    main: "server.js",
    scripts: {
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
    devDependencies: {
      nodemon: "^3.0.1"
    }
  };
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

  console.log('📂 Creating directory structure...');

  // Create directories
  shell.mkdir('-p', [
    'bin',
    'config',
    'controllers',
    'middleware',
    'models',
    'routes',
    'utils',
    'public',
    'uploads',
    'docs',
    'postman'
  ]);

  // Create files
  shell.touch('bin/cli.js');
  shell.touch('uploads/.gitkeep');
  shell.touch('.gitignore');

  // --- File Contents ---

  // config/database.js
  const dbConfig = `const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/${projectName}');
        console.log(\`MongoDB Connected: \${conn.connection.host}\`);
    } catch (error) {
        console.error(\`Error: \${error.message}\`);
        process.exit(1);
    }
};

module.exports = connectDB;`;
  fs.writeFileSync('config/database.js', dbConfig);

  // config/middleware.js & routes.js (empty)
  shell.touch('config/middleware.js');
  shell.touch('config/routes.js');

  // controllers/authController.js
  const authController = `exports.register = (req, res) => {
    res.status(200).json({ success: true, message: 'Register route' });
};

exports.login = (req, res) => {
    res.status(200).json({ success: true, message: 'Login route' });
};`;
  fs.writeFileSync('controllers/authController.js', authController);
  shell.touch('controllers/userController.js');

  // Middleware
  shell.touch('middleware/auth.js');
  shell.touch('middleware/kyc.js');
  shell.touch('middleware/security.js');
  
  const errorHandler = `const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
};

module.exports = errorHandler;`;
  fs.writeFileSync('middleware/errorHandler.js', errorHandler);

  // Models
  const userModel = `const mongoose = require('mongoose');

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
  fs.writeFileSync('models/User.js', userModel);

  // Routes
  const authRoutes = `const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;`;
  fs.writeFileSync('routes/authRoutes.js', authRoutes);
  shell.touch('routes/userRoutes.js');

  // Utils
  shell.touch('utils/apiResponse.js');
  shell.touch('utils/appError.js');
  shell.touch('utils/catchAsync.js');
  shell.touch('utils/cloudinary.js');
  shell.touch('utils/email.js');
  shell.touch('utils/paystack.js');
  shell.touch('utils/security.js');
  shell.touch('utils/sms.js');

  // Public
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName} API</title>
</head>
<body>
    <h1>Welcome to ${projectName} API</h1>
</body>
</html>`;
  fs.writeFileSync('public/index.html', indexHtml);

  // Docs
  shell.touch('docs/api.md');
  shell.touch('postman/collection.json');

  // .env
  const envContent = `NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/${projectName}`;
  fs.writeFileSync('.env', envContent);

  // server.js
  const serverJs = `const express = require('express');
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
const authRoutes = require('./routes/authRoutes');
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
  fs.writeFileSync('server.js', serverJs);

  console.log(chalk.green('✅ Boilerplate created successfully!'));
  console.log(chalk.yellow('\n👉 Next steps:'));
  console.log(`   cd ${projectName}`);
  console.log('   npm install');
  console.log('   npm run dev');
}
