const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error("Error al acceder a la cámara: ", error);
    });

function capture() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
}

async function register() {
    const name = document.getElementById('name').value;
    const photo = capture();

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, photo })
        });
        const data = await response.json();
        alert(data.message || 'Registro completo');
    } catch (error) {
        console.error("Error en el registro:", error);
    }
}

async function login() {
    const photo = capture();

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photo })
        });
        const data = await response.json();
        if (data.success) {
            window.location.href = `/success?user_name=${data.name}`;
        } else {
            alert('No se encontró ninguna coincidencia');
        }
    } catch (error) {
        console.error("Error en el login:", error);
    }
}

