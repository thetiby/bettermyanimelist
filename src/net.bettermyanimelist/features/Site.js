/* global chrome */
(function () {
    this.TYPE = {
        ANIME: {
            TV: 1, OVA: 2, Movie: 3, Special: 4, ONA: 5, Music: 6
        },
        MANGA: {
            Manga: 1, Novel: 2, 'One Shot': 3, Doujin: 4, Manhwa: 5, Manhua: 6, OEL: 7
        },
        CONTENT: {
            0: 'anime', 1: 'manga', 2: 'characters', 6: 'people', 3: 'fansub groups', 4: 'clubs', 5: 'users'
        }
    };
    this.PAGE = {
        LIST: window.location.pathname.match(/^\/(manga|anime)list\/.*/)
    };
    this.SESSION = {
        CSRF_TOKEN: document.querySelector("meta[name='csrf_token']").textContent,
        LOGGED: PAGE.LIST ? !!document.querySelector("#mal_cs_listinfo a") : !document.querySelector("#malLogin"),
        USER: LOGGED ? {
            USERNAME: PAGE.LIST ? document.querySelector("#mal_cs_listinfo a").textContent : document.querySelector("#header-menu .profile-name").textContent
        } : null
    };
    this.URI = {
        API: {
            LIST: {
                ANIME: {
                    SEARCH: '/api/anime/search.xml?q='
                },
                MANGA: {
                    SEARCH: '/api/manga/search.xml?q='
                }
            }
        },
        LIST: {
            ANIME: {
                ADD: '/panel.php?go=add&selected_series_id=',
                EDIT: '#'
            },
            MANGA: {
                ADD: '/panel.php?go=addmanga&selected_manga_id=',
                EDIT: '/editlist.php?type=anime&id='
            }
        }
    };
}).call(Site = {});