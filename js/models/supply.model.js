import { BASE_URL } from "./api-config.js";


/**
 * Consulta la API CIMA por nombre exacto de medicamento
 * @param {string} nombre - Denominación completa del nombre
 * @returns {Promise<object>} Response parseada como JSON 
 */
export async function fetchSupplyByName(nombre) {
	const url = `${BASE_URL}/psuministro?nombre=${encodeURIComponent(nombre)}`;
	const response = await fetch(url);
	if (!response.ok) {
		// A este error lo cazará el catch del controller
		throw new Error(`El fetch al endpoint ${url} ha fallado con un código ${response.status}`);
	}
	return response.json(); // retorno la promesa que al resolverse dará el objeto ya parseado
}