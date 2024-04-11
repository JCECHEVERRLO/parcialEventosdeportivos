// const moment = require('moment');

// function agregarCreatedAt(req, res, next) {
//   // Obtener la fecha y hora actual en formato YYYY-MM-DD hh:mm
//   const fechaActual = moment().format('YYYY-MM-DD hh:mm');

//   // Agregar el campo created_at al body de la solicitud
//   req.body.created_at = fechaActual;

//   // Continuar 
//   next();
// }

module.exports = agregarCreatedAt;
