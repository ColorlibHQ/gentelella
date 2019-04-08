/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe("flot navigate plugin", function () {
    var placeholder, plot, options;

    beforeEach(function () {
        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
        options = {
            xaxes: [{ autoScale: 'exact' }],
            yaxes: [{ autoScale: 'exact' }],
            zoom: { interactive: true, active: true, amount: 10 },
            pan: { interactive: true, active: true, frameRate: -1 }
        };
    });

    it('provides a zoom, zoomOut, pan, smartPan functions', function () {
        plot = $.plot(placeholder, [
            []
        ], options);

        expect(typeof plot.zoom).toBe('function');
        expect(typeof plot.zoomOut).toBe('function');
        expect(typeof plot.pan).toBe('function');
        expect(typeof plot.smartPan).toBe('function');
    });

    describe('zoom', function () {
        it('uses the provided amount', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.zoom({
                amount: 2
            });

            expect(xaxis.min).toBe(2.5);
            expect(xaxis.max).toBe(7.5);
            expect(yaxis.min).toBeCloseTo(2.5, 7);
            expect(yaxis.max).toBeCloseTo(7.5, 7);

        });

        it('works with autoScale', function () {
            var xaxis, yaxis,
                opts = {
                    xaxes: [{ autoScale: 'sliding-window' , min: 0, max: 100}],
                    yaxes: [{ autoScale: 'loose' }],
                    zoom: { interactive: true, amount: 10 },
                    pan: { interactive: true, frameRate: -1 }
                };

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], opts);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.zoom({
                amount: 4,
                center: {
                    left: 0,
                    top: plot.height()/2
                }
            });

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(25);
            expect(yaxis.min).toBeCloseTo(4.4, 7);
            expect(yaxis.max).toBeCloseTo(5.8, 7);

            plot.zoom({
                amount: -2,
                center: {
                    left: plot.width()/2,
                    top: plot.height()/2
                }
            });

            expect(xaxis.min).toBeCloseTo(6.25, 2);
            expect(xaxis.max).toBe(18.75);
            expect(yaxis.min).toBeCloseTo(4.8, 7);
            expect(yaxis.max).toBe(5.4);

        });

        it('uses the amount configured in the plot if none is provided', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.zoom();

            expect(xaxis.min).toBe(4.5);
            expect(xaxis.max).toBe(5.5);
            expect(yaxis.min).toBeCloseTo(4.5, 7);
            expect(yaxis.max).toBeCloseTo(5.5, 7);

        });

        it('uses the provided center', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            plot.zoom({
                amount: 2,
                center: {
                    left: 0,
                    top: plot.height()
                }
            });

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(5);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(5);

        });

        it('uses the provided axes', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            plot.zoom({
                amount: 2,
                center: {
                    left: 0,
                    top: plot.height()
                },
                axes: plot.getXAxes()
            });

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(5);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);

        });

        it ('doesn\'t got to Infinity and beyond', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [-1, -10e200 ],
                    [1, 10e200]
                ]
            ], options);

            plot.zoom({
                amount: 10e-200
            });

            yaxis = plot.getYAxes()[0];

            expect(yaxis.min).not.toBe(-Infinity);
            expect(yaxis.max).not.toBe(Infinity);

        });

        it('generates subunitary ticks for X axis', function () {
            var xaxis, ticks, middle;

            plot = $.plot(placeholder, [
                [
                    [3, 0],
                    [9, 10]
                ]
            ], options);

            plot.zoom({
                amount: 4,
                center: {
                    left: 0,
                    top: plot.height()
                }
            });

            xaxis = plot.getXAxes()[0];
            expect(xaxis.min).toBe(3);
            expect(xaxis.max).toBe(4.5);

            ticks = xaxis.ticks;
            middle = Math.floor(ticks.length / 2);
            expect(ticks[middle- 1].v).toBe(3.6);
            expect(ticks[middle].v).toBe(3.8);
            expect(ticks[middle + 1].v).toBe(4);

        });

        it('does not zoom for active false', function () {
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
                xaxis = plot.getXAxes()[0],
                yaxis = plot.getYAxes()[0],
                initialCoords = [
                    {x: 3, y: 5},
                    {x:7, y:9}
                ],
                finalCoords = [
                    {x: 2, y: 4},
                    {x: 8, y: 10}
                ],
                midPointCoords = {
                    x: (xaxis.c2p(finalCoords[0].x - plot.offset().left) + xaxis.c2p(finalCoords[1].x - plot.offset().left)) / 2,
                    y: (yaxis.c2p(finalCoords[0].y - plot.offset().top) + yaxis.c2p(finalCoords[1].y - plot.offset().top)) / 2
                };

            simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchmove');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchend');

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(10);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);

        });


        describe('with large numbers', function() {
            it ('limits the navigation offsets', function () {
                var yaxis;

                plot = $.plot(placeholder, [
                    [
                        [0, -1e308],
                        [1000, 1e308]
                    ]
                ], options);

                yaxis = plot.getYAxes()[0];

                plot.zoom({
                    amount: 10e-20
                });

                expect(yaxis.min).toBe(-Number.MAX_VALUE);
                expect(yaxis.max).toBe(Number.MAX_VALUE);
                expect(isFinite(plot.navigationState().yaxis.navigationOffset.below)).toBe(true);
                expect(isFinite(plot.navigationState().yaxis.navigationOffset.above)).toBe(true);
            });
        })

    });

    describe('zoomOut', function () {
        it('uses the provided amount', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.zoomOut({
                amount: 0.5
            });

            expect(xaxis.min).toBe(2.5);
            expect(xaxis.max).toBe(7.5);
            expect(yaxis.min).toBeCloseTo(2.5, 7);
            expect(yaxis.max).toBeCloseTo(7.5, 7);

        });

        it('uses the amount configured in the plot if none is provided', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.zoom();

            expect(xaxis.min).toBe(4.5);
            expect(xaxis.max).toBe(5.5);
            expect(yaxis.min).toBeCloseTo(4.5, 7);
            expect(yaxis.max).toBeCloseTo(5.5, 7);

        });

        it('uses the provided center', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);


            plot.zoomOut({
                amount: 0.5,
                center: {
                    left: 0,
                    top: plot.height()
                }
            });

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(5);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(5);

        });

        it ('doesn\'t got to Infinity and beyond', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [-1, -10e200 ],
                    [1, 10e200]
                ]
            ], options);

            plot.zoomOut({
                amount: 10e200
            });

            yaxis = plot.getYAxes()[0];

            expect(yaxis.min).not.toBe(-Infinity);
            expect(yaxis.max).not.toBe(Infinity);

        });

        it ('can be disabled per axis for zoom on plot', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            xaxis.options.plotZoom = false;

            plot.zoomOut({
                amount: 0.5
            });

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(10);
            expect(yaxis.min).toBeCloseTo(2.5, 7);
            expect(yaxis.max).toBeCloseTo(7.5, 7);
        });

        it ('can be disabled per axis for zoom on axis', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            xaxis.options.axisZoom = false;

            plot.zoomOut({
                amount: 0.5,
                axes: [xaxis]
            });

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(10);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);
        });
    });

    describe('smartPan', function () {
        it('uses the provided x delta', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.smartPan({
                x: -plot.width(),
                y: 0
            }, plot.navigationState());

            expect(xaxis.min).toBe(-10);
            expect(xaxis.max).toBe(0);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);

        });

        it('uses the provided y delta', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.smartPan({
                x: 0,
                y: plot.height(),
            }, plot.navigationState());

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(10);
            expect(yaxis.min).toBe(-10);
            expect(yaxis.max).toBe(0);

        });

        it('snaps to the x direction when delta y is small', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.smartPan({
                x: -plot.width(),
                y: 1
            }, plot.navigationState());

            expect(xaxis.min).toBe(-10);
            expect(xaxis.max).toBe(0);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);

        });

        it('snaps to the y direction when delta x is small', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.smartPan({
                x: 1,
                y: plot.height(),
            }, plot.navigationState());

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(10);
            expect(yaxis.min).toBe(-10);
            expect(yaxis.max).toBe(0);

        });

        it('restore xaxis offset on snap on y direction if returns from diagonal snap', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            var initialState = plot.navigationState(0, 0);

            plot.smartPan({
                x: plot.width(),
                y: plot.height(),
            }, initialState);

            expect(xaxis.min).toBe(10);
            expect(xaxis.max).toBe(20);
            expect(yaxis.min).toBe(-10);
            expect(yaxis.max).toBe(0);

            plot.smartPan({
                x: plot.width(),
                y: 2,
            }, initialState);


            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);
        });

        it ('can be disabled per axis for panning the etire plot', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            xaxis.options.plotPan = false;

            plot.smartPan({
                x: plot.width(),
                y: plot.height(),
            }, plot.navigationState());

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(10);
            expect(yaxis.min).toBe(-10);
            expect(yaxis.max).toBe(0);
        });

        it ('can be disabled per axis for pan on that axis', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            xaxis.options.axisPan = false;

            plot.smartPan({
                x: plot.width(),
                y: plot.height(),
            }, plot.navigationState(), [xaxis]);

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(10);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);
        });

        it('can pan close to 0 for logaxis', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], {
                xaxes: [{ autoScale: 'exact', mode : 'log'}],
                yaxes: [{ autoScale: 'exact' }],
                zoom: { interactive: true, active: true, amount: 10 },
                pan: { interactive: true, active: true, frameRate: -1 }
            });

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            expect(xaxis.min).toBe(0.1);
            expect(xaxis.max).toBe(10);

            plot.smartPan({
                x: -plot.width(),
                y: 0
            }, plot.navigationState());

            expect(xaxis.min).toBeCloseTo(0.001, 4);
            expect(xaxis.max).toBeCloseTo(0.1, 4);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);
        });

        describe('with large numbers', function() {
            it ('limits the navigation offsets', function () {
                var yaxis;

                plot = $.plot(placeholder, [
                    [
                        [0, -1e308],
                        [1000, 1e308]
                    ]
                ], options);

                yaxis = plot.getYAxes()[0];

                plot.smartPan({
                    x: 0,
                    y: plot.height(),
                }, plot.navigationState());

                expect(yaxis.min).toBe(-1e308);
                expect(yaxis.max).toBeLessThan(0);
                expect(isFinite(plot.navigationState().yaxis.navigationOffset.below)).toBe(true);
                expect(isFinite(plot.navigationState().yaxis.navigationOffset.above)).toBe(true);
            });
        })
    });

    describe('mousePan', function() {
        it ('pans on xaxis only', function () {
            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            var xaxis = plot.getXAxes()[0],
                yaxis = plot.getYAxes()[0],
                initialXmin = xaxis.min,
                initialXmax = xaxis.max,
                eventHolder = plot.getEventHolder(),
                pointCoords = [
                    { x: xaxis.p2c(4), y: xaxis.box.top + plot.offset().top + 10 },
                    { x: xaxis.p2c(5), y: xaxis.box.top + plot.offset().top + 15 }
                ];

            simulate.mouseDown(eventHolder, pointCoords[0].x, pointCoords[0].y);
            simulate.mouseMove(eventHolder, pointCoords[0].x, pointCoords[0].y);
            simulate.mouseMove(eventHolder, pointCoords[1].x, pointCoords[1].y);
            simulate.mouseUp(eventHolder, pointCoords[1].x, pointCoords[1].y);

            expect(xaxis.min).toBeCloseTo(xaxis.c2p(xaxis.p2c(initialXmin) + (pointCoords[0].x - pointCoords[1].x)), 0);
            expect(xaxis.max).toBeCloseTo(xaxis.c2p(xaxis.p2c(initialXmax) + (pointCoords[0].x - pointCoords[1].x)), 0);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);

        });

        it ('pans on yaxis only', function () {
            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            var xaxis = plot.getXAxes()[0],
                yaxis = plot.getYAxes()[0],
                initialYmin = yaxis.min,
                initialYmax = yaxis.max,
                eventHolder = plot.getEventHolder(),
                pointCoords = [
                        { x: xaxis.box.left - 10, y: yaxis.p2c(4) },
                        { x: yaxis.p2c(3), y: yaxis.p2c(8) }
                ];

            simulate.mouseDown(eventHolder, pointCoords[0].x, pointCoords[0].y);
            simulate.mouseMove(eventHolder, pointCoords[0].x, pointCoords[0].y);
            simulate.mouseMove(eventHolder, pointCoords[1].x, pointCoords[1].y);
            simulate.mouseUp(eventHolder, pointCoords[1].x, pointCoords[1].y);

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(10);
            expect(yaxis.min).toBeCloseTo(yaxis.c2p(yaxis.p2c(initialYmin) + (pointCoords[0].y - pointCoords[1].y)), 0);
            expect(yaxis.max).toBeCloseTo(yaxis.c2p(yaxis.p2c(initialYmax) + (pointCoords[0].y - pointCoords[1].y)), 0);

        });
    });

    describe('click', function(){
        it('on plot activates plot\'s zoom and pan active propriety', function() {
            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
              ], {
                  zoom: { interactive: true, active: false, amount: 10 },
                  pan: { interactive: true, active: false}
              });

              var eventHolder = plot.getEventHolder(),
                  pointCoords = { x: 0, y: plot.height() };

              simulate.click(eventHolder, pointCoords.x, pointCoords.y);

              expect(plot.getOptions().pan.active).toBe(true);
              expect(plot.getOptions().zoom.active).toBe(true);
        });
    });

    describe('mouse dblclick', function(){
        it('on plot activates plot\'s zoom and pan active propriety', function() {
            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
              ], {
                  zoom: { interactive: true, active: false, amount: 10 },
                  pan: { interactive: true, active: false}
              });

              var eventHolder = plot.getEventHolder(),
                  pointCoords = { x: 0, y: plot.height() };

              simulate.dblclick(eventHolder, pointCoords.x, pointCoords.y);

              expect(plot.getOptions().pan.active).toBe(true);
              expect(plot.getOptions().zoom.active).toBe(true);
        });

        it('sends touched axis for double click on axis', function(){
            plot = $.plot(placeholder, [
                [
                    [-1, 2],
                    [11, 12]
                ]
            ], options);

            var eventHolder = plot.getEventHolder(),
                xaxis = plot.getXAxes()[0],
                coords = { x: xaxis.p2c(4), y: xaxis.box.top + 10 };

            var spyRecenter = jasmine.createSpy('spy');
            $(plot.getPlaceholder()).on('re-center', spyRecenter);

            simulate.dblclick(eventHolder, coords.x, coords.y);

            expect(spyRecenter).toHaveBeenCalled();

            expect(spyRecenter.calls.all()[0].args[0].detail.axisTouched).toEqual(xaxis);
        });
    });
});
