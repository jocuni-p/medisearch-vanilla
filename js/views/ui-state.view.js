/**
 * Este módulo es reutilizable para gestión de estados de respuesta (spinner, mensaje, lista de resultados).
 * 
 * Se llama desde el controller que necesite mostrar feedback al usuario durante las operaciones asíncronas. Lo usaré en main.controller, en detail y favorites.
 * 
 * El llamador indica el state deseado y el módulo muestra/oculta el elemento correspondiente.
 * Los mensajes de texto se reciben como argumento (ver ui-messages.js para los textos).
 */

/* ========= PUBLIC FUNCTIONS ========= */


// OJO: ------Falta una explicación clara de que hace cada función.------

export function showLoading() {
	showInitialText(false);
	showSpinner(true);
	hideMessage();
	showList(false);
}

// Wrappers diferentes de la misma función, para mejorar semántica
export function showEmpty(msg) { setMessageState(msg); }
export function showError(msg) { setMessageState(msg); }

export function showResults() {
	showInitialText(false);
	showSpinner(false);
	hideMessage();
	showList(true);
}

export function hideLoading() {
	showSpinner(false);
}

export function hideError() {
	hideMessage();
}

/* ========= PRIVATE FUNCTIONS ========= */

/**
 * Muestra/oculta el spinner según si recibe o no parámetro
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
 * Muestra/oculta la lista de cards según reciba o no parámetro
 * @param {boolean} flag - true para mostrar, false para ocultar
 */
function showList(flag) {
	const list = document.querySelector('#results-list');
	// En favorites la lista se llama #favorites-list, por tanto list es null, así que sale aquí
	if (!list) return;

	if (flag) {
		// Muestra la lista de resultados
		list.classList.remove('hidden');
	}
	else {
		// Oculta lista de resultados
		list.classList.add('hidden');
	}
}

/**
 * Muestra/oculta el mensaje inicial explicativo según exista o no lista de medicamentos que mostrar 
 * @param {boolean} flag - true para mostrar, false para ocultar
 */
function showInitialText(flag) {
	const initialText = document.querySelector('#initial-text');
	// Si no hay nada, sale sin hacer nada.
	if (!initialText) return;

	if (flag) {
		// Muestra el texto inicial si NO existe lista de medicamentos que mostrar.
		initialText.classList.remove("hidden");

	} else {
		// Oculta el texto inicial si existe lista de medicamentos que mostrar
		initialText.classList.add("hidden");
	}


}
//Privada genérica (showError y showEmpty vienen aquí. Las mantengo ambas porque ayudan por  semántica)
function setMessageState(msg) {
	showInitialText(false);
	showSpinner(false);
	showMessage(msg);
	showList(false);
}
