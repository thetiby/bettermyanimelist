/* global UserInterface, MediaPlayer */

(function () {
    this.TITLE = document.querySelector("#contentWrapper span[itemprop='name']").textContent;
    this.ALTERNATIVE_TITLES = {
        EN: document.querySelector('#content > table > tbody > tr > td.borderClass > div:nth-child(8) > span').nextSibling,
        SYNONYMS: document.querySelector('#content > table > tbody > tr > td.borderClass > div:nth-child(8) > span').nextSibling,
        JP: document.querySelector('#content > table > tbody > tr > td.borderClass > div:nth-child(8) > span').nextSibling
    };
    this.ID = window.location.href.match(/^https?:\/\/(www\.)?myanimelist\.net\/(anime|manga)(\/|\.php\?id=)([0-9]+)/)[4];
    this.IS_ANIME = window.location.href.match(/^https?:\/\/(www\.)?myanimelist\.net\/anime(\/|\.php\?id=)([0-9]+)/);
}).call(Media = {});

/* Media button */

UserInterface.clone([{
        $query: '#horiznav_nav ul li',
        $children: [
            {
                className: 'mediaButton',
                $name: 'a',
                textContent: Media.isAnime ? 'Streaming' : 'Reading',
                onclick: UserInterface.process.bind(null, 'MediaButton.setActive', false),
                href: 'javascript:;'
            }
        ]
    }]);

UserInterface.update([
    {
        $query: '#horiznav_nav ul li a.horiznav_active',
        className: ''
    },
    {
        $query: '#horiznav_nav ul li a.mediaButton',
        className: 'mediaButton horiznav_active'
    }
], {actionName: 'MediaButton.setActive', $actions: ['MediaPlayer.preInit']});