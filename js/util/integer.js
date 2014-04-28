define([], function() {


    var Integer = function (val) {
        var integer = parseInt(val, 10);

        this.__defineGetter__('value', function() {
            return integer;
        });

        this.__defineSetter__('value', function(val) {
            integer = parseInt(val, 10);
        });
    };

    return Integer;

});