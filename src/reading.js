/* global STATE */

var preferences = new StorageItem('MediaPlayer.preferences.reading', {
});

function initComponents() {
    var that = this;
    this.img = document.createElement('img');
    this.img.tabIndex = '-1';
    this.img.className = 'animated fadeIn';
    this.img.setAttribute('data-pin-no-hover', 'true');
    this.img.onclick = function (evt) {
        if (that.img.getAttribute('data-cursor') == null) {
            return;
        }
        if (that.img.getAttribute('data-cursor') == 'left') {
            that.nextPrevious(true);
        } else {
            that.nextPrevious();
        }
    };
    this.img.onload = function () {
      console.log('[MediaPlayer] Image loaded');
      console.log('---------- Video data ----------');
      console.log('Image src: ' + this.src);
      console.log('Image width: ' + this.width);
      console.log('Image height: ' + this.height);
      console.log('---------- Video data ----------');
      that.setState(STATE.LOADED);
  };
  this.img.onmousemove = function (evt) {
    if (mediaPlayer.state != STATE.LOADED) {
        return;
    }
    var x = evt.offsetX;
    var sideSize = that.img.width / 2;
    if (x < sideSize) {
        if (!that.nextButton.disabled) {
            that.img.setAttribute('data-cursor', 'left');
        } else {
            that.img.removeAttribute('data-cursor');
        }
    } else if (x > sideSize) {
        if (!that.prevButton.disabled) {
            that.img.setAttribute('data-cursor', 'right');
        } else {
            that.img.removeAttribute('data-cursor');
        }
    }
};
this.img.onfocus = function () {
    that.isFocused = true;
};
this.img.onblur = function () {
    that.isFocused = false;
};
this.mediaWrapper.style.height = 'auto';
this.mediaWrapper.appendChild(this.img);
}


