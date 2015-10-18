'use strict';

angular.module('projects').controller('ProjectsFilesUploadController', ['$scope', '$stateParams', 'ProjectsStorage',
    function($scope, $stateParams, ProjectsStorage) {
        // FILE UPLOAD

        $scope.fileUpload = {};
        var dropbox = document.getElementById('dropbox');
        $scope.fileUpload.dropText = 'Плъзни файловете тук...';
        $scope.fileUpload.files = [];

        // init event handlers
        function dragEnterLeave(evt){
            evt.stopPropagation();
            evt.preventDefault();
            $scope.$apply(function(){
                $scope.fileUpload.dropText = 'Плъзни файловете тук...';
                $scope.fileUpload.dropClass = '';
            });
        }

        dropbox.addEventListener('dragenter', dragEnterLeave, false);
        dropbox.addEventListener('dragleave', dragEnterLeave, false);
        dropbox.addEventListener('dragover', function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var clazz = 'not-available';
            var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0;
            $scope.$apply(function(){
                $scope.fileUpload.dropText = ok ? 'Плъзни файловете тук...' : 'Само файлове са позволени!';
                $scope.fileUpload.dropClass = ok ? 'over' : 'not-available';
            });
        }, false);

        dropbox.addEventListener('drop', function(evt) {
            console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)));
            evt.stopPropagation();
            evt.preventDefault();
            $scope.$apply(function(){
                $scope.fileUpload.dropText = 'Плъзни файловете тук...';
                $scope.fileUpload.dropClass = '';
            });

            var files = evt.dataTransfer.files;
            if (files.length > 0) {
                $scope.$apply(function(){
                    for (var i = 0; i < files.length; i++) {
                        $scope.fileUpload.files.push(files[i]);
                    }
                });
            }
        }, false);

        $scope.fileUpload.setFiles = function(element) {
            $scope.$apply(function($scope) {
                console.log('files:', element.files);
                // Turn the FileList object into an Array
                for (var i = 0; i < element.files.length; i++) {
                    $scope.fileUpload.files.push(element.files[i]);
                }
                $scope.fileUpload.progressVisible = false;
            });
        };

        $scope.fileUpload.uploadFile = function() {
            var fd = new FormData();
            fd.append('field', $scope.dir);
            for (var i = 0; i < $scope.fileUpload.files.length; i++) {
                fd.append('file', $scope.fileUpload.files[i]);
            }
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', uploadProgress, false);
            xhr.addEventListener('load', uploadComplete, false);
            xhr.addEventListener('error', uploadFailed, false);
            xhr.addEventListener('abort', uploadCanceled, false);
            xhr.open('POST', '/projects/'+$stateParams.projectId+'/storage/server-upload-file');
            $scope.fileUpload.progressVisible = true;
            xhr.send(fd);
        };

        function uploadProgress(evt) {
            $scope.$apply(function(){
                if (evt.lengthComputable) {
                    $scope.fileUpload.progress = Math.round(evt.loaded * 100 / evt.total);
                } else {
                    $scope.fileUpload.progress = 'няма връзка със сървъра';
                }
            });
        }

        function uploadComplete(evt) {
            setTimeout(function(){
                $scope.refreshFolder();
                angular.element('#upload-file-modal').modal('hide');
                $scope.fileUpload.progressVisible = false;
                $scope.fileUpload.files = [];
            }, 1000);
        }

        function uploadFailed(evt) {
            alert('Моля опитайте по-късно...');
        }

        function uploadCanceled(evt) {
            $scope.$apply(function(){
                $scope.fileUpload.progressVisible = false;
            });
            alert('Качването беше отказано или се загуби връзката със сървъра...');
        }
    }
]);