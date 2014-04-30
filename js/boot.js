require([
    'ionic-angular',
    'phasher',
    'controllers',
    'directives',
    'filters'
], function(angular, phasher) {
    'use strict';
    var $html = angular.element(document.getElementsByTagName('html')[0]);

    $html.ready(function() {
        angular.resumeBootstrap(['phasher']);
    });
});