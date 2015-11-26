/* global chrome */

/* Allows the extension to bypass the anti-iframe headers */

chrome.webRequest.onHeadersReceived.addListener(function (info) {
    var headers = info.responseHeaders;
    for (var i = headers.length - 1; i >= 0; --i) {
        var header = headers[i].name.toLowerCase();
        if (header == 'x-frame-options' || header == 'frame-options') {
            headers.splice(i, 1);
        }
    }
    return {responseHeaders: headers};
}, {urls: ['<all_urls>'], types: ['sub_frame']}, ['blocking', 'responseHeaders']);

chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
    var headers = details.requestHeaders;
    var blockingResponse = {};
    headers.push({
        name: "User-Agent",
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53"
    });
    blockingResponse.requestHeaders = headers;
    return blockingResponse;
}, {urls: ["*://*.kissanime.to/*"]}, ['requestHeaders', 'blocking']);

/* Shows BMAL button inside the omnibox */

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.match(/^(https?:\/\/)?((.*?)\.)?myanimelist\.net/i)) {
        chrome.pageAction.show(tabId);
    }
});

/* Let us know when BMAL updated */

chrome.runtime.onInstalled.addListener(function (details) {
    var thisVersion = chrome.runtime.getManifest().version;
    if (details.reason == "install") {
    chrome.notifications.create("", {
        type: 'basic',
        iconUrl: 'resources/images/icon128.png',
        title: "BetterMyAnimeList has been installed",
        message: "You are using the version " + thisVersion
    });
} else if (details.reason == "update") {
    chrome.notifications.create("", {
        type: 'basic',
        iconUrl: 'resources/images/icon128.png',
        title: "BetterMyAnimeList has been updated",
        message: "You are now using the latest version"
    });
} 
});
