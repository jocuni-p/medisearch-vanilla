import { showHeader } from "../views/header.view.js";
import { showFooter } from "../views/footer.view.js";
import { showMedications, clearMedications } from "../views/main.view.js";
import { fetchMedications } from "../models/medications.model.js";
import { showLoading, showEmpty, showError, showResults } from "../views/ui-state.view.js";
import { MESSAGES } from "../views/ui-messages.js";

/* ==== CONSTANTS ==== */

const VALID_INPUT_REGEX = /^[a-záéíïóúüñ0-9\s\-/.,]+$/i;
const VALIDATION_MESSAGES = {
    tooShort: MESSAGES.validation.tooShort,
    invalidChars: MESSAGES.validation.invalidChars,
};

// Arranca el JS al cargar la pagina
document.addEventListener("DOMContentLoaded", init);

/**
 * Punto de arranque del controller de la vista principal.
 * Monta el header y footer común y registra el listener del formulario de búsqueda.
 * Se ejecuta una sola vez al cargar la página.
 */
function init() {
    showHeader("Inicio");
    showFooter();
    // Implementa listener de eventos en el form
    const form = document.querySelector("#form");
    form.addEventListener("submit", handleSearch);
}

/**
 * Manejador del evento submit del formulario de búsqueda.
 * Orquesta todo el flujo de búsqueda:
 *  1. Previene la recarga de la página.
 *  2. Lee y trimea el valor del input.
 *  3. Valida el input (delega en validateInput).
 *  4. Llama al model para hacer la petición a la API.
 *  5. Valida la estructura de la respuesta.
 *  6. Pasa los datos a la view (o muestra mensaje si no hay resultados / hay error).
 *
 * @param {SubmitEvent} event - Evento submit del formulario.
 * @returns {Promise<void>}
 */
async function handleSearch(event) {
    event.preventDefault(); // previene la recarga de la página para que no se pierdan los datos
    const input = document.querySelector("#search-input");
    const valor = input.value.trim();
    // Validación del input
    const resultInput = validateInput(valor);
    if (!resultInput.valid) {
        handleValidationError(resultInput.reason);
        return;
    }
    showLoading(); // Mostrará el spinner hasta que llegue la response
    try {
        // Petición a la API
        const data = await fetchMedications(valor);
        // Valida y pinta la respuesta de la API
        renderSearchResponse(data);
    } catch (error) {
        console.error("Ha habido un problema al conectar con CIMA.", error.message);
        showError(MESSAGES.response.error); // Oculta spinner, muestra mensaje, oculta lista
        clearMedications(); // En los dos estados donde puede haber cards previas (empty, error)
    }
}

/**
 * Maneja el error de validación del input, mostrando al usuario un error explicito
 * @param {string} reason   Razón del error de validación: 'empty' | 'tooShort' | 'invalidChars'
 */
function handleValidationError(reason) {
    // Primero limpio si hay algo en la lista
    clearMedications();
    if (reason === "empty") {
        return;
    }
    // si es por otra razón muestra msg
    showEmpty(VALIDATION_MESSAGES[reason]); // Oculta spinner, muestra mensaje, oculta lista
}

/**
 * Valida el texto introducido por el usuario antes de enviar la petición a la API.
 * Aplica tres reglas en orden:
 *  1. No vacío.
 *  2. Mínimo 4 caracteres.
 *  3. Solo caracteres permitidos según VALID_INPUT_REGEX
 *     (letras con tildes/ñ, números, espacios y `-/.,`).
 *
 * @param {string} input - Valor del input ya trimado.
 * @returns {{ valid: boolean, reason?: string }} Resultado de la validación.
 *   - Si es válido: { valid: true }
 *   - Si no es válido: { valid: false, reason: 'empty' | 'tooShort' | 'invalidChars' }
 */
function validateInput(input) {
    if (input.length === 0) {
        return { valid: false, reason: "empty" };
    }
    if (input.length < 4) {
        return { valid: false, reason: "tooShort" };
    }
    if (!VALID_INPUT_REGEX.test(input)) {
        return { valid: false, reason: "invalidChars" };
    }
    return { valid: true };
}

/**
 * Valida la estructura de la respuesta, decide la respuesta que aplicará (mostrar error/pintar las cards) y ordenará alfabeticamente
 * @param {Object} data - Objeto de la response de la API con propiedad 'resultados'
 * @throws {Error}  Si 'resultados' no es un array
 */
function renderSearchResponse(data) {
    if (!Array.isArray(data.resultados)) {
        // Este error subirá hasta el catch de la función padre
        throw new Error("Respuesta inesperada de la API");
    }
    // si es una response ok, pero con contenido 0
    if (data.resultados.length === 0) {
        clearMedications(); // Limpia el listado de cards previas
        showEmpty(MESSAGES.response.empty);
        return;
    }
    // Crea un NUEVO array ordenado alfabeticamente
    const orderedData = data.resultados.toSorted((a, b) =>
        a.nombre.localeCompare(b.nombre, "es", { numeric: true })
    );
    showResults(); //Oculta el spinner, oculta el mensaje, muestra la lista
    // Pinta el contenido de la response
    showMedications(orderedData);
}
