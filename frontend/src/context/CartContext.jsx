import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book, qty = 1) => {
    setCartItems(prev => {
      const existItem = prev.find(x => x.book === book._id);
      if (existItem) {
        return prev.map(x => 
          x.book === existItem.book ? { ...book, book: book._id, qty: x.qty + qty } : x
        );
      } else {
        return [...prev, { ...book, book: book._id, qty }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(x => x.book !== id));
  };

  const updateQty = (id, qty) => {
    setCartItems(prev => prev.map(x => x.book === id ? { ...x, qty } : x));
  };

  const clearCart = () => setCartItems([]);

  const value = { cartItems, addToCart, removeFromCart, updateQty, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
