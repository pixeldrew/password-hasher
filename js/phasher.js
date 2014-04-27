define(['angular', 'jquery', 'lawnchair', 'ionic-angular', 'lawnchair-indexed-db', 'util/string'], function(angular, $, Lawnchair) {

    'use strict';

    // setup database
    var pconfig;
    pconfig = new Lawnchair({
        display: "Phasher Config",
        name: 'pconfig',
        version: "1.0",
        adaptor: 'indexed-db'
    }, function(lc) {
        return lc;
    });

    var phasher = angular.module('phasher', ['ionic', 'ui.bootstrap'])

        .config(['$compileProvider', function($compileProvider) {
            // Set the whitelist for certain URLs just to be safe
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
        }])
        .config(['$stateProvider', function($stateProvider) {
            // Set up the initial routes that our app will respond to.
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
            $ionicPlatform.ready(function() {
                // device is ready
            });

            $state.go('tab-home');

        }]);

    return phasher;

});