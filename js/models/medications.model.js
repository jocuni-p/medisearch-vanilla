import { BASE_URL } from "./api-config.js";

/**
 * Hace una petición GET al endpoint /medicamentos de la API CIMA filtrando
 * por nombre comercial y limitando a medicamentos actualmente comercializados.
 * No captura errores: tanto los fallos de red (TypeError "Failed to fetch")
 * como los HTTP no-OK se propagan al controller para que decida cómo gestionarlos.
 *
 * @param {string} query - Texto a buscar (nombre comercial del medicamento).
 * @returns {Promise<Object>} Objeto con la estructura { totalFilas, pagina, tamanioPagina, resultados[] }.
 * @throws {Error} Si el servidor responde con un código HTTP distinto de 2xx.
 * @throws {TypeError} Si hay un fallo de red (sin conexión, DNS, etc).
 */
export async function fetchMedications(query) {
    // Creo la ruta
    const url = new URL(`${BASE_URL}/medicamentos`);
    url.searchParams.set("nombre", query);
    url.searchParams.set("comerc", "1");
    const response = await fetch(url); //El fetch() tambien puede lanzar su propio TypeError 
    if (!response.ok) {
        // Errores de HTTP no-OK (404, 500)
        // Lanzo un error (instancio la clase nativa Error que muestra un mensaje informativo)
        // El error se propagará hasta el catch del controller
        throw new Error(`El fetch al endpoint ${url} ha fallado con un código ${response.status}`);
    }
    // convierto la response de json a objeto/array
    const data = await response.json();
    return data;
}
