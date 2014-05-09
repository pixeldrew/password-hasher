define(['angular', 'ionic-angular', 'ionic-frostedglass', 'util/string'], function(angular) {

    'use strict';

    var app = angular.module('phasher', ['ionic', 'ui.bootstrap'])

        .config(['$compileProvider', function($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
        }])
        .config(['$stateProvider', function($stateProvider) {

            $stateProvider
                .state('tab-home', {
                    url: '/home',
                    views: {
                        'tab-home': {
                            templateUrl: 'templates/home.html'
                        }
                    }
                })
                .state('tab-settings', {
                    url: '/settings',
                    views: {
                        'tab-settings': {
                            templateUrl: 'templates/settings.html'
                        }
                    }
                })
                .state('tab-export', {
                    url: "/settings/export",
                    views: {
                        'tab-settings': {
                            templateUrl: "facts2.html"
                        }
                    }
                })

        }])
        .run(['$ionicPlatform', '$state', function($ionicPlatform, $state) {
            if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {

                $ionicPlatform.ready(function() {
                    // device is ready
                    $state.go('tab-home');
                });

            } else {
                $state.go('tab-home');
            }

        }]);

    var $html = angular.element(document.getElementsByTagName('html')[0]);

    $html.ready(function() {
        angular.resumeBootstrap([app.name]);
    });

    return app;

});