const fs = require('fs');
const path = require('path');
const moment = require('moment');

const logFileName = 'access_log.txt';

// Función para registrar la solicitud
function logRequest(req) {
  const now = moment().format('DD MM YYYY hh:mm:ss');
  const requestMethod = req.method;
  const requestRoute = req.originalUrl;
  const queryParams = JSON.stringify(req.query);
  const body = JSON.stringify(req.body);
  const ip = req.ip;
  const logLine = `${now} [${requestMethod}] ${requestRoute} ${queryParams} ${body} ${ip}\n`;

  // Escribe la línea de registro en el archivo
  fs.appendFile(path.join(__dirname, logFileName), logLine, (err) => {
    if (err) {
      console.error('Error al registrar la solicitud: ', err);
    }
  });
}

module.exports = logRequest;