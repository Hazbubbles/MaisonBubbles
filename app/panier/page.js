"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

const DELIVERY_FEE_PER_ITEM_CENTS = 1500;
const COUNTRIES = [
  { code: "FR", label: "France" },
  { code: "BE", label: "Belgique" },
  { code: "CH", label: "Suisse" },
  { code: "LU", label: "Luxembourg" },
];

const emptyAddress = { name: "", address: "", postalCode: "", city: "", country: "FR" };

export default function PanierPage() {
  const { items, totalItems, totalCents, updateQuantity, removeItem } = useCart();
  const [note, setNote] = useState("");
  const [fulfillment, setFulfillment] = useState("livraison");
  const [deliveryAddress, setDeliveryAddress] = useState(emptyAddress);
  const [needsInvoice, setNeedsInvoice] = useState(false);
  const [billingAddress, setBillingAddress] = useState(emptyAddress);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState(null);

  const deliveryFeeCents = fulfillment === "livraison" ? DELIVERY_FEE_PER_ITEM_CENTS * totalItems : 0;
  const grandTotalCents = totalCents + deliveryFeeCents;

  async function handleSubmit(e) {
    e.preventDefault();
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
          note,
          fulfillment,
          deliveryAddress: fulfillment === "livraison" ? deliveryAddress : null,
          needsInvoice,
          billingAddress: needsInvoice ? billingAddress : null,
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
        <h1 className="text-2xl font-semibold text-brand">Ton panier est vide</h1>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-ecru hover:opacity-90"
        >
          Voir les coffrets
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold text-brand">Mon panier</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li
              key={item.product.id}
              className="flex items-center gap-4 rounded-xl border border-brand/10 bg-white p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-ecru">
                <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-brand">{item.product.name}</p>
                <p className="text-sm text-brand/60">{formatPrice(item.product.priceCents)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="h-8 w-8 rounded-full border border-brand/20 text-brand hover:bg-brand/5"
                  aria-label="Diminuer la quantité"
                >
                  −
                </button>
                <span className="w-6 text-center text-brand">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="h-8 w-8 rounded-full border border-brand/20 text-brand hover:bg-brand/5"
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.product.id)}
                className="text-sm text-brand/50 underline hover:text-brand"
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>

        <div>
          <label htmlFor="note" className="mb-2 block text-sm font-medium text-brand">
            Ajouter une note pour le vendeur (optionnel)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-brand/20 bg-white p-3 text-sm text-brand outline-none focus:border-brand/50"
          />
        </div>

        <div className="flex items-center justify-between border-t border-brand/10 pt-4 text-brand">
          <span>Sous-total</span>
          <span className="font-medium">{formatPrice(totalCents)}</span>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-brand">Mode de réception</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setFulfillment("livraison")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors ${
                fulfillment === "livraison"
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-brand/20 text-brand/70 hover:bg-brand/5"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" strokeLinejoin="round" />
                <circle cx="7" cy="18" r="1.6" />
                <circle cx="17" cy="18" r="1.6" />
              </svg>
              Livraison (+15&nbsp;€ / coffret)
            </button>
            <button
              type="button"
              onClick={() => setFulfillment("retrait")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors ${
                fulfillment === "retrait"
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-brand/20 text-brand/70 hover:bg-brand/5"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 10v9h16v-9M2 10l2-6h16l2 6M2 10h20" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              Retrait en boutique (gratuit)
            </button>
          </div>
        </div>

        {fulfillment === "livraison" && (
          <AddressFields
            title="Adresse de livraison"
            value={deliveryAddress}
            onChange={setDeliveryAddress}
            required
          />
        )}

        <div>
          <p className="mb-3 text-sm font-medium text-brand">Besoin d&apos;une facture ?</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setNeedsInvoice(true)}
              className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                needsInvoice ? "border-brand bg-brand/5 text-brand" : "border-brand/20 text-brand/70 hover:bg-brand/5"
              }`}
            >
              Oui
            </button>
            <button
              type="button"
              onClick={() => setNeedsInvoice(false)}
              className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                !needsInvoice ? "border-brand bg-brand/5 text-brand" : "border-brand/20 text-brand/70 hover:bg-brand/5"
              }`}
            >
              Non
            </button>
          </div>
        </div>

        {needsInvoice && (
          <AddressFields
            title="Adresse de facturation"
            value={billingAddress}
            onChange={setBillingAddress}
            required
          />
        )}

        <div className="flex flex-col gap-1 border-t border-brand/10 pt-4">
          {fulfillment === "livraison" && (
            <div className="flex items-center justify-between text-sm text-brand/70">
              <span>Livraison ({totalItems} coffret{totalItems > 1 ? "s" : ""})</span>
              <span>{formatPrice(deliveryFeeCents)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-lg font-semibold text-brand">
            <span>Total</span>
            <span>{formatPrice(grandTotalCents)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isRedirecting}
          className="w-full rounded-full bg-brand px-5 py-3 text-sm font-medium text-ecru hover:opacity-90 disabled:opacity-50"
        >
          {isRedirecting ? "Redirection vers le paiement…" : "Procéder au paiement"}
        </button>
      </form>
    </main>
  );
}

function AddressFields({ title, value, onChange, required }) {
  function update(field, fieldValue) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-brand">{title}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Nom complet"
          value={value.name}
          onChange={(e) => update("name", e.target.value)}
          required={required}
          className="rounded-xl border border-brand/20 bg-white p-3 text-sm text-brand outline-none focus:border-brand/50 sm:col-span-2"
        />
        <input
          type="text"
          placeholder="Adresse"
          value={value.address}
          onChange={(e) => update("address", e.target.value)}
          required={required}
          className="rounded-xl border border-brand/20 bg-white p-3 text-sm text-brand outline-none focus:border-brand/50 sm:col-span-2"
        />
        <input
          type="text"
          placeholder="Code postal"
          value={value.postalCode}
          onChange={(e) => update("postalCode", e.target.value)}
          required={required}
          className="rounded-xl border border-brand/20 bg-white p-3 text-sm text-brand outline-none focus:border-brand/50"
        />
        <input
          type="text"
          placeholder="Ville"
          value={value.city}
          onChange={(e) => update("city", e.target.value)}
          required={required}
          className="rounded-xl border border-brand/20 bg-white p-3 text-sm text-brand outline-none focus:border-brand/50"
        />
        <select
          value={value.country}
          onChange={(e) => update("country", e.target.value)}
          className="rounded-xl border border-brand/20 bg-white p-3 text-sm text-brand outline-none focus:border-brand/50 sm:col-span-2"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
