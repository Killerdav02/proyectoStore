// =====================
// js/products.js
// =====================

import { fetchProducts, getAllProducts } from './api.js';
import { escapeHtml, showLoading, hideLoading, showError } from './helpers.js';
import { addToCart } from './cart.js';

const productsContainer = document.getElementById("product-container");

/**
 * Inicializar productos al cargar la página
 */
export async function initProducts() {
    try {
        showLoading(productsContainer);
        const products = await fetchProducts();
        renderProducts(products);
    } catch (err) {
        showError(productsContainer, err);
    } finally {
        hideLoading(productsContainer);
    }
}

/**
 * Renderizar productos dinámicamente en el contenedor
 * @param {Array} products Lista de productos a mostrar
 */
export function renderProducts(products) {
    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    if (!products.length) {
        productsContainer.innerHTML = "<p>No se encontraron productos</p>";
        return;
    }

    products.forEach(p => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${p.image}" alt="${escapeHtml(p.title)}">
            <h3>${escapeHtml(p.title)}</h3>
            <p class="price">$${Number(p.price).toFixed(2)}</p>
            <p class="rating">⭐ ${p.rating?.rate ?? "-"} (${p.rating?.count ?? 0})</p>
            <button class="btn-add" data-id="${p.id}">
                <img src="./src/images/add_shopping_cart.svg" alt="Agregar al carrito">
            </button>
        `;
        productsContainer.appendChild(card);

        // Evento para agregar al carrito
        card.querySelector(".btn-add").addEventListener("click", () => addToCart(p));
    });
}

/**
 * Renderizar todos los productos ya cargados
 */
export function renderAllProducts() {
    renderProducts(getAllProducts());
}
