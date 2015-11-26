var cache = [[]];
var resultsDiv, cloak, xmlhttp;

(function () {
    document.querySelector("#topSearchResultList").parentNode.removeChild(document.querySelector("#topSearchResultList"));
    resultsDiv = document.createElement("div");
    resultsDiv.className = "results";
    resultsDiv.style.display = "none";
    cloak = document.createElement("div");
    cloak.className = 'cloak';
    cloak.onclick = function () {
        close();
    };
    document.querySelector("#searchBar").parentNode.appendChild(resultsDiv);
    document.querySelector("#searchBar").parentNode.appendChild(cloak);
    document.querySelector("#topSearchText").oninput = open;
    document.querySelector("#topSearchText").onclick = open;
    function open() {
        if (document.querySelector("#topSearchValue").selectedIndex > 1) {
        } else if (document.querySelector("#topSearchText").value.trim() != "") {
            var title = document.querySelector("#topSearchText").value.replace(/[^A-z0-9%]/g, "%");
            search(title, document.querySelector("#topSearchValue").value);
        } else {
            close();
        }
    }
    function close() {
        resultsDiv.style.display = "none";
        cloak.style.display = "none";
    }
    document.querySelector("#topSearchValue").onchange = function () {
        document.querySelector("#topSearchText").oninput();
    };
})();

function search(str, type) {
    if (xmlhttp) {
        xmlhttp.abort();
    }
    if (isLogged() && (type == 'anime' && !animelist || type == 'manga' && !mangalist)) {
        cloak.style.display = "block";
        resultsDiv.style.display = "block";
        resultsDiv.innerHTML = "<br /><span class=\"loader\"></span><br />Retrieving user list...<br /><br />";
        retrieveUserList(type == 'anime' ? 0 : 1, function () {
            document.querySelector("#topSearchText").oninput();
        });
        return;
    }
    cloak.style.display = "block";
    resultsDiv.style.display = "block";
    if (typeof cache[type] != "undefined" && typeof cache[type][str] != "undefined") {
        resultsDiv.innerHTML = cache[type][str];
        reloadLightBox();
    } else {
        resultsDiv.innerHTML = "<br /><span class=\"loader\"></span><br />Retrieving results...<br /><br />";
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    // XML is passed as a string for the API sometimes returns invalid XML 
                    // It also needs to be satinized 
                    var text = xmlhttp.responseText;
                    var regex = /&[^;]*;/gm;
                    var el = document.createElement('div');
                    text = text.replace(regex, function(m) {
                        if(m.match(/(&apos;|&amp;|&quot;|&lt;|&gt;)/)) {
                            return m;
                        }
                        el.innerHTML = m;
                        return el.textContent;
                    });
                    var textToXML = new DOMParser().parseFromString(text, "text/xml");
                    updateResults(textToXML, type);
                    if (typeof cache[type] == "undefined") {
                        cache[type] = [];
                    }
                    cache[type][str] = resultsDiv.innerHTML;
                    reloadLightBox();
                } else if (xmlhttp.status == 204) {
                    resultsDiv.innerHTML = "<span class=\"message\">No titles matching your query were found.</span>";
                } else if (xmlhttp.status != 0) {
                    resultsDiv.innerHTML = "<span class=\"message\">Unable to access the API. Please try again or contact the developers.</span>";
                }
            }
        };
        xmlhttp.open("GET", URI_API_SEARCH.replace("{type}", type).replace("{query}", encodeURI(str)), true);
        xmlhttp.setRequestHeader("Authorization", "Basic eDQ1MXBvOng0NTFwb3g0NTFwbw==");
        xmlhttp.timeout = 5000;
        xmlhttp.ontimeout = function () {
            resultsDiv.innerHTML = "<span class=\"message\">The request timed out. Please try again.</span>";
            var a = document.createElement("a");
            a.onclick = function () {
                if (str.trim() != "") {
                    search(str, type);
                }
            };
            a.href = "javascript:;";
            a.innerHTML = " Try again";
            resultsDiv.appendChild(a);
        };
        xmlhttp.send();
    }
}

function updateResults(data, type) {
    var entries = data.querySelectorAll("entry");
    if (entries.length == 0) {
        resultsDiv.innerHTML = "<span class=\"message\">An error occured. Please try again then report the bug on <a href=" + URL_FORUM + ">our forum</a> if it still doesn't work.</span>";
        return;
    }
    resultsDiv.innerHTML = "";
    for (var i = 0; i < entries.length; i++) {
        var id = entries[i].querySelector("id").textContent;
        var entry = document.createElement("div");
        entry.className = "entry";
        var thumbnail = document.createElement("a");
        thumbnail.href = "/" + type + "/" + id + "#media";
        var t = entries[i].querySelector("image").textContent.replace(/^(.*)\.(.*)$/, "$1t.$2");
        thumbnail.innerHTML = "<span class='thumbnail'><img src=" + (!t.match("\/?\/0t?\.jpg") ? t : "http://cdn.myanimelist.net/images/na_series.gif") + "><span class='watch'><img width='40' src='" + chrome.extension.getURL('resources/images/autocomplete-watch.png') + "'></span></span>";
        entry.appendChild(thumbnail);
        var divdd = document.createElement('div');
        divdd.style = 'display:table;width:83%';
        var divd = document.createElement('div');
        divd.style = 'float:left;max-width:83%';
        var title = document.createElement("a");
        title.className = "title";
        title.title = (entries[i].querySelector("english") ? ('English: ' + entries[i].querySelector("english").textContent) : '') + 
        (entries[i].querySelector("synonyms") ? ('\u000ASynonyms: ' + entries[i].querySelector("synonyms").textContent) : '');
        title.href = "/" + type + "/" + id;
        var status = entries[i].querySelector("status").textContent;
        title.innerHTML = entries[i].querySelector("title").textContent;
        divd.appendChild(title);
        divd.innerHTML += " <small " + (status == "Currently Airing" || status == "Not yet aired" || status == "Not yet published" || status == "Publishing" ? "style=\"color:" + (status == "Currently Airing" || status == "Publishing" ? "red" : "blue") + "\"" : "") + ">(" + status + ")<small> ";
        divdd.appendChild(divd);
        entry.appendChild(divdd);
        if (isLogged() && (animelist || mangalist)) {
            if (type == 'anime' && animelist.indexOf(id) == -1 || type == 'manga' && mangalist.indexOf(id) == -1) {
                var add = document.createElement("a");
                add.href = (type == 'anime' ? URI_ADD_ANIME : URI_ADD_MANGA).replace("{id}", id);
                add.title = "Quick add anime to my list";
                add.className = "Lightbox_AddEdit button_add";
                add.textContent = "add";
                divdd.appendChild(add);
            } else {
                var edit = document.createElement("a");
                edit.href = (type == 'anime' ? URI_EDIT_ANIME : URI_EDIT_MANGA).replace("{id}", id);
                edit.title = "Quick edit anime to my list";
                edit.className = "Lightbox_AddEdit button_edit";
                edit.textContent = "edit";
                divdd.appendChild(edit);
            }
        }
        var informations = document.createElement("p");
        informations.className = "informations";
        var genre = entries[i].querySelector("type").textContent;
        var nb = entries[i].querySelector(type == 'anime' ? "episodes" : "volumes").textContent;
        nb = nb == 0 ? "Unknown" : nb;
        informations.innerHTML = "Type: <a href=\"/" + type + ".php?q=&type=" + (type == 'anime' ? LIST_TYPES_ANIME[genre] : LIST_TYPES_MANGA[genre]) + "\">" + genre + "</a> | \n" + (type == 'anime' ? "Episode" : "Volumes") + ": <b>" + nb + "</b>" + " | Score: <b>" + entries[i].querySelector("score").textContent + "</b>";
        entry.appendChild(informations);
        var synopsis = document.createElement("p");
        synopsis.className = "synopsis";
        var synopsisContent = entries[i].querySelector("synopsis").textContent.replace(/\[(.*?)\](.*?)\[\/.*?\]/g, '<$1>$2</$1>');
        synopsisContent = synopsisContent.length > 200 ? synopsisContent.slice(0, 200) + " <a href=\"/" + type + "/" + id + "\">read more</a>" : synopsisContent;
        synopsis.innerHTML = synopsisContent.length > 0 ? synopsisContent.replace(new RegExp("<br />", 'g'), "") : "No synopsis has been added for this series yet.";
        entry.appendChild(synopsis);
        resultsDiv.appendChild(entry);
    }
}

function reloadLightBox() {
    var script = document.createElement("script");
    script.innerHTML = "$('.Lightbox_AddEdit').fancybox({'width':990,'height':'85%','autoScale':true,'autoDimensions':true,'transitionIn':'none','transitionOut':'none','type':'iframe'});";
    script.type = "text/javascript";
    document.body.appendChild(script);
    script.parentNode.removeChild(script);
}