const orderService = require('../services/orderService');
const { successResponse } = require('../utils/apiResponse');

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const order = await orderService.createOrder(req.user._id, {
      items,
      shippingAddress,
      paymentMethod,
    });
    return successResponse(res, 'Order placed successfully', { order }, 201);
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user._id);
    return successResponse(res, 'Orders fetched successfully', { orders });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user._id,
      req.user.role
    );
    return successResponse(res, 'Order details fetched', { order });
  } catch (err) {
    next(err);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user._id);
    return successResponse(res, 'Order cancelled successfully', { order });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all orders
const getAdminOrders = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    return successResponse(res, 'Admin orders fetched successfully', result);
  } catch (err) {
    next(err);
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    return successResponse(res, 'Order status updated successfully', { order });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAdminOrders,
  updateOrderStatus,
};
