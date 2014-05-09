define(['app', 'jquery', 'lodash', 'ui-bootstrap', 'ui-bootstrap-tpls'], function(app, $, _) {

    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substrRegex;

            matches = [];

            substrRegex = new RegExp(q, 'i');

            _.each(strs, function(str) {
                if(substrRegex.test(str)) {
                    matches.push({ value: str });
                }
            });

            cb(matches);
        };
    };

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