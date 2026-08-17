"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    totalAmount,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
            <button
              onClick={closeDrawer}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-lg text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-base font-medium">Your cart is empty</p>
                <p className="text-xs mt-1">Add items to see them here.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50/50"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs font-bold text-indigo-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 border rounded-lg bg-white px-2 py-0.5 border-slate-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-xs font-bold text-slate-600 hover:text-slate-900"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-xs font-bold text-slate-600 hover:text-slate-900"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Link */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
              <div className="flex justify-between items-center text-slate-900">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="block w-full rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}