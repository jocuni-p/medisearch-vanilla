/**
 * Mensajes de ui (para USUARIO FINAL) centralizados.
 * Lo importa el modulo ui-state.view.js y los controllers que necesiten pasar las claves de mensaje.
 * 
 * Estructura por categorias:
 * 	-validation: mensajes de validación del input (search).
 * 	-response: mensajes relativos a la respuesta de la API.
 *  -detail: mensajes de la página detail
 *  -favorites: mensajes de la página favorites
 */
export const MESSAGES = {
	validation: {
		tooShort: 'Escribe al menos 4 caracteres',
		invalidChars: 'Solo se aceptan letras, números, espacios y los signos -/,.',
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
		supplyEmpty: 'Sin datos de suministro disponibles.',
		notesLoading: 'Cargando notas ...',
		notesEmpty: 'Sin notas disponibles.',
		notesError: 'No se han podido cargar las notas.',
	},
	favorites: {
		empty: 'No tienes favoritos guardados. Búscalos y añádelos desde su detalle.',
		loading: 'Cargando lista de favoritos.',
		fetchError: 'No se han podido cargar tus favoritos. Inténtalo más tarde.',
		itemError: 'No ha sido posible cargar el favorito. Inténtalo más tarde.',
	}
}