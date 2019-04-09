/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe("flot errorbars plugin", function() {
    var minx = 0, maxx = 200, miny = 0, maxy = 100;
    var series, ctx, plotWidth, plotHeight, plotOffset,
    getColorOrGradient;
    var drawFuncs = {
        drawArrow: function(ctx, x, y, radius){
            ctx.beginPath();
            ctx.moveTo(x + radius, y + radius);
            ctx.lineTo(x, y);
            ctx.lineTo(x - radius, y + radius);
            ctx.stroke();
        },
        drawSemiCircle: function(ctx, x, y, radius){
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI, false);
            ctx.moveTo(x - radius, y);
            ctx.lineTo(x + radius, y);
            ctx.stroke();
        }
    };

    function validatePointsAreInsideTheAxisRanges(points) {
        points.forEach(function(point) {
            var x = point[0], y = point[1];
            expect(minx <= x && x <= maxx).toBe(true);
            expect(miny <= y && y <= maxy).toBe(true);
        });
    }

    function executeHooks(plot, hooks, args) {
        args = [plot].concat(args);
        for (var i = 0; i < hooks.length; ++i) {
            hooks[i].apply(plot, args);
        }
    }

    beforeEach(function() {
        ctx = setFixtures('<div id="test-container" style="width: 200px;height: 100px;border-style: solid;border-width: 1px"><canvas id="theCanvas" style="width: 100%; height: 100%" /></div>')
            .find('#theCanvas')[0]
            .getContext('2d');

        plotWidth = 200;
        plotHeight = 100;
        plotOffset = { top: 0, left: 0 };
        getColorOrGradient = jasmine.createSpy().and.returnValue('rgb(10,200,10)');
    });

    it('should draw nothing when the values are null', function () {
        spyOn(ctx, 'moveTo').and.callThrough();
        spyOn(ctx, 'lineTo').and.callThrough();

        var plot = $.plot($("#test-container"), [[]], {
            series: {
                lines: {
                    show: false
                }
            },
            xaxis: {
                autoScale: 'none',
                min: 0.6,
                max: 3.1
            },
            yaxis: {
                autoScale: 'none',
                min: 0,
                max: 3.5
            }
        });


        expect(ctx.moveTo).not.toHaveBeenCalled();
        expect(ctx.lineTo).not.toHaveBeenCalled();
        var points = ctx.moveTo.calls.allArgs().concat(
            ctx.lineTo.calls.allArgs());
        validatePointsAreInsideTheAxisRanges(points);
    });

    it('should draw lines for error bars on points', function () {
        spyOn(ctx, 'lineTo').and.callThrough();
        spyOn(ctx, 'moveTo').and.callThrough();

        var data1 = [
            [1,1,.5,.1,.3],
            [2,2,.3,.5,.2],
            [3,3,.9,.5,.2],
            [1.5,-.05,.5,.1,.3],
            [3.15,1.,.5,.1,.3],
            [2.5,-1.,.5,.1,.3]
        ];

        var data1_points = {
            show: true,
            radius: 5,
            fillColor: "blue",
            errorbars: "xy",
            xerr: {show: true, asymmetric: true, upperCap: "-", lowerCap: "-"},
            yerr: {show: true, color: "red", upperCap: "-"}
        };

        var data = [
            {color: "blue", points: data1_points, data: data1, label: "data1"}
        ];

        var plot = $.plot($("#test-container"), data, {
            series: {
                lines: {
                    show: false
                }
            },
            xaxis: {
                autoScale: 'none',
                min: 0.6,
                max: 3.1
            },
            yaxis: {
                autoScale: 'none',
                min: 0,
                max: 3.5
            }
        });

        executeHooks(plot, plot.hooks.draw, [ctx]);

        expect(ctx.lineTo).toHaveBeenCalled();
        expect(ctx.moveTo).toHaveBeenCalled();
        var points = ctx.moveTo.calls.allArgs().concat(
            ctx.lineTo.calls.allArgs());
        validatePointsAreInsideTheAxisRanges(points);
    });

    it('should draw lines for error bars on lines', function () {
        spyOn(ctx, 'lineTo').and.callThrough();
        spyOn(ctx, 'moveTo').and.callThrough();

        var data3 = [
            [1,2,.4],
            [2,0.5,.3],
            [2.7,2,.5]
        ];

        var data3_points = {
            //do not show points
            radius: 0,
            errorbars: "y",
            yerr: {show:true, upperCap: "-", lowerCap: "-", radius: 5}
        };

        var data = [
            {color: "green", lines: {show: true}, points: data3_points, data: data3, label: "data3"},
        ];

        var plot = $.plot($("#test-container"), data, {
            series: {
                lines: {
                    show: false
                }
            },
            xaxis: {
                autoScale: 'none',
                min: 0.6,
                max: 3.1
            },
            yaxis: {
                autoScale: 'none',
                min: 0,
                max: 3.5
            }
        });

        executeHooks(plot, plot.hooks.draw, [ctx]);

        expect(ctx.lineTo).toHaveBeenCalled();
        expect(ctx.moveTo).toHaveBeenCalled();
        var points = ctx.moveTo.calls.allArgs().concat(
            ctx.lineTo.calls.allArgs());
        validatePointsAreInsideTheAxisRanges(points);
    });

    it('should draw lines for error bars on bars', function () {
        spyOn(ctx, 'lineTo').and.callThrough();
        spyOn(ctx, 'moveTo').and.callThrough();

        var data4 = [
            [1.3, 1],
            [1.75, 2.5],
            [2.5, 0.5]
        ];

        var data4_points = {
            //do not show points
            radius: 0,
            errorbars: "y",
            yerr: {show:true, upperCap: "-", lowerCap: "-", radius: 5}
        };

        var data4_errors = [0.1, 0.4, 0.2];
        for (var i = 0; i < data4.length; i++) {
            data4_errors[i] = data4[i].concat(data4_errors[i])
        }

        var data = [
            {color: "orange", bars: {show: true, align: "center", barWidth: 0.25}, data: data4, label: "data4"},
            {color: "orange", points: data4_points, data: data4_errors}
        ];

        var plot = $.plot($("#test-container"), data, {
            series: {
                lines: {
                    show: false
                }
            },
            xaxis: {
                autoScale: 'none',
                min: 0.6,
                max: 3.1
            },
            yaxis: {
                autoScale: 'none',
                min: 0,
                max: 3.5
            }
        });

        executeHooks(plot, plot.hooks.draw, [ctx]);

        expect(ctx.lineTo).toHaveBeenCalled();
        expect(ctx.moveTo).toHaveBeenCalled();

        var points = ctx.moveTo.calls.allArgs().concat(
            ctx.lineTo.calls.allArgs());
        validatePointsAreInsideTheAxisRanges(points);
        expect(ctx.lineTo).toHaveBeenCalled();
    });

    it('should use custom draw functions', function () {
        spyOn(drawFuncs, 'drawArrow').and.callThrough();
        spyOn(drawFuncs, 'drawSemiCircle').and.callThrough();

        var data2 = [
            [.7,3,.2,.4],
            [1.5,2.2,.3,.4],
            [2.3,1,.5,.2]
        ];

        var data2_points = {
            show: true,
            radius: 5,
            errorbars: "y",
            yerr: {show:true, asymmetric:true, upperCap: drawFuncs.drawArrow, lowerCap: drawFuncs.drawSemiCircle}
        };

        var data = [
            {color: "red",  points: data2_points, data: data2, label: "data2"},
        ];

        var plot = $.plot($("#test-container"), data, {
            series: {
                lines: {
                    show: false
                }
            },
            xaxis: {
                autoScale: 'none',
                min: 0.6,
                max: 3.1
            },
            yaxis: {
                autoScale: 'none',
                min: 0,
                max: 3.5
            }
        });

        executeHooks(plot, plot.hooks.draw, [ctx]);

        expect(drawFuncs.drawArrow).toHaveBeenCalled();
        expect(drawFuncs.drawSemiCircle).toHaveBeenCalled();
    });
});
