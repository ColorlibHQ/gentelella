/* Test Flot plugin for purposes of testing in conjunction with other plugins that use drag events

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.
*/

(function ($) {
    function init(plot) {
        function onDrag(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }

        function onDragStart(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }

        function onDragEnd(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }

        plot.hooks.bindEvents.push(function(plot, eventHolder) {
            var o = plot.getOptions();
            if (o.testDrag.on === true) {
                plot.addEventHandler("dragstart", onDragStart, eventHolder, 10);
                plot.addEventHandler("drag", onDrag, eventHolder, 10);
                plot.addEventHandler("dragend", onDragEnd, eventHolder, 10);
            }
        });

        plot.hooks.shutdown.push(function (plot, eventHolder) {
            eventHolder.unbind("dragstart", onDragStart);
            eventHolder.unbind("drag", onDrag);
            eventHolder.unbind("dragend", onDragEnd);
        });
    }

    $.plot.plugins.push({
        init: init,
        options: {
            testDrag: {
                on: false // true or false
            }
        },
        name: 'testDragPlugin',
        version: '1.1'
    });
})(jQuery);
