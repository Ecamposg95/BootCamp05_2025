const db = require('../db/db');
const faceapi = require('face-api.js');

// Función de registro
exports.register = async (req, res) => {
    try {
        const { username, descriptor } = req.body;
        
        // Verificar si el usuario ya existe
        const userExists = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });
        
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                error: 'El nombre de usuario ya está registrado' 
            });
        }
        
        // Insertar nuevo usuario
        await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (username, facial_descriptor) VALUES (?, ?)',
                [username, JSON.stringify(descriptor)],
                (err) => err ? reject(err) : resolve()
            );
        });
        
        res.json({ 
            success: true, 
            message: 'Usuario registrado exitosamente',
            username
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Función de login (tu versión corregida)
exports.login = async (req, res) => {
    try {
        const { username, descriptor } = req.body;
        
        // Obtener usuario de la base de datos
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                error: 'Usuario no encontrado' 
            });
        }
        
        // Comparar descriptores faciales
        const savedDescriptor = JSON.parse(user.facial_descriptor);
        const distance = faceapi.euclideanDistance(descriptor, savedDescriptor);
        
        if (distance < 0.6) {
            res.json({ 
                success: true, 
                message: 'Autenticación exitosa',
                username: user.username
            });
        } else {
            res.json({ 
                success: false, 
                error: 'Rostro no coincide' 
            });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};