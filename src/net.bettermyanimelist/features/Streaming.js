/* global UserInterface, MediaPlayer */

(function () {
    this.SOURCES = {
        RAW: {
        },
        SUB: {
            ENG: {
            },
            FR: {
            }
        },
        DUB: {
            ENG: {
            },
            FR: {
            }
        }
    };
    this.preferences = new StorageItem('MediaPlayer.preferences.streaming', {
        default_source: 0,
        default_quality: '1080',
        playback: {
            volume: 100, muted: false
        }
    });
    this.history = new StorageItem('MediaPlayer.history.streaming');
    /*
     * Sets the episode
     * @param {integer} optIndex
     */
    this.setEpisode = function (index) {
        this.episode = this.episodes[index];
    };
    /*
     * Sets the video quality
     * @param {string} quality
     */
    this.setQuality = function (quality) {
        this.preferences.default_quality = quality;
        var media = this.episode.media[quality];
        for (var i = 0; !media || i < RESOLUTION_FALLBACKS.length; i++) {
            media = this.episode.media[RESOLUTION_FALLBACKS[i]];
        }
    };
}).call(MediaPlayer);

(function () {
    /*
     * When the video is clicked upon.
     */
    this.onClick = function () {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    };
    /*
     * When the video volume has been changed.
     */
    this.onVolumeChange = function () {
        MediaPlayer.preferences.playback.volume = this.volume;
    };
    /*
     * When the video current time has been changed.
     */
    this.onTimeUpdate = function () {

    };
    /*
     * When the value of the resolutions' select element has been changed.
     */
    this.onResolutionChange = function () {

    };
}).call(MediaPlayer.Events);

UserInterface.create([
    {
        $query: '#mediaPlayer .mediaWrapper',
        $position: 'afterbegin',
        $name: 'video',
        className: 'media',
        preload: '',
        onclick: MediaPlayer.Events.onClick,
        muted: MediaPlayer.preferences.playback.muted,
        volume: MediaPlayer.preferences.playback.volume,
        onvolumechange: MediaPlayer.Events.onVolumeChange,
        ontimeupdate: MediaPlayer.Events.onTimeUpdate,
        onloadedmetadata: UserInterface.process.bind(null, 'MediaPlayer.setState$LOADED', true),
        onerror: UserInterface.process.bind(null, 'MediaPlayer.setState$ERROR', true)

    }
], {actionName: 'MediaPlayer.init'});

UserInterface.update([
    {
        $query: '#mediaPlayer .sourceControls select:first-child',
        className: 'episodes',
        onchange: MediaPlayer.Events.onEpisodeChange
    },
    {
        $query: '#mediaPlayer .sourceControls select:first-child',
        className: 'resolutions',
        onchange: MediaPlayer.Events.onResolutionChange
    }
]);
