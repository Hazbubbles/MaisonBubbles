import Stripe from "stripe";

// La clé secrète ne doit JAMAIS être exposée au navigateur.
// Elle vit uniquement dans .env.local (en local) ou dans les variables
// d'environnement Vercel (en production), et n'est utilisée que côté serveur.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
