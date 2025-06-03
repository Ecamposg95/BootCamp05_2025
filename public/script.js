document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let videoStream;
    const video = document.getElementById('video');
    const videoContainer = document.querySelector('.video-container');
    const usernameInput = document.getElementById('username');
    const actionBtn = document.getElementById('actionBtn');
    const statusMessage = document.getElementById('statusMessage');
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    
    // Definir las funciones primero
    async function registerUser() {
        const username = usernameInput.value.trim();
        if (!username) {
            statusMessage.textContent = 'Por favor, ingresa un nombre de usuario';
            return;
        }

        statusMessage.textContent = 'Detectando rostro...';
        actionBtn.disabled = true;
        
        try {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();
            
            if (detections.length === 0) {
                statusMessage.textContent = 'No se detectó ningún rostro. Intenta nuevamente.';
                actionBtn.disabled = false;
                return;
            }
            
            const descriptor = Array.from(detections[0].descriptor);
            statusMessage.textContent = 'Enviando datos al servidor...';
            
            // Simulación de envío al servidor (reemplaza con tu fetch real)
            console.log('Registrando usuario:', { username, descriptor });
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simular espera
            
            statusMessage.textContent = 'Registro exitoso!';
            setTimeout(() => {
                resetUI();
                // window.location.href = '/welcome.html'; // Descomenta cuando esté listo
            }, 2000);
        } catch (err) {
            console.error('Error en registro:', err);
            statusMessage.textContent = 'Error durante el registro';
            actionBtn.disabled = false;
        }
    }

    async function loginUser() {
        const username = usernameInput.value.trim();
        if (!username) {
            statusMessage.textContent = 'Por favor, ingresa tu nombre de usuario';
            return;
        }

        statusMessage.textContent = 'Verificando tu identidad...';
        actionBtn.disabled = true;
        
        try {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();
            
            if (detections.length === 0) {
                statusMessage.textContent = 'No se detectó ningún rostro. Intenta nuevamente.';
                actionBtn.disabled = false;
                return;
            }
            
            const descriptor = Array.from(detections[0].descriptor);
            statusMessage.textContent = 'Verificando con el servidor...';
            
            // Simulación de envío al servidor (reemplaza con tu fetch real)
            console.log('Iniciando sesión usuario:', { username, descriptor });
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simular espera
            
            statusMessage.textContent = 'Autenticación exitosa!';
            setTimeout(() => {
                resetUI();
                // window.location.href = '/welcome.html'; // Descomenta cuando esté listo
            }, 2000);
        } catch (err) {
            console.error('Error en login:', err);
            statusMessage.textContent = 'Error durante la autenticación';
            actionBtn.disabled = false;
        }
    }

    function resetUI() {
        videoContainer.style.display = 'none';
        document.getElementById('usernameContainer').style.display = 'none';
        actionBtn.style.display = 'none';
        usernameInput.value = '';
        actionBtn.disabled = false;
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
        }
    }

    async function loadModels() {
        try {
            statusMessage.textContent = 'Cargando modelos...';
            console.log('Cargando modelos de face-api.js');
            
            await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
            
            console.log('Modelos cargados correctamente');
            return true;
        } catch (err) {
            console.error('Error cargando modelos:', err);
            statusMessage.textContent = 'Error cargando modelos. Recarga la página.';
            return false;
        }
    }

    async function setupCamera() {
        try {
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
            }
            
            videoStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 640, 
                    height: 480,
                    facingMode: 'user'
                } 
            });
            
            video.srcObject = videoStream;
            return new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    video.play();
                    resolve(true);
                };
            });
        } catch (err) {
            console.error('Error al acceder a la cámara:', err);
            statusMessage.textContent = 'Error al acceder a la cámara. Asegúrate de dar los permisos necesarios.';
            return false;
        }
    }

    async function startProcess(action) {
        try {
            console.log(`Iniciando proceso: ${action}`);
            
            registerBtn.disabled = true;
            loginBtn.disabled = true;
            
            const modelsLoaded = await loadModels();
            if (!modelsLoaded) {
                registerBtn.disabled = false;
                loginBtn.disabled = false;
                return;
            }
            
            const cameraReady = await setupCamera();
            if (!cameraReady) {
                registerBtn.disabled = false;
                loginBtn.disabled = false;
                return;
            }
            
            videoContainer.style.display = 'block';
            document.getElementById('usernameContainer').style.display = 'block';
            actionBtn.style.display = 'block';
            
            if (action === 'register') {
                statusMessage.textContent = 'Ingresa tu nombre y coloca tu rostro frente a la cámara';
                actionBtn.textContent = 'Registrarse';
                actionBtn.onclick = registerUser;
            } else {
                statusMessage.textContent = 'Ingresa tu nombre y coloca tu rostro para iniciar sesión';
                actionBtn.textContent = 'Iniciar Sesión';
                actionBtn.onclick = loginUser;
            }
            
            registerBtn.disabled = false;
            loginBtn.disabled = false;
            
        } catch (err) {
            console.error('Error en startProcess:', err);
            statusMessage.textContent = 'Error inesperado. Recarga la página.';
            registerBtn.disabled = false;
            loginBtn.disabled = false;
        }
    }

    // Asignar event listeners
    registerBtn.addEventListener('click', () => startProcess('register'));
    loginBtn.addEventListener('click', () => startProcess('login'));
});