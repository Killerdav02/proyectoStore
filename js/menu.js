// --- Botones de la navbar inferior ---
const btnHome   = document.getElementById("btnHome");
const btnSearch = document.getElementById("btnSearch");
const btnSaved  = document.getElementById("btnSaved");
const btnCart   = document.getElementById("btnCart");

// --- Paneles / elementos ---
const menuCategorias = document.getElementById("menuCategorias"); // categorías
const searchPanel    = document.getElementById("searchPanel");    // buscador
const savedPanel     = document.getElementById("savedPanel");     // guardados
const cartPanel      = document.getElementById("cartPanel");      // carrito

const cartCount = document.getElementById("cart-count");
const navbar    = document.querySelector(".navbar-footer");

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
            searchForm.classList.add("activo");
        } else {
            searchForm.style.display = "none"; // ocultar
            searchForm.classList.remove("activo");
        }
    });
}

