angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('menu.enviarMuestra', {
        url: '/upload',
        views: {
            'side-menu21': {
                templateUrl: 'templates/enviarMuestra.html',
                controller: 'enviarMuestraCtrl'
            }
        }
    })

    .state('menu.home', {
        url: '/home',
        views: {
            'side-menu21': {
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl'
            }
        }
    })

    .state('menu', {
        url: '/side-menu21',
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
    })


    .state('menu.resultados', {
        url: '/resultados',
        views: {
            'side-menu21': {
                templateUrl: 'templates/resultados.html',
                controller: 'resultsCtrl'
            }
        }
    })

    .state('menu.detalleDeResultado', {
        url: '/detalleDeResultado',
        views: {
            'side-menu21': {
                templateUrl: 'templates/detalleDeResultado.html',
                controller: 'detalleDeResultadoCtrl'
            }
        }
    })



    .state('menu.perfil', {
        url: '/perfil',
        views: {
            'side-menu21': {
                templateUrl: 'templates/perfil.html',
                controller: 'perfilCtrl'
            }
        }
    })



    $urlRouterProvider.otherwise('/side-menu21/home')



    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/app');



});