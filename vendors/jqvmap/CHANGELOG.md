![JQVMap](http://jqvmap.com/img/logo.png "JQVMap")

Change Log
======

Version 1.5.1
---

`Released on May 17th, 2016`

1. Added a minified css file

2. Removed Post Install Script

3. Updated README.md

4. Added Turkey Map and Example File

5. Moved Github files into `.github` folder

Version 1.5.0
---

`Released on March 15th, 2016`

1. Updated LICENSE path in packaged dist files

2. Fixed bugs in labels and pins where mouse events were not passing through to clickable region

3. Removed -merc suffix from map files created by map creator ( fixes #204 )

4. Added new example for custom placement of pins `./examples/pins_custom.html`

5. Fixed `onRegionSelect` issue not returning region ( fixes #201 )

6. Added better support to make regions disabled ( see #197 and new `./examples/inactive_regions.html` )

Version 1.4.0
---

`Released on December 6th, 2015`

1. Added Touch Support for Mobile Devices

2. Added `showLabels` config option to place ISO codes by default

3. Added `onResize` event handler and fixed resize event binding issues

4. Fixed issue when dragging a map and releasing outside map

5. Added `onLoad` event handler

6. Updated `README.md` & `CONTRIBUTING.md` files

Version 1.3.1
---

`Released on December 5th, 2015`

1. Fixes issue with scaleColors not working.

Version 1.3.0
---

`Released on December 4th, 2015`

__IMPORTANT:__ This is a backwards breaking change.  You will need to use the new map files with this version of JQVMap.  Our focus was to make any file you create here compatible with the other vector map libraries as well as allow theirs to work with ours.  Everybody wins ... except our old map files.

1. Added `./create` folder for users wishing to create custom maps. Folder has detailed writeup on how to create your own maps.

2. Added Unit Tests to `./tests` folder and added them as part of of the `npm test` suite and build process. These tests can also be run in the browser.

3. Renamed `WorldMap` to `JQVMap` as "WorldMap" did not really make sense as a variable name

4. Removed case sensitivity for reference regions by code.

5. Fixed incorrect license header in distributed files

6. Updated `README.md` & `CONTRIBUTING.md` files

Version 1.2.0
---

`Released on November 18th, 2015`

1. Switched to using Grunt to build source code. JS files in `./dist` are now generated from `./src` folder.

2. Moved source files to `./src` folder

3. Renamed `./samples` to `./examples`

4. Renamed `./jqvmap` to `./dist`

5. Removed `./website` folder as it is not really needed in this project

6. Updated `README.md` & `CONTRIBUTING.md` files

Version 1.1.0
---

`Released on October 17th, 2015`

1. Added new maps for Russia, France, Germany, Algeria, Iraq, Iran & Brazil

2. Fixed `regionClickEvent` bug

3. Added event handling for deselecting a region

4. Added Touch Event code example

5. Added sample HTML pages for each map.

Version 1.0.0
---

`Released on May 6th, 2012`

Initial Release
