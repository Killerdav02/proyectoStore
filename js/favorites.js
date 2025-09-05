// =====================
// js/favorites.js
// =====================

export let favorites = [];

/** Cargar favoritos desde localStorage */
export function loadFavorites() {
    const raw = localStorage.getItem("favorites");
    favorites = raw ? JSON.parse(raw) : [];
    return favorites;
}

/** Guardar favoritos en localStorage */
function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    // Notificar al resto de la app que cambió la lista
    window.dispatchEvent(
        new CustomEvent("favoritesUpdated", { detail: { favorites } })
    );
}

/** Saber si un producto está en favoritos */
export function isFavorite(productId) {
    return favorites.some(f => f.id === productId);
}

/** Alternar favorito (agrega/quita) */
export function toggleFavorite(product) {
    if (isFavorite(product.id)) {
        favorites = favorites.filter(f => f.id !== product.id);
    } else {
        // guardamos solo lo necesario
        const { id, title, price, image } = product;
        favorites.push({ id, title, price, image });
    }
    saveFavorites();
}

/** 📋 Obtener todos los favoritos */
export function getFavorites() {
    return [...favorites];
}

/** Inicializar favoritos: cargar y enganchar botón Saved */
export function initFavorites({ onShowSaved, onShowAll } = {}) {
    loadFavorites();

    const btnSaved = document.getElementById("btnSaved");
    if (btnSaved) {
        btnSaved.addEventListener("click", () => {
            const isActive = btnSaved.classList.toggle("active");
            if (isActive) {
                onShowSaved?.();
            } else {
                onShowAll?.();
            }
        });
    }
}
