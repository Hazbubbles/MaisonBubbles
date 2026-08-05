"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, productName }) {
  const [index, setIndex] = useState(0);

  function goTo(delta) {
    setIndex((current) => (current + delta + images.length) % images.length);
  }

  return (
    <div>
      {/* object-contain (et non object-cover) : les photos des coffrets sont
          tantôt en portrait, tantôt en paysage — on les affiche en entier
          plutôt que de les rogner. */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-brand/5">
        <Image
          src={images[index]}
          alt={`${productName} — photo ${index + 1}`}
          fill
          className="object-contain"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label="Photo précédente"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ecru/90 text-brand shadow hover:bg-ecru"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label="Photo suivante"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ecru/90 text-brand shadow hover:bg-ecru"
            >
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-xl border bg-brand/5 ${
                i === index ? "border-brand" : "border-transparent"
              }`}
            >
              <Image src={src} alt={`${productName} — miniature ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
