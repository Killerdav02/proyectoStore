// =====================
// js/search.js
// =====================

import { getAllProducts } from './api.js';
import { renderProducts } from './products.js';

const searchInput = document.getElementById("buscador");

if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        const filtered = getAllProducts().filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );

        renderProducts(filtered);
    });
}
