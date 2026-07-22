"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

// Vide le panier une fois la commande payée, pour ne pas la retrouver
// encore présente si le client revient sur le site.
export default function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
