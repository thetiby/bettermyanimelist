var mediaData = {};
var mediaPlayer;
var streaming = window.location.href.match(/^https?:\/\/(www\.)?myanimelist\.net\/anime(\/|\.php\?id=)([0-9]+)/);

(function () {
    parseMediaData();
    createMediaButton();   

    if (window.location.hash == "#media") {
        setTimeout(function () {
            media_button.click();
        }, 1);
        history.pushState("", document.title, window.location.pathname);
    }
})();

function parseMediaData() {
    mediaData.title = document.querySelector("#contentWrapper span[itemprop='name']").textContent;
    mediaData.id = window.location.href.match(/^https?:\/\/(www\.)?myanimelist\.net\/(anime|manga)(\/|\.php\?id=)([0-9]+)/)[4];
    mediaData.alternativeTitles = [];
    var enMatch = document.body.innerHTML.match(/<span class="dark_text">English:<\/span>(.*?)(<\/div>|\n)/i);
    var synonyms = document.body.innerHTML.match(/<span class="dark_text">Synonyms:<\/span>(.*?)(<\/div>|\n)/i);
    var jpMatch = document.body.innerHTML.match(/<span class="dark_text">Japanese:<\/span>(.*?)(<\/div>|\n)/i);
    if (enMatch) {
        mediaData.alternativeTitles = mediaData.alternativeTitles.concat(enMatch[1].trim().split(","));
    }
    if (synonyms) {
        mediaData.alternativeTitles = mediaData.alternativeTitles.concat(synonyms[1].trim().split(","));
    }
    if (jpMatch) {
        mediaData.alternativeTitles = mediaData.alternativeTitles.concat(jpMatch[1].trim().split(","));
    }
}

function createMediaButton() {
    var li = document.querySelector("#horiznav_nav ul li").cloneNode(true);
    media_button = li.firstChild;
    media_button.textContent = streaming ? "Streaming" : "Reading";
    media_button.href = "javascript:;";
    media_button.classList.remove("horiznav_active");
    media_button.addEventListener("click", function createMediaPlayer() {
        this.removeEventListener("click", createMediaPlayer);
        document.querySelector("#horiznav_nav ul li .horiznav_active").className = "";
        this.classList.add("horiznav_active");
        mediaPlayer = new MediaPlayer();
        if (document.querySelector("#horiznav_nav").nextSibling != null) {
            document.querySelector("#horiznav_nav").parentNode.insertBefore(mediaPlayer.div, document.querySelector("#horiznav_nav").nextSibling);
        } else {
            document.querySelector("#horiznav_nav").parentNode.appendChild(mediaPlayer.div);
        }
        mediaPlayer.select_source.onchange();
    }, false);
    li.appendChild(media_button);
    document.querySelector("#horiznav_nav ul").appendChild(li);
}