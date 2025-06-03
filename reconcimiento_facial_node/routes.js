const express = require("express");
const router = express.Router();
const faceapi = require("@vladmandic/face-api");
const fs = require("fs");
const path = require("path");
const db = require("./models/db");

const MODELS_URL = path.join(__dirname, "face-api-models");
const encodingsPath = path.join(__dirname, "encodings.json");
//const descriptor = await getDescriptorFromBase64(image);
//const encodings = loadEncodings();

// Cargar modelos una sola vez
let modelsLoaded = false;
async function loadModels() {
  if (!modelsLoaded) {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_URL);
    modelsLoaded = true;
    console.log("Modelos de FaceAPI cargados");
  }
}

// Funcion para cargar encoding.json
/*function loadEncodings() {
  if (fs.existsSync(encodingsPath)) {
    return JSON.parse(fs.readFileSync(encodingsPath));
  } else {
    return [];
  }
}

// Funcion para guardar encoding.json
function saveEncodings(encodings) {
  fs.writeFileSync(encodingsPath, JSON.stringify(encodings, null, 2));
}*/

//Función para cargar a la base de datos
function loadEncodingsFromDB() {
  return new Promise((resolve, reject) => {
    db.all('SELECT name, encoding FROM users', [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      const encodings = rows.map(row => ({
        name: row.name,
        descriptor: JSON.parse(row.encoding)
      }));
      resolve(encodings);
    });
  });
}

//Función para guardar a la base de datos
function saveEncodingToDB(name, descriptor) {
  return new Promise((resolve, reject) => {
    const descriptorStr = JSON.stringify(Array.from(descriptor));
    db.run(
      'INSERT INTO users (name, encoding) VALUES (?, ?)',
      [name, descriptorStr],
      function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
}

// Convertir base64 a tensor
async function getDescriptorFromBase64(base64) {
  const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");
  const tensor = faceapi.tf.node.decodeImage(buffer);
  const results = await faceapi
    .detectSingleFace(tensor)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!results) throw new Error("No se detectó ningún rostro");
  return results.descriptor;
}

// Ruta para registrar una nueva persona
router.post("/register", async (req, res) => {
  try {
    await loadModels();
    const { name, image } = req.body;

    console.log("nombre recibido:", name);
    console.log("imagen recibida:", image ? image.substring(0, 100) + "..." : "No recibida");

    if (!name || !image) {
      throw new Error("Faltan datos: nombre o imagen");
    }

    const descriptor = await getDescriptorFromBase64(image);

    /*const encodings = loadEncodings();
    //encodings.push({ name, descriptor });
    encodings.push({ name, descriptor: Array.from(descriptor) });
    saveEncodings(encodings);*/
    console.log("Guardando en la base");
    await saveEncodingToDB(name, descriptor);
    console.log("Guardando correctamente");

    /*Guardar imagen en la carpeta dataset*/
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    const imagePath = path.join(__dirname, "dataset", `${name.replace(/\s+/g, "_")}.jpg`);
    fs.writeFileSync(imagePath, base64Data, "base64");
    
    res.json({ success: true, message: "Rostro registrado exitosamente" });
  } catch (err) {
    console.error("Error en /register:", err); // <- Esto es clave
    res.status(500).json({ success: false, error: err.message });
  }
});

// Ruta para login facial
router.post("/login", async (req, res) => {
  try {
    await loadModels();
    const { image } = req.body;

    console.log("imagen para login recibida:", image.slice(0, 100));

    const descriptor = await getDescriptorFromBase64(image);
    //const encodings = loadEncodings();

    const encodings = await
    loadEncodingsFromDB();

    let bestMatch = null;
    let bestDistance = 1;

    /*encodings.forEach((user) => {
      const dist = faceapi.euclideanDistance(descriptor, user.descriptor);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestMatch = user.name;
      }
    });*/

    encodings.forEach((user) => {
        const storedDescriptor = new Float32Array(user.descriptor); // 👈 CORREGIDO
        const dist = faceapi.euclideanDistance(descriptor, storedDescriptor);
        if (dist < bestDistance) {
          bestDistance = dist;
          bestMatch = user.name;
        }
    });

    if (bestDistance < 0.5) {
      res.json({ success: true, message: `Bienvenido ${bestMatch}` });
    } else {
      res.status(401).json({ success: false, message: "Rostro no reconocido" });
    }
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;