'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('projects').factory('Projects', ['$resource', function($resource) {
    return $resource('projects/:projectId', {
        articleId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);