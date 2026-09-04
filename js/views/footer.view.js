const CIMA_LABEL = "Datos CIMA";

// Crea y muestra por pantalla el footer con los enlaces correspondientes
export function showFooter() {
    // recupero el contenedor del footer
    const appFooter = document.querySelector("#app-footer");
    // Protección. Por si se llama dos veces al mismo controller (p.e. tras una recarga parcial)que no se duplique el contenido
    appFooter.replaceChildren();

    // Creo un container nav para los enlaces
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Datos legales"); //Define el rol del nav para accesibilidad

    const divider = document.createElement("span");
    divider.textContent = " · ";
    divider.setAttribute("aria-hidden", "true");

    nav.append(
        createFooterLink(CIMA_LABEL, "https://aemps.gov.es", true),
        divider,
        createFooterLink("Aviso legal", "legal-policy.html", false),
    );
    // Envoltorio global
    appFooter.append(nav);
}

/**
 * Función helper que crea el enlace (elemento <a>)
 * @param {string} name - Texto del enlace
 * @param {string} link - ruta del enlace
 * @param {boolean} isExternal - define si ha de llevar o no los atributos
 *
 * @returns {HTMLAnchorElement} Node - Nodo que contiene el enlace <a>
 */
function createFooterLink(name, link, isExternal) {
    const a = document.createElement("a");
    a.textContent = name;
    a.href = link; // ruta
    a.classList.add("link-footer");
    if (isExternal) {
        a.target = "_blank";
        a.rel = "noopener";
    }
    return a;
}
