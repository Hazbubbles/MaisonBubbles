// Bandeau de confiance : à terme, remplacer les 5 cases par de vraies
// photos de coffrets des années précédentes (voir instructions données
// au client pour la marche à suivre).
const PLACEHOLDER_COUNT = 5;

export default function TrustBanner() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16 text-center">
      <p className="font-brand text-xl text-brand sm:text-2xl">
        Vous nous faites confiance depuis si longtemps, merci.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-5">
        {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-brand/30 bg-brand/5 text-xs text-brand/50"
          >
            Photo {i + 1}
          </div>
        ))}
      </div>
    </section>
  );
}
