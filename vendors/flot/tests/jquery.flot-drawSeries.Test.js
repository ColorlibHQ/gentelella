/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe('drawSeries', function() {

    describe('drawSeriesLines', function() {
        var minx = 0, maxx = 200, miny = 0, maxy = 100,
            series, ctx, plotWidth, plotHeight, plotOffset,
            drawSeriesLines = jQuery.plot.drawSeries.drawSeriesLines,
            getColorOrGradient;

        beforeEach(function() {
            series = {
                lines: {
                    lineWidth: 1
                },
                datapoints: {
                    format: null,
                    points: null,
                    pointsize: 2
                },
                xaxis: {
                    min: minx,
                    max: maxx,
                    p2c: function(p) { return p; }
                },
                yaxis: {
                    min: miny,
                    max: maxy,
                    p2c: function(p) { return p; }
                }
            };
            ctx = setFixtures('<div id="test-container" style="width: 200px;height: 100px;border-style: solid;border-width: 1px"><canvas id="theCanvas" style="width: 100%; height: 100%" /></div>')
                .find('#theCanvas')[0]
                .getContext('2d');
            plotWidth = 200;
            plotHeight = 100;
            plotOffset = { top: 0, left: 0 };
            getColorOrGradient = jasmine.createSpy().and.returnValue('rgb(10,200,10)');
        });

        it('should draw nothing when the values are null', function () {
            series.datapoints.points = [null, null, null, null];

            spyOn(ctx, 'moveTo').and.callThrough();
            spyOn(ctx, 'lineTo').and.callThrough();

            drawSeriesLines(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.moveTo).not.toHaveBeenCalled();
            expect(ctx.lineTo).not.toHaveBeenCalled();
        });

        it('should draw lines for values', function () {
            series.datapoints.points = [0, 0, 150, 25, 50, 75, 200, 100];

            spyOn(ctx, 'lineTo').and.callThrough();

            drawSeriesLines(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.lineTo).toHaveBeenCalled();
        });

        it('should decimate when a decimate function is provided', function () {
            series.datapoints.points = [-1, -1, 0, 0, 1, 1, 2, 2, 3, 3];
            series.decimate = function() {
                return [0, 0, 1, 1];
            };

            spyOn(ctx, 'moveTo').and.callThrough();
            spyOn(ctx, 'lineTo').and.callThrough();

            drawSeriesLines(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.moveTo).toHaveBeenCalledWith(0, 0);
            expect(ctx.lineTo).toHaveBeenCalledWith(1, 1);
        });

        it('should clip the lines when the points are outside the range of the axes', function () {
            series.datapoints.points = [
                minx - 8, 50,
                maxx + 8, 50,
                100, miny - 8,
                100, maxy + 8,
                minx - 8, 50];

            spyOn(ctx, 'moveTo').and.callThrough();
            spyOn(ctx, 'lineTo').and.callThrough();

            drawSeriesLines(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            validatePointsAreInsideTheAxisRanges(
                ctx.moveTo.calls.allArgs().concat(
                    ctx.lineTo.calls.allArgs()));
        });

        it('should clip the lines and the fill area when the points are outside the range of the axes', function () {
            series.datapoints.points = [
                minx - 8, 50,
                maxx + 8, 50,
                100, miny - 8,
                100, maxy + 8,
                minx - 8, 50];
            series.lines.fill = true;
            series.lines.fillColor = 'rgb(200, 200, 200)';

            spyOn(ctx, 'moveTo').and.callThrough();
            spyOn(ctx, 'lineTo').and.callThrough();

            drawSeriesLines(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            validatePointsAreInsideTheAxisRanges(
                ctx.moveTo.calls.allArgs().concat(
                    ctx.lineTo.calls.allArgs()));
        });

        it('should draw the lines when trailing step interpolation is enabled', function () {
            series.datapoints.points = [0, 0, 150, 25, 50, 75, 200, 100];
            series.lines.steps = true;

            spyOn(ctx, 'lineTo').and.callThrough();

            drawSeriesLines(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.lineTo).toHaveBeenCalled();
        });

        it('should fill the area when trailing step interpolation is enabled', function () {
            series.datapoints.points = [0, 0, 150, 25, 50, 75, 200, 100];
            series.lines.steps = true;
            series.lines.fill = true;
            series.lines.lineWidth = 0;

            spyOn(ctx, 'moveTo').and.callThrough();
            spyOn(ctx, 'lineTo').and.callThrough();
            spyOn(ctx, 'fill').and.callThrough();

            drawSeriesLines(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.moveTo).toHaveBeenCalled();
            expect(ctx.lineTo).toHaveBeenCalled();
            expect(ctx.fill).toHaveBeenCalled();
        });

        /*
        Should draw something like this (big gap between first two slopes, smaller gap between next two)

         /    \    /
        /      \  /
        */
        it('should move pen when NaNs are encountered', function () {
            series.datapoints.points = [-1, -1, 0, 0, 1, NaN, 2, NaN, 3, 0, 4, -1, NaN, 34, 6, -1, 7, 0];

            spyOn(ctx, 'moveTo').and.callThrough();
            spyOn(ctx, 'lineTo').and.callThrough();

            drawSeriesLines(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.moveTo).toHaveBeenCalledTimes(3);
            expect(ctx.lineTo).toHaveBeenCalledTimes(3);
        });

        it('should draw area fills before and after nulls', function () {
            const format = {
                x: true,
                y: false,
                number: true,
                required: true,
                computeRange: true,
                defaultValue: null
            };
            const filledSeries = {
                lines: {
                    lineWidth: 1,
                    fill: true,
                },
                xaxis: {
                    min: minx,
                    max: maxx,
                    p2c: function(p) { return p; }
                },
                yaxis: {
                    min: miny,
                    max: maxy,
                    p2c: function(p) { return p; }
                },
                datapoints: {
                    points: [
                        0, 100, 0,
                        25, 80, 20,
                        null, null, null,
                        75, 80, 20,
                        100, 100, 0,
                    ],
                    format: [format, format, format],
                    pointsize: 3,
                }
            };

            drawSeriesLines(filledSeries, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            function isPixelFilled(ctx, x, y) {
                return ctx.getImageData(x, y, 1, 1).data[3] > 0;
            }

            /**
            The plot drawn looks something like this:
              |\  /|
              |/  \|
            */
            const leftFilled = isPixelFilled(ctx, 10, 50);
            const middleFilled = isPixelFilled(ctx, 50, 50);
            const rightFilled = isPixelFilled(ctx, 90, 50);

            expect(leftFilled).toBe(true);
            expect(middleFilled).toBe(false);
            expect(rightFilled).toBe(true);
        });

        function validatePointsAreInsideTheAxisRanges(points) {
            points.forEach(function(point) {
                var x = point[0], y = point[1];
                expect(minx <= x && x <= maxx).toBe(true);
                expect(miny <= y && y <= maxy).toBe(true);
            });
        }

    });

    describe('drawSeriesPoints', function() {
        var minx = 0, maxx = 200, miny = 0, maxy = 100,
            series, ctx, plotWidth, plotHeight, plotOffset,
            drawSeriesPoints = jQuery.plot.drawSeries.drawSeriesPoints,
            dollar, getColorOrGradient;

        beforeEach(function() {
            series = {
                points: {
                    show: true,
                    symbol: 'circle',
                    radius: 5
                },
                datapoints: {
                    format: null,
                    points: null,
                    pointsize: 2
                },
                xaxis: {
                    min: minx,
                    max: maxx,
                    p2c: function(p) { return p; }
                },
                yaxis: {
                    min: miny,
                    max: maxy,
                    p2c: function(p) { return p; }
                }
            };
            ctx = setFixtures('<div id="test-container" style="width: 200px;height: 100px;border-style: solid;border-width: 1px"><canvas id="theCanvas" style="width: 100%; height: 100%" /></div>')
                .find('#theCanvas')[0]
                .getContext('2d');
            plotWidth = 200;
            plotHeight = 100;
            plotOffset = { top: 0, left: 0 };
            dollar = jasmine.createSpy().and.callFake(function (ctx, x, y, radius, shadow) {
                ctx.strokeText('$', x, y);
            });
            getColorOrGradient = jasmine.createSpy().and.returnValue('rgb(10,200,10)');
        });

        it('should draw nothing when the values are null', function () {
            series.datapoints.points = [null, null, null, null];

            spyOn(ctx, 'moveTo').and.callThrough();
            spyOn(ctx, 'lineTo').and.callThrough();

            drawSeriesPoints(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.moveTo).not.toHaveBeenCalled();
            expect(ctx.lineTo).not.toHaveBeenCalled();
        });

        it('should draw circles by default for values', function () {
            series.datapoints.points = [0, 0, 150, 25, 50, 75, 200, 100];

            spyOn(ctx, 'arc').and.callThrough();

            drawSeriesPoints(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.arc).toHaveBeenCalled();
        });

        it('should draw custom symbols given by name for values', function () {
            series.points.symbol = 'dollar';
            series.datapoints.points = [0, 0, 150, 25, 50, 75, 200, 100];

            drawSeriesPoints(series, ctx, plotOffset, plotWidth, plotHeight, {'dollar': dollar}, getColorOrGradient);

            expect(dollar).toHaveBeenCalled();
        });

        it('should draw custom symbols given by function for values', function () {
            series.points.symbol = 'dollar';
            series.datapoints.points = [0, 0, 150, 25, 50, 75, 200, 100];

            drawSeriesPoints(series, ctx, plotOffset, plotWidth, plotHeight, dollar, getColorOrGradient);

            expect(dollar).toHaveBeenCalled();
        });

        it('should not fill when the symbol function doesn`t need fill', function () {
            dollar.fill = undefined;
            series.points.symbol = 'dollar';
            series.datapoints.points = [0, 0, 150, 25, 50, 75, 200, 100];

            spyOn(ctx, 'fill').and.callThrough();

            drawSeriesPoints(series, ctx, plotOffset, plotWidth, plotHeight, dollar, getColorOrGradient);

            expect(ctx.fill).not.toHaveBeenCalled();
        });

        it('should fill only once when the symbol function needs fill', function () {
            dollar.fill = true;
            series.points.symbol = 'dollar';
            series.datapoints.points = [0, 0, 150, 25, 50, 75, 200, 100];

            spyOn(ctx, 'fill').and.callThrough();

            drawSeriesPoints(series, ctx, plotOffset, plotWidth, plotHeight, dollar, getColorOrGradient);

            expect(ctx.fill).toHaveBeenCalled();
            expect(ctx.fill.calls.count()).toBe(1);
        });
    });

    describe('drawSeriesBars', function() {
        var minx = -200, maxx = 200, miny = -100, maxy = 100,
            series, ctx, plotWidth, plotHeight, plotOffset,
            drawSeriesBars = jQuery.plot.drawSeries.drawSeriesBars,
            getColorOrGradient;

        beforeEach(function() {
            series = {
                bars: {
                    lineWidth: 1,
                    show: true,
                    fillColor: 'blue',
                    barWidth: 0.8
                },
                datapoints: {
                    format: null,
                    points: null,
                    pointsize: 2
                },
                xaxis: {
                    min: minx,
                    max: maxx,
                    autoScale: 'exact',
                    p2c: function(p) { return p; }
                },
                yaxis: {
                    min: miny,
                    max: maxy,
                    autoScale: 'exact',
                    p2c: function(p) { return p; }
                }
            };
            ctx = setFixtures('<div id="test-container" style="width: 200px;height: 100px;border-style: solid;border-width: 1px"><canvas id="theCanvas" style="width: 100%; height: 100%" /></div>')
                .find('#theCanvas')[0]
                .getContext('2d');
            plotWidth = 200;
            plotHeight = 100;
            plotOffset = { top: 0, left: 0 };
        });

        function getPixelColor(ctx, x, y) {
            return ctx.getImageData(x, y, 1, 1).data;
        }

        function rgba(r, g, b, a) {
            return [r, g, b, a * 255];
        }

        it('should draw nothing when the values are null', function () {
            series.datapoints.points = [null, null, null, null];

            spyOn(ctx, 'moveTo').and.callThrough();
            spyOn(ctx, 'lineTo').and.callThrough();

            drawSeriesBars(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.moveTo).not.toHaveBeenCalled();
            expect(ctx.lineTo).not.toHaveBeenCalled();
        });

        it('should work with NaN, Infinity and -Infinity values', function () {
            spyOn(ctx, 'lineTo').and.callThrough();

            series.datapoints.points = [Infinity, 0, NaN, NaN, 0, Infinity, 10, -Infinity, -Infinity, 10, 3, 5, 8, 2];

            drawSeriesBars(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.lineTo).toHaveBeenCalled();
        });

        it('should draw bars for values', function () {
            series.datapoints.points = [0, 0, 150, 25, 50, 75, 200, 100];

            spyOn(ctx, 'lineTo').and.callThrough();

            drawSeriesBars(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.lineTo).toHaveBeenCalled();
        });

        it('should draw bars using bottom points if provided', function () {
            getColorOrGradient = jasmine.createSpy().and.returnValue('rgb(10,200,10)');
            series.bars.fill = true;

            series.datapoints.points = [0, 10, 0, 1, 10, 1, 2, 10, 2];
            series.datapoints.pointsize = 3;
            spyOn(ctx, 'fillRect').and.callThrough();

            drawSeriesBars(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            var barHeights = ctx.fillRect.calls.allArgs().map(function (args) {
                return args[3];
            });

            // bottom - top
            expect(barHeights).toEqual([-10, -9, -8]);
        });

        it('should draw bars for fillTowards infinity', function () {
            series.datapoints.points = [150, 25];
            series.bars.fillTowards = Infinity;

            var barWidth = series.bars.barWidth[0] || series.bars.barWidth;
            var xaxis = series.xaxis,
                yaxis = series.yaxis,
                leftValue = xaxis.p2c(series.datapoints.points[0] - barWidth / 2),
                rightValue = xaxis.p2c(series.datapoints.points[0] + barWidth / 2),
                topValue = yaxis.p2c(maxy),
                yValue = xaxis.p2c(series.datapoints.points[1]);

            spyOn(ctx, 'lineTo').and.callThrough();

            drawSeriesBars(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.lineTo.calls.argsFor(0)).toEqual([leftValue, topValue]);
            expect(ctx.lineTo.calls.argsFor(1)).toEqual([rightValue, yValue]);
            expect(ctx.lineTo.calls.argsFor(2)).toEqual([leftValue, yValue]);
        });

        it('should draw bars for fillTowards -infinity', function () {
            series.datapoints.points = [150, 25];
            series.bars.fillTowards = -Infinity;

            var barWidth = series.bars.barWidth[0] || series.bars.barWidth;
            var xaxis = series.xaxis,
                yaxis = series.yaxis,
                leftValue = xaxis.p2c(series.datapoints.points[0] - barWidth / 2),
                rightValue = xaxis.p2c(series.datapoints.points[0] + barWidth / 2),
                bottomValue = yaxis.p2c(miny),
                yValue = xaxis.p2c(series.datapoints.points[1]);


            spyOn(ctx, 'lineTo').and.callThrough();

            drawSeriesBars(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.lineTo.calls.argsFor(0)).toEqual([leftValue, yValue]);
            expect(ctx.lineTo.calls.argsFor(1)).toEqual([rightValue, yValue]);
            expect(ctx.lineTo.calls.argsFor(2)).toEqual([rightValue, bottomValue]);
        });

        it('should draw bars for fillTowards zero', function () {
            series.datapoints.points = [150, 25];
            series.bars.fillTowards = 0;

            var barWidth = series.bars.barWidth[0] || series.bars.barWidth;
            var xaxis = series.xaxis,
                yaxis = series.yaxis,
                leftValue = xaxis.p2c(series.datapoints.points[0] - barWidth / 2),
                rightValue = xaxis.p2c(series.datapoints.points[0] + barWidth / 2),
                zeroValue = yaxis.p2c(0),
                yValue = xaxis.p2c(series.datapoints.points[1]);

            spyOn(ctx, 'lineTo').and.callThrough();

            drawSeriesBars(series, ctx, plotOffset, plotWidth, plotHeight, null, getColorOrGradient);

            expect(ctx.lineTo.calls.argsFor(0)).toEqual([leftValue, yValue]);
            expect(ctx.lineTo.calls.argsFor(1)).toEqual([rightValue, yValue]);
            expect(ctx.lineTo.calls.argsFor(2)).toEqual([rightValue, zeroValue]);
        });

        it('should draw bars with specified color', function () {
            var fixture = setFixtures('<div id="demo-container" style="width: 800px;height: 600px">').find('#demo-container').get(0),
                placeholder = $('<div id="placeholder" style="width: 100%;height: 100%">');
            placeholder.appendTo(fixture);
            $.plot(placeholder, [[[45, 25]]], {
                series: {
                    bars: {
                        lineWidth: 1,
                        show: true,
                        fillColor: 'blue'
                    }
                },
                xaxis: { autoScale:'exact' }
            });
            var ctx = $(placeholder).find('.flot-base').get(0).getContext('2d')
                insideColor1 = getPixelColor(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2),
                insideColor2 = getPixelColor(ctx, ctx.canvas.width / 2 + 35, ctx.canvas.height / 2 - 20),
                insideColor3 =getPixelColor(ctx, ctx.canvas.width / 2 - 10, ctx.canvas.height / 2 + 30);

            expect(Array.prototype.slice.call(insideColor1)).toEqual(rgba(0,0,255,1));
            expect(Array.prototype.slice.call(insideColor2)).toEqual(rgba(0,0,255,1));
            expect(Array.prototype.slice.call(insideColor3)).toEqual(rgba(0,0,255,1));
        });

        it('should use a barWidth based on points distance', function () {
            var fixture = setFixtures('<div id="demo-container" style="width: 800px;height: 600px">').find('#demo-container').get(0),
                placeholder = $('<div id="placeholder" style="width: 100%;height: 100%">');
            placeholder.appendTo(fixture);
            var testVector = [[[[[0.1, 1], [0.2, 10]]], 0.08],
                            [[[[1, 1], [2, 10]]], 0.8],
                            [[[[10, 1], [20, 10]]], 8],
                            [[[[1000, 1], [2000, 10], [2100, 10]]], 80],
                            [[[]], 0.8],
                            [[[[-5, 1], [30, 15], [20, 7], [5, 2]]], 8]],
                plot;
            for (var i = 0; i< testVector.length; i++) {
                plot = $.plot(placeholder, testVector[i][0], {
                    series: {
                        bars: {
                            lineWidth: 1,
                            show: true,
                        }
                    },
                });

                var barWidth = plot.getData()[0].bars.barWidth[0] || plot.getData()[0].bars.barWidth;
                expect(barWidth).toBeCloseTo(testVector[i][1], 4);
            }
        });

        it('should be able to compute barWidth for NaN, Infinity and -Infinity values', function () {
            var fixture = setFixtures('<div id="test-container" style="width: 600px;height: 400px"><canvas id="theCanvas" style="width: 100%; height: 100%" /></div>'),
                placeholder = fixture.find('#test-container');
            placeholder.appendTo(fixture);

            var plot = $.plot(placeholder, [[[Infinity, 0], [0, Infinity], [10, -Infinity], [-Infinity, 10], [3, 5], [8, 2], [NaN, NaN]]], {series: series});

            var axes = plot.getAxes();

            var barWidth = plot.getData()[0].bars.barWidth[0] || plot.getData()[0].bars.barWidth;
            expect(barWidth).toEqual(1.6); // expected width will be .8 * (10 - 8)
        });
    });
});
