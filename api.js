// api.js - All API calls here (Modular JS)

const BASE_URL = "https://fakestoreapi.com/products";

// GET all products using async/await fetch
export async function getProducts() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}

// GET products by category
export async function getProductsByCategory(category) {
  if (category === "all") return getProducts();
  const res = await fetch(`${BASE_URL}/category/${category}`);
  if (!res.ok) throw new Error("Failed to fetch category");
  return await res.json();
}
