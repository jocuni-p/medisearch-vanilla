import { showHeader } from "../views/header.view.js";
import { showFooter } from "../views/footer.view.js";
import { fetchMedication } from "../models/medication.model.js";
import { MESSAGES } from "../views/ui-messages.js";
import { showLoading, showEmpty, showError, hideLoading } from "../views/ui-state.view.js";
import { getFavoritesList } from "../models/favorites.storage.js";
import { renderFavoritesList } from "../views/favorites.view.js";

// Arranca el JS al cargar la pagina
document.addEventListener("DOMContentLoaded", init);

async function init() {
    showHeader("Favoritos");
    showFooter();
    //Array
    const nregistros = getFavoritesList();
    if (nregistros.length === 0) {
        showEmpty(MESSAGES.favorites.empty);
        return;
    }
    showLoading();
    try {
	    // Obtiene un array de obj con status de cada fetch (fulfilled/rejected) y valor o reason si falló
        const results = await Promise.allSettled(nregistros.map((n) => fetchMedication(n)));

		// Crea un array de objetos con las respuestas de las promesas [{ok: true, medication: {...} }, ...]
		// El parámetro 'i' es un índice
        const favorites = results.map((r, i) =>
            r.status === "fulfilled" ? { ok: true, medication: r.value } : { ok: false, nregistro: nregistros[i] },
		);

		// Si fallan todos los fetch, muestra un mensaje de error
		// Método iterativo Array.every(): Comprueba si todos los elementos del array cumplen una misma condición. Retorna booleano.
		// Si el elemento 'ok' de todos los elementos del array no existe (es false) retorna 'true'
		const allFailed = favorites.every(favorite => !favorite.ok);
		if (allFailed) {
			showError(MESSAGES.favorites.fetchError);
			return;
		}

		// Ordena los favoritos alfabeticamente, los fetch fallidos se ponen al final del array
		const orderedFavorites = favorites.toSorted((a, b) => {
			if (a.ok !== b.ok) return a.ok ? -1 : 1;
			if (!a.ok) return 0;
			return a.medication.nombre.localeCompare(b.medication.nombre, "es", {numeric: true});
		});

        // Oculta el spinner
        hideLoading();
        // Pinta la lista
        renderFavoritesList(orderedFavorites);
    } catch (error) {
        console.error("Error cargando favoritos: ", error);
        hideLoading();
        showError(MESSAGES.favorites.fetchError);
    }
}
