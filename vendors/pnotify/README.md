[![Stories in Ready](https://badge.waffle.io/sciactive/pnotify.png?label=ready&title=Ready)](http://waffle.io/sciactive/pnotify) [![Stories in Progress](https://badge.waffle.io/sciactive/pnotify.png?label=in progress&title=In Progress)](http://waffle.io/sciactive/pnotify)

PNotify is a JavaScript notification plugin, developed by SciActive. PNotify can also provide [desktop notifications](http://sciactive.com/pnotify/#web-notifications) based on the [Web Notifications spec](http://www.w3.org/TR/notifications/). If desktop notifications are not available or not allowed, PNotify will fall back to displaying the notice as a regular, in-browser notice.

Demos
=====

http://sciactive.com/pnotify/

Requirements
============

jQuery (1.6 or higher)

Getting Started
===============

You can include PNotify using Bower, NPM, or a custom download.

PNotify custom download comes with the following files:

* `pnotify.custom.js` & `pnotify.custom.min.js` (Minified)
* `pnotify.custom.css` & `pnotify.custom.min.css` (Minified)

So here's how you'd include them on your page:

```html
<script type="text/javascript" src="pnotify.custom.min.js"></script>
<link href="pnotify.custom.min.css" media="all" rel="stylesheet" type="text/css" />
```

Now you can use PNotify like this:

```html
<script type="text/javascript">
    $(function(){
        new PNotify({
            title: 'Regular Notice',
            text: 'Check me out! I\'m a notice.'
        });
    });
</script>
```

If you are not using any UI library, you can use the included styling, called Bright Theme. It is the default.

If you are using Bootstrap version 2, include this line somewhere before your first notice:

```js
PNotify.prototype.options.styling = "bootstrap2";
```

If you are using Bootstrap version 3, include this line somewhere before your first notice:

```js
PNotify.prototype.options.styling = "bootstrap3";
```

If you are using jQuery UI, include this line somewhere before your first notice:

```js
PNotify.prototype.options.styling = "jqueryui";
```

If you are using Bootstrap 3 with Font Awesome, include this line somewhere before your first notice:

```js
PNotify.prototype.options.styling = "fontawesome";
```

Stacks
======

A stack is an object which PNotify uses to determine where to position notices. A stack has two mandatory properties, `dir1` and `dir2`. `dir1` is the first direction in which the notices are stacked. When the notices run out of room in the window, they will move over in the direction specified by `dir2`. The directions can be `"up"`, `"down"`, `"right"`, or `"left"`. Stacks are independent of each other, so a stack doesn't know and doesn't care if it overlaps (and blocks) another stack. The default stack, which can be changed like any other default, goes down, then left. Stack objects are used and manipulated by PNotify, and therefore, should be a variable when passed. So, calling something like `new PNotify({stack: {"dir1": "down", "dir2": "left"}});` will **NOT** work. It will create a notice, but that notice will be in its own stack and may overlap other notices.

Modal Stacks
------------

You can set a stack as modal by setting the "modal" property to true. A modal stack creates an overlay behind it when any of its notices are open. When the last notice within it is removed, the overlay is hidden. If the "overlay_close" property is set to true, then clicking the overlay will cause all of the notices in that stack to be removed.

Example Stacks
--------------

```js
var stack_topleft = {"dir1": "down", "dir2": "right", "push": "top"};
var stack_bottomleft = {"dir1": "right", "dir2": "up", "push": "top"};
var stack_modal = {"dir1": "down", "dir2": "right", "push": "top", "modal": true, "overlay_close": true};
var stack_bar_top = {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0};
var stack_bar_bottom = {"dir1": "up", "dir2": "right", "spacing1": 0, "spacing2": 0};
var stack_context = {"dir1": "down", "dir2": "left", "context": $("#stack-context")};
```

This stack is initially positioned through code instead of CSS.

```js
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
```

This is done through two extra variables. `firstpos1` and `firstpos2` are pixel values, relative to a viewport edge. `dir1` and `dir2`, respectively, determine which edge. It is calculated as follows:

* `dir = "up"` - firstpos is relative to the bottom of viewport.
* `dir = "down"` - firstpos is relative to the top of viewport.
* `dir = "right"` - firstpos is relative to the left of viewport.
* `dir = "left"` - firstpos is relative to the right of viewport.

To create a stack in the top left, define the stack:

```js
var stack_topleft = {"dir1": "down", "dir2": "right"};
```

and then add two options to your pnotify call:

```
addclass: "stack-topleft", // This is one of the included default classes.
stack: stack_topleft
```

There are several CSS classes included which will position your notices for you:

* `stack-topleft`
* `stack-bottomleft`
* `stack-bottomright`
* `stack-modal`

You can create your own custom position and movement by defining a custom stack.

Configuration Defaults / Options
================================

* `title: false` - The notice's title.
* `title_escape: false` - Whether to escape the content of the title. (Not allow HTML.)
* `text: false` - The notice's text.
* `text_escape: false` - Whether to escape the content of the text. (Not allow HTML.)
* `styling: "brighttheme"` - What styling classes to use. (Can be either "brighttheme", "jqueryui", "bootstrap2", "bootstrap3", "fontawesome", or a custom style object. See the source in the end of pnotify.js for the properties in a style object.)
* `addclass: ""` - Additional classes to be added to the notice. (For custom styling.)
* `cornerclass: ""` - Class to be added to the notice for corner styling.
* `auto_display: true` - Display the notice when it is created. Turn this off to add notifications to the history without displaying them.
* `width: "300px"` - Width of the notice.
* `min_height: "16px"` - Minimum height of the notice. It will expand to fit content.
* `type: "notice"` - Type of the notice. "notice", "info", "success", or "error".
* `icon: true` - Set icon to true to use the default icon for the selected style/type, false for no icon, or a string for your own icon class.
* `animation: "fade"` - The animation to use when displaying and hiding the notice. "none", "show", "fade", and "slide" are built in to jQuery. Others require jQuery UI. Use an object with effect_in and effect_out to use different effects.
* `animate_speed: "slow"` - Speed at which the notice animates in and out. "slow", "def" or "normal", "fast" or number of milliseconds.
* `position_animate_speed: 500` - Specify a specific duration of position animation.
* `opacity: 1` - Opacity of the notice.
* `shadow: true` - Display a drop shadow.
* `hide: true` - After a delay, remove the notice.
* `delay: 8000` - Delay in milliseconds before the notice is removed.
* `mouse_reset: true` - Reset the hide timer if the mouse moves over the notice.
* `remove: true` - Remove the notice's elements from the DOM after it is removed.
* `insert_brs: true` - Change new lines to br tags.
* `stack: {"dir1": "down", "dir2": "left", "push": "bottom", "spacing1": 25, "spacing2": 25, "context": $("body"), "modal": false}` - The stack on which the notices will be placed. Also controls the direction the notices stack.

Desktop Module
--------------

`desktop: {`
* `desktop: false` - Display the notification as a desktop notification.
* `fallback: true` - If desktop notifications are not supported or allowed, fall back to a regular notice.
* `icon: null` - The URL of the icon to display. If false, no icon will show. If null, a default icon will show.
* `tag: null` - Using a tag lets you update an existing notice, or keep from duplicating notices between tabs. If you leave tag null, one will be generated, facilitating the "update" function.
* `text: null` - Optionally display different text for the desktop

`}`

Buttons Module
--------------

`buttons: {`
* `closer: true` - Provide a button for the user to manually close the notice.
* `closer_hover: true` - Only show the closer button on hover.
* `sticker: true` - Provide a button for the user to manually stick the notice.
* `sticker_hover: true` - Only show the sticker button on hover.
* `show_on_nonblock: false` - Show the buttons even when the nonblock module is in use.
* `labels: {close: "Close", stick: "Stick"}` - Lets you change the displayed text, facilitating internationalization.
* `classes: {closer: null, pin_up: null, pin_down: null}` - The classes to use for button icons. Leave them null to use the classes from the styling you're using.

`}`

NonBlock Module
---------------

`nonblock: {`
* `nonblock: false` - Create a non-blocking notice. It lets the user click elements underneath it.
* `nonblock_opacity: .2` - The opacity of the notice (if it's non-blocking) when the mouse is over it.

`}`

Mobile Module
-------------

`mobile: {`
* `swipe_dismiss: true` - Let the user swipe the notice away.
* `styling: true` - Styles the notice to look good on mobile.

`}`

Animate Module
--------------

`animate: {`
* `animate: false` - Use animate.css to animate the notice.
* `in_class: ""` - The class to use to animate the notice in.
* `out_class: ""` - The class to use to animate the notice out.

`}`

The Animate module also creates a method, `attention`, on notices which accepts an attention grabber class from Animate.css and callback to be called on completion of the animation.

Confirm Module
--------------

`confirm: {`
* `confirm: false` - Make a confirmation box.
* `prompt: false` - Make a prompt.
* `prompt_class: ""` - Classes to add to the input element of the prompt.
* `prompt_default: ""` - The default value of the prompt.
* `prompt_multi_line: false` - Whether the prompt should accept multiple lines of text.
* `align: "right"` - Where to align the buttons. (right, center, left, justify)
* `buttons: [{text: "Ok", addClass: "", promptTrigger: true, click: function(notice, value){ notice.remove(); notice.get().trigger("pnotify.confirm", [notice, value]); }},{text: "Cancel", addClass: "", click: function(notice){ notice.remove(); notice.get().trigger("pnotify.cancel", notice); }}]` - The buttons to display, and their callbacks. If a button has promptTrigger set to true, it will be triggered when the user hits enter in a single line prompt. If you want only one button, use null as the second entry of your array to remove the cancel button.

`}`

History Module
--------------

`history: {`
* `history: true` - Place the notice in the history.
* `menu: false` - Display a pull down menu to redisplay previous notices.
* `fixed: true` - Make the pull down menu fixed to the top of the viewport.
* `maxonscreen: Infinity` - Maximum number of notifications to have onscreen.
* `labels: {redisplay: "Redisplay", all: "All", last: "Last"}` - Lets you change the displayed text, facilitating internationalization.

`}`

Reference Module
--------------

`reference: {`
* `putThing: false` - Provide a thing for stuff. Turned off by default.
* `labels: {text: "Spin Around"}` - If you are displaying any text, you should use a labels options to support internationalization.

`}`

Callbacks Module
================

The callback options all expect one argument, a function, which will be called when that event occurs. They can be included in the options object passed to PNotify() just like the core options. If the function returns false on the "before_open" or "before_close" callback, that event will be canceled.

* `before_init` - This option is called before the notice has been initialized. It accepts one argument, the options object.
* `after_init` - This option is called after the notice has been initialized. It accepts one argument, the notice object.
* `before_open` - This option is called before the notice has been displayed. It accepts one argument, the notice object.
* `after_open` - This option is called after the notice has been displayed. It accepts one argument, the notice object.
* `before_close` - This option is called before the notice closes. It accepts one argument, the notice object.
* `after_close` - This option is called after the notice closes. It accepts one argument, the notice object.

Utility Functions
=================

* `PNotify.reload(root)` - Reinitialize PNotify. PNotify, in a browser, is initialized with window as the root. Returns the created PNotify object.
* `PNotify.removeAll()` - Remove all notices.
* `PNotify.removeStack(stack)` - Remove all the notices in a stack.
* `PNotify.positionAll(animate)` - Reposition the notices, optionally animating their movement.
* `notice.open()` - Open the notice.
* `notice.remove()` - Remove the notice.
* `notice.get()` - Get the notice's DOM element.

Using PNotify with RequireJS
============================

When they detect AMD/RequireJS, PNotify core defines the named module "pnotify", and PNotify's modules each define names like "pnotify.module". The following example shows the use of the nonblock and desktop modules with RequireJS.

```js
requirejs(['pnotify', 'pnotify.nonblock', 'pnotify.desktop'], function(PNotify){
    PNotify.desktop.permission();
    new PNotify({
        title: 'Desktop Notice',
        text: 'If you\'ve given me permission, I\'ll appear as a desktop notification. If you haven\'t, I\'ll still appear as a regular PNotify notice.',
        desktop: {
            desktop: true
        },
        nonblock: {
            nonblock: true
        }
    });
});
```

Licensing and Additional Info
=============================

PNotify is distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

See http://sciactive.com/pnotify/ for download, more information, and examples.
