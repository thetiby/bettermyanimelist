/* global UserInterface, Media, Select, Source, SOURCES, chrome */

(function () {
    /*
     * Sets the source
     * @param {integer} id
     */
    this.setSource = function (id) {

    };
}).call(MediaPlayer = {});

(function () {
    /*
     * When the value of the sources' select element has been changed.
     */
    this.onSourceChange = function () {

    };
    /*
     * When the 'previous' button has been clicked upon.
     */
    this.onPrevious = function () {

    };
    /*
     * When the 'next' button has been clicked upon.
     */
    this.onNext = function () {

    };
}).call(MediaPlayer.Events = {});

(function () {

}).call(MediaPlayer.Source = {});


UserInterface.replace([
    {
        id: 'mediaPlayer',
        $query: '#content > table > tbody > tr > td:nth-child(2) > table',
        $children: [
            {
                className: 'sourceControls clearfix',
                $children: [
                    {
                        className: 'left',
                        $children: [
                            {
                                $name: 'select',
                                $_disabled: [false, true, true],
                                $_onchange: [MediaPlayer.Events.onSourceChange],
                                $_children: [UserInterface.render.bind(null, 'MediaPlayer.sourceOption', MediaPlayer.sources), null, null]
                            }
                        ]
                    },
                    {
                        className: 'right',
                        $children: [
                            {
                                $name: 'button',
                                $_disabled: [true, true, false, true],
                                $_textContent: ['Previous', 'Next', 'Immersive Mode', 'Report'],
                                $_className: ['previous', 'next', 'immersiveMode', 'report'],
                                $_onclick: [
                                    MediaPlayer.Events.onPrevious,
                                    MediaPlayer.Events.onNext,
                                    UserInterface.process.bind(null, 'MediaPlayer.enableImmersiveMode'),
                                    window.open.bind(chrome.runtime.getManifest().homepage_url)
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                className: 'mediaWrapper',
                $children: [
                    {
                        $_className: ['error_screen', 'loading_screen', 'osd_screen']
                    }
                ]
            },
            {
                className: 'cloak',
                onclick: UserInterface.process.bind(null, 'MediaPlayer.disableImmersiveMode', true)
            }
        ]
    }
], {actionName: 'MediaPlayer.preInit', actions: ['MediaPlayer.init']});

UserInterface.model(function (data, index) {
    return  {
        $name: 'option',
        text: data.name,
        value: index
    };
}, {modelName: 'MediaPlayer.sourceOption'});

/*
 * Player is initiating, a loading screen is displayed and unusable elements are back to their original state.
 */

UserInterface.update([
    {
        $query: '#mediaPlayer .mediaWrapper .media',
        src: ''
    },
    {
        $queryAll: [
            '#mediaPlayer .sourceControls select:nth-of-type(2)',
            '#mediaPlayer .sourceControls select:nth-of-type(3)'
        ],
        textContent: ''
    },
    {
        $queryAll: [
            '#mediaPlayer .sourceControls select:nth-of-type(2)',
            '#mediaPlayer .sourceControls select:nth-of-type(3)',
            '#mediaPlayer .sourceControls button:nth-of-type(1)',
            '#mediaPlayer .sourceControls button:nth-of-type(2)',
            '#mediaPlayer .sourceControls button:nth-of-type(3)'
        ],
        disabled: true
    },
    {
        $query: '#mediaPlayer .mediaWrapper .loading_screen',
        style: 'display:block'
    }
], {actionName: 'MediaPlayer.setState$INITIATING'});

/*
 * Player is loading, loading screen is still there as make sure the media is unloaded.
 */

UserInterface.update([
    {
        $query: '#mediaPlayer .mediaWrapper .media',
        src: ''
    },
    {
        $query: '#mediaPlayer .mediaWrapper .loading_screen',
        style: 'display:block'
    },
    {
        $query: '#mediaPlayer .sourceControls select:last-of-type',
        disabled: true
    }
], {actionName: 'MediaPlayer.setState$LOADING'});

/*
 * Player is initiated, we should now be able to use the media controls, as we are unsure whether the current 
 * media is loaded the loading screen is still displayed.
 */

UserInterface.update([
    {
        $queryAll: [
            '#mediaPlayer .sourceControls select',
            '#mediaPlayer .sourceControls button'
        ],
        disabled: false
    }
], {actionName: 'MediaPlayer.setState$INITIATED'});

/*
 * Player is loaded, the current media is loaded, loading screen is now hidden.
 */

UserInterface.update([
    {
        $query: '#mediaPlayer .mediaWrapper .loading_screen',
        style: 'display:none'
    }
], {actionName: 'MediaPlayer.setState$LOADED'});

/*
 * An error occurred, error screen will be displayed.
 */

UserInterface.update([
    {
        $query: '#mediaPlayer .mediaWrapper .error_screen',
        style: 'display:block'
    }
], {actionName: 'MediaPlayer.setState$LOADED'});

UserInterface.update([
    {
        $query: '#mediaPlayer .mediaWrapper',
        className: 'mediaWrapper immersiveMode'
    }
], {actionName: 'MediaPlayer.enableImmersiveMode'});

UserInterface.update([
    {
        $query: '#mediaPlayer .mediaWrapper',
        className: 'mediaWrapper'
    }
], {actionName: 'MediaPlayer.disableImmersiveMode'});
