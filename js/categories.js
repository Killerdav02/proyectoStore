// =====================
// js/categories.js
// =====================

import { getAllProducts } from './api.js';
import { renderProducts } from './products.js';

// --- Filtrado por categoría ---
const categoryItems = document.querySelectorAll(".category-item");
const menuCategorias = document.getElementById("menuCategorias"); 
const iconMenu = document.getElementById("iconMenu");

categoryItems.forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();

        const category = item.dataset.category;
        if (!category) return;

        // Filtrar productos
        const filteredProducts = getAllProducts().filter(p => p.category === category);
        renderProducts(filteredProducts);

        // Cerrar menú lateral si está abierto
        if (menuCategorias.classList.contains("activo")) {
            menuCategorias.classList.remove("activo");

            // Cambiar icono de vuelta a hamburguesa
            if (iconMenu.getAttribute("src") === "./src/images/equis.svg") {
                iconMenu.setAttribute("src", "./src/images/view_headline.svg");
            }
        }
    });
});

// --- Carrusel táctil 1x1 ---
const track = document.querySelector(".categories-track");

if (track) {
    let startX = 0;
    let currentX = 0;
    let position = 0;

    const categories = document.querySelectorAll(".category");
    const itemWidth = track.offsetWidth; // ocupa toda la pantalla

    // Inicia touch
    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    // Suelta -> decide si avanza o retrocede
    track.addEventListener("touchend", (e) => {
        const deltaX = e.changedTouches[0].clientX - startX;

        if (deltaX < -50 && Math.abs(position) < (categories.length - 1) * itemWidth) {
            position -= itemWidth; // swipe izquierda
        } else if (deltaX > 50 && position < 0) {
            position += itemWidth; // swipe derecha
        }

        track.style.transform = `translateX(${position}px)`;
        track.style.transition = "transform 0.4s ease";
        setTimeout(() => (track.style.transition = ""), 400);
    });
}
