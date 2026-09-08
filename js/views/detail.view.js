import { createTagLines, createTags } from "./tags.view.js";
import { isInFavoritesList, toggleFavoriteStatus } from "../models/favorites.storage.js";
import { BASE_IMG_URL } from "../models/api-config.js";

/* OJO: Función demasiado larga, refactorizar en varias */
/**
 * Pinta en el DOM la section de identity del medicamento (nombre, principio activo, laboratorio, tags).
 * Su responsabilidad es traducir el objeto de negocio a representación visual.
 * @param {Object} medication - objeto medicamento devuelto por /medicamento
 */
export function renderIdentity(medication) {
    const container = document.querySelector("#medication-identity");
    // Limpia, si habia algo anterior
    container.replaceChildren();

    // Crea Nodo de título de la card
    const name = document.createElement("h1");
    name.textContent = medication.nombre;
    name.classList.add("detail-name");

	// Va guardando en un array cada nuevo nodo creado. Al final los añadirá todos a container.  
    const nodes = [name];

	// IMAGEN
    //Busca si existe imagen en la response y construye su url, el nodo y la pinta
    // Recupero la dirección url de la imagen thumbnail y la uso como bandera de existencia de la imagen en alta.
    // Si campo 'fotos' existe, busca en el array el de tipo:"materialas" y si existe, ves a url.
    // Si no existe algún paso devolverá 'undefined'
    const thumbnailUrl = medication.fotos?.find((f) => f.tipo === "materialas")?.url;
    // Aunque no está en la documentación CIMA v1.19, existe un endpoint para la imagen en alta de los medicamentos que poseen un thumbnail que construyo por patrón: https://cima.aemps.es/cima/fotos/full/materialas/nregistro/nregistro_materialas.jpg
    // Protección: solo crea el elemento <img> si existe 'fotos' y 'materialas' en la response"
    if (thumbnailUrl) {
        // Crea el nodo de la imagen
        const image = document.createElement("img");
        // Config atributos de img
        image.src = `${BASE_IMG_URL}/${medication.nregistro}/${medication.nregistro}_materialas.jpg`;
        image.alt = `Envase de ${medication.nombre}`;
		image.classList.add("detail-img");
		
		// Si el src no puede cargar el recurso, <img> dispara un evento error (404, fallo de red, file corrupto). Lo capturo y elimino silenciosamente la imagen del DOM.
		image.addEventListener("error", () => image.remove());
		
		nodes.push(image);
	}

    // Crea nodo padre de description list, que envuelve nodo título dt y nodo descripción dd
    // Para poder dar estilos por separado al título y al valor de principio activo y laboratorio
    // se crean como elementos de description list <dl>
    const descriptionList = document.createElement("dl");
    descriptionList.classList.add("detail-data");

    // Crea el par de nodos de principio activo
    const activePrinciplesTitle = document.createElement("dt");
    activePrinciplesTitle.textContent = "Principio activo";
    const activePrinciplesValue = document.createElement("dd");
    activePrinciplesValue.classList.add("active-principles-dd");
    activePrinciplesValue.textContent = medication.pactivos;

    // Crea el par de nodos de Laboratorio
    const labTitle = document.createElement("dt");
    labTitle.textContent = "Laboratorio";
    const labValue = document.createElement("dd");
    labValue.textContent = medication.labcomercializador || medication.labtitular;

    // Pone los nodos <dt> y <dd> dentro del <dl> padre
    descriptionList.append(activePrinciplesTitle, activePrinciplesValue, labTitle, labValue);

    // Crea array con los nodos que SEGURO se han de mostrar (los tags, solo si aplican)
    nodes.push(descriptionList);

    //Crea Nodo de tags en forma de pildoras
    // Crea un array con los tags pildora, excluye el tag de problemas de sumnistro (caso especial)
    const tagArr = createTags(medication, { omit: ["supply", "hospital"] });
    // Si hay tag/s pildora, crea un container para él en el DOM
    if (tagArr.length > 0) {
        const tagsContainer = document.createElement("div");
        tagsContainer.classList.add("detail-tags");
        tagsContainer.append(...tagArr);
        nodes.push(tagsContainer);
    }

    //Crea Nodo de tags en forma de definiciones
    // Crea un array con los tags definición, excluye los que no aplican
    const tagLineArr = createTagLines(medication, { omit: ["supply", "recipe", "generic"] });
    if (tagLineArr.length > 0) {
        const tagsLineContainer = document.createElement("div");
        tagsLineContainer.classList.add("detail-tag-lines");
        tagsLineContainer.append(...tagLineArr);
        nodes.push(tagsLineContainer);
    }

    // Añade todos los nodos al container general
    container.append(...nodes);
}

/**
 *  Pinta la sección de notas en el DOM
 * @param {string} asunto - El texto lo proporciona el controller a partir del fetch a /notas
 */
export function renderNotes(asunto) {
    const container = document.querySelector("#medication-notes");
    container.replaceChildren();
    container.classList.remove("hidden");

    // Creo un node <p> para toda la nota
    const securityNote = document.createElement("p");
    securityNote.classList.add("security-note");

    // Creo un node <strong> para el título
    const noteTitle = document.createElement("strong");
    noteTitle.classList.add("note-title");
    noteTitle.textContent = "Nota de seguridad: ";

    securityNote.append(noteTitle, document.createTextNode(asunto));
    container.append(securityNote);
}

/**
 *  Pinta mensaje en la sección de notas del DOM
 * @param {string} msg - El texto del mensaje lo proporciona el controller del ui-messages
 */
export function renderNotesMessage(msg) {
    const container = document.querySelector("#medication-notes");
    container.replaceChildren();
    container.classList.remove("hidden");

    const p = document.createElement("p");
    p.textContent = msg;
    p.classList.add("detail-section-msg");

    container.append(p);
}

/**
 * Pinta la sección medication-supply en el DOM y para ello traduce las fechas Unix a texto. Si no existen, proporciona mensaje.
 * @param {Object} supply - Resultado del endpoint /psuministro que contiene las fechas que necesita
 */
export function renderSupplySection(supply) {
    // Se asume 'supply' válido. Los casos vacios/error los gestiona el controller
    const container = document.querySelector("#medication-supply");
    container.replaceChildren();
    container.classList.remove("hidden"); // arranca oculto y quiero mostrarla ahora

    const icon = document.createElement("i");
    icon.classList.add("bi", "bi-exclamation-triangle");
    icon.setAttribute("aria-hidden", "true");

    const text = document.createTextNode(
        `Este medicamento presenta problemas de suministro desde el ${supply.fini ? formatDate(supply.fini) : "(sin fecha inicial)"} hasta el ${supply.ffin ? formatDate(supply.ffin) : "(sin fecha final)"}.`,
    );

    const subContainer = document.createElement("p");
    subContainer.classList.add("tag-line", "tag-psum");
    subContainer.append(icon, text);

    container.append(subContainer);
}

// Helper: Usa la API nativa de JS con el objeto Date
function formatDate(timestamp) {
    //recibe un num formato unix en milisegundos
    return new Date(timestamp).toLocaleDateString("es-ES", {
        //defino como quiero el retorno
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/**
 * Crea y renderiza el mensaje de error si el fetch del controller vino vacío
 * @param {string} msg
 */
export function renderSupplyMessage(msg) {
    const container = document.querySelector("#medication-supply");
    // limpiar contenedor
    container.replaceChildren();
    // quitar hidden para hacerlo visible
    container.classList.remove("hidden");
    const p = document.createElement("p");
    p.textContent = msg;
    p.classList.add("detail-section-msg");
    container.append(p);
}

/**
 * Pinta la sección del botón que enlaza al prospecto en el DOM
 * @param {Object} medication - Devuelto por el fetch en el controller
 */
export function renderDocs(medication) {
    const container = document.querySelector("#medication-docs");
    // Limpio por seguridad
    container.replaceChildren();

    // Recupero la dirección url del prospecto
    // Si campo docs existe, busca en el array el de tipo:2 y si existe, ves a urlHtml.
    // Si no existe algún paso devolverá 'undefined'
    const linkUrl = medication.docs?.find((d) => d.tipo === 2)?.urlHtml;

    // Protección por si no existe docs, o docs tipo2
    if (!linkUrl) {
        const noUrl = document.createElement("p");
        noUrl.textContent = "Medicamento sin prospecto disponible.";
        noUrl.classList.add("detail-section-msg");
        container.append(noUrl);
        return;
    }
    const link = document.createElement("a");
    link.textContent = "Ver prospecto";
    link.href = linkUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.classList.add("external-link");

    container.append(link);
}

/**
 * Pinta el botón toggle de favoritos en '#medication-fav-action'.
 * El botón refleja el estado actual del localStorage (icono lleno o vacío) y al hacer click alterna su estado repintándolo en la página.
 * @param {string} nregistro - Número de registro del medicamento, usado como clave en localStorage.
 */
export function renderFavoritesAction(nregistro) {
    const container = document.querySelector("#medication-fav-action");
    // Limpia. Garantiza que si se llama dos veces no acumula botones ni listeners.
    container.replaceChildren();

    const button = document.createElement("button");
    button.classList.add("favorite-btn");

    const icon = document.createElement("i");
    icon.classList.add("bi"); //clase base, la especifica la pondrá updateButtonState
    button.append(icon);

    //Inicial: refleja el estado del botón según lo que haya en localStorage
    updateButtonState(button, isInFavoritesList(nregistro));

    //Listener que alterna el estado del botón y refresca el estado
    button.addEventListener("click", () => {
        // Devuelve el nuevo estado
        const currentState = toggleFavoriteStatus(nregistro);
        //Actualiza el estado del botón con el booleano (activo/inactivo)
        updateButtonState(button, currentState);
    });
    container.append(button);
}

//Helper privado
/**
 * Maneja la lógica del estado del botón favorito, al entrar en la página y al hacer click en él.
 * Aplica el estado visual al boton cada vez que se llama
 * @param {HTMLButtonElement} button Botón sobre el que aplicar el estado
 * @param {boolean} isActive  true = activo en Favs, false = ausente en Favs
 */
function updateButtonState(button, isActive) {
    const icon = button.querySelector("i");
    icon.classList.toggle("bi-heart", !isActive);
    icon.classList.toggle("bi-heart-fill", isActive);
    button.setAttribute("aria-label", isActive ? "Eliminar favorito" : "Añadir favorito");

    // Creo accesibilidad para botones toggle
    button.setAttribute("aria-pressed", isActive);
    // Añade o elimina la clase dependiendo de si el segundo argumento es true o false.
    button.classList.toggle("is-active", isActive);
}
