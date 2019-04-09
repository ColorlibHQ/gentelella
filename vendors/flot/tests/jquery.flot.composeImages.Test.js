/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe("composeImages", function() {
    var placeholder, plot;
    var composeImages = $.plot.composeImages,
        canvasData = window.colors.canvasData;

    beforeEach(function() {
        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px; padding: 0px margin: 0px; border: 0px; font-size:0pt; font-family:sans-serif; line-height:0px;">')
            .find('#test-container');

        jasmine.addMatchers(window.colors.jasmineMatchers);
    });

    it('should call composeImages on an empty array of sources, so the destination canvas should stay unmodified', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '</div>' +
        '<canvas id="myCanvas" width="300" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('svg').toArray();

        var destinationCanvas = document.getElementById("myCanvas");

        function drawCircleOnToCanvas(canvas) {
            var ctx = canvas.getContext('2d');
            ctx.arc(80, 10, 5, 0, 2 * Math.PI);
            ctx.fill();
        }

        drawCircleOnToCanvas(destinationCanvas); //make sure composeImages won't modify this content

        composeImages(sources, destinationCanvas).then(function() {
            expect(canvasData(destinationCanvas, 80, 10, 1, 1)).toMatchPixelColor([0, 0, 0, 255]);
            expect(destinationCanvas.width).toBe(300);
            expect(destinationCanvas.height).toBe(150);
            expect(canvasData(destinationCanvas, 10, 10, 1, 1)).toMatchPixelColor([0, 0, 0, 0]);
            expect(canvasData(destinationCanvas, 30, 40, 1, 1)).toMatchPixelColor([0, 0, 0, 0]);
            expect(canvasData(destinationCanvas, 50, 70, 1, 1)).toMatchPixelColor([0, 0, 0, 0]);
            expect(canvasData(destinationCanvas, 10, 110, 1, 1)).toMatchPixelColor([0, 0, 0, 0]);
            expect(canvasData(destinationCanvas, 30, 140, 1, 1)).toMatchPixelColor([0, 0, 0, 0]);
            expect(canvasData(destinationCanvas, 50, 170, 1, 1)).toMatchPixelColor([0, 0, 0, 0]);

            done();
        }, null);
    });


    it('should call composeImages on one SVG as a source', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<svg id="svgSource" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100" height="100" title="svg">' +
            '<circle id="c1" cx="10" cy="10" r="5" style="fill:red"/>' +
            '<circle id="c2" cx="30" cy="40" r="7" style="fill:#00FF00"/>' +
            '<circle id="c3" cx="50" cy="70" r="9" style="fill:blue"/>' +
        '</svg>' +
        '</div>' +
        '<canvas id="myCanvas" width="300" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('svg').toArray();

        var destinationCanvas = document.getElementById("myCanvas");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(100);
            expect(destinationCanvas.height).toBe(100);
            expect(canvasData(destinationCanvas, 10, 10, 1, 1)).toMatchPixelColor([255, 0, 0, 255]);
            expect(canvasData(destinationCanvas, 30, 40, 1, 1)).toMatchPixelColor([0, 255, 0, 255]);
            expect(canvasData(destinationCanvas, 50, 70, 1, 1)).toMatchPixelColor([0, 0, 255, 255]);

            done();
        }, null);
    });


    it('should call composeImages on two identical SVGs, one near the other', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<svg id="svgSource" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100" height="100" title="svg">' +
            '<circle id="c1" cx="10" cy="10" r="5" style="fill:red"/>' +
            '<circle id="c2" cx="30" cy="40" r="7" style="fill:#00FF00"/>' +
            '<circle id="c3" cx="50" cy="70" r="9" style="fill:blue"/>' +
        '</svg>' +
        '<svg id="svgSource2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100" height="100" title="svg2">' +
            '<circle id="c1" cx="10" cy="10" r="5" style="fill:red"/>' +
            '<circle id="c2" cx="30" cy="40" r="7" style="fill:#00FF00"/>' +
            '<circle id="c3" cx="50" cy="70" r="9" style="fill:blue"/>' +
        '</svg>' +
        '</div>' +
        '<canvas id="myCanvas" width="300" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('svg').toArray();

        var destinationCanvas = document.getElementById("myCanvas");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(200); //204 - //200 + 2 * 2px_spacing
            expect(destinationCanvas.height).toBe(100);
            expect(canvasData(destinationCanvas, 10, 10, 1, 1)).toMatchPixelColor([255, 0, 0, 255]);
            expect(canvasData(destinationCanvas, 30, 40, 1, 1)).toMatchPixelColor([0, 255, 0, 255]);
            expect(canvasData(destinationCanvas, 50, 70, 1, 1)).toMatchPixelColor([0, 0, 255, 255]);
            expect(canvasData(destinationCanvas, 110, 10, 1, 1)).toMatchPixelColor([255, 0, 0, 255]); //110 + 4
            expect(canvasData(destinationCanvas, 130, 40, 1, 1)).toMatchPixelColor([0, 255, 0, 255]); //130 + 4
            expect(canvasData(destinationCanvas, 150, 70, 1, 1)).toMatchPixelColor([0, 0, 255, 255]); //150 + 4

            done();
        }, null);
    });


    it('should call composeImages on two identical SVGs, one after the other', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<svg id="svgSource" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100" height="100" title="svg">' +
            '<circle id="c1" cx="10" cy="10" r="5" style="fill:#FF0000"/>' +
            '<circle id="c2" cx="30" cy="40" r="7" style="fill:#00FF00"/>' +
            '<circle id="c3" cx="50" cy="70" r="9" style="fill:#0000FF"/>' +
        '</svg>' +
        '<br>' +
        '<svg id="svgSource2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100" height="100" title="svg2">' +
            '<circle id="c1" cx="10" cy="10" r="5" style="fill:#FF0000"/>' +
            '<circle id="c2" cx="30" cy="40" r="7" style="fill:#00FF00"/>' +
            '<circle id="c3" cx="50" cy="70" r="9" style="fill:#0000FF"/>' +
        '</svg>' +
        '</div>' +
        '<canvas id="myCanvas" width="300" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('svg').toArray();

        var destinationCanvas = document.getElementById("myCanvas");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(100);
            expect(destinationCanvas.height).toBe(200);  //204 - //200 + 2 * 2px_spacing
            expect(canvasData(destinationCanvas, 10, 10, 1, 1)).toMatchPixelColor([255, 0, 0, 255]);
            expect(canvasData(destinationCanvas, 30, 40, 1, 1)).toMatchPixelColor([0, 255, 0, 255]);
            expect(canvasData(destinationCanvas, 50, 70, 1, 1)).toMatchPixelColor([0, 0, 255, 255]);
            expect(canvasData(destinationCanvas, 10, 110, 1, 1)).toMatchPixelColor([255, 0, 0, 255]); //110 + 4
            expect(canvasData(destinationCanvas, 30, 140, 1, 1)).toMatchPixelColor([0, 255, 0, 255]); //140 + 4
            expect(canvasData(destinationCanvas, 50, 170, 1, 1)).toMatchPixelColor([0, 0, 255, 255]); //170 + 4

            done();
        }, null);
    });

    it('should call composeImages on three identical SVGs, placed in an L-shape', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<svg id="svgSource1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100" height="100" title="svg1">' +
            '<circle id="c1" cx="10" cy="10" r="5" style="fill:red"/>' +
            '<circle id="c2" cx="30" cy="40" r="7" style="fill:#00FF00"/>' +
            '<circle id="c3" cx="50" cy="70" r="9" style="fill:blue"/>' +
        '</svg>' +
        '<svg id="svgSource2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100" height="100" title="svg2">' +
            '<circle id="c1" cx="10" cy="10" r="5" style="fill:red"/>' +
            '<circle id="c2" cx="30" cy="40" r="7" style="fill:#00FF00"/>' +
            '<circle id="c3" cx="50" cy="70" r="9" style="fill:blue"/>' +
        '</svg>' +
        '<br>' +
        '<svg id="svgSource3" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100" height="100" title="svg3">' +
            '<circle id="c1" cx="10" cy="10" r="5" style="fill:red"/>' +
            '<circle id="c2" cx="30" cy="40" r="7" style="fill:#00FF00"/>' +
            '<circle id="c3" cx="50" cy="70" r="9" style="fill:blue"/>' +
        '</svg>' +
        '</div>' +
        '<canvas id="myCanvas" width="300" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('svg').toArray();

        var destinationCanvas = document.getElementById("myCanvas");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(200);  //204 - //200 + 2 * 2px_spacing
            expect(destinationCanvas.height).toBe(200);  //204 - //200 + 2 * 2px_spacing
            expect(canvasData(destinationCanvas, 10, 10, 1, 1)).toMatchPixelColor([255, 0, 0, 255]);
            expect(canvasData(destinationCanvas, 30, 40, 1, 1)).toMatchPixelColor([0, 255, 0, 255]);
            expect(canvasData(destinationCanvas, 50, 70, 1, 1)).toMatchPixelColor([0, 0, 255, 255]);
            expect(canvasData(destinationCanvas, 110, 10, 1, 1)).toMatchPixelColor([255, 0, 0, 255]); //110 + 4
            expect(canvasData(destinationCanvas, 130, 40, 1, 1)).toMatchPixelColor([0, 255, 0, 255]); //130 + 4
            expect(canvasData(destinationCanvas, 150, 70, 1, 1)).toMatchPixelColor([0, 0, 255, 255]); //150 + 4
            expect(canvasData(destinationCanvas, 10, 110, 1, 1)).toMatchPixelColor([255, 0, 0, 255]); //110 + 4
            expect(canvasData(destinationCanvas, 30, 140, 1, 1)).toMatchPixelColor([0, 255, 0, 255]); //140 + 4
            expect(canvasData(destinationCanvas, 50, 170, 1, 1)).toMatchPixelColor([0, 0, 255, 255]); //170 + 4

            done();
        }, null);
    });

    it('should call composeImages on one canvas as a source', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<canvas id="canvasSource" width="20" height="20" title="canvasSource"></canvas>' +
        '</div>' +
        '<canvas id="myCanvas" width="30" height="15" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('#canvasSource').toArray();

        var originalCanvas = document.getElementById("canvasSource");
        var destinationCanvas = document.getElementById("myCanvas");

        drawSomeLinesOnCanvas(originalCanvas);

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(20);
            expect(destinationCanvas.height).toBe(20);

            expect(canvasData(originalCanvas, 0, 0, 20, 20))
                .toMatchCanvasArea(canvasData(destinationCanvas, 0, 0, 20, 20));

            done();
        }, null);
    });

    it('should call composeImages on one canvas and one SVG', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<canvas class="imgsrc" id="canvasSource" width="20" height="20" title="canvasSource"></canvas>' +
        '<svg class="imgsrc" id="svgSource1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100" height="100" title="svg1">' +
            '<circle id="c1" cx="10" cy="10" r="5" style="fill:red"/>' +
            '<circle id="c2" cx="30" cy="40" r="7" style="fill:#00FF00"/>' +
            '<circle id="c3" cx="50" cy="70" r="9" style="fill:blue"/>' +
        '</svg>' +
        '</div>' +
        '<canvas id="myCanvas" width="30" height="15" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('.imgsrc').toArray();

        var originalCanvas = document.getElementById("canvasSource");
        var destinationCanvas = document.getElementById("myCanvas");

        drawSomeLinesOnCanvas(originalCanvas);

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(120); //124 - //120 + 2 * 2px_spacing
            expect(destinationCanvas.height).toBe(100);

            expect(canvasData(originalCanvas, 0, 0, 20, 20))
                .toMatchCanvasArea(canvasData(destinationCanvas, 0, 80, 20, 20));

            expect(canvasData(destinationCanvas, 20 + 10, 10, 1, 1)).toMatchPixelColor([255, 0, 0, 255]); //24 + 10
            expect(canvasData(destinationCanvas, 20 + 30, 40, 1, 1)).toMatchPixelColor([0, 255, 0, 255]); //24 + 30
            expect(canvasData(destinationCanvas, 20 + 50, 70, 1, 1)).toMatchPixelColor([0, 0, 255, 255]); //24 + 50

            done();
        }, null);
    });

    it('should call composeImages on two canvases', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<canvas class="imgsrc" id="canvasSource1" width="20" height="20" title="canvasSource1"></canvas>' +
        '<canvas class="imgsrc" id="canvasSource2" width="20" height="20" title="canvasSource2"></canvas>' +
        '</div>' +
        '<canvas id="myCanvas" width="30" height="15" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('.imgsrc').toArray();

        var originalCanvas1 = document.getElementById("canvasSource1");
        var originalCanvas2 = document.getElementById("canvasSource2");
        var destinationCanvas = document.getElementById("myCanvas");

        drawARectangleOnCanvas(originalCanvas1, "#FF0000");
        drawARectangleOnCanvas(originalCanvas2, "#00FF00");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(40); //44 - //2 * 20 + 2 * spacing
            expect(destinationCanvas.height).toBe(20);

            expect(canvasData(originalCanvas1, 0, 0, 20, 20))
                .toMatchCanvasArea(canvasData(destinationCanvas, 0, 0, 20, 20));

            expect(canvasData(originalCanvas2, 0, 0, 20, 20))
                .toMatchCanvasArea(canvasData(destinationCanvas, 20 + 0, 0, 20, 20)); //20 + 4

            done();
        }, null);
    });

    it('should call composeImages on two partially overlapped canvases', function (done) {
        var sources = placeholder.html('<style type="text/css">' +
        '#canvasSource2 {position:relative; left:-10px;}' +
        '</style>' +
        '<div id="test-container" style="width: 600px;height: 400px">' +
        '<canvas class="imgsrc" id="canvasSource1" width="20" height="20" title="canvasSource1"></canvas>' +
        '<canvas class="imgsrc" id="canvasSource2" width="20" height="20" title="canvasSource2"></canvas>' +
        '</div>' +
        '<canvas id="myCanvas" width="30" height="15" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('.imgsrc').toArray();

        var originalCanvas1 = document.getElementById("canvasSource1");
        var originalCanvas2 = document.getElementById("canvasSource2");
        var destinationCanvas = document.getElementById("myCanvas");

        drawARectangleOnCanvas(originalCanvas1, "#FF0000");
        drawARectangleOnCanvas(originalCanvas2, "#00FF00");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(30); //34 - //2 * 20 + 2 * spacing - 10    //10px is the offset of the second canvas, defined in style
            expect(destinationCanvas.height).toBe(20);

            expect(canvasData(originalCanvas1, 0, 0, 10, 20)) //14
                .toMatchCanvasArea(canvasData(destinationCanvas, 0, 0, 10, 20)); //14

            expect(canvasData(originalCanvas2, 0, 0, 20, 20))
                .toMatchCanvasArea(canvasData(destinationCanvas, 20 + 0 - 10, 0, 20, 20)); //20 + 10 - 4

            done();
        }, null);
    });

    it('should call composeImages on two partially overlapped canvases. Same as above test, but the two canvases have the opposite Z order.', function (done) {
        var sources = placeholder.html('<style type="text/css">' +
        '#canvasSource2 {position:relative; left:-10px;}' +
        '</style>' +
        '<div id="test-container" style="width: 600px;height: 400px">' +
        '<canvas class="imgsrc" id="canvasSource1" width="20" height="20" title="canvasSource1"></canvas>' +
        '<canvas class="imgsrc" id="canvasSource2" width="20" height="20" title="canvasSource2"></canvas>' +
        '</div>' +
        '<canvas id="myCanvas" width="30" height="15" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('.imgsrc').toArray();

        var originalCanvas1 = document.getElementById("canvasSource1");
        var originalCanvas2 = document.getElementById("canvasSource2");
        var destinationCanvas = document.getElementById("myCanvas");

        drawARectangleOnCanvas(originalCanvas1, "#FF0000");
        drawARectangleOnCanvas(originalCanvas2, "#00FF00");

        sources.reverse(); //make sure the images are composed in the inverse order

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(30); //34 - //2 * 20 + 2 * spacing - 10    //10px is the offset of the second canvas, defined in style
            expect(destinationCanvas.height).toBe(20);

            expect(canvasData(originalCanvas1, 0, 0, 20, 20))
                .toMatchCanvasArea(canvasData(destinationCanvas, 0, 0, 20, 20));

            expect(canvasData(originalCanvas2, 0, 0, 20 - 10 + 0, 20)) //20 - 10 + 4
                .toMatchCanvasArea(canvasData(destinationCanvas, 20, 0, 20 - 10 + 0, 20)); //20 - 10 + 4

            done();
        }, null);
    });

    it('should call composeImages on two separate canvases, where one canvas is outside of view area', function (done) {
        var sources = placeholder.html('<style type="text/css">' +
        '#canvasSource2 {position:relative; left:-100px;}' +
        '</style>' +
        '<div id="test-container" style="width: 600px;height: 400px">' +
        '<canvas class="imgsrc" id="canvasSource1" width="20" height="20" title="canvasSource1"></canvas>' +
        '<canvas class="imgsrc" id="canvasSource2" width="20" height="20" title="canvasSource2"></canvas>' +
        '</div>' +
        '<canvas id="myCanvas" width="30" height="15" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('.imgsrc').toArray();

        var originalCanvas1 = document.getElementById("canvasSource1");
        var originalCanvas2 = document.getElementById("canvasSource2");
        var destinationCanvas = document.getElementById("myCanvas");

        drawARectangleOnCanvas(originalCanvas1, "#FF0000");
        drawARectangleOnCanvas(originalCanvas2, "#00FF00");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(100 - 0); //100 - 4
            expect(destinationCanvas.height).toBe(20);

            expect(canvasData(originalCanvas1, 0, 0, 20, 20))
                .toMatchCanvasArea(canvasData(destinationCanvas, 100 - 20 - 0, 0, 20, 20)); //100 - 20 - 10 + 6

            expect(canvasData(originalCanvas2, 0, 0, 20, 20))
                .toMatchCanvasArea(canvasData(destinationCanvas, 0, 0, 20, 20));

            done();
        }, null);
    });

    it('should call composeImages on one canvas and an SVG, which are totally overlapped with transparency', function (done) {
        var sources = placeholder.html('<style type="text/css">' +
        '#canvasSource1 {position:relative; left:-40px; top:-80px;}' +
        'circle { stroke: black; stroke-width: 2px;}' +
        '</style>' +
        '<div id="test-container" style="width: 600px;height: 400px">' +
        '<svg class="imgsrc" id="svgSource1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100" height="100" title="svg1">' +
            '<circle id="c1" cx="10" cy="10" r="5" style="fill:red"/>' +
            '<circle id="c2" cx="30" cy="40" r="7" style="fill:#00FF00"/>' +
            '<circle id="c3" cx="50" cy="70" r="9" style="fill:blue"/>' +
        '</svg>' +
        '<canvas class="imgsrc" id="canvasSource1" width="20" height="20" title="canvasSource1"></canvas>' +
        '</div>' +
        '<canvas id="myCanvas" width="150" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('.imgsrc').toArray();

        var originalCanvas1 = document.getElementById("canvasSource1");
        var destinationCanvas = document.getElementById("myCanvas");

        drawARectangleOnCanvas(originalCanvas1, "#FF0000");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(100);
            expect(destinationCanvas.height).toBe(100);

            expect(canvasData(originalCanvas1, 0, 0, 20, 20))
                .toMatchCanvasArea(canvasData(destinationCanvas, 100 - 40 + 0, 0, 20, 20)); //100 - 40 + 4

            expect(canvasData(destinationCanvas, 10, 10, 1, 1)).toMatchPixelColor([255, 0, 0, 255]);
            expect(canvasData(destinationCanvas, 30, 40, 1, 1)).toMatchPixelColor([0, 255, 0, 255]);
            expect(canvasData(destinationCanvas, 50, 70, 1, 1)).toMatchPixelColor([0, 0, 255, 255]);

            done();
        }, null);
    });

    it('should call composeImages on one canvas and an SVG, which are totally overlapped with transparency. The SVG has a different size than the ones from other tests. One component of the SVG is partially outside of the view area.', function (done) {
        var sources = placeholder.html('<style type="text/css">' +
        '#canvasSource1 {position:relative; left:-180px; top:-10px;}' +
        'circle { stroke: black; stroke-width: 4px;}' +
        '</style>' +
        '<div id="test-container" style="width: 600px;height: 400px">' +
        '<svg class="imgsrc" id="svgSource1" viewBox="0 0 250 150" xmlns="http://www.w3.org/2000/svg" width="250" height="150" title="svg1">' +
            '<circle id="c1" cx="230" cy="20" r="15" style="fill:red"/>' +
            '<circle id="c2" cx="175" cy="100" r="25" style="fill:#00FF00"/>' +
            '<circle id="c3" cx="50" cy="130" r="40" style="fill:blue"/>' +
        '</svg>' +
        '<canvas class="imgsrc" id="canvasSource1" width="20" height="20" title="canvasSource1"></canvas>' +
        '</div>' +
        '<canvas id="myCanvas" width="150" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('.imgsrc').toArray();

        var originalCanvas1 = document.getElementById("canvasSource1");
        var destinationCanvas = document.getElementById("myCanvas");

        drawARectangleOnCanvas(originalCanvas1, "#FF0000");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(250);
            expect(destinationCanvas.height).toBe(150);

            expect(canvasData(originalCanvas1, 0, 0, 20, 20))
                .toMatchCanvasArea(canvasData(destinationCanvas, 250 - 180 + 0, 150 - 10 - 20, 20, 20)); //250 - 180 + 4

            //circle centers
            expect(canvasData(destinationCanvas, 230, 20, 1, 1)).toMatchPixelColor([255, 0, 0, 255]);
            expect(canvasData(destinationCanvas, 175, 100, 1, 1)).toMatchPixelColor([0, 255, 0, 255]);
            expect(canvasData(destinationCanvas, 50, 130, 1, 1)).toMatchPixelColor([0, 0, 255, 255]);

            //other points on circles should match the required colors, because of configured diameters
            expect(canvasData(destinationCanvas, 220, 17, 1, 1)).toMatchPixelColor([255, 0, 0, 255]);
            expect(canvasData(destinationCanvas, 190, 114, 1, 1)).toMatchPixelColor([0, 255, 0, 255]);
            expect(canvasData(destinationCanvas, 80, 149, 1, 1)).toMatchPixelColor([0, 0, 255, 255]);

            //verify a pixel from the circle border, if it comes from a black line (almost black, because of antialiasing), as described in svg style
            expect(canvasData(destinationCanvas, 79, 102, 1, 1)).toMatchPixelColorWithError([0, 0, 0, 255, 15]);

            done();
        }, null);
    });

    it('should call composeImages on one canvas and an SVG, which are totally overlapped with transparency, using external CSS. The SVG has a different size than the ones from other tests. One component of the SVG is partially outside of the view area.', function (done) {
        var sources = placeholder.html('<style type="text/css">' +
        '#canvasSource1 {position:relative; left:-180px; top:-10px;}' +
        '</style>' +
        '<div id="test-container" style="width: 600px;height: 400px">' +
        '<svg class="imgsrc" id="svgSource1" viewBox="0 0 250 150" xmlns="http://www.w3.org/2000/svg" width="250" height="150" title="svg1">' +
            '<circle class="externalCSS" id="c1" cx="230" cy="20" r="15" style="fill:red"/>' +
            '<circle class="externalCSS" id="c2" cx="175" cy="100" r="25" style="fill:#00FF00"/>' +
            '<circle class="externalCSS" id="c3" cx="50" cy="130" r="40" style="fill:blue"/>' +
        '</svg>' +
        '<canvas class="imgsrc" id="canvasSource1" width="20" height="20" title="canvasSource1"></canvas>' +
        '</div>' +
        '<canvas id="myCanvas" width="150" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('.imgsrc').toArray();

        var originalCanvas1 = document.getElementById("canvasSource1");
        var destinationCanvas = document.getElementById("myCanvas");

        drawARectangleOnCanvas(originalCanvas1, "#FF0000");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(250);
            expect(destinationCanvas.height).toBe(150);
            expect(canvasData(originalCanvas1, 0, 0, 20, 20))
                .toMatchCanvasArea(canvasData(destinationCanvas, 250 - 180 + 0, 150 - 10 - 20, 20, 20)); //250 - 180 + 4

            //circle centers
            expect(canvasData(destinationCanvas, 230, 20, 1, 1)).toMatchPixelColor([255, 0, 0, 255]);
            expect(canvasData(destinationCanvas, 175, 100, 1, 1)).toMatchPixelColor([0, 255, 0, 255]);
            expect(canvasData(destinationCanvas, 50, 130, 1, 1)).toMatchPixelColor([0, 0, 255, 255]);

            //other points on circles should match the required colors, because of configured diameters
            expect(canvasData(destinationCanvas, 220, 17, 1, 1)).toMatchPixelColor([255, 0, 0, 255]);
            expect(canvasData(destinationCanvas, 190, 114, 1, 1)).toMatchPixelColor([0, 255, 0, 255]);
            expect(canvasData(destinationCanvas, 80, 149, 1, 1)).toMatchPixelColor([0, 0, 255, 255]);

            //verify a pixel from the circle border, if it comes from a black line (almost black, because of antialiasing), as described in svg style
            expect(canvasData(destinationCanvas, 79, 102, 1, 1)).toMatchPixelColorWithError([0, 0, 0, 255, 15]);

            done();
        }, null);
    });

    it('should call composeImages on one dynamically created canvas as a source, without being able to compose', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '</div>' +
        '<canvas id="myCanvas" width="30" height="15" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('#canvasSource').toArray();

        var originalCanvas = document.createElement('canvas');
        originalCanvas.width = 20;
        originalCanvas.height = 20;
        drawSomeLinesOnCanvas(originalCanvas);
        sources.push(originalCanvas);

        var destinationCanvas = document.getElementById("myCanvas");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(30);
            expect(destinationCanvas.height).toBe(15);

            done();
        }, null);
    });

    it('should call composeImages on two dynamically created canvas as sources, without being able to compose', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '</div>' +
        '<canvas id="myCanvas" width="30" height="15" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('#canvasSource').toArray();

        var originalCanvas = document.createElement('canvas');
        originalCanvas.width = 20;
        originalCanvas.height = 20;
        drawSomeLinesOnCanvas(originalCanvas);
        sources.push(originalCanvas);

        originalCanvas = document.createElement('canvas');
        originalCanvas.width = 20;
        originalCanvas.height = 20;
        drawSomeLinesOnCanvas(originalCanvas);
        sources.push(originalCanvas);

        var destinationCanvas = document.getElementById("myCanvas");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(30);
            expect(destinationCanvas.height).toBe(15);

            done();
        }, null);
    });

    it('should call composeImages on two dynamically created canvas as sources (with left/top properties set), without being able to compose', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '</div>' +
        '<canvas id="myCanvas" width="30" height="15" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('#canvasSource').toArray();

        var originalCanvas = document.createElement('canvas');
        originalCanvas.width = 20;
        originalCanvas.height = 20;
        originalCanvas.left = 0;
        originalCanvas.top = 0;
        drawSomeLinesOnCanvas(originalCanvas);
        sources.push(originalCanvas);

        originalCanvas = document.createElement('canvas');
        originalCanvas.width = 20;
        originalCanvas.height = 20;
        originalCanvas.left = 0;
        originalCanvas.top = 0;
        drawSomeLinesOnCanvas(originalCanvas);
        sources.push(originalCanvas);

        var destinationCanvas = document.getElementById("myCanvas");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(30);
            expect(destinationCanvas.height).toBe(15);

            done();
        }, null);
    });

    it('should call composeImages on one canvas as a source and a dynamically generated destination Canvas', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<canvas id="canvasSource" width="20" height="20" title="canvasSource"></canvas>' +
        '</div>'
        ).find('#canvasSource').toArray();

        var originalCanvas = document.getElementById("canvasSource");
        var destinationCanvas = document.createElement("canvas");
        destinationCanvas.width = 30;
        destinationCanvas.height = 15;

        drawSomeLinesOnCanvas(originalCanvas);

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(20);
            expect(destinationCanvas.height).toBe(20);

            expect(canvasData(originalCanvas, 0, 0, 20, 20))
                .toMatchCanvasArea(canvasData(destinationCanvas, 0, 0, 20, 20));

            done();
        }, null);
    });

    xit('should call composeImages on one SVG as a source, which defines only its viewbox, without width and height', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<svg id="svgSource" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" title="svg">' +
            '<circle id="c1" cx="10" cy="10" r="5" style="fill:red"/>' +
            '<circle id="c2" cx="30" cy="40" r="7" style="fill:#00FF00"/>' +
            '<circle id="c3" cx="50" cy="70" r="9" style="fill:blue"/>' +
        '</svg>' +
        '</div>' +
        '<canvas id="myCanvas" width="300" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('svg').toArray();

        var destinationCanvas = document.getElementById("myCanvas");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(600);
            expect(destinationCanvas.height).toBe(600);
            expect(canvasData(destinationCanvas, 10, 10, 1, 1)).toMatchPixelColor([255, 0, 0, 255]);
            expect(canvasData(destinationCanvas, 30, 40, 1, 1)).toMatchPixelColor([0, 255, 0, 255]);
            expect(canvasData(destinationCanvas, 50, 70, 1, 1)).toMatchPixelColor([0, 0, 255, 255]);

            done();
        }, null);
    });

    xit('should call composeImages on one SVG as a source, which defines only its width and height, without its viewbox', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<svg id="svgSource" xmlns="http://www.w3.org/2000/svg" width="100" height="100" title="svg">' +
            '<circle id="c1" cx="10" cy="10" r="5" style="fill:red"/>' +
            '<circle id="c2" cx="30" cy="40" r="7" style="fill:#00FF00"/>' +
            '<circle id="c3" cx="50" cy="70" r="9" style="fill:blue"/>' +
        '</svg>' +
        '</div>' +
        '<canvas id="myCanvas" width="300" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('svg').toArray();

        var destinationCanvas = document.getElementById("myCanvas");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(100);
            expect(destinationCanvas.height).toBe(100);
            expect(canvasData(destinationCanvas, 10, 10, 1, 1)).toMatchPixelColor([255, 0, 0, 255]);
            expect(canvasData(destinationCanvas, 30, 40, 1, 1)).toMatchPixelColor([0, 255, 0, 255]);
            expect(canvasData(destinationCanvas, 50, 70, 1, 1)).toMatchPixelColor([0, 0, 255, 255]);

            done();
        }, null);
    });

    xit('should call composeImages on one potentially unsupported SVG as a source, because it contains "uses". Only its viewBox is defined.', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<svg class="legendLayer" style="width:inherit;height:inherit;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
            '<defs>' +
                '<symbol id="line" fill="none" viewBox="-5 -5 25 25">' +
                    '<polyline points="0,15 5,5 10,10 15,0"></polyline>' +
                '</symbol>' +
            '</defs>' +
            '<g>' +
                '<use xlink:href="#line" class="legendIcon" x="0em" y="0em" stroke="#82A3D1" stroke-width="2" width="1.5em" height="1.5em"></use>' +
                '<text x="0em" y="0em" text-anchor="start"><tspan dx="2em" dy="1.2em">Plot 1</tspan></text>' +
            '</g>' +
            '<g>' +
                '<use xlink:href="#line" class="legendIcon" x="0em" y="1.5em" stroke="#862323" stroke-width="1" width="1.5em" height="1.5em"></use>' +
                '<text x="0em" y="1.5em" text-anchor="start"><tspan dx="2em" dy="1.2em">Plot 2</tspan></text>' +
            '</g>' +
        '</svg>' +
        '</div>' +
        '<canvas id="myCanvas" width="300" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('svg').toArray();

        var destinationCanvas = document.getElementById("myCanvas");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(600);
            expect(destinationCanvas.height).toBe(400);

            done();
        }, null);
    });

    xit('should call composeImages on one potentially unsupported SVG as a source, because it contains "uses". Only the width and height properties are defined.', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<svg class="legendLayer" style="width:inherit;height:inherit;" xmlns="http://www.w3.org/2000/svg" width="20" height="20">' +
            '<defs>' +
                '<symbol id="line" fill="none" viewBox="-5 -5 25 25">' +
                    '<polyline points="0,15 5,5 10,10 15,0"></polyline>' +
                '</symbol>' +
            '</defs>' +
            '<g>' +
                '<use xlink:href="#line" class="legendIcon" x="0em" y="0em" stroke="#82A3D1" stroke-width="2" width="1.5em" height="1.5em"></use>' +
                '<text x="0em" y="0em" text-anchor="start"><tspan dx="2em" dy="1.2em">Plot 1</tspan></text>' +
            '</g>' +
            '<g>' +
                '<use xlink:href="#line" class="legendIcon" x="0em" y="1.5em" stroke="#862323" stroke-width="1" width="1.5em" height="1.5em"></use>' +
                '<text x="0em" y="1.5em" text-anchor="start"><tspan dx="2em" dy="1.2em">Plot 2</tspan></text>' +
            '</g>' +
        '</svg>' +
        '</div>' +
        '<canvas id="myCanvas" width="300" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('svg').toArray();

        var destinationCanvas = document.getElementById("myCanvas");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(600);
            expect(destinationCanvas.height).toBe(400);

            done();
        }, null);
    });

    it('should call composeImages on one potentially unsupported SVG as a source, because it contains "uses". ViewBox, width and height properties are defined.', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<svg class="legendLayer" style="width:inherit;height:inherit;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100">' +
            '<defs>' +
                '<symbol id="line" fill="none" viewBox="-5 -5 25 25">' +
                    '<polyline points="0,15 5,5 10,10 15,0"></polyline>' +
                '</symbol>' +
            '</defs>' +
            '<g>' +
                '<use xlink:href="#line" class="legendIcon" x="0em" y="0em" stroke="#82A3D1" stroke-width="2" width="1.5em" height="1.5em"></use>' +
                '<text x="0em" y="0em" text-anchor="start"><tspan dx="2em" dy="1.2em">Plot 1</tspan></text>' +
            '</g>' +
            '<g>' +
                '<use xlink:href="#line" class="legendIcon" x="0em" y="1.5em" stroke="#862323" stroke-width="1" width="1.5em" height="1.5em"></use>' +
                '<text x="0em" y="1.5em" text-anchor="start"><tspan dx="2em" dy="1.2em">Plot 2</tspan></text>' +
            '</g>' +
        '</svg>' +
        '</div>' +
        '<canvas id="myCanvas" width="300" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('svg').toArray();

        var destinationCanvas = document.getElementById("myCanvas");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(600);
            expect(destinationCanvas.height).toBe(400);

            done();
        }, null);
    });

    xit('should call composeImages on one empty SVG as a source. This may block composeImages.', function (done) {
        var sources = placeholder.html('<div id="test-container" style="width: 600px;height: 400px">' +
        '<svg class="legendLayer" style="width:inherit;height:inherit;" xmlns="http://www.w3.org/2000/svg" id="blockingTest">' +
        '</svg>' +
        '</div>' +
        '<canvas id="myCanvas" width="300" height="150" style="border:1px solid #d3d3d3;"></canvas>'
        ).find('svg').toArray();

        var destinationCanvas = document.getElementById("myCanvas");

        composeImages(sources, destinationCanvas).then(function() {
            expect(destinationCanvas.width).toBe(600);
            expect(destinationCanvas.height).toBe(400);

            done();
        }, null);
    });


    function drawSomeLinesOnCanvas(canvas) {
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(19, 19);
        ctx.moveTo(3, 18);
        ctx.lineTo(17, 5);
        ctx.stroke();
    }

    function drawARectangleOnCanvas(canvas, color) {
        var ctx = canvas.getContext('2d');
        ctx.rect(0, 0, 20, 20);
        ctx.fillStyle = color;
        ctx.fill();
    }
});
