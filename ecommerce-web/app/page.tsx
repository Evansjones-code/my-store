"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "./context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { addToCart, totalCount, openDrawer } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category || "General"));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (product.category || "General").toLowerCase() ===
          selectedCategory.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-slate-900 group"
          >
            MyStore<span className="text-indigo-600 transition-colors group-hover:text-violet-600">.</span>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href="/admin"
              className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-2 rounded-xl"
            >
              + Add Product
            </Link>

            <Link
              href="/orders"
              className="hidden sm:inline-block text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Order History
            </Link>

            <button
              onClick={openDrawer}
              className="relative flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-500 transition-all active:scale-95 cursor-pointer"
            >
              <span>🛒 Cart</span>
              {totalCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-indigo-600 shadow-sm">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Vibrant Gradient Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 sm:p-12 text-white shadow-xl shadow-indigo-500/15">
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          
          <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold tracking-wide backdrop-blur-md border border-white/10">
            FastAPI + Next.js App
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
            Discover Exceptional Products
          </h2>
          <p className="mt-3 max-w-xl text-indigo-100 text-base sm:text-lg leading-relaxed">
            A high-performance e-commerce catalog backed by secure storage and clean Tailwind styling.
          </p>
        </div>
      </section>

      {/* Main Catalog View */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-indigo-200 scale-105"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200/80 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <span className="absolute left-3.5 top-3 text-slate-400 text-sm">
              🔍
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">
            {selectedCategory === "All" ? "Featured Catalog" : selectedCategory}
          </h3>
          <span className="text-sm font-medium text-slate-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "item" : "items"}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 animate-pulse rounded-3xl bg-slate-200/80"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200"
              >
                <div>
                  <div className="mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-100 flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">
                        No Image
                      </span>
                    )}
                  </div>

                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 tracking-wide">
                      {product.category || "General"}
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
                    </span>
                  </div>

                  <Link href={`/products/${product.id}`}>
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {product.name}
                    </h4>
                  </Link>

                  <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-6 w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-600 active:scale-[0.98] cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center bg-white shadow-sm">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-slate-800 font-bold text-base">
              No matching products found.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try clicking <Link href="/admin" className="text-indigo-600 underline font-semibold">Add Product</Link> above to publish your first item!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}