'use strict';

angular.module('storage').controller('StorageController', ['$scope', '$stateParams', '$http', '$compile', '$location', 'Authentication', 'webStorage', 'Storage', 'Statistics',
    function($scope, $stateParams, $http, $compile, $location, Authentication, webStorage, Storage, Statistics) {

        // scope variables
        $scope.authentication = Authentication;
        $scope.sortFilesBy = 'type';
        $scope.selected = '';
        $scope.dir = '0';
        $scope.path = [];

        $scope.init = function() {
            Storage.query(function(files) {
                $scope.storage = files;
            });
        };

        $scope.getStatistics = function() {
            Statistics.query(function(statistics) {
                $scope.statistics = statistics[0];
            });
        };

        $scope.create = function() {
            var storage = new Storage({
                name: this.folderName,
                realName: this.folderName,
                fileType: 'Папка',
                size: '',
                inFolder: $scope.dir,
                user: Authentication.user._id,
                type: 1,
                active: 1
            });

            storage.$save(function(response) {
                $scope.storage = Storage.openFolder({ inFolder: $scope.dir});
                Statistics.update({ command: 'update' });
                angular.element('#create-folder-modal').modal('hide');
                Statistics.query(function(statistics) {
                    $scope.statistics = statistics[0];
                });
            });
            this.folderName = '';
        };


        $scope.delete = function(){
            if($scope.selected !== '') {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/storage/remove/'+$scope.selected);
                xhr.send($scope.selected);
                Statistics.update({ command: 'update' });
                $scope.storage = Storage.openFolder({
                    inFolder: $scope.dir
                });
                Statistics.query(function(statistics) {
                    $scope.statistics = statistics[0];
                });
            }
        };

        $scope.download = function(){
            if($scope.selected !== '') {
                $http({method: 'GET', url: '/storage/download/'+$scope.selected}).
                    success(function(data, status, headers, config) {
                        var element = angular.element('<a/>');
                        element.attr({
                            href: '/storage/download/'+$scope.selected,
                            target: '_blank',
                            download: angular.element('#storage-file-' + $scope.selected).data('name')
                        })[0].click();
                    }).
                    error(function(data, status, headers, config) {
                        // if there's an error you should see it here
                    });
            }
        };

        $scope.open = function(){
            if($scope.selected !== '') {
                if(angular.element('#storage-file-' + $scope.selected).data('type') === 1){
                    $scope.storage = Storage.openFolder({
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
                                type: 1,
                                name: angular.element('#storage-file-' + $scope.selected).data('name'),
                                id: $scope.selected,
                                fromName: 'Облак',
                                fromId: ''
                            });
                            webStorage.session.add('openedFiles', openedFiles);
                        }
                    } else {
                        openedFiles.push({
                            type: 1,
                            name: angular.element('#storage-file-' + $scope.selected).data('name'),
                            id: $scope.selected,
                            fromName: 'Облак',
                            fromId: ''
                        });
                        webStorage.session.add('openedFiles', openedFiles);
                    }

                    $scope.selected = '';
                    $location.path('/editor');
                }
            }
        };

        $scope.back = function(){
            if($scope.path.length >= 2){
                var backDir = $scope.path[$scope.path.length - 2];
                $scope.storage = Storage.openFolder({ inFolder: backDir.id });
                $scope.dir = $scope.selected;
                $scope.path.splice($scope.path.length - 1, 1);
            } else {
                $scope.storage = Storage.openFolder({ inFolder: '0' });
                $scope.dir = '0';
                $scope.path = [];
            }
            $scope.selected = '';
        };

        $scope.changeSelected = function(){
            $scope.selected = this.file._id;
        };

        /* Cloud Storage */

        $scope.openCloudFolder = function(){
            if(this.file.type === 1){
                $scope.storage = Storage.openFolder({
                    inFolder: $scope.selected
                });
                $scope.dir = $scope.selected;
                $scope.path.push({
                    name: angular.element('#storage-file-cloud-' + $scope.selected).data('name'),
                    id: $scope.selected
                });
                $scope.selected = '';
            }
        };

        $scope.uploadFileCloud = function(){
            if($scope.selected !== ''){
                $http.post('/storage/upload-file-cloud', { id: $stateParams.projectId, file: $scope.selected, folder: $scope.dir }).success(function(response){
                    angular.element('#upload-file-cloud-modal').modal('hide');
                    $scope.refreshFolder();
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }
        };

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

        $scope.fileUpload.uploadFile = function(){
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
            xhr.open('POST', '/storage/server-upload-file');
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
                Statistics.update({ command: 'update' });
                $scope.storage = Storage.openFolder({ inFolder: $scope.dir});
                angular.element('#upload-file-modal').modal('hide');
                $scope.fileUpload.progressVisible = false;
                $scope.fileUpload.files = [];
                Statistics.query(function(statistics) {
                    $scope.statistics = statistics[0];
                });
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

