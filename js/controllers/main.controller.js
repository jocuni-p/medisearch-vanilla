// LLama a un modulo que contiene showHeader() para que rellene el header

import { showHeader } from "../views/header.view.js";
import { showMedications, clearMedications } from "../views/main.view.js";
import { fetchMedications } from "../models/medications.model.js";

/* ==== CONSTANTS ==== */
const VALID_INPUT_REGEX = /^[a-záéíïóúüñ0-9\s\-/.,]+$/i


/**
 * VALIDA EL INPUT: si esta vacio, si es menor de 4 caracteres y si cumple
 * un patrón determinado. 
 * @param {string} input 
 * @returns Objeto con una propiedadad booleana y otra opcional con mensaje informativo
 */
function validateInput(input) {
	if (input.length === 0) {
		return {valid: false, reason: 'empty'};
	}
	if (input.length < 4) {
		return { valid: false, reason: 'tooShort' };
	}
	if (!VALID_INPUT_REGEX.test(input)) {
		return { valid: false, reason: 'invalidChars' };
	}
	return { valid: true };
}


/**
 * FUNCIÓN MANEJADORA DEL EVENTO: Recibe el objeto del evento, previene que se recargue la página,
 * recupera el valor del input, lo trima por si hay espacios antes y/o después,
 * lo pasa al model para que haga el fetch
 * @param {system object} event 
 */
async function handleSearch(event) {
	event.preventDefault(); // previene la recarga de la página para que no se pierdan los datos
	const input = document.querySelector('#search-input'); // selecciono el elemento por id
	const valor = input.value.trim(); //recupero valor con espacios trimados al inicio y final
	// 1. VALIDACIÓN DEL INPUT
	const resultInput = validateInput(valor);
	if (!resultInput.valid) { // Si no es válido
		console.log(resultInput.reason); // DEBUG TEMP
		return; // DEBUG TEMP Salir sin hacer nada. Despues habrá de mostrar en el navegador
	}
	console.log(valor); // DEBUG
	try {
		// 2. PETICIÓN A LA API
		const data = await fetchMedications(valor); // Esta función devuelve una promise
		// 3. VALIDACIÓN DE LA RESPONSE (en el controller, porque la petición fué ok, pero sin contenido)
		// Valido que la response sea un array (es raro pero podría pasar si modifican la API)
		if (!Array.isArray(data.resultados)) {
			throw new Error('Respuesta inesperada de la API');
		}
		// Verifico si es una response ok, pero con contenido 0
		if (data.resultados.length === 0) { // La response es ok, pero no trae ningún resultado
			clearMedications(); // Limpia el listado de cards previas
			console.log('No se han encontrado resultados'); // TEMP: Habrá que mostrarlo en el div del navegador
			return;
		}
		// RESPONSE VÁLIDA CON RESULTADOS
		//data es un obj. He de pasarle un array. 
		showMedications(data.resultados);
	} catch (error) { // Si hubo algún error en el (fetch) proceso lo cazará
		console.log('Ha habido un problema al conectar con CIMA. Inténtalo de nuevo', error.message); // DEBUG
		clearMedications();
	}
}

/**
 * PUNTO DE ARRANQUE DEL JS
 */
function init() {
	// 1. MOSTRAR HEADER
	showHeader("Inicio");
	
	// 2. IMPLEMENTA LISTENER DE EVENTOS EN EL FORM 
	const form = document.querySelector('#form');
	form.addEventListener('submit', handleSearch);
}

init();


/*
controller:
    showState('loading')
    try:
        data = await fetchMedications(query)
        si data.resultados.length === 0:
            showState('empty')
        sino:
            showMedications(data.resultados)
    catch:
        showState('error')
*/

