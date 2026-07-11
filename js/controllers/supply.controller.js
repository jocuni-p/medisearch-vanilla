import { showHeader } from "../views/header.view.js";
import { showFooter } from "../views/footer.view.js";

// Arranca el JS al cargar la pagina
document.addEventListener("DOMContentLoaded", init);

async function init() {
	showHeader("Suministro");
	showFooter();

	//TODO: Línea fututra implementación del JS
}