const mongoose = require('mongoose');
const Joi = require('joi');

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

module.exports = mongoose.model('Vehicle', vehicleScheme, 'vehicles');