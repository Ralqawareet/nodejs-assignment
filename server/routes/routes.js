const Joi = require('joi');
const { Vehicle, Vehicle_validate } = require('../models/vehicle.js');
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
            }).then(docs => {
                return docs;
            }).catch(err => {
                return err;
            })
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
    }
}, {
    method: 'POST',
    path: '/vehicles/{vehicle_id}',
    options: {
        description: 'createa a new vehicle\'s document',
        notes: 'Returns the document newly created',
        tags: ['api', 'http'],
        validate: {
            params: {
                vehicle_id: Joi.string()
                    .required()
                    .description('the id of the vehicle'),
            },
            payload: Vehicle_validate
        },
        handler: (req, h) => {
            console.log(req.params);
            // console.log('Msg received on [' + subject + '] : ' + msg);
            let vehicle = new Vehicle(req.payload);
            vehicle['vehicle_id'] = req.params.vehicle_id;
            return vehicle.save().then(doc => {
                return doc;
            }).catch(err => {
                return err;
            });
        },
    }
}]