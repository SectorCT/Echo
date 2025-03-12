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
  console.log("[Signup] Starting signup process with request body:", {
    ...req.body,
    password: '[REDACTED]' // Don't log actual password
  });

  try {
    const { password } = req.body;
    console.log("[Signup] Validating password length");

    if (password && password.length < 8) {
      console.log("[Signup] Password validation failed - too short");
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters.'
      });
    }

    console.log("[Signup] Generating tokens");
    const usernameToken = uuidv4();
    const friendToken = uuidv4();
    console.log("[Signup] Generated tokens:", { usernameToken, friendToken });

    console.log("[Signup] Creating user in database");
    const user = await User.create({
      usernameToken,
      friendToken,
      password
    });
    console.log("[Signup] User created successfully with ID:", user.id);

    console.log("[Signup] Generating JWT tokens");
    const tokens = createTokens({
      userId: user.id,
      usernameToken: user.usernameToken
    });
    console.log("[Signup] JWT tokens generated successfully");

    console.log("[Signup] Sending success response");
    return res.status(200).json({
      status: 'success',
      message: 'Registration successful.',
      token: user.usernameToken,
      ...tokens
    });

  } catch (error) {
    console.error("[Signup] Error during signup process:", error);
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