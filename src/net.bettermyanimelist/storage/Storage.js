/* global ObjectUtils, Constants, chrome */

(function () {
    var _storageArea = chrome.storage.local;
    this.get = function (keys, callback) {
        _storageArea.get(keys, callback);
    };
    this.set = function (key, value, callback) {
        var items = {};
        items[key] = value;
        _storageArea.set(items, callback);
    };
    this.remove = function (keys, callback) {
        _storageArea.remove(keys, callback);
    };
    this.clear = function (callback) {
        _storageArea.clear(callback);
    };
}).call(Storage = {});

var StorageItem = function (name, obj) {
    var that = this;
    Storage.get(name, function (items) {
        var savedObj = items[name];
        if (!savedObj) {
            Storage.set(name, obj);
        }
        Object.assign(that, savedObj || obj);
        ObjectUtils.observeNested(that, function () {
            Storage.set(name, that);
        });
    });
};