# ViriCiti Assignment [FrontEnd]
This folder holds the VueJS Application source code for the client side.

The application has 4 widgets monitoring the state of a vehicle in real time based on live data coming from the BackEnd side that the application subscribes to over a websocket connection.



To view the application the following scripts can be used : 

```
npm run dev
```
will start webpack development server and run the application in development mode.<br>
You can view the application at http://localhost:8080.

```
npm run build
```
will build the application for production environment


## The Application

### Map Widget : 
tracks the vehicle current GPS coordinations
### Speed Widget : 
shows the current speed of a vehicle
### State of Charge Widget: 
shows the state of the charging point in a vehicle
### Speed Chart: 
shows the speed of a vehicle over time 
### State of charge Chart: 
shows the state of a charging point of a vehicle over time 


