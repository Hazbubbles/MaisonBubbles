import Image from "next/image";

// Bandeau de confiance : photos de coffrets des années précédentes,
// à placer dans public/trust/trust-1.jpg à trust-5.jpg.
const photos = [
  { src: "/trust/trust-1.jpg", alt: "Coffret Maison Bubble's, édition précédente" },
  { src: "/trust/trust-2.jpg", alt: "Coffret Maison Bubble's, édition précédente" },
  { src: "/trust/trust-3.jpg", alt: "Coffret Maison Bubble's, édition précédente" },
  { src: "/trust/trust-4.jpg", alt: "Coffret Maison Bubble's, édition précédente" },
  { src: "/trust/trust-5.jpg", alt: "Coffret Maison Bubble's, édition précédente" },
];

export default function TrustBanner() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16 text-center">
      <p className="font-brand text-xl text-brand sm:text-2xl">
        Vous nous faites confiance depuis si longtemps, merci.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-5">
        {photos.map((photo, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-brand/5">
            <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
