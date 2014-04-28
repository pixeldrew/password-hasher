define(['phasher', 'util/integer', 'directives/site-list', 'factories/password-hasher', 'factories/user-data'], function(phasher, Integer) {

    function bumpTag(tag) {
        var bump = 1, re = new RegExp("^([^:]+?)(:([0-9]+))?$"), matcher;

        matcher = re.exec(tag);

        if(null != matcher[3]) {
            tag = matcher[1];
            bump += parseInt(matcher[3]);
        }

        return tag + ':' + bump;

    }

    phasher.controller('HomeCtrl', ['$scope', 'PasswordHasher', 'UserData', function($scope, passwordHasher, userData) {

        $scope.password = '';
        $scope.config = {};
        $scope.config.tag = '';
        $scope.config.password = '';
        $scope.config.showAdvanced = false;

        userData.getDefaults().then(function(config) {
            $scope.config.seed = config.seed;
            $scope.config.length = new Integer(config.length);
            $scope.config.strength = new Integer(config.strength);
        });

        userData.getAllTags().then(function(tags) {
            $scope.sites = tags;
        });

        $scope.bump = function() {
            $scope.config.tag = bumpTag($scope.config.tag);
            $scope.saveAndHash();
        };

        $scope.getConfig = function() {

            userData.getTag($scope.config.tag).then(function(tag) {

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

            var salt = passwordHasher.generateHashWord($scope.config.seed, $scope.config.tag, 24, true, true, true, false, false);

            $scope.hashedPassword = passwordHasher.generateHashWord(salt, $scope.config.password, $scope.config.length.value,
                true, // require
                    $scope.config.strength.value > 1, // require punctuation
                true, // require mixed case
                    $scope.config.strength.value < 2, // require special characters
                    $scope.config.strength.value == 0 // only digits
            );

        };

        $scope.copy = function() {
            // todo copy to clipboard
        };

        $scope.saveConfig = function() {
            if($scope.config.password !== '' && $scope.config.tag !== '') {

                var config = $.extend({}, $scope.config);

                delete config.tag;
                delete config.password;
                delete config.showAdvanced;

                config.length = config.length.value;
                config.strength = config.strength.value;

                userData.saveTag($scope.config.tag, config);
            }
        }

    }]);

});