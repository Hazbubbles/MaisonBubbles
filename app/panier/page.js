"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

export default function PanierPage() {
  const { items, totalCents, updateQuantity, removeItem } = useCart();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState(null);

  async function handleCheckout() {
    setError(null);
    setIsRedirecting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible de démarrer le paiement.");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setIsRedirecting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Ton panier est vide</h1>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Voir les coffrets
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold">Mon panier</h1>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li
            key={item.product.id}
            className="flex items-center gap-4 rounded-xl border border-black/10 bg-white p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-50">
              <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-zinc-600">{formatPrice(item.product.priceCents)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="h-8 w-8 rounded-full border border-black/10 hover:bg-black/5"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="h-8 w-8 rounded-full border border-black/10 hover:bg-black/5"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.product.id)}
              className="text-sm text-zinc-500 underline hover:text-black"
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-6">
        <span className="text-lg font-medium">Total</span>
        <span className="text-xl font-semibold">{formatPrice(totalCents)}</span>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={isRedirecting}
        className="mt-6 w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {isRedirecting ? "Redirection vers le paiement…" : "Passer au paiement"}
      </button>
    </main>
  );
}
