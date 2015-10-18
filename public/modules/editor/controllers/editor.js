'use strict';

angular.module('editor').controller('EditorController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'webStorage', 'Storage', 'Projects', 'ProjectsStorage',
    function($scope, $stateParams, $location, $http, Authentication, webStorage, Storage, Projects, ProjectsStorage){

        $scope.authentication = Authentication;

        $scope.type = 'file';

        if($stateParams.projectId) {
            $scope.type = 'project';
            Projects.get({
                projectId: $stateParams.projectId
            }, function(project) {
                $scope.project = project;
            });
        }

        $scope.init = function(){
            console.log('Editor things');
        };

        $scope.home = function(){
            Projects.query(function(projects) {
                $scope.projects = projects;
            });
        };

        $scope.openedFiles = webStorage.session.get('openedFiles');

        $scope.openProject = function(){

            $scope.sortFilesBy = 'type';
            $scope.selected = '';
            $scope.dir = '0';
            $scope.storageDir = '0';
            $scope.path = [];

            Projects.get({
                projectId: $stateParams.projectId
            }, function(project) {
                $scope.project = project;
            });

            ProjectsStorage.init({
                projectId: $stateParams.projectId
            }, function(files) {
                $scope.storage = files;
            });

            $scope.refreshFolder = function(){
                $scope.storage = ProjectsStorage.openFolder({ projectId: $stateParams.projectId, inFolder: $scope.dir });
            };

            $scope.storageChangeSelected = function(){
                $scope.selected = this.file._id;
            };

            $scope.storageOpen = function(){
                if($scope.selected !== '') {
                    $scope.storage = ProjectsStorage.openFolder({
                        projectId: $stateParams.projectId,
                        inFolder: $scope.selected
                    });
                    $scope.dir = $scope.selected;
                    $scope.storageDir = $scope.selected;
                    $scope.path.push({
                        name: angular.element('#storage-file-' + $scope.selected).data('name'),
                        id: $scope.selected
                    });
                    $scope.selected = '';
                }
            };

            $scope.storageBack = function(){
                if($scope.path.length >= 2){
                    var backDir = $scope.path[$scope.path.length - 2];
                    $scope.storage = ProjectsStorage.openFolder({ projectId: $stateParams.projectId, inFolder: backDir.id });
                    $scope.dir = $scope.selected;
                    $scope.storageDir = $scope.selected;
                    $scope.path.splice($scope.path.length - 1, 1);
                } else {
                    $scope.storage = ProjectsStorage.openFolder({ projectId: $stateParams.projectId, inFolder: '0' });
                    $scope.dir = '0';
                    $scope.storageDir = '0';
                    $scope.path = [];
                }
                $scope.selected = '';
            };

            $scope.openFile = function(){
                if($scope.selected !== '') {
                    if(angular.element('#storage-file-' + $scope.selected).data('type') === 1){
                        $scope.storage = ProjectsStorage.openFolder({
	                        projectId: $stateParams.projectId,
	                        inFolder: $scope.selected
	                    });
                        $scope.dir = $scope.selected;
                        $scope.path.push({
                            name: angular.element('#storage-file-' + $scope.selected).data('name'),
                            id: $scope.selected
                        });
                        $scope.selected = '';
                    } else {
                        var openedFiles = [], newFile = true;
                        if(webStorage.session.get('openedFiles')){
                            openedFiles = webStorage.session.get('openedFiles');

                            for(var i = 0; i < openedFiles.length; i++){
                                if(openedFiles[i].id === $scope.selected){
                                    newFile = false;
                                }
                            }

                            if(newFile === true){
                                openedFiles.push({
                                    type: 2,
                                    name: angular.element('#storage-file-' + $scope.selected).data('name'),
                                    id: $scope.selected,
                                    fromName: angular.element('#storage-file-' + $scope.selected).data('project'),
                                    fromId: angular.element('#storage-file-' + $scope.selected).data('projectid')
                                });
                                webStorage.session.add('openedFiles', openedFiles);
                            }
                        } else {
                            openedFiles.push({
                                type: 2,
                                name: angular.element('#storage-file-' + $scope.selected).data('name'),
                                id: $scope.selected,
                                fromName: angular.element('#storage-file-' + $scope.selected).data('project'),
                                fromId: angular.element('#storage-file-' + $scope.selected).data('projectid')
                            });
                            webStorage.session.add('openedFiles', openedFiles);
                        }

                        $scope.selected = '';
                        $location.path('/editor');
                    }
                }
            };
        };

        $scope.closeFile = function(file){
            var fileId = file;

            var openedFiles = webStorage.session.get('openedFiles');

            for(var i = 0; i < openedFiles.length; i++){
                if(openedFiles[i].id === fileId){

                    if(i === 0){
                        openedFiles.splice(0, 1);
                    } else {
                        openedFiles.splice(i, 1);
                    }
                    webStorage.session.add('openedFiles', openedFiles);

                    $scope.openedFiles = openedFiles;
                }
            }

        };

        $scope.openFileProject = function(){
            $scope.file = null;
            $http.get('/editor/project/file/' + $stateParams.fileId).success(function(response){
                $scope.file = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        if($scope.type === 'project') {
            $http.get('/messenger/get/' + $stateParams.fileId).success(function(response){
                $scope.messages = response;
                console.log(response);
            }).error(function(response) {
                $scope.error = response.message;
            });
        }
    }
]);