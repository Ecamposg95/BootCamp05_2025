const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta de registro
router.post('/register', userController.register);

// Ruta de login
router.post('/login', userController.login);

module.exports = router;