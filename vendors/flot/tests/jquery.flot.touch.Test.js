/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe("flot touch plugin", function () {
    var placeholder, plot, options;

    beforeEach(function () {
        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
        options = {
            xaxes: [{ autoScale: 'exact' }],
            yaxes: [{ autoScale: 'exact' }],
            zoom: { interactive: true, amount: 10, active: true },
            pan: { interactive: true, frameRate: -1, enableTouch: true, active: true }
        };
    });

    it('shows that the eventHolder is cleared through shutdown when the plot is replaced', function() {
        plot = $.plot(placeholder, [[]], options);

        var eventPlaceholder = plot.getEventHolder();
            spy = spyOn(eventPlaceholder, 'removeEventListener').and.callThrough();

        plot = $.plot(placeholder, [[]], options);

        expect(spy).toHaveBeenCalledWith('touchstart', jasmine.any(Function))
        expect(spy).toHaveBeenCalledWith('touchmove', jasmine.any(Function));
        expect(spy).toHaveBeenCalledWith('touchend', jasmine.any(Function));
    });

    it('do not stop origin touch event propagation if it is allowed', () => {	
        jasmine.clock().install().mockDate();	

        var oldPropagateSupportedGesture = options.propagateSupportedGesture ;	
        options.propagateSupportedGesture = true;	

        plot = $.plot(placeholder, [[]], options);	
        var eventHolder = plot.getEventHolder(),	
            spy = jasmine.createSpy('origin touch event handler');	

        eventHolder.parentNode.addEventListener('touchstart', spy, { once: true });	
        eventHolder.parentNode.addEventListener('touchmove', spy, { once: true });	
        eventHolder.parentNode.addEventListener('touchend', spy, { once: true });

        var bubbleTouchEvents = [
            new UIEvent('touchstart', { bubbles: true }),
            new UIEvent('touchmove', { bubbles: true }),
            new UIEvent('touchend', { bubbles: true }),
        ];
        bubbleTouchEvents.forEach((event) => {
            event.touches = [{ identifier: 0, target: eventHolder }];
            eventHolder.dispatchEvent(event);
        });

        expect(spy).toHaveBeenCalledTimes(3);	

        options.propagateSupportedGesture = oldPropagateSupportedGesture;	
        jasmine.clock().uninstall();	
    });

    describe('long tap', function() {

        beforeEach(function() {
            jasmine.clock().install().mockDate();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it('should trigger the long tap event',function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('long tap handler'),
                coords = [{x: 10, y: 20}];

            eventHolder.addEventListener('longtap', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');
            jasmine.clock().tick(1600);
            jasmine.clock().tick(1600);
            jasmine.clock().tick(1600);

            expect(spy).toHaveBeenCalled();
            expect(spy.calls.count()).toBe(1);
        });

        it('should trigger the long tap event even when there is a small move of the touch point',function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('long tap handler'),
                initialCoords = [{x: 10, y: 20}],
                finalCoords = [{x: 11, y: 21}];

            eventHolder.addEventListener('longtap', spy);

            simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchmove');
            jasmine.clock().tick(1600);

            expect(spy).toHaveBeenCalled();
            expect(spy.calls.count()).toBe(1);
        });

        it('should not trigger the long tap event when there is a large move of the touch point',function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('long tap handler'),
                initialCoords = [{x: 10, y: 20}],
                finalCoords = [{x: 100, y: 200}];

            eventHolder.addEventListener('longtap', spy);

            simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchmove');
            jasmine.clock().tick(1600);

            expect(spy).not.toHaveBeenCalled();
        });

        it('should not trigger the long tap event when the touch ends too soon',function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('long tap handler'),
                coords = [{x: 10, y: 20}];

            eventHolder.addEventListener('longtap', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');
            jasmine.clock().tick(1400);
            simulate.sendTouchEvents(coords, eventHolder, 'touchend');
            jasmine.clock().tick(200);

            expect(spy).not.toHaveBeenCalled();
        });

        it('should not trigger the long tap event when the plot is replaced', function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('long tap handler'),
                coords = [{x: 10, y: 20}];

            eventHolder.addEventListener('longtap', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');
            plot = $.plot(placeholder, [[]], options);
            jasmine.clock().tick(1600);

            expect(spy).not.toHaveBeenCalled();
        });

        it('should trigger multiple long tap events',function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('long tap handler'),
                coords = [{x: 10, y: 20}];

            eventHolder.addEventListener('longtap', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');
            jasmine.clock().tick(1600);
            simulate.sendTouchEvents(coords, eventHolder, 'touchend');
            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');
            jasmine.clock().tick(1600);
            simulate.sendTouchEvents(coords, eventHolder, 'touchend');

            expect(spy).toHaveBeenCalled();
            expect(spy.calls.count()).toBe(2);
        });
    });

    describe('pinch', function() {

        beforeEach(function() {
            jasmine.clock().install().mockDate();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it('should be able to trigger pinchstart event',function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('pinch handler'),
                coords = [{x: 10, y: 20}, {x: 15, y: 20}];

            eventHolder.addEventListener('pinchstart', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');

            expect(spy).toHaveBeenCalled();
            expect(spy.calls.count()).toBe(1);
        });

        it('should not trigger pinch event for plot not active',function() {
            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
                ], {
                xaxes: [{ autoScale: 'exact' }],
                yaxes: [{ autoScale: 'exact' }],
                zoom: { interactive: true, active: false, amount: 10 },
                pan: { interactive: true, active: false, frameRate: -1 }
            });

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('pinch handler'),
                coords = [{x: 10, y: 20}, {x: 15, y: 20}];

            eventHolder.addEventListener('pinchstart', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');

            expect(spy).not.toHaveBeenCalled();
            expect(spy.calls.count()).toBe(0);
        });

        it('should not trigger pinch event for only one touch',function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('pinch handler'),
                coords = [{x: 10, y: 20}];

            eventHolder.addEventListener('pinchstart', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');

            expect(spy).not.toHaveBeenCalled();
            expect(spy.calls.count()).toBe(0);
        });

        it('should not trigger pinch event for touch outside plot',function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                mockEventHolder = {},
                spy = jasmine.createSpy('pinch handler'),
                coords = [{x: 10, y: 20}, {x: 15, y: 20}];

            eventHolder.addEventListener('pinchstart', spy);

            mockEventHolder.dispatchEvent = function() {};

            simulate.sendTouchEvents(coords, mockEventHolder, 'touchstart');

            expect(spy).not.toHaveBeenCalled();
            expect(spy.calls.count()).toBe(0);
        });

        it('allows default propagation for three touches',function() {
            plot = $.plot(placeholder, [], options);

            var eventHolder = plot.getEventHolder(),
                touchCoords = [{pageX: 10, pageY: 20}, {pageX: 15, pageY: 20}, {pageX: 20, pageY: 25}],
                touchStartEvent = new CustomEvent('touchstart'),
                touchMoveEvent = new CustomEvent('touchmove');

            touchStartEvent.touches = touchCoords;
            touchStartEvent.preventDefault = jasmine.createSpy();
            touchMoveEvent.touches = touchCoords;
            touchMoveEvent.preventDefault = jasmine.createSpy();

            eventHolder.dispatchEvent(touchStartEvent);
            eventHolder.dispatchEvent(touchMoveEvent);

            expect(touchStartEvent.preventDefault).not.toHaveBeenCalled();
            expect(touchMoveEvent.preventDefault).not.toHaveBeenCalled();

        });
    });

    describe('pan', function() {

        beforeEach(function() {
            jasmine.clock().install().mockDate();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it('should be able to trigger pan event',function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('pan handler'),
                coords = [{x: 10, y: 20}];

            eventHolder.addEventListener('pan', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'pan');

            expect(spy).toHaveBeenCalled();
            expect(spy.calls.count()).toBe(1);
        });

        it('should not trigger pan event for plot not active',function() {
            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
                ], {
                xaxes: [{ autoScale: 'exact' }],
                yaxes: [{ autoScale: 'exact' }],
                zoom: { interactive: true, active: false, amount: 10 },
                pan: { interactive: true, active: false, frameRate: -1 }
            });

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('pan handler'),
                coords = [{x: 10, y: 20}];

            eventHolder.addEventListener('pan', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');

            expect(spy).not.toHaveBeenCalled();
            expect(spy.calls.count()).toBe(0);
        });

        it('should not trigger pan event for touch outside plot',function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                mockEventHolder = {},
                spy = jasmine.createSpy('pan handler'),
                coords = [{x: 10, y: 20}];

            eventHolder.addEventListener('panstart', spy);

            mockEventHolder.dispatchEvent = function() {};

            simulate.sendTouchEvents(coords, mockEventHolder, 'touchstart');

            expect(spy).not.toHaveBeenCalled();
            expect(spy.calls.count()).toBe(0);
        });
    });

    describe('doubletap', function() {

        beforeEach(function() {
            jasmine.clock().install().mockDate();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it('should trigger the double tap event', function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('double tap handler'),
                coords = [{x: 10, y: 20}];

            eventHolder.addEventListener('doubletap', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');
            jasmine.clock().tick(200);
            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');

            expect(spy).toHaveBeenCalled();
            expect(spy.calls.count()).toBe(1);
        });

        it('should trigger the double tap event even when there is a different touch point', function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('double tap handler'),
                initialCoords = [{x: 10, y: 20}],
                finalCoords = [{x: 11, y: 21}];

            eventHolder.addEventListener('doubletap', spy);

            simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
            jasmine.clock().tick(300);
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchstart');

            expect(spy).toHaveBeenCalled();
            expect(spy.calls.count()).toBe(1);
        });

        it('should not trigger the double tap event for a big interval between taps', function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('double tap handler'),
                coords = [{x: 10, y: 20}];

            eventHolder.addEventListener('doubletap', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');
            jasmine.clock().tick(1000);
            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');

            expect(spy).not.toHaveBeenCalled();
            expect(spy.calls.count()).toBe(0);
        });

        it('should not trigger the double tap event for one of the touches outside plot area', function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                mockEventHolder = {},
                spy = jasmine.createSpy('double tap handler'),
                initialCoords = [{x: 10, y: 20}],
                finalCoords = [{x: 100, y: 200}];

            mockEventHolder.dispatchEvent = function() {};

            eventHolder.addEventListener('doubletap', spy);

            simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
            jasmine.clock().tick(100);
            simulate.sendTouchEvents(finalCoords, mockEventHolder, 'touchmove');

            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('tap', function() {

        beforeEach(function() {
            jasmine.clock().install().mockDate();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it('should trigger the tap event', function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('tap handler'),
                coords = [{x: 10, y: 20}];

            eventHolder.addEventListener('tap', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');
            jasmine.clock().tick(50);
            simulate.sendTouchEvents(coords, eventHolder, 'touchend');

            expect(spy).toHaveBeenCalled();
            expect(spy.calls.count()).toBe(1);
        });

        it('should trigger the tap event even when there is a different touch point', function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('tap handler'),
                initialCoords = [{x: 10, y: 20}],
                finalCoords = [{x: 11, y: 21}];

            eventHolder.addEventListener('tap', spy);

            simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
            jasmine.clock().tick(50);
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchend');

            expect(spy).toHaveBeenCalled();
            expect(spy.calls.count()).toBe(1);
        });

        it('should not trigger the tap event for a big interval between taps', function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('tap handler'),
                coords = [{x: 10, y: 20}];

            eventHolder.addEventListener('tap', spy);

            simulate.sendTouchEvents(coords, eventHolder, 'touchstart');
            jasmine.clock().tick(200);
            simulate.sendTouchEvents(coords, eventHolder, 'touchend');

            expect(spy).not.toHaveBeenCalled();
            expect(spy.calls.count()).toBe(0);
        });

        it('should not trigger the tap event for a big interval between taps', function() {
            plot = $.plot(placeholder, [[]], options);

            var eventHolder = plot.getEventHolder(),
                spy = jasmine.createSpy('tap handler'),
                initalCoords = [{x: 10, y: 20}],
                moveCoords = [{x: 30, y: 60}];;

            eventHolder.addEventListener('tap', spy);

            simulate.sendTouchEvents(initalCoords, eventHolder, 'touchstart');
            simulate.sendTouchEvents(moveCoords, eventHolder, 'touchmove');
            jasmine.clock().tick(30);
            simulate.sendTouchEvents(moveCoords, eventHolder, 'touchend');

            expect(spy).not.toHaveBeenCalled();
            expect(spy.calls.count()).toBe(0);
        });
    });
});
