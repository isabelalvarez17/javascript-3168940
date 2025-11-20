 const infoComic = document.querySelector('.info-comic');
  const numeropersonajes = document.querySelector('.card-personajes');
  console.log(infoComic)

    infoComic.innerHTML = `
    <samll>${comic.year}</samll>
    <h1>${comic.nombrecomic}</h1>
<p>${comic.sinopsis}</p>
<p>genero:${comic.genero}</p>
    `
    console.log(comic.personajes)

    comic.personajes.forEach(char=> {
      const div = document.createElement('div');
      div.classList.add('personaje');


      console.log(char.nombre)
      document.body.innerHTML += `<img src="${char.imagen}" width="200">`

      
    });
      