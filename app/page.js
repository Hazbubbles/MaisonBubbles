import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Nos coffrets cadeaux</h1>
        <p className="mt-2 text-zinc-600">
          Deux coffrets soigneusement composés, livrés directement chez vous.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
