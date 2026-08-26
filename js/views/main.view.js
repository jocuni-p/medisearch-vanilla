import { createTags } from "./tags.view.js";

/**
 * LIMPIA la lista de cards del DOM, si contiene algo
 */
export function clearMedications() {
    document.querySelector("#results-list").replaceChildren();
}


/**
 * Renderiza un listado de cards de medicamentos en el contenedor #results-list.
 * Por cada elemento del array:
 *  - Clona el template #template-medicine.
 *  - Rellena nombre, principio activo y enlace a la vista de detalle.
 *  - Crea los tags que aplican en el medicamento.
 * Limpia el contenedor antes de pintar (delega en clearMedications).
 *
 * @param {Array<Object>} medications - Array de objetos medicamento devuelto
 *   por la API CIMA. Se espera que cada elemento tenga, al menos, `nregistro`
 *   y `nombre`. El resto de campos se manejan de forma defensiva.
 */
export function showMedications(medications) {
    const container = document.querySelector("#results-list");
    clearMedications();
    // Crea Fragment: memoria temporal antes del volcado al DOM
    const fragment = document.createDocumentFragment();
    //Recupera el template (solo lo que tiene dentro)
    const template = document.querySelector("#template-medicine").content;
    //Bucle: crea el clon y rellena cada dato del template
    for (const medication of medications) {
        // Creo un clone
        const clone = template.cloneNode(true);
        // Recupero elemento href para página de detalle
        clone.querySelector("a").href = `detail.html?nregistro=${medication.nregistro}`;
        // Recupero nombre medicamento
        clone.querySelector("h2").textContent = medication.nombre;
        // Si no existe, devuelve undefined sin lanzar error.
        if (medication.vtm?.nombre) {
            // protección para leer algo, que si no existe, no se rompa.
            clone.querySelector(".li-subtitle").textContent = medication.vtm.nombre;
        } else {
            // Aparecerá vacío si no viene texto o hubo algún error
            clone.querySelector(".li-subtitle").textContent = "";
        }
		// Tags: Crea un array con los tags que usará en esta card
		const tagArr = createTags(medication);
		// Recupero el div, con el spread convierto el array en elementos individuales y los inserto
		clone.querySelector(".li-bottom-block").append(...tagArr);
		
        fragment.appendChild(clone);
    }
    container.appendChild(fragment);
}
