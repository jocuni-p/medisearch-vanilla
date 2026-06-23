
// Esto deberia ser una var global y verse desde todos los fetch() a la API
const BASE_URL = 'https://cima.aemps.es/cima/rest';
const PATH = '/medicamentos';
const QUERY_PARAMS_PREV = '?nombre=';
const QUERY_PARAMS_POST = '&comerc=1';


// A esta funcion la llama el controller con el input que recibe del search 

export async function fetchMedications(query) {
	// Creo la ruta
	const endpoint = `${BASE_URL}${PATH}${QUERY_PARAMS_PREV}${query}${QUERY_PARAMS_POST}`;

	try {
		// Hago la request
		const response = await fetch(endpoint);
		// Manejo de errores
		if (!response.ok) {
			// Lanzo un error (instancio la clase nativa Error que muestra un mensaje informativo)
			// Salta todo el flujo que le sigue hasta encontrar un 'catch' que atrape el throw
			throw new Error(`El fetch al endpoint ${endpoint} ha fallado con un código ${response.status}`);
		}
		// convierto la response en json a un objeto/array
		const data = await response.json();
		return data;
	} catch (error) { 
		console.error(error);
	}
}
