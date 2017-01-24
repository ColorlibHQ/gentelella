---
title: "How to write a file / give it to the user"
layout: default
section: example
---

### In the browser

With only javascript, this part won't work in old browsers, including IE < 10.
For those browsers, you can use a flash polyfill, see below.

You can also see this
[example]({{site.baseurl}}/documentation/examples/download-zip-file.html).

#### Blob URL / FileSaver

With recent browsers, the easiest way is to use `saveAs` or a polyfill, see
[FileSaver.js](https://github.com/eligrey/FileSaver.js) :

```js
var blob = zip.generate({type:"blob"});
saveAs(blob, "hello.zip");
```

Under the hood, the polyfill uses the native `saveAs` from the
[FileSaver](http://www.w3.org/TR/file-writer-api/#the-filesaver-interface) API
(on Chrome and IE10+) or use a [Blob URL](http://updates.html5rocks.com/2011/08/Downloading-resources-in-HTML5-a-download)
(on Firefox).


#### Data URI

For older browsers that support [data URI](http://caniuse.com/datauri), you can also
do the following :

```js
location.href="data:application/zip;base64," + zip.generate({type:"base64"});
```

The biggest issue here is that the filenames are very awkward, Firefox
generates filenames such as `a5sZQRsx.zip.part` (see bugs
[367231](https://bugzilla.mozilla.org/show_bug.cgi?id=367231) and
[532230](https://bugzilla.mozilla.org/show_bug.cgi?id=532230), and Safari
isn't much better with just `Unknown`.

Browser support and resulting filename :

Opera  | Firefox | Safari | Chrome | Internet Explorer
-------|---------|--------|--------|------------------
"default.zip" | random alphanumeric with ".part" extension | "Unknown" (no extension) | "download.zip" on OSX and Linux, just "download" on Windows | No

#### Downloadify

[Downloadify](https://github.com/dcneiner/downloadify) uses a small Flash SWF
to download files to a user's computer with a filename that you can choose.
Doug Neiner has added the `dataType` option to allow you to pass a zip for
downloading. Follow the [Downloadify demo](http://pixelgraphics.us/downloadify/test.html)
with the following changes:

```js
zip = new JSZip();
zip.file("Hello.", "hello.txt");
Downloadify.create('downloadify',{
...
  data: function(){
    return zip.generate({type:"base64"});
  },
...
  dataType: 'base64'
});
```

<!--
TODO : send data as GET / POST ?
-->

#### Deprecated google gears

[Franz Buchinger](http://www.picurl.org/blog/author/franz/) has written a
brilliant tutorial on [using JSZip with Google Gears](http://www.picurl.org/blog/2009/11/22/creating-zip-archives-with-gears)
([part 2](http://www.picurl.org/blog/2009/11/29/gearszipper-part2-adding-support-for-real-files-and-canvas-elements/)).
If you want to let your Gears users download several files at once I really
recommend having a look at some of his [examples](http://picurl.org/gears/zipper/).



### In nodejs

JSZip can generate Buffers so you can do the following :

```js
var fs = require("fs");
var JSZip = require("jszip");

var zip = new JSZip();
// zip.file("file", content);
// ... and other manipulations

var buffer = zip.generate({type:"nodebuffer"});

fs.writeFile("test.zip", buffer, function(err) {
  if (err) throw err;
});
```


