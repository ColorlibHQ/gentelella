/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe("colorhelpers plugin", function() {

    it('can make a new color', function () {
        var color = $.color.make(10, 20, 30, 0.5);
        expect(color.r).toBe(10);
        expect(color.g).toBe(20);
        expect(color.b).toBe(30);
        expect(color.a).toBe(0.5);
    });

    it('scales the specified components with given factor', function () {
        var color = $.color.make(10, 20, 30, 0.5);

        var factor = 0.2;
        color.scale('ga', factor);

        expect(color.r).toBe(10);
        expect(color.g).toBe(20 * factor);
        expect(color.b).toBe(30);
        expect(color.a).toBe(0.5 * factor);
    });

    it('adds to the specified component a given delta', function () {
        var color = $.color.make(10, 20, 30, 0.5);

        var delta = 3;
        color.add('rb', delta);

        expect(color.r).toBe(10 + delta);
        expect(color.g).toBe(20);
        expect(color.b).toBe(30 + delta);
        expect(color.a).toBe(0.5);
    });

    it('normalizes the invalid values', function () {
        var color = $.color.make(-1, 256, 200.1, -0.1);
        expect(color.r).toBe(0);
        expect(color.g).toBe(255);
        expect(color.b).toBe(200);
        expect(color.a).toBe(0);
    });

    it('normalizes the invalid values', function () {
        var color = $.color.make(-1, 256, 200.1, -0.1);
        expect(color.r).toBe(0);
        expect(color.g).toBe(255);
        expect(color.b).toBe(200);
        expect(color.a).toBe(0);
    });

    it('can make a new color object based on different color format string', function() {
        [
            'rgb(17, 170, 187)',
            'rgba(17, 170, 187, 1)',
            '#1ab',
            '#11aabb'
        ].forEach(function(str) {
            color = $.color.parse(str);

            expect(color.r).toBe(17);
            expect(color.g).toBe(170);
            expect(color.b).toBe(187);
            expect(color.a).toBe(1);
        });
    });

    it('can make a new color object based on a named color string', function() {
        [
            { str: 'darkolivegreen', rgba: [85, 107, 47, 1] },
            { str: 'transparent', rgba: [255, 255, 255, 0] }
        ].forEach(function(tc) {
            color = $.color.parse(tc.str);

            expect(color.r).toBe(tc.rgba[0]);
            expect(color.g).toBe(tc.rgba[1]);
            expect(color.b).toBe(tc.rgba[2]);
            expect(color.a).toBe(tc.rgba[3]);
        });
    });

    describe('by looking in DOM', function() {

        var testElement;

        beforeEach(function() {
            testElement = setFixtures('<div style="color: red"><div id="test-element" style="background-color: yellow" /></div>')
                .find('#test-element');
        });

        it('extracts a specified CSS color from a given element', function() {
            var color = $.color.extract(testElement, 'background-color');

            expect($.color.parse('yellow').toString()).toBe(color.toString());
        });

        it('extracts a specified CSS color from the parent of a given element', function() {
            var color = $.color.extract(testElement, 'color');

            expect($.color.parse('red').toString()).toBe(color.toString());
        });

    });

});
