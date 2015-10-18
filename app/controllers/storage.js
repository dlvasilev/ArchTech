'use strict';

/**
 * File: storage.js
 * Role: Backend Controller
 * Description: The controller for the user's storage methods of the application.
 * Project: archtech
 * Author: Daniel Vasilev
 * Date: 2014-2015
 */





/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    _ = require('lodash'),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs'),
    fse = require('fs-extra'),
    formidable = require('formidable');


/**
 * Module Mongoose Models.
 */

var Storage = mongoose.model('Storage'),
    PStorage = mongoose.model('ProjectStorage');


/**
 * Module's custom variables.
 */

var join = path.join,
    dir = path.join(__dirname + '../../../public/uploads');



/**
 * Module Methods.
 */


/**
 * Method the Create a Storage Folder and save it in the Database,
 * by given New Folder's infromation.
 */

exports.createFolder = function(req, res){

    var folder = new Storage(req.body);

    /**
     * We append User's Information to the Folder's Object.
     */

    folder.user = req.user;

    folder.save(function(err) {
        if (err) {

             /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to Create new Storage Folder in MongoDB ( method: \'createFolder\', in storageServerController ) :');
            console.error(err);

            return res.send('users/signup', {
                errors: err.errors,
                file: folder
            });

        } else {

            /**
             * Everything is done successfuly,
             * so now we can just respond tho the user's browser
             * with the new Folder.
             */

            res.jsonp(folder);

        }
    });
};

/**
 * Method the Upload File in the File System,
 * and and save it to the User's Storage in the Database,
 * by given Input with value the folder where the files will be stored
 * and Array of Files to Upload.
 */

exports.uploadFile = function(req, res){
    
    /**
     * Init the needed variables
     */

    var form = new formidable.IncomingForm();
    var callbackFiles = [];
    var inFolder = '0';
    var file,name,tArr,path,newPath;

    form
        .on('field', function(field, value) {

            /**
             * The id of the folder where the fles will be stored.
             */

            inFolder = value;

        })
        .on('file', function(field, file) {

            /**
             * Temp variable with the neccessary information of each file
             */

            name = file.name;
            tArr = name.split('.');
            var rName = Math.floor((Math.random() * 99999999) + 1) + '_' + Math.floor((Math.random() * 99999999) + 1) + '.' + tArr[1];
            newPath = join(dir, rName);

            /**
             * Upload the file one the Server's Disk Storage
             */

            fs.rename(file.path, newPath, function(err){

                if (err) {

                    /**
                     * Log the occurred error.
                     */

                    console.error('An Error occurred while trying to Upload File on the Server\'s Disk Storage ( method: \'uploadFile\', in storageServerController ) :');
                    console.error(err);

                } else {

                    /**
                     * Object with the Files information,
                     * which will be stored in the Database.
                     */

                    var fileDBInfo = {
                        name: file.name,
                        realName: rName,
                        fileType: file.type,
                        size: file.size,
                        inFolder: inFolder,
                        user: req.user,
                        type: 2
                    };

                    var fileDB = new Storage(fileDBInfo);

                    fileDB.save(function(err) {
                        if (err) {

                            /**
                             * Log the occurred error.
                             */

                            console.error('An Error occurred while trying to save new File\'s information in the Database ( method: \'uploadFile\', in storageServerController ) :');
                            console.error(err);

                        } else {

                            /**
                             * Everything is done successfuly,
                             * so now we can push the file in our callbackFiles Array.
                             */

                            callbackFiles.push(fileDBInfo);

                        }
                    });

                }
            });
        })
        .on('end', function(){

            /**
             * Everything is done successfuly,
             * so now all we need is to respond to the server
             * with the newly uploaded Files.
             */

            res.writeHead(res.statusCode.toString(), {'content-type': 'text/plain'});
            res.write(JSON.stringify(callbackFiles));
            res.end();

        });

    /**
     * Parse the incoming Form Data.
     */

    form.parse(req);

};

/**
 * Method the Copy File from User's Storage to specific Project's Storage.
 * By given File and Project Id.
 */

exports.uploadCloudFile = function(req, res){
    
    /**
     * First we need to find the File's information,
     * to see if its registered in our Database.
     */

    Storage.findOne({ _id: req.body.file }).exec(function(err, data){

        if(err) {
            
            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to find File\'s information from the Database ( method: \'uploadCloudFile\', in storageServerController ) :');
            console.error(err);

        } else {

            /**
             * Temp variables with the file's information.
             */

            var name = data.name;
            var tArr = name.split('.');
            var rName = Math.floor((Math.random() * 99999999) + 1) + '_' + Math.floor((Math.random() * 99999999) + 1) + '.' + tArr[1];
            var path = join(dir, data.realName);
            var newPath = join(dir, rName);

            fse.copy(path, newPath, function(err){
                if (err) { 
                    
                    /**
                     * Log the occurred error.
                     */

                    console.error('An Error occurred while trying to copy File in the Server\'s Disk Storage ( method: \'uploadCloudFile\', in storageServerController ) :');
                    console.error(err);

                } else {

                    /**
                     * Object with the File's information 
                     * which will be stored in the Database.
                     */

                    var file = {
                        name: data.name,
                        realName: rName,
                        fileType: data.fileType,
                        size: data.size,
                        inFolder: req.body.folder,
                        user: req.user,
                        project: req.body.id,
                        type: 2
                    };

                    var fileDB = new PStorage(file);
                    fileDB.save(function(err) {
                        if (err) {

                            /**
                             * Log the occurred error.
                             */

                            console.error('An Error occurred while trying to save the Copied File\'s information in the Database ( method: \'uploadCloudFile\', in storageServerController ) :');
                            console.error(err);

                        } else {

                            /**
                             * Everything is done Succcessfully
                             * so now we can repsond the the Client's Brower with the Copied File.
                             */

                            res.writeHead(res.statusCode.toString(), {'content-type': 'text/plain'});
                            res.write(JSON.stringify(file));
                            res.end();

                        }
                    });

                }
            });

        }

    });
};


/**
 * Method to Remove file or Folder,
 * by given File/Folder's ID.
 */

exports.remove = function(req, res){

    Storage.findOne({ _id: req.params.id }).exec(function(err, data){
        if(err) {
            
            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to Find File\'s information in the Database ( method: \'remove\', in storageServerController ) :');
            console.error(err);

        } else {

            var filePath = join(dir, data.realName);

            /**
             * In case it is File, not Folder,
             * we have to Remove it from the Server's Disk Storage.
             */

            if(data.type === 2) {
                fs.unlink(filePath, function(err) {
                    if(err) {

                        /**
                         * Log the occurred error.
                         */

                        console.error('An Error occurred while trying to delete File form the Server\'s Disk Storage ( method: \'remove\', in storageServerController ) :');
                        console.error(err);

                    }
                });
            }

            /**
             * Delete File's information from the Database.
             */

            Storage.remove({_id: req.params.id}).exec(function(err) {
                if(err) {

                    /**
                     * Log the occurred error.
                     */

                    console.error('An Error occurred while trying to remove the File/Foler from the Database ( method: \'remove\', in storageServerController ) :');
                    console.error(err);

                } else {

                    /**
                     * Everything is done successfully,
                     * so now we can end the Request.
                     */

                    res.end();
                }
            });

        }
    });

};

/**
 * Method to Download File,
 * by given File's ID.
 */

exports.download = function(req, res){
    Storage.findOne({ _id: req.params.id }).exec(function(err, data){
        if(err) {
            
            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to Find File\'s information in the Database ( method: \'download\', in storageServerController ) :');
            console.error(err);

        } else {

            var filePath = join(dir, data.realName);

            /**
             * Respond to the client's browser with the File.
             */

            res.download(filePath, data.name);

        }
    });
};

/**
 * Method to list User's Sotorage files and folders
 * in a specific Folder,
 * by given Folder's ID and User's ID.
 */
exports.list = function(req, res) {

    /**
     * If the Client Requested for specific folder in his Storage
     */

    if(req.params.id){
        Storage.find({user: req.user.id, inFolder: req.params.id}).sort('type').exec(function(err, files){
            if (err) {

                /**
                 * Log the occurred error.
                 */

                console.error('An Error occurred while trying to Find Files/Folders in the User\'s Storage Specific Folder, in the Database ( method: \'list\', in storageServerController ) :');
                console.error(err);

                res.render('error', {
                    status: 500
                });

            } else {

                /**
                 * Everything has done successfully,
                 * so now we can respond with the found Files and folders.
                 */ 

                res.jsonp(files);

            }
        });
    } 

    /**
     * If the Client Requested for the Root Folder of his Storage
     */

    else {

        Storage.find({user: req.user.id, inFolder: '0'}).sort('type').exec(function (err, files) {
            if (err) {


                /**
                 * Log the occurred error.
                 */

                console.error('An Error occurred while trying to Find Files/Folders in the User\'s Storage Root Folder, in the Database ( method: \'list\', in storageServerController ) :');
                console.error(err);

                res.render('error', {
                    status: 500
                });

            } else {

                /**
                 * Everything has done successfully,
                 * so now we can respond with the found Files and folders.
                 */ 

                res.jsonp(files);

            }
        });
    }
};




/**
 * Module middlewares
 */

/**
 * Middleware for checking that User is trying to get real File,
 * which is registered in the Database
 */
exports.fileByID = function(req, res, next, id) {
    Storage.findById(id).populate('user', 'displayName').exec(function(err, file) {
        if (err) return next(err);
        if (!file) return next(new Error('Failed to load file ' + id));
        req.file = file;
        next();
    });
};

/**
 * Middleware for checking that User is looking for his own Storage.
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.file.user.id !== req.user.id) {
        return res.send(403, 'User is not authorized');
    }
    next();
};