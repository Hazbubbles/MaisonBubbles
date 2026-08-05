"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ productId, className, prefix = "" }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem(productId);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <button onClick={handleAdd} className={className}>
      {justAdded ? "Ajouté ✓" : `${prefix}Ajouter au panier`}
    </button>
  );
}
