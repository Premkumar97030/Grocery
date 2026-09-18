const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAdminOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All order routes require authentication
router.use(protect);

// Customer endpoints
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin order endpoints (mounted under /api/admin/orders in app.js or directly)
router.get('/admin/all', adminOnly, getAdminOrders);
router.put('/admin/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
