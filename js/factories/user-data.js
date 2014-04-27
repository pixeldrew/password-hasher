define(['phasher', 'lawnchair', 'lodash', 'jquery'], function(phasher, LawnChair, _, $) {

    var UserData = function() {

        }, connection = new LawnChair({name:'phasher',
        display: "Phasher User Data",
        version: "1.0"
    }), defaultConfig = {
        privateSeed: String.UUID(),
        defaultStrength:2,
        defaultLength: 8
    };


    UserData.prototype = {

        saveTag : function(config) {

        },
        saveConfig : function() {

        },
        getDefaults : function() {
            // query database look for config

            var d = $.Deferred();
            connection.get('options', function(config) {

                config = $.extend({}, defaultConfig, config);

                var options = {};

                options.length = config.defaultLength;
                options.strength = config.defaultStrength;
                options.seed = config.privateSeed;

                d.resolve(options);
            });

            return d.promise();
        },
        getAllTags : function() {

            var d = $.Deferred();

            return d.resolve(['facebook', 'somethingelse', 'blah', 'yep', 'somethingelse', 'fridaythethirtheenth']);

        },
        getExport : function() {

            return JSON.stringify({});
        }

    };

    phasher.factory('UserData', [function() {

        return new UserData();

    }]);

    return UserData;
});