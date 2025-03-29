'use client';
import { SessionProvider, useSession } from 'next-auth/react';
import toast from "react-hot-toast";
import { createContext, useEffect, useState } from 'react';

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = cartProduct.basePrice;
  if (cartProduct.selectedSize) {
    price += cartProduct.selectedSize.price;
  }
  if (cartProduct.selectedExtras?.length > 0) {
    for (const extra of cartProduct.selectedExtras) {
      price += extra.price;
    }
  }
  return price;
}

export function AppProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const ls = typeof window !== 'undefined' ? window.localStorage : null;
  const session = useSession();

  // Load cart from localStorage on mount
  useEffect(() => {
    if (ls) {
      const localCart = JSON.parse(ls.getItem('cart') || '[]');
      setCartProducts(localCart);
      setIsLoading(false);
    }
  }, [ls]);

  // Load cart from database when user logs in
  useEffect(() => {
    if (session?.status === 'authenticated') {
      fetch('/api/cart')
        .then(res => res.json())
        .then(dbCart => {
          if (dbCart?.length > 0) {
            setCartProducts(prev => {
              // Merge with existing cart
              const merged = [...prev, ...dbCart];
              // Remove duplicates
              const unique = merged.filter((item, index) => {
                const stringified = JSON.stringify(item);
                return index === merged.findIndex(obj => JSON.stringify(obj) === stringified);
              });
              saveCartProductsToLocalStorage(unique);
              return unique;
            });
          }
        });
    }
  }, [session?.status]);

  function saveCartProductsToLocalStorage(cartProducts) {
    if (ls) {
      ls.setItem('cart', JSON.stringify(cartProducts));
    }
  }

  function saveCartToDatabase(cartProducts) {
    if (session?.status === 'authenticated') {
      fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: cartProducts }),
      });
    }
  }

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
    saveCartToDatabase([]);
  }

  function removeCartProduct(indexToRemove) {
    setCartProducts(prevCartProducts => {
      const newCartProducts = [...prevCartProducts];
      newCartProducts.splice(indexToRemove, 1);
      saveCartProductsToLocalStorage(newCartProducts);
      saveCartToDatabase(newCartProducts);
      return newCartProducts;
    });
    toast.success('Product removed');
  }

  function addToCart(product, selectedSize = null, selectedExtras = []) {
    setCartProducts(prevProducts => {
      const cartProduct = { ...product, selectedSize, selectedExtras };
      const newProducts = [...prevProducts, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      saveCartToDatabase(newProducts);
      return newProducts;
    });
  }

  return (
    <SessionProvider>
      <CartContext.Provider value={{
        cartProducts, setCartProducts,
        addToCart, removeCartProduct, clearCart,
        isLoading,
      }}>
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}