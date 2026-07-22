"use client";

// Ce fichier gère l'état du panier pour tout le site.
// "use client" est nécessaire car on utilise useState/useEffect
// (fonctionnalités qui tournent dans le navigateur, pas sur le serveur).

import { createContext, useContext, useEffect, useState } from "react";
import { getProductById } from "@/lib/products";

const CartContext = createContext(null);
const STORAGE_KEY = "coffrets-cadeaux-panier";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ productId, quantity }]
  const [isLoaded, setIsLoaded] = useState(false);

  // Au premier chargement, on récupère le panier sauvegardé dans le navigateur.
  // Le rendu serveur ne peut pas lire localStorage, donc cette synchronisation
  // doit obligatoirement se faire après le montage, dans un effet.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // localStorage indisponible (ex: navigation privée) : on ignore
    }
    setIsLoaded(true);
  }, []);

  // À chaque changement du panier, on le sauvegarde
  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoaded]);

  function addItem(productId) {
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { productId, quantity: 1 }];
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }

  function removeItem(productId) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const detailedItems = items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCents = detailedItems.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0
  );

  const value = {
    items: detailedItems,
    totalItems,
    totalCents,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur de <CartProvider>");
  }
  return context;
}
