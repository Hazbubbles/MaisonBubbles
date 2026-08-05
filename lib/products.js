// Données des produits. C'est ici que tu remplaceras les vrais textes,
// prix et images une fois que tu les auras.
// IMPORTANT : les prix sont en centimes (4990 = 49,90 €) car c'est le format
// attendu par Stripe. Ne jamais utiliser de nombres à virgule pour l'argent.

export const products = [
  {
    id: "coffret-cordoba",
    name: "Coffret Cordoba",
    description:
      "Un coffret cadeau pensé pour offrir un moment de détente : thé, chocolats et petites attentions.",
    priceCents: 24000,
    image: "/products/cordoba-1.jpg",
    // Photos de la galerie produit, dans l'ordre d'affichage du carrousel.
    images: [
      "/products/cordoba-1.jpg",
      "/products/cordoba-2.jpg",
      "/products/cordoba-3.jpg",
      "/products/cordoba-4.jpg",
    ],
    contents: [
      "Carte manuscrite",
      "Thé bio sélectionné",
      "Assortiment de chocolats",
      "Petite attention surprise",
    ],
  },
  {
    id: "coffret-jaipur",
    name: "Coffret Jaipur",
    description:
      "Notre coffret le plus complet, pour une occasion spéciale : une sélection de produits haut de gamme.",
    priceCents: 19500,
    image: "/products/jaipur-1.jpg",
    images: [
      "/products/jaipur-1.jpg",
      "/products/jaipur-2.jpg",
      "/products/jaipur-3.jpg",
      "/products/jaipur-4.jpg",
    ],
    contents: [
      "Carte manuscrite",
      "Sélection de produits haut de gamme",
      "Emballage soigné",
      "Attention personnalisée",
    ],
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
