import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import { products, getProductById, formatPrice } from "@/lib/products";

// Génère les pages des 2 coffrets au moment du build (plus rapide à charger).
export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};
  return {
    title: `${product.name} — Maison Bubble's`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <Link
        href="/"
        className="text-xs uppercase tracking-[0.15em] text-brand/60 hover:text-brand"
      >
        ← Retour aux coffrets
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <h1 className="font-brand text-4xl font-light text-brand sm:text-5xl">
            {product.name}
          </h1>

          <p className="mt-4 text-xl text-brand">{formatPrice(product.priceCents)}</p>

          <hr className="my-8 border-brand/15" />

          <p className="text-brand/80">{product.description}</p>

          {product.contents?.length > 0 && (
            <ul className="mt-6">
              {product.contents.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-brand/10 py-4 text-brand/90"
                >
                  <span className="text-brand/40">·</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          <AddToCartButton
            productId={product.id}
            className="mt-8 w-full bg-brand px-6 py-4 text-sm uppercase tracking-[0.15em] text-ecru transition-opacity hover:opacity-90"
          />

          <div className="mt-12 space-y-8">
            <section>
              <h2 className="text-sm uppercase tracking-[0.15em] text-brand">
                Remplacement des produits
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand/70">
                Nos coffrets mettent en avant des créations artisanales sélectionnées avec
                soin. Si un article venait à manquer, il pourra être remplacé par un produit
                similaire, de qualité et de valeur équivalentes ou supérieures.
              </p>
            </section>

            <section>
              <h2 className="text-sm uppercase tracking-[0.15em] text-brand">
                Carte manuscrite personnalisable
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand/70">
                Une carte avec enveloppe est incluse gratuitement. Vous pouvez la laisser
                vierge ou y ajouter un message manuscrit personnalisé.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
