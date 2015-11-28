var BUTTONS = [
{
  icon: 'fa fa-eye',
  title:'Preview',
  action: previewBBCode
},
{
  icon: 'fa fa-bold',
  title:'Bold',
  tag:'b'
},
{
  icon: 'fa fa-italic',
  title:'Italic',
  tag:'i'
},
{
  icon: 'fa fa-underline',
  title:'Underline',
  tag:'u'
},
{
  icon: 'fa fa-strikethrough',
  title:'Strikethrough',
  tag:'s'
},
{
  icon:'fa fa-font',
  title: 'Text color',
  paramText: 'Text color (Hexadecimal):',
  paramExtract: /(#[0-9]{3,6})/,
  tag: 'color'
},
{
  icon: 'fa fa-text-height',
  title:'Text size',
  paramText: 'Text size (20 to 200):',
  paramExtract: /(^[1-9][0-9]?$|^200$)/,
  tag: 'size'
},
{
  icon: 'fa fa-align-center',
  title:'Align center',
  tag:'center'
},
{
  icon: 'fa fa-align-right',
  title:'Align right',
  tag:'right'
},
{
  icon: 'fa fa-link',
  title:'Link',
  paramText: 'URL:',
  tag: 'url',
  paramExtract: /(https?:\/\/(www\.)?([^\.\s]{1,255}\.?){8,})/i
},
{
  icon: 'fa fa-picture-o',
  title:'Image',
  tag:'img',
  paramAskOnly: true,
  paramText: 'Image URL:',
  paramExtract: /(https?:\/\/(www\.)?([^\.\s]{1,255}\.?){8,})/i
},
{
  icon: 'fa fa-list-ol',
  title:'Unordered list',
  tag:'list=1'
},
{
  icon: 'fa fa-list',
  title:'List',
  tag:'list'
},
{
  icon: 'fa fa-quote-left',
  title:'Quote',
  tag:'quote'
},
{
  icon: 'fa fa-minus-square-o',
  title:'Spoiler',
  tag:'spoiler'
},
{
  icon: 'fa fa-youtube',
  title:'Youtube',
  tag:'yt',  
  paramAskOnly: true,
  paramText:'Video URL:',
  paramExtract: /watch\?v=([A-z0-9]+)/i
}
];

(function () {
  var textAreas = document.querySelectorAll("textarea");      
  for (var i = 0; i < textAreas.length; i++) {    
    /* Toolbar */
    var toolbar = document.createElement("div");
    toolbar.id = 'bbCodeToolbarWrapper';           
    toolbar.textArea = textAreas[i];     
    toolbar.textArea.history = [];
    /* Buttons wrapper */
    toolbar.buttonsWrapper = document.createElement('div');
    toolbar.buttonsWrapper.className = 'buttonsWrapper';
    for (var ii = 0; ii < BUTTONS.length; ii++) {
      var button = document.createElement('button');
      button.className = 'bmalSuitable';
      button.title = BUTTONS[ii].title;
      button.toolbar = toolbar;
      // FIXME
      button.obj = BUTTONS[ii];
      button.innerHTML = "<i class='"+BUTTONS[ii].icon+"'></i>";
      button.onclick = function(e) { 
        e.preventDefault();
        this.toolbar.textArea.focus();   
        if(this.obj.tag) {
          wrapValue(this.obj, this.toolbar.textArea);
        } else {          
          this.obj.action.call(this);
        }
      };
      toolbar.buttonsWrapper.appendChild(button);
    }      
    toolbar.appendChild(toolbar.buttonsWrapper); 
    /* HTML div */
    toolbar.htmlDiv = document.createElement('div');
    toolbar.htmlDiv.style.cssText = window.getComputedStyle(toolbar.textArea).cssText;
    toolbar.htmlDiv.style['-webkit-user-modify'] = '';
    toolbar.htmlDiv.className = 'html';
    toolbar.htmlDiv.style.display = 'none';
    toolbar.htmlDiv = toolbar.htmlDiv;
    toolbar.appendChild(toolbar.htmlDiv);
    /* Wraps textarea inside bbCodeToolbarWrapper */
    toolbar.textArea.parentNode.insertBefore(toolbar, toolbar.textArea);
    toolbar.appendChild(toolbar.textArea); 
  }
})();

function wrapValue(obj, textarea) {
  var len = textarea.value.length;
  var start = textarea.selectionStart;
  var end = textarea.selectionEnd;
  var scrollTop = textarea.scrollTop;
  var scrollLeft = textarea.scrollLeft;
  var sel = textarea.value.substring(start, end);  
  if(obj.paramText) {
   /*
    * If a value is needed, ask for it.
    */
    if(obj.paramAskOnly) {
     /*
      * The tag content needs a value
      */
      if(sel != '' && obj.paramExtract && sel.match(obj.paramExtract)) {
     /*
      * The selection will be used as content for it fits the requirements specified by paramExtract..
      */
      sel = sel.match(obj.paramExtract)[1];
      end1 = sel.length;
    } else if(sel == '' || obj.paramExtract && !sel.match(obj.paramExtract)) {
     /*
      * Either there is no selection or the selection doesn't fit the requirements specified by paramExtract.
      */
      do {
     /*
      * Asks for a value as long as a value is given and this one doesn't fit the requirements specified by paramExtract.
      */
      sel = window.prompt(obj.paramText);
    } while(sel != null && !sel.match(obj.paramExtract || ''));
    if(sel && obj.paramExtract) {
     /*
      * The given value fits the requirements specified by paramExtract.
      * Replace the selection by the given value.
      */
      sel = sel.match(obj.paramExtract)[1];
      end1 = sel.length;
    } else if(!sel) {
     /*
      * The value hasn't been given
      */
      return;
    }
  }
} else {
     /*
      * The tag attribute needs a param
      */
      var param = '';
      do {
     /*
      * Asks for a param as long as a param is given and this one doesn't fit the requirements specified by paramExtract.
      */
      param = window.prompt(obj.paramText);
    }  while(param != null && !param.match(obj.paramExtract || ''));
    if(param && obj.paramExtract) {
     /*
      * The given param fits the requirements specified by paramExtract.
      * Replace the selection by the given param.
      */
      param = param.match(obj.paramExtract)[1];
    } else if(!param) {
     /*
      * The param hasn't been given
      */
      return;
    }
  }
} 
var tag_start = '[' + obj.tag + (obj.paramText && !obj.paramAskOnly ? ('=' + param) : '') + ']';
var tag_end = '[/'+ obj.tag +']';
var rep = (tag_start + sel + tag_end);
textarea.value = textarea.value.substring(0, start) + rep + textarea.value.substring(end, len);
textarea.scrollTop = scrollTop;
textarea.scrollLeft = scrollLeft;
textarea.selectionStart = start + tag_start.length;
textarea.selectionEnd = tag_start.length + (typeof end1 != 'undefined' ? end1 : end);
}

function previewBBCode() {
  var isPreviewing = this.toolbar.htmlDiv.style.display == 'block';
  if(isPreviewing) {
    this.toolbar.htmlDiv.textContent = '';
    this.toolbar.textArea.style.display = 'block';
    this.toolbar.htmlDiv.style.display = 'none';
    this.classList.remove('active');
    switchButtonsState(this.toolbar, false);
  } else {    
    this.toolbar.htmlDiv.textContent = bbCodeToHTML(this.toolbar.textArea.value);
    this.toolbar.htmlDiv.style.display = 'block';
    this.toolbar.textArea.style.display = 'none';
    this.classList.add('active');
    switchButtonsState(this.toolbar, true);
  }
}

function switchButtonsState(toolbar, disable) {
  for(var i = 1; i < toolbar.buttonsWrapper.childNodes.length;i++) {
    toolbar.buttonsWrapper.childNodes[i].disabled = disable;
  }
}

function bbCodeToHTML(str) { // [b]dfskjdfsjdkhdsqjkhdsq[/b]
  return str.replace(/\[(?!\/)(.*?)\](.*?)\[\/.*?\]/mg, function(match, p1, p2, offset, string) {
    console.log('match: '+ match);
    console.log('p1: '+ p1);
    console.log('p2: '+ p2);
    console.log('offset: '+ offset);
    console.log('string: '+ string);
    var BBCODE_HTML_EQUIVALENT = {
      'b': '<b>'+p2+'</b>',
      'i': '<i>'+p2+'</i>',
      'u': '<u>'+p2+'</u>',
      's': '<s>'+p2+'</s>',
      'color': '<color>'+p2+'</color>',
      'size': '<size>'+p2+'</size>',
      'center': '<center>'+p2+'</center>',
      'right': '<right>'+p2+'</right>',
      'url': '<a href=></a>',
      'image': '<img src=>',
      'list=1': '<ol>' + p2.replace(/blabla/g,'<li>$1</li>') + '</ol>',
      'list': '<ul>' + p2.replace(/blabla/g,'<li>$1</li>') + '</ul>',
      'quote': '<quote>'+p2+'</quote>',
      'spoiler': '<spoiler>'+p2+'</spoiler>',
      'yt': '<yt>'+p2+'</yt>',
    };
    return p1 in BBCODE_HTML_EQUIVALENT ? BBCODE_HTML_EQUIVALENT[p1] : match; 
  });
}