(function () {
    this.swap = function (array) {
        var ret = {};
        for (var key in array)
            ret[array[key]] = key;
        return ret;
    };    
}).call(ArrayUtils = {});