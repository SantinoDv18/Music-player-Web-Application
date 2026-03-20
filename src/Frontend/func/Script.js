/* =========================
   SELECTORES DOM
========================= */

const audio = document.getElementById("audio");

const botonPlay = document.getElementById("Boton_play");
const botonNext = document.getElementById("Boton_next");
const botonPrev = document.getElementById("Boton_prev");
const botonAzar = document.getElementById("Boton_azar");
const botonRepetir = document.getElementById("Boton_repetir");
const botonVolumen = document.getElementById("Boton_volumen");

const ProgressBar = document.getElementById("Progress_bar");
const Progress = document.getElementById("Progress");

const SpanTiempoActual = document.getElementById("Tiempo_progresivo");
const SpanTiempoFinal = document.getElementById("Tiempo_final");

const songTitle = document.getElementById("Titulo");
const songArtist = document.getElementById("Artista");
const imgPortada = document.getElementById("imgPortada");

const imgBotonPlay = document.getElementById("imgBotonPlay");
const imgBotonPause = document.getElementById("imgBotonPause");
const imgBotonAzar = document.getElementById("imgBotonAzar");
const imgBotonRepetir = document.getElementById("imgBotonRepetir");

const inputControlVolumen = document.getElementById("inputControlVolumen")

/* =========================
   ESTADO
========================= */

let canciones = [];
let indexCancion = 0;
let estadoAzar = false;
let estadoRepetir = false;
let cancionesVisibles = 5;  // Agregar esto
const CANCIONES_INICIALES = 5;  // Agregar esto


/* =========================
    INICIALIZACIÓN
    
========================= */

fetch("http://127.0.0.1:8000/api/canciones/")
    .then(res => {
        if (!res.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return res.json();
    })

    .then(data => {
        canciones = data;
        if (canciones.length > 0) cargarCancion(0);
        crearTablaCanciones(canciones);
        destacarCancionActual();
    })

    /*
    
    .catch(error => {
        console.log('Falló la conexión con el backend \n', error);
        alert('El servidor backend está apagado o no disponible.');
    })

    */
;   





/* =========================
   EVENTOS AUDIO
========================= */

audio.addEventListener("timeupdate", actualizarProgreso);
audio.addEventListener("loadedmetadata", actualizarDuracionTotal);
audio.addEventListener("ended", manejarFinCancion);


/* =========================
   EVENTOS INPUTS
========================= */

inputControlVolumen.addEventListener('input', modificarVolumen);

/* =========================
   EVENTOS BOTONES
========================= */

botonPlay.addEventListener("click", togglePlay);
botonNext.addEventListener("click", () => cambiarCancion(indexCancion + 1));
botonPrev.addEventListener("click", () => cambiarCancion(indexCancion - 1));
botonAzar.addEventListener("click", toggleAzar);
botonRepetir.addEventListener("click", toggleRepetir);
ProgressBar.addEventListener("click", cambiarTiempo);

/* =========================
   FUNCIONES
========================= */
function destacarCancionActual() {
    // Remover clase activa de todas las filas
    const filasActivas = document.querySelectorAll('tr.activa');
    filasActivas.forEach(fila => fila.classList.remove('activa'));
    
    // Obtener todas las filas de la tabla
    const filas = document.querySelectorAll('tbody tr');
    
    // Agregar clase activa a la canción actual
    if (filas[indexCancion]) {
        filas[indexCancion].classList.add('activa');
        
        // Si la fila está oculta, expandir la tabla
        if (filas[indexCancion].classList.contains('oculto')) {
            const btnExpandir = document.getElementById('btnExpandir');
            if (btnExpandir) {
                btnExpandir.click();
            }
        }
    }
}

function crearTablaCanciones(datos) {
    const contenedor = document.getElementById('Tabla_playlist');

    if (!datos || datos.length === 0) {
        contenedor.innerHTML = '<p>No hay canciones disponibles</p>';
        return;
    }

    // Columnas a mostrar
    const columnasAMostrar = ['titulo', 'artista'];  // Cambia según tus campos
    
    let html = '<table><thead><tr>';
    
    // Encabezados
    columnasAMostrar.forEach(col => {
        html += `<th>${col.charAt(0).toUpperCase() + col.slice(1)}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Filas - agregar clase "oculto" a las que están después de la 5ta
    datos.forEach((fila, index) => {
        const clase = index >= CANCIONES_INICIALES ? 'class="oculto"' : '';
        html += `<tr ${clase}>`;
        columnasAMostrar.forEach(col => {
            const valor = fila[col] !== null && fila[col] !== undefined ? fila[col] : '-';
            html += `<td>${valor}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    
    // Agregar botón de expansión si hay más de 5 canciones
    if (datos.length > CANCIONES_INICIALES) {
        html += '<div class="contenedor-boton"><button id="btnExpandir">Ver más</button></div>';
    }
    
    contenedor.innerHTML = html;

    // Agregar evento al botón si existe
    if (datos.length > CANCIONES_INICIALES) {
        document.getElementById('btnExpandir').addEventListener('click', toggleExpansion);
    }
}

function toggleExpansion() {
    const filas = document.querySelectorAll('tbody tr');
    const btnExpandir = document.getElementById('btnExpandir');
    const mostrarTodas = btnExpandir.textContent === 'Ver más';

    filas.forEach((fila, index) => {
        if (mostrarTodas) {
            // Mostrar todas
            fila.classList.remove('oculto');
        } else {
            // Mostrar solo las primeras 5
            if (index >= CANCIONES_INICIALES) {
                fila.classList.add('oculto');
            }
        }
    });

    // Cambiar texto del botón
    btnExpandir.textContent = mostrarTodas ? 'Ver menos' : 'Ver más';
}

function modificarVolumen() {
  audio.volume = inputControlVolumen.value * 0.01;
};


function togglePlay() {
    if (audio.paused) {
        audio.play();
        mostrarPause();
    } else {
        togglePause();
    }
}

function togglePause() {
    audio.pause()
    mostrarPlay();
}
function toggleAzar() {
    estadoAzar = !estadoAzar;
    imgBotonAzar.src = estadoAzar
        ? "media/img/Azar_estado_on.png"
        : "media/img/Azar_estado_off.png";
}

function toggleRepetir() {
    estadoRepetir = !estadoRepetir;
    imgBotonRepetir.src = estadoRepetir
        ? "media/img/Repetir_estado_on.png"
        : "media/img/Repetir_estado_off.png";
}

function cambiarCancion(nuevoIndex) {

    if (estadoAzar) {
        let random;
        do {
            random = Math.floor(Math.random() * canciones.length);
        } while (random === indexCancion);

        indexCancion = random;
    } else {
        if (nuevoIndex < 0) {
            if (estadoRepetir){
                indexCancion = canciones.length - 1;    
            }
            
        } else if (nuevoIndex >= canciones.length) {
            if (estadoRepetir) {
                indexCancion = 0;
            } else {
                audio.currentTime = 0;
                togglePause();
                return;
            }
        } else {
            indexCancion = nuevoIndex;
        }

    }

    cargarCancion(indexCancion);
    audio.play();
    mostrarPause();
    destacarCancionActual();
}

function cargarCancion(index) {
    indexCancion = index;

    const cancion = canciones[indexCancion];

    audio.src = "http://127.0.0.1:8000" + cancion.archivo;
    songTitle.textContent = cancion.titulo;
    songArtist.textContent = cancion.artista;

    imgPortada.src = cancion.portada
        ? "http://127.0.0.1:8000" + cancion.portada
        : "media/img/portadaPorDefecto.jpg";

    SpanTiempoActual.textContent = "0:00";
    destacarCancionActual();
}

function manejarFinCancion() {
    if (estadoRepetir) {
        cambiarCancion(indexCancion + 1)
    } else {
        audio.currentTime = 0;
        togglePause()
    }
}

function actualizarProgreso() {
    if (!audio.duration) return;

    const porcentaje = (audio.currentTime / audio.duration) * 100;
    Progress.style.width = porcentaje + "%";

    SpanTiempoActual.textContent = formatearTiempo(audio.currentTime);
}

function actualizarDuracionTotal() {
    SpanTiempoFinal.textContent = formatearTiempo(audio.duration);
}

function cambiarTiempo(e) {
    const rect = ProgressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const nuevoTiempo = (clickX / rect.width) * audio.duration;
    audio.currentTime = nuevoTiempo;
}

/* =========================
   UTILIDADES
========================= */

function formatearTiempo(tiempo) {
    const minutos = Math.floor(tiempo / 60);
    const segundos = Math.floor(tiempo % 60);
    return `${minutos}:${segundos < 10 ? "0" : ""}${segundos}`;
}

function mostrarPlay() {
    imgBotonPlay.style.display = "flex";
    imgBotonPause.style.display = "none";
}

function mostrarPause() {
    imgBotonPlay.style.display = "none";
    imgBotonPause.style.display = "flex";
}