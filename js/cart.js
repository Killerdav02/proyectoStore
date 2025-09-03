import { escapeHtml } from './helpers.js';

const cartContainer = document.getElementById("cart-container");
const cartCount = document.getElementById("cart-count"); // badge del carrito
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Inicializar carrito al cargar la página
export function loadCart() {
    renderCart();
    updateCartCount();
}

// Agregar producto al carrito
export function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    renderCart();
    updateCartCount();
    showNotification("✅ Agregado correctamente");
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Cambiar cantidad
function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity < 1) {
        cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    renderCart();
    updateCartCount();
}

// Calcular total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Actualizar badge del carrito
function updateCartCount() {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQuantity;

    // ocultar badge si está vacío
    cartCount.style.display = totalQuantity > 0 ? "inline-block" : "none";
}

// Renderizar carrito
function renderCart() {
    cartContainer.innerHTML = "";

    if (!cart.length) {
        cartContainer.innerHTML = "<p>El carrito está vacío</p>";
        return;
    }

    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.dataset.id = item.id;
        div.innerHTML = `
            <img src="${item.image}" alt="${escapeHtml(item.title)}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${escapeHtml(item.title)}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase">+</button>
                </div>
            </div>
        `;
        cartContainer.appendChild(div);

        div.querySelector(".increase").addEventListener("click", () => changeQuantity(item.id, 1));
        div.querySelector(".decrease").addEventListener("click", () => changeQuantity(item.id, -1));
    });

    // Mostrar total al final
    const totalDiv = document.createElement("div");
    totalDiv.className = "cart-total";
    totalDiv.innerHTML = `<h3>Total: $${calculateTotal().toFixed(2)}</h3>`;
    cartContainer.appendChild(totalDiv);
}

// ==========================
// Notificación flotante
// ==========================
function showNotification(message) {
    const notif = document.createElement("div");
    notif.className = "toast";
    notif.textContent = message;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.classList.add("show");
    }, 100);

    setTimeout(() => {
        notif.classList.remove("show");
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}
