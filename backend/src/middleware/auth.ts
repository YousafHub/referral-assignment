import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import { prisma } from '../lib/prisma.js';


declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Getting the token from cookie or Authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }
  
  // Verifying token using jwt
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  
  // Getting the user from database
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      name: true,
      referralCode: true,
      points: true,
      referredById: true,
      createdAt: true
    }
  });
  
  if (!user) {
    throw new ApiError(401, 'User not found');
  }
  
  // Attaching user to request
  req.user = user;
  next();
});