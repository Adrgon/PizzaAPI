/*
* Request handlers
*
*/

//Dependencies
const helpers = require('./helpers');
const config = require('./config');
const _users = require('./handlers/users_handler');
const _tokens = require('./handlers/tokens_handler');
const _purchase = require('./handlers/purchase_handler');
const _menu = require('./handlers/menu_handler');
const _shoppingcarts = require('./handlers/shopping_cart_handler');

//Define handlers
const handlers = {};

handlers.users = (data, callback)=>{
	let acceptableMethods = ['post','get','put','delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		_users[data.method](data, callback);
	} else {
		callback(405);
	}
};

handlers.tokens = (data, callback)=>{
	let acceptableMethods = ['post','get','put','delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		_tokens[data.method](data, callback);
	} else {
		callback(405);
	}
};

handlers.purchase = (data,callback)=>{
  let acceptableMethods = ['post'];
  if(acceptableMethods.indexOf(data.method) > -1){
    _purchase[data.method](data,callback);
  } else {
    callback(405);
  }
};

handlers.menu = (data,callback)=>{
  let acceptableMethods = ['get'];
  if(acceptableMethods.indexOf(data.method) > -1){
    _menu[data.method](data,callback);
  } else {
    callback(405);
  }
};

handlers.shoppingcarts = (data,callback)=>{
  let acceptableMethods = ['post','get','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    _shoppingcarts[data.method](data,callback);
  } else {
    callback(405);
  }
};

handlers.notFound = (data, callback)=>{
	callback(404, {'Error' : 'Invalid route.'});
};

//Export the module
module.exports = handlers;