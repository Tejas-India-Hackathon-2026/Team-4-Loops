"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_js_1 = require("../middleware/auth.js");
const vendorController_js_1 = require("../controllers/vendorController.js");
const router = (0, express_1.Router)();
// Protect all vendor routes
router.use(auth_js_1.requireAuth, (0, auth_js_1.requireRole)('VENDOR'));
router.get('/me', vendorController_js_1.getVendorProfile);
router.put('/me', vendorController_js_1.updateVendorProfile);
router.get('/me/offerings', vendorController_js_1.getVendorOfferings);
router.post('/me/offerings', vendorController_js_1.createOffering);
router.put('/me/offerings/:id', vendorController_js_1.updateOffering);
router.delete('/me/offerings/:id', vendorController_js_1.deleteOffering);
router.get('/me/orders', vendorController_js_1.getVendorOrders);
router.patch('/me/orders/:id/status', vendorController_js_1.updateOrderStatus);
exports.default = router;
