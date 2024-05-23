 const moment = require('moment');

 function agregarCreatedAt(req, res, next) {
// // //   // Obtener la fecha y hora actual en formato YYYY-MM-DD hh:mm
 const currentDateTime = moment().format('YYYY-MM-DD hh:mm');

// // //   // Agregar el campo created_at al body de la solicitud
   // Agregar el campo created_at al cuerpo de la solicitud si aún no existe
   if (!req.body.created_at) {
    req.body.created_at = currentDateTime;
}
  

// // //   // Continuar 
   next();
 }

module.exports = agregarCreatedAt;
