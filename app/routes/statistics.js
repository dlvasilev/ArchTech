'use strict';

/**
 * File: statistics.js
 * Role: Backend Router
 * Description: The router for the Statistics module of the application.
 * Project: archtech
 * Author: Daniel Vasilev
 * Date: 2014-2015
 */



/**
 * Module dependencies.
 */

var users = require('../../app/controllers/users'),
    statistics = require('../../app/controllers/statistics');


/**
 * Routes for Statistics Module
 */

module.exports = function(app) {

    app.get('/statistics', users.requiresLogin, statistics.get);
    app.get('/statistics/update', users.requiresLogin, statistics.update);

};