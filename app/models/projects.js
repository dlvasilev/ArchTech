'use strict';

/**
 * File: projects.js
 * Role: Backend Model
 * Description: The Model for the projects of the application.
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
 * Project Schema
 */
 
var ProjectSchema = new Schema({
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Името не може да бъде празно'
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    users: {
        type: Number,
        default: 1
    },
    files: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    },
    live: {
        type: Boolean,
        default: false
    }
});


/**
 * Add the Project Model to Mongooose
 */

mongoose.model('Project', ProjectSchema);