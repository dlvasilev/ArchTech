'use strict';

/**
 * File: editor.js
 * Role: Backend Controller
 * Description: The controller for the editor's methods of the application.
 * Project: archtech
 * Author: Daniel Vasilev
 * Date: 2014-2015
 */





/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path'),
    sync = require('sync');
    // fabric = require('fabric').fabric;

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
 * Module methods.
 */

/**
 * Method to load the Index of UI Editor.
 */
exports.index = function(req, res) {
    res.end();
};


/**
 * Method to load file information, 
 * stored in the user's file system 
 * by given User's Storage file ID.
 */

exports.openFile = function(req, res) {
    Storage.findOne({ _id: req.params.fileId }).exec(function(err, file){
        if (err) {

            /**
             *  Log the occurred error.
             */

            console.error('An Error occurred while trying to get User\'s Storage File information from MongoDB ( method: \'openFile\', in editorServerController ):');
            console.error(err);

            res.render('error', {
                status: 500
            });

        } else {

            /**
             *  Respond by sending file's information in JSON object.
             */

            res.jsonp(file);

        }
    });
};


/**
 * Method to load file information, 
 * stored in the projects's file system 
 * by given Project's Storage file ID.
 */

exports.openFileProject = function(req, res) {
    PStorage.findOne({ _id: req.params.fileId }).exec(function(err, file){
        if (err) {
            
            /**
             *  Log the occurred error.
             */

            console.error('An Error occurred while trying to get Project\'s Storage File information from MongoDB ( method: \'openFileProject\', in editorServerController ):');
            console.error(err);

            res.render('error', {
                status: 500
            });

        } else {
            
            /**
             *  Respond by sending project's file infromation in JSON object.
             */

            res.jsonp(file);

        }
    });
};


/**
 * Method to save file, 
 * stored in the project's file system 
 * by given Project's Storage file ID and JSON canvas object.
 */

// exports.saveFileCloud = function(req, res){
//     if(req.body.type === 1){
//         PStorage.findById(req.params.fileId).exec(function(err, file){
//             if (err) {
//                 res.render('error', {
//                     status: 500
//                 });
//             } else {
//                 var out = fs.createWriteStream(join(dir, 'temp.png'));
//                 var canvas = fabric.createCanvasForNode(req.body.width, req.body.height);

//                 canvas.loadFromJSON(JSON.parse(req.body.canvasObj), function() {
//                     //canvas.renderAll();

//                     var stream = canvas.createPNGStream();
//                     stream.on('data', function(chunk) {
//                         out.write(chunk);
//                         console.log('saved chunk');
//                     });
//                     stream.on('end', function(chunk) {
//                         out.end(chunk);
//                         console.log('pic saved');
//                     });
//                 });
//             }
//         });
//     }
// };