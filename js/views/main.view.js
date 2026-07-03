// NOTA: Si he de hacer un truncado del nombre o poner el principio activo la primera en mayuscula, se hace aquí por que son transformaciones de presentación No de datos.

/**
 * LIMPIA la lista de cards del DOM, si contiene algo
 */
export function clearMedications() {
    document.querySelector("#results-list").replaceChildren();
}

/* ===========OJO, FUNCION DEMASIADO LARGA: HAY QUE REFACTORIZARLA =========== */
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
    const container = document.querySelector("#results-list"); // Al final necesito esta var
    clearMedications();
    // Crea el fragment
    const fragment = document.createDocumentFragment();
    //Recupera el template
    const template = document.querySelector("#template-medicine").content;
    //Bucle que crea el clone y rellena cada dato del template
    for (const medication of medications) {
        // Creo un clone
        const clone = template.cloneNode(true);
        // Recupero elemento href para página de detalle
        //clone.querySelector('a').href = `${BASE_URL}/medicamento?nregistro=${medicamento.nregistro}`;
        clone.querySelector("a").href = `detail.html?nregistro=${medication.nregistro}`;
        // Recupero nombre medicamento
        // OJO: GESTIONAR TRUNCADO CON CSS
        clone.querySelector("h2").textContent = medication.nombre;
        //NOTA: Principio de robustez: asumir que cualquier campo puede fallar o no ser obligatorio (blindar todo con '?.').

        // Recupero principio activo (OJO: cómo NO sé si son campos obligatorios, habrá que blindarlos.
        // Si no existe, devuelve undefined sin lanzar error.
        if (medication.vtm?.nombre) {
            // protección para leer algo, que si no existe, no se rompa.
            // OJO: GESTIONAR TRUNCADO CON CSS
            clone.querySelector(".li-subtitle").textContent = medication.vtm.nombre;
        } else {
            // Aparecerá vacío si no viene texto o hubo algún error
            clone.querySelector(".li-subtitle").textContent = "";
        }

        // ====== GESTION DE LOS TAGS ======
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
