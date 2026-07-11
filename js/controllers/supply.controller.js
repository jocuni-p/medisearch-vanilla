import { showHeader } from "../views/header.view.js";
import { showFooter } from "../views/footer.view.js";
/* import { fetchMedication } from "../models/medication.model.js";
import { MESSAGES } from "../views/ui-messages.js";
import { showLoading, showEmpty, showError, hideLoading } from "../views/ui-state.view.js";
import { getFavoritesList } from "../models/favorites.storage.js";
import { renderFavoritesList } from "../views/favorites.view.js";
 */

// Arranca el JS al cargar la pagina
document.addEventListener("DOMContentLoaded", init);

async function init() {
	showHeader("Suministro");
	showFooter();
	/* //Array
	const nregistros = getFavoritesList();
	if (nregistros.length === 0) {
		showEmpty(MESSAGES.favorites.empty);
		return;
	}
	showLoading();

	try {
		// Para cada nregistro del array hace un fetch a /medicamento. 
		// Devuelve un array de promesas pendientes.
		const promises = nregistros.map(n => fetchMedication(n));
		// Es un array de medicamentos
		// Espera hasta tener todas las responses (si falla una, falla todo)
		// TODO Para linea futura: evitar que caiga si uno falla
		const medications = await Promise.all(promises);
		// Oculta el spinner
		hideLoading();
		// Pinta la lista
		renderFavoritesList(medications);

	} catch (error) {
		console.error("Error cargando favoritos: ", error);
		hideLoading();
		showError(MESSAGES.favorites.fetchError);
	} */
}