import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { setupWebSocket } from './websocket/chatHandler';
import authRoutes from './routes/authRoutes';
import friendRoutes from './routes/friendRoutes';
import messageRoutes from './routes/messageRoutes';
import sequelize from './config/database';
import redisClient from './config/redis';
import path from 'path';
import dotenv from 'dotenv';
import healthRoutes from './routes/healthRoutes';

// Load environment variables
dotenv.config();

// Log environment
console.log('=== Environment Configuration ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REDIS_URL:', process.env.REDIS_URL);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('==============================');

const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));

// Routes
app.use('/', healthRoutes);
app.use('/auth', authRoutes);
app.use('/friends', friendRoutes);
app.use('/messages', messageRoutes);

// WebSocket setup
setupWebSocket(server);

// Database connection and server start
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('=== Starting Server Initialization ===');

    // Connect to Redis
    console.log('Connecting to Redis...');
    try {
      await redisClient.connect();
      console.log('Redis connected successfully');
    } catch (error) {
      console.error('Redis connection failed:', error);
      throw error;
    }

    // Connect to PostgreSQL
    console.log('Connecting to PostgreSQL...');
    try {
      await sequelize.authenticate();
      console.log('PostgreSQL connected successfully');
    } catch (error) {
      console.error('PostgreSQL connection failed:', error);
      throw error;
    }

    // Sync database
    console.log('Syncing database...');
    try {
      await sequelize.sync();
      console.log('Database synced successfully');
    } catch (error) {
      console.error('Database sync failed:', error);
      throw error;
    }

    // Start server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle process termination
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Closing server...');
      try {
        await redisClient.quit();
        await sequelize.close();
        server.close(() => {
          console.log('Server closed');
          process.exit(0);
        });
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
console.log('Starting server...');
startServer().catch(error => {
  console.error('Fatal error in startServer:', error);
  process.exit(1);
});

export default app; 