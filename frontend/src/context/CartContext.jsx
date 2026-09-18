import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('freshcart_local_cart');
    return saved ? JSON.parse(saved) : { items: [], totalPrice: 0 };
  });
  const [loading, setLoading] = useState(false);

  // Sync cart with backend when user is authenticated
  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.success && res.data.cart) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error('[CartContext] Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      const saved = localStorage.getItem('freshcart_local_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    }
  }, [isAuthenticated]);

  // Update local storage for guest
  const updateLocalCart = (newItems) => {
    const total = newItems.reduce((acc, item) => {
      const price = item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price || item.price;
      return acc + price * item.quantity;
    }, 0);

    const newCart = { items: newItems, totalPrice: total };
    setCart(newCart);
    localStorage.setItem('freshcart_local_cart', JSON.stringify(newCart));
    return newCart;
  };

  const addToCart = async (product, quantity = 1) => {
    const qty = Number(quantity);
    if (isAuthenticated) {
      try {
        const res = await cartService.addToCart(product._id, qty);
        if (res.success && res.data.cart) {
          setCart(res.data.cart);
          return res.data.cart;
        }
      } catch (err) {
        throw new Error(err.response?.data?.message || err.message || 'Could not add to cart');
      }
    } else {
      // Guest local cart
      const currentItems = [...cart.items];
      const existingIndex = currentItems.findIndex(
        (i) => (i.product?._id || i.product) === product._id
      );

      const price = product.discountPrice > 0 ? product.discountPrice : product.price;

      if (existingIndex > -1) {
        currentItems[existingIndex].quantity += qty;
      } else {
        currentItems.push({
          product,
          quantity: qty,
          price,
        });
      }

      return updateLocalCart(currentItems);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const qty = Number(quantity);
    if (isAuthenticated) {
      try {
        const res = await cartService.updateQuantity(productId, qty);
        if (res.success && res.data.cart) {
          setCart(res.data.cart);
          return res.data.cart;
        }
      } catch (err) {
        throw new Error(err.response?.data?.message || err.message || 'Could not update quantity');
      }
    } else {
      let currentItems = [...cart.items];
      if (qty <= 0) {
        currentItems = currentItems.filter(
          (i) => (i.product?._id || i.product) !== productId
        );
      } else {
        const item = currentItems.find(
          (i) => (i.product?._id || i.product) === productId
        );
        if (item) {
          item.quantity = qty;
        }
      }
      return updateLocalCart(currentItems);
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await cartService.removeFromCart(productId);
        if (res.success && res.data.cart) {
          setCart(res.data.cart);
          return res.data.cart;
        }
      } catch (err) {
        throw new Error(err.response?.data?.message || err.message || 'Could not remove item');
      }
    } else {
      const currentItems = cart.items.filter(
        (i) => (i.product?._id || i.product) !== productId
      );
      return updateLocalCart(currentItems);
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setCart({ items: [], totalPrice: 0 });
      } catch (err) {
        console.error('[CartContext] Error clearing cart:', err);
      }
    } else {
      setCart({ items: [], totalPrice: 0 });
      localStorage.removeItem('freshcart_local_cart');
    }
  };

  const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.totalPrice || 0;

  const value = {
    cart,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
