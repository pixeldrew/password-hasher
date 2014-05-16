define(['app', 'services/localization'], function(app) {

    app.filter('i18n', ['LocalizationService', function(localizationService){
        return function(input){
            return localizationService.getLocalizedString(input);
        }
    }]);

});