'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;

		$scope.menu = [{
            title: 'Облак',
            link: 'storage',
            icon: 'glyphicon-cloud',
            uiRoute: '/storage'
        }, {
            title: 'Проекти',
            link: 'projects',
            icon: 'glyphicon-th-large',
            uiRoute: '/projects'
        }, {
            title: 'Редактор',
            link: 'editor',
            icon: 'glyphicon-edit',
            uiRoute: '/editor'
        }
        ];

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};
	}
]);