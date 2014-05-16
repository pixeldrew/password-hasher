define(['app', 'util/integer', 'directives/site-list', 'services/password-hasher', 'services/user-data', 'services/localization'], function(app, Integer) {

    function bumpTag(tag) {
        var bump = 1, re = new RegExp("^([^:]+?)(:([0-9]+))?$"), matcher;

        matcher = re.exec(tag);

        if(null != matcher[3]) {
            tag = matcher[1];
            bump += parseInt(matcher[3]);
        }

        return tag + ':' + bump;
    }

    app.controller('Home', ['$scope', 'PasswordHasherService', 'UserDataService', 'LocalizationService',
        function($scope, passwordHasherService, userDataService) {

        $scope.password = '';
        $scope.config = {};
        $scope.config.tag = '';
        $scope.config.password = '';
        $scope.config.showAdvanced = false;

        userDataService.getDefaults().then(function(config) {
            $scope.config.seed = config.seed;
            $scope.config.length = new Integer(config.length);
            $scope.config.strength = new Integer(config.strength);

            if(config = userDataService.getLastInput()) {
                $scope.config = config;

                $scope.hashPassword();
            }
        });

        userDataService.getAllTags().then(function(tags) {
            $scope.sites = tags;
        });

        $scope.bump = function() {
            $scope.config.tag = bumpTag($scope.config.tag);
            $scope.saveAndHash();
        };

        $scope.getConfig = function() {

            userDataService.getTag($scope.config.tag).then(function(tag) {

                if(tag) {
                    $scope.config.seed = tag.seed;
                    $scope.config.length = new Integer(tag.length);
                    $scope.config.strength = new Integer(tag.strength);

                    $scope.hashPassword();

                    $scope.$apply();
                }

            });

        };

        $scope.newSeed = function() {
            $scope.config.seed = String.UUID();
            $scope.saveAndHash();
        };

        $scope.copySaveAndHash = function() {
            $scope.copy();
            $scope.saveAndHash();
        };

        $scope.saveAndHash = function() {
            $scope.saveConfig();
            $scope.hashPassword();
        };

        $scope.hashPassword = function() {

            if($scope.config.tag === '' && $scope.password === '') {
                $scope.hashedPassword = '';
                return;
            }

            var salt = passwordHasherService.generateHashWord($scope.config.seed, $scope.config.tag, 24, true, true, true, false, false);

            $scope.hashedPassword = passwordHasherService.generateHashWord(salt, $scope.config.password, $scope.config.length.value,
                true, // require
                    $scope.config.strength.value > 1, // require punctuation
                true, // require mixed case
                    $scope.config.strength.value < 2, // require special characters
                    $scope.config.strength.value == 0 // only digits
            );

            userDataService.setLastInput($scope.config);

        };

        $scope.copy = function() {
            var clipboard = window.cordova.plugins.clipboard || window.plugins.clipboard,
                toast = window.plugins.toast;

            clipboard.copy($scope.hashedPassword,
                function() {
                    toast.showShortCenter(localizationService.getLocalizedString('home.copied'));
                });
        };

        $scope.saveConfig = function() {
            if($scope.config.password !== '' && $scope.config.tag !== '') {

                var config = $.extend({}, $scope.config);

                config.length = config.length.value;
                config.strength = config.strength.value;

                userDataService.saveTag($scope.config.tag, config);
            }
        }

    }]);

});