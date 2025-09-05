// =====================
// js/menu.js
// =====================

// --- Botones de la navbar inferior ---
const btnHome   = document.getElementById("btnHome");
const btnSearch = document.getElementById("btnSearch");
const btnSaved  = document.getElementById("btnSaved");
const btnCart   = document.getElementById("btnCart");

// --- Paneles / elementos ---
const menuCategorias = document.getElementById("menuCategorias"); // categorías (antes lateral)
const searchPanel    = document.getElementById("searchPanel");    // buscador
const savedPanel     = document.getElementById("savedPanel");     // guardados
const cartPanel      = document.getElementById("cartPanel");      // carrito

const cartCount = document.getElementById("cart-count");
const navbar    = document.querySelector(".navbar-footer");

// --- Función para mostrar solo un panel activo ---
function showPanel(panel) {
    [menuCategorias, searchPanel, savedPanel, cartPanel].forEach(p => {
        if (!p) return;
        p.classList.toggle("activo", p === panel);
    });

    // badge carrito se oculta si el carrito está abierto
    if (cartCount) {
        cartCount.style.display = (panel === cartPanel) ? "none" : "inline-block";
    }
}

// --- Eventos de los botones ---
if (btnHome) {
    btnHome.addEventListener("click", () => {
        showPanel(menuCategorias); // aquí puedes cambiar si prefieres otra sección como "home"
    });
}

if (btnSearch) {
    btnSearch.addEventListener("click", () => {
        showPanel(searchPanel);
    });
}

if (btnSaved) {
    btnSaved.addEventListener("click", () => {
        showPanel(savedPanel);
    });
}

if (btnCart) {
    btnCart.addEventListener("click", () => {
        showPanel(cartPanel);
    });
}

// --- Ocultar/mostrar navbar según scroll ---
let lastScrollY = window.scrollY;
if (navbar) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > lastScrollY) {
            navbar.classList.add("hide"); // hacia abajo
        } else {
            navbar.classList.remove("hide"); // hacia arriba
        }
        lastScrollY = window.scrollY;
    });
}

// =====================
// js/menu.js
// =====================

// --- Botones de la navbar inferior ---


// --- Elementos ---
const searchForm = document.getElementById("searchForm");

// Ocultar form al inicio
if (searchForm) {
    searchForm.style.display = "none";
}

if (btnSearch && searchForm) {
    btnSearch.addEventListener("click", () => {
        // Alternar visibilidad del formulario
        if (searchForm.style.display === "none") {
            searchForm.style.display = "block"; // mostrar
            searchForm.classList.add("activo"); // si tienes animación en CSS
        } else {
            searchForm.style.display = "none"; // ocultar
            searchForm.classList.remove("activo");
        }
    });
}

