// CARGAR HERO
const infoHero = document.querySelector('.hero-content');

infoHero.innerHTML = `
  <img src="${comic.portada}" class="comic-cover" style="max-width: 200px; border-radius: 10px;">
  <h1>${comic.nombreComic}</h1>
  <p>${comic.genero} | ${comic.year}</p>
  <a href="#sinopsis" class="btn">Descubrir Historia</a>
`;


// CARGAR SINOPSIS
document.querySelector('#sinopsis-parrafo').innerHTML = comic.sipnosis;


// CARGAR PERSONAJES (AHORA CON LINKS COMO EL DE TU COMPAÑERO)
const gallery = document.querySelector('.gallery');
gallery.innerHTML = "";

comic.personajes.forEach(char => {
  const link = document.createElement("a");
  link.href = `personaje.html?id=${char.id}`;
  link.className = "card-link";

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${char.imagen}">
    <h3>${char.nombre}</h3>
    <p>${char.descripcion}</p>
  `;

  link.appendChild(card);
  gallery.appendChild(link);
});


// CARGAR CAPÍTULOS (TAMBIÉN CON LINKS)
const chapters = document.querySelector(".chapters");
chapters.innerHTML = "";

comic.capitulos.forEach(cap => {
  const link = document.createElement("a");
  link.href = `capitulos.html?id=${cap.id}`;
  link.className = "chapter-link";

  const card = document.createElement("div");
  card.className = "chapter-card";

  card.innerHTML = `
    <div class="chapter-thumb">
      <img src="${cap.portada}">
    </div>
    <div class="chapter-content">
      <h3>Capítulo ${cap.id}</h3>
      <p style="color:#f1c27d;font-weight:bold;">${cap.nombre}</p>
      <p>${cap.descripcion}</p>
    </div>
  `;

  link.appendChild(card);
  chapters.appendChild(link);
});


console.log("Comic cargado correctamente:", comic.nombreComic);
personaje.js