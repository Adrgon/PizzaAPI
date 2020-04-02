/*
+ Primary file for Pizza Delivery API
*
*/

//Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');

//Declare the app
var app = {};

//Init
app.init = ()=>{

	//Start the server
	server.init();
	
	//Start the workers
	workers.init();
};

//Execute 
app.init();

//Export the app
module.exports = app;