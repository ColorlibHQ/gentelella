describe("flot hover plugin", function () {
    var placeholder, plot, options;

    var rgba = window.colors.rgba;
    var getEntireCanvasData = window.colors.getEntireCanvasData;
    var canvasData = window.colors.canvasData;

    beforeEach(function () {
        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
        options = {
            grid: { hoverable: true, clickable: true },
            pan: { enableTouch: true, active: true },
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: false
                }
            }
        };

        jasmine.clock().install().mockDate();

        jasmine.addMatchers(window.colors.jasmineMatchers);
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    describe('touch hover', function() {
        it('tap on plot triggers plothover event', function() {
            plot = $.plot(placeholder, [ [ [0, 0], [10, 10] ] ], options);

            var eventHolder = plot.getEventHolder(),
                axisx = plot.getXAxes()[0],
                axisy = plot.getYAxes()[0],
                coords = [{x: axisx.p2c(0.5), y: axisy.p2c(-3.5)}],
                spy = jasmine.createSpy('spy');

            $(plot.getPlaceholder()).on('plothover', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');
            jasmine.clock().tick(50);
            simulate.sendTouchEvents(coords, eventHolder, 'touchend');

            expect(spy).toHaveBeenCalled();
            expect(spy.calls.count()).toBe(1);
        });

        it('pan plot triggers plothovercleanup event', function() {
            plot = $.plot(placeholder, [ [ [0, 0], [10, 10] ] ], options);

            var eventHolder = plot.getEventHolder(),
                axisx = plot.getXAxes()[0],
                axisy = plot.getYAxes()[0],
                coords = [{x: axisx.p2c(0.5), y: axisy.p2c(-3.5)}],
                spy = jasmine.createSpy('spy');

            $(plot.getPlaceholder()).on('plothovercleanup', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');

            expect(spy).toHaveBeenCalled();
            expect(spy.calls.count()).toBe(1);
        });

        it('set data to the plot triggers plothovercleanup event', function() {
            plot = $.plot(placeholder, [ [ [0, 0], [10, 10] ] ], options);

            var spy = jasmine.createSpy('spy');

            $(plot.getPlaceholder()).on('plothovercleanup', spy);

            plot.setData([1, 2, 3, 4]);

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('mouse hover', function() {
        beforeEach(function() {
            options.series.hoverable = true;
            options.series.highlightColor = 'rgba(10, 20, 30, 1)';
        });

        it('should highlight the point when hovered', function() {
            plot = $.plot(placeholder, [ [ [0, 0], [2, 3], [10, 10] ] ], options);

            var eventHolder = plot.getEventHolder(),
                canvas = eventHolder,
                offset = plot.getPlotOffset(),
                axisx = plot.getXAxes()[0],
                axisy = plot.getYAxes()[0],
                x = axisx.p2c(2) + offset.left,
                y = axisy.p2c(3) + offset.top,
                noButton = 0;

            simulate.mouseMove(eventHolder, x, y, noButton);
            jasmine.clock().tick(100);

            expect(getEntireCanvasData(canvas)).toContainPixelColor(rgba(10, 20, 30, 1));
        });

        it('should highlight the point when hovered from a small distance', function() {
            plot = $.plot(placeholder, [ [ [0, 0], [2, 3], [10, 10] ] ], options);

            var eventHolder = plot.getEventHolder(),
                canvas = eventHolder,
                offset = plot.getPlotOffset(),
                epsilon = 2,
                axisx = plot.getXAxes()[0],
                axisy = plot.getYAxes()[0],
                x = axisx.p2c(2) + offset.left + epsilon,
                y = axisy.p2c(3) + offset.top - epsilon,
                noButton = 0;

            simulate.mouseMove(eventHolder, x, y, noButton);
            jasmine.clock().tick(100);

            expect(getEntireCanvasData(canvas)).toContainPixelColor(rgba(10, 20, 30, 1));
        });

        it('should not highlight the point when hovered and the grid is not hoverable', function() {
            options.grid.hoverable = false;
            plot = $.plot(placeholder, [ [ [0, 0], [2, 3], [10, 10] ] ], options);

            var eventHolder = plot.getEventHolder(),
                canvas = eventHolder,
                offset = plot.getPlotOffset(),
                axisx = plot.getXAxes()[0],
                axisy = plot.getYAxes()[0],
                x = axisx.p2c(2) + offset.left,
                y = axisy.p2c(3) + offset.top,
                noButton = 0;

            simulate.mouseMove(eventHolder, x, y, noButton);
            jasmine.clock().tick(100);

            expect(getEntireCanvasData(canvas)).not.toContainPixelColor(rgba(10, 20, 30, 1));
        });

        it('should not highlight the point when hovered and the series is not hoverable', function() {
            options.series.hoverable = false;
            plot = $.plot(placeholder, [ [ [0, 0], [2, 3], [10, 10] ] ], options);

            var eventHolder = plot.getEventHolder(),
                canvas = eventHolder,
                offset = plot.getPlotOffset(),
                axisx = plot.getXAxes()[0],
                axisy = plot.getYAxes()[0],
                x = axisx.p2c(2) + offset.left,
                y = axisy.p2c(3) + offset.top,
                noButton = 0;

            simulate.mouseMove(eventHolder, x, y, noButton);
            jasmine.clock().tick(100);

            expect(getEntireCanvasData(canvas)).not.toContainPixelColor(rgba(10, 20, 30, 1));
        });

        it('should unhighlight the previouse point when hovering a new one', function() {
            plot = $.plot(placeholder, [ [ [0, 0], [2, 3], [10, 10] ] ], options);

            var eventHolder = plot.getEventHolder(),
                canvas = eventHolder,
                offset = plot.getPlotOffset(),
                axisx = plot.getXAxes()[0],
                axisy = plot.getYAxes()[0],
                x1 = axisx.p2c(2) + offset.left,
                y1 = axisy.p2c(3) + offset.top,
                x2 = axisx.p2c(10) + offset.left,
                y2 = axisy.p2c(10) + offset.top,
                r = 5,
                noButton = 0;

            simulate.mouseMove(eventHolder, x1, y1, noButton);
            jasmine.clock().tick(100);

            expect(canvasData(canvas, x1 - r, y1 - r, 2 * r, 2 * r)).toContainPixelColor(rgba(10, 20, 30, 1));
            expect(canvasData(canvas, x2 - r, y2 - r, 2 * r, 2 * r)).not.toContainPixelColor(rgba(10, 20, 30, 1));

            simulate.mouseMove(eventHolder, x2, y2, noButton);
            jasmine.clock().tick(100);

            expect(canvasData(canvas, x1 - r, y1 - r, 2 * r, 2 * r)).not.toContainPixelColor(rgba(10, 20, 30, 1));
            expect(canvasData(canvas, x2 - r, y2 - r, 2 * r, 2 * r)).toContainPixelColor(rgba(10, 20, 30, 1));
        });

        it('should update the current hover point to the placeholder when the plot created again', function () {
            plot = $.plot(placeholder, [ [ [0, 0], [2, 3], [10, 10] ] ], options);

            var eventHolder = plot.getEventHolder(),
                offset = plot.getPlotOffset(),
                axisx = plot.getXAxes()[0],
                axisy = plot.getYAxes()[0],
                x = axisx.p2c(2) + offset.left,
                y = axisy.p2c(3) + offset.top,
                noButton = 0;

            let evt = simulate.mouseMove(eventHolder, x, y, noButton);
            jasmine.clock().tick(1000);

            plot = $.plot(placeholder, [ [ [0, 0], [2, 3], [10, 10] ] ], options);

            expect(plot.getPlaceholder()[0].lastMouseMoveEvent.originalEvent.x).toEqual(evt.x);
            expect(plot.getPlaceholder()[0].lastMouseMoveEvent.originalEvent.y).toEqual(evt.y);
        });

        it('should highlight a bar when hovered', function() {
            options.series.bars = { show: true, barWidth: 0.5 };
            options.series.lines = undefined;
            plot = $.plot(placeholder, [ [ [0, 3], [1, 5], [2, 4] ] ], options);

            var eventHolder = plot.getEventHolder(),
                canvas = eventHolder,
                offset = plot.getPlotOffset(),
                axisx = plot.getXAxes()[0],
                axisy = plot.getYAxes()[0],
                x = axisx.p2c(1.25) + offset.left,
                y = axisy.p2c(2) + offset.top,
                noButton = 0;

            simulate.mouseMove(eventHolder, x, y, noButton);
            jasmine.clock().tick(100);

            expect(getEntireCanvasData(canvas)).toContainPixelColor(rgba(10, 20, 30, 1));
        });
    });
});
