const express = require('express');
const router = express.Router();
const userContoller = require('../controllers/userController');

//rutas para los usuarios
router.post('/usuarios', userContoller.agregarUsuario);  // Para agregar un nuevo usuario
router.post('/usuarios/login', userContoller.iniciarSesion);  // Para iniciar sesión
router.delete('/usuarios/:id', userContoller.eliminarUsuario);  // Para eliminar un usuario por ID
router.post('/usuarios/:id', userContoller.actualizarUsuario);  // Para actualizar un usuario por ID

module.exports = router;