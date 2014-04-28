var exports = {};

require.config({
    baseUrl: 'js/',
    paths: {
        ionic: '../bower_components/ionic/release/js/ionic',
        'ionic-angular': '../bower_components/ionic/release/js/ionic-angular',
        'angular': '../bower_components/angular/angular',
        'angular-animate': '../bower_components/angular-animate/angular-animate',
        'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize',
        'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',
        jquery: '../bower_components/jquery/dist/jquery',
        'crypto': "../bower_components/cryptojs/lib/Crypto",
        'crypto.BlockModes': "../bower_components/cryptojs/lib/BlockModes",
        'crypto.PBKDF2': "../bower_components/cryptojs/lib/PBKDF2",
        'crypto.HMAC': "../bower_components/cryptojs/lib/HMAC",
        'crypto.SHA1': "../bower_components/cryptojs/lib/SHA1",
        'crypto.AES': "../bower_components/cryptojs/lib/AES",
        lawnchair: '../bower_components/lawnchair/src/Lawnchair',
        'lawnchair-webkit-sqlite': '../bower_components/lawnchair/src/adapters/webkit-sqlite',
        lodash: '../bower_components/lodash/dist/lodash',
        'lib': '../lib',
        'ui-bootstrap' : '../lib/ui-bootstrap-custom',
        'ui-bootstrap-tpls' : '../lib/ui-bootstrap-custom-tpls'
    },
    packages : [
        'controllers',
        'directives',
        'factories'
    ],
    shim: {
        'ionic': {'exports': 'ionic'},
        'angular': {'exports': 'angular'},
        'crypto.HMAC': {deps: ['crypto.SHA1'], exports: 'Crypto.HMAC'},
        'crypto.SHA1': {deps:['crypto.BlockModes'], exports: 'Crypto.SHA1'},
        'crypto.BlockModes': {deps: ['crypto'], exports: 'Crypto.BlockModes'},
        'crypto': {exports:'Crypto'},
        'angular-animate': {'deps': ['angular']},
        'angular-resource': {'deps': ['angular']},
        'angular-sanitize': {'deps': ['angular']},
        'angular-route': {'deps': ['angular']},
        'angular-ui-router': {'deps': ['angular']},
        'ionic-angular': {'deps': ['angular-animate', 'angular-sanitize', 'angular-ui-router', 'ionic']},
        'lawnchair': {'exports': 'Lawnchair'},
        'lawnchair-webkit-sqlite' : {deps:['lawnchair']},
        'ui-bootstrap' : ['angular'],
        'ui-bootstrap-tpls' : ['angular', 'ui-bootstrap']
    }
});

window.name = "NG_DEFER_BOOTSTRAP!";

require([
    'angular',
    'controllers'
], function(angular) {
    'use strict';
    var $html = angular.element(document.getElementsByTagName('html')[0]);

    $html.ready(function() {
        angular.resumeBootstrap(['phasher']);
    });
});
