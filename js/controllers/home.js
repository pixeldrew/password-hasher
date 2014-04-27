define(['phasher', 'directives/site-list', 'factories/password-hasher', 'factories/user-data'], function(phasher) {

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
            $scope.config.length = config.length;
            $scope.config.strength = config.strength;
        });

        userData.getAllTags().then(function(tags) {
            $scope.sites = tags;
        });

        $scope.bump = function() {
            $scope.config.tag = bumpTag($scope.config.tag);
        };

        $scope.newSeed = function() {
            $scope.config.seed = String.UUID();
        };

        $scope.changeStrength = function(val) {
            $scope.config.strength = val;

            $scope.hashPassword();

        };

        $scope.copySaveAndHash = function() {

            $scope.saveAndHash();
        };

        $scope.saveAndHash = function() {

            $scope.hashPassword();
        };

        $scope.hashPassword = function() {

            if($scope.config.tag === '' && $scope.password === '') {
                $scope.hashedPassword = '';
                return;
            }

            var salt = passwordHasher.generateHashWord($scope.config.seed, $scope.config.tag, 24, true, true, true, false, false);

            $scope.hashedPassword = passwordHasher.generateHashWord(salt, $scope.config.password, $scope.config.length,
                true, // require
                    $scope.config.strength > 1, // require punctuation
                true, // require mixed case
                    $scope.config.strength < 2, // require special characters
                    $scope.config.strength == 0 // only digits
            );

        };

        $scope.copy = function() {
            // todo copy to clipboard
        };

        $scope.saveConfig = function() {
            if($scope.password !== '' && $scope.config.tag !== '') {
                userData.saveTag($scope.config);
            }
        }

    }]);

});