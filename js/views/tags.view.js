export const TAG_DEFINITIONS = [
    {
        // condición: función que recibe el medicamento y devuelve boolean
        check: (medication) => medication.cpresc?.toLowerCase().includes("hospital"),
        className: "tag-hospital",
        iconClass: "bi-h-square",
        label: "Uso hospitalario",
    },
    {
        check: (medication) => medication.receta,
        className: "tag-recipe",
        iconClass: "bi-file-medical",
        label: "Receta",
    },
    {
        check: (medication) => medication.generico,
        className: "tag-generic",
        iconClass: "bi-copy",
        label: "Genérico",
    },
    {
        check: (medication) => medication.psum,
        className: "tag-psum",
        iconClass: "bi-exclamation-triangle",
        label: "Problemas de suministro",
    },
];

/**
 * Devuelve un array de nodos <span> con los tags que aplican al medicamento, según las definiciones declaradas en TAG_DEFINITIONS.
 * @param {object} medication - Objeto del medicamento de la API CIMA.
 * @returns {HTMLSpanElement[]}
 */
export function createTags(medication) {
    return (
        TAG_DEFINITIONS
            // quedate con las definiciones que cumplen la condición
            .filter((def) => def.check(medication))
            // transforma cada una en un tag
            .map((def) => buildTag(def))
    );
}

// Función privada: construye un tag individual
function buildTag({ className, iconClass, label }) {
    const span = document.createElement("span");
    span.classList.add("li-tag", className);

    const icon = document.createElement("i");
    icon.classList.add("bi", iconClass);

    const text = document.createTextNode(label);
    span.append(icon, text);

    return span;
}
