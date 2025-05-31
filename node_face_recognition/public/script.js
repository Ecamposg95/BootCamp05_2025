const video = document.getElementById("video");
const captureBtn = document.getElementById("capture");

// 📌 Inicializar cámara
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("❌ Error al acceder a la cámara:", err));

// 📌 Función de captura y envío al backend
captureBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append("image", blob, "captura.png");

        const token = localStorage.getItem("token"); // 🔐 Obtener token JWT

        if (!token) {
            console.warn("⚠️ No hay token guardado. Inicia sesión primero.");
            alert("Debes iniciar sesión antes de verificar tu rostro.");
            return;
        }

        fetch("http://127.0.0.1:5000/verify", { // 🔹 Ajustar la URL completa
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            console.log("🔍 Respuesta del servidor:", data);

            if (data.usuario) {
                console.log("✅ Usuario verificado:", data.usuario);
                alert(`Bienvenido, ${data.usuario.nombre}!`);
            } else {
                console.warn("⚠️ No se encontró coincidencia.");
                alert("No se detectó un usuario válido.");
            }
        })
        .catch(err => console.error("❌ Error al enviar imagen:", err));
    }, "image/png");
});

// 📌 Función para registrar usuario
document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // ✅ Evita la recarga automática

    const nombre = document.getElementById("registerNombre").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const descriptor_facial = "[0.123, 0.456, -0.789]"; // 🔥 Solo de prueba

    console.log("📤 Enviando datos al backend en /register:", { nombre, email, password, descriptor_facial });

    try {
        const response = await fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email, password, descriptor_facial })
        });

        const result = await response.json();
        console.log("✅ Respuesta del backend:", result);

        if (result.message.includes("Usuario registrado")) {
            alert("✅ Registro exitoso! Ahora puedes iniciar sesión.");
        } else {
            alert("❌ Error al registrar: " + result.message);
        }
    } catch (err) {
        console.error("❌ Error en el registro:", err);
        alert("❌ Error en la conexión con el servidor.");
    }
});

// 📌 Función para iniciar sesión
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // ✅ Evita la recarga automática

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    console.log("📤 Enviando datos al backend en /login:", { email, password });

    try {
        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        console.log("🔑 Token recibido del backend:", result.token);

        if (result.token) {
            localStorage.setItem("token", result.token);
            console.log("✅ Token almacenado correctamente:", localStorage.getItem("token"));
            alert("Inicio de sesión exitoso.");
        } else {
            alert("❌ Error en autenticación, revisa tu email o contraseña.");
        }
    } catch (err) {
        console.error("❌ Error en login:", err);
    }
});
