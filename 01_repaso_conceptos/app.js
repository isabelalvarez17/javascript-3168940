// Obtener elementos de forma segura
const imagen = document.getElementById('leopardo');
const btnBN = document.getElementById('bn');
const btnBlur = document.getElementById('blur');
const btnZoom = document.getElementById('zoom');

if (!imagen) {
    console.warn('Imagen con id "leopardo" no encontrada en el DOM.');
}

// Estado de efectos
const state = {
    bn: false,
    blur: false,
    zoom: false,
};

function updateImage() {
    if (!imagen) return;

    // Componer filtros: grayscale + blur pueden coexistir
    const filters = [];
    if (state.bn) filters.push('grayscale(100%)');
    if (state.blur) filters.push('blur(5px)');
    imagen.style.filter = filters.length ? filters.join(' ') : 'none';

    // Transform para zoom/rotar
    imagen.style.transform = state.zoom ? 'scale(1.2) rotate(10deg)' : 'scale(1) rotate(0deg)';
}

function toggleButton(btn, key) {
    if (!btn) return;
    state[key] = !state[key];
    btn.classList.toggle('active', state[key]);
    updateImage();
}

// Añadir listeners
if (btnBN) btnBN.addEventListener('click', () => toggleButton(btnBN, 'bn'));
if (btnBlur) btnBlur.addEventListener('click', () => toggleButton(btnBlur, 'blur'));
if (btnZoom) btnZoom.addEventListener('click', () => toggleButton(btnZoom, 'zoom'));

// Estado inicial
updateImage();
