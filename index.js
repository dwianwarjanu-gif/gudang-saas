const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
const compression = require("compression");
require("dotenv").config();

const { createServer } = require("http");
const { Server } = require("socket.io");
const getTenantDB = require("./src/config/tenantDB");
const logger = require("./src/utils/logger");
const { connectRedis } = require("./src/utils/redis");
const { initializeQueues } = require("./src/jobs/queueManager");

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
const tenantMiddleware = require('./src/middleware/tenant');
const tenantResolver = require('./src/middleware/tenantResolver');
const tenantDBMiddleware = require('./src/middleware/tenantDBMiddleware');

const authMiddleware = require("./src/middleware/authMiddleware");
const requireAdmin = require("./src/middleware/roleMiddleware");

const tenantRoutes = require("./src/routes/tenantRoutes");
const meRoutes = require("./src/routes/meRoutes");

const requirePermission = require("./src/middleware/permissionMiddleware");


// routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require("./src/routes/users");
const productRoutes = require("./src/routes/products");
const tenantDBMiddleware = require("./src/middleware/tenantDBMiddleware");
const orderRoutes = require("./src/routes/orders");
const inventoryRoutes = require("./src/routes/inventory");
const marketplaceRoutes = require("./src/routes/marketplaces");
const analyticsRoutes = require("./src/routes/analytics");
const syncRoutes = require("./src/routes/sync");
const billingRoutes = require("./src/routes/billing");
const adminRoutes = require("./src/routes/adminRoutes");
const signupRoutes = require("./src/routes/signupRoutes");


const app = express();

// ✅ FIX CORS (WAJIB PALING ATAS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://tokoa.trizlabhw.com");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-tenant");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// 🔥 INI PENTING BANGET (HANDLE PREFLIGHT)
app.options("*", cors());


// 🔥 TAMBAH DI SINI

app.get("/api/tenant/:subdomain", async (req, res) => {
  const { subdomain } = req.params;

  console.log("CHECK TENANT:", subdomain);
  return res.json({
    valid: true,
    tenant: subdomain
  });
});

const PORT = process.env.PORT || 3000;


/* ============================= */
/* SERVER + SOCKET */
/* ============================= */

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.set("io", io);

/* ============================= */
/* MIDDLEWARE */
/* ============================= */


app.set("trust proxy", 1);

app.use(helmet());
app.options("*", cors());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api/", limiter);
app.use(express.static("public"));


/* ============================= */
/* ROOT */
/* ============================= */

app.get("/", (req, res) => {
  res.json({ status: "SaaS API Running" });
});

// ROUTE LAIN
app.use("/api/auth", require("./src/routes/authRoutes"));

app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);

// PUBLIC ROUTES
app.use("/api", signupRoutes);

// PROTECTED ROUTES
app.use("/api/me", require("./src/routes/meRoutes"));
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", tenantRoutes);
app.use("/api/marketplaces", marketplaceRoutes);
//app.use("/api/analytics", analyticsRoutes);
//app.use("/api/sync", syncRoutes);
app.use("/api/billing", billingRoutes);


/* ============================= */
/* START SERVER */
/* ============================= */

<<<<<<< HEAD
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
app.use('/api/tenant', tenantMiddleware);
app.use('/api', tenantResolver, tenantDBMiddleware);


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
=======
>>>>>>> 9d21037 (fix order detail + update status flow)
async function startServer() {
  try {
    await connectRedis();
    await initializeQueues();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);

    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();
