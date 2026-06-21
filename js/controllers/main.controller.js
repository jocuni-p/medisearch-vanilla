// LLama a un modulo que contiene showHeader() para que rellene el header

import { showHeader } from "../views/header.view.js";
import { showMedicamentos } from "../views/main.view.js";

// 1. MOSTRAR HEADER
showHeader("Inicio");


// 2. VALIDAR INPUT


// 3. REDIRIGE INPUT AL MODEL

showMedicamentos(inputValidado);



/* ==== DATOS DE PRUEBA PARA PRIMER MOCK ==== */
/* 
const resultados = [
	{
		nregistro: "60954",
		nombre: "COULDINA CON ACIDO ACETILSALICILICO COMPRIMIDOS EFERVESCENTES",
		comerc: true,
		receta: false,
		generico: false,
		psum: false,
		formaFarmaceuticaSimplificada: {
			id: 13,
			nombre: "COMPRIMIDO EFERVESCENTE",
		},
		vtm: {
			id: 139071000140108,
			nombre: "ácido acetilsalicílico + clorfenamina + fenilefrina",
		}
	},
	{
		nregistro: "81807",
		nombre: "COULDINA CON IBUPROFENO COMPRIMIDOS EFERVESCENTES",
		comerc: true,
		receta: false,
		generico: true,
		psum: true,
		formaFarmaceuticaSimplificada: {
			id: 13,
			nombre: "COMPRIMIDO EFERVESCENTE",
		},
		vtm: {
			id: 185651000140100,
			nombre: "ibuprofeno + clorfenamina + fenilefrina",
		}
	}
];
 */
