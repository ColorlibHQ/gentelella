/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe("flot symbol plugin", function() {
    var placeholder, plot;
    var options;

    beforeEach(function() {
        options = {
            series: {
                shadowSize: 0, // don't draw shadows
                lines: { show: false},
                points: { show: true, fill: false, symbol: 'circle' }
            }
        };

        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
    });

    it ('provides a list of draw symbols functions', function () {
        plot = $.plot(placeholder, [[]], options);
        expect(typeof plot.drawSymbol).toBe('object');
    })

    var shapes = ['square', 'rectangle', 'diamond', 'triangle',  'cross', 'ellipse', 'plus'];
    shapes.forEach(function (shape) {
        it('should provide a way to draw ' + shape + ' shapes', function () {
            plot = $.plot(placeholder, [[]], options);

            expect(typeof plot.drawSymbol[shape]).toBe('function')
        })
    })

    shapes.forEach(function (shape) {
        it ('' + shape + ' method should be called when the point shape is ' + shape, function () {
            options.series.points.symbol = shape;
            plot = $.plot(placeholder, [[]], options);
            spyOn(plot.drawSymbol, shape).and.callThrough();

            plot.setData([[[0, 1], [1, 2]]]);
            plot.setupGrid(true);
            plot.draw();

            expect(plot.drawSymbol[shape]).toHaveBeenCalledTimes(2);
        });
    });
});
