// =====================
// js/menu.js
// =====================

const btnMenu = document.getElementById("btnMenu");
const menuCategorias = document.getElementById("menuCategorias");
const iconMenu = document.getElementById("iconMenu");

const btnExpand = document.getElementById("btnExpand");
const subList = document.getElementById("subList");
const iconExpand = document.getElementById("iconExpand");

const btnCart = document.querySelector(".btn-cart");
const cartPanel = document.getElementById("cartPanel");

// Abrir / cerrar menú lateral
if (btnMenu && menuCategorias && iconMenu) {
    btnMenu.addEventListener("click", () => {
        const isActive = menuCategorias.classList.toggle("activo");

        // Si se abre, cerrar carrito
        if (isActive && cartPanel && iconCart) {
            cartPanel.classList.remove("activo");
            iconCart.setAttribute("src", "./src/images/shopping_cart.svg");
        }

        // Cambiar ícono hamburguesa <-> equis
        if (iconMenu.getAttribute("src") === "./src/images/view_headline.svg") {
            iconMenu.setAttribute("src", "./src/images/equis.svg");
        } else {
            iconMenu.setAttribute("src", "./src/images/view_headline.svg");
        }
    });
}

// Abrir / cerrar carrito lateral
if (btnCart && cartPanel && iconCart) {
    btnCart.addEventListener("click", () => {
        const isActive = cartPanel.classList.toggle("activo");

        // Si se abre, cerrar menú de categorías
        if (isActive && menuCategorias && iconMenu) {
            menuCategorias.classList.remove("activo");
            iconMenu.setAttribute("src", "./src/images/view_headline.svg");
        }

        // Cambiar ícono carrito <-> equis
        if (iconCart.getAttribute("src") === "./src/images/shopping_cart.svg") {
            iconCart.setAttribute("src", "./src/images/equis.svg");
        } else {
            iconCart.setAttribute("src", "./src/images/shopping_cart.svg");
        }
    });
}


// Expandir / colapsar subcategorías
if (btnExpand && subList && iconExpand) {
    btnExpand.addEventListener("click", () => {
        subList.classList.toggle("mostrar");
        iconExpand.classList.toggle("rotar");
    });
}



