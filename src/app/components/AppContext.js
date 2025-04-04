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

  // Load cart from database when user logs in
  useEffect(() => {
    if (session?.status === 'authenticated') {
      fetch('/api/cart')
        .then(res => res.json())
        .then(dbCart => {
          setCartProducts(dbCart || []);
          setIsLoading(false);
        });
    } else if (session?.status === 'unauthenticated') {
      setCartProducts([]);
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

  function updateCartItem(index, updatedItem) {
    if (session?.status === 'authenticated') {
      setCartProducts(prevProducts => {
        const newProducts = [...prevProducts];
        newProducts[index] = updatedItem;
        saveCartToDatabase(newProducts);
        return newProducts;
      });
      toast.success('Item updated successfully');
    } else {
      toast.error('Please login to manage your cart');
    }
  }

  function updateCartItemQuantity(product, newQuantity) {
    if (session?.status === 'authenticated') {
      setCartProducts(prevProducts => {
        // Find all matching products in the cart
        const matchingProducts = prevProducts.filter(p => 
          p.name === product.name && 
          p.selectedSize?.name === product.selectedSize?.name &&
          JSON.stringify(p.selectedExtras) === JSON.stringify(product.selectedExtras)
        );
        
        const currentQuantity = matchingProducts.length;
        
        if (newQuantity === currentQuantity) return prevProducts;
        
        let newProducts = [...prevProducts];
        
        if (newQuantity > currentQuantity) {
          // Add more items
          const itemToAdd = {
            ...product,
            selectedSize: product.selectedSize || { name: 'Regular', price: 0 },
            selectedExtras: product.selectedExtras || []
          };
          
          for (let i = 0; i < newQuantity - currentQuantity; i++) {
            newProducts.push(itemToAdd);
          }
        } else {
          // Remove items from the end
          const numToRemove = currentQuantity - newQuantity;
          const indicesToRemove = matchingProducts
            .map((_, index) => prevProducts.indexOf(matchingProducts[index]))
            .slice(-numToRemove)
            .sort((a, b) => b - a); // Sort in descending order to remove from end
          
          indicesToRemove.forEach(index => {
            newProducts.splice(index, 1);
          });
        }
        
        saveCartToDatabase(newProducts);
        return newProducts;
      });
      toast.success('Quantity updated');
    } else {
      toast.error('Please login to manage your cart');
    }
  }

  return (
    <SessionProvider>
      <CartContext.Provider value={{
        cartProducts, setCartProducts,
        addToCart, removeCartProduct, clearCart,
        updateCartItem, updateCartItemQuantity,
        isLoading,
      }}>
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}