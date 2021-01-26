(function ($) {

    $.HighlightSearch = function (options) {

        var defaults = {};

        var plugin = this;

        plugin.settings = {};

        plugin.init = function () {
            plugin.settings = $.extend({}, defaults, options);
            if (!plugin.settings.url)
                throw new Error("Url parameter is required in HighlightSearch plugin!");

            document.onscroll = clearAllInstances;
            document.onmouseup = plugin.search;
            if (!document.all) document.captureEvents(Event.MOUSEUP);
        };

        plugin.search = function (e) {
            
            selected_text = (document.all) ? document.selection.createRange().text : document.getSelection();
            if ($(selected_text.anchorNode).closest(".highlight-search-pop").length == 0
                && selected_text.toString() != null
                && selected_text.toString().trim() != ""
            ) {

                clearAllInstances();

                cursor_left = e.pageX;
                cursor_top = e.pageY;
                
                $.get(plugin.settings.url + '&q=' + selected_text.toString().trim(), function (response) {

                    if (response.IsAllowed) {
                        var popoverId = "hspop_" + new Date().getTime() + "_" + Math.random().toString().substr(2);

                        jQuery('<div/>', {
                            id: popoverId,
                            class: 'highlight-search-pop'
                        }).appendTo("body");

                        var popoverHeight = $('#' + popoverId).height();

                        var windowWidth = $(window).width();

                        if (cursor_left >= (windowWidth - 300)) $('#' + popoverId).css('right', '0px');
                        else $('#' + popoverId).css('left', (cursor_left + 10) + 'px');

                        $('#' + popoverId).css('top', (cursor_top - (popoverHeight / 2) + 20) + 'px');
                        $('#' + popoverId).html('<h4>Searching: <b>' + selected_text + '</b> <span class="hspop-dismiss">&times;</span></h4><p class="hspop-content">Please wait...</p>');

                        $('#' + popoverId + " span.hspop-dismiss").attr("onclick", "$(this).closest('.highlight-search-pop').remove();");

                        $('#' + popoverId).show();

                        insertHsPopContent(response.HtmlResult, popoverId);
                    }
                });
            }
        };

        var insertHsPopContent = function (result, id) {
            $('#' + id + ' p.hspop-content').html(result);
        };

        var clearAllInstances = function () {
            $(".highlight-search-pop").remove();
        };

        plugin.init();
    };

}(jQuery));