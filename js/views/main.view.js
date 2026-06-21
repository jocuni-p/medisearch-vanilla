


/**
 * 
 * @param {*} medicamentos 
 */
// Toma el array de medicamentos
export function showMedicamentos(medicamentos) {
	const container = document.querySelector('#results-list');
	// Crea el fragment
	const fragment = document.createDocumentFragment(); 
	//Recupera el template
	const template = document.querySelector('#template-medicine').content;
	//Bucle que crea el clone y rellena cada dato del template
	for (const medicamento of medicamentos) {
		// Creo un clone
		const clone = template.cloneNode(true);
		// Recupero elemento href para página de detalle
		//clone.querySelector('a').href = `${BASE_URL}/medicamento?nregistro=${medicamento.nregistro}`;
		clone.querySelector('a').href = "";
		// Recupero nombre medicamento
		clone.querySelector('h2').textContent = medicamento.nombre;
		//NOTA: Principio de robustez: asumir que cualquier campo puede fallar o no ser obligatorio (blindar todo con '?.').
		// Recuperar y construir subtitulo (puede tener 1 o 2 partes)
		//const subtitleParts = [];
		// Recupero principio activo (ojo NO son campos obligatorios).Hay que blindarlos.
		// Si no existe, devuelve undefined sin lanzar error.
		if (medicamento.vtm?.nombre) {  // es una protección de leer algo que no existe y no se rompe.
			clone.querySelector('.li-subtitle').textContent = medicamento.vtm.nombre;
		}
		// Recupero formaFarmaceutica si existe, sino devuelve undefined sin lanzar error
		/* if (medicamento.formaFarmaceuticaSimplificada?.nombre) {
			subtitleParts.push(medicamento.formaFarmaceuticaSimplificada.nombre);
		}
		clone.querySelector('.li-subtitle').textContent = subtitleParts.join(' · '); */

		// Recupero los tags si han de estar presentes
		if (!medicamento.receta) {
			clone.querySelector('.tag-recipe').classList.add('hidden');
		}
		if (!medicamento.generico) {
			clone.querySelector('.tag-generic').classList.add('hidden');
		}
		if (!medicamento.psum) {
			clone.querySelector('.tag-psum').classList.add('hidden');
		}

		fragment.appendChild(clone);
	}
	
	container.appendChild(fragment);
}