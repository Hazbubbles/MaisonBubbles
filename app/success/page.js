import Link from "next/link";
import { stripe } from "@/lib/stripe";
import ClearCartOnMount from "@/components/ClearCartOnMount";

export default async function SuccessPage({ searchParams }) {
  const { session_id: sessionId } = await searchParams;

  let session = null;
  if (sessionId) {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  }

  const metadata = session?.metadata || {};
  const isDelivery = metadata.fulfillment === "livraison";
  const needsInvoice = metadata.needs_invoice === "oui";

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 text-center">
      <ClearCartOnMount />
      <h1 className="text-3xl font-semibold text-brand">Merci pour votre commande 🎁</h1>
      <p className="mt-3 text-brand/70">
        Votre paiement a bien été reçu. Un email de confirmation vous a été envoyé
        {session?.customer_details?.email ? ` à ${session.customer_details.email}` : ""}.
      </p>

      {isDelivery && metadata.delivery_address && (
        <div className="mt-8 rounded-xl border border-brand/10 bg-white p-6 text-left">
          <h2 className="mb-2 font-medium text-brand">Livraison à :</h2>
          <p className="text-sm text-brand/80">
            {metadata.delivery_name}
            <br />
            {metadata.delivery_address}
            <br />
            {metadata.delivery_postal_code} {metadata.delivery_city}
            <br />
            {metadata.delivery_country}
          </p>
        </div>
      )}

      {!isDelivery && (
        <div className="mt-8 rounded-xl border border-brand/10 bg-white p-6 text-left">
          <h2 className="mb-2 font-medium text-brand">Retrait en boutique</h2>
          <p className="text-sm text-brand/80">
            Votre commande sera à récupérer en boutique.
          </p>
        </div>
      )}

      {needsInvoice && metadata.billing_address && (
        <div className="mt-6 rounded-xl border border-brand/10 bg-white p-6 text-left">
          <h2 className="mb-2 font-medium text-brand">Facturé à :</h2>
          <p className="text-sm text-brand/80">
            {metadata.billing_name}
            <br />
            {metadata.billing_address}
            <br />
            {metadata.billing_postal_code} {metadata.billing_city}
            <br />
            {metadata.billing_country}
          </p>
        </div>
      )}

      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-ecru hover:opacity-90"
      >
        Retour à la boutique
      </Link>
    </main>
  );
}
