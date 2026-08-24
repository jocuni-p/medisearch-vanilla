export const TAG_DEFINITIONS = [
    {
        // condición: función que recibe el medicamento y devuelve boolean
        check: (medication) => medication.cpresc?.toLowerCase().includes("hospital"),
        className: "tag-hospital",
        iconClass: "bi-h-square",
        label: "Uso hospitalario",
        id: "hospital",
    },
    {
        check: (medication) => medication.receta,
        className: "tag-recipe",
        iconClass: "bi-file-medical",
        label: "Receta",
        id: "recipe",
    },
    {
        check: (medication) => medication.generico,
        className: "tag-generic",
        iconClass: "bi-copy",
        label: "Genérico",
        id: "generic",
    },
    {
        check: (medication) => medication.psum,
        className: "tag-psum",
        iconClass: "bi-exclamation-triangle",
        label: "Problemas de suministro",
        id: "supply",
    },
];

/**
 * Devuelve un array de nodos <span> con los tags que aplican al medicamento, según
 *  las definiciones declaradas en TAG_DEFINITIONS. Contiene un segundo parámetro opcional
 *  para omitir uno de los tag, si fuera necesario.
 * @param {object} medication - Objeto a evaluar.
 * @param {object} [options] - Opciones de renderizado.
 * @param {string[]} [options.omit=[]] - Ids de tags que no se generan
 * @returns {HTMLSpanElement[]}
 */
export function createTags(medication, { omit = [] } = {}) {
    return (
        TAG_DEFINITIONS
            // quedate con las definiciones que cumplen la condición
            .filter((def) => def.check(medication))
            // deja fuera la lista de ids que se le pasa
            .filter((def) => !omit.includes(def.id))
            // transforma cada una en un tag
            .map((def) => buildTag(def))
    );
}

// Función privada: construye un tag individual
function buildTag({ className, iconClass, label }) {
    const span = document.createElement("span");
    span.classList.add("tag-pill", className);

    const icon = document.createElement("i");
    icon.classList.add("bi", iconClass);

    const text = document.createTextNode(label);
    span.append(icon, text);

    return span;
}
