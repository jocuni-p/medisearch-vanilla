
const COMPANY = "MediSearch";

// Crea y muestra por pantalla el header con los enlaces correspondientes según que página lo llama
export function showHeader(nameOfPage) {
    // recupero el contenedor del header
    const appHeader = document.querySelector("#app-header");
    // Lo vacio por si contiene alguna cosa
    appHeader.replaceChildren();

    // Creo un container nav y dentro sus botones dependiendo de la pagina a la que vaya
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Principal"); //Define el rol del nav, no un destino

    if (nameOfPage === "Inicio") {
        // Añado el enlace al container.
        nav.append(createLink("Favoritos", "favorites.html"));
        // Si estoy en Favoritos veré 'Inicio'
    } else if (nameOfPage === "Favoritos") {
        nav.append(createLink("Inicio", "index.html"));
        // En el resto de páginas veo Inicio + Favoritos
    } else {
        nav.append(createLink("Favoritos", "favorites.html"), createLink("Inicio", "index.html"));
    }

    // Crea enlace con nombre de la compañia
    const brandName = createBrandLink();

    // Envoltorio global
    const headerContainer = document.createElement("div");
    headerContainer.classList.add("header-container");
    headerContainer.append(brandName, nav);
    appHeader.append(headerContainer);
}

// Crea un contenedor con company_name que es un enlace
function createBrandLink() {
    // Creo el contenedor con un <a> para que sea enlazable
    const containerBrandName = document.createElement("a");
    containerBrandName.href = "index.html";
    containerBrandName.classList.add("brand");

    // Creo el nombre de la compañia
    const brandName = document.createElement("span");
    brandName.textContent = COMPANY;
    brandName.classList.add("company-name");

    //Envuelvo lo creado en el contenedor
    containerBrandName.append(brandName);
    return containerBrandName;
}

/**
 * Función helper que crea el enlace (elemento <a>)
 * @param {string} name - Texto del enlace
 * @param {string} link - ruta del enlace
 * @returns {HTMLAElement} Node - Nodo que contiene el enlace <a>
 */
function createLink(name, link) {
    const a = document.createElement("a");
    a.textContent = name;
    a.href = link; // ruta
    a.classList.add("nav-button");
    return a;
}
