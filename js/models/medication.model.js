import { BASE_URL } from './api-config.js';



export async function fetchMedication(nregistro) {
	const url = `${BASE_URL}/medicamento?nregistro=${nregistro}`;
	const response = await fetch(url);
	
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}`); // Caerá en el catch del detail.controller
	}
	const data = await response.json();
	
	// Validación mínima: que sea objeto y tenga lo básico
	if (!data || !data.nregistro || !data.nombre) {
		throw new Error('Response inválida'); // Caerá en el catch del detail.controller
	}
	return data; 
}
