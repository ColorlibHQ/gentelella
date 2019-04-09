/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe("flot legend plugin", function() {
    var placeholder, plot;
    var options, legendContainer, legendSettings

    beforeEach(function() {
        var legendSettings = {
                position: "nw",
                show: true,
                container: null
            };

        options = {
            legend: legendSettings,
            series: {
                shadowSize: 0, // don't draw shadows
            }
        };

        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
    });

    var positions = ['nw', 'ne', 'sw', 'se'];
    positions.forEach(function (pos) {
        it ('shold draw a legend over graph at cardinal position: ' + pos + ', if a container is not provided', function () {
            options.legend.position = pos;
            plot = $.plot(placeholder, [[1, 3, 5, 6]], options);

            var legend = document.getElementsByClassName('legend')[0];

            expect(legend.style.position).toBe('absolute');
            switch (pos) {
                case "nw":
                    expect(legend.style.top).toContain('px')
                    expect(legend.style.bottom).toBe('');
                    expect(legend.style.left).toContain('px')
                    expect(legend.style.right).toBe('');
                    break;
                case "ne":
                    expect(legend.style.top).toContain('px')
                    expect(legend.style.bottom).toBe('');
                    expect(legend.style.left).toBe('');
                    expect(legend.style.right).toContain('px')
                    break;
                case "sw":
                    expect(legend.style.top).toBe('');
                    expect(legend.style.bottom).toContain('px')
                    expect(legend.style.left).toContain('px')
                    expect(legend.style.right).toBe('');
                    break;
                case "se":
                    expect(legend.style.top).toBe('');
                    expect(legend.style.bottom).toContain('px')
                    expect(legend.style.left).toBe('');
                    expect(legend.style.right).toContain('px')
                    break;
            }
        });
    });

    it('should draw the legend inside the container if one is provided', function(){
        var legendContainer = document.createElement("div");
        document.body.appendChild(legendContainer);

        options.legend.container = legendContainer;
        plot = $.plot(placeholder, [[1, 3, 5, 6]], options);

        expect(legendContainer.style.width).toContain('em');
        expect(legendContainer.style.height).toContain('em');
        document.body.removeChild(legendContainer);
    });

    it('should assign a default plot label if none is provided', function(){
        plot = $.plot(placeholder, [[1, 3, 5, 6]], options);

        var legendSvg = document.getElementsByClassName('legendLayer')[0];
        var firstLegendEntry = legendSvg.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'g')[0];
        var entryLabel = firstLegendEntry.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'text')[0];

        expect(entryLabel.textContent).toBe('Plot 1');
    });

    it('should display the plot label', function(){
        var label = 'custom label';
        options.series.label = label;
        plot = $.plot(placeholder, [[1, 3, 5, 6]], options);

        var legendSvg = document.getElementsByClassName('legendLayer')[0];
        var firstLegendEntry = legendSvg.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'g')[0];
        var entryLabel =  firstLegendEntry.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'text')[0];

        expect(entryLabel.textContent).toBe(label);
    });

    it('should take into account the show option', function() {
        options.legend.show = false;
        plot = $.plot(placeholder, [[1, 3, 5, 6]], options);

        var legendSvg = document.getElementsByClassName('legendLayer')[0];

        expect(legendSvg).toBe(undefined);
    });
});

