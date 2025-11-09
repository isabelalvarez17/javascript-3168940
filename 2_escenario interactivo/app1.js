document.addEventListener('DOMContentLoaded', () => {
    const scenes = document.querySelectorAll('.escena');
    const btnSiguiente = document.querySelector('.btn-siguiente');
    const btnAnterior = document.querySelector('.btn-anterior');
    const miniaturas = document.querySelectorAll('.miniatura');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const audioButtons = document.querySelectorAll('.play-pause-btn');

    let currentSceneIndex = 0;
    let score = 0;
    let lives = 3;
    // Contadores por escena: puntos recogidos en cada escena (0: cielo, 1: campo, 2: cocina)
    let sceneScores = [0, 0, 0];

    // Elementos UI de contadores por escena
    const sceneScoreEls = [
        document.getElementById('scene-score-0'),
        document.getElementById('scene-score-1'),
        document.getElementById('scene-score-2')
    ];
    const sceneLivesEl = document.getElementById('scene-lives-0');

    // Sonidos: uso Web Audio API como fallback si no hay archivos mp3
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioCtx = AudioCtx ? new AudioCtx() : null;
    if (!audioCtx) console.warn('WebAudio no disponible; los efectos y fondos no sonarán si no hay archivos audio/');

    // Helpers
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Crear buffer de ruido reutilizable (para sonidos como miau)
    let noiseBuffer = null;
    if (audioCtx) {
        const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 1, audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
        noiseBuffer = buf;
    }

    // Sonido: miau del gato con variantes
    const playMeow = (variant = null) => {
        if (!audioCtx) return;
        try { audioCtx.resume && audioCtx.resume(); } catch (e) {}
        const now = audioCtx.currentTime;
        // si no se especifica, elegir variante aleatoria
        const v = variant === null ? randInt(0, 3) : variant;

        // parámetros base por variante
        const params = [
            { o1Freq: 700, o2Freq: 450, attack: 0.01, length: 0.6, filter: 1200, wave: 'sine' },
            { o1Freq: 900, o2Freq: 520, attack: 0.005, length: 0.5, filter: 1500, wave: 'triangle' },
            { o1Freq: 600, o2Freq: 400, attack: 0.02, length: 0.8, filter: 1000, wave: 'sine' },
            { o1Freq: 750, o2Freq: 480, attack: 0.01, length: 0.7, filter: 900, wave: 'sawtooth' }
        ][v % 4];

        const o1 = audioCtx.createOscillator();
        const o2 = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        const f = audioCtx.createBiquadFilter();
        f.type = 'lowpass'; f.frequency.value = params.filter;

        o1.type = params.wave; o2.type = params.wave;
        o1.frequency.setValueAtTime(params.o1Freq, now);
        o2.frequency.setValueAtTime(params.o2Freq, now);

        // glide/downbend magnitude varies by variant
        const glide = 0.18 + Math.random() * 0.18;
        o1.frequency.exponentialRampToValueAtTime(Math.max(120, params.o1Freq * 0.7), now + glide);
        o2.frequency.exponentialRampToValueAtTime(Math.max(100, params.o2Freq * 0.75), now + glide);

        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.12, now + params.attack);
        g.gain.exponentialRampToValueAtTime(0.0001, now + params.length);

        o1.connect(f); o2.connect(f); f.connect(g); g.connect(audioCtx.destination);

        o1.start(now); o2.start(now);
        o1.stop(now + params.length + 0.05); o2.stop(now + params.length + 0.05);

        // ruido en ataque opcional con probabilidad
        if (noiseBuffer && Math.random() < 0.6) {
            const nb = audioCtx.createBufferSource();
            nb.buffer = noiseBuffer;
            const ng = audioCtx.createGain();
            ng.gain.setValueAtTime(0.12 + Math.random() * 0.2, now);
            ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.06 + Math.random() * 0.06);
            nb.connect(ng); ng.connect(audioCtx.destination);
            nb.start(now);
            nb.stop(now + 0.06 + Math.random() * 0.06);
        }
    };

    // Sonido: muu (vaca) con variaciones
    const playMoo = (variant = 0) => {
        if (!audioCtx) return;
        try { audioCtx.resume && audioCtx.resume(); } catch (e) {}
        const now = audioCtx.currentTime;
        // ampliar variación: tipo de onda, vibrato, filter y duración
        const waveChoices = ['sine','sine','triangle','sawtooth'];
        const wave = randChoice(waveChoices);
        const baseFreq = 70 + randInt(0, 30) + (variant * 8);
        const length = 0.5 + Math.random() * 0.8 + variant * 0.15;

        const o = audioCtx.createOscillator();
        const o2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 600 + randInt(0, 600);

        o.type = wave; o2.type = wave;
        o.frequency.setValueAtTime(baseFreq, now);
        o2.frequency.setValueAtTime(baseFreq * (1 + (Math.random() * 0.015)), now);

        // vibrato LFO with random depth/speed
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.frequency.value = 3 + Math.random() * 5 + variant;
        lfoGain.gain.value = 1 + Math.random() * 4 + variant;
        lfo.connect(lfoGain);
        lfoGain.connect(o.frequency);
        lfoGain.connect(o2.frequency);

        // slight pitch bend at the end for some variants
        if (Math.random() < 0.4) {
            o.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, now + length);
            o2.frequency.exponentialRampToValueAtTime(baseFreq * 0.86, now + length);
        }

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.14 + Math.random() * 0.14, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + length);

        o.connect(filter); o2.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);

        lfo.start(now + 0.001);
        o.start(now); o2.start(now);
        o.stop(now + length + 0.05); o2.stop(now + length + 0.05); lfo.stop(now + length + 0.06);
    };

    // Sonido: yomi (comida) - pequeño arpegio/tono alegre
    const playYomi = (variant = null) => {
        if (!audioCtx) return;
        try { audioCtx.resume && audioCtx.resume(); } catch (e) {}
        const now = audioCtx.currentTime;
        const v = variant === null ? randInt(0,2) : variant;
        const variants = [
            { notes: [880,660,990], wave: 'triangle', rate: 0.06 },
            { notes: [660,880,990,880], wave: 'sine', rate: 0.05 },
            { notes: [990,880,1320], wave: 'square', rate: 0.04 }
        ];
        const cfg = variants[v % variants.length];
        cfg.notes.forEach((n, i) => {
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            o.type = cfg.wave;
            o.frequency.setValueAtTime(n * (1 + (Math.random()-0.5)*0.06), now + i * cfg.rate);
            g.gain.setValueAtTime(0.0001, now + i * cfg.rate);
            g.gain.linearRampToValueAtTime(0.08 + Math.random()*0.08, now + i * cfg.rate + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, now + i * cfg.rate + 0.18 + Math.random()*0.06);
            o.connect(g); g.connect(audioCtx.destination);
            o.start(now + i * cfg.rate);
            o.stop(now + i * cfg.rate + 0.2 + Math.random()*0.12);
        });
    };

    // Efecto de click (tono corto)
    const clickSound = {
        play: () => {
            if (!audioCtx) return;
            try { audioCtx.resume && audioCtx.resume(); } catch (e) {}
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            o.type = 'square';
            o.frequency.value = 900;
            g.gain.setValueAtTime(0, audioCtx.currentTime);
            g.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
            o.connect(g); g.connect(audioCtx.destination);
            o.start();
            setTimeout(() => { try{ o.stop(); } catch(e){} }, 140);
        }
    };

    // Efecto de recoger (sonido más agradable)
    const collectSound = {
        play: () => {
            if (!audioCtx) return;
            try { audioCtx.resume && audioCtx.resume(); } catch (e) {}
            const freqs = [880, 1320];
            const now = audioCtx.currentTime;
            const master = audioCtx.createGain();
            master.gain.value = 0.0001;
            master.connect(audioCtx.destination);
            master.gain.linearRampToValueAtTime(0.2, now + 0.01);
            master.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
            freqs.forEach((f, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.type = 'sine';
                o.frequency.value = f;
                g.gain.value = 0.6 / (i + 1);
                o.connect(g); g.connect(master);
                o.start(now + i * 0.02);
                o.stop(now + 0.4 + i * 0.02);
            });
        }
    };

    // Background synths por escena (fallback si no hay archivos mp3)
    const backgroundSynths = {};
    const createBackgroundSynth = (sceneId, tone = 110) => {
        if (!audioCtx) return null;
        let osc = null;
        let lfo = null;
        let gain = null;
        let playing = false;

        const play = () => {
            if (playing) return;
            try { audioCtx.resume && audioCtx.resume(); } catch (e) {}
            osc = audioCtx.createOscillator();
            lfo = audioCtx.createOscillator();
            gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.value = tone;
            lfo.frequency.value = 0.2 + Math.random() * 0.4;
            gain.gain.value = 0.0;
            filter.type = 'lowpass';
            filter.frequency.value = 800;

            lfo.connect(filter.frequency);
            // conecta oscilador -> filtro -> ganancia -> destino
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            lfo.start();
            // fade in
            gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 1.2);
            playing = true;
        };

        const pause = () => {
            if (!playing) return;
            try {
                gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
                setTimeout(() => {
                    try{ osc.stop(); lfo.stop(); } catch(e){}
                }, 500);
            } catch (e) {}
            playing = false;
        };

        return { play, pause, get playing() { return playing; } };
    };

    // Inicialización de funciones existentes
    const initGame1 = () => {
        console.log("Inicializando Juego 1 (Cielo)");
        // Asegurarse de que el gato y los objetos estén en su posición inicial si es necesario
        const gato = document.getElementById('gato');
        if (gato) {
            gato.style.left = '50px';
            gato.style.top = '200px';
        }
        score = 0;
        lives = 3;
    // Resetear contadores por escena al reiniciar juego 1
    sceneScores = [0,0,0];
    updateSceneCounters();
        updateGameInfo();
        // Mostrar todos los peces, monedas y corazones (comprobaciones nulas)
        const pez1 = document.getElementById('pez1'); if (pez1) pez1.style.display = 'block';
        const pez2 = document.getElementById('pez2'); if (pez2) pez2.style.display = 'block';
        const moneda1 = document.getElementById('moneda1'); if (moneda1) moneda1.style.display = 'block';
        const corazon1 = document.getElementById('corazon1'); if (corazon1) corazon1.style.display = 'block';
    };

    const initGame2 = () => {
        console.log("Inicializando Juego 2 (Campo)");
        // Restaurar vacas si fueron ocultadas
        document.querySelectorAll('#game2-container .interactable').forEach(vaca => { if (vaca) vaca.style.display = 'block'; });
    };

    const initGame3 = () => {
        console.log("Inicializando Juego 3 (Cocina)");
        // Restaurar comidas si fueron ocultadas
        document.querySelectorAll('#game3-container .interactable').forEach(comida => { if (comida) comida.style.display = 'block'; });
    };

    const allInitFunctions = [initGame1, initGame2, initGame3];


    // Función para actualizar el marcador y las vidas
    const updateGameInfo = () => {
        if (scoreDisplay && livesDisplay) {
            scoreDisplay.textContent = score;
            livesDisplay.textContent = lives;
        }
        // Actualizar contadores por escena UI
        try { updateSceneCounters(); } catch (e) { /* noop */ }
    };

    const updateSceneCounters = () => {
        try {
            if (sceneScoreEls[0]) sceneScoreEls[0].textContent = sceneScores[0];
            if (sceneScoreEls[1]) sceneScoreEls[1].textContent = sceneScores[1];
            if (sceneScoreEls[2]) sceneScoreEls[2].textContent = sceneScores[2];
            if (sceneLivesEl) sceneLivesEl.textContent = lives;
        } catch (e) { console.warn('Error actualizando scene counters', e); }
    };

    // Función para cambiar de escena
    const changeScene = (index) => {
        // Pausar todos los audios y synths antes de cambiar de escena
        document.querySelectorAll('audio').forEach(audio => {
            try { audio.pause(); audio.currentTime = 0; } catch (e) {}
        });
        Object.keys(backgroundSynths).forEach(k => {
            try { backgroundSynths[k].pause(); } catch (e) {}
        });

        scenes.forEach((scene, i) => {
            scene.classList.remove('activa');
            if (i === index) {
                scene.classList.add('activa');
                // Reproducir el audio de la nueva escena y su botón
                const currentAudio = scene.querySelector('audio');
                const currentPlayPauseBtn = scene.querySelector('.play-pause-btn');

                const playButtonState = (btn, playing) => {
                    if (!btn) return;
                    btn.textContent = playing ? '⏸️' : '▶️';
                    btn.dataset.playing = playing ? 'true' : 'false';
                };

                if (currentAudio && currentAudio.getAttribute('src')) {
                    // Try to play external audio file; if it fails, fallback to synth
                    currentAudio.play().then(() => {
                        playButtonState(currentPlayPauseBtn, true);
                    }).catch(() => {
                        // Fallback: create or use synth
                        if (!backgroundSynths[scene.id]) backgroundSynths[scene.id] = createBackgroundSynth(scene.id);
                        backgroundSynths[scene.id] && backgroundSynths[scene.id].play();
                        playButtonState(currentPlayPauseBtn, true);
                    });
                } else {
                    // No external audio: use synth
                    if (!backgroundSynths[scene.id]) backgroundSynths[scene.id] = createBackgroundSynth(scene.id, 80 + i * 40);
                    backgroundSynths[scene.id] && backgroundSynths[scene.id].play();
                    playButtonState(currentPlayPauseBtn, true);
                }
            }
        });

        miniaturas.forEach((miniatura, i) => {
            miniatura.classList.remove('active-thumbnail');
            if (i === index) {
                miniatura.classList.add('active-thumbnail');
            }
        });

        currentSceneIndex = index;
        // Ejecutar la función de inicialización para la escena actual
        allInitFunctions[currentSceneIndex]();
    };

    // Navegación de escenas
    btnSiguiente.addEventListener('click', () => {
        let nextIndex = (currentSceneIndex + 1) % scenes.length;
        changeScene(nextIndex);
    });

    btnAnterior.addEventListener('click', () => {
        let prevIndex = (currentSceneIndex - 1 + scenes.length) % scenes.length;
        changeScene(prevIndex);
    });

    // Clic en miniaturas
    miniaturas.forEach((miniatura) => {
        miniatura.addEventListener('click', () => {
            const index = parseInt(miniatura.dataset.scene);
            changeScene(index);
        });
    });

    // Control de audio
    audioButtons.forEach(button => {
        button.addEventListener('click', () => {
            const audioId = button.dataset.audio;
            const audio = document.getElementById(audioId);

            // If there's an HTMLAudioElement with a src, try to toggle it.
            if (audio && audio.getAttribute('src')) {
                if (audio.paused) {
                    audio.play().then(() => {
                        button.textContent = '⏸️';
                        button.dataset.playing = 'true';
                    }).catch(() => {
                        // If external audio can't play, use synth fallback
                        if (!backgroundSynths[audio.parentElement.id]) backgroundSynths[audio.parentElement.id] = createBackgroundSynth(audio.parentElement.id);
                        backgroundSynths[audio.parentElement.id] && backgroundSynths[audio.parentElement.id].play();
                        button.textContent = '⏸️';
                        button.dataset.playing = 'true';
                    });
                } else {
                    try { audio.pause(); } catch (e) {}
                    button.textContent = '▶️';
                    button.dataset.playing = 'false';
                }
                return;
            }

            // No external audio: toggle synth for the scene
            const scene = button.closest('.escena');
            if (!scene) return;
            if (!backgroundSynths[scene.id]) backgroundSynths[scene.id] = createBackgroundSynth(scene.id, 100);
            const synth = backgroundSynths[scene.id];
            if (synth) {
                if (synth.playing) {
                    synth.pause();
                    button.textContent = '▶️';
                    button.dataset.playing = 'false';
                } else {
                    synth.play();
                    button.textContent = '⏸️';
                    button.dataset.playing = 'true';
                }
            }
        });
    });


    // Lógica del Gato (Escena 1)
    const gato = document.getElementById('gato');
    if (gato) {
        const game1Container = document.getElementById('game1-container');
        let gatoX = gato.offsetLeft;
        let gatoY = gato.offsetTop;
        const gatoSpeed = 10;

        document.addEventListener('keydown', (e) => {
            if (currentSceneIndex === 0) { // Solo si estamos en la escena del gato
                if (e.key === 'ArrowUp') gatoY = Math.max(0, gatoY - gatoSpeed);
                if (e.key === 'ArrowDown') gatoY = Math.min(game1Container.clientHeight - gato.clientHeight, gatoY + gatoSpeed);
                if (e.key === 'ArrowLeft') gatoX = Math.max(0, gatoX - gatoSpeed);
                if (e.key === 'ArrowRight') gatoX = Math.min(game1Container.clientWidth - gato.clientWidth, gatoX + gatoSpeed);

                gato.style.left = `${gatoX}px`;
                gato.style.top = `${gatoY}px`;
            }
        });

        // Lógica de colisión (bounding box)
        const checkCollision = () => {
            if (currentSceneIndex !== 0) return; // Solo verificar colisiones en la escena 1

            const gatoRect = gato.getBoundingClientRect();

            document.querySelectorAll('#game1-container .interactable').forEach(item => {
                if (item.style.display === 'none') return; // Si ya se recogió, ignorar

                const itemRect = item.getBoundingClientRect();

                // Detección de colisión
                if (
                    gatoRect.left < itemRect.right &&
                    gatoRect.right > itemRect.left &&
                    gatoRect.top < itemRect.bottom &&
                    gatoRect.bottom > itemRect.top
                ) {
                    // Colisión detectada -> miau del gato
                    try { playMeow(); } catch (e) { try { collectSound.play(); } catch (e) {} }
                    item.style.display = 'none'; // Ocultar el item recogido

                    if (item.id.startsWith('pez')) {
                        score += 10;
                        sceneScores[0] += 10;
                    } else if (item.id.startsWith('moneda')) {
                        score += 50;
                        sceneScores[0] += 50;
                    } else if (item.id.startsWith('corazon')) {
                        lives += 1;
                    }
                    updateGameInfo();
                }
            });
        };

        setInterval(checkCollision, 100); // Verificar colisiones cada 100ms
    }


    // Lógica de clickeo para Escena 2 (Vacas)
    document.querySelectorAll('#game2-container .interactable').forEach(vaca => {
        vaca.addEventListener('click', () => {
                if (currentSceneIndex === 1) {
                    // moo con variante basada en id o animatable
                    const variant = vaca.id ? (parseInt(vaca.id.replace(/\D/g, '')) % 3) : 0;
                    try { playMoo(vaca.classList.contains('animatable') ? variant + 1 : variant); } catch (e) { clickSound.play(); }
                    vaca.style.display = 'none'; // Ocultar la vaca al hacer clic
                    if (vaca.classList.contains('animatable')) {
                        score += 25;
                        sceneScores[1] += 25;
                    } else {
                        score += 10;
                        sceneScores[1] += 10;
                    }
                    updateGameInfo();
                }
        });
    });

    // Lógica de clickeo para Escena 3 (Comida)
    document.querySelectorAll('#game3-container .interactable').forEach(comida => {
        comida.addEventListener('click', () => {
                if (currentSceneIndex === 2) {
                    try { playYomi(); } catch (e) { clickSound.play(); }
                    comida.style.display = 'none'; // Ocultar la comida al hacer clic
                    if (comida.classList.contains('animatable')) {
                        score += 20;
                        sceneScores[2] += 20;
                    } else {
                        score += 5;
                        sceneScores[2] += 5;
                    }
                    updateGameInfo();
                }
        });
    });

    // Animaciones
    // Nubes en Escena 1 (puedes personalizar esto más)
    const nube1 = document.getElementById('nube1');
    const nube2 = document.getElementById('nube2');

    if (nube1 && nube2) {
        nube1.classList.add('nube-move'); // Aplica una animación CSS
        nube2.classList.add('animatable'); // Usa la animación general de flotar
    }

    // Moneda y Corazón flotando (ya tienen la clase animatable)
    // Las vacas y comidas animadas también usan la clase animatable.

    // Inicializar la primera escena al cargar la página
    changeScene(0);
});