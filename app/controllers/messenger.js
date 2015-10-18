'use strict';

/**
 * File: messenger.js
 * Role: Backend Controller
 * Description: The controller for the messenger's methods of the application.
 * Project: archtech
 * Author: Daniel Vasilev
 * Date: 2014-2015
 */





/**
 * Module dependencies.
 */

var mongoose = require('mongoose');


/**
 * Module Mongoose Models.
 */
var Messenger = mongoose.model('Messenger');





/**
 * Module methods.
 */

/**
 * Method to save chat's message, 
 * in MongoDB, using mongoose,
 * by given JSON object from the frontend.
 */

exports.saveMessage = function(data) {
	var message = new Messenger(data);

    message.save(function(err) {
        if (err) {

            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to save Project\'s File Message in MongoDB:');
            console.error(err);

        }
    });
};

/**
 * Method to get all messages of a file, 
 * from MongoDB, using mongoose,
 * by given file's ID.
 */

exports.getMessages = function(req, res){
    Messenger.find({ file: req.params.id }).exec(function (err, msgs){
        if(err) {
            
            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to find Project\'s File Messages from MongoDB:');
            console.error(err);

            res.render('error', {
                status: 500
            });

        } else {

            /**
             * Respond by sending All the messages 
             * of this Project's Storage File Conversation, 
             * in JSON Object.
             */

            res.jsonp(msgs);

        }
    });
};