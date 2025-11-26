// 1. Cargar Hero (Portada y Título)
const infoHero = document.querySelector('.hero-content');

// Usamos backticks (`) para insertar las variables de comic
infoHero.innerHTML = `
    <img src="${comic.portada}" alt="Logo Ruiseñora" class="logo-hero"/>
    <h1>${comic.nombreComic}</h1>
    <p>${comic.genero} | ${comic.year}</p>
    <a href="#sinopsis" class="btn">Descubre más</a>
`;

// 2. Cargar Sinopsis
const textoSinopsis = document.getElementById('sinopsis-texto');
textoSinopsis.innerText = comic.sipnosis;

// 3. Cargar Personajes (Recorremos el array con un bucle)
const galleryContainer = document.getElementById('gallery-container');

comic.personajes.forEach(personaje => {
    galleryContainer.innerHTML += `
        <div class="card">
            <img src="${personaje.imagen}" alt="${personaje.nombre}">
            <h3>${personaje.nombre}</h3>
            <p>${personaje.descripcion}</p>
        </div>
    `;
});

// 4. Cargar Capítulos
const chaptersContainer = document.getElementById('chapters-container');

comic.capitulos.forEach(capitulo => {
    chaptersContainer.innerHTML += `
        <div class="chapter-card">
            <div class="chapter-thumb">
                <img src="${capitulo.portada}" alt="${capitulo.nombre}">
            </div>
            <div class="chapter-content">
                <h3>Capítulo ${capitulo.id}</h3>
                <p><strong>${capitulo.nombre}</strong></p>
                <br>
                <p style="font-size: 0.9rem;">${capitulo.descripcion}</p>
            </div>
        </div>
    `;
});