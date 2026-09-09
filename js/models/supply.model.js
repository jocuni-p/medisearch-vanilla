import { BASE_URL, REQUEST_TIMEOUT_MS } from "./api-config.js";

/**
 * Hace una petición GET al endpoint /psuministro de API CIMA por nombre exacto de medicamento.
 * No captura errores: tanto los fallos de red (TypeError "Failed to fetch"),
 * como los HTTP no-OK, como los timeouts, se propagan al controller para que decida cómo gestionarlos.
 * @param {string} nombre - Denominación completa del nombre
 * @returns {Promise<object>} Response parseada como JSON
 * @throws {Error} Si el servidor responde con un código HTTP distinto de 2xx.
 * @throws {TypeError} Si hay un fallo de red (sin conexión, DNS, etc).
 * @throws {DOMException} TimeoutError - Si se supera el tiempo de espera configurado para el fetch.
 */
export async function fetchSupplyByName(nombre) {
	const url = `${BASE_URL}/psuministro?nombre=${encodeURIComponent(nombre)}`;
	console.log(url);
    const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)});
    if (!response.ok) {
        // A este error lo cazará el catch del controller
        throw new Error(`El fetch al endpoint ${url} ha fallado con un código ${response.status}`);
    }
    return response.json(); // retorno la promesa que al resolverse dará el objeto ya parseado
}
