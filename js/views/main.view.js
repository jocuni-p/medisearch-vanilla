/**
 * LIMPIA la lista de cards del DOM, si contiene algo
 */
export function clearMedications() {
    document.querySelector("#results-list").replaceChildren();
}

/* TODO: refactorizar, demasiado larga */
/**
 * Renderiza un listado de cards de medicamentos en el contenedor #results-list.
 * Por cada elemento del array:
 *  - Clona el template #template-medicine.
 *  - Rellena nombre, principio activo y enlace a la vista de detalle.
 *  - Muestra/oculta los tags según las propiedades del medicamento.
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
    //Recupera el template (lo que tiene dentro)
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
        // ====== TAGS ======
        // Muestra/oculta los tags según el valor del objeto medicamento recibido
        const isHospital = medication.cpresc?.toLowerCase().includes("hospital");

        if (isHospital) {
            clone.querySelector(".tag-hospital").classList.remove("hidden");
            clone.querySelector(".tag-recipe").classList.add("hidden");
        } else if (medication.receta) {
            //
            clone.querySelector(".tag-hospital").classList.add("hidden");
            clone.querySelector(".tag-recipe").classList.remove("hidden");
        } else {
            clone.querySelector(".tag-hospital").classList.add("hidden");
            clone.querySelector(".tag-recipe").classList.add("hidden");
        }
        if (!medication.generico) {
            clone.querySelector(".tag-generic").classList.add("hidden");
        }
        if (!medication.psum) {
            clone.querySelector(".tag-psum").classList.add("hidden");
        }
        fragment.appendChild(clone);
    }
    container.appendChild(fragment);
}
