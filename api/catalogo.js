const express = require('express');
const app = express();

const libros = [
    { id: 1, titulo: "Clean Code", autor: "Robert C. Martin", precio: 450.00, stock: 10 },
    { id: 2, titulo: "Patrones de Diseño", autor: "Erich Gamma", precio: 600.00, stock: 5 },
    { id: 3, titulo: "El Programador Pragmático", autor: "Andrew Hunt", precio: 550.00, stock: 2 },
    { id: 4, titulo: "Arquitectura Limpia", autor: "Robert C. Martin", precio: 500.00, stock: 0 },
    { id: 5, titulo: "Introducción a Node.js", autor: "Ryan Dahl", precio: 300.00, stock: 15 }
];

app.get('/api/catalogo/:id', (req, res) => {
    const libroId = parseInt(req.params.id);
    const libro = libros.find(l => l.id === libroId);

    if (!libro) {
        return res.status(404).json({ error: "Libro no encontrado en el catálogo." });
    }
    return res.status(200).json(libro);
});

// En lugar de app.listen(), exportamos la app para Vercel
module.exports = app;