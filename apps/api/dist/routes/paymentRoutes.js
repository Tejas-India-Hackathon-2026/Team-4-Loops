"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_js_1 = require("../controllers/paymentController.js");
const router = (0, express_1.Router)();
router.post('/verify', paymentController_js_1.verifyPayment);
exports.default = router;
