define(['app', 'services/localization'], function(app) {

    app.directive('i18n', ['LocalizationService', function(localizationService){
        return {
            restrict:'A',
            link:function (scope, elm, attrs) {
                var string = localizationService.getLocalizedString(attrs.i18n);
                elm.text(string);
            }
        };
    }]);
});