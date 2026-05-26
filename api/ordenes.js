const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
const ordenes = [];

app.post('/api/ordenes', async (req, res) => {
    const { libroId, cantidad, cliente } = req.body;

    if (!libroId || !cantidad || !cliente) {
        return res.status(400).json({ error: "Faltan datos en la petición (libroId, cantidad, cliente)." });
    }

    try {
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        const urlCatalogo = `${protocol}://${host}/api/catalogo/${libroId}`;
        
        const respuesta = await axios.get(urlCatalogo);
        const libro = respuesta.data;

        if (libro.stock < cantidad) {
            return res.status(400).json({ error: "Stock insuficiente para procesar la compra." });
        }

        const nuevaOrden = {
            idOrden: ordenes.length + 1,
            cliente,
            libro: libro.titulo,
            cantidad,
            totalAPagar: libro.precio * cantidad
        };
        
        ordenes.push(nuevaOrden);
        return res.status(201).json({ mensaje: "Orden procesada exitosamente.", orden: nuevaOrden });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: "La compra fue rechazada: El libro solicitado no existe en el catálogo." });
        }
        return res.status(500).json({ error: "Error de red con el catálogo o servicio caído." });
    }
});

module.exports = app;