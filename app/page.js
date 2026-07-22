import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";
import TrustBanner from "@/components/TrustBanner";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <main className="w-full flex-1">
      <Hero />

      <section className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-2xl font-medium tracking-tight text-brand">Nos coffrets</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <VideoSection />

      <TrustBanner />
    </main>
  );
}
