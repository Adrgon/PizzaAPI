/*
* Server-related tasks
*
*/

//Dependencies
const http = require('http');
const https = require('https'); 
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');

// Instantiate the server module object
const server = {};

//Instantiate the HTTP server
server.httpServer = http.createServer(function(req,res) {
		server.unifiedServer(req, res);
	});

//Instantiate the HTTPS server
server.httpsServerOptions = {
	'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
	'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
	};
server.httpsServer = https.createServer(server.httpsServerOptions, function(req,res) {
		server.unifiedServer(req, res);
	});


//All the server logic for http and https server
server.unifiedServer = function(req,res){

   // Parse the url
   let parsedUrl = url.parse(req.url, true);

   // Get the path
   let path = parsedUrl.pathname;
   let trimmedPath = path.replace(/^\/+|\/+$/g, '');

   // Get the query string as an object
   let queryStringObject = parsedUrl.query;

   // Get the HTTP method
   let method = req.method.toLowerCase();

   //Get the headers as an object
   let headers = req.headers;

   // Get the payload,if any
   let decoder = new StringDecoder('utf-8');
   let buffer = '';
   req.on('data', function(data) {
       buffer += decoder.write(data);
   });
   req.on('end', function() {
       buffer += decoder.end();

       // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
       let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

       // Construct the data object to send to the handler
       let data = {
         'trimmedPath' : trimmedPath,
         'queryStringObject' : queryStringObject,
         'method' : method,
         'headers' : headers,
         'payload' : helpers.parseJsonToObject(buffer)
       };

       // Route the request to the handler specified in the router
       chosenHandler(data, function(statusCode,payload){

         // Use the status code returned from the handler, or set the default status code to 200
         statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

         // Use the payload returned from the handler, or set the default payload to an empty object
         payload = typeof(payload) == 'object' ? payload : {};

         // Convert the payload to a string
         let payloadString = JSON.stringify(payload);

         // Return the response
         res.setHeader('Content-Type', 'application/json');
         res.writeHead(statusCode);
         res.end(payloadString);

         // If the response is 200, print green, otherwise print red
         if(statusCode == 200){
           debug('\x1b[32m%s\x1b[0m',method.toUpperCase() + '/' + trimmedPath + ' ' + statusCode);
         } else {
           debug('\x1b[31m%s\x1b[0m',method.toUpperCase() + '/' + trimmedPath + ' ' + statusCode);
         }
       });

   });
 };

//Define a request router
server.router = {
	'users' : handlers.users,
	'tokens' : handlers.tokens,
	'orders' : handlers.orders,
  'menu' : handlers.menu,
  'shoppingcart' : handlers.shoppingcarts
};

server.init = function(){

	//Start the HTTP server
	server.httpServer.listen(config.env.httpPort, function() {
		console.log('\x1b[36m%s\x1b[0m', 
		'The HTTP server is listening on port ' + config.env.httpPort + ' in ' + config.env.envName + ' now.');
	});

	//Start the HTTPS server
	server.httpsServer.listen(config.env.httpsPort, function() {
		console.log('\x1b[35m%s\x1b[0m',
		'The HTTPS server is listening on port ' + config.env.httpsPort + ' in ' + config.env.envName + ' now.');
	});
};
//Export the module
module.exports = server;
