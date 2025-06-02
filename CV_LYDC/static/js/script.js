function register() {
  const name = document.getElementById('name').value;
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');

  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('photo', blob, 'photo.jpg');

    fetch('/register', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        alert('Registro exitoso');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al registrar');
    });
  }, 'image/jpeg');
}

function login() {
  const video = document.getElementById('videoLogin');
  const canvas = document.getElementById('canvasLogin');
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append('face', blob, 'login.jpg');

    fetch('/login', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        alert('Inicio de sesión fallido');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error en inicio de sesión');
    });
  }, 'image/jpeg');
}

window.onload = () => {
  // Activar ambas cámaras
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      document.getElementById('video').srcObject = stream;
      document.getElementById('videoLogin').srcObject = stream;
    })
    .catch((err) => {
      console.error('No se pudo acceder a la cámara:', err);
    });
};

