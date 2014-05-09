define(['app', 'jquery', 'util/integer', 'json!appinfo', 'services/user-data'], function(app, $, Integer, appInfo) {

    app.controller('SettingsCtrl', ['$scope', 'UserData', '$ionicModal', function($scope, userData, $ionicModal) {

        $scope.config = {};

        $scope.version = appInfo.version;

        $ionicModal.fromTemplateUrl('templates/about.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

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

        $scope.showAbout = function() {
            $scope.modal.show();
        };

        $scope.closeAbout = function() {
            $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });


    }]);

})