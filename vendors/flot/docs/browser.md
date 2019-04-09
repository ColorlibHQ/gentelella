## jquery.flot.browser.js

This plugin is used to make available some browser-related utility functions.

### Methods


- getPageXY(e)

 Calculates the pageX and pageY using the screenX, screenY properties of the event
 and the scrolling of the page. This is needed because the pageX and pageY
 properties of the event are not correct while running tests in Edge. 

- getPixelRatio(context)

 This function returns the current pixel ratio defined by the product of desktop
 zoom and page zoom.
 Additional info: https://www.html5rocks.com/en/tutorials/canvas/hidpi/


- isSafari, isMobileSafari, isOpera, isFirefox, isIE, isEdge, isChrome, isBlink

 This is a collection of functions, used to check if the code is running in a
 particular browser or Javascript engine.
