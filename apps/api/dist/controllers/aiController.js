"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAiRecommendation = getAiRecommendation;
const geminiService_js_1 = require("../services/geminiService.js");
const apiError_js_1 = require("../utils/apiError.js");
async function getAiRecommendation(req, res, next) {
    try {
        const { interests, durationDays, startingCity, travelerType } = req.body;
        if (interests && !Array.isArray(interests)) {
            throw new apiError_js_1.ApiError(400, 'Interests must be an array of strings');
        }
        const recommendation = await (0, geminiService_js_1.generateBiharTravelRecommendation)({
            interests: interests || ['Buddhist heritage', 'culture', 'food'],
            durationDays: Number(durationDays) || 3,
            startingCity: startingCity || 'Patna',
            travelerType: travelerType || 'Solo/Family'
        });
        return res.json({
            success: true,
            data: recommendation
        });
    }
    catch (error) {
        next(error);
    }
}
