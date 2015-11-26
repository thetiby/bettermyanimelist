/* global STATE, mediaPlayer, mediaData */

(function () {
    var proxy = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function () {
        proxy.apply(this, [].slice.call(arguments));
    };
    var proxy1 = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function (data) {
        var proxy2 = this.onreadystatechange;
        var url;
        this.onreadystatechange = function () {
            if (this.readyState == 2) {
                url = this.responseURL;
            } else
            if (this.readyState == 4 && this.status == 503) {
                var iframe = document.createElement("iframe");
                iframe.src = url;
                iframe.style.display = "none";
                document.documentElement.appendChild(iframe);
                setTimeout(function () {
                    document.documentElement.removeChild(iframe);
                    proxy2.call(this);
                }, 5200);
            } else {
                proxy2.call(this);
            }
        };
        proxy1.apply(this, [].slice.call(arguments));
    };
})();

var SOURCES = {
    0: {
        RAW: {
        },
        SUB: {
            EN: [
            {
                id: "fa5845e2-555c-11e5-885d-feff819cdc9f",
                domain: 'kissanime.to',
                protocol: 'https://',
                matchers: [/^https?:\/\/(www\.)?kissanime\.to\/(m\/)?anime\/.*/i],
                urlTitleExtractors: [/anime\/([^\/]+)/i],
                load: function (title, callback) {
                    title = title.replace(/[^A-z0-9]/g, "-").replace(/[^A-z0-9]$/g, '').replace(/[-]+/g, "-").replace(/^-+|-+$/g, "");
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4) {
                            if (xmlhttp.status == 200) {
                                var el = document.createElement('div');
                                var match = xmlhttp.responseXML.body.textContent.match(/asp\.wrap\("(.*?)"\)/i);
                                if (!match) {
                                    callback();
                                } else {
                                    el.innerHTML = asp.wrap(match[1]);
                                    var episodes = el.querySelectorAll(".episode");
                                    if (episodes.length > 0) {
                                        mediaData.current_title = title;
                                        var site_defined_title = xmlhttp.responseXML.querySelector("#divContentList > article > div.post-content > h2 > a").textContent;
                                        // Dubbed animes are unwanted here
                                        if(site_defined_title.endsWith('(Dub)') != -1) {
                                            callback();
                                            return;   
                                        }
                                        for (var i = episodes.length; i--; ) {
                                            var option = document.createElement('option');
                                            option.textContent = episodes[i].textContent;
                                            option.value = episodes[i].getAttribute('data-value');
                                            mediaPlayer.select.add(option);
                                        }
                                    // Update title on top of the video with the current site title defined
                                    mediaPlayer.osd.textContent = site_defined_title;
                                    mediaPlayer.source.load1(mediaPlayer.select.value);
                                } else {
                                    callback();
                                }
                            }
                        } else {
                            callback();
                        }
                    }
                };
                xmlhttp.open("GET", this.protocol + this.domain + "/M/Anime/" + title, true);
                xmlhttp.responseType = "document";
                xmlhttp.send();
            },
            load1: function () {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        if (xmlhttp.status == 200) {
                            var el = document.createElement('div');
                            el.innerHTML = asp.wrap(xmlhttp.responseText);
                            var links = el.querySelectorAll('a');
                            mediaPlayer.select1.textContent = '';
                            for (var i = 0; i < links.length; i++) {
                                var option = document.createElement('option');
                                option.textContent = links[i].textContent.match(/[0-9]+x([0-9]+)/)[1] + 'p';
                                option.value = links[i].href;
                                if (option.textContent == preferences.favorite_quality) {
                                    option.selected = true;
                                }
                                mediaPlayer.select1.add(option);
                            }
                            mediaPlayer.select.options[mediaPlayer.select.selectedIndex].select1 = mediaPlayer.select1.innerHTML;
                            mediaPlayer.injectMedia(mediaPlayer.select1.value);
                        } else {
                            mediaPlayer.setState(STATE.ERROR);
                        }
                    }
                };
                xmlhttp.open("POST", this.protocol + this.domain + "/Mobile/GetEpisode", true);
                xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlhttp.send('eID=' + mediaPlayer.select.value);
            }
        },
        {
            id: "fa5849e8-555c-11e5-885d-feff819cdc9f",
            protocol: 'http://',
            domain: 'gogoanime.tv',
            matchers: [/^https?:\/\/(www\.)?gogoanime\.tv\/category\/.*/i, /^https?:\/\/(www\.)?gogoanime\.tv\/[^\/]+/gi],
            urlTitleExtractors: [/\/category\/(.*)/, /\.tv\/(.*)/],
            load: function (title, callback) {
                title = title.replace(/[^A-z0-9]/g, "-").replace(/[^A-z0-9]$/g, '').replace(/[-]+/g, "-").replace(/^-+|-+$/g, "");
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        var id = xmlhttp.responseXML.querySelector("#movie_id");
                        if (xmlhttp.status == 200 && id) {
                            mediaData.current_title = title;
                                    // Update title on top of the video with the current site title defined
                                    mediaPlayer.osd.textContent = (xmlhttp.responseXML.querySelector(".anime_video_body h1") || xmlhttp.responseXML.querySelector(".anime_info_body_bg h1")).textContent;
                                    var xmlhttp2 = new XMLHttpRequest();
                                    xmlhttp2.onreadystatechange = function () {
                                        if (xmlhttp2.readyState == 4) {
                                            if (xmlhttp2.status == 200) {
                                                var episodes = xmlhttp2.responseXML.querySelectorAll("#episode_related li a");
                                                for (var i = episodes.length - 1; i >= 0; i--) {
                                                    var option = document.createElement("option");
                                                    option.value = episodes[i].href.match(/\.tv\/([^\/]+)/)[1];
                                                    option.text = episodes[i].textContent;
                                                    mediaPlayer.select.add(option);
                                                }
                                                mediaPlayer.source.load1();
                                            }
                                        }
                                    };
                                    xmlhttp2.open("GET", mediaPlayer.source.protocol + mediaPlayer.source.domain + "/site/loadEpisode?ep_start=0&ep_end=9999&id=" + id.value, true);
                                    xmlhttp2.responseType = "document";
                                    xmlhttp2.send();
                                } else {
                                    callback();
                                }
                            }
                        };
                        xmlhttp.open("GET", this.protocol + this.domain + "/" + title, true);
                        xmlhttp.responseType = "document";
                        xmlhttp.send();
                    },
                    load1: function (uri) {
                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.onreadystatechange = function () {
                            if (xmlhttp.readyState == 4) {
                                if (xmlhttp.status == 200) {
                                    if (mediaPlayer.select.options.length == 0) {
                                        mediaPlayer.select.innerHTML = xmlhttp.responseXML.querySelector("#selectEpisode").innerHTML;
                                    }
                                    if (xmlhttp.responseXML.querySelector("#selectQuality")) {
                                        mediaPlayer.select1.innerHTML = xmlhttp.responseXML.querySelector("#selectQuality").innerHTML;
                                        mediaPlayer.injectMedia();
                                    } else {
                                        var iframes = xmlhttp.responseXML.querySelectorAll('.anime_video_body_watch_items .ads_iframe');
                                        var i = 0;
                                        execute(i);
                                        function execute(i) {
                                            if (!iframes[i].hasAttribute("link-watch")) {
                                                return;
                                            }
                                            var link = "http://www.mp4upload.com/embed-" + iframes[i].getAttribute('link-watch') + ".html";
                                            var xmlhttp1 = new XMLHttpRequest();
                                            xmlhttp1.onreadystatechange = function () {
                                                if (xmlhttp1.readyState == 4) {
                                                    if (xmlhttp1.status == 200) {
                                                        var script = xmlhttp1.responseXML.querySelector('#player_code script');
                                                        var src = script.innerHTML.match(/(http:\/\/.*?\/video\.mp4)/);
                                                        mediaPlayer.injectMedia(src[1]);
                                                    } else {
                                                        i++;
                                                        execute(i);
                                                    }
                                                }
                                            };
                                            xmlhttp1.open("GET", link, true);
                                            xmlhttp1.responseType = "document";
                                            xmlhttp1.send();
                                        }
                                    }
                                }  else {
                                    mediaPlayer.setState(STATE.ERROR);
                                }
                            }
                        };
                        xmlhttp.open("GET", this.protocol + this.domain + "/" + (uri || mediaPlayer.select.value), true);
                        xmlhttp.responseType = "document";
                        xmlhttp.send();
                    }
                }
                ],
                FR: {
                },
                ES: {
                }
            },
            DUB: {
                EN: [
                {
                   id: 'ad98592b-9183-4e3a-ac5f-9516c9db6474',
                   domain: 'kissanime.to',
                   protocol: 'https://',
                   forceGoogle: true,
                   matchers: [/^https?:\/\/(www\.)?kissanime\.to\/(M\/)?anime\/.*-dub$/i],
                   urlTitleExtractors: [/anime\/([^\/]+)/i]
               }
               ],
               FR: [
               ]
           }
       },
       1: {
        RAW: {
        },
        SUB: {
            EN: [
            {
                id: "fa583cd2-555c-11e5-885d-feff819cdc9f",
                protocol: 'http://',
                domain: 'kissmanga.com',
                matchers: [/^https?:\/\/(www\.)?kissmanga\.com\/manga\/.*/i],
                urlTitleExtractors: [/manga\/([^\/]+)/i],
                load: function (title, callback) {
                    title = title.replace(/[^A-z0-9]/g, "-").replace(/[^A-z0-9]$/g, '').replace(/[-]+/g, "-").replace(/^-+|-+$/g, "");
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4) {
                            var chapters = xmlhttp.responseXML.querySelectorAll(".listing a");
                            if (xmlhttp.status == 200 && chapters.length > 0) {
                                mediaData.current_title = title;
                                var site_defined_title = xmlhttp.responseXML.querySelector(".barContent a.bigChar").textContent;
                                mediaPlayer.osd.textContent = site_defined_title;
                                mediaPlayer.source.load1(chapters[chapters.length - 1].href.match(/\/manga\/[^\/]+\/([^?]+\?id=[0-9]+)$/i)[1]);
                            } else {
                                callback();
                            }
                        }
                    };
                    xmlhttp.open("GET", this.protocol + this.domain + "/Manga/" + title, true);
                    xmlhttp.responseType = "document";
                    xmlhttp.send();
                },
                load1: function (uri) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4) {
                            if (xmlhttp.status == 200) {
                                if (mediaPlayer.select.options.length == 0) {
                                    mediaPlayer.select.innerHTML = (xmlhttp.responseXML.querySelector(".selectChapter") || xmlhttp.responseXML.querySelector("#selectChapter")).innerHTML;
                                }
                                var images1 = xmlhttp.responseXML.body.innerHTML.match(/lstImages\.push\("([^"]+)"\)/gi);
                                var images = [];
                                for (var i = 0; i < images1.length; i++) {
                                    images.push(images1[i].match(/lstImages\.push\("([^"]+)"\)/i)[1]);
                                }
                                mediaPlayer.select1.innerHTML = "";
                                for (var i = 0; i < images.length; i++) {
                                    var option = document.createElement("option");
                                    option.value = images[i];
                                    option.text = "Page " + pad((i + 1), 2);
                                    mediaPlayer.select1.add(option);
                                }
                                mediaPlayer.injectMedia(mediaPlayer.select1.value);
                            } else {
                                mediaPlayer.setState(STATE.ERROR);
                            }
                        }
                    };
                    xmlhttp.open("GET", this.protocol + this.domain + "/Manga/" + mediaData.current_title + "/" + (uri || mediaPlayer.select.value), true);
                    xmlhttp.responseType = "document";
                    xmlhttp.send();
                }
            },
            {
                id: "13894ab2-9189-11e5-8994-feff819cdc9f",
                protocol: 'http://',
                domain: 'www.mangahit.com',
                matchers: [/^https?:\/\/(www\.)?mangahit\.com\/manga\/.*/i],
                urlTitleExtractors: [/manga\/([^\/]+)/i],
                load: function (title, callback) {
                    title = title.replace(/[^A-z0-9]/g, "-").replace(/[^A-z0-9]$/g, '').replace(/[-]+/g, "-").replace(/^-+|-+$/g, "");
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4) {
                            var chapters = xmlhttp.responseXML.querySelectorAll(".scope.records a");
                            if (xmlhttp.status == 200 && chapters.length > 0) {
                                mediaData.current_title = title;
                                var site_defined_title = xmlhttp.responseXML.querySelector("#ml_content > h1").textContent;
                                mediaPlayer.osd.textContent = site_defined_title;
                                mediaPlayer.source.load1(chapters[chapters.length - 1].href.match(/[^\/]+\/([0-9]+)/i)[1]);
                            } else {
                                callback();
                            }
                        }
                    };
                    xmlhttp.open("GET", this.protocol + this.domain + "/manga/" + title, true);
                    xmlhttp.responseType = "document";
                    xmlhttp.send();
                },
                load1: function (chapter) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4) {
                            if (xmlhttp.status == 200) {
                                if (mediaPlayer.select.options.length == 0) {
                                    var options = xmlhttp.responseXML.querySelector("#chapters").options;
                                    for (var i = options.length - 1; i >= 0; i--) {
                                        var option = document.createElement("option");
                                        option.value = options[i].value;
                                        option.text = options[i].text;
                                        mediaPlayer.select.add(option);
                                    }
                                }
                                var imageSrc = xmlhttp.responseXML.querySelector("#topchapter > div.chapter-viewer > a > img").src;
                                mediaPlayer.select1.innerHTML = xmlhttp.responseXML.querySelector("#pages").innerHTML;
                                for (var i = 0; i < mediaPlayer.select1.options.length; i++) {
                                    mediaPlayer.select1.options[i].value = imageSrc.replace(/([0-9]+)\.jpg$/, pad(i + 1, 2) + ".jpg");
                                }
                                mediaPlayer.injectMedia(imageSrc);
                            } else {
                                mediaPlayer.setState(STATE.ERROR);
                            }
                        }
                    };
                    xmlhttp.open("GET", this.protocol + this.domain + "/" + mediaData.current_title + "/" + (chapter || mediaPlayer.select.value) + "/1", true);
                    xmlhttp.responseType = "document";
                    xmlhttp.send();
                }
            }
            ],
            FR: [
            ],
            ES: [
            ]
        }
    }
};