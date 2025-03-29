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
  const session = useSession();

  // Load cart from database when user logs in
  useEffect(() => {
    if (session?.status === 'authenticated') {
      fetch('/api/cart')
        .then(res => res.json())
        .then(dbCart => {
          setCartProducts(dbCart || []);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [session?.status]);

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
    if (session?.status === 'authenticated') {
      setCartProducts([]);
      saveCartToDatabase([]);
    }
  }

  function removeCartProduct(indexToRemove) {
    if (session?.status === 'authenticated') {
      setCartProducts(prevCartProducts => {
        const newCartProducts = [...prevCartProducts];
        newCartProducts.splice(indexToRemove, 1);
        saveCartToDatabase(newCartProducts);
        return newCartProducts;
      });
      toast.success('Product removed');
    } else {
      toast.error('Please login to manage your cart');
    }
  }

  function addToCart(product, selectedSize = null, selectedExtras = []) {
    if (session?.status === 'authenticated') {
      setCartProducts(prevProducts => {
        const cartProduct = { ...product, selectedSize, selectedExtras };
        const newProducts = [...prevProducts, cartProduct];
        saveCartToDatabase(newProducts);
        return newProducts;
      });
    } else {
      toast.error('Please login to add items to cart');
    }
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