import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  getVendorProfile,
  updateVendorProfile,
  getVendorOfferings,
  createOffering,
  updateOffering,
  deleteOffering,
  getVendorOrders,
  updateOrderStatus
} from '../controllers/vendorController.js';

const router = Router();

// Protect all vendor routes
router.use(requireAuth, requireRole('VENDOR'));

router.get('/me', getVendorProfile);
router.put('/me', updateVendorProfile);

router.get('/me/offerings', getVendorOfferings);
router.post('/me/offerings', createOffering);
router.put('/me/offerings/:id', updateOffering);
router.delete('/me/offerings/:id', deleteOffering);

router.get('/me/orders', getVendorOrders);
router.patch('/me/orders/:id/status', updateOrderStatus);

export default router;
