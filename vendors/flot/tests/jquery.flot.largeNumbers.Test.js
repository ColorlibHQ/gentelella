describe('flot with large numbers', function() {
    var placeholder, plot;

    beforeEach(function() {
        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
    });

    describe('on linear axis', function() {
        it('should work with large negative and positive numbers', function () {
            plot = $.plot(placeholder, [[[0, 1e308], [1, -1e308]]], {});

            var yaxis = plot.getAxes().yaxis;

            expect(yaxis.max).toBeGreaterThan(1e308);
            expect(yaxis.min).toBeLessThan(-1e308);
            expect(yaxis.ticks.length).toBeGreaterThan(2);
            yaxis.ticks.forEach(function(tick) {
                expect(isFinite(tick.v)).toBe(true);
            });
        });

        it('should work with Number.MAX_VALUE and -Number.MAX_VALUE', function () {
            plot = $.plot(placeholder, [[[0, Number.MAX_VALUE], [1, -Number.MAX_VALUE]]], {});

            var yaxis = plot.getAxes().yaxis;

            expect(yaxis.ticks.length).toBeGreaterThan(2);
            yaxis.ticks.forEach(function(tick) {
                expect(isFinite(tick.v)).toBe(true);
            });
        });

        it('should work with large numbers and large navigation offsets', function () {
            plot = $.plot(placeholder, [[[0, 1e308], [1, -1e308]]], {
                yaxes: [{
                    offset: {below: -1e308, above: 1e308}
                }]
            });

            var yaxis = plot.getAxes().yaxis;

            expect(yaxis.max).toBeGreaterThan(1e308);
            expect(yaxis.min).toBeLessThan(-1e308);
            expect(yaxis.ticks.length).toBeGreaterThan(2);
            yaxis.ticks.forEach(function(tick) {
                expect(isFinite(tick.v)).toBe(true);
            });
        });
    });

    describe('on logaritmic axis', function() {
        it('should work with large positive numbers', function () {
            plot = $.plot(placeholder, [[[0, 1.1e308], [1, 0]]], {
                yaxis: {mode: 'log'}});

            var yaxis = plot.getAxes().yaxis;

            expect(yaxis.max).toBeGreaterThan(1e308);
            expect(yaxis.ticks.length).toBeGreaterThan(2);
            yaxis.ticks.forEach(function(tick) {
                expect(isFinite(tick.v)).toBe(true);
            });
        });

        it('should work with Number.MAX_VALUE', function () {
            plot = $.plot(placeholder, [[[0, Number.MAX_VALUE], [1, 0]]], {
                yaxis: {mode: 'log'}});

            var yaxis = plot.getAxes().yaxis;

            expect(yaxis.ticks.length).toBeGreaterThan(2);
            yaxis.ticks.forEach(function(tick) {
                expect(isFinite(tick.v)).toBe(true);
            });
        });

        it('should work with large numbers and large navigation offsets', function () {
            plot = $.plot(placeholder, [[[0, 1e308], [1, 0]]], {
                yaxes: [{
                    offset: {below: -1e308, above: 1e308},
                    mode: 'log'
                }]
            });

            var yaxis = plot.getAxes().yaxis;

            expect(yaxis.max).toBeGreaterThan(1e308);
            expect(yaxis.min).toEqual(0.1);
            expect(yaxis.ticks.length).toBeGreaterThan(2);
            yaxis.ticks.forEach(function(tick) {
                expect(isFinite(tick.v)).toBe(true);
            });
        });
    });
});
