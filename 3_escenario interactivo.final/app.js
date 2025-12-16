const mainContent = document.getElementById('main-content'); 

const infoHero = document.querySelector('.hero-content');
infoHero.innerHTML = `
  <img src="${comic.portada}" class="comic-cover" style="max-width: 200px; border-radius: 10px;">
  <h1>${comic.nombreComic}</h1>
  <p>${comic.genero} | ${comic.year}</p>
  <a href="#sinopsis" class="btn">Descubrir Historia</a>
`;

function renderSections() {
 
    const sinopsisHTML = `
        <section id="sinopsis" class="section">
            <div class="container">
                <h2>Sinopsis</h2>
                <p>${comic.sipnosis}</p>
            </div>
        </section>
    `;

   
    let galleryHTML = '';
    comic.personajes.forEach(char => {
        galleryHTML += `
            <a href="personaje.html?id=${char.id}" class="card-link">
                <div class="card">
                    <img src="${char.imagen}">
                    <h3>${char.nombre}</h3>
                    <p>${char.descripcion}</p>
                </div>
            </a>
        `;
    });

    const personajesHTML = `
        <section id="personajes" class="section">
            <div class="container">
                <h2>Personajes</h2>
                <div class="gallery">${galleryHTML}</div>
                <a href="personajes.html" class="btn" style="margin-top: 2rem;">Ver todos los personajes</a>
            </div>
        </section>
    `;

   
    let chaptersHTML = '';
    comic.capitulos.forEach(cap => {
        chaptersHTML += `
            <a href="capitulo.html?id=${cap.id}" class="chapter-link">
                <div class="chapter-card">
                    <div class="chapter-thumb">
                        <img src="${cap.portada}">
                    </div>
                    <div class="chapter-content">
                        <h3>Capítulo ${cap.id}</h3>
                        <p style="color:#f1c27d;font-weight:bold;">${cap.nombre}</p>
                        <p>${cap.descripcion}</p>
                    </div>
                </div>
            </a>
        `;
    });

    const capitulosHTML = `
        <section id="capitulos" class="section dark">
            <div class="container">
                <h2>Capítulos</h2>
                <div class="chapters">${chaptersHTML}</div>
                <a href="capitulos.html" class="btn" style="margin-top: 2rem;">Leer Historia Completa</a>
            </div>
        </section>
    `;

 
    mainContent.innerHTML = sinopsisHTML + personajesHTML + capitulosHTML;
}


renderSections();

console.log("Comic cargado correctamente:", comic.nombreComic);


let currentSlide = 0;

const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.opacity = i === index ? '1' : '0';
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

showSlide(currentSlide);
setInterval(nextSlide, 5000); 

setTimeout(() => {
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.2 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated-in');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}, 100); 