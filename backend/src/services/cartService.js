const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartService {
  async getCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], totalPrice: 0 });
    }

    const validItems = cart.items.filter((item) => item.product != null);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      cart.calculateTotal();
      await cart.save();
    }

    return cart;
  }

  async addToCart(userId, { productId, quantity = 1 }) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error(`Insufficient stock. Only ${product.stock} units available.`);
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const effectivePrice =
      product.discountPrice > 0 && product.discountPrice < product.price
        ? product.discountPrice
        : product.price;

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (product.stock < newQty) {
        throw new Error(`Cannot add more. Total in cart would exceed stock (${product.stock}).`);
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = effectivePrice;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: effectivePrice,
      });
    }

    cart.calculateTotal();
    await cart.save();

    return await this.getCart(userId);
  }

  async updateItemQuantity(userId, productId, quantity) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    const qty = parseInt(quantity, 10);

    if (qty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(productId);
      if (product && product.stock < qty) {
        throw new Error(`Only ${product.stock} units available in stock`);
      }
      cart.items[itemIndex].quantity = qty;
    }

    cart.calculateTotal();
    await cart.save();

    return await this.getCart(userId);
  }

  async removeItem(userId, productId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    cart.calculateTotal();
    await cart.save();

    return await this.getCart(userId);
  }

  async clearCart(userId) {
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }
    return { items: [], totalPrice: 0 };
  }
}

module.exports = new CartService();
