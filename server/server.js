import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import colors from 'colors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import productRoutes from './routes/productRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

// Enable CORS for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(helmet());

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/products', productRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ElectroHive API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API test endpoint is working' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);

/**
 * Kills the process using the specified port
 */
async function killPort(port) {
  try {
    if (process.platform === 'win32') {
      // Windows
      const { stdout } = await execPromise(`netstat -ano | findstr :${port}`);
      const lines = stdout.trim().split('\n');
      
      for (const line of lines) {
        const match = line.trim().split(/\s+/);
        if (match.length > 4) {
          const pid = match[4];
          if (pid) {
            console.log(`Killing process ${pid} using port ${port}...`.red);
            await execPromise(`taskkill /F /PID ${pid}`);
            console.log(`Process ${pid} terminated.`.green);
          }
        }
      }
    } else {
      // Unix/Linux/Mac
      const { stdout } = await execPromise(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`);
      if (stdout) {
        console.log(`Killed process using port ${port}`.green);
      }
    }
  } catch (error) {
    // Ignore errors if no process is found
    if (!error.message.includes('No tasks are running')) {
      console.error('Error killing process:'.red, error.message);
    }
  }
}

/**
 * Function to start the server after ensuring the port is free
 */
async function startServer(port) {
  try {
    // First kill any process using the port
    await killPort(port);
    
    // Then start the server
    return new Promise((resolve, reject) => {
      const server = app.listen(port, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold);
        resolve(server);
      }).on('error', (err) => {
        console.error(`Failed to start server on port ${port}:`.red, err.message);
        reject(err);
      });
    });
  } catch (err) {
    console.error('Failed to start server:'.red, err.message);
    process.exit(1);
  }
}

// Start the server with retry logic
startServer(PORT)
  .then(server => {
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.log(`Error: ${err.message}`.red);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  })
  .catch(err => {
    console.error('Failed to start server:'.red, err);
    process.exit(1);
  });
