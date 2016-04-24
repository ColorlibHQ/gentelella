# Changlog

## Version 2.1.5 - Feb 28, 2014
* Fixed build error for minified vanilla version

## Version 2.1.4 - Feb 1, 2014
* Various updates and pull requests

## Version 2.1.3 - Dec 1, 2013
* Allow negative percent values with a reversed pie chart

## Version 2.1.2 - Dec 1, 2013
* Allow override of default options with data attributes in JQuery plugin

## Version 2.1.1 - Nov 19, 2013
* Fixed AMD support for jQuery version

## Version 2.1.0 - Oct 28, 2013
* Added UMD (Universal Module Definition) wrapper for AMD and requireJS support
* Angular module: Move options into single attribute and provide it as JSON
* Allow decimal numbers for percent values

## Version 2.0.5 – Oct 12, 2013
* (Angular) Fixed timer bug

## Version 2.0.4 - Oct 10, 2013
* Use the internal timing function of angular
* Added the ability to create two instances of the chart on one main scope
* Removed unnecessary stuff from the angular example to provide the minimal setup
* Added more conventional way to create controller in angular

## Version 2.0.3 - Sep 29, 2013
* Fixed render bug on retina displays
* Auto detect and load renderer (in preparation of a svg renderer)

## Version 2.0.2 - Sep 26, 2013
* Improved render performance by approx. 300%

## Version 2.0.1 - Sep 22, 2013
* Support for Internet Explorer 7 and 8 with excanvas

## Version 2.0.0 - Sep 22, 2013
* Added vanilla JS version
* Added angular directive
* Dropped coffeescript version
* Dropped support for delayed animations
* Moved canvas render methods in own module

## Version 1.2.5 - Aug 05, 2013
* Added default option value for delay

## Version 1.2.4 - Aug 05, 2013
* bug fix for incomplete animations
* support for delayed animations

## Version 1.2.3 - Jul 17, 2013
* Date.now fix for IE < IE9

## Version 1.2.2 - Jul 15, 2013
* Add `currentValue` and `to` to the onStop callback

## Version 1.2.1 - Jun 19, 2013
* Allow overriding of options with HTML data attributes where provided

## Version 1.2.0 - Jun 19, 2013
* Added `rotate` option to rotate the complete chart

## Version 1.1.0 - Jun 10, 2013
* Added missing `onStop` method
* cast `percent` to float to avoid breaking chart if a string is passed to the update method

## Version 1.0.2 - Jun 07, 2013
* Use requestAnimationFrame for smooth animations
* Added `onStep` option to get the current value during animations

## Version 1.0.1 - Feb 07, 2013
* Added retina support

## Version 1.0.0 - Aug 02, 2012
* Initial version
