// RESIZE THE PANELS
$(".panel-left").resizable({
  handleSelector: ".splitter",
  resizeHeight: false
});
$(".panel-left").resizable({
  handleSelector: ".splitter-horizontal",
  resizeWidth: false
});


// INIT THE CODE EDITORS
// CSS
var cssEditor = CodeMirror.fromTextArea(document.getElementById("cssCode"), {
  value: "// CSS",
  lineNumbers: true,
  viewportMargin: Infinity,
  mode: "css",
  keyMap: "sublime",
  autoCloseBrackets: true,
  theme: "monokai",
  tabSize: 2,
  lineWrapping:'true',
  extraKeys:{
    Enter: function(cm){
      updateCSS();
      cssEditor.execCommand('newlineAndIndent');
    }
  }
});


var mixedMode = {
  name: "htmlmixed",
  scriptTypes: [
    {matches: /\/x-handlebars-template|\/x-mustache/i,mode: null},
    {matches: /(text|application)\/(x-)?vb(a|script)/i,mode: "vbscript"}
  ]
};

var readOnlyLines = [];
var htmlEditor = CodeMirror.fromTextArea(document.getElementById("htmlCode"), {
  lineNumbers: true,
  viewportMargin: Infinity,
  mode: mixedMode,
  keyMap: "sublime",
  autoCloseBrackets: true,
  theme: "monokai",
  tabSize: 2,
  lineWrapping:'true',
  extraKeys:{
    Enter: function(cm){
      updateHTML();
      htmlEditor.execCommand('newlineAndIndent');
    }
  }
});



// SIZE CHANGE LISTNER
var observer = new MutationObserver(function(mutations) {
  console.log($('.panel-left').height(),$('.panel-left').height(), $(window).height() - $('.panel-left').height());
  $('.panel-left>.row').css('max-height', $('.panel-left').height() + 'px');
  $('.panel-bottom>.row').css('max-height', ($(window).height() - $('.panel-left').height() - 15) + 'px');
});
var target = document.getElementsByClassName('resizable')[0]
observer.observe(target, { attributes : true, attributeFilter : ['style'] });

// EDITOR

$(document).on('keydown', function(e){
  if(e.ctrlKey && e.which === 83){ // CTRL + S
    e.preventDefault();
    if (htmlEditor.hasFocus()) {
      saveHTML();
      updateHTML()
      updateCSS()
    }
    else if (cssEditor.hasFocus()) {
      saveCSS();
      return updateCSS()
    }
  }

  else if(e.ctrlKey && e.which === 16) { // CTRL + SHIFT
    if (!htmlEditor.hasFocus() && !cssEditor.hasFocus()) {
      cssEditor.focus()
      cssEditor.setCursor(cssEditor.lastLine(),cssEditor.getLineTokens(cssEditor.lastLine())[0].end)
    } else if (htmlEditor.hasFocus()) {
      cssEditor.focus()
      cssEditor.setCursor(cssEditor.lastLine(),cssEditor.getLineTokens(cssEditor.lastLine())[0].end)
    } else {
      htmlEditor.focus();
      htmlEditor.setCursor(htmlEditor.lastLine(), htmlEditor.getLineTokens(htmlEditor.lastLine())[0].end)
    }
  }
});

function updateCSS() {
  updateHTML()
  if ($($('#iframe').contents().find('#my_css')).length == 0) {
    $($('#iframe').contents().find('html')).append("<div id='my_css'></div>")
  }
  $($('#iframe').contents().find('#my_css')[0]).append('<style>'+cssEditor.getValue()+'</style>');
}

function updateHTML() {
  $($($('iframe').contents()[0]).find('html')).html(htmlEditor.getValue())
}

function saveCSS() {
  localStorage.setItem("css", cssEditor.getValue())
}

function saveHTML() {
  localStorage.setItem("html", htmlEditor.getValue())
}

htmlEditor.on("change", function() {
  updateHTML()
  updateCSS()
});﻿


$(window).ready(function() {
  console.log("resize");
  $('.panel-left>.row').css('max-height', $('.panel-left').height() + 'px');
  $('.panel-bottom>.row').css('max-height', ($(window).height() - $('.panel-left').height() - 15) + 'px');
  cssEditor.setValue("/* CSS GOES HERE */\n")

  htmlEditor.on('beforeChange',function(cm,change) {
    if ( ~readOnlyLines.indexOf(change.from.line) ) {
      change.cancel();
    }
  });

  if (localStorage.getItem("css")) {
    cssEditor.setValue(localStorage.getItem("css"))
  }

  if (localStorage.getItem("html")) {
    htmlEditor.setValue(localStorage.getItem("html"))
  } else {
    $.get('./site_html.html', function(data) {
      console.log(data)
      htmlEditor.setValue(data)
    })
  }
  updateCSS();

})


$("#close").click(function() {
  $('#panel-container').css('display', 'none' )
  $('.splitter').css('display', 'none' )
  $('#open').css('display', 'block');
})

$("#open").click(function() {
  $('#panel-container').css('display', 'block' )
  $('.splitter').css('display', 'block' )
  $('#open').css('display', 'none');
})
