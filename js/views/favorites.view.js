import { MESSAGES } from "./ui-messages.js";

/**
 * Pinta la lista de medicamentos favoritos
 * @param {Array} favorites - Array de objetos contiene el status del fetch y el medicamento [{ok: true, medication: {...}}, ...]
 */
export function renderFavoritesList(favorites) {
	const container = document.querySelector('#favorites-list');
	//Limpieza por si se llama 2 veces que no acumule elementos dentro
	container.replaceChildren();

	//mapea cada medicamento: si tiene un 'ok' valido a nodo <li> con su nombre y un enlace
	// si no a <li> fallido
	const items = favorites.map(favorite => favorite.ok
		? buildFavoriteItem(favorite.medication)
		: buildFailedItem());

	// Los inserta en la lista como elementos sueltos y todos de golpe.
	container.append(...items);
}


// Helper privado
/**
 * Crea un <li> en la página con el nombre del medicamento enlazado a la vista de detalle
 * @param {Object} medication 
 * @returns {HTMLLIElement}  Nodo <li> con el enlace
 */
function buildFavoriteItem(medication) {
	const li = document.createElement('li');
	li.classList.add('favorites-item');

	// Crea el link a la página de detalle
	const link = document.createElement('a');
	link.href = `detail.html?nregistro=${medication.nregistro}`;
	link.textContent = medication.nombre;

	li.append(link);
	return li;
}

/**
 * Crea un <li> en la página con el mensaje de error y sin enlace
 * @returns {HTMLLIElement}  Nodo <li> sin enlace
 */
function buildFailedItem() {
	const li = document.createElement('li');
	li.classList.add('favorites-item', 'favorites-item-failed');
	li.textContent = MESSAGES.favorites.itemError;	
	return li;
}