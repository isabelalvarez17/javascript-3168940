document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Obtener Elementos del DOM ---
    const gato = document.getElementById('gato');
    const gameContainer = document.querySelector('.game-container');
    
    // Elementos de la Interfaz (UI)
    const scoreText = document.getElementById('score-text');
    const livesText = document.getElementById('lives-text');
    
    // Todos los items que se pueden recoger
    const interactables = document.querySelectorAll('.interactable');

    // --- 2. Variables del Juego ---
    let score = 0;
    let lives = 1;
    let playerX = 350; // Posición inicial X del gato
    let playerY = 400; // Posición inicial Y del gato
    const playerSpeed = 15; // Píxeles que se mueve el gato por toque
    
    // Tamaños (deben coincidir con el CSS)
    const playerWidth = 70;
    const playerHeight = 70;
    const gameWidth = 750;
    const gameHeight = 500;

    // --- 3. Renderizar (dibujar) al Gato ---
    // Función para actualizar la posición del gato en la pantalla
    function renderPlayer() {
        gato.style.left = playerX + 'px';
        gato.style.top = playerY + 'px';
    }
    // Dibujamos al gato en su posición inicial
    renderPlayer();


    // --- 4. Event Listener para el Movimiento ---
    // Escuchamos cuando el usuario presiona una tecla
    document.addEventListener('keydown', (e) => {
        // 'e.key' nos dice qué tecla se presionó
        switch (e.key) {
            case 'ArrowUp':
                playerY -= playerSpeed; // Mover arriba
                break;
            case 'ArrowDown':
                playerY += playerSpeed; // Mover abajo
                break;
            case 'ArrowLeft':
                playerX -= playerSpeed; // Mover izquierda
                gato.style.transform = 'scaleX(-1)'; // Voltear gato a la izquierda
                break;
            case 'ArrowRight':
                playerX += playerSpeed; // Mover derecha
                gato.style.transform = 'scaleX(1)'; // Voltear gato a la derecha
                break;
        }

        // --- 5. Límites del Contenedor ---
        // Evitar que el gato se salga por la izquierda o derecha
        if (playerX < 0) playerX = 0;
        if (playerX + playerWidth > gameWidth) playerX = gameWidth - playerWidth;
        
        // Evitar que el gato se salga por arriba o abajo
        if (playerY < 0) playerY = 0;
        if (playerY + playerHeight > gameHeight) playerY = gameHeight - playerHeight;

        // Volvemos a dibujar al gato en su nueva posición
        renderPlayer();
        
        // Revisamos si el gato chocó con algo
        checkCollisions();
    });


    // --- 6. Detección de Colisiones ---
    function checkCollisions() {
        // Recorremos cada item "interactable"
        interactables.forEach(item => {
            // Si el item ya fue recogido (está oculto), no hacemos nada
            if (item.style.display === 'none') return;

            // Obtenemos la posición y tamaño del item
            const itemX = item.offsetLeft;
            const itemY = item.offsetTop;
            const itemWidth = item.offsetWidth;
            const itemHeight = item.offsetHeight;

            // Lógica de colisión (AABB)
            if (
                playerX < itemX + itemWidth &&
                playerX + playerWidth > itemX &&
                playerY < itemY + itemHeight &&
                playerY + playerHeight > itemY
            ) {
                // ¡Colisión! Recogemos el item
                collectItem(item);
            }
        });
    }

    // --- 7. Lógica de Recolección ---
    function collectItem(item) {
        // Ocultamos el item
        item.style.display = 'none';

        // Decidimos qué hacer según el ID del item
        if (item.id.includes('pez')) {
            score += 10; // Los peces dan 10 puntos
        } else if (item.id.includes('moneda')) {
            score += 50; // Las monedas dan 50 puntos
        } else if (item.id.includes('corazon')) {
            lives++; // Los corazones dan 1 vida
        }

        // Actualizamos el texto en la pantalla
        scoreText.textContent = score;
        livesText.textContent = lives;
    }

});