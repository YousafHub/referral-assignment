import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  
  const userId = (req as any).user.id;
  
  // Getting user with referral data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      referrals: {
        select: {
          id: true,
          email: true,
          name: true,
          referralCode: true,
          createdAt: true
        }
      },
      referredBy: {
        select: {
          id: true,
          email: true,
          name: true,
          referralCode: true
        }
      }
    }
  });
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  return res.status(200).json(
    new ApiResponse(200, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        referralCode: user.referralCode,
        points: user.points,
        referredBy: user.referredBy
      },
      stats: {
        totalReferrals: user.referrals.length,
        totalPoints: user.points
      },
      referrals: user.referrals
    }, 'Dashboard data fetched successfully')
  );
});