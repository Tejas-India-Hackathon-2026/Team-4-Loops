"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCircuits = getCircuits;
exports.getCircuitBySlug = getCircuitBySlug;
exports.getDestinations = getDestinations;
exports.getDestinationBySlug = getDestinationBySlug;
exports.getDistricts = getDistricts;
exports.getDistrictBySlug = getDistrictBySlug;
exports.getEvents = getEvents;
exports.getEventBySlug = getEventBySlug;
const client_1 = require("@prisma/client");
const apiError_js_1 = require("../utils/apiError.js");
const prisma = new client_1.PrismaClient();
// Helper to safely parse JSON fields stored in SQLite
function parseJsonField(val, fallback = []) {
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        }
        catch {
            return fallback;
        }
    }
    return val || fallback;
}
// 1. Circuits
async function getCircuits(req, res, next) {
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
    }
    catch (error) {
        next(error);
    }
}
async function getCircuitBySlug(req, res, next) {
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
            throw new apiError_js_1.ApiError(404, 'Circuit not found');
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
    }
    catch (error) {
        next(error);
    }
}
// 2. Destinations
async function getDestinations(req, res, next) {
    try {
        const { district, circuit, category, search } = req.query;
        const where = {};
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
    }
    catch (error) {
        next(error);
    }
}
async function getDestinationBySlug(req, res, next) {
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
            throw new apiError_js_1.ApiError(404, 'Destination not found');
        }
        // Query nearby vendors for interactive spot map
        let nearbyVendors = await prisma.vendor.findMany({
            where: {
                OR: [
                    { district: { contains: destination.district.name } },
                    { city: { contains: destination.district.name } }
                ]
            },
            take: 12
        });
        if (nearbyVendors.length === 0) {
            nearbyVendors = await prisma.vendor.findMany({
                take: 10
            });
        }
        // Query nearby attractions in same district/circuit
        const nearbyDestinations = await prisma.destination.findMany({
            where: {
                id: { not: destination.id },
                OR: [
                    { districtId: destination.districtId },
                    { circuitId: destination.circuitId || undefined }
                ]
            },
            take: 4,
            include: {
                district: true,
                circuit: true
            }
        });
        const formatted = {
            ...destination,
            gallery: parseJsonField(destination.gallery, []),
            travelInformation: parseJsonField(destination.travelInformation, {}),
            stays: parseJsonField(destination.stays, []),
            recommendations: parseJsonField(destination.recommendations, []),
            nearbyVendors,
            nearbyDestinations
        };
        return res.json({ success: true, data: formatted });
    }
    catch (error) {
        next(error);
    }
}
// 3. Districts
async function getDistricts(req, res, next) {
    try {
        const districts = await prisma.district.findMany({
            include: {
                destinations: true
            }
        });
        return res.json({ success: true, count: districts.length, data: districts });
    }
    catch (error) {
        next(error);
    }
}
async function getDistrictBySlug(req, res, next) {
    try {
        const { slug } = req.params;
        const district = await prisma.district.findUnique({
            where: { slug },
            include: {
                destinations: true
            }
        });
        if (!district) {
            throw new apiError_js_1.ApiError(404, 'District not found');
        }
        return res.json({ success: true, data: district });
    }
    catch (error) {
        next(error);
    }
}
// 4. Events
async function getEvents(req, res, next) {
    try {
        const { category, search, month, year } = req.query;
        const where = {};
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
        }
        else if (year) {
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
    }
    catch (error) {
        next(error);
    }
}
async function getEventBySlug(req, res, next) {
    try {
        const { slug } = req.params;
        const event = await prisma.event.findUnique({
            where: { slug }
        });
        if (!event) {
            throw new apiError_js_1.ApiError(404, 'Event not found');
        }
        const formatted = {
            ...event,
            gallery: parseJsonField(event.gallery, [])
        };
        return res.json({ success: true, data: formatted });
    }
    catch (error) {
        next(error);
    }
}
