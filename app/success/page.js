import Link from "next/link";
import { stripe } from "@/lib/stripe";
import ClearCartOnMount from "@/components/ClearCartOnMount";

export default async function SuccessPage({ searchParams }) {
  const { session_id: sessionId } = await searchParams;

  let session = null;
  if (sessionId) {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 text-center">
      <ClearCartOnMount />
      <h1 className="text-3xl font-semibold">Merci pour votre commande 🎁</h1>
      <p className="mt-3 text-zinc-600">
        Votre paiement a bien été reçu. Un email de confirmation vous a été envoyé
        {session?.customer_details?.email ? ` à ${session.customer_details.email}` : ""}.
      </p>

      {session?.shipping_details?.address && (
        <div className="mt-8 rounded-xl border border-black/10 bg-white p-6 text-left">
          <h2 className="mb-2 font-medium">Livraison à :</h2>
          <p className="text-sm text-zinc-700">
            {session.shipping_details.name}
            <br />
            {session.shipping_details.address.line1}
            <br />
            {session.shipping_details.address.postal_code} {session.shipping_details.address.city}
            <br />
            {session.shipping_details.address.country}
          </p>
        </div>
      )}

      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Retour à la boutique
      </Link>
    </main>
  );
}
