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

dotenv.config();

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
    await redisClient.connect();
    await sequelize.authenticate();
    await sequelize.sync();
    
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app; 