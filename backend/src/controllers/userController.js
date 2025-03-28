const pool = require("./db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const res = require("express/lib/response");

// Agregar nuevo usuario
const agregarUsuario = async (req, res) => {

    const {
        name,
        last_name,
        email,
        password,
        cedula,
        phone_number,
        image,
        id_rol
    } = req.body;

    // Verificar que los campos esenciales están presentes
    if (!name || !cedula || !password || !email || !phone_number) {
        return res.status(400).json({ mensaje: 'Nombre, Cédula, Correo, Número y Contraseña son requeridos' });
    }

    // Validar el formato del correo si se proporciona
    if (email && !validator.isEmail(email)) {
        return res.status(400).json({ mensaje: 'Correo Incorrecto' });
    }

    // Generar el hash de la contraseña
    const hash = await bcrypt.hash(password, 10);

    try {

        // Verificar si el correo ya existe en la base de datos (si el email es proporcionado)
        if (email) {
            const existeCorreo = await pool.query('SELECT * FROM public.usuarios WHERE email = $1', [email]);
            if (existeCorreo.rows.length > 0) {
                return res.status(400).json({ mensaje: 'Correo ya existe' });
            }
        }

        // Insertar el nuevo usuario en la base de datos
        const result = await pool.query(
            `INSERT INTO public.usuarios (
                name, 
                last_name, 
                email,  
                cedula,
                password,
                phone_number, 
                image,
                id_rol) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_usuario`,
            [name,
                last_name,
                email,
                cedula,
                hash,
                phone_number,
                image,
                id_rol
            ]
        );
        const usuario = result.rows[0];

        // // Crear un token JWT para el nuevo usuario
        // const token = jwt.sign({ id: usuario.id_usuario, email: email }, process.env.JWT_SECRET, { expiresIn: '12h' });

        // Enviar la respuesta con los detalles del nuevo usuario
        res.status(201).json({
            mensaje: 'Registro exitoso',
        });

        // name,
        // token
    } catch (err) {
        console.error('Error al registrar usuario:', err.message);
        res.status(500).json({ mensaje: 'Error al registrar usuario', error: err.message });
    }
};

// Inicio de sesión
const iniciarSesion = async (req, res) => {
    const { email, password } = req.body;

    // Verificar que el correo y la contraseña están presentes
    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
    }

    // Validar el formato del correo
    if (!validator.isEmail(email)) {
        return res.status(400).json({ mensaje: 'Correo Incorrecto' });
    }

    try {
        // Buscar el usuario por correo
        const result = await pool.query(
            `SELECT
                u.id_usuario,
                u.name,
                u.email,
                u.password,
                u.cedula 
            FROM
                usuarios u
            WHERE
                u.email IN ($1)`, [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ mensaje: 'Correo Incorrecto' });
        }
        
        const usuario = result.rows[0];

        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const passwordCorrecta = await bcrypt.compare(password, usuario.password);
        if (passwordCorrecta) {

            // Crear un token JWT para el usuario
            const token = jwt.sign({
                id: usuario.id_usuario,
                cedula: usuario.cedula,
                nombre: usuario.nombre,
                email: usuario.email,
                sede: usuario.sede,
                departamento: usuario.departamento
            }, process.env.JWT_SECRET, { expiresIn: '2h' });

            // Enviar la respuesta con el token y los detalles del usuario
            res.json({
                mensaje: 'Bienvenido',
                id: usuario.id,
                nombre: usuario.nombre,
                token,
                email: usuario.email
            });
        } else {
            res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }
    } catch (err) {
        console.error('Error al iniciar sesión:', err.message);
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error: err.message });
    }
}
// Eliminar usuario
const eliminarUsuario = async (req, res) => {
    const { id } = req.params;

    // Verificar que el identificador está presente
    if (!id) {
        return res.status(400).json({ mensaje: 'ID del usuario es requerido' });
    }

    try {
        // Eliminar el usuario de la base de datos
        const result = await pool.query('DELETE FROM public.usuarios WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Enviar respuesta de éxito
        res.json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar usuario:', err.message);
        res.status(500).json({ mensaje: 'Error al eliminar usuario', error: err.message });
    }
}
// Actualizar usuario
const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, rol, cedula, email, id_sede, id_departamento, password } = req.body;

    // Verificar que el identificador está presente
    if (!id) {
        return res.status(400).json({ mensaje: 'ID del usuario es requerido' });
    }

    // Verificar que todos los campos estén presentes
    if (!nombre || !cedula || !email || !id_sede || !id_departamento || !password) {
        return res.status(400).json({ mensaje: 'Todos los campos (nombre, rol, cédula, correo, sede, departamento, contraseña) son requeridos para actualizar' });
    }

    // Validar el formato del correo
    if (!validator.isEmail(email)) {
        return res.status(400).json({ mensaje: 'Correo Incorrecto' });
    }

    try {
        // Generar el hash de la nueva contraseña
        const hash = await bcrypt.hash(password, 10);

        // Preparar los valores para la actualización
        const values = [nombre, rol, cedula, email, id_sede, id_departamento, hash, id];

        // Consulta de actualización
        const query = `
            UPDATE public.usuarios
            SET nombre = $1,
                rol = $2,
                cedula = $3,
                email = $4,
                id_sede = $5,
                id_departamento = $6,
                password = $7
            WHERE id_usuario = $8
        `;

        // Ejecutar la consulta de actualización
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Enviar respuesta de éxito
        res.json({ mensaje: 'Usuario actualizado exitosamente' });
    } catch (err) {
        console.error('Error al actualizar usuario:', err.message);
        res.status(500).json({ mensaje: 'Error al actualizar usuario', error: err.message });
    }
}

module.exports = {
    iniciarSesion,
    agregarUsuario,
    eliminarUsuario,
    actualizarUsuario
};