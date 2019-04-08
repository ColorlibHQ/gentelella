/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe('flot axis labels plugin', function() {
    var placeholder, plot;
    var options;

    beforeEach(function() {
        options = {
            xaxes: [
                { position: 'bottom', axisLabel: 'Bottom 1' },
                { position: 'top', axisLabel: 'Bottom 2', show: true },
            ],
            yaxes: [
                { position: 'left', axisLabel: 'Left' },
                { position: 'right', axisLabel: 'Right', show: true }
            ]
        };

        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
    });

    it('creates a html text node for each axis label', function () {
        plot = $.plot(placeholder, [[]], options);

        var labels$ = $('.axisLabels'),
            labels = labels$.map(function(i, label) {
                return label.textContent;
            }).get();
        expect(labels.length).toBe(4);
        expect(labels).toContain(options.xaxes[0].axisLabel);
        expect(labels).toContain(options.xaxes[1].axisLabel);
        expect(labels).toContain(options.yaxes[0].axisLabel);
        expect(labels).toContain(options.yaxes[1].axisLabel);
    });

    it('doesn`t create a html text node for each axis label when the plugin is disabled', function () {
        options.axisLabels = {
            show: false
        };
        plot = $.plot(placeholder, [[]], options);

        var labels$ = $('.axisLabels'),
            labels = labels$.map(function(i, label) {
                return label.innerText;
            }).get();
        expect(labels.length).toBe(0);
    });

    it('shrinks the drawing area to make space for the axis labels', function () {
        plot = $.plot(placeholder, [[]], options);
        var width = plot.width(),
            height = plot.height();

        options.axisLabels = {
            show: false
        };
        plot = $.plot(placeholder, [[]], options);
        var widthNoLabels = plot.width(),
            heightNoLabels = plot.height();

        expect(widthNoLabels).toBeGreaterThan(width);
        expect(heightNoLabels).toBeGreaterThan(height);
    });

    it('centers the labels of x axes horizontally', function () {
        options.xaxes[0].axisLabel = 'short label';
        options.xaxes[1].axisLabel = 'very long axis label';
        plot = $.plot(placeholder, [[]], options);

        var box1 = $('.x1Label')[0].getBoundingClientRect(),
            box2 = $('.x2Label')[0].getBoundingClientRect();
        expect((box1.left + box1.width / 2) - (box2.left + box2.width / 2)).toBeLessThan(2);
    });

    it('centers the labels of y axes vertically', function () {
        options.yaxes[0].axisLabel = 'short label';
        options.yaxes[1].axisLabel = 'very long axis label';
        plot = $.plot(placeholder, [[]], options);

        var box1 = $('.y1Label')[0].getBoundingClientRect(),
            box2 = $('.y2Label')[0].getBoundingClientRect(),
            c1 = box1.top + box1.height / 2,
            c2 = box2.top + box2.height / 2;
        // The error on the y axes can be up to 1px because of the rotation
        expect(Math.abs(c1 - c2)).toBeLessThan(2);
    });

    it('should not duplicate the labels when the data is redrawn', function () {
        plot = $.plot(placeholder, [[1, 2, 3]], options);

        var labels$ = $('.axisLabels');
        expect(labels$.length).toBe(4);

        plot.setData([[4, 5, 6]]);
        plot.setupGrid();
        plot.draw();
        labels$ = $('.axisLabels');
        expect(labels$.length).toBe(4);
    });

    it('should not duplicate the labels when the plot is recreated', function () {
        plot = $.plot(placeholder, [[1, 2, 3]], options);

        var labels$ = $('.axisLabels');
        expect(labels$.length).toBe(4);

        plot = $.plot(placeholder, [[1, 2, 3]], options);
        labels$ = $('.axisLabels');
        expect(labels$.length).toBe(4);
    });

    it('should reserve extra space when axis.boxPosition is specified', function () {
        var size = 20,
            options = {
                xaxes: [
                    { position: 'bottom', axisLabel: 'Bottom 1', boxPosition: {centerX: size, centerY: size} },
                    { position: 'bottom', axisLabel: 'Bottom 2', show: true }
                ]
            };
        plot = $.plot(placeholder, [[1, 2, 3]], options);

        var axes = plot.getXAxes();
        expect(axes[0].labelHeight).toBe(axes[1].labelHeight + size);
        expect(axes[0].labelWidth).toBe(axes[1].labelWidth + size);
    });

    it('should reserve the specified space by axis.boxPosition even if axisLabel not visible', function () {
        var size = 20,
            options = {
                yaxes: [
                    { position: 'right', boxPosition: {centerX: size, centerY: size} },
                    { position: 'right', show: true }
                ]
            };
        plot = $.plot(placeholder, [[1, 2, 3]], options);

        var axes = plot.getYAxes();
        expect(axes[0].labelHeight).toBe(axes[1].labelHeight + size);
        expect(axes[0].labelWidth).toBe(axes[1].labelWidth + size);
      });
});
