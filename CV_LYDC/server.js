const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, '../static')));

// Variable global para guardar el nombre del usuario registrado
let registeredName = "";

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../templates/index.html'));
});

// Configuración de Multer (para registro)
const registerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../static/js/uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, 'login_face.jpg');
  }
});
const registerUpload = multer({ storage: registerStorage });

// Ruta para registro
app.post('/register', registerUpload.single('photo'), (req, res) => {
  registeredName = req.body.name || "Usuario";
  console.log('Nombre:', registeredName);
  console.log('Imagen guardada en:', req.file.path);
  res.redirect('/success');
});

// Página de éxito de registro
app.get('/success', (req, res) => {
  res.send('<h1>Registro exitoso</h1><a href="/">Volver</a>');
});

// Configuración de Multer (para login, opcionalmente diferente)
const loginUpload = multer({ storage: registerStorage });

// Ruta para login
app.post('/login', loginUpload.single('face'), (req, res) => {
  // Aquí normalmente iría la lógica de reconocimiento facial
  res.redirect(`/welcome?name=${encodeURIComponent(registeredName)}`);
});

// Página de bienvenida después de login
app.get('/welcome', (req, res) => {
  const name = req.query.name || "Usuario";
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Bienvenido</title>
        <style>
          body { 
            font-family: sans-serif; 
            text-align: center; 
            padding-top: 100px; 
            background-color: #f0f4f8;
          }
          h1 { color: #0f62fe; }
        </style>
      </head>
      <body>
        <h1>Bienvenido, ${name}</h1>
        <a href="/" style="color: #0f62fe;">Volver al inicio</a>
      </body>
    </html>
  `);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Node.js corriendo en http://localhost:${PORT}`);
});

