'use strict';

/**
 * File: projects_members.js
 * Role: Backend Model
 * Description: The Model for the project members of the application.
 * Project: archtech
 * Author: Daniel Vasilev
 * Date: 2014-2015
 */





/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Project Members Schema
 */
 
var PMembersSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: Number
    }
});


/**
 * Add the Project Members Model to Mongooose
 */

mongoose.model('ProjectMembers', PMembersSchema);