const mongoose = require('mongoose');
const Joi = require('joi');


// Joi validation for vehicle 
const Vehicle_validate = Joi.object({
    vehicle_id: Joi.string().required(),
    time: Joi.number().required(),
    energy: Joi.number().required(),
    speed: Joi.number().required(),
    gps: Joi.array().required(),
    soc: Joi.string().required(),
    odo: Joi.number().required()
})
// mongodb vehicle scheme
const Schema = mongoose.Schema;
const vehicleScheme = new Schema({
    vehicle_id: { type: String, required: true },
    time: { type: Number, required: true },
    energy: {
        type: Number,
        validate: {
            validator: function (v) {
                return (typeof v === "number") || (v === null);
            },
            message: function (props) {
                return `${props.path} must a number or null, got '${props.value}'`;
            }
        }
    },
    speed: {
        type: Number,
        validate: {
            validator: function (v) {
                return (typeof v === "number") || (v === null);
            },

            message: function (props) {
                return `${props.path} must a number or null, got '${props.value}'`;
            }
        }
    },
    gps: { type: Array, required: true },
    soc: { type: String, required: true },
    odo: {
        type: Number,
        validate: {
            validator: function (v) {
                return (typeof v === "number") || (v === null);
            },
            message: function (props) {
                return `${props.path} must a number or null, got '${props.value}'`;
            }
        }
    },
}, { autoIndex: false });

module.exports = {
    Vehicle_validate,
    Vehicle: mongoose.model('Vehicle', vehicleScheme, 'vehicles')
};