bootstrap-wysiwyg
=================
[![GitHub release](https://img.shields.io/github/release/qubyte/rubidium.svg)](https://github.com/steveathon/bootstrap-wysiwyg)
[![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/steveathon/bootstrap-wysiwyg)

A tiny Bootstrap and jQuery based WYSIWYG rich text editor based on the browser function execCommand.

This project was originally built for [MindMup](http://www.mindmup.com) and has now been adapted and modified to suit a wide range of projects.

Development is active, and ongoing.

Features
-----------

* Automatically binds standard hotkeys for common operations on Mac and Windows
* Allows a custom built toolbar with no magic markup generators enabling the web site to use all the goodness of Bootstrap
* Does not force any styling - it's all up to you
* Uses standard browser features, no magic non-standard code, toolbar and keyboard configurable to execute any supported [browser command](https://developer.mozilla.org/en/docs/Rich-Text_Editing_in_Mozilla
)
* Does not create a separate frame, backup text areas etc - instead keeps it simple and runs everything inline in a DIV
* (Optionally) cleans up trailing whitespace and empty divs and spans
* Requires a modern browser (See SUPPORTED)
* Supports mobile devices (See SUPPORTED)
* Supports multiple instances
* HTML Sanitization
* Drag and drop files to insert images
* Supports image upload
* Supports image capture on mobile devices
* Events

Basic Usage
-----------

```javascript
$('#editor').wysiwyg();
```

Don't forget to style your editor div:

```css
#editor {overflow:scroll; max-height:300px}
```

If you want to use this for a mobile web site, make sure to read about [how to style it](https://github.com/mindmup/bootstrap-wysiwyg#styling-for-mobile-devices) to optimise mobile screen usage and experience (please note that this demo page isn't optimised for mobile access).

Optionally, also create a toolbar (see the source of this page for an example):

```html
<div class="btn-toolbar" data-role="editor-toolbar"
        data-target="#editor">
  ...
</div> 
```

In the toolbar, execute simple commands by adding a data-edit attribute to a link.

```html
<a data-edit="bold">...</a>
```

execute more complex commands by adding an argument after a blank or providing an input with a data-edit command (the input value is used as an argument). In case of file inputs, the file contents are read in using the FileReader API and used as the command value.

```html
<a data-edit="fontName Arial">...</a>
...
<input type="text" data-edit="createLink"/>
...
<input type="file" data-edit="insertImage" />
```

Use standard jQuery methods to access and set content and focus. You can also ask for cleaned up HTML content:

```javascript
$('#editor').cleanHtml()
```

Customising
-----------
You can assign commands to hotkeys and toolbar links. For a toolbar link, just put the execCommand command name into a data-edit attribute.
For more info on execCommand, see the [QuirksMode](http://www.quirksmode.org/dom/execCommand.html) and [Mozilla Developer](https://developer.mozilla.org/en/docs/Rich-Text_Editing_in_Mozilla) documentation.

```html
<div class="btn-toolbar" data-role="editor-toolbar" data-target="#editor">
  <a class="btn btn-large" data-edit="bold"><i class="icon-bold"></i></a>
</div>
```

To pass arguments to a command, separate a command with a space.

```html
  <a data-edit="fontName Arial">...</a>
```

You can also use input type='text' with a data-edit attribute. When the value
is changed, the command from the data-edit attribute will be applied using the
input value as the command argument

```html
<input type="text" data-edit="createLink">
```
If the input type is file, when a file is selected the contents will be read in using the FileReader API and the data URL will be used as the argument

```html
<input type="file" data-edit="insertImage">
```

To change hotkeys, specify the map of hotkeys to commands in the hotKeys option. For example:

```javascript
$('#editor').wysiwyg({
  hotKeys: {
    'ctrl+b meta+b': 'bold',
    'ctrl+i meta+i': 'italic',
    'ctrl+u meta+u': 'underline',
    'ctrl+z meta+z': 'undo',
    'ctrl+y meta+y meta+shift+z': 'redo'
  }
});
```

Events
------

#### Change
Fired whenever anything changes. See this example [events.html](examples/events.html)
```javascript
$('#editor').wysiwyg().on('change', function(){
	alert('something has been changed on the editor');
});
```

Styling for mobile devices
--------------------------

This editor should work pretty well with mobile devices, but you'll need to consider the following things when styling it:
- keyboards on mobile devices take a huge part of the screen
- having to scroll the screen to touch the toolbar can cause the editing component to lose focus, and the mobile device keyboard might go away
- mobile devices tend to move the screen viewport around to ensure that the focused element is shown, so it's best that the edit box is glued to the top

For the content attachment editor on MindMup, we apply the following rules to mobile device styling:
- edit box is glued to the top, so the focus doesn't jump around
- toolbar is below the edit box
- on portrait screens, edit box size is 50% of the screen
- on landscape screens, edit box size is 30% of the screen
- as the screen gets smaller, non-critical toolbar buttons get hidden into a "other" menu

Dependencies
------------
* [jQuery](http://jquery.com/)
* [jQuery HotKeys](https://github.com/jeresig/jquery.hotkeys)
* [Bootstrap](http://twitter.github.com/bootstrap/)

Thanks to
------------
@gojko 					@mindmup			@jordanh
@beatnbite				@brutuscat			@VictorBjelkholm
@mrmrs 					@tilleryd 			@pnevels

History
------------

The original version of this code (below) appeared to be no longer maintained. There
were a number of outstanding changes which needed to be merged in and a few which
included performance and feature improvements. These have now been included in this
master branch.

I'll keep an eye out for future changes/improvements and pull them in as required.

- Steve

Original Licence
------------

The original version of this tool can be found here:
[bootstrap-wysiwyg](https://github.com/mindmup/bootstrap-wysiwyg)

The MIT License

Copyright (c) 2013 Damjan Vujnovic, David de Florinier, Gojko Adzic

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
