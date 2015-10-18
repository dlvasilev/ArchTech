'use strict';

//Project Storage service used for communicating with the storage REST endpoints
angular.module('projects').factory('ProjectsStorage', ['$resource', function($resource) {

    return $resource('projects/:projectId/storage/:inFolder', {
        projectId: '@pid',
        inFolder: '@id'
    }, {
        openFolder: {
            method: 'GET',
            isArray: true
        },
        init: {
            method: 'GET',
            isArray: true
        }
    });

}]);