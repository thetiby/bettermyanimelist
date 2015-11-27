/* global chrome, mediaData, URL_API_GOOGLE_CSE, STATE, mediaPlayer, source */

var testedTitles = [];

function google(params) {
    console.log('[TitlesMatcher] Looking for results on google using the following query: "site:'+params.domain+'" ' + params.query);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var json = JSON.parse(xmlhttp.responseText);
                var results = json.results;
                if (results.length == 0) {
                    params.filter();
                } else {
                   var i = 0;
                   (function nextResult(callback) {
                    i++;
                    if (i > results.length) {
                        callback();
                    } else {
                        params.filter(results[i - 1].unescapedUrl, nextResult);
                    }
                })();
            }               
        } else {
            console.error("[TitlesMatcher] Google CSE seems not to be working");
        }
    }
};
xmlhttp.open("GET", URL_API_GOOGLE_CSE.replace("{url}", params.domain).replace("{query}", params.query), true);
xmlhttp.send();
}

function matchTitles(params) {
    testedTitles = [];
    params.titles = [mediaData.title].concat(mediaData.alternativeTitles);
    if (mediaData.accurateTitle) {
        console.log('[TitlesMatcher] This ID is in the source trie', mediaData.id);
        mediaPlayer.source.load(mediaData.accurateTitle, function () {
            console.warn('[TitlesMatcher] The title associated with this ID inside the source trie seems not to be working', mediaData.id);
            testCache();
        });
    } else {
        testCache();
    }
    function testCache() {
        Storage.get('MediaPlayer.cache.titles', function (items) {
            var cache = items['MediaPlayer.cache.titles'] || {};
            if (mediaPlayer.source.id in cache && mediaData.id in cache[mediaPlayer.source.id]) {
                console.log('[TitlesMatcher] This ID has been cached.', mediaData.id);
                mediaPlayer.source.load(cache[mediaPlayer.source.id][mediaData.id], function() {
                    console.warn('[TitlesMatcher] The cached title seems not to be working');
                    matchTitles1(params, 0);
                });
            } else {
                matchTitles1(params, 0);
            }
        });
    }
}

function matchTitles1(params, index) {
    if ((params.google || params.forceGoogle) && index + 1 <= params.titles.length) {
        matchTitles2(params, index);
    } else if (index + 1 > params.titles.length && params.google) {
        console.error('[TitlesMatcher] No titles found', params.titles[index]);
        mediaPlayer.setState(STATE.ERROR);
    } else if (index + 1 > params.titles.length && !params.google) {
        params.google = true;
        matchTitles2(params, 0);
    } else if (testedTitles.indexOf(params.titles[index]) !== -1) {
        console.warn('[TitlesMatcher] This title has already been tested', params.titles[index]);
        matchTitles1(params, index + 1);
    } else {
        setTimeout(function () {
            testedTitles.push(params.titles[index]);
            mediaPlayer.source.load(params.titles[index], function() {                
                console.warn('[TitlesMatcher] This title seems not to be working', params.titles[index]);
                matchTitles1(params, index + 1);
        });
    }, index > 0 ? 250 : 1);
    }
}

function matchTitles2(params, index) {
    google({domain: params.domain, query: params.titles[index], filter: function (unescapedUrl, nextResult) {
        if (!unescapedUrl) {
            console.warn('[TitlesMatcher] No Results were found');
            matchTitles1(params, index + 1);
        } else {
            console.log('[TitlesMatcher] Result found', unescapedUrl);
            var callback = nextResult.bind(null, matchTitles1.bind(null, params, index + 1));
            var found;
            var i;
            for (i = 0; i < params.matchers.length; i++) {
                if (!unescapedUrl.match(params.matchers[i])) {
                    console.warn('[TitlesMatcher] The result doesn\'t match the pattern', unescapedUrl);
                    continue;
                } else {
                    console.log('[TitlesMatcher] The result matches the pattern', unescapedUrl);
                    found = true;
                    break;
                }
            }
            if (found) {
                var title = unescapedUrl.match(params.urlTitleExtractors[i])[1];
                if (testedTitles.indexOf(title) == -1) {
                    setTimeout(function () {
                        testedTitles.push(title);
                        mediaPlayer.source.load(unescapedUrl.match(params.urlTitleExtractors[i])[1], function () {
                            console.warn('[TitlesMatcher] This title seems not to be working', title);
                            callback();
                        });
                    }, 250);
                } else {
                    console.warn('[TitlesMatcher] This title has already been tested', title);
                    callback();
                }
            } else {
                callback();
            }
        }
    }});
}