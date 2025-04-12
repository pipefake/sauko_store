const pool = require("./db");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");
const cloudinary = require("../utils/cloudinary");
const { log } = require("console");

// Agregar nuevo usuario
const agregarProducto = async (req, res) => {

    const {
        nombre,
        descripcion,
        marca,
        precio
    } = req.body;

    //imagen
    const file = req.file;

    // Verificar que el archivo de imagen esté presente
    if (!file) {
        return res.status(400).json({ error: 'Falta la imagen' });
    }



    // Verificar que los campos esenciales están presentes
    if (!nombre || !descripcion || !marca || !precio) {
        return res.status(400).json({ mensaje: 'Nombre, descripcion, marca y precio son requeridos' });
    }
    // Verificar que el precio es un número
    if (isNaN(precio)) {
        return res.status(400).json({ mensaje: 'El precio debe ser un número' });
    }
    // Verificar que el precio es positivo
    if (precio <= 0) {
        return res.status(400).json({ mensaje: 'El precio debe ser positivo' });
    }
    // Verificar que el archivo es una imagen
    const fileType = file.mimetype.split('/')[0];
    if (fileType !== 'image') {
        return res.status(400).json({ mensaje: 'El archivo debe ser una imagen' });
    }



    try {

        // Verificar si el correo ya existe en la base de datos (si el email es proporcionado)
        try {
            // Subir la imagen a Cloudinary
            const resultIMG = await uploadToCloudinary(file.buffer);

            console.log("si se subio la imagen a cloudinary", resultIMG.secure_url);

            const result = await pool.query(`
            INSERT INTO 
                public.detalle_producto
                (
                nombre,
                descripcion,
                marca,
                precio,
                image
                )
            VALUES(
                $1, $2, $3, $4, $5) RETURNING id_producto`,
                [nombre,
                    descripcion,
                    marca,
                    precio,
                    resultIMG.secure_url
                ]);
            // Enviar la respuesta con los detalles del nuevo producto
            res.status(201).json({
                mensaje: 'Registro de producto exitoso',
                result
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ mensaje: 'Error al insertar el producto' });
        }

    } catch (err) {
        console.error('Error al registrar producto:', err.message);
        res.status(500).json({ mensaje: 'Error al registrar producto', error: err.message });
    }
};

//Listar todos los productos
const listarProductos = async (req, res) => {
    try {
        // Realiza la consulta SQL para obtener todos los productos
        const productos = await pool.query(`
        SELECT * FROM public.detalle_producto`);
        // Enviar la respuesta con la lista de productos
        res.status(200).json(productos.rows);

    } catch (error) {
        console.error('Error al listar productos:', error.message);
        res.status(500).json({ mensaje: 'Error al listar productos', error: error.message });
    }
}

// Eliminar un producto por ID
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        // Verificar que el ID sea un número válido
        if (isNaN(id)) {
            return res.status(400).json({ mensaje: 'ID inválido' });
        }
        // Realizar la consulta SQL para eliminar el producto
        const result = await pool.query(`
        DELETE FROM public.detalle_producto WHERE id_producto = $1`, [id]);
        // Verificar si se eliminó algún producto
        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        // Enviar la respuesta de éxito 
        res.status(200).json({ mensaje: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error.message);
        res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
    }
}

module.exports = {
    agregarProducto,
    listarProductos,
    eliminarProducto
};