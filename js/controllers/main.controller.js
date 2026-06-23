// LLama a un modulo que contiene showHeader() para que rellene el header

import { showHeader } from "../views/header.view.js";
import { showMedications } from "../views/main.view.js";
import { fetchMedications } from "../models/medications.model.js";


/**
 * Recibe el objeto del evento, previene que se recargue la página,
 * recupera el valor del input, lo trima por si hay espacios antes y/o después,
 * lo pasa al model para que haga el fetch
 * @param {*} event 
 */
async function handleSearch(event) {
	event.preventDefault(); // para que no recargue la página y se pierdan los datos
	const input = document.querySelector('#search-input'); // selecciono el elemento por id
	const valor = input.value.trim(); //recupero su valor (trima espacios, al inicio y al final)
	//Deberia añadir un validador de string lenght mínimo??
	console.log(valor);
	const data = await fetchMedications(valor); // Esta función devuelve una promise
	console.log(data);
	//La validacion de si contiene datos ya se ha hecho en el model (fetchMedications)
	//data es un obj. He de pasarle 
	showMedications(data.resultados);
}

function init() {
	// 1. MOSTRAR HEADER
	showHeader("Inicio");
	
	// 2. IMPLEMENTAR LISTENER AL FORM 
	const form = document.querySelector('#form');
	form.addEventListener('submit', handleSearch);
}
init();


/*
controller:
    showState('loading')
    try:
        data = await fetchMedications(query)
        si data.resultados.length === 0:
            showState('empty')
        sino:
            showMedications(data.resultados)
    catch:
        showState('error')
*/

