angular.module('app.controllers', [])


.controller('menuCtrl', function($scope, $ionicModal, $window, $rootScope, $timeout, $auth, toastr, $http, $state) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.data = {};
    $scope.isAuth = $auth.isAuthenticated();


    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    // Open the login modal
    $scope.openModal = function() {
        $scope.data = {};
        $scope.modal.show();
    };
    $scope.closeWithRemove = function() {
        $scope.modal.remove()
            .then(function() {
                $scope.modal = null;
            });
    };

    $scope.closeWithoutRemove = function() {
        $scope.modal.hide();
    };

    //Uncomment for login
    $timeout(function() {
        /*if ($window.localStorage.currentUser) {
            $state.go('menu.home');
        } else {*/
        $scope.modal.show();



    }, 100)

    $scope.$$postDigest(function() {

    });

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        if ($scope.data.email === "" || $scope.data.password === "") {
            toastr.error('Error al ingresar los datos', 'Error');
            return;
        }
        $http.get('http://localhost:8080/api/auth/login', { params: $scope.data })
            .success(function(data, status, headers, config) {
                $window.localStorage.currentUser = JSON.stringify(data.user);
                $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
                $timeout(function() {
                    //console.log($auth.isAuthenticated());
                    $scope.isAuth = $auth.isAuthenticated();
                    toastr.success('Usuario autenticado', 'Success');
                    $scope.closeWithoutRemove();
                    $state.go('menu.home');
                }, 1000);
            })
            .error(function(data, status, header, config) {
                //console.log(data);
                var msg = data.message;
                if (msg.email) {
                    toastr.error(data.message.email, 'Error');
                } else {
                    toastr.error(data.message.password, 'Error');
                }
            });
        /*$auth.login({ email: $scope.data.username, password: $scope.data.password })
            .then(function(response) {
                console.log(response);
                $window.localStorage.currentUser = JSON.stringify(response.data.user);
                $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
                $timeout(function() {
                    console.log($auth.isAuthenticated());
                    $scope.isAuth = $auth.isAuthenticated();
                    toastr.success('Usuario autenticado', 'Success');
                    $scope.closeWithoutRemove();
                }, 1000);
            })
            .catch(function(response) {
                console.log(response);
                var msg = response.data.message;
                if (msg.email) {
                    toastr.error(response.data.message.email, 'Error');
                } else {
                    toastr.error(response.data.message.password, 'Error');
                }

            });*/

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            //--------$scope.closeLogin();
        }, 1000);
    };
})

.controller('resultsCtrl', function($scope, $ionicModal, $window, $rootScope, $timeout, $auth, toastr, $http, $state) {



    $scope.$$postDigest(function() {
        console.log($rootScope.currentUser);
        var objeto = $rootScope.currentUser;
        $http({
            method: 'POST',
            url: 'http://localhost:8080/api/results/getResults',
            data: objeto
        }).then(function successCallback(response) {
            $scope.results = response.data;
        }, function errorCallback(response) {
            console.log("ERROR");
        });
    });



    $scope.select = function(index) {
        $rootScope.selectedResult = $scope.results[index];
        $rootScope.selectedResult.notificationDatetime.replace("T", " - ");
        $rootScope.selectedResult.notificationDatetime.replace("Z", " ");
    };
})



.controller('enviarMuestraCtrl', function($scope, $http, $stateParams, $state, $ionicSideMenuDelegate, $ionicPopup, toastr, $rootScope) {

        $scope.imageStrings = [];
        $scope.analysisArray = {};
        $scope.diseaseID = -1;

        $scope.$$postDigest(function() {
            $scope.getDiseases();
        });

        //Makes the button open the side menu
        $scope.openMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
        }

        $scope.processFiles = function(files) {
            angular.forEach(files, function(flowFile, i) {
                var fileReader = new FileReader();
                fileReader.onload = function(event) {
                    var uri = event.target.result;
                    $scope.imageStrings[i] = uri;
                };
                fileReader.readAsDataURL(flowFile.file);
            });
        };

        $scope.setDiseaseId = function(id) {
            $scope.diseaseID = id;
        }

        $scope.sendSample = function() {
            var valid = document.getElementById('description').value != "" && $scope.diseaseID != -1;
            if (valid) {
                var uploadedImage = $scope.imageStrings[0];
                $scope.analysisArray = {
                    "userId": $rootScope.currentUser.userId,
                    "processId": $scope.diseaseID,
                    "description": document.getElementById('description').value,
                    "image": uploadedImage
                };
                console.log($scope.analysisArray);
                $scope.uploadSample();
            } else {
                toastr.error('Revisa el formulario, no pueden haber campos sin rellenar', 'Error');
            }
        }

        $scope.getDiseases = function() {
            var objeto = {

                Id: $rootScope.currentUser.userId //Should be sessionStorage
            }
            $http({
                method: 'POST',
                url: 'http://localhost:8080/api/processes/getProcesses',
                data: objeto
            }).then(function successCallback(response) {
                $scope.diseaseList = response.data;
            }, function errorCallback(response) {
                console.log("ERROR");
            });
        }

        $scope.uploadSample = function() {
            $http({
                method: 'POST',
                url: 'http://localhost:8080/api/analysis/uploadAnalysis',
                data: $scope.analysisArray
            }).then(function successCallback(response) {
                console.log(response.data);

                $ionicPopup.alert({
                    title: 'Éxito',
                    content: 'Se ha enviado correctamente la información'
                }).then(function(res) {
                    $state.go('menu.home');
                    location.reload();
                });

            }, function errorCallback(response) {
                console.log("ERROR");
            });
        }

        $scope.cancel = function() {
            $state.go('menu.home');
            location.reload();
        }

    }
)

.controller('detalleDeResultadoCtrl', ['$scope', '$stateParams', '$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $rootScope) {
        $scope.data = $rootScope.selectedResult;


    }
])

.controller('homeCtrl', ['$scope', '$stateParams', '$rootScope', '$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $rootScope, $ionicSideMenuDelegate) {
        $scope.$$postDigest(function() {
            $scope.user = $rootScope.currentUser;
        });

        //Makes the button open the side menu
        $scope.openMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
        }


    }
])

.controller('perfilCtrl', ['$scope', '$stateParams', '$rootScope', '$window', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $rootScope, $window) {
        $scope.$$postDigest(function() {
            console.log($rootScope.currentUser);
            $scope.userData = $rootScope.currentUser;
        });

    }
])