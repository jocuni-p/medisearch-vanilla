import { createTags } from "./tags.view.js";

/**
 * Pinta en el DOM la section de identity del medicamento (nombre, principio activo, laboratorio, tags).
 * Su responsabilidad es traducir el objeto de negocio a representación visual.
 * @param {Object} medication - objeto medicamento devuelto por /medicamento
 */
export function renderIdentity(medication) {
    // Recupera el container de la sección
    const container = document.querySelector("#medication-identity");
    // Limpia, si habia algo anterior
    container.replaceChildren();

    // Crea Nodo1: título
    const name = document.createElement("h1");
    name.textContent = medication.nombre;
    name.classList.add("detail-name");

    //Crea Nodo2: principios activos
    const activePrinciples = document.createElement("p");
    activePrinciples.textContent = 'Principio activo: ' + medication.pactivos;
    activePrinciples.classList.add("detail-active-principles");

    //Crea Nodo3: laboratorio
    const lab = document.createElement("p");
    lab.textContent = 'Laboratorio: ' + medication.labcomercializador || medication.labtitular; //defensivo
    lab.classList.add("detail-lab");

    //Crea Nodo4 compuesto por los tags
    const tagsContainer = document.createElement("div");
    tagsContainer.classList.add("detail-tags");
    // Crea un array solo con los tags que usaré en este detalle
    const tagArr = createTags(medication);
    tagsContainer.append(...tagArr); // con spread convierto array en elementos individuales

    // Añado todos al DOM real en una sola operación (y no en varias)
    container.append(name, activePrinciples, lab, tagsContainer);
}

/**
 * Pinta la sección del botón que enlaza al prospecto en el DOM
 * @param {Objeto} medication - Devuelto por el fetch en el controller
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
        noUrl.classList.add("external-link-empty"); // TODO: crear el selector en CCS
        container.append(noUrl);
        return;
    }

    const link = document.createElement("a");
    link.textContent = "Ver prospecto";
    link.href = linkUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.classList.add("external-link"); // TODO: darle forma de botón o similar por CSS

    container.append(link);
}

/**
 * Pinta la sección medication-supply en el DOM y para ello traduce las fechas Unix a texto. Si no existen, proporciona mensaje.
 * @param {Object} supply - Resultado del endpoint /psuministro que contiene las fechas que necesita
 */
export function renderSupplySection(supply) {
	// Si no hay supply se maneja en el controller (que se lo pide al model)
	const container = document.querySelector('#medication-supply');
	container.replaceChildren();
	container.classList.remove('hidden');// arranca oculto y quiero mostrarla ahora

	const supplyMessage = document.createElement('p');
	supplyMessage.classList.add('supply-message');
	supplyMessage.textContent = `Este medicamento presenta problemas de suministro desde el ${supply.fini ? formatDate(supply.fini) : '(sin fecha inicial)'} hasta el ${supply.ffin ? formatDate(supply.ffin) : '(sin fecha final)'}.`; // Aquí manejo los posibles valores null de fini y ffin y el controller valida la presencia del recurso.

	container.append(supplyMessage);
}

// Función helper privada de este file
// Usa la API nativa de JS con el objeto Date
function formatDate(timestamp) { //recibe un num formato unix en milisegundos
	return new Date(timestamp).toLocaleDateString('es-ES', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}


// Viene del controller si falló el supply al hacer fetch al psuministro por resultado vació
export function renderSupplyMessage(msg) {
	const container = document.querySelector('#medication-supply');
	// limpiar contenedor
	container.replaceChildren();
	// quitar hidden para hacerlo visible
	container.classList.remove('hidden');
	const p = document.createElement('p');
	p.textContent = msg;
	p.classList.add('supply-msg-neutral');  // Personalizar CSS para este caso
	container.append(p);
}



/**
 * 
 * @param {string} asunto - El texto lo proporciona el controller a partir del fetch a /notas
 */
export function renderNotes(asunto) {
	const container = document.querySelector('#medication-notes');
	container.replaceChildren();
	container.classList.remove('hidden');

	const notesMessage = document.createElement('p');
	notesMessage.classList.add('notes-message');
	notesMessage.textContent = `Nota de seguridad: ${asunto}`;

	container.append(notesMessage);
}

export function renderNotesMessage(msg) {
	const container = document.querySelector('#medication-notes');
	container.replaceChildren();
	container.classList.remove('hidden');

	const p = document.createElement('p');
	p.textContent = msg;
	p.classList.add('notes-msg');  // Personalizar CSS para este caso

	container.append(p);
}


export function renderFavoritesAction(medication) {
    /* TODO */
}

