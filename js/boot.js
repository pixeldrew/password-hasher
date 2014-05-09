require(['angular', 'app', 'filters', 'directives/i18n', 'controllers'], function(angular, app) {
    var $html = angular.element(document.getElementsByTagName('html')[0]);

    $html.ready(function() {
        angular.resumeBootstrap([app.name]);
    });
});
