define(['phasher', 'jquery', 'util/integer', 'factories/user-data'], function(phasher, $, Integer) {

    phasher.controller('SettingsCtrl', ['$scope', 'UserData', function($scope, userData) {

        $scope.config = {};

        userData.getDefaults().then(function(config) {
            if(config) {
                $scope.config.seed = config.seed;
                $scope.config.length = new Integer(config.length);
                $scope.config.strength = new Integer(config.strength);

                $scope.$apply();
            }
        });

        $scope.save = function() {

            var config = $.extend({}, $scope.config);

            config.length = config.length.value;
            config.strength = config.strength.value;

            userData.saveConfig(config);
        };

        $scope.newSeed = function() {
            $scope.config.seed = String.UUID();
            $scope.save();
        };


    }]);

})