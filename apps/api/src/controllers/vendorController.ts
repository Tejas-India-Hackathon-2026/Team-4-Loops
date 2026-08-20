import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

function parseJsonField(val: any, fallback: any = []) {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return val || fallback;
}

const offeringSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  price: z.number().positive(),
  duration: z.string(),
  maxGuests: z.number().int().positive().default(10),
  location: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  coverImage: z.string().url(),
  gallery: z.array(z.string()).optional(),
  isActive: z.boolean().default(true)
});

// Vendor Profile
export async function getVendorProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.userId },
      include: {
        offerings: true,
        orders: {
          include: { offering: true, user: true }
        }
      }
    });

    if (!vendor) {
      throw new ApiError(404, 'Vendor profile not found');
    }

    return res.json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
}

export async function updateVendorProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.userId } });
    if (!vendor) throw new ApiError(404, 'Vendor profile not found');

    const updated = await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        businessName: req.body.businessName ?? vendor.businessName,
        description: req.body.description ?? vendor.description,
        businessType: req.body.businessType ?? vendor.businessType,
        phone: req.body.phone ?? vendor.phone,
        email: req.body.email ?? vendor.email,
        address: req.body.address ?? vendor.address,
        city: req.body.city ?? vendor.city,
        district: req.body.district ?? vendor.district,
        logo: req.body.logo ?? vendor.logo,
        coverImage: req.body.coverImage ?? vendor.coverImage
      }
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

// Offerings Management
export async function getVendorOfferings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.userId } });
    if (!vendor) throw new ApiError(404, 'Vendor profile not found');

    const offerings = await prisma.offering.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = offerings.map(o => ({
      ...o,
      gallery: parseJsonField(o.gallery, [])
    }));

    return res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}

export async function createOffering(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.userId } });
    if (!vendor) throw new ApiError(404, 'Vendor profile not found');

    if (vendor.status !== 'APPROVED') {
      throw new ApiError(403, 'Vendor profile must be APPROVED by admin to publish offerings.');
    }

    const data = offeringSchema.parse(req.body);
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString(36);

    const offering = await prisma.offering.create({
      data: {
        vendorId: vendor.id,
        title: data.title,
        slug,
        description: data.description,
        category: data.category,
        price: data.price,
        duration: data.duration,
        maxGuests: data.maxGuests,
        location: data.location,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        coverImage: data.coverImage,
        gallery: JSON.stringify(data.gallery || []),
        isActive: data.isActive
      }
    });

    return res.status(201).json({
      success: true,
      data: {
        ...offering,
        gallery: parseJsonField(offering.gallery, [])
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
}

export async function updateOffering(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const { id } = req.params;
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.userId } });
    if (!vendor) throw new ApiError(404, 'Vendor profile not found');

    const existing = await prisma.offering.findUnique({ where: { id } });
    if (!existing || existing.vendorId !== vendor.id) {
      throw new ApiError(404, 'Offering not found or does not belong to vendor');
    }

    const updated = await prisma.offering.update({
      where: { id },
      data: {
        title: req.body.title ?? existing.title,
        description: req.body.description ?? existing.description,
        category: req.body.category ?? existing.category,
        price: req.body.price ? Number(req.body.price) : existing.price,
        duration: req.body.duration ?? existing.duration,
        maxGuests: req.body.maxGuests ? Number(req.body.maxGuests) : existing.maxGuests,
        location: req.body.location ?? existing.location,
        latitude: req.body.latitude ? Number(req.body.latitude) : existing.latitude,
        longitude: req.body.longitude ? Number(req.body.longitude) : existing.longitude,
        coverImage: req.body.coverImage ?? existing.coverImage,
        gallery: req.body.gallery ? JSON.stringify(req.body.gallery) : existing.gallery,
        isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : existing.isActive
      }
    });

    return res.json({
      success: true,
      data: {
        ...updated,
        gallery: parseJsonField(updated.gallery, [])
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteOffering(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const { id } = req.params;
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.userId } });
    if (!vendor) throw new ApiError(404, 'Vendor profile not found');

    const existing = await prisma.offering.findUnique({ where: { id } });
    if (!existing || existing.vendorId !== vendor.id) {
      throw new ApiError(404, 'Offering not found or permission denied');
    }

    await prisma.offering.delete({ where: { id } });

    return res.json({ success: true, message: 'Offering deleted successfully' });
  } catch (error) {
    next(error);
  }
}

// Vendor Orders
export async function getVendorOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.userId } });
    if (!vendor) throw new ApiError(404, 'Vendor profile not found');

    const orders = await prisma.order.findMany({
      where: { vendorId: vendor.id },
      include: {
        offering: true,
        user: { select: { id: true, name: true, email: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const { id } = req.params;
    const { orderStatus } = req.body;

    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.userId } });
    if (!vendor) throw new ApiError(404, 'Vendor profile not found');

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order || order.vendorId !== vendor.id) {
      throw new ApiError(404, 'Order not found or permission denied');
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { orderStatus }
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

// Public Vendor Directory
export async function getPublicVendors(req: Request, res: Response, next: NextFunction) {
  try {
    const { district, city, businessType, search } = req.query;

    const where: any = {
      status: 'APPROVED'
    };

    if (district && typeof district === 'string' && district !== 'ALL') {
      where.district = { equals: district, mode: 'insensitive' };
    }

    if (city && typeof city === 'string' && city !== 'ALL') {
      where.city = { equals: city, mode: 'insensitive' };
    }

    if (businessType && typeof businessType === 'string' && businessType !== 'ALL') {
      where.businessType = { equals: businessType, mode: 'insensitive' };
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { businessName: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
    }

    const vendors = await prisma.vendor.findMany({
      where,
      select: {
        id: true,
        businessName: true,
        description: true,
        businessType: true,
        city: true,
        district: true,
        latitude: true,
        longitude: true,
        logo: true,
        coverImage: true,
        phone: true
      },
      orderBy: { businessName: 'asc' }
    });

    return res.json({ success: true, data: vendors });
  } catch (error) {
    next(error);
  }
}

