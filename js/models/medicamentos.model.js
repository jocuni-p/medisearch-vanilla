
// Esto deberia ser una var global y verse desde todos los fetch() a la API
const BASE_URL = 'https://cima.aemps.es/cima/rest';


// A esta funcion la llama el controller con el endpoint + input que recibe del search 

// Respeto el nombre 'Medicamentos' en el mismo idioma que esta en la API
async function fetchMedicamentos() {
	// Creo la ruta
	const endpoint = `${BASE_URL} placeholder(+ endpoint + param)`;

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

/* 
// Temp: Datos DE PRUEBA para poder crear el primer mock
const resultados = [
	{
		nregistro: "60954",
		nombre: "COULDINA CON ACIDO ACETILSALICILICO COMPRIMIDOS EFERVESCENTES",
		comerc: true,
		receta: false,
		generico: false,
		psum: false,
		formaFarmaceuticaSimplificada: {
			id: 13,
			nombre: "COMPRIMIDO EFERVESCENTE",
		},
		vtm: {
			id: 139071000140108,
			nombre: "ácido acetilsalicílico + clorfenamina + fenilefrina",
		}
	},
	{
		nregistro: "81807",
		nombre: "COULDINA CON IBUPROFENO COMPRIMIDOS EFERVESCENTES",
		comerc: true,
		receta: false,
		generico: false,
		psum: false,
		formaFarmaceuticaSimplificada: {
			id: 13,
			nombre: "COMPRIMIDO EFERVESCENTE",
		},
		vtm: {
			id: 185651000140100,
			nombre: "ibuprofeno + clorfenamina + fenilefrina",
		}
	}
];

 */