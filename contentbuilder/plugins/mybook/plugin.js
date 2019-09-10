/*
    Book Editor Plugin
*/

(function () {

	var css =
    "<style>" +
        ".book-pagebreak-line {position:absolute; left: 0px; border-bottom:#d8d8d8 1px dotted; width:100%}" +
    "</style>";
	
	var config = {
		bookPageSize: {width: "588px", height: "888px"}, //6 1/8 inch x 9 1/4 inch and ppi=96
		bookMargin: {top: "96px", right: "96px", bottom: "96px", left: "96px"} // 1inch  and ppi=96
	};
	
	_cb.addCss(css);
  
	_cb.currentPagesCount = 0;
	
	_cb.calculateWordsCount = function() {
		
		var content = _cb.html();
		var temp = jQuery("<div></div>");
		var text = temp.html(content).text();
		
		var wordsCount = text.replace(/[^\w ]/g, "").split(/\s+/).length;
		
		temp.html("");
		temp = null;
		
		return wordsCount;
	};
	
	_cb.calculatePagesCount = function() {
		
		var bookContainer = this.getScope();
		var docHeight = bookContainer.height();
		
		var docContentHeight = docHeight;
		
		var pageSize = (this.settings.bookPageSize ? this.settings.bookPageSize : config.bookPageSize);
		var pageMargin = (this.settings.bookMargin ? this.settings.bookMargin : config.bookMargin);
		
		var pageContentAreaHeight = parseInt(pageSize.height) - 
				parseInt(pageMargin.top) -
				parseInt(pageMargin.bottom);
		
		return Math.ceil(docContentHeight / pageContentAreaHeight);
	};
	
	_cb.showPageBreakLine = function() {
		var pagesCount = this.calculatePagesCount();
		if(pagesCount != this.currentPagesCount) {
			jQuery(this.settings.bookContainer).find(".book-pagebreak-line").remove();
			if(pagesCount>1) {
				
				var pageContentAreaHeight = parseInt(this.settings.bookPageSize.height) - 
					parseInt(this.settings.bookMargin.top) -
					parseInt(this.settings.bookMargin.bottom);
				
				for(var i=0; i<pagesCount-1; i++) {
					jQuery("<div class='book-pagebreak-line'></div>").css("top", ((i+1)*pageContentAreaHeight) + 35 + "px")
						.appendTo(this.settings.bookContainer);
				}
			}
			
		}
	};
	
	_cb.updateWordsAndPagesCount = function() {
		
		var wordsCount = _cb.calculateWordsCount();
		if(_cb.settings.onWordsCount) _cb.settings.onWordsCount(wordsCount);
		
		var pagesCount = _cb.calculatePagesCount();
		if(_cb.settings.bookShowPageBreakLine == true) _cb.showPageBreakLine();
		_cb.currentPagesCount = pagesCount;
		
		if(_cb.settings.onPagesCount) _cb.settings.onPagesCount(pagesCount);
		
	};
	
	var oldchange = _cb.settings.onChange;
	_cb.settings.onChange = function (e) {
		var ret = oldchange.apply(this, arguments);
		
		_cb.updateWordsAndPagesCount();
		
	}
		
	var oldpluginloaded = _cb.settings.onPluginsLoaded;
	_cb.settings.onPluginsLoaded = function (e) {
		var ret = oldpluginloaded.apply(this, arguments);
		
		_cb.updateWordsAndPagesCount();
		
	}
	
	//attach key press to content area.	
	var bookContainer = _cb.getScope();
	var bookTm = null;
	bookContainer.on("keypress", function() {
		
		if(bookTm!=null) {
			clearTimeout(bookTm);
			bookTm = null;
		}
		bookTm = setTimeout(function() {
			
			_cb.updateWordsAndPagesCount();
			
			bookTm = null;
		}, 1000);
	});

})();
