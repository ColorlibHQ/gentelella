# Changelog


## 2.3.1 (May 28, 2016)

- Improved the rotate and scale transform behaviour (#633, idea by afeibus).
- Improved the `getCroppedCanvas` method to return the whole canvas if it is not cropped (#666, PR by @vinnymac).
- Check cross origin setting when load image by XMLHTTPRequest (#669)


## 2.3.0 (Feb 22, 2016)

- Added a new parameter to the `replace` method for applying filters.
- Improved the image initializing for Safari (#120, #509).
- Fixed incorrect size limitation of the crop box.
- Fixed incorrect cropped canvas when scaleX or scaleY great than 1 (#598).


## 2.2.5 (Jan 18, 2016)

- Fixed crossOriginUrl undefined error when exists the `crossOrigin` property.


## 2.2.4 (Jan 1, 2016)

- Fixed a dimension bug in the "getCroppedCanvas" method.
- Added an example for cropping round image.


## 2.2.3 (Dec 28, 2015)

- Supports to zoom from event triggering point.


## 2.2.2 (Dec 24, 2015)

- Limit wheel speed to prevent zoom too fast
- Improve the `setCropBoxData` method


## 2.2.1 (Dec 12, 2015)

- Handle Data URL (Fixed #540: avoid to use XMLHttpRequest to open a Data URL)
- Handle ajax error when load ArrayBuffer
- Not to transform the image to base64 when Orientation equals to `1`


## 2.2.0 (Dec 6, 2015)

- Added a new option: `checkOrientation` (#120, #509)
- Added a timestamp to the url of preview image (#531)


## 2.1.0 (Dec 2, 2015)

- Added new `restore` option


## 2.0.2 (Nov 30, 2015)

- Fixed #476: Floor the numerical parameters for `CanvasRenderingContext2D.drawImage`


## 2.0.1 (Nov 18, 2015)

- Improved new crop box creating


## 2.0.0 (Nov 11, 2015)

### Common

- Supports four modes
- Supports three drag modes
- Improved the experience of cropping
- Makes the crop box's borders and handlers visible when overflow
- Fixed an issue of canvas limitation
- Fixed an issue of cropping


### Options

- Added `viewMode`
- Added `dragMode`
- Renamed `touchDragZoom` to `zoomOnTouch`
- Renamed `mouseWheelZoom` to `zoomOnWheel`
- Renamed `doubleClickToggle` to `toggleDragModeOnDblclick`
- Renamed `checkImageOrigin` to `checkCrossOrigin`
- Removed `strict` (supported by `viewMode: 1`)
- Removed `dragCrop` (supported by `dragMode: 'crop'`)


### Methods

- Added `moveTo`
- Added `zoomTo`
- Added `rotateTo`
- Added `scaleX`
- Added `scaleY`
- Improved `getCanvasData` (added `naturalWidth` and `naturalHeight`)


### Events

- Improved `zoom` (changed `event.ratio` and added `event.oldRatio`)


## 1.0.0 (Oct 10, 2015)

- Improved canvas limitation
- Improved preview
- Improved test
- Fixed an error in the `clear` method (missed parameters)
- Fixed the issue of crop box limitation (#430)


## 1.0.0-rc.1 (Sep 5, 2015)

- Moved from Less to Sass
- Fixed the issue of `destroy` method (#434)
- Fixed the issue on IE8 (#319)
- Added an example for customizing preview
- Added download button to documentation
- Added FAQ


## 0.11.1 (Aug 22, 2015)

- Optimize "built" and "crop" events
- Improve the starting speed (#422)
- Improve the building process (#428)
- Fix event issue on IE8 (#319)


## 0.11.0 (Aug 10, 2015)

- Improve `setCropBoxData` method (#385)
- Fix event issue on IE10 (#394)
- Optimize code (use `var` for per variable)


### Options

- Add "scalable" option
- Add "wheelZoomRatio" option
- Convert "crop" option to "crop" event


### Methods

- Add "scale" method
- Improve "move" method (the `offsetY` parameter is optional now)


### Events

- Rename "dragstart" to "cropstart"
- Rename "dragmove" to "cropmove"
- Rename "dragend" to "cropend"
- Merge "zoomin" and "zoomout" to "zoom"
- Merge "crop" option and "change" event to "crop" event


## 0.10.1 (Jul 5, 2015)

- Add Pointer Events support (#328)
- Add RTL support (#342)
- Add one new option: "center" (#367)
- Allow cropper to grow vertically (#350)


## 0.10.0 (Jun 8, 2015)

- Add three new options: "change", "cropBoxMovable", "doubleClickToggle"
- Change "movable" option (only for image)
- Rename "resizable" to "cropBoxResizable"
- Add one new event: "change.cropper"
- Locking aspect ratio in "free mode" by holding shift key (#259)
- Sync drag mode to crop box when it is not movable (#300)


## 0.9.3 (May 10, 2015)

- Add one new option: "data"
- Add two new methods: "setData" (#290, #296), "crop" (#275)
- Fix incorrect minWidth/Height size of canvas (#295)
- Fix the strict mode bug (#280)
- Fix the crop box resizing bug (#277)


## 0.9.2 (Apr 18, 2015)

- Improve strict mode to show full image
- Add two new options: "minCanvasWidth" and "minCanvasHeight"
- Reverse mouse wheeling zoom
- Fix incorrect cursor in disabled state


## 0.9.1 (Mar 21, 2015)

- Fix the touch zoom issue (#206)
- Fix the reset issue (#246)


## 0.9.0 (Mar 15, 2015)

- Wraps image with a virtual canvas (for zooming and rotating).
- Limits image position and size in strict mode.
- Supports multiple global croppers by default.
- Outputs cropped canvas for display or get Data URL or get Blob
- Identifies drag events with "event.dragType" property
- Added zoom events for controlling the canvas (image) size.
- Improved responsiveness for window resizing.


### Options:

- Change "minContainerWidth" (default value: 300 -> 200)
- Change "minContainerHeight" (default value: 150 -> 100)
- Add "strict"
- Add "zoomin"
- Add "zoomout"
- remove "global"


### Methods:

- Change "replace" (not to change the original image any more)
- Change "getImageData" (move rotation-related properties to canvas data)
- Add "getContainerData"
- Add "getCanvasData"
- Add "setCanvasData"
- Add "getCroppedCanvas"
- Remove "setImageData" (replace with "getCanvasData")
- Remove "getDataURL" (replace with "getCroppedCanvas")


### Events:

- Add "event.dragType" property to drag events
- Add "zoomin.cropper"
- Add "zoomout.cropper"


## 0.8.0 (Feb 19, 2015)

- Refactored source code.
- Compiles CSS with [Less](http://lesscss.org) CSS preprocessors.
- Supports fixed container.
- Supports rotation with CSS3 2D Transforms.


### Options:

- Change the default value of "aspectRatio"
- Rename "done" to "crop"
- Rename "dashed" to "guides"
- Rename "multiple" to "global"
- Add "background"
- Add "highlight"
- Add "responsive"
- Add "mouseWheelZoom"
- Add "touchDragZoom"
- Add "minCropBoxWidth"
- Add "minCropBoxHeight"
- Add "minContainerWidth"
- Add "minContainerHeight"
- Remove "data"
- Remove "minWidth"
- Remove "minHeight"
- Remove "maxWidth"
- Remove "maxHeight"


### Methods:

- Change "reset"
- Add "setImageData"
- Add "getCropBoxData"
- Add "setCropBoxData"
- Add "move"
- Remove "setData"


## 0.7.9 (Feb 19, 2015)

- Improve preview.
- Improve rotation.
- Improve responsiveness (#157).
- Enable to move the image when the size of the crop box is the same as the container's (#186).


## 0.7.8 (Feb 8, 2015)

- Add two new options: "minContainerWidth" and "minContainerHeight".
- Improve three methods: "setAspectRatio", "destroy" and "disable".
- Improve mouse wheel zoom.
- Improve drag resizing.


## 0.7.7 (Jan 10, 2015)

- Fix a bug of "dragCrop" option.
- Add a timestamp to the url to bust cache when it's a cross-origin image (#148).
- Fix the issue of "autoCropArea" option (#144).


## 0.7.6 (Dec 20, 2014)

- Fix events binding bugs.
- Change the "done" option and the "getData" method (returns floating-point number) (#130).
- Fix the rotation issue after replace the image (#139).


## 0.7.5 (Nov 27, 2014)

- Reset the ratio when replace the image.
- Add a new option: "checkImageOrigin" (#119).
- Prevent to call the "done" option when it's disabled (#107).
- Improve the preview (#95).


## 0.7.4 (Nov 24, 2014)

- Improve "getDataURL" method, enable to customize the image sizes (#105).
- Fix the issue of destory (#101).
- Fix the issue of canvas (#106).


## 0.7.3 (Nov 15, 2014)

- Supports cross-origin image (#96, #97).
- Add a new option: "autoCropArea".
- Improve "movable" option.
- Output rotation degree by "getImageData" method (#94).


## 0.7.2 (Nov 11, 2014)

- Fix the image rotation error in Firefox (#92).


## 0.7.1 (Nov 8, 2014)

- Rebuild "rotate" method (#88).
- Fix the issue of free ratio (#87).
- Improve "getDataURL" method (#86).
- Optimize event listeners.


## 0.7.0 (Oct 12, 2014)

- Supports zoom (#36, #79).
- Supports rotation (#1, #81).
- Add two new options: "zoomable" and "rotatable".
- Add six new methods: "enable", "disable", "zoom", "rotate", "getDataURL" (#80) and "setDragMode".
- Rename "release" method to "clear".
- Rename "setImgSrc" method to "replace".
- Rename "getImgInfo" method to "getImageData".
- Some other improvements.


## 0.6.2 (Oct 11, 2014)

- Hide the modal when release the crop box.
- Improve touch events.


## 0.6.1 (Oct 3, 2014)

- Fix an event error.


## 0.6.0 (Sep 20, 2014)

- Add six new options: "dashed", "build", "built", "dragstart", "dragmove" and "dragend".
- Add three new events: "dragstart.cropper", "dragmove.cropper" and "dragend.cropper".
- Remove an old event: "render.cropper".
- Supports to toggle the dashed lines by "dashed" option (#68).
- Fix the issue of events (#71).
- Optimize the source code.


## 0.5.5 (Sep 8, 2014)

- Improve the render when the mouse out of the cropper container (#54).


## 0.5.4 (Aug 30, 2014)

- Fix typos: replace "resizeable" with "resizable" and "moveable" with "movable".


## 0.5.3 (Aug 23, 2014)

- Fix the issue (#64) that the crop box could not move after multiple touches.


## 0.5.2 (Aug 16, 2014)

- Fix a bug of type checking in the options.
- Compress the cropper template string.


## 0.5.1 (Aug 12, 2014)

- Supports canvas (#55).


## 0.5.0 (Aug 10, 2014)

- Add a new option: "multiple".


...


## 0.4.0 (Jul 26, 2014)

- Add eight new options: "autoCrop", "dragCrop", "moveable", "resizeable", "maxWidth", "maxHeight", "minWidth" and "minHeight".
- Add three new methods: "reset", "release" and "destroy".
- Add three new events: "build.cropper", "built.cropper" and "render.cropper".
- Remove two old methods: "enable" and "disable".
- Remove three old events: "dragstart", "dragmove" and "dragend".
- Supports no conflict with the "$.fn.cropper.noConflict" method.


...


## 0.3.0 (May 18, 2014)

- Supports touch.
- Supports events.
- Add three events: "dargstart", "dargmove" and "dargend".
- Add a new method: "setImgSrc".


...


## 0.2.0 (Apr 23, 2014)

- Supports free ratio.
- Add a new option: "data".
- Add four new methods: "getData", "setData", "getImgInfo" and "setAspectRatio".


...


## 0.1.0 (Feb 19, 2014)

- Supports four options: "aspectRatio", "done", "modal" and "preview".
- Supports two methods: "enable" and "disable".
