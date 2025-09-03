// =====================
// js/helpers.js
// =====================

/**
 * Escapar caracteres HTML para evitar inyecciones
 * @param {string} s
 * @returns {string}
 */
export function escapeHtml(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/**
 * Mostrar mensaje de carga en un contenedor
 * @param {HTMLElement} container
 * @param {string} [message="Cargando..."]
 */
export function showLoading(container, message = "Cargando...") {
    if (!container) return;
    container.innerHTML = `<p>${message}</p>`;
}

/**
 * Ocultar loading (puede implementarse con spinner)
 * @param {HTMLElement} container
 */
export function hideLoading(container) {
    if (!container) return;
    container.innerHTML = "";
}

/**
 * Mostrar mensaje de error en un contenedor
 * @param {HTMLElement} container
 * @param {Error|string} err
 */
export function showError(container, err) {
    if (!container) return;
    const msg = err instanceof Error ? err.message : String(err);
    container.innerHTML = `<p class="error">Error: ${escapeHtml(msg)}</p>`;
}
