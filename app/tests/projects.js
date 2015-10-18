'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Project = mongoose.model('Project');

/**
 * Globals
 */
var user, project;

/**
 * Unit tests
 */
describe('Project Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
            id: '12293185012839012731201231'
		});

		user.save(function() {
			project = new Project({
				title: 'Project Title',
				content: 'Project Content',
				user: user.id
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return project.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			project.title = '';

			return project.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Project.remove().exec();
		User.remove().exec();
		done();
	});
});