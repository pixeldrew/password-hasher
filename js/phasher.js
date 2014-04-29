define(['angular', 'ionic-angular', 'ionic-frostedglass', 'util/string'], function(angular) {

    'use strict';

    var phasher = angular.module('phasher', ['ionic', 'ui.bootstrap'])

        .config(['$compileProvider', function($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
        }])
        .config(['$stateProvider', function($stateProvider) {

            $stateProvider.state('tab-home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/home.html'
                    }
                }
            });

            $stateProvider.state('tab-settings', {
                url: '/settings',
                views : {
                    'tab-settings': {
                        templateUrl: 'templates/settings.html'
                    }
                }
            });

        }])
        .run(['$ionicPlatform', '$state', function($ionicPlatform, $state) {
            if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {

                $ionicPlatform.ready(function() {
                    // device is ready
                    $state.go('tab-home');
                });

            } else {
                $state.go('tab-home');
            }

        }]);

    return phasher;

});