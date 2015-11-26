(function () {
    this.clone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
    this.observeNested = function (obj, callback) {
        for (var property in obj) {
            if (typeof obj[property] == 'object') {
                observeNested(obj[property], callback);
            }
        }
        Object.observe(obj, callback);
    };
}).call(ObjectUtils = {});
