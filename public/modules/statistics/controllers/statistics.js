'use strict';

angular.module('statistics').controller('StatisticsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Statistics',
    function($scope, $stateParams, $location, Authentication, Statistics) {

        // scope variables
        $scope.authentication = Authentication;

        $scope.get = function() {
            Statistics.query(function(statistics){
                $scope.statistics = statistics[0];
            });
        };

    }
]);

