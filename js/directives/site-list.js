define(['app', 'ui-bootstrap', 'ui-bootstrap-tpls'], function(app) {

    app.directive('siteList', function() {

        return {
            'restrict': 'E',
            'scope': {
                ngModel: '=',
                sites: '=?',
                ngChange: '&?'
            },
            'template': '<input type="text" typeahead-wait-ms="300" ng-change="ngChange()" typeahead="site for site in sites | filter:$viewValue" ng-model="ngModel">',
            'link': function(scope, element, attrs) {
                element.find('input').on('blur', function() {
                    if(scope.ngChange) {
                        scope.ngChange();
                    }
                });
            }
        };
    });

});