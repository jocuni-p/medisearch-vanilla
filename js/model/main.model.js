
// Esto deberia ser una var global y verse desde todos los fetch() a la API
const BASE_URL = 'https://cima.aemps.es/cima/rest';


// A esta funcion la llama el controller con el endpoint + input que recibe del search 

// Respeto el nombre 'Medicamentos' en el mismo idioma que esta en la API
async function fetchMedicamentos() {
	// Creo la ruta
	const endpoint = `${BASE_URL} + endpoint + param`
	// hago la request
	const response = await fetch(endpoint);
	// convierto la response de json -> objeto/array
	const data = await response.json();
}