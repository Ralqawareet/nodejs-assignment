# Viricit Assignment [BackEnd]
Data storage API that will serve the purpose of persisting live data coming from a NATS server as well as serving the FrontEnd Side Application.

Tha API will accomplish the following : 

 - [*] Create MongoDB database
 - [*] Push data from NATS to MongoDB
 - [*] A REST API exposing endpoints for querying data
 - [*] A WebSocket API exposing an endpoint for live data

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

```
NodeJS >= 8.0
MongoDB
Docker
Nats
```

### Installing


Clone the repository 

```
git@github.com:Ralqawareet/nodejs-assignment.git
```

Enter the directory

```
cd nodejs-assignment
```
Install all the dependencies


```
npm install
```
Run NATS on a docker container

```
npm run start-nats
```

Run the broadcaster- this will emulate live data coming from vehicles and push it to NATS server
```
npm run start-broadcast
```
Start the server with development variables 
```
npm run dev-server
```

## API Documentation

Once you get the service up and running, in your browser navigate to :
```
http://localhost:8000/docs
```
There you can find a detailed documentation about the endpoints the service exposes.
## Built With

* [Hapi](https://hapijs.com/) - The web framework used
* [MongoDB](https://www.mongodb.com/) - Database 
* [NATS](https://nats.io/) - Messaging broker
