import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import { JwtPayload } from '../types';
import redisClient from '../config/redis';
import { jwtConfig } from '../config/jwt';

const createTokens = (payload: JwtPayload) => {
  const accessToken = jwt.sign(
    payload,
    jwtConfig.secret,
    jwtConfig.accessTokenOptions
  );

  const refreshToken = jwt.sign(
    payload,
    jwtConfig.secret,
    jwtConfig.refreshTokenOptions
  );

  return { accessToken, refreshToken };
};

export const signup = async (req: Request, res: Response) => {
  console.log('[AuthController] Signup request received:', {
    body: req.body,
    headers: req.headers,
    method: req.method,
    path: req.path
  });
  try {
    const { password } = req.body;

    if (!password) {
      console.log('[AuthController] Password missing in request');
      return res.status(400).json({
        status: 'error',
        message: 'Password is required.'
      });
    }

    if (password.length < 8) {
      console.log('[AuthController] Password too short');
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters.'
      });
    }
    
    console.log('[AuthController] Creating new user');
    const user = await User.create({
      usernameToken: uuidv4(),
      friendToken: uuidv4(),
      password
    });
    console.log('[AuthController] User created successfully:', { userId: user.id });

    const tokens = createTokens({
      userId: user.id,
      usernameToken: user.usernameToken
    });
    console.log('[AuthController] Tokens generated successfully');

    return res.status(200).json({
      status: 'success',
      message: 'Registration successful.',
      token: user.usernameToken,
      ...tokens
    });
  } catch (error) {
    console.error('[AuthController] Signup error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Could not create user.'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({ where: { usernameToken: token } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials.'
      });
    }

    const tokens = createTokens({
      userId: user.id,
      usernameToken: user.usernameToken
    });

    return res.status(200).json({
      status: 'success',
      ...tokens
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Login failed.'
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token required.'
      });
    }

    const decoded = jwt.verify(refreshToken, jwtConfig.secret) as JwtPayload;
    const expirationTime = decoded.exp! - Math.floor(Date.now() / 1000);

    await redisClient.setEx(`blacklisted_${refreshToken}`, expirationTime, 'true');

    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Logout failed.'
    });
  }
};