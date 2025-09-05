import { escapeHtml } from './helpers.js';

export let cart = [];

/* ===========================
Utilidades visuales (toast)
   =========================== */
function showToast(message) {
    // Reutiliza o crea el contenedor .toast
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1600);
}

/* ===========================
Contador del carrito
   =========================== */
function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (!cartCountElement) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems > 0 ? String(totalItems) : "";
}

/* =========================== Persistencia
   =========================== */
function saveCart() {
    if (cart.length === 0) {
        localStorage.removeItem("cart");
    } else {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    updateCartCount();
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cart } }));
}

/* ===========================
Carga inicial
   =========================== */
export function loadCart() {
    const storedCart = localStorage.getItem("cart");
    cart = storedCart ? JSON.parse(storedCart) : [];
    updateCartCount();
    renderCart();
    window.dispatchEvent(new CustomEvent("cartLoaded", { detail: { cart } }));
    return cart;
}

/* ===========================
API pública (agregar / remover)
   =========================== */
export function addToCartFromCart(product) {
    if (!product || typeof product.id === 'undefined') return;

    const existing = cart.find(i => i.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        const { id, title, price, image } = product;
        cart.push({ id, title, price, image, quantity: 1 });
    }
    saveCart();
    renderCart();
    showToast("Agregado correctamente");
}

export function removeFromCart(productId) {
    const before = cart.length;
    cart = cart.filter(i => i.id !== productId);
    if (cart.length !== before) {
        saveCart();
        renderCart();
    }
}

/* ===========================
Render del carrito
   =========================== */
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
        <p class="item-price">$${Number(item.price).toFixed(2)}</p>
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

    // Eventos de cantidad
    cartContainer.querySelectorAll(".btn-decrease").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if (!item) return;

            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Si estaba en 1 y resto, elimino el producto del carrito
                cart = cart.filter(i => i.id !== id);
            }

            saveCart();   // guarda o borra localStorage si queda vacío
            renderCart(); // re-renderiza (si queda vacío mostrará la vista vacía)
        });
    });

    cartContainer.querySelectorAll(".btn-increase").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity += 1;
                saveCart();
                renderCart();
            }
        });
    });
}

/* ===========================
Toggle de vistas
   =========================== */
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

    updateCartCount();
}

/* ===========================
Inicialización
   =========================== */
export function initCart() {
    loadCart();

    // Soporte: si products.js emite un evento para agregar
    window.addEventListener('addToCartRequest', (e) => {
        const product = e?.detail?.product;
        if (prouct) addToCartFromCart(product);
    });

    const btnCart = document.getElementById("btnCart");
    if (btnCart) {
        btnCart.addEventListener("click", () => toggleCartView());
    }
}

document.addEventListener("DOMContentLoaded", initCart);

/* ===========================
Sincronía global
   =========================== */
window.addEventListener("cartUpdated", (e) => {
    cart = e?.detail?.cart || JSON.parse(localStorage.getItem("cart") || "[]");
    updateCartCount();
    const cartContainer = document.getElementById("cart-container");
    if (cartContainer?.classList.contains("active")) {
        renderCart();
    }
});
