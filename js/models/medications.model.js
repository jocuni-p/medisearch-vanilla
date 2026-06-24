
// Esto deberia ser una var global y verse desde todos los fetch() a la API
const BASE_URL = 'https://cima.aemps.es/cima/rest';
const PATH = '/medicamentos';
const QUERY_PARAMS_PREV = '?nombre=';
const QUERY_PARAMS_POST = '&comerc=1';

/**
 * 
 * @param {*} query 
 * @returns 
 */
export async function fetchMedications(query) {
	// Creo la ruta
	const endpoint = `${BASE_URL}${PATH}${QUERY_PARAMS_PREV}${query}${QUERY_PARAMS_POST}`;
	const response = await fetch(endpoint); //El fetch() tambien puede lanzar su propio TypeError "Failed to fetch" que escalará hasta el catch del controller.
	if (!response.ok) { // Errores de HTTP no-OK (404, 500)
		// Lanzo un error (instancio la clase nativa Error que muestra un mensaje informativo)
		// El error se propagará hasta el catch del controller
		throw new Error(`El fetch al endpoint ${endpoint} ha fallado con un código ${response.status}`);
	}
	// convierto la response de json a objeto/array
	const data = await response.json();
	return data;
}
