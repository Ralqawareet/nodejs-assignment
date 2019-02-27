const Joi = require('joi');
const Vehicle = require('../models/vehicle.js');
const moment = require('moment');
// console.log(Vehicle, "SS");

module.exports = [{
    method: 'GET',
    path: '/',
    options: {
        description: 'returns index page of app',
        notes: 'landing page',
        tags: ['api', 'http'],

        handler: (req, h) => {
            return h.file(`${process.cwd()}/dist/index.html`);
        },
    },
}, {
    method: 'GET',
    path: '/vehicles',
    options: {
        description: 'Get all vehicle\'s data',
        notes: 'Returns documents about all vehicles state',
        tags: ['api', 'http'],
        validate: {
            query: {
                from: Joi.number().default(moment().subtract(30, 'minutes').unix()).optional().description('get documents from this timestamp'),
                to: Joi.number().default(moment().unix()).optional().description('get documents up to this timestamp')
            }
        },
        handler: (req, h) => {
            return Vehicle.find({
                time: { $gte: req.query.from, $lte: req.query.to }
            }, (err, docs) => {
                if (err) {
                    return err;
                }
                return docs

            });
        },
    },
}, {
    method: 'GET',
    path: '/vehicles/{vehicle_id}',
    options: {
        description: 'Get vehicle\'s data',
        notes: 'Returns documents about a vehicle state over time',
        tags: ['api', 'http'],
        validate: {
            params: {
                vehicle_id: Joi.string()
                    .required()
                    .description('the id of the vehicle'),
            },
            query: {
                from: Joi.number().default(moment().subtract(30, 'minutes').unix()).optional().description('get documents starting from this timestamp'),
                to: Joi.number().default(moment().unix()).optional().description('get documents up to this timestamp')
            }
        },
        handler: (req, h) => {
            // console.log(typeofreq.query.from);
            return Vehicle.find({
                vehicle_id: req.params.vehicle_id,
                time: { $gte: req.query.from, $lte: req.query.to }
            }, (err, docs) => {
                if (err) {
                    console.log(err, "err");
                    return err;
                }
                // console.log(docs);
                return docs

            });
        },
    },
}]