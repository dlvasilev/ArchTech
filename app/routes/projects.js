'use strict';

/**
 * File: projects.js
 * Role: Backend Router
 * Description: The router for the Projects module of the application.
 * Project: archtech
 * Author: Daniel Vasilev
 * Date: 2014-2015
 */



/**
 * Module dependencies.
 */

var users = require('../../app/controllers/users'),
    projects = require('../../app/controllers/projects');



/**
 * Routes for Projects Module
 */

module.exports = function(app) {

    // Project Routes
    app.get('/projects', projects.list);
    app.post('/projects', users.requiresLogin, projects.create);
    app.get('/projects/:projectId', projects.open);
    app.put('/projects/:projectId', users.requiresLogin, projects.hasAuthorization, projects.update);
    app.put('/projects/:projectId/state', users.requiresLogin, projects.hasAuthorization, projects.updateState);
    app.post('/projects/:projectId/delete', users.requiresLogin, projects.hasAuthorization, projects.delete);

    // Project Members Routes
    app.post('/projects/add-member', projects.addMember);
    app.post('/projects/delete-member', projects.deleteMember);

    // Project Storage Routes
    app.get('/projects/:projectId/storage', users.requiresLogin, projects.storageList);
    app.get('/projects/:projectId/storage/:id', users.requiresLogin, projects.storageList);
    app.post('/projects/:projectId/storage', users.requiresLogin, projects.storageCreate);
    app.post('/projects/:projectId/storage/server-upload-file', users.requiresLogin, projects.storageUploadFile);
    app.post('/projects/:projectId/storage/remove/:id', users.requiresLogin, projects.storageRemove);

    // Finish by binding the projects middleware
    app.param('projectId', projects.projectByID);

};