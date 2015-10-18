'use strict';

/**
 * File: messenger.js
 * Role: Backend Model
 * Description: The Model for the messenger of the application.
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
 * Messenger Schema
 */
 
var MessengerSchema = new Schema({
    content: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: String,
        default: '',
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    file: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    type: {
        type: Number
    }
});


/**
 * Add the Messenger Model to Mongooose
 */

mongoose.model('Messenger', MessengerSchema);