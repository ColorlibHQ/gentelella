/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe('unit tests for the inverted scale functions', function () {
    var placeholder;
    beforeEach(function () {
        placeholder = setFixtures('<div id="test-container" style="width: 800px;height: 400px">')
            .find('#test-container');
    });

    it('should have reverse linear transform set properly', function () {
        var plot = $.plot(placeholder, [[0, 1, 2, 3]], {
            xaxes: [{
                mode: 'linear',
                inverted: true,
            }]
        });
        var axis = plot.getAxes().xaxis;
        expect(axis.options.transform.name).toBe('invertedTransform');
        expect(axis.options.inverseTransform.name).toBe('invertedTransform');
    });

    it('should have inverted log transform set properly', function () {
        var plot = $.plot(placeholder, [[0, 1, 2, 3]], {
            xaxes: [{
                mode: 'log',
                inverted: true,
            }]
        });
        var axis = plot.getAxes().xaxis;
        expect(axis.options.transform.name).toBe('invertedLogTransform');
        expect(axis.options.inverseTransform.name).toBe('invertedLogInverseTransform');
    }); 
});

describe("integration tests for the inverted scale functions", function () {
    var queryPlotForYTicks = function () {
        var actualTicks = [];
    
        var yAxisDivs = $('.yAxis');
        expect(yAxisDivs.length).toBe(1);
        var childDivs = yAxisDivs.find('.tickLabel');
        childDivs.each(function (i, e) {
            actualTicks.push({
                yPos: e.y.baseVal[0].value,
                tickName: e.textContent,
            });
        });
    
        return actualTicks
            .sort(function (a, b) { return b.yPos - a.yPos })
            .map(function (a) { return a.tickName });
    };
    
    var queryPlotForXTicks = function () {
        var actualTicks = [];
    
        var xAxisDivs = $('.xAxis');
        expect(xAxisDivs.length).toBe(1);
        var childDivs = xAxisDivs.find('.tickLabel');
        childDivs.each(function (i, e) {
            actualTicks.push({
                xPos: e.x.baseVal[0].value,
                tickName: e.textContent,
            });
        });
    
        return actualTicks
            .sort(function (a, b) { return a.xPos - b.xPos })
            .map(function (a) { return a.tickName });
    };
    
    var placeholder;
    beforeEach(function () {
        placeholder = setFixtures('<div id="test-container" style="width: 800px;height: 400px">')
            .find('#test-container');
    });

    it('first tick should be max, last tick should be min for linear axis (positive data)', function () {
        const data = [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3]
        ];
        var plot = $.plot(placeholder, [data], {
            xaxis: {
                mode: 'linear',
                inverted: true,
                autoScale: 'exact'
            },
            yaxis: {
                mode: 'linear',
                inverted: true,
                autoScale: 'exact'
            }
        });
        const yTicks = queryPlotForYTicks();
        expect(yTicks[0]).toBe('3.0');
        expect(yTicks[yTicks.length - 1]).toBe('0.0');
        const xTicks = queryPlotForXTicks();
        expect(xTicks[0]).toBe('3.0');
        expect(xTicks[xTicks.length - 1]).toBe('0.0');
    });

    it('first tick should be max, last tick should be min for linear axis (negative data)', function () {
        const data = [
            [-0, -0],
            [-1, -1],
            [-2, -2],
            [-3, -3]
        ];
        var plot = $.plot(placeholder, [data], {
            xaxis: {
                mode: 'linear',
                inverted: true,
                autoScale: 'exact'
            },
            yaxis: {
                mode: 'linear',
                inverted: true,
                autoScale: 'exact'
            }
        });
        const yTicks = queryPlotForYTicks();
        expect(yTicks[0]).toBe('0.0');
        expect(yTicks[yTicks.length - 1]).toBe('-3.0');
        const xTicks = queryPlotForXTicks();
        expect(xTicks[0]).toBe('0.0');
        expect(xTicks[xTicks.length - 1]).toBe('-3.0');
    });

    it('first tick should be max, last tick should be min for log axis', function () {
        const data = [
            [0.1, 100],
            [1, 10],
            [10, 1],
            [100, 0.1]
        ];
        var plot = $.plot(placeholder, [data], {
            xaxis: {
                mode: 'log',
                inverted: true,
                autoScale: 'exact'
            },
            yaxis: {
                mode: 'log',
                inverted: true,
                autoScale: 'exact'
            }
        });
        const yTicks = queryPlotForYTicks();
        expect(yTicks[0]).toBe('100');
        expect(yTicks[yTicks.length - 1]).toBe('0.1');
        const xTicks = queryPlotForXTicks();
        expect(xTicks[0]).toBe('100');
        expect(xTicks[xTicks.length - 1]).toBe('0.1');
    });
});