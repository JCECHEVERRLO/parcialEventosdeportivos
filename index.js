const express = require("express");
const Joi = require('joi');
const fs = require("fs");
const moment = require('moment');
const {leerArchivo, escribirArchivo} = require('./src/files.js');
 const { validarDeporte } = require('./validations'); 
 const logRequest = require('./access.log');

const app = express()


function addCreatedAt(req, res, next) {
  const fechaActual = moment().format('YYYY-MM-DD hh:mm');
  req.body.created_at = fechaActual;
  next();
}



app.use(express.json())



// app.use((req, res,next) => {
//   console.log('middleaWARE DE APP');
//   console.log(req.method, req.url)
//   next();
  
// })

// rutas

// // index original 
//  app.get('/deportes', (req, res) => {
//         // leer archivo 
//         const deportes = leerArchivo('./Db.json');
//        res.send(deportes)
//       })

  
app.get('/deportes',  (req, res) => {
  logRequest(req);
  const filtro = req.query.filtro;
  const deportes = readFile('./Db.json');

  if (filtro) {
      const deportesFiltrados = deportes.filter(deporte => deporte.name.toLowerCase().includes(filtro.toLowerCase()));
      res.render('deñortes/index', { deportes: deportesFiltrados });
  } else {
      res.render('deportes/index', { deportes: deportes });
  }
});

// show
app.get('/deportes/:id', // primer parametro 
(req, res,next) => {// segundo parametro 
//   console.log('middelaware a nivel de ruta ')
  next();

  
},


(req, res) => {
  const id = req.params.id
  const deportes = leerArchivo('./Db.json') 
  const deporte = deportes.find(deporte=>deporte.id === parseInt(id))

  // no existe 
  if (! deporte ==undefined){
    res.status(404).send('no existe')
    return
  }

  // existe 

  res.send(deporte)
  console.log('hola')
})

// Ruta para almacenar un nuevo deporte punto uno parcial 
// store ruta original
// Ruta para almacenar un nuevo deporte
app.post('/deportes',  addCreatedAt,(req, res) => {
  logRequest(req);
  // Validar los datos recibidos en la solicitud utilizando la función importada
  const { error } = validarDeporte(req.body);
  if (error) return res.status(400).send(error.details[0].message); // Devolver el mensaje de error si la validación falla

  const deporte = req.body;
  const deportes = leerArchivo('./Db.json');
  deporte.id = deportes.length + 1;
  deportes.push(deporte);
  escribirArchivo('./Db.json', deportes);
  res.status(201).send(deporte);
});

// Ruta para actualizar un deporte existente
app.put('/deportes/:id', addCreatedAt, (req, res) => {
  logRequest(req);
  const id = req.params.id;
  const deportes = leerArchivo('./Db.json');
  const deporte = deportes.find(deporte => deporte.id === parseInt(id));

  if (!deporte) return res.status(404).send('El deporte no existe');

  // Validar los datos recibidos 
  const { error } = validarDeporte(req.body);
  if (error) return res.status(400).send(error.details[0].message); 

  const newDeporte = { ...deporte, ...req.body };
  const index = deportes.indexOf(deporte);
  deportes[index] = newDeporte;
  escribirArchivo('./Db.json', deportes);
  res.send(newDeporte);
});

// put update parcial 
app.put('/deportes/update',(req, res) => {
  logRequest(req);
  
  let deportes = leerArchivo('./Db.json');

  const fechaActual = moment().format('YYYY-MM-DD hh:mm');

  // Recorrer todos los registros 
  deportes.forEach(deporte => {
    if (!deporte.updated_at) {
      deporte.updated_at = fechaActual;
    }
  });
  

  // Escribir los registros actualizados en el archivo JSON
  escribirArchivo('./Db.json', deportes);

  res.send(deportes); // Enviar la respuesta con los registros actualizados
});
// destroy
app.delete('/deportes/:id', (req, res) => {
  logRequest(req);
  const id = req.params.id
  const deportes = leerArchivo('./Db.json')
  const deporte=deportes.find(deporte =>deporte.id === parseInt(id))  

   // no existe 
   if (! deporte) {
    res.status(404).send('no existe')
    return
  }

    // existe actualizamos 
    const index = deportes.indexOf(deporte)
    deportes.splice(index,1)

    //escribimos en el archivo 
    escribirArchivo('./Db.json',deportes) //
    res.send(deporte)
    
})
// levantando el servido r para escuchar 
app.listen(3000,() => {
    console.log("listening on port 3000 ...");
})