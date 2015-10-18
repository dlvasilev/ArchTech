'use strict';

var path = require('path'),
	rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	app: {
		title: 'ArchTech - Система за съвместна графична обработка',
		description: 'Online Image Editor',
		keywords: 'ArchTech'
	},
	root: rootPath,
	port: 3000,
	templateEngine: 'swig',
	sessionSecret: 'ArchTech_MEAN',
	sessionCollection: 'sessions'
};
