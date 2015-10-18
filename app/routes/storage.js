'use strict';

/**
 * File: storage.js
 * Role: Backend Router
 * Description: The router for the Storage module of the application.
 * Project: archtech
 * Author: Daniel Vasilev
 * Date: 2014-2015
 */



/**
 * Module dependencies.
 */

var users = require('../../app/controllers/users'),
    storage = require('../../app/controllers/storage');


/**
 * Routes for Storage Module
 */

module.exports = function(app) {
    // Storage Routes
    app.get('/storage', users.requiresLogin, storage.list);
    app.get('/storage/:id', users.requiresLogin, storage.list);
    app.post('/storage', users.requiresLogin, storage.createFolder);
    app.post('/storage/server-upload-file', users.requiresLogin, storage.uploadFile);
    app.post('/storage/upload-file-cloud', users.requiresLogin, storage.uploadCloudFile);
    app.post('/storage/remove/:id', users.requiresLogin, storage.remove);
    app.get('/storage/download/:id', users.requiresLogin, storage.download);

    // Finish by binding the storage middleware
    app.param('storageId', storage.fileByID);
};