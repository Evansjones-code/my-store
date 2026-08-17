"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`${API_URL}/orders`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 py-10 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-900">
            MyStore<span className="text-indigo-600">.</span>
          </Link>
          <Link href="/" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            ← Back to Store
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">Customer Order History</h1>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading orders...</div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 p-4 text-xs font-medium text-red-600 border border-red-200">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-3xl mb-2">📦</p>
            <p className="text-base font-bold text-slate-800">No orders placed yet</p>
            <p className="mt-1 text-xs text-slate-400 mb-6">Complete a checkout to see your orders here.</p>
            <Link
              href="/"
              className="inline-block rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <span className="text-xs font-bold text-indigo-600">Order #{order.id}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {order.customer_name} ({order.customer_email})
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Amount</span>
                    <span className="text-base font-extrabold text-slate-900">${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-700">Items Ordered:</p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                      <span>{item.product_name} × {item.quantity}</span>
                      <span className="font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}