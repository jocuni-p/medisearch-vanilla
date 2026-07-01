import { createTags } from "./tags.view.js";
	
/**
 * Pinta la section de identity del medicamento (nombre, principio activo, laboratorio, tags).
 * Su responsabilidad es traducir el objeto de negocio a representación visual.
 * @param {Object} medication - objeto medicamento devuelto por /medicamento
 */
export function renderIdentity(medication) {
	const container = document.querySelector('#medication-identity');
	// Limpia si habia algo anterior
	container.replaceChildren();

	// Nodo1: título
	const name = document.createElement('h1');
	name.textContent = medication.nombre;
	name.classList.add('detail-name');

	//Nodo2: principios activos
	const activePrinciples = document.createElement('p');
	activePrinciples.textContent = medication.pactivos;
	activePrinciples.classList.add('detail-active-principles');

	//Nodo3: laboratorio
	const lab = document.createElement('p');
	lab.textContent = medication.labcomercializador || medication.labtitular; //defensivo
	lab.classList.add('detail-lab');

	//Nodo4 compuesto: tags 
	const tagsContainer = document.createElement('div');
	tagsContainer.classList.add('detail-tags');
	// Crea un array solo con los tags que usaré
	const tagArr = createTags(medication);
	tagsContainer.append(...tagArr); // con spread convierto array en elementos individuales

	// Añado todos al DOM real en una sola operación (y no en varias)
	container.append(name, activePrinciples, lab, tagsContainer);
}


export function renderDocs(medication) { /* TODO */ }
export function renderSupplySection(medication) { /* TODO */ }
export function renderNotes(medication) { /* TODO */ }
export function renderFavoritesAction(medication) { /* TODO */ }
