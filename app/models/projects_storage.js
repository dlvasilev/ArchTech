'use strict';

/**
 * File: projects_storage.js
 * Role: Backend Model
 * Description: The Model for the project storage of the application.
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
 * Project Storage Schema
 */

var PStorageSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true,
        required: 'Не може да бъде празно'
    },
    realName: {
        type: String,
        default: ''
    },
    fileType: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: ''
    },
    inFolder: {
        type: String,
        default: ''
    },
    created: {
        type: Date,
        default: Date.now
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: Number,
    active: {
        type: Number,
        default: 1
    }
});


/**
 * Add the Project Storage Model to Mongooose
 */

mongoose.model('ProjectStorage', PStorageSchema);