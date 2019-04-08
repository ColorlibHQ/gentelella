/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe("flatdata plugin", function() {
    var placeholder, plot;
    var options = {
        series: {
            shadowSize: 0, // don't draw shadows
            lines: { show: false},
            points: { show: true, fill: false, symbol: 'circle' }
        }
    };

    beforeEach(function() {
        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
    });

    it('registers an init hook', function () {
        var flatdata = $.plot.plugins.find(function(plugin) { return plugin.name === 'flatdata'; });
        expect(flatdata).toBeTruthy();
        expect(flatdata.init).toBeTruthy();
    });

    it('writes the x and y values into a single 1D array when the plugin is activated', function () {
        options.series.flatdata = true;
        plot = $.plot(placeholder, [[10, 20, 30]], options);

        var points = plot.getData()[0].datapoints.points;
        expect(points[0]).toBe(0);
        expect(points[1]).toBe(10);
        expect(points[2]).toBe(1);
        expect(points[3]).toBe(20);
        expect(points[4]).toBe(2);
        expect(points[5]).toBe(30);
    });

    it('works for empty data', function () {
        options.series.flatdata = true;
        plot = $.plot(placeholder, [[]], options);

        var datapoints = plot.getData()[0].datapoints;
        expect(datapoints.points.length).toBe(0);
    });

});
