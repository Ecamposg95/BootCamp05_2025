const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const datasetPath = path.join(__dirname, 'dataset');
const encodingsFile = path.join(__dirname, 'encodings.json');

// Configuración de multer para guardar imágenes en /dataset
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, datasetPath);
  },
  filename: (req, file, cb) => {
    // Guardar la imagen con el nombre usuario + timestamp para evitar conflictos
    const username = req.body.username || 'unknown';
    const ext = path.extname(file.originalname);
    cb(null, `${username}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Endpoint para guardar imagen y codificación
router.post('/register', upload.single('image'), (req, res) => {
  const username = req.body.username;
  const encoding = req.body.encoding; // Esperamos que el cliente envíe la codificación facial como JSON string

  if (!username || !encoding || !req.file) {
    return res.status(400).json({ message: 'Faltan datos para registrar' });
  }

  // Guardar codificación en encodings.json
  let encodingsData = {};
  if (fs.existsSync(encodingsFile)) {
    const raw = fs.readFileSync(encodingsFile);
    encodingsData = JSON.parse(raw);
  }

  // Guardamos o actualizamos la codificación del usuario
  encodingsData[username] = JSON.parse(encoding);

  fs.writeFileSync(encodingsFile, JSON.stringify(encodingsData, null, 2));

  res.json({ message: 'Usuario registrado con éxito' });
});

// Ruta para obtener todos los encodings (para login)
router.get('/encodings', (req, res) => {
  if (!fs.existsSync(encodingsFile)) {
    return res.json([]);
  }

  const raw = fs.readFileSync(encodingsFile);
  const data = JSON.parse(raw);

  // Formato esperado: array de { username, descriptors: [array] }
  const result = Object.entries(data).map(([username, descriptor]) => ({
    username,
    descriptors: [descriptor]
  }));

  res.json(result);
});


module.exports = router;
