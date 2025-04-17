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
        precio,
        categorias
    } = req.body;

    //imagen
    const file = req.file;

    // Verificar que el archivo de imagen esté presente
    if (!file) {
        return res.status(400).json({ error: 'Falta la imagen' });
    }

    // Verificar que los campos esenciales están presentes
    if (!nombre || !descripcion || !marca || !precio || !categorias) {
        return res.status(400).json({ mensaje: 'Nombre, descripcion, marca, categoría y precio son requeridos' });
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
    //verificar que la categoría es un número
    if (isNaN(categorias)) {
        return res.status(400).json({ mensaje: 'La categoria debe ser un número' });
    }
    const consultarCategoria = await pool.query(`
        SELECT id_categoria FROM public.categoria WHERE id_categoria = $1`, [categorias]);
    // Verificar si la categoria existe
    if (consultarCategoria.rowCount === 0) {
        return res.status(404).json({ mensaje: 'Categoria no encontrada' });
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
                image,
                categorias
                )
            VALUES(
                $1, $2, $3, $4, $5, $6) RETURNING id_producto`,
                [nombre,
                    descripcion,
                    marca,
                    precio,
                    resultIMG.secure_url,
                    categorias
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
        SELECT 
        dp.nombre, 
        dp.descripcion,
        dp.marca,
        dp.precio,
        dp.id_estado,
        c.nombre as categorias,
        dp.id_producto,
        dp.image 
        FROM public.detalle_producto dp
        inner join public.categoria c on c.id_categoria = dp.categorias 
        where dp.id_estado = true
        order by id_producto desc`);
        // Enviar la respuesta con la lista de productos
        res.status(200).json(productos.rows);

    } catch (error) {
        console.error('Error al listar productos:', error.message);
        res.status(500).json({ mensaje: 'Error al listar productos', error: error.message });
    }
}

const listarProductosAdmin = async (req, res) => {
    try {
        // Realiza la consulta SQL para obtener todos los productos
        const productos = await pool.query(`
        SELECT 
        dp.nombre, 
        dp.descripcion,
        dp.marca,
        dp.precio,
        dp.id_estado,
        c.nombre as categorias,
        dp.id_producto,
        dp.image 
        FROM public.detalle_producto dp
        inner join public.categoria c on c.id_categoria = dp.categorias 
       order by id_producto desc`);
        // Enviar la respuesta con la lista de productos
        res.status(200).json(productos.rows);

    } catch (error) {
        console.error('Error al listar productos:', error.message);
        res.status(500).json({ mensaje: 'Error al listar productos', error: error.message });
    }
}

// Listar todas las categorias
const listarCategorias = async (req, res) => {
    try {
        const categorias = await pool.query(`
            select id_categoria, nombre from public.categoria order by id_categoria desc`);
        // Verificar si se encontraron categorías
        if (categorias.rowCount === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron categorías' });
        }
        // Enviar la respuesta con la lista de categorias   
        res.status(200).json(categorias.rows);
    } catch (error) {
        console.error('Error al listar categorias:', error.message);
        res.status(500).json({ mensaje: 'Error al listar categorias', error: error.message });
    }
}

//Actualizar el estado de un producto por el ID
const actualizarEstado = async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(`
    UPDATE public.detalle_producto
    SET id_estado = not id_estado
    WHERE id_producto = $1`, [id]);

    // Verificar si se actualizó algún producto
    if (result.rowCount === 0) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    // Enviar la respuesta de éxito
    res.status(200).json({ mensaje: 'Estado del producto actualizado exitosamente' });
}

// Actualizar un producto por ID
const actualizarProducto = async (req, res) => {
    const { nombre,
        descripcion,
        marca,
        precio,
        categorias,
        id_producto } = req.body;

    // Verificar que los campos esenciales están presentes
    if (!nombre || !descripcion || !marca || !precio || !id_producto || !categorias) {
        return res.status(400).json({ mensaje: 'Los datos están incompletos' });
    }
    //imagen
    const file = req.file;

    if (isNaN(categorias)) {
        return res.status(400).json({ mensaje: 'La categoria debe ser un número' });
    }
    if (categorias == "" || categorias == null || categorias == undefined) {
        return res.status(400).json({ mensaje: 'La categoria es requerida' });
    }
    const consultarCategoria = await pool.query(`
        SELECT id_categoria FROM public.categoria WHERE id_categoria = $1`, [categorias]);
    // Verificar si la categoria existe
    if (consultarCategoria.rowCount === 0) {
        return res.status(404).json({ mensaje: 'Categoria no encontrada' });
    }
    try {
        try {
            // Verificar que el archivo de imagen esté presente
            if (!file || file.length === 0) {

                const result = await pool.query(`
                    UPDATE public.detalle_producto
                    SET 
                    marca=$1, 
                    nombre=$2, 
                    descripcion=$3, 
                    precio=$4, 
                    created_at=now(), 
                    categorias=$5
                    WHERE id_producto=$6`, [
                    marca,
                    nombre,
                    descripcion,
                    precio,
                    categorias,
                    id_producto]);
                // Enviar la respuesta con los detalles del nuevo producto
                if (result.rowCount === 0) {
                    return res.status(404).json({ mensaje: 'Producto no encontrado' });
                }
                res.status(201).json({
                    mensaje: 'Actualización exitoso de producto',
                    result
                });
            } else {
                // Subir la imagen a Cloudinary
                const resultIMG = await uploadToCloudinary(file.buffer);

                console.log("sii se subio la imagen a cloudinary", resultIMG.secure_url);
                const result = await pool.query(`
            UPDATE public.detalle_producto
            SET 
            marca=$1, 
            nombre=$2, 
            descripcion=$3, 
            precio=$4, 
            created_at=now(), 
            image=$5,
            categorias=$6
            WHERE id_producto=$7`, [
                    marca,
                    nombre,
                    descripcion,
                    precio,
                    resultIMG.secure_url,
                    categorias,
                    id_producto]);
                // Enviar la respuesta con los detalles del nuevo producto
                if (result.rowCount === 0) {
                    return res.status(404).json({ mensaje: 'Producto no encontrado' });
                }
                res.status(201).json({
                    mensaje: 'Actualización exitoso de producto',
                    result
                });
            }



        } catch (error) {
            console.log(error);
            return res.status(400).json({ mensaje: `Error al actualizar el producto ${error}` });
        }

    } catch (err) {
        console.error('Error al actualizar producto:', err.message);
        res.status(500).json({ mensaje: 'Error al actualizar producto', error: err.message });
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
    eliminarProducto,
    actualizarEstado,
    listarCategorias,
    actualizarProducto,
    listarProductosAdmin
};