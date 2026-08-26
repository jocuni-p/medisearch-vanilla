export const TAG_DEFINITIONS = [
    {
        // condición: función que recibe el medicamento y devuelve boolean
        check: (medication) => medication.cpresc?.toLowerCase().includes("hospital"),
        id: "hospital",
        className: "tag-hospital",
        iconClass: "bi-h-square",
        label: "Uso hospitalario",
        description: "De prescripción exclusiva en centro hospitalario.",
    },
    {
        check: (medication) => medication.receta,
        id: "recipe",
        className: "tag-recipe",
        iconClass: "bi-file-medical",
        label: "Receta",
        description: "Imprescindible receta médica para su obtención.",
    },
    {
        check: (medication) => medication.generico,
        id: "generic",
        className: "tag-generic",
        iconClass: "bi-copy",
        label: "Genérico",
        description: "Mismo principio activo, dosis, seguridad y eficacia que el original.",
    },
    {
        check: (medication) => medication.psum,
        id: "supply",
        className: "tag-psum",
        iconClass: "bi-exclamation-triangle",
        label: "Problemas de suministro",
        description: "Este medicamento presenta problemas temporales de suministro.",
    },
];

/**
 * Genera los tags compactos que aplican al medicamento. 
 * @param {object} medication - Objeto devuelto por /medicamento.
 * @param {object} [options] - Opciones de renderizado (puede estar vacío).
 * @param {string[]} [options.omit=[]] - Ids de tags que no se generan
 * @returns {HTMLSpanElement[]} - Retorna array de: icono + el nombre del tag
 */
export function createTags(medication, options) {
    return getApplicableTags(medication, options).map((def) => buildTag(def));
}

/**
 * Genera los tags en formato línea explicativa que aplican al medicamento.
 * @param {object} medication - Objeto devuelto por /medicamento.
 * @param {object} [options] - Opciones de renderizado (puede estar vacío).
 * @param {string[]} [options.omit=[]] - Ids de tags que no se han de generar
 * @returns {HTMLDivElement[]} - Retorna array de: un icono + texto del tag
 */
export function createTagLines(medication, options) {
    return getApplicableTags(medication, options).map((def) => buildTagLine(def));
}

/* ----- HELPERS ----- */

/**
 * Filtra del objeto 'medication' los campos (tags) que aplican.
 * @param {Object} medication - Objeto de la response con los datos del medicamento
 * @param {object} [options] - Opciones de renderizado (puede estar vacío).
 * @param {string[]} [options.omit=[]] - Ids de tags que no se generan
 * @returns {Array} - Contiene los nombres de los campos que aplican.
 */
function getApplicableTags(medication, { omit = [] } = {}) {
    return (
        TAG_DEFINITIONS
            // quedate con las definiciones que cumplen la condición
            .filter((def) => def.check(medication))
            // deja fuera la lista de ids que se le pasa con omit
            .filter((def) => !omit.includes(def.id))
    );
}

// Construye un tag de tipo pildora (icono + nombre corto)
function buildTag({ className, iconClass, label }) {
    const span = document.createElement("span");
    span.classList.add("tag-pill", className);

    const icon = document.createElement("i");
    icon.classList.add("bi", iconClass);
    // Oculta el icono a los lectores de pantalla, porque es simple decoración
    icon.setAttribute("aria-hidden", "true");

    const text = document.createTextNode(label);
    span.append(icon, text);

    return span;
}

// Construye un tag de tipo línea (icono + línea de texto).
function buildTagLine({ className, iconClass, description }) {
    const div = document.createElement("div");
    div.classList.add("tag-line", className);

    const icon = document.createElement("i");
    icon.classList.add("bi", iconClass);
    icon.setAttribute("aria-hidden", "true");
    const text = document.createTextNode(description);
    div.append(icon, text);

    return div;
}
