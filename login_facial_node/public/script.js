console.log("script.js cargado");

console.log('faceapi:', typeof faceapi); // Ya debería salir 'object' en consola

const video = document.getElementById('inputVideo');
const status = document.getElementById('status');

// Espera a que faceapi esté disponible
console.log('faceapi:', typeof faceapi);

async function waitForFaceAPI() {
  console.log("Esperando a que faceapi esté definido...");
  while (typeof faceapi === 'undefined') {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  console.log("faceapi ya está definido");
}

async function startVideo() {
  console.log("startVideo iniciada");

  if (!status) {
    console.error("Elemento con id='status' no encontrado");
    return;
  }

  status.textContent = 'Cargando modelos...';

  const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js-models';

  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri(`${MODEL_URL}/tiny_face_detector`);
    await faceapi.nets.faceRecognitionNet.loadFromUri(`${MODEL_URL}/face_recognition`);
    await faceapi.nets.faceLandmark68Net.loadFromUri(`${MODEL_URL}/face_landmark_68`);
  } catch (err) {
    console.error("Error cargando modelos:", err);
    status.textContent = 'Error cargando modelos: ' + err.message;
    return;
  }

  status.textContent = 'Modelos cargados. Accediendo a cámara...';
  console.log("Modelos cargados correctamente");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
    status.textContent = 'Cámara activa. Listo.';
    console.log("Cámara activada");
  } catch (err) {
    status.textContent = 'Error al acceder a la cámara: ' + err.message;
    console.error("Error cámara:", err);
  }
}

async function registerFace() {
  console.log("registerFace function called");

  const captureBtn = document.getElementById('captureBtn');
  if (!captureBtn) {
    console.error("No se encontró el botón captureBtn");
    return;
  }

  captureBtn.addEventListener('click', async () => {
    console.log("Botón Capturar clickeado");
    status.textContent = 'Detectando rostro...';

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      status.textContent = 'No se detectó ningún rostro. Intenta de nuevo.';
      console.log("No se detectó rostro");
      return;
    }

    status.textContent = 'Rostro detectado. Preparando datos para enviar...';
    console.log("Rostro detectado:", detection);

    const canvas = faceapi.createCanvasFromMedia(video);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const username = prompt('Ingresa tu nombre de usuario para registrar:');
      if (!username) {
        status.textContent = 'Registro cancelado: sin nombre de usuario.';
        console.log("Registro cancelado por falta de username");
        return;
      }

      const formData = new FormData();
      formData.append('username', username);
      formData.append('image', blob, 'face.jpg');
      formData.append('encoding', JSON.stringify(detection.descriptor));

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        status.textContent = result.message;
        console.log("Respuesta del servidor:", result);
      } catch (error) {
        status.textContent = 'Error al registrar: ' + error.message;
        console.error("Error al enviar datos:", error);
      }
    }, 'image/jpeg');
  });
}

async function loginFace() {
  const loginBtn = document.getElementById('loginBtn');
  if (!loginBtn) return;

  let labeledDescriptors = null;

  loginBtn.addEventListener('click', async () => {
    status.textContent = 'Detectando rostro...';

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      status.textContent = 'No se detectó ningún rostro. Intenta de nuevo.';
      return;
    }

    if (!labeledDescriptors) {
      status.textContent = 'Cargando datos de usuarios...';
      const response = await fetch('/api/encodings');
      const data = await response.json();

      labeledDescriptors = data.map(user => {
        const descriptors = user.descriptors.map(d => new Float32Array(d));
        return new faceapi.LabeledFaceDescriptors(user.username, descriptors);
      });
    }

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
    const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

    if (bestMatch.label === 'unknown') {
      status.textContent = 'Usuario no reconocido. Intenta registrarte.';
    } else {
      status.textContent = `Bienvenido, ${bestMatch.label}! Autenticación exitosa.`;
      // Aquí podrías hacer redirect o generar token JWT
    }
  });
}

// Inicialización general, esperando que faceapi esté disponible
(async () => {
  console.log("Inicializando script...");
  await waitForFaceAPI();
  console.log("faceapi listo, arrancando video...");
  await startVideo();

  const path = window.location.pathname;
  console.log("Página actual:", path);

  if (path.endsWith('register.html')) {
    console.log("Lanzando función de registro facial");
    registerFace();
  } else if (path.endsWith('login.html')) {
    console.log("Lanzando función de login facial");
    loginFace();
  }
})();
