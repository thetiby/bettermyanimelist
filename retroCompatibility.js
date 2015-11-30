/* global chrome */

chrome.storage.local.get('retroCompatibility', function (items) {
    var retroCompatibility = items.retroCompatibility || {currentVersion: '0.0.0'};
    if(retroCompatibility.currentVersion != chrome.runtime.getManifest().version) {
        var VERSIONS_CHANGES = {
        '0.2.2.0': function () { // Migrates from sync storage to local storage area 
            chrome.storage.sync.get(null, function (items) {
                for (var item in items) {
                    var obj = {};
                    obj[item] = items[item];
                    chrome.storage.local.set(obj);
                }
                chrome.storage.sync.clear();
            });
        },
        '0.2.3.4': function () { // clean up
            chrome.storage.local.remove('mediaHistory');
            chrome.storage.local.remove('backup');
        },
        '0.2.3.5': function () { // clean up
            chrome.storage.local.remove('searchFromArray');             
            chrome.storage.local.remove('MediaPlayerPreferences');
        },
        '0.2.3.7': function() {        
            chrome.storage.local.remove('savedBackups');      
            chrome.storage.local.remove('titles_cache');     
        }
    };    
    for (var version in VERSIONS_CHANGES) {
        // Won't work with string versions like '1.0.1.0' 
        if (parseInt(version.replace(/\./g,'')) <= parseInt(retroCompatibility.currentVersion.replace(/\./g,''))) {
            continue;
        }
        console.log('[RetroCompatibility] Migrated from '+ retroCompatibility.currentVersion+ ' to '+version);
        VERSIONS_CHANGES[version]();
        retroCompatibility.currentVersion = version;
        chrome.storage.local.set({retroCompatibility: retroCompatibility});
    }
}
});        