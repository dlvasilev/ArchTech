'use strict';

// Setting up route
angular.module('statistics').config(['$stateProvider',
    function($stateProvider) {
        // Storage state routing
        $stateProvider.
            state('getAllStatistics', {
                url: '/statistics',
                templateUrl: 'modules/storage/views/statistics.html'
            });
    }
]);