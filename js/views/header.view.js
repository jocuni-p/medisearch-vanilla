// Crea el header con los enlaces que corresponda según la página que lo llame

const COMPANY = "Medisearch";

// Función interna
// Crea los enlaces <a>
// name: el texto
// link: la ruta al enlace
function createLink(name, link) {
    const a = document.createElement("a");
    a.textContent = name; // añado el texto que contendrá
    a.href = link;
    a.classList.add("nav-button");
    return a;
}

// Crea un contenedor con 2 elementos (logo + company_name) que es un enlace
function createBrandLink() {
    // Creo el contenedor con un <a> para que sea enlazable
    const logoAndBrandName = document.createElement("a");
    logoAndBrandName.href = "index.html";
    logoAndBrandName.classList.add("brand");

    // Creo el nombre de la compañia
    const brandName = document.createElement("span");
    brandName.textContent = COMPANY;
    brandName.classList.add("company-name");

    //Envuelvo lo creado en el contenedor
    //logoAndBrandName.append(logo, brandName);
    logoAndBrandName.append(brandName);
    return logoAndBrandName;
}

// Crea y muestra por pantalla el header con los botones correspondientes según que vista sea
export function showHeader(nameOfPage) {
    // recupero el contenedor del header
    const appHeader = document.querySelector("#app-header");
    // Lo vacio por si contiene alguna cosa
    appHeader.replaceChildren();

    // 1. CREAR BOTONES/ENLACES: Creo un container nav y dentro sus botones
    // dependiendo de la pagina a la que vaya
    const nav = document.createElement("nav");
	nav.setAttribute("aria-label", "Principal"); //Define el rol del nav, no un destino

	if (nameOfPage === "Inicio") {
        // Añado los enlaces al container. append() acepta varios nodos de golpe
        nav.append(
            // Crea cada uno de los enlaces
            createLink("Favoritos", "favorites.html"),
            createLink("Suministro", "supply.html"),
        );
    // Si estoy en Favoritos veré 'Inicio'
    } else if (nameOfPage === "Favoritos") {
		nav.append(createLink("Inicio", "index.html"));
	// En el resto de páginas veo Inicio + Favoritos
    } else {
		nav.append(
			createLink("Favoritos", "favorites.html"),
			createLink("Inicio", "index.html"));
    }

    // 2. CREAR EL LOGO + COMPANY_NAME
    const logoAndBrandName = createBrandLink();

    // 3. CREO UN NUEVO CONTENEDOR DENTRO DEL HEADER QUE ENVUELVE TODO
    const headerContainer = document.createElement("div");
    // Su única class será esta
    headerContainer.classList.add("header-container");
    headerContainer.append(logoAndBrandName, nav);
    appHeader.append(headerContainer);
}
