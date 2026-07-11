
/**
 * Pinta la lista de medicamentos favoritos
 * @param {Array} medications  Array de objetos medicamento
 */
export function renderFavoritesList(medications) {
	const container = document.querySelector('#favorites-list');
	//Limpieza por si se llama 2 veces que no acumule elementos dentro
	container.replaceChildren();

	//mapea cada medicamento a nodo <li> con su nombre y un enlace
	const items = medications.map(medication => buildFavoriteItem(medication));

	// Los inserta en la lista como elementos sueltos y todos de golpe.
	container.append(...items);
}


// Helper privado
/**
 * Crea un li en la página con el nombre del medicamento enlazado a la vista de detalle
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
