import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { formatPrice } from "@/lib/products";

export default function ProductCard({ product }) {
  return (
    <div className="flex flex-col">
      <Link
        href={`/coffret/${product.id}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-brand/5"
      >
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </Link>

      <h3 className="mt-6 text-lg uppercase tracking-[0.15em] text-brand">
        <Link href={`/coffret/${product.id}`} className="hover:opacity-70">
          {product.name}
        </Link>
      </h3>

      <p className="mt-2 text-brand/80">{formatPrice(product.priceCents)}</p>

      <Link
        href={`/coffret/${product.id}`}
        className="mt-4 text-sm uppercase tracking-[0.15em] text-brand hover:opacity-70"
      >
        Découvrir →
      </Link>

      <AddToCartButton
        productId={product.id}
        className="mt-4 self-start text-sm uppercase tracking-[0.15em] text-brand/70 transition-opacity hover:opacity-100 hover:text-brand"
        prefix="+ "
      />
    </div>
  );
}
