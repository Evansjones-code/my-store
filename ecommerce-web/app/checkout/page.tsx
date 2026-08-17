"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

interface PlacedOrder {
  id: number;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  items: {
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
  }[];
}

export default function CheckoutPage() {
  const { cart, totalAmount, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<PlacedOrder | null>(null);

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerEmail.trim()) {
      setError("Please enter both your full name and email address.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: customerName,
        customer_email: customerEmail,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("http://127.0.0.1:8000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to place order.");
      }

      const orderData: PlacedOrder = await response.json();
      clearCart();
      setCompletedOrder(orderData);
    } catch (err: any) {
      console.error("Checkout submission error:", err);
      setError(err.message || "An error occurred while submitting your order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- ORDER SUCCESS VIEW ---
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 sm:p-12 shadow-sm border border-slate-200 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold">
            ✓
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Order Confirmed!</h2>
          <p className="mt-1 text-sm text-slate-500">
            Order <span className="font-semibold text-slate-800">#{completedOrder.id}</span> has been successfully placed.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left border border-slate-100">
            <p className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Customer:</span> {completedOrder.customer_name} ({completedOrder.customer_email})
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Paid</span>
              <span>${completedOrder.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/"
            className="mt-8 inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // --- EMPTY CART VIEW ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="text-center bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-md w-full">
          <p className="text-4xl mb-3">🛒</p>
          <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">Add items to your cart before proceeding to checkout.</p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // --- MAIN CHECKOUT FORM & SUBMIT BUTTON ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900">
            MyStore<span className="text-indigo-600">.</span>
          </Link>
          <Link href="/" className="text-xs font-semibold text-slate-600 hover:text-indigo-600">
            ← Back to Store
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmitOrder}
              className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
            >
              <h2 className="text-lg font-bold text-slate-900 mb-4">Customer Details</h2>

              {error && (
                <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* RENDERED SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 px-6 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Submitting Order...</span>
                  </>
                ) : (
                  <span>Place Order • ${totalAmount.toFixed(2)}</span>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Cart Items ({cart.length})</h2>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between font-bold text-sm text-slate-900">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}