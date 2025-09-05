// =====================
// js/cart.js
// =====================

import { escapeHtml } from './helpers.js';

export let cart = [];

/**
 * Contador del carrito
 */
function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (!cartCountElement) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCountElement.textContent = totalItems > 0 ? totalItems : "";
}

/**
 * Cargar carrito desde localStorage
 */
export function loadCart() {
    const storedCart = localStorage.getItem("cart");
    cart = storedCart ? JSON.parse(storedCart) : [];
    updateCartCount();
    renderCart();
    window.dispatchEvent(new CustomEvent("cartLoaded", { detail: { cart } }));
    return cart;
}

/**
 * Guardar carrito en localStorage
 */
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cart } }));
}


/**
 * Renderizar el carrito
 */
export function renderCart() {
    const cartContainer = document.getElementById("cart-container");
    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    if (!cart.length) {
        cartContainer.innerHTML = `
    <div class="empty-cart">
        <p>Tu carrito está vacío</p>
        <p class="empty-cart-subtitle">¡Agrega algunos productos para comenzar!</p>
    </div>
    `;
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const headerDiv = document.createElement("div");
    headerDiv.className = "cart-header";
    headerDiv.innerHTML = `<h3>Tu carrito (${cart.reduce((s, i) => s + i.quantity, 0)} items)</h3>`;
    cartContainer.appendChild(headerDiv);

    const itemsContainer = document.createElement("div");
    itemsContainer.className = "cart-items";

    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
      <img src="${item.image}" alt="${escapeHtml(item.title)}" class="cart-item-img">
      <div class="cart-item-info">
        <h4>${escapeHtml(item.title)}</h4>
        <p class="item-price">$${item.price.toFixed(2)}</p>
        <div class="quantity-controls">
          <button class="btn-decrease" data-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="btn-increase" data-id="${item.id}">+</button>
        </div>
        <p class="item-subtotal">Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    `;
        itemsContainer.appendChild(div);
    });

    cartContainer.appendChild(itemsContainer);

    const footerDiv = document.createElement("div");
    footerDiv.className = "cart-footer";
    footerDiv.innerHTML = `<div class="cart-total"><strong>Total: $${total.toFixed(2)}</strong></div>`;
    cartContainer.appendChild(footerDiv);

    cartContainer.querySelectorAll(".btn-decrease").forEach(btn => {
        btn.addEventListener("click", () => {
            const item = cart.find(i => i.id === Number(btn.dataset.id));
            if (item) {
                item.quantity = Math.max(1, item.quantity - 1);
                saveCart();
                renderCart();
            }
        });
    });

    cartContainer.querySelectorAll(".btn-increase").forEach(btn => {
        btn.addEventListener("click", () => {
            const item = cart.find(i => i.id === Number(btn.dataset.id));
            if (item) {
                item.quantity += 1;
                saveCart();
                renderCart();
            }
        });
    });
}

/**
 * Toggle carrito
 */
function toggleCartView(showCart = null) {
    const productsContainer = document.getElementById("product-container");
    const cartContainer = document.getElementById("cart-container");
    const categoriesSection = document.querySelector(".categories-carousel");
    if (!productsContainer || !cartContainer) return;

    const isShowing = cartContainer.classList.contains("active");
    const shouldShow = showCart !== null ? showCart : !isShowing;

    if (shouldShow) {
        cartContainer.classList.add("active");
        productsContainer.classList.add("hidden");
        if (categoriesSection) categoriesSection.classList.add("hidden");
        renderCart();
    } else {
        cartContainer.classList.remove("active");
        productsContainer.classList.remove("hidden");
        if (categoriesSection) categoriesSection.classList.remove("hidden");
    }

    // Forzar actualización del contador en cada toggle
    updateCartCount();
}

/**
 * Init
 */
export function initCart() {
    loadCart();
    const btnCart = document.getElementById("btnCart");
    if (btnCart) {
        btnCart.addEventListener("click", () => toggleCartView());
    }
}

document.addEventListener("DOMContentLoaded", initCart);

// Sincronía global
window.addEventListener("cartUpdated", (e) => {
    cart = e?.detail?.cart || JSON.parse(localStorage.getItem("cart") || "[]");
    updateCartCount();
    const cartContainer = document.getElementById("cart-container");
    if (cartContainer?.classList.contains("active")) {
        renderCart();
    }
});
