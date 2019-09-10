/*
    Footnote Plugin
*/

(function () {

    //Add required html for footnote's modal dialogs and toolbar
    var html = '<div class="is-modal footnote" style="z-index:10005">' +
                '<div style="max-width:500px;height:400px;padding:0;">' +
                    '<div class="is-modal-bar is-draggable" style="position: absolute;top: 0;left: 0;width: 100%;z-index:1;line-height:1.5;height:32px;">' + 
                        _cb.out('Footnote') +
                        '<div class="is-modal-close">&#10005;</div>' +
                    '</div>' +
                    '<div style="padding:0;">' +
                        '<iframe style="position: absolute;top: 0;left: 0;width:100%;height:100%;border:none;border-top:32px solid transparent;margin:0;box-sizing:border-box;" src="about:blank"></iframe>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="is-modal delfootnoteconfirm">' +
                '<div style="max-width:526px;text-align:center;">' +
                    '<p>' + _cb.out('Are you sure you want to delete this footnote?') + '</p>' +
                    '<button title="' + _cb.out('Delete') + '" class="input-ok classic">' + _cb.out('Delete') + '</button>' +
                '</div>' +
            '</div>' +
            '<div id="divFootnoteTool" class="is-tool is-plugin-tool">' +
                '<button title="' + _cb.out('Edit Footnote') + '" class="footnote-edit" style="width:35px;height:30px;"><svg class="is-icon-flex" style="fill:rgba(0, 0, 0, 0.65);width:13px;height:13px;"><use xlink:href="#ion-android-create"></use></svg></button>' +
                '<button title="' + _cb.out('Delete') + '" class="footnote-remove" style="width:35px;height:30px;"><svg class="is-icon-flex" style="fill:rgba(0, 0, 0, 0.8);width:20px;height:20px;"><use xlink:href="#ion-ios-close-empty"></use></svg></button>' +
            '</div>' +
            '<svg width="0" height="0" style="position:absolute;display:none;">' +
                '<defs>' +
                    '<symbol viewBox="0 0 512 512" id="ion-android-textsms"><path d="M408 64H96c-22.002 0-32 17.998-32 40v344l64-64h280c22.002 0 40-17.998 40-40V104c0-22.002-17.998-40-40-40zM198.4 242H160v-40h38.4v40zm76.8 0h-38.4v-40h38.4v40zm76.8 0h-38.4v-40H352v40z"></path></symbol>' +
                '</defs>' +
            '</svg>';

    _cb.addHtml(html);

    //Add css to style the footnote
    var css =
    "<style>" +
        "sup.footnote {cursor:pointer;}" +
    "</style>";

  _cb.addCss(css);

    //Add an "Add Footnote" button on the toolbar
    var button =
        '<button class="addfootnote-button" title="Add Footnote" style="font-size:15px;vertical-align:bottom;">' +
        '<svg class="is-icon-flex" style="fill:rgba(0,0,0,0.7);width:16px;height:16px;"><use xlink:href="#ion-android-textsms"></use></svg>' +
        "</button>";

    _cb.addButton("footnote", button, ".addfootnote-button", function () {
        var $modal = jQuery(".is-modal.footnote");
        _cb.showModal($modal, false, true);

        var scriptPath = _cb.getScriptPath();
        $modal.find('iframe').attr('src', scriptPath + 'plugins/footnote/footnote-add.html');
    
        $modal.find(".is-modal-close").on("click", function () {
            _cb.hideModal($modal);
        });
    });

    //When a user click the footnote, the footnote toolbar (contains edit & delete icon) should be displayed.

    //Extend ContentBuilder's onContentClick
    var oldget = _cb.settings.onContentClick;
    _cb.settings.onContentClick = function (e) {

        var ret = oldget.apply(this, arguments);

        //Check of the clicked element is a footnote
        if (((jQuery(e.target).prop("tagName").toLowerCase() == 'sup' && jQuery(e.target).hasClass('footnote')) || jQuery(e.target).parents('sup.footnote').length > 0)) {

            var $footnote = jQuery(e.target);
            jQuery("#divFootnoteTool").data('active', $footnote); //Store the active footnote

            //Show footnote toolbar (contains edit & delete icon)
            var _toolwidth = jQuery("#divFootnoteTool").width();
            var _toolheight = jQuery("#divFootnoteTool").height();
            var _width = $footnote.outerWidth();
            var _height = $footnote.outerHeight();
            var _top = $footnote.offset().top;
            var _left = $footnote.offset().left;
            _left = _left + (_width - _toolwidth);
            _top = _top - _toolheight + 1;
            jQuery("#divFootnoteTool").css("top", _top + "px");
            jQuery("#divFootnoteTool").css("left", _left + "px");
            jQuery("#divFootnoteTool").css("display", "block");

            //Edit footnote
            jQuery('#divFootnoteTool button.footnote-edit').off('click');
            jQuery('#divFootnoteTool button.footnote-edit').on('click', function (e) {

                var $modal = jQuery('.is-modal.footnote');
                _cb.showModal($modal, false, true);

                $modal.find('.is-modal-close').on('click', function () {
                    _cb.hideModal($modal);
                });

                var scriptPath = _cb.getScriptPath();
                $modal.find('iframe').attr('src', scriptPath + 'plugins/footnote/footnote-edit.html');

            });

            //Remove footnote
            jQuery('#divFootnoteTool button.footnote-remove').off('click');
            jQuery('#divFootnoteTool button.footnote-remove').on('click', function (e) {

                var $modal = jQuery('.is-modal.delfootnoteconfirm');
                _cb.showModal($modal, false, true);

                $modal.find('.input-ok').off('click');
                $modal.find('.input-ok').on('click', function (e) {

                    var $footnote = jQuery("#divFootnoteTool").data('active');
                    $footnote.remove();

                    var i=1;
                    jQuery('.is-builder').find('sup.footnote').each(function(){
                        jQuery(this).html(i);
                        i++;
                    });

                    _cb.hideModal($modal);
                });

            });
 
        } else {

            jQuery("#divFootnoteTool").css("display", "none");

        }

        return ret;
    };

    //Another plugin or code needs to be created to show the footnote text when a user hover the footnote. The plugin or code should be run on onRender event.
    
    //Extend ContentBuilder's onRender
    var oldget2 = _cb.settings.onRender;
    _cb.settings.onRender = function (e) {

        //This is just an example code to show the footnote text on console when a user hover the footnote.
        jQuery('sup.footnote').on('mouseover', function(){

                var footnote = decodeURIComponent(jQuery(this).attr('data-footnote'));
                console.log(footnote); 
           
        });

        var ret = oldget2.apply(this, arguments);

        return ret;
    };


})();

