const Joi = require('joi');
const { Vehicle, vehicleValidation, VehicleQueryValidate } = require('../models/vehicle.js');

module.exports = [{
    method: 'GET',
    path: '/',
    options: {
        description: 'returns index page of app',
        notes: 'landing page',
        tags: ['api', 'http'],

        handler: (req, h) => {
            return h.file(`${process.cwd()}/dist/index.html`)
                .charset('text/html')
                .code(200)
                .message('success');
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
            query: vehicleValidation.query
        },
        handler: (req, h) => {
            return Vehicle.find({
                time: { $gte: req.query.from, $lte: req.query.to }
            }).then(docs => {
                return h.response(docs)
                    .charset('application/json')
                    .code(200)
                    .message('success');
            }).catch(err => {
                console.log(err);
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
            params: vehicleValidation.param,
            query: vehicleValidation.query
        },
        handler: (req, h) => {
            return Vehicle.find({
                vehicle_id: req.params.vehicle_id,
                time: { $gte: req.query.from, $lte: req.query.to }
            }, (err, docs) => {
                if (err) {
                    console.log(err, "err");
                    return err;
                }
                // console.log(docs);
                return h.response(docs)
                    .charset('application/json')
                    .code(200)
                    .message('success');

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
            params: vehicleValidation.param,
            payload: vehicleValidation.payload
        },
        handler: (req, h) => {
            let vehicle = new Vehicle(req.payload);
            vehicle['vehicle_id'] = req.params.vehicle_id;
            return vehicle.save().then(doc => {
                return h.response(doc)
                    .charset('application/json')
                    .code(201)
                    .message('success');
            }).catch(err => {
                console.log(err);
                return err;
            });
        },
    }
}]