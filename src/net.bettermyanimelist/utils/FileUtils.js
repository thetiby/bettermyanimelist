(function () {
    this.saveAs = function (filename, contentType, content, charset) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:' + contentType + ';charset=' + (charset || 'utf-8') + ',' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
}).call(FileUtils  = {});