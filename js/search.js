// js/search.js

import { getAllProducts, renderProducts } from './products.js';

/**
 * Función para hacer "debounce" y no ejecutar la búsqueda en cada tecla
 */
function debounce(fn, delay = 250) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Ejecuta la búsqueda filtrando los productos
 */
export function runSearch(queryRaw) {
    const query = (queryRaw ?? "").toLowerCase().trim();
    const all = getAllProducts() || [];

    if (!query) {
        renderProducts(all);
        return;
    }

    const filtered = all.filter((p) => {
        const t = (p.title ?? "").toLowerCase();
        const d = (p.description ?? "").toLowerCase();
        const c = (p.category ?? "").toLowerCase();
        return t.includes(query) || d.includes(query) || c.includes(query);
    });

    renderProducts(filtered);
    
    // Dispatchar evento para informar que se realizó una búsqueda
    window.dispatchEvent(new CustomEvent('searchPerformed', { 
        detail: { query, results: filtered.length, total: all.length } 
    }));
}

/**
 * Limpiar búsqueda y mostrar todos los productos
 */
export function clearSearch() {
    const searchInput = document.getElementById("buscador");
    if (searchInput) {
        searchInput.value = "";
    }
    runSearch("");
}

/**
 * Obtener el término de búsqueda actual
 */
export function getCurrentSearchTerm() {
    const searchInput = document.getElementById("buscador");
    return searchInput ? searchInput.value.trim() : "";
}

/**
 * Inicializa el input y el formulario de búsqueda
 */
export function initSearch() {
    const searchInput = document.getElementById("buscador");
    const searchForm = document.getElementById("searchForm");
    const clearBtn = document.getElementById("clear-search");

    if (searchInput) {
        // Evento de input con debounce
        searchInput.addEventListener('input', debounce((e) => {
            runSearch(e.target.value);
        }, 250));

        // Evento de focus para mejorar UX
        searchInput.addEventListener('focus', () => {
            searchInput.select(); // Seleccionar todo el texto al hacer focus
        });

        // Evento de escape para limpiar
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                clearSearch();
                searchInput.blur();
            }
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            runSearch(searchInput ? searchInput.value : "");
        });
    }

    // Botón para limpiar búsqueda (opcional)
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            clearSearch();
        });
    }

    // Render inicial de todos los productos
    runSearch("");
}

// Escuchar cambios en el carrito para mantener sincronización
window.addEventListener('cartUpdated', () => {
    // Re-ejecutar la búsqueda actual para mostrar badges actualizados
    const currentTerm = getCurrentSearchTerm();
    if (currentTerm) {
        runSearch(currentTerm);
    } else {
        // Si no hay término de búsqueda, mostrar todos los productos
        const all = getAllProducts() || [];
        renderProducts(all);
    }
});