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

            obj.key = 'tag:' + id;

            connection.save(obj);
        },
        getTag: function(id) {

            var d = $.Deferred();

            connection.get('tag:' + id, function(tag) {
                d.resolve(tag)
            });

            return d.promise();
        },
        saveConfig: function(config) {

            var newConfig = {};

            newConfig.defaultLength = config.length || config.defaultLength;
            newConfig.defaultStrength = config.strength || config.defaultStrength;
            newConfig.privateSeed = config.seed || config.privateSeed;
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

                var tags = [], tagRe = /^(tag\:)+/;

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
                var dbExport = _(db).reduce(function(result, value) {

                    result[value.key] = value;

                    // make sure all values are strings
                    _(value).forIn(function(v, k) {
                        value[k] = v + "";
                    });

                    delete value.key;

                    return result;
                }, {});


                d.resolve(JSON.stringify(dbExport));
            });

            return d.promise();
        },
        saveImport: function(importData) {

            var d = $.Deferred(), tagRe = /^(tag\:)+/;

            try {

                var data = JSON.parse(importData);

                connection.nuke();

                _(data).forIn(_.bind(function(v, k) {

                    if(k === 'options') {
                        if(v.hasOwnProperty('defaultLength') && v.hasOwnProperty('defaultStrength') && v.hasOwnProperty('privateSeed')) {
                            this.saveConfig(v);
                        } else {
                            throw {parseError: 'config is malformed'};
                        }
                    }

                    if(tagRe.test(k)) {

                        var x = k.replace(tagRe, '');

                        if(v.hasOwnProperty('seed') &&
                            v.hasOwnProperty('length') &&
                            v.hasOwnProperty('strength')) {

                            this.saveTag(x, v);

                        } else {
                            debugger;
                            throw {parseError:x + ' tag is malformed'};
                        }
                    }

                }, this));

                return d.resolve();

            } catch(err) {
                return d.reject({parseError:'malformed JSON'});
            }

        }

    };

    app.factory('UserData', function() {

        return new UserData();

    });

    return UserData;
});