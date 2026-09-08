import { BASE_URL, REQUEST_TIMEOUT_MS } from "./api-config.js";

/**
 * Hace una petición GET al endpoint /notas de la API CIMA.
 * No captura errores: tanto los fallos de red (TypeError "Failed to fetch"),
 * como los HTTP no-OK, como los timeouts, se propagan al controller para que decida cómo gestionarlos.
 * @param {string} nregistro - Número de registro del medicamento
 * @returns {Promise<array>} Array de notas parseado desde JSON
 * @throws {Error} Si el servidor responde con un código HTTP distinto de 2xx.
 * @throws {TypeError} Si hay un fallo de red (sin conexión, DNS, etc).
 * @throws {DOMException} TimeoutError - Si se supera el tiempo de espera configurado para el fetch.
 */
export async function fetchNotes(nregistro) {
    const url = `${BASE_URL}/notas?nregistro=${nregistro}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)});
    if (!response.ok) {
        throw new Error(`El fetch al endpoint ${url} ha fallado con un código ${response.status}`);
    }
    return response.json();
}
