import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ApiError } from '../utils/apiError.js';
import { verifyRazorpaySignature } from '../services/razorpayService.js';

const prisma = new PrismaClient();

const verifyPaymentSchema = z.object({
  orderId: z.string(), // Local DB Order ID
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string()
});

export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = verifyPaymentSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id: data.orderId }
    });

    if (!order) {
      throw new ApiError(404, 'Booking order not found');
    }

    const isValidSignature = verifyRazorpaySignature(
      data.razorpayOrderId,
      data.razorpayPaymentId,
      data.razorpaySignature
    );

    if (!isValidSignature) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'FAILED', orderStatus: 'CANCELLED' }
      });
      throw new ApiError(400, 'Invalid payment signature. Verification failed.');
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
}
