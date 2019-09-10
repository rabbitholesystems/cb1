/*
Bindery Print Preview Plugin
*/

(function () {

  var _screenwidth = jQuery(window).width();
  if (_screenwidth <= 640) return;

  var html =
    '<div class="is-modal printpreview" style="z-index:10004">' +
      '<div style="width:100%;height:100%;background:#fff;position: relative;display: flex;flex-direction: column;align-items: center;padding: 0px;background:#f8f8f8;">' +
        '<div class="is-modal-bar" style="position: absolute;top: 0;left: 0;width: 100%;z-index:1;line-height:1.5;height:32px;padding:0;">' +
          '<div class="is-modal-close" style="z-index:1;width:30px;height:30px;position:absolute;top:0px;right:0px;box-sizing:border-box;padding:0;line-height:30px;font-size: 12px;color:#777;text-align:center;cursor:pointer;"><svg class="is-icon-flex" style="fill:rgba(0, 0, 0, 0.47);width:30px;height:30px;"><use xlink:href="#ion-ios-close-empty"></use></svg></div>' +
        '</div>' +
        '<iframe data-width="1440" style="width:100%;height:100%;max-width:1440px;border:none;border-top:32px solid transparent;margin:0;box-sizing:border-box;background:#fff;" src="about:blank"></iframe>' +
      '</div>' +
    '</div>' +
    '<svg width="0" height="0" style="position:absolute;display:none;">' +
      '<defs>' +
        '<symbol viewBox="0 0 512 512" id="ion-ios-close-empty"><path d="M340.2 160l-84.4 84.3-84-83.9-11.8 11.8 84 83.8-84 83.9 11.8 11.7 84-83.8 84.4 84.2 11.8-11.7-84.4-84.3 84.4-84.2z"></path></symbol>' +
        '<symbol viewBox="0 0 512 512" id="ion-ios-book-outline"><path d="M347.621 64c-40.941 0-79.121 14-91.578 44.495C242.5 78 205.408 64 164.466 64 109.265 64 64 89.98 64 143v283h22.14c12.86-26.334 44.238-42 78.325-42 40.224 0 73.877 27.528 81.617 64h19.714c7.739-36.472 41.495-64 81.722-64 34.085 0 61.149 11.666 78.429 42H448V143c0-53.02-45.177-79-100.379-79zM248 410.926C230 385.055 199.27 368 164.5 368c-34.769 0-64.5 10.055-83.5 35.926l-1 .537V141c3-41.825 40.089-61 84.293-61 45.162 0 82.145 18.708 83.363 61.808-.017.729.016 1.459.016 2.192l.328 13.103v253.823zM432 148v255.926C414 378.055 382.269 368 347.5 368c-34.77 0-65.5 17.055-83.5 42.926V144c0-44.112 37.659-64 83.587-64C391.79 80 429 91.175 432 133v15z"></path></symbol>' +
      '</defs>' +
    '</svg>';

  _cb.addHtml(html);

  var button =
    '<button class="printpreview-button" title="Preview" style="font-size:15px;vertical-align:bottom;">' +
    '<svg class="is-icon-flex" style="fill:rgba(0,0,0,0.7);width:17px;height:17px;"><use xlink:href="#ion-ios-book-outline"></use></svg>' +
    "</button>";

  _cb.addButton("printpreview", button, ".printpreview-button", function () {
    var $modal = jQuery(".is-modal.printpreview");
    $modal.addClass("active");

    $modal.find(".is-modal-close").on("click", function () {
      $modal.removeClass("active");
    });

    var basehref = "";
    var base = parent.document.querySelectorAll("base[href]");
    if (base.length > 0) {
      basehref = '<base href="' + base[0].href + '" />';
    }

    var csslinks = "";
    var styles = parent.document.querySelectorAll("link[href]");
    for (var i = 0; i < styles.length; i++) {
      if (
        styles[i].href.indexOf("content.css") != -1 
      ) {
        csslinks +=
          '<link href="' +
          styles[i].href +
          '" rel="stylesheet" type="text/css" />';
      }
    }

    var content = _cb.html();
	content = content.replace(/&lt;PAGE BREAK&gt;/gi, "");
	
	var bookPageSize = '{ width: "6.125in", height: "9.25in" }';
	var bookMargin = '{ top: "1in", inner: "1in", outer: "1in", bottom: "1in" }';
	if(_cb.settings.bookPageSize) {
		bookPageSize = '{ width: "'+_cb.settings.bookPageSize.width+'", height:"'+_cb.settings.bookPageSize.height+'"} ';
	}
	if(_cb.settings.bookMargin) {
		bookMargin = '{ top: "'+_cb.settings.bookMargin.top+'", inner: "'+_cb.settings.bookMargin.left+'", outer: "'+_cb.settings.bookMargin.right+'", bottom: "'+_cb.settings.bookMargin.bottom+'" }';
	}
	
    var doc = $modal.find("iframe").get(0).contentWindow.document;
    doc.open();
    var page = '<html>' +
    '<head>' +
    basehref +
    '<meta charset="utf-8">' +
    '<title></title>' +
    csslinks +
	/*
    '<style>' +
      '.column.full { width: 100%; }' +
      '.column.two-third { width: 100%; }' +
      '.column.two-fourth { width: 100%; }' +
      '.column.two-fifth { width: 100%; }' +
      '.column.two-sixth { width: 100%; }' +
      '.column.half { width: 100%; }' +
      '.column.third { width: 100%; }' +
      '.column.fourth { width: 100%; }' +
      '.column.fifth { width: 100%; }' +
      '.column.sixth { width: 100%; }' + 
    '</style>' +
	*/
    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>' +
    '</head>' +
    '<body style="opacity:0">' +
    '<div id="content" class="container">' +
    content +
    '</div>' +
    '<script src="https://unpkg.com/bindery"></script>' +
    '<script src="https://unpkg.com/bindery-controls" type="text/javascript"></script>' +
	'<br /><br />' +
    '<script type="text/javascript">' +
      '$(document).ready(function () {' +
        'let pageCount = 0;' +
        '$("sup.footnote").html("");' +
        'let footnotes = Bindery.Footnote({' +
            'selector: "sup.footnote",' +
            'render: (element, number) => `${number}: ${decodeURIComponent(element.getAttribute("data-footnote"))}`' +
        '});' +
        'let rainbowRule = Bindery.createRule({' +
          'eachPage: function(page, book) {' + /* page.number, book.pageCount, page.background.style.backgroundColor */
            'pageCount = book.pageCount;' +
          '}' +
        '});' +
		
		'let headerRule = Bindery.RunningHeader({' +
		  'render: (page) => {' +
          'if (page.isLeft) return `${page.number} · ${page.heading.h1 || ""} `;' +
	      'else if (page.isRight) return `${page.heading.h2 || ""} · ${page.number}`;' +
		  '},' +
        '});'+    
        
		'let pagebreak = Bindery.PageBreak({' +
		  'selector: ".book-page-break",' +
		  'position: "before",' +
		  /*'continue: "right"' +*/
		'});'+
		
        'Bindery.makeBook({' +
            'content: "#content",' +
            'rules: [ footnotes, rainbowRule, headerRule, pagebreak ],' +
            'pageSetup: {' +
              'size: '+bookPageSize+',' +
			  'margin: '+ bookMargin +
            '},' +
            'printSetup: {' +
              'layout: Bindery.Layout.PAGES,' +
              'paper: Bindery.Paper.A4_LANDSCAPE,' +
              'marks: Bindery.Marks.BOTH,' +
              'bleed: "12pt",' +
            '},' +
        '});' +
        'var timeoutId;' +
        'var prevCount = 0;' +
        'timeoutId = setInterval(function () {' +
            'if(prevCount!=pageCount) {prevCount=pageCount}' +
            'else {' +
              'clearTimeout(timeoutId);' +
              'console.log("Total pages: " + pageCount);}' +                  
            '' +
        '}, 300);' +
        '$("body").css("opacity","1");' +
      '});' +
    '</script>' +
    '</body>' +
    '</html>';
    doc.write(page);
    doc.close();
    
  });
})();
