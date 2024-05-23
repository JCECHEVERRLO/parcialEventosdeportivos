const express = require("express");
const Joi = require('joi');
const fs = require("fs");
const moment = require('moment');
const { leerArchivo, escribirArchivo } = require('./src/files.js');
const { validarDeporte } = require('./validations');
const path = require('path');
const app = express();
const agregarCreatedAt = require('./agregarCreatedAtmiddleware.js');

function logRequest(req, res, next) {
    const now = new Date();
    const timestamp = now.toISOString();
    const formattedTimestamp = timestamp.replace('T', ' ').split('.')[0];
    const requestMethod = req.method;
    const requestUrl = req.originalUrl;
    const queryParams = JSON.stringify(req.query);
    const requestBody = JSON.stringify(req.body);
    const clientIp = req.ip;

    const logLine = `${formattedTimestamp} [${requestMethod}] [${requestUrl}] [${queryParams}] [${requestBody}] [${clientIp}]\n`;

    fs.appendFile(path.join(__dirname, './access_log.txt'), logLine, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de registro: ', err);
        }
    });

    next();
}

app.use(express.json());
app.use(logRequest);
app.use(agregarCreatedAt);

// Rutas
app.get('/deportes', (req, res) => {
    const filtro = req.query.filtro;
    const deportes = leerArchivo('./Db.json');

    if (filtro) {
        const deportesFiltrados = deportes.filter(deporte => deporte.name.toLowerCase().includes(filtro.toLowerCase()));
        res.json(deportesFiltrados);
    } else {
        res.json(deportes);
    }
});

// Mostrar deporte por nombre
app.get('/todos/:nombre', (req, res, next) => {
    const nombre = req.params.nombre;
    const deportes = leerArchivo('./Db.json');
    const deporte = deportes.find(deporte => deporte.nombre === nombre);

    if (!deporte) {
        res.status(404).send('No se encuentra disponible');
        return;
    }

    res.json(deporte);
});

// Ruta para almacenar un nuevo deporte
app.post('/deportes', (req, res) => {
    const nuevodeporte = req.body;
    let deportes = leerArchivo('./Db.json');

    deportes.push(nuevodeporte);
    escribirArchivo('./Db.json', deportes);

    res.send({ mensaje: 'Deporte agregado correctamente', deporte: nuevodeporte });
});

// Ruta para actualizar un deporte existente
app.put('/deportes/:id', (req, res) => {
    const id = req.params.id;
    const deportes = leerArchivo('./Db.json');
    const deporte = deportes.find(deporte => deporte.id === parseInt(id));

    if (!deporte) return res.status(404).send('El deporte no existe');

    const { error } = validarDeporte(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newDeporte = { ...deporte, ...req.body };
    const index = deportes.indexOf(deporte);
    deportes[index] = newDeporte;
    escribirArchivo('./Db.json', deportes);
    res.send(newDeporte);
});

// Actualizar timestamp de todos los deportes
app.put('/deportes/update', (req, res) => {
    let deportes = leerArchivo('./Db.json');
    const fechaActual = moment().format('YYYY-MM-DD hh:mm');

    deportes.forEach(deporte => {
        if (!deporte.updated_at) {
            deporte.updated_at = fechaActual;
        }
    });

    escribirArchivo('./Db.json', deportes);
    res.send(deportes);
});

// Eliminar un deporte por ID
app.delete('/deportes/:id', (req, res) => {
    const id = req.params.id;
    const deportes = leerArchivo('./Db.json');
    const deporte = deportes.find(deporte => deporte.id === parseInt(id));

    if (!deporte) {
        res.status(404).send('No existe');
        return;
    }

    const index = deportes.indexOf(deporte);
    deportes.splice(index, 1);
    escribirArchivo('./Db.json', deportes);
    res.send(deporte);
});

// Levantando el servidor
app.listen(3000, () => {
    console.log("listening on port 3000 ...");
});