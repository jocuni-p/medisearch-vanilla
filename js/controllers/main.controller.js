// LLama a un modulo que contiene showHeader() para que rellene el header

import { showHeader } from "../views/header.view.js";
import { showMedications, clearMedications } from "../views/main.view.js";
import { fetchMedications } from "../models/medications.model.js";
import { showLoading, showEmpty, showResults } from "../views/ui-state.view.js";
import { MESSAGES } from "../views/ui-messages.js";

/* ==== CONSTANTS ==== */
const VALID_INPUT_REGEX = /^[a-záéíïóúüñ0-9\s\-/.,]+$/i;
const VALIDATION_MESSAGES = {
    tooShort: MESSAGES.validation.tooShort,
    invalidChars: MESSAGES.validation.invalidChars,
};

init();
// Lo pongo o lo quito???
//document.addEventListener('DOMContentLoaded', init);

/**
 * Punto de arranque del controller de la vista principal.
 * Monta el header común y registra el listener del formulario de búsqueda.
 * Se ejecuta una sola vez al cargar la página.
 */
function init() {
	// 1. MOSTRAR HEADER
	showHeader("Inicio");
	// 2. IMPLEMENTA LISTENER DE EVENTOS EN EL FORM
	const form = document.querySelector("#form");
	form.addEventListener("submit", handleSearch);
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

/* ===========OJO, FUNCION DEMASIADO LARGA: HAY QUE REFACTORIZARLA =========== */
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
    const input = document.querySelector("#search-input"); // selecciono el elemento por id
    const valor = input.value.trim(); //recupero valor con espacios trimados al inicio y final
    // 1. VALIDACIÓN DEL INPUT
    const resultInput = validateInput(valor);
	if (!resultInput.valid) {
		// Primero limpio si hay algo en la lista
		clearMedications();
        // Si no es válido
        if (resultInput.reason === "empty") {
            // porque está vacío
            return;
		}
		// o si es por esta otra razón (muestra msg)
        showEmpty(VALIDATION_MESSAGES[resultInput.reason]); // Oculta spinner, muestra mensaje, oculta lista
        return;
        //console.log(resultInput.reason); // DEBUG TEMP
    }
    //console.log(valor); // DEBUG
    showLoading(); // Mostrará el spinner hasta que llegue la response
    try {
        // 2. PETICIÓN A LA API
        const data = await fetchMedications(valor); // Esta función devuelve una promise
        // 3. VALIDACIÓN DE LA RESPONSE (en el controller, porque la petición fué ok, pero sin contenido)
        // Valido que la response sea un array (es raro pero podría pasar si modifican la API)
        if (!Array.isArray(data.resultados)) {
            throw new Error("Respuesta inesperada de la API");
        }
        // Verifico si es una response ok, pero con contenido 0
        if (data.resultados.length === 0) {
            // La response es ok, pero no trae ningún resultado
            clearMedications(); // Limpia el listado de cards previas
            showEmpty(MESSAGES.response.empty);
            //console.log('No se han encontrado resultados'); // TEMP: Habrá que mostrarlo en el div del navegador
            return;
        }
        showResults(); //Oculta el spinner, oculta el mensaje, muestra la lista
        // RESPONSE VÁLIDA CON RESULTADOS
        //data es un obj. He de pasarle un array.
        showMedications(data.resultados);
    } catch (error) {
        // Si hubo algún error en el (fetch) proceso lo cazará
        showEmpty(MESSAGES.response.error); // Oculta spinner, muestra mensaje, oculta lista
        console.log("Ha habido un problema al conectar con CIMA. Inténtalo de nuevo", error.message); // DEBUG
        clearMedications(); // En los dos estados donde puede haber cards previas (empty, error)
    }
}

