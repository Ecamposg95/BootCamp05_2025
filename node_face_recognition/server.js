require('@tensorflow/tfjs-node');
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const faceapi = require("@vladmandic/face-api");
const canvasModule = require("canvas");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
faceapi.env.monkeyPatch(canvasModule);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "face_recognition",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

async function loadModels() {
    try {
        const modelPath = path.resolve(__dirname, "models");
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
        console.log("✅ Modelos cargados correctamente");
    } catch (error) {
        console.error("❌ Error al cargar los modelos:", error);
    }
}
loadModels();

// 📌 Ruta para registrar usuarios
app.post("/register", async (req, res) => {
    const { nombre, email, password, descriptor_facial } = req.body;

    console.log("📥 Datos recibidos en /register:", req.body);

    if (!nombre || !email || !password || !descriptor_facial) {
        return res.status(400).json({ message: "❌ Todos los campos son requeridos." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO usuarios (nombre, email, password, descriptor_facial) VALUES (?, ?, ?, ?)",
            [nombre, email, hashedPassword, descriptor_facial],
            (err, results) => {
                if (err) {
                    console.error("❌ Error al registrar usuario en MySQL:", err);
                    return res.status(500).json({ message: "❌ Error interno en la base de datos." });
                }
                console.log("✅ Usuario registrado correctamente:", results);
                res.json({ message: "✅ Usuario registrado correctamente." });
            }
        );
    } catch (error) {
        console.error("❌ Error al procesar el registro:", error);
        res.status(500).json({ message: "❌ Error interno al procesar el registro." });
    }
});

// 📌 Ruta para iniciar sesión con JWT
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    console.log("📥 Datos recibidos en /login:", req.body);

    if (!email || !password) {
        return res.status(400).json({ message: "❌ Todos los campos son requeridos." });
    }

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {
        if (err || results.length === 0) {
            console.error("❌ Error en consulta SQL o usuario no encontrado:", err);
            return res.status(400).json({ message: "❌ Usuario no encontrado." });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "❌ Contraseña incorrecta." });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, "secreto", { expiresIn: "1h" });
        console.log("🔑 Token generado en backend:", token);

        res.json({ message: "✅ Autenticación exitosa.", token });
    });
});

// 📌 Ruta para verificar usuario con imagen
app.post("/verify", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "❌ No se recibió la imagen correctamente." });
    }

    console.log("📸 Imagen recibida:", req.file);

    try {
        const imagePath = path.resolve(__dirname, req.file.path);
        const img = await canvasModule.loadImage(imagePath);
        const canvas = canvasModule.createCanvas(img.width, img.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const detections = await faceapi.detectAllFaces(canvas)
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (detections.length === 0) {
            return res.json({ message: "⚠️ No se detectó ningún rostro." });
        }

        const descriptor = new Float32Array(detections[0].descriptor);

        db.query("SELECT * FROM usuarios", async (err, results) => {
            if (err || results.length === 0) {
                return res.status(400).json({ message: "❌ No se encontraron usuarios registrados." });
            }

            let bestMatch = null;
            let minDistance = 1.0;

            results.forEach(user => {
                const storedDescriptor = new Float32Array(JSON.parse(user.descriptor_facial));
                const distance = faceapi.euclideanDistance(descriptor, storedDescriptor);

                if (distance < minDistance) {
                    minDistance = distance;
                    bestMatch = user;
                }
            });

            if (bestMatch && minDistance < 0.6) {
                res.json({ message: "✅ Usuario verificado.", usuario: bestMatch });
            } else {
                res.json({ message: "⚠️ No se encontró coincidencia." });
            }
        });
    } catch (error) {
        console.error("❌ Error procesando la imagen:", error);
        res.status(500).json({ message: "❌ Error interno." });
    }
});

// 📌 Iniciar servidor
app.listen(5000, () => {
    console.log("✅ Servidor corriendo en http://127.0.0.1:5000");
});
