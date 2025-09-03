export let cart = [];

// Cargar carrito desde localStorage
export function loadCart() {
    const storedCart = localStorage.getItem("cart");
    cart = storedCart ? JSON.parse(storedCart) : [];
    renderCart();
}

export function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    renderCart();
}

export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

export function renderCart() {
    const cartContainer = document.getElementById("cart-container");
    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    if (!cart.length) {
        cartContainer.innerHTML = "<p>Tu carrito está vacío</p>";
        return;
    }

    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <p>${item.title} x ${item.quantity}</p>
            <p>$${(item.price * item.quantity).toFixed(2)}</p>
            <button class="btn-remove" data-id="${item.id}">Eliminar</button>
        `;
        cartContainer.appendChild(div);
    });

    // Eventos para eliminar productos
    document.querySelectorAll(".btn-remove").forEach(btn => {
        btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
    });
}
