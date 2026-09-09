import { BASE_URL, REQUEST_TIMEOUT_MS } from "./api-config.js";


/**
 * Hace una petición GET al endpoint /medicamento de la API CIMA.
 * No captura errores: tanto los fallos de red (TypeError "Failed to fetch"),
 * como los HTTP no-OK, como los timeouts, se propagan al controller para que decida cómo gestionarlos.
 * Lanza un error si la respuesta no trae 'nregistro' o 'nombre'.
 * @param {string} nregistro - Número de registro del medicamento
 * @returns {Promise<Object>} Objeto con la estructura del medicamento { "nregistro", "nombre", ...}.
 * @throws {Error} Si el servidor responde con un código HTTP distinto de 2xx.
 * @throws {TypeError} Si hay un fallo de red (sin conexión, DNS, etc).
 * @throws {DOMException} TimeoutError - Si se supera el tiempo de espera configurado para el fetch.
 * @throws {Error} - Si no contiene las propiedades 'nregistro' o 'nombre'.
 */
export async function fetchMedication(nregistro) {
    const url = `${BASE_URL}/medicamento?nregistro=${nregistro}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)});

    if (!response.ok) {
        throw new Error(`El fetch al endpoint ${url} ha fallado con un código ${response.status}`); // Caerá en el catch del detail.controller ofavoritos.controller (según quien la llame)
    }
    const data = await response.json();

    // Validación mínima: que sea objeto y tenga lo básico
    if (!data || !data.nregistro || !data.nombre) {
        throw new Error(`La respuesta de /medicamento ${nregistro} no contiene la propiedad 'nombre' o 'nregistro'`); // Caerá en el catch del detail.controller
    }
    return data;
}
