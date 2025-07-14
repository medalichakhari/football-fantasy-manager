import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '../types/index';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (payload: JWTPayload, expiresIn?: string): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiresIn || JWT_EXPIRES_IN,
  } as SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    throw new Error('Invalid or expired token');
  }
};

export const extractTokenFromHeader = (authHeader: string | undefined): string => {
  if (!authHeader) {
    throw new Error('No authorization header provided');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid authorization header format');
  }

  return authHeader.substring(7);
};
