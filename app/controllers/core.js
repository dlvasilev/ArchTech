'use strict';

/**
 * File: core.js
 * Role: Backend Controller
 * Description: The controller for the core methods of the application.
 * Project: archtech
 * Author: Daniel Vasilev
 * Date: 2014-2015
 */





/**
 * Module methods.
 */

/**
 *	Render the Index page of the SPA App.
 */
exports.index = function(req, res) {

	/**
	 * Respond by rendering the index.html file
	 * and sending User's information.
	 */

	res.render('index.html', {
		user: req.user || null
	});
};