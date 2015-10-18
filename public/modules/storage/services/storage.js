'use strict';

//Storage service used for communicating with the storage REST endpoints
angular.module('storage').factory('Storage', ['$resource', function($resource) {
    return $resource('storage/:inFolder', { inFolder: '@id' }, {openFolder: { method: 'GET', isArray: true }});
}]);