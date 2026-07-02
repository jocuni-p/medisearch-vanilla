// Es el primer js que se ejecuta de Detail

import { showHeader } from "../views/header.view.js";
import { fetchMedication } from "../models/medication.model.js"
import { MESSAGES } from "../views/ui-messages.js";
import { fetchSupplyByName } from "../models/supply.model.js";
import { fetchNotes } from "../models/notes.model.js";
import {
	renderIdentity,
	renderDocs,
	renderSupplySection,
	renderSupplyMessage,
	renderNotes,
	renderNotesMessage,
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
		
		//Pinta la sección identity en el DOM
		//TODO: La validación del renderIdentity va en el model
		renderIdentity(medication); // renderiza una sección (asume solo el pintado -> view)
		//Pinta seccion de la documentación(botón enlace al prospecto)
		renderDocs(medication); // renderiza la otra -> view
		// Si 'psum' existe, hace un fetch (sin await, cuando llegue)
		if (medication.psum) {
			// Ha de hacer el fetch a la API y pintar los datos al DOM
			// Dentro de loadSupply hacer el fetch y manejar error si falla con renderSupplyMessage()(ya sea por que falló el fetch o por resultado vacio.
			// Es una autónoma async y se renderiza progresivamente al no tener await
			loadSupply(medication.nombre);
		}
	
		// Si 'notes' existe hace un fetch (sin await, cuando llegue se pintará)
		if (medication.notas) {
			//TODO.
			// fetch a nuevo endpoint + ?nombre=nregistro y pintar datos al DOM
			loadNotes(medication.nregistro);// TODO: es async, render progresivo al no tener await
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

/**
 * Proporciona los datos de suministro de forma asíncrona, cuando los recibe llama al pintor
 * @param {String} nombre - Nombre completo del medicamento, obtenido de /medicamento 
 */
async function loadSupply(nombre) { 
	// Mensaje temp mientras carga 
	renderSupplyMessage(MESSAGES.detail.supplyLoading);

	try {
		const supplyResponse = await fetchSupplyByName(nombre); // ella si que espera al fetch.
		if (supplyResponse.resultados?.length > 0) {
			renderSupplySection(supplyResponse.resultados[0]);
		} else {
			renderSupplyMessage(MESSAGES.detail.supplyEmpty);
		}
	} catch (error) {
		// Registro el fallo en consola
		console.error('No se han podido cargar los datos de suministro', error);
		//Si el fetch falló, pinta un mensaje en la section y el init no bloquea, al no enterarse 
		renderSupplyMessage(MESSAGES.detail.supplyError);
	}
}
 


/**
 * Proporciona los datos de 'notas' de forma asíncrona, cuando los recibe llama al pintor
 * @param {string} nregistro - Número de registro obtenido de /medicamento 
 */
async function loadNotes(nregistro) {
	renderNotesMessage(MESSAGES.detail.notesLoading);

	try {
		const notesResponse = await fetchNotes(nregistro); // espera al fetch.
		if (notesResponse.length > 0) {
			renderNotes(notesResponse[0].asunto);
		} else {
			renderNotesMessage(MESSAGES.detail.notesEmpty);
		}
	} catch (error) {
		// Registro el fallo en consola
		console.error('No se han podido cargar las notas', error);
		//Si el fetch falló, pinta un mensaje en la section y el init no bloquea, al no enterarse 
		renderNotesMessage(MESSAGES.detail.notesError);
	}
}
