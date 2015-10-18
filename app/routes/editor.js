'use strict';

/**
 * File: editor.js
 * Role: Backend Router
 * Description: The router for the Editor module of the application.
 * Project: archtech
 * Author: Daniel Vasilev
 * Date: 2014-2015
 */



/**
 * Module dependencies.
 */

var editor = require('../../app/controllers/editor');


/**
 * Routes for Editor Module
 */

module.exports = function(app) {

    app.get('/editor', editor.index);
    app.get('/editor/file/:fileId', editor.openFile);
    app.get('/editor/project/file/:fileId', editor.openFileProject);

    // app.post('/editor/save/file/:fileId', editor.saveFileCloud);

};