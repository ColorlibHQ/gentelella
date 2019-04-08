## jquery.flot.canvaswrapper

This plugin contains the function for creating and manipulating both the canvas
layers and svg layers.

The Canvas object is a wrapper around an HTML5 canvas tag.
The constructor Canvas(cls, container) takes as parameters cls,
the list of classes to apply to the canvas adnd the containter,
element onto which to append the canvas. The canvas operations
don't work unless the canvas is attached to the DOM.

### jquery.canvaswrapper.js API functions


- resize(width, height)

 Resizes the canvas to the given dimensions.
 The width represents the new width of the canvas, meanwhile the height
 is the new height of the canvas, both of them in pixels.


- clear()

 Clears the entire canvas area, not including any overlaid HTML text


- render()

 Finishes rendering the canvas, including managing the text overlay.


- getSVGLayer(classes)

 Creates (if necessary) and returns the SVG overlay container.
 The classes string represents the string of space-separated CSS classes
 used to uniquely identify the text layer. It return the svg-layer div.


- getTextInfo(layer, text, font, angle, width)

 Creates (if necessary) and returns a text info object.
 The object looks like this:
 ```js
 {
     width //Width of the text's wrapper div.
     height //Height of the text's wrapper div.
     element //The HTML div containing the text.
     positions //Array of positions at which this text is drawn.
  }
  ```
  The positions array contains objects that look like this:
  ```js
  {
     active //Flag indicating whether the text should be visible.
     rendered //Flag indicating whether the text is currently visible.
     element //The HTML div containing the text.
     text //The actual text and is identical with element[0].textContent.
     x //X coordinate at which to draw the text.
     y //Y coordinate at which to draw the text.
  }
  ```
  Each position after the first receives a clone of the original element.
  The idea is that that the width, height, and general 'identity' of the
  text is constant no matter where it is placed; the placements are a
  secondary property.

  Canvas maintains a cache of recently-used text info objects; getTextInfo
  either returns the cached element or creates a new entry.

 The layer parameter is string of space-separated CSS classes uniquely
 identifying the layer containing this text.
 Text is the text string to retrieve info for.
 Font is either a string of space-separated CSS classes or a font-spec object,
 defining the text's font and style.
 Angle is the angle at which to rotate the text, in degrees. Angle is currently unused,
 it will be implemented in the future.
 The last parameter is the Maximum width of the text before it wraps.
 The method returns a text info object.


- addText (layer, x, y, text, font, angle, width, halign, valign, transforms)

 Adds a text string to the canvas text overlay.
 The text isn't drawn immediately; it is marked as rendering, which will
 result in its addition to the canvas on the next render pass.

 The layer is string of space-separated CSS classes uniquely
 identifying the layer containing this text.
 X and Y represents the X and Y coordinate at which to draw the text.
 and text is the string to draw


- removeText (layer, x, y, text, font, angle)

  The function removes one or more text strings from the canvas text overlay.
  If no parameters are given, all text within the layer is removed.

  Note that the text is not immediately removed; it is simply marked as
  inactive, which will result in its removal on the next render pass.
  This avoids the performance penalty for 'clear and redraw' behavior,
  where we potentially get rid of all text on a layer, but will likely
  add back most or all of it later, as when redrawing axes, for example.

  The layer is a string of space-separated CSS classes uniquely
  identifying the layer containing this text. The following parameter are
  X and Y coordinate of the text.
  Text is the string to remove, while the font is either a string of space-separated CSS
  classes or a font-spec object, defining the text's font and style.
 

- clearCache()

 Clears the cache used to speed up the text size measurements.
 As an (unfortunate) side effect all text within the text Layer is removed.
 Use this function before plot.setupGrid() and plot.draw() if the plot just
 became visible or the styles changed.
