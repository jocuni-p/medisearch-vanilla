// Es el primer js que se ejecuta de Detail

import { showHeader } from "../views/header.view.js";
import { fetchMedication } from "../models/medication.model.js"
import {
	renderIdentity,
	renderDocs,
	renderSupplySection,
	renderNotes,
	renderFavoritesAction
} from "../views/detail.view.js"
import {
	showLoading,
	showEmpty,
	showError,
	showResults,
	hideError,
	hideLoading,
} from "../views/ui-state.view.js";
import { MESSAGES } from "../views/ui-messages.js";


/*====CONSTANTS====*/
//TODO: preparados para que las funciones render* los reciban cuando las implemente
const ID_MAIN = "medication-identity";
const ID_DOCS = "medication-docs";
const ID_SUPP = "medication-supply";
const ID_NOTE = "medication-notes";
const ID_FAV = "medication-fav-action";


// Arranca el JS al cargar la pagina
document.addEventListener('DOMContentLoaded', init);

/** =======TODO: ESTA CASI EN ESQUELETO - HAY QUE REFACTORIZARLA , MUY LARGA=========
 */
async function init() {

	showHeader("Detalle"); // importa el modulo header
	// nregistro = leer URL
	const nregistro = getNregistroFromUrl(); // creada más abajo
	//getValidatedNregistro(nregistro);
	
	if (!isValidNregistro(nregistro)) {
		// Oculta spinner, muestra mensaje y oculta lista si existe
		showEmpty(MESSAGES.detail.noNregistro)
		return;
	}
	// muestra el spinner mientras llega el valor de la promise del fetch 
	showLoading();
	let medication; // Declarada aquí para que tenga vida fuera del try.
	try {
		medication = await fetchMedication(nregistro); //PENDING:de medication.model. alli crearé el url y haré la validación
		
		//TODO: La validación del renderIdentity va en el model
		renderIdentity(medication); // renderiza una sección (asume solo el pintado => view)
		renderDocs(medication); // renderiza la otra => view
		// Si 'psum' existe hace un fetch (sin await, cuando llegue)
		if (medication.psum) {
			loadSupply(medication);// PENDING:render progresivo al no tener await
		}
		
		// Si 'notas' existe hace un fetch (sin await, cuando llegue)
		if (medication.notas) {
			loadNotes(medication);// PENDING: render progresivo al no tener await
		}
		// TODO: lógica de favoritos
		// Localiza el botón, comprueba (localStorage)si está ya en favoritos, pinta texto del botón según el estado, conecta un addEventListener que alterna el estado
		//wireFavoriteButton(medication); // ESQUELETO
	} catch (error) {
		console.error('Error al cargar el medicamento:', error);
		hideLoading();
		showError(MESSAGES.detail.fetchError);
		return;
	}
	hideLoading();
}

/**
 * Obtiene el parametro 'nregistro' de la url actual
 * @returns <string> 
 */
function getNregistroFromUrl() {
	const params = new URLSearchParams(window.location.search);
	return params.get('nregistro');
}

// Verifico si existe o no nregistro
function isValidNregistro(nregistro) {
	return Boolean(nregistro); 
}

// Validación básica de nregistro
/* function getValidatedNregistro(nregistro) {
	if (!isValidNregistro(nregistro)) {
			// Oculta spinner, muestra mensaje y ojo:oculta lista (esto último puede dar problemas)
			showEmpty(MESSAGES.detail.noNregistro)
			return;
		}

}
 */

async function loadSupply(medication) { /* TODO */ }
async function loadNotes(medication) { /* TODO */ }
