const API_BASE_URL = "http://127.0.0.1:8000";

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (error) {
    console.error("API Error (fetchProducts):", error);
    return [];
  }
}

export async function fetchProductById(id: string | number) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`API Error (fetchProductById ${id}):`, error);
    return null;
  }
}

export async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch orders");
    return await res.json();
  } catch (error) {
    console.error("API Error (fetchOrders):", error);
    return [];
  }
}

export async function createOrder(orderData: {
  customer_name: string;
  customer_email: string;
  items: { product_id: number; quantity: number }[];
}) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to submit order");
  }

  return await res.json();
}