import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
        >
          ← Back to Catalog
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-sm">
          {/* Image Handling */}
          <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-slate-400 font-medium text-sm">
                {product.category}
              </span>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg mb-3">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-black text-indigo-600 mb-6">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Interactive Add to Cart button */}
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}