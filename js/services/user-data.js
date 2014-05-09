define(['app', 'lodash', 'jquery', 'lawnchair-webkit-sqlite'], function(app, _, $, Lawnchair) {

    var UserData = function() {

    }, connection = Lawnchair({name: 'app',
        display: "app User Data",
        version: "1.0"
    }), defaultConfig = {
        privateSeed: String.UUID(),
        defaultStrength: 2,
        defaultLength: 8
    };

    UserData.prototype = {

        saveTag: function(id, config) {

            var obj = $.extend({}, config);

            obj.key = 'tags:' + id;

            connection.save(obj);
        },
        getTag: function(id) {

            var d = $.Deferred();

            connection.get('tags:' + id, function(tag) {
                d.resolve(tag)
            });

            return d.promise();
        },
        saveConfig: function(config) {

            var newConfig = {};

            newConfig.defaultLength = config.length;
            newConfig.defaultStrength = config.strength;
            newConfig.privateSeed = config.seed;
            newConfig.key = 'options';

            connection.save(newConfig);
        },
        getDefaults: function() {

            var d = $.Deferred();
            connection.get('options', _.bind(function(config) {

                config = $.extend({}, defaultConfig, config);

                var options = {};

                options.length = config.defaultLength;
                options.strength = config.defaultStrength;
                options.seed = config.privateSeed;

                this.saveConfig(options);

                d.resolve(options);
            }, this));

            return d.promise();
        },
        getAllTags: function() {

            var d = $.Deferred();

            connection.keys(function(keys) {

                var tags = [], tagRe = /^(tags\:)+/;

                _(keys).each(function(key) {
                    if(tagRe.test(key)) {
                        tags.push(key.replace(tagRe, ''));
                    }
                });

                d.resolve(tags)
            });

            return d.promise();

        },
        getExport: function() {

            var d = $.Deferred();

            connection.all(function(db) {
                _(db).each(function(val) {
                    delete val.key;
                });
                d.resolve(JSON.stringify(db));
            });

            return d.promise();
        }

    };

    app.factory('UserData', function() {

        return new UserData();

    });

    return UserData;
});