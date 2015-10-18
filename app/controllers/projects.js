'use strict';

/**
 * File: projects.js
 * Role: Backend Controller
 * Description: The controller for the project's methods of the application.
 * Project: archtech
 * Author: Daniel Vasilev
 * Date: 2014-2015
 */





/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    formidable = require('formidable');

/**
 * Module Mongoose Models.
 */

var Project = mongoose.model('Project'),
    PMembers = mongoose.model('ProjectMembers'),
    User = mongoose.model('User'),
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
 * Method to Create a new Project, 
 * by given JSON object.
 */

exports.create = function(req, res) {
    var project = new Project(req.body);
    project.user = req.user.id;

    project.save(function(err) {
        if (err) {

            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to Create a new Project in MongoDB ( method: \'create\', in projectServerController ) :');
            console.error(err);

            return res.send('users/signup', {
                errors: err.errors,
                project: project
            });

        } else {

            /**
             * Create the Admin Member of the Project
             */


            var adminMember = new PMembers({
                project: project._id,
                user: req.user.id,
                type: 1
            });

            adminMember.save(function(err){
                if(err) {

                    /**
                     * Log the occurred error.
                     */

                    console.error('An Error occurred while trying to Create new Project\'s Admin Member in MongoDB ( method: \'create\', in projectServerController ) :');
                    console.error(err);

                } else {

                    /**
                     * Respond by sending new Project's information in JSON Object.
                     */

                    res.jsonp(project);

                }
            });
        }
    });
};


/**
 * Method to Open specific Project, 
 * by given Project's ID 
 * and respond with JSON object of Project's Information.
 */

exports.open = function(req, res) {

    /**
     * Get all the members of this Project
     */

    PMembers.find({project: req.project._id}).exec(function(err, members){

        /**
         * Get Project Admin User's Account Data
         */

        User.findOne({ _id: req.project.user }).exec(function(err, data) {

            if(err) {
                
                /**
                 * Log the occurred error.
                 */

                console.error('An Error occurred while trying to Get Project Admin\'s User Data, from MongoDB ( method \'open\', in projectServerController ) :');
                console.error(err);

            } else {

                var users = [], // Init our Member's Array
                    project = { // Init our Response JSON Object
                        _id: req.project._id,
                        user: data,
                        created: req.project.created,
                        files: req.project.files,
                        users: req.project.users,
                        content: req.project.content,
                        title: req.project.title,
                        live: req.project.live
                    };

                /**
                 * Foreach members in the project to get their accounts data.
                 */

                async.each(members, function(member, callback) {

                    /**
                     * Get Member's User Account Data
                     */

                    User.findOne({ _id: member.user }).exec(function(err, data) {
                        if(err) {

                            /**
                             * Log the occurred error.
                             */

                            console.error('An Error occurred while trying to Get Project Members User Data, from MongoDB ( method \'open\', in projectServerController ) :');
                            console.error(err);

                            callback(err);

                        }

                        if (data !== null) {

                            /**
                             * Seccessfully Get the User's Data and pushing it in our Users Array
                             */

                            users.push({
                                displayName: data.displayName,
                                id: data._id
                            });

                            callback(null);

                        }

                    });

                }, function(err) {

                    if(err) {

                        /**
                         * Log the occurred error.
                         */

                        console.error('An Error occurred while foreaching the members of the Project ( method \'open\', in projectServerController ) :');
                        console.error(err);

                    } else {

                        /**
                         * Everything completed successfully, so now we can append the Members in our Project's Object
                         * and then send the response JSON Object containing our Project's Data
                         */

                        project.members = users;

                        res.jsonp(project);

                    }

                });
            }
        });
    });
};


/**
 * Method to Update specific Project, 
 * by given Project's ID and new Project Data,
 * and then respond with JSON object of updated Project's Information.
 */

exports.update = function(req, res) {

    Project.update({ _id: req.body._id }, { title: req.body.title, content: req.body.content }, function(err, project) {
        if (err) {

            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to Update Project ( method:  \'update\', in projectServerController) :');
            console.error(err);

            res.render('error', {
                status: 500
            });

        } else {

            /**
             * Respond with JSON Object of the updated Project's Data
             */

            res.jsonp(project);

        }
    });

};

/**
 * Method to Update the State of specific Project, 
 * by given Project's ID and the new state,
 * and then respond with JSON object of updated Project's Information.
 */

exports.updateState = function(req, res) {
    Project.update({ _id: req.body._id }, { live: req.body.live }, function(err, project) {
        if (err) {

            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to Update Project\'s State ( method:  \'updateState\', in projectServerController) :');
            console.error(err);

            res.render('error', {
                status: 500
            });

        } else {

            /**
             * Respond with JSON Object of the updated Project's Data
             */

            res.jsonp(project);

        }
    });

};


/**
 * Method to Delete specific Project, 
 * by given Project's ID.
 */

exports.delete = function(req, res) {
    Project.remove({ _id: req.body._id }).exec(function(err){
        if(err) {

            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to Delete Project ( method:  \'delete\', in projectServerController) :');
            console.error(err);

            res.render('error', {
                status: 500
            });

        }

        res.end();

    });
};


/**
 * Method to Get All the Projects of a specific User, 
 * by given User's ID
 * and then respond with Array of JSON Objects containing User's Projects
 */

exports.list = function(req, res) {

    /**
     * Get All Projects where the User is a member.
     */ 

    PMembers.find({ user: req.user._id }).exec(function(err, data){

        if(err) {

             /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to Get User\'s Projects ( method:  \'list\', in projectServerController) :');
            console.error(err);

            res.render('error', {
                status: 500
            });

        }

        var projects = []; // Init the Respond Project's Array

        /**
         * Foreach Projects to Get their Data
         */ 

        async.each(data, function(data, callback) {

            Project.findOne({ _id: data.project }).exec(function(err, data) {
                if(err) {

                    /**
                     * Log the occurred error.
                     */

                    console.error('An Error occurred while trying to User\'s Projects Data ( method:  \'list\', in projectServerController) :');
                    console.error(err);

                    callback(err);

                }

                if (data !== null) {

                    /**
                     * Seccessfully Get the Project's Data and pushing it in our Projects Array
                     */

                    projects.push(data);

                    callback(null);

                }
            });

        }, function(err) {
            if(err) {

                /**
                 * Log the occurred error.
                 */

                console.error('An Error occurred while foreaching the projects of User ( method \'list\', in projectServerController ) :');
                console.error(err);

            } else {

                /**
                 * Everything completed successfully send the response JSON Object containing our User's Projects.
                 */

                res.jsonp(projects);

            }
        });
    });
};

/**
 * Method to Add Member to a specific Project, 
 * by given User's ID, User's Type and Project's Id,
 * and then respond with Array of JSON Objects containing Project's Members
 */

exports.addMember = function(req, res) {

    /**
     * Create a new Document in MongoDB containing Project's ID and new User's ID and Type 
     */

    PMembers.create({ project: req.body.id, user: req.body.user, type: 2 }, function(err){
        if(err) {

            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while trying to Add new Member in specific Project ( method \'addMember\', in projectServerController ) :');
            console.error(err);

        } else {

            /**
             * Find the Project's Document in MongoDB,
             * by given Project'ID
             * and the increment members variable of the Project.
             */

            Project.findOne({ _id: req.body.id}, function (err, project) {

                if(err) {

                    /**
                     * Log the occurred error.
                     */

                    console.error('An Error occurred while trying to Get Project\'s Data ( method \'addMember\', in projectServerController ) :');
                    console.error(err);

                } else {

                    /**
                     * We successfully get the Project's Data and now we can increment the members variable
                     * and then update the Projects Document
                     */

                    project.users += 1;

                    /**
                     * After Project's Document is successfully updated,
                     * we can get All Members data and then send it trought response.
                     */

                    project.save(getMembers());

                }

            });

        }
    });

    
    /** 
     * Private Method's function for Getting Members Data.
     */ 

    function getMembers(){

        /**
         * Get All Project's members.
         */ 

        PMembers.find({project: req.body.id}).exec(function(err, members) {

            var users = []; // Init the resposne Members Array

            /**
             * Foreach the members of the Project
             */

            async.each(members, function(data, callback) {

                /**
                 * Get Each User's Data.
                 */

                User.findOne({ _id: data.user }).exec(function(err, data) {

                    if(err) {

                        /**
                         * Log the occurred error.
                         */

                        console.error('An Error occurred while trying to get Project Members Data ( method \'addMember.getMembers()\', in projectServerController ) :');
                        console.error(err);

                        callback(err);

                    }

                    if(data) {

                        /**
                         * Successfully get the User's Data 
                         * and now we can push the needed Data
                         * to our Members Array
                         */

                        users.push({
                            displayName: data.displayName,
                            id: data._id
                        });

                    }

                    callback(null);
                });
            }, function(err) {
                if(err) {

                    /**
                     * Log the occurred error.
                     */

                    console.error('An Error occurred while foreaching Project Members ( method \'addMember.getMembers()\', in projectServerController ) :');
                    console.error(err);

                }
                else {

                    /**
                     * Everything finished successfully
                     * so now we can respond with the Members Array of JSON Objects 
                     */

                    res.jsonp(users);

                }
            });
        });
    }
};


/**
 * Method to Delete Member from a specific Project, 
 * by given User's ID and Project's Id,
 * and then respond with Array of JSON Objects containing Project's Members
 */

exports.deleteMember = function(req, res) {

    /**
     * Delete the Document the Member in this Project
     */

    PMembers.remove({project: req.body.id, user: req.body.user}, function(err){

        if(err) {
            
            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while to Delete Member from a specific Project ( method \'deleteMember\', in projectServerController ) :');
            console.error(err);


        } else {

            /**
             * Get Project's Document and then decrement the members variable
             */

            Project.findOne({ _id: req.body.id}, function (err, project) {

                if(err) {

                    /**
                     * Log the occurred error.
                     */

                    console.error('An Error occurred while trying to get Project\'s Data  ( method \'deleteMember\', in projectServerController ) :');
                    console.error(err);

                } else {

                    /**
                     * We successfully get the Project's Data and now we can dencrement the members variable
                     * and then update the Projects Document
                     */

                    project.users -= 1;

                    /**
                     * After Project's Document is successfully updated,
                     * we can get All Members data and then send it trought response.
                     */

                    project.save(getMembers());

                }

            });
        }

    });

    /** 
     * Private Method's function for Getting Members Data.
     */ 

    function getMembers(){

        /**
         * Get All Project's members.
         */ 

        PMembers.find({project: req.body.id}).exec(function(err, members) {

            var users = []; // Init the resposne Members Array

            /**
             * Foreach the members of the Project
             */

            async.each(members, function(data, callback) {

                /**
                 * Get Each User's Data.
                 */

                User.findOne({ _id: data.user }).exec(function(err, data) {

                    if(err) {

                        /**
                         * Log the occurred error.
                         */

                        console.error('An Error occurred while trying to get Project Members Data ( method \'deleteMember.getMembers()\', in projectServerController ) :');
                        console.error(err);

                        callback(err);

                    }

                    if(data) {

                        /**
                         * Successfully get the User's Data 
                         * and now we can push the needed Data
                         * to our Members Array
                         */

                        users.push({
                            displayName: data.displayName,
                            id: data._id
                        });

                    }

                    callback(null);
                });
            }, function(err) {
                if(err) {

                    /**
                     * Log the occurred error.
                     */

                    console.error('An Error occurred while foreaching Project Members ( method \'deleteMember.getMembers()\', in projectServerController ) :');
                    console.error(err);

                }
                else {

                    /**
                     * Everything finished successfully
                     * so now we can respond with the Members Array of JSON Objects 
                     */

                    res.jsonp(users);

                }
            });
        });
    }
};


/**
 * Method to List all the Storage Files from a specific Project, 
 * by given Project's ID and in case Folder,
 * and then respond with Array of Project's Files
 */

exports.storageList = function(req, res) {

    /**
     * In case there is given specific Folder ID
     */

    if(req.params.id){

        /**
         * Get All the Files in specific Folder
         * of the Project's Storage.
         */ 

        PStorage.find({project: req.project._id, inFolder: req.params.id}).sort('type').exec(function(err, files){
            if (err) {

                /**
                 * Log the occurred error.
                 */

                console.error('An Error occurred while to get Files in Project\'s Storage Specific Folder ( method \'storageList\', in projectServerController ) :');
                console.error(err);

                res.render('error', {
                    status: 500
                });

            } else {

                /**
                 * Respond with the Project's Storage Files in the specific folder.
                 */

                res.jsonp(files);

            }
        });

    } else {

        /**
         * Get All the Files in the Root Folder
         * of the Project's Storage.
         */

        PStorage.find({project: req.project._id, inFolder: '0'}).sort('type').exec(function(err, files) {
            if (err) {

                /**
                 * Log the occurred error.
                 */

                console.error('An Error occurred while to get Files in Project\'s Storage Root Folder ( method \'storageList\', in projectServerController ) :');
                console.error(err);

                res.render('error', {
                    status: 500
                });

            } else {

                /**
                 * Respond with the Project's Storage Files in the Root folder.
                 */

                res.jsonp(files);

            }
        });
    }
};


/**
 * Method to Create new Item in the Storage of a specific Project, 
 * by given Project's ID and Item Data,
 * and then respond with new Item's Data
 */

exports.storageCreate = function(req, res){

    var item = new PStorage(req.body);

    item.save(function(err){
        if (err) {
            
            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while to Create new Item in the Storage of a specific Project ( method \'storageCreate\', in projectServerController ) :');
            console.error(err);

            return res.send('users/signup', {
                errors: err.errors,
                file: item
            });

        } else {

            /**
             * Respond with the new Item's Data
             */

            res.jsonp(item);

        }
    });
};


/**
 * Method to Remove specific Item from the Storage of a specific Project, 
 * by given Project's ID and Item Data,
 * and then respond with new Item's Data
 */

exports.storageRemove = function(req, res){

    PStorage.remove({_id: req.params.id}).exec(function(err) {
        if(err) {

            /**
             * Log the occurred error.
             */

            console.error('An Error occurred while to Delete specific Item from the Storage of a specific Project ( method \'storageRemove\', in projectServerController ) :');
            console.error(err);

            res.render('error', {
                status: 500
            });

        }

        /**
         * Successfuly Deleted the Item
         * so now we can just end the Request.
         */

        res.end();
    });

};


/**
 * Method to Uplaod new file in the File System of the Server, 
 * by given Array of Files.
 */

exports.storageUploadFile = function(req, res){
    var form = new formidable.IncomingForm(),
        callbackFiles = [],
        inFolder = '0',
        file,name,tArr,rName,path,newPath;

    form
        .on('field', function(field, value) {

            inFolder = value; // Save the Folder's Id which will contain the files.

        })
        .on('file', function(field, file) {

            // Save the Temp variables
            name = file.name;
            tArr = name.split('.');
            var rName = Math.floor((Math.random() * 99999999) + 1) + '_' + Math.floor((Math.random() * 99999999) + 1) + '.' + tArr[1];
            newPath = join(dir, rName);

            fs.rename(file.path, newPath, function(err){
                if(err) {

                    /**
                     * Log the occurred error.
                     */

                    console.error('An Error occurred while trying to Upload File in Project\'s Storage, in the Server\'s File System Project ( method \'storageUploadFile\', in projectServerController ) :');
                    console.error(err);

                } else {

                    var fileDBInfo = { // The Object of each Uploaded File;
                        name: file.name,
                        realName: rName,
                        fileType: file.type,
                        size: file.size,
                        inFolder: inFolder,
                        project: req.params.projectId,
                        user: req.user,
                        type: 2
                    };

                    var fileDB = new PStorage(fileDBInfo);
                    fileDB.save(function(err) {
                        if (err) {

                            /**
                             * Log the occurred error.
                             */

                            console.error('An Error occurred while trying to save the Project\'s new File Data in MongoDB ( method \'storageUploadFile\', in projectServerController ) :');
                            console.error(err);

                        } else {

                            /**
                             * The File's Data is saved in MongoDB successfuly,
                             * so now we can push the File's Data in our Callback File's Array
                             */

                            callbackFiles.push(fileDBInfo);

                        }
                    });

                }
            });
        })
        .on('end', function(){

            /**
             * Parsing of the Requested From has Ended,
             * so now we can end the Request,
             * by Responding with the path the upladed files. 
             */

            res.writeHead(res.statusCode.toString(), {'content-type': 'text/plain'});
            res.write(JSON.stringify(callbackFiles));
            res.end();
        });

    /**
     * Parse the Requested Form
     */ 
    form.parse(req);
};



/**
 * Module middlewares
 */


/**
 * Middleware for checking Project's existance
 * in the Database
 */

exports.projectByID = function(req, res, next, id) {

    Project.findById(id).exec(function(err, project) {

        if (err) return next(err);
        if (!project) return next(new Error('Failed to load project ' + id));

        req.project = project;
        
        next();

    });

};


/**
 *  Middleware for checking that user is the admin of the Project
 */

exports.hasAuthorization = function(req, res, next) {

    if (req.body.user._id !== req.user.id){
        return res.send(403, 'User is not authorized');
    }

    next();

};