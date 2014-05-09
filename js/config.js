require.config({
    'baseUrl': 'js',
    'paths': {
        'appinfo': '../package.json',
        'json': '../bower_components/requirejs-plugins/src/json',
        'ionic': '../bower_components/ionic/release/js/ionic',
        'ionic-angular': '../bower_components/ionic/release/js/ionic-angular',
        'ionic-frostedglass': '../bower_components/ionic-contrib-frosted-glass/ionic.contrib.frostedGlass',
        'angular': '../bower_components/angular/angular',
        'angular-animate': '../bower_components/angular-animate/angular-animate',
        'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize',
        'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',
        'jquery': '../bower_components/jquery/dist/jquery',
        'lawnchair': '../bower_components/lawnchair/src/Lawnchair',
        'lawnchair-webkit-sqlite': '../bower_components/lawnchair/src/adapters/webkit-sqlite',
        'lodash': '../bower_components/lodash/dist/lodash',
        'root': '../',
        'text': '../bower_components/requirejs-text/text',
        'i18n': '../bower_components/requirejs-i18n/i18n',
        'nls': '../res/nls',
        'lib': '../lib',
        'ui-bootstrap': '../lib/ui-bootstrap-custom',
        'ui-bootstrap-tpls': '../lib/ui-bootstrap-custom-tpls'
    },
    packages: [
        'controllers',
        'directives',
        'services',
        'filters'
    ],
    shim: {
        'ionic': {'exports': 'ionic'},
        'ionic-frostedglass': ['ionic-angular'],
        'lodash' : {exports: '_'},
        'angular': {exports: 'angular'},
        'angular-animate': {'deps': ['angular'], exports: 'angular'},
        'angular-resource': {'deps': ['angular'], exports: 'angular'},
        'angular-sanitize': {'deps': ['angular'], exports: 'angular'},
        'angular-route': {'deps': ['angular'], exports: 'angular'},
        'angular-ui-router': {'deps': ['angular'], exports: 'angular'},
        'ionic-angular': {'deps': ['angular-animate', 'angular-sanitize', 'angular-ui-router', 'ionic'], exports: 'angular'},
        'lawnchair': {exports: 'Lawnchair'},
        'lawnchair-webkit-sqlite': {deps: ['lawnchair'], exports : 'Lawnchair'},
        'ui-bootstrap': ['angular'],
        'ui-bootstrap-tpls': ['angular', 'ui-bootstrap']
    }
});

define('cordova', [], function() {
    return window.cordova || { require: function() {return {}}};
});

require(['filters', 'directives/i18n', 'controllers']);
