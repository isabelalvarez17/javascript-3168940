// ---- GALERÍA ----
const imagenes = ["img1.jpg", "img2.jpg", "img3.jpg"];
let indice = 0;

const imagen = document.getElementById("imagen");
const siguiente = document.getElementById("siguiente");
const anterior = document.getElementById("anterior");

if (imagen && siguiente && anterior) {
  siguiente.addEventListener("click", () => {
    indice = (indice + 1) % imagenes.length;
    imagen.src = imagenes[indice];
  });

  anterior.addEventListener("click", () => {
    indice = (indice - 1 + imagenes.length) % imagenes.length;
    imagen.src = imagenes[indice];
  });
}

// ---- LIGHTBOX ----
const infoBtn = document.getElementById("infoBtn");
const lightbox = document.getElementById("lightbox");
const cerrar = document.getElementById("cerrar");

if (infoBtn && lightbox && cerrar) {
  infoBtn.addEventListener("click", () => {
    lightbox.classList.remove("oculto");
  });

  cerrar.addEventListener("click", () => {
    lightbox.classList.add("oculto");
  });
}

// ---- TRADUCCIÓN ----
const texto = document.getElementById("texto");
const traducir = document.getElementById("traducir");
let traducido = false;

if (texto && traducir) {
  traducir.addEventListener("click", () => {
    if (!traducido) {
      texto.textContent = "Welcome to our gallery, enjoy the visual journey.";
      traducir.textContent = "Volver a español";
      traducido = true;
    } else {
      texto.textContent = "Bienvenido a nuestra galería, disfruta el recorrido visual.";
      traducir.textContent = "Traducir";
      traducido = false;
    }
  });
}
