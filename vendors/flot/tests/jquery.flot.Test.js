describe('flot', function() {
    describe('setRange', function() {
        var placeholder, plot;

        var options = {
            series: {
                shadowSize: 0, // don't draw shadows
                lines: { show: false },
                points: { show: true, fill: false, symbol: 'circle' }
            }
        };

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('should keep the axis min and max for none autoscaling if no data is set', function () {
            options.xaxis = {autoScale: 'none', min: 0, max: 50};
            options.yaxis = {autoScale: 'none', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should swap the axis min and max for min > max', function () {
            options.xaxis = {autoScale: 'none', min: 50, max: 0};
            options.yaxis = {autoScale: 'none', min: 100, max: 0};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should keep the axis min and max for exact autoscaling if no data is set', function () {
            options.xaxis = {autoScale: 'exact', min: 0, max: 50};
            options.yaxis = {autoScale: 'exact', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should keep the axis min and max for grow-exact autoscaling if no data is set', function () {
            options.xaxis = {autoScale: 'exact', growOnly: true, min: 0, max: 50};
            options.yaxis = {autoScale: 'exact', growOnly: true, min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should keep the axis min and max for loose autoscaling if no data is set', function () {
            options.xaxis = {autoScale: 'loose', min: 0, max: 50};
            options.yaxis = {autoScale: 'loose', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should keep the axis min and max for grow-loose autoscaling if no data is set', function () {
            options.xaxis = {autoScale: 'loose', growOnly: true, min: 0, max: 50};
            options.yaxis = {autoScale: 'loose', growOnly: true, min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should keep the axis min and max for window autoscaling if no data is set', function () {
            options.xaxis = {autoScale: 'sliding-window', min: 0, max: 50};
            options.yaxis = {autoScale: 'sliding-window', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should not shift the axis min and max for window autoscaling if data is in window', function () {
            options.xaxis = {autoScale: 'sliding-window', min: 0, max: 10};
            options.yaxis = {autoScale: 'sliding-window', min: 0, max: 10};
            // default window size is 100
            plot = $.plot(placeholder, [[]], options);
            plot.setData([[[0, 0], [50, 50], [100, 100]]]);
            plot.setupGrid(true);
            plot.draw();
            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(100);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should shift the axis min and max for window autoscaling if data is bigger than window', function () {
            options.xaxis = {autoScale: 'sliding-window', min: 0, max: 10};
            options.yaxis = {autoScale: 'sliding-window', min: 0, max: 10};
            // default window size is 100
            plot = $.plot(placeholder, [[]], options);
            plot.setData([[[0, 0], [100, 100], [200, 200]]]);
            plot.setupGrid(true);
            plot.draw();
            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(100);
            expect(axes.xaxis.max).toBe(200);
            expect(axes.yaxis.min).toBe(100);
            expect(axes.yaxis.max).toBe(200);
        });

        it('should widen the axis max if axis min is the same as axis max', function () {
            options.xaxis = {min: 0, max: 0};
            options.yaxis = {min: 2, max: 2};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(1);
            expect(axes.yaxis.min).toBe(2);
            expect(axes.yaxis.max).toBe(2.01);
        });

        it('should widen the axis min and max if both are null', function () {
            options.xaxis = {};
            options.yaxis = {};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(-0.01);
            expect(axes.xaxis.max).toBe(0.01);
            expect(axes.yaxis.min).toBe(-0.01);
            expect(axes.yaxis.max).toBe(0.01);
        });

        it('should widen the axis min if is null', function () {
            options.xaxis = {max: 1};
            options.yaxis = {max: 0};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(-1);
            expect(axes.xaxis.max).toBe(1);
            expect(axes.yaxis.min).toBe(-1);
            expect(axes.yaxis.max).toBe(0);
        });

        it('should not change the axis min and max for none autoscaling if data is set', function () {
            options.xaxis = {autoScale: 'none', min: 0, max: 50};
            options.yaxis = {autoScale: 'none', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();
            plot.setData([[[0, 1], [1, 2]]]);
            plot.setupGrid(true);
            plot.draw();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should change the axis min and max for exact autoscaling if data is set', function () {
            options.xaxis = {autoScale: 'exact', min: 0, max: 50};
            options.yaxis = {autoScale: 'exact', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();
            plot.setData([[[0, 1], [1, 2]]]);
            plot.setupGrid(true);
            plot.draw();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(1);
            expect(axes.yaxis.min).toBe(1);
            expect(axes.yaxis.max).toBe(2);
        });

        it('should change the axis min and max for loose autoscaling if data is set', function () {
            options.xaxis = {autoScale: 'loose', min: 0, max: 50};
            options.yaxis = {autoScale: 'loose', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();
            plot.setData([[[-0.2, -15], [10, 100]]]);
            plot.setupGrid(true);
            plot.draw();

            expect(axes.xaxis.min).toBe(-1);
            expect(axes.xaxis.max).toBe(11);
            expect(axes.yaxis.min).toBe(-20);
            expect(axes.yaxis.max).toBe(120);
        });

        it('should keep the axis min 0 for loose autoscaling if all values are positive', function () {
            options.xaxis = {autoScale: 'loose', min: 0, max: 50};
            options.yaxis = {autoScale: 'loose', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();
            plot.setData([[[0, 0.1], [10, 100]]]);
            plot.setupGrid(true);
            plot.draw();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.yaxis.min).toBe(0);
        });

        it('should ignore NaN, Infinity and -Infinity values', function () {
            options.xaxis = {autoScale: 'exact'};
            options.yaxis = {autoScale: 'exact'};
            plot = $.plot(placeholder, [[[Infinity, 0], [NaN, NaN], [0, Infinity], [10, -Infinity], [-Infinity, 10], [3, 5], [8, 2]]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(10);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(10);
        });
    });

    describe('computeRangeForDataSeries', function() {
        var placeholder, plot;

        var options = {
            series: {
                shadowSize: 0, // don't draw shadows
                lines: { show: false },
                points: { show: true, fill: false, symbol: 'circle' }
            }
        };

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('should return Infinity and -Infinity for the minimum and the maximum respectively of x and y for an empty series', function () {
            plot = $.plot(placeholder, [[]], options);

            var series = plot.getData();
            var limits = plot.computeRangeForDataSeries(series[0]);

            expect(limits.xmin).toBe(Infinity);
            expect(limits.xmax).toBe(-Infinity);
            expect(limits.ymin).toBe(Infinity);
            expect(limits.ymax).toBe(-Infinity);
        });

        it('should return the minimum and the maximum of x and y for a series', function () {
            plot = $.plot(placeholder, [[[0, 1], [1, 2], [2, 3]]], options);

            var series = plot.getData();
            var limits = plot.computeRangeForDataSeries(series[0]);

            expect(limits.xmin).toBe(0);
            expect(limits.xmax).toBe(2);
            expect(limits.ymin).toBe(1);
            expect(limits.ymax).toBe(3);
        });

        it('should return the minimum and the maximum of x and y for an xy series', function () {
            plot = $.plot(placeholder, [[[10, 1], [11, 2], [12, 3]]], options);

            var series = plot.getData();
            var limits = plot.computeRangeForDataSeries(series[0]);

            expect(limits.xmin).toBe(10);
            expect(limits.xmax).toBe(12);
            expect(limits.ymin).toBe(1);
            expect(limits.ymax).toBe(3);
        });

        it('should not compute the minimum and the maximum when autoScale="none"', function () {
            options.xaxis = {autoScale: 'none'};
            options.yaxis = {autoScale: 'none'};
            plot = $.plot(placeholder, [[[0, 1], [1, 2], [2, 3]]], options);

            var series = plot.getData();
            var limits = plot.computeRangeForDataSeries(series[0]);

            expect(limits.xmin).toBe(Infinity);
            expect(limits.xmax).toBe(-Infinity);
            expect(limits.ymin).toBe(Infinity);
            expect(limits.ymax).toBe(-Infinity);
        });

        it('should compute the minimum and the maximum when autoScale="none" and force=true', function () {
            options.xaxis = {autoScale: 'none'};
            options.yaxis = {autoScale: 'none'};
            plot = $.plot(placeholder, [[[0, 1], [1, 2], [2, 3]]], options);

            var series = plot.getData();
            var limits = plot.computeRangeForDataSeries(series[0], true);

            expect(limits.xmin).toBe(0);
            expect(limits.xmax).toBe(2);
            expect(limits.ymin).toBe(1);
            expect(limits.ymax).toBe(3);
        });
    });

    describe('adjustSeriesDataRange', function() {
        var placeholder, plot;

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
            plot = $.plot(placeholder, [[]], {});
        });

        it('should set the minimum to zero if needed when {lines|bars}.show=true and {lines|bars}.zero=true', function () {
            [true, false].forEach(function(show) {
                var series = {
                        lines: { show: show, zero: show },
                        bars: { show: !show, zero: !show, barWidth: 0.8 },
                        datapoints: { pointsize: 1 }
                    },
                    limits = {xmin: 10, ymin: 11, xmax: 12, ymax: 13};

                limits = plot.adjustSeriesDataRange(series, limits);

                expect(limits.ymin).toBe(0);
                expect(limits.ymax).toBe(13);
            });
        });

        it('should set the maximum to zero if needed when {lines|bars}.show=true and {lines|bars}.zero=true', function () {
            [true, false].forEach(function(show) {
                var series = {
                        lines: { show: show, zero: show },
                        bars: { show: !show, zero: !show, barWidth: 0.8 },
                        datapoints: { pointsize: 1 }
                    },
                    limits = {xmin: 10, ymin: -11, xmax: 12, ymax: -9};

                limits = plot.adjustSeriesDataRange(series, limits);

                expect(limits.ymin).toBe(-11);
                expect(limits.ymax).toBe(0);
            });
        });

        it('should not change the limits of the y when {lines|bars}.show=true, {lines|bars}.zero=true, but datapoints.pointsize>2', function () {
            [true, false].forEach(function(show) {
                var series = {
                        lines: { show: show, zero: show },
                        bars: { show: !show, zero: !show, barWidth: 0.8 },
                        datapoints: { pointsize: 3 }
                    },
                    limits = {xmin: 10, ymin: -11, xmax: 12, ymax: -9};

                limits = plot.adjustSeriesDataRange(series, limits);

                expect(limits.ymin).toBe(-11);
                expect(limits.ymax).toBe(-9);
            });
        });

        it('should change the limits of x to fit the width of the bars', function () {
            var series = {
                    lines: { show: false },
                    bars: { show: true, align: 'center', barWidth: 6 }
                },
                limits = {xmin: 10, ymin: 11, xmax: 12, ymax: 13};

            limits = plot.adjustSeriesDataRange(series, limits);

            expect(limits.xmin).toBe(10 - 6 / 2);
            expect(limits.xmax).toBe(12 + 6 / 2);
        });

        it('should change the limits of x to reserve only the needed space given by width of the bars', function () {
            var series = {
                    lines: { show: false },
                    bars: { show: true, align: 'center', barWidth: 6 },
                    datapoints: {points: [0.1, 1, 0.2, 10], pointsize: 2}
                },
                limits = {xmin: 10, ymin: 11, xmax: 12, ymax: 13};

            limits = plot.adjustSeriesDataRange(series, limits);

            expect(limits.xmin).toBeCloseTo(10 - ((0.1 * 6) / 2));
            expect(limits.xmax).toBeCloseTo(12 - ((0.1 * 6) / 2) + (0.1 * 6));
        });
    });

    describe('findNearbyItem', function() {
        var placeholder, plot, sampledata = [[0, 1], [1, 1.1], [2, 1.2]];

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('should be able to find the nearest point to the given coordinates', function() {
            plot = $.plot(placeholder, [sampledata], {});
            var item = plot.findNearbyItem(0, 0, function() {
                return true;
            }, Number.MAX_VALUE);
            expect(item.datapoint[0]).toEqual(sampledata[0][0]);
            expect(item.datapoint[1]).toEqual(sampledata[0][1]);
            expect(item.dataIndex).toEqual(0);
        });

        it('should be able to search in a certain radius', function() {
            plot = $.plot(placeholder, [sampledata], {});
            var item = plot.findNearbyItem(0, 0, function() {
                return true;
            }, 1);
            expect(item).toEqual(null);

            item = plot.findNearbyItem(0, 0, function() {
                return true;
            }, 1000);
            expect(item).not.toEqual(null);
        });

        it('should work for bars', function() {
            plot = $.plot(placeholder, [sampledata], {
                bars: {show: true}
            });

            item = plot.findNearbyItem(0, 0, function() {
                return true;
            }, 1000);
            expect(item).not.toEqual(null);
        });
    });

    describe('findNearbyInterpolationPoint', function() {
        var placeholder, plot, sampledata = [[0, 1], [1, 1.1], [2, 1.2]];

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('should be able to find the nearest point to the given coordinates', function() {
            plot = $.plot(placeholder, [sampledata], {});
            var item = plot.findNearbyInterpolationPoint(0, 0, function() {
                return true;
            });
            expect(item.datapoint[0]).toEqual(sampledata[0][0]);
            expect(item.datapoint[1]).toEqual(sampledata[0][1]);
        });

        it('should interpolate the intersections properly with linear scales', function() {
            plot = $.plot(placeholder, [sampledata], {});
            var item = plot.findNearbyInterpolationPoint(0.5, 0, function() {
                return true;
            });
            var expectedY = sampledata[0][1] + (sampledata[1][1] - sampledata[0][1]) / 2;

            expect(item.datapoint[0]).toEqual(0.5);
            expect(item.datapoint[1]).toEqual(expectedY);
        });

        it('should return the interpolation with the closest point for multiple series', function() {
            plot = $.plot(placeholder, [[[-10, 0], [10, 1], [100, 2]], [[5, 0], [20, 1], [21, 2]], [[0, 0], [2, 1], [4, 2]]], {});
            var item = plot.findNearbyInterpolationPoint(1, 1, function() {
                return true;
            });
            var expectedY = 0 + (1 - 0) / 2;

            expect(item.datapoint[0]).toEqual(1);
            expect(item.datapoint[1]).toEqual(expectedY);
        });

        it('should interpolate correctly if data comes in reverse order', function () {
            const reversedData = [[4, 1.4], [3, 1.3], [2, 1.2], [1, 1.1], [0, 1.0], [-1, 0.9]];

            plot = $.plot(placeholder, [reversedData], {});
            var point1 = plot.findNearbyInterpolationPoint(0.5, 0, function() {
                return true;
            });

            expect(point1.datapoint[0]).toEqual(0.5);
            expect(point1.datapoint[1]).toEqual(1.05);

            var point2 = plot.findNearbyInterpolationPoint(2.25, 0, function () {
                return true;
            });

            expect(point2.datapoint[0]).toEqual(2.25);
            expect(point2.datapoint[1]).toEqual(1.225);

            var point3 = plot.findNearbyInterpolationPoint(-0.5, 0, function () {
                return true;
            });

            expect(point3.datapoint[0]).toEqual(-0.5);
            expect(point3.datapoint[1]).toEqual(0.95);
        });

        it('should return null for empty dataseries', function() {
            plot = $.plot(placeholder, [], {});
            var item = plot.findNearbyInterpolationPoint(0.5, 0, function() {
                return true;
            });

            expect(item).toEqual(null);
        });

        it('for a dataserie with a single point should return null', function() {
            plot = $.plot(placeholder, [[[1, 2]]], {});
            var item = plot.findNearbyInterpolationPoint(0, 0, function() {
                return true;
            });

            expect(item).toEqual(null);
        });

        it('should return null if below the data bounds', function () {
            plot = $.plot(placeholder, [[[-10, 0], [10, 1], [100, 2]]], {});
            var item = plot.findNearbyInterpolationPoint(-20, 1, function() {
                return true;
            });

            expect(item).toBe(null);
        });

        it('should return null if above the data bounds', function () {
            plot = $.plot(placeholder, [[[-10, 0], [10, 1], [100, 2]]], {});
            var item = plot.findNearbyInterpolationPoint(120, 1, function() {
                return true;
            });

            expect(item).toBe(null);
        });
    });

    describe('setupTickFormatter', function() {
        var placeholder, plot, sampledata = [[0, 1], [1, 1.1], [2, 1.2]];

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('should set a default tick formatter to each default axis', function () {
            plot = $.plot(placeholder, [sampledata], { });

            plot.getXAxes().concat(plot.getYAxes()).forEach(function(axis) {
                expect(typeof axis.tickFormatter).toBe('function');
            });
        });

        it('should set a default tick formatter to each specified axis', function () {
            plot = $.plot(placeholder, [sampledata], {
                xaxis: { autoScale: 'exact' },
                yaxes: [
                    { autoScale: 'exact' },
                    { autoScale: 'none', min: -1, max: 1 }
                ]
            });

            plot.getXAxes().concat(plot.getYAxes()).forEach(function(axis) {
                expect(typeof axis.tickFormatter).toBe('function');
            });
        });

        it('should set and use the specified tick formatter', function () {
            var formatters = [
                jasmine.createSpy('formatter'),
                jasmine.createSpy('formatter'),
                jasmine.createSpy('formatter')
            ];
            plot = $.plot(placeholder, [sampledata], {
                xaxis: { autoScale: 'exact', tickFormatter: formatters[0] },
                yaxes: [
                    { autoScale: 'exact', tickFormatter: formatters[1] },
                    { autoScale: 'none', min: -1, max: 1, tickFormatter: formatters[2], show: true }
                ]
            });

            formatters.forEach(function(formatter) {
                expect(formatter).toHaveBeenCalled();
            });
        });

        it('should leave the formatter set to the axis unchanged when updating the plot', function () {
            var formatter = jasmine.createSpy('formatter');
            plot = $.plot(placeholder, [sampledata], { });

            // the absolute/relative time plugin is setting the tickFormatter
            //directly to the axes just like here:
            plot.getXAxes()[0].tickFormatter = formatter;

            plot.setData([sampledata, sampledata]);
            plot.setupGrid();
            plot.draw();

            expect(plot.getXAxes()[0].tickFormatter).toBe(formatter);
        });
    });

    describe('computeTickSize', function() {
        var placeholder;
        var plot;
        var sampledata = [[0, 1], [1, 1.1], [2, 1.2]];

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('should return the correct size', function () {
            plot = $.plot(placeholder, [sampledata], {});

            var testVector = [
                [1, 10, 10, 1],
                [1, 1.01, 10, 0.001],
                [0.99963, 0.99964, 5, 0.000002],
                [1, 1.1, 5, 0.02],
                [0, 10000, 5, 2000],
                [0, 10, 4, 2.5],
                [0, 750, 10, 100],
                [0, 740, 10, 50]
            ];

            testVector.forEach(function (t) {
                var min = t[0],
                    max = t[1],
                    ticks = t[2],
                    expectedValue = t[3],
                    size = plot.computeTickSize(min, max, ticks);

                expect(size).toEqual(expectedValue);
            });
        });

        it('should depend on tickDecimals when specified', function() {
            plot = $.plot(placeholder, [sampledata], {});

            var testVector = [
                [1, 10, 10, 3, 1],
                [1, 1.01, 10, 2, 0.01],
                [0.99963, 0.99964, 5, 3, 0.001],
                [1, 1.1, 5, 1, 0.1],
                [0, 10000, 5, 1, 2000],
                [1, 1.00000000000001, 10, 5, 0.00001],
                [0, 10, 4, 0, 2],
                [0, 750, 10, 1, 100],
                [0, 740, 10, 10, 50],
                [0, 1000, 4, 2, 250]
            ];

            testVector.forEach(function(t) {
                var min = t[0],
                    max = t[1],
                    ticks = t[2],
                    tickDecimals = t[3],
                    expectedValue = t[4];

                var size = plot.computeTickSize(min, max, ticks, tickDecimals);

                expect(size).toEqual(expectedValue);
            });
        });
    });

    describe('defaultTickGenerator', function() {
        var placeholder;

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('works for the maximum axis interval', function () {
            var plot = $.plot(placeholder, [[[0, -Number.MAX_VALUE], [1, Number.MAX_VALUE]]], {});

            var yaxis = plot.getYAxes()[0];

            expect(yaxis.ticks).not.toEqual([]);
        });
    });

    describe('drawAxisLabels', function() {
        var placeholder, sampledata = [[1.1e18, 0.1], [1.2e18, 5.1], [1.3e18, 10.1]];

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('should draw no tick labels when showTickLabels = none', function () {
            $.plot(placeholder, [sampledata], {
                xaxis: {
                    autoScale: 'loose',
                    showTickLabels: 'none'
                }
            });

            var tickLabels = xTickLabels(placeholder);

            expect(tickLabels.length).toBe(0);
        });

        it('should draw two tick labels when showTickLabels = endpoints', function () {
            $.plot(placeholder, [sampledata], {
                xaxis: {
                    autoScale: 'loose',
                    showTickLabels: 'endpoints'
                }
            });

            var tickLabels = xTickLabels(placeholder);

            expect(tickLabels.length).toBe(2);
        });

        it('should draw multiple tick labels when showTickLabels = all', function () {
            $.plot(placeholder, [sampledata], {
                xaxis: {
                    autoScale: 'loose',
                    showTickLabels: 'all'
                }
            });

            var tickLabels = xTickLabels(placeholder);

            expect(tickLabels.length).toBeGreaterThan(2);
        });

        ['major', 'endpoints', 'all'].forEach(function(showTickLabels) {
            it('should not overlap the tick labels when the values are large and showTickLabels = ' + showTickLabels, function () {
                $.plot(placeholder, [sampledata], {
                    xaxis: {
                        autoScale: 'exact',
                        showTickLabels: showTickLabels
                    }
                });

                var tickLabelBoxes = xTickLabelBoxes(placeholder),
                    overlaps = tickLabelBoxes.some(function(b1) {
                        return tickLabelBoxes.some(function(b2) {
                            return b1 !== b2 && overlapping(b1, b2);
                        });
                    });

                expect(overlaps).toBe(false);
            });
        });

        function xTickLabels(placeholder) {
            var labels$ = placeholder.find('.flot-x-axis').find('.flot-tick-label'),
                labels = labels$.map(function(i, label) {
                    return label.textContent;
                }).get();
            return labels;
        }

        function xTickLabelBoxes(placeholder) {
            var labels$ = placeholder.find('.flot-x-axis').find('.flot-tick-label'),
                boxes = labels$.map(function(i, label) {
                    var label$ = $(label),
                        pos = label$.position();
                    return {
                        x1: pos.left, y1: pos.top, x2: label$.outerWidth() + pos.left, y2: label$.outerHeight() + pos.top
                    };
                }).get();
            return boxes;
        }

        overlapping = function(b1, b2) {
            return (b1.x1 <= b2.x1 && b2.x1 <= b1.x2) || (b2.x1 <= b1.x1 && b1.x1 <= b2.x2);
        }

        describe('for bars', function() {
            it('should not show x axis endpoints for bars with showTickLabels = all', function() {
                var plot = $.plot(placeholder, [[[-3, 1], [30, 15], [20, 7], [5, 2]]], {
                    xaxis: {
                        autoScale: 'exact',
                        showTickLabels: 'all'
                    },
                    yaxis: {
                        autoScale: 'exact',
                        showTickLabels: 'all'
                    },
                    series: {
                        bars: {
                            lineWidth: 1,
                            show: true,
                            fillColor: 'blue',
                            barWidth: 0.8
                        }
                    }
                });

                var xaxis = plot.getXAxes()[0],
                    yaxis = plot.getYAxes()[0],
                    ticks = xaxis.ticks;
                expect(xaxis.min).not.toEqual(ticks[0].v);
                expect(xaxis.max).not.toEqual(ticks[ticks.length - 1].v);
                ticks = yaxis.ticks;
                expect(yaxis.min).toEqual(ticks[0].v);
                expect(yaxis.max).toEqual(ticks[ticks.length - 1].v);
            });

            it('should show endpoints for multiple series type where showTickLabels = all', function() {
                var plot = $.plot(placeholder, [{
                    data: [[-3, 2], [20, 15], [4, 5]],
                    lines: { show: true, fill: true }
                }, {
                    data: [[-3, 1], [30, 15], [20, 7], [5, 2]],
                    bars: { show: true }
                }, {
                    data: [[-1, 1], [30, 10], [20, 7], [6, 3]],
                    points: { show: true }
                }], {
                    xaxis: {
                        autoScale: 'exact',
                        showTickLabels: 'all'
                    }});

                var xaxis = plot.getXAxes()[0],
                    ticks = xaxis.ticks;
                expect(xaxis.min).toEqual(ticks[0].v);
                expect(xaxis.max).toEqual(ticks[ticks.length - 1].v);
            });
        });
    });

    describe('decimation', function () {
        var placeholder;

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('calls the "decimate" function of data series when the plot type is line', function () {
            var expected = [1, 2, 3, 3];
            var decimate = jasmine.createSpy('decimate').and.returnValue(expected);
            var data = [{data: [], decimate: decimate}];

            $.plot(placeholder, data, {series: {lines: {show: true}}});

            expect(decimate).toHaveBeenCalled();
        });

        it('calls the "decimatePoints" function of data series when the plot type is points', function () {
            var expected = [1, 2, 3, 3];
            var decimatePoints = jasmine.createSpy('decimate').and.returnValue(expected);
            var data = [{data: [], decimatePoints: decimatePoints}];

            $.plot(placeholder, data, {series: {lines: {show: false}, points: {show: true}}});

            expect(decimatePoints).toHaveBeenCalled();
        });

        it('calls the "decimate" function of data series when the plot type is bars', function () {
            var expected = [1, 2, 3, 3];
            var decimateBars = jasmine.createSpy('decimate').and.returnValue(expected);
            var data = [{data: [], decimate: decimateBars}];

            $.plot(placeholder, data, {series: {lines: {show: false}, bars: {show: true}}});

            expect(decimateBars).toHaveBeenCalled();
        });
    });

    describe('setData', function () {
        var placeholder;
        var data = [[[1, 2], [3, 4]]];

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('stores data in the internal buffer', function () {
            var expected = [1, 2, 3, 4];

            var plot = $.plot(placeholder, [], {});
            plot.setData(data);

            var series = plot.getData();
            expect(series.length).toEqual(1);
            expect(series[0].data).toEqual(data[0]);
            expect(series[0].datapoints.points).toEqual(expected);
            expect(series[0].datapoints.pointsize).toEqual(2);
        });

        it('reuses the internal buffer', function () {
            var plot = $.plot(placeholder, [[]], {});
            var buffer = plot.getData()[0].datapoints.points;

            plot.setData(data);

            expect(plot.getData()[0].datapoints.points).toBe(buffer);
        });

        it('expands the internal buffer as neccessary', function () {
            var plot = $.plot(placeholder, [[[3, 4]]], {});
            expect(plot.getData()[0].datapoints.points.length).toBe(2);

            plot.setData(data);
            expect(plot.getData()[0].datapoints.points.length).toBe(4);
        });

        it('shrinks the internal buffer as neccessary', function () {
            var plot = $.plot(placeholder, [[[3, 4], [5, 6], [6, 7], [8, 9]]], {});
            expect(plot.getData()[0].datapoints.points.length).toBe(8);

            plot.setData(data);
            expect(plot.getData()[0].datapoints.points.length).toBe(4);
        });
    });

    describe('draw axis', function() {
        var placeholder;

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        ['left', 'right'].forEach(function(axisPosition) {
            it('should draw ' + axisPosition + ' y axis next to plot', function() {
                var testVector = [
                    [200000000000, 4000000000000],
                    [200000000000000, 400000000000000],
                    [20000000000000000, 40000000000000000],
                    [200000000000000000, 400000000000000000],
                    [2000000000000000000, 4000000000000000000],
                    [200000000000000000000, 400000000000000000000],
                    [20000000000000000000000, 40000000000000000000000]];

                testVector.forEach(function (testValue) {
                    var plot = $.plot(placeholder, [[1, 2, 3]], {
                        xaxis: {
                            autoScale: 'none',
                            min: testValue[0],
                            max: testValue[1],
                            showTickLabels: 'all'
                        },
                        yaxis: {
                            position: axisPosition
                        }});

                    var yaxis = plot.getYAxes()[0];

                    if (axisPosition === 'left') {
                        expect(yaxis.box.left + yaxis.box.width).toBeCloseTo(plot.getPlotOffset().left, -1);
                    } else {
                        expect(yaxis.box.left).toBeCloseTo(plot.getPlotOffset().left + plot.width(), -1);
                    }
                });
            });
        });

        ['top', 'bottom'].forEach(function(axisPosition) {
            it('should draw ' + axisPosition + ' x axis next to plot', function() {
                var testVector = [20, 28, 36, 44, 52, 60, 68, 76, 84];

                testVector.forEach(function (fontSize) {
                    var plot = $.plot(placeholder, [[1, 2, 3]], {
                        xaxis: {
                            position: axisPosition
                        },
                        yaxis: {
                            font: {
                                size: fontSize
                            }
                        }});

                    var xaxis = plot.getXAxes()[0];

                    if (axisPosition === 'top') {
                        expect(xaxis.box.top + xaxis.box.height).toBeCloseTo(plot.getPlotOffset().top, -1);
                    } else {
                        expect(xaxis.box.top).toBeCloseTo(plot.getPlotOffset().top + plot.height(), -1);
                    }
                });
            });
        });

        it('should draw y axis next to plot for multiple axis on the same side', function() {
            var testVector = [
                [200000000000, 4000000000000],
                [200000000000000, 400000000000000],
                [20000000000000000, 40000000000000000],
                [200000000000000000, 400000000000000000],
                [2000000000000000000, 4000000000000000000],
                [200000000000000000000, 400000000000000000000],
                [20000000000000000000000, 40000000000000000000000]];

            testVector.forEach(function (testValue) {
                var plot = $.plot(placeholder, [[1, 2, 3]], {
                    xaxis: {
                        autoScale: 'none',
                        min: testValue[0],
                        max: testValue[1],
                        showTickLabels: 'all',
                        font: {
                            size: 48
                        }
                    },
                    yaxes: [{
                        position: 'left',
                        show: true
                    }, {
                        position: 'left',
                        show: true
                    }, {
                        position: 'left',
                        show: true
                    }]});

                var yaxis = plot.getYAxes()[0];

                expect(yaxis.box.left + yaxis.box.width).toBeCloseTo(plot.getPlotOffset().left, -1);
            });
        });
    });

    describe('Grid margin', function() {
        var placeholder, placeholder2, fixtures;

        beforeEach(function() {
            fixtures = setFixtures('<div id="test-container" style="width: 600px;height: 400px"/>' +
                '<div id="test-container2" style="width: 600px;height: 400px"/>');
            placeholder = fixtures.find('#test-container');
            placeholder2 = fixtures.find('#test-container2');
        });

        it('should change plot dimensions', function() {
            var testVector = [
                [-20, 0, 0, 0],
                [20, 0, 0, 0],
                [20, -20, 0, 0],
                [-20, -20, 0, 0],
                [-20, 20, 0, 0],
                [20, 20, 0, 0],
                [0, 0, -20, 0],
                [0, 0, 20, 0],
                [0, 0, -20, 20],
                [0, 0, -20, -20],
                [0, 0, 20, 20],
                [0, 0, 20, -20],
                [20, 20, 20, 20],
                [-20, -20, -20, -20]
            ];

            testVector.forEach(function (testValue) {
                var plot1 = $.plot(placeholder, [[]], {}),
                    plot2 = $.plot(placeholder2, [[]], {
                        grid: { margin: {
                            left: testValue[0],
                            right: testValue[1],
                            top: testValue[2],
                            bottom: testValue[3]
                        }}});

                expect(plot2.width()).toBe(plot1.width() - testValue[0] - testValue[1]);
                expect(plot2.height()).toBe(plot1.height() - testValue[2] - testValue[3]);
            });
        });

        it('should move the axis according to grid margin', function() {
            var testVector = [
                [-20, 0, 0, 0],
                [20, 0, 0, 0],
                [20, -20, 0, 0],
                [-20, -20, 0, 0],
                [-20, 20, 0, 0],
                [20, 20, 0, 0],
                [0, 0, -20, 0],
                [0, 0, 20, 0],
                [0, 0, -20, 20],
                [0, 0, -20, -20],
                [0, 0, 20, 20],
                [0, 0, 20, -20],
                [20, 20, 20, 20],
                [-20, -20, -20, -20]
            ];

            testVector.forEach(function (testValue) {
                var plot1 = $.plot(placeholder, [[]], {
                        xaxes: [{
                            position: 'bottom',
                            show: true
                        }, {
                            position: 'top',
                            show: true
                        }],
                        yaxes: [{
                            position: 'left',
                            show: true
                        }, {
                            position: 'right',
                            show: true
                        }]
                    }),
                    plot2 = $.plot(placeholder2, [[]], {
                        xaxes: [{
                            position: 'bottom',
                            show: true
                        }, {
                            position: 'top',
                            show: true
                        }],
                        yaxes: [{
                            position: 'left',
                            show: true
                        }, {
                            position: 'right',
                            show: true
                        }],
                        grid: { margin: {
                            left: testValue[0],
                            right: testValue[1],
                            top: testValue[2],
                            bottom: testValue[3]
                        }}});

                var yaxis1 = plot1.getYAxes()[0],
                    yaxis2 = plot2.getYAxes()[0];
                expect(yaxis1.box.left + testValue[0]).toEqual(yaxis2.box.left);

                yaxis1 = plot1.getYAxes()[1];
                yaxis2 = plot2.getYAxes()[1];
                expect(yaxis1.box.left - testValue[1]).toEqual(yaxis2.box.left);

                var xaxis1 = plot1.getXAxes()[0],
                    xaxis2 = plot2.getXAxes()[0];
                expect(xaxis1.box.top - testValue[3]).toEqual(xaxis2.box.top);

                xaxis1 = plot1.getXAxes()[1];
                xaxis2 = plot2.getXAxes()[1];
                expect(xaxis1.box.top + testValue[2]).toEqual(xaxis2.box.top);
            });
        });

        it('should work for margin: number', function() {
            var plot1 = $.plot(placeholder, [[]], {}),
                plot2 = $.plot(placeholder2, [[]], {
                    grid: { margin: 20 }
                });

            expect(plot2.width()).toBe(plot1.width() - 20 - 20);
            expect(plot2.height()).toBe(plot1.height() - 20 - 20);
        });
    });
});
