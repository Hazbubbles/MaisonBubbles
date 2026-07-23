// Section vidéo : montre l'intérieur des coffrets.
const VIDEO_URL = "/videos/interieur-coffret.mp4";

export default function VideoSection() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-medium tracking-tight text-brand">
          À l&apos;intérieur de nos coffrets
        </h2>
        <p className="mt-2 text-sm text-brand/70">
          Un aperçu en vidéo de ce qui vous attend une fois le coffret ouvert.
        </p>
      </div>
      <div className="mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-2xl shadow-lg shadow-black/10">
        <video controls className="h-full w-full object-cover" preload="metadata">
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
