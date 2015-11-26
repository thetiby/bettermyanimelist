function swap(json) {
    var ret = {};
    for (var key in json)
        ret[json[key]] = key;
    return ret;
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function focusWithoutScrolling(el) {
    var x = window.scrollX, y = window.scrollY;
    el.focus();
    window.scrollTo(x, y);
}


function setCaretPos(elem, caretPos) {
    if(elem.selectionStart) {
        elem.focus();
        elem.setSelectionRange(caretPos, caretPos);
    }
    else {
        elem.focus();
    }
}