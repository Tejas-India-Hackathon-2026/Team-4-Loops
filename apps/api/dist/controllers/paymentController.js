"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = verifyPayment;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const apiError_js_1 = require("../utils/apiError.js");
const razorpayService_js_1 = require("../services/razorpayService.js");
const prisma = new client_1.PrismaClient();
const verifyPaymentSchema = zod_1.z.object({
    orderId: zod_1.z.string(), // Local DB Order ID
    razorpayOrderId: zod_1.z.string(),
    razorpayPaymentId: zod_1.z.string(),
    razorpaySignature: zod_1.z.string()
});
async function verifyPayment(req, res, next) {
    try {
        const data = verifyPaymentSchema.parse(req.body);
        const order = await prisma.order.findUnique({
            where: { id: data.orderId }
        });
        if (!order) {
            throw new apiError_js_1.ApiError(404, 'Booking order not found');
        }
        const isValidSignature = (0, razorpayService_js_1.verifyRazorpaySignature)(data.razorpayOrderId, data.razorpayPaymentId, data.razorpaySignature);
        if (!isValidSignature) {
            await prisma.order.update({
                where: { id: order.id },
                data: { paymentStatus: 'FAILED', orderStatus: 'CANCELLED' }
            });
            throw new apiError_js_1.ApiError(400, 'Invalid payment signature. Verification failed.');
        }
        // Payment Signature Verified! Update DB
        const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: 'PAID',
                orderStatus: 'CONFIRMED',
                razorpayOrderId: data.razorpayOrderId,
                razorpayPaymentId: data.razorpayPaymentId,
                razorpaySignature: data.razorpaySignature
            },
            include: {
                offering: true,
                vendor: { select: { businessName: true, phone: true } }
            }
        });
        return res.json({
            success: true,
            message: 'Payment verified successfully. Booking confirmed!',
            data: updatedOrder
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return next(new apiError_js_1.ApiError(400, error.errors.map(e => e.message).join(', ')));
        }
        next(error);
    }
}
