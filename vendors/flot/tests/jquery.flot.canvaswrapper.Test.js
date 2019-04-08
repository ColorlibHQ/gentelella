/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe('CanvasWrapper', function() {
    var placeholder;
    beforeEach(function() {
        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
    });

    it('should create a new canvas element', function() {
        var canvas = new Flot.Canvas('myCanvas', placeholder[0]);

        expect(canvas.element).toBeTruthy();
        expect(placeholder.find('.myCanvas')).toBeTruthy();
    });

    it('should reuse an existing canvas with the same class', function() {
        var canvas1 = new Flot.Canvas('myCanvas', placeholder[0]);
        var element1 = placeholder.find('.myCanvas')[0];

        var canvas2 = new Flot.Canvas('myCanvas', placeholder[0]);
        var element2 = placeholder.find('.myCanvas')[0];

        expect(element1).toBe(element2);
        expect(placeholder.find('.myCanvas').length).toBe(1);
    });

    it('should resize the canvas to the given width and height', function() {
        var canvas = newCanvas(placeholder);

        canvas.resize(222, 333);

        expect(canvas.width).toBe(222);
        expect(canvas.height).toBe(333);
        expect(canvas.element.style.width).toBe('222px');
        expect(canvas.element.style.height).toBe('333px');
    });

    it('should resize the canvas but not less than a minimum width and height', function() {
        var canvas = newCanvas(placeholder);

        canvas.resize(0, 0);

        expect(canvas.width).toBe(10);
        expect(canvas.height).toBe(10);
        expect(canvas.element.style.width).toBe('10px');
        expect(canvas.element.style.height).toBe('10px');
    });

    it('should measure the width and height of a text', function() {
        var canvas = newCanvas(placeholder);

        var info = canvas.getTextInfo('', 'text');

        expect(info.width).toBeGreaterThan(0);
        expect(info.height).toBeGreaterThan(0);
    });

    it('should measure the width and height of a text based on its own CSS', function() {
        var canvas = newCanvas(placeholder);
        appendSetStyleFixtures('.a { font-size: 10px; }');
        appendSetStyleFixtures('.b { font-size: 20px; }');

        var info1 = canvas.getTextInfo('', 'text', 'a');
        var info2 = canvas.getTextInfo('', 'text', 'b');

        expect(info2.width).toBeGreaterThan(info1.width);
        expect(info2.height).toBeGreaterThan(info1.height);
    });

    it('should measure the width and height of a text based on its layer CSS', function() {
        var canvas = newCanvas(placeholder);
        appendSetStyleFixtures('.a { font-size: 10px; }');
        appendSetStyleFixtures('.b { font-size: 20px; }');

        var info1 = canvas.getTextInfo('a', 'text');
        var info2 = canvas.getTextInfo('b', 'text');

        expect(info2.width).toBeGreaterThan(info1.width);
        expect(info2.height).toBeGreaterThan(info1.height);
    });

    it('should measure the width of a text based on its actual length', function() {
        var canvas = newCanvas(placeholder);
        appendSetStyleFixtures('.a { font-size: 10px; }');

        var info1 = canvas.getTextInfo('a', 'text');
        var info2 = canvas.getTextInfo('a', 'longer text');

        expect(info2.width).toBeGreaterThan(info1.width);
    });

    it('should return the same width and height for numbers with the same digit count', function() {
        var canvas = newCanvas(placeholder);
        var info1 = canvas.getTextInfo('', '01234');
        var info2 = canvas.getTextInfo('', '56789');

        expect(info2.width).toBe(info1.width);
    });

    it('should add text at the given layer, coords, and font CSS', function() {
        var canvas = newCanvas(placeholder);
        canvas.addText('layer', 100, 200, '123', 'a');
        canvas.render();

        var elem = placeholder.find('.a')[0],
            box = elem.getBoundingClientRect();
        //TODO Raluca: This should be fixed. Given the starting position for drawing SVG text element, there is a difference between HTML and SVG element placement.
        //expect(box.left).toBe(100);
        //expect(box.top).toBe(200);
        expect(elem.className.baseVal).toBe('a');
        expect(elem.parentNode.className.baseVal).toBe('layer');
    });

    it('should add the same text with the same CSS at different coords', function() {
        var canvas = newCanvas(placeholder);
        canvas.addText('layerA', 100, 200, '123', 'a');
        canvas.addText('layerA', 300, 400, '123', 'a');
        canvas.render();

        var elem1 = placeholder.find('.a')[0],
            elem2 = placeholder.find('.a')[1],
            box1 = elem1.getBoundingClientRect(),
            box2 = elem2.getBoundingClientRect();
        expect(elem2.textContent).toBe(elem2.textContent);
        expect(box2.left).not.toBe(box1.left);
        expect(box2.top).not.toBe(box1.top);
    });

    it('should add different text with the same CSS at different coords', function() {
        var canvas = newCanvas(placeholder);
        canvas.addText('layerA', 100, 200, '123', 'a');
        canvas.addText('layerA', 300, 400, '456', 'a');
        canvas.render();

        var elem1 = placeholder.find('.a')[0],
            elem2 = placeholder.find('.a')[1],
            box1 = elem1.getBoundingClientRect(),
            box2 = elem2.getBoundingClientRect();
        expect(elem2.textContent).not.toBe(elem1.textContent);
        expect(box2.left).not.toBe(box1.left);
        expect(box2.top).not.toBe(box1.top);
    });

    it('should add different text with the same CSS and the same coords', function() {
        var canvas = newCanvas(placeholder);
        canvas.addText('layerA', 100, 200, '123', 'a');
        canvas.addText('layerA', 100, 200, '456', 'a');
        canvas.addText('layerA', 100, 200, '7890', 'a');
        canvas.render();

        var elems = placeholder.find('.a');
        expect(elems.length).toBe(3);
    });

    it('should add multiple tspan for text that contains br tag', function() {
        var canvas = newCanvas(placeholder);
        canvas.addText('layerA', 100, 200, '1<br>2<br>3<br>4', 'a');
        canvas.render();

        var elem = placeholder.find('.a')[0];
        expect(elem.childNodes.length).toBe(4);
    });

    it('should update the tspan element content', function() {
        var canvas = newCanvas(placeholder);
        canvas.addText('layerA', 100, 200, '1<br>2<br>3', 'a');
        canvas.render();

        canvas.removeText('layerA', 100, 200, '1<br>2<br>3', 'a');
        canvas.addText('layerA', 130, 230, '1<br>2<br>3<br>4', 'a');
        canvas.render();

        var elem = placeholder.find('.a')[0];
        expect(elem.childNodes.length).toBe(4);
    });

    it('should update the cache position of the elements', function() {
        var canvas = newCanvas(placeholder);
        canvas.addText('layerA', 100, 200, '123', 'a');
        canvas.render();

        canvas.removeText('layerA', 100, 200, '123', 'a');
        canvas.addText('layerA', 130, 230, '123', 'a');
        canvas.render();

        canvas.addText('layerA', 100, 200, '123', 'a');
        canvas.render();

        var elems = placeholder.find('.a');
        expect(elems.length).toBe(2);
    });

    it('should not add the same text with the same CSS and the same coords twice', function() {
        var canvas = newCanvas(placeholder);
        canvas.addText('layerA', 100, 200, '123', 'a');
        canvas.addText('layerA', 100, 200, '123', 'a');
        canvas.render();

        var elems = placeholder.find('.a');
        expect(elems.length).toBe(1);
    });

    it('should remove all text from a given layer', function() {
        var canvas = newCanvas(placeholder);
        canvas.addText('layerA', 100, 200, '123', 'a');
        canvas.addText('layerA', 300, 400, '123', 'a');
        canvas.addText('layerA', 500, 600, '456', 'b');
        canvas.addText('layerA', 700, 800, '456', 'b');
        canvas.addText('layerB', 200, 100, '123', 'c');
        canvas.addText('layerB', 400, 300, '456', 'c');
        canvas.render();

        canvas.removeText('layerA', NaN, NaN, null);
        canvas.render();

        var as = placeholder.find('.a'),
            bs = placeholder.find('.b'),
            cs = placeholder.find('.c');
        expect(as.length).toBe(0);
        expect(bs.length).toBe(0);
        expect(cs.length).toBe(2);
    });

    it('should remove specific text from specific layer and coords', function() {
        var canvas = newCanvas(placeholder);
        canvas.addText('layerA', 100, 200, '123', 'a');
        canvas.addText('layerA', 300, 400, '123', 'a');
        canvas.addText('layerA', 500, 600, '123', 'b');
        canvas.addText('layerA', 700, 800, '123', 'b');
        canvas.addText('layerB', 200, 100, '123', 'c');
        canvas.addText('layerB', 400, 300, '123', 'c');
        canvas.render();

        canvas.removeText('layerA', 300, 400, '123', 'a');
        canvas.render();

        var as = placeholder.find('.a'),
            bs = placeholder.find('.b'),
            cs = placeholder.find('.c');
        expect(as.length).toBe(1);
        expect(bs.length).toBe(2);
        expect(cs.length).toBe(2);
    });

    it('should remove specific text from specific layer and coords when more texts overlaps', function() {
        var canvas = newCanvas(placeholder);
        canvas.addText('layerA', 100, 200, '123', 'a');
        canvas.addText('layerA', 100, 200, '456', 'a');
        canvas.addText('layerA', 100, 200, '7890', 'a');
        canvas.render();
        var initialTextElements = placeholder.find('.a');
        expect(initialTextElements.length).toBe(3);

        canvas.removeText('layerA', 100, 200, '456', 'a');
        canvas.render();

        var finalTextElements = placeholder.find('.a');
        expect(finalTextElements.length).toBe(2);
        var remainingTexts = [finalTextElements[0].textContent, finalTextElements[1].textContent];
        expect(remainingTexts).toContain('123');
        expect(remainingTexts).toContain('7890');
    });

    it('should remove all text', function() {
        var canvas = newCanvas(placeholder);
        canvas.addText('layerA', 100, 200, '123', 'a');
        canvas.addText('layerA', 300, 400, '456', 'b');
        canvas.addText('layerB', 500, 600, '789', 'c');
        canvas.render();

        canvas.clearCache();

        var as = placeholder.find('.a'),
            bs = placeholder.find('.b'),
            cs = placeholder.find('.c');
        expect(as.length).toBe(0);
        expect(bs.length).toBe(0);
        expect(cs.length).toBe(0);
    });

    it('should move&replace obsolete text', function() {
        var canvas = newCanvas(placeholder);
        canvas.addText('layerA', 100, 200, '123', 'a');
        canvas.render();

        var elem = placeholder.find('.a')[0];
        elem._marker = '_marker';

        canvas.removeText('layerA', NaN, NaN, null);
        canvas.addText('layerA', 300, 400, '456', 'a');
        canvas.render();

        elem = placeholder.find('.a')[0];
        expect(elem._marker).toBe('_marker');
    });

    it('should work with an object instead of a class name', function() {
        var canvas = newCanvas(placeholder)
            settings = {
                style: 'normal',
                variant: 'normal',
                weight: '400',
                size: '40',
                lineHeight: '23',
                family: '"Times New Roman"',
                fill: 'rgb(100, 200, 0)'
            };
        var info = canvas.getTextInfo('layerA', '123', settings);
        expect(info.width).toBeGreaterThan(10);

        canvas.addText('layerA', 100, 200, '123', settings);
        canvas.render();
        var as = placeholder.find('.layerA'),
            style = window.getComputedStyle(as[0].firstChild),
            layerAColor = $.color.parse(style.fill),
            styleColor = $.color.parse(settings.fill);
        expect(as.length).toBe(1);
        expect(style.fontFamily).toContain(settings.family.slice(1, -1));
        expect(layerAColor.toString()).toBe(styleColor.toString());

        canvas.removeText('layerA', 100, 200, '123', settings);
        canvas.render();
        as = placeholder.find('.a');
        expect(as.length).toBe(0);
    });

    function newCanvas(placeholder) {
        return new Flot.Canvas('myCanvas', placeholder[0]);
    }
});
