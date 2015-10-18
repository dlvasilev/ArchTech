'use strict';

// Setting up route
angular.module('storage').config(['$stateProvider',
    function($stateProvider) {
        // Storage state routing
        $stateProvider.
            state('storageExplorer', {
                url: '/storage',
                templateUrl: 'modules/storage/views/explorer.html'
            });
    }
]);