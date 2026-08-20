import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

export async function getFavorites(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.userId },
      include: {
        destination: {
          include: { district: true }
        }
      }
    });

    return res.json({ success: true, count: favorites.length, data: favorites });
  } catch (error) {
    next(error);
  }
}

export async function addFavorite(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const { destinationId } = req.body;
    if (!destinationId) throw new ApiError(400, 'destinationId is required');

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_destinationId: {
          userId: req.user.userId,
          destinationId
        }
      }
    });

    if (existing) {
      return res.json({ success: true, message: 'Already in favorites', data: existing });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.userId,
        destinationId
      },
      include: { destination: true }
    });

    return res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    next(error);
  }
}

export async function removeFavorite(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const { destinationId } = req.params;

    await prisma.favorite.deleteMany({
      where: {
        userId: req.user.userId,
        destinationId
      }
    });

    return res.json({ success: true, message: 'Favorite removed' });
  } catch (error) {
    next(error);
  }
}
