'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {product.category}
          </span>
          <span className="font-bold text-slate-900 text-lg">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-slate-900 text-xl group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      <button
        onClick={() => addToCart(product)}
        className="mt-6 w-full bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm active:scale-[0.98]"
      >
        Add to Cart
      </button>
    </div>
  );
}