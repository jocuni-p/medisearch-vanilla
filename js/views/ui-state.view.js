/**
 * Este módulo es reutilizable para gestión de estados de UI (loading, empty, error, results).
 * 
 * Se llama desde el controller que necesite mostrar feedback al usuario durante las operaciones asíncronas. Lo usaré en main.controller, en detail y favorites.
 * 
 * El llamador indica el state deseado y el módulo muestra/oculta el elemento correspondiente.
 * Los mensajes de texto se reciben como argumento (ver ui-messages.js para lops textos).
 */

/* ========= PUBLIC FUNCTIONS ========= */

export function showLoading() {
	showSpinner(true);
	hideMessage();
	showList(false);
}

// Wrappers diferentes de la misma función, para mejorar semántica
export function showEmpty(msg) { setMessageState(msg); }
export function showError(msg) { setMessageState(msg); }

export function showResults() {
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
 * Muestra/oculta la lista de cards según reciba o no parametro
 * @param {boolean} flag - true para mostrar, false para ocultar
 */
function showList(flag) {
	const list = document.querySelector('#results-list');
	if (!list) return; //para que sea reutilizable en páginas que no tienen lista
	if (flag) {
		list.classList.remove('hidden');
	}
	else {
		list.classList.add('hidden');
	}
}

//Privada genérica (showError y showEmpty vienen aquí. Las mantengo ambas porque ayudan por  semántica)
function setMessageState(msg) {
	showSpinner(false);
	showMessage(msg);
	showList(false);
}