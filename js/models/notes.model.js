import { BASE_URL } from "./api-config.js";

/**
 * Consulta la API CIMA por numero de registro
 * @param {string} nregistro - Número de registro del medicamento
 * @returns {Promise<array>} Array de notas parseado desde JSON
 */
export async function fetchNotes(nregistro) {
    const url = `${BASE_URL}/notas?nregistro=${nregistro}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`El fetch al endpoint ${url} ha fallado con un código ${response.status}`);
    }
    return response.json();
}
