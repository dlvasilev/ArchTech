'use strict';

/**
 * File: messenger.js
 * Role: Backend Router
 * Description: The router for the Messenger module of the application.
 * Project: archtech
 * Author: Daniel Vasilev
 * Date: 2014-2015
 */



/**
 * Module dependencies.
 */

var editor = require('../../app/controllers/messenger');


/**
 * Routes for Messenger Module
 */

module.exports = function(app) {

    app.get('/messenger/get/:id', editor.getMessages);

};