define(['app', 'jquery', 'util/integer', 'json!appinfo', 'services/user-data', 'services/localization'], function(app, $, Integer, appInfo) {

    app.controller('Settings', ['$scope', 'UserDataService', 'LocalizationService', '$ionicModal', '$ionicActionSheet',
        function($scope, userDataService, localizationService, $ionicModal, $ionicActionSheet) {

            $scope.config = {};
            $scope.import = {};

            $scope.import.text = '';

            $scope.version = appInfo.version;

            $ionicModal.fromTemplateUrl('templates/about.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.aboutModal = modal;
            });

            $ionicModal.fromTemplateUrl('templates/export.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.exportModal = modal;
            });

            $ionicModal.fromTemplateUrl('templates/import.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.importModal = modal;
            });

            userDataService.getDefaults().then(function(config) {
                if(config) {
                    $scope.config.seed = config.seed;
                    $scope.config.length = new Integer(config.length);
                    $scope.config.strength = new Integer(config.strength);

                    $scope.$apply();
                }
            });

            userDataService.getExport().then(function(exportData) {

                $scope.exportData = exportData;

                $scope.$apply();
            });

            $scope.save = function() {

                var config = $.extend({}, $scope.config);

                config.length = config.length.value;
                config.strength = config.strength.value;

                userDataService.saveConfig(config);

            };

            $scope.newSeed = function() {
                $scope.config.seed = String.UUID();
                $scope.save();
            };

            $scope.showExport = function() {
                $scope.exportModal.show();
            };

            $scope.closeExport = function() {
                $scope.exportModal.hide();
            };

            $scope.showImport = function() {
                $scope.importModal.show();
            };

            $scope.startImport = function() {

                // Show the action sheet
                $ionicActionSheet.show({
                    destructiveText: localizationService.getLocalizedString('import.start'),
                    titleText: localizationService.getLocalizedString('import.overwrite'),
                    cancelText: localizationService.getLocalizedString('import.cancel'),
                    buttonClicked: function(index) {
                        return true;
                    },
                    destructiveButtonClicked: function() {
                        userDataService.saveImport($scope.import.text).then(function() {
                            $scope.import.status = localizationService.getLocalizedString('import.success');

                        }, function(err) {
                            if(err.parseError) {
                                $scope.import.status = localizationService.getLocalizedString('import.parseError');
                            }

                        });

                        return true;
                    }
                });


            };

            $scope.closeImport = function() {

                $scope.import.status = '';
                $scope.import.text = '';

                $scope.importModal.hide();
            };

            $scope.showAbout = function() {
                $scope.aboutModal.show();
            };

            $scope.closeAbout = function() {
                $scope.aboutModal.hide();
            };

            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.aboutModal.remove();
                $scope.exportModal.remove();
                $scope.importModal.remove();
            });


        }]);

})