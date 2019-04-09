/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe('stacking plugin', function() {
    var placeholder, plot, options;

    beforeEach(function() {
        options = {
            series: {
                stack: true,
                bars: {
                    show: true,
                    barWidth: 0.6
                }
            }
        };

        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
    });

    it('should accumulate Y values', function () {
        var testData = [[[0, 1], [1, 2], [2, 3], [3, 4]], [[0, 4], [1, 3], [2, 2], [3, 1]]];
        plot = $.plot(placeholder, testData, options);
        var series = plot.getData();
        expect(series[0].datapoints.pointsize).toBe(3);
        expect(series[1].datapoints.pointsize).toBe(3);
        var points1 = series[0].datapoints.points;
        // Bottom points should be 0
        expect(points1).toEqual([0, 1, 0, 1, 2, 0, 2, 3, 0, 3, 4, 0]);
        var points2 = series[1].datapoints.points;
        // Bottom points are first series' Y values
        expect(points2).toEqual([0, 5, 1, 1, 5, 2, 2, 5, 3, 3, 5, 4]);
    });

    it('should format data when pointsize = 2', function () {
        options.series.flatdata = true;
        var testData = [[[0, 1], [1, 2], [2, 3], [3, 4]], [[0, 4], [1, 3], [2, 2], [3, 1]]];
        plot = $.plot(placeholder, testData, options);
        var series = plot.getData();
        expect(series[0].datapoints.pointsize).toBe(3);
        expect(series[1].datapoints.pointsize).toBe(3);
        expect(series[0].datapoints.points.length).toEqual(12);
        expect(series[1].datapoints.points.length).toEqual(12);
    });
});
