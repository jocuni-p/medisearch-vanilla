// localStorage guarda strings en forma de clave-valor
// Defino la clave, el valor será un array de los números de registro favoritos
const STORAGE_KEY = 'medisearch:favorites';

/*-------PRIVATE FUNCTIONS---------*/
// Nunca las toca nadie desde fuera, ni el controller de forma directa


/**
 * Lee del localStorage el valor de la clave STORAGE_KEY y lo retorna parseado como array.
 * @returns  Array con los valores nregistro o array vacío si no contiene nada
 */
function readList() {
	const data = localStorage.getItem(STORAGE_KEY);
	return data ? JSON.parse(data) : [];
}

/**
 * Reescribe en localStorage el array (lo convierte a string) que le pasamos por parámetro
 * y lo asocia a la clave.
 * 
 * @param {Array} favorites - Array con los números de registro de los favoritos
 */
function writeList(favorites) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}


/*------------PUBLIC FUNCTIONS-----------*/

/**
 * Recupera un array con la lista de favoritos
 * @returns {Array} Array con los nregistro favoritos
 */
export function getFavoritesList() {
	return readList();
}
///OJOOOOOOO DOCUMENTACION: verificar si me llega un number o un string en nregistro
/**
 * Comprueba si un nregistro está en la lista de favoritos.
 * @param {string} nregistro
 * @returns Booleano (true = presente en Favs, false = ausente en Favs)
 */
export function isInFavoritesList(nregistro) {
	return readList().includes(nregistro);
}

/**
 * Añade a la lista de favoritos el elemento que le pasamos por parámetro.
 * Si el elemento ya estaba en la lista, no hace nada.
 * @param {string} nregistro
 */
export function addToFavoritesList(nregistro) {
	const favorites = readList();
	if (!favorites.includes(nregistro)) {
		favorites.push(nregistro);
		writeList(favorites);
	}
}

/**
 * Elimina el elemento pasado por parámetro de la lista de Favoritos
 * @param {string} nregistro 
 */
export function removeFromFavoritesList(nregistro) {
	const favorites = readList();
	const newFav = favorites.filter((n) => n !== nregistro);
	writeList(newFav);
}

/**
 * Añade elemento a la lista si no estaba o lo elimina si ya estaba.
 * @param {string} nregistro 
 * @returns Booleano    true = presente en lista Favs, false = ausente en lista Favs
 */
export function toggleFavoriteStatus(nregistro) {
	if (isInFavoritesList(nregistro)) {
		removeFromFavoritesList(nregistro);
		return false;
	}
	addToFavoritesList(nregistro);
	return true; 
}