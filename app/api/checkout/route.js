import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getProductById } from "@/lib/products";

const DELIVERY_FEE_PER_ITEM_CENTS = 1500;

function flattenAddress(prefix, address) {
  if (!address) return {};
  return {
    [`${prefix}_name`]: address.name || "",
    [`${prefix}_address`]: address.address || "",
    [`${prefix}_postal_code`]: address.postalCode || "",
    [`${prefix}_city`]: address.city || "",
    [`${prefix}_country`]: address.country || "",
  };
}

export async function POST(request) {
  const { items, note, fulfillment, deliveryAddress, needsInvoice, billingAddress } =
    await request.json();

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Le panier est vide." }, { status: 400 });
  }

  // On ne fait JAMAIS confiance aux prix (ni aux frais de livraison) envoyés
  // par le navigateur : on reconstruit tout à partir de notre propre
  // catalogue (lib/products.js) et de la quantité totale, en utilisant
  // seulement les identifiants/quantités reçus du client.
  let lineItems;
  let totalQuantity = 0;
  try {
    lineItems = items.map(({ productId, quantity }) => {
      const product = getProductById(productId);
      if (!product) throw new Error(`Produit inconnu : ${productId}`);
      const safeQuantity = Math.max(1, Math.min(10, Number(quantity) || 1));
      totalQuantity += safeQuantity;

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

  const isDelivery = fulfillment === "livraison";
  const deliveryFeeCents = isDelivery ? DELIVERY_FEE_PER_ITEM_CENTS * totalQuantity : 0;

  if (deliveryFeeCents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: deliveryFeeCents,
        product_data: {
          name: `Livraison (${totalQuantity} coffret${totalQuantity > 1 ? "s" : ""})`,
        },
      },
    });
  }

  const origin = request.headers.get("origin");

  // L'adresse de livraison/facturation est déjà collectée sur notre propre
  // page panier (pas besoin que Stripe la redemande). On la conserve comme
  // metadata, visible dans le tableau de bord Stripe pour chaque commande.
  const metadata = {
    fulfillment: fulfillment || "",
    needs_invoice: needsInvoice ? "oui" : "non",
    note: (note || "").slice(0, 500),
    ...flattenAddress("delivery", isDelivery ? deliveryAddress : null),
    ...flattenAddress("billing", needsInvoice ? billingAddress : null),
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    metadata,
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/annule`,
  });

  return NextResponse.json({ url: session.url });
}
