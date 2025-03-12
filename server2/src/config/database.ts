import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import User from '../models/User';
import Room from '../models/Room';
import Friend from '../models/Friend';
import Message from '../models/Message';
import UserRoom from '../models/UserRoom';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'echo',
  logging: true,
  models: [User, Room, Friend, Message, UserRoom]
});

export default sequelize; 