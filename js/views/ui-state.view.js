/**
 * Este módulo es reutilizable para gestión de estados de respuesta (spinner, mensaje, lista de resultados, mensaje inicial orientativo).
 * 
 * Se llama desde el controller que necesite mostrar feedback al usuario durante las operaciones asíncronas. Lo usa main.controller, detail y favorites.
 * 
 * El llamador indica el state deseado y el módulo muestra/oculta el elemento correspondiente.
 * Los mensajes de texto se reciben como argumento (ver ui-messages.js para los textos).
 */

/* ========= PUBLIC FUNCTIONS ========= */

// Wrappers de la misma función, para mejorar semántica
/**
 * Estado sin resultados: muestra el mensaje recibido y oculta la lista.
 * Comparte implementación con showError, pero se mantiene aparte porque
 * comunica algo distinto: la petición fue bien y no encontró nada.
 * @param {string} msg - Texto a mostrar (ver ui-messages.js)
 */
export function showEmpty(msg) { setMessageState(msg); }

/**
 * Estado de error: muestra el mensaje recibido y oculta la lista.
 * @param {string} msg - Texto a mostrar (ver ui-messages.js)
 */
export function showError(msg) { setMessageState(msg); }

/**
 * Estado de carga: muestra el spinner y oculta todo lo demás.
 * El controller la llama antes de lanzar la petición a la API.
 */
export function showLoading() {
	showInitialText(false);
	showSpinner(true);
	hideMessage();
	showList(false);
}

/**
 * Estado de resultados: oculta spinner y mensaje, y muestra la lista.
 * No pinta las cards; de eso se encarga la vista correspondiente.
 */
export function showResults() {
	showInitialText(false);
	showSpinner(false);
	hideMessage();
	showList(true);
}

/**
 * Estado inicial de la página de inicio: oculta la lista y el mensaje,
 * y muestra el texto orientativo de bienvenida.
 * En las páginas que no tienen ese texto, no hace nada visible.
 */
export function showInitialState() {
	showList(false);
	hideMessage();
	showInitialText(true);
}

/**
 * Apaga el spinner sin tocar el resto de elementos.
 */
export function hideSpinnerOnly() {
	showSpinner(false);
}


/* ========= PRIVATE FUNCTIONS ========= */

/**
 * Muestra/oculta el spinner según el valor del parámetro
 * @param {boolean} flag - true para mostrar, false para ocultar
 */
function showSpinner(flag) {
	const spinner = document.querySelector('#spinner');
	if (flag) {
		spinner.classList.remove('hidden');
	}
	else {
		spinner.classList.add('hidden');
	}
}

/**
 * Muestra/oculta un mensaje en el container state-message.
 * Si el parámetro es falsy (string vacio, null, undefined), oculta el mensaje.
 * @param {string} msg - Texto del mensaje a mostrar. Vacío para ocultar.
 */
function showMessage(msg) {
	if (!msg) {
		hideMessage();
	}
	else {
		const message = document.querySelector('#state-message');
		message.textContent = msg;
		message.classList.remove('hidden');
	}
}

/**
 * Oculta el texto (mensaje) del div state-message
 */
function hideMessage() {
	const message = document.querySelector('#state-message');
	message.classList.add('hidden');
}

/**
 * Muestra/oculta la lista de cards según el valor del parámetro
 * @param {boolean} flag - true para mostrar, false para ocultar
 */
function showList(flag) {
	const list = document.querySelector('#results-list');
	// En favorites la lista se llama #favorites-list, por tanto list es null, así que sale aquí
	if (!list) return;
	if (flag) {
		list.classList.remove('hidden');
	}
	else {
		list.classList.add('hidden');
	}
}

/**
 * Muestra/oculta el mensaje inicial explicativo según el valor del parámetro
 * @param {boolean} flag - true para mostrar, false para ocultar
 */
function showInitialText(flag) {
	const initialText = document.querySelector('#initial-text');
	if (!initialText) return;
	if (flag) {
		initialText.classList.remove("hidden");
	} else {
		initialText.classList.add("hidden");
	}
}

// Mantengo ambas porque ayudan por semántica
function setMessageState(msg) {
	showInitialText(false);
	showSpinner(false);
	showMessage(msg);
	showList(false);
}
