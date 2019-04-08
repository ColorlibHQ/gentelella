/* Javascript plotting library for jQuery, version 1.0.3.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

*/

// the actual Flot code
(function($) {
    "use strict";

    var Canvas = window.Flot.Canvas;

    function defaultTickGenerator(axis) {
        var ticks = [],
            start = $.plot.saturated.saturate($.plot.saturated.floorInBase(axis.min, axis.tickSize)),
            i = 0,
            v = Number.NaN,
            prev;

        if (start === -Number.MAX_VALUE) {
            ticks.push(start);
            start = $.plot.saturated.floorInBase(axis.min + axis.tickSize, axis.tickSize);
        }

        do {
            prev = v;
            //v = start + i * axis.tickSize;
            v = $.plot.saturated.multiplyAdd(axis.tickSize, i, start);
            ticks.push(v);
            ++i;
        } while (v < axis.max && v !== prev);

        return ticks;
    }

    function defaultTickFormatter(value, axis, precision) {
        var oldTickDecimals = axis.tickDecimals,
            expPosition = ("" + value).indexOf("e");

        if (expPosition !== -1) {
            return expRepTickFormatter(value, axis, precision);
        }

        if (precision > 0) {
            axis.tickDecimals = precision;
        }

        var factor = axis.tickDecimals ? Math.pow(10, axis.tickDecimals) : 1,
            formatted = "" + Math.round(value * factor) / factor;

        // If tickDecimals was specified, ensure that we have exactly that
        // much precision; otherwise default to the value's own precision.
        if (axis.tickDecimals != null) {
            var decimal = formatted.indexOf("."),
                decimalPrecision = decimal === -1 ? 0 : formatted.length - decimal - 1;
            if (decimalPrecision < axis.tickDecimals) {
                var decimals = ("" + factor).substr(1, axis.tickDecimals - decimalPrecision);
                formatted = (decimalPrecision ? formatted : formatted + ".") + decimals;
            }
        }

        axis.tickDecimals = oldTickDecimals;
        return formatted;
    };

    function expRepTickFormatter(value, axis, precision) {
        var expPosition = ("" + value).indexOf("e"),
            exponentValue = parseInt(("" + value).substr(expPosition + 1)),
            tenExponent = expPosition !== -1 ? exponentValue : (value > 0 ? Math.floor(Math.log(value) / Math.LN10) : 0),
            roundWith = Math.pow(10, tenExponent),
            x = value / roundWith;

        if (precision) {
            var updatedPrecision = recomputePrecision(value, precision);
            return (value / roundWith).toFixed(updatedPrecision) + 'e' + tenExponent;
        }

        if (axis.tickDecimals > 0) {
            return x.toFixed(recomputePrecision(value, axis.tickDecimals)) + 'e' + tenExponent;
        }
        return x.toFixed() + 'e' + tenExponent;
    }

    function recomputePrecision(num, precision) {
        //for numbers close to zero, the precision from flot will be a big number
        //while for big numbers, the precision will be negative
        var log10Value = Math.log(Math.abs(num)) * Math.LOG10E,
            newPrecision = Math.abs(log10Value + precision);

        return newPrecision <= 20 ? Math.floor(newPrecision) : 20;
    }

    ///////////////////////////////////////////////////////////////////////////
    // The top-level container for the entire plot.
    function Plot(placeholder, data_, options_, plugins) {
        // data is on the form:
        //   [ series1, series2 ... ]
        // where series is either just the data as [ [x1, y1], [x2, y2], ... ]
        // or { data: [ [x1, y1], [x2, y2], ... ], label: "some label", ... }

        var series = [],
            options = {
                // the color theme used for graphs
                colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
                xaxis: {
                    show: null, // null = auto-detect, true = always, false = never
                    position: "bottom", // or "top"
                    mode: null, // null or "time"
                    font: null, // null (derived from CSS in placeholder) or object like { size: 11, lineHeight: 13, style: "italic", weight: "bold", family: "sans-serif", variant: "small-caps" }
                    color: null, // base color, labels, ticks
                    tickColor: null, // possibly different color of ticks, e.g. "rgba(0,0,0,0.15)"
                    transform: null, // null or f: number -> number to transform axis
                    inverseTransform: null, // if transform is set, this should be the inverse function
                    min: null, // min. value to show, null means set automatically
                    max: null, // max. value to show, null means set automatically
                    autoScaleMargin: null, // margin in % to add if autoScale option is on "loose" mode,
                    autoScale: "exact", // Available modes: "none", "loose", "exact", "sliding-window"
                    windowSize: null, // null or number. This is the size of sliding-window.
                    growOnly: null, // grow only, useful for smoother auto-scale, the scales will grow to accomodate data but won't shrink back.
                    ticks: null, // either [1, 3] or [[1, "a"], 3] or (fn: axis info -> ticks) or app. number of ticks for auto-ticks
                    tickFormatter: null, // fn: number -> string
                    showTickLabels: "major", // "none", "endpoints", "major", "all"
                    labelWidth: null, // size of tick labels in pixels
                    labelHeight: null,
                    reserveSpace: null, // whether to reserve space even if axis isn't shown
                    tickLength: null, // size in pixels of major tick marks
                    showMinorTicks: null, // true = show minor tick marks, false = hide minor tick marks
                    showTicks: null, // true = show tick marks, false = hide all tick marks
                    gridLines: null, // true = show grid lines, false = hide grid lines
                    alignTicksWithAxis: null, // axis number or null for no sync
                    tickDecimals: null, // no. of decimals, null means auto
                    tickSize: null, // number or [number, "unit"]
                    minTickSize: null, // number or [number, "unit"]
                    offset: { below: 0, above: 0 }, // the plot drawing offset. this is calculated by the flot.navigate for each axis
                    boxPosition: { centerX: 0, centerY: 0 } //position of the axis on the corresponding axis box
                },
                yaxis: {
                    autoScaleMargin: 0.02, // margin in % to add if autoScale option is on "loose" mode
                    autoScale: "loose", // Available modes: "none", "loose", "exact"
                    growOnly: null, // grow only, useful for smoother auto-scale, the scales will grow to accomodate data but won't shrink back.
                    position: "left", // or "right"
                    showTickLabels: "major", // "none", "endpoints", "major", "all"
                    offset: { below: 0, above: 0 }, // the plot drawing offset. this is calculated by the flot.navigate for each axis
                    boxPosition: { centerX: 0, centerY: 0 } //position of the axis on the corresponding axis box
                },
                xaxes: [],
                yaxes: [],
                series: {
                    points: {
                        show: false,
                        radius: 3,
                        lineWidth: 2, // in pixels
                        fill: true,
                        fillColor: "#ffffff",
                        symbol: 'circle' // or callback
                    },
                    lines: {
                        // we don't put in show: false so we can see
                        // whether lines were actively disabled
                        lineWidth: 1, // in pixels
                        fill: false,
                        fillColor: null,
                        steps: false
                        // Omit 'zero', so we can later default its value to
                        // match that of the 'fill' option.
                    },
                    bars: {
                        show: false,
                        lineWidth: 2, // in pixels
                        // barWidth: number or [number, absolute]
                        // when 'absolute' is false, 'number' is relative to the minimum distance between points for the series
                        // when 'absolute' is true, 'number' is considered to be in units of the x-axis
                        horizontal: false,
                        barWidth: 0.8,
                        fill: true,
                        fillColor: null,
                        align: "left", // "left", "right", or "center"
                        zero: true
                    },
                    shadowSize: 3,
                    highlightColor: null
                },
                grid: {
                    show: true,
                    aboveData: false,
                    color: "#545454", // primary color used for outline and labels
                    backgroundColor: null, // null for transparent, else color
                    borderColor: null, // set if different from the grid color
                    tickColor: null, // color for the ticks, e.g. "rgba(0,0,0,0.15)"
                    margin: 0, // distance from the canvas edge to the grid
                    labelMargin: 5, // in pixels
                    axisMargin: 8, // in pixels
                    borderWidth: 1, // in pixels
                    minBorderMargin: null, // in pixels, null means taken from points radius
                    markings: null, // array of ranges or fn: axes -> array of ranges
                    markingsColor: "#f4f4f4",
                    markingsLineWidth: 2,
                    // interactive stuff
                    clickable: false,
                    hoverable: false,
                    autoHighlight: true, // highlight in case mouse is near
                    mouseActiveRadius: 15 // how far the mouse can be away to activate an item
                },
                interaction: {
                    redrawOverlayInterval: 1000 / 60 // time between updates, -1 means in same flow
                },
                hooks: {}
            },
            surface = null, // the canvas for the plot itself
            overlay = null, // canvas for interactive stuff on top of plot
            eventHolder = null, // jQuery object that events should be bound to
            ctx = null,
            octx = null,
            xaxes = [],
            yaxes = [],
            plotOffset = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            },
            plotWidth = 0,
            plotHeight = 0,
            hooks = {
                processOptions: [],
                processRawData: [],
                processDatapoints: [],
                processOffset: [],
                setupGrid: [],
                adjustSeriesDataRange: [],
                setRange: [],
                drawBackground: [],
                drawSeries: [],
                drawAxis: [],
                draw: [],
                axisReserveSpace: [],
                bindEvents: [],
                drawOverlay: [],
                resize: [],
                shutdown: []
            },
            plot = this;

        var eventManager = {};

        // interactive features

        var redrawTimeout = null;

        // public functions
        plot.setData = setData;
        plot.setupGrid = setupGrid;
        plot.draw = draw;
        plot.getPlaceholder = function() {
            return placeholder;
        };
        plot.getCanvas = function() {
            return surface.element;
        };
        plot.getSurface = function() {
            return surface;
        };
        plot.getEventHolder = function() {
            return eventHolder[0];
        };
        plot.getPlotOffset = function() {
            return plotOffset;
        };
        plot.width = function() {
            return plotWidth;
        };
        plot.height = function() {
            return plotHeight;
        };
        plot.offset = function() {
            var o = eventHolder.offset();
            o.left += plotOffset.left;
            o.top += plotOffset.top;
            return o;
        };
        plot.getData = function() {
            return series;
        };
        plot.getAxes = function() {
            var res = {};
            $.each(xaxes.concat(yaxes), function(_, axis) {
                if (axis) {
                    res[axis.direction + (axis.n !== 1 ? axis.n : "") + "axis"] = axis;
                }
            });
            return res;
        };
        plot.getXAxes = function() {
            return xaxes;
        };
        plot.getYAxes = function() {
            return yaxes;
        };
        plot.c2p = canvasToCartesianAxisCoords;
        plot.p2c = cartesianAxisToCanvasCoords;
        plot.getOptions = function() {
            return options;
        };
        plot.triggerRedrawOverlay = triggerRedrawOverlay;
        plot.pointOffset = function(point) {
            return {
                left: parseInt(xaxes[axisNumber(point, "x") - 1].p2c(+point.x) + plotOffset.left, 10),
                top: parseInt(yaxes[axisNumber(point, "y") - 1].p2c(+point.y) + plotOffset.top, 10)
            };
        };
        plot.shutdown = shutdown;
        plot.destroy = function() {
            shutdown();
            placeholder.removeData("plot").empty();

            series = [];
            options = null;
            surface = null;
            overlay = null;
            eventHolder = null;
            ctx = null;
            octx = null;
            xaxes = [];
            yaxes = [];
            hooks = null;
            plot = null;
        };

        plot.resize = function() {
            var width = placeholder.width(),
                height = placeholder.height();
            surface.resize(width, height);
            overlay.resize(width, height);

            executeHooks(hooks.resize, [width, height]);
        };

        plot.clearTextCache = function () {
            surface.clearCache();
            overlay.clearCache();
        };

        plot.autoScaleAxis = autoScaleAxis;
        plot.computeRangeForDataSeries = computeRangeForDataSeries;
        plot.adjustSeriesDataRange = adjustSeriesDataRange;
        plot.findNearbyItem = findNearbyItem;
        plot.findNearbyInterpolationPoint = findNearbyInterpolationPoint;
        plot.computeValuePrecision = computeValuePrecision;
        plot.computeTickSize = computeTickSize;
        plot.addEventHandler = addEventHandler;

        // public attributes
        plot.hooks = hooks;

        // initialize
        var MINOR_TICKS_COUNT_CONSTANT = $.plot.uiConstants.MINOR_TICKS_COUNT_CONSTANT;
        var TICK_LENGTH_CONSTANT = $.plot.uiConstants.TICK_LENGTH_CONSTANT;
        initPlugins(plot);
        setupCanvases();
        parseOptions(options_);
        setData(data_);
        setupGrid(true);
        draw();
        bindEvents();

        function executeHooks(hook, args) {
            args = [plot].concat(args);
            for (var i = 0; i < hook.length; ++i) {
                hook[i].apply(this, args);
            }
        }

        function initPlugins() {
            // References to key classes, allowing plugins to modify them

            var classes = {
                Canvas: Canvas
            };

            for (var i = 0; i < plugins.length; ++i) {
                var p = plugins[i];
                p.init(plot, classes);
                if (p.options) {
                    $.extend(true, options, p.options);
                }
            }
        }

        function parseOptions(opts) {
            $.extend(true, options, opts);

            // $.extend merges arrays, rather than replacing them.  When less
            // colors are provided than the size of the default palette, we
            // end up with those colors plus the remaining defaults, which is
            // not expected behavior; avoid it by replacing them here.

            if (opts && opts.colors) {
                options.colors = opts.colors;
            }

            if (options.xaxis.color == null) {
                options.xaxis.color = $.color.parse(options.grid.color).scale('a', 0.22).toString();
            }

            if (options.yaxis.color == null) {
                options.yaxis.color = $.color.parse(options.grid.color).scale('a', 0.22).toString();
            }

            if (options.xaxis.tickColor == null) {
                // grid.tickColor for back-compatibility
                options.xaxis.tickColor = options.grid.tickColor || options.xaxis.color;
            }

            if (options.yaxis.tickColor == null) {
                // grid.tickColor for back-compatibility
                options.yaxis.tickColor = options.grid.tickColor || options.yaxis.color;
            }

            if (options.grid.borderColor == null) {
                options.grid.borderColor = options.grid.color;
            }

            if (options.grid.tickColor == null) {
                options.grid.tickColor = $.color.parse(options.grid.color).scale('a', 0.22).toString();
            }

            // Fill in defaults for axis options, including any unspecified
            // font-spec fields, if a font-spec was provided.

            // If no x/y axis options were provided, create one of each anyway,
            // since the rest of the code assumes that they exist.

            var i, axisOptions, axisCount,
                fontSize = placeholder.css("font-size"),
                fontSizeDefault = fontSize ? +fontSize.replace("px", "") : 13,
                fontDefaults = {
                    style: placeholder.css("font-style"),
                    size: Math.round(0.8 * fontSizeDefault),
                    variant: placeholder.css("font-variant"),
                    weight: placeholder.css("font-weight"),
                    family: placeholder.css("font-family")
                };

            axisCount = options.xaxes.length || 1;
            for (i = 0; i < axisCount; ++i) {
                axisOptions = options.xaxes[i];
                if (axisOptions && !axisOptions.tickColor) {
                    axisOptions.tickColor = axisOptions.color;
                }

                axisOptions = $.extend(true, {}, options.xaxis, axisOptions);
                options.xaxes[i] = axisOptions;

                if (axisOptions.font) {
                    axisOptions.font = $.extend({}, fontDefaults, axisOptions.font);
                    if (!axisOptions.font.color) {
                        axisOptions.font.color = axisOptions.color;
                    }
                    if (!axisOptions.font.lineHeight) {
                        axisOptions.font.lineHeight = Math.round(axisOptions.font.size * 1.15);
                    }
                }
            }

            axisCount = options.yaxes.length || 1;
            for (i = 0; i < axisCount; ++i) {
                axisOptions = options.yaxes[i];
                if (axisOptions && !axisOptions.tickColor) {
                    axisOptions.tickColor = axisOptions.color;
                }

                axisOptions = $.extend(true, {}, options.yaxis, axisOptions);
                options.yaxes[i] = axisOptions;

                if (axisOptions.font) {
                    axisOptions.font = $.extend({}, fontDefaults, axisOptions.font);
                    if (!axisOptions.font.color) {
                        axisOptions.font.color = axisOptions.color;
                    }
                    if (!axisOptions.font.lineHeight) {
                        axisOptions.font.lineHeight = Math.round(axisOptions.font.size * 1.15);
                    }
                }
            }

            // save options on axes for future reference
            for (i = 0; i < options.xaxes.length; ++i) {
                getOrCreateAxis(xaxes, i + 1).options = options.xaxes[i];
            }

            for (i = 0; i < options.yaxes.length; ++i) {
                getOrCreateAxis(yaxes, i + 1).options = options.yaxes[i];
            }

            //process boxPosition options used for axis.box size
            $.each(allAxes(), function(_, axis) {
                axis.boxPosition = axis.options.boxPosition || {centerX: 0, centerY: 0};
            });

            // add hooks from options
            for (var n in hooks) {
                if (options.hooks[n] && options.hooks[n].length) {
                    hooks[n] = hooks[n].concat(options.hooks[n]);
                }
            }

            executeHooks(hooks.processOptions, [options]);
        }

        function setData(d) {
            var oldseries = series;
            series = parseData(d);
            fillInSeriesOptions();
            processData(oldseries);
        }

        function parseData(d) {
            var res = [];
            for (var i = 0; i < d.length; ++i) {
                var s = $.extend(true, {}, options.series);

                if (d[i].data != null) {
                    s.data = d[i].data; // move the data instead of deep-copy
                    delete d[i].data;

                    $.extend(true, s, d[i]);

                    d[i].data = s.data;
                } else {
                    s.data = d[i];
                }

                res.push(s);
            }

            return res;
        }

        function axisNumber(obj, coord) {
            var a = obj[coord + "axis"];
            if (typeof a === "object") {
                // if we got a real axis, extract number
                a = a.n;
            }

            if (typeof a !== "number") {
                a = 1; // default to first axis
            }

            return a;
        }

        function allAxes() {
            // return flat array without annoying null entries
            return xaxes.concat(yaxes).filter(function(a) {
                return a;
            });
        }

        // canvas to axis for cartesian axes
        function canvasToCartesianAxisCoords(pos) {
            // return an object with x/y corresponding to all used axes
            var res = {},
                i, axis;
            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used) {
                    res["x" + axis.n] = axis.c2p(pos.left);
                }
            }

            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used) {
                    res["y" + axis.n] = axis.c2p(pos.top);
                }
            }

            if (res.x1 !== undefined) {
                res.x = res.x1;
            }

            if (res.y1 !== undefined) {
                res.y = res.y1;
            }

            return res;
        }

        // axis to canvas for cartesian axes
        function cartesianAxisToCanvasCoords(pos) {
            // get canvas coords from the first pair of x/y found in pos
            var res = {},
                i, axis, key;

            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used) {
                    key = "x" + axis.n;
                    if (pos[key] == null && axis.n === 1) {
                        key = "x";
                    }

                    if (pos[key] != null) {
                        res.left = axis.p2c(pos[key]);
                        break;
                    }
                }
            }

            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used) {
                    key = "y" + axis.n;
                    if (pos[key] == null && axis.n === 1) {
                        key = "y";
                    }

                    if (pos[key] != null) {
                        res.top = axis.p2c(pos[key]);
                        break;
                    }
                }
            }

            return res;
        }

        function getOrCreateAxis(axes, number) {
            if (!axes[number - 1]) {
                axes[number - 1] = {
                    n: number, // save the number for future reference
                    direction: axes === xaxes ? "x" : "y",
                    options: $.extend(true, {}, axes === xaxes ? options.xaxis : options.yaxis)
                };
            }

            return axes[number - 1];
        }

        function fillInSeriesOptions() {
            var neededColors = series.length,
                maxIndex = -1,
                i;

            // Subtract the number of series that already have fixed colors or
            // color indexes from the number that we still need to generate.

            for (i = 0; i < series.length; ++i) {
                var sc = series[i].color;
                if (sc != null) {
                    neededColors--;
                    if (typeof sc === "number" && sc > maxIndex) {
                        maxIndex = sc;
                    }
                }
            }

            // If any of the series have fixed color indexes, then we need to
            // generate at least as many colors as the highest index.

            if (neededColors <= maxIndex) {
                neededColors = maxIndex + 1;
            }

            // Generate all the colors, using first the option colors and then
            // variations on those colors once they're exhausted.

            var c, colors = [],
                colorPool = options.colors,
                colorPoolSize = colorPool.length,
                variation = 0,
                definedColors = Math.max(0, series.length - neededColors);

            for (i = 0; i < neededColors; i++) {
                c = $.color.parse(colorPool[(definedColors + i) % colorPoolSize] || "#666");

                // Each time we exhaust the colors in the pool we adjust
                // a scaling factor used to produce more variations on
                // those colors. The factor alternates negative/positive
                // to produce lighter/darker colors.

                // Reset the variation after every few cycles, or else
                // it will end up producing only white or black colors.

                if (i % colorPoolSize === 0 && i) {
                    if (variation >= 0) {
                        if (variation < 0.5) {
                            variation = -variation - 0.2;
                        } else variation = 0;
                    } else variation = -variation;
                }

                colors[i] = c.scale('rgb', 1 + variation);
            }

            // Finalize the series options, filling in their colors

            var colori = 0,
                s;
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                // assign colors
                if (s.color == null) {
                    s.color = colors[colori].toString();
                    ++colori;
                } else if (typeof s.color === "number") {
                    s.color = colors[s.color].toString();
                }

                // turn on lines automatically in case nothing is set
                if (s.lines.show == null) {
                    var v, show = true;
                    for (v in s) {
                        if (s[v] && s[v].show) {
                            show = false;
                            break;
                        }
                    }

                    if (show) {
                        s.lines.show = true;
                    }
                }

                // If nothing was provided for lines.zero, default it to match
                // lines.fill, since areas by default should extend to zero.

                if (s.lines.zero == null) {
                    s.lines.zero = !!s.lines.fill;
                }

                // setup axes
                s.xaxis = getOrCreateAxis(xaxes, axisNumber(s, "x"));
                s.yaxis = getOrCreateAxis(yaxes, axisNumber(s, "y"));
            }
        }

        function processData(prevSeries) {
            var topSentry = Number.POSITIVE_INFINITY,
                bottomSentry = Number.NEGATIVE_INFINITY,
                i, j, k, m,
                s, points, ps, val, f, p,
                data, format;

            function updateAxis(axis, min, max) {
                if (min < axis.datamin && min !== -Infinity) {
                    axis.datamin = min;
                }

                if (max > axis.datamax && max !== Infinity) {
                    axis.datamax = max;
                }
            }

            function reusePoints(prevSeries, i) {
                if (prevSeries && prevSeries[i] && prevSeries[i].datapoints && prevSeries[i].datapoints.points) {
                    return prevSeries[i].datapoints.points;
                }

                return [];
            }

            $.each(allAxes(), function(_, axis) {
                // init axis
                if (axis.options.growOnly !== true) {
                    axis.datamin = topSentry;
                    axis.datamax = bottomSentry;
                } else {
                    if (axis.datamin === undefined) {
                        axis.datamin = topSentry;
                    }
                    if (axis.datamax === undefined) {
                        axis.datamax = bottomSentry;
                    }
                }
                axis.used = false;
            });

            for (i = 0; i < series.length; ++i) {
                s = series[i];
                s.datapoints = {
                    points: []
                };

                if (s.datapoints.points.length === 0) {
                    s.datapoints.points = reusePoints(prevSeries, i);
                }

                executeHooks(hooks.processRawData, [s, s.data, s.datapoints]);
            }

            // first pass: clean and copy data
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                data = s.data;
                format = s.datapoints.format;

                if (!format) {
                    format = [];
                    // find out how to copy
                    format.push({
                        x: true,
                        y: false,
                        number: true,
                        required: true,
                        computeRange: s.xaxis.options.autoScale !== 'none',
                        defaultValue: null
                    });

                    format.push({
                        x: false,
                        y: true,
                        number: true,
                        required: true,
                        computeRange: s.yaxis.options.autoScale !== 'none',
                        defaultValue: null
                    });

                    if (s.stack || s.bars.show || (s.lines.show && s.lines.fill)) {
                        var expectedPs = s.datapoints.pointsize != null ? s.datapoints.pointsize : (s.data && s.data[0] && s.data[0].length ? s.data[0].length : 3);
                        if (expectedPs > 2) {
                            format.push({
                                x: false,
                                y: true,
                                number: true,
                                required: false,
                                computeRange: s.yaxis.options.autoScale !== 'none',
                                defaultValue: 0
                            });
                        }
                    }

                    s.datapoints.format = format;
                }

                s.xaxis.used = s.yaxis.used = true;

                if (s.datapoints.pointsize != null) continue; // already filled in

                s.datapoints.pointsize = format.length;
                ps = s.datapoints.pointsize;
                points = s.datapoints.points;

                var insertSteps = s.lines.show && s.lines.steps;

                for (j = k = 0; j < data.length; ++j, k += ps) {
                    p = data[j];

                    var nullify = p == null;
                    if (!nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = p[m];
                            f = format[m];

                            if (f) {
                                if (f.number && val != null) {
                                    val = +val; // convert to number
                                    if (isNaN(val)) {
                                        val = null;
                                    }
                                }

                                if (val == null) {
                                    if (f.required) nullify = true;

                                    if (f.defaultValue != null) val = f.defaultValue;
                                }
                            }

                            points[k + m] = val;
                        }
                    }

                    if (nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = points[k + m];
                            if (val != null) {
                                f = format[m];
                                // extract min/max info
                                if (f.computeRange) {
                                    if (f.x) {
                                        updateAxis(s.xaxis, val, val);
                                    }
                                    if (f.y) {
                                        updateAxis(s.yaxis, val, val);
                                    }
                                }
                            }
                            points[k + m] = null;
                        }
                    }
                }

                points.length = k; //trims the internal buffer to the correct length
            }

            // give the hooks a chance to run
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                executeHooks(hooks.processDatapoints, [s, s.datapoints]);
            }

            // second pass: find datamax/datamin for auto-scaling
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                format = s.datapoints.format;

                if (format.every(function (f) { return !f.computeRange; })) {
                    continue;
                }

                var range = plot.adjustSeriesDataRange(s,
                    plot.computeRangeForDataSeries(s));

                executeHooks(hooks.adjustSeriesDataRange, [s, range]);

                updateAxis(s.xaxis, range.xmin, range.xmax);
                updateAxis(s.yaxis, range.ymin, range.ymax);
            }

            $.each(allAxes(), function(_, axis) {
                if (axis.datamin === topSentry) {
                    axis.datamin = null;
                }

                if (axis.datamax === bottomSentry) {
                    axis.datamax = null;
                }
            });
        }

        function setupCanvases() {
            // Make sure the placeholder is clear of everything except canvases
            // from a previous plot in this container that we'll try to re-use.

            placeholder.css("padding", 0) // padding messes up the positioning
                .children().filter(function() {
                    return !$(this).hasClass("flot-overlay") && !$(this).hasClass('flot-base');
                }).remove();

            if (placeholder.css("position") === 'static') {
                placeholder.css("position", "relative"); // for positioning labels and overlay
            }

            surface = new Canvas("flot-base", placeholder[0]);
            overlay = new Canvas("flot-overlay", placeholder[0]); // overlay canvas for interactive features

            ctx = surface.context;
            octx = overlay.context;

            // define which element we're listening for events on
            eventHolder = $(overlay.element).unbind();

            // If we're re-using a plot object, shut down the old one

            var existing = placeholder.data("plot");

            if (existing) {
                existing.shutdown();
                overlay.clear();
            }

            // save in case we get replotted
            placeholder.data("plot", plot);
        }

        function bindEvents() {
            executeHooks(hooks.bindEvents, [eventHolder]);
        }

        function addEventHandler(event, handler, eventHolder, priority) {
            var key = eventHolder + event;
            var eventList = eventManager[key] || [];

            eventList.push({"event": event, "handler": handler, "eventHolder": eventHolder, "priority": priority});
            eventList.sort((a, b) => b.priority - a.priority );
            eventList.forEach( eventData => {
                eventData.eventHolder.unbind(eventData.event, eventData.handler);
                eventData.eventHolder.bind(eventData.event, eventData.handler);
            });

            eventManager[key] = eventList;
        }

        function shutdown() {
            if (redrawTimeout) {
                clearTimeout(redrawTimeout);
            }

            executeHooks(hooks.shutdown, [eventHolder]);
        }

        function setTransformationHelpers(axis) {
            // set helper functions on the axis, assumes plot area
            // has been computed already

            function identity(x) {
                return x;
            }

            var s, m, t = axis.options.transform || identity,
                it = axis.options.inverseTransform;

            // precompute how much the axis is scaling a point
            // in canvas space
            if (axis.direction === "x") {
                if (isFinite(t(axis.max) - t(axis.min))) {
                    s = axis.scale = plotWidth / Math.abs(t(axis.max) - t(axis.min));
                } else {
                    s = axis.scale = 1 / Math.abs($.plot.saturated.delta(t(axis.min), t(axis.max), plotWidth));
                }
                m = Math.min(t(axis.max), t(axis.min));
            } else {
                if (isFinite(t(axis.max) - t(axis.min))) {
                    s = axis.scale = plotHeight / Math.abs(t(axis.max) - t(axis.min));
                } else {
                    s = axis.scale = 1 / Math.abs($.plot.saturated.delta(t(axis.min), t(axis.max), plotHeight));
                }
                s = -s;
                m = Math.max(t(axis.max), t(axis.min));
            }

            // data point to canvas coordinate
            if (t === identity) {
                // slight optimization
                axis.p2c = function(p) {
                    if (isFinite(p - m)) {
                        return (p - m) * s;
                    } else {
                        return (p / 4 - m / 4) * s * 4;
                    }
                };
            } else {
                axis.p2c = function(p) {
                    var tp = t(p);

                    if (isFinite(tp - m)) {
                        return (tp - m) * s;
                    } else {
                        return (tp / 4 - m / 4) * s * 4;
                    }
                };
            }

            // canvas coordinate to data point
            if (!it) {
                axis.c2p = function(c) {
                    return m + c / s;
                };
            } else {
                axis.c2p = function(c) {
                    return it(m + c / s);
                };
            }
        }

        function measureTickLabels(axis) {
            var opts = axis.options,
                ticks = opts.showTickLabels !== 'none' && axis.ticks ? axis.ticks : [],
                showMajorTickLabels = opts.showTickLabels === 'major' || opts.showTickLabels === 'all',
                showEndpointsTickLabels = opts.showTickLabels === 'endpoints' || opts.showTickLabels === 'all',
                labelWidth = opts.labelWidth || 0,
                labelHeight = opts.labelHeight || 0,
                legacyStyles = axis.direction + "Axis " + axis.direction + axis.n + "Axis",
                layer = "flot-" + axis.direction + "-axis flot-" + axis.direction + axis.n + "-axis " + legacyStyles,
                font = opts.font || "flot-tick-label tickLabel";

            for (var i = 0; i < ticks.length; ++i) {
                var t = ticks[i];
                var label = t.label;

                if (!t.label ||
                    (showMajorTickLabels === false && i > 0 && i < ticks.length - 1) ||
                    (showEndpointsTickLabels === false && (i === 0 || i === ticks.length - 1))) {
                    continue;
                }

                if (typeof t.label === 'object') {
                    label = t.label.name;
                }

                var info = surface.getTextInfo(layer, label, font);

                labelWidth = Math.max(labelWidth, info.width);
                labelHeight = Math.max(labelHeight, info.height);
            }

            axis.labelWidth = opts.labelWidth || labelWidth;
            axis.labelHeight = opts.labelHeight || labelHeight;
        }

        function allocateAxisBoxFirstPhase(axis) {
            // find the bounding box of the axis by looking at label
            // widths/heights and ticks, make room by diminishing the
            // plotOffset; this first phase only looks at one
            // dimension per axis, the other dimension depends on the
            // other axes so will have to wait

            // here reserve additional space
            executeHooks(hooks.axisReserveSpace, [axis]);

            var lw = axis.labelWidth,
                lh = axis.labelHeight,
                pos = axis.options.position,
                isXAxis = axis.direction === "x",
                tickLength = axis.options.tickLength,
                showTicks = axis.options.showTicks,
                showMinorTicks = axis.options.showMinorTicks,
                gridLines = axis.options.gridLines,
                axisMargin = options.grid.axisMargin,
                padding = options.grid.labelMargin,
                innermost = true,
                outermost = true,
                found = false;

            // Determine the axis's position in its direction and on its side

            $.each(isXAxis ? xaxes : yaxes, function(i, a) {
                if (a && (a.show || a.reserveSpace)) {
                    if (a === axis) {
                        found = true;
                    } else if (a.options.position === pos) {
                        if (found) {
                            outermost = false;
                        } else {
                            innermost = false;
                        }
                    }
                }
            });

            // The outermost axis on each side has no margin
            if (outermost) {
                axisMargin = 0;
            }

            // Set the default tickLength if necessary
            if (tickLength == null) {
                tickLength = TICK_LENGTH_CONSTANT;
            }

            // By default, major tick marks are visible
            if (showTicks == null) {
                showTicks = true;
            }

            // By default, minor tick marks are visible
            if (showMinorTicks == null) {
                showMinorTicks = true;
            }

            // By default, grid lines are visible
            if (gridLines == null) {
                if (innermost) {
                    gridLines = true;
                } else {
                    gridLines = false;
                }
            }

            if (!isNaN(+tickLength)) {
                padding += showTicks ? +tickLength : 0;
            }

            if (isXAxis) {
                lh += padding;

                if (pos === "bottom") {
                    plotOffset.bottom += lh + axisMargin;
                    axis.box = {
                        top: surface.height - plotOffset.bottom,
                        height: lh
                    };
                } else {
                    axis.box = {
                        top: plotOffset.top + axisMargin,
                        height: lh
                    };
                    plotOffset.top += lh + axisMargin;
                }
            } else {
                lw += padding;

                if (pos === "left") {
                    axis.box = {
                        left: plotOffset.left + axisMargin,
                        width: lw
                    };
                    plotOffset.left += lw + axisMargin;
                } else {
                    plotOffset.right += lw + axisMargin;
                    axis.box = {
                        left: surface.width - plotOffset.right,
                        width: lw
                    };
                }
            }

            // save for future reference
            axis.position = pos;
            axis.tickLength = tickLength;
            axis.showMinorTicks = showMinorTicks;
            axis.showTicks = showTicks;
            axis.gridLines = gridLines;
            axis.box.padding = padding;
            axis.innermost = innermost;
        }

        function allocateAxisBoxSecondPhase(axis) {
            // now that all axis boxes have been placed in one
            // dimension, we can set the remaining dimension coordinates
            if (axis.direction === "x") {
                axis.box.left = plotOffset.left - axis.labelWidth / 2;
                axis.box.width = surface.width - plotOffset.left - plotOffset.right + axis.labelWidth;
            } else {
                axis.box.top = plotOffset.top - axis.labelHeight / 2;
                axis.box.height = surface.height - plotOffset.bottom - plotOffset.top + axis.labelHeight;
            }
        }

        function adjustLayoutForThingsStickingOut() {
            // possibly adjust plot offset to ensure everything stays
            // inside the canvas and isn't clipped off

            var minMargin = options.grid.minBorderMargin,
                i;

            // check stuff from the plot (FIXME: this should just read
            // a value from the series, otherwise it's impossible to
            // customize)
            if (minMargin == null) {
                minMargin = 0;
                for (i = 0; i < series.length; ++i) {
                    minMargin = Math.max(minMargin, 2 * (series[i].points.radius + series[i].points.lineWidth / 2));
                }
            }

            var a, offset = {},
                margins = {
                    left: minMargin,
                    right: minMargin,
                    top: minMargin,
                    bottom: minMargin
                };

            // check axis labels, note we don't check the actual
            // labels but instead use the overall width/height to not
            // jump as much around with replots
            $.each(allAxes(), function(_, axis) {
                if (axis.reserveSpace && axis.ticks && axis.ticks.length) {
                    if (axis.direction === "x") {
                        margins.left = Math.max(margins.left, axis.labelWidth / 2);
                        margins.right = Math.max(margins.right, axis.labelWidth / 2);
                    } else {
                        margins.bottom = Math.max(margins.bottom, axis.labelHeight / 2);
                        margins.top = Math.max(margins.top, axis.labelHeight / 2);
                    }
                }
            });

            for (a in margins) {
                offset[a] = margins[a] - plotOffset[a];
            }
            $.each(xaxes.concat(yaxes), function(_, axis) {
                alignAxisWithGrid(axis, offset, function (offset) {
                    return offset > 0;
                });
            });

            plotOffset.left = Math.ceil(Math.max(margins.left, plotOffset.left));
            plotOffset.right = Math.ceil(Math.max(margins.right, plotOffset.right));
            plotOffset.top = Math.ceil(Math.max(margins.top, plotOffset.top));
            plotOffset.bottom = Math.ceil(Math.max(margins.bottom, plotOffset.bottom));
        }

        function alignAxisWithGrid(axis, offset, isValid) {
            if (axis.direction === "x") {
                if (axis.position === "bottom" && isValid(offset.bottom)) {
                    axis.box.top -= Math.ceil(offset.bottom);
                }
                if (axis.position === "top" && isValid(offset.top)) {
                    axis.box.top += Math.ceil(offset.top);
                }
            } else {
                if (axis.position === "left" && isValid(offset.left)) {
                    axis.box.left += Math.ceil(offset.left);
                }
                if (axis.position === "right" && isValid(offset.right)) {
                    axis.box.left -= Math.ceil(offset.right);
                }
            }
        }

        function setupGrid(autoScale) {
            var i, a, axes = allAxes(),
                showGrid = options.grid.show;

            // Initialize the plot's offset from the edge of the canvas

            for (a in plotOffset) {
                plotOffset[a] = 0;
            }

            executeHooks(hooks.processOffset, [plotOffset]);

            // If the grid is visible, add its border width to the offset
            for (a in plotOffset) {
                if (typeof (options.grid.borderWidth) === "object") {
                    plotOffset[a] += showGrid ? options.grid.borderWidth[a] : 0;
                } else {
                    plotOffset[a] += showGrid ? options.grid.borderWidth : 0;
                }
            }

            $.each(axes, function(_, axis) {
                var axisOpts = axis.options;
                axis.show = axisOpts.show == null ? axis.used : axisOpts.show;
                axis.reserveSpace = axisOpts.reserveSpace == null ? axis.show : axisOpts.reserveSpace;
                setupTickFormatter(axis);
                executeHooks(hooks.setRange, [axis, autoScale]);
                setRange(axis, autoScale);
            });

            if (showGrid) {
                plotWidth = surface.width - plotOffset.left - plotOffset.right;
                plotHeight = surface.height - plotOffset.bottom - plotOffset.top;

                var allocatedAxes = $.grep(axes, function(axis) {
                    return axis.show || axis.reserveSpace;
                });

                $.each(allocatedAxes, function(_, axis) {
                    // make the ticks
                    setupTickGeneration(axis);
                    setMajorTicks(axis);
                    snapRangeToTicks(axis, axis.ticks);

                    //for computing the endpoints precision, transformationHelpers are needed
                    setTransformationHelpers(axis);
                    setEndpointTicks(axis, series);

                    // find labelWidth/Height for axis
                    measureTickLabels(axis);
                });

                // with all dimensions calculated, we can compute the
                // axis bounding boxes, start from the outside
                // (reverse order)
                for (i = allocatedAxes.length - 1; i >= 0; --i) {
                    allocateAxisBoxFirstPhase(allocatedAxes[i]);
                }

                // make sure we've got enough space for things that
                // might stick out
                adjustLayoutForThingsStickingOut();

                $.each(allocatedAxes, function(_, axis) {
                    allocateAxisBoxSecondPhase(axis);
                });
            }

            //adjust axis and plotOffset according to grid.margins
            if (options.grid.margin) {
                for (a in plotOffset) {
                    var margin = options.grid.margin || 0;
                    plotOffset[a] += typeof margin === "number" ? margin : (margin[a] || 0);
                }
                $.each(xaxes.concat(yaxes), function(_, axis) {
                    alignAxisWithGrid(axis, options.grid.margin, function(offset) {
                        return offset !== undefined && offset !== null;
                    });
                });
            }

            //after adjusting the axis, plot width and height will be modified
            plotWidth = surface.width - plotOffset.left - plotOffset.right;
            plotHeight = surface.height - plotOffset.bottom - plotOffset.top;

            // now we got the proper plot dimensions, we can compute the scaling
            $.each(axes, function(_, axis) {
                setTransformationHelpers(axis);
            });

            if (showGrid) {
                drawAxisLabels();
            }

            executeHooks(hooks.setupGrid, []);
        }

        function widenMinMax(minimum, maximum) {
            var min = (minimum === undefined ? null : minimum);
            var max = (maximum === undefined ? null : maximum);
            var delta = max - min;
            if (delta === 0.0) {
                // degenerate case
                var widen = max === 0 ? 1 : 0.01;
                var wmin = null;
                if (min == null) {
                    wmin -= widen;
                }

                // always widen max if we couldn't widen min to ensure we
                // don't fall into min == max which doesn't work
                if (max == null || min != null) {
                    max += widen;
                }

                if (wmin != null) {
                    min = wmin;
                }
            }

            return {
                min: min,
                max: max
            };
        }

        function autoScaleAxis(axis) {
            var opts = axis.options,
                min = opts.min,
                max = opts.max,
                datamin = axis.datamin,
                datamax = axis.datamax,
                delta;

            switch (opts.autoScale) {
                case "none":
                    min = +(opts.min != null ? opts.min : datamin);
                    max = +(opts.max != null ? opts.max : datamax);
                    break;
                case "loose":
                    if (datamin != null && datamax != null) {
                        min = datamin;
                        max = datamax;
                        delta = $.plot.saturated.saturate(max - min);
                        var margin = ((typeof opts.autoScaleMargin === 'number') ? opts.autoScaleMargin : 0.02);
                        min = $.plot.saturated.saturate(min - delta * margin);
                        max = $.plot.saturated.saturate(max + delta * margin);

                        // make sure we don't go below zero if all values are positive
                        if (min < 0 && datamin >= 0) {
                            min = 0;
                        }
                    } else {
                        min = opts.min;
                        max = opts.max;
                    }
                    break;
                case "exact":
                    min = (datamin != null ? datamin : opts.min);
                    max = (datamax != null ? datamax : opts.max);
                    break;
                case "sliding-window":
                    if (datamax > max) {
                        // move the window to fit the new data,
                        // keeping the axis range constant
                        max = datamax;
                        min = Math.max(datamax - (opts.windowSize || 100), min);
                    }
                    break;
            }

            var widenedMinMax = widenMinMax(min, max);
            min = widenedMinMax.min;
            max = widenedMinMax.max;

            // grow loose or grow exact supported
            if (opts.growOnly === true && opts.autoScale !== "none" && opts.autoScale !== "sliding-window") {
                min = (min < datamin) ? min : (datamin !== null ? datamin : min);
                max = (max > datamax) ? max : (datamax !== null ? datamax : max);
            }

            axis.autoScaledMin = min;
            axis.autoScaledMax = max;
        }

        function setRange(axis, autoScale) {
            var min = typeof axis.options.min === 'number' ? axis.options.min : axis.min,
                max = typeof axis.options.max === 'number' ? axis.options.max : axis.max,
                plotOffset = axis.options.offset;

            if (autoScale) {
                autoScaleAxis(axis);
                min = axis.autoScaledMin;
                max = axis.autoScaledMax;
            }

            min = (min != null ? min : -1) + (plotOffset.below || 0);
            max = (max != null ? max : 1) + (plotOffset.above || 0);

            if (min > max) {
                var tmp = min;
                min = max;
                max = tmp;
                axis.options.offset = { above: 0, below: 0 };
            }

            axis.min = $.plot.saturated.saturate(min);
            axis.max = $.plot.saturated.saturate(max);
        }

        function computeValuePrecision (min, max, direction, ticks, tickDecimals) {
            var noTicks = fixupNumberOfTicks(direction, surface, ticks);

            var delta = $.plot.saturated.delta(min, max, noTicks),
                dec = -Math.floor(Math.log(delta) / Math.LN10);

            //if it is called with tickDecimals, then the precision should not be greather then that
            if (tickDecimals && dec > tickDecimals) {
                dec = tickDecimals;
            }

            var magn = Math.pow(10, -dec),
                norm = delta / magn;

            if (norm > 2.25 && norm < 3 && (dec + 1) <= tickDecimals) {
                //we need an extra decimals when tickSize is 2.5
                ++dec;
            }

            return isFinite(dec) ? dec : 0;
        };

        function computeTickSize (min, max, noTicks, tickDecimals) {
            var delta = $.plot.saturated.delta(min, max, noTicks),
                dec = -Math.floor(Math.log(delta) / Math.LN10);

            //if it is called with tickDecimals, then the precision should not be greather then that
            if (tickDecimals && dec > tickDecimals) {
                dec = tickDecimals;
            }

            var magn = Math.pow(10, -dec),
                norm = delta / magn, // norm is between 1.0 and 10.0
                size;

            if (norm < 1.5) {
                size = 1;
            } else if (norm < 3) {
                size = 2;
                if (norm > 2.25 && (tickDecimals == null || (dec + 1) <= tickDecimals)) {
                    size = 2.5;
                }
            } else if (norm < 7.5) {
                size = 5;
            } else {
                size = 10;
            }

            size *= magn;
            return size;
        }

        function getAxisTickSize(min, max, direction, options, tickDecimals) {
            var noTicks;

            if (typeof options.ticks === "number" && options.ticks > 0) {
                noTicks = options.ticks;
            } else {
            // heuristic based on the model a*sqrt(x) fitted to
            // some data points that seemed reasonable
                noTicks = 0.3 * Math.sqrt(direction === "x" ? surface.width : surface.height);
            }

            var size = computeTickSize(min, max, noTicks, tickDecimals);

            if (options.minTickSize != null && size < options.minTickSize) {
                size = options.minTickSize;
            }

            return options.tickSize || size;
        };

        function fixupNumberOfTicks(direction, surface, ticksOption) {
            var noTicks;

            if (typeof ticksOption === "number" && ticksOption > 0) {
                noTicks = ticksOption;
            } else {
                noTicks = 0.3 * Math.sqrt(direction === "x" ? surface.width : surface.height);
            }

            return noTicks;
        }

        function setupTickFormatter(axis) {
            var opts = axis.options;
            if (!axis.tickFormatter) {
                if (typeof opts.tickFormatter === 'function') {
                    axis.tickFormatter = function() {
                        var args = Array.prototype.slice.call(arguments);
                        return "" + opts.tickFormatter.apply(null, args);
                    };
                } else {
                    axis.tickFormatter = defaultTickFormatter;
                }
            }
        }

        function setupTickGeneration(axis) {
            var opts = axis.options;
            var noTicks;

            noTicks = fixupNumberOfTicks(axis.direction, surface, opts.ticks);

            axis.delta = $.plot.saturated.delta(axis.min, axis.max, noTicks);
            var precision = plot.computeValuePrecision(axis.min, axis.max, axis.direction, noTicks, opts.tickDecimals);

            axis.tickDecimals = Math.max(0, opts.tickDecimals != null ? opts.tickDecimals : precision);
            axis.tickSize = getAxisTickSize(axis.min, axis.max, axis.direction, opts, opts.tickDecimals);

            // Flot supports base-10 axes; any other mode else is handled by a plug-in,
            // like flot.time.js.

            if (!axis.tickGenerator) {
                if (typeof opts.tickGenerator === 'function') {
                    axis.tickGenerator = opts.tickGenerator;
                } else {
                    axis.tickGenerator = defaultTickGenerator;
                }
            }

            if (opts.alignTicksWithAxis != null) {
                var otherAxis = (axis.direction === "x" ? xaxes : yaxes)[opts.alignTicksWithAxis - 1];
                if (otherAxis && otherAxis.used && otherAxis !== axis) {
                    // consider snapping min/max to outermost nice ticks
                    var niceTicks = axis.tickGenerator(axis, plot);
                    if (niceTicks.length > 0) {
                        if (opts.min == null) {
                            axis.min = Math.min(axis.min, niceTicks[0]);
                        }

                        if (opts.max == null && niceTicks.length > 1) {
                            axis.max = Math.max(axis.max, niceTicks[niceTicks.length - 1]);
                        }
                    }

                    axis.tickGenerator = function(axis) {
                        // copy ticks, scaled to this axis
                        var ticks = [],
                            v, i;
                        for (i = 0; i < otherAxis.ticks.length; ++i) {
                            v = (otherAxis.ticks[i].v - otherAxis.min) / (otherAxis.max - otherAxis.min);
                            v = axis.min + v * (axis.max - axis.min);
                            ticks.push(v);
                        }
                        return ticks;
                    };

                    // we might need an extra decimal since forced
                    // ticks don't necessarily fit naturally
                    if (!axis.mode && opts.tickDecimals == null) {
                        var extraDec = Math.max(0, -Math.floor(Math.log(axis.delta) / Math.LN10) + 1),
                            ts = axis.tickGenerator(axis, plot);

                        // only proceed if the tick interval rounded
                        // with an extra decimal doesn't give us a
                        // zero at end
                        if (!(ts.length > 1 && /\..*0$/.test((ts[1] - ts[0]).toFixed(extraDec)))) {
                            axis.tickDecimals = extraDec;
                        }
                    }
                }
            }
        }

        function setMajorTicks(axis) {
            var oticks = axis.options.ticks,
                ticks = [];
            if (oticks == null || (typeof oticks === "number" && oticks > 0)) {
                ticks = axis.tickGenerator(axis, plot);
            } else if (oticks) {
                if ($.isFunction(oticks)) {
                // generate the ticks
                    ticks = oticks(axis);
                } else {
                    ticks = oticks;
                }
            }

            // clean up/labelify the supplied ticks, copy them over
            var i, v;
            axis.ticks = [];
            for (i = 0; i < ticks.length; ++i) {
                var label = null;
                var t = ticks[i];
                if (typeof t === "object") {
                    v = +t[0];
                    if (t.length > 1) {
                        label = t[1];
                    }
                } else {
                    v = +t;
                }

                if (!isNaN(v)) {
                    axis.ticks.push(
                        newTick(v, label, axis, 'major'));
                }
            }
        }

        function newTick(v, label, axis, type) {
            if (label === null) {
                switch (type) {
                    case 'min':
                    case 'max':
                        //improving the precision of endpoints
                        var precision = getEndpointPrecision(v, axis);
                        label = isFinite(precision) ? axis.tickFormatter(v, axis, precision, plot) : axis.tickFormatter(v, axis, precision, plot);
                        break;
                    case 'major':
                        label = axis.tickFormatter(v, axis, undefined, plot);
                }
            }
            return {
                v: v,
                label: label
            };
        }

        function snapRangeToTicks(axis, ticks) {
            if (axis.options.autoScale === "loose" && ticks.length > 0) {
                // snap to ticks
                axis.min = Math.min(axis.min, ticks[0].v);
                axis.max = Math.max(axis.max, ticks[ticks.length - 1].v);
            }
        }

        function getEndpointPrecision(value, axis) {
            var canvas1 = Math.floor(axis.p2c(value)),
                canvas2 = axis.direction === "x" ? canvas1 + 1 : canvas1 - 1,
                point1 = axis.c2p(canvas1),
                point2 = axis.c2p(canvas2),
                precision = computeValuePrecision(point1, point2, axis.direction, 1);

            return precision;
        }

        function setEndpointTicks(axis, series) {
            if (isValidEndpointTick(axis, series)) {
                axis.ticks.unshift(newTick(axis.min, null, axis, 'min'));
                axis.ticks.push(newTick(axis.max, null, axis, 'max'));
            }
        }

        function isValidEndpointTick(axis, series) {
            if (axis.options.showTickLabels === 'endpoints') {
                return true;
            }
            if (axis.options.showTickLabels === 'all') {
                var associatedSeries = series.filter(function(s) {
                        return s.xaxis === axis;
                    }),
                    notAllBarSeries = associatedSeries.some(function(s) {
                        return !s.bars.show;
                    });
                return associatedSeries.length === 0 || notAllBarSeries;
            }
            if (axis.options.showTickLabels === 'major' || axis.options.showTickLabels === 'none') {
                return false;
            }
        }

        function draw() {
            surface.clear();
            executeHooks(hooks.drawBackground, [ctx]);

            var grid = options.grid;

            // draw background, if any
            if (grid.show && grid.backgroundColor) {
                drawBackground();
            }

            if (grid.show && !grid.aboveData) {
                drawGrid();
            }

            for (var i = 0; i < series.length; ++i) {
                executeHooks(hooks.drawSeries, [ctx, series[i], i, getColorOrGradient]);
                drawSeries(series[i]);
            }

            executeHooks(hooks.draw, [ctx]);

            if (grid.show && grid.aboveData) {
                drawGrid();
            }

            surface.render();

            // A draw implies that either the axes or data have changed, so we
            // should probably update the overlay highlights as well.
            triggerRedrawOverlay();
        }

        function extractRange(ranges, coord) {
            var axis, from, to, key, axes = allAxes();

            for (var i = 0; i < axes.length; ++i) {
                axis = axes[i];
                if (axis.direction === coord) {
                    key = coord + axis.n + "axis";
                    if (!ranges[key] && axis.n === 1) {
                        // support x1axis as xaxis
                        key = coord + "axis";
                    }

                    if (ranges[key]) {
                        from = ranges[key].from;
                        to = ranges[key].to;
                        break;
                    }
                }
            }

            // backwards-compat stuff - to be removed in future
            if (!ranges[key]) {
                axis = coord === "x" ? xaxes[0] : yaxes[0];
                from = ranges[coord + "1"];
                to = ranges[coord + "2"];
            }

            // auto-reverse as an added bonus
            if (from != null && to != null && from > to) {
                var tmp = from;
                from = to;
                to = tmp;
            }

            return {
                from: from,
                to: to,
                axis: axis
            };
        }

        function drawBackground() {
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            ctx.fillStyle = getColorOrGradient(options.grid.backgroundColor, plotHeight, 0, "rgba(255, 255, 255, 0)");
            ctx.fillRect(0, 0, plotWidth, plotHeight);
            ctx.restore();
        }

        function drawMarkings() {
            // draw markings
            var markings = options.grid.markings,
                axes;

            if (markings) {
                if ($.isFunction(markings)) {
                    axes = plot.getAxes();
                    // xmin etc. is backwards compatibility, to be
                    // removed in the future
                    axes.xmin = axes.xaxis.min;
                    axes.xmax = axes.xaxis.max;
                    axes.ymin = axes.yaxis.min;
                    axes.ymax = axes.yaxis.max;

                    markings = markings(axes);
                }

                var i;
                for (i = 0; i < markings.length; ++i) {
                    var m = markings[i],
                        xrange = extractRange(m, "x"),
                        yrange = extractRange(m, "y");

                    // fill in missing
                    if (xrange.from == null) {
                        xrange.from = xrange.axis.min;
                    }

                    if (xrange.to == null) {
                        xrange.to = xrange.axis.max;
                    }

                    if (yrange.from == null) {
                        yrange.from = yrange.axis.min;
                    }

                    if (yrange.to == null) {
                        yrange.to = yrange.axis.max;
                    }

                    // clip
                    if (xrange.to < xrange.axis.min || xrange.from > xrange.axis.max ||
                        yrange.to < yrange.axis.min || yrange.from > yrange.axis.max) {
                        continue;
                    }

                    xrange.from = Math.max(xrange.from, xrange.axis.min);
                    xrange.to = Math.min(xrange.to, xrange.axis.max);
                    yrange.from = Math.max(yrange.from, yrange.axis.min);
                    yrange.to = Math.min(yrange.to, yrange.axis.max);

                    var xequal = xrange.from === xrange.to,
                        yequal = yrange.from === yrange.to;

                    if (xequal && yequal) {
                        continue;
                    }

                    // then draw
                    xrange.from = Math.floor(xrange.axis.p2c(xrange.from));
                    xrange.to = Math.floor(xrange.axis.p2c(xrange.to));
                    yrange.from = Math.floor(yrange.axis.p2c(yrange.from));
                    yrange.to = Math.floor(yrange.axis.p2c(yrange.to));

                    if (xequal || yequal) {
                        var lineWidth = m.lineWidth || options.grid.markingsLineWidth,
                            subPixel = lineWidth % 2 ? 0.5 : 0;
                        ctx.beginPath();
                        ctx.strokeStyle = m.color || options.grid.markingsColor;
                        ctx.lineWidth = lineWidth;
                        if (xequal) {
                            ctx.moveTo(xrange.to + subPixel, yrange.from);
                            ctx.lineTo(xrange.to + subPixel, yrange.to);
                        } else {
                            ctx.moveTo(xrange.from, yrange.to + subPixel);
                            ctx.lineTo(xrange.to, yrange.to + subPixel);
                        }
                        ctx.stroke();
                    } else {
                        ctx.fillStyle = m.color || options.grid.markingsColor;
                        ctx.fillRect(xrange.from, yrange.to,
                            xrange.to - xrange.from,
                            yrange.from - yrange.to);
                    }
                }
            }
        }

        function findEdges(axis) {
            var box = axis.box,
                x = 0,
                y = 0;

            // find the edges
            if (axis.direction === "x") {
                x = 0;
                y = box.top - plotOffset.top + (axis.position === "top" ? box.height : 0);
            } else {
                y = 0;
                x = box.left - plotOffset.left + (axis.position === "left" ? box.width : 0) + axis.boxPosition.centerX;
            }

            return {
                x: x,
                y: y
            };
        };

        function alignPosition(lineWidth, pos) {
            return ((lineWidth % 2) !== 0) ? Math.floor(pos) + 0.5 : pos;
        };

        function drawTickBar(axis) {
            ctx.lineWidth = 1;
            var edges = findEdges(axis),
                x = edges.x,
                y = edges.y;

            // draw tick bar
            if (axis.show) {
                var xoff = 0,
                    yoff = 0;

                ctx.strokeStyle = axis.options.color;
                ctx.beginPath();
                if (axis.direction === "x") {
                    xoff = plotWidth + 1;
                } else {
                    yoff = plotHeight + 1;
                }

                if (axis.direction === "x") {
                    y = alignPosition(ctx.lineWidth, y);
                } else {
                    x = alignPosition(ctx.lineWidth, x);
                }

                ctx.moveTo(x, y);
                ctx.lineTo(x + xoff, y + yoff);
                ctx.stroke();
            }
        };

        function drawTickMarks(axis) {
            var t = axis.tickLength,
                minorTicks = axis.showMinorTicks,
                minorTicksNr = MINOR_TICKS_COUNT_CONSTANT,
                edges = findEdges(axis),
                x = edges.x,
                y = edges.y,
                i = 0;

            // draw major tick marks
            ctx.strokeStyle = axis.options.color;
            ctx.beginPath();

            for (i = 0; i < axis.ticks.length; ++i) {
                var v = axis.ticks[i].v,
                    xoff = 0,
                    yoff = 0,
                    xminor = 0,
                    yminor = 0,
                    j;

                if (!isNaN(v) && v >= axis.min && v <= axis.max) {
                    if (axis.direction === "x") {
                        x = axis.p2c(v);
                        yoff = t;

                        if (axis.position === "top") {
                            yoff = -yoff;
                        }
                    } else {
                        y = axis.p2c(v);
                        xoff = t;

                        if (axis.position === "left") {
                            xoff = -xoff;
                        }
                    }

                    if (axis.direction === "x") {
                        x = alignPosition(ctx.lineWidth, x);
                    } else {
                        y = alignPosition(ctx.lineWidth, y);
                    }

                    ctx.moveTo(x, y);
                    ctx.lineTo(x + xoff, y + yoff);
                }

                //draw minor tick marks
                if (minorTicks === true && i < axis.ticks.length - 1) {
                    var v1 = axis.ticks[i].v,
                        v2 = axis.ticks[i + 1].v,
                        step = (v2 - v1) / (minorTicksNr + 1);

                    for (j = 1; j <= minorTicksNr; j++) {
                        // compute minor tick position
                        if (axis.direction === "x") {
                            yminor = t / 2; // minor ticks are half length
                            x = alignPosition(ctx.lineWidth, axis.p2c(v1 + j * step))

                            if (axis.position === "top") {
                                yminor = -yminor;
                            }

                            // don't go over the plot borders
                            if ((x < 0) || (x > plotWidth)) {
                                continue;
                            }
                        } else {
                            xminor = t / 2; // minor ticks are half length
                            y = alignPosition(ctx.lineWidth, axis.p2c(v1 + j * step));

                            if (axis.position === "left") {
                                xminor = -xminor;
                            }

                            // don't go over the plot borders
                            if ((y < 0) || (y > plotHeight)) {
                                continue;
                            }
                        }

                        ctx.moveTo(x, y);
                        ctx.lineTo(x + xminor, y + yminor);
                    }
                }
            }

            ctx.stroke();
        };

        function drawGridLines(axis) {
            // check if the line will be overlapped with a border
            var overlappedWithBorder = function (value) {
                var bw = options.grid.borderWidth;
                return (((typeof bw === "object" && bw[axis.position] > 0) || bw > 0) && (value === axis.min || value === axis.max));
            };

            ctx.strokeStyle = options.grid.tickColor;
            ctx.beginPath();
            var i;
            for (i = 0; i < axis.ticks.length; ++i) {
                var v = axis.ticks[i].v,
                    xoff = 0,
                    yoff = 0,
                    x = 0,
                    y = 0;

                if (isNaN(v) || v < axis.min || v > axis.max) continue;

                // skip those lying on the axes if we got a border
                if (overlappedWithBorder(v)) continue;

                if (axis.direction === "x") {
                    x = axis.p2c(v);
                    y = plotHeight;
                    yoff = -plotHeight;
                } else {
                    x = 0;
                    y = axis.p2c(v);
                    xoff = plotWidth;
                }

                if (axis.direction === "x") {
                    x = alignPosition(ctx.lineWidth, x);
                } else {
                    y = alignPosition(ctx.lineWidth, y);
                }

                ctx.moveTo(x, y);
                ctx.lineTo(x + xoff, y + yoff);
            }

            ctx.stroke();
        };

        function drawBorder() {
            // If either borderWidth or borderColor is an object, then draw the border
            // line by line instead of as one rectangle
            var bw = options.grid.borderWidth,
                bc = options.grid.borderColor;

            if (typeof bw === "object" || typeof bc === "object") {
                if (typeof bw !== "object") {
                    bw = {
                        top: bw,
                        right: bw,
                        bottom: bw,
                        left: bw
                    };
                }
                if (typeof bc !== "object") {
                    bc = {
                        top: bc,
                        right: bc,
                        bottom: bc,
                        left: bc
                    };
                }

                if (bw.top > 0) {
                    ctx.strokeStyle = bc.top;
                    ctx.lineWidth = bw.top;
                    ctx.beginPath();
                    ctx.moveTo(0 - bw.left, 0 - bw.top / 2);
                    ctx.lineTo(plotWidth, 0 - bw.top / 2);
                    ctx.stroke();
                }

                if (bw.right > 0) {
                    ctx.strokeStyle = bc.right;
                    ctx.lineWidth = bw.right;
                    ctx.beginPath();
                    ctx.moveTo(plotWidth + bw.right / 2, 0 - bw.top);
                    ctx.lineTo(plotWidth + bw.right / 2, plotHeight);
                    ctx.stroke();
                }

                if (bw.bottom > 0) {
                    ctx.strokeStyle = bc.bottom;
                    ctx.lineWidth = bw.bottom;
                    ctx.beginPath();
                    ctx.moveTo(plotWidth + bw.right, plotHeight + bw.bottom / 2);
                    ctx.lineTo(0, plotHeight + bw.bottom / 2);
                    ctx.stroke();
                }

                if (bw.left > 0) {
                    ctx.strokeStyle = bc.left;
                    ctx.lineWidth = bw.left;
                    ctx.beginPath();
                    ctx.moveTo(0 - bw.left / 2, plotHeight + bw.bottom);
                    ctx.lineTo(0 - bw.left / 2, 0);
                    ctx.stroke();
                }
            } else {
                ctx.lineWidth = bw;
                ctx.strokeStyle = options.grid.borderColor;
                ctx.strokeRect(-bw / 2, -bw / 2, plotWidth + bw, plotHeight + bw);
            }
        };

        function drawGrid() {
            var axes, bw;

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            drawMarkings();

            axes = allAxes();
            bw = options.grid.borderWidth;

            for (var j = 0; j < axes.length; ++j) {
                var axis = axes[j];

                if (!axis.show) {
                    continue;
                }

                drawTickBar(axis);
                if (axis.showTicks === true) {
                    drawTickMarks(axis);
                }

                if (axis.gridLines === true) {
                    drawGridLines(axis, bw);
                }
            }

            // draw border
            if (bw) {
                drawBorder();
            }

            ctx.restore();
        }

        function drawAxisLabels() {
            $.each(allAxes(), function(_, axis) {
                var box = axis.box,
                    legacyStyles = axis.direction + "Axis " + axis.direction + axis.n + "Axis",
                    layer = "flot-" + axis.direction + "-axis flot-" + axis.direction + axis.n + "-axis " + legacyStyles,
                    font = axis.options.font || "flot-tick-label tickLabel",
                    i, x, y, halign, valign, info,
                    margin = 3,
                    nullBox = {x: NaN, y: NaN, width: NaN, height: NaN}, newLabelBox, labelBoxes = [],
                    overlapping = function(x11, y11, x12, y12, x21, y21, x22, y22) {
                        return ((x11 <= x21 && x21 <= x12) || (x21 <= x11 && x11 <= x22)) &&
                               ((y11 <= y21 && y21 <= y12) || (y21 <= y11 && y11 <= y22));
                    },
                    overlapsOtherLabels = function(newLabelBox, previousLabelBoxes) {
                        return previousLabelBoxes.some(function(labelBox) {
                            return overlapping(
                                newLabelBox.x, newLabelBox.y, newLabelBox.x + newLabelBox.width, newLabelBox.y + newLabelBox.height,
                                labelBox.x, labelBox.y, labelBox.x + labelBox.width, labelBox.y + labelBox.height);
                        });
                    },
                    drawAxisLabel = function (tick, labelBoxes) {
                        if (!tick || !tick.label || tick.v < axis.min || tick.v > axis.max) {
                            return nullBox;
                        }

                        info = surface.getTextInfo(layer, tick.label, font);

                        if (axis.direction === "x") {
                            halign = "center";
                            x = plotOffset.left + axis.p2c(tick.v);
                            if (axis.position === "bottom") {
                                y = box.top + box.padding - axis.boxPosition.centerY;
                            } else {
                                y = box.top + box.height - box.padding + axis.boxPosition.centerY;
                                valign = "bottom";
                            }
                            newLabelBox = {x: x - info.width / 2 - margin, y: y - margin, width: info.width + 2 * margin, height: info.height + 2 * margin};
                        } else {
                            valign = "middle";
                            y = plotOffset.top + axis.p2c(tick.v);
                            if (axis.position === "left") {
                                x = box.left + box.width - box.padding - axis.boxPosition.centerX;
                                halign = "right";
                            } else {
                                x = box.left + box.padding + axis.boxPosition.centerX;
                            }
                            newLabelBox = {x: x - info.width / 2 - margin, y: y - margin, width: info.width + 2 * margin, height: info.height + 2 * margin};
                        }

                        if (overlapsOtherLabels(newLabelBox, labelBoxes)) {
                            return nullBox;
                        }

                        surface.addText(layer, x, y, tick.label, font, null, null, halign, valign);

                        return newLabelBox;
                    };

                // Remove text before checking for axis.show and ticks.length;
                // otherwise plugins, like flot-tickrotor, that draw their own
                // tick labels will end up with both theirs and the defaults.

                surface.removeText(layer);

                executeHooks(hooks.drawAxis, [axis, surface]);

                if (!axis.show) {
                    return;
                }

                switch (axis.options.showTickLabels) {
                    case 'none':
                        break;
                    case 'endpoints':
                        labelBoxes.push(drawAxisLabel(axis.ticks[0], labelBoxes));
                        labelBoxes.push(drawAxisLabel(axis.ticks[axis.ticks.length - 1], labelBoxes));
                        break;
                    case 'major':
                        labelBoxes.push(drawAxisLabel(axis.ticks[0], labelBoxes));
                        labelBoxes.push(drawAxisLabel(axis.ticks[axis.ticks.length - 1], labelBoxes));
                        for (i = 1; i < axis.ticks.length - 1; ++i) {
                            labelBoxes.push(drawAxisLabel(axis.ticks[i], labelBoxes));
                        }
                        break;
                    case 'all':
                        labelBoxes.push(drawAxisLabel(axis.ticks[0], []));
                        labelBoxes.push(drawAxisLabel(axis.ticks[axis.ticks.length - 1], labelBoxes));
                        for (i = 1; i < axis.ticks.length - 1; ++i) {
                            labelBoxes.push(drawAxisLabel(axis.ticks[i], labelBoxes));
                        }
                        break;
                }
            });
        }

        function drawSeries(series) {
            if (series.lines.show) {
                $.plot.drawSeries.drawSeriesLines(series, ctx, plotOffset, plotWidth, plotHeight, plot.drawSymbol, getColorOrGradient);
            }

            if (series.bars.show) {
                $.plot.drawSeries.drawSeriesBars(series, ctx, plotOffset, plotWidth, plotHeight, plot.drawSymbol, getColorOrGradient);
            }

            if (series.points.show) {
                $.plot.drawSeries.drawSeriesPoints(series, ctx, plotOffset, plotWidth, plotHeight, plot.drawSymbol, getColorOrGradient);
            }
        }

        function computeRangeForDataSeries(series, force, isValid) {
            var points = series.datapoints.points,
                ps = series.datapoints.pointsize,
                format = series.datapoints.format,
                topSentry = Number.POSITIVE_INFINITY,
                bottomSentry = Number.NEGATIVE_INFINITY,
                range = {
                    xmin: topSentry,
                    ymin: topSentry,
                    xmax: bottomSentry,
                    ymax: bottomSentry
                };

            for (var j = 0; j < points.length; j += ps) {
                if (points[j] === null) {
                    continue;
                }

                if (typeof (isValid) === 'function' && !isValid(points[j])) {
                    continue;
                }

                for (var m = 0; m < ps; ++m) {
                    var val = points[j + m],
                        f = format[m];
                    if (f === null || f === undefined) {
                        continue;
                    }

                    if (typeof (isValid) === 'function' && !isValid(val)) {
                        continue;
                    }

                    if ((!force && !f.computeRange) || val === Infinity || val === -Infinity) {
                        continue;
                    }

                    if (f.x === true) {
                        if (val < range.xmin) {
                            range.xmin = val;
                        }

                        if (val > range.xmax) {
                            range.xmax = val;
                        }
                    }

                    if (f.y === true) {
                        if (val < range.ymin) {
                            range.ymin = val;
                        }

                        if (val > range.ymax) {
                            range.ymax = val;
                        }
                    }
                }
            }

            return range;
        };

        function adjustSeriesDataRange(series, range) {
            if (series.bars.show) {
                // make sure we got room for the bar on the dancing floor
                var delta;

                // update bar width if needed
                var useAbsoluteBarWidth = series.bars.barWidth[1];
                if (series.datapoints && series.datapoints.points && !useAbsoluteBarWidth) {
                    computeBarWidth(series);
                }

                var barWidth = series.bars.barWidth[0] || series.bars.barWidth;
                switch (series.bars.align) {
                    case "left":
                        delta = 0;
                        break;
                    case "right":
                        delta = -barWidth;
                        break;
                    default:
                        delta = -barWidth / 2;
                }

                if (series.bars.horizontal) {
                    range.ymin += delta;
                    range.ymax += delta + barWidth;
                }
                else {
                    range.xmin += delta;
                    range.xmax += delta + barWidth;
                }
            }

            if ((series.bars.show && series.bars.zero) || (series.lines.show && series.lines.zero)) {
                var ps = series.datapoints.pointsize;

                // make sure the 0 point is included in the computed y range when requested
                if (ps <= 2) {
                    /*if ps > 0 the points were already taken into account for autoScale */
                    range.ymin = Math.min(0, range.ymin);
                    range.ymax = Math.max(0, range.ymax);
                }
            }

            return range;
        };

        function computeBarWidth(series) {
            var pointsize = series.datapoints.pointsize, minDistance = Number.MAX_VALUE,
                distance = series.datapoints.points[pointsize] - series.datapoints.points[0] || 1;

            if (isFinite(distance)) {
                minDistance = distance;
            }
            for (var j = pointsize; j < series.datapoints.points.length - pointsize; j += pointsize) {
                distance = Math.abs(series.datapoints.points[pointsize + j] - series.datapoints.points[j]);
                if (distance < minDistance && isFinite(distance)) {
                    minDistance = distance;
                }
            }

            if (typeof series.bars.barWidth === "number") {
                series.bars.barWidth = series.bars.barWidth * minDistance;
            } else {
                series.bars.barWidth[0] = series.bars.barWidth[0] * minDistance;
            }
        }

        // returns the data item the mouse is over/ the cursor is closest to, or null if none is found
        function findNearbyItem(mouseX, mouseY, seriesFilter, radius, computeDistance) {
            var i, j,
                item = null,
                smallestDistance = radius * radius + 1;

            for (var i = series.length - 1; i >= 0; --i) {
                if (!seriesFilter(i)) continue;

                var s = series[i];
                if (!s.datapoints) return;

                if (s.lines.show || s.points.show) {
                    var found = findNearbyPoint(s, mouseX, mouseY, radius, smallestDistance, computeDistance);
                    if (found) {
                        smallestDistance = found.distance;
                        item = [i, found.dataIndex];
                    }
                }

                if (s.bars.show && !item) { // no other point can be nearby
                    var foundIndex = findNearbyBar(s, mouseX, mouseY);
                    if (foundIndex) item = [i, foundIndex];
                }
            }

            if (item) {
                i = item[0];
                j = item[1];
                var ps = series[i].datapoints.pointsize;

                return {
                    datapoint: series[i].datapoints.points.slice(j * ps, (j + 1) * ps),
                    dataIndex: j,
                    series: series[i],
                    seriesIndex: i
                };
            }

            return null;
        }

        function findNearbyPoint (series, mouseX, mouseY, maxDistance, smallestDistance, computeDistance) {
            var mx = series.xaxis.c2p(mouseX),
                my = series.yaxis.c2p(mouseY),
                maxx = maxDistance / series.xaxis.scale,
                maxy = maxDistance / series.yaxis.scale,
                points = series.datapoints.points,
                ps = series.datapoints.pointsize;

            // with inverse transforms, we can't use the maxx/maxy
            // optimization, sadly
            if (series.xaxis.options.inverseTransform) {
                maxx = Number.MAX_VALUE;
            }

            if (series.yaxis.options.inverseTransform) {
                maxy = Number.MAX_VALUE;
            }

            var found = null;
            for (var j = 0; j < points.length; j += ps) {
                var x = points[j];
                var y = points[j + 1];
                if (x == null) {
                    continue;
                }

                if (x - mx > maxx || x - mx < -maxx ||
                    y - my > maxy || y - my < -maxy) {
                    continue;
                }

                // We have to calculate distances in pixels, not in
                // data units, because the scales of the axes may be different
                var dx = Math.abs(series.xaxis.p2c(x) - mouseX);
                var dy = Math.abs(series.yaxis.p2c(y) - mouseY);
                var dist = computeDistance ? computeDistance(dx, dy) : dx * dx + dy * dy;

                // use <= to ensure last point takes precedence
                // (last generally means on top of)
                if (dist < smallestDistance) {
                    smallestDistance = dist;
                    found = { dataIndex: j / ps, distance: dist };
                }
            }

            return found;
        }

        function findNearbyBar (series, mouseX, mouseY) {
            var barLeft, barRight,
                barWidth = series.bars.barWidth[0] || series.bars.barWidth,
                mx = series.xaxis.c2p(mouseX),
                my = series.yaxis.c2p(mouseY),
                points = series.datapoints.points,
                ps = series.datapoints.pointsize;

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

            barRight = barLeft + barWidth;

            var fillTowards = series.bars.fillTowards || 0;
            var bottom = fillTowards > series.yaxis.min ? Math.min(series.yaxis.max, fillTowards) : series.yaxis.min;

            var foundIndex = null;
            for (var j = 0; j < points.length; j += ps) {
                var x = points[j], y = points[j + 1];
                if (x == null)
                    continue;

                // for a bar graph, the cursor must be inside the bar
                if (series.bars.horizontal ?
                    (mx <= Math.max(bottom, x) && mx >= Math.min(bottom, x) &&
                        my >= y + barLeft && my <= y + barRight) :
                    (mx >= x + barLeft && mx <= x + barRight &&
                        my >= Math.min(bottom, y) && my <= Math.max(bottom, y)))
                        foundIndex = j / ps;
            }

            return foundIndex;
        }

        function findNearbyInterpolationPoint(posX, posY, seriesFilter) {
            var i, j, dist, dx, dy, ps,
                item,
                smallestDistance = Number.MAX_VALUE;

            for (i = 0; i < series.length; ++i) {
                if (!seriesFilter(i)) {
                    continue;
                }
                var points = series[i].datapoints.points;
                ps = series[i].datapoints.pointsize;

                // if the data is coming from positive -> negative, reverse the comparison
                const comparer = points[points.length - ps] < points[0]
                    ? function (x1, x2) { return x1 > x2 }
                    : function (x1, x2) { return x2 > x1 };

                // do not interpolate outside the bounds of the data.
                if (comparer(posX, points[0])) {
                    continue;
                }

                // Find the nearest points, x-wise
                for (j = ps; j < points.length; j += ps) {
                    if (comparer(posX, points[j])) {
                        break;
                    }
                }

                // Now Interpolate
                var y,
                    p1x = points[j - ps],
                    p1y = points[j - ps + 1],
                    p2x = points[j],
                    p2y = points[j + 1];

                if ((p1x === undefined) || (p2x === undefined) ||
                    (p1y === undefined) || (p2y === undefined)) {
                    continue;
                }

                if (p1x === p2x) {
                    y = p2y
                } else {
                    y = p1y + (p2y - p1y) * (posX - p1x) / (p2x - p1x);
                }

                posY = y;

                dx = Math.abs(series[i].xaxis.p2c(p2x) - posX);
                dy = Math.abs(series[i].yaxis.p2c(p2y) - posY);
                dist = dx * dx + dy * dy;

                if (dist < smallestDistance) {
                    smallestDistance = dist;
                    item = [posX, posY, i, j];
                }
            }

            if (item) {
                i = item[2];
                j = item[3];
                ps = series[i].datapoints.pointsize;
                points = series[i].datapoints.points;
                p1x = points[j - ps];
                p1y = points[j - ps + 1];
                p2x = points[j];
                p2y = points[j + 1];

                return {
                    datapoint: [item[0], item[1]],
                    leftPoint: [p1x, p1y],
                    rightPoint: [p2x, p2y],
                    seriesIndex: i
                };
            }

            return null;
        }

        function triggerRedrawOverlay() {
            var t = options.interaction.redrawOverlayInterval;
            if (t === -1) { // skip event queue
                drawOverlay();
                return;
            }

            if (!redrawTimeout) {
                redrawTimeout = setTimeout(function() {
                    drawOverlay(plot);
                }, t);
            }
        }

        function drawOverlay(plot) {
            redrawTimeout = null;

            if (!octx) {
                return;
            }
            overlay.clear();
            executeHooks(hooks.drawOverlay, [octx, overlay]);
            var event = new CustomEvent('onDrawingDone');
            plot.getEventHolder().dispatchEvent(event);
        }

        function getColorOrGradient(spec, bottom, top, defaultColor) {
            if (typeof spec === "string") {
                return spec;
            } else {
                // assume this is a gradient spec; IE currently only
                // supports a simple vertical gradient properly, so that's
                // what we support too
                var gradient = ctx.createLinearGradient(0, top, 0, bottom);

                for (var i = 0, l = spec.colors.length; i < l; ++i) {
                    var c = spec.colors[i];
                    if (typeof c !== "string") {
                        var co = $.color.parse(defaultColor);
                        if (c.brightness != null) {
                            co = co.scale('rgb', c.brightness);
                        }

                        if (c.opacity != null) {
                            co.a *= c.opacity;
                        }

                        c = co.toString();
                    }
                    gradient.addColorStop(i / (l - 1), c);
                }

                return gradient;
            }
        }
    }

    // Add the plot function to the top level of the jQuery object

    $.plot = function(placeholder, data, options) {
        var plot = new Plot($(placeholder), data, options, $.plot.plugins);
        return plot;
    };

    $.plot.version = "1.0.3";

    $.plot.plugins = [];

    // Also add the plot function as a chainable property
    $.fn.plot = function(data, options) {
        return this.each(function() {
            $.plot(this, data, options);
        });
    };

    $.plot.linearTickGenerator = defaultTickGenerator;
    $.plot.defaultTickFormatter = defaultTickFormatter;
    $.plot.expRepTickFormatter = expRepTickFormatter;
})(jQuery);
