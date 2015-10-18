'use strict';

/**
 * File: statistics.js
 * Role: Backend Model
 * Description: The Model for the User's Statistics of the application.
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
 * Statistics Schema
 */
 
var StatisticsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    files: {
        type: Number,
        default: 0
    },
    maxFiles: {
        type: Number,
        default: 10000
    },
    folders: {
        type: Number,
        default: 0
    },
    maxFolders: {
        type: Number,
        default: 100
    },
    storage: {
        type: Number,
        default: 0
    },
    maxStorage: {
        type: Number,
        default: 1024000000
    },
    projects: {
        type: Number,
        default: 0
    }
});


/**
 * Add the Statistics Model to Mongooose
 */

mongoose.model('Statistics', StatisticsSchema);