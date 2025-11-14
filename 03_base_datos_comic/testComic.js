 const infoComic = document.querySelector('.info-comic');

  console.log(infoComic)

    infoComic.innerHTML = `
    <samll>${comic.year}</samll>
    <h1>${comic.nombrecomic}</h1>
<p>${comic.sinopsis}</p>
<p>genero:${comic.genero}</p>
    `