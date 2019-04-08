## jquery.flot.drawSeries.js

This plugin is used by flot for drawing lines, plots, bars or area.

### Public methods


- drawSeriesLines(series, ctx, plotOffset, plotWidth, plotHeight, drawSymbol, getColorOrGradient)

 This function is used for drawing lines or area fill.  In case the series has line decimation function
 attached, before starting to draw, as an optimization the points will first be decimated.

 The series parameter contains the series to be drawn on ctx context. The plotOffset, plotWidth and
 plotHeight are the corresponding parameters of flot used to determine the drawing surface.
 The function getColorOrGradient is used to compute the fill style of lines and area.


- drawSeriesPoints(series, ctx, plotOffset, plotWidth, plotHeight, drawSymbol, getColorOrGradient)

 This function is used for drawing points using a given symbol. In case the series has points decimation
 function attached, before starting to draw, as an optimization the points will first be decimated.

 The series parameter contains the series to be drawn on ctx context. The plotOffset, plotWidth and
 plotHeight are the corresponding parameters of flot used to determine the drawing surface.
 The function drawSymbol is used to compute and draw the symbol chosen for the points.


- drawSeriesBars(series, ctx, plotOffset, plotWidth, plotHeight, drawSymbol, getColorOrGradient)

 This function is used for drawing series represented as bars. In case the series has decimation
 function attached, before starting to draw, as an optimization the points will first be decimated.

 The series parameter contains the series to be drawn on ctx context. The plotOffset, plotWidth and
 plotHeight are the corresponding parameters of flot used to determine the drawing surface.
 The function getColorOrGradient is used to compute the fill style of bars.
