var preferences = new StorageItem('MediaPlayer.preferences.streaming', {
    streaming: {favorite_quality: "1080p"},
    playback: {muted: false, volume: 1}
});

/* global preferences, STATE */

function initComponents() {
    var that = this;
    this.switchPlaybackState = function () {
        if (that.video.paused) {
            that.video.classList.add("nocontrols");
            that.video.play();
        } else {
            that.video.classList.remove("nocontrols");
            that.video.pause();
        }
        focusWithoutScrolling(that.video);
    };
    this.switchControls = function (e) {
        if (!e) {
            e = that.video.lastMouseEvent;
        }
        that.video.lastMouseEvent = e;
        var entered = e.type == "mouseenter";
        var leaved = e.type == "mouseleave";
        var moved = e.type == "mousemove";
        if (that.video.hideControlsTimer) {
            clearTimeout(that.video.hideControlsTimer);
            that.video.hideControlsTimer = null;
        }
        if (moved || entered || that.video.paused) {
            that.video.classList.remove("nocontrols");
        }
        if ((that.video.offsetHeight - e.layerY > 35 || leaved) && !that.video.paused) {
            that.video.hideControlsTimer = setTimeout(function () {
                that.video.classList.add("nocontrols");
                that.video.hideControlsTimer = null;
            }, 500);
        }
    };
    this.video = document.createElement("video");
    this.video.autoplay = true;
    this.video.controls = true;
    this.video.preload = "";
    this.video.tabIndex = "-1";
    this.video.muted = preferences.playback.muted;
    this.video.volume = preferences.playback.volume;
    /*
     * Events
     */
     this.video.onfocus = function () {
        that.isFocused = true;
    };
    this.video.onblur = function () {
        that.isFocused = false;
    };
    this.video.onmousemove = that.switchControls;
    this.video.onclick = that.switchPlaybackState;
    this.video.onloadstart = function () {
        focusWithoutScrolling(that.video);
    };
    this.video.ondblclick = function () {
        if (document.webkitFullscreenElement != null) {
            that.video.webkitExitFullScreen();
        } else {
            that.video.webkitRequestFullScreen();
        }
    };
    this.video.onended = that.nextPrevious.bind(null, true);
    this.video.onmouseenter = that.switchControls;
    this.video.onmouseleave = that.switchControls;
    this.video.onvolumechange = function () {
        preferences.playback.muted = that.video.muted;
        preferences.playback.volume = that.video.volume;
    };
    this.video.onloadeddata = function myEvent() {
        if(that.select1.options.length == 0) {
            that.select1.innerHTML = '<option>'+this.videoHeight+'p</option>';
        }
        console.log('[MediaPlayer] Video data loaded');
        console.log('---------- Video data ----------');
        console.log('Video src: ' + this.src);
        console.log('Video width: ' + this.videoWidth);
        console.log('Video height: ' + this.videoHeight);
        console.log('Video duration: ' + this.duration + '(' + this.duration / 60 + ' min)');
        console.log('---------- Video data ----------');
        that.setState(STATE.LOADED);
    };
    this.mediaWrapper.appendChild(this.video);
}