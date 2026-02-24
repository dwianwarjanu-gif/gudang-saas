const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const mysql = require('mysql2')

const logger = require('./src/utils/logger');
const { connectRedis } = require('./src/utils/redis');
const { initializeQueues } = require('./src/jobs/queueManager');

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const productRoutes = require('./src/routes/products');
const orderRoutes = require('./src/routes/orders');
const inventoryRoutes = require('./src/routes/inventory');
const marketplaceRoutes = require('./src/routes/marketplaces');
const analyticsRoutes = require('./src/routes/analytics');
const syncRoutes = require('./src/routes/sync');
const billingRoutes = require('./src/routes/billing');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;


// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Test root
app.get('/', (req, res) => {
  res.send('API running...');
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    title: 'Marketplace Integration API',
    version: '1.0',
    status: 'running',
  });
});


/* TEST API */
app.get("/api/products", (req, res) => {
  res.json([
    { id: 1, name: "Produk A", price: 10000 },
    { id: 2, name: "Produk B", price: 20000 },
  ]);
});

// API routes
console.log('Auth routes loaded');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/marketplaces', marketplaceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/billing', billingRoutes);

// API documentation
if (process.env.NODE_ENV !== 'production') {
  const swaggerJsdoc = require('swagger-jsdoc');
  const swaggerUi = require('swagger-ui-express');
  
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Marketplace Integration API',
        version: '1.0.0',
        description: 'API untuk aplikasi integrasi marketplace',
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Development server',
        },
      ],
    },
    apis: ['./src/routes/*.js'], // paths to files containing OpenAPI definitions
  };
  
  const specs = swaggerJsdoc(options);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
}

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    logger.info(`User ${userId} joined room`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io available to other modules
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Initialize services and start server
async function startServer() {
  try {
    // Connect to Redis
    if (process.env.REDIS_ENABLED === 'true') {
    await connectRedis();
    logger.info('Connected to Redis');
    
    // Initialize job queues
    await initializeQueues();
    logger.info('Job queues initialized');
    } else {
      logger.warn('Redis disabled (development mode)');
    }
    
    // Start server
  server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${3000}`);
  });

  server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error(err);
  }
 });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

startServer();
