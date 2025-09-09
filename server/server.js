import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import colors from 'colors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { initWebSocket } from './controllers/orderController.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route files
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Create HTTP server
const httpServer = createServer(app);

// Initialize WebSocket
const io = initWebSocket(httpServer);

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://rsprotronics.netlify.app'
];

// Normalize origins by removing trailing slashes
const normalizedOrigins = allowedOrigins.map(origin => 
  origin.endsWith('/') ? origin.slice(0, -1) : origin
);

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Normalize the origin for comparison
    const originNormalized = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    
    if (normalizedOrigins.includes(originNormalized)) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Apply CORS with options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(helmet());

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Direct test endpoint
app.get('/api/test/direct', (req, res) => {
  res.json({ message: 'Direct test endpoint is working' });
});

// List all routes
app.get('/api/routes', (req, res) => {
  const routes = [];
  
  app._router.stack.forEach((middleware) => {
    if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
          routes.push({
            path: middleware.regexp.toString().replace(/^\/\^\\(\?\^\$\=\(\))?/g, '').replace(/\/i\?\^\$$/g, '') + handler.route.path,
            methods: methods
          });
        }
      });
    } else if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
      routes.push({
        path: middleware.route.path,
        methods: methods
      });
    }
  });

  res.json({ routes });
});

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Test route for debugging
import testRoutes from './routes/testRoutes.js';
app.use('/api/test', testRoutes);

// Log all routes
console.log('\n=== ROUTE REGISTRATION ===');
app._router.stack.forEach((middleware) => {
  if (middleware.name === 'router') {
    console.log(`\nRoutes for ${middleware.regexp}:`);
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
        console.log(`- ${methods} ${handler.route.path}`);
      }
    });
  } else if (middleware.route) {
    const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
    console.log(`- ${methods} ${middleware.route.path}`);
  }
});
console.log('=== END ROUTE REGISTRATION ===\n');

// In production, redirect to Netlify frontend
if (process.env.NODE_ENV === 'production') {
  // Redirect all non-API routes to Netlify frontend
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    // Redirect to Netlify frontend
    res.redirect(302, 'https://rsprotronics.netlify.app/' + req.path);
  });
}

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

async function killPort(port) {
  const isWindows = process.platform === 'win32';
  
  if (isWindows) {
    // Windows
    try {
      // Find the process ID using the port
      const findProcess = `netstat -ano | findstr :${port}`;
      const result = execSync(findProcess, { stdio: ['pipe', 'pipe', 'ignore'] })
        .toString()
        .trim();

      if (result) {
        const match = result.match(/\s+(\d+)$/);
        if (match && match[1]) {
          const pid = match[1];
          // Kill the process
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          console.log(`Killed process ${pid} on port ${port}`.yellow);
        }
      }
    } catch (error) {
      console.error('Error killing process:', error.message);
    }
  } else {
    // Unix/Linux/Mac
    try {
      execSync(`lsof -i :${port} | grep LISTEN | awk '{print $2}' | xargs kill -9`, {
        stdio: 'ignore'
      });
      console.log(`Freed up port ${port}`.yellow);
    } catch (error) {
      // Port might not be in use, which is fine
      console.log(`Port ${port} is available`.green);
    }
  }
}

async function startServer(port) {
  try {
    // First kill any process using the port
    await killPort(port);
    
    // Create HTTP server
    const httpServer = createServer(app);
    
    // Initialize Socket.IO
    const io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    // Initialize WebSocket
    initWebSocket(io);

    httpServer.listen(port, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold
      );
      console.log(`WebSocket server running on port ${port}`.cyan.bold);
    });
    
    return httpServer;
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server with retry logic
console.log('Starting server initialization...'.blue);

// Connect to MongoDB
connectDB()
  .then(() => startServer(PORT))
  .then(server => {
    console.log('Server started successfully'.green.bold);
    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:'.red, err);
      server.close(() => process.exit(1));
    });
  })
  .catch(err => {
    console.error('Failed to start server:'.red, err);
    console.error('Error stack:'.red, err.stack);
    process.exit(1);
  });
