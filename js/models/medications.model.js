import { BASE_URL, REQUEST_TIMEOUT_MS } from "./api-config.js";

/**
 * Hace una petición GET al endpoint /medicamentos de la API CIMA filtrando
 * por nombre comercial y limitando a medicamentos actualmente comercializados.
 * No captura errores: tanto los fallos de red (TypeError "Failed to fetch")
 * como los HTTP no-OK como los timeouts, se propagan al controller para que decida cómo gestionarlos.
 * @param {string} query - Texto a buscar (nombre comercial del medicamento).
 * @returns {Promise<Object>} Objeto con la estructura { totalFilas, pagina, tamanioPagina, resultados[] }.
 * @throws {Error} Si el servidor responde con un código HTTP distinto de 2xx.
 * @throws {TypeError} Si hay un fallo de red (sin conexión, DNS, etc).
 * @throws {DOMException} TimeoutError - Si se supera el tiempo de espera configurado para el fetch.
 */
export async function fetchMedications(query) {
    const url = new URL(`${BASE_URL}/medicamentos`);
    url.searchParams.set("nombre", query);
    url.searchParams.set("comerc", "1");
    const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)});
    if (!response.ok) {
        throw new Error(`El fetch al endpoint ${url} ha fallado con un código ${response.status}`);
    }
    // convierto la response de json a objeto/array
	const data = await response.json();
    return data;
}
