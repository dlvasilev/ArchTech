'use strict';

/**
 * File: core.js
 * Role: Backend Router
 * Description: The router for the Core module of the application.
 * Project: archtech
 * Author: Daniel Vasilev
 * Date: 2014-2015
 */



/**
 * Module dependencies.
 */
 
var core = require('../../app/controllers/core');


/**
 * Routes for Core Module
 */

module.exports = function(app) {
	app.get('/', core.index);
};