
// NOTA: Si he de hacer un truncado del nombre o poner el principio activo la primera en mayuscula, se hace aquí por que son transformaciones de presentación No de datos.


/**
 * LIMPIA la lista de cards (DOM) si contiene algo
 */
export function clearMedications() {
	document.querySelector('#results-list').replaceChildren();
}


/**
 * 
 * @param {*} medications 
 */
// Toma el array de medicamentos
export function showMedications(medications) {
	const container = document.querySelector('#results-list'); // Al final necesito esta var
	clearMedications();
	// Crea el fragment
	const fragment = document.createDocumentFragment(); 
	//Recupera el template
	const template = document.querySelector('#template-medicine').content;
	//Bucle que crea el clone y rellena cada dato del template
	for (const medication of medications) {
		// Creo un clone
		const clone = template.cloneNode(true);
		// Recupero elemento href para página de detalle
		//clone.querySelector('a').href = `${BASE_URL}/medicamento?nregistro=${medicamento.nregistro}`;
		clone.querySelector('a').href = `detail.html?nregistro=${medication.nregistro}`;
		// Recupero nombre medicamento
		// OJO: GESTIONAR TRUNCADO CON CSS
		clone.querySelector('h2').textContent = medication.nombre;
		//NOTA: Principio de robustez: asumir que cualquier campo puede fallar o no ser obligatorio (blindar todo con '?.').
		
		// Recupero principio activo (OJO: cómo NO sé si son campos obligatorios, habrá que blindarlos.
		// Si no existe, devuelve undefined sin lanzar error.
		if (medication.vtm?.nombre) {  // protección para leer algo, que si no existe, no se rompa.
			// OJO: GESTIONAR TRUNCADO CON CSS
			clone.querySelector('.li-subtitle').textContent = medication.vtm.nombre;
		}
		else {// Aparecerá vacío si no viene texto o hubo algún error
			clone.querySelector('.li-subtitle').textContent = '';
		}
		
		

		//REVISAR, no tengo claro que este bien implementado
		// Defensa: Recupero los tags que han de estar presentes
		if (medication.cpresc?.toLowerCase().includes('hospital')) {
			clone.querySelector('.tag-hospital');
			//ocultar tag "Receta"
		}
		else if (!medication.receta) { // OJO: comprobar que sí existe, pero a lo mejor es 0
			clone.querySelector('.tag-recipe').classList.add('hidden');
		}
		if (!medication.generico) {
			clone.querySelector('.tag-generic').classList.add('hidden');
		}
		if (!medication.psum) {
			clone.querySelector('.tag-psum').classList.add('hidden');
		}

		fragment.appendChild(clone);
	}
	
	container.appendChild(fragment);
}


// La llamaré a menudo desde el controller para que me ayude a gestionar el estado
// en cada momento 

/* function showState(state) {
    según state:
	'loading' → muestra spinner, oculta lista, oculta mensajes
	'empty' → muestra "Sin resultados", oculta spinner y lista
	'error' → muestra mensaje de error
	'results' → muestra lista, oculta spinner
} */