/* global MediaPlayer, UserInterface */

(function () {
    this.preferences = new StorageItem('MediaPlayer.preferences.reading', {
        default_source: 0
    });
    /*
     * Sets the chapter
     * @param {integer} optIndex
     */
    this.setChapter = function (index) {
        this.chapter = this.chapters[index];
    };
    /*
     * Sets the page
     * @param {integer} optIndex
     */
    this.setPage = function (optIndex) {
        this.page = this.chapter.pages[optIndex];
    };
}).call(MediaPlayer);

(function () {
    /*
     * When the image has been clicked upon.
     */
    this.onClick = function () {

    };
    /*
     * When the value of the chapters' select element has been changed.
     */
    this.onChapterChange = function () {

    };
    /*
     * When the value of the pages' select element has been changed.
     */
    this.onPageChange = function () {

    };
}).call(MediaPlayer.Events);

UserInterface.create([
    {
        $query: '#mediaPlayer .mediaWrapper',
        $position: 'afterbegin',
        $name: 'img',
        className: 'media',
        onclick: MediaPlayer.Events.onClick,
        onload: UserInterface.process.bind(null, 'MediaPlayer.setState$LOADED', true),
        onerror: UserInterface.process.bind(null, 'MediaPlayer.setState$ERROR', true)
    }
], {actionName: 'MediaPlayer.init'});

UserInterface.update([
    {
        $query: '#mediaPlayer .sourceControls select:first-child',
        className: 'chapters',
        onchange: MediaPlayer.Events.onChapterChange
    },
    {
        $query: '#mediaPlayer .sourceControls select:first-child',
        className: 'pages',
        onchange: MediaPlayer.Events.onPageChange
    }
]);