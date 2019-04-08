/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe('fillbetween plugin', function() {
    var placeholder, plot, options, dataset;

    beforeEach(function() {
        dataset = [
            { data: [[0, 2], [1, 2], [2, 4]], lines: { show: true }, color: "rgb(255,50,50)", id: "fillToPlot" },
            { data: [[0, 3], [1, 3], [2, 1]], lines: { show: true, lineWidth: 0, fill: 0.2 }, fillBetween: "fillToPlot", color: "rgb(255,50,50)" }
        ];

        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
    });

    it('should fill between plots', function () {
        plot = $.plot(placeholder, dataset, options);
        var series = plot.getData();
        var points2 = series[1].datapoints.points;
        // second series will have 9 values instead of 6 where every third value is the first series y-value (for a particular datapoint)
        expect(points2).toEqual([0, 3, 2, 1, 3, 2, 2, 1, 4]);
    });
});
