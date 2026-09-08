import { showHeader } from "../views/header.view.js";
import { showFooter } from "../views/footer.view.js";
import { showMedications, clearMedications } from "../views/main.view.js";
import { fetchMedications } from "../models/medications.model.js";
import { showLoading, showEmpty, showError, showResults, showInitialState } from "../views/ui-state.view.js";
import { MESSAGES } from "../views/ui-messages.js";
import { clearValidationMsg, showValidationMsg } from "../views/form-validation.view.js";

/* ==== CONSTANTS ==== */

const VALID_INPUT_REGEX = /^[a-záéíïóúüñ0-9\s\-/.,]+$/i;
const VALIDATION_MESSAGES = {
    tooShort: MESSAGES.validation.tooShort,
    invalidChars: MESSAGES.validation.invalidChars,
};
const DEBOUNCE_DELAY = 400;

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

    const input = document.querySelector("#search-input");
	
    let timerId;
    // El evento 'input' se dispara en cada cambio del campo (tecleado, borrado, pegado).
    // Cada pulsación de tecla cancela la validación que estaba programada y programa una nueva.La función de validación solo se dispara, cuando pasan 400 ms sin teclear (DEBOUNCE_DELAY).
	// LISTENER DEBOUNCE: MANEJO INICIAL DEL INPUT (VALIDACIÓN SINTACTICA ANTES DEL SUBMIT)
    input.addEventListener("input", () => {
        clearTimeout(timerId); // cancela el temporizador anterior (si no existe no da error).
        timerId = setTimeout(() => validateWhileTyping(), DEBOUNCE_DELAY);
    });

    // LISTENER: MANEJO DEL INPUT A PARTIR DEL SUBMIT
    const form = document.querySelector("#form");
    // Implementa listener de eventos y registra handleSearch
    form.addEventListener("submit", handleSearch);

    // LISTENER: MANEJO DE LAS FLECHAS DEL NAVEGADOR (HISTORIAL NAVEGABLE HASTA ESTADO INICIAL)
    // popstate: Evento que se solo dispara cuando el usuario se mueve por entradas del historial de la misma página (atrás, adelante o gesto deslizar en el móvil). No se dispara al cargar la página por primera vez, ni cuando se llama a pushState.
    window.addEventListener("popstate", () => {
        syncWithUrl(false);
    });

    // MANEJO DEL INPUT SI SE ARRANCA DESDE ENLACE (URL CON PARÁMETRO)
    syncWithUrl(true);
}

/**
 * Primera validación del campo del input.
 * Valida la introducción de texto tras el retardo del DEBOUNCE_DELAY después de una pulsación de tecla.
 * Muestra un mensaje de validación si el input:
 * 	- tiene  menos de 4 carácteres válidos.
 * 	- contiene algún caracter especial no permitido
 * Oculta el mensaje de validación si el input:
 * 	- esta vacío (por que se borró)
 * 	- tiene al menos 4 caracteres válidos
 */
function validateWhileTyping() {
    const input = document.querySelector("#search-input");
    const inputTrimmed = input.value.trim();
    const resultInput = validateInput(inputTrimmed);
    if (resultInput.valid || resultInput.reason === "empty") {
        clearValidationMsg();
    } else {
        showValidationMsg(VALIDATION_MESSAGES[resultInput.reason]);
    }
}

/**
 * Maneja el evento submit del formulario de búsqueda y después delega en runSearch()
 * Orquesta la parte inicial del flujo de búsqueda:
 *  1. Previene la recarga de la página.
 *  2. Lee y trimea el valor del input.
 *
 * @param {SubmitEvent} event - Evento submit del formulario.
 * @returns {Promise<void>}
 */
function handleSearch(event) {
    event.preventDefault(); // previene la recarga de la página para que no se pierdan los datos
    const input = document.querySelector("#search-input");
    const inputTrimmed = input.value.trim();
    runSearch(inputTrimmed, true);
}

/**
 * Orquesta la parte principal del flujo de búsqueda.
 * La pueden llamar tanto desde el submit, como desde el arranque por la URL, como desde popstate.
 *  1. Valida el input (delega en validateInput).
 * 	2. actualiza la URL history del navegador con el nuevo input como param
 *  3. Llama al model para hacer la petición a la API.
 *  4. Valida la estructura de la respuesta y la pinta.
 *  5. Muestra mensaje si no hay resultados / hay error).
 *
 * @param {string} query - Input de búsqueda introducido por el usuario
 * @param {boolean} shouldUpdateUrl - Indica si hay que actualizar la URL history o no (dependiendo de quien hizo la llamada)
 */
async function runSearch(query, shouldUpdateUrl) {
    const resultInput = validateInput(query);
    if (!resultInput.valid) {
        handleValidationMsg(resultInput.reason);
        return;
    }
    //Limpiar el mensaje de validación, si el input pasa sin errores.
    clearValidationMsg();
    // Actualiza la URL history del navegador con el nuevo input como param, pero solo si no viene de un popstate
    if (shouldUpdateUrl) {
        updateUrl(query);
    }
    showLoading();
	try {
		const data = await fetchMedications(query);
		// Valida y pinta la respuesta de la API
		renderSearchResponse(data);
	} catch (error) {
		if (error.name === "TimeoutError") {
			showError(MESSAGES.response.timeout);
		} else {
			showError(MESSAGES.response.error);
		}
		console.error("Ha habido un problema al conectar con CIMA.", error.message);
		clearMedications(); // En los dos estados donde puede haber cards previas (empty, error)
	}
}

/**
 * Maneja la lectura de la URL
 * Lee el parámetro q de la URL, lo pone en el input y si tiene valor lanza runSearch
 * Es llamada desde el arranque o desde popstate (navegación con flechas)
 * @param {boolean} shouldUpdateUrl - Bandera que decide si actualizar o no la URL
 */
function syncWithUrl(shouldUpdateUrl) {
    const input = document.querySelector("#search-input");

    const params = new URLSearchParams(window.location.search);
    const queryValue = params.get("q");
    // Asigno el valor de la query al input, para que aparezca en el campo de búsqueda
    input.value = queryValue || "";
    // Si existe, hace todo el proceso de validación y búsqueda (null sino hay nada que buscar)
    if (queryValue) {
        runSearch(queryValue, shouldUpdateUrl);
    } else {
        clearMedications();
        showInitialState();
    }
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
 * Maneja el error de validación del input, mostrando al usuario un error explicito
 * @param {string} reason   Razón del error de validación: 'empty' | 'tooShort' | 'invalidChars'
 */
function handleValidationMsg(reason) {
    // Primero limpio si hay algo en la lista
    clearMedications();
    if (reason === "empty") return;
    // Pinta el msg de validación.
    showValidationMsg(VALIDATION_MESSAGES[reason]);
}

/**
 * Actualiza la URL con el input como param y la pushea a la history del navegador
 * @param {String} query - Input validado introducido por el usuario en form, que será el valor.
 */
function updateUrl(query) {
    const params = new URLSearchParams({ q: query });
    const newUrl = `${window.location.pathname}?${params}`;
    history.pushState({ q: query }, null, newUrl);
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
        a.nombre.localeCompare(b.nombre, "es", { numeric: true }),
    );

    showResults(); //Oculta el spinner, oculta el mensaje, muestra la lista
    // Pinta el contenido de la response
    showMedications(orderedData);
}
