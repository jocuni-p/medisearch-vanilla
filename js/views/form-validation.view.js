/**
 * Muestra el mensaje de validación del input de la página principal (index.html)
 */
export function showValidationMsg(msg) {

    // Etiqueta el input como invalido para los lectores de pantalla
	const input = document.querySelector("#search-input");
    input.setAttribute("aria-invalid", "true");

    // Recupera el elemento <p>
    const container = document.querySelector("#form-validation-msg");
    // Limpia para no acumular varios errores seguidos
    container.replaceChildren();
    // Hace visible el elemento
    container.classList.remove("hidden");
    // Crea un elemento <i> para el icono
    const icon = document.createElement("i");
    // Añade la clase del icono a mostrar
    icon.classList.add("bi", "bi-exclamation-circle");
    // No hace falta que los lectores vean el icono. Es decorativo.
    icon.setAttribute("aria-hidden", "true");
    // Crea nodo con el mensaje a mostrar
    const text = document.createTextNode(msg);
    // Añade icono y msg al elemento container
    container.append(icon, text);
}

/**
 * Elimina el mensaje de validación del input de la página principal (index.html)
 */
export function clearValidationMsg() {
	// Etiqueta el input como valido para los lectores de pantalla
	const input = document.querySelector("#search-input");
    input.removeAttribute("aria-invalid");
    // Recupera el elemento container
    const container = document.querySelector("#form-validation-msg");
    // Limpia el texto que pueda contener
    container.textContent = "";
    // Hace invisible el elemento container
	container.classList.add("hidden");
}
