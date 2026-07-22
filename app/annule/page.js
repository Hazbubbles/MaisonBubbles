import Link from "next/link";

export default function AnnulePage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Paiement annulé</h1>
      <p className="mt-3 text-zinc-600">
        Ta commande n&apos;a pas été validée. Ton panier est toujours là si tu veux réessayer.
      </p>
      <Link
        href="/panier"
        className="mt-6 inline-block rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Retour au panier
      </Link>
    </main>
  );
}
