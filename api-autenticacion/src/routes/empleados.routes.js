const express = require('express');
const router = express.Router();
const { createPool } = require('../config/database');
const pool = createPool();

// Obtener todos los empleados
router.get('/', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [empleados] = await connection.query('SELECT id_Empleado, nombreCompleto, nombreUsuario, numeroDocumento, correoElectronico, tipoUsuario, telefono FROM empleado');
            res.json({ empleados });
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            res.status(500).json({ error: 'Error al obtener la lista de empleados' });
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de conexión con la base de datos' });
    }
});

// Obtener un empleado por ID
router.get('/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [empleados] = await connection.query(
                'SELECT id_Empleado, nombreCompleto, nombreUsuario, numeroDocumento, correoElectronico, tipoUsuario, telefono FROM empleado WHERE id_Empleado = ?',
                [req.params.id]
            );
            
            if (empleados.length === 0) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }
            
            res.json({ empleado: empleados[0] });
        } catch (error) {
            console.error('Error al obtener empleado:', error);
            res.status(500).json({ error: 'Error al obtener el empleado' });
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de conexión con la base de datos' });
    }
});

// Actualizar un empleado
router.put('/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        try {
            const { nombreCompleto, nombreUsuario, numeroDocumento, correoElectronico, tipoUsuario, telefono } = req.body;
            
            const [result] = await connection.query(
                `UPDATE empleado SET 
                    nombreCompleto = COALESCE(?, nombreCompleto),
                    nombreUsuario = COALESCE(?, nombreUsuario),
                    numeroDocumento = COALESCE(?, numeroDocumento),
                    correoElectronico = COALESCE(?, correoElectronico),
                    tipoUsuario = COALESCE(?, tipoUsuario),
                    telefono = COALESCE(?, telefono)
                WHERE id_Empleado = ?`,
                [nombreCompleto, nombreUsuario, numeroDocumento, correoElectronico, tipoUsuario, telefono, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }

            res.json({ mensaje: 'Empleado actualizado exitosamente' });
        } catch (error) {
            console.error('Error al actualizar empleado:', error);
            res.status(500).json({ error: 'Error al actualizar el empleado' });
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de conexión con la base de datos' });
    }
});

// Eliminar un empleado
router.delete('/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                'DELETE FROM empleado WHERE id_Empleado = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }

            res.json({ mensaje: 'Empleado eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            res.status(500).json({ error: 'Error al eliminar el empleado' });
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de conexión con la base de datos' });
    }
});

module.exports = router; 