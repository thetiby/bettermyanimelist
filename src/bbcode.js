var BUTTONS = [
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
  param: true,
  tag: 'color'
},
{
  icon: 'fa fa-text-height',
  title:'Text size',
  param: true,
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
  param: true,
  tag: 'url'
},
{
  icon: 'fa fa-picture-o',
  title:'Image',
  tag:'img'
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
  tag:'yt'
}
];


(function () {
  var textAreas = document.querySelectorAll("textarea");      
  for (var i = 0; i < textAreas.length; i++) {    
    /* Toolbar */
    var toolbar = document.createElement("div");
    toolbar.id = 'bbCodeToolbarWrapper';           
    toolbar.textArea = textAreas[i];     
    /* Buttons wrapper */
    toolbar.buttonsWrapper = document.createElement('div');
    toolbar.buttonsWrapper.className = 'buttonsWrapper';
    for (var ii = 0; ii < BUTTONS.length; ii++) {
      var button = document.createElement('button');
      button.className = 'bmalSuitable';
      button.title = BUTTONS[ii].title;
      // FIXME
      button.obj = BUTTONS[ii];
      button.innerHTML = "<i class='"+BUTTONS[ii].icon+"'></i>";
      button.onclick = function(e) { 
        e.preventDefault();
        wrapValue(this.obj, toolbar.textArea);
      };
      toolbar.buttonsWrapper.appendChild(button);
    }      
    toolbar.appendChild(toolbar.buttonsWrapper); 
    /* HTML div */
    toolbar.htmlDiv = document.createElement('div');
    toolbar.htmlDiv.style.cssText = window.getComputedStyle(toolbar.textArea).cssText;
    toolbar.htmlDiv.style['-webkit-user-modify'] = '';
    toolbar.htmlDiv.className = 'html';
    toolbar.htmlDiv.contentEditable = true;
    toolbar.htmlDiv.style.display = 'none';
    toolbar.htmlDiv = toolbar.htmlDiv;
    toolbar.appendChild(toolbar.htmlDiv);
    /* Events */
    toolbar.textArea.oninput = function() {
     toolbar.htmlDiv.innerHTML = BBCodeToHTML(this.value);   
   };
   toolbar.htmlDiv.oninput = function() {
     toolbar.textArea.value = HTMLToBBCode(htmlDiv.innerHTML);   
   }; 

   /* Wraps textarea inside bbCodeToolbarWrapper */
   toolbar.textArea.parentNode.insertBefore(toolbar, toolbar.textArea);
   toolbar.appendChild(toolbar.textArea); 
 }
})();

function wrapValue(obj, textarea) {
  var tag1 = '['+obj.tag+(obj.param ? '=' : '')+']';
  var tag2 = '[/'+obj.tag+']';
  var len = textarea.value.length;
  var start = textarea.selectionStart1 || textarea.selectionStart;
  var end = textarea.selectionEnd1 || textarea.selectionEnd;
  var scrollTop = textarea.scrollTop1 || textarea.scrollTop;
  var scrollLeft = textarea.scrollLeft1 || textarea.scrollLeft;
  var sel = textarea.value.substring(start, end);
  var rep = tag1 + sel + tag2;
  textarea.value = textarea.value.substring(0, start) + rep + textarea.value.substring(end, len);
  textarea.scrollTop = scrollTop;
  textarea.scrollLeft = scrollLeft;
  if(obj.param) {
    textarea.selectionStart = start + tag1.length;
    textarea.selectionEnd = (start + tag1.length) - 1;
  } else {    
    textarea.selectionStart = start + tag1.length;
    textarea.selectionEnd = tag1.length + end;
  }
}