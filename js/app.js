// js/app.js

import './helpers.js';
import './menu.js';
import './categories.js';

import { initSearch } from './search.js';
import { initProducts } from './products.js';
import { loadCart } from './cart.js';

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Cargar carrito primero → restaura desde localStorage + actualiza contador
    loadCart();

    // 2. Cargar productos → render inicial
    await initProducts();

    // 3. Inicializar buscador (usa productos ya en memoria)
    initSearch();
});
