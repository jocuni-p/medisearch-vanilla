/**
 * Mensajes de ui centralizados.
 * Lo importa el modulo ui-state.view.js y los controllers que necesiten pasar las claves de mensaje.
 * 
 * Estructura por categorias:
 * 	-validation: mensajes de validación del input.
 * 	-response: mensajes relativos a la respuesta de la API.
 */
export const MESSAGES = {
	validation: {
		tooShort: 'Escribe al menos 4 caracteres',
		invalidChars: 'Solo se permiten letras, números, espacios y los signos -/,.',
	},
	response: {
		empty: 'No se han encontrado medicamentos comercializados con este nombre.',
		error: 'Ha habido un problema al conectar con CIMA. Inténtalo de nuevo.',
		unexpected: 'No se ha podido procesar la respuesta. Inténtalo más tarde.',
	},
}