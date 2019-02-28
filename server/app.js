'use-strict';
// use development environment variables as default
const result = require('dotenv').config({
    path: `${process.cwd()}/config/${((process.env.NODE_ENV === "production") ? 'prod' : 'dev')}.env`
})
if (result.error) {
    throw result.error;
}
const path = require('path');
const { Vehicle } = require('./models/vehicle.js');



// server
const Hapi = require('hapi');
const plugins = require('./plugins/serverPlugins');
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
    // this plugin will expose /docs endpoint with endpoints documentation
    // will be registered for only in development environment 
    if (process.env.NODE_ENV === "development") {

        try {
            await server.register([
                require('inert'),
                require('vision'),
                plugins.hapiSwaggered,
                plugins.hapiSwaggeredUi
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