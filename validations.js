const Joi = require('joi');

function validarDeporte(deporte) {
    const schema = Joi.object({
        code: Joi.string().required(),
        name: Joi.string().min(3).max(50).required(), // Cambiado de "nombre" a "name"
        descripcion: Joi.string().required(),
        "numero canchas": Joi.number().integer().min(0).required(),
        "cantidad equipos": Joi.number().integer().min(0).required()
    });

    return schema.validate(deporte);
}

module.exports = {
    validarDeporte
};