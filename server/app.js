'use-strict';
// use development enviroment variables
// unless production requested for the sake of this assignment 
const result = require('dotenv').config({
    path: `${process.cwd()}/config/${((process.env.NODE_ENV === "production") ? 'prod' : 'dev')}.env`
})
if (result.error) {
    throw result.error;
}
const path = require('path');
const { Vehicle } = require('./models/vehicle.js');



// server
const Inert = require('inert');
const Vision = require('vision');
const Hapi = require('hapi');

const server = Hapi.server({
    port: 8000,
    host: 'localhost'
});
// socket 
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server: server.listener });
wss.on('connection', function connection(ws) {
    console.log('connected to web socket');
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
});
// DB 
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (err) => {
    console.log('connection to database failed');
});
db.once('open', function () {
    console.log('Connected to Database!');
    console.log('Listening for changes on vehicles');
    Vehicle.watch([{ $match: { 'ns.db': 'vehiclesDB', 'ns.coll': 'vehicles' } }]).on('change', (data) => {
        // broadcast changes on the vehicles collection to all users
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data.fullDocument));
            }
        });
    });
});
// NATS
const NATS = require('nats');
const nats = NATS.connect({
    servers: ["nats://localhost:4222"],
    reconnect: true,
    maxReconnectAttempts: 10,
    reconnectTimeWait: 10 * 1000
});
nats.on('connect', (c) => {
    console.log('connected to nats');
    nats.subscribe('vehicle.>', async function (msg, reply, subject) {
        // console.log('Msg received on [' + subject + '] : ' + msg);
        let v = new Vehicle(JSON.parse(msg));
        v['vehicle_id'] = subject.split('.').pop();
        v.save((err) => {
            if (err) {
                console.log('Error at saving document ', err);
            }
        });
    });

});
nats.on('error', (err) => {
    throw err;
});


const init = async () => {
    // register hapi plugin for autop documentation of api for development enviroment only
    // documentaion enpoint will be available at localhost:8000/docs

    if (process.env.NODE_ENV === "development") {
        console.log('regisertin docs')
        try {
            await server.register([
                require('inert'),
                require('vision'),
                {
                    plugin: require('hapi-swaggered'),
                    options: {
                        schemes: ['http', 'ws'],
                        info: {
                            title: 'NodeJS Assignement',
                            description: '',
                            version: '1.0'
                        }
                    }
                },
                {
                    plugin: require('hapi-swaggered-ui'),
                    options: {
                        title: 'NodeJS Assignement',
                        path: '/docs',
                    }, authorization: {
                        field: 'apiKey',
                        scope: 'query', // header works as well
                        // valuePrefix: 'bearer '// prefix incase
                        defaultValue: 'demoKey',
                        placeholder: 'Enter your apiKey here'
                    }, swaggerOptions: {
                        validatorUrl: null
                    }
                }
            ])
        } catch (err) {
            throw err;
        }
    }
    // register routes
    try {
        await server.register({
            plugin: require('hapi-router'),
            options: {
                routes: `server/routes/routes.js`
            }
        });
    } catch (err) {
        console.log(err);
    }


    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();