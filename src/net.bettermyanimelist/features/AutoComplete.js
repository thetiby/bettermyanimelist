/* global UserInterface, Constants, List, Http, Site */

(function () {
    var CACHE = [];
    /*
     * Applies the data to our model
     * @param {object} data 
     */
     function processData(data) {
        if (data.length > 1) {
            UserInterface.render('AutoComplete.entry', data);
            UserInterface.process('AutoComplete.setState$COMPLETED', true);
        } else if (data.length == 1) {
            window.location.href = '/' + Site.TYPES.SEARCH[data[0].type] + '/' + data[0].id;
        }
    }
    /*
     * Turns an XML entry into a new JSON object keeping only what is needed
     * @param {object} entry 
     */
     function getModelData(xmlEntry) {
        var data = {};
        data.id = xmlEntry.querySelector('id').textContent;
        data.image = xmlEntry.querySelector('image').textContent;
        data.title = xmlEntry.querySelector('title').textContent;
        data.type = xmlEntry.querySelector('type').textContent;
        data.status = xmlEntry.querySelector('status').textContent;
        data.synopsis = xmlEntry.querySelector('synopsis').textContent;
        data.score = xmlEntry.querySelector('score').textContent;
        var isAnime = data.type in Site.TYPES.ANIMES;
        data.url = '/' + (isAnime ? 'anime' : 'manga') + '/' + data.id + '/' + data.title;
        data.episodes = xmlEntry.querySelector(isAnime ? 'episodes' : 'chapters').textContent;
        data.part_name = isAnime ? 'Episodes' : 'Chapters';
        data.isAdded = Site.SESSION.LOGGED ? data.id in Site.SESSION.USER.LIST : false;
        if (isAnime) {
            data.action_url = (data.isAdded ? Site.URI.LIST.ANIME.ADD : Site.URI.LIST.ANIME.EDIT).concat(data.id);
        } else {
            data.action_url = (data.isAdded ? Site.URI.LIST.MANGA.ADD : Site.URI.LIST.MANGA.EDIT).concat(data.id);
        }
        return data;
    }
    /*
     * Parses XML entries
     * @param {object} entries 
     */
     function parseEntries(xmlEntries) {
        var entriesData = [];
        xmlEntries.forEach(function (entry) {
            var data = getModelData(entry);
            entriesData.push(data);
        });
        return entriesData;
    }
    /*
     * Retrieves XML entries
     * @param {string} value 
     * @param {string} type 
     */
     function retrieveEntries(value, type) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    var entries = xmlhttp.responseXML.querySelectorAll('entry');
                    if (entries.length > 0) {
                        var data = parseEntries(entries);
                        processData(data);
                        CACHE[value] = data;
                    } else {
                        UserInterface.process('AutoComplete.setState$ERROR_NF', true);
                    }
                } else {
                    UserInterface.process('AutoComplete.setState$ERROR_API', true);
                }
            }
        };
        xmlhttp.open('GET', (type in Site.TYPE.ANIME ? Site.URI.API.ANIME : Site.URI.API.MANGA).concat(encodeURI(value)), true);
        xmlhttp.timeout = 10000;
        xmlhttp.ontimeout = UserInterface.process('AutoComplete.setState$ERROR_TIMEOUT', true);
        xmlhttp.setRequestHeader('Authorization', 'Basic eDQ1MXBvOng0NTFwb3g0NTFwbw==');
        xmlhttp.send();
    }
    /*
     * When the search input value has changed
     * or when the type of media has changed.
     */
     this.onSearch = function () {
        if (this.value.trim().length == 0) {
            UserInterface.process('AutoComplete.close', true);
            return;
        }
        UserInterface.process('AutoComplete.setState$RETRIEVING', true);
        if (this.value in CACHE) {
            processData(CACHE[this.value]);
        } else {
            retrieveEntries(this.value, this.nextElementSibling.value);
        }
    };
    /*
     * Will free the cache of all the entries.
     */
     this.clearCache = function () {
        CACHE = [];
    };
}).call(AutoComplete = {});

UserInterface.actions([
{
    action: 'REMOVE',
    uiObjects: [
    {
        $query: '#topSearchResultList'
    }
    ]
}
]);

UserInterface.update([
{
    $query: '#topSearchText',
    oninput: AutoComplete.onSearch,
    onchange: AutoComplete.onSearch
}
]);

UserInterface.create([
{
    $query: '#searchBar',
    $position: 'afterend',
    id: 'autoComplete',
    $children: [
    {
        className: 'cloak',
        onclick: UserInterface.process.bind(null, 'AutoComplete.close', true)
    },
    {
        $name: 'span',
        className: 'message'
    },
    {
        className: 'entries'
    }
    ]
}
], {actionName: 'AutoComplete.open', process: true});

UserInterface.update([
{
    $query: '#autoComplete',
    className: 'onMessage'
},
{
    $query: '#autoComplete .message',
    textContent: 'Retrieving results...'
}
], {actionName: 'AutoComplete.setState$RETRIEVING'});

UserInterface.update([
{
    $query: '#autoComplete',
    className: 'onMessage'
},
{
    $query: '#autoComplete .message',
    textContent: 'No titles matching your query were found. Please try again.'
}
], {actionName: 'AutoComplete.setState$ERROR_NF'});

UserInterface.update([
{
    $query: '#autoComplete',
    className: 'onMessage'
},
{
    $query: '#autoComplete .message',
    textContent: 'Unable to access the API. Please try again.'
}
], {actionName: 'AutoComplete.setState$ERROR_API'});

UserInterface.update([
{
    $query: '#autoComplete',
    className: 'onMessage'
},
{
    $query: '#autoComplete .message',
    textContent: 'The request timed out. Please try again.'
}
], {actionName: 'AutoComplete.setState$ERROR_TIMEOUT'});

UserInterface.update([
{
    $query: '#autoComplete',
    className: 'onResult'
},
{
    $query: '#autoComplete .message',
    textContent: ''
}
], {actionName: 'AutoComplete.setState$COMPLETED'});

UserInterface.remove([
{
    $query: '#autoComplete .entries .entry'
}
], {actionName: 'AutoComplete.clearEntries'});

UserInterface.update([
{
    $query: '#autoComplete',
    className: ''
},
{
    $query: '#topSearchText',
    value: ''
},
{
    $query: '#topSearchValue',
    onchange: null
}
], {actionName: 'AutoComplete.close'});

UserInterface.model(function (data) {
    return {
        $query: '#autoComplete .entries',
        $position: 'beforeend',
        className: 'entry',
        $children: [
        {
            $name: 'a',
            href: data.url,
            $children: [
            {
                $name: 'img',
                src: data.image,
                className: 'thumbnail clearfix'
            }
            ]
        },
        {
            $name: 'a',
            href: data.url,
            className: 'title',
            textContent: data.title
        },
        {
            $name: 'small',
            className: 'status',
            textContent: data.status
        },
        {
            $name: 'a',
            $_conditions: [
            [
            !data.isAdded, Site.SESSION.LOGGED
            ],
            [
            data.isAdded, Site.SESSION.LOGGED
            ]
            ],
            href: data.action_url,
            $_textContent: ['add', 'edit'],
            $_className: ['button_add', 'button_edit']
        },
        {
            className: 'information',
            $$name: 'span',
            $children: [
            {
                innerHTML: 'Type: <a href="#">' + data.type + '</a>'
            },
            {
                innerHTML: data.part_name + ': <b>' + data.part + '</b>'
            },
            {
                innerHTML: 'Score: <b>' + data.score + '</b>'
            }
            ]
        },
        {
            $name: 'p',
            className: 'synopsis',
            textContent: data.synopsis
        }
        ]
    };
}, {modelName: 'AutoComplete.entry'});


