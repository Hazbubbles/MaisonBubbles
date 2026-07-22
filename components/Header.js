"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="border-b border-brand/10 bg-ecru">
      <div className="relative mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-6 py-5">
        <span aria-hidden="true" />

        <Link
          href="/"
          className="font-brand justify-self-center text-2xl font-light uppercase tracking-[0.25em] text-brand"
        >
          Maison Bubble&apos;s
        </Link>

        <Link
          href="/panier"
          className="font-brand flex flex-col items-center justify-self-end text-brand"
        >
          <span className="relative flex h-9 w-9 items-center justify-center">
            <svg
              viewBox="0 0 64 72"
              className="h-9 w-9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 26 V18 a12 12 0 0 1 24 0 v8"
                stroke="var(--color-brand)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <rect x="8" y="24" width="48" height="40" rx="6" fill="var(--color-brand)" />
            </svg>
            <span className="absolute top-[14px] text-[11px] font-medium text-ecru">
              {totalItems}
            </span>
          </span>
          <span className="mt-1 text-center text-[10px] uppercase leading-tight tracking-[0.15em]">
            Mon
            <br />
            Panier
          </span>
        </Link>
      </div>
    </header>
  );
}
