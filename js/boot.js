require([
    'ionic-angular',
    'controllers'
], function(angular) {
    'use strict';
    var $html = angular.element(document.getElementsByTagName('html')[0]);

    $html.ready(function() {
        angular.resumeBootstrap(['phasher']);
    });
});