'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
          MyStore<span className="text-indigo-600">.</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            + Add Product
          </Link>

          <button className="relative flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors">
            <span>🛒 Cart</span>
            {totalItems > 0 && (
              <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}