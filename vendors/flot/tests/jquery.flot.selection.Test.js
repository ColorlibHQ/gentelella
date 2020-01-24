/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe("flot selection plugin", function() {
    var placeholder, offset, options;
    var minFrameDuration = 1 / 60 * 1000;
    var mouseStart = { x: 100, y: 100 };

    beforeEach(function() {

        options = {
            selection: {
                mode: 'smart',
                minSize: 30,
            },
            testDrag: {
                on: false
            }
        };

        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');

        jasmine.clock().install();
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });


    function doDragStart(el, m) {
        var c = getClientXY(el, m);

        simulate.mouseDown(el, c.x, c.y);
        simulate.mouseMove(el, c.x, c.y);
        jasmine.clock().tick(minFrameDuration);
    }

    function doDrag(el, m) {
        var c = getClientXY(el, m);

        simulate.mouseMove(el, c.x, c.y);
        jasmine.clock().tick(minFrameDuration);
    }

    function doDragEnd(el, m) {
        var c = getClientXY(el, m);

        simulate.mouseUp(el, c.x, c.y);
        simulate.click(el, c.x, c.y);
        jasmine.clock().tick(minFrameDuration);
    }

    function getClientXY(el, m){
        var bBox = el.getBoundingClientRect();

        return {
            x: Math.floor(bBox.left + m.x),
            y: Math.floor(bBox.top + m.y)};
    }

    describe ("basic tests", function() {
        it('should draw the selection rectangle with "fill" option', function(){

            options.selection.visualization = "fill";

            var plot = $.plot(placeholder, [[]], options);
            var eventHolder = plot.getEventHolder();
            var ctx = eventHolder.getContext('2d');
            var mouseEnd = { x: mouseStart.x + 100, y: mouseStart.y + 100 };

            spyOn(ctx, 'strokeRect').and.callThrough();
            spyOn(ctx, 'closePath').and.callThrough();

            doDragStart(eventHolder, mouseStart);
            doDrag(eventHolder, mouseEnd);
            doDragEnd(eventHolder, mouseEnd);

            expect(ctx.strokeRect).toHaveBeenCalled();
            expect(ctx.closePath).not.toHaveBeenCalled();
        });

        it('should draw the focusing selection window by default', function(){

            var plot = $.plot(placeholder, [[]], options);
            var eventHolder = plot.getEventHolder();
            var ctx = eventHolder.getContext('2d');
            var mouseEnd = { x: mouseStart.x + 100, y: mouseStart.y + 100 };

            spyOn(ctx, 'strokeRect').and.callThrough();
            spyOn(ctx, 'closePath').and.callThrough();

            doDragStart(eventHolder, mouseStart);
            doDrag(eventHolder, mouseEnd);
            doDragEnd(eventHolder, mouseEnd);

            expect(ctx.strokeRect).not.toHaveBeenCalled();
            expect(ctx.closePath).toHaveBeenCalled();
        });

        it('should not draw anything if selection range is less than the minimum set in options', function(){

            var plot = $.plot(placeholder, [[]], options);
            var eventHolder = plot.getEventHolder();
            var ctx = eventHolder.getContext('2d');
            var delta = options.selection.minSize - 1;
            var mouseEnd = { x: mouseStart.x + delta, y: mouseStart.y + delta };

            spyOn(ctx, 'strokeRect').and.callThrough();
            spyOn(ctx, 'closePath').and.callThrough();

            doDragStart(eventHolder, mouseStart);
            doDrag(eventHolder, mouseEnd);
            doDragEnd(eventHolder, mouseEnd);

            expect(ctx.strokeRect).not.toHaveBeenCalled();
            expect(ctx.closePath).not.toHaveBeenCalled();
        });
    });

    describe ("with other drag-based plugin", function() {
        it('should not do selection when drag plugin is enabled', function(){
            options.selection.visualization = "fill";
            options.testDrag.on = true;

            var that = this;
            var plot = $.plot(placeholder, [[]], options);
            var eventHolder = plot.getEventHolder();
            var mouseEnd = { x: mouseStart.x + 100, y: mouseStart.y + 100 };

            $(placeholder).on('plotselected', function (e, ranges) {
                that.wasPlotSelectedCalled = true;
            });
    
            doDragStart(eventHolder, mouseStart);
            doDrag(eventHolder, mouseEnd);
            doDragEnd(eventHolder, mouseEnd);
            expect(that.wasPlotSelectedCalled).toBeFalsy();
            
            // ensure that when other drag-based plugin is disabled we successfully trigger plotselected event
            options.testDrag.on = false;
            plot = $.plot(placeholder, [[]], options);

            doDragStart(eventHolder, mouseStart);
            doDrag(eventHolder, mouseEnd);
            doDragEnd(eventHolder, mouseEnd);
            expect(that.wasPlotSelectedCalled).toBeTruthy();
        });
    });
});

describe("flot navigate plugin interactions", function () {
    'use strict';

    var placeholder, plot, eventHolder;

    beforeEach(function () {
        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
        jasmine.clock().install();
    });

    afterEach(function () {
        jasmine.clock().uninstall();
    });

    it('selection mode x zooms the x axis only', function () {
        plot = $.plot(placeholder, [
            [[0, 0],
            [10, 10]]
        ], {
        xaxes: [{
            autoScale: 'exact'
        }],
        yaxes: [{
            autoScale: 'exact'
        }],
        selection: {
            mode: 'x',
        }});

        var xaxis = plot.getXAxes()[0];
        var yaxis = plot.getYAxes()[0];
        var eventHolder = plot.getEventHolder();

        var clientX = plot.getPlotOffset().left + xaxis.p2c(0);
        var clientY = plot.getPlotOffset().top + yaxis.p2c(0);

        simulate.mouseDown(eventHolder, clientX + 50, clientY - 70);
        jasmine.clock().tick(50);
        simulate.mouseMove(eventHolder, clientX + 50, clientY - 70);
        jasmine.clock().tick(50);
        simulate.mouseMove(eventHolder, clientX + 70, clientY - 80);
        jasmine.clock().tick(50);
        simulate.mouseUp(eventHolder, clientX + 70, clientY - 80);
        var ranges = plot.getSelection();
        expect(ranges.xaxis.from).toBeCloseTo(0.9, 1);
        expect(ranges.xaxis.to).toBeCloseTo(1.2, 1);
        expect(ranges.yaxis.from).toEqual(0);
        expect(ranges.yaxis.to).toEqual(10);
    });
    it('selection mode y zooms the y axis only', function () {
        plot = $.plot(placeholder, [
            [[0, 0],
            [10, 10]]
        ], {
        xaxes: [{
            autoScale: 'exact'
        }],
        yaxes: [{
            autoScale: 'exact'
        }],
        selection: {
            mode: 'y',
        }});

        var xaxis = plot.getXAxes()[0];
        var yaxis = plot.getYAxes()[0];
        var eventHolder = plot.getEventHolder();

        var clientX = plot.getPlotOffset().left + xaxis.p2c(0);
        var clientY = plot.getPlotOffset().top + yaxis.p2c(0);

        simulate.mouseDown(eventHolder, clientX + 150, clientY - 150);
        jasmine.clock().tick(50);
        simulate.mouseMove(eventHolder, clientX + 150, clientY - 150);
        jasmine.clock().tick(50);
        simulate.mouseMove(eventHolder, clientX + 160, clientY - 130);
        jasmine.clock().tick(50);
        simulate.mouseUp(eventHolder, clientX + 160, clientY - 130);
        var ranges = plot.getSelection();
        expect(ranges.xaxis.from).toEqual(0);
        expect(ranges.xaxis.to).toEqual(10);
        expect(Math.floor(ranges.yaxis.from * 10) / 10).toBeCloseTo(3.6, 1); //test on travis gives 3.67, locally 3.64
        expect(ranges.yaxis.to).toBeCloseTo(4.2, 1);
    });
    it('selection mode xy zooms the x & y axis', function () {
        plot = $.plot(placeholder, [
            [[0, 0],
            [10, 10]]
        ], {
        xaxes: [{
            autoScale: 'exact'
        }],
        yaxes: [{
            autoScale: 'exact'
        }],
        selection: {
            mode: 'xy',
        }});

        var xaxis = plot.getXAxes()[0];
        var yaxis = plot.getYAxes()[0];
        var eventHolder = plot.getEventHolder();

        var clientX = plot.getPlotOffset().left + xaxis.p2c(0);
        var clientY = plot.getPlotOffset().top + yaxis.p2c(0);

        simulate.mouseDown(eventHolder, clientX + 50, clientY - 150);
        jasmine.clock().tick(50);
        simulate.mouseMove(eventHolder, clientX + 50, clientY - 150);
        jasmine.clock().tick(50);
        simulate.mouseMove(eventHolder, clientX + 70, clientY - 130);
        jasmine.clock().tick(50);
        simulate.mouseUp(eventHolder, clientX + 70, clientY - 130);
        var ranges = plot.getSelection();
        expect(ranges.xaxis.from).toBeCloseTo(0.9, 1);
        expect(ranges.xaxis.to).toBeCloseTo(1.2, 1);
        expect(Math.floor(ranges.yaxis.from * 10) / 10).toBeCloseTo(3.6, 1); //test on travis gives 3.67, locally 3.64
        expect(ranges.yaxis.to).toBeCloseTo(4.2, 1);
    });
    it('setselection fires plotselected event', function (done) {
        plot = $.plot(placeholder, [
            [[0, 0],
            [10, 10]]
        ], {
        xaxes: [{
            autoScale: 'exact'
        }],
        yaxes: [{
            autoScale: 'exact'
        }],
        selection: {
            mode: 'x',
        }});

        var xaxis = plot.getXAxes()[0];
        var yaxis = plot.getYAxes()[0];
        var eventHolder = plot.getEventHolder();

        var clientX = plot.getPlotOffset().left + xaxis.p2c(0);
        var clientY = plot.getPlotOffset().top + yaxis.p2c(0);

        $(placeholder).on('plotselected', function (e, ranges) {
            expect(ranges.xaxis.from).toBeCloseTo(0.9, 1);
            expect(ranges.xaxis.to).toBeCloseTo(1.2, 1);
            expect(ranges.yaxis.from).toEqual(0);
            expect(ranges.yaxis.to).toEqual(10);
            done();
        });

        plot.setSelection({xaxis: {from: 0.88, to: 1.23}, yaxis: {from: 5, to: 6}});
    });
    it('selection mode null does not zoom', function () {
        plot = $.plot(placeholder, [
            [[0, 0],
            [10, 10]]
        ], {
        xaxes: [{
            autoScale: 'exact'
        }],
        yaxes: [{
            autoScale: 'exact'
        }],
        selection: {
            mode: null,
        }});

        var xaxis = plot.getXAxes()[0];
        var yaxis = plot.getYAxes()[0];
        var eventHolder = plot.getEventHolder();

        var clientX = plot.getPlotOffset().left + xaxis.p2c(0);
        var clientY = plot.getPlotOffset().top + yaxis.p2c(0);

        simulate.mouseDown(eventHolder, clientX + 50, clientY - 70);
        jasmine.clock().tick(50);
        simulate.mouseMove(eventHolder, clientX + 50, clientY - 70);
        jasmine.clock().tick(50);
        simulate.mouseMove(eventHolder, clientX + 70, clientY - 80);
        jasmine.clock().tick(50);
        simulate.mouseUp(eventHolder, clientX + 70, clientY - 80);
        var ranges = plot.getSelection();
        expect(ranges).toEqual(null);
    });
});

