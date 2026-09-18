const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

class OrderService {
  async createOrder(userId, { items, shippingAddress, paymentMethod }) {
    if (!items || items.length === 0) {
      throw new Error('No items in order');
    }

    if (!shippingAddress || !shippingAddress.addressLine || !shippingAddress.city) {
      throw new Error('Complete shipping address is required');
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for "${product.name}". Requested ${item.quantity}, only ${product.stock} available.`
        );
      }

      const effectivePrice =
        product.discountPrice > 0 && product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        quantity: item.quantity,
        price: effectivePrice,
        unit: product.unit,
      });

      subtotal += effectivePrice * item.quantity;

      product.stock -= item.quantity;
      await product.save();
    }

    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const discount = 0;
    const totalAmount = subtotal + deliveryFee - discount;

    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
      orderStatus: 'pending',
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
    });

    await Cart.findOneAndUpdate({ user: userId }, { items: [], totalPrice: 0 });

    return order;
  }

  async getUserOrders(userId) {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return orders;
  }

  async getOrderById(orderId, userId, role) {
    const order = await Order.findById(orderId).populate('user', 'name email phone');
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.user._id.toString() !== userId.toString() && role !== 'admin') {
      throw new Error('Not authorized to view this order');
    }

    return order;
  }

  async cancelOrder(orderId, userId) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.user.toString() !== userId.toString()) {
      throw new Error('Not authorized to cancel this order');
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      throw new Error(
        `Order cannot be cancelled in its current state (${order.orderStatus})`
      );
    }

    order.orderStatus = 'cancelled';
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    return order;
  }

  async getAllOrders({ status, page = 1, limit = 20 }) {
    const query = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return {
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async updateOrderStatus(orderId, status) {
    const validStatuses = [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid order status: ${status}`);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = status;

    if (status === 'delivered') {
      order.paymentStatus = 'completed';
    }

    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await order.save();
    return order;
  }
}

module.exports = new OrderService();
