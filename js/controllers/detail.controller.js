import { showHeader } from "../views/header.view.js";
import { showFooter } from "../views/footer.view.js";
import { fetchMedication } from "../models/medication.model.js";
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
	renderFavoritesAction,
	hideSupplyTag,
} from "../views/detail.view.js";
import { showLoading, showEmpty, showError, hideLoading } from "../views/ui-state.view.js";

// Arranca el JS al cargar la pagina
document.addEventListener("DOMContentLoaded", init);

async function init() {
    showHeader("Detalle");
    showFooter();
    // nregistro = leer URL
    const nregistro = getValidatedNregistro();
    if (!nregistro) return;
    // muestra el spinner mientras llega promesa
    showLoading();
    try {
        const medication = await fetchMedication(nregistro);
        //Pinta la sección identity en el DOM
        renderIdentity(medication);
        //Pinta seccion del enlace al prospecto
        renderDocs(medication);
        //Recupera y pinta los datos psum y notas, si existen
        triggerSecondaryLoads(medication);
        // Pinta el botón toggle de favoritos con su estado actual desde localStorage
        renderFavoritesAction(medication.nregistro);
    } catch (error) {
        console.error("Error al cargar el medicamento:", error);
        hideLoading();
        showError(MESSAGES.detail.fetchError);
        return;
    }
    hideLoading();
}

/**
 * Lee el nrgistro de la URL, lo valida de forma básica y devuelve su valor o null si es inválido
 * Pinta mensaje al usuario si es invalido.
 * @returns {string|null}
 */
function getValidatedNregistro() {
    const nregistro = getNregistroFromUrl();
    if (!isValidNregistro(nregistro)) {
        showEmpty(MESSAGES.detail.noNregistro);
        return null; // comunica inválido
    }
    return nregistro;
}

/**
 * Obtiene el parametro 'nregistro' de la url actual y lo retorna
 * @returns {string}
 */
function getNregistroFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("nregistro");
}

// Verifico si existe o no el nregistro
function isValidNregistro(nregistro) {
    return Boolean(nregistro);
}

/**
 * Se encarga de recuperar y renderizar los datos de 'psum' y 'notas' si existen
 * @param {Object} medication Objeto que retornó la API
 */
function triggerSecondaryLoads(medication) {
    if (medication.psum) {
        // Hace el fetch a la API, pintar los datos al DOM y maneja los errores
        //Es autónoma, hace un fetch (sin await, llegará cuando llegue)
        loadSupply(medication.nombre);
    }
    if (medication.notas) {
        //Es autónoma, hace un fetch (sin await, llegará cuando llegue)
        loadNotes(medication.nregistro);
    }
}

/**
 * Proporciona los datos de suministro de forma asíncrona, cuando los recibe llama al pintor
 * @param {string} nombre - Nombre completo del medicamento, obtenido de /medicamento
 */
async function loadSupply(nombre) {
    // Mensaje temp mientras carga
    renderSupplyMessage(MESSAGES.detail.supplyLoading);
    try {
        const supplyResponse = await fetchSupplyByName(nombre); // ella si que espera al fetch.
        if (supplyResponse.resultados?.length > 0) {
			renderSupplySection(supplyResponse.resultados[0]);
			//Oculta el tag psum porque se encontraron resultados (para no duplicar info)
			hideSupplyTag();
		} else {
            renderSupplyMessage(MESSAGES.detail.supplyEmpty);
        }
    } catch (error) {
        console.error("No se han podido cargar los datos de suministro", error);
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
        console.error("No se han podido cargar las notas", error);
        //Si el fetch falló, pinta un mensaje en la section y el init no bloquea, al no enterarse
        renderNotesMessage(MESSAGES.detail.notesError);
    }
}
