const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');


const vehicleValidation = {
    query: Joi.object({
        from: Joi.number()
            .default(moment().subtract(30, 'minutes').unix())
            .optional().description('get documents from this timestamp'),
        to: Joi.number()
            .default(moment().unix())
            .optional().description('get documents up to this timestamp')
    }),
    payload: Joi.object({
        vehicle_id: Joi.string().required(),
        time: Joi.number().required(),
        energy: Joi.number().required(),
        speed: Joi.number().required(),
        gps: Joi.array().required(),
        soc: Joi.string().required(),
        odo: Joi.number().required()
    }),
    param: Joi.string()
        .required()
        .description('the id of the vehicle')
};
const numberValidation = {
    validator: function (v) {
        return (typeof v === "number") || (v === null);
    },
    message: function (props) {
        return `${props.path} must a number or null, got '${props.value}'`;
    }
};
// mongodb vehicle scheme
const Schema = mongoose.Schema;
const vehicleScheme = new Schema({
    vehicle_id: { type: String, required: true },
    // setup timestamp to now as default 
    time: { type: Number, default: moment().unix() },
    energy: {
        type: Number,
        validate: numberValidation
    },
    speed: {
        type: Number,
        validate: numberValidation
    },
    gps: { type: Array, required: true },
    soc: { type: String, required: true },
    odo: {
        type: Number,
        validate: numberValidation
    },
}, { autoIndex: false });

module.exports = {
    vehicleValidation,
    Vehicle: mongoose.model('Vehicle', vehicleScheme, 'vehicles')
};