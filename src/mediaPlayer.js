/* global streaming, mediaPlayer, chrome, initComponents, SOURCES, mediaData, SOURCES_TRIE, SourceMiddleWare, preferences */

var STATE = {
    ERROR: -1,
    INITIATING: 0,
    INITIATED: 1,
    LOADING: 2,
    LOADED: 3
};

function MediaPlayer() {
    var that = this;
    /*
     * Components
     */
     this.div = document.createElement("div");
     this.div.id = "mediaPlayer";
     this.sourceControls = document.createElement("div");
     this.sourceControls.className = "sourceControls";
    /*
     * Cloak
     */
     this.cloak = document.createElement("div");
     this.cloak.className = "cloak";
     this.div.appendChild(this.cloak);
    /*
     * First select
     */
     this.select_source = document.createElement("select");
     this.select_source.className = 'bmalSuitable';
     (function appendSources(obj, level) {
        if (obj.group) {
            for (var group in obj.group) {
                var optGroup = document.createElement('optgroup');                
                if(Object.keys(obj.group[group]).length == 0) {
                    optGroup.disabled = true;
                }
                var levelStr = "";
                for (var i = level - 1; i >= 0; i--) {
                    levelStr += "\u00A0\u00A0\u00A0\u00A0";
                }
                optGroup.label = levelStr + group;
                if (obj.groupElement) {
                    that.select_source.appendChild(optGroup);
                } else {
                    that.select_source.appendChild(optGroup);
                }
                var obj1 = {groupElement: optGroup};
                if (obj.group[group] instanceof Array) {
                    obj1.sources = obj.group[group];
                } else {
                    obj1.group = obj.group[group];
                }
                appendSources(obj1, obj.group ? (level + 1) : 0);
            }    
        } else if (obj.sources) {
            for (var i = 0; i < obj.sources.length; i++) {
                var option = document.createElement('option');
                option.text = '\u00A0\u00A0\u00A0\u00A0Source #' + (i + 1);
                option.value = obj.sources[i].id;
                option.source = obj.sources[i];
                if (option.value == preferences.favorite_source) {
                    option.selected = true;
                }
                obj.groupElement.appendChild(option);
            }
        }
    })({group: SOURCES[streaming ? 0 : 1]}, 0);

    this.sourceControls.appendChild(this.select_source);
    this.div.appendChild(this.sourceControls);
    /*
     * Second select
     */
     this.select = document.createElement("select");
     this.select.disabled = true;
     this.select.className = 'bmalSuitable';
     this.sourceControls.appendChild(this.select);
    /*
     * Third select
     */
     this.select1 = document.createElement("select");
     this.select1.disabled = true;
     this.select1.className = 'bmalSuitable';
     this.sourceControls.appendChild(this.select1);
    /*
     * Previous button
     */
     this.prevButton = document.createElement("button");
     this.prevButton.disabled = true;
     this.prevButton.className = 'bmalSuitable';
     this.prevButton.textContent = "Previous";
     this.sourceControls.appendChild(this.prevButton);
    /*
     * Next button
     */
     this.nextButton = document.createElement("button");
     this.nextButton.disabled = true;
     this.nextButton.className = 'bmalSuitable';
     this.nextButton.textContent = "Next";
     this.sourceControls.appendChild(this.nextButton);
    /*
     * Cinema button
     */
     this.cinemaButton = document.createElement("button");
     this.cinemaButton.className = 'bmalSuitable';
     this.cinemaButton.textContent = "Cinema Mode";
     this.sourceControls.appendChild(this.cinemaButton);
    /*
     * Report button
     */
     this.report = document.createElement("button");
     this.report.textContent = "Report";
     this.report.className = 'bmalSuitable special';
     this.sourceControls.appendChild(this.report);
    /*
     * Media wrapper
     */
     this.mediaWrapper = document.createElement("div");
     this.mediaWrapper.className = "mediaWrapper";
    /*
     * Methods
     */

     this.cachedLinks = [];

     this.nextPrevious = function (isNext) {
        var select = streaming ? that.select : that.select1;
        select.options[isNext ? (select.selectedIndex + 1) : (select.selectedIndex - 1)].selected = true;
        select.onchange();
    };
    this.injectMedia = function (src) {
           /*
            * Sometimes the provided src leads to a 302 which prevents the video player 
            * from working properly.
            */
            if (streaming) {
                if (typeof this.cachedLinks[src ? src : that.select1.value] != 'undefined') {
                    that.video.src = this.cachedLinks[src ? src : that.select1.value];
                } else {
                    var responseURL;
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 3) {
                            responseURL = xmlhttp.responseURL;
                            xmlhttp.abort();
                        }
                    };
                    xmlhttp.onabort = function () {
                        that.video.src = responseURL;
                        that.cachedLinks[src ? src : that.select1.value] = responseURL;
                    };
                    xmlhttp.open('GET', src ? src : that.select1.value, true);
                    xmlhttp.send();
                }
            } else {
                var img = this.img;
                this.mediaWrapper.removeChild(this.img);
                this.mediaWrapper.appendChild(this.img);
                this.img.src = src;
                this.img.onmousemove();
            }
            mediaPlayer.select.options[mediaPlayer.select.selectedIndex].cache = mediaPlayer.select1.innerHTML;
            Storage.get('MediaPlayer.cache.titles', function (items) {
                var cache = items['MediaPlayer.cache.titles'] || {};
                if (!(that.source.id in cache)) {
                    cache[that.source.id] = {};
                }
                cache[that.source.id][mediaData.id] = mediaData.current_title;
                Storage.set('MediaPlayer.cache.titles', cache);
            });
        };
        this.setState = function (state) {
            switch (state) {
                case STATE.INITIATING:
                console.log('[MediaPlayer] is in the INITIATING state');
                this.loading_display.style.display = "block";
                this.error_display.style.display = "none";
                if (streaming) {
                    this.video.src = "";
                } else {
                    this.img.src = "";
                    this.img.removeAttribute('data-cursor');
                }
                this.select.innerHTML = "";
                this.select1.innerHTML = "";
                this.select_source.disabled = true;
                this.select.disabled = true;
                this.select1.disabled = true;
                this.prevButton.disabled = true;
                this.nextButton.disabled = true;
                if (that.source.id in SOURCES_TRIE && mediaData.id in SOURCES_TRIE[that.source.id]) {
                    mediaData.accurateTitle = SOURCES_TRIE[that.source.id][mediaData.id];
                }
                break;
                case STATE.LOADING:
                console.log('[MediaPlayer] is in  the LOADING state');
                this.error_display.style.display = "none";
                this.loading_display.style.display = "block";
                if (streaming) {
                    this.video.src = "";
                } else {
                    this.img.src = "";
                    this.img.removeAttribute('data-cursor');
                }
                this.select_source.disabled = true;
                this.select.disabled = true;
                this.select1.disabled = true;
                this.prevButton.disabled = true;
                this.nextButton.disabled = true;
                break;
                case STATE.LOADED:
                console.log('[MediaPlayer] is in the LOADED state');
                this.firstMedia = false;
                this.loading_display.style.display = "none";
                this.error_display.style.display = "none";
                this.select_source.disabled = false;
                this.select.disabled = false;
                this.select1.disabled = false;
                this.osd.style.display = "block";
                var osd = this.osd;
                this.mediaWrapper.removeChild(that.osd);
                this.mediaWrapper.appendChild(that.osd);
                this.osd.style.display = "block";
                this.prevButton.disabled = streaming ? (this.select.selectedIndex <= 0) : (this.select1.selectedIndex <= 0);
                this.nextButton.disabled = streaming ? (this.select.selectedIndex == this.select.options.length - 1) : (this.select1.selectedIndex == this.select1.options.length - 1);
                break;
                case STATE.ERROR:
                console.log('[MediaPlayer] is in the ERROR state');
                if (streaming) {
                    mediaPlayer.video.src = "";
                } else {
                    mediaPlayer.img.src = "";
                    this.img.removeAttribute('data-cursor');
                }
                this.select_source.disabled = false;
                this.select.disabled = true;
                this.select1.disabled = true;
                this.prevButton.disabled = true;
                this.nextButton.disabled = true;
                this.error_display.style.display = "block";
                this.loading_display.style.display = "none";
                break;
            }
            this.state = state;
        };
        initComponents.call(this);
        /*
         * Error display
        */
        this.error_display = document.createElement("div");
        this.error_display.className = "error_screen";
        this.mediaWrapper.appendChild(this.error_display);
        /*
         * Loading display
        */
        this.loading_display = document.createElement("div");
        this.loading_display.className = "loading_screen";
        this.mediaWrapper.appendChild(this.loading_display);
        this.osd = document.createElement("div");
        this.osd.className = "osd animated fadeOut";
        this.mediaWrapper.appendChild(this.osd);
        this.div.appendChild(this.mediaWrapper);
        initEvents.call(this);
        initShorcuts.call(this);
    }

    function initEvents() {
        var that = this;
        this.select_source.onchange = function () {
            that.source = this.options[this.selectedIndex].source;
            preferences.favorite_source = that.source.id;
            that.setState(STATE.INITIATING);
            matchTitles({
                domain: that.source.domain,
                matchers: that.source.matchers,
                urlTitleExtractors: that.source.urlTitleExtractors,
                forceGoogle: that.source.forceGoogle
            });
        };
        this.select.onchange = function () {
            that.setState(STATE.LOADING);
            var cache = mediaPlayer.select.options[mediaPlayer.select.selectedIndex].cache;
            if (cache) {
                mediaPlayer.select1.innerHTML = cache;
                mediaPlayer.injectMedia(mediaPlayer.select1.value);
            } else {
                that.source.load1();
            }
        };
        this.select1.onchange = function () {
            that.setState(STATE.LOADING);
            if (streaming) {
                preferences.favorite_quality = mediaPlayer.select1.options[mediaPlayer.select1.selectedIndex].text;
            }
            mediaPlayer.injectMedia(mediaPlayer.select1.value);
        };
        this.prevButton.onclick = this.nextPrevious.bind(null, false);
        this.nextButton.onclick = this.nextPrevious.bind(null, true);
        this.switchLight = function () {
            var on = that.mediaWrapper.classList.contains("interactiveMode");
            if (on) {
                that.mediaWrapper.classList.remove("interactiveMode");
                that.cloak.style.display = "none";
            } else {
                that.mediaWrapper.classList.add("interactiveMode");
                that.cloak.style.display = "block";
            }
            if (streaming) {
                focusWithoutScrolling(that.video);
            } else {
                that.img.focus();
            }
        };
        this.cloak.onclick = this.switchLight;
        this.cinemaButton.onclick = this.switchLight;
        this.report.onclick = function () {
            window.open('http://facebook.com/bettermyanimelist');
        };
    }


    function initShorcuts() {
        window.onkeydown = function (evt) {
            if (!mediaPlayer.isFocused || mediaPlayer.state != STATE.LOADED) {
                return;
            }
            if (streaming) {
                switch (evt.keyCode) {
                    case 32:
                    mediaPlayer.switchPlaybackState();
                    evt.preventDefault();
                    break;
                    case 38:
                    if (mediaPlayer.video.playbackRate < 2) {
                        mediaPlayer.video.playbackRate += 0.5;
                    }
                    mediaPlayer.switchControls();
                    evt.preventDefault();
                    break;
                    case 40:
                    if (mediaPlayer.video.playbackRate > 0.5) {
                        mediaPlayer.video.playbackRate -= 0.5;
                    }
                    mediaPlayer.switchControls();
                    evt.preventDefault();
                    break;
                }
            }
            switch (evt.keyCode) {
                case 27:
                if (mediaPlayer.mediaWrapper.classList.contains("interactiveMode")) {
                    mediaPlayer.switchLight();
                }
                evt.preventDefault();
                break;
                case 33:
                if (streaming) {
                    mediaPlayer.select.options[0].setAttribute("selected", "selected");
                    mediaPlayer.select.onchange();
                } else {
                    mediaPlayer.select1.options[0].setAttribute("selected", "selected");
                    mediaPlayer.select1.onchange();
                }
                evt.preventDefault();
                break;
                case 34:
                if (streaming) {
                    mediaPlayer.select.options[mediaPlayer.select.options.length - 1].setAttribute("selected", "selected");
                    mediaPlayer.select.onchange();
                } else {
                    mediaPlayer.select1.options[mediaPlayer.select1.options.length - 1].setAttribute("selected", "selected");
                    mediaPlayer.select1.onchange();
                }
                evt.preventDefault();
                break;
                case 37:
                if (streaming) {
                    if (mediaPlayer.video.currentTime - 5 >= 0) {
                        mediaPlayer.video.currentTime -= 10;
                    } else {
                        mediaPlayer.video.currentTime = 0;
                    }
                    mediaPlayer.switchControls();
                } else
                mediaPlayer.nextPrevious.bind(null, true);
                evt.preventDefault();
                break;
                case 39:
                if (streaming) {
                    if (mediaPlayer.video.currentTime + 5 <= mediaPlayer.video.duration) {
                        mediaPlayer.video.currentTime += 10;
                    } else {
                        mediaPlayer.video.currentTime = mediaPlayer.video.duration;
                    }
                    mediaPlayer.switchControls();
                } else
                mediaPlayer.previous();
                evt.preventDefault();
                break;
                case 84:
                mediaPlayer.switchLight();
                evt.preventDefault();
                break;
            }
        };

    }