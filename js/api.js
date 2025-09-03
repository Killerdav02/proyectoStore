// =====================
// js/api.js
// =====================

import { showLoading, hideLoading, showError } from './helpers.js';

// Contendrá todos los productos cargados desde la API
let allProducts = [];

/**
 * Obtener productos desde Fake Store API
 * @returns {Promise<Array>} Lista de productos
 */
export async function fetchProducts() {
    const container = document.getElementById("product-container");
    try {
        showLoading(container);
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        allProducts = await res.json();
        return allProducts;
    } catch (err) {
        showError(container, err);
        return [];
    } finally {
        hideLoading(container);
    }
}

/**
 * Retornar todos los productos cargados en memoria
 * @returns {Array} Lista de productos
 */
export function getAllProducts() {
    return allProducts;
}
