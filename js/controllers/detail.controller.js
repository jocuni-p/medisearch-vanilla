// Es el primer js que se ejecuta de Detail

import { showHeader } from "../views/header.view.js";
import { fetchMedication } from "../models/medication.model.js"
import {
	renderIdentity,
	renderDocs,
	renderSupplySection,
	renderNotes,
	renderFavAction
} from "../views/detail.view.js"
import {
	showLoading,
	showEmpty,
	showResults,
	hideError,
	hideLoading,
} from "../views/ui-state.view.js";
import { MESSAGES } from "../views/ui-messages.js";


/*====CONSTANTS====*/
const ID_MAIN = "medication-identity";
const ID_DOCS = "medication-docs";
const ID_SUPP = "medication-supply";
const ID_NOTE = "medication-notes";
const ID_FAV = "medication-fav-action";


/** =======TODO: ESTA CASI EN ESQUELETO - HAY QUE REFACTORIZARLA , MUY LARGA=========
 */
async function init() {

	showHeader("Detalle"); // importa el modulo header
	// nregistro = leer URL
	const nregistro = getNregistroFromUrl(); // creada más abajo
	console.log(nregistro); // DEBUG
	if (!isValidNregistro(nregistro)) {
		// Oculta spinner, muestra mensaje y ojo:oculta lista (esto último puede dar problemas)
		showEmpty(MESSAGES.detail.noNregistro)
		return;
	}
	// muestra el spinner mientras llega el valor de la promise del fetch 
	showLoading();
	let medication; // Declarada aquí para que tenga vida fuera del try.
	try {
		medication = await fetchMedication(nregistro); //importar de medication.model. alli crearé el url y haré la validación
		//Yo creo que aquí he de validar la response o lo hace el renderIdentity?
		renderIdentity(medication); // renderiza una sección (asume solo el pintado => view)
		renderDocs(medication); // renderiza la otra => view
		// Si 'psum' existe hace un fetch (sin await, cuando llegue)
		if (medication.psum) {
			loadSupply (sin await)// render progresivo
		}
		// Si 'notas' existe hace un fetch (sin await, cuando llegue)
		if (medication.notas) {
			loadNotes(sin await)// render progresivo
		}
		// TODO: lógica de favoritos
		// Localiza el botón, comprueba (localStorage)si está ya en favoritos, pinta texto del botón según el estado, conecta un addEventListener que alterna el estado
		wireFavoriteButton(medication);
	} catch (error) {
		console.error('Error al cargar el medicamento:', error);
		hideLoading();
		showEmpty(MESSAGES.detail.fetchError);
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