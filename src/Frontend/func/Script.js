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

/* =========================
   FETCH CANCIONES
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
    })
    .catch(error => {
        console.log('Falló la conexión con el backend \n', error);
        alert('El servidor backend está apagado o no disponible.');
    });

========================= */



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
            indexCancion = canciones.length - 1;
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


/*const canciones = [
	{titulo: "DtMF 🎵", archivo: "misc/DtMF.mp3"},
	{titulo: "BOKeTE 🎵", archivo: "misc/BOKeTE.mp3"},
	{titulo: "BAILE INoLVIDABLE 🎵", archivo: "misc/BAILE INoLVIDABLE.wav"},
	{titulo: "EoO 🎵", archivo: "misc/EoO.wav"},
	{titulo: "KETU TeCRÉ 🎵", archivo: "misc/KETU TeCRÉ.wav"},
	{titulo: "KLOuFRENS 🎵", archivo: "misc/KLOuFRENS.wav"},
	{titulo: "LA MuDANZA 🎵", archivo: "misc/LA MuDANZA.wav"},
	{titulo: "NUEVAYoL 🎵", archivo: "misc/NUEVAYoL.wav"},
	{titulo: "PERFuMITO NUEVO 🎵", archivo: "misc/PERFuMITO NUEVO.wav"},
	{titulo: "VeLDÁ 🎵", archivo: "misc/VeLDÁ.wav"},
	{titulo: "VOY A LLeVARTE PA PR 🎵", archivo: "misc/VOY A LLeVARTE PA PR.wav"},
	{titulo: "WELTiTA 🎵", archivo: "misc/WELTiTA.wav"}
]*/