"use client";

import { useCart } from "../../context/CartContext";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full rounded-2xl bg-indigo-600 py-3.5 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-500 active:scale-[0.98]"
    >
      Add to Shopping Cart
    </button>
  );
}