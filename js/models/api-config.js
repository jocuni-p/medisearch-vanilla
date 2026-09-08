/* ===== CONSTANTS ====== */

export const BASE_URL = 'https://cima.aemps.es/cima/rest';
export const BASE_IMG_URL = 'https://cima.aemps.es/cima/fotos/full/materialas';

// Testeo con 5 o 6 peticiones a los endpoints y todas están entre 110 y 380 ms. Por tanto, un timeout de 5000 ms es suficiente y deja margen amplio para picos de carga o redes lentas.
export const REQUEST_TIMEOUT_MS = 5000;