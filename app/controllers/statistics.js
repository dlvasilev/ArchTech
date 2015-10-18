'use strict';

/**
 * File: statistics.js
 * Role: Backend Controller
 * Description: The controller for the user's statistics methods of the application.
 * Project: archtech
 * Author: Daniel Vasilev
 * Date: 2014-2015
 */





/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    _ = require('lodash');

/**
 * Module Mongoose Models.
 */

var Statistics = mongoose.model('Statistics'),
    Storage = mongoose.model('Storage');




/**
 * Module Methods.
 */


/**
 * Method to Get User's Storage Statistics,
 * by given User ID
 */

exports.get = function(req, res) {
    Statistics.findOne({user: req.user.id}).exec(function (err, statistics){
        if (err) {

            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to Get user\'s statistics from MongoDB ( method: \'get\', in statisticsServerController ) :');
            console.error(err);

            res.render('error', {
                status: 500
            });

        } else {

            /**
             * In case the user is new and still don't have statistics we seed them.
             */


            if(statistics === null){

                var seed = new Statistics({ 
                    user: req.user.id,
                    files: 0,
                    folders: 0,
                    storage: 0,
                    projects: 0
                });

                seed.save(function(err){
                    if(err) {

                        /**
                         * Log the occurred error.
                         */

                        console.error('An Error occurred while trying to Seed new user\'s statistics in MongoDB ( method: \'get\', in statisticsServerController ) :');
                        console.error(err);

                        res.render('error', {
                            status: 500
                        });

                    } else {

                        /**
                         * The Seed is successfuly added in the Database,
                         * so now we can just send it to the user.
                         */

                        var tmp = [{
                            user: req.user.id,
                            files: 0,
                            folders: 0,
                            storage: 0,
                            projects: 0
                        }];

                        res.jsonp(tmp);

                    }
                });

            } else {

                /**
                 * Send the statistics to the user.
                 */

                var result = [];
                result.push(statistics);

                res.jsonp(result);

            }

        }
    });
};

/**
 * Method to Update User's statistics,
 * by given User ID, and User's files.
 */

exports.update = function(req, res) {

    /**
     * The final function to update the statistics
     * in the Database.
     */

    function updateDB(obj){

        Statistics.update({ user: req.user.id }, {
            files: obj.files,
            folders: obj.folders,
            storage: obj.storage
        }, function(statistics){

            /**
             * We send the updated statistics to the User.
             */

            res.jsonp([statistics]);

        });

    }

    /**
     * Get the user's statistics Document from the Mongo DB
     */

    Storage.find({user: req.user.id}).exec(function (err, files){

        if (err) {

            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to Get user\'s statistics from MongoDB ( method: \'update\', in statisticsServerController ) :');
            console.error(err);

            res.render('error', {
                status: 500
            });

        } else {

            /**
             * Zeroed Statistics variable
             */

            var obj = {
                files: 0,
                folders: 0,
                storage: 0
            };

            /**
             * Temp variable.
             */

            var file;


            for(var i = 0; i < files.length; i++){

                /**
                 * We look for the File's type,
                 * If its file we increment files variable and Disk Storage variable
                 * Else it is Filder so we will just increment the Folder's variable.
                 */

                file = files[i];
                if (file.type === 1) {
                    obj.folders += 1;
                } else {
                    obj.files += 1;
                    obj.storage += parseInt(file.size);
                }

                /**
                 * When the loop is done we send the data to the UpdateDB function.
                 */

                if(i === files.length - 1) updateDB(obj);
            
            }
        }

    });
};




/**
 * Module middlewares
 */

/**
 * Middleware for checking that the User is look for its own Statistics.
 */

exports.hasAuthorization = function(req, res, next) {
    if (req.file.user.id !== req.user.id) {
        return res.send(403, 'User is not authorized');
    }
    next();
};