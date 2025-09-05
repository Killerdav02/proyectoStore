// js/products.js

import { fetchProducts } from './api.js';
import { escapeHtml, showLoading, hideLoading, showError } from './helpers.js';
// Import flexible: no falla aunque no exista el export nombrado
import * as Cart from './cart.js';

// ⭐ FAVORITOS
import {
    initFavorites,
    toggleFavorite,
    isFavorite,
    getFavorites
} from './favorites.js';

let allProducts = [];       // cache local de productos
let showingSaved = false;   // ⭐ FAVORITOS: estado de vista

// ---------- Fallback seguro si no existe Cart.addToCartFromCart ----------
function addToCartSafe(product) {
    try {
        // 1) Si el módulo cart.js sí expone una función conocida.
        if (Cart && typeof Cart.addToCartFromCart === 'function') {
            Cart.addToCartFromCart(product);
            return;
        }
        if (Cart && typeof Cart.addToCart === 'function') {
            Cart.addToCart(product);
            return;
        }
    } catch (_) {
        // continúa con fallback
    }

    // 2) Fallback: actualiza localStorage y notifica a la app
    const key = 'cart';
    const stored = localStorage.getItem(key);
    let cartArr = stored ? JSON.parse(stored) : [];

    const idx = cartArr.findIndex(i => i.id === product.id);
    if (idx >= 0) {
        cartArr[idx].quantity = (cartArr[idx].quantity || 1) + 1;
    } else {
        const { id, title, price, image } = product;
        cartArr.push({ id, title, price, image, quantity: 1 });
    }

    localStorage.setItem(key, JSON.stringify(cartArr));

    // Notifica a quien escuche
    window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { cart: cartArr, action: 'add', productId: product.id }
    }));
}

// ------------------------------------------------------------------------

/**
 * Inicializar productos al cargar la página
 */
export async function initProducts() {
    const productsContainer = document.getElementById("product-container");
    if (!productsContainer) return;

    try {
        showLoading(productsContainer);
        allProducts = await fetchProducts();
        renderProducts(allProducts);
    } catch (err) {
        showError(productsContainer, err);
    } finally {
        hideLoading(productsContainer);
    }

    // ⭐ FAVORITOS: inicializar y wiring del botón Saved
    initFavorites({
        onShowSaved: () => {
            showingSaved = true;
            renderProducts(getFavorites());
        },
        onShowAll: () => {
            showingSaved = false;
            renderProducts(allProducts);
        }
    });

    // ⭐ FAVORITOS: re-render según vista actual
    window.addEventListener("favoritesUpdated", () => {
        if (showingSaved) {
            renderProducts(getFavorites());
        } else {
            renderProducts(allProducts);
        }
    });
}

/** Obtener todos los productos en memoria */
export function getAllProducts() {
    return allProducts;
}

/** Renderizar productos dinámicamente */
export function renderProducts(products) {
    const productsContainer = document.getElementById("product-container");
    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    if (!products || !products.length) {
        productsContainer.innerHTML = "<p>No se encontraron productos</p>";
        return;
    }

    products.forEach(p => {
        const card = document.createElement("article");
        card.className = "product-card";

        const favSrc = isFavorite(p.id)
            ? "./src/images/heart-red.svg"
            : "./src/images/heart-black.svg";

        card.innerHTML = `
    <div class="product-thumb">
        <img src="${p.image}" alt="${escapeHtml(p.title)}">
        <!-- ⭐ FAVORITOS -->
        <button class="btn-fav" type="button" data-id="${p.id}" title="Guardar en favoritos" aria-pressed="${isFavorite(p.id)}">
            <img src="${favSrc}" alt="favorite" class="heart-icon">
        </button>
    </div>
    <h3>${escapeHtml(p.title)}</h3>
    <p class="price">$${Number(p.price).toFixed(2)}</p>
    <button class="btn-add" type="button" data-id="${p.id}">
        <img src="./src/images/add_shopping_cart.svg" alt="Agregar al carrito">
    </button>
    `;
        productsContainer.appendChild(card);

        //Agregar al carrito
        const addBtn = card.querySelector(".btn-add");
        addBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCartSafe(p);
        });

        //FAVORITOS
        const favBtn = card.querySelector(".btn-fav");
        const favIcon = favBtn.querySelector(".heart-icon");

        favBtn.addEventListener("click", () => {
            toggleFavorite(p);
            const active = isFavorite(p.id);
            favBtn.setAttribute("aria-pressed", String(active));
            favIcon.src = active
                ? "./src/images/heart-red.svg"
                : "./src/images/heart-black.svg";

            if (showingSaved) {
                renderProducts(getFavorites());
            }
        });
    });
}
