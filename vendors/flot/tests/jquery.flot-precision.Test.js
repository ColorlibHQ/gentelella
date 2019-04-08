/* eslint-disable */
describe("unit tests for the precision of axis", function() {
    var plot;
    var placeholder;
    var sampledata = [[0, 1], [1, 1.1], [2, 1.2]];

    beforeEach(function () {
        var fixture = setFixtures('<div id="demo-container" style="width: 800px;height: 600px">').find('#demo-container').get(0);

        placeholder = $('<div id="placeholder" style="width: 100%;height: 100%">');
        placeholder.appendTo(fixture);
    });

    afterEach(function () {
        if (plot) {
            plot.shutdown();
        }
        $('#placeholder').empty();
    });

    it('should use the precision given by tickDecimals when specified', function() {
        plot = $.plot("#placeholder", [sampledata], {});

        var testVector = [
            [1, 10, 10, 3, 1],
            [1, 1.01, 10, 2, 2],
            [0.99963, 0.99964, null, 3, 3],
            [1, 1.1, 5, 1, 1],
            [1, 1.00000000000001, 10, 5, 5]
            ];

        testVector.forEach(function (t) {
            var min = t[0],
                max = t[1],
                ticks = t[2],
                tickDecimals = t[3],
                expectedValue = t[4];

            var precision = plot.computeValuePrecision(min, max, "x", ticks, tickDecimals);

            expect(precision).toEqual(expectedValue);
        });
    });

    it('should use the maximum precision when tickDecimals not specified', function() {
        plot = $.plot("#placeholder", [sampledata], {});

        var testVector = [
            [1, 10, 10, 1],
            [1, 1.01, 10, 3],
            [1, 1.1, 5, 2],
            [0.99963, 0.99964, null, 6],
            [1, 1.00000000000001, 10, 16],
            [-200000, 200000, undefined, -4]
            ];

        testVector.forEach(function (t) {
            var min = t[0],
                max = t[1],
                ticks = t[2],
                expectedValue = t[3];

            var precision = plot.computeValuePrecision(min, max, "x", ticks);

            expect(precision).toEqual(expectedValue);
        });
    });

    it('should increase precision for endpoints', function() {
        var testVector = [
            [1, 10, 10, 'linear', '1.00', '10.00'],
            [1, 100, 11, 'linear', '1.0', '100.0'],
            [-1, 1, 20, 'linear', '-1.000', '1.000'],
            [1, 1.01, 10, 'linear', '1.00000', '1.01000'],
            [99, 99.02, 10, 'linear', '99.00000', '99.02000'],
            [0.99963, 0.99964, null, 'linear', '0.99963000', '0.99964000'],
            [1, 1.00000000001, 100, 'linear', '1.00000000000000', '1.00000000001000'],
            [-2000000, 2000000, null, 'linear', '-2000000', '2000000'],
            [-2.18167311226e+21, 2.196693453e+21, null, 'linear', '-2.182e21', '2.197e21'],
            [1, 10, 10, 'log', '1.000', '10.00'],
            [1, 10000000, 10, 'log', '1.00', '10000000'],
            [0.1, 100, 11, 'log', '0.1000', '100.0'],
            [0.99963, 0.99964, null, 'log', '0.99963000', '0.99964000'],
            [1, 2000000, null, 'log', '1.00', '2000000'],
            [1.14567e-43, 1, null, 'log', '1.1e-43', '1.0'],
            [0, 1, null, 'log', '0.1000', '1.000']
            ];

        testVector.forEach(function (t) {

            plot = $.plot("#placeholder", [sampledata], {
                xaxes: [{
                    min: t[0],
                    max: t[1],
                    ticks: t[2],
                    showTickLabels : 'endpoints',
                    autoScale: "none",
                    mode: t[3]
                }]
            });

            var minExpectedValue = t[4],
                maxExpectedValue = t[5],
                xaxis = plot.getAxes().xaxis;

            expect(xaxis.ticks[0].label).toEqual(minExpectedValue);
            expect(xaxis.ticks[xaxis.ticks.length-1].label).toEqual(maxExpectedValue);

        });
    });

    describe('tickFormatter', function(){
        it('should ignore the computed precision of axis if negative', function(){
            var testVector = [[-12356285.9999, -10, '-12356286'],
                              [12356285.9999, -10, '12356286'],
                              [3.215, -1, '3'],
                              [3.215, -2, '3'],
                              [3.215, -3, '3'],
                              [3.215, -50, '3']];
            testVector.forEach(function (t) {
                plot = $.plot("#placeholder", [], {
                    xaxes: [{
                        showTickLabels : 'all',
                        }]
                    });
                var axis = plot.getXAxes()[0];
                expect($.plot.defaultTickFormatter(t[0], axis, t[1])).toEqual(t[2]);
            });
        });
        it('should show small number of decimals for numbers with e representation', function(){
            var testVector = [[0.12e-8, 1.2e-7, '1.2e-9', '1.200e-7'],
                              [1.2e+21, 12e+21, '1.20e21', '1.200e22'],
                              [1e-18, 2e-18, '1.000e-18', '2.000e-18'],
                              [1.000000001e-18, 1.99999999e-18, '1.000e-18', '2.000e-18'],
                              [0.000000000000001, 0.0000000000002, '1.0e-15', '2.000e-13']];
            testVector.forEach(function (t) {
                plot = $.plot("#placeholder", [sampledata], {
                    xaxes: [{
                        showTickLabels : 'endpoints',
                        min : t[0],
                        max : t[1],
                        autoScale : 'none'
                        }]
                    });
                var axis = plot.getXAxes()[0];
                expect(axis.ticks[0].label).toEqual(t[2]);
                expect(axis.ticks[axis.ticks.length - 1].label).toEqual(t[3]);
            });
        });
    });
});
