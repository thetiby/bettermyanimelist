var animelist;
var mangalist;
var isRetrieving;

function messagePreview(str, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if(xmlhttp.readyState == 4) {
      if(xmlhttp.status == 200) {
        var previewContainer = xmlhttp.responseXML.querySelector('#content .bgbdrContainer');
        previewContainer.removeChild(previewContainer.childNodes[0]); // <strong>Preview</strong>
        previewContainer.removeChild(previewContainer.childNodes[0]); // <br>
        callback(previewContainer.innerHTML);
      }
    }
  };
  xmlhttp.open('POST', '/forum/?action=message&topic_id=68', true);
  xmlhttp.responseType = 'document';
  xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  xmlhttp.send('msg_text='+str+'&preview=Preview&board_id=&subboard_id=&csrf_token='+getCSRFToken());
}

function isLogged() {
    if (location.pathname.match(/^\/(manga|anime)list\/.*/)) {
        return document.querySelector("#mal_cs_listinfo a") !== null;
    } else {
        return document.querySelector("#malLogin") === null;
    }
}

function getUserName() {
    if (location.pathname.match(/^\/(manga|anime)list\/.*/)) {
        return document.querySelector("#mal_cs_listinfo a").textContent;
    } else {
        return document.querySelector("#header-menu .profile-name").textContent;
    }
}

function isMyAnimeList() {
    return location.pathname.match(/^\/(manga|anime)list\/([^\/]+)/)[2] == document.querySelector("#mal_cs_listinfo a").textContent;
}

function getCSRFToken() {
	return document.querySelector("meta[name='csrf_token']").content;
}

function retrieveUserList(mediaType, callback, username) {
    if (isRetrieving) {
        return;
    }
    isRetrieving = true;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                if (!username) {
                    var entries = xmlhttp.responseXML.querySelectorAll(mediaType == 0 ? "anime" : "manga");
                    if (mediaType == 0) {
                        animelist = [];
                        for (var i = 0; i < entries.length; i++) {
                            animelist.push(entries[i].querySelector("series_animedb_id").textContent);
                        }
                    } else {
                        mangalist = [];
                        for (var i = 0; i < entries.length; i++) {
                            mangalist.push(entries[i].querySelector("series_mangadb_id").textContent);
                        }
                    }
                }
                isRetrieving = false;
                if (callback) {
                    callback(xmlhttp.responseXML);
                }
            } else {
                swal({title: "An error occurred", type: "error", text: "Unable to retrieve the user anime list.<br>Please try again then report the bug on <a href=" + URL_FORUM + ">our forum</a> if it still doesn't work.", html: true});
            }
        }
    };
    xmlhttp.open("GET", URI_API_LIST.replace("{username}", (username || getUserName())).replace("{type}", LIST_TYPES_SEARCH[mediaType]), true);
    xmlhttp.responseType = "document";
    xmlhttp.send();
}