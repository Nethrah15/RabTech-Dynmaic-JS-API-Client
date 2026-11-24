// app.js - DOM Logic, Filtering, Sorting, Cart State
import { getProducts } from "./api.js";

let allProducts = [];
let currentCategory = "all";

// LocalStorage - Load cart
let cart = JSON.parse(localStorage.getItem("rabtech_cart")) || [];
updateCartUI();

// 1. FETCH ON LOAD
async function loadProducts() {
  const loading = document.getElementById("loading");
  const skeleton = document.getElementById("skeleton");
  const errorEl = document.getElementById("error");
  loading.style.display = "block";
  skeleton.style.display = "block";
  errorEl.style.display = "none";

  try {
    allProducts = await getProducts();
    applyFilters();
  } catch (err) {
    errorEl.textContent = "❌ Error: Could not load products. Check your internet!";
    errorEl.style.display = "block";
  } finally {
    loading.style.display = "none";
    skeleton.style.display = "none";
  }
}

// 2. SEARCH + CATEGORY + SORT - Updates DOM without reload
window.applyFilters = function() {
  let filtered = [...allProducts];
  const search = document.getElementById("searchInput").value.toLowerCase();
  const sort = document.getElementById("sortSelect").value;

  // Real-time Search Filtering
  if (search) filtered = filtered.filter(p => p.title.toLowerCase().includes(search));

  // Category Tabs
  if (currentCategory !== "all") filtered = filtered.filter(p => p.category === currentCategory);

  // Sorting Logic
  if (sort === "low") filtered.sort((a,b) => a.price - b.price);
  if (sort === "high") filtered.sort((a,b) => b.price - a.price);
  if (sort === "az") filtered.sort((a,b) => a.title.localeCompare(b.title));

  renderProducts(filtered);
}

window.setCategory = function(cat) {
  currentCategory = cat;
  document.querySelectorAll("#categoryTabs button").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
  applyFilters();
}

// 3. RENDER DOM
function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  if (products.length === 0) {
    grid.innerHTML = "<p>No products found!</p>";
    return;
  }
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${p.image}" width="100">
      <h3>${p.title.slice(0,40)}...</h3>
      <p>${p.category} | ⭐ ${p.rating.rate}</p>
      <h4>$${p.price}</h4>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    grid.appendChild(div);
  });
}

// 4. CART + localStorage Caching
window.addToCart = function(id) {
  const product = allProducts.find(p => p.id === id);
  cart.push(product);
  localStorage.setItem("rabtech_cart", JSON.stringify(cart));
  updateCartUI();
  alert("Added to cart!");
}

window.clearCart = function() {
  cart = [];
  localStorage.removeItem("rabtech_cart");
  updateCartUI();
}

function updateCartUI() {
  document.getElementById("cartCount").textContent = cart.length;
  const list = document.getElementById("cartList");
  if (list) list.innerHTML = cart.map(c => `<li>${c.title.slice(0,30)} - $${c.price}</li>`).join("");
}

window.toggleCart = function() {
  const box = document.getElementById("cartBox");
  box.style.display = box.style.display === "none" ? "block" : "none";
}

// Real-time search
document.getElementById("searchInput").addEventListener("input", applyFilters);

loadProducts();
