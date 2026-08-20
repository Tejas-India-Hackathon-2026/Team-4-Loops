import { Request, Response, NextFunction } from 'express';
import { generateBiharTravelRecommendation } from '../services/geminiService.js';
import { ApiError } from '../utils/apiError.js';

export async function getAiRecommendation(req: Request, res: Response, next: NextFunction) {
  try {
    const { interests, durationDays, startingCity, travelerType } = req.body;

    if (interests && !Array.isArray(interests)) {
      throw new ApiError(400, 'Interests must be an array of strings');
    }

    const recommendation = await generateBiharTravelRecommendation({
      interests: interests || ['Buddhist heritage', 'culture', 'food'],
      durationDays: Number(durationDays) || 3,
      startingCity: startingCity || 'Patna',
      travelerType: travelerType || 'Solo/Family'
    });

    return res.json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    next(error);
  }
}
