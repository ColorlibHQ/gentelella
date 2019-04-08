/* global jQuery */

/**
## jquery.flot.hover.js

This plugin is used for mouse hover and tap on a point of plot series.
It supports the following options:
```js
grid: {
    hoverable: false, //to trigger plothover event on mouse hover or tap on a point
    clickable: false //to trigger plotclick event on mouse hover
}
```

It listens to native mouse move event or click, as well as artificial generated
tap and touchevent.

When the mouse is over a point or a tap on a point is performed, that point or
the correscponding bar will be highlighted and a "plothover" event will be generated.

Custom "touchevent" is triggered when any touch interaction is made. Hover plugin
handles this events by unhighlighting all of the previously highlighted points and generates
"plothovercleanup" event to notify any part that is handling plothover (for exemple to cleanup
the tooltip from webcharts).
*/

(function($) {
    'use strict';

    var options = {
        grid: {
            hoverable: false,
            clickable: false
        }
    };

    var browser = $.plot.browser;

    function init(plot) {
        plot.hooks.processOptions.push(initHover);
    }

    function initHover(plot, options) {
        var highlights = [];

        var eventType = {
            click: 'click',
            hover: 'hover'
        }

        var lastMouseMoveEvent = plot.getPlaceholder()[0].lastMouseMoveEvent;

        plot.highlight = highlight;
        plot.unhighlight = unhighlight;

        var tap = {
            generatePlothoverEvent: function (e) {
                var o = plot.getOptions(),
                    newEvent = new CustomEvent('mouseevent');

                //transform from touch event to mouse event format
                newEvent.pageX = e.detail.changedTouches[0].pageX;
                newEvent.pageY = e.detail.changedTouches[0].pageY;
                newEvent.clientX = e.detail.changedTouches[0].clientX;
                newEvent.clientY = e.detail.changedTouches[0].clientY;

                if (o.grid.hoverable) {
                    doTriggerClickHoverEvent(newEvent, eventType.hover, 30);
                }
                return false;
            }
        };

        function bindEvents(plot, eventHolder) {
            var o = plot.getOptions();

            if (o.grid.hoverable || o.grid.clickable) {
                eventHolder[0].addEventListener('touchevent', triggerCleanupEvent, false);
                eventHolder[0].addEventListener('tap', tap.generatePlothoverEvent, false);
            }

            if (options.grid.clickable) {
                eventHolder.click(onClick);
            }

            if (options.grid.hoverable) {
                eventHolder.mousemove(onMouseMove);

                // Use bind, rather than .mouseleave, because we officially
                // still support jQuery 1.2.6, which doesn't define a shortcut
                // for mouseenter or mouseleave.  This was a bug/oversight that
                // was fixed somewhere around 1.3.x.  We can return to using
                // .mouseleave when we drop support for 1.2.6.

                eventHolder.bind("mouseleave", onMouseLeave);
            }
        }

        function shutdown(plot, eventHolder) {
            eventHolder[0].removeEventListener('tap', tap.generatePlothoverEvent);
            eventHolder[0].removeEventListener('touchevent', triggerCleanupEvent);
            eventHolder.unbind("mousemove", onMouseMove);
            eventHolder.unbind("mouseleave", onMouseLeave);
            eventHolder.unbind("click", onClick);
            highlights = [];
        }

        function doTriggerClickHoverEvent(event, eventType, searchDistance) {
            var series = plot.getData();
            if (event !== undefined 
                && series.length > 0 
                && series[0].xaxis.c2p !== undefined 
                && series[0].yaxis.c2p !== undefined) {
                var eventToTrigger = "plot" + eventType;
                var seriesFlag = eventType + "able";
                triggerClickHoverEvent(eventToTrigger, event,
                    function(i) {
                        return series[i][seriesFlag] !== false;
                    }, searchDistance);
            }
        }

        if (options.grid.hoverable || options.grid.clickable) {
            plot.hooks.bindEvents.push(bindEvents);
            plot.hooks.shutdown.push(shutdown);
            plot.hooks.drawOverlay.push(drawOverlay);
            plot.hooks.processRawData.push(processRawData);
        }

        function onMouseMove(e) {
            lastMouseMoveEvent = e;
            plot.getPlaceholder()[0].lastMouseMoveEvent = e;
            doTriggerClickHoverEvent(e, eventType.hover);
        }

        function onMouseLeave(e) {
            lastMouseMoveEvent = undefined;
            plot.getPlaceholder()[0].lastMouseMoveEvent = undefined;
            triggerClickHoverEvent("plothover", e,
                function(i) {
                    return false;
                });
        }

        function onClick(e) {
            doTriggerClickHoverEvent(e, eventType.click);
        }

        function triggerCleanupEvent() {
            plot.unhighlight();
            plot.getPlaceholder().trigger('plothovercleanup');
        }

        // trigger click or hover event (they send the same parameters
        // so we share their code)
        function triggerClickHoverEvent(eventname, event, seriesFilter, searchDistance) {
            var options = plot.getOptions(),
                offset = plot.offset(),
                page = browser.getPageXY(event),
                canvasX = page.X - offset.left,
                canvasY = page.Y - offset.top,
                pos = plot.c2p({
                    left: canvasX,
                    top: canvasY
                }),
                distance = searchDistance !== undefined ? searchDistance : options.grid.mouseActiveRadius;

            pos.pageX = page.X;
            pos.pageY = page.Y;

            var item = plot.findNearbyItem(canvasX, canvasY, seriesFilter, distance);

            if (item) {
                // fill in mouse pos for any listeners out there
                item.pageX = parseInt(item.series.xaxis.p2c(item.datapoint[0]) + offset.left, 10);
                item.pageY = parseInt(item.series.yaxis.p2c(item.datapoint[1]) + offset.top, 10);
            }

            if (options.grid.autoHighlight) {
                // clear auto-highlights
                for (var i = 0; i < highlights.length; ++i) {
                    var h = highlights[i];
                    if ((h.auto === eventname &&
                        !(item && h.series === item.series &&
                            h.point[0] === item.datapoint[0] &&
                            h.point[1] === item.datapoint[1])) || !item) {
                        unhighlight(h.series, h.point);
                    }
                }

                if (item) {
                    highlight(item.series, item.datapoint, eventname);
                }
            }

            plot.getPlaceholder().trigger(eventname, [pos, item]);
        }

        function highlight(s, point, auto) {
            if (typeof s === "number") {
                s = plot.getData()[s];
            }

            if (typeof point === "number") {
                var ps = s.datapoints.pointsize;
                point = s.datapoints.points.slice(ps * point, ps * (point + 1));
            }

            var i = indexOfHighlight(s, point);
            if (i === -1) {
                highlights.push({
                    series: s,
                    point: point,
                    auto: auto
                });

                plot.triggerRedrawOverlay();
            } else if (!auto) {
                highlights[i].auto = false;
            }
        }

        function unhighlight(s, point) {
            if (s == null && point == null) {
                highlights = [];
                plot.triggerRedrawOverlay();
                return;
            }

            if (typeof s === "number") {
                s = plot.getData()[s];
            }

            if (typeof point === "number") {
                var ps = s.datapoints.pointsize;
                point = s.datapoints.points.slice(ps * point, ps * (point + 1));
            }

            var i = indexOfHighlight(s, point);
            if (i !== -1) {
                highlights.splice(i, 1);

                plot.triggerRedrawOverlay();
            }
        }

        function indexOfHighlight(s, p) {
            for (var i = 0; i < highlights.length; ++i) {
                var h = highlights[i];
                if (h.series === s &&
                    h.point[0] === p[0] &&
                    h.point[1] === p[1]) {
                    return i;
                }
            }

            return -1;
        }

        function processRawData() {
            triggerCleanupEvent();
            doTriggerClickHoverEvent(lastMouseMoveEvent, eventType.hover);
        }

        function drawOverlay(plot, octx, overlay) {
            var plotOffset = plot.getPlotOffset(),
                i, hi;

            octx.save();
            octx.translate(plotOffset.left, plotOffset.top);
            for (i = 0; i < highlights.length; ++i) {
                hi = highlights[i];

                if (hi.series.bars.show) drawBarHighlight(hi.series, hi.point, octx);
                else drawPointHighlight(hi.series, hi.point, octx, plot);
            }
            octx.restore();
        }
    }

    function drawPointHighlight(series, point, octx, plot) {
        var x = point[0],
            y = point[1],
            axisx = series.xaxis,
            axisy = series.yaxis,
            highlightColor = (typeof series.highlightColor === "string") ? series.highlightColor : $.color.parse(series.color).scale('a', 0.5).toString();

        if (x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max) {
            return;
        }

        var pointRadius = series.points.radius + series.points.lineWidth / 2;
        octx.lineWidth = pointRadius;
        octx.strokeStyle = highlightColor;
        var radius = 1.5 * pointRadius;
        x = axisx.p2c(x);
        y = axisy.p2c(y);

        octx.beginPath();
        var symbol = series.points.symbol;
        if (symbol === 'circle') {
            octx.arc(x, y, radius, 0, 2 * Math.PI, false);
        } else if (typeof symbol === 'string' && plot.drawSymbol && plot.drawSymbol[symbol]) {
            plot.drawSymbol[symbol](octx, x, y, radius, false);
        }

        octx.closePath();
        octx.stroke();
    }

    function drawBarHighlight(series, point, octx) {
        var highlightColor = (typeof series.highlightColor === "string") ? series.highlightColor : $.color.parse(series.color).scale('a', 0.5).toString(),
            fillStyle = highlightColor,
            barLeft;

        var barWidth = series.bars.barWidth[0] || series.bars.barWidth;
        switch (series.bars.align) {
            case "left":
                barLeft = 0;
                break;
            case "right":
                barLeft = -barWidth;
                break;
            default:
                barLeft = -barWidth / 2;
        }

        octx.lineWidth = series.bars.lineWidth;
        octx.strokeStyle = highlightColor;

        var fillTowards = series.bars.fillTowards || 0,
            bottom = fillTowards > series.yaxis.min ? Math.min(series.yaxis.max, fillTowards) : series.yaxis.min;

        $.plot.drawSeries.drawBar(point[0], point[1], point[2] || bottom, barLeft, barLeft + barWidth,
            function() {
                return fillStyle;
            }, series.xaxis, series.yaxis, octx, series.bars.horizontal, series.bars.lineWidth);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'hover',
        version: '0.1'
    });
})(jQuery);
