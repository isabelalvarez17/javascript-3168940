
// Nota: Para que fetch funcione correctamente, abre el proyecto con un servidor local (por ejemplo, usando Live Server en VS Code).
async function cargarDatos() {
    const respuesta = await fetch("bd.json");
    const datos = await respuesta.json();

    document.getElementById("hero-main-title").textContent = datos.documentalInfo.tituloPrincipal;
    document.getElementById("hero-main-subtitle").textContent = datos.documentalInfo.subtitulo;

    generarEpisodios(datos.episodios);
}

function generarEpisodios(lista) {
    const cont = document.getElementById("episode-container");
    cont.innerHTML = "";

    lista.forEach(ep => {
        const card = document.createElement("article");
        card.className = "episode-card";

        const img = document.createElement("img");
        img.className = "episode-thumbnail";
        img.src = ep.imagenUrl;
        img.alt = ep.titulo;

        const info = document.createElement("div");
        info.className = "episode-info";

        info.innerHTML = `
            <h3 class="episode-title">${ep.titulo}</h3>
            <p class="episode-meta">T${ep.temporada} · Ep${ep.numero} · ${ep.duracion}</p>
            <p class="episode-synopsis">${ep.sinopsis}</p>
        `;

        card.appendChild(img);
        card.appendChild(info);
        cont.appendChild(card);
    });
}

cargarDatos();
