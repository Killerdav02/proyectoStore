const btnMenu = document.getElementById("btnMenu");
const menuCategorias = document.getElementById("menuCategorias");
const iconMenu = document.getElementById("iconMenu");
const btnExpand = document.getElementById("btnExpand");
const subList = document.getElementById("subList");
const iconExpand = document.getElementById("iconExpand");

btnMenu.addEventListener("click", () => {
    menuCategorias.classList.toggle("activo");
});

btnMenu.addEventListener("click", () => {
    if (iconMenu.getAttribute("src") === "./src/images/view_headline.svg") {
        iconMenu.setAttribute("src", "./src/images/equis.svg");
    } else {
        iconMenu.setAttribute("src", "./src/images/view_headline.svg");
    }
});



btnExpand.addEventListener("click", () => {
    subList.classList.toggle("oculto");
    btnExpand.classList.toggle("rotar");
});
