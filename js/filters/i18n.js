define(['phasher', 'services/localization'], function(phasher) {

    phasher.filter('i18n', ['localizationService', function(localizationService){
        return function(input){
            return localizationService.getLocalizedString(input);
        }
    }]);

})