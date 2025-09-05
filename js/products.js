// =====================
// js/products.js
// =====================

import { fetchProducts } from './api.js';
import { escapeHtml, showLoading, hideLoading, showError } from './helpers.js';

// ⭐ FAVORITOS: importar utilidades
import {
    initFavorites,
    toggleFavorite,
    isFavorite,
    getFavorites
} from './favorites.js';

let allProducts = [];       // cache local de productos
let showingSaved = false;   // ⭐ FAVORITOS: estado de vista

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

    // ⭐ FAVORITOS: inicializar módulo de favoritos y wiring del botón Saved
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

    // ⭐ FAVORITOS: si cambian los favoritos, re-render según vista actual
    window.addEventListener("favoritesUpdated", () => {
        if (showingSaved) {
            renderProducts(getFavorites());
        } else {
            // re-render para refrescar íconos (rojo/negro) en la vista general
            renderProducts(allProducts);
        }
    });
}

/**
 * Obtener todos los productos en memoria
 */
export function getAllProducts() {
    return allProducts;
}

/**
 * Renderizar productos dinámicamente
 */
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
        <!-- ⭐ FAVORITOS: botón corazón (negro/rojo según estado) -->
        <button class="btn-fav" data-id="${p.id}" title="Guardar en favoritos" aria-pressed="${isFavorite(p.id)}">
          <img src="${favSrc}" alt="favorite" class="heart-icon">
        </button>
      </div>
      <h3>${escapeHtml(p.title)}</h3>
      <p class="price">$${Number(p.price).toFixed(2)}</p>
      <button class="btn-add" data-id="${p.id}">
        <img src="./src/images/add_shopping_cart.svg" alt="Agregar al carrito">
      </button>
    `;
        productsContainer.appendChild(card);

        // Evento: agregar al carrito (como lo tenías)
        card.querySelector(".btn-add").addEventListener("click", () => addToCart(p));

        // ⭐ FAVORITOS: evento corazón
        const favBtn = card.querySelector(".btn-fav");
        const favIcon = favBtn.querySelector(".heart-icon");

        favBtn.addEventListener("click", () => {
            toggleFavorite(p);
            const active = isFavorite(p.id);
            favBtn.setAttribute("aria-pressed", String(active));
            favIcon.src = active
                ? "./src/images/heart-red.svg"
                : "./src/images/heart-black.svg";

            // Si estamos en vista "Saved", re-render para mostrar solo los actuales
            if (showingSaved) {
                renderProducts(getFavorites());
            }
        });
    });

    // (opcional) si usas contador de carrito, actualízalo aquí como ya hacías
    // updateCartCount();
}
