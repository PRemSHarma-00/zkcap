import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { settings } from './config';

export interface AuthUser {
  id: string;
  github_username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const createToken = (payload: AuthUser): string => {
  return jwt.sign(payload, settings.jwtSecret, {
    expiresIn: `${settings.jwtExpiryHours}h`,
    algorithm: settings.jwtAlgorithm as jwt.Algorithm,
  });
};

export const verifyToken = (token: string): AuthUser => {
  return jwt.verify(token, settings.jwtSecret) as AuthUser;
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ detail: 'Not authenticated' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ detail: 'Invalid or expired token' });
    return;
  }
};
