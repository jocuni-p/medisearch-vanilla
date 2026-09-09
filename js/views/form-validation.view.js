/**
 */
/**
 * Muestra el mensaje de validación del input de la página principal (index.html)
 * @param {string} msg 
 */
export function showValidationMsg(msg) {
    // Etiqueta el input como invalido para los lectores de pantalla
	const input = document.querySelector("#search-input");
    input.setAttribute("aria-invalid", "true");

    const container = document.querySelector("#form-validation-msg");
    // Limpia para no acumular varios errores seguidos
    container.replaceChildren();
    container.classList.remove("hidden");
    const icon = document.createElement("i");
    icon.classList.add("bi", "bi-exclamation-circle");
    // No hace falta que los lectores vean el icono. Es decorativo.
    icon.setAttribute("aria-hidden", "true");
    const text = document.createTextNode(msg);
    container.append(icon, text);
}

/**
 * Elimina el mensaje de validación del input de la página principal (index.html)
 */
export function clearValidationMsg() {
	// Etiqueta el input como valido para los lectores de pantalla
	const input = document.querySelector("#search-input");
	input.removeAttribute("aria-invalid");
	
    const container = document.querySelector("#form-validation-msg");
    // Limpia el texto que pueda contener
    container.textContent = "";
	container.classList.add("hidden");
}
