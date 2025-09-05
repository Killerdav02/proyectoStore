// =====================
// js/categories.js
// =====================

import { getAllProducts, renderProducts } from "./products.js";

// Normaliza strings para comparar categorías sin errores de espacios/mayúsculas
const norm = s => (s || "").toString().trim().toLowerCase();

// Esperar a que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    // --- Filtrado por categoría ---
    // Cada .category debe traer data-category con el valor EXACTO de la API:
    // "men's clothing" | "women's clothing" | "jewelery" | "electronics"
    const categoryCards = document.querySelectorAll(".category");

    // Menú lateral (opcional)
    const menuCategorias = document.getElementById("menuCategorias");
    const iconMenu = document.getElementById("iconMenu");

    categoryCards.forEach(card => {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            const category = card.dataset.category;
            if (!category) return;

            const filtered = getAllProducts().filter(p => norm(p.category) === norm(category));
            renderProducts(filtered);

            // Cerrar menú lateral si está abierto (si existen los nodos)
            if (menuCategorias?.classList.contains("activo")) {
                menuCategorias.classList.remove("activo");
                if (iconMenu?.getAttribute("src") === "./src/images/equis.svg") {
                    iconMenu.setAttribute("src", "./src/images/view_headline.svg");
                }
            }
        });
    });

    // --- Carrusel táctil 1x1 ---
    const track = document.querySelector(".categories-track");
    if (track) {
        let startX = 0;
        let position = 0;

        const categories = document.querySelectorAll(".category");
        const itemWidth = track.offsetWidth; // cada slide ocupa todo el ancho

        track.addEventListener("touchstart", e => {
            startX = e.touches[0].clientX;
        });

        track.addEventListener("touchend", e => {
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

        // Recalcular width al redimensionar
        window.addEventListener("resize", () => {
            const index = Math.abs(position) / itemWidth;
            const newWidth = track.offsetWidth;
            position = -Math.round(index) * newWidth;
            track.style.transform = `translateX(${position}px)`;
        });
    }
});
