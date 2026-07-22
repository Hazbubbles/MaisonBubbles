// Données des produits. C'est ici que tu remplaceras les vrais textes,
// prix et images une fois que tu les auras.
// IMPORTANT : les prix sont en centimes (4990 = 49,90 €) car c'est le format
// attendu par Stripe. Ne jamais utiliser de nombres à virgule pour l'argent.

export const products = [
  {
    id: "coffret-evasion",
    name: "Coffret Évasion",
    description:
      "Un coffret cadeau pensé pour offrir un moment de détente : thé, chocolats et petites attentions.",
    priceCents: 4990,
    image: "/products/coffret-evasion.svg",
  },
  {
    id: "coffret-prestige",
    name: "Coffret Prestige",
    description:
      "Notre coffret le plus complet, pour une occasion spéciale : une sélection de produits haut de gamme.",
    priceCents: 7990,
    image: "/products/coffret-prestige.svg",
  },
];

export function getProductById(id) {
  return products.find((product) => product.id === id);
}

export function formatPrice(cents) {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}
