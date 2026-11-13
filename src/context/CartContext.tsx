import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types/index.ts';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => { success: boolean; message: string };
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingPrice: number;
  totalPrice: number;
  freeShippingThreshold: number;
  amountUntilFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 50.0;
const STANDARD_SHIPPING_FEE = 9.99;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('novamart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('novamart_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number = 1): { success: boolean; message: string } => {
    if (product.stockQuantity <= 0) {
      return { success: false, message: `"${product.name}" is currently out of stock.` };
    }

    const existingIndex = items.findIndex(item => item.product._id === product._id);

    if (existingIndex > -1) {
      const currentQty = items[existingIndex].quantity;
      const targetQty = currentQty + quantity;

      if (targetQty > product.stockQuantity) {
        return {
          success: false,
          message: `Cannot add more. Only ${product.stockQuantity} units available in stock.`
        };
      }

      const updated = [...items];
      updated[existingIndex].quantity = targetQty;
      setItems(updated);
      return { success: true, message: `Updated quantity for "${product.name}" in your cart.` };
    } else {
      if (quantity > product.stockQuantity) {
        return {
          success: false,
          message: `Only ${product.stockQuantity} items in stock.`
        };
      }
      setItems(prev => [...prev, { product, quantity }]);
      return { success: true, message: `Added "${product.name}" to your cart.` };
    }
  };

  const updateQuantity = (productId: string, quantity: number): { success: boolean; message?: string } => {
    if (quantity <= 0) {
      removeItem(productId);
      return { success: true, message: 'Item removed from cart' };
    }

    const item = items.find(i => i.product._id === productId);
    if (!item) return { success: false, message: 'Item not in cart' };

    if (quantity > item.product.stockQuantity) {
      return {
        success: false,
        message: `Maximum available stock is ${item.product.stockQuantity}`
      };
    }

    setItems(prev =>
      prev.map(i => (i.product._id === productId ? { ...i, quantity } : i))
    );
    return { success: true };
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.product._id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = Number(
    items.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)
  );

  const shippingPrice = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

  const totalPrice = Number((subtotal + shippingPrice).toFixed(2));

  const amountUntilFreeShipping = Math.max(0, Number((FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)));

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
        shippingPrice,
        totalPrice,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountUntilFreeShipping
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
