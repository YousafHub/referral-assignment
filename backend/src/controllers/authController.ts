import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { registerSchema, loginSchema } from '../lib/zodSchema.js';
import { generateReferralCode } from '../utils/referralCode.js';
import { prisma } from '../lib/prisma.js';

async function generateUniqueReferralCode(name: string): Promise<string> {
  let code = generateReferralCode(name);
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isUnique && attempts < maxAttempts) {
    const existing = await prisma.user.findUnique({
      where: { referralCode: code }
    });
    
    if (!existing) {
      isUnique = true;
    } else {
      code = generateReferralCode(name);
      attempts++;
    }
  }
  
  return code;
}


export const register = asyncHandler(async (req: Request, res: Response) => {
  
  const payload = req.body;
  
  // Validating the input fields with zod
  const validatedData = registerSchema.safeParse(payload);
  if (!validatedData.success) {
    throw new ApiError(400, 'Invalid or missing input', validatedData.error.issues);
  }
  
  const { email, password, name, referralCode } = validatedData.data;
  
  // Checking if user already exists or no
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  if (existingUser) {
    throw new ApiError(400, 'Email already registered');
  }
  
  // Checking if there is referrer
  let referrer = null;
  if (referralCode) {
    referrer = await prisma.user.findUnique({
      where: { referralCode }
    });
    
    if (!referrer) {
      throw new ApiError(400, 'Invalid referral code');
    }
  }
  
  // generating referral code
  const uniqueReferralCode = await generateUniqueReferralCode(name);
  
  // password hashing
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Creating user with transaction so if any steps fail it should fallback
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        referralCode: uniqueReferralCode,
        referredById: referrer?.id || null,
        points: 0
      }
    });
    
    // if user is referred, adding 10 points to it
    if (referrer) {
      await tx.user.update({
        where: { id: referrer.id },
        data: { points: { increment: 10 } }
      });
    }
    
    return user;
  });
  
  // Generating jwt token
  const token = jwt.sign(
    { userId: result.id, email: result.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  
  // setting the cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/"
  });
  
  return res.status(201).json(
    new ApiResponse(201, {}, 'User registered successfully')
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  
  const payload = req.body;
  
  // Validating the input fields with zod
  const validatedData = loginSchema.safeParse(payload);
  if (!validatedData.success) {
    throw new ApiError(400, 'Invalid or missing input', validatedData.error.issues);
  }
  
  const { email, password } = validatedData.data;
  
  // Finding the user
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    throw new ApiError(401, 'Invalid login credentials');
  }
  
  // Verifying password using bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid login credentials');
  }
  
  // Generating jwt token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  
  // Setting up the cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
  });
  
  return res.status(200).json(
    new ApiResponse(200, {}, 'Login successful')
  );
});


export const getMe = asyncHandler(async (req: Request, res: Response) => {
  
  const userId = (req as any).user.id;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      referralCode: true,
      points: true,
      referredById: true,
      createdAt: true,
      updatedAt: true
    }
  });
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  return res.status(200).json(
    new ApiResponse(200, {}, 'User data fetched successfully')
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    // clearing cookies for logging out the user
  res.clearCookie('token');
  return res.status(200).json(
    new ApiResponse(200, null, 'Logout successful')
  );
});