/**
 * Mensajes de ui (para USUARIO FINAL) centralizados.
 * Lo importa el modulo ui-state.view.js y los controllers que necesiten pasar las claves de mensaje.
 * 
 * Estructura por categorias:
 * 	-validation: mensajes de validación del input.
 * 	-response: mensajes relativos a la respuesta de la API.
 *  -detail: página detail
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
	detail: {
		noNregistro: 'Medicamento no especificado. Vuelve al inicio.',
		fetchError: 'No se ha podido cargar el medicamento.',
		supplyError: 'No se han podido cargar los datos de suministro.',
		supplyLoading: 'Cargando datos de suministro ...',
		supplyEmpty: 'Sin datos de suministro disponibles',
		notesError: 'No se han podido cargar las notas.',
	}
}