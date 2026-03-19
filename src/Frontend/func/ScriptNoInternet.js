const volumen = document.getElementById('volumen');
const audio = document.getElementById('audio');

function modificarVolumen() {
  audio.volume = volumen.value * 0.01;
  console.log('aaa')
};

volumen.addEventListener('input', modificarVolumen);