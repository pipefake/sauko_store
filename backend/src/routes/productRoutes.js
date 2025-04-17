const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require("../middleware/multer");
const { verifyToken, verifyAuthorization } = require('../middleware/auth');

//rutas para los productos
router.post('/producto', upload.single('image'), verifyToken, verifyAuthorization, productController.agregarProducto);  // Para agregar un nuevo producto
router.post('/actualizarproducto', upload.single('image'), verifyToken, verifyAuthorization, productController.actualizarProducto);  // Para agregar un nuevo producto
router.get('/categorias', productController.listarCategorias);  // Para listar todas las categorías
router.get('/productos', productController.listarProductos);  // Para listar todos los productos
router.get('/productos_admin', verifyToken, verifyAuthorization, productController.listarProductosAdmin);  // Para listar todos los productos
// router.get('/producto/:id', productController.listarProductoPorId);  // Para listar un producto por ID
router.put('/producto/:id', productController.actualizarEstado);  // Para actualizar el estado de un producto por ID
router.delete('/producto/:id', verifyToken, verifyAuthorization, productController.eliminarProducto);  // Para eliminar un producto por ID
// router.post('/producto/:id', productController.actualizarUsuario);  // Para actualizar un producto por ID
// router.get('/productos/:categoria', productController.listarProductosPorCategoria);  // Para listar productos por categoría

module.exports = router;