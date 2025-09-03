// =====================
// js/app.js
// =====================

// Importar módulos (misma carpeta)
import './helpers.js';      // Funciones generales
import './menu.js';         // Menú lateral y subcategorías
import './search.js';       // Buscador en tiempo real
import './categories.js';   // Filtrado por categoría
import { initProducts } from './products.js';
import { loadCart } from './cart.js';

// Inicializar todo al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
    await initProducts(); // cargar y renderizar productos
    loadCart();           // cargar carrito desde localStorage
});
