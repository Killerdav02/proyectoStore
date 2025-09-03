// =====================
// js/categories.js
// =====================

import { getAllProducts } from './api.js';
import { renderProducts } from './products.js';

// Seleccionar todos los elementos de categoría
const categoryItems = document.querySelectorAll(".category-item");
const menuCategorias = document.getElementById("menuCategorias"); // panel lateral
const iconMenu = document.getElementById("iconMenu");           // icono hamburguesa / equis

categoryItems.forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault(); // Evitar que el enlace navegue

        const category = item.dataset.category;
        if (!category) return;

        // Filtrar productos por categoría
        const filteredProducts = getAllProducts().filter(p => p.category === category);
        renderProducts(filteredProducts);

        // Cerrar automáticamente el menú lateral
        if (menuCategorias.classList.contains("activo")) {
            menuCategorias.classList.remove("activo");

            // Cambiar icono de vuelta a hamburguesa
            if (iconMenu.getAttribute("src") === "./src/images/equis.svg") {
                iconMenu.setAttribute("src", "./src/images/view_headline.svg");
            }
        }
    });
});
