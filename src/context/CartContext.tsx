import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  cartItemId: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size?: string) => void;
  removeItem: (cartItemId: string) => void;
  deleteItem: (cartItemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, size?: string) => {
    setItems(prev => {
      const cartItemId = size ? `${product.id}-${size}` : product.id;
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item => 
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, cartItemId }];
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.cartItemId !== cartItemId);
    });
  };

  const deleteItem = (cartItemId: string) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, deleteItem, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
