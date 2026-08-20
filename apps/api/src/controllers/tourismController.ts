import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError.js';

const prisma = new PrismaClient();

// Helper to safely parse JSON fields stored in SQLite
function parseJsonField(val: any, fallback: any = []) {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val || fallback;
}

// 1. Circuits
export async function getCircuits(req: Request, res: Response, next: NextFunction) {
  try {
    const circuits = await prisma.circuit.findMany({
      include: {
        destinations: true
      }
    });

    const formatted = circuits.map(c => ({
      ...c,
      locations: parseJsonField(c.locations, [])
    }));

    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
}

export async function getCircuitBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const circuit = await prisma.circuit.findUnique({
      where: { slug },
      include: {
        destinations: {
          include: { district: true }
        }
      }
    });

    if (!circuit) {
      throw new ApiError(404, 'Circuit not found');
    }

    const formatted = {
      ...circuit,
      locations: parseJsonField(circuit.locations, []),
      destinations: circuit.destinations.map(d => ({
        ...d,
        gallery: parseJsonField(d.gallery, []),
        travelInformation: parseJsonField(d.travelInformation, {}),
        stays: parseJsonField(d.stays, []),
        recommendations: parseJsonField(d.recommendations, [])
      }))
    };

    return res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}

// 2. Destinations
export async function getDestinations(req: Request, res: Response, next: NextFunction) {
  try {
    const { district, circuit, category, search } = req.query;

    const where: any = {};

    if (district) {
      where.district = { slug: String(district) };
    }
    if (circuit) {
      where.circuit = { slug: String(circuit) };
    }
    if (category) {
      where.category = { contains: String(category) };
    }
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { description: { contains: String(search) } },
        { overview: { contains: String(search) } }
      ];
    }

    const destinations = await prisma.destination.findMany({
      where,
      include: {
        district: true,
        circuit: true
      }
    });

    const formatted = destinations.map(d => ({
      ...d,
      gallery: parseJsonField(d.gallery, []),
      travelInformation: parseJsonField(d.travelInformation, {}),
      stays: parseJsonField(d.stays, []),
      recommendations: parseJsonField(d.recommendations, [])
    }));

    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
}

export async function getDestinationBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const destination = await prisma.destination.findUnique({
      where: { slug },
      include: {
        district: true,
        circuit: true
      }
    });

    if (!destination) {
      throw new ApiError(404, 'Destination not found');
    }

    const formatted = {
      ...destination,
      gallery: parseJsonField(destination.gallery, []),
      travelInformation: parseJsonField(destination.travelInformation, {}),
      stays: parseJsonField(destination.stays, []),
      recommendations: parseJsonField(destination.recommendations, [])
    };

    return res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}

// 3. Districts
export async function getDistricts(req: Request, res: Response, next: NextFunction) {
  try {
    const districts = await prisma.district.findMany({
      include: {
        destinations: true
      }
    });

    return res.json({ success: true, count: districts.length, data: districts });
  } catch (error) {
    next(error);
  }
}

export async function getDistrictBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const district = await prisma.district.findUnique({
      where: { slug },
      include: {
        destinations: true
      }
    });

    if (!district) {
      throw new ApiError(404, 'District not found');
    }

    return res.json({ success: true, data: district });
  } catch (error) {
    next(error);
  }
}

// 4. Events
export async function getEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, search, month, year } = req.query;

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = String(category);
    }
    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } },
        { location: { contains: String(search) } }
      ];
    }

    if (month && year) {
      const m = Number(month); // 1 - 12
      const y = Number(year);
      const startOfMonth = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(y, m, 0, 23, 59, 59));

      where.AND = [
        { startDate: { lte: endOfMonth } },
        { endDate: { gte: startOfMonth } }
      ];
    } else if (year) {
      where.year = Number(year);
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' }
    });

    const formatted = events.map(e => ({
      ...e,
      gallery: parseJsonField(e.gallery, [])
    }));

    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
}

export async function getEventBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const event = await prisma.event.findUnique({
      where: { slug }
    });

    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    const formatted = {
      ...event,
      gallery: parseJsonField(event.gallery, [])
    };

    return res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}
