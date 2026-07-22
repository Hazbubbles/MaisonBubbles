import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getProductById } from "@/lib/products";

export async function POST(request) {
  const { items } = await request.json();

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Le panier est vide." }, { status: 400 });
  }

  // On ne fait JAMAIS confiance aux prix envoyés par le navigateur : on
  // reconstruit les lignes de commande à partir de notre propre catalogue
  // (lib/products.js), en utilisant seulement les identifiants et quantités
  // reçus du client. Cela empêche quelqu'un de trafiquer les prix.
  let lineItems;
  try {
    lineItems = items.map(({ productId, quantity }) => {
      const product = getProductById(productId);
      if (!product) throw new Error(`Produit inconnu : ${productId}`);
      const safeQuantity = Math.max(1, Math.min(10, Number(quantity) || 1));

      return {
        quantity: safeQuantity,
        price_data: {
          currency: "eur",
          unit_amount: product.priceCents,
          product_data: {
            name: product.name,
            description: product.description,
          },
        },
      };
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const origin = request.headers.get("origin");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    // Demande automatiquement l'adresse de livraison du client.
    shipping_address_collection: {
      allowed_countries: ["FR", "BE", "CH", "LU"],
    },
    // Frais de livraison simples : gratuit. À adapter si besoin.
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "eur" },
          display_name: "Livraison standard",
        },
      },
    ],
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/annule`,
  });

  return NextResponse.json({ url: session.url });
}
